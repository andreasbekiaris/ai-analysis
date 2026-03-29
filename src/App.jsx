import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { BarChart3, Globe2, TrendingUp, Clock, Plus, Send, CheckCircle, AlertCircle, Loader, ExternalLink } from 'lucide-react'
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
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
        signal: AbortSignal.timeout(300000),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Analysis failed')

      setStatus('success')
      setResultPath(data.path)
      setMessage(`${data.title} — dashboard is deploying now.`)
      setPrompt('')
    } catch (err) {
      setStatus('error')
      setMessage(err.name === 'TimeoutError' ? 'Request timed out — try again' : err.message)
    }
  }

  const fmtTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

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
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: 0.5 } }
      `}</style>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Plus size={18} color="#06b6d4" />
        <span style={{ color: '#f8fafc', fontWeight: 600, fontSize: '1rem' }}>New Analysis</span>
      </div>
      <form onSubmit={submit} className="home-form" style={{ display: 'flex', gap: '0.75rem' }}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => { setPrompt(e.target.value); if (status !== 'loading') setStatus(null) }}
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
            ? <><Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> Generating...</>
            : <><Send size={15} /> Analyze</>
          }
        </button>
      </form>

      {status === 'loading' && (
        <div style={{ marginTop: '0.75rem', padding: '0.75rem 1rem', background: '#0a0f1e', border: '1px solid #1e293b', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#06b6d4', fontSize: '0.85rem', fontWeight: 600 }}>
            <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
            {elapsed < 15 ? 'Searching for latest data...' : elapsed < 60 ? 'Analyzing and generating dashboard...' : 'Finalizing and committing...'}
            <span style={{ marginLeft: 'auto', fontFamily: 'monospace', color: '#475569', fontSize: '0.75rem' }}>{fmtTime(elapsed)}</span>
          </div>
          <div style={{ color: '#64748b', fontSize: '0.72rem', marginTop: '0.35rem' }}>
            This typically takes 2–4 minutes. The page will update when ready.
          </div>
        </div>
      )}

      {status === 'success' && (
        <div style={{ marginTop: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>
            <CheckCircle size={15} />
            {message}
          </div>
          {resultPath && (
            <Link to={resultPath} style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              marginTop: '0.5rem', color: '#06b6d4', fontSize: '0.82rem', fontWeight: 600,
              textDecoration: 'none',
            }}>
              View Dashboard <ExternalLink size={12} />
            </Link>
          )}
          <div style={{ color: '#64748b', fontSize: '0.68rem', marginTop: '0.35rem' }}>
            Vercel deployment takes ~30 seconds. If the link 404s, refresh in a moment.
          </div>
        </div>
      )}

      {status === 'error' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', color: '#ef4444', fontSize: '0.875rem' }}>
          <AlertCircle size={15} />
          {message}
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
