jest.mock("danger", () => jest.fn())
import * as danger from "danger"
const dm = danger as any

import { changelog } from "../rules/all-prs"

beforeEach(() => {
  dm.danger = {}
  dm.warn = jest.fn()
})

it("warns when code was changed and there is no changelog entry", () => {
  dm.danger.github = {
    api: {
      repos: {
        getContent: () => Promise.resolve({ data: [{ name: "code.js" }, { name: "CHANGELOG.md" }] }),
      },
    },
    pr: {
      head: { user: { login: "danger" }, repo: { name: "peril-settings" } },
      state: "open",
    },
  }
  dm.danger.git = {
    modified_files: ["src/index.html"],
    created_files: [],
  }
  return changelog().then(() => {
    expect(dm.warn).toHaveBeenCalledWith("It looks like code was changed without adding anything to the Changelog.")
  })
})

it("does not warn when repo has no changelog file", () => {
  dm.danger.github = {
    api: {
      repos: {
        getContent: () => Promise.resolve({ data: [{ name: "code.js" }] }),
      },
    },
    pr: {
      head: { user: { login: "danger" }, repo: { name: "peril-settings" } },
      state: "open",
    },
  }
  dm.danger.git = {
    modified_files: ["src/index.html"],
    created_files: [],
  }
  return changelog().then(() => {
    expect(dm.warn).not.toHaveBeenCalled()
  })
})

it("does not warn when no production code was changed", () => {
  dm.danger.github = {
    api: {
      repos: {
        getContent: () => Promise.resolve({ data: [{ name: "code.js" }, { name: "CHANGELOG.md" }] }),
      },
    },
    pr: {
      head: { user: { login: "danger" }, repo: { name: "peril-settings" } },
      state: "open",
    },
  }
  dm.danger.git = {
    modified_files: ["test/index.html", "CHANGELOG.md"],
    created_files: [],
  }
  return changelog().then(() => {
    expect(dm.warn).not.toHaveBeenCalled()
  })
})

it("does not warn when there is a changelog entry", () => {
  dm.danger.github = {
    api: {
      repos: {
        getContent: () => Promise.resolve({ data: [{ name: "code.js" }, { name: "CHANGELOG.md" }] }),
      },
    },
    pr: {
      head: { user: { login: "danger" }, repo: { name: "peril-settings" } },
      state: "open",
    },
  }
  dm.danger.git = {
    modified_files: ["src/index.html", "CHANGELOG.md"],
    created_files: [],
  }
  return changelog().then(() => {
    expect(dm.warn).not.toHaveBeenCalled()
  })
})

it("does not warn when PR is already closed", () => {
  dm.danger.github = {
    api: {
      repos: {
        getContent: () => Promise.resolve({ data: [{ name: "code.js" }, { name: "CHANGELOG.md" }] }),
      },
    },
    pr: {
      head: { user: { login: "danger" }, repo: { name: "peril-settings" } },
      state: "merged",
    },
  }
  dm.danger.git = {
    modified_files: ["src/index.html"],
    created_files: [],
  }
  return changelog().then(() => {
    expect(dm.warn).not.toHaveBeenCalled()
  })
})
