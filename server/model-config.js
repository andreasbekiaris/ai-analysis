const REPO = 'andreasbekiaris/ai-analysis'
const BRANCH = 'main'
const FILE_PATH = 'model-config.json'

export const DEFAULT_MODEL_CONFIG = {
  version: 1,
  generationModel: 'claude-sonnet-4-20250514',
  fallbackModel: 'claude-3-7-sonnet-20250219',
  reanalysisModel: 'claude-sonnet-4-20250514',
  stockReanalysisModel: 'claude-sonnet-4-20250514',
  searchModel: 'gemini-2.5-flash',
}

export const CLAUDE_MODEL_OPTIONS = [
  'claude-opus-4-1-20250805',
  'claude-opus-4-20250514',
  'claude-sonnet-4-20250514',
  'claude-3-7-sonnet-20250219',
  'claude-3-5-sonnet-20241022',
  'claude-3-5-haiku-20241022',
  'claude-3-haiku-20240307',
]

export const GEMINI_MODEL_OPTIONS = [
  'gemini-2.5-pro',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
]

const MODEL_ID_ALIASES = {
  'claude-opus-4-6': 'claude-opus-4-1-20250805',
  'claude-opus-4-5': 'claude-opus-4-1-20250805',
  'claude-sonnet-4-6': 'claude-sonnet-4-20250514',
  'claude-sonnet-4-5-20250929': 'claude-sonnet-4-20250514',
  'claude-haiku-4-5-20251001': 'claude-3-5-haiku-20241022',
}

const MODEL_MAX_OUTPUT_TOKENS = {
  'claude-3-5-sonnet-20241022': 8192,
  'claude-3-5-haiku-20241022': 8192,
  'claude-3-haiku-20240307': 4096,
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
  return MODEL_ID_ALIASES[model] || model
}

function assertSupportedModel(key, model) {
  const options = key === 'searchModel' ? GEMINI_MODEL_OPTIONS : CLAUDE_MODEL_OPTIONS
  if (!options.includes(model)) {
    throw new Error(`Unsupported model id for ${key}: ${model}`)
  }
}

export function maxOutputTokensForModel(model, requested) {
  const normalized = normalizeModelId(model)
  const cap = MODEL_MAX_OUTPUT_TOKENS[normalized]
  return cap ? Math.min(requested, cap) : requested
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
  for (const key of MODEL_KEYS) {
    assertSupportedModel(key, next[key])
  }
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
