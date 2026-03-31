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
          generationConfig: { temperature: 0.1, maxOutputTokens: 2048 },
        }),
      }
    )
    if (!res.ok) return ''
    const data = await res.json()
    return data?.candidates?.[0]?.content?.parts?.map(p => p.text).filter(Boolean).join('\n') || ''
  } catch { return '' }
}

// ── GitHub helpers ──────────────────────────────────────────────────────────────
const ghHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  Accept: 'application/vnd.github+json',
  'Content-Type': 'application/json',
})

async function readGitHubFile(token, path) {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    headers: ghHeaders(token),
  })
  if (!res.ok) return null
  const data = await res.json()
  return { content: Buffer.from(data.content, 'base64').toString('utf8'), sha: data.sha }
}

async function listGitHubDir(token, path) {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    headers: ghHeaders(token),
  })
  if (!res.ok) return []
  const data = await res.json()
  return Array.isArray(data) ? data.map(f => f.name) : []
}

async function commitFiles(token, files, message) {
  const headers = ghHeaders(token)

  const refRes = await fetch(`https://api.github.com/repos/${REPO}/git/ref/heads/main`, { headers })
  if (!refRes.ok) throw new Error('Failed to get ref')
  const baseSha = (await refRes.json()).object.sha

  const commitRes = await fetch(`https://api.github.com/repos/${REPO}/git/commits/${baseSha}`, { headers })
  const baseTree = (await commitRes.json()).tree.sha

  const treeRes = await fetch(`https://api.github.com/repos/${REPO}/git/trees`, {
    method: 'POST', headers,
    body: JSON.stringify({
      base_tree: baseTree,
      tree: files.map(f => ({ path: f.path, mode: '100644', type: 'blob', content: f.content })),
    }),
  })
  if (!treeRes.ok) throw new Error('Failed to create tree')
  const treeSha = (await treeRes.json()).sha

  const newCommitRes = await fetch(`https://api.github.com/repos/${REPO}/git/commits`, {
    method: 'POST', headers,
    body: JSON.stringify({ message, tree: treeSha, parents: [baseSha] }),
  })
  if (!newCommitRes.ok) throw new Error('Failed to create commit')
  const newSha = (await newCommitRes.json()).sha

  const updateRes = await fetch(`https://api.github.com/repos/${REPO}/git/refs/heads/main`, {
    method: 'PATCH', headers,
    body: JSON.stringify({ sha: newSha }),
  })
  if (!updateRes.ok) throw new Error('Failed to update ref')
  return newSha
}

// ── Type detection ──────────────────────────────────────────────────────────────
function detectType(prompt) {
  const p = prompt.toLowerCase()
  const stockWords = ['stock', 'share', 'ticker', 'equity', 'invest', 'earnings', 'dividend',
    'p/e', 'pe ratio', 'price target', 'valuation', 'eps', 'market cap']
  if (stockWords.some(w => p.includes(w))) return 'stock'
  // Bare ticker patterns like NVDA, AAPL, ALPHA.AT
  if (/\b[A-Z]{2,5}(\.[A-Z]{1,2})?\b/.test(prompt) && !/war|conflict|geopolitical|crisis|sanction/i.test(prompt)) return 'stock'
  return 'geopolitical'
}

