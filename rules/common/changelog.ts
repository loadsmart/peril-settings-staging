import { danger, warn } from "danger"

// PRs need a changelog entry if changes are not #trivial
const changelog = async () => {
  const pr = danger.github.pr
  const changelogs_re = /(CHANGELOG.md|changelog.md|CHANGELOG.yml|changelogs\/.*)/
  const semantic_release_re = /(\.releaserc\.(yaml|yml|json|js|cjs)|release\.config\.(js|cjs))$/

  const isOpen = pr.state === "open"

  const getContentParams = { path: "", owner: pr.head.user.login, repo: pr.head.repo.name }
  const rootContents: any = await danger.github.api.repos.getContents(getContentParams)

  const hasChangelog = rootContents.data.find((file: any) => changelogs_re.test(file.name))
  const hasSemanticRelease = rootContents.data.find((file: any) => semantic_release_re.test(file.name))

  if (isOpen && hasChangelog && !hasSemanticRelease) {
    const files = [...danger.git.modified_files, ...danger.git.created_files]

    const hasCodeChanges = files.find(file => !file.match(/(test|spec)/i))
    const hasChangelogChanges = files.find(file => changelogs_re.test(file))

    if (hasCodeChanges && !hasChangelogChanges) {
      warn(`It looks like code was changed without adding anything to the Changelog.
      If you are not sure whether this PR needs a changelog entry you may refer to this [confluence page](https://loadsmart.atlassian.net/wiki/spaces/engineering/pages/800030751/Changelog+entries#What-warrants-a-changelog-entry%3F)
      `)
    }
  }
}

export default changelog
