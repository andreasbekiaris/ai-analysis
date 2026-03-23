export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { actors, platforms, analysisTitle, hoursBack = 48 } = req.body || {}
  if (!actors?.length) return res.status(400).json({ error: 'Missing actors' })

  const key = process.env.GEMINI_API_KEY
  if (!key) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' })

  const platformList = platforms?.length ? platforms.join(', ') : 'X/Twitter, Truth Social, Telegram, Facebook, Instagram'
  const actorList = actors.join(', ')
  const timeWindow =
    hoursBack <= 24 ? 'last 24 hours' :
    hoursBack <= 48 ? 'last 48 hours' :
    hoursBack <= 168 ? 'last 7 days' : 'last 30 days'

  const prompt = `You are a political signal intelligence analyst with real-time web access. Search for the most recent public statements made by these actors: ${actorList}

Platforms to search: ${platformList}
Time window: ${timeWindow}
Analysis context: "${analysisTitle}"

For each statement you find, return a JSON array. Each object must have exactly these fields:
- actor: full name (string)
- role: their official title/role (string)
- platform: exact platform name — one of: X/Twitter, Truth Social, Telegram, Facebook, Instagram, YouTube, Press Conference, Parliament, State TV, UN Speech, Official Statement (string)
- date: ISO date YYYY-MM-DD (string)
- time: time with timezone if known e.g. "14:32 ET", or empty string if unknown (string)
- quote: the exact quote, or closest verified paraphrase if exact wording unavailable (string)
- context: 1–2 sentences on what was happening when this was said (string)
- signalType: one of exactly: "escalatory", "de-escalatory", "diplomatic", "economic", "ambiguous" (string)
- marketImpact: brief note on any immediate market reaction, or "None observed" (string)
- scenarioImplication: 1–2 sentences on what this means for the conflict/situation trajectory (string)
- verified: true if confirmed real quote, false if paraphrase or reconstructed (boolean)

Rules:
- Only include statements from the ${timeWindow}
- Prioritize the most geopolitically significant statements
- Return ONLY a valid JSON array — no markdown fences, no explanatory text, no preamble
- If you find no real statements in this time window, return exactly: []
- Do not fabricate statements — only include what you actually find via search`

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
      console.error('Gemini fetch-signals error:', geminiRes.status, errBody)
      return res.status(502).json({ error: `Gemini API returned ${geminiRes.status}` })
    }

    const data = await geminiRes.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''

    // Parse JSON — strip markdown fences if present
    let signals = []
    try {
      const clean = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
      signals = JSON.parse(clean)
      if (!Array.isArray(signals)) signals = []
    } catch {
      const match = text.match(/\[[\s\S]*\]/)
      if (match) {
        try { signals = JSON.parse(match[0]) } catch { signals = [] }
      }
    }

    // Basic shape validation — drop malformed entries
    signals = signals.filter(
      s => s && typeof s.actor === 'string' && typeof s.quote === 'string' && s.quote.length > 5
    )

    return res.status(200).json({ signals, count: signals.length })
  } catch (err) {
    console.error('fetch-signals proxy error:', err)
    return res.status(500).json({ error: 'Failed to reach Gemini API' })
  }
}
