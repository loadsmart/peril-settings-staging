import { schedule, danger, fail, warn } from "danger"

// The inspiration for this is https://github.com/artsy/artsy-danger/blob/f019ee1a3abffabad65014afabe07cb9a12274e7/org/all-prs.ts
const isJest = typeof jest !== "undefined"

// Stores the parameter in a closure that can be invoked in tests.
const _test = (reason: string, closure: () => void | Promise<any>) =>
  // We return a closure here so that the (promise is resolved|closure is invoked)
  // during test time and not when we call wrap().
  () => (closure instanceof Promise ? closure : Promise.resolve(closure()))

// Either schedules the promise for execution via Danger, or invokes closure.
const _run = (reason: string, closure: () => void | Promise<any>) =>
  closure instanceof Promise ? schedule(closure) : closure()

export const wrap: any = isJest ? _test : _run

export const needs_description = wrap("Every PR requires a description", () => {
  const pr = danger.github.pr
  if (pr.body === null || pr.body.length === 0) {
    fail("Please add a description to your PR.")
  }
})

export const work_in_progress = wrap("Do not merge it yet. PR is still in progress.", () => {
  const pr = danger.github.pr
  const wipPR = pr.title.toLowerCase().includes("wip")
  if (wipPR) {
    warn("PR is classed as Work in Progress.")
  }
})

import spellcheck from "danger-plugin-spellcheck"
wrap("Keep our Markdown documents awesome", async () => {
  await spellcheck({ settings: "loadsmart/peril-settings@spellcheck.json" })
})
