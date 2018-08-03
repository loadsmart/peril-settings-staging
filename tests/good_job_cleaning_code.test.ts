jest.mock("danger", () => jest.fn())
import * as danger from "danger"
const dm = danger as any

import { goodJobCleaningCode } from "../rules/all-prs"

beforeEach(() => {
  dm.danger = {}
  dm.message = jest.fn()
})

it("messages when number of deletions is greater than additions", () => {
  dm.danger.github = {
    pr: {
      additions: 1,
      deletions: 2,
    },
  }

  goodJobCleaningCode()
  expect(dm.message).toHaveBeenCalledWith("Good job on cleaning the code")
})

it("does not message when number of deletions is equal to additions", () => {
  dm.danger.github = {
    pr: {
      additions: 1,
      deletions: 1,
    },
  }

  goodJobCleaningCode()
  expect(dm.message).not.toHaveBeenCalled()
})

it("does not message when number of deletions is lesser than additions", () => {
  dm.danger.github = {
    pr: {
      additions: 2,
      deletions: 1,
    },
  }

  goodJobCleaningCode()
  expect(dm.message).not.toHaveBeenCalled()
})
