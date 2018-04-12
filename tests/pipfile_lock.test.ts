jest.mock("danger", () => jest.fn())
import * as danger from "danger"
const dm = danger as any

import { pipfileLock } from "../rules/python-prs"

beforeEach(() => {
  dm.danger = {}
  dm.warn = jest.fn()
})

it("warns when Pipfile was modified and Pipfile.lock was not", () => {
  dm.danger.git = {
    modified_files: ["Pipfile"],
  }

  return pipfileLock().then(() => {
    expect(dm.warn).toHaveBeenCalledWith(
      "Pipfile was modified and Pipfile.lock was not. Please update your Python dependencies"
    )
  })
})

it("does not warn when both Pipfile and Pipfile.lock were modified", () => {
  dm.danger.git = {
    modified_files: ["Pipfile", "Pipfile.lock"],
  }

  return pipfileLock().then(() => {
    expect(dm.warn).not.toHaveBeenCalled()
  })
})
