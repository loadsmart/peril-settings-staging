import { danger, warn } from "danger"

// Don't let Pipfile.lock outdated
const pipfileLock = () => {
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

export default pipfileLock
