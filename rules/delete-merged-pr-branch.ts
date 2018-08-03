import { danger } from "danger"

// Delete branch of a merged PR
export const deleteMergedPRBranch = async () => {
  const owner = danger.github.thisPR.owner
  const repo = danger.github.thisPR.repo
  const branch = danger.github.pr.head.ref

  if (!danger.github.pr.merged) {
    console.info(`Branch ${branch} for PR #${danger.github.thisPR.number} is not merged yet.`)
    return
  }

  try {
    console.info(`Deleting merged branch ${branch}`)
    const api = danger.github.api
    await api.gitdata.deleteReference({ owner, repo, ref: `heads/${branch}` })
    console.info(`Branch ${branch} deleted`)
  } catch (error) {
    console.error(`Error deleting branch ${branch}`)
    console.error(error)
  }
}

export default deleteMergedPRBranch
