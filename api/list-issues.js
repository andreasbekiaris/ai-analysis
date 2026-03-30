const REPO = 'andreasbekiaris/ai-analysis'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const token = process.env.GITHUB_TOKEN
  if (!token) return res.status(500).json({ error: 'GitHub token not configured' })

  try {
    const response = await fetch(
      `https://api.github.com/repos/${REPO}/issues?state=open&per_page=20&sort=created&direction=desc`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
        },
      }
    )

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch issues' })
    }

    const issues = await response.json()
    const items = issues.map(i => ({
      number: i.number,
      title: i.title,
      url: i.html_url,
      created: i.created_at,
      labels: i.labels.map(l => l.name),
    }))

    return res.status(200).json({ issues: items })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
