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

  const verdictText = extractVerdictText(content)
  const stockFields = extractStockFields(content)
  const today = new Date().toISOString().slice(0, 10)
  const stockName = analysisTitle || ticker || dashboardFile
  const tickerStr = ticker || stockFields.ticker || stockName

  // ── Step 2: 3 parallel Gemini searches (price ×2 + news) ──────────────────
  const [pc1Raw, pc2Raw, newsRaw] = await Promise.all([
    geminiSearch(geminiKey,
      `PRICE CHECK 1 — Current stock price for ${stockName} (ticker: ${tickerStr}). Today: ${today}. ` +
      `Search for real-time or latest closing price, daily change (absolute and %), market cap, and trading volume. ` +
      `Also include any relevant sector index (e.g. Greek banking index, Euro Stoxx Banks). ` +
      `Return: Field | Value | Source.`
    ),
    geminiSearch(geminiKey,
      `PRICE CHECK 2 — Cross-verify stock price for ${tickerStr} / ${stockName}. Date: ${today}. ` +
      `Search a different source (Bloomberg, Reuters, Yahoo Finance, or local exchange) to confirm: ` +
      `current price, intraday high/low, 52-week range update if changed, and analyst consensus target. ` +
      `Return: Field | Value | Source URL or outlet.`
    ),
    geminiSearch(geminiKey,
      `Latest financial news for ${stockName} (${tickerStr}) from the last 24 hours. Date: ${today}. ` +
      `Search for earnings updates, analyst upgrades/downgrades, regulatory news, macro events affecting this stock. ` +
      `Return a JSON array. Each object: ` +
      `{ "headline": string, "source": string, "date": "YYYY-MM-DD", "url": string or "", ` +
      `"sentiment": "positive|neutral|negative", "summary": string }. ` +
      `Return ONLY the JSON array, or [] if nothing new in 24h.`
    ),
  ])

  // Parse news
  let freshNews = []
  try {
    const clean = newsRaw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
    const parsed = JSON.parse(clean)
    if (Array.isArray(parsed)) freshNews = parsed.filter(n => n?.headline?.length > 5)
  } catch {
    const match = newsRaw.match(/\[[\s\S]*\]/)
    if (match) try { freshNews = JSON.parse(match[0]).filter(n => n?.headline?.length > 5) } catch { /* skip */ }
  }

  // Dedupe news against existing headlines
  const existingKeys = new Set(
    [...content.matchAll(/headline:\s*["'`](.{0,80})/g)].map(m => m[1].toLowerCase().slice(0, 60))
  )
  const novelNews = freshNews.filter(
    n => !existingKeys.has((n.headline || '').slice(0, 60).toLowerCase())
  )

  // ── Step 3: Claude Opus comprehensive reanalysis ────────────────────────────
  const claudePrompt = `You are a senior equity analyst performing a comprehensive daily reanalysis for a stock dashboard.

STOCK: "${stockName}" (${tickerStr})
DATE: ${today}

CURRENT STOCK DATA:
${JSON.stringify(stockFields, null, 2)}

CURRENT VERDICT:
${verdictText.slice(0, 1000)}

GEMINI PRICE CHECK #1 (live Google Search, ${today}):
${pc1Raw.slice(0, 800) || '(unavailable)'}

GEMINI PRICE CHECK #2 (cross-verified, ${today}):
${pc2Raw.slice(0, 800) || '(unavailable)'}

NEW NEWS (last 24h, de-duped):
${novelNews.length
  ? novelNews.map(n => `  [${(n.sentiment || 'neutral').toUpperCase()}] ${n.source}: "${n.headline}"`).join('\n')
  : '  (no material new news)'}

Produce a comprehensive JSON patch updating ALL data that has shifted.

{
  "stockPriceUpdate": {
    "price": number (from consensus of both price checks),
    "change": number (today's absolute change),
    "changePct": number (today's % change),
    "marketCap": "string e.g. €7.2B"
  },
  "priceHistoryPoint": {
    "date": "Mar-25",
    "price": number
  },
  "updatedVerdict": {
    "stance": "CAUTIOUS BUY | HOLD | REDUCE | MONITOR | BUY | AVOID",
    "stanceColor": "#f59e0b (amber) | #ef4444 (red) | #10b981 (green) | #06b6d4 (cyan)",
    "stanceBg": "rgba() matching stanceColor at 0.1 opacity",
    "timing": "short label e.g. Wait for Q1 earnings",
    "timingDetail": "2-3 sentences citing specific news and verified price moves",
    "conviction": "High|Medium-High|Medium|Low"
  },
  "priceSummary": "One sentence: what the two price checks confirm about the stock right now"
}

RULES:
- stockPriceUpdate MUST use the consensus price from both Gemini price checks
- priceHistoryPoint date format: 3-letter month + 2-digit day (e.g. Mar-25)
- If price is unavailable from checks, return null for stockPriceUpdate
- Verdict MUST reference specific news and price data
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
        max_tokens: 2000,
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

  if (novelNews.length > 0) newContent = prependNewsItems(newContent, novelNews)
  if (patch.stockPriceUpdate) newContent = updateStockFields(newContent, patch.stockPriceUpdate)
  if (patch.priceHistoryPoint) newContent = appendPriceHistory(newContent, patch.priceHistoryPoint)
  if (patch.updatedVerdict) newContent = patchVerdictFields(newContent, patch.updatedVerdict)

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
        message: `refactor: reanalyze stock — ${stockName} (${today})`,
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
    priceUpdated: !!patch.stockPriceUpdate,
    newPrice: patch.stockPriceUpdate?.price || null,
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

function extractVerdictText(content) {
  const marker = 'const verdict = {'
  const start = content.indexOf(marker)
  if (start === -1) return ''
  return content.slice(start, start + 1500)
}

function extractStockFields(content) {
  const marker = 'const stock = {'
  const start = content.indexOf(marker)
  if (start === -1) return {}
  const end = findBlockEnd(content, start + marker.length - 1)
  if (end === -1) return {}
  const block = content.slice(start, end + 1)

  const fields = {}
  for (const [, key, val] of block.matchAll(/\b(\w+):\s*([\d.+-]+|["'`][^"'`\n]*["'`])/g)) {
    const num = parseFloat(val)
    fields[key] = isNaN(num) ? val.replace(/^["'`]|["'`]$/g, '') : num
  }
  return fields
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

function prependNewsItems(content, news) {
  const marker = 'const newsItems = ['
  const pos = content.indexOf(marker)
  if (pos === -1) return content
  const after = pos + marker.length
  return content.slice(0, after) + '\n' + news.map(formatNewsEntry).join(',\n') + ',' + content.slice(after)
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

function updateStockFields(content, update) {
  const marker = 'const stock = {'
  const start = content.indexOf(marker)
  if (start === -1) return content
  const end = findBlockEnd(content, start + marker.length - 1)
  if (end === -1) return content

  let block = content.slice(start, end + 1)

  // Update numeric fields
  const numericFields = ['price', 'change', 'changePct']
  for (const field of numericFields) {
    if (update[field] == null) continue
    block = block.replace(
      new RegExp(`(\\b${field}:\\s*)[\\d.+-]+`),
      `$1${update[field]}`
    )
  }

  // Update string field (marketCap)
  if (update.marketCap) {
    const escaped = String(update.marketCap).replace(/"/g, '\\"')
    block = block.replace(
      /(\bmarketCap:\s*)(?:"[^"\n]*"|'[^'\n]*'|`[^`\n]*`)/,
      `$1"${escaped}"`
    )
  }

  return content.slice(0, start) + block + content.slice(end + 1)
}

function appendPriceHistory(content, point) {
  if (!point?.date || point?.price == null) return content
  const marker = 'const priceHistory = ['
  const pos = content.indexOf(marker)
  if (pos === -1) return content
  const end = findBlockEnd(content, pos + marker.length - 1)
  if (end === -1) return content

  const entry = `  { date: "${point.date}", price: ${point.price} }`
  // Insert before the closing ]
  return content.slice(0, end) + ',\n' + entry + '\n' + content.slice(end)
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
    // Correctly match double-quoted OR single-quoted string (don't stop at apostrophes)
    block = block.replace(
      new RegExp(`(\\b${field}:\\s*)(?:"[^"\\n]*"|'[^'\\n]*')`),
      `$1"${escaped}"`
    )
  }

  return content.slice(0, start) + block + content.slice(end + 1)
}
