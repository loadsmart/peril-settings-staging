jest.mock("danger", () => jest.fn())
import * as danger from "danger"
const dm = danger as any

import { work_in_progress } from "../rules/all-prs"

beforeEach(() => {
  dm.warn = jest.fn()
})

it("warns when PR is classed as Work in Progress", () => {
  dm.danger = { github: { pr: { title: "WIP: awesome feature" } } }
  return work_in_progress().then(() => {
    expect(dm.warn).toHaveBeenCalledWith("PR is classed as Work in Progress.")
  })
})

it("does not warn if title does not contain keyword WIP", () => {
  dm.danger = { github: { pr: { title: "awesome feature" } } }
  return work_in_progress().then(() => {
    expect(dm.warn).not.toHaveBeenCalled()
  })
})