// ── Search query builders ───────────────────────────────────────────────────────
function buildSearchQueries(type, prompt, date) {
  if (type === 'geopolitical') {
    return [
      `${prompt} latest developments news ${date}`,
      `${prompt} official statements leaders politicians ${date}`,
      `${prompt} expert analysis think tanks RAND Brookings CFR IISS CSIS 2026`,
      `${prompt} economic impact commodity prices markets trade ${date}`,
      `${prompt} military security developments ${date}`,
    ]
  }

  const tickerMatch = prompt.match(/\b([A-Z]{1,5}(?:\.[A-Z]{1,2})?)\b/)
  const ticker = tickerMatch?.[1] || prompt.split(/\s+/)[0]
  const company = prompt.replace(/\b(stock|analysis|analyze|share|price|the)\b/gi, '').trim()

  return [
    `${ticker} stock price today ${date} current price market cap PE ratio from Yahoo Finance`,
    `${ticker} ${company} financial results earnings revenue net profit 2025 2026`,
    `${ticker} stock news latest developments ${date}`,
    `${ticker} analyst rating price target consensus buy sell hold 2026`,
    `${ticker} technical analysis support resistance 50 day 200 day moving average RSI`,
    `${ticker} ${company} geopolitical risk regulatory legal supply chain issues 2026`,
  ]
}

// ── Claude prompt: Geopolitical ─────────────────────────────────────────────────
function buildGeoPrompt(prompt, date, searches) {
  const labels = ['Latest Developments', 'Key Actor Statements', 'Expert Analysis', 'Economic/Market Impact', 'Military/Security']
  const searchBlock = searches.map((r, i) => `=== ${labels[i] || `Search ${i + 1}`} ===\n${r || '(no results)'}`).join('\n\n')

  return `You are a senior geopolitical analyst. Generate a COMPLETE React .jsx dashboard file based on the research data below.

ANALYSIS REQUEST: ${prompt}
DATE: ${date}

LIVE RESEARCH DATA (web search, ${date}):
${searchBlock}

OUTPUT: A complete .jsx file. First line MUST be a metadata comment. Then the full file.

// METADATA: {"title":"Full Title","componentName":"PascalCaseName","slug":"kebab-slug"}
import GeoDashboard from '../../components/GeoDashboard'

Then define ALL these constants (populated from research data):

1. const analysisData = {
  title, subtitle: "Trajectory & Outcome Analysis", date: "${date}",
  overallConfidence: "Medium-High", classification: "OPEN SOURCE ANALYSIS",
  situation: {
    actors: [{ name, role, stance, power (0-100) }],  // 5-8 actors
    context: "detailed paragraph",
    triggers: ["event1", ...],
    keyMetrics: [{ label, value, color }],  // 6-10 metrics, colors: #06b6d4 #10b981 #f59e0b #ef4444
  },
  scenarios: [{  // 3-5 scenarios, probabilities MUST sum to 100
    id: 1, name, tagline, probability: 35, color: "#hex",
    description: "paragraph", narrative: "paragraph",
    impacts: { military, economic, diplomatic, humanitarian, regional, global },  // 1-10
    timeHorizons: { shortTerm, mediumTerm, longTerm },
    indicators: [{ signal, status: "not_observed"|"emerging"|"observed" }],  // 3-5 each
    feasibility: [{
      action, actor,
      militaryFeasibility: { score, detail }, economicCapacity: { score, detail },
      politicalWill: { score, detail }, allianceSupport: { score, detail },
      overallSustainability: "fully_sustainable"|"sustainable_short_term"|"barely_feasible"|"not_feasible",
      dealbreaker, estimatedCost
    }]
  }],
  decisionPoints: [{ actor, decision, leadsTo: [scenarioIds], consequence }],
  expertOpinions: {
    consensus: { summary, supporters: ["think tanks"] },
    dissenting: [{ expert, affiliation, position, reasoning, credibilityNote }],
    regionalVsWestern: { westernView, regionalView, gapAnalysis },
    overallExpertConfidence
  },
  impactMatrix: [{ scenario, military, economic, diplomatic, humanitarian, regional, global }],
}

2. const politicalComments = [{  // 6-12 entries
  actor, role, platform: "Twitter/X|Press Conference|State TV|Parliament|...",
  date: "YYYY-MM-DD", time: "HH:MM TZ",
  quote: "exact or close paraphrase",
  context, signalType: "escalatory"|"de-escalatory"|"diplomatic"|"economic"|"ambiguous",
  marketImpact, scenarioImplication, verified: true|false
}]

3. const strategicVerdict = {
  stance: "MONITOR — HOLD POSITIONS",  // ESCALATE CAUTION|REDUCE RISK|HOLD|MONITOR|RE-ASSESS
  stanceColor: "#f59e0b", primaryScenario, primaryProb: 35,
  timing: "Re-assess in 48-72h",
  timingDetail: "2-3 sentences with specific signals",
  immediateWatchpoints: [{ signal, timing, implication, urgency: "Critical"|"High"|"Medium" }],
  marketPositioning: [{ asset, stance: "HOLD"|"ADD"|"REDUCE"|"AVOID"|"CAUTIOUS", color, rationale }],
  probabilityUpdate: "Scenario1 X% / Scenario2 Y%...",
  conviction: "High"|"Medium-High"|"Medium"|"Low",
  nextReview: "48-72 hours or on watchpoint",
}

4. const analysisGaps = [{ topic, description, issueTitle }]  // 3-5 gaps

5. const affectedCountries = ["USA", "CHN"]  // ISO alpha-3 codes

6. Export:
export default function ComponentName() {
  return <GeoDashboard data={analysisData} politicalComments={politicalComments} verdict={strategicVerdict} gaps={analysisGaps} affectedCountries={affectedCountries} dashboardFile="src/dashboards/geopolitical/SLUG-${date}.jsx" />
}

RULES:
- Output ONLY raw .jsx — NO markdown code blocks
- First line MUST be // METADATA: {"title":"...","componentName":"...","slug":"..."}
- ALL data grounded in research. Mark unverified quotes verified: false
- Probabilities MUST sum to 100
- Colors: #06b6d4 cyan, #10b981 green, #f59e0b amber, #ef4444 red, #8b5cf6 violet, #dc2626 dark red
- dashboardFile path: src/dashboards/geopolitical/[slug]-${date}.jsx (use same slug as METADATA)`
}

