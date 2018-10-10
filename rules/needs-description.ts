import { danger, fail, message } from "danger"

export const needsDescription = () => {
  const pr = danger.github.pr
  if (pr.body === null || pr.body.length === 0) {
    fail("Please add a description to your PR.")
  } else {
    message("Nice. Thanks for adding a PR description.")
  }
}

export default async () => {
  needsDescription()
}