import { Newspaper, ExternalLink, TrendingUp, TrendingDown, Minus } from 'lucide-react'

const NEWS = [
  {
    headline: 'Iran Rejects 15-Point Nuclear Framework, Hardens Stance on Enrichment',
    source: 'Reuters',
    url: 'https://www.reuters.com/world/middle-east/',
    date: '2026-04-20T07:42:00Z',
    sentiment: 'bearish',
    tag: 'Geopolitical',
  },
  {
    headline: 'Greek Bank Earnings Beat as ECB Holds Rates; NII Resilience Surprises',
    source: 'Bloomberg',
    url: 'https://www.bloomberg.com/markets',
    date: '2026-04-20T05:15:00Z',
    sentiment: 'bullish',
    tag: 'Equities',
  },
  {
    headline: 'NATO Approves €38B Joint Procurement; LMT, RTX Among Primary Beneficiaries',
    source: 'Defense News',
    url: 'https://www.defensenews.com/',
    date: '2026-04-19T18:30:00Z',
    sentiment: 'bullish',
    tag: 'Defense',
  },
  {
    headline: 'Macau April GGR Tracks +9% YoY as Mass Segment Recovers Post-Holiday',
    source: 'CNBC',
    url: 'https://www.cnbc.com/markets/',
    date: '2026-04-19T11:08:00Z',
    sentiment: 'bullish',
    tag: 'Sectors',
  },
  {
    headline: 'US-China Tariff Talks Stall; Treasury Signals "Reciprocal Measures" Imminent',
    source: 'Reuters',
    url: 'https://www.reuters.com/markets/',
    date: '2026-04-19T08:22:00Z',
    sentiment: 'bearish',
    tag: 'Macro',
  },
  {
    headline: 'Fed Minutes Show Split on Rate Path; Two Members Open to Cut by Q3',
    source: 'WSJ',
    url: 'https://www.wsj.com/economy/central-banking',
    date: '2026-04-18T20:45:00Z',
    sentiment: 'neutral',
    tag: 'Macro',
  },
]

const sentimentMeta = {
  bullish: { color: '#10b981', icon: TrendingUp, label: 'Bullish' },
  bearish: { color: '#ef4444', icon: TrendingDown, label: 'Bearish' },
  neutral: { color: '#8888aa', icon: Minus, label: 'Neutral' },
}

function timeAgo(iso) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.round(hrs / 24)}d ago`
}

function NewsCard({ item }) {
  const meta = sentimentMeta[item.sentiment] || sentimentMeta.neutral
  const SIcon = meta.icon

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noreferrer"
      style={{
        display: 'flex', flexDirection: 'column', gap: '0.6rem',
        background: 'linear-gradient(180deg, rgba(8,9,26,0.7), rgba(6,8,28,0.55))',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12,
        padding: '0.95rem 1.05rem',
        textDecoration: 'none',
        position: 'relative', overflow: 'hidden',
        transition: 'all 0.22s cubic-bezier(0.22,1,0.36,1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${meta.color}55`
        e.currentTarget.style.transform = 'translateY(-1px)'
        e.currentTarget.style.boxShadow = `0 10px 24px rgba(0,0,0,0.35), 0 0 0 1px ${meta.color}22`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, ${meta.color}, transparent)`,
        opacity: 0.45,
      }} />

      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.14em',
        textTransform: 'uppercase',
        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
      }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
          color: meta.color,
          padding: '0.18rem 0.5rem',
          borderRadius: 999,
          background: `${meta.color}14`,
          border: `1px solid ${meta.color}33`,
        }}>
          <SIcon size={10} /> {meta.label}
        </span>
        <span style={{ color: '#4a4a66' }}>·</span>
        <span style={{ color: '#8888aa' }}>{item.tag}</span>
        <span style={{ marginLeft: 'auto', color: '#4a4a66', textTransform: 'none', letterSpacing: 0, fontWeight: 500 }}>
          {timeAgo(item.date)}
        </span>
      </div>

      <h3 style={{
        margin: 0, color: '#f0f0f8',
        fontSize: '0.94rem', fontWeight: 600, lineHeight: 1.35,
        letterSpacing: '-0.01em',
      }}>
        {item.headline}
      </h3>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        color: '#4a4a66', fontSize: '0.74rem',
        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
      }}>
        <span>{item.source}</span>
        <ExternalLink size={11} />
      </div>
    </a>
  )
}

export default function NewsSection() {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        marginBottom: '1rem',
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: 'linear-gradient(135deg, rgba(6,182,212,0.18), rgba(139,92,246,0.12))',
          border: '1px solid rgba(6,182,212,0.28)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Newspaper size={14} color="#22d3ee" />
        </div>
        <span style={{
          fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.16em',
          textTransform: 'uppercase', color: '#8888aa',
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
        }}>
          Live Newsfeed
        </span>
        <div style={{
          flex: 1, height: 1,
          background: 'linear-gradient(90deg, rgba(255,255,255,0.08), transparent)',
        }} />
        <span style={{
          color: '#4a4a66', fontSize: '0.7rem',
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
        }}>
          {NEWS.length} items
        </span>
      </div>

      <div className="stagger" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '0.85rem',
      }}>
        {NEWS.map((item, i) => <NewsCard key={i} item={item} />)}
      </div>
    </div>
  )
}
