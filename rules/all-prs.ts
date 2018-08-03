import { danger, fail, warn, message } from "danger"

// Every PR requires a description
export const needsDescription = () => {
  const pr = danger.github.pr
  if (pr.body === null || pr.body.length === 0) {
    fail("Please add a description to your PR.")
  }
}

// Do not merge it yet. PR is still in progress.
export const workInProgress = () => {
  const pr = danger.github.pr
  const wipPR = pr.title.toLowerCase().includes("wip")
  if (wipPR) {
    warn("Do not merge it yet. PR is still in progress.")
  }
}

// Keep the commit tree clean by getting rid of merge commits
export const mergeCommits = () => {
  const regex = RegExp(`^Merge branch '${danger.github.pr.base.ref}'`)
  const hasMergeCommits = danger.git.commits.find(c => regex.test(c.message))
  if (hasMergeCommits) {
    fail("Please rebase to get rid of the merge commits in this PR.")
  }
}

// PRs need a changelog entry if changes are not #trivial
export const changelog = async () => {
  const pr = danger.github.pr
  const changelogs = ["CHANGELOG.md", "changelog.md", "CHANGELOG.yml"]
  const isOpen = pr.state === "open"

  const getContentParams = { path: "", owner: pr.head.user.login, repo: pr.head.repo.name }
  const rootContents: any = await danger.github.api.repos.getContent(getContentParams)

  const hasChangelog = rootContents.data.find((file: any) => changelogs.includes(file.name))

  if (isOpen && hasChangelog) {
    const files = [...danger.git.modified_files, ...danger.git.created_files]

    const hasCodeChanges = files.find(file => !file.match(/(test|spec)/i))
    const hasChangelogChanges = files.find(file => changelogs.includes(file))

    if (hasCodeChanges && !hasChangelogChanges) {
      warn("It looks like code was changed without adding anything to the Changelog.")
    }
  }
}

// Source code changes require test updates
export const testsUpdated = () => {
  const files = [...danger.git.modified_files, ...danger.git.created_files]
  const hasCodeChanges = files.find(file => !file.match(/(test|spec)/i))
  const hasTestChanges = files.find(file => !!file.match(/(test|spec)/i))

  if (hasCodeChanges && !hasTestChanges) {
    warn("Tests were not updated")
  }
}

// Congratulate for doing some housekeeping
export const goodJobCleaningCode = () => {
  if (danger.github.pr.deletions > danger.github.pr.additions) {
    message("Good job on cleaning the code")
  }
}

// Default run
export default async () => {
  needsDescription()
  workInProgress()
  mergeCommits()
  await changelog()
  testsUpdated()
  goodJobCleaningCode()
}
