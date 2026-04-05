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

  const { dashboardFile, analysisTitle, ticker } = req.body || {}
  if (!dashboardFile) return res.status(400).json({ error: 'Missing dashboardFile' })

  const geminiKey = process.env.GEMINI_API_KEY
  const githubToken = process.env.GITHUB_TOKEN
  if (!geminiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' })
  if (!githubToken) return res.status(500).json({ error: 'GITHUB_TOKEN not configured' })

  // ── Read current file from GitHub ─────────────────────────────────────────
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

  // Extract previous data blocks
  const prevStock = extractBlock(content, 'const stock')
  const prevVerdict = extractBlock(content, 'const verdict')
  const prevNews = extractBlock(content, 'const newsItems')
  const prevGaps = extractBlock(content, 'const analysisGaps')
  const prevGeoOverlay = extractBlock(content, 'const geoOverlay')
  const prevRiskNotices = extractBlock(content, 'const riskNotices')

  // ── 5 parallel Gemini searches ─────────────────────────────────────────────
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

  // Return all fetched data to the frontend
  return res.status(200).json({
    success: true,
    dashboardFile,
    stockName,
    tickerStr,
    today,
    fileSha: fileData.sha,
    content,
    prevStock: prevStock.slice(0, 6000),
    prevVerdict: prevVerdict.slice(0, 4000),
    prevNews: prevNews.slice(0, 4000),
    prevGaps: prevGaps.slice(0, 1500),
    prevGeoOverlay: prevGeoOverlay.slice(0, 3000),
    prevRiskNotices: prevRiskNotices.slice(0, 2000),
    pc1: pc1.slice(0, 2000),
    pc2: pc2.slice(0, 2000),
    news: news.slice(0, 5000),
    analysts: analysts.slice(0, 4000),
    sectorMacro: sectorMacro.slice(0, 4000),
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
