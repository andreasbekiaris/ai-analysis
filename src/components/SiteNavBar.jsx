import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BarChart3, Home, BookOpen, RefreshCw, FileText, Code2 } from 'lucide-react'
import ModelSettingsButton from './ModelSettingsButton'

const links = [
  { to: '/',            icon: Home,     label: 'Home' },
  { to: '/help',        icon: BookOpen, label: 'Glossary' },
  { to: '/methodology', icon: FileText, label: 'Methodology' },
  { to: '/source',      icon: Code2,    label: 'Source' },
]

export default function SiteNavBar({
  onRefresh,
  analysisEngine = {
    model: 'Claude Sonnet 4',
    detail: 'Dashboard analysis and generation. Gemini 2.5 Flash handles web search.',
  },
}) {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="site-navbar" style={{
      position: 'sticky', top: 0, zIndex: 200,
      minHeight: 56,
      background: scrolled
        ? 'linear-gradient(180deg, rgba(4,4,15,0.92), rgba(4,4,15,0.78))'
        : 'linear-gradient(180deg, rgba(4,4,15,0.78), rgba(4,4,15,0.45))',
      backdropFilter: 'blur(28px) saturate(160%)',
      WebkitBackdropFilter: 'blur(28px) saturate(160%)',
      borderBottom: `1px solid ${scrolled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)'}`,
      boxShadow: scrolled ? '0 8px 28px rgba(0,0,0,0.45)' : 'none',
      padding: '0.5rem 1.5rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: '1rem', flexWrap: 'wrap',
      transition: 'background 220ms cubic-bezier(0.22,1,0.36,1), border-color 220ms, box-shadow 220ms',
    }}>
      {/* Brand */}
      <Link to="/" style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.65rem',
        textDecoration: 'none', flexShrink: 0,
      }}>
        <span style={{
          width: 30, height: 30, borderRadius: 8,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
          boxShadow: '0 6px 16px rgba(6,182,212,0.35), inset 0 0 0 1px rgba(255,255,255,0.18)',
        }}>
          <BarChart3 size={16} color="#04040f" strokeWidth={2.5} />
        </span>
        <span style={{ display: 'inline-flex', flexDirection: 'column', lineHeight: 1 }}>
          <span className="site-navbar-brand-sub" style={{
            fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.22em',
            color: '#8888aa', textTransform: 'uppercase', marginBottom: 2,
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
          }}>
            Prometheia
          </span>
          <span style={{
            color: '#f0f0f8', fontWeight: 700, fontSize: '0.92rem',
            letterSpacing: '-0.01em',
          }}>
            Analysis{' '}
            <span style={{
              background: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text', color: 'transparent',
              fontWeight: 700,
            }}>Hub</span>
          </span>
        </span>
      </Link>

      {/* Nav */}
      <div className="site-navbar-links" style={{ display: 'flex', gap: '0.3rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <ModelSettingsButton analysisEngine={analysisEngine} />
        {links.map((link) => {
          const active = pathname === link.to
          const NavIcon = link.icon
          return (
            <Link
              key={link.to}
              to={link.to}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                color: active ? '#22d3ee' : '#8888aa',
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
                e.currentTarget.style.color = '#f0f0f8'
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
              }}
              onMouseLeave={(e) => {
                if (active) return
                e.currentTarget.style.color = '#8888aa'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <NavIcon size={13} /> <span className="site-navbar-link-label">{link.label}</span>
            </Link>
          )
        })}
        <button
          onClick={() => onRefresh ? onRefresh() : window.location.reload()}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            color: '#8888aa', fontSize: '0.78rem', fontWeight: 600,
            padding: '0.42rem 0.85rem',
            border: '1px solid transparent',
            borderRadius: 999,
            background: 'transparent',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.2s cubic-bezier(0.22,1,0.36,1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#f0f0f8'
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#8888aa'
            e.currentTarget.style.background = 'transparent'
          }}
        >
          <RefreshCw size={13} /> <span className="site-navbar-link-label">Refresh</span>
        </button>
      </div>
    </div>
  )
}
