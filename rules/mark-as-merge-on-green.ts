// original source: https://github.com/danger/peril-settings/blob/master/org/markAsMergeOnGreen.ts

import { danger } from "danger"
import { IssueComment } from "github-webhook-event-types"

// The shape of a label
interface Label {
  id: number
  url: string
  name: string
  description: string
  color: string
  default: boolean
}

/** If a comment to an issue contains "merge-on-green", apply a label for it to be merged when green. */
export default async (issueComment: IssueComment) => {
  console.info("Starting rule to mark as merge on green")

  const issue = issueComment.issue
  const comment = issueComment.comment
  const api = danger.github.api

  // Only look at PR issue comments, this isn't in the type system
  if (!(issue as any).pull_request) {
    console.error("Not a Pull Request")
    return
  }

  // Don't do any work unless we have to
  const keywords = ["merge on green", "merge on ci green"]
  const match = keywords.find(k => comment.body.toLowerCase().includes(k))
  if (!match) {
    console.error("Did not find any of the phrases in the comment: ", comment.body.toLocaleLowerCase())
    return
  }

  // Check to see if the label has already been set
  if (issue.labels.find(l => l.name === "merge-on-green")) {
    console.error("Already has merge-on-green")
    return
  }

  const sender = comment.user
  const username = sender.login
  const org = issueComment.repository.owner.login

  // Create or re-use an existing label
  const owner = org
  const repo = issueComment.repository.name
  const existingLabels = await api.issues.getLabels({ owner, repo })
  const mergeOnGreen = existingLabels.data.find((l: Label) => l.name == "merge-on-green")

  // Create the label if it doesn't exist yet
  if (!mergeOnGreen) {
    const newLabel = await api.issues.createLabel({
      owner,
      repo,
      name: "merge-on-green",
      color: "247A38",
      description: "A label to indicate that Peril should merge this PR when all statuses are green",
    } as any)
  }

  // Then add the label
  await api.issues.addLabels({ owner, repo, number: issue.number, labels: ["merge-on-green"] })
  console.log("Updated the PR with a merge-on-green label")
}
