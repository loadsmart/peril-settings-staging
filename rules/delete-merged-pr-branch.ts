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

export const deleteMergedPRBranch = wrap("Delete branch of a merged PR", async () => {
  const owner = danger.github.thisPR.owner
  const repo = danger.github.thisPR.repo
  const ref = `heads/${danger.github.pr.head.ref}`

  console.info(`owner: ${owner}, repo: ${repo}, ref: ${ref}`)

  try {
    console.info(`Deleting merged branch ${ref}`)
    const api = danger.github.api
    await api.gitdata.deleteReference({ owner, repo, ref: ref })
    console.info(`Branch ${ref} deleted`)
  } catch (error) {
    console.error(`Error deleting branch ${ref}`)
    console.error(error)
  }
})
