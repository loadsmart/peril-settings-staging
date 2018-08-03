jest.mock("danger", () => jest.fn())
import * as danger from "danger"
const dm = danger as any

import { viewFilesWereChanged } from "../rules/ios-prs"

beforeEach(() => {
  dm.danger = {}
  dm.warn = jest.fn()
})

it("warns when code has changes on xib files and PR has no description", () => {
  dm.danger.git = {
    modified_files: ["MyAwesome.xib"],
    created_files: [],
  }
  dm.danger.github = {
    pr: {
      body: "Not a screenshot",
    },
  }

  viewFilesWereChanged()
  expect(dm.warn).toHaveBeenCalledWith("View files were changed. Maybe you want to add a screenshot to your PR.")
})

it("warns when code has changes on storyboard files and PR has no description", () => {
  dm.danger.git = {
    modified_files: ["MyAwesome.storyboard"],
    created_files: [],
  }
  dm.danger.github = {
    pr: {
      body: "Not a screenshot",
    },
  }

  viewFilesWereChanged()
  expect(dm.warn).toHaveBeenCalledWith("View files were changed. Maybe you want to add a screenshot to your PR.")
})

it("warns when code has changes on view files and PR has no description", () => {
  dm.danger.git = {
    modified_files: ["MyAwesomeView.swift"],
    created_files: [],
  }
  dm.danger.github = {
    pr: {
      body: "Not a screenshot",
    },
  }

  viewFilesWereChanged()
  expect(dm.warn).toHaveBeenCalledWith("View files were changed. Maybe you want to add a screenshot to your PR.")
})

it("warns when code has changes on button files and PR has no description", () => {
  dm.danger.git = {
    modified_files: ["MyAwesomeButton.swift"],
    created_files: [],
  }
  dm.danger.github = {
    pr: {
      body: "Not a screenshot",
    },
  }

  viewFilesWereChanged()
  expect(dm.warn).toHaveBeenCalledWith("View files were changed. Maybe you want to add a screenshot to your PR.")
})

it("warns when code has changes in a file inside /view/ directory", () => {
  dm.danger.git = {
    modified_files: ["/Some/Path/View/File.swift"],
    created_files: [],
  }
  dm.danger.github = {
    pr: {
      body: "Not a screenshot",
    },
  }

  viewFilesWereChanged()
  expect(dm.warn).toHaveBeenCalledWith("View files were changed. Maybe you want to add a screenshot to your PR.")
})

it("warns when code has changes in a file inside /views/ directory", () => {
  dm.danger.git = {
    modified_files: ["/Some/Path/Views/File.swift"],
    created_files: [],
  }
  dm.danger.github = {
    pr: {
      body: "Not a screenshot",
    },
  }

  viewFilesWereChanged()
  expect(dm.warn).toHaveBeenCalledWith("View files were changed. Maybe you want to add a screenshot to your PR.")
})

it("does not warn when code has view changes and PR has a screenshot", () => {
  dm.danger.git = {
    modified_files: ["MyAwesome.xib"],
    created_files: [],
  }
  dm.danger.github = {
    pr: {
      body: "![ls](https://user-images.githubusercontent.com/235208/37855446-b8449314-2ec5-11e8-9137-3ccee53f5c54.png)",
    },
  }

  viewFilesWereChanged()
  expect(dm.warn).not.toHaveBeenCalled()
})

it("does not warn when code has view changes and PR has a snapshot test", () => {
  dm.danger.git = {
    modified_files: ["MyAwesome.xib"],
    created_files: ["ShipmentHeaderViewSpec/view__when_shipment_has_temperature_set__has_a_valid_snapshot@2x.png"],
  }
  dm.danger.github = {
    pr: {
      body: "Not a screenshot",
    },
  }

  viewFilesWereChanged()
  expect(dm.warn).not.toHaveBeenCalled()
})

it("does not warn when code has no view changes", () => {
  dm.danger.git = {
    modified_files: ["MyAwesome.swift"],
    created_files: [],
  }
  dm.danger.github = {
    pr: {
      body: "![ls](https://user-images.githubusercontent.com/235208/37855446-b8449314-2ec5-11e8-9137-3ccee53f5c54.png)",
    },
  }

  viewFilesWereChanged()
  expect(dm.warn).not.toHaveBeenCalled()
})
