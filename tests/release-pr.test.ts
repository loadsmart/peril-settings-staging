jest.mock("danger", () => jest.fn())
import * as danger from "danger"
const dm = danger as any

import { approveReleasePR } from "../rules/release-prs"

beforeEach(() => {
  dm.fail = jest.fn()
})

it("Approve and merge a titled release PR", () => {
  dm.danger = {
    git: { commits: [{ message: "Merge branch 'develop'" }] },
    github: {
      api: {
        issues: {
          addLabels: jest.fn(),
        },
        pullRequests: {
          createReview: jest.fn(),
          merge: jest.fn(),
        },
      },
      pr: {
        title: "[Release] 0.1.1",
        head: { repo: { owner: { login: "my-login" }, name: "my-name" } },
      },
    },
  }
  approveReleasePR()
  expect(dm.fail).not.toHaveBeenCalled()
  expect(dm.danger.github.api.pullRequests.createReview).toHaveBeenCalled()
  expect(dm.danger.github.api.issues.addLabels).toHaveBeenCalled()
  expect(dm.danger.github.api.pullRequests.merge).toHaveBeenCalled()
})

it("Do not approve and merge an opened PR without release on title", () => {
  dm.danger = {
    git: { commits: [{ message: "Merge branch 'develop'" }] },
    github: {
      api: {
        issues: {
          addLabels: jest.fn(),
        },
        pullRequests: {
          createReview: jest.fn(),
          merge: jest.fn(),
        },
      },
      pr: {
        title: "Release 0.1.1",
        head: { repo: { owner: { login: "my-login" }, name: "my-name" } },
      },
    },
  }
  approveReleasePR()
  expect(dm.fail).not.toHaveBeenCalled()
  expect(dm.danger.github.api.pullRequests.createReview).not.toHaveBeenCalled()
  expect(dm.danger.github.api.issues.addLabels).not.toHaveBeenCalled()
  expect(dm.danger.github.api.pullRequests.merge).not.toHaveBeenCalled()
})
