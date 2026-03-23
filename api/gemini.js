export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { question, context, mode } = req.body || {}
  if (!question?.trim()) {
    return res.status(400).json({ error: 'Missing question' })
  }

  const key = process.env.GEMINI_API_KEY
  if (!key) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY is not configured. Add it in Vercel → Settings → Environment Variables.',
    })
  }

  const systemInstruction =
    mode === 'simulation'
      ? `You are a senior geopolitical analyst running a fast war-game simulation. The user will describe a hypothetical scenario. You must: (1) assess whether this is plausible given the context, (2) trace second and third-order consequences across military, economic, diplomatic, and humanitarian dimensions, (3) estimate how scenario probabilities shift as a result, and (4) give a clear actionable takeaway. Be direct, specific, and analytical. No disclaimers about being an AI.`
      : `You are a senior geopolitical and financial intelligence analyst. Answer the user's question based on the analysis context provided. Be concise, specific, and insightful. Draw on the scenario probabilities and verdict data. No generic hedging — give real analytical value. No disclaimers about being an AI.`

  const prompt = `${systemInstruction}

ANALYSIS CONTEXT:
${context}

USER ${mode === 'simulation' ? 'SCENARIO' : 'QUESTION'}:
${question}`

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      }
    )

    if (!geminiRes.ok) {
      const errBody = await geminiRes.text()
      console.error('Gemini API error:', geminiRes.status, errBody)
      return res.status(502).json({ error: `Gemini API returned ${geminiRes.status}` })
    }

    const data = await geminiRes.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      return res.status(502).json({ error: 'Empty response from Gemini' })
    }

    return res.status(200).json({ text })
  } catch (err) {
    console.error('Gemini proxy error:', err)
    return res.status(500).json({ error: 'Failed to reach Gemini API' })
  }
}
