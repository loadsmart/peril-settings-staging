jest.mock("danger", () => jest.fn())
import * as danger from "danger"
const dm = danger as any

import changelog from "../changelog"

beforeEach(() => {
  dm.danger = {}
  dm.warn = jest.fn()
})

it("warns when code was changed and there is no changelog entry", async () => {
  dm.danger.github = {
    api: {
      repos: {
        getContents: () => Promise.resolve({ data: [{ name: "code.js" }, { name: "CHANGELOG.md" }] }),
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
  await changelog()
  expect(dm.warn).toHaveBeenCalledWith("It looks like code was changed without adding anything to the Changelog.")
})

it("does not warn when repo has no changelog file", async () => {
  dm.danger.github = {
    api: {
      repos: {
        getContents: () => Promise.resolve({ data: [{ name: "code.js" }] }),
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
  await changelog()
  expect(dm.warn).not.toHaveBeenCalled()
})

it("does not warn when no production code was changed", async () => {
  dm.danger.github = {
    api: {
      repos: {
        getContents: () => Promise.resolve({ data: [{ name: "code.js" }, { name: "CHANGELOG.md" }] }),
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
  await changelog()
  expect(dm.warn).not.toHaveBeenCalled()
})

it("does not warn when there is a changelog entry", async () => {
  dm.danger.github = {
    api: {
      repos: {
        getContents: () => Promise.resolve({ data: [{ name: "code.js" }, { name: "CHANGELOG.md" }] }),
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
  await changelog()
  expect(dm.warn).not.toHaveBeenCalled()
})

it("does not warn when PR is already closed", async () => {
  dm.danger.github = {
    api: {
      repos: {
        getContents: () => Promise.resolve({ data: [{ name: "code.js" }, { name: "CHANGELOG.md" }] }),
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
  await changelog()
  expect(dm.warn).not.toHaveBeenCalled()
})

it("does not warn when repo has changelog file and release.config file", async () => {
  dm.danger.github = {
    api: {
      repos: {
        getContents: () => Promise.resolve({ data: [{ name: "code.js" }, { name: "release.config.js" }] }),
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
  await changelog()
  expect(dm.warn).not.toHaveBeenCalled()
})

it("does not warn when repo has changelog and releaserc file", async () => {
  dm.danger.github = {
    api: {
      repos: {
        getContents: () => Promise.resolve({ data: [{ name: "code.js" }, { name: ".releaserc.yaml" }] }),
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
  await changelog()
  expect(dm.warn).not.toHaveBeenCalled()
})
