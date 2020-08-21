import { danger, fail } from "danger"

// Keep the commit tree clean by getting rid of merge commits
const mergeCommits = () => {
  const regex = RegExp(`^Merge branch '${danger.github.pr.base.ref}'`)
  const hasMergeCommits = danger.git.commits.find(c => regex.test(c.message))
  if (hasMergeCommits) {
    fail("Please rebase to get rid of the merge commits in this PR.")
  }
}

export default mergeCommits
