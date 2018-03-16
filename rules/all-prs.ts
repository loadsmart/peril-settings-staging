import { schedule, danger, fail, warn } from "danger"

// The inspiration for this is https://github.com/artsy/artsy-danger/blob/f019ee1a3abffabad65014afabe07cb9a12274e7/org/all-prs.ts
const isJest = typeof jest !== "undefined"

// Stores the parameter in a closure that can be invoked in tests.
const _test = (reason: string, closure: () => void | Promise<any>) =>
  // We return a closure here so that the (promise is resolved|closure is invoked)
  // during test time and not when we call wrap().
  () => (closure instanceof Promise ? closure : Promise.resolve(closure()))

// Either schedules the promise for execution via Danger, or invokes closure.
const _run = (reason: string, closure: () => void | Promise<any>) =>
  closure instanceof Promise ? schedule(closure) : closure()

export const wrap: any = isJest ? _test : _run

export const needsDescription = wrap("Every PR requires a description", () => {
  const pr = danger.github.pr
  if (pr.body === null || pr.body.length === 0) {
    fail("Please add a description to your PR.")
  }
})

export const workInProgress = wrap("Do not merge it yet. PR is still in progress.", () => {
  const pr = danger.github.pr
  const wipPR = pr.title.toLowerCase().includes("wip")
  if (wipPR) {
    warn("PR is classed as Work in Progress.")
  }
})

export const mergeCommits = wrap("Keep the commit tree clean by getting rid of merge commits", () => {
  const regex = RegExp(`^Merge branch '${danger.github.pr.base.ref}'`)
  const hasMergeCommits = danger.git.commits.find(c => regex.test(c.message))
  if (hasMergeCommits) {
    fail("Please rebase to get rid of the merge commits in this PR.")
  }
})

export const changelog = wrap("PRs need a changelog entry if changes are not #trivial", async () => {
  const pr = danger.github.pr
  const changelogs = ["CHANGELOG.md", "changelog.md", "CHANGELOG.yml"]
  const isOpen = danger.github.pr.state === "open"

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
})
