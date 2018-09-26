import { schedule, danger, message } from "danger"

export const approveReleasePR = async () => {
  const pr = danger.github.pr

  if (pr.title.includes("[Release]")) {
    const api = danger.github.api
    const owner = pr.head.repo.owner.login
    const repo = pr.head.repo.name
    const number = pr.number
    try {
      api.pullRequests.createReview({
        owner: owner,
        repo: repo,
        number: number,
        event: "APPROVE",
      })
      api.issues.addLabels({ owner, repo, number: number, labels: ["merge-on-green"] })
      await api.pullRequests.merge({ owner, repo, number, commit_title: "Merged by Peril" })
    } catch (e) {
      console.error("Error approving/merging release PR:")
      console.error(e)
    }
  }
}

export default async () => {
  approveReleasePR()
}
