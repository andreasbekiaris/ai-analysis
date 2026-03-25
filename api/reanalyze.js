const REPO = 'andreasbekiaris/ai-analysis'

// ── Gemini Google-Search helper ────────────────────────────────────────────────
async function geminiSearch(key, query) {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tools: [{ google_search: {} }],
          contents: [{ role: 'user', parts: [{ text: query }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 1024 },
        }),
      }
    )
    if (!res.ok) return ''
    const data = await res.json()
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
  } catch { return '' }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { dashboardFile, analysisTitle } = req.body || {}
  if (!dashboardFile) return res.status(400).json({ error: 'Missing dashboardFile' })

  const geminiKey = process.env.GEMINI_API_KEY
  const anthropicKey = process.env.ANTHROPIC_API_KEY
  const githubToken = process.env.GITHUB_TOKEN
  if (!geminiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' })
  if (!anthropicKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' })
  if (!githubToken) return res.status(500).json({ error: 'GITHUB_TOKEN not configured' })

  // ── Step 1: Read current file from GitHub ──────────────────────────────────
  const fileRes = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${dashboardFile}`,
    { headers: { Authorization: `Bearer ${githubToken}`, Accept: 'application/vnd.github+json' } }
  )
  if (!fileRes.ok) return res.status(502).json({ error: 'Failed to read dashboard file' })
  const fileData = await fileRes.json()
  const content = Buffer.from(fileData.content, 'base64').toString('utf8')

  const actors = extractActors(content)
  const scenarios = extractScenarios(content)
  const verdictText = extractVerdictText(content)
  const today = new Date().toISOString().slice(0, 10)
  const title = analysisTitle || dashboardFile

  // ── Step 2: 3 parallel Gemini searches (price ×2 + signals) ───────────────
  const [pc1Raw, pc2Raw, signalsRaw] = await Promise.all([
    geminiSearch(geminiKey,
      `PRICE CHECK 1 — Live market prices for analysis: "${title}". Today: ${today}. ` +
      `Search for: Brent crude oil spot price, WTI crude oil price, natural gas price, gold price, ` +
      `and any commodities or equities directly tied to this conflict. ` +
      `Return as a concise table: Asset | Current Price | 24h Change | Source.`
    ),
    geminiSearch(geminiKey,
      `PRICE CHECK 2 — Cross-verify market prices for: "${title}". Date: ${today}. ` +
      `Independently search and confirm: Brent crude spot, WTI crude, natural gas futures, gold spot, ` +
      `and major defense sector ETFs (XAR, ITA) or relevant equity indices. ` +
      `Return: Asset | Verified Price | Source URL or outlet.`
    ),
    geminiSearch(geminiKey,
      `Political signal intelligence for: "${title}". Date: ${today}. ` +
      `Search for statements, actions, or developments from the last 24 hours by: ${actors.slice(0, 8).join(', ')}. ` +
      `Return a JSON array. Each object: ` +
      `{ "actor": string, "role": string, "platform": string, "date": "YYYY-MM-DD", "time": string, ` +
      `"quote": string, "context": string, "signalType": "escalatory|de-escalatory|diplomatic|economic|ambiguous", ` +
      `"marketImpact": string, "scenarioImplication": string, "verified": true }. ` +
      `Return ONLY the JSON array, or [] if nothing new in 24h.`
    ),
  ])

  // Parse signals
  let freshSignals = []
  try {
    const clean = signalsRaw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
    const parsed = JSON.parse(clean)
    if (Array.isArray(parsed)) freshSignals = parsed.filter(s => s?.quote?.length > 5)
  } catch {
    const match = signalsRaw.match(/\[[\s\S]*\]/)
    if (match) try { freshSignals = JSON.parse(match[0]).filter(s => s?.quote?.length > 5) } catch { /* skip */ }
  }

  // Dedupe signals against existing content
  const existingKeys = new Set(
    [...content.matchAll(/quote:\s*["'`](.{0,60})/g)].map(m => m[1].toLowerCase())
  )
  const novelSignals = freshSignals.filter(
    s => !existingKeys.has((s.quote || '').slice(0, 60).toLowerCase())
  )

  // ── Step 3: Claude Opus comprehensive reanalysis ────────────────────────────
  const scenarioSummary = scenarios
    .map(s => `  - ID ${s.id}: "${s.name}" — currently ${s.probability}%`)
    .join('\n')

  const claudePrompt = `You are a senior geopolitical analyst performing a comprehensive daily reanalysis.

ANALYSIS: "${title}"
DATE: ${today}

CURRENT SCENARIO PROBABILITIES:
${scenarioSummary}

CURRENT VERDICT:
${verdictText.slice(0, 1200)}

GEMINI PRICE CHECK #1 (live Google Search, ${today}):
${pc1Raw.slice(0, 800) || '(unavailable)'}

GEMINI PRICE CHECK #2 (cross-verified, ${today}):
${pc2Raw.slice(0, 800) || '(unavailable)'}

NEW POLITICAL SIGNALS (last 24h, de-duped):
${novelSignals.length
  ? novelSignals.map(s => `  [${(s.signalType || 'ambiguous').toUpperCase()}] ${s.actor}: "${(s.quote || '').slice(0, 120)}"`).join('\n')
  : '  (none found — no change signals)'}

Produce a comprehensive JSON patch updating ALL data that has shifted.

{
  "updatedVerdict": {
    "stance": "MONITOR | ESCALATE CAUTION | REDUCE RISK | HOLD | RE-ASSESS",
    "stanceColor": "#f59e0b (amber) | #ef4444 (red) | #10b981 (green) | #06b6d4 (cyan)",
    "primaryScenario": "scenario name",
    "primaryProb": number,
    "timing": "short label e.g. Re-assess in 48h",
    "timingDetail": "2-3 sentences citing specific signals and verified prices",
    "immediateWatchpoints": [{"signal": "...", "timing": "...", "implication": "...", "urgency": "Critical|High|Medium"}],
    "marketPositioning": [{"asset": "...", "stance": "HOLD|ADD|REDUCE|AVOID|CAUTIOUS", "color": "#hex", "rationale": "..."}],
    "probabilityUpdate": "Scenario1 X% / Scenario2 Y% — Next trigger: ...",
    "conviction": "High|Medium-High|Medium|Low",
    "nextReview": "..."
  },
  "probabilityUpdates": [{"id": 1, "probability": 35}],
  "keyMetricsUpdates": [
    {"label": "Brent Crude Peak", "value": "$XX/bbl", "color": "#ef4444|#10b981|#f59e0b"}
  ],
  "priceSummary": "One sentence: what the verified prices confirm about current scenario probability"
}

RULES:
- All probabilities must sum to exactly 100
- Only include probabilityUpdates for scenarios that actually changed
- keyMetricsUpdates MUST reflect the verified prices from both price checks — use the consensus value
- updatedVerdict MUST reference specific new signals and price moves
- If no signals changed anything, keep same probabilities and note stability in verdict
- Return ONLY the JSON object — no markdown, no explanation`

  let patch = null
  try {
    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 3000,
        messages: [{ role: 'user', content: claudePrompt }],
      }),
    })
    if (claudeRes.ok) {
      const claudeData = await claudeRes.json()
      const text = claudeData?.content?.[0]?.text || ''
      const clean = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
      try { patch = JSON.parse(clean) } catch {
        const match = text.match(/\{[\s\S]*\}/)
        if (match) try { patch = JSON.parse(match[0]) } catch { /* skip */ }
      }
    }
  } catch { /* fall through */ }

  if (!patch) return res.status(502).json({ error: 'Claude Opus failed to generate analysis patch — try again' })

  // ── Step 4: Apply patch ────────────────────────────────────────────────────
  let newContent = content
  newContent = updateAnalysisDate(newContent, today)
  if (novelSignals.length > 0) newContent = prependSignals(newContent, novelSignals)
  if (patch.probabilityUpdates?.length) newContent = updateProbabilities(newContent, patch.probabilityUpdates)
  if (patch.updatedVerdict) newContent = replaceVerdictBlock(newContent, patch.updatedVerdict)
  if (patch.keyMetricsUpdates?.length) newContent = updateKeyMetrics(newContent, patch.keyMetricsUpdates)

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
        message: `refactor: reanalyze — ${title} (${today})`,
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
    signalsAdded: novelSignals.length,
    verdictUpdated: !!patch.updatedVerdict,
    probabilitiesChanged: patch.probabilityUpdates?.length || 0,
    metricsUpdated: patch.keyMetricsUpdates?.length || 0,
    priceSummary: patch.priceSummary || null,
    priceChecks: {
      check1: pc1Raw.slice(0, 300) || '(unavailable)',
      check2: pc2Raw.slice(0, 300) || '(unavailable)',
    },
    model: 'claude-opus-4-6',
    newStance: patch.updatedVerdict?.stance,
    newDate: today,
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

