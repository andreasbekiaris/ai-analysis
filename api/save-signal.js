const REPO = 'andreasbekiaris/ai-analysis'
const IMPORTANCE_THRESHOLD = 7

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { signal, dashboardFile } = req.body || {}
  if (!signal || !dashboardFile) return res.status(400).json({ error: 'Missing signal or dashboardFile' })

  const geminiKey = process.env.GEMINI_API_KEY
  const githubToken = process.env.GITHUB_TOKEN
  if (!geminiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' })
  if (!githubToken) return res.status(500).json({ error: 'GITHUB_TOKEN not configured' })

  // ── Step 1: Ask Gemini to judge importance ─────────────────────────────────
  const judgePrompt = `You are a senior geopolitical intelligence analyst. Evaluate this political signal for its analytical importance.

Actor: ${signal.actor} (${signal.role})
Platform: ${signal.platform}
Date: ${signal.date}
Quote: "${signal.quote}"
Context: ${signal.context || 'N/A'}
Signal Type: ${signal.signalType}
Scenario Implication: ${signal.scenarioImplication || 'N/A'}

Score 1–10 on:
- Is this actor a key decision-maker in the conflict?
- Does this represent a genuine shift in position or reveal intent?
- Could this meaningfully change scenario probabilities?
- Is this specific and actionable, or vague/generic?

Threshold: 7+ = worth permanently archiving in the analysis.

Respond ONLY with valid JSON, no markdown: {"score": <number 1-10>, "reason": "<one concise sentence>"}`

  let score = 0
  let reason = 'Unable to assess'

  try {
    const geminiRes = await fetch(
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

    if (geminiRes.ok) {
      const data = await geminiRes.json()
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
    {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github+json',
      },
    }
  )

  if (!fileRes.ok) {
    const errData = await fileRes.json().catch(() => ({}))
    return res.status(502).json({ error: `GitHub read failed: ${errData.message || fileRes.status}` })
  }

  const fileData = await fileRes.json()
  const currentContent = Buffer.from(fileData.content, 'base64').toString('utf8')

  // ── Step 3: Insert signal as first entry in politicalComments ─────────────
  const marker = 'const politicalComments = ['
  const insertPos = currentContent.indexOf(marker)
  if (insertPos === -1) {
    return res.status(400).json({ error: 'politicalComments array not found in dashboard file' })
  }

  const afterBracket = insertPos + marker.length
  const newEntry = formatSignalEntry(signal)
  const newContent =
    currentContent.slice(0, afterBracket) +
    '\n' + newEntry + ',' +
    currentContent.slice(afterBracket)

  // ── Step 4: Commit back to GitHub ─────────────────────────────────────────
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
        message: `feat: add political signal — ${signal.actor} (${signal.date})`,
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

function formatSignalEntry(s) {
  const q = (v) => JSON.stringify(String(v || ''))
  return `  {
    actor: ${q(s.actor)},
    role: ${q(s.role)},
    platform: ${q(s.platform)},
    date: ${q(s.date)},
    time: ${q(s.time)},
    quote: ${q(s.quote)},
    context: ${q(s.context)},
    signalType: ${q(s.signalType)},
    marketImpact: ${q(s.marketImpact || 'None observed')},
    scenarioImplication: ${q(s.scenarioImplication)},
    verified: ${s.verified === true ? 'true' : 'false'},
  }`
}
