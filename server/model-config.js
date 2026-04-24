const REPO = 'andreasbekiaris/ai-analysis'
const BRANCH = 'main'
const FILE_PATH = 'model-config.json'

export const DEFAULT_MODEL_CONFIG = {
  version: 1,
  generationModel: 'claude-sonnet-4-6',
  fallbackModel: 'claude-haiku-4-5-20251001',
  reanalysisModel: 'claude-sonnet-4-6',
  stockReanalysisModel: 'claude-sonnet-4-6',
  searchModel: 'gemini-2.5-flash',
}

const MODEL_KEYS = [
  'generationModel',
  'fallbackModel',
  'reanalysisModel',
  'stockReanalysisModel',
  'searchModel',
]

function ghHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
  }
}

function normalizeModelId(value) {
  if (value === null) return ''
  if (typeof value !== 'string') return null
  const model = value.trim()
  if (!model) return ''
  if (!/^[a-zA-Z0-9._:-]+$/.test(model)) return null
  return model
}

export function normalizeModelConfig(input = {}) {
  const next = { ...DEFAULT_MODEL_CONFIG, ...(input || {}), version: 1 }
  for (const key of MODEL_KEYS) {
    const normalized = normalizeModelId(next[key])
    if (normalized === null) throw new Error(`Invalid model id for ${key}`)
    next[key] = normalized
  }
  if (!next.generationModel) throw new Error('generationModel is required')
  if (!next.reanalysisModel) next.reanalysisModel = next.generationModel
  if (!next.stockReanalysisModel) next.stockReanalysisModel = next.reanalysisModel
  if (!next.searchModel) next.searchModel = DEFAULT_MODEL_CONFIG.searchModel
  return next
}

export function uniqueModelList(...models) {
  return [...new Set(models.filter(Boolean))]
}

export async function readModelConfig(token) {
  if (!token) return { config: DEFAULT_MODEL_CONFIG, sha: null }
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`,
    { headers: ghHeaders(token) }
  )
  if (!res.ok) {
    if (res.status === 404) return { config: DEFAULT_MODEL_CONFIG, sha: null }
    throw new Error(`Model config read failed: ${res.status} ${await res.text()}`)
  }
  const data = await res.json()
  const content = Buffer.from(data.content, 'base64').toString('utf8')
  return { config: normalizeModelConfig(JSON.parse(content)), sha: data.sha }
}

async function writeModelConfig(token, config, sha, commitMessage) {
  const content = Buffer.from(JSON.stringify(config, null, 2) + '\n', 'utf8').toString('base64')
  const body = {
    message: commitMessage,
    content,
    branch: BRANCH,
  }
  if (sha) body.sha = sha

  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`,
    { method: 'PUT', headers: ghHeaders(token), body: JSON.stringify(body) }
  )
  if (!res.ok) throw new Error(`Model config write failed: ${res.status} ${await res.text()}`)
  return res.json()
}

export async function getModelConfigHandler(_req, res) {
  try {
    const { config } = await readModelConfig(process.env.GITHUB_TOKEN)
    return res.json({ config })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export async function postModelConfigHandler(req, res) {
  const expected = process.env.MODEL_CONFIG_PASSWORD || process.env.SCHEDULE_PASSWORD || '2905'
  const token = process.env.GITHUB_TOKEN
  if (!token) return res.status(500).json({ error: 'GITHUB_TOKEN not configured' })

  const { password, patch, commitMessage } = req.body || {}
  if (password !== expected) return res.status(401).json({ error: 'Invalid password' })
  if (!patch || typeof patch !== 'object') return res.status(400).json({ error: 'Missing patch object' })

  try {
    const { config, sha } = await readModelConfig(token)
    const next = normalizeModelConfig({
      ...config,
      ...Object.fromEntries(Object.entries(patch).filter(([key]) => MODEL_KEYS.includes(key))),
      updatedAt: new Date().toISOString(),
    })
    await writeModelConfig(token, next, sha, commitMessage || 'chore: update model config')
    return res.json({ config: next })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
