const REPO = 'andreasbekiaris/ai-analysis'

// ── Gemini Google-Search helper ────────────────────────────────────────────────
async function geminiSearch(key, query, maxTokens = 2048) {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tools: [{ google_search: {} }],
          contents: [{ role: 'user', parts: [{ text: query }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: maxTokens },
        }),
      }
    )
    if (!res.ok) return ''
    const data = await res.json()
    const parts = data?.candidates?.[0]?.content?.parts || []
    return parts.map(p => p.text || '').join('').trim()
  } catch { return '' }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { dashboardFile, analysisTitle, ticker } = req.body || {}
  if (!dashboardFile) return res.status(400).json({ error: 'Missing dashboardFile' })

  const geminiKey = process.env.GEMINI_API_KEY
  const anthropicKey = process.env.ANTHROPIC_API_KEY
  const githubToken = process.env.GITHUB_TOKEN
  if (!geminiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' })
  if (!anthropicKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' })
  if (!githubToken) return res.status(500).json({ error: 'GITHUB_TOKEN not configured' })

  // ── Step 1: Read current file from GitHub ─────────────────────────────────
  const fileRes = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${dashboardFile}`,
    { headers: { Authorization: `Bearer ${githubToken}`, Accept: 'application/vnd.github+json' } }
  )
  if (!fileRes.ok) return res.status(502).json({ error: 'Failed to read dashboard file' })
  const fileData = await fileRes.json()
  const content = Buffer.from(fileData.content, 'base64').toString('utf8')

  const today = new Date().toISOString().slice(0, 10)
  const stockName = analysisTitle || ticker || dashboardFile
  const tickerStr = ticker || stockName

  // Extract full previous data blocks as context for deeper reanalysis
  const prevStock = extractBlock(content, 'const stock')
  const prevVerdict = extractBlock(content, 'const verdict')
  const prevNews = extractBlock(content, 'const newsItems')
  const prevGaps = extractBlock(content, 'const analysisGaps')
  const prevGeoOverlay = extractBlock(content, 'const geoOverlay')
  const prevRiskNotices = extractBlock(content, 'const riskNotices')

  // ── Step 2: 5 parallel Gemini searches — comprehensive stock research ─────
  const [pc1, pc2, news, analysts, sectorMacro] = await Promise.all([
    geminiSearch(geminiKey,
      `PRICE CHECK 1 — Current stock price for ${stockName} (ticker: ${tickerStr}). Today: ${today}. ` +
      `Search for real-time or latest closing price, daily change (absolute and %), ` +
      `market cap, trading volume, 52-week high/low, beta. ` +
      `Also include relevant sector index. Return: Field | Value | Source.`
    ),
    geminiSearch(geminiKey,
      `PRICE CHECK 2 — Cross-verify stock price for ${tickerStr} / ${stockName}. Date: ${today}. ` +
      `Search different sources (Bloomberg, Reuters, Yahoo Finance, local exchange) to confirm: ` +
      `current price, intraday high/low, 52-week range, analyst consensus target, P/E ratio. ` +
      `Return: Field | Value | Source URL or outlet.`
    ),
    geminiSearch(geminiKey,
      `Comprehensive financial news for ${stockName} (${tickerStr}). Date: ${today}. ` +
      `Search for: earnings updates, analyst upgrades/downgrades, regulatory news, ` +
      `management changes, M&A activity, product launches, legal issues, ` +
      `competitive developments, insider trading, dividend changes. Cover the last 7 days. ` +
      `For each: headline, source, date, sentiment (positive/neutral/negative), summary.`,
      3000
    ),
    geminiSearch(geminiKey,
      `Analyst ratings and research for ${stockName} (${tickerStr}). Date: ${today}. ` +
      `Search for: recent analyst reports, price target changes, rating changes, ` +
      `consensus estimates, EPS forecasts, revenue projections. ` +
      `Include: analyst name, firm, rating, price target, date of report, key thesis.`,
      3000
    ),
    geminiSearch(geminiKey,
      `Sector and macro analysis affecting ${stockName} (${tickerStr}). Date: ${today}. ` +
      `Search for: sector trends, industry developments, regulatory changes, ` +
      `interest rate impacts, trade policy effects, geopolitical risks to this company, ` +
      `supply chain issues, currency impacts. Include specific data and sources.`,
      3000
    ),
  ])

  // ── Step 3: Claude deep reanalysis — full data regeneration ────────────────
  const claudePrompt = `You are a senior equity analyst performing a COMPREHENSIVE DEEP REANALYSIS of a stock.

CRITICAL: This is NOT a quick price update. You must REDO the entire analysis from scratch.
Use the previous analysis as your baseline — update fundamentals, challenge assumptions,
incorporate new data, and produce a DEEPER, more refined assessment.

═══ PREVIOUS ANALYSIS (baseline to improve upon — do NOT just copy) ═══

── STOCK DATA ──
${prevStock.slice(0, 5000)}

── VERDICT ──
${prevVerdict.slice(0, 3000)}

── NEWS ITEMS ──
${prevNews.slice(0, 3000)}

── ANALYSIS GAPS ──
${prevGaps.slice(0, 1000)}

── GEO OVERLAY (if exists) ──
${prevGeoOverlay.slice(0, 2000)}

── RISK NOTICES (if exists) ──
${prevRiskNotices.slice(0, 1500)}

═══ FRESH RESEARCH (${today}) ═══

── VERIFIED PRICE #1 ──
${pc1.slice(0, 1500) || '(unavailable)'}

── VERIFIED PRICE #2 ──
${pc2.slice(0, 1500) || '(unavailable)'}

── LATEST NEWS (last 7 days) ──
${news.slice(0, 3500) || '(no significant news found)'}

── ANALYST RATINGS & RESEARCH ──
${analysts.slice(0, 3000) || '(no analyst data found)'}

── SECTOR & MACRO CONTEXT ──
${sectorMacro.slice(0, 3000) || '(no sector analysis found)'}

═══ INSTRUCTIONS ═══

Generate COMPLETE replacement data. Return a single JSON object with these keys:

{
  "stock": {
    "name": "${stockName}",
    "ticker": "${tickerStr}",
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
    { "topic": "str", "description": "str", "issueTitle": "Extend ${stockName} analysis: ..." }
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

  // ── Claude API call with retry, timeout, and model fallback ──────────────
  const models = ['claude-sonnet-4-6', 'claude-sonnet-4-6']
  let result = null
  let usedModel = null

  for (const model of models) {
    const maxRetries = 3
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 240000) // 240s timeout

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
            max_tokens: 12000,
            messages: [{ role: 'user', content: claudePrompt }],
          }),
        })
        clearTimeout(timeout)

        if (claudeRes.status === 529 || claudeRes.status === 503) {
          if (attempt < maxRetries) {
            await new Promise(r => setTimeout(r, attempt * 5000))
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
        await new Promise(r => setTimeout(r, attempt * 5000))
      }
    }
    if (result) break
  }

  if (!result) return res.status(502).json({ error: 'All Claude models failed or timed out — try again in a few minutes' })

  // ── Step 4: Replace data blocks in file ────────────────────────────────────
  let newContent = content
  if (result.stock) newContent = replaceDataBlock(newContent, 'const stock', result.stock)
  if (result.verdict) newContent = replaceDataBlock(newContent, 'const verdict', result.verdict)
  if (result.newsItems) newContent = replaceDataBlock(newContent, 'const newsItems', result.newsItems)
  if (result.analysisGaps) newContent = replaceDataBlock(newContent, 'const analysisGaps', result.analysisGaps)

  // Append new price history point if we got a price
  if (result.stock?.price) {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const d = new Date()
    const dateStr = `${months[d.getMonth()]}-${String(d.getDate()).padStart(2, '0')}`
    newContent = appendPriceHistory(newContent, { date: dateStr, price: result.stock.price })
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
        message: `feat: deep reanalysis — ${stockName} (${today})`,
        content: Buffer.from(newContent).toString('base64'),
        sha: fileData.sha,
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
    newDate: today,
  })
}

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
