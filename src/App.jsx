import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { BarChart3, Globe2, TrendingUp, Clock, Plus, Send, CheckCircle, AlertCircle, Loader, Hourglass, RefreshCw, ExternalLink } from 'lucide-react'
import SiteNavBar from './components/SiteNavBar'

// Import dashboards here as they are created
import UsIranWar from './dashboards/geopolitical/us-iran-war-2026-03-22'
import RussiaUkraineWar from './dashboards/geopolitical/russia-ukraine-war-2026-03-24'
import AlphaBank from './dashboards/stocks/alpha-analysis-2026-03-22'
import HelpPage from './pages/HelpPage'

const dashboards = [
  { path: '/geo/us-iran-war', component: UsIranWar, title: 'US–Iran War: Operation Epic Fury', type: 'geopolitical', date: '2026-03-22' },
  { path: '/geo/russia-ukraine-war', component: RussiaUkraineWar, title: 'Russia–Ukraine War: Year Four', type: 'geopolitical', date: '2026-03-24' },
  { path: '/stocks/alpha', component: AlphaBank, title: 'Alpha Bank (ALPHA.AT / ALBKY)', type: 'stocks', date: '2026-03-25' },
]

function NewAnalysisForm() {
  const [prompt, setPrompt] = useState('')
  const [status, setStatus] = useState(null) // null | 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (!prompt.trim() || status === 'loading') return

    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/create-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: prompt.trim() }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to create issue')

      setStatus('success')
      setMessage(`Issue #${data.number} created — analysis is queued. Dashboard will be live in a few minutes.`)
      setPrompt('')
    } catch (err) {
      setStatus('error')
      setMessage(err.message)
    }
  }

  return (
    <div style={{
      background: '#111827',
      border: '1px solid #1e293b',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '3rem',
    }}>
      <style>{`
        @media (max-width: 480px) {
          .home-form { flex-direction: column !important; }
          .home-form button { width: 100% !important; justify-content: center !important; }
          .home-container { padding: 1rem !important; }
          .home-grid { grid-template-columns: 1fr !important; }
          .home-title { font-size: 1.4rem !important; }
        }
      `}</style>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Plus size={18} color="#06b6d4" />
        <span style={{ color: '#f8fafc', fontWeight: 600, fontSize: '1rem' }}>New Analysis</span>
      </div>
      <form onSubmit={submit} className="home-form" style={{ display: 'flex', gap: '0.75rem' }}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => { setPrompt(e.target.value); setStatus(null) }}
          placeholder="What do you want to analyze? e.g. US-China trade war, NVDA stock..."
          style={{
            flex: 1,
            background: '#0a0f1e',
            border: '1px solid #334155',
            borderRadius: '8px',
            padding: '0.625rem 1rem',
            color: '#f8fafc',
            fontSize: '0.95rem',
            outline: 'none',
          }}
          onFocus={(e) => e.target.style.borderColor = '#06b6d4'}
          onBlur={(e) => e.target.style.borderColor = '#334155'}
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          disabled={!prompt.trim() || status === 'loading'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: prompt.trim() && status !== 'loading' ? '#06b6d4' : '#1e293b',
            color: prompt.trim() && status !== 'loading' ? '#0a0f1e' : '#475569',
            border: 'none',
            borderRadius: '8px',
            padding: '0.625rem 1.25rem',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: prompt.trim() && status !== 'loading' ? 'pointer' : 'not-allowed',
            transition: 'background 0.2s',
          }}
        >
          {status === 'loading'
            ? <><Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> Queuing...</>
            : <><Send size={15} /> Analyze</>
          }
        </button>
      </form>

      {status === 'success' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', color: '#10b981', fontSize: '0.875rem' }}>
          <CheckCircle size={15} />
          {message}
        </div>
      )}
      {status === 'error' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', color: '#ef4444', fontSize: '0.875rem' }}>
          <AlertCircle size={15} />
          {message}
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

function PendingAnalysisPanel() {
  const [issues, setIssues] = useState([])
  const [state, setState] = useState('loading') // loading | done | error
  const [refreshing, setRefreshing] = useState(false)

  const load = async (soft = false) => {
    if (soft) setRefreshing(true)
    else setState('loading')
    try {
      const res = await fetch('/api/get-issues')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setIssues(data.issues || [])
      setState('done')
    } catch {
      setState('error')
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => { load() }, [])

  if (state === 'loading') {
    return (
      <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '12px', padding: '1.25rem 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#64748b', fontSize: '0.875rem' }}>
        <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Loading analysis queue…
      </div>
    )
  }

  if (state === 'error') return null

  return (
    <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '12px', padding: '1.25rem 1.5rem', marginBottom: '2rem' }}>
      {/* Panel header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: issues.length ? '1rem' : 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Hourglass size={16} color="#f59e0b" />
          <span style={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.95rem' }}>Analysis Queue</span>
          {issues.length > 0 && (
            <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px', borderRadius: '4px', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', letterSpacing: '0.04em' }}>
              {issues.length} pending
            </span>
          )}
        </div>
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'transparent', border: '1px solid #1e293b', borderRadius: '6px', padding: '0.25rem 0.6rem', color: '#64748b', fontSize: '0.72rem', cursor: refreshing ? 'wait' : 'pointer' }}
        >
          <RefreshCw size={11} style={refreshing ? { animation: 'spin 1s linear infinite' } : {}} />
          Refresh
        </button>
      </div>

      {issues.length === 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.82rem' }}>
          <CheckCircle size={14} /> All caught up — no analyses pending
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {issues.map((issue, i) => (
            <div key={issue.number} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.6rem 0.85rem',
              background: '#0a0f1e',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              borderLeft: '3px solid #f59e0b',
            }}>
              {/* Queue position */}
              <span style={{ fontFamily: 'monospace', fontSize: '0.68rem', fontWeight: 700, color: '#475569', minWidth: '1.25rem', textAlign: 'center' }}>
                #{i + 1}
              </span>
              {/* Title */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: '#f8fafc', fontSize: '0.85rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {issue.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem', flexWrap: 'wrap' }}>
                  <span style={{ color: '#64748b', fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <Clock size={10} /> {timeAgo(issue.createdAt)}
                  </span>
                  {issue.labels?.map(label => (
                    <span key={label} style={{ fontSize: '0.6rem', padding: '1px 6px', borderRadius: '3px', background: '#1e293b', color: '#94a3b8', fontWeight: 600 }}>
                      {label}
                    </span>
                  ))}
                </div>
              </div>
              {/* Issue number + GitHub link */}
              <a
                href={issue.url}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#475569', fontSize: '0.68rem', fontWeight: 600, textDecoration: 'none', flexShrink: 0, padding: '0.2rem 0.45rem', border: '1px solid #1e293b', borderRadius: '4px' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#06b6d4'; e.currentTarget.style.borderColor = '#06b6d4' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.borderColor = '#1e293b' }}
              >
                #{issue.number} <ExternalLink size={9} />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Home() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0f1e', boxSizing: 'border-box' }}>
      <SiteNavBar />
      <div className="home-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <BarChart3 size={32} color="#06b6d4" />
            <h1 className="home-title" style={{ fontSize: '2rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
              Analysis Dashboard Hub
            </h1>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', margin: 0 }}>
            Geopolitical & Financial Intelligence Dashboards
          </p>
        </div>

        <NewAnalysisForm />

        <PendingAnalysisPanel />

        {/* Dashboard Grid */}
        {dashboards.length === 0 ? (
          <div style={{
            border: '1px dashed #334155',
            borderRadius: '12px',
            padding: '3rem',
            textAlign: 'center',
            color: '#64748b'
          }}>
            <Globe2 size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h2 style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>No Analyses Yet</h2>
            <p>Ask Claude Code to create your first analysis dashboard.</p>
            <p style={{ fontSize: '0.875rem', marginTop: '1rem' }}>
              Try: "Analyze US-China trade relations" or "Analyze Tesla stock"
            </p>
          </div>
        ) : (
          <div className="home-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {dashboards.map((d) => (
              <Link
                key={d.path}
                to={d.path}
                style={{
                  background: '#111827',
                  border: '1px solid #1e293b',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  textDecoration: 'none',
                  transition: 'border-color 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#06b6d4'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1e293b'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  {d.type === 'geopolitical' ? (
                    <Globe2 size={18} color="#f59e0b" />
                  ) : (
                    <TrendingUp size={18} color="#10b981" />
                  )}
                  <span style={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: d.type === 'geopolitical' ? '#f59e0b' : '#10b981',
                    fontWeight: 600,
                  }}>
                    {d.type}
                  </span>
                </div>
                <h3 style={{ color: '#f8fafc', fontSize: '1.25rem', fontWeight: 600, margin: '0 0 0.5rem' }}>
                  {d.title}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#64748b', fontSize: '0.875rem' }}>
                  <Clock size={14} />
                  <span>{d.date}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
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
        {dashboards.map((d) => (
          <Route key={d.path} path={d.path} element={<d.component />} />
        ))}
      </Routes>
    </BrowserRouter>
  )
}
