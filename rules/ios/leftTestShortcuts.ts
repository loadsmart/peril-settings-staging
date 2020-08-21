import { danger, fail, warn } from "danger"

// Don't let testing shortcuts get into master by accident
const leftTestShortcuts = async () => {
  const testLabels = ["describe", "context", "it"]
  const testShortcuts = [...testLabels.map(label => `f${label}`), ...testLabels.map(label => `x${label}`)]

  const files = [...danger.git.created_files, ...danger.git.modified_files].filter(file => {
    return file.toLowerCase().includes("test") || file.toLowerCase().includes("spec")
  })

  async function checkFiles() {
    for (let file of files) {
      for (let shortcut of testShortcuts) {
        const regex = RegExp(`${shortcut}`)
        const diff = await danger.git.diffForFile(file)

        if (diff != null && regex.test(diff.added)) {
          const func = shortcut.startsWith("f") ? fail : warn
          func(`Testing shortcut '${shortcut}' left in tests`)
        }
      }
    }
  }

  await checkFiles()
}

export default leftTestShortcuts
