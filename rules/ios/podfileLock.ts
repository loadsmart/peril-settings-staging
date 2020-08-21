import { danger, warn } from "danger"

// Don't let Podfile.lock outdated
const podfileLock = () => {
  const files = [...danger.git.modified_files, ...danger.git.created_files]
  const hasPodfile = files.some(file => file == "Podfile")
  const hasPodfileLock = files.some(file => file == "Podfile.lock")

  if (hasPodfile && !hasPodfileLock) {
    warn("Podfile was modified and Podfile.lock was not. Please update your lock file.")
  }
}

export default podfileLock
