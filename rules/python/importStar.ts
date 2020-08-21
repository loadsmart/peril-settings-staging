import { danger, fail } from "danger"

// Check if diff contains 'import *'
const importStar = async () => {
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

export default importStar
