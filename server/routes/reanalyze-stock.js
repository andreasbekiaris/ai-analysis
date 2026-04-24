import { maxOutputTokensForModel, readModelConfig } from '../model-config.js'

const REPO = 'andreasbekiaris/ai-analysis'

// ── Single-phase stock reanalysis: Claude does research + analysis via web_search ──
async function runReanalysis(body, job) {
  const { dashboardFile, analysisTitle, ticker } = body || {}
  if (!dashboardFile) { job.status = 'error'; job.error = 'Missing dashboardFile'; return }

  const anthropicKey = process.env.ANTHROPIC_API_KEY
  const githubToken = process.env.GITHUB_TOKEN
  if (!anthropicKey) { job.status = 'error'; job.error = 'ANTHROPIC_API_KEY not configured'; return }
  if (!githubToken) { job.status = 'error'; job.error = 'GITHUB_TOKEN not configured'; return }

  job.stage = 'Reading dashboard from GitHub...'

  // ── Read current file from GitHub ─────────────────────────────────────
  const fileRes = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${dashboardFile}`,
    { headers: { Authorization: `Bearer ${githubToken}`, Accept: 'application/vnd.github+json' } }
  )
  if (!fileRes.ok) { job.status = 'error'; job.error = 'Failed to read dashboard file'; return }
  const fileData = await fileRes.json()
  const content = Buffer.from(fileData.content, 'base64').toString('utf8')
  const { config: modelConfig } = await readModelConfig(githubToken)

  const today = new Date().toISOString().slice(0, 10)
  const stockName = analysisTitle || ticker || dashboardFile
  const tickerStr = ticker || stockName

  // Extract previous data blocks
  const prevStock = extractBlock(content, 'const stock')
  const prevVerdict = extractBlock(content, 'const verdict')
  const prevNews = extractBlock(content, 'const newsItems')
  const prevGaps = extractBlock(content, 'const analysisGaps')
  const prevGeoOverlay = extractBlock(content, 'const geoOverlay')
  const prevRiskNotices = extractBlock(content, 'const riskNotices')

  job.stage = 'Claude is researching and analyzing (web search + deep analysis)...'

  // ── Build Claude prompt with web search instructions ───────────────────
  const claudePrompt = `You are a senior equity analyst performing a COMPREHENSIVE DEEP REANALYSIS of a stock.
Today's date: ${today}. Stock: ${stockName} (ticker: ${tickerStr}).

CRITICAL: This is NOT a quick price update. You must REDO the entire analysis from scratch.
Use the previous analysis as your baseline — update fundamentals, challenge assumptions,
incorporate new data, and produce a DEEPER, more refined assessment.

STEP 1 — RESEARCH (use your web_search tool extensively):
You MUST search for ALL of the following before writing the analysis:
1. Current stock price for ${tickerStr} — search at least 2 sources to cross-verify
2. Key financials: market cap, P/E, EPS, 52-week range, beta, volume
3. Latest news (earnings, analyst upgrades/downgrades, regulatory, M&A, legal issues) — last 7 days
4. Analyst ratings, price targets, consensus estimates
5. Sector trends, macro context, geopolitical risks to this company

Run at least 5-8 web searches to gather comprehensive, current data.

STEP 2 — ANALYZE using your research + the previous analysis below.

═══ PREVIOUS ANALYSIS (baseline to improve upon — do NOT just copy) ═══

── STOCK DATA ──
${prevStock.slice(0, 6000)}

── VERDICT ──
${prevVerdict.slice(0, 4000)}

── NEWS ITEMS ──
${prevNews.slice(0, 4000)}

── ANALYSIS GAPS ──
${prevGaps.slice(0, 1500)}

── GEO OVERLAY (if exists) ──
${prevGeoOverlay.slice(0, 3000)}

── RISK NOTICES (if exists) ──
${prevRiskNotices.slice(0, 2000)}

═══ OUTPUT INSTRUCTIONS ═══

After completing your research, generate COMPLETE replacement data.
Return a single JSON object with these keys:

{
  "stock": {
    "name": "${stockName}",
    "ticker": "${tickerStr}",
    "price": number (consensus from your price searches),
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
      "url": "real URL from your search results or empty string",
      "sentiment": "positive|neutral|negative",
      "summary": "1-2 sentence summary of impact"
    }
  ],
  "analysisGaps": [
    { "topic": "str", "description": "str", "issueTitle": "Extend ${stockName} analysis: ..." }
  ]
}

CRITICAL RULES:
1. Stock price MUST come from your web searches — cross-verify from multiple sources
2. KEEP important previous news items AND add new ones from research — sort newest first, max 12 items
3. News URLs must be real URLs from your search results — if you cannot verify a URL, use empty string
4. Verdict MUST reference specific recent news, price data, and analyst views you found
5. GO DEEPER: more nuanced timing rationale, better-supported targets, more detailed bear case
6. If geo overlay data existed, incorporate its risk assessment into the verdict and bear case
7. Return ONLY valid JSON — no markdown fences, no explanation, no commentary`

  // ── Claude API call with web_search tool ───────────────────────────────
  const maxRetries = 3
  let result = null
  let usedModel = modelConfig.stockReanalysisModel

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
          max_tokens: maxOutputTokensForModel(usedModel, 16000),
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
  if (result.stock) newContent = replaceDataBlock(newContent, 'const stock', result.stock)
  if (result.verdict) newContent = replaceDataBlock(newContent, 'const verdict', result.verdict)
  if (result.newsItems) newContent = replaceDataBlock(newContent, 'const newsItems', result.newsItems)
  if (result.analysisGaps) newContent = replaceDataBlock(newContent, 'const analysisGaps', result.analysisGaps)

  // Append new price history point if we got a price
  if (result.stock?.price) {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const dt = new Date()
    const dateStr = `${months[dt.getMonth()]}-${String(dt.getDate()).padStart(2, '0')}`
    newContent = appendPriceHistory(newContent, { date: dateStr, price: result.stock.price })
  }

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
        message: `feat: deep reanalysis — ${stockName} (${today})`,
        content: Buffer.from(newContent).toString('base64'),
        sha: fileData.sha,
      }),
    }
  )

  if (!commitRes.ok) {
    const err = await commitRes.json().catch(() => ({}))
    job.status = 'error'; job.error = `GitHub commit failed: ${err.message || commitRes.status}`; return
  }

  const newsCount = result.newsItems?.length || 0

  job.status = 'done'
  job.result = {
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
