import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import {
  BarChart3, Globe2, TrendingUp, Building2, Clock, Plus, Send,
  CheckCircle, AlertCircle, Loader, ExternalLink, ListTodo, RefreshCw,
  Sparkles, ArrowUpRight,
} from 'lucide-react'
import SiteNavBar from './components/SiteNavBar'
import BestPicksSection from './components/BestPicksSection'

// Import dashboards here as they are created
import UsIranWar from './dashboards/geopolitical/us-iran-war-2026-03-22'
import RussiaUkraineWar from './dashboards/geopolitical/russia-ukraine-war-2026-03-24'
import AlphaBank from './dashboards/stocks/alpha-analysis-2026-03-22'
import HelpPage from './pages/HelpPage'
import MethodologyPage from './pages/MethodologyPage'
import SourceViewerPage from './pages/SourceViewerPage'
import EurobankDashboard from './dashboards/stocks/eurob-2026-03-30'
import LockheedMartinLMT from './dashboards/stocks/lmt-2026-04-02'
import CasinoMarketDashboard from './dashboards/sectors/casino-market-analysis-2026-04-02'

const dashboards = [
  { path: '/geo/us-iran-war',                  component: UsIranWar,             title: 'US–Iran War: Operation Epic Fury',                              type: 'geopolitical', date: '2026-03-22' },
  { path: '/geo/russia-ukraine-war',           component: RussiaUkraineWar,      title: 'Russia–Ukraine War: Year Four',                                 type: 'geopolitical', date: '2026-03-24' },
  { path: '/stocks/alpha',                     component: AlphaBank,             title: 'Alpha Bank (ALPHA.AT / ALBKY)',                                 type: 'stocks',       date: '2026-04-05' },
  { path: '/stocks/eurob',                     component: EurobankDashboard,     title: 'Eurobank (EUROB)',                                              type: 'stocks',       date: '2026-03-30' },
  { path: '/stocks/lmt',                       component: LockheedMartinLMT,     title: 'Lockheed Martin (LMT)',                                         type: 'stocks',       date: '2026-04-02' },
  { path: '/sectors/casino-market-analysis',   component: CasinoMarketDashboard, title: 'Global Casino Market: Regulatory Disruption & Realignment',    type: 'sectors',      date: '2026-04-02' },
]

const typeMeta = {
  geopolitical: { label: 'Geopolitical', color: '#f59e0b', icon: Globe2,     glow: 'rgba(245,158,11,0.20)' },
  stocks:       { label: 'Equity',       color: '#10b981', icon: TrendingUp, glow: 'rgba(16,185,129,0.20)' },
  sectors:      { label: 'Sector',       color: '#8b5cf6', icon: Building2,  glow: 'rgba(139,92,246,0.20)' },
}

