jest.mock("danger", () => jest.fn())
import * as danger from "danger"
const dm = danger as any

import { testsUpdated } from "../rules/all-prs"

beforeEach(() => {
  dm.danger = {}
  dm.warn = jest.fn()
})

it("warns when code was changed and tests were not updated", () => {
  dm.danger.git = {
    modified_files: ["head/shipments/model/shipment.py"],
    created_files: [],
  }

  testsUpdated()
  expect(dm.warn).toHaveBeenCalled()
})

it("warns when new code file was created and tests were not updated", () => {
  dm.danger.git = {
    modified_files: [],
    created_files: ["head/shipments/model/shipment.py"],
  }

  testsUpdated()
  expect(dm.warn).toHaveBeenCalled()
})

it("does not warn when new code file was created and tests were also updated", () => {
  dm.danger.git = {
    modified_files: [],
    created_files: ["head/shipments/model/shipment.py", "head/shipments/model/shipment_test.py"],
  }

  testsUpdated()
  expect(dm.warn).not.toHaveBeenCalled()
})

it("does not warn when code was changed and tests were also updated", () => {
  dm.danger.git = {
    modified_files: ["head/shipments/model/shipment.py", "head/shipments/model/shipment_test.py"],
    created_files: [],
  }

  testsUpdated()
  expect(dm.warn).not.toHaveBeenCalled()
})
