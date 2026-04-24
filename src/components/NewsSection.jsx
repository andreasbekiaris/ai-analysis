import { useMemo, useState } from 'react'
import {
  ExternalLink,
  Globe2,
  Loader,
  MapPin,
  Minus,
  Newspaper,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'

const API_BASE = 'https://ai-analysis-production-0590.up.railway.app'

const NEWS = {
  global: [
    {
      headline: 'Iran rejects 15-point nuclear framework, hardens stance on enrichment',
      source: 'Reuters',
      url: 'https://www.reuters.com/world/middle-east/',
      date: '2026-04-20T07:42:00Z',
      sentiment: 'bearish',
      tag: 'Geopolitical',
    },
    {
      headline: 'NATO approves EUR38B joint procurement; LMT, RTX among beneficiaries',
      source: 'Defense News',
      url: 'https://www.defensenews.com/',
      date: '2026-04-19T18:30:00Z',
      sentiment: 'bullish',
      tag: 'Defense',
    },
    {
      headline: 'Macau April GGR tracks +9% YoY as mass segment recovers post-holiday',
      source: 'CNBC',
      url: 'https://www.cnbc.com/markets/',
      date: '2026-04-19T11:08:00Z',
      sentiment: 'bullish',
      tag: 'Sectors',
    },
    {
      headline: 'US-China tariff talks stall; Treasury signals reciprocal measures imminent',
      source: 'Reuters',
      url: 'https://www.reuters.com/markets/',
      date: '2026-04-19T08:22:00Z',
      sentiment: 'bearish',
      tag: 'Macro',
    },
    {
      headline: 'Fed minutes show split on rate path; two members open to cut by Q3',
      source: 'WSJ',
      url: 'https://www.wsj.com/economy/central-banking',
      date: '2026-04-18T20:45:00Z',
      sentiment: 'neutral',
      tag: 'Rates',
    },
  ],
  local: [
    {
      headline: 'Greek bank earnings beat as ECB holds rates; NII resilience surprises',
      source: 'Bloomberg',
      url: 'https://www.bloomberg.com/markets',
      date: '2026-04-20T05:15:00Z',
      sentiment: 'bullish',
      tag: 'Athens Banks',
    },
    {
      headline: 'ATHEX holds near multi-year high as banks and energy lead turnover',
      source: 'Capital.gr',
      url: 'https://www.capital.gr/',
      date: '2026-04-19T13:20:00Z',
      sentiment: 'bullish',
      tag: 'ATHEX',
    },
    {
      headline: 'Greek 10-year spread narrows as investors add peripheral duration',
      source: 'Reuters',
      url: 'https://www.reuters.com/markets/',
      date: '2026-04-19T09:35:00Z',
      sentiment: 'bullish',
      tag: 'Rates',
    },
    {
      headline: 'Energy import costs rise with oil risk premium; refiners outperform',
      source: 'Kathimerini',
      url: 'https://www.ekathimerini.com/',
      date: '2026-04-18T16:10:00Z',
      sentiment: 'neutral',
      tag: 'Energy',
    },
  ],
}

const sentimentMeta = {
  bullish: { color: '#10b981', icon: TrendingUp, label: 'Bullish' },
  bearish: { color: '#ef4444', icon: TrendingDown, label: 'Bearish' },
  neutral: { color: '#8888aa', icon: Minus, label: 'Neutral' },
}

const scopeMeta = {
  global: { label: 'Global', icon: Globe2, color: '#22d3ee', note: 'Macro, geopolitics, global equities' },
  local: { label: 'Local', icon: MapPin, color: '#f59e0b', note: 'Greece, ATHEX, regional rates' },
}

const tableHeadStyle = {
  padding: '0.5rem 0.65rem',
  color: '#64748b',
  fontSize: '0.62rem',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  fontFamily: 'JetBrains Mono, ui-monospace, monospace',
  textAlign: 'left',
}

function timeAgo(iso) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.round(hrs / 24)}d ago`
}

function ScopeButton({ scope, active, onClick }) {
  const meta = scopeMeta[scope]
  const Icon = meta.icon
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.42rem 0.74rem',
        borderRadius: 999,
        border: `1px solid ${active ? `${meta.color}66` : 'rgba(148,163,184,0.10)'}`,
        background: active ? `${meta.color}16` : 'rgba(10,15,30,0.46)',
        color: active ? meta.color : '#94a3b8',
        fontSize: '0.74rem',
        fontWeight: 800,
        cursor: 'pointer',
        fontFamily: 'inherit',
      }}
    >
      <Icon size={13} />
      {meta.label}
    </button>
  )
}

function SentimentBadge({ sentiment }) {
  const meta = sentimentMeta[sentiment] || sentimentMeta.neutral
  const Icon = meta.icon
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.3rem',
      color: meta.color,
      padding: '0.2rem 0.48rem',
      borderRadius: 999,
      background: `${meta.color}14`,
      border: `1px solid ${meta.color}33`,
      fontSize: '0.62rem',
      fontWeight: 800,
      textTransform: 'uppercase',
      fontFamily: 'JetBrains Mono, ui-monospace, monospace',
      whiteSpace: 'nowrap',
    }}>
      <Icon size={10} /> {meta.label}
    </span>
  )
}

function NewsRow({ item }) {
  const meta = sentimentMeta[item.sentiment] || sentimentMeta.neutral
  return (
    <tr
      style={{
        borderBottom: '1px solid rgba(148,163,184,0.07)',
        transition: 'background 0.18s cubic-bezier(0.22,1,0.36,1)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = `${meta.color}0d` }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
    >
      <td style={{
        width: 76,
        padding: '0.72rem 0.65rem',
        color: '#4a4a66',
        fontSize: '0.7rem',
        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
        whiteSpace: 'nowrap',
        verticalAlign: 'top',
      }}>
        {timeAgo(item.date)}
      </td>
      <td style={{ padding: '0.72rem 0.65rem', verticalAlign: 'top' }}>
        <a href={item.url} target="_blank" rel="noreferrer" style={{
          display: 'inline-flex',
          alignItems: 'flex-start',
          gap: '0.45rem',
          color: '#f0f0f8',
          textDecoration: 'none',
          fontSize: '0.82rem',
          fontWeight: 600,
          lineHeight: 1.35,
        }}>
          <span>{item.headline}</span>
          <ExternalLink size={11} style={{ flexShrink: 0, marginTop: 2, color: '#4a4a66' }} />
        </a>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          marginTop: '0.32rem',
          color: '#64748b',
          fontSize: '0.68rem',
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
        }}>
          <span>{item.source}</span>
          <span style={{ color: '#334155' }}>/</span>
          <span>{item.tag}</span>
        </div>
      </td>
      <td style={{ width: 106, padding: '0.72rem 0.65rem', verticalAlign: 'top', textAlign: 'right' }}>
        <SentimentBadge sentiment={item.sentiment} />
      </td>
    </tr>
  )
}

function NewsTable({ items }) {
  return (
    <div style={{
      border: '1px solid rgba(148,163,184,0.08)',
      borderRadius: 10,
      overflow: 'hidden',
      background: 'rgba(4,4,15,0.34)',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <thead>
          <tr style={{
            background: 'rgba(148,163,184,0.06)',
            borderBottom: '1px solid rgba(148,163,184,0.08)',
          }}>
            <th style={{ ...tableHeadStyle, width: 76 }}>Time</th>
            <th style={tableHeadStyle}>Headline</th>
            <th style={{ ...tableHeadStyle, width: 106, textAlign: 'right' }}>Signal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => <NewsRow key={`${item.headline}-${i}`} item={item} />)}
        </tbody>
      </table>
    </div>
  )
}

export default function NewsSection() {
  const [scope, setScope] = useState('global')
  const [liveNews, setLiveNews] = useState({})
  const [refreshing, setRefreshing] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const [lastRefresh, setLastRefresh] = useState(null)
  const items = useMemo(() => liveNews[scope] || NEWS[scope] || NEWS.global, [liveNews, scope])
  const selectedMeta = scopeMeta[scope]
  const SelectedIcon = selectedMeta.icon
  const bullishCount = items.filter((item) => item.sentiment === 'bullish').length
  const bearishCount = items.filter((item) => item.sentiment === 'bearish').length

  const refreshNews = async () => {
    setRefreshing(true)
    setErrorMsg(null)
    try {
      const res = await fetch(`${API_BASE}/api/news-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || `News search failed (${res.status})`)
      setLiveNews((prev) => ({ ...prev, [scope]: data.news || [] }))
      setLastRefresh(new Date())
    } catch (err) {
      setErrorMsg(err.message)
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <aside className="home-news-rail" style={{
      border: '1px solid rgba(148,163,184,0.08)',
      borderRadius: 14,
      background: 'linear-gradient(180deg, rgba(17,24,39,0.78), rgba(10,15,30,0.58))',
      padding: '1rem',
      minWidth: 0,
      height: 'fit-content',
      position: 'sticky',
      top: 76,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        marginBottom: '0.75rem',
      }}>
        <span style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: 'linear-gradient(135deg, rgba(6,182,212,0.18), rgba(139,92,246,0.12))',
          border: '1px solid rgba(6,182,212,0.28)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Newspaper size={14} color="#22d3ee" />
        </span>
        <span style={{ minWidth: 0 }}>
          <strong style={{ display: 'block', color: '#f0f0f8', fontSize: '0.9rem' }}>News Table</strong>
          <small style={{
            display: 'block',
            color: '#64748b',
            fontSize: '0.66rem',
            marginTop: 2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            Right-side market feed
          </small>
        </span>
      </div>

      <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        <ScopeButton scope="global" active={scope === 'global'} onClick={() => setScope('global')} />
        <ScopeButton scope="local" active={scope === 'local'} onClick={() => setScope('local')} />
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.6rem',
        marginBottom: '0.72rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
          <span style={{
            width: 24,
            height: 24,
            borderRadius: 7,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: selectedMeta.color,
            background: `${selectedMeta.color}14`,
            border: `1px solid ${selectedMeta.color}33`,
            flexShrink: 0,
          }}>
            <SelectedIcon size={13} />
          </span>
          <span style={{ color: '#94a3b8', fontSize: '0.7rem', lineHeight: 1.25 }}>
            {selectedMeta.note}
          </span>
        </div>
        <button
          type="button"
          onClick={refreshNews}
          disabled={refreshing}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            color: refreshing ? '#64748b' : selectedMeta.color,
            fontSize: '0.66rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            border: `1px solid ${refreshing ? 'rgba(148,163,184,0.14)' : `${selectedMeta.color}44`}`,
            background: refreshing ? 'rgba(148,163,184,0.06)' : `${selectedMeta.color}10`,
            borderRadius: 999,
            padding: '0.32rem 0.58rem',
            cursor: refreshing ? 'wait' : 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {refreshing
            ? <Loader size={11} style={{ animation: 'spin 1s linear infinite' }} />
            : <RefreshCw size={11} />}
          Refresh
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.55rem', marginBottom: '0.75rem' }}>
        <div style={{
          padding: '0.58rem 0.65rem',
          border: '1px solid rgba(16,185,129,0.20)',
          borderRadius: 8,
          background: 'rgba(16,185,129,0.06)',
        }}>
          <div style={{ color: '#10b981', fontSize: '1rem', fontWeight: 800, fontFamily: 'JetBrains Mono, ui-monospace, monospace' }}>{bullishCount}</div>
          <div style={{ color: '#64748b', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800 }}>Bullish</div>
        </div>
        <div style={{
          padding: '0.58rem 0.65rem',
          border: '1px solid rgba(239,68,68,0.20)',
          borderRadius: 8,
          background: 'rgba(239,68,68,0.06)',
        }}>
          <div style={{ color: '#ef4444', fontSize: '1rem', fontWeight: 800, fontFamily: 'JetBrains Mono, ui-monospace, monospace' }}>{bearishCount}</div>
          <div style={{ color: '#64748b', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800 }}>Bearish</div>
        </div>
      </div>

      {(errorMsg || lastRefresh) && (
        <div style={{
          color: errorMsg ? '#ef4444' : '#64748b',
          fontSize: '0.68rem',
          marginBottom: '0.6rem',
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
        }}>
          {errorMsg || `Refreshed ${lastRefresh.toLocaleTimeString()}`}
        </div>
      )}

      <NewsTable items={items} />
    </aside>
  )
}
