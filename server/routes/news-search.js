import { readModelConfig } from '../model-config.js'

const SEARCH_TOPICS = {
  global: `global market news, geopolitics, central banks, oil, defense, AI chips, major equity moves`,
  local: `Greek market news, ATHEX, Greek banks, Greece bonds, Greece energy, Eastern Mediterranean market risks`,
}

function normalizeSentiment(value) {
  const s = String(value || '').toLowerCase()
  if (['bullish', 'positive'].includes(s)) return 'bullish'
  if (['bearish', 'negative'].includes(s)) return 'bearish'
  return 'neutral'
}

function cleanNews(raw, scope) {
  if (!Array.isArray(raw)) return []
  return raw
    .filter((item) => item && typeof item.headline === 'string' && item.headline.trim().length > 10)
    .slice(0, 8)
    .map((item) => ({
      headline: item.headline.trim(),
      source: String(item.source || 'Unknown').trim(),
      url: typeof item.url === 'string' ? item.url : '',
      date: item.date || new Date().toISOString(),
      sentiment: normalizeSentiment(item.sentiment),
      tag: item.tag || (scope === 'local' ? 'Local' : 'Global'),
    }))
}

export async function newsSearchHandler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { scope = 'global' } = req.body || {}
  const mode = scope === 'local' ? 'local' : 'global'
  const geminiKey = process.env.GEMINI_API_KEY
  const githubToken = process.env.GITHUB_TOKEN
  if (!geminiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' })

  const { config } = await readModelConfig(githubToken).catch(() => ({ config: { searchModel: 'gemini-2.5-flash' } }))
  const model = config.searchModel || 'gemini-2.5-flash'
  const today = new Date().toISOString().slice(0, 10)

  const prompt = `You are a market news desk. Search the web for the latest ${mode} financial/geopolitical headlines as of ${today}.

Scope: ${SEARCH_TOPICS[mode]}

Return ONLY a valid JSON array with 5-8 items. Each item must have:
- headline: concise headline
- source: publication
- date: ISO timestamp or YYYY-MM-DD
- url: actual article URL, or source landing URL if full URL unavailable
- sentiment: bullish | bearish | neutral
- tag: short category, 1-3 words

Rules:
- Prioritize fresh, market-moving items from reputable sources.
- Do not invent articles or URLs.
- No markdown, no prose, JSON array only.`

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tools: [{ google_search: {} }],
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 4096 },
        }),
      }
    )

    if (!geminiRes.ok) {
      const errBody = await geminiRes.text().catch(() => '')
      return res.status(502).json({ error: `Gemini API returned ${geminiRes.status}: ${errBody.slice(0, 160)}` })
    }

    const data = await geminiRes.json()
    const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).filter(Boolean).join('\n') || ''
    let parsed = []
    try {
      parsed = JSON.parse(text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim())
    } catch {
      const match = text.match(/\[[\s\S]*\]/)
      if (match) parsed = JSON.parse(match[0])
    }

    const news = cleanNews(parsed, mode)
    return res.json({ scope: mode, news, count: news.length, model })
  } catch (err) {
    return res.status(500).json({ error: err.message || 'News search failed' })
  }
}
