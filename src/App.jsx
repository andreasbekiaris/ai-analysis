import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { BarChart3, Globe2, TrendingUp, Clock } from 'lucide-react'

// Import dashboards here as they are created
// import UsChina from './dashboards/geopolitical/us-china-trade-war-2026-03-22'
// import TslaAnalysis from './dashboards/stocks/tsla-analysis-2026-03-22'

const dashboards = [
  // Add entries here as dashboards are created:
  // { path: '/geo/us-china-trade', component: UsChina, title: 'US-China Trade War', type: 'geopolitical', date: '2026-03-22' },
  // { path: '/stock/tsla', component: TslaAnalysis, title: 'Tesla Analysis', type: 'stock', date: '2026-03-22' },
]

function Home() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0f1e', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <BarChart3 size={32} color="#06b6d4" />
            <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
              Analysis Dashboard Hub
            </h1>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', margin: 0 }}>
            Geopolitical & Financial Intelligence Dashboards
          </p>
        </div>

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
        {dashboards.map((d) => (
          <Route key={d.path} path={d.path} element={<d.component />} />
        ))}
      </Routes>
    </BrowserRouter>
  )
}
