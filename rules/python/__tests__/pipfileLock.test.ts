jest.mock("danger", () => jest.fn())
import * as danger from "danger"
const dm = danger as any

import pipfileLock from "../pipfileLock"

beforeEach(() => {
  dm.danger = {}
  dm.warn = jest.fn()
})

it("warns when Pipfile was modified and Pipfile.lock was not", () => {
  dm.danger.git = {
    modified_files: ["Pipfile"],
  }

  pipfileLock()
  expect(dm.warn).toHaveBeenCalledWith(
    "Pipfile was modified and Pipfile.lock was not. Please update your Python dependencies"
  )
})

it("does not warn when both Pipfile and Pipfile.lock were modified", () => {
  dm.danger.git = {
    modified_files: ["Pipfile", "Pipfile.lock"],
  }

  pipfileLock()
  expect(dm.warn).not.toHaveBeenCalled()
})

it("does not warn when both Pipfile and Pipfile.lock were modified", () => {
  dm.danger.git = {
    modified_files: ["Something else"],
  }

  pipfileLock()
  expect(dm.warn).not.toHaveBeenCalled()
})
