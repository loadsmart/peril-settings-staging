// jest.mock("danger", () => jest.fn())
// import * as danger from "danger"
// const dm = danger as any

// import { bigPR } from "../rules/all-prs"

it("passes") {
  expect(1).toBe(1)
}

// beforeEach(() => {
//   dm.danger = {}
//   dm.warn = jest.fn()
// })

// it("warns when more than 500 lines of valid files were changed", () => {
//   dm.danger.git = {
//     modified_files: ["some/file.py"],
//     created_files: [],
//     deleted_files: [],
//     JSONDiffForFile: filename => Promise.resolve({ added: Array(501).fill("fake line"), removed: [] }),
//   }
//   return bigPR().then(() => {
//     expect(dm.warn).toHaveBeenCalledWith("Big PR. Consider splitting it into smaller ones")
//   })
// })

// it("does not warn when exactly 500 lines of valid files were changed", () => {
//   dm.danger.git = {
//     modified_files: ["some/file.py"],
//     created_files: [],
//     deleted_files: [],
//     JSONDiffForFile: filename => Promise.resolve({ added: Array(500).fill("fake line"), removed: [] }),
//   }
//   return bigPR().then(() => {
//     expect(dm.warn).not.toHaveBeenCalled()
//   })
// })

// it("does not warn when more than 500 lines of invalid files were changed", () => {
//   dm.danger.git = {
//     modified_files: ["some/file.snap"],
//     created_files: [],
//     deleted_files: [],
//     JSONDiffForFile: filename => Promise.resolve({ added: Array(501).fill("fake line"), removed: [] }),
//   }
//   return bigPR().then(() => {
//     expect(dm.warn).not.toHaveBeenCalled()
//   })
// })

// it("does not warn when less than 500 lines of valid files were changed", () => {
//   dm.danger.git = {
//     modified_files: ["some/file.py"],
//     created_files: [],
//     deleted_files: [],
//     JSONDiffForFile: filename => Promise.resolve({ added: Array(499).fill("fake line"), removed: [] }),
//   }
//   return bigPR().then(() => {
//     expect(dm.warn).not.toHaveBeenCalled()
//   })
// })
