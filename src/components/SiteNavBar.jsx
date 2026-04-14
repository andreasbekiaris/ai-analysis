import { Link } from 'react-router-dom'
import { BarChart3, Home, BookOpen, RefreshCw, FileText, Code2 } from 'lucide-react'

const btn = {
  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
  color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600,
  textDecoration: 'none', padding: '0.3rem 0.72rem',
  border: '1px solid #1e293b', borderRadius: '5px',
  backgroundColor: '#0a0f1e', cursor: 'pointer',
  transition: 'border-color 0.15s, color 0.15s',
  fontFamily: 'system-ui, sans-serif',
}

const hover = {
  on:  e => { e.currentTarget.style.borderColor = '#06b6d4'; e.currentTarget.style.color = '#06b6d4' },
  off: e => { e.currentTarget.style.borderColor = '#1e293b'; e.currentTarget.style.color = '#94a3b8' },
}

export default function SiteNavBar({ onRefresh }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 200,
      background: 'rgba(10,15,30,0.97)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid #1e293b',
      padding: '0.5rem 1.5rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      {/* Brand */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', flexShrink: 0 }}>
        <BarChart3 size={15} color="#06b6d4" />
        <span style={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.04em' }}>
          ANALYSIS <span style={{ color: '#06b6d4' }}>HUB</span>
        </span>
      </Link>

      {/* Nav */}
      <div style={{ display: 'flex', gap: '0.4rem' }}>
        <Link to="/" style={btn} onMouseEnter={hover.on} onMouseLeave={hover.off}>
          <Home size={12} /> Home
        </Link>
        <Link to="/help" style={btn} onMouseEnter={hover.on} onMouseLeave={hover.off}>
          <BookOpen size={12} /> Glossary
        </Link>
        <Link to="/methodology" style={btn} onMouseEnter={hover.on} onMouseLeave={hover.off}>
          <FileText size={12} /> Methodology
        </Link>
        <Link to="/source" style={btn} onMouseEnter={hover.on} onMouseLeave={hover.off}>
          <Code2 size={12} /> Source
        </Link>
        <button
          onClick={() => onRefresh ? onRefresh() : window.location.reload()}
          style={btn}
          onMouseEnter={hover.on}
          onMouseLeave={hover.off}
        >
          <RefreshCw size={12} /> Refresh
        </button>
      </div>
    </div>
  )
}
