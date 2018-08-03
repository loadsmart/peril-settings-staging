import { danger, fail, warn } from "danger"

// View-ish file changes require a screenshot
export const viewFilesWereChanged = () => {
  const extensions = [".xib", ".storyboard", "View.swift", "Button.swift"]
  const files = [...danger.git.modified_files, ...danger.git.created_files]
  const hasViewChanges = files.some(file => !!file.match(/\/views?\//i) || extensions.some(ext => file.endsWith(ext)))
  const prHasScreenshot = danger.github.pr.body.match(/https?:\/\/\S*\.(png|jpg|jpeg|gif){1}/)
  const prHasSnapshostTest = files.some(file => !!file.match(/.+Spec\/.+snapshot/i))

  if (hasViewChanges && !prHasScreenshot && !prHasSnapshostTest) {
    warn("View files were changed. Maybe you want to add a screenshot to your PR.")
  }
}

// Don't let Podfile.lock outdated
export const podfileLock = () => {
  const files = [...danger.git.modified_files, ...danger.git.created_files]
  const hasPodfile = files.some(file => file == "Podfile")
  const hasPodfileLock = files.some(file => file == "Podfile.lock")

  if (hasPodfile && !hasPodfileLock) {
    warn("Podfile was modified and Podfile.lock was not. Please update your lock file.")
  }
}

// Don't let testing shortcuts get into master by accident
export const leftTestShortcuts = async () => {
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

export default async () => {
  viewFilesWereChanged()
  podfileLock()
  await leftTestShortcuts()
}