// ── Claude prompt: Stock ────────────────────────────────────────────────────────
function buildStockPrompt(prompt, date, searches, geoFiles) {
  const labels = ['Price & Fundamentals', 'Financial Results', 'Latest News', 'Analyst Ratings', 'Technical Analysis', 'Geopolitical/Regulatory']
  const searchBlock = searches.map((r, i) => `=== ${labels[i] || `Search ${i + 1}`} ===\n${r || '(no results)'}`).join('\n\n')

  const geoContext = geoFiles.length
    ? `\nEXISTING GEO DASHBOARDS (create geoOverlay if relevant):\n${geoFiles.map(f => `- ${f} → route: /geo/${f.replace(/-\d{4}-\d{2}-\d{2}\.jsx$/, '')}`).join('\n')}`
    : ''

  return `You are a senior equity analyst. Generate a COMPLETE React .jsx stock dashboard file.

ANALYSIS REQUEST: ${prompt}
DATE: ${date}
${geoContext}

LIVE RESEARCH DATA (web search, ${date}):
${searchBlock}

OUTPUT: Complete .jsx file. First line = metadata comment. Then full file.

// METADATA: {"title":"Company Name (TICKER)","componentName":"PascalName","slug":"ticker-lowercase"}
import StockDashboard from '../../components/StockDashboard'

Define ALL these constants from research data:

1. const stock = {
  name, ticker, adr: "" (if ADR exists), exchange, date: "${date}",
  price, change, changePct, open, high52w, low52w,
  marketCap: "€/$XB", pe, peForward, eps, bookValue, pbRatio,
  dividendYield, dividendPerShare, payoutRatio, beta, sharesOut: "XB",
  sector, overallSignal: "BUY"|"HOLD"|"SELL",
  analystConsensus, analystCount, avgTarget, highTarget, lowTarget,
  chartNote: "paragraph about recent price action"
}

2. const priceHistory = [{ date: "Mon-YY", price }]  // 8-12 points over 6-12 months

3. const maData = [{ name: "5-Day MA", value, signal: "BUY"|"SELL"|"NEUTRAL", current }]  // 4 MAs

4. const technicals = {
  priceRange: [low, high],
  maSignalSummary: "paragraph",
  oscillators: [{ label, value, signal: "BUY"|"SELL"|"NEUTRAL", note }],  // RSI, MACD, Stochastic, Williams %R, ADX
  supportLevels: [{ level, label, type: "resistance"|"support"|"current" }],  // 6-10 levels, sorted high→low
  priceNote: "paragraph"
}

5. const fundamentalData = {
  valuation: [{ label, value, bench, note, ok: true|false }],  // P/E, P/B, PEG, Div Yield, Payout
  scorecard: [{ label, score (1-10), note }],  // Valuation, Profitability, Capital, Asset Quality, Dividend, Growth
}

6. const financials = [{ year: "FY20XX", netProfit, nii (or revenue), fees (or grossProfit), roe }]  // 4-5 years

7. const capitalMetrics = [{ subject, value (0-100) }]  // 6 radar chart axes

8. const peerComparison = [{ bank (or company), pe, pb, rote (or roe), cet1 (or margin), npe (or debt), target, divYield }]  // 3-5 peers

9. const radarPeer = [{ subject, TICK1: val, TICK2: val, ... }]  // 6 radar axes, values 0-100

10. const analystTargets = [{ firm, target, rating: "Buy"|"Hold"|"Sell", upside }]  // 4-8 firms

11. const eventImpacts = [{ event, level: "Critical"|"High"|"Medium"|"Low", direction: "Positive"|"Negative"|"Mixed", rationale }]  // 5-10 events

12. const keyMetrics = [{ label, value, change, pos: true|false|null }]  // 8-12 metrics

13. const newsItems = [{
  headline, source, date: "YYYY-MM-DD", url: "" (real URL from research or empty), sentiment: "positive"|"neutral"|"negative"
}]  // 5-10 items

14. const geoOverlay = {  // ONLY if an existing geo dashboard is relevant, otherwise = null
  analysis, analysisPath: "/geo/slug", date, relevance: "one sentence",
  keyChannels: [{ channel, detail, severity: "Critical"|"High"|"Medium"|"Low" }],
  scenarios: [{ name, probability, color, priceImpact, direction, rationale }],
  probabilityWeightedImpact: "summary",
  keyPoliticalSignals: [{ actor, role, platform, date, quote, signalType, stockImpact }],
}
// Set to null if no geo dashboard is relevant: const geoOverlay = null

15. const riskNotices = [{ type, icon: "emoji", event, description, impact: "Critical"|"High"|"Medium", impactColor, suggestion }]

16. const verdict = {
  stance: "CAUTIOUS BUY", stanceColor: "#hex", stanceBg: "rgba(...,0.1)",
  timing, timingDetail: "2-3 sentences referencing specific data/signals",
  entryZone: { low, high, ideal },
  stopLoss: { price, pct, rationale },
  targets: [{ price, label: "Target N", horizon, upside, trigger }],  // 3-5 targets
  riskReward: "X:1", conviction: "High"|"Medium-High"|"Medium"|"Low",
  keyConditions: [{ label, status: "met"|"pending"|"failed", impact }],
  bearCase: "paragraph",
  disclaimer: "Analytical data only. Not financial advice. Consult a qualified advisor.",
}

17. const analysisGaps = [{ topic, description, issueTitle }]  // 3-5 gaps

Export:
export default function ComponentName() {
  return <StockDashboard stock={stock} priceHistory={priceHistory} maData={maData} technicals={technicals} fundamentalData={fundamentalData} financials={financials} capitalMetrics={capitalMetrics} peerComparison={peerComparison} radarPeer={radarPeer} analystTargets={analystTargets} eventImpacts={eventImpacts} keyMetrics={keyMetrics} newsItems={newsItems} geoOverlay={geoOverlay} riskNotices={riskNotices} verdict={verdict} analysisGaps={analysisGaps} dashboardFile="src/dashboards/stocks/SLUG-${date}.jsx" />
}

RULES:
- Output ONLY raw .jsx — NO markdown code blocks
- First line: // METADATA: {"title":"...","componentName":"...","slug":"..."}
- ALL prices, P/E, earnings etc from research data. Don't invent numbers.
- If data unavailable, use reasonable estimates and note "(est.)" in the value.
- News URLs: use real URLs from research or "" if not found. NEVER fabricate URLs.
- Colors: #06b6d4 cyan, #10b981 green, #f59e0b amber, #ef4444 red, #8b5cf6 violet
- dashboardFile: src/dashboards/stocks/[slug]-${date}.jsx`
}

