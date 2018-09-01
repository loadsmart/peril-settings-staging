import { schedule, danger, fail, warn, message } from "danger"

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

function padn(number) {
  if (number < 10) {
    return "0" + number
  }
  return number
}

function formatDate(dt) {
  return (
    dt.getUTCFullYear() +
    "-" +
    padn(dt.getUTCMonth() + 1) +
    "-" +
    padn(dt.getUTCDate()) +
    "T" +
    padn(dt.getUTCHours()) +
    ":" +
    padn(dt.getUTCMinutes()) +
    ":" +
    padn(dt.getUTCSeconds()) +
    "Z"
  )
}

export const workInProgress = wrap("Do not merge it yet. PR is still in progress.", async () => {
  const pr = danger.github.pr
  const wipPR = pr.title.toLowerCase().includes("wip")
  if (wipPR) {
    const now = new Date()
    // const lastCommit = danger.github.commits[-1].sha
    response = await danger.github.api.checks.create({
      owner: danger.github.thisPR.owner,
      repo: danger.github.thisPR.repo,
      // head_sha: lastCommit,
      name: "wip",
      status: "completed",
      conclusion: "failure",
      completed_at: formatDate(now),
      output: {
        title: "Work In Progress",
        summary: "Do not merge it yet. PR is still in progress.",
      },
    })
    // console.log("lastCommit:", lastCommit)
    console.log("response:", response)
    // warn("Do not merge it yet. PR is still in progress.")
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

export const testsUpdated = wrap("Source code changes require test updates", () => {
  const files = [...danger.git.modified_files, ...danger.git.created_files]
  const hasCodeChanges = files.find(file => !file.match(/(test|spec)/i))
  const hasTestChanges = files.find(file => !!file.match(/(test|spec)/i))

  if (hasCodeChanges && !hasTestChanges) {
    warn("Tests were not updated")
  }
})

// danger.git.JSONDiffForFile is not working properly
// 1. https://github.com/octokit/rest.js/issues/602
// 2. https://github.com/danger/danger-js/blob/0c7e7d7233f12ca0e3afcc45f6b9b4c881cc5bdb/source/platforms/github/GitHubGit.ts#L39

// export const bigPR = wrap("The smaller the PR, the easier to review it", async () => {
//   const ignoredExtensions = [".snap", ".xib", ".storyboard"]
//   const files = [...danger.git.modified_files, ...danger.git.created_files, ...danger.git.deleted_files].filter(
//     filename => {
//       return !ignoredExtensions.some(ext => filename.endsWith(ext))
//     }
//   )

//   var diffCount = 0
//   async function fetchDiffs() {
//     for (let filename of files) {
//       const diff: any = await danger.git.JSONDiffForFile(filename)
//       const added: any[] = diff.added
//       const removed: any[] = diff.removed
//       diffCount += added.length + removed.length
//     }
//   }

//   await fetchDiffs()

//   if (diffCount > 500) {
//     warn("Big PR. Consider splitting it into smaller ones")
//   }
// })

export const goodJobCleaningCode = wrap("Congratulate for doing some housekeeping", () => {
  if (danger.github.pr.deletions > danger.github.pr.additions) {
    message("Good job on cleaning the code")
  }
})

// import spellcheck from "danger-plugin-spellcheck"
// wrap("Keep our Markdown documents awesome", async () => {
//   await spellcheck({ settings: "loadsmart/peril-settings@spellcheck.json" })
// })
