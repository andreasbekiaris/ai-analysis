const REPO = 'andreasbekiaris/ai-analysis'
const FILE = 'src/pages/HelpPage.jsx'

// Marker for each category array opening
const CATEGORY_MARKERS = {
  financial:    'financial: [',
  geopolitical: 'geopolitical: [',
  dashboard:    'dashboard: [',
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { term, full, definition, category } = req.body || {}
  if (!term || !full || !definition || !category) {
    return res.status(400).json({ error: 'Missing required fields: term, full, definition, category' })
  }

  const marker = CATEGORY_MARKERS[category]
  if (!marker) return res.status(400).json({ error: `Unknown category: ${category}` })

  const githubToken = process.env.GITHUB_TOKEN
  if (!githubToken) return res.status(500).json({ error: 'GITHUB_TOKEN not configured' })

  // ── Read current file ─────────────────────────────────────────────────────
  const fileRes = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${FILE}`,
    { headers: { Authorization: `Bearer ${githubToken}`, Accept: 'application/vnd.github+json' } }
  )
  if (!fileRes.ok) {
    const err = await fileRes.json().catch(() => ({}))
    return res.status(502).json({ error: `GitHub read failed: ${err.message || fileRes.status}` })
  }

  const fileData = await fileRes.json()
  const content = Buffer.from(fileData.content, 'base64').toString('utf8')

  // ── Dedupe check ──────────────────────────────────────────────────────────
  const termLower = term.toLowerCase()
  if (content.toLowerCase().includes(`term: '${termLower}'`) ||
      content.toLowerCase().includes(`term: "${termLower}"`)) {
    return res.status(409).json({ error: `Term "${term}" already exists in glossary` })
  }

  // ── Insert as first entry in the matching category array ──────────────────
  const insertPos = content.indexOf(marker)
  if (insertPos === -1) {
    return res.status(400).json({ error: `Category marker not found in file: ${marker}` })
  }

  const afterBracket = insertPos + marker.length
  const entry = formatEntry(term, full, definition)
  const newContent =
    content.slice(0, afterBracket) +
    '\n' + entry + ',' +
    content.slice(afterBracket)

  // ── Commit to GitHub ──────────────────────────────────────────────────────
  const commitRes = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${FILE}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `feat: add glossary term — ${term} (${category})`,
        content: Buffer.from(newContent).toString('base64'),
        sha: fileData.sha,
      }),
    }
  )

  if (!commitRes.ok) {
    const err = await commitRes.json().catch(() => ({}))
    return res.status(502).json({ error: `GitHub commit failed: ${err.message || commitRes.status}` })
  }

  return res.status(200).json({ saved: true, term, category })
}

function formatEntry(term, full, definition) {
  const q = (v) => JSON.stringify(String(v || ''))
  return `    { term: ${q(term)}, full: ${q(full)}, definition: ${q(definition)} }`
}
