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

// Only handling root package.json
export const packageLock = wrap("Don't let package-lock.json outdated", () => {
  const files = [...danger.git.modified_files, ...danger.git.created_files]
  const hasPackageJson = files.some(file => {
    return file == "package.json"
  })
  const hasPackageLockJson = files.some(file => {
    return file == "package-lock.json"
  })

  if (hasPackageJson && !hasPackageLockJson) {
    warn("package.json was modified and package-lock.json was not. Please update your JS dependencies")
  }
})
