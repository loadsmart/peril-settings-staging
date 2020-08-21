// based on markAsMergeOnGreen.ts

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

// If a comment to an issue contains "automerge", apply a label for it to mark it ready to join the merge queue.
const markAsAutomerge = async (issueComment: IssueComment) => {
  console.info("Starting rule to mark as automerge")

  const issue = issueComment.issue
  const comment = issueComment.comment
  const api = danger.github.api

  // Only look at PR issue comments, this isn't in the type system
  if (!(issue as any).pull_request) {
    console.info("Not a Pull Request. Ignoring 'Mark as automerge' rule.")
    return
  }

  // Don't do any work unless we have to
  const keywords = ["automerge", "soh dale", "ship it"]
  const match = keywords.find(k => comment.body.trim().toLowerCase() === k)
  if (!match) {
    console.info("Did not find any of the 'automerge' phrases in the comment: ", comment.body.toLocaleLowerCase())
    return
  }

  // Check to see if the label has already been set
  if (issue.labels.find(l => l.name === "automerge")) {
    console.info("Already has automerge label")
    return
  }

  const sender = comment.user
  const username = sender.login
  const org = issueComment.repository.owner.login

  // Create or re-use an existing label
  const owner = org
  const repo = issueComment.repository.name
  const existingLabels = await api.issues.listLabelsForRepo({ owner, repo })
  const automerge = existingLabels.data.find((l: Label) => l.name == "automerge")

  // Create the label if it doesn't exist yet
  if (!automerge) {
    await api.issues.createLabel({
      owner,
      repo,
      name: "automerge",
      color: "247A38",
      description: "A label to indicate that the PR is ready to join the merge queue",
    } as any)
  }

  // Then add the label
  await api.issues.addLabels({ owner, repo, number: issue.number, labels: ["automerge"] })
  console.log("Updated the PR with a automerge label")
}

export default markAsAutomerge