function extractScenarios(content) {
  const results = []
  const idRe = /\bid:\s*(\d+)/g
  let m
  while ((m = idRe.exec(content)) !== null) {
    const snippet = content.slice(m.index, m.index + 700)
    const nameM = snippet.match(/name:\s*["'`]([^"'`\n]+)["'`]/)
    const probM = snippet.match(/probability:\s*(\d+)/)
    if (nameM && probM) results.push({ id: Number(m[1]), name: nameM[1], probability: Number(probM[1]) })
  }
  return results.filter((s, i, arr) => arr.findIndex(x => x.id === s.id) === i)
}

function extractVerdictText(content) {
  const marker = 'const strategicVerdict = {'
  const start = content.indexOf(marker)
  if (start === -1) return ''
  const end = findBlockEnd(content, start + marker.length - 1)
  return end === -1 ? '' : content.slice(start, end + 1).slice(0, 1500)
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

function updateAnalysisDate(content, date) {
  const analysisStart = content.indexOf('const analysisData = {')
  if (analysisStart === -1) return content
  const analysisEnd = Math.min(analysisStart + 3000, content.length)
  const before = content.slice(0, analysisStart)
  const block = content.slice(analysisStart, analysisEnd)
  const after = content.slice(analysisEnd)
  return before + block.replace(/(\bdate:\s*)["'`][\d-]+["'`]/, `$1"${date}"`) + after
}

function prependSignals(content, signals) {
  const marker = 'const politicalComments = ['
  const pos = content.indexOf(marker)
  if (pos === -1) return content
  const after = pos + marker.length
  return content.slice(0, after) + '\n' + signals.map(formatSignalEntry).join(',\n') + ',' + content.slice(after)
}

function formatSignalEntry(s) {
  const q = v => JSON.stringify(String(v || ''))
  return `  {
    actor: ${q(s.actor)},
    role: ${q(s.role)},
    platform: ${q(s.platform)},
    date: ${q(s.date)},
    time: ${q(s.time || '')},
    quote: ${q(s.quote)},
    context: ${q(s.context || '')},
    signalType: ${q(s.signalType)},
    marketImpact: ${q(s.marketImpact || 'None observed')},
    scenarioImplication: ${q(s.scenarioImplication || '')},
    verified: ${s.verified === true ? 'true' : 'false'},
  }`
}

function updateProbabilities(content, updates) {
  let result = content
  for (const { id, probability } of updates) {
    const idIdx = result.search(new RegExp(`\\bid:\\s*${id}\\b`))
    if (idIdx === -1) continue
    const snippet = result.slice(idIdx, idIdx + 700)
    const updated = snippet.replace(/(\bprobability:\s*)\d+/, `$1${probability}`)
    result = result.slice(0, idIdx) + updated + result.slice(idIdx + 700)
  }
  return result
}

function replaceVerdictBlock(content, verdict) {
  const marker = 'const strategicVerdict = {'
  const start = content.indexOf(marker)
  if (start === -1) return content
  const braceStart = start + marker.length - 1
  const end = findBlockEnd(content, braceStart)
  if (end === -1) return content
  return content.slice(0, start) + 'const strategicVerdict = ' + jsStringify(verdict, 0) + content.slice(end + 1)
}

function updateKeyMetrics(content, updates) {
  let result = content
  for (const { label, value, color } of updates) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const labelRe = new RegExp(`["'\`]${escaped}["'\`]`)
    const idx = result.search(labelRe)
    if (idx === -1) continue

    // Update value within 300 chars after the label
    const start = idx
    const end = Math.min(result.length, idx + 300)
    let snippet = result.slice(start, end)
    snippet = snippet.replace(
      /(\bvalue:\s*)(?:"[^"\n]*"|'[^'\n]*'|`[^`\n]*`)/,
      `$1"${String(value).replace(/"/g, '\\"')}"`
    )
    if (color) {
      snippet = snippet.replace(
        /(\bcolor:\s*)(?:"[^"\n]*"|'[^'\n]*'|`[^`\n]*`)/,
        `$1"${color}"`
      )
    }
    result = result.slice(0, start) + snippet + result.slice(end)
  }
  return result
}

function jsStringify(val, depth) {
  const pad = '  '.repeat(depth)
  const inner = '  '.repeat(depth + 1)
  if (val === null || val === undefined) return 'null'
  if (typeof val === 'string') return JSON.stringify(val)
  if (typeof val === 'number' || typeof val === 'boolean') return String(val)
  if (Array.isArray(val)) {
    if (!val.length) return '[]'
    return `[\n${val.map(v => inner + jsStringify(v, depth + 1)).join(',\n')},\n${pad}]`
  }
  if (typeof val === 'object') {
    const entries = Object.entries(val).map(([k, v]) => `${inner}${k}: ${jsStringify(v, depth + 1)}`)
    if (!entries.length) return '{}'
    return `{\n${entries.join(',\n')},\n${pad}}`
  }
  return JSON.stringify(val)
}
