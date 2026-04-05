const REPO = 'andreasbekiaris/ai-analysis'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const d = req.body || {}
  if (!d.dashboardFile || !d.content) return res.status(400).json({ error: 'Missing fetched data' })

  const anthropicKey = process.env.ANTHROPIC_API_KEY
  const githubToken = process.env.GITHUB_TOKEN
  if (!anthropicKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' })
  if (!githubToken) return res.status(500).json({ error: 'GITHUB_TOKEN not configured' })

  // ── Build Claude prompt ────────────────────────────────────────────────────
  const claudePrompt = `You are a senior geopolitical analyst performing a COMPREHENSIVE DEEP REANALYSIS.

CRITICAL: This is NOT a quick update. You must REDO the entire analysis from scratch.
Use the previous analysis as your baseline — challenge its assumptions with new data,
deepen its reasoning, refine probabilities, and produce a MORE THOROUGH assessment.
Where the previous analysis was shallow, go deeper. Where new data contradicts old assumptions, update.

═══ PREVIOUS ANALYSIS (baseline to improve upon — do NOT just copy) ═══

${d.prevAnalysis || '(not found)'}

═══ PREVIOUS POLITICAL SIGNALS ═══
${d.prevSignals || '(not found)'}

═══ PREVIOUS VERDICT ═══
${d.prevVerdict || '(not found)'}

═══ PREVIOUS ANALYSIS GAPS ═══
${d.prevGaps || '(not found)'}

═══ FRESH RESEARCH (${d.today}) ═══

── VERIFIED PRICES #1 ──
${d.pc1 || '(unavailable)'}

── VERIFIED PRICES #2 ──
${d.pc2 || '(unavailable)'}

── POLITICAL SIGNALS (last 7 days) ──
${d.signals || '(no new signals found)'}

── LATEST DEVELOPMENTS ──
${d.developments || '(no major developments found)'}

── EXPERT & THINK TANK VIEWS ──
${d.expertViews || '(no expert analysis found)'}

═══ INSTRUCTIONS ═══

Generate COMPLETE replacement data. Return a single JSON object with these exact keys:

{
  "analysisData": {
    "title": "${d.title}",
    "date": "${d.today}",
    "overallConfidence": "Low|Medium|Medium-High|High",
    "situation": {
      "actors": [{ "name": "str", "role": "str", "stance": "str", "power": 0-100 }],
      "context": "COMPREHENSIVE 3-5 paragraph context incorporating ALL latest developments — deeper than the previous version",
      "triggers": ["specific dated event descriptions as strings"],
      "keyMetrics": [{ "label": "str", "value": "str (use verified prices)", "color": "#hex" }]
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
      "quote": "exact or closest verified quote",
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
    "timingDetail": "2-3 sentences referencing specific signals and verified prices",
    "immediateWatchpoints": [{ "signal": "str", "timing": "str", "implication": "str", "urgency": "Critical|High|Medium" }],
    "marketPositioning": [{ "asset": "str", "stance": "HOLD|ADD|REDUCE|AVOID|CAUTIOUS", "color": "#hex", "rationale": "str" }],
    "probabilityUpdate": "Scenario1 X% / Scenario2 Y% — Next trigger: ...",
    "conviction": "High|Medium-High|Medium|Low",
    "nextReview": "str"
  },
  "analysisGaps": [
    { "topic": "str", "description": "str", "issueTitle": "Extend ${d.title}: ..." }
  ]
}

CRITICAL RULES:
1. All scenario probabilities MUST sum to exactly 100
2. Include 3-5 scenarios with DETAILED feasibility assessments
3. KEEP all important previous political signals AND add new ones from research — sort newest first
4. keyMetrics MUST use verified consensus prices from both price checks
5. Update indicator statuses based on latest developments (not_observed → emerging → observed)
6. Expert opinions MUST incorporate latest think tank views from research
7. Verdict MUST reference specific recent signals, prices, and developments
8. GO DEEPER than previous: more detail in narratives, more nuanced reasoning, better-supported scores
9. Return ONLY valid JSON — no markdown fences, no explanation, no commentary`

  // ── Claude API call ────────────────────────────────────────────────────────
  const models = [
    { id: 'claude-sonnet-4-6', timeout: 200000, maxTokens: 16000 },
    { id: 'claude-haiku-4-5-20251001', timeout: 120000, maxTokens: 12000 },
  ]
  let result = null
  let usedModel = null

  for (const { id: model, timeout: timeoutMs, maxTokens } of models) {
    const maxRetries = 2
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), timeoutMs)

        const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': anthropicKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model,
            max_tokens: maxTokens,
            messages: [{ role: 'user', content: claudePrompt }],
          }),
        })
        clearTimeout(timer)

        if (claudeRes.status === 529 || claudeRes.status === 503) {
          if (attempt < maxRetries) {
            await new Promise(r => setTimeout(r, attempt * 3000))
            continue
          }
          break // try next model
        }

        if (!claudeRes.ok) {
          const errText = await claudeRes.text().catch(() => '')
          return res.status(502).json({ error: `Claude API error (${claudeRes.status}): ${errText.slice(0, 200)}` })
        }

        const claudeData = await claudeRes.json()
        const text = claudeData?.content?.[0]?.text || ''
        const clean = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
        try { result = JSON.parse(clean) } catch {
          const match = text.match(/\{[\s\S]*\}/)
          if (match) try { result = JSON.parse(match[0]) } catch { /* skip */ }
        }
        if (result) { usedModel = model; break }
      } catch (e) {
        if (e.name === 'AbortError') break
        if (attempt === maxRetries) break
        await new Promise(r => setTimeout(r, attempt * 3000))
      }
    }
    if (result) break
  }

  if (!result) return res.status(502).json({ error: 'All Claude models failed or timed out — try again in a few minutes' })

  // ── Replace data blocks in file ────────────────────────────────────────────
  let newContent = d.content
  if (result.analysisData) newContent = replaceDataBlock(newContent, 'const analysisData', result.analysisData)
  if (result.politicalComments) newContent = replaceDataBlock(newContent, 'const politicalComments', result.politicalComments)
  if (result.strategicVerdict) newContent = replaceDataBlock(newContent, 'const strategicVerdict', result.strategicVerdict)
  if (result.analysisGaps) newContent = replaceDataBlock(newContent, 'const analysisGaps', result.analysisGaps)

  // ── Commit to GitHub ───────────────────────────────────────────────────────
  const commitRes = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${d.dashboardFile}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `feat: deep reanalysis — ${d.title} (${d.today})`,
        content: Buffer.from(newContent).toString('base64'),
        sha: d.fileSha,
      }),
    }
  )

  if (!commitRes.ok) {
    const err = await commitRes.json().catch(() => ({}))
    return res.status(502).json({ error: `GitHub commit failed: ${err.message || commitRes.status}` })
  }

  const scenarioCount = result.analysisData?.scenarios?.length || 0
  const signalCount = result.politicalComments?.length || 0

  return res.status(200).json({
    success: true,
    reanalysisType: 'deep',
    scenariosAnalyzed: scenarioCount,
    signalsTotal: signalCount,
    verdictUpdated: !!result.strategicVerdict,
    newStance: result.strategicVerdict?.stance,
    newConviction: result.strategicVerdict?.conviction,
    probabilitySummary: result.strategicVerdict?.probabilityUpdate || null,
    model: usedModel,
    newDate: d.today,
  })
}

// ── Helpers ────────────────────────────────────────────────────────────────────

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
