// Best-picks dispatch — creates a GitHub issue that the watcher picks up.
// The watcher runs Claude Code with buildBestPicksPrompt() and commits the
// resulting data to src/data/best-picks.json.

const REPO = 'andreasbekiaris/ai-analysis'
const VALID_RUN_TYPES = new Set(['manual', 'morning', 'after-close'])

export async function bestPicksDispatchHandler(req, res) {
  const expectedPassword = process.env.SCHEDULE_PASSWORD || '2905'
  const token = process.env.GITHUB_TOKEN
  if (!token) return res.status(500).json({ error: 'GITHUB_TOKEN not configured' })

  const { password, runType } = req.body || {}
  if (password !== expectedPassword) return res.status(401).json({ error: 'Invalid password' })

  const normalized = String(runType || 'manual').toLowerCase()
  if (!VALID_RUN_TYPES.has(normalized)) {
    return res.status(400).json({ error: `Invalid runType '${runType}'. Must be one of: manual, morning, after-close` })
  }

  try {
    const issueRes = await fetch(
      `https://api.github.com/repos/${REPO}/issues`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `BestPicks: ${normalized}`,
          body: `Manual best-picks screening dispatch.\n\nThe watcher will run Claude Code to refresh src/data/best-picks.json with the top 3 buy + top 3 short candidates per region.`,
        }),
      }
    )
    if (!issueRes.ok) {
      const text = await issueRes.text()
      throw new Error(`GitHub issue create failed: ${issueRes.status} ${text}`)
    }
    const issue = await issueRes.json()
    return res.json({
      ok: true,
      runType: normalized,
      issueNumber: issue.number,
      issueUrl: issue.html_url,
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
