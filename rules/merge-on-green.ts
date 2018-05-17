import { schedule, danger, markdown } from "danger"
import { Status, PullRequest } from "github-webhook-event-types"
import { LabelLabel } from "github-webhook-event-types/source/Label"
import { error } from "util"

export default async (status: Status) => {
  const api = danger.github.api

  if (status.state !== "success") {
    return console.error(
      `Not a successful state (note that you can define state in the settings.json) - got ${status.state}`
    )
  }

  // Check to see if all other statuses on the same commit are also green. E.g. is this the last green.
  const owner = status.repository.owner.login
  const repo = status.repository.name
  const allGreen = await api.repos.getCombinedStatusForRef({ owner, repo, ref: status.commit.sha })
  if (allGreen.data.state !== "success") {
    return console.error("Not all statuses are green")
  }

  // See https://github.com/maintainers/early-access-feedback/issues/114 for more context on getting a PR from a SHA
  const repoString = status.repository.full_name
  const searchResponse = await api.search.issues({ q: `${status.commit.sha} type:pr is:open repo:${repoString}` })

  // https://developer.github.com/v3/search/#search-issues
  const prsWithCommit = searchResponse.data.items.map((i: any) => i.number) as number[]
  for (const number of prsWithCommit) {
    // Get the PR labels
    const issue = await api.issues.get({ owner, repo, number })

    // Get the PR combined status
    const mergeLabel = issue.data.labels.find((l: LabelLabel) => l.name === "merge-on-green")
    if (!mergeLabel) {
      return console.error("PR does not have merge-on-green")
    }

    // Merge the PR
    try {
      await api.pullRequests.merge({ owner, repo, number, commit_title: "Merged by Peril" })
      console.log(`Merged Pull Request ${number}`)
    } catch (e) {
      console.error("Error merging PR:")
      console.error(e)
    }

    // Delete merged branch
    try {
      console.info(`Deleting branch ${branchRef}`)
      const prResponse = await api.pullRequests.get({ owner, repo, number })
      const thisPullRequest = prResponse.data as PullRequest
      const branchRef = thisPullRequest.pull_request.head.ref
      await api.gitdata.deleteReference({ owner, repo, ref: branchRef })
      console.info(`Branch ${branchRef} deleted`)
    } catch (error) {
      console.error(`Error deleting branch ${branchRef}`)
      console.error(error)
    }
  }
}
