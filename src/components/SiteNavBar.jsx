import { Link, useLocation } from 'react-router-dom'
import { BarChart3, Home, BookOpen, RefreshCw, FileText, Code2 } from 'lucide-react'

const links = [
  { to: '/',            icon: Home,     label: 'Home' },
  { to: '/help',        icon: BookOpen, label: 'Glossary' },
  { to: '/methodology', icon: FileText, label: 'Methodology' },
  { to: '/source',      icon: Code2,    label: 'Source' },
]

export default function SiteNavBar({ onRefresh }) {
  const { pathname } = useLocation()

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 200,
      background: 'linear-gradient(180deg, rgba(10,15,30,0.85), rgba(10,15,30,0.55))',
      backdropFilter: 'blur(18px) saturate(160%)',
      WebkitBackdropFilter: 'blur(18px) saturate(160%)',
      borderBottom: '1px solid rgba(148,163,184,0.08)',
      padding: '0.7rem 1.5rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: '1rem', flexWrap: 'wrap',
    }}>
      {/* Brand */}
      <Link to="/" style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
        textDecoration: 'none', flexShrink: 0,
      }}>
        <span style={{
          width: 28, height: 28, borderRadius: 8,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
          boxShadow: '0 6px 16px rgba(6,182,212,0.35), inset 0 0 0 1px rgba(255,255,255,0.15)',
        }}>
          <BarChart3 size={15} color="#04141a" strokeWidth={2.5} />
        </span>
        <span style={{
          color: '#f8fafc', fontWeight: 800, fontSize: '0.86rem',
          letterSpacing: '-0.01em',
        }}>
          Analysis{' '}
          <span style={{
            background: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', color: 'transparent',
            fontWeight: 800,
          }}>Hub</span>
        </span>
      </Link>

      {/* Nav */}
      <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center', flexWrap: 'wrap' }}>
        {links.map(({ to, icon: Icon, label }) => {
          const active = pathname === to
          return (
            <Link
              key={to}
              to={to}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                color: active ? '#22d3ee' : '#94a3b8',
                fontSize: '0.78rem', fontWeight: 600,
                textDecoration: 'none',
                padding: '0.42rem 0.85rem',
                border: `1px solid ${active ? 'rgba(6,182,212,0.45)' : 'transparent'}`,
                borderRadius: 999,
                background: active ? 'rgba(6,182,212,0.10)' : 'transparent',
                transition: 'all 0.2s cubic-bezier(0.22,1,0.36,1)',
                letterSpacing: '-0.005em',
              }}
              onMouseEnter={(e) => {
                if (active) return
                e.currentTarget.style.color = '#f1f5f9'
                e.currentTarget.style.background = 'rgba(148,163,184,0.06)'
              }}
              onMouseLeave={(e) => {
                if (active) return
                e.currentTarget.style.color = '#94a3b8'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <Icon size={13} /> {label}
            </Link>
          )
        })}
        <button
          onClick={() => onRefresh ? onRefresh() : window.location.reload()}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600,
            padding: '0.42rem 0.85rem',
            border: '1px solid transparent',
            borderRadius: 999,
            background: 'transparent',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.2s cubic-bezier(0.22,1,0.36,1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#f1f5f9'
            e.currentTarget.style.background = 'rgba(148,163,184,0.06)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#94a3b8'
            e.currentTarget.style.background = 'transparent'
          }}
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>
    </div>
  )
}
