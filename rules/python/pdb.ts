import { danger, fail } from "danger"

// Don't let (i)pdb get into master
const pdb = async () => {
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

export default pdb
