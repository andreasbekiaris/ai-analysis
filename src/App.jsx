import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { BarChart3, Globe2, TrendingUp, Clock, Plus, Send, CheckCircle, AlertCircle, Loader, BookOpen } from 'lucide-react'

// Import dashboards here as they are created
import UsIranWar from './dashboards/geopolitical/us-iran-war-2026-03-22'
import AlphaBank from './dashboards/stocks/alpha-analysis-2026-03-22'
import HelpPage from './pages/HelpPage'

const dashboards = [
  { path: '/geo/us-iran-war', component: UsIranWar, title: 'US–Iran War: Operation Epic Fury', type: 'geopolitical', date: '2026-03-22' },
  { path: '/stocks/alpha', component: AlphaBank, title: 'Alpha Bank (ALPHA.AT / ALBKY)', type: 'stocks', date: '2026-03-22' },
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Plus size={18} color="#06b6d4" />
        <span style={{ color: '#f8fafc', fontWeight: 600, fontSize: '1rem' }}>New Analysis</span>
      </div>
      <form onSubmit={submit} style={{ display: 'flex', gap: '0.75rem' }}>
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

function Home() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0f1e', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <BarChart3 size={32} color="#06b6d4" />
              <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                Analysis Dashboard Hub
              </h1>
            </div>
            <Link to="/help" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600,
              textDecoration: 'none', padding: '0.45rem 1rem',
              border: '1px solid #1e293b', borderRadius: '6px',
              backgroundColor: '#111827',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#06b6d4'; e.currentTarget.style.color = '#06b6d4' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e293b'; e.currentTarget.style.color = '#94a3b8' }}
            >
              <BookOpen size={14} /> Glossary
            </Link>
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
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
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
