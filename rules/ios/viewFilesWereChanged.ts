import { danger, warn } from "danger"

// View-ish file changes require a screenshot
const viewFilesWereChanged = () => {
  const extensions = [".xib", ".storyboard", "View.swift", "Button.swift"]
  const files = [...danger.git.modified_files, ...danger.git.created_files]
  const hasViewChanges = files.some(file => !!file.match(/\/views?\//i) || extensions.some(ext => file.endsWith(ext)))
  const prHasScreenshot = danger.github.pr.body.match(/https?:\/\/\S*\.(png|jpg|jpeg|gif){1}/)
  const prHasSnapshostTest = files.some(file => !!file.match(/.+Spec\/.+snapshot/i))

  if (hasViewChanges && !prHasScreenshot && !prHasSnapshostTest) {
    warn("View files were changed. Maybe you want to add a screenshot to your PR.")
  }
}

export default viewFilesWereChanged
