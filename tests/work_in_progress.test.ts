jest.mock("danger", () => jest.fn())
import * as danger from "danger"
const dm = danger as any

import { workInProgress } from "../rules/all-prs"

beforeEach(() => {
  dm.warn = jest.fn()
})

it("warns when PR is classed as Work in Progress", () => {
  dm.danger = { github: { pr: { title: "WIP: awesome feature" } } }

  workInProgress()
  expect(dm.warn).toHaveBeenCalledWith("Do not merge it yet. PR is still in progress.")
})

it("does not warn if title does not contain keyword WIP", () => {
  dm.danger = { github: { pr: { title: "awesome feature" } } }

  workInProgress()
  expect(dm.warn).not.toHaveBeenCalled()
})
