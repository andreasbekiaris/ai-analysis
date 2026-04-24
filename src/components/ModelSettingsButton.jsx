import { useEffect, useState } from 'react'
import { BrainCircuit, Check, Loader, Lock, Save, X } from 'lucide-react'
import {
  CLAUDE_MODEL_OPTIONS,
  DEFAULT_MODEL_CONFIG,
  GEMINI_MODEL_OPTIONS,
  MODEL_CONFIG_API_BASE,
  fetchModelConfig,
  labelModel,
  normalizeModelConfig,
} from '../lib/modelConfig'

const BOX = {
  card: '#111827',
  deep: '#0a0f1e',
  border: '#1e293b',
  border2: '#334155',
  text: '#f8fafc',
  muted: '#94a3b8',
  dim: '#64748b',
  cyan: '#06b6d4',
  cyanHi: '#22d3ee',
  emerald: '#10b981',
  crimson: '#ef4444',
}

function ModelSelect({ label, value, onChange, options, detail }) {
  const optionSet = options.includes(value) || !value ? options : [value, ...options]

  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <span style={{
        color: BOX.muted,
        fontSize: '0.7rem',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        fontWeight: 700,
      }}>
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        title={value}
        style={{
          width: '100%',
          background: BOX.deep,
          color: BOX.text,
          border: `1px solid ${BOX.border2}`,
          borderRadius: 7,
          padding: '0.58rem 0.72rem',
          fontSize: '0.82rem',
          fontFamily: 'ui-monospace, monospace',
          outline: 'none',
          cursor: 'pointer',
        }}
      >
        {optionSet.map((model) => (
          <option key={model} value={model}>
            {labelModel(model)}
          </option>
        ))}
      </select>
      <span style={{ color: BOX.dim, fontSize: '0.68rem', lineHeight: 1.35 }}>{detail}</span>
    </label>
  )
}

