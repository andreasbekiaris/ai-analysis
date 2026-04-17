import { useEffect, useState } from 'react'
import { CalendarClock, Lock, Check, X, Loader } from 'lucide-react'
import { SCHEDULE_MODES, resolveExchange } from '../lib/exchanges'

const API_BASE = 'https://ai-analysis-production-0590.up.railway.app'

const MODE_LABELS = {
  [SCHEDULE_MODES.BEFORE_ALL_OPEN]: 'Before all exchanges open (08:00 Athens)',
  [SCHEDULE_MODES.BEFORE_OWN_OPEN]: "30m before this stock's exchange opens",
  [SCHEDULE_MODES.AFTER_OWN_CLOSE]: "15m after this stock's exchange closes (default)",
  [SCHEDULE_MODES.CUSTOM]: 'Custom time (Athens local)',
}

const BOX = {
  card: '#111827', border: '#1e293b', border2: '#334155',
  text: '#f8fafc', muted: '#94a3b8', dim: '#64748b',
  cyan: '#06b6d4', emerald: '#10b981', amber: '#f59e0b', crimson: '#ef4444',
}

export default function ReanalyzeScheduleButton({
  dashboardId, dashboardFile, title, ticker, exchange,
}) {
  const exMeta = resolveExchange(ticker, exchange)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const [savedAt, setSavedAt] = useState(null)

  const [entry, setEntry] = useState({
    enabled: false,
    mode: SCHEDULE_MODES.AFTER_OWN_CLOSE,
    customTimeAthens: { hour: 8, minute: 0 },
  })
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (!open) return
    setLoading(true)
    setErrorMsg(null)
    fetch(`${API_BASE}/api/schedule`)
      .then((r) => r.json())
      .then((data) => {
        const existing = data?.schedule?.dashboards?.[dashboardId]
        if (existing) {
          setEntry({
            enabled: !!existing.enabled,
            mode: existing.mode || SCHEDULE_MODES.AFTER_OWN_CLOSE,
            customTimeAthens: existing.customTimeAthens || { hour: 8, minute: 0 },
          })
        }
      })
      .catch((err) => setErrorMsg(err.message))
      .finally(() => setLoading(false))
  }, [open, dashboardId])

  const save = async () => {
    setLoading(true)
    setErrorMsg(null)
    setSavedAt(null)
    try {
      const patch = {
        dashboards: {
          [dashboardId]: {
            enabled: entry.enabled,
            mode: entry.mode,
            customTimeAthens: entry.customTimeAthens,
            exchange: exMeta.code,
            dashboardFile,
            title,
          },
        },
      }
      const res = await fetch(`${API_BASE}/api/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          patch,
          commitMessage: `chore: schedule update for ${dashboardId}`,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || `Save failed (${res.status})`)
      setSavedAt(new Date().toLocaleTimeString())
      setPassword('')
    } catch (err) {
      setErrorMsg(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Schedule daily auto-reanalysis"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
          color: entry.enabled ? BOX.emerald : BOX.muted,
          fontSize: '0.72rem', fontWeight: 600,
          padding: '0.3rem 0.65rem',
          border: `1px solid ${entry.enabled ? `${BOX.emerald}66` : BOX.border}`,
          borderRadius: 6,
          background: entry.enabled ? `${BOX.emerald}10` : BOX.card,
          cursor: 'pointer',
        }}
      >
        <CalendarClock size={12} />
        {entry.enabled ? 'Auto-Reanalyze: ON' : 'Auto-Reanalyze'}
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: '1rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: BOX.card, border: `1px solid ${BOX.border2}`,
              borderRadius: 12, padding: '1.5rem', maxWidth: 520, width: '100%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CalendarClock size={18} color={BOX.cyan} />
                <span style={{ color: BOX.text, fontWeight: 700, fontSize: '1rem' }}>Schedule auto-reanalysis</span>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: BOX.dim, cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ color: BOX.muted, fontSize: '0.8rem', marginBottom: '1rem' }}>
              {title} · <span style={{ color: BOX.dim }}>{exMeta.name}</span>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={entry.enabled}
                onChange={(e) => setEntry({ ...entry, enabled: e.target.checked })}
              />
              <span style={{ color: BOX.text, fontSize: '0.88rem', fontWeight: 600 }}>
                Enable daily auto-reanalysis
              </span>
            </label>

            <div style={{ color: BOX.muted, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              Timing
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
              {Object.entries(MODE_LABELS).map(([key, label]) => (
                <label key={key} style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  border: `1px solid ${entry.mode === key ? BOX.cyan : BOX.border}`,
                  borderRadius: 6, cursor: 'pointer',
                  background: entry.mode === key ? `${BOX.cyan}10` : 'transparent',
                }}>
                  <input
                    type="radio"
                    name="mode"
                    value={key}
                    checked={entry.mode === key}
                    onChange={() => setEntry({ ...entry, mode: key })}
                  />
                  <span style={{ color: BOX.text, fontSize: '0.82rem' }}>{label}</span>
                </label>
              ))}
            </div>

            {entry.mode === SCHEDULE_MODES.CUSTOM && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ color: BOX.muted, fontSize: '0.8rem' }}>Fire at</span>
                <input
                  type="number" min="0" max="23"
                  value={entry.customTimeAthens.hour}
                  onChange={(e) => setEntry({ ...entry, customTimeAthens: { ...entry.customTimeAthens, hour: Math.max(0, Math.min(23, parseInt(e.target.value || '0', 10))) } })}
                  style={{ width: 60, background: '#0a0f1e', color: BOX.text, border: `1px solid ${BOX.border}`, borderRadius: 4, padding: '0.3rem 0.5rem', fontFamily: 'monospace' }}
                />
                <span style={{ color: BOX.muted }}>:</span>
                <input
                  type="number" min="0" max="59"
                  value={entry.customTimeAthens.minute}
                  onChange={(e) => setEntry({ ...entry, customTimeAthens: { ...entry.customTimeAthens, minute: Math.max(0, Math.min(59, parseInt(e.target.value || '0', 10))) } })}
                  style={{ width: 60, background: '#0a0f1e', color: BOX.text, border: `1px solid ${BOX.border}`, borderRadius: 4, padding: '0.3rem 0.5rem', fontFamily: 'monospace' }}
                />
                <span style={{ color: BOX.dim, fontSize: '0.75rem' }}>Athens local</span>
              </div>
            )}

            <div style={{ borderTop: `1px solid ${BOX.border}`, paddingTop: '1rem', marginBottom: '1rem' }}>
              <div style={{ color: BOX.muted, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Lock size={11} /> Password required to save
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter security password"
                style={{
                  width: '100%', background: '#0a0f1e', color: BOX.text,
                  border: `1px solid ${BOX.border}`, borderRadius: 6,
                  padding: '0.55rem 0.75rem', fontFamily: 'monospace', outline: 'none',
                }}
              />
            </div>

            {errorMsg && (
              <div style={{ color: BOX.crimson, fontSize: '0.78rem', marginBottom: '0.75rem' }}>{errorMsg}</div>
            )}
            {savedAt && (
              <div style={{ color: BOX.emerald, fontSize: '0.78rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Check size={12} /> Saved at {savedAt}. Watcher reloads within 60s.
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setOpen(false)}
                style={{ background: 'none', border: `1px solid ${BOX.border}`, color: BOX.muted, padding: '0.5rem 1rem', borderRadius: 6, cursor: 'pointer' }}
              >Cancel</button>
              <button
                onClick={save}
                disabled={loading || !password}
                style={{
                  background: loading || !password ? BOX.border : BOX.cyan,
                  color: loading || !password ? BOX.dim : '#0a0f1e',
                  border: 'none', padding: '0.5rem 1rem', borderRadius: 6, fontWeight: 700,
                  cursor: loading || !password ? 'not-allowed' : 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                }}
              >
                {loading ? <><Loader size={12} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</> : 'Save schedule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
