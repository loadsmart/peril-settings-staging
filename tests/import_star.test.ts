jest.mock("danger", () => jest.fn())
import * as danger from "danger"
const dm = danger as any

import { importStar } from "../rules/python-prs"

beforeEach(() => {
  dm.danger = {}
  dm.fail = jest.fn()
})

it("fails when import star is added", () => {
  const modifiedFile = "some/file.py"

  dm.danger.git = {
    modified_files: [modifiedFile],
    created_files: [],
    diffForFile: (filename: string) => {
      const line = filename === modifiedFile ? "from models import *" : ""
      return Promise.resolve({ added: line })
    },
  }

  return importStar().then(() => {
    expect(dm.fail).toHaveBeenCalledWith("Please avoid `import *` - explicit is better than implicit!")
  })
})

it("does not fail when import star is added only to non-python files", () => {
  const modifiedFile = "some/file.js"

  dm.danger.git = {
    modified_files: [modifiedFile],
    created_files: [],
    diffForFile: (filename: string) => {
      const line = filename === modifiedFile ? "from models import *" : ""
      return Promise.resolve({ added: line })
    },
  }

  return importStar().then(() => {
    expect(dm.fail).not.toHaveBeenCalled()
  })
})

it("does not fail when import star is only present in renamed files", () => {
  const modifiedFile = "some/file.py => some/new_file.py"

  dm.danger.git = {
    modified_files: [modifiedFile],
    created_files: [],
    diffForFile: (filename: string) => {
      const line = filename === modifiedFile ? "from models import *" : ""
      return Promise.resolve({ added: line })
    },
  }

  return importStar().then(() => {
    expect(dm.fail).not.toHaveBeenCalled()
  })
})

it("does not fail when there is no import star in python files", () => {
  const modifiedFile = "some/file.py"

  dm.danger.git = {
    modified_files: [modifiedFile],
    created_files: [],
    diffForFile: (filename: string) => {
      const line = filename === modifiedFile ? "from models import Shipment" : ""
      return Promise.resolve({ added: line })
    },
  }

  return importStar().then(() => {
    expect(dm.fail).not.toHaveBeenCalled()
  })
})
