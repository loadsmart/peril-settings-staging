import { danger, warn } from "danger"

// PRs need a changelog entry if changes are not #trivial
const changelog = async () => {
  const pr = danger.github.pr
  const changelogs = ["CHANGELOG.md", "changelog.md", "CHANGELOG.yml"]
  const isOpen = pr.state === "open"

  const getContentParams = { path: "", owner: pr.head.user.login, repo: pr.head.repo.name }
  const rootContents: any = await danger.github.api.repos.getContent(getContentParams)

  const hasChangelog = rootContents.data.find((file: any) => changelogs.includes(file.name))

  if (isOpen && hasChangelog) {
    const files = [...danger.git.modified_files, ...danger.git.created_files]

    const hasCodeChanges = files.find(file => !file.match(/(test|spec)/i))
    const hasChangelogChanges = files.find(file => changelogs.includes(file))

    if (hasCodeChanges && !hasChangelogChanges) {
      warn("It looks like code was changed without adding anything to the Changelog.")
    }
  }
}

export default changelog
