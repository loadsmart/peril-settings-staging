function _pad(number) {
  if (number < 10) {
    return "0" + number
  }
  return number
}

function _formatDate(dt) {
  return (
    dt.getUTCFullYear() +
    "-" +
    _pad(dt.getUTCMonth() + 1) +
    "-" +
    _pad(dt.getUTCDate()) +
    "T" +
    _pad(dt.getUTCHours()) +
    ":" +
    _pad(dt.getUTCMinutes()) +
    ":" +
    _pad(dt.getUTCSeconds()) +
    "Z"
  )
}

async function fail(danger, opts) {
  const pr = danger.github.pr
  const thisPR = danger.github.thisPR
  const commits = danger.github.commits
  const lastCommit = commits[commits.length - 1].sha

  const response = await danger.github.api.checks.create({
    owner: thisPR.owner,
    repo: thisPR.repo,
    head_branch: pr.head,
    head_sha: lastCommit,
    name: opts.name || opts.title,
    status: "completed",
    conclusion: "failure",
    completed_at: _formatDate(new Date()),
    output: {
      title: opts.title,
      summary: opts.summary,
      text: opts.text,
    },
  })

  console.log("GitHub Checks Create API:", response.meta.status)
}
