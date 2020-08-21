import needsDescription from "./needsDescription"
import workInProgress from "./workInProgress"
import mergeCommits from "./mergeCommits"
import changelog from "./changelog"
import testsUpdated from "./testsUpdated"

// Default run
export default async () => {
  needsDescription()
  workInProgress()
  mergeCommits()
  await changelog()
  testsUpdated()
}