// ── App.jsx patcher ─────────────────────────────────────────────────────────────
function patchAppJsx(appContent, { componentName, importPath, routePath, title, type, date }) {
  let result = appContent

  // Add import after the last existing import
  const importMatches = [...result.matchAll(/^import .+$/gm)]
  if (!importMatches.length) throw new Error('No imports found in App.jsx')
  const last = importMatches[importMatches.length - 1]
  const insertPos = last.index + last[0].length
  result = result.slice(0, insertPos) + `\nimport ${componentName} from '${importPath}'` + result.slice(insertPos)

  // Add entry to dashboards array before the closing ]
  const arrStart = result.indexOf('const dashboards = [')
  if (arrStart === -1) throw new Error('dashboards array not found')
  let depth = 0, arrEnd = -1
  for (let i = result.indexOf('[', arrStart); i < result.length; i++) {
    if (result[i] === '[') depth++
    else if (result[i] === ']') { depth--; if (depth === 0) { arrEnd = i; break } }
  }
  if (arrEnd === -1) throw new Error('Could not find end of dashboards array')

  const typeStr = type === 'stock' ? 'stocks' : 'geopolitical'
  const safeTitle = title.replace(/'/g, "\\'")
  const entry = `  { path: '${routePath}', component: ${componentName}, title: '${safeTitle}', type: '${typeStr}', date: '${date}' },\n`
  result = result.slice(0, arrEnd) + entry + result.slice(arrEnd)

  return result
}

// ── Helpers ──────────────────────────────────────────────────────────────────────
function slugify(text) {
  return text.toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim().replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50)
}

