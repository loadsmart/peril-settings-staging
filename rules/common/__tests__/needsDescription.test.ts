jest.mock("danger", () => jest.fn())
import * as danger from "danger"
const dm = danger as any

import needsDescription from "../needsDescription"

beforeEach(() => {
  dm.fail = jest.fn()
})

it("fails when there's no PR body", () => {
  dm.danger = { github: { pr: { body: "" } } }

  needsDescription()
  expect(dm.fail).toHaveBeenCalledWith("Please add a description to your PR.")
})

it("does nothing when there's a PR body", () => {
  dm.danger = { github: { pr: { body: "Hello world" } } }

  needsDescription()
  expect(dm.fail).not.toHaveBeenCalled()
})
