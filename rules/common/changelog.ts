import { danger, warn } from "danger"

// PRs need a changelog entry if changes are not #trivial
const changelog = async () => {
  const pr = danger.github.pr
  const changelogs_re = /(CHANGELOG.md|changelog.md|CHANGELOG.yml|changelogs\/.*)/
  const semantic_release_re = /(\.releaserc\.(yaml|yml|json|js|cjs)|release\.config\.(js|cjs))$/

  const isOpen = pr.state === "open"

  const getContentParams = { path: "", owner: pr.head.user.login, repo: pr.head.repo.name }
  const rootContents: any = await danger.github.api.repos.getContents(getContentParams)
  const packageJson = rootContents.data.find((file: any) => file.name === "package.json")
    ? JSON.parse(await danger.github.utils.fileContents("package.json"))
    : {}

  const hasChangelog = rootContents.data.find((file: any) => changelogs_re.test(file.name))
  const hasSemanticRelease =
    rootContents.data.find((file: any) => semantic_release_re.test(file.name)) ||
    Object.prototype.hasOwnProperty.call(packageJson, "release")

  if (isOpen && hasChangelog && !hasSemanticRelease) {
    const files = [...(danger.git.modified_files || []), ...(danger.git.created_files || [])]

    const hasCodeChanges = files.find(file => !file.match(/(test|spec)/i))
    const hasChangelogChanges = files.find(file => changelogs_re.test(file))

    if (hasCodeChanges && !hasChangelogChanges) {
      warn(`It looks like code was changed without adding anything to the Changelog.`)
    }
  }
}

export default changelog
