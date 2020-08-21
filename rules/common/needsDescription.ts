import { danger, fail } from "danger"

// Every PR requires a description
const needsDescription = () => {
  const pr = danger.github.pr
  if (pr.body === null || pr.body.length === 0) {
    fail("Please add a description to your PR.")
  }
}

export default needsDescription
