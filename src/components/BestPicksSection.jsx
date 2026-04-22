import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp, TrendingDown, Lock, Plus, Trash2, Loader, Check, X,
  Sparkles, Clock, ExternalLink, Flame, RefreshCw, Wand2,
} from 'lucide-react'
import bestPicks from '../data/best-picks.json'
import { COUNTRIES, EXCHANGES } from '../lib/exchanges'

const API_BASE = 'https://ai-analysis-production-0590.up.railway.app'

const T = {
  card: '#111827', bg: '#0a0f1e', border: '#1e293b', border2: '#334155',
  text: '#f8fafc', muted: '#94a3b8', dim: '#64748b',
  cyan: '#06b6d4', emerald: '#10b981', amber: '#f59e0b', crimson: '#ef4444', violet: '#8b5cf6',
}

function PickCard({ pick, side }) {
  const color = side === 'buy' ? T.emerald : T.crimson
  const Icon  = side === 'buy' ? TrendingUp : TrendingDown

  let badge = null
  if (pick.hasRecentAnalysis) {
    badge = <span style={{ color: T.emerald, fontSize: '0.68rem', fontWeight: 700 }}><Check size={10} style={{ display: 'inline', verticalAlign: 'middle' }} /> FRESH</span>
  } else if (pick.hasStaleAnalysis) {
    badge = <span style={{ color: T.amber, fontSize: '0.68rem', fontWeight: 700 }}><Clock size={10} style={{ display: 'inline', verticalAlign: 'middle' }} /> STALE</span>
  } else if (pick.hasNoAnalysis) {
    badge = <span style={{ color: T.violet, fontSize: '0.68rem', fontWeight: 700 }}><Sparkles size={10} style={{ display: 'inline', verticalAlign: 'middle' }} /> NEW</span>
  }

  return (
    <div style={{
      background: 'linear-gradient(180deg, rgba(17,24,39,0.7), rgba(10,15,30,0.7))',
      border: `1px solid ${color}22`,
      borderRadius: 12,
      padding: '0.85rem 1rem',
      position: 'relative', overflow: 'hidden',
      transition: 'all 0.2s cubic-bezier(0.22,1,0.36,1)',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${color}66`; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 8px 22px ${color}22` }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${color}22`; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, width: 3, bottom: 0,
        background: `linear-gradient(180deg, ${color}, transparent)`,
        opacity: 0.7,
      }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            width: 22, height: 22, borderRadius: 6, flexShrink: 0,
            background: `${color}1a`, border: `1px solid ${color}44`,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={12} color={color} />
          </span>
          <span style={{ color: T.text, fontWeight: 800, fontSize: '0.92rem', letterSpacing: '-0.01em' }}>{pick.ticker}</span>
          <span style={{ color: T.dim, fontSize: '0.68rem', fontFamily: 'ui-monospace, monospace' }}>{pick.exchange}</span>
        </div>
        {badge}
      </div>
      <div style={{ color: T.muted, fontSize: '0.76rem', marginBottom: '0.4rem' }}>{pick.name}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', fontFamily: 'ui-monospace, monospace', marginBottom: '0.45rem' }}>
        <span style={{ color: T.text, fontSize: '0.95rem', fontWeight: 700 }}>{pick.price != null ? pick.price : '—'}</span>
        {pick.changePct != null && (
          <span style={{
            color: pick.changePct >= 0 ? T.emerald : T.crimson,
            fontSize: '0.78rem', fontWeight: 700,
            padding: '0.1rem 0.4rem', borderRadius: 4,
            background: `${pick.changePct >= 0 ? T.emerald : T.crimson}14`,
          }}>
            {pick.changePct >= 0 ? '+' : ''}{pick.changePct}%
          </span>
        )}
      </div>
      {pick.reason && (
        <div style={{ color: T.muted, fontSize: '0.72rem', lineHeight: 1.4, marginBottom: '0.3rem' }}>
          {pick.reason}
        </div>
      )}
      {pick.catalyst && (
        <div style={{ color: T.amber, fontSize: '0.7rem', lineHeight: 1.4, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Flame size={10} /> {pick.catalyst}
        </div>
      )}
      <div style={{ marginTop: '0.55rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        {pick.analysisPath && (
          <Link to={pick.analysisPath} style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
            color: T.cyan, fontSize: '0.7rem', fontWeight: 600,
            textDecoration: 'none', padding: '0.25rem 0.5rem',
            border: `1px solid ${T.cyan}44`, borderRadius: 4,
          }}>
            View analysis <ExternalLink size={10} />
          </Link>
        )}
        {pick.hasStaleAnalysis && (
          <a href={`/#/?deep=${encodeURIComponent(pick.ticker)}`} style={{
            color: T.amber, fontSize: '0.7rem', fontWeight: 600,
            textDecoration: 'none', padding: '0.25rem 0.5rem',
            border: `1px solid ${T.amber}44`, borderRadius: 4,
          }}>
            Deep reanalyze
          </a>
        )}
        {pick.hasNoAnalysis && (
          <a href={`/#/?new=${encodeURIComponent(pick.ticker)}`} style={{
            color: T.violet, fontSize: '0.7rem', fontWeight: 600,
            textDecoration: 'none', padding: '0.25rem 0.5rem',
            border: `1px solid ${T.violet}44`, borderRadius: 4,
          }}>
            Run analysis
          </a>
        )}
      </div>
    </div>
  )
}

