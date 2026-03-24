const REPO = 'andreasbekiaris/ai-analysis'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { dashboardFile, analysisTitle } = req.body || {}
  if (!dashboardFile) return res.status(400).json({ error: 'Missing dashboardFile' })

  const geminiKey = process.env.GEMINI_API_KEY
  const githubToken = process.env.GITHUB_TOKEN
  if (!geminiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' })
  if (!githubToken) return res.status(500).json({ error: 'GITHUB_TOKEN not configured' })

  // ── Step 1: Read current file from GitHub ──────────────────────────────────
  const fileRes = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${dashboardFile}`,
    { headers: { Authorization: `Bearer ${githubToken}`, Accept: 'application/vnd.github+json' } }
  )
  if (!fileRes.ok) return res.status(502).json({ error: 'Failed to read dashboard file' })

  const fileData = await fileRes.json()
  const content = Buffer.from(fileData.content, 'base64').toString('utf8')

  // ── Step 2: Extract context from current file ──────────────────────────────
  const actors = extractActors(content)
  const scenarios = extractScenarios(content)
  const verdictText = extractVerdictText(content)

  // ── Step 3: Fetch fresh signals (last 24h) — cost-efficient window ─────────
  let freshSignals = []
  try {
    const sigRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tools: [{ google_search: {} }],
          contents: [{
            role: 'user',
            parts: [{
              text: `Political signal intelligence update for: "${analysisTitle || dashboardFile}"

Search for statements, actions, or developments from the last 24 hours by these key actors: ${actors.slice(0, 8).join(', ')}

Return a JSON array of new signals (only last 24h). Each object:
{ "actor": string, "role": string, "platform": string, "date": "YYYY-MM-DD", "time": string, "quote": string, "context": string, "signalType": "escalatory"|"de-escalatory"|"diplomatic"|"economic"|"ambiguous", "marketImpact": string, "scenarioImplication": string, "verified": boolean }

Return ONLY the JSON array. If nothing new in 24h, return [].`,
            }],
          }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 2048 },
        }),
      }
    )
    if (sigRes.ok) {
      const sigData = await sigRes.json()
      const text = sigData?.candidates?.[0]?.content?.parts?.[0]?.text || ''
      const clean = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
      try {
        const parsed = JSON.parse(clean)
        if (Array.isArray(parsed)) freshSignals = parsed.filter(s => s?.quote?.length > 5)
      } catch {
        const match = text.match(/\[[\s\S]*\]/)
        if (match) {
          try { freshSignals = JSON.parse(match[0]).filter(s => s?.quote?.length > 5) } catch { /* skip */ }
        }
      }
    }
  } catch { /* signals are optional — continue */ }

  // Filter out signals already in the file (dedupe by quote prefix)
  const existingKeys = new Set(
    [...content.matchAll(/quote:\s*["'`](.{0,60})/g)].map(m => m[1].toLowerCase())
  )
  const novelSignals = freshSignals.filter(
    s => !existingKeys.has((s.quote || '').slice(0, 60).toLowerCase())
  )

  // ── Step 4: Generate targeted patch (verdict + probabilities) ──────────────
  const scenarioSummary = scenarios.map(s => `  - ID ${s.id}: "${s.name}" — currently ${s.probability}%`).join('\n')
  const newSignalSummary = novelSignals.length
    ? novelSignals.map(s => `  [${s.signalType.toUpperCase()}] ${s.actor}: "${s.quote.slice(0, 120)}"`).join('\n')
    : '  (no new signals found in last 24h)'

  const patchPrompt = `You are a senior geopolitical analyst performing a cost-efficient daily update.

ANALYSIS: "${analysisTitle || dashboardFile}"

CURRENT SCENARIO PROBABILITIES:
${scenarioSummary}

CURRENT VERDICT SUMMARY:
${verdictText.slice(0, 800)}

NEW SIGNALS (last 24h):
${newSignalSummary}

Produce ONLY a JSON patch object with the minimum necessary updates. Do not change things that haven't actually shifted.

{
  "updatedVerdict": {
    "stance": "string — e.g. MONITOR | ESCALATE CAUTION | REDUCE RISK | HOLD | RE-ASSESS",
    "stanceColor": "#hex — amber #f59e0b | red #ef4444 | green #10b981 | cyan #06b6d4",
    "primaryScenario": "scenario name",
    "primaryProb": number,
    "timing": "short label e.g. Re-assess in 48h",
    "timingDetail": "1-2 sentences — what specifically to watch and why now",
    "immediateWatchpoints": [{"signal": "string", "timing": "string", "implication": "string", "urgency": "Critical|High|Medium"}],
    "marketPositioning": [{"asset": "string", "stance": "HOLD|ADD|REDUCE|AVOID|CAUTIOUS", "color": "#hex", "rationale": "string"}],
    "probabilityUpdate": "e.g. Scenario1 35% / Scenario2 30% — Next trigger: ...",
    "conviction": "High|Medium-High|Medium|Low",
    "nextReview": "string"
  },
  "probabilityUpdates": [{"id": 1, "probability": 35}]
}

Rules:
- All probabilities must sum to exactly 100
- Only include scenarios whose probability actually changes
- If no signals changed anything meaningful, keep probabilities the same
- Verdict MUST reference the new signals specifically
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
          generationConfig: { temperature: 0.3, maxOutputTokens: 2048 },
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
        if (match) {
          try { patch = JSON.parse(match[0]) } catch { /* skip */ }
        }
      }
    }
  } catch { /* fall through — patch stays null */ }

  if (!patch) {
    return res.status(502).json({ error: 'Failed to generate analysis patch — try again' })
  }

  // ── Step 5: Apply patch to file content ────────────────────────────────────
  let newContent = content
  const today = new Date().toISOString().slice(0, 10)

  // 5a. Update analysis date
  newContent = updateAnalysisDate(newContent, today)

  // 5b. Prepend novel signals to politicalComments
  if (novelSignals.length > 0) {
    newContent = prependSignals(newContent, novelSignals)
  }

  // 5c. Update scenario probabilities
  if (patch.probabilityUpdates?.length) {
    newContent = updateProbabilities(newContent, patch.probabilityUpdates)
  }

  // 5d. Replace strategicVerdict block
  if (patch.updatedVerdict) {
    newContent = replaceVerdictBlock(newContent, patch.updatedVerdict)
  }

  // ── Step 6: Commit to GitHub ───────────────────────────────────────────────
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
        message: `refactor: reanalyze — ${analysisTitle || dashboardFile} (${today})`,
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
    newStance: patch.updatedVerdict?.stance,
    newDate: today,
  })
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function extractActors(content) {
  // Find names inside the actors array (before the first "scenarios:" marker)
  const actorsSection = content.slice(0, content.indexOf('scenarios:') || content.length)
  return [...actorsSection.matchAll(/name:\s*["'`]([^"'`\n]{2,50})["'`]/g)]
    .map(m => m[1])
    .filter((v, i, arr) => arr.indexOf(v) === i) // dedupe
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
    if (nameM && probM) {
      results.push({ id: Number(m[1]), name: nameM[1], probability: Number(probM[1]) })
    }
  }
  // Dedupe by id
  return results.filter((s, i, arr) => arr.findIndex(x => x.id === s.id) === i)
}

