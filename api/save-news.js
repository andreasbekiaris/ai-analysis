const REPO = 'andreasbekiaris/ai-analysis'
const IMPORTANCE_THRESHOLD = 6

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { newsItem, dashboardFile } = req.body || {}
  if (!newsItem || !dashboardFile) return res.status(400).json({ error: 'Missing newsItem or dashboardFile' })

  const geminiKey = process.env.GEMINI_API_KEY
  const githubToken = process.env.GITHUB_TOKEN
  if (!geminiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' })
  if (!githubToken) return res.status(500).json({ error: 'GITHUB_TOKEN not configured' })

  // ── Step 1: Judge importance ───────────────────────────────────────────────
  const judgePrompt = `You are a financial analyst evaluating whether a news item is important enough to permanently archive in a stock analysis dashboard.

Headline: "${newsItem.headline}"
Source: ${newsItem.source}
Date: ${newsItem.date}
Sentiment: ${newsItem.sentiment}
Summary: ${newsItem.summary || 'N/A'}

Score 1–10:
- Is this material to the company's business or stock price?
- Is this from a credible, reputable source?
- Does it represent new information vs. routine noise?
- Would an active investor need to know this?

Threshold: 6+ = worth archiving permanently.

Respond ONLY with valid JSON, no markdown: {"score": <number 1-10>, "reason": "<one concise sentence>"}`

  let score = 0
  let reason = 'Unable to assess'

  try {
    const judgeRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: judgePrompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 256 },
        }),
      }
    )
    if (judgeRes.ok) {
      const data = await judgeRes.json()
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
      try {
        const clean = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
        const parsed = JSON.parse(clean)
        score = Number(parsed.score) || 0
        reason = parsed.reason || reason
      } catch {
        const match = text.match(/\{[\s\S]*?\}/)
        if (match) {
          try {
            const parsed = JSON.parse(match[0])
            score = Number(parsed.score) || 0
            reason = parsed.reason || reason
          } catch { /* keep defaults */ }
        }
      }
    }
  } catch (err) {
    console.error('Gemini judgment error:', err)
    return res.status(502).json({ error: 'AI judgment failed' })
  }

  if (score < IMPORTANCE_THRESHOLD) {
    return res.status(200).json({ accepted: false, importance: score, reason })
  }

  // ── Step 2: Read file from GitHub ─────────────────────────────────────────
  const fileRes = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${dashboardFile}`,
    { headers: { Authorization: `Bearer ${githubToken}`, Accept: 'application/vnd.github+json' } }
  )
  if (!fileRes.ok) {
    const errData = await fileRes.json().catch(() => ({}))
    return res.status(502).json({ error: `GitHub read failed: ${errData.message || fileRes.status}` })
  }

  const fileData = await fileRes.json()
  const content = Buffer.from(fileData.content, 'base64').toString('utf8')

  // ── Step 3: Prepend to newsItems array ────────────────────────────────────
  const marker = 'const newsItems = ['
  const insertPos = content.indexOf(marker)
  if (insertPos === -1) {
    return res.status(400).json({ error: 'newsItems array not found in dashboard file' })
  }

  const q = (v) => JSON.stringify(String(v || ''))
  const newEntry = `  {
    headline: ${q(newsItem.headline)},
    source: ${q(newsItem.source)},
    date: ${q(newsItem.date)},
    url: ${q(newsItem.url || '')},
    sentiment: ${q(newsItem.sentiment)},
  }`

  const afterBracket = insertPos + marker.length
  const newContent = content.slice(0, afterBracket) + '\n' + newEntry + ',' + content.slice(afterBracket)

  // ── Step 4: Commit to GitHub ───────────────────────────────────────────────
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
        message: `feat: add news item — ${newsItem.headline.slice(0, 60)} (${newsItem.date})`,
        content: Buffer.from(newContent).toString('base64'),
        sha: fileData.sha,
      }),
    }
  )

  if (!commitRes.ok) {
    const errData = await commitRes.json().catch(() => ({}))
    return res.status(502).json({ error: `GitHub commit failed: ${errData.message || commitRes.status}` })
  }

  return res.status(200).json({ accepted: true, importance: score, reason })
}
