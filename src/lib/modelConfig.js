export const MODEL_CONFIG_API_BASE = 'https://ai-analysis-production-0590.up.railway.app'

export const DEFAULT_MODEL_CONFIG = {
  version: 1,
  generationModel: 'claude-sonnet-4-6',
  fallbackModel: 'claude-haiku-4-5-20251001',
  reanalysisModel: 'claude-sonnet-4-6',
  stockReanalysisModel: 'claude-sonnet-4-6',
  searchModel: 'gemini-2.5-flash',
}

export const MODEL_LABELS = {
  'claude-sonnet-4-6': 'Claude Sonnet 4.6',
  'claude-haiku-4-5-20251001': 'Claude Haiku 4.5',
  'gemini-2.5-flash': 'Gemini 2.5 Flash',
  'gemini-2.5-flash-lite': 'Gemini 2.5 Flash Lite',
}

export const CLAUDE_MODEL_OPTIONS = [
  'claude-sonnet-4-6',
  'claude-haiku-4-5-20251001',
]

export const GEMINI_MODEL_OPTIONS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
]

export function labelModel(modelId) {
  return MODEL_LABELS[modelId] || modelId || 'Not configured'
}

export async function fetchModelConfig() {
  const res = await fetch(`${MODEL_CONFIG_API_BASE}/api/model-config`)
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || `Model config fetch failed (${res.status})`)
  return { ...DEFAULT_MODEL_CONFIG, ...(data.config || {}) }
}
