jest.mock("danger", () => jest.fn())
import * as danger from "danger"
const dm = danger as any

import lgtm from "../lgtm"

beforeEach(() => {
  dm.danger = {
    github: {
      api: {
        pullRequests: {
          createComment: jest.fn(),
        },
      },
    },
  }
})

it("does not comment if not pull request", async () => {
  const issueComment: any = {
    issue: {
      pull_request: false,
    },
  }

  await lgtm(issueComment)
  expect(dm.danger.github.api.pullRequests.createComment).not.toHaveBeenCalled()
})

it("does not comment if keyword not found", async () => {
  const issueComment: any = {
    issue: {
      pull_request: true,
    },
    comment: {
      body: "Good job :+1:",
    },
  }

  await lgtm(issueComment)
  expect(dm.danger.github.api.pullRequests.createComment).not.toHaveBeenCalled()
})

it("does comment if it finds lgtm keyword", async () => {
  const issueComment: any = {
    issue: {
      number: 42,
      pull_request: true,
    },
    comment: {
      body: "LGTM",
    },
    repository: {
      owner: {
        login: "loadsmart",
      },
      name: "peril-settings",
    },
  }

  await lgtm(issueComment)
  expect(dm.danger.github.api.pullRequests.createComment).toBeCalledWith({
    body: "![lgtm](https://media.giphy.com/media/3osxYdek8wYWCOLgT6/giphy.gif)",
    number: 42,
    owner: "loadsmart",
    repo: "peril-settings",
  })
})
