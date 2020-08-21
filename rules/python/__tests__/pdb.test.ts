jest.mock("danger", () => jest.fn())
import * as danger from "danger"
const dm = danger as any

import pdb from "../pdb"

beforeEach(() => {
  dm.danger = {}
  dm.fail = jest.fn()
})

it("fails when pdb is left in file", async () => {
  const modifiedFile = "some/file.py"

  dm.danger.git = {
    modified_files: [modifiedFile],
    created_files: [],
  }

  dm.danger.github = {
    utils: {
      fileContents: (filename: String) => {
        const content = filename === modifiedFile ? "import pdb" : ""
        return Promise.resolve(content)
      },
    },
  }

  await pdb()
  expect(dm.fail).toHaveBeenCalledWith("(i)pdb left in the code")
})

it("fails when ipdb is left in file", async () => {
  const modifiedFile = "some/file.py"

  dm.danger.git = {
    modified_files: [modifiedFile],
    created_files: [],
  }

  dm.danger.github = {
    utils: {
      fileContents: (filename: String) => {
        const content = filename === modifiedFile ? "import ipdb" : ""
        return Promise.resolve(content)
      },
    },
  }

  await pdb()
  expect(dm.fail).toHaveBeenCalledWith("(i)pdb left in the code")
})

it("does not fail when neither pdb nor ipdb is left in file", async () => {
  const modifiedFile = "some/file.py"

  dm.danger.git = {
    modified_files: [modifiedFile],
    created_files: [],
  }

  dm.danger.github = {
    utils: {
      fileContents: (filename: String) => {
        const content = filename === modifiedFile ? "import datetime" : ""
        return Promise.resolve(content)
      },
    },
  }

  await pdb()
  expect(dm.fail).not.toHaveBeenCalled()
})
