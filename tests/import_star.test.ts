jest.mock("danger", () => jest.fn())
import * as danger from "danger"
const dm = danger as any

import { importStar } from "../rules/python-prs"

beforeEach(() => {
  dm.danger = {}
  dm.fail = jest.fn()
})

it("fails when import star is added", () => {
  dm.danger.git = {
    modified_files: ["some/file.py"],
    created_files: [],
    diffForFile: (filename: String) => Promise.resolve({ added: "from head.models import *" }),
  }

  return importStar().then(() => {
    expect(dm.fail).toHaveBeenCalledWith("Please avoid `import *` - explicit is better than implicit!")
  })
})

it("does not fail when import star is added only to non-python files", () => {
  dm.danger.git = {
    modified_files: ["some/file.js"],
    created_files: [],
    diffForFile: (filename: String) => Promise.resolve({ added: "from head.models import *" }),
  }

  return importStar().then(() => {
    expect(dm.fail).not.toHaveBeenCalled()
  })
})

it("does not fail when import star is only present in renamed files", () => {
  dm.danger.git = {
    modified_files: ["some/file.py => some/new_file.py"],
    created_files: [],
    diffForFile: (filename: String) => Promise.resolve({ added: "from head.models import *" }),
  }

  return importStar().then(() => {
    expect(dm.fail).not.toHaveBeenCalled()
  })
})

it("does not fail when there is no import star in python files", () => {
  dm.danger.git = {
    modified_files: ["some/file.py"],
    created_files: [],
    diffForFile: (filename: String) => Promise.resolve({ added: "from head.models import shipment" }),
  }

  return importStar().then(() => {
    expect(dm.fail).not.toHaveBeenCalled()
  })
})
