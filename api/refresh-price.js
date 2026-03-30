export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { ticker, companyName } = req.body || {}
  if (!ticker) return res.status(400).json({ error: 'Missing ticker' })

  const geminiKey = process.env.GEMINI_API_KEY
  if (!geminiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' })

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tools: [{ google_search: {} }],
          contents: [{
            role: 'user',
            parts: [{
              text: `Go to Yahoo Finance and get the current stock price for ${companyName || ticker} (ticker: ${ticker}).

Search Yahoo Finance specifically: "yahoo finance ${ticker} stock price" — use the price shown on the Yahoo Finance quote page for this ticker. Yahoo Finance is the primary and preferred source. If Yahoo Finance is unavailable, fall back to Google Finance or MarketWatch.

Return ONLY a JSON object with no markdown:
{
  "price": number,
  "change": number,
  "changePct": number,
  "currency": "EUR" or "USD" or appropriate,
  "asOf": "HH:MM TZ or market session label e.g. 15:32 EEST or Closed",
  "source": "Yahoo Finance"
}

If the price is unavailable, return { "error": "Price unavailable" }.`,
            }],
          }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 256 },
        }),
      }
    )

    if (!geminiRes.ok) return res.status(502).json({ error: `Gemini API error ${geminiRes.status}` })

    const data = await geminiRes.json()
    const parts = data?.candidates?.[0]?.content?.parts || []
    const text = parts.map(p => p.text || '').join('').trim()
    const clean = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()

    let parsed
    try {
      parsed = JSON.parse(clean)
    } catch {
      const match = clean.match(/\{[\s\S]*\}/)
      if (match) parsed = JSON.parse(match[0])
    }

    if (!parsed || parsed.error) return res.status(502).json({ error: parsed?.error || 'Could not parse price response' })
    if (!parsed.price) return res.status(502).json({ error: 'Price not found in response' })

    // Ensure numeric fields are actual numbers
    return res.status(200).json({
      price: Number(parsed.price) || 0,
      change: Number(parsed.change) || 0,
      changePct: Number(parsed.changePct) || 0,
      currency: parsed.currency || '',
      asOf: parsed.asOf || '',
      source: parsed.source || '',
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
