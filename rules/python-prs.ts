import { danger, fail, warn } from "danger"

// Don't let (i)pdb get into master
export const pdb = async () => {
  const files = [...danger.git.modified_files, ...danger.git.created_files]
  const regexp = RegExp(`import i?pdb`)
  async function checkFiles() {
    for (const file of files) {
      const content = await danger.github.utils.fileContents(file)
      if (regexp.test(content)) {
        fail("(i)pdb left in the code")
        break
      }
    }
  }
  await checkFiles()
}

// Check if diff contains 'import *'
export const importStar = async () => {
  const files = [...danger.git.modified_files, ...danger.git.created_files]
  const pyFiles = files
    .filter(file => {
      return file.endsWith(".py")
    })
    .filter(pyFile => {
      return !pyFile.includes("=>")
    })

  async function checkFiles() {
    const regex = RegExp("\\s+import\\s+\\*")
    for (const pyFile of pyFiles) {
      const diff = await danger.git.diffForFile(pyFile)
      if (diff != null && regex.test(diff.added)) {
        fail("Please avoid `import *` - explicit is better than implicit!")
      }
    }
  }

  await checkFiles()
}

// Don't let Pipfile.lock outdated
export const pipfileLock = () => {
  const files = [...danger.git.modified_files, ...danger.git.created_files]
  const hasPipfile = files.some(file => {
    return file == "Pipfile"
  })
  const hasPipfileLock = files.some(file => {
    return file == "Pipfile.lock"
  })

  if (hasPipfile && !hasPipfileLock) {
    warn("Pipfile was modified and Pipfile.lock was not. Please update your Python dependencies")
  }
}

export default async () => {
  pdb()
  await importStar()
  pipfileLock()
}
