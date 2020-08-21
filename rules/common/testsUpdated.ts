import { danger, warn } from "danger"

// Source code changes require test updates
const testsUpdated = () => {
  const files = [...danger.git.modified_files, ...danger.git.created_files]
  const hasCodeChanges = files.find(file => !file.match(/(test|spec)/i))
  const hasTestChanges = files.find(file => !!file.match(/(test|spec)/i))

  if (hasCodeChanges && !hasTestChanges) {
    warn("Tests were not updated")
  }
}

export default testsUpdated
