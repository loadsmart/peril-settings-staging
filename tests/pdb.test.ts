jest.mock("danger", () => jest.fn())
import * as danger from "danger"
const dm = danger as any

import { pdb } from "../rules/python-prs"

beforeEach(() => {
  dm.danger = {}
  dm.fail = jest.fn()
})

it("fails when pdb is left in file", () => {
  dm.danger.git = {
    modified_files: ["some/file.py"],
    created_files: [],
  }
  dm.danger.github = {
    utils: {
      fileContents: (filename: String) => Promise.resolve("import pdb"),
    },
  }
  return pdb().then(() => {
    expect(dm.fail).toHaveBeenCalledWith("(i)pdb left in the code")
  })
})

it("fails when ipdb is left in file", () => {
  dm.danger.git = {
    modified_files: ["some/file.py"],
    created_files: [],
  }
  dm.danger.github = {
    utils: {
      fileContents: (filename: String) => Promise.resolve("import ipdb"),
    },
  }
  return pdb().then(() => {
    expect(dm.fail).toHaveBeenCalledWith("(i)pdb left in the code")
  })
})

it("does not fail when neither pdb nor ipdb is left in file", () => {
  dm.danger.git = {
    modified_files: ["some/file.py"],
    created_files: [],
  }
  dm.danger.github = {
    utils: {
      fileContents: (filename: String) => Promise.resolve("import datetime"),
    },
  }
  return pdb().then(() => {
    expect(dm.fail).not.toHaveBeenCalled()
  })
})
