export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'GitHub token not configured' });
  }

  const response = await fetch('https://api.github.com/repos/andreasbekiaris/ai-analysis/issues', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github+json',
    },
    body: JSON.stringify({ title: title.trim() }),
  });

  const data = await response.json();

  if (!response.ok) {
    return res.status(response.status).json({ error: data.message || 'Failed to create issue' });
  }

  return res.status(200).json({ number: data.number, url: data.html_url });
}
