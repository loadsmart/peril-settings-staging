import { danger } from "danger"
import { LabelLabel } from "github-webhook-event-types/source/Label"

const mergeOnGreen = async () => {
  const api = danger.github.api

  let ref
  if (danger.github.action === "completed" && danger.github.check_suite) {
    console.info("Got check_suite.completed.")
    ref = danger.github.check_suite.head_sha
  } else if (danger.github.state === "success" && danger.github.commit) {
    console.info("Got status.success.")
    ref = danger.github.commit.sha
  } else {
    return console.info("Got neither check_suite.completed nor status.success, skipping.")
  }

  const owner = danger.github.repository.owner.login
  const repo = danger.github.repository.name

  // Check to see if all other statuses on the same commit are also green. E.g. is this the last green.
  const allGreen = await api.repos.getCombinedStatusForRef({ owner, repo, ref })
  if (allGreen.data.state !== "success") {
    return console.info("Not all statuses are green for merging.")
  }

  // See https://github.com/maintainers/early-access-feedback/issues/114 for more context on getting a PR from a SHA
  const repoString = danger.github.repository.full_name
  const searchResponse = await api.search.issuesAndPullRequests({ q: `${ref} type:pr is:open repo:${repoString}` })

  // https://developer.github.com/v3/search/#search-issues
  const prsWithCommit = searchResponse.data.items.map((i: any) => i.number) as number[]
  for (const number of prsWithCommit) {
    // Get the PR labels
    const issue = await api.issues.get({ owner, repo, number })

    // Get the PR combined status
    const mergeLabel = issue.data.labels.find((l: LabelLabel) => l.name === "merge-on-green")
    if (!mergeLabel) {
      return console.info("PR does not have merge-on-green")
    }

    // Merge the PR
    try {
      await api.pullRequests.merge({ owner, repo, number, commit_title: "Merged by Peril" })
      return console.info(`Merged Pull Request ${number}`)
    } catch (e) {
      console.error("Error merging PR:")
      console.error(e)
    }
  }
}

export default mergeOnGreen