export default function ModelSettingsButton({ analysisEngine = {} }) {
  const onConfigChange = analysisEngine.onConfigChange
  const [open, setOpen] = useState(false)
  const [config, setConfig] = useState(analysisEngine.config || DEFAULT_MODEL_CONFIG)
  const [draft, setDraft] = useState(analysisEngine.config || DEFAULT_MODEL_CONFIG)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const [savedAt, setSavedAt] = useState(null)

  useEffect(() => {
    if (analysisEngine.config) {
      const next = normalizeModelConfig(analysisEngine.config)
      setConfig(next)
      setDraft(next)
    }
  }, [analysisEngine.config])

  useEffect(() => {
    fetchModelConfig()
      .then((next) => {
        setConfig(next)
        setDraft(next)
        onConfigChange?.(next)
      })
      .catch(() => {})
  }, [onConfigChange])

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const save = async () => {
    setLoading(true)
    setErrorMsg(null)
    setSavedAt(null)
    try {
      const normalizedDraft = normalizeModelConfig(draft)
      const patch = {
        generationModel: normalizedDraft.generationModel,
        fallbackModel: normalizedDraft.fallbackModel,
        reanalysisModel: normalizedDraft.reanalysisModel,
        stockReanalysisModel: normalizedDraft.stockReanalysisModel,
        searchModel: normalizedDraft.searchModel,
      }
      const res = await fetch(`${MODEL_CONFIG_API_BASE}/api/model-config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          patch,
          commitMessage: 'chore: update analysis model config',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || `Save failed (${res.status})`)
      const next = { ...DEFAULT_MODEL_CONFIG, ...(data.config || {}) }
      setConfig(next)
      setDraft(next)
      onConfigChange?.(next)
      setPassword('')
      setSavedAt(new Date().toLocaleTimeString())
    } catch (err) {
      setErrorMsg(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        type="button"
        className="site-navbar-engine"
        title={analysisEngine.detail}
        onClick={() => { setDraft(config); setOpen(true) }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.42rem',
          color: BOX.cyanHi, fontSize: '0.74rem', fontWeight: 700,
          padding: '0.42rem 0.78rem',
          border: '1px solid rgba(6,182,212,0.28)',
          borderRadius: 999,
          background: 'rgba(6,182,212,0.08)',
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
          letterSpacing: '0.02em',
          whiteSpace: 'nowrap',
          minWidth: 0,
          maxWidth: 'min(100%, 320px)',
          cursor: 'pointer',
        }}
      >
        <BrainCircuit size={13} />
        <span className="site-navbar-engine-label" style={{ color: '#8888aa' }}>LLMs</span>
        <strong style={{
          display: 'block',
          flex: '1 1 auto',
          color: BOX.text,
          fontSize: '0.73rem',
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {labelModel(config.generationModel)}
        </strong>
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            padding: '1rem',
            background: 'rgba(0,0,0,0.72)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            overflowY: 'auto',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 620,
              background: BOX.card,
              border: `1px solid ${BOX.border2}`,
              borderRadius: 12,
              padding: '1.35rem',
              margin: 'auto 0',
              maxHeight: 'calc(100vh - 2rem)',
              overflowY: 'auto',
              boxShadow: '0 24px 70px rgba(0,0,0,0.55)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <BrainCircuit size={18} color={BOX.cyanHi} />
                <span style={{ color: BOX.text, fontWeight: 800, fontSize: '1rem' }}>Analysis Models</span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', color: BOX.dim, cursor: 'pointer', padding: 4 }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0.85rem', marginBottom: '1rem' }}>
              <ModelSelect
                label="New dashboards"
                options={CLAUDE_MODEL_OPTIONS}
                value={draft.generationModel}
                onChange={(generationModel) => setDraft({ ...draft, generationModel })}
                detail="Used for fresh geopolitical, equity, and sector dashboard generation."
              />
              <ModelSelect
                label="Fallback"
                options={CLAUDE_MODEL_OPTIONS}
                value={draft.fallbackModel}
                onChange={(fallbackModel) => setDraft({ ...draft, fallbackModel })}
                detail="Tried after the primary model if generation is overloaded or returns no output."
              />
              <ModelSelect
                label="Geo reanalysis"
                options={CLAUDE_MODEL_OPTIONS}
                value={draft.reanalysisModel}
                onChange={(reanalysisModel) => setDraft({ ...draft, reanalysisModel })}
                detail="Used when a geopolitical dashboard is deeply reanalyzed."
              />
              <ModelSelect
                label="Stock reanalysis"
                options={CLAUDE_MODEL_OPTIONS}
                value={draft.stockReanalysisModel}
                onChange={(stockReanalysisModel) => setDraft({ ...draft, stockReanalysisModel })}
                detail="Used when an equity dashboard is deeply reanalyzed."
              />
              <ModelSelect
                label="Search grounding"
                options={GEMINI_MODEL_OPTIONS}
                value={draft.searchModel}
                onChange={(searchModel) => setDraft({ ...draft, searchModel })}
                detail="Used for the live web-search research pass before dashboard generation."
              />
            </div>

            <div style={{ borderTop: `1px solid ${BOX.border}`, paddingTop: '1rem', marginBottom: '1rem' }}>
              <div style={{
                color: BOX.muted,
                fontSize: '0.72rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '0.45rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontWeight: 700,
              }}>
                <Lock size={11} /> Admin password
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                style={{
                  width: '100%',
                  background: BOX.deep,
                  color: BOX.text,
                  border: `1px solid ${BOX.border2}`,
                  borderRadius: 7,
                  padding: '0.58rem 0.72rem',
                  fontFamily: 'ui-monospace, monospace',
                  outline: 'none',
                }}
              />
            </div>

            {errorMsg && <div style={{ color: BOX.crimson, fontSize: '0.78rem', marginBottom: '0.75rem' }}>{errorMsg}</div>}
            {savedAt && (
              <div style={{ color: BOX.emerald, fontSize: '0.78rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Check size={12} /> Saved at {savedAt}. New jobs use the updated models.
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.55rem' }}>
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{ background: 'none', border: `1px solid ${BOX.border}`, color: BOX.muted, padding: '0.52rem 0.95rem', borderRadius: 7, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                disabled={loading || !password}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.42rem',
                  background: loading || !password ? BOX.border2 : BOX.cyan,
                  color: loading || !password ? BOX.dim : '#04141a',
                  border: 'none',
                  padding: '0.52rem 0.95rem',
                  borderRadius: 7,
                  fontWeight: 800,
                  cursor: loading || !password ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? <><Loader size={13} style={{ animation: 'spin 1s linear infinite' }} /> Saving</> : <><Save size={13} /> Save</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
