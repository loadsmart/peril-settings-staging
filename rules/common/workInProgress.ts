import { danger, warn } from "danger"

// Do not merge it yet. PR is still in progress.
const workInProgress = () => {
  const pr = danger.github.pr
  const wipPR = pr.title.toLowerCase().includes("wip")
  if (wipPR) {
    warn("Do not merge it yet. PR is still in progress.")
  }
}

export default workInProgress
