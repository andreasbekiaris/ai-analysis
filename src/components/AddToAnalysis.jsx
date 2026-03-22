import { useState } from 'react'
import { Plus, Send, CheckCircle, AlertCircle, Loader, ChevronRight, Microscope } from 'lucide-react'

const T = {
  bg: '#0a0f1e', card: '#111827', border: '#1e293b',
  text: '#f8fafc', muted: '#94a3b8', dim: '#64748b',
  cyan: '#06b6d4', emerald: '#10b981', amber: '#f59e0b', crimson: '#ef4444',
}

/**
 * AddToAnalysis — shared panel shown on every dashboard.
 *
 * Props:
 *   analysisTitle  — e.g. "Alpha Bank (ALPHA.AT)"
 *   analysisType   — "stock" | "geopolitical"
 *   gaps           — array of { topic, description, issueTitle }
 */
export default function AddToAnalysis({ analysisTitle, analysisType, gaps }) {
  const [submitted, setSubmitted] = useState(new Set())
  const [submitting, setSubmitting] = useState(null)
  const [error, setError] = useState(null)
  const [custom, setCustom] = useState('')
  const [customStatus, setCustomStatus] = useState(null) // null | 'loading' | 'done' | 'error'
  const [customMsg, setCustomMsg] = useState('')

  const createIssue = async (title, key) => {
    setSubmitting(key)
    setError(null)
    try {
      const res = await fetch('/api/create-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setSubmitted(prev => new Set([...prev, key]))
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(null)
    }
  }

  const submitCustom = async (e) => {
    e.preventDefault()
    if (!custom.trim() || customStatus === 'loading') return
    setCustomStatus('loading')
    setCustomMsg('')
    try {
      const title = `Extend ${analysisType === 'stock' ? 'stock' : 'geopolitical'} analysis — ${analysisTitle}: ${custom.trim()}`
      const res = await fetch('/api/create-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setCustomStatus('done')
      setCustomMsg(`Issue #${data.number} queued — analysis will be added when complete.`)
      setCustom('')
    } catch (err) {
      setCustomStatus('error')
      setCustomMsg(err.message)
    }
  }

  return (
    <div style={{
      background: T.card, border: `1px solid ${T.border}`,
      borderRadius: 10, padding: '1.25rem', marginTop: '1.5rem',
    }}>
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <div style={{ width: 3, height: 16, background: T.cyan, borderRadius: 2 }} />
        <span style={{ color: T.muted, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          What Wasn't Analyzed — Extend This Report
        </span>
      </div>
      <p style={{ color: T.dim, fontSize: '0.78rem', margin: '0 0 1rem', lineHeight: 1.5 }}>
        The following topics were not covered in this analysis. Click <strong style={{ color: T.cyan }}>Analyze</strong> to queue a deep-dive — Claude will research and deploy a new dashboard automatically.
      </p>

      {/* Gap list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1.1rem' }}>
        {gaps.map((gap, i) => {
          const isDone = submitted.has(i)
          const isLoading = submitting === i
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.6rem 0.85rem',
              background: isDone ? `${T.emerald}0c` : T.bg,
              border: `1px solid ${isDone ? T.emerald + '44' : T.border}`,
              borderRadius: 7,
            }}>
              <ChevronRight size={12} color={isDone ? T.emerald : T.dim} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: isDone ? T.emerald : T.text, fontWeight: 600, fontSize: '0.82rem' }}>{gap.topic}</div>
                <div style={{ color: T.dim, fontSize: '0.72rem', marginTop: 1 }}>{gap.description}</div>
              </div>
              <button
                onClick={() => createIssue(gap.issueTitle, i)}
                disabled={isDone || isLoading}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                  padding: '0.3rem 0.75rem', borderRadius: 5, border: 'none',
                  fontSize: '0.72rem', fontWeight: 700, cursor: isDone || isLoading ? 'default' : 'pointer',
                  background: isDone ? `${T.emerald}20` : `${T.cyan}18`,
                  color: isDone ? T.emerald : isLoading ? T.dim : T.cyan,
                  transition: 'all 0.15s', flexShrink: 0,
                }}
              >
                {isDone
                  ? <><CheckCircle size={11} /> Queued</>
                  : isLoading
                    ? <><Loader size={11} style={{ animation: 'spin 1s linear infinite' }} /> Queuing...</>
                    : <><Microscope size={11} /> Analyze</>
                }
              </button>
            </div>
          )
        })}
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: T.crimson, fontSize: '0.75rem', marginBottom: '0.75rem' }}>
          <AlertCircle size={12} /> {error}
        </div>
      )}

      {/* Custom request */}
      <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: '0.85rem' }}>
        <div style={{ color: T.dim, fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Request custom extension
        </div>
        <form onSubmit={submitCustom} style={{ display: 'flex', gap: '0.6rem' }}>
          <input
            type="text"
            value={custom}
            onChange={e => { setCustom(e.target.value); setCustomStatus(null) }}
            placeholder={`e.g. "Add options market analysis" or "Add Turkey geopolitical angle"`}
            disabled={customStatus === 'loading'}
            style={{
              flex: 1, background: T.bg, border: `1px solid ${T.border}`,
              borderRadius: 6, padding: '0.5rem 0.85rem',
              color: T.text, fontSize: '0.82rem', outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = T.cyan}
            onBlur={e => e.target.style.borderColor = T.border}
          />
          <button
            type="submit"
            disabled={!custom.trim() || customStatus === 'loading'}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              padding: '0.5rem 1rem', borderRadius: 6, border: 'none',
              background: custom.trim() && customStatus !== 'loading' ? T.cyan : T.border,
              color: custom.trim() && customStatus !== 'loading' ? T.bg : T.dim,
              fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', flexShrink: 0,
            }}
          >
            {customStatus === 'loading'
              ? <><Loader size={13} style={{ animation: 'spin 1s linear infinite' }} /> Queuing...</>
              : <><Send size={13} /> Queue</>
            }
          </button>
        </form>
        {customStatus === 'done' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: T.emerald, fontSize: '0.75rem', marginTop: '0.5rem' }}>
            <CheckCircle size={12} /> {customMsg}
          </div>
        )}
        {customStatus === 'error' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: T.crimson, fontSize: '0.75rem', marginTop: '0.5rem' }}>
            <AlertCircle size={12} /> {customMsg}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
