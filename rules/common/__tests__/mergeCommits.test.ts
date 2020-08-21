jest.mock("danger", () => jest.fn())
import * as danger from "danger"
const dm = danger as any

import mergeCommits from "../mergeCommits"

beforeEach(() => {
  dm.fail = jest.fn()
})

it("fails when PR contains merge commits", () => {
  dm.danger = {
    git: { commits: [{ message: "Merge branch 'develop'" }] },
    github: { pr: { base: { ref: "develop" } } },
  }

  mergeCommits()
  expect(dm.fail).toHaveBeenCalledWith("Please rebase to get rid of the merge commits in this PR.")
})

it("doest not fail when PR doest not contain merge commits", () => {
  dm.danger = {
    git: { commits: [{ message: "my awesome commit" }] },
    github: { pr: { base: { ref: "develop" } } },
  }

  mergeCommits()
  expect(dm.fail).not.toHaveBeenCalled()
})
