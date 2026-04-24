export const MODEL_CONFIG_API_BASE = 'https://ai-analysis-production-0590.up.railway.app'

export const DEFAULT_MODEL_CONFIG = {
  version: 1,
  generationModel: 'claude-sonnet-4-20250514',
  fallbackModel: 'claude-3-7-sonnet-20250219',
  reanalysisModel: 'claude-sonnet-4-20250514',
  stockReanalysisModel: 'claude-sonnet-4-20250514',
  searchModel: 'gemini-2.5-flash',
}

export const MODEL_LABELS = {
  'claude-opus-4-1-20250805': 'Claude Opus 4.1',
  'claude-opus-4-20250514': 'Claude Opus 4',
  'claude-sonnet-4-20250514': 'Claude Sonnet 4',
  'claude-3-7-sonnet-20250219': 'Claude 3.7 Sonnet',
  'claude-3-5-sonnet-20241022': 'Claude 3.5 Sonnet',
  'claude-3-5-haiku-20241022': 'Claude 3.5 Haiku',
  'claude-3-haiku-20240307': 'Claude 3 Haiku',
  'gemini-2.5-flash': 'Gemini 2.5 Flash',
  'gemini-2.5-pro': 'Gemini 2.5 Pro',
  'gemini-2.5-flash-lite': 'Gemini 2.5 Flash Lite',
}

export const MODEL_ID_ALIASES = {
  'claude-opus-4-6': 'claude-opus-4-1-20250805',
  'claude-opus-4-5': 'claude-opus-4-1-20250805',
  'claude-sonnet-4-6': 'claude-sonnet-4-20250514',
  'claude-sonnet-4-5-20250929': 'claude-sonnet-4-20250514',
  'claude-haiku-4-5-20251001': 'claude-3-5-haiku-20241022',
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

export function normalizeModelId(modelId) {
  return MODEL_ID_ALIASES[modelId] || modelId
}

export function normalizeModelConfig(config = {}) {
  const next = { ...DEFAULT_MODEL_CONFIG, ...(config || {}) }
  for (const key of ['generationModel', 'fallbackModel', 'reanalysisModel', 'stockReanalysisModel']) {
    next[key] = normalizeModelId(next[key])
    if (!CLAUDE_MODEL_OPTIONS.includes(next[key])) next[key] = DEFAULT_MODEL_CONFIG[key]
  }
  next.searchModel = normalizeModelId(next.searchModel)
  if (!GEMINI_MODEL_OPTIONS.includes(next.searchModel)) {
    next.searchModel = DEFAULT_MODEL_CONFIG.searchModel
  }
  return next
}

export function labelModel(modelId) {
  const normalized = normalizeModelId(modelId)
  return MODEL_LABELS[normalized] || normalized || 'Not configured'
}

export async function fetchModelConfig() {
  const res = await fetch(`${MODEL_CONFIG_API_BASE}/api/model-config`)
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || `Model config fetch failed (${res.status})`)
  return normalizeModelConfig(data.config)
}
