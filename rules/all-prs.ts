import { danger, fail } from "danger"
import { wrap } from "../rules/_wrap"

export const needs_description = wrap("Every PR requires a description", () => {
  const pr = danger.github.pr
  if (pr.body === null || pr.body.length === 0) {
    fail("Please add a description to your PR.")
  }
})
