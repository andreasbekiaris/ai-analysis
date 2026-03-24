export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { ticker, companyName, hoursBack = 48 } = req.body || {}
  if (!ticker) return res.status(400).json({ error: 'Missing ticker' })

  const key = process.env.GEMINI_API_KEY
  if (!key) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' })

  const timeWindow =
    hoursBack <= 24 ? 'last 24 hours' :
    hoursBack <= 48 ? 'last 48 hours' :
    hoursBack <= 168 ? 'last 7 days' : 'last 30 days'

  const prompt = `You are a financial news intelligence analyst with real-time web access. Search for the most recent news about ${companyName || ticker} (ticker: ${ticker}).

Time window: ${timeWindow}

For each news item you find, return a JSON array. Each object must have exactly these fields:
- headline: the news headline (string)
- source: publication name e.g. "Bloomberg", "Reuters", "Financial Times" (string)
- date: ISO date YYYY-MM-DD (string)
- url: the actual article URL if you can find it, or empty string "" if not available (string)
- sentiment: one of "positive", "neutral", "negative" — how this news affects the stock (string)
- summary: 1–2 sentences explaining what happened and why it matters for investors (string)

Rules:
- Only include news from the ${timeWindow}
- Prioritize material news: earnings, analyst upgrades/downgrades, M&A, regulatory actions, major business developments
- Return ONLY a valid JSON array — no markdown fences, no explanatory text
- If you find no real news in this time window, return exactly: []
- Do not fabricate news — only include what you actually find via search`

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
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
      const errBody = await geminiRes.text()
      console.error('Gemini fetch-news error:', geminiRes.status, errBody)
      return res.status(502).json({ error: `Gemini API returned ${geminiRes.status}` })
    }

    const data = await geminiRes.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''

    let news = []
    try {
      const clean = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
      news = JSON.parse(clean)
      if (!Array.isArray(news)) news = []
    } catch {
      const match = text.match(/\[[\s\S]*\]/)
      if (match) {
        try { news = JSON.parse(match[0]) } catch { news = [] }
      }
    }

    news = news.filter(n => n && typeof n.headline === 'string' && n.headline.length > 5)

    return res.status(200).json({ news, count: news.length })
  } catch (err) {
    console.error('fetch-news proxy error:', err)
    return res.status(500).json({ error: 'Failed to reach Gemini API' })
  }
}