function NewAnalysisForm() {
  const [prompt, setPrompt] = useState('')
  const [status, setStatus] = useState(null)
  const [message, setMessage] = useState('')
  const [resultPath, setResultPath] = useState(null)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (status !== 'loading') return
    setElapsed(0)
    const t = setInterval(() => setElapsed(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [status])

  const submit = async (e) => {
    e.preventDefault()
    if (!prompt.trim() || status === 'loading') return

    setStatus('loading')
    setMessage('')
    setResultPath(null)

    try {
      const submitRes = await fetch('https://ai-analysis-production-0590.up.railway.app/api/analyze-async', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
      })
      const { jobId } = await submitRes.json()
      if (!jobId) throw new Error('Failed to start analysis job')

      while (true) {
        await new Promise(r => setTimeout(r, 8000))
        const pollRes = await fetch(`https://ai-analysis-production-0590.up.railway.app/api/job/${jobId}`)
        const job = await pollRes.json()
        if (job.status === 'done') {
          setStatus('success')
          setResultPath(job.result.path)
          setMessage(`${job.result.title} — dashboard is deploying now.`)
          setPrompt('')
          break
        }
        if (job.status === 'error') throw new Error(job.error || 'Analysis failed')
      }
    } catch (err) {
      setStatus('error')
      setMessage(err.message)
    }
  }

  const fmtTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  const ready = !!prompt.trim() && status !== 'loading'

  return (
    <div className="grad-border" style={{ marginBottom: '2rem' }}>
      <div style={{
        background: 'linear-gradient(180deg, rgba(17,24,39,0.85), rgba(17,24,39,0.65))',
        backdropFilter: 'blur(16px) saturate(140%)',
        WebkitBackdropFilter: 'blur(16px) saturate(140%)',
        borderRadius: 14,
        padding: '1.6rem 1.6rem 1.4rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.4rem' }}>
          <Sparkles size={16} color="#22d3ee" />
          <span style={{
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.16em',
            textTransform: 'uppercase',
            background: 'linear-gradient(135deg, #22d3ee, #8b5cf6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', color: 'transparent',
          }}>
            New Analysis
          </span>
        </div>
        <div style={{ color: '#94a3b8', fontSize: '0.86rem', marginBottom: '1.1rem' }}>
          Spin up a fresh dashboard from a single prompt. Geopolitical, equity, or sector — Claude figures out the rest.
        </div>

        <form onSubmit={submit} className="home-form" style={{ display: 'flex', gap: '0.6rem' }}>
          <input
            type="text"
            value={prompt}
            onChange={(e) => { setPrompt(e.target.value); if (status !== 'loading') setStatus(null) }}
            placeholder="e.g. NVDA earnings outlook  ·  US–China trade war  ·  EV charging sector…"
            className="input"
            style={{ flex: 1, fontSize: '0.95rem' }}
            disabled={status === 'loading'}
          />
          <button
            type="submit"
            disabled={!ready}
            className={ready ? 'btn-primary' : 'btn'}
            style={{ padding: '0.6rem 1.3rem', fontSize: '0.9rem', whiteSpace: 'nowrap' }}
          >
            {status === 'loading'
              ? <><Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> Generating…</>
              : <><Send size={15} /> Analyze</>
            }
          </button>
        </form>

        {status === 'loading' && (
          <div className="fade-in" style={{
            marginTop: '0.8rem',
            padding: '0.8rem 1rem',
            background: 'rgba(6,182,212,0.06)',
            border: '1px solid rgba(6,182,212,0.22)',
            borderRadius: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#22d3ee', fontSize: '0.85rem', fontWeight: 600 }}>
              <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
              {elapsed < 15 ? 'Searching for latest data…' : elapsed < 60 ? 'Analyzing and generating dashboard…' : 'Finalizing and committing…'}
              <span style={{ marginLeft: 'auto', fontFamily: 'ui-monospace, monospace', color: '#475569', fontSize: '0.78rem' }}>{fmtTime(elapsed)}</span>
            </div>
            <div style={{ color: '#64748b', fontSize: '0.74rem', marginTop: '0.4rem' }}>
              This typically takes 2–4 minutes. The page updates automatically when it's ready.
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="fade-in" style={{
            marginTop: '0.8rem',
            padding: '0.8rem 1rem',
            background: 'rgba(16,185,129,0.07)',
            border: '1px solid rgba(16,185,129,0.28)',
            borderRadius: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.86rem', fontWeight: 600 }}>
              <CheckCircle size={15} />
              {message}
            </div>
            {resultPath && (
              <Link to={resultPath} style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                marginTop: '0.5rem', color: '#22d3ee', fontSize: '0.84rem', fontWeight: 600,
                textDecoration: 'none',
              }}>
                View Dashboard <ExternalLink size={12} />
              </Link>
            )}
            <div style={{ color: '#64748b', fontSize: '0.7rem', marginTop: '0.4rem' }}>
              Vercel deploy takes ~30s. Refresh the link if it 404s.
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="fade-in" style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            marginTop: '0.8rem', color: '#ef4444', fontSize: '0.88rem',
          }}>
            <AlertCircle size={15} />
            {message}
          </div>
        )}
      </div>
    </div>
  )
}

