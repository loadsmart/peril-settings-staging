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

export const pdb = wrap("Don't let (i)pdb get into master", async () => {
  const files = [...danger.git.modified_files, ...danger.git.created_files]
  const regexp = RegExp(`import i?pdb`)
  async function checkFiles() {
    for (const file in files) {
      const content = await danger.github.utils.fileContents(file)
      if (regexp.test(content)) {
        fail("(i)pdb left in the code")
        break
      }
    }
  }
  await checkFiles()
})

export const importStar = wrap("Check if diff contains 'import *'", async () => {
  const files = [...danger.git.modified_files, ...danger.git.created_files]
  const pyFiles = files
    .filter(file => {
      return file.endsWith(".py")
    })
    .filter(pyFile => {
      return !pyFile.includes("=>")
    })

  async function checkFiles() {
    const regex = /\s+import\s+\*/i
    for (const pyFile in pyFiles) {
      const diff = await danger.git.diffForFile(pyFile)

      if (diff != null && regex.test(diff.added)) {
        fail("Please avoid `import *` - explicit is better than implicit!")
      }
    }
  }

  await checkFiles()
})
