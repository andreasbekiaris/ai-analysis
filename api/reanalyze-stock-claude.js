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
  const claudePrompt = `You are a senior equity analyst performing a COMPREHENSIVE DEEP REANALYSIS of a stock.

CRITICAL: This is NOT a quick price update. You must REDO the entire analysis from scratch.
Use the previous analysis as your baseline — update fundamentals, challenge assumptions,
incorporate new data, and produce a DEEPER, more refined assessment.

═══ PREVIOUS ANALYSIS (baseline to improve upon — do NOT just copy) ═══

── STOCK DATA ──
${d.prevStock || '(not found)'}

── VERDICT ──
${d.prevVerdict || '(not found)'}

── NEWS ITEMS ──
${d.prevNews || '(not found)'}

── ANALYSIS GAPS ──
${d.prevGaps || '(not found)'}

── GEO OVERLAY (if exists) ──
${d.prevGeoOverlay || '(not found)'}

── RISK NOTICES (if exists) ──
${d.prevRiskNotices || '(not found)'}

═══ FRESH RESEARCH (${d.today}) ═══

── VERIFIED PRICE #1 ──
${d.pc1 || '(unavailable)'}

── VERIFIED PRICE #2 ──
${d.pc2 || '(unavailable)'}

── LATEST NEWS (last 7 days) ──
${d.news || '(no significant news found)'}

── ANALYST RATINGS & RESEARCH ──
${d.analysts || '(no analyst data found)'}

── SECTOR & MACRO CONTEXT ──
${d.sectorMacro || '(no sector analysis found)'}

═══ INSTRUCTIONS ═══

Generate COMPLETE replacement data. Return a single JSON object with these keys:

{
  "stock": {
    "name": "${d.stockName}",
    "ticker": "${d.tickerStr}",
    "price": number (consensus from both price checks),
    "change": number (today's absolute change),
    "changePct": number (today's % change),
    "marketCap": "string e.g. $2.1T",
    "pe": number or "N/A",
    "eps": number,
    "dividend": "string e.g. 0.65%",
    "fiftyTwoWeekHigh": number,
    "fiftyTwoWeekLow": number,
    "beta": number,
    "avgVolume": "string e.g. 12.5M",
    "sector": "string",
    "industry": "string",
    "description": "1-2 paragraph company description with current strategic focus"
  },
  "verdict": {
    "stance": "BUY|CAUTIOUS BUY|HOLD|REDUCE|AVOID|MONITOR",
    "stanceColor": "#hex",
    "stanceBg": "rgba() matching stanceColor at 0.1 opacity",
    "timing": "short timing label",
    "timingDetail": "2-4 sentences citing specific news, prices, and catalysts — DEEPER reasoning than previous",
    "entryZone": { "low": number, "high": number, "ideal": number },
    "stopLoss": { "price": number, "pct": "string e.g. -8%", "rationale": "str" },
    "targets": [
      { "price": number, "label": "Target 1", "horizon": "3-6 months", "upside": "string e.g. +15%", "trigger": "catalyst" }
    ],
    "riskReward": "string e.g. 2.5:1",
    "conviction": "High|Medium-High|Medium|Low",
    "keyConditions": [
      { "label": "str", "status": "met|pending|failed", "impact": "str" }
    ],
    "bearCase": "detailed bear case with specific scenarios and probabilities",
    "disclaimer": "Analytical data only. Not financial advice. Consult a qualified advisor."
  },
  "newsItems": [
    {
      "headline": "str",
      "source": "str",
      "date": "YYYY-MM-DD",
      "url": "real URL or empty string",
      "sentiment": "positive|neutral|negative",
      "summary": "1-2 sentence summary of impact"
    }
  ],
  "analysisGaps": [
    { "topic": "str", "description": "str", "issueTitle": "Extend ${d.stockName} analysis: ..." }
  ]
}

CRITICAL RULES:
1. Stock price MUST use consensus from both price checks — if unavailable return the best available
2. KEEP important previous news items AND add new ones from research — sort newest first, max 12 items
3. News URLs must be real — if you cannot verify a URL, use empty string
4. Verdict MUST reference specific recent news, price data, and analyst views
5. GO DEEPER: more nuanced timing rationale, better-supported targets, more detailed bear case
6. If geo overlay data existed, incorporate its risk assessment into the verdict and bear case
7. Return ONLY valid JSON — no markdown fences, no explanation, no commentary`

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
          break
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
  if (result.stock) newContent = replaceDataBlock(newContent, 'const stock', result.stock)
  if (result.verdict) newContent = replaceDataBlock(newContent, 'const verdict', result.verdict)
  if (result.newsItems) newContent = replaceDataBlock(newContent, 'const newsItems', result.newsItems)
  if (result.analysisGaps) newContent = replaceDataBlock(newContent, 'const analysisGaps', result.analysisGaps)

  // Append new price history point
  if (result.stock?.price) {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const dt = new Date()
    const dateStr = `${months[dt.getMonth()]}-${String(dt.getDate()).padStart(2, '0')}`
    newContent = appendPriceHistory(newContent, { date: dateStr, price: result.stock.price })
  }

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
        message: `feat: deep reanalysis — ${d.stockName} (${d.today})`,
        content: Buffer.from(newContent).toString('base64'),
        sha: d.fileSha,
      }),
    }
  )

  if (!commitRes.ok) {
    const err = await commitRes.json().catch(() => ({}))
    return res.status(502).json({ error: `GitHub commit failed: ${err.message || commitRes.status}` })
  }

  const newsCount = result.newsItems?.length || 0

  return res.status(200).json({
    success: true,
    reanalysisType: 'deep',
    newsTotal: newsCount,
    verdictUpdated: !!result.verdict,
    priceUpdated: !!result.stock?.price,
    newPrice: result.stock?.price || null,
    newStance: result.verdict?.stance,
    newConviction: result.verdict?.conviction,
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

function appendPriceHistory(content, point) {
  if (!point?.date || point?.price == null) return content
  const marker = 'const priceHistory = ['
  const pos = content.indexOf(marker)
  if (pos === -1) return content
  const end = findBlockEnd(content, pos + marker.length - 1)
  if (end === -1) return content
  const entry = `  { date: "${point.date}", price: ${point.price} }`
  return content.slice(0, end) + ',\n' + entry + '\n' + content.slice(end)
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
