const REPO = 'andreasbekiaris/ai-analysis'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { dashboardFile, analysisTitle, ticker } = req.body || {}
  if (!dashboardFile) return res.status(400).json({ error: 'Missing dashboardFile' })

  const geminiKey = process.env.GEMINI_API_KEY
  const githubToken = process.env.GITHUB_TOKEN
  if (!geminiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' })
  if (!githubToken) return res.status(500).json({ error: 'GITHUB_TOKEN not configured' })

  // ── Step 1: Read current file from GitHub ─────────────────────────────────
  const fileRes = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${dashboardFile}`,
    { headers: { Authorization: `Bearer ${githubToken}`, Accept: 'application/vnd.github+json' } }
  )
  if (!fileRes.ok) return res.status(502).json({ error: 'Failed to read dashboard file' })

  const fileData = await fileRes.json()
  const content = Buffer.from(fileData.content, 'base64').toString('utf8')

  const verdictText = extractVerdictText(content)

  // ── Step 2: Fetch fresh news (last 24h) ───────────────────────────────────
  let freshNews = []
  try {
    const newsRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tools: [{ google_search: {} }],
          contents: [{
            role: 'user',
            parts: [{
              text: `Financial news update for ${analysisTitle || ticker || dashboardFile}.

Search for news about ${ticker ? `stock ticker ${ticker}` : analysisTitle} from the last 24 hours.

Return a JSON array. Each object:
{ "headline": string, "source": string, "date": "YYYY-MM-DD", "url": string or "", "sentiment": "positive"|"neutral"|"negative", "summary": string }

Return ONLY the JSON array. If nothing new in 24h, return [].`,
            }],
          }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 2048 },
        }),
      }
    )
    if (newsRes.ok) {
      const newsData = await newsRes.json()
      const text = newsData?.candidates?.[0]?.content?.parts?.[0]?.text || ''
      const clean = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
      try {
        const parsed = JSON.parse(clean)
        if (Array.isArray(parsed)) freshNews = parsed.filter(n => n?.headline?.length > 5)
      } catch {
        const match = text.match(/\[[\s\S]*\]/)
        if (match) {
          try { freshNews = JSON.parse(match[0]).filter(n => n?.headline?.length > 5) } catch { /* skip */ }
        }
      }
    }
  } catch { /* news optional — continue */ }

  // Dedupe against existing headlines
  const existingKeys = new Set(
    [...content.matchAll(/headline:\s*["'`](.{0,80})/g)].map(m => m[1].toLowerCase().slice(0, 60))
  )
  const novelNews = freshNews.filter(
    n => !existingKeys.has((n.headline || '').slice(0, 60).toLowerCase())
  )

  // ── Step 3: Generate verdict patch ────────────────────────────────────────
  const newsSummary = novelNews.length
    ? novelNews.map(n => `  [${(n.sentiment || 'neutral').toUpperCase()}] ${n.source}: "${n.headline}"`).join('\n')
    : '  (no new material news in last 24h)'

  const patchPrompt = `You are a senior equity analyst performing a cost-efficient daily update for a stock analysis dashboard.

STOCK: "${analysisTitle || ticker}"

CURRENT VERDICT SUMMARY:
${verdictText.slice(0, 800)}

NEW NEWS (last 24h):
${newsSummary}

Produce ONLY a JSON patch object with the minimum necessary updates to the verdict:
{
  "updatedVerdict": {
    "stance": "e.g. CAUTIOUS BUY | HOLD | REDUCE | MONITOR | BUY | AVOID",
    "stanceColor": "#hex — amber #f59e0b | red #ef4444 | green #10b981 | cyan #06b6d4",
    "stanceBg": "rgba() — match stanceColor with 0.1 opacity",
    "timing": "short label e.g. Hold — await Q1 earnings",
    "timingDetail": "1-2 sentences on what to watch and why timing matters now",
    "conviction": "High|Medium-High|Medium|Low"
  }
}

Rules:
- If no material news, keep the same stance and note no change in timingDetail
- Verdict MUST reference specific news items if any were found
- Return ONLY the JSON object — no markdown, no explanation`

  let patch = null
  try {
    const patchRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: patchPrompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 1024 },
        }),
      }
    )
    if (patchRes.ok) {
      const patchData = await patchRes.json()
      const text = patchData?.candidates?.[0]?.content?.parts?.[0]?.text || ''
      const clean = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
      try {
        patch = JSON.parse(clean)
      } catch {
        const match = text.match(/\{[\s\S]*\}/)
        if (match) try { patch = JSON.parse(match[0]) } catch { /* skip */ }
      }
    }
  } catch { /* fall through */ }

  if (!patch) {
    return res.status(502).json({ error: 'Failed to generate analysis patch — try again' })
  }

  // ── Step 4: Apply patch to file ───────────────────────────────────────────
  let newContent = content
  const today = new Date().toISOString().slice(0, 10)

  if (novelNews.length > 0) {
    newContent = prependNewsItems(newContent, novelNews)
  }

  if (patch.updatedVerdict) {
    newContent = patchVerdictFields(newContent, patch.updatedVerdict)
  }

  // ── Step 5: Commit to GitHub ───────────────────────────────────────────────
  const commitRes = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${dashboardFile}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `refactor: reanalyze stock — ${analysisTitle || ticker} (${today})`,
        content: Buffer.from(newContent).toString('base64'),
        sha: fileData.sha,
      }),
    }
  )

  if (!commitRes.ok) {
    const err = await commitRes.json().catch(() => ({}))
    return res.status(502).json({ error: `GitHub commit failed: ${err.message || commitRes.status}` })
  }

  return res.status(200).json({
    success: true,
    newsAdded: novelNews.length,
    verdictUpdated: !!patch.updatedVerdict,
    newStance: patch.updatedVerdict?.stance,
    newDate: today,
  })
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function extractVerdictText(content) {
  const marker = 'const verdict = {'
  const start = content.indexOf(marker)
  if (start === -1) return ''
  return content.slice(start, start + 1200)
}