function extractComponentName(jsx) {
  const m = jsx.match(/export\s+default\s+function\s+(\w+)/)
  return m?.[1] || 'NewDashboard'
}

// ── Main handler ────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { prompt } = req.body || {}
  if (!prompt?.trim()) return res.status(400).json({ error: 'Missing prompt' })

  const geminiKey = process.env.GEMINI_API_KEY
  const anthropicKey = process.env.ANTHROPIC_API_KEY
  const githubToken = process.env.GITHUB_TOKEN

  if (!geminiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' })
  if (!anthropicKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' })
  if (!githubToken) return res.status(500).json({ error: 'GITHUB_TOKEN not configured' })

  const type = detectType(prompt.trim())
  const date = new Date().toISOString().slice(0, 10)
  const subdir = type === 'stock' ? 'stocks' : 'geopolitical'

  // ── Step 1: Parallel — Gemini searches + list geo dashboards + read App.jsx ──
  const queries = buildSearchQueries(type, prompt.trim(), date)
  const [searchResults, geoFiles, appFile] = await Promise.all([
    Promise.all(queries.map(q => geminiSearch(geminiKey, q))),
    listGitHubDir(githubToken, 'src/dashboards/geopolitical'),
    readGitHubFile(githubToken, 'src/App.jsx'),
  ])

  if (!appFile) return res.status(502).json({ error: 'Failed to read App.jsx from GitHub' })

  // ── Step 2: Build Claude prompt ──────────────────────────────────────────────
  const claudePrompt = type === 'geopolitical'
    ? buildGeoPrompt(prompt.trim(), date, searchResults)
    : buildStockPrompt(prompt.trim(), date, searchResults, geoFiles)

  // ── Step 3: Call Claude with retry, timeout, and model fallback ──────────────
  const models = [
    { id: 'claude-sonnet-4-6', timeout: 180000, maxTokens: 12000 },
    { id: 'claude-haiku-4-5-20251001', timeout: 120000, maxTokens: 10000 },
  ]
  let claudeText = ''
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
            await new Promise(r => setTimeout(r, attempt * 2000))
            continue
          }
          break
        }

        if (!claudeRes.ok) {
          const err = await claudeRes.json().catch(() => ({}))
          return res.status(502).json({ error: `Claude API error: ${err.error?.message || claudeRes.status}` })
        }
        const data = await claudeRes.json()
        claudeText = data?.content?.[0]?.text || ''
        if (claudeText) { usedModel = model; break }
      } catch (e) {
        if (e.name === 'AbortError') break
        if (attempt === maxRetries) break
        await new Promise(r => setTimeout(r, attempt * 2000))
      }
    }
    if (claudeText) break
  }

  if (!claudeText) return res.status(502).json({ error: 'All Claude models failed or timed out — try again in a few minutes' })

  // ── Step 4: Parse metadata + JSX ─────────────────────────────────────────────
  // Strip markdown code fences if present
  claudeText = claudeText.replace(/^```(?:jsx|javascript|js)?\s*\n?/gm, '').replace(/\n?```\s*$/gm, '').trim()

  // Extract METADATA comment from first line
  const metaMatch = claudeText.match(/^\/\/\s*METADATA:\s*(\{[^\n]+\})\s*\n/)
  let meta = {}
  let jsxContent = claudeText
  if (metaMatch) {
    try { meta = JSON.parse(metaMatch[1]) } catch { /* extract from code */ }
    jsxContent = claudeText.slice(metaMatch[0].length)
  }

  // Validate output
  if (!jsxContent.includes('import') || !jsxContent.includes('export default')) {
    return res.status(502).json({ error: 'Claude generated invalid output (missing import or export)', preview: claudeText.slice(0, 500) })
  }

  const componentName = meta.componentName || extractComponentName(jsxContent)
  const title = meta.title || prompt.trim()
  const slug = meta.slug || slugify(title)
  const filename = `${slug}-${date}.jsx`
  const filepath = `src/dashboards/${subdir}/${filename}`
  const routePrefix = type === 'stock' ? '/stocks' : '/geo'
  const routePath = `${routePrefix}/${slug}`
  const importPath = `./dashboards/${subdir}/${slug}-${date}`

  // ── Step 5: Patch App.jsx ────────────────────────────────────────────────────
  let patchedApp
  try {
    patchedApp = patchAppJsx(appFile.content, { componentName, importPath, routePath, title, type, date })
  } catch (err) {
    return res.status(500).json({ error: `Failed to patch App.jsx: ${err.message}` })
  }

  // ── Step 6: Atomic commit — dashboard file + App.jsx ─────────────────────────
  try {
    await commitFiles(githubToken, [
      { path: filepath, content: jsxContent },
      { path: 'src/App.jsx', content: patchedApp },
    ], `feat: ${type === 'stock' ? 'stock' : 'geopolitical'} analysis - ${title} - ${date}`)
  } catch (err) {
    return res.status(502).json({ error: `GitHub commit failed: ${err.message}` })
  }

  // ── Done ─────────────────────────────────────────────────────────────────────
  return res.status(200).json({
    success: true,
    type: type === 'stock' ? 'stocks' : 'geopolitical',
    title,
    path: routePath,
    file: filepath,
    componentName,
    model: usedModel,
    searchesRun: queries.length,
  })
}
