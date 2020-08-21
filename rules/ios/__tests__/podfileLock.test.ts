jest.mock("danger", () => jest.fn())
import * as danger from "danger"
const dm = danger as any

import podfileLock from "../podfileLock"

beforeEach(() => {
  dm.danger = {}
  dm.warn = jest.fn()
})

it("warns when Podfile was modified and Podfile.lock was not", () => {
  dm.danger.git = {
    modified_files: ["Podfile"],
  }

  podfileLock()
  expect(dm.warn).toHaveBeenCalledWith("Podfile was modified and Podfile.lock was not. Please update your lock file.")
})

it("does not warn when both Podfile and Podfile.lock were modified", () => {
  dm.danger.git = {
    modified_files: ["Podfile", "Podfile.lock"],
  }

  podfileLock()
  expect(dm.warn).not.toHaveBeenCalled()
})

it("does not warn when neither Podfile nor Podfile.lock were modified", () => {
  dm.danger.git = {
    modified_files: ["Dummy.swift"],
  }

  podfileLock()
  expect(dm.warn).not.toHaveBeenCalled()
})
