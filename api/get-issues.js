export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const token = process.env.GITHUB_TOKEN
  if (!token) return res.status(500).json({ error: 'GitHub token not configured' })

  const response = await fetch(
    'https://api.github.com/repos/andreasbekiaris/ai-analysis/issues?state=open&per_page=20',
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
      },
    }
  )

  const data = await response.json()
  if (!response.ok) return res.status(response.status).json({ error: data.message || 'Failed to fetch issues' })

  // GitHub returns PRs in the issues endpoint too — filter them out
  const issues = data
    .filter(i => !i.pull_request)
    .map(i => ({
      number: i.number,
      title: i.title,
      createdAt: i.created_at,
      url: i.html_url,
      labels: i.labels.map(l => l.name),
    }))

  return res.status(200).json({ issues })
}