function PicksColumn({ title, side, items }) {
  const color = side === 'buy' ? T.emerald : T.crimson
  const Icon  = side === 'buy' ? TrendingUp : TrendingDown
  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.85rem',
        paddingBottom: '0.6rem',
        borderBottom: `1px solid ${color}22`,
      }}>
        <span style={{
          width: 26, height: 26, borderRadius: 8, flexShrink: 0,
          background: `${color}14`, border: `1px solid ${color}44`,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 12px ${color}33`,
        }}>
          <Icon size={14} color={color} />
        </span>
        <span style={{ color: T.text, fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.01em' }}>{title}</span>
        {items && items.length > 0 && (
          <span style={{
            marginLeft: 'auto', color, fontSize: '0.68rem', fontWeight: 700,
            padding: '0.1rem 0.5rem', borderRadius: 999,
            background: `${color}14`, border: `1px solid ${color}33`,
            fontFamily: 'ui-monospace, monospace',
          }}>{items.length}</span>
        )}
      </div>
      {items && items.length > 0 ? (
        <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {items.map((p) => <PickCard key={`${side}-${p.ticker}`} pick={p} side={side} />)}
        </div>
      ) : (
        <div style={{
          color: T.dim, fontSize: '0.78rem', fontStyle: 'italic',
          padding: '1rem', border: `1px dashed ${T.border}`, borderRadius: 10,
          textAlign: 'center',
        }}>
          No picks yet. Click <strong style={{ color: T.cyan }}>Settings</strong> above → <strong style={{ color: T.cyan }}>Run now</strong>.
        </div>
      )}
    </div>
  )
}

function WatchlistManager({ onClose, onSaved }) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const [bestPicksCfg, setBestPicksCfg] = useState({
    enabled: false,
    watchlist: [],
    morningModeAthens: { hour: 8, minute: 0 },
    afterCloseDelayMinutes: 15,
  })
  const [password, setPassword] = useState('')
  const [newTicker, setNewTicker] = useState('')
  const [newExchange, setNewExchange] = useState('NYSE')

  const [autoScope, setAutoScope] = useState('GLOBAL')
  const [autoState, setAutoState] = useState('idle') // idle | sending | dispatched | error
  const [autoMsg, setAutoMsg] = useState(null)

  const [bpState, setBpState] = useState('idle')
  const [bpMsg, setBpMsg] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetch(`${API_BASE}/api/schedule`)
      .then((r) => r.json())
      .then((data) => {
        const bp = data?.schedule?.bestPicks || {}
        setBestPicksCfg({
          enabled: !!bp.enabled,
          watchlist: bp.watchlist || [],
          morningModeAthens: bp.morningModeAthens || { hour: 8, minute: 0 },
          afterCloseDelayMinutes: bp.afterCloseDelayMinutes ?? 15,
        })
      })
      .catch((err) => setErrorMsg(err.message))
      .finally(() => setLoading(false))
  }, [])

  const addTicker = () => {
    const t = newTicker.trim().toUpperCase()
    if (!t) return
    if (bestPicksCfg.watchlist.some((w) => w.ticker === t)) return
    setBestPicksCfg({
      ...bestPicksCfg,
      watchlist: [...bestPicksCfg.watchlist, { ticker: t, exchange: newExchange }],
    })
    setNewTicker('')
  }

  const removeTicker = (ticker) => {
    setBestPicksCfg({
      ...bestPicksCfg,
      watchlist: bestPicksCfg.watchlist.filter((w) => w.ticker !== ticker),
    })
  }

  const dispatchBestPicks = async () => {
    if (!password) { setBpMsg('Enter the password below before dispatching'); setBpState('error'); return }
    setBpState('sending')
    setBpMsg(null)
    try {
      const res = await fetch(`${API_BASE}/api/best-picks/dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, runType: 'manual' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || `Dispatch failed (${res.status})`)
      setBpState('dispatched')
      setBpMsg(`Issue #${data.issueNumber} created — Claude Code is screening your watchlist. Best picks will appear on the home page in ~3–6 minutes (auto-refresh).`)
    } catch (err) {
      setBpState('error')
      setBpMsg(err.message)
    }
  }

  const dispatchAutoWatchlist = async () => {
    if (!password) { setAutoMsg('Enter the password below before dispatching'); setAutoState('error'); return }
    setAutoState('sending')
    setAutoMsg(null)
    try {
      const res = await fetch(`${API_BASE}/api/auto-watchlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, scope: autoScope }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || `Dispatch failed (${res.status})`)
      setAutoState('dispatched')
      setAutoMsg(`Issue #${data.issueNumber} created — Claude Code is researching ${autoScope}. Tickers will append to the watchlist in ~5–10 minutes.`)
    } catch (err) {
      setAutoState('error')
      setAutoMsg(err.message)
    }
  }

  const save = async () => {
    setSaving(true)
    setErrorMsg(null)
    try {
      const res = await fetch(`${API_BASE}/api/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          patch: { bestPicks: bestPicksCfg },
          commitMessage: 'chore: update best picks config',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || `Save failed (${res.status})`)
      onSaved?.()
      onClose?.()
    } catch (err) {
      setErrorMsg(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: T.card, border: `1px solid ${T.border2}`, borderRadius: 12,
        padding: '1.5rem', maxWidth: 560, width: '100%', maxHeight: '85vh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span style={{ color: T.text, fontWeight: 700 }}>Best Picks — Watchlist & Schedule</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: T.dim, cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>

        {loading && <div style={{ color: T.muted, fontSize: '0.85rem' }}>Loading current config...</div>}

        {!loading && (
          <>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="checkbox"
                checked={bestPicksCfg.enabled}
                onChange={(e) => setBestPicksCfg({ ...bestPicksCfg, enabled: e.target.checked })}
              />
              <span style={{ color: T.text, fontWeight: 600, fontSize: '0.88rem' }}>
                Enable daily Best Picks screening (morning + after-close)
              </span>
            </label>

            <div style={{ color: T.muted, fontSize: '0.72rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Morning run (Athens local)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <input type="number" min="0" max="23" value={bestPicksCfg.morningModeAthens.hour}
                onChange={(e) => setBestPicksCfg({ ...bestPicksCfg, morningModeAthens: { ...bestPicksCfg.morningModeAthens, hour: Math.max(0, Math.min(23, parseInt(e.target.value || '0', 10))) } })}
                style={{ width: 60, background: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: 4, padding: '0.3rem 0.5rem', fontFamily: 'monospace' }} />
              <span style={{ color: T.muted }}>:</span>
              <input type="number" min="0" max="59" value={bestPicksCfg.morningModeAthens.minute}
                onChange={(e) => setBestPicksCfg({ ...bestPicksCfg, morningModeAthens: { ...bestPicksCfg.morningModeAthens, minute: Math.max(0, Math.min(59, parseInt(e.target.value || '0', 10))) } })}
                style={{ width: 60, background: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: 4, padding: '0.3rem 0.5rem', fontFamily: 'monospace' }} />
              <span style={{ color: T.dim, fontSize: '0.75rem' }}>(default 08:00 — before all exchanges open)</span>
            </div>

            <div style={{
              border: `1px solid ${T.cyan}44`, background: `${T.cyan}08`,
              borderRadius: 8, padding: '0.75rem 0.85rem', marginBottom: '1rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <RefreshCw size={14} color={T.cyan} />
                <span style={{ color: T.text, fontSize: '0.82rem', fontWeight: 700 }}>Run Best Picks now</span>
              </div>
              <div style={{ color: T.muted, fontSize: '0.72rem', marginBottom: '0.6rem', lineHeight: 1.4 }}>
                Dispatch a one-shot screening pass across your watchlist. Claude Code selects the top 3 buys + top 3 shorts per region and writes src/data/best-picks.json. The section below refreshes on next deploy (~3–6 minutes).
              </div>
              <button
                onClick={dispatchBestPicks}
                disabled={bpState === 'sending'}
                style={{
                  background: bpState === 'sending' ? T.border : T.cyan,
                  color: bpState === 'sending' ? T.dim : '#0a0f1e',
                  border: 'none', borderRadius: 4,
                  padding: '0.35rem 0.85rem', fontSize: '0.8rem', fontWeight: 700,
                  cursor: bpState === 'sending' ? 'wait' : 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                }}
              >
                {bpState === 'sending'
                  ? <><Loader size={12} style={{ animation: 'spin 1s linear infinite' }} /> Dispatching...</>
                  : <><RefreshCw size={12} /> Run now</>}
              </button>
              {bpMsg && (
                <div style={{
                  marginTop: '0.5rem', fontSize: '0.72rem',
                  color: bpState === 'error' ? T.crimson : bpState === 'dispatched' ? T.emerald : T.muted,
                  lineHeight: 1.4,
                }}>
                  {bpMsg}
                </div>
              )}
            </div>

            <div style={{
              border: `1px solid ${T.violet}44`, background: `${T.violet}08`,
              borderRadius: 8, padding: '0.75rem 0.85rem', marginBottom: '1rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <Wand2 size={14} color={T.violet} />
                <span style={{ color: T.text, fontSize: '0.82rem', fontWeight: 700 }}>Auto-populate watchlist</span>
              </div>
              <div style={{ color: T.muted, fontSize: '0.72rem', marginBottom: '0.6rem', lineHeight: 1.4 }}>
                Claude Code runs a deep research pass on the selected exchange and appends 10–15 top-quality tickers to your watchlist (~5–10 minutes). Existing entries are preserved.
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <select value={autoScope} onChange={(e) => setAutoScope(e.target.value)}
                  style={{ background: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: 4, padding: '0.35rem 0.55rem', fontSize: '0.8rem' }}>
                  <option value="GLOBAL">Global (all exchanges)</option>
                  <option value="GR">Greek (ATHEX)</option>
                  <option value="US">US (NYSE + NASDAQ)</option>
                  <option value="GB">UK (LSE)</option>
                </select>
                <button
                  onClick={dispatchAutoWatchlist}
                  disabled={autoState === 'sending'}
                  style={{
                    background: autoState === 'sending' ? T.border : T.violet,
                    color: autoState === 'sending' ? T.dim : '#0a0f1e',
                    border: 'none', borderRadius: 4,
                    padding: '0.35rem 0.85rem', fontSize: '0.8rem', fontWeight: 700,
                    cursor: autoState === 'sending' ? 'wait' : 'pointer',
                    display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                  }}
                >
                  {autoState === 'sending'
                    ? <><Loader size={12} style={{ animation: 'spin 1s linear infinite' }} /> Dispatching...</>
                    : <><Wand2 size={12} /> Dispatch research</>}
                </button>
              </div>
              {autoMsg && (
                <div style={{
                  marginTop: '0.5rem', fontSize: '0.72rem',
                  color: autoState === 'error' ? T.crimson : autoState === 'dispatched' ? T.emerald : T.muted,
                  lineHeight: 1.4,
                }}>
                  {autoMsg}
                </div>
              )}
            </div>

            <div style={{ color: T.muted, fontSize: '0.72rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Watchlist (tickers screened every run, plus top movers)
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.75rem' }}>
              {bestPicksCfg.watchlist.length === 0 && (
                <span style={{ color: T.dim, fontSize: '0.78rem', fontStyle: 'italic' }}>No tickers yet.</span>
              )}
              {bestPicksCfg.watchlist.map((w) => (
                <span key={w.ticker} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                  background: T.bg, border: `1px solid ${T.border}`, borderRadius: 4,
                  padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: T.text,
                }}>
                  <span style={{ fontWeight: 700 }}>{w.ticker}</span>
                  <span style={{ color: T.dim }}>{w.exchange}</span>
                  <button onClick={() => removeTicker(w.ticker)} style={{ background: 'none', border: 'none', color: T.crimson, cursor: 'pointer', padding: 0 }}>
                    <Trash2 size={11} />
                  </button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
              <input
                type="text" value={newTicker}
                onChange={(e) => setNewTicker(e.target.value)}
                placeholder="TICKER (e.g. AAPL)"
                style={{ flex: 1, background: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: 4, padding: '0.3rem 0.5rem', fontFamily: 'monospace' }}
              />
              <select value={newExchange} onChange={(e) => setNewExchange(e.target.value)}
                style={{ background: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: 4, padding: '0.3rem 0.5rem' }}>
                {Object.keys(EXCHANGES).map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
              <button onClick={addTicker} style={{
                background: T.cyan, color: T.bg, border: 'none', borderRadius: 4,
                padding: '0.3rem 0.75rem', fontWeight: 700, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
              }}>
                <Plus size={12} /> Add
              </button>
            </div>

            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: '1rem', marginBottom: '1rem' }}>
              <div style={{ color: T.muted, fontSize: '0.72rem', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Lock size={11} /> Password required to save
              </div>
              <input
                type="password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter security password"
                style={{ width: '100%', background: T.bg, color: T.text, border: `1px solid ${T.border}`, borderRadius: 6, padding: '0.55rem 0.75rem', fontFamily: 'monospace' }}
              />
            </div>

            {errorMsg && <div style={{ color: T.crimson, fontSize: '0.78rem', marginBottom: '0.75rem' }}>{errorMsg}</div>}

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button onClick={onClose} style={{ background: 'none', border: `1px solid ${T.border}`, color: T.muted, padding: '0.5rem 1rem', borderRadius: 6, cursor: 'pointer' }}>Cancel</button>
              <button onClick={save} disabled={saving || !password} style={{
                background: saving || !password ? T.border : T.cyan,
                color: saving || !password ? T.dim : T.bg,
                border: 'none', padding: '0.5rem 1rem', borderRadius: 6, fontWeight: 700,
                cursor: saving || !password ? 'not-allowed' : 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              }}>
                {saving ? <><Loader size={12} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</> : 'Save'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function BestPicksSection() {
  const [country, setCountry] = useState('GLOBAL')
  const [settingsOpen, setSettingsOpen] = useState(false)

  const data = useMemo(() => {
    if (country === 'GLOBAL') return bestPicks.global || { buy: [], short: [] }
    return (bestPicks.byCountry && bestPicks.byCountry[country]) || { buy: [], short: [] }
  }, [country])

  const generatedLabel = bestPicks.generatedAt
    ? `${bestPicks.runType || 'latest'} · ${new Date(bestPicks.generatedAt).toLocaleString()}`
    : 'not yet generated — enable screening below'

  return (
    <div className="grad-border" style={{ marginBottom: '2rem' }}>
      <div className="best-picks-card" style={{
        background: 'linear-gradient(180deg, rgba(17,24,39,0.85), rgba(17,24,39,0.65))',
        backdropFilter: 'blur(16px) saturate(140%)',
        WebkitBackdropFilter: 'blur(16px) saturate(140%)',
        borderRadius: 14,
        padding: '1.4rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{
              width: 30, height: 30, borderRadius: 8, flexShrink: 0,
              background: 'linear-gradient(135deg, rgba(139,92,246,0.20), rgba(236,72,153,0.18))',
              border: '1px solid rgba(139,92,246,0.4)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 6px 16px rgba(139,92,246,0.25)',
            }}>
              <Sparkles size={15} color="#c4b5fd" />
            </span>
            <div>
              <div style={{ color: T.text, fontWeight: 700, fontSize: '1.02rem', letterSpacing: '-0.01em' }}>Best Picks</div>
              <div style={{ color: T.dim, fontSize: '0.7rem', marginTop: 2 }}>{generatedLabel}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            {COUNTRIES.map((c) => (
              <button
                key={c.code}
                onClick={() => setCountry(c.code)}
                style={{
                  padding: '0.32rem 0.75rem', borderRadius: 999,
                  border: `1px solid ${country === c.code ? 'rgba(139,92,246,0.5)' : 'transparent'}`,
                  background: country === c.code ? 'rgba(139,92,246,0.14)' : 'transparent',
                  color: country === c.code ? '#c4b5fd' : T.muted,
                  fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer',
                  transition: 'all 0.15s',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => { if (country !== c.code) { e.currentTarget.style.background = 'rgba(148,163,184,0.06)'; e.currentTarget.style.color = T.text } }}
                onMouseLeave={(e) => { if (country !== c.code) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.muted } }}
              >
                {c.label}
              </button>
            ))}
            <button
              onClick={() => setSettingsOpen(true)}
              title="Configure watchlist & schedule"
              style={{
                padding: '0.32rem 0.75rem', borderRadius: 999,
                border: `1px solid ${T.border}`, background: 'transparent',
                color: T.muted, fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                transition: 'all 0.15s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.cyan; e.currentTarget.style.color = T.cyan }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted }}
            >
              <Lock size={11} /> Settings
            </button>
          </div>
        </div>

        <div className="best-picks-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.4rem' }}>
          <PicksColumn title="Best to Buy"   side="buy"   items={data.buy} />
          <PicksColumn title="Best to Short" side="short" items={data.short} />
        </div>
      </div>

      {settingsOpen && (
        <WatchlistManager onClose={() => setSettingsOpen(false)} onSaved={() => {}} />
      )}
    </div>
  )
}
