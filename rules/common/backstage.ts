import { danger, fail } from "danger"
import { validate } from "@roadiehq/roadie-backstage-entity-validator"

const backstage = async () => {
  const pr = danger.github.pr
  const utils = danger.github.utils

  const isOpen = pr.state === "open"

  if (!isOpen) {
    return
  }

  const filePath = "catalog-info.yaml"
  const fileContent = await utils.fileContents(filePath, `${pr.head.user.login}/${pr.head.repo.name}`, pr.head.sha)

  if (fileContent) {
    try {
      await validate(fileContent, true, "./schemas/backstage.annotations.json")
    } catch (e) {
      fail(`The 'catalog-info.yaml' file is not valid for Backstage. Error details:\n\n\`\`\`\n${e}\n\`\`\``)
    }
  } else {
    fail(`The '${filePath}' file doesn't exist in the pull request.`)
  }
}

export default backstage
