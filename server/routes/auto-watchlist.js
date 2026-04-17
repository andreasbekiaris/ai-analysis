// Auto-watchlist dispatch — creates a GitHub issue that the watcher picks up.
// The watcher runs Claude Code with buildAutoWatchlistPrompt() and commits the
// resulting additions to schedule.json → bestPicks.watchlist.

const REPO = 'andreasbekiaris/ai-analysis'
const VALID_SCOPES = new Set(['GLOBAL', 'GR', 'US', 'GB'])

export async function autoWatchlistHandler(req, res) {
  const expectedPassword = process.env.SCHEDULE_PASSWORD || '2905'
  const token = process.env.GITHUB_TOKEN
  if (!token) return res.status(500).json({ error: 'GITHUB_TOKEN not configured' })

  const { password, scope } = req.body || {}
  if (password !== expectedPassword) return res.status(401).json({ error: 'Invalid password' })

  const normalized = String(scope || 'GLOBAL').toUpperCase()
  if (!VALID_SCOPES.has(normalized)) {
    return res.status(400).json({ error: `Invalid scope '${scope}'. Must be one of: GLOBAL, GR, US, GB` })
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
          title: `AutoWatchlist: ${normalized}`,
          body: `Automated watchlist research request — scope ${normalized}.\n\nThe watcher will run Claude Code to identify 10–15 top-quality tickers and append them to schedule.json.`,
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
      scope: normalized,
      issueNumber: issue.number,
      issueUrl: issue.html_url,
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
