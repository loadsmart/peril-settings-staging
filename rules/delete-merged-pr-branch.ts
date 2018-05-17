import { danger } from "danger"
import { PullRequest } from "github-webhook-event-types"

export default async (pr: PullRequest) => {
  const api = danger.github.api
  const branchRef = pr.pull_request.head.ref
  const owner = pr.sender.login
  const repo = pr.repository.name

  try {
    console.info(`Deleting merged branch ${branchRef}`)
    await api.gitdata.deleteReference({ owner, repo, ref: branchRef })
    console.info(`Branch ${branchRef} deleted`)
  } catch (error) {
    console.error(`Error deleting branch ${branchRef}`)
    console.error(error)
  }
}