function AnalysisQueue() {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchQueue = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/get-issues')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to fetch queue')
      setIssues(data.issues || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchQueue() }, [])

  if (loading && issues.length === 0) {
    return (
      <div className="surface" style={{ padding: '1.1rem 1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem' }}>
          <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Loading queue…
        </div>
      </div>
    )
  }

  if (issues.length === 0 && !error) return null

  const timeAgo = (iso) => {
    const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.round(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.round(hrs / 24)}d ago`
  }

  const isReanalyze = (title) => /^reanalyz/i.test(title)
  const isNewAnalysis = (title) => /^analyz/i.test(title) || /^new.?analys/i.test(title)
  const dotColor = (title) =>
    isReanalyze(title) ? '#8b5cf6' :
    isNewAnalysis(title) ? '#22d3ee' : '#f59e0b'

  return (
    <div className="surface" style={{ padding: '1.1rem 1.25rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <ListTodo size={17} color="#f59e0b" />
          <span style={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.95rem' }}>
            Pending Queue
          </span>
          <span style={{
            background: 'rgba(245,158,11,0.15)', color: '#f59e0b',
            fontSize: '0.7rem', fontWeight: 700,
            padding: '0.18rem 0.55rem', borderRadius: 999,
            border: '1px solid rgba(245,158,11,0.25)',
          }}>
            {issues.length}
          </span>
        </div>
        <button onClick={fetchQueue} disabled={loading} className="btn-ghost" style={{
          padding: '0.3rem 0.65rem', fontSize: '0.72rem',
          display: 'flex', alignItems: 'center', gap: '0.3rem',
        }}>
          <RefreshCw size={11} style={loading ? { animation: 'spin 1s linear infinite' } : {}} /> Refresh
        </button>
      </div>

      {error && (
        <div style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
          <AlertCircle size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.3rem' }} />
          {error}
        </div>
      )}

      <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
        {issues.map(issue => (
          <a
            key={issue.number}
            href={issue.url}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              background: 'rgba(10,15,30,0.6)',
              border: '1px solid rgba(148,163,184,0.06)',
              borderRadius: 10,
              padding: '0.65rem 0.85rem',
              textDecoration: 'none',
              transition: 'all 0.2s cubic-bezier(0.22,1,0.36,1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(6,182,212,0.35)'
              e.currentTarget.style.transform = 'translateX(2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(148,163,184,0.06)'
              e.currentTarget.style.transform = 'translateX(0)'
            }}
          >
            <div style={{
              width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
              background: dotColor(issue.title),
              boxShadow: `0 0 8px ${dotColor(issue.title)}88`,
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                color: '#e2e8f0', fontSize: '0.84rem', fontWeight: 500,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {issue.title}
              </div>
            </div>
            <span style={{ color: '#475569', fontSize: '0.7rem', fontFamily: 'ui-monospace, monospace', flexShrink: 0 }}>
              #{issue.number}
            </span>
            <span style={{ color: '#475569', fontSize: '0.7rem', flexShrink: 0 }}>
              {timeAgo(issue.createdAt || issue.created)}
            </span>
            <ArrowUpRight size={13} color="#475569" />
          </a>
        ))}
      </div>
    </div>
  )
}

function DashboardCard({ d }) {
  const meta = typeMeta[d.type] || typeMeta.stocks
  const Icon = meta.icon
  return (
    <Link
      to={d.path}
      className="surface surface-hover"
      style={{
        padding: '1.4rem',
        textDecoration: 'none',
        display: 'flex', flexDirection: 'column', gap: '0.85rem',
        position: 'relative', overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${meta.color}66`
        e.currentTarget.style.boxShadow = `0 18px 40px rgba(0,0,0,0.5), 0 0 0 1px ${meta.color}55, 0 0 30px ${meta.glow}`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#1e293b'
        e.currentTarget.style.boxShadow = ''
      }}
    >
      {/* Top accent gradient line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, ${meta.color}, transparent)`,
        opacity: 0.6,
      }} />
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: -30, right: -30, width: 120, height: 120,
        background: `radial-gradient(circle, ${meta.glow}, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.32rem 0.65rem',
          borderRadius: 999,
          background: `${meta.color}14`,
          border: `1px solid ${meta.color}33`,
        }}>
          <Icon size={13} color={meta.color} />
          <span style={{
            fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: meta.color,
          }}>
            {meta.label}
          </span>
        </div>
        <ArrowUpRight size={16} color="#475569" />
      </div>

      <h3 style={{
        color: '#f8fafc', fontSize: '1.08rem', fontWeight: 700, lineHeight: 1.3,
        margin: 0, letterSpacing: '-0.015em', position: 'relative', zIndex: 1,
      }}>
        {d.title}
      </h3>

      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.35rem',
        color: '#64748b', fontSize: '0.78rem',
        position: 'relative', zIndex: 1,
        fontFamily: 'ui-monospace, monospace',
      }}>
        <Clock size={12} />
        <span>{d.date}</span>
      </div>
    </Link>
  )
}

function Home() {
  return (
    <div style={{ minHeight: '100vh', boxSizing: 'border-box' }}>
      <SiteNavBar />
      <div className="home-container" style={{ maxWidth: 1240, margin: '0 auto', padding: '2.5rem 2rem' }}>

        {/* Hero */}
        <div className="float-in" style={{ marginBottom: '2.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.85rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.3rem 0.7rem',
              borderRadius: 999,
              background: 'rgba(6,182,212,0.08)',
              border: '1px solid rgba(6,182,212,0.22)',
              color: '#22d3ee',
              fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.06em',
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%', background: '#22d3ee',
                boxShadow: '0 0 8px #22d3ee', animation: 'pulse 2s ease-in-out infinite',
              }} />
              LIVE  ·  AUTO-DEPLOYING
            </div>
          </div>

          <h1 className="home-title display-1" style={{ margin: 0, marginBottom: '0.6rem' }}>
            Geopolitical & financial intelligence,
            <br />
            <span className="gradient-text-cyan">rendered in real time.</span>
          </h1>
          <p style={{
            color: '#94a3b8', fontSize: '1.02rem', margin: 0,
            maxWidth: 720, lineHeight: 1.55,
          }}>
            Multi-scenario decision dashboards for wars, markets, and sectors. Each analysis is a
            production React build — committed, deployed, and continuously updated.
          </p>
        </div>

        <NewAnalysisForm />
        <BestPicksSection />
        <AnalysisQueue />

        {/* Library section header */}
        <div className="title-bar" style={{ marginTop: '2.5rem', marginBottom: '1.25rem' }}>
          <span style={{
            fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: '#94a3b8',
          }}>
            Dashboard Library
          </span>
          <span className="chip" style={{ marginLeft: '0.5rem' }}>
            {dashboards.length} active
          </span>
        </div>

        {/* Dashboard grid */}
        {dashboards.length === 0 ? (
          <div className="surface" style={{
            borderStyle: 'dashed', borderColor: '#334155',
            padding: '3rem', textAlign: 'center', color: '#64748b',
          }}>
            <Globe2 size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h2 style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>No Analyses Yet</h2>
            <p>Ask Claude to create your first analysis dashboard.</p>
          </div>
        ) : (
          <div className="home-grid stagger" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
            gap: '1.25rem',
          }}>
            {dashboards.map((d) => <DashboardCard key={d.path} d={d} />)}
          </div>
        )}

        <div style={{
          marginTop: '4rem', paddingTop: '1.5rem',
          borderTop: '1px solid rgba(148,163,184,0.06)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
        }}>
          <div style={{ color: '#475569', fontSize: '0.74rem' }}>
            Built with React, Recharts & Claude · Auto-deployed via Vercel
          </div>
          <div style={{ color: '#334155', fontSize: '0.7rem', fontFamily: 'ui-monospace, monospace' }}>
            v2.4.0 · 2026-04-19
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/methodology" element={<MethodologyPage />} />
        <Route path="/source" element={<SourceViewerPage />} />
        {dashboards.map((d) => (
          <Route key={d.path} path={d.path} element={<d.component />} />
        ))}
      </Routes>
    </BrowserRouter>
  )
}
