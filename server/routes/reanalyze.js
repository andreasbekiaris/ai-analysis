const REPO = 'andreasbekiaris/ai-analysis'

// ── Single-phase reanalysis: Claude does research + analysis via web_search ──
async function runReanalysis(body, job) {
  const { dashboardFile, analysisTitle } = body || {}
  if (!dashboardFile) { job.status = 'error'; job.error = 'Missing dashboardFile'; return }

  const anthropicKey = process.env.ANTHROPIC_API_KEY
  const githubToken = process.env.GITHUB_TOKEN
  if (!anthropicKey) { job.status = 'error'; job.error = 'ANTHROPIC_API_KEY not configured'; return }
  if (!githubToken) { job.status = 'error'; job.error = 'GITHUB_TOKEN not configured'; return }

  job.stage = 'Reading dashboard from GitHub...'

  // ── Read current file from GitHub ──────────────────────────────────────
  const fileRes = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${dashboardFile}`,
    { headers: { Authorization: `Bearer ${githubToken}`, Accept: 'application/vnd.github+json' } }
  )
  if (!fileRes.ok) { job.status = 'error'; job.error = 'Failed to read dashboard file'; return }
  const fileData = await fileRes.json()
  const content = Buffer.from(fileData.content, 'base64').toString('utf8')

  const today = new Date().toISOString().slice(0, 10)
  const title = analysisTitle || dashboardFile

  // Extract previous data blocks
  const prevAnalysis = extractBlock(content, 'const analysisData')
  const prevSignals = extractBlock(content, 'const politicalComments')
  const prevVerdict = extractBlock(content, 'const strategicVerdict')
  const prevGaps = extractBlock(content, 'const analysisGaps')

  job.stage = 'Claude is researching and analyzing (web search + deep analysis)...'

  // ── Build Claude prompt with web search instructions ───────────────────
  const claudePrompt = `You are a senior geopolitical analyst performing a COMPREHENSIVE DEEP REANALYSIS.
Today's date: ${today}. Analysis topic: "${title}".

CRITICAL: This is NOT a quick update. You must REDO the entire analysis from scratch.
Use the previous analysis as your baseline — challenge its assumptions with new data,
deepen its reasoning, refine probabilities, and produce a MORE THOROUGH assessment.

STEP 1 — RESEARCH (use your web_search tool extensively):
You MUST search for ALL of the following before writing the analysis:
1. Current commodity/market prices relevant to this situation (oil, gas, gold, defense ETFs, etc.)
2. Political statements and signals from key actors in the last 7 days
3. Latest military, diplomatic, and economic developments
4. Expert and think tank analysis (RAND, Brookings, CFR, IISS, Chatham House, Carnegie, CSIS, SIPRI)
5. Cross-verify prices from multiple sources

Run at least 5-8 web searches to gather comprehensive, current data.

STEP 2 — ANALYZE using your research + the previous analysis below.

═══ PREVIOUS ANALYSIS (baseline to improve upon — do NOT just copy) ═══

${prevAnalysis.slice(0, 10000)}

═══ PREVIOUS POLITICAL SIGNALS ═══
${prevSignals.slice(0, 6000)}

═══ PREVIOUS VERDICT ═══
${prevVerdict.slice(0, 3000)}

═══ PREVIOUS ANALYSIS GAPS ═══
${prevGaps.slice(0, 1500)}

═══ OUTPUT INSTRUCTIONS ═══

After completing your research, generate COMPLETE replacement data.
Return a single JSON object with these exact keys:

{
  "analysisData": {
    "title": "${title}",
    "date": "${today}",
    "overallConfidence": "Low|Medium|Medium-High|High",
    "situation": {
      "actors": [{ "name": "str", "role": "str", "stance": "str", "power": 0-100 }],
      "context": "COMPREHENSIVE 3-5 paragraph context incorporating ALL latest developments — deeper than the previous version",
      "triggers": ["specific dated event descriptions as strings"],
      "keyMetrics": [{ "label": "str", "value": "str (use verified prices from your searches)", "color": "#hex" }]
    },
    "scenarios": [
      {
        "id": 1,
        "name": "Evocative Name",
        "tagline": "Short label",
        "probability": number,
        "color": "#hex (use: #06b6d4 cyan, #10b981 green, #f59e0b amber, #ef4444 red, #8b5cf6 violet)",
        "description": "2-3 paragraph description — MORE DETAILED than previous",
        "narrative": "detailed step-by-step narrative of how events unfold",
        "impacts": { "military": 1-10, "economic": 1-10, "diplomatic": 1-10, "humanitarian": 1-10, "regional": 1-10, "global": 1-10 },
        "timeHorizons": { "shortTerm": "0-6mo", "mediumTerm": "6-24mo", "longTerm": "2-10yr" },
        "indicators": [{ "signal": "observable monitorable indicator", "status": "not_observed|emerging|observed" }],
        "feasibility": [{
          "action": "str", "actor": "str",
          "militaryFeasibility": { "score": 1-10, "detail": "str" },
          "economicCapacity": { "score": 1-10, "detail": "str" },
          "politicalWill": { "score": 1-10, "detail": "str" },
          "allianceSupport": { "score": 1-10, "detail": "str" },
          "overallSustainability": "fully_sustainable|sustainable_short_term|barely_feasible|not_feasible",
          "dealbreaker": "str", "estimatedCost": "str"
        }]
      }
    ],
    "decisionPoints": [{ "actor": "str", "decision": "str", "leadsTo": [1,2], "consequence": "str" }],
    "expertOpinions": {
      "consensus": { "summary": "str", "supporters": ["think tank names"] },
      "dissenting": [{ "expert": "str", "affiliation": "str", "position": "str", "reasoning": "str", "credibilityNote": "str" }],
      "regionalVsWestern": { "westernView": "str", "regionalView": "str", "gapAnalysis": "str" },
      "overallExpertConfidence": "High|Medium|Low"
    },
    "impactMatrix": [{ "scenario": "name", "military": 1-10, "economic": 1-10, "diplomatic": 1-10, "humanitarian": 1-10, "regional": 1-10, "global": 1-10 }]
  },
  "politicalComments": [
    {
      "actor": "str", "role": "str", "platform": "str",
      "date": "YYYY-MM-DD", "time": "HH:MM TZ or empty string",
      "quote": "exact or closest verified quote from your web searches",
      "context": "str",
      "signalType": "escalatory|de-escalatory|diplomatic|economic|ambiguous",
      "marketImpact": "str", "scenarioImplication": "str", "verified": true or false
    }
  ],
  "strategicVerdict": {
    "stance": "MONITOR|ESCALATE CAUTION|REDUCE RISK|HOLD|RE-ASSESS",
    "stanceColor": "#hex",
    "primaryScenario": "str", "primaryProb": number,
    "timing": "short label",
    "timingDetail": "2-3 sentences referencing specific signals and verified prices from your research",
    "immediateWatchpoints": [{ "signal": "str", "timing": "str", "implication": "str", "urgency": "Critical|High|Medium" }],
    "marketPositioning": [{ "asset": "str", "stance": "HOLD|ADD|REDUCE|AVOID|CAUTIOUS", "color": "#hex", "rationale": "str" }],
    "probabilityUpdate": "Scenario1 X% / Scenario2 Y% — Next trigger: ...",
    "conviction": "High|Medium-High|Medium|Low",
    "nextReview": "str"
  },
  "analysisGaps": [
    { "topic": "str", "description": "str", "issueTitle": "Extend ${title}: ..." }
  ]
}

CRITICAL RULES:
1. All scenario probabilities MUST sum to exactly 100
2. Include 3-5 scenarios with DETAILED feasibility assessments
3. KEEP all important previous political signals AND add new ones you find — sort newest first
4. keyMetrics MUST use real verified prices from your web searches
5. Update indicator statuses based on latest developments (not_observed → emerging → observed)
6. Expert opinions MUST incorporate latest think tank views from your research
7. Verdict MUST reference specific recent signals, prices, and developments you found
8. GO DEEPER than previous: more detail in narratives, more nuanced reasoning, better-supported scores
9. Return ONLY valid JSON — no markdown fences, no explanation, no commentary`

  // ── Claude API call with web_search tool ───────────────────────────────
  const maxRetries = 3
  let result = null
  let usedModel = 'claude-sonnet-4-6'

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      job.stage = `Claude researching & analyzing (attempt ${attempt}/${maxRetries})...`
      const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: usedModel,
          max_tokens: 16000,
          tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 10 }],
          messages: [{ role: 'user', content: claudePrompt }],
        }),
      })

      if (claudeRes.status === 402 || claudeRes.status === 429) {
        const errText = await claudeRes.text().catch(() => '')
        job.status = 'error'; job.error = `No API credits — ${errText.slice(0, 150)}`; job.code = 'NO_CREDITS'; return
      }

      if (claudeRes.status === 529 || claudeRes.status === 503) {
        if (attempt < maxRetries) {
          job.stage = `Claude API overloaded — retrying in ${attempt * 5}s...`
          await new Promise(r => setTimeout(r, attempt * 5000))
          continue
        }
        job.status = 'error'; job.error = `Claude API overloaded after ${maxRetries} attempts — try again later`; return
      }

      if (!claudeRes.ok) {
        const errText = await claudeRes.text().catch(() => '')
        job.status = 'error'; job.error = `Claude API error (${claudeRes.status}): ${errText.slice(0, 200)}`; return
      }

      const claudeData = await claudeRes.json()
      // Extract text from content blocks (may include tool_use and text blocks)
      const textBlocks = (claudeData?.content || []).filter(b => b.type === 'text')
      const text = textBlocks.map(b => b.text).join('').trim()

      const clean = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
      try { result = JSON.parse(clean) } catch {
        const match = text.match(/\{[\s\S]*\}/)
        if (match) try { result = JSON.parse(match[0]) } catch { /* skip */ }
      }
      if (result) break

      if (attempt < maxRetries) {
        job.stage = `Parsing failed — retrying (${attempt}/${maxRetries})...`
        await new Promise(r => setTimeout(r, 3000))
      }
    } catch (e) {
      if (attempt === maxRetries) {
        job.status = 'error'; job.error = `Claude API failed: ${e.message}`; return
      }
      await new Promise(r => setTimeout(r, attempt * 5000))
    }
  }

  if (!result) { job.status = 'error'; job.error = 'Claude returned unparseable response after retries'; return }

  // ── Replace data blocks in file ────────────────────────────────────────
  job.stage = 'Committing updated analysis to GitHub...'
  let newContent = content
  if (result.analysisData) newContent = replaceDataBlock(newContent, 'const analysisData', result.analysisData)
  if (result.politicalComments) newContent = replaceDataBlock(newContent, 'const politicalComments', result.politicalComments)
  if (result.strategicVerdict) newContent = replaceDataBlock(newContent, 'const strategicVerdict', result.strategicVerdict)
  if (result.analysisGaps) newContent = replaceDataBlock(newContent, 'const analysisGaps', result.analysisGaps)

  // ── Commit to GitHub ───────────────────────────────────────────────────
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
        message: `feat: deep reanalysis — ${title} (${today})`,
        content: Buffer.from(newContent).toString('base64'),
        sha: fileData.sha,
      }),
    }
  )

  if (!commitRes.ok) {
    const err = await commitRes.json().catch(() => ({}))
    job.status = 'error'; job.error = `GitHub commit failed: ${err.message || commitRes.status}`; return
  }

  const scenarioCount = result.analysisData?.scenarios?.length || 0
  const signalCount = result.politicalComments?.length || 0

  job.status = 'done'
  job.result = {
    success: true,
    reanalysisType: 'deep',
    scenariosAnalyzed: scenarioCount,
    signalsTotal: signalCount,
    verdictUpdated: !!result.strategicVerdict,
    newStance: result.strategicVerdict?.stance,
    newConviction: result.strategicVerdict?.conviction,
    probabilitySummary: result.strategicVerdict?.probabilityUpdate || null,
    model: usedModel,
    newDate: today,
  }
}

// ── Sync handler (fallback) ──────────────────────────────────────────────────
export async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const job = { status: 'running', stage: '' }
  await runReanalysis(req.body, job)
  if (job.status === 'error') return res.status(502).json({ error: job.error })
  return res.status(200).json(job.result)
}

// Expose for async usage
handler.runReanalysis = runReanalysis

// ── Helpers ────────────────────────────────────────────────────────────────────

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

function replaceDataBlock(content, marker, newData) {
  const start = content.indexOf(marker)
  if (start === -1) return content
  let openIdx = start + marker.length
  while (openIdx < content.length && content[openIdx] !== '{' && content[openIdx] !== '[') openIdx++
  if (openIdx >= content.length) return content
  const end = findBlockEnd(content, openIdx)
  if (end === -1) return content
  const declaration = content.slice(start, openIdx).replace(/\s*$/, '')
  return content.slice(0, start) + declaration + ' ' + jsStringify(newData, 0) + content.slice(end + 1)
}

function jsStringify(val, depth) {
  const pad = '  '.repeat(depth)
  const inner = '  '.repeat(depth + 1)
  if (val === null || val === undefined) return 'null'
  if (typeof val === 'boolean') return String(val)
  if (typeof val === 'number') return String(val)
  if (typeof val === 'string') return JSON.stringify(val)
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