function extractVerdictText(content) {
  const marker = 'const strategicVerdict = {'
  const start = content.indexOf(marker)
  if (start === -1) return ''
  const end = findBlockEnd(content, start + marker.length - 1)
  return end === -1 ? '' : content.slice(start, end + 1).slice(0, 1200)
}

/**
 * Find the index of the closing brace/bracket that matches the one at `from`,
 * correctly skipping over string literals.
 */
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

function updateAnalysisDate(content, date) {
  // Only update the date field that appears in analysisData (within first 3000 chars)
  const analysisStart = content.indexOf('const analysisData = {')
  if (analysisStart === -1) return content
  const analysisEnd = Math.min(analysisStart + 3000, content.length)
  const before = content.slice(0, analysisStart)
  const block = content.slice(analysisStart, analysisEnd)
  const after = content.slice(analysisEnd)
  const updated = block.replace(/(\bdate:\s*)["'`][\d-]+["'`]/, `$1"${date}"`)
  return before + updated + after
}

function prependSignals(content, signals) {
  const marker = 'const politicalComments = ['
  const pos = content.indexOf(marker)
  if (pos === -1) return content
  const after = pos + marker.length
  const entries = signals.map(formatSignalEntry).join(',\n') + ','
  return content.slice(0, after) + '\n' + entries + content.slice(after)
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
    // Find "id: N" then replace the next "probability: N" within 700 chars
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

  const braceStart = start + marker.length - 1 // position of the opening {
  const end = findBlockEnd(content, braceStart)
  if (end === -1) return content

  const newBlock = 'const strategicVerdict = ' + jsStringify(verdict, 0)
  return content.slice(0, start) + newBlock + content.slice(end + 1)
}

function jsStringify(val, depth) {
  const pad = '  '.repeat(depth)
  const inner = '  '.repeat(depth + 1)

  if (val === null || val === undefined) return 'null'
  if (typeof val === 'string') return JSON.stringify(val)
  if (typeof val === 'number' || typeof val === 'boolean') return String(val)
  if (Array.isArray(val)) {
    if (!val.length) return '[]'
    const items = val.map(v => inner + jsStringify(v, depth + 1))
    return `[\n${items.join(',\n')},\n${pad}]`
  }
  if (typeof val === 'object') {
    const entries = Object.entries(val).map(([k, v]) => `${inner}${k}: ${jsStringify(v, depth + 1)}`)
    if (!entries.length) return '{}'
    return `{\n${entries.join(',\n')},\n${pad}}`
  }
  return JSON.stringify(val)
}
