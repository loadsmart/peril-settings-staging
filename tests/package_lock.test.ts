jest.mock("danger", () => jest.fn())
import * as danger from "danger"
const dm = danger as any

import { packageLock } from "../rules/js-prs"

beforeEach(() => {
  dm.danger = {}
  dm.warn = jest.fn()
})

it("warns when package.json was modified and package-lock.json was not", () => {
  dm.danger.git = {
    modified_files: ["package.json"],
  }

  return packageLock().then(() => {
    expect(dm.warn).toHaveBeenCalledWith(
      "package.json was modified and package-lock.json was not. Please update your JS dependencies"
    )
  })
})

it("does not warn when package.json was modified and package-lock.json too", () => {
  dm.danger.git = {
    modified_files: ["package.json", "package-lock.json"],
  }

  return packageLock().then(() => {
    expect(dm.warn).not.toHaveBeenCalled()
  })
})
