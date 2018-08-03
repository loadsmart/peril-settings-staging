import { danger, warn } from "danger"

// Don't let package-lock.json outdated
export const packageLock = () => {
  const files = [...danger.git.modified_files, ...danger.git.created_files]
  const hasPackageJson = files.some(file => {
    return file == "package.json"
  })
  const hasPackageLockJson = files.some(file => {
    return file == "package-lock.json"
  })

  if (hasPackageJson && !hasPackageLockJson) {
    warn("package.json was modified and package-lock.json was not. Please update your JS dependencies")
  }
}

export default async () => {
  packageLock()
}
