import { danger, fail } from "danger"
import axios from "axios"
import { createWriteStream, existsSync } from "fs"
import { validate } from "@roadiehq/roadie-backstage-entity-validator"

const backstage = async () => {
  const pr = danger.github.pr
  const utils = danger.github.utils
  const schemaURL =
    "https://raw.githubusercontent.com/loadsmart/peril-settings/f56651f1f11a45d6e251427d8936b309cd6dba47/rules/common/schemas/backstage.annotations.json"

  const isOpen = pr.state === "open"

  if (!isOpen) {
    return
  }

  const filePath = "catalog-info.yaml"
  const fileContent = await utils.fileContents(filePath, `${pr.head.user.login}/${pr.head.repo.name}`, pr.head.sha)

  if (fileContent) {
    const schemaPath = `/tmp/backstage.annotations.json`

    // Check if the schema file exists
    if (!existsSync(schemaPath)) {
      const response = await axios.get(schemaURL, { responseType: "stream" })
      const fileStream = createWriteStream(schemaPath)
      response.data.pipe(fileStream)

      // Wait for the file to finish downloading
      await new Promise((resolve, reject) => {
        fileStream.on("finish", resolve)
        fileStream.on("error", reject)
      })
    }

    try {
      await validate(fileContent, true, schemaPath)
    } catch (e) {
      fail(`The 'catalog-info.yaml' file is not valid for Backstage. Error details:\n\n\`\`\`\n${e}\n\`\`\``)
    }
  } else {
    fail(`'${filePath}' file doesn't exist.`)
  }
}

export default backstage
