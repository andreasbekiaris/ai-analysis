const REPO = 'andreasbekiaris/ai-analysis'

// ── Gemini Google-Search helper ────────────────────────────────────────────────
async function geminiSearch(key, query, maxTokens = 2048) {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 45000)
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tools: [{ google_search: {} }],
          contents: [{ role: 'user', parts: [{ text: query }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: maxTokens },
        }),
      }
    )
    clearTimeout(timer)
    if (!res.ok) return ''
    const data = await res.json()
    const parts = data?.candidates?.[0]?.content?.parts || []
    return parts.map(p => p.text || '').join('').trim()
  } catch { return '' }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { dashboardFile, analysisTitle } = req.body || {}
  if (!dashboardFile) return res.status(400).json({ error: 'Missing dashboardFile' })

  const geminiKey = process.env.GEMINI_API_KEY
  const githubToken = process.env.GITHUB_TOKEN
  if (!geminiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' })
  if (!githubToken) return res.status(500).json({ error: 'GITHUB_TOKEN not configured' })

  // ── Read current file from GitHub ──────────────────────────────────────────
  const fileRes = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${dashboardFile}`,
    { headers: { Authorization: `Bearer ${githubToken}`, Accept: 'application/vnd.github+json' } }
  )
  if (!fileRes.ok) return res.status(502).json({ error: 'Failed to read dashboard file' })
  const fileData = await fileRes.json()
  const content = Buffer.from(fileData.content, 'base64').toString('utf8')

  const today = new Date().toISOString().slice(0, 10)
  const title = analysisTitle || dashboardFile

  // Extract previous data blocks
  const prevAnalysis = extractBlock(content, 'const analysisData')
  const prevSignals = extractBlock(content, 'const politicalComments')
  const prevVerdict = extractBlock(content, 'const strategicVerdict')
  const prevGaps = extractBlock(content, 'const analysisGaps')
  const actors = extractActors(content)

  // ── 5 parallel Gemini searches ─────────────────────────────────────────────
  const [pc1, pc2, signals, developments, expertViews] = await Promise.all([
    geminiSearch(geminiKey,
      `PRICE CHECK 1 — Live market prices for: "${title}". Today: ${today}. ` +
      `Search for: Brent crude oil spot, WTI crude, natural gas, gold, ` +
      `defense ETFs (XAR, ITA), and any commodities/equities tied to this situation. ` +
      `Return: Asset | Current Price | 24h Change | 7-day Change | Source.`
    ),
    geminiSearch(geminiKey,
      `PRICE CHECK 2 — Cross-verify for: "${title}". Date: ${today}. ` +
      `Independently confirm: Brent crude spot, WTI, natural gas futures, gold spot, ` +
      `major defense sector ETFs, and relevant equity indices. ` +
      `Return: Asset | Verified Price | Source URL or outlet.`
    ),
    geminiSearch(geminiKey,
      `Political signal intelligence for: "${title}". Date: ${today}. ` +
      `Search for ALL public statements, tweets, press conferences, official communications ` +
      `from key actors: ${actors.slice(0, 8).join(', ')}. Cover the last 7 days. ` +
      `Include: actor name, role, platform, exact date, direct quote, context, ` +
      `and whether it signals escalation, de-escalation, diplomatic opening, or economic measure. ` +
      `Be comprehensive — collect every significant statement.`,
      3000
    ),
    geminiSearch(geminiKey,
      `Comprehensive latest developments on: "${title}". Date: ${today}. ` +
      `Search for: military movements, diplomatic meetings, sanctions changes, ` +
      `UN resolutions, alliance shifts, humanitarian impacts, economic consequences, ` +
      `arms transfers, negotiations, ceasefire discussions, territorial changes. ` +
      `Cover the last 7 days. Include specific dates, verified numbers, and sources.`,
      3000
    ),
    geminiSearch(geminiKey,
      `Expert and think tank analysis of: "${title}". Date: ${today}. ` +
      `Search for recent analysis from: RAND, Brookings, CFR, IISS, Chatham House, ` +
      `Carnegie, CSIS, SIPRI, RUSI, ECFR, Lowy Institute. Also search for dissenting views. ` +
      `Include: expert name, affiliation, key assessment, probability estimates if given. ` +
      `Also search: former diplomats, ex-intelligence officials, regional analysts.`,
      3000
    ),
  ])

  // Return all fetched data to the frontend
  return res.status(200).json({
    success: true,
    dashboardFile,
    title,
    today,
    fileSha: fileData.sha,
    content,
    prevAnalysis: prevAnalysis.slice(0, 10000),
    prevSignals: prevSignals.slice(0, 6000),
    prevVerdict: prevVerdict.slice(0, 3000),
    prevGaps: prevGaps.slice(0, 1500),
    pc1: pc1.slice(0, 2000),
    pc2: pc2.slice(0, 2000),
    signals: signals.slice(0, 5000),
    developments: developments.slice(0, 5000),
    expertViews: expertViews.slice(0, 4000),
  })
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function extractActors(content) {
  const actorsSection = content.slice(0, content.indexOf('scenarios:') || content.length)
  return [...actorsSection.matchAll(/name:\s*["'`]([^"'`\n]{2,50})["'`]/g)]
    .map(m => m[1])
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .slice(0, 10)
}

function extractBlock(content, marker) {
  const start = content.indexOf(marker)
  if (start === -1) return '(not found in dashboard)'
  let i = start + marker.length
  while (i < content.length && content[i] !== '{' && content[i] !== '[') i++
  if (i >= content.length) return '(block not parseable)'
  const end = findBlockEnd(content, i)
  if (end === -1) return content.slice(start, start + 3000)
  return content.slice(start, end + 1)
}

function findBlockEnd(content, from) {
  let depth = 0, inString = false, stringChar = '', escaped = false
  for (let i = from; i < content.length; i++) {
    const c = content[i]
    if (escaped) { escaped = false; continue }
    if (c === '\\' && inString) { escaped = true; continue }
    if (inString) { if (c === stringChar) inString = false; continue }
    if (c === '"' || c === "'" || c === '`') { inString = true; stringChar = c; continue }
    if (c === '{' || c === '[') depth++
    else if (c === '}' || c === ']') { depth--; if (depth === 0) return i }
  }
  return -1
}
