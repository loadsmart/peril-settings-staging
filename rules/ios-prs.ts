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

export const viewFilesWereChanged = wrap("View-ish file changes require a screenshot ", () => {
  const extensions = [".xib", ".storyboard", "View.swift", "Button.swift"]
  const files = [...danger.git.modified_files, ...danger.git.created_files]
  const hasViewChanges = files.some(file => !!file.match(/\/views?\//i) || extensions.some(ext => file.endsWith(ext)))
  const prHasScreenshot = danger.github.pr.body.match(/https?:\/\/\S*\.(png|jpg|jpeg|gif){1}/)
  const prHasSnapshostTest = files.some(file => !!file.match(/.+Spec\/.+snapshot/i))

  if (hasViewChanges && !prHasScreenshot && !prHasSnapshostTest) {
    warn("View files were changed. Maybe you want to add a screenshot to your PR.")
  }
})

export const podfileLock = wrap("Don't let Podfile.lock outdated", () => {
  const files = [...danger.git.modified_files, ...danger.git.created_files]
  const hasPodfile = files.some(file => file == "Podfile")
  const hasPodfileLock = files.some(file => file == "Podfile.lock")

  if (hasPodfile && !hasPodfileLock) {
    warn("Podfile was modified and Podfile.lock was not. Please update your lock file.")
  }
})
