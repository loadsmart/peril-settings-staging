jest.mock("danger", () => jest.fn())
import * as danger from "danger"
const dm = danger as any

import deleteMergedPRBranch from "../deleteMergedPRBranch"

it("does not delete special branches", async () => {
  const mockBranchResponse = (branch: string) =>
    (dm.danger = {
      github: {
        api: {
          git: {
            deleteRef: jest.fn(),
          },
        },
        pr: {
          merged: true,
          head: {
            ref: branch,
          },
        },
        thisPR: {},
      },
    })

  const specialBranches = ["master", "develop", "production", "staging"]

  await specialBranches.forEach(async branch => {
    mockBranchResponse(branch)
    await deleteMergedPRBranch()
    expect(dm.danger.github.api.git.deleteRef).not.toHaveBeenCalled()
  })
})

it("does not delete anything if pr is not merged it", async () => {
  dm.danger = {
    github: {
      api: {
        git: {
          deleteRef: jest.fn(),
        },
      },
      pr: {
        merged: false,
        head: {
          ref: "feature/login",
        },
      },
      thisPR: {},
    },
  }

  await deleteMergedPRBranch()
  expect(dm.danger.github.api.git.deleteRef).not.toHaveBeenCalled()
})

it("should delete other types of branches if they're merged", async () => {
  dm.danger = {
    github: {
      api: {
        git: {
          deleteRef: jest.fn(),
        },
      },
      pr: {
        merged: true,
        head: {
          ref: "feature/login",
        },
      },
      thisPR: {},
    },
  }

  await deleteMergedPRBranch()
  expect(dm.danger.github.api.git.deleteRef).toHaveBeenCalled()
})
