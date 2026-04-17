// Schedule config API — reads + writes schedule.json in the repo via the GitHub API.
// Write path is password-gated via env var SCHEDULE_PASSWORD (default: 2905).

const REPO = 'andreasbekiaris/ai-analysis'
const BRANCH = 'main'
const FILE_PATH = 'schedule.json'

function ghHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
  }
}

async function readSchedule(token) {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`,
    { headers: ghHeaders(token) }
  )
  if (!res.ok) {
    if (res.status === 404) {
      return { schedule: null, sha: null }
    }
    throw new Error(`GitHub read failed: ${res.status} ${await res.text()}`)
  }
  const data = await res.json()
  const content = Buffer.from(data.content, 'base64').toString('utf8')
  return { schedule: JSON.parse(content), sha: data.sha }
}

async function writeScheduleFile(token, schedule, sha, commitMessage) {
  const content = Buffer.from(JSON.stringify(schedule, null, 2) + '\n', 'utf8').toString('base64')
  const body = {
    message: commitMessage,
    content,
    branch: BRANCH,
  }
  if (sha) body.sha = sha

  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`,
    { method: 'PUT', headers: ghHeaders(token), body: JSON.stringify(body) }
  )
  if (!res.ok) throw new Error(`GitHub write failed: ${res.status} ${await res.text()}`)
  return res.json()
}

export async function getScheduleHandler(req, res) {
  const token = process.env.GITHUB_TOKEN
  if (!token) return res.status(500).json({ error: 'GITHUB_TOKEN not configured' })
  try {
    const { schedule } = await readSchedule(token)
    return res.json({ schedule: schedule || { version: 1, dashboards: {}, bestPicks: { enabled: false, watchlist: [] } } })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export async function postScheduleHandler(req, res) {
  const expected = process.env.SCHEDULE_PASSWORD || '2905'
  const token = process.env.GITHUB_TOKEN
  if (!token) return res.status(500).json({ error: 'GITHUB_TOKEN not configured' })

  const { password, patch, commitMessage } = req.body || {}
  if (password !== expected) return res.status(401).json({ error: 'Invalid password' })
  if (!patch || typeof patch !== 'object') return res.status(400).json({ error: 'Missing patch object' })

  try {
    const { schedule, sha } = await readSchedule(token)
    const base = schedule || { version: 1, dashboards: {}, bestPicks: { enabled: false, watchlist: [] } }

    // Apply patch: shallow merge on top-level keys, deep merge for dashboards / bestPicks.
    const next = { ...base, updatedAt: new Date().toISOString() }
    if (patch.dashboards) {
      next.dashboards = { ...(base.dashboards || {}) }
      for (const [key, val] of Object.entries(patch.dashboards)) {
        if (val === null) delete next.dashboards[key]
        else next.dashboards[key] = { ...(next.dashboards[key] || {}), ...val }
      }
    }
    if (patch.bestPicks) {
      next.bestPicks = { ...(base.bestPicks || {}), ...patch.bestPicks }
    }

    const msg = commitMessage || 'chore: update schedule config'
    await writeScheduleFile(token, next, sha, msg)
    return res.json({ schedule: next })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
