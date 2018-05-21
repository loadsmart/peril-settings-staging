jest.mock("danger", () => jest.fn())
import * as danger from "danger"
const dm = danger as any

import { leftTestShortcuts } from "../rules/ios-prs"

beforeEach(() => {
  dm.danger = {}
  dm.warn = jest.fn()
  dm.fail = jest.fn()
})

it("warns if xit is left in tests", () => {
  const modifiedFile = "MySpec.swift"

  dm.danger.git = {
    modified_files: [modifiedFile],
    created_files: [],
    diffForFile: (filename: String) => {
      const line = filename === modifiedFile ? 'xit("should do something") {}' : ""
      return Promise.resolve({ added: line })
    },
  }

  return leftTestShortcuts().then(() => {
    expect(dm.warn).toHaveBeenCalledWith("Testing shortcut 'xit' left in tests")
  })
})

it("warns if xdescribe is left in tests", () => {
  const modifiedFile = "MySpec.swift"

  dm.danger.git = {
    modified_files: [modifiedFile],
    created_files: [],
    diffForFile: (filename: String) => {
      const line = filename === modifiedFile ? 'xdescribe("should do something") {}' : ""
      return Promise.resolve({ added: line })
    },
  }

  return leftTestShortcuts().then(() => {
    expect(dm.warn).toHaveBeenCalledWith("Testing shortcut 'xdescribe' left in tests")
  })
})

it("warns if xcontext is left in tests", () => {
  const modifiedFile = "MySpec.swift"

  dm.danger.git = {
    modified_files: [modifiedFile],
    created_files: [],
    diffForFile: (filename: String) => {
      const line = filename === modifiedFile ? 'xcontext("should do something") {}' : ""
      return Promise.resolve({ added: line })
    },
  }

  return leftTestShortcuts().then(() => {
    expect(dm.warn).toHaveBeenCalledWith("Testing shortcut 'xcontext' left in tests")
  })
})

it("fails if fit is left in tests", () => {
  const modifiedFile = "MySpec.swift"

  dm.danger.git = {
    modified_files: [modifiedFile],
    created_files: [],
    diffForFile: (filename: String) => {
      const line = filename === modifiedFile ? 'fit("should do something") {}' : ""
      return Promise.resolve({ added: line })
    },
  }

  return leftTestShortcuts().then(() => {
    expect(dm.fail).toHaveBeenCalledWith("Testing shortcut 'fit' left in tests")
  })
})

it("fails if fdescribe is left in tests", () => {
  const modifiedFile = "MySpec.swift"

  dm.danger.git = {
    modified_files: [modifiedFile],
    created_files: [],
    diffForFile: (filename: String) => {
      const line = filename === modifiedFile ? 'fdescribe("should do something") {}' : ""
      return Promise.resolve({ added: line })
    },
  }

  return leftTestShortcuts().then(() => {
    expect(dm.fail).toHaveBeenCalledWith("Testing shortcut 'fdescribe' left in tests")
  })
})

it("fails if fcontext is left in tests", () => {
  const modifiedFile = "MySpec.swift"

  dm.danger.git = {
    modified_files: [modifiedFile],
    created_files: [],
    diffForFile: (filename: String) => {
      const line = filename === modifiedFile ? 'fcontext("should do something") {}' : ""
      return Promise.resolve({ added: line })
    },
  }

  return leftTestShortcuts().then(() => {
    expect(dm.fail).toHaveBeenCalledWith("Testing shortcut 'fcontext' left in tests")
  })
})

it("does not warn or fail if no test shortcuts are left in tests", () => {
  const modifiedFile = "MySpec.swift"

  dm.danger.git = {
    modified_files: [modifiedFile],
    created_files: [],
    diffForFile: (filename: String) => {
      const line = filename === modifiedFile ? 'it("should do something") {}' : ""
      return Promise.resolve({ added: line })
    },
  }

  return leftTestShortcuts().then(() => {
    expect(dm.warn).not.toHaveBeenCalled()
    expect(dm.fail).not.toHaveBeenCalled()
  })
})