function prependNewsItems(content, news) {
  const marker = 'const newsItems = ['
  const pos = content.indexOf(marker)
  if (pos === -1) return content
  const after = pos + marker.length
  const entries = news.map(formatNewsEntry).join(',\n') + ','
  return content.slice(0, after) + '\n' + entries + content.slice(after)
}

function formatNewsEntry(n) {
  const q = v => JSON.stringify(String(v || ''))
  return `  {
    headline: ${q(n.headline)},
    source: ${q(n.source)},
    date: ${q(n.date)},
    url: ${q(n.url || '')},
    sentiment: ${q(n.sentiment)},
  }`
}

function patchVerdictFields(content, v) {
  const marker = 'const verdict = {'
  const start = content.indexOf(marker)
  if (start === -1) return content
  const end = findBlockEnd(content, start + marker.length - 1)
  if (end === -1) return content

  let block = content.slice(start, end + 1)

  const fields = ['stance', 'stanceColor', 'stanceBg', 'timing', 'timingDetail', 'conviction']
  for (const field of fields) {
    if (v[field] == null) continue
    const escaped = String(v[field]).replace(/\\/g, '\\\\').replace(/"/g, '\\"')
    // Replace single-line string value for this field
    block = block.replace(
      new RegExp(`(\\b${field}:\\s*)["'][^"'\\n]*["']`),
      `$1"${escaped}"`
    )
  }

  return content.slice(0, start) + block + content.slice(end + 1)
}

function findBlockEnd(content, from) {
  let depth = 0
  let inString = false
  let stringChar = ''
  let escaped = false

  for (let i = from; i < content.length; i++) {
    const c = content[i]
    if (escaped) { escaped = false; continue }
    if (c === '\\' && inString) { escaped = true; continue }
    if (inString) {
      if (c === stringChar) inString = false
      continue
    }
    if (c === '"' || c === "'" || c === '`') { inString = true; stringChar = c; continue }
    if (c === '{' || c === '[') depth++
    else if (c === '}' || c === ']') {
      depth--
      if (depth === 0) return i
    }
  }
  return -1
}
