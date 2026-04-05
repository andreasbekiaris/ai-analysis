import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import AddToAnalysis from './AddToAnalysis'
import SiteNavBar from './SiteNavBar'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, ReferenceLine, Legend,
} from 'recharts'
import {
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info,
  ArrowUpRight, ArrowDownRight, ExternalLink,
  Globe2, Shield, RefreshCw, Plus, RotateCcw, AlertCircle, Search,
} from 'lucide-react'

/* ─── THEME ──────────────────────────────────────────────────── */
const T = {
  bg:      '#0a0f1e',
  card:    '#111827',
  border:  '#1e293b',
  border2: '#334155',
  text:    '#f8fafc',
  muted:   '#94a3b8',
  dim:     '#64748b',
  cyan:    '#06b6d4',
  emerald: '#10b981',
  amber:   '#f59e0b',
  crimson: '#ef4444',
  violet:  '#8b5cf6',
  navy:    '#1e293b',
}

/* ─── HELPERS ────────────────────────────────────────────────── */
const pct  = (n) => `${n > 0 ? '+' : ''}${n.toFixed(2)}%`
const euro = (n) => `€${n.toFixed(2)}`

const sentimentColor = { positive: T.emerald, neutral: T.amber, negative: T.crimson }
const directionColor  = { Positive: T.emerald, Neutral: T.amber, Negative: T.crimson }
const signalColor     = { BUY: T.emerald, SELL: T.crimson, NEUTRAL: T.amber }

function Card({ children, style }) {
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: '1.25rem', ...style }}>
      {children}
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
      <div style={{ width: 3, height: 16, background: T.cyan, borderRadius: 2 }} />
      <span style={{ color: T.muted, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {children}
      </span>
    </div>
  )
}

function Badge({ children, color }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 4,
      fontSize: '0.7rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      background: `${color}22`,
      color,
      border: `1px solid ${color}44`,
    }}>
      {children}
    </span>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#1e293b', border: `1px solid ${T.border2}`, borderRadius: 6, padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}>
      <div style={{ color: T.muted, marginBottom: 4 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color || T.text }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toFixed(2) : p.value}
        </div>
      ))}
    </div>
  )
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────── */
export default function StockDashboard({
  stock, priceHistory, maData, technicals, fundamentalData,
  financials, capitalMetrics, peerComparison, radarPeer,
  analystTargets, eventImpacts, keyMetrics, newsItems,
  geoOverlay, riskNotices, verdict, analysisGaps, dashboardFile,
}) {
  const [activeTab, setActiveTab]     = useState('verdict')
  const [peerMetric, setPeerMetric]   = useState('pe')
  const [capital, setCapital]         = useState('')
  const [risk, setRisk]               = useState('moderate')

  // Reanalyze state
  const [reanalyzeState, setReanalyzeState] = useState('idle') // idle | confirm | running | done | error
  const [reanalyzeStage, setReanalyzeStage] = useState('')
  const [reanalyzeResult, setReanalyzeResult] = useState(null)

  // Live price refresh (Gemini only — display only, no commit)
  const [priceRefreshState, setPriceRefreshState] = useState('idle') // idle | loading | done | error
  const [livePrice, setLivePrice] = useState(null) // { price, change, changePct, asOf, source }

  const refreshPrice = async () => {
    setPriceRefreshState('loading')
    try {
      const res = await fetch('/api/refresh-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: stock.ticker, companyName: stock.name }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Price fetch failed')
      setLivePrice(data)
      setPriceRefreshState('done')
    } catch {
      setPriceRefreshState('error')
      setTimeout(() => setPriceRefreshState('idle'), 3000)
    }
  }

  // Use live price if available, fall back to static stock data (ensure numeric)
  const displayPrice     = livePrice?.price    != null ? Number(livePrice.price)    : stock.price
  const displayChange    = livePrice?.change   != null ? Number(livePrice.change)   : stock.change
  const displayChangePct = livePrice?.changePct != null ? Number(livePrice.changePct) : stock.changePct

  // Fetch news state
  const [fetchNewsState, setFetchNewsState] = useState('idle') // idle | loading | success | empty | error
  const [stagedNews, setStagedNews] = useState([])
  const [liveNews, setLiveNews] = useState([])
  const [newsSaveState, setNewsSaveState] = useState({})

  const tabs = [
    { id: 'verdict',      label: 'Verdict',       highlight: true },
    { id: 'overview',     label: 'Overview' },
    ...(geoOverlay ? [{ id: 'georisk', label: 'Geo Risk' }] : []),
    { id: 'technicals',   label: 'Technicals' },
    { id: 'fundamentals', label: 'Fundamentals' },
    { id: 'events',       label: 'Event Impact' },
    { id: 'peers',        label: 'Peer Comparison' },
    { id: 'analysts',     label: 'Analyst Views' },
  ]

  const riskProfile = useMemo(() => {
    const cap = parseFloat(capital.replace(/[^0-9.]/g, '')) || 0
    if (cap < 1) return null
    const alloc    = { conservative: 0.10, moderate: 0.20, aggressive: 0.35 }[risk]
    const posSize  = cap * alloc
    const shares   = Math.floor(posSize / stock.price)
    const slPrice  = verdict.stopLoss.price
    const maxLoss  = shares * (stock.price - slPrice)
    const t1Gain   = shares * (verdict.targets[0].price - stock.price)
    const t2Gain   = shares * (verdict.targets[1].price - stock.price)
    return {
      posSize:   posSize.toFixed(0),
      shares,
      allocPct:  (alloc * 100).toFixed(0),
      maxLoss:   maxLoss.toFixed(0),
      t1Gain:    t1Gain.toFixed(0),
      t2Gain:    t2Gain.toFixed(0),
      stopLoss:  slPrice,
      riskReward:(t1Gain / maxLoss).toFixed(1),
    }
  }, [capital, risk, stock.price, verdict])

  const RAILWAY_URL = 'https://ai-analysis-production-0590.up.railway.app'
  const LOCAL_URL = 'http://localhost:3001'

  const pollJob = async (baseUrl, jobId) => {
    while (true) {
      await new Promise(r => setTimeout(r, 3000))
      const pollRes = await fetch(`${baseUrl}/api/job/${jobId}`)
      if (!pollRes.ok) throw new Error('Failed to check job status')
      const job = await pollRes.json()

      setReanalyzeStage(job.stage || 'Processing...')

      if (job.status === 'done') return job.result
      if (job.status === 'error') {
        const err = new Error(job.error || 'Reanalysis failed')
        err.code = job.code
        throw err
      }
    }
  }

  const startJob = async (baseUrl, endpoint, body) => {
    const startRes = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!startRes.ok) {
      const err = await startRes.json().catch(() => ({}))
      throw new Error(err.error || `Failed to start reanalysis (${startRes.status})`)
    }
    const { jobId } = await startRes.json()
    return pollJob(baseUrl, jobId)
  }

  const runReanalyze = async () => {
    if (!dashboardFile) return
    setReanalyzeState('running')
    setReanalyzeStage('Starting reanalysis — Claude is researching & analyzing...')
    setReanalyzeResult(null)

    const body = { dashboardFile, analysisTitle: `${stock.name} (${stock.ticker})`, ticker: stock.ticker }

    try {
      // Try Railway first
      const result = await startJob(RAILWAY_URL, '/api/reanalyze-stock-async', body)
      setReanalyzeResult(result)
      setReanalyzeState('done')
    } catch (err) {
      // If no API credits on Railway, fall back to local server
      if (err.code === 'NO_CREDITS' || /no api credits/i.test(err.message)) {
        try {
          setReanalyzeStage('No cloud credits — falling back to local server...')
          const result = await startJob(LOCAL_URL, '/api/reanalyze-stock-async', body)
          setReanalyzeResult(result)
          setReanalyzeState('done')
        } catch (localErr) {
          setReanalyzeResult({ error: `Cloud: ${err.message} | Local: ${localErr.message}` })
          setReanalyzeState('error')
        }
      } else {
        setReanalyzeResult({ error: err.message })
        setReanalyzeState('error')
      }
    }
  }

  const fetchLatestNews = async () => {
    setFetchNewsState('loading')
    setStagedNews([])
    setNewsSaveState({})
    try {
      const res = await fetch('/api/fetch-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: stock.ticker, companyName: stock.name, hoursBack: 48 }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Fetch failed')
      const existingKeys = new Set([...newsItems, ...liveNews].map(n => n.headline?.slice(0, 60).toLowerCase()))
      const novel = (data.news || []).filter(n => !existingKeys.has(n.headline?.slice(0, 60).toLowerCase()))
      setStagedNews(novel)
      setFetchNewsState(novel.length > 0 ? 'success' : 'empty')
    } catch {
      setFetchNewsState('error')
    }
  }

  const addNewsItem = async (item, idx) => {
    if (!dashboardFile) {
      setLiveNews(prev => [...prev, { ...item, isLive: true }])
      setStagedNews(prev => prev.filter((_, i) => i !== idx))
      return
    }
    setNewsSaveState(prev => ({ ...prev, [idx]: { state: 'saving' } }))
    try {
      const res = await fetch('/api/save-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newsItem: item, dashboardFile }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      if (data.accepted) {
        setNewsSaveState(prev => ({ ...prev, [idx]: { state: 'accepted', importance: data.importance, reason: data.reason } }))
        setLiveNews(prev => [...prev, { ...item, isLive: true }])
      } else {
        setNewsSaveState(prev => ({ ...prev, [idx]: { state: 'rejected', importance: data.importance, reason: data.reason } }))
      }
    } catch {
      setNewsSaveState(prev => ({ ...prev, [idx]: { state: 'error' } }))
    }
  }

  const upside = (((stock.avgTarget - stock.price) / stock.price) * 100).toFixed(1)
  const isUp   = displayChange >= 0

  const priceRange   = technicals?.priceRange  || [1.5, 4.8]
  const oscillators  = technicals?.oscillators  || []
  const supportLevels= technicals?.supportLevels|| []
  const maSignal     = technicals?.maSignalSummary || ''
  const priceNote    = technicals?.priceNote    || ''

  const valuation  = fundamentalData?.valuation  || []
  const scorecard  = fundamentalData?.scorecard  || []

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.text, fontFamily: 'system-ui, sans-serif' }}>
      <style>{`
        @media (max-width: 768px) {
          .s-grid2 { grid-template-columns: 1fr !important; }
          .s-grid6 { grid-template-columns: repeat(3, 1fr) !important; }
          .s-header-main { flex-direction: column !important; gap: 0.75rem !important; }
          .s-header-right { flex-direction: row !important; flex-wrap: wrap !important; gap: 0.75rem !important; align-items: center !important; }
          .s-stats-row { display: grid !important; grid-template-columns: repeat(3, 1fr) !important; gap: 0.5rem !important; }
          .s-capital-bar { flex-direction: column !important; align-items: flex-start !important; gap: 0.5rem !important; }
          .s-capital-metrics { flex-wrap: wrap !important; gap: 0.75rem !important; }
          .s-tabs { overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; white-space: nowrap; padding-left: 0.75rem !important; padding-right: 0.75rem !important; }
          .s-tabs::-webkit-scrollbar { display: none; }
          .s-price-block { flex-direction: row !important; flex-wrap: wrap !important; gap: 0.75rem !important; justify-content: flex-start !important; align-items: flex-start !important; }
          .s-price-block > div { text-align: left !important; }
          .s-peer-table { font-size: 0.7rem !important; }
          .s-page-pad { padding: 0.85rem 0.85rem !important; }
          .s-outer-pad { padding-left: 0.75rem !important; padding-right: 0.75rem !important; }
          .s-stock-name { font-size: 1.25rem !important; }
          .s-stock-price { font-size: 1.8rem !important; }
        }
        @media (max-width: 480px) {
          .s-grid2 { grid-template-columns: 1fr !important; }
          .s-grid6 { grid-template-columns: repeat(2, 1fr) !important; }
          .s-stats-row { grid-template-columns: repeat(2, 1fr) !important; }
          .s-outer-pad { padding-left: 0.6rem !important; padding-right: 0.6rem !important; }
          .s-page-pad { padding: 0.6rem 0.6rem !important; }
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <SiteNavBar />

      {/* ── HEADER ── */}
      <div className="s-outer-pad" style={{ background: '#0d1424', borderBottom: `1px solid ${T.border}`, padding: '1.25rem 2rem' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div className="s-header-main" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                <span className="s-stock-name" style={{ fontSize: '1.6rem', fontWeight: 800, color: T.text }}>{stock.name}</span>
                <Badge color={T.cyan}>{stock.ticker}</Badge>
                {stock.adr && <Badge color={T.violet}>{stock.adr}</Badge>}
              </div>
              <div style={{ color: T.dim, fontSize: '0.82rem' }}>{stock.exchange} · {stock.sector} · {stock.date}</div>
            </div>

            <div className="s-header-right s-price-block" style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-end' }}>
              {/* Price block */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end', marginBottom: 2 }}>
                  <div className="s-stock-price" style={{ fontSize: '2.4rem', fontWeight: 800, fontFamily: 'monospace', color: T.text, lineHeight: 1 }}>
                    {euro(displayPrice)}
                  </div>
                  {/* Refresh price button */}
                  <button
                    onClick={refreshPrice}
                    disabled={priceRefreshState === 'loading'}
                    title="Refresh current price (Gemini live lookup)"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: 22, height: 22, padding: 0,
                      background: priceRefreshState === 'done' ? `${T.emerald}18` : priceRefreshState === 'error' ? `${T.crimson}18` : 'rgba(100,116,139,0.1)',
                      border: `1px solid ${priceRefreshState === 'done' ? T.emerald : priceRefreshState === 'error' ? T.crimson : '#334155'}`,
                      borderRadius: 4, cursor: priceRefreshState === 'loading' ? 'wait' : 'pointer', flexShrink: 0,
                    }}
                  >
                    <RefreshCw
                      size={11}
                      color={priceRefreshState === 'done' ? T.emerald : priceRefreshState === 'error' ? T.crimson : '#64748b'}
                      style={priceRefreshState === 'loading' ? { animation: 'spin 1s linear infinite' } : {}}
                    />
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'flex-end' }}>
                  {isUp ? <ArrowUpRight size={16} color={T.emerald} /> : <ArrowDownRight size={16} color={T.crimson} />}
                  <span style={{ color: isUp ? T.emerald : T.crimson, fontFamily: 'monospace', fontWeight: 700, fontSize: '1rem' }}>
                    {pct(displayChangePct)}
                  </span>
                  <span style={{ color: T.dim, fontSize: '0.8rem' }}>today</span>
                </div>
                {/* Live price disclaimer */}
                {livePrice && (
                  <div style={{ marginTop: 4, fontSize: '0.62rem', color: '#475569', textAlign: 'right', lineHeight: 1.4 }}>
                    Live via Gemini · {livePrice.asOf || 'now'} · {livePrice.source || livePrice.currency || ''}<br />
                    <span style={{ color: '#374151' }}>⚠ Price only — analysis data unchanged</span>
                  </div>
                )}
              </div>

              {/* Signal badge */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  background: `${T.emerald}18`,
                  border: `2px solid ${T.emerald}`,
                  borderRadius: 8,
                  padding: '0.5rem 1.25rem',
                }}>
                  <div style={{ color: T.dim, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Analyst Consensus</div>
                  <div style={{ color: T.emerald, fontWeight: 800, fontSize: '1.25rem' }}>{stock.analystConsensus}</div>
                  <div style={{ color: T.dim, fontSize: '0.7rem' }}>{stock.analystCount} analysts</div>
                </div>
              </div>

              {/* Avg target */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  background: `${T.cyan}12`,
                  border: `1px solid ${T.cyan}44`,
                  borderRadius: 8,
                  padding: '0.5rem 1.25rem',
                }}>
                  <div style={{ color: T.dim, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Avg Target</div>
                  <div style={{ color: T.cyan, fontWeight: 800, fontSize: '1.25rem', fontFamily: 'monospace' }}>€{stock.avgTarget}</div>
                  <div style={{ color: T.emerald, fontSize: '0.75rem', fontWeight: 600 }}>+{upside}% upside</div>
                </div>
              </div>
            </div>
          </div>

          {/* Key stats row */}
          <div className="s-stats-row" style={{ display: 'flex', gap: '2rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            {[
              ['Market Cap', stock.marketCap],
              ['P/E (TTM)',  stock.pe],
              ['P/E (Fwd)', stock.peForward],
              ['P/B',       stock.pbRatio],
              ['EPS (TTM)', `€${stock.eps}`],
              ['Div. Yield',`${stock.dividendYield}%`],
              ['52W High',  euro(stock.high52w)],
              ['52W Low',   euro(stock.low52w)],
              ['Beta',      stock.beta],
            ].map(([label, val]) => (
              <div key={label}>
                <div style={{ color: T.dim, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                <div style={{ color: T.text, fontFamily: 'monospace', fontWeight: 700, fontSize: '0.9rem' }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CAPITAL & RISK BAR ── */}
      <div className="s-outer-pad" style={{ background: '#080e1a', borderBottom: `1px solid ${T.border}`, padding: '0.6rem 2rem' }}>
        <div className="s-capital-bar" style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <span style={{ color: T.dim, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', flexShrink: 0 }}>
            My Position
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ color: T.dim, fontSize: '0.75rem' }}>Capital (€)</span>
            <input
              type="text"
              value={capital}
              onChange={e => setCapital(e.target.value)}
              placeholder="e.g. 10000"
              style={{
                width: 100, background: T.card, border: `1px solid ${T.border}`,
                borderRadius: 5, padding: '0.25rem 0.6rem',
                color: T.text, fontSize: '0.82rem', outline: 'none', fontFamily: 'monospace',
              }}
              onFocus={e => e.target.style.borderColor = T.cyan}
              onBlur={e => e.target.style.borderColor = T.border}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ color: T.dim, fontSize: '0.75rem' }}>Risk</span>
            {['conservative', 'moderate', 'aggressive'].map(r => (
              <button key={r} onClick={() => setRisk(r)} style={{
                padding: '0.2rem 0.65rem', borderRadius: 4, border: 'none', cursor: 'pointer',
                fontSize: '0.72rem', fontWeight: 700, textTransform: 'capitalize',
                background: risk === r ? (r === 'conservative' ? `${T.emerald}28` : r === 'moderate' ? `${T.amber}28` : `${T.crimson}28`) : T.border,
                color: risk === r ? (r === 'conservative' ? T.emerald : r === 'moderate' ? T.amber : T.crimson) : T.dim,
              }}>{r}</button>
            ))}
          </div>
          {riskProfile && (
            <div className="s-capital-metrics" style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginLeft: '0.5rem' }}>
              {[
                { label: 'Allocate',   value: `€${Number(riskProfile.posSize).toLocaleString()}`,  color: T.cyan },
                { label: 'Shares',     value: `~${riskProfile.shares}`,                            color: T.text },
                { label: 'Allocation', value: `${riskProfile.allocPct}% of capital`,               color: T.muted },
                { label: 'Max Loss',   value: `−€${Number(riskProfile.maxLoss).toLocaleString()}`, color: T.crimson },
                { label: 'T1 Gain',    value: `+€${Number(riskProfile.t1Gain).toLocaleString()}`,  color: T.emerald },
                { label: 'Stop Loss',  value: `€${riskProfile.stopLoss}`,                          color: T.amber },
                { label: 'R:R',        value: `${riskProfile.riskReward}:1`,                       color: T.violet },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <div style={{ color: T.dim, fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                  <div style={{ color, fontFamily: 'monospace', fontWeight: 700, fontSize: '0.82rem' }}>{value}</div>
                </div>
              ))}
            </div>
          )}
          {!riskProfile && (
            <span style={{ color: T.dim, fontSize: '0.75rem', fontStyle: 'italic' }}>Enter capital to see personalized position sizing →</span>
          )}
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="s-outer-pad" style={{ background: '#0d1424', borderBottom: `1px solid ${T.border}`, padding: '0 2rem' }}>
        <div className="s-tabs" style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', gap: '0' }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '0.75rem 1.25rem',
                color: activeTab === t.id ? T.cyan : t.highlight ? T.amber : T.dim,
                borderBottom: activeTab === t.id ? `2px solid ${T.cyan}` : t.highlight ? `2px solid ${T.amber}44` : '2px solid transparent',
                fontSize: '0.85rem', fontWeight: activeTab === t.id || t.highlight ? 700 : 400,
                transition: 'color 0.15s', whiteSpace: 'nowrap',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── RISK NOTICE BANNER ── */}
      {riskNotices && riskNotices.length > 0 && (
        <div className="s-outer-pad" style={{ maxWidth: 1400, margin: '0 auto', padding: '1rem 2rem 0' }}>
          <div style={{ background: '#1a1208', border: `1px solid ${T.amber}44`, borderRadius: 8, padding: '0.85rem 1.1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <AlertTriangle size={14} color={T.amber} />
              <span style={{ color: T.amber, fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Additional Analysis Recommended
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {riskNotices.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.78rem' }}>
                  <Badge color={r.impactColor}>{r.type}</Badge>
                  <div>
                    <span style={{ color: T.text, fontWeight: 600 }}>{r.event}</span>
                    <span style={{ color: T.muted }}> — {r.description}</span>
                    <span style={{ color: T.dim }}> · {r.suggestion}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── BODY ── */}
      <div className="s-page-pad" style={{ maxWidth: 1400, margin: '0 auto', padding: '1.5rem 2rem' }}>

        {/* ═══════════════ VERDICT ═══════════════ */}
        {activeTab === 'verdict' && (
          <div className="s-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

            {/* Main verdict card */}
            <Card style={{ gridColumn: '1 / -1', border: `2px solid ${verdict.stanceColor}55`, background: verdict.stanceBg }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
                    <div style={{
                      padding: '0.35rem 1rem', borderRadius: 6,
                      background: `${verdict.stanceColor}22`, border: `2px solid ${verdict.stanceColor}`,
                      color: verdict.stanceColor, fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.05em',
                    }}>{verdict.stance}</div>
                    <div style={{ color: T.text, fontWeight: 700, fontSize: '1rem' }}>{verdict.timing}</div>
                  </div>
                  <p style={{ color: T.muted, fontSize: '0.85rem', lineHeight: 1.65, margin: 0, maxWidth: 780 }}>{verdict.timingDetail}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', flexShrink: 0 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ color: T.dim, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Conviction</div>
                    <div style={{ color: verdict.stanceColor, fontWeight: 800, fontSize: '1rem' }}>{verdict.conviction}</div>
                    <div style={{ color: T.dim, fontSize: '0.65rem', marginTop: 4 }}>R:R {verdict.riskReward}</div>
                  </div>
                  {dashboardFile && reanalyzeState === 'idle' && (
                    <button
                      onClick={() => setReanalyzeState('confirm')}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.28rem 0.65rem', background: 'rgba(100,116,139,0.1)', border: '1px solid #334155', borderRadius: '5px', color: '#64748b', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = T.amber; e.currentTarget.style.color = T.amber }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.color = '#64748b' }}
                    >
                      <RotateCcw size={11} /> Reanalyze
                    </button>
                  )}
                </div>
              </div>
            </Card>

            {/* Reanalyze panel */}
            {reanalyzeState !== 'idle' && (
              <Card style={{ gridColumn: '1 / -1', border: `1px solid ${reanalyzeState === 'error' ? T.crimson + '44' : reanalyzeState === 'done' ? T.emerald + '44' : T.amber + '44'}` }}>
                {reanalyzeState === 'confirm' && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <RotateCcw size={14} color={T.amber} />
                      <span style={{ color: T.text, fontWeight: 700, fontSize: '0.875rem' }}>Full reanalysis with Claude Code?</span>
                    </div>
                    <p style={{ color: T.dim, fontSize: '0.8rem', margin: '0 0 0.85rem', lineHeight: 1.6 }}>
                      Claude will perform a <strong style={{ color: T.muted }}>deep reanalysis</strong> — redoing the entire analysis from scratch using the previous version as a baseline. All stock data, fundamentals, news, and verdicts are regenerated with deeper reasoning. Takes ~2–4 minutes.
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={runReanalyze}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.85rem', background: `${T.amber}22`, border: `1px solid ${T.amber}`, borderRadius: '5px', color: T.amber, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        <RotateCcw size={12} /> Confirm Reanalyze
                      </button>
                      <button
                        onClick={() => setReanalyzeState('idle')}
                        style={{ padding: '0.35rem 0.75rem', background: 'transparent', border: `1px solid ${T.border}`, borderRadius: '5px', color: T.dim, fontSize: '0.8rem', cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                {reanalyzeState === 'running' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <RefreshCw size={14} color={T.amber} style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }} />
                    <div style={{ color: T.amber, fontWeight: 700, fontSize: '0.82rem' }}>Running reanalysis… {reanalyzeStage}</div>
                  </div>
                )}
                {reanalyzeState === 'done' && reanalyzeResult && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <CheckCircle size={14} color={T.emerald} />
                      <span style={{ color: T.emerald, fontWeight: 700, fontSize: '0.875rem' }}>Reanalysis complete — deploying now</span>
                    </div>
                    <div style={{ color: T.muted, fontSize: '0.8rem', marginBottom: '0.5rem', lineHeight: 1.6 }}>
                      Deep reanalysis complete.
                      {reanalyzeResult.newPrice && ` Price: $${reanalyzeResult.newPrice}.`}
                      {reanalyzeResult.newsTotal > 0 && ` ${reanalyzeResult.newsTotal} news items.`}
                      {reanalyzeResult.newStance && ` New stance: ${reanalyzeResult.newStance}.`}
                      {reanalyzeResult.newConviction && ` Conviction: ${reanalyzeResult.newConviction}.`}
                      {' '}Refresh the page in ~30 seconds to see the updated dashboard.
                    </div>
                  </div>
                )}
                {reanalyzeState === 'error' && reanalyzeResult && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <AlertCircle size={14} color={T.crimson} style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ color: T.crimson, fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.3rem' }}>Reanalysis failed</div>
                      <div style={{ color: T.dim, fontSize: '0.75rem', marginBottom: '0.5rem' }}>{reanalyzeResult.error}</div>
                      <button onClick={() => setReanalyzeState('idle')} style={{ background: 'none', border: 'none', color: T.cyan, fontSize: '0.75rem', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>Dismiss</button>
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* Entry / Stop / Targets */}
            <Card>
              <SectionTitle>Entry Zone, Stop Loss &amp; Targets</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                <div className="s-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div style={{ padding: '0.65rem', background: `${T.emerald}0f`, border: `1px solid ${T.emerald}33`, borderRadius: 6 }}>
                    <div style={{ color: T.dim, fontSize: '0.65rem', textTransform: 'uppercase', marginBottom: 3 }}>Entry Zone</div>
                    <div style={{ color: T.emerald, fontFamily: 'monospace', fontWeight: 800, fontSize: '1.1rem' }}>€{verdict.entryZone.low} – €{verdict.entryZone.high}</div>
                    <div style={{ color: T.dim, fontSize: '0.7rem' }}>Ideal entry: €{verdict.entryZone.ideal}</div>
                  </div>
                  <div style={{ padding: '0.65rem', background: `${T.crimson}0f`, border: `1px solid ${T.crimson}33`, borderRadius: 6 }}>
                    <div style={{ color: T.dim, fontSize: '0.65rem', textTransform: 'uppercase', marginBottom: 3 }}>Stop Loss</div>
                    <div style={{ color: T.crimson, fontFamily: 'monospace', fontWeight: 800, fontSize: '1.1rem' }}>€{verdict.stopLoss.price}</div>
                    <div style={{ color: T.dim, fontSize: '0.7rem' }}>{verdict.stopLoss.pct}% · {verdict.stopLoss.rationale}</div>
                  </div>
                </div>
                {verdict.targets.map((t, i) => (
                  <div key={i} style={{ padding: '0.65rem', background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ color: T.dim, fontSize: '0.65rem', textTransform: 'uppercase', marginBottom: 2 }}>{t.label} · {t.horizon}</div>
                      <div style={{ color: T.cyan, fontFamily: 'monospace', fontWeight: 700, fontSize: '0.95rem' }}>€{t.price} <span style={{ color: T.emerald, fontSize: '0.8rem' }}>+{t.upside}%</span></div>
                    </div>
                    <div style={{ color: T.dim, fontSize: '0.72rem', maxWidth: 200, textAlign: 'right' }}>{t.trigger}</div>
                  </div>
                ))}
              </div>
              {/* Bear case */}
              <div style={{ padding: '0.75rem', background: `${T.crimson}0a`, border: `1px solid ${T.crimson}33`, borderRadius: 6 }}>
                <div style={{ color: T.crimson, fontWeight: 700, fontSize: '0.75rem', marginBottom: 3 }}>Bear Case / Exit Condition</div>
                <div style={{ color: T.muted, fontSize: '0.77rem', lineHeight: 1.5 }}>{verdict.bearCase}</div>
              </div>
            </Card>

            {/* Key conditions */}
            <Card>
              <SectionTitle>Key Conditions to Monitor</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {verdict.keyConditions.map((c, i) => {
                  const color = c.status === 'met' ? T.emerald : c.status === 'failed' ? T.crimson : T.amber
                  const label = c.status === 'met' ? 'MET' : c.status === 'failed' ? 'FAILED' : 'PENDING'
                  return (
                    <div key={i} style={{ padding: '0.6rem 0.75rem', background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                        <span style={{ color: T.text, fontSize: '0.8rem', fontWeight: 600 }}>{c.label}</span>
                        <span style={{ color, fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.06em', border: `1px solid ${color}55`, borderRadius: 3, padding: '1px 5px' }}>{label}</span>
                      </div>
                      <div style={{ color: T.dim, fontSize: '0.72rem' }}>{c.impact}</div>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* Personalized verdict */}
            {riskProfile && (
              <Card style={{ gridColumn: '1 / -1', border: `1px solid ${T.cyan}33`, background: `${T.cyan}06` }}>
                <SectionTitle>Personalized Position — Based on Your Inputs</SectionTitle>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  {[
                    { label: 'Position Size',   value: `€${Number(riskProfile.posSize).toLocaleString()}`,  sub: `${riskProfile.allocPct}% of capital`,     color: T.cyan },
                    { label: 'Shares to Buy',   value: `~${riskProfile.shares}`,                            sub: `@ €${stock.price} current`,               color: T.text },
                    { label: 'Stop Loss',        value: `€${riskProfile.stopLoss}`,                         sub: 'Hard stop',                               color: T.amber },
                    { label: 'Max Loss',         value: `−€${Number(riskProfile.maxLoss).toLocaleString()}`,sub: 'If stop triggered',                       color: T.crimson },
                    { label: 'Target 1 Profit',  value: `+€${Number(riskProfile.t1Gain).toLocaleString()}`, sub: `@ €${verdict.targets[0].price}`,          color: T.emerald },
                    { label: 'Target 2 Profit',  value: `+€${Number(riskProfile.t2Gain).toLocaleString()}`, sub: `@ €${verdict.targets[1].price}`,          color: T.emerald },
                    { label: 'Risk/Reward',      value: `${riskProfile.riskReward}:1`,                      sub: 'T1 vs stop',                              color: T.violet },
                  ].map(({ label, value, sub, color }) => (
                    <div key={label} style={{ background: T.bg, borderRadius: 7, padding: '0.7rem', border: `1px solid ${T.border}` }}>
                      <div style={{ color: T.dim, fontSize: '0.65rem', textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
                      <div style={{ color, fontFamily: 'monospace', fontWeight: 800, fontSize: '1rem' }}>{value}</div>
                      <div style={{ color: T.dim, fontSize: '0.68rem', marginTop: 1 }}>{sub}</div>
                    </div>
                  ))}
                </div>
                <div style={{ color: T.dim, fontSize: '0.72rem', fontStyle: 'italic' }}>
                  {risk === 'conservative' ? 'Conservative profile: 10% allocation, wider margin of safety.' : risk === 'moderate' ? 'Moderate profile: 20% allocation, balanced risk/reward.' : 'Aggressive profile: 35% allocation — high conviction, higher risk.'}
                  {' '}Disclaimer: {verdict.disclaimer}
                </div>
              </Card>
            )}
            {!riskProfile && (
              <Card style={{ gridColumn: '1 / -1', border: `1px dashed ${T.border}` }}>
                <div style={{ textAlign: 'center', padding: '1rem', color: T.dim, fontSize: '0.82rem' }}>
                  Enter your capital in the bar above to see a personalized position sizing and profit/loss calculation.
                </div>
              </Card>
            )}

            <AddToAnalysis analysisTitle={`${stock.name} (${stock.ticker})`} analysisType="stock" gaps={analysisGaps} />
          </div>
        )}

        {/* ═══════════════ OVERVIEW ═══════════════ */}
        {activeTab === 'overview' && (
          <div className="s-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

            {/* Price chart */}
            <Card style={{ gridColumn: '1 / -1' }}>
              <SectionTitle>6-Month Price Performance ({stock.ticker})</SectionTitle>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={priceHistory}>
                  <CartesianGrid stroke={T.border} strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fill: T.dim, fontSize: 11 }} />
                  <YAxis domain={priceRange} tick={{ fill: T.dim, fontSize: 11 }} tickFormatter={(v) => `€${v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={stock.high52w} stroke={`${T.crimson}66`} strokeDasharray="4 4" label={{ value: `52W High €${stock.high52w}`, fill: T.crimson, fontSize: 10, position: 'right' }} />
                  <ReferenceLine y={stock.price}   stroke={`${T.cyan}88`}    strokeDasharray="4 4" label={{ value: `Current €${stock.price}`,   fill: T.cyan,   fontSize: 10, position: 'right' }} />
                  <Line type="monotone" dataKey="price" stroke={T.amber} strokeWidth={2.5} dot={{ fill: T.amber, r: 4 }} name="Price (€)" />
                </LineChart>
              </ResponsiveContainer>
              {stock.chartNote && (
                <div style={{ marginTop: '0.5rem', color: T.dim, fontSize: '0.75rem' }}>{stock.chartNote}</div>
              )}
              {!stock.chartNote && priceNote && (
                <div style={{ marginTop: '0.5rem', color: T.dim, fontSize: '0.75rem' }}>{priceNote}</div>
              )}
            </Card>

            {/* Key metrics grid */}
            <Card>
              <SectionTitle>Key Financial Metrics — FY2025</SectionTitle>
              <div className="s-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {keyMetrics.map((m) => (
                  <div key={m.label} style={{ background: T.bg, borderRadius: 6, padding: '0.6rem 0.75rem', border: `1px solid ${T.border}` }}>
                    <div style={{ color: T.dim, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{m.label}</div>
                    <div style={{ color: T.text, fontFamily: 'monospace', fontWeight: 700, fontSize: '0.95rem' }}>{m.value}</div>
                    <div style={{ color: m.pos === true ? T.emerald : m.pos === false ? T.crimson : T.amber, fontSize: '0.7rem', marginTop: 1 }}>{m.change}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* News */}
            <Card>
              <SectionTitle>Recent News &amp; Sentiment</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {newsItems.map((n, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%', marginTop: 5, flexShrink: 0,
                      background: sentimentColor[n.sentiment]
                    }} />
                    <div style={{ flex: 1 }}>
                      {n.url ? (
                        <a href={n.url} target="_blank" rel="noreferrer" style={{ color: T.text, fontSize: '0.82rem', lineHeight: 1.4, textDecoration: 'none', display: 'flex', alignItems: 'flex-start', gap: '0.3rem' }}
                          onMouseEnter={e => e.currentTarget.style.color = T.cyan}
                          onMouseLeave={e => e.currentTarget.style.color = T.text}
                        >
                          {n.headline} <ExternalLink size={10} style={{ flexShrink: 0, marginTop: 3 }} />
                        </a>
                      ) : (
                        <div style={{ color: T.text, fontSize: '0.82rem', lineHeight: 1.4 }}>{n.headline}</div>
                      )}
                      <div style={{ color: T.dim, fontSize: '0.7rem', marginTop: 2 }}>
                        {n.date} · {n.source}{!n.url && <span style={{ color: '#475569' }}> · (link unavailable)</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Sentiment gauge */}
              <div style={{ marginTop: '1rem', padding: '0.75rem', background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: T.dim, fontSize: '0.72rem' }}>OVERALL SENTIMENT</span>
                  <Badge color={T.emerald}>Positive</Badge>
                </div>
                <div style={{ height: 6, background: T.border, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: '75%', height: '100%', background: `linear-gradient(90deg, ${T.amber}, ${T.emerald})`, borderRadius: 3 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ color: T.dim, fontSize: '0.65rem' }}>Bearish</span>
                  <span style={{ color: T.emerald, fontSize: '0.65rem', fontWeight: 700 }}>75% Bullish</span>
                  <span style={{ color: T.dim, fontSize: '0.65rem' }}>Bullish</span>
                </div>
              </div>

              {/* ── Fetch Latest News ── */}
              <div style={{ marginTop: '1rem', borderTop: `1px solid ${T.border}`, paddingTop: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ color: T.dim, fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live Feed</span>
                  <button
                    onClick={fetchLatestNews}
                    disabled={fetchNewsState === 'loading'}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.28rem 0.65rem', background: fetchNewsState === 'loading' ? 'rgba(100,116,139,0.1)' : `${T.cyan}1a`, border: `1px solid ${fetchNewsState === 'loading' ? '#334155' : T.cyan + '66'}`, borderRadius: '4px', color: fetchNewsState === 'loading' ? T.dim : T.cyan, fontSize: '0.72rem', fontWeight: 600, cursor: fetchNewsState === 'loading' ? 'wait' : 'pointer' }}
                  >
                    {fetchNewsState === 'loading'
                      ? <><RefreshCw size={11} style={{ animation: 'spin 1s linear infinite' }} /> Fetching…</>
                      : <><Search size={11} /> Fetch Latest News</>
                    }
                  </button>
                </div>

                {/* Live news already added this session */}
                {liveNews.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.5rem' }}>
                    {liveNews.map((n, i) => (
                      <div key={`live-${i}`} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', padding: '0.45rem 0.6rem', background: `${T.emerald}08`, border: `1px solid ${T.emerald}22`, borderRadius: 5 }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', marginTop: 5, flexShrink: 0, background: sentimentColor[n.sentiment] || T.dim }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ color: T.text, fontSize: '0.8rem', lineHeight: 1.35 }}>{n.headline}</div>
                          <div style={{ color: T.dim, fontSize: '0.68rem', marginTop: 2 }}>{n.date} · {n.source} · <span style={{ color: T.emerald }}>Added</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {fetchNewsState === 'empty' && (
                  <div style={{ color: T.dim, fontSize: '0.75rem', padding: '0.4rem 0' }}>No new news found in the last 48 hours.</div>
                )}
                {fetchNewsState === 'error' && (
                  <div style={{ color: T.crimson, fontSize: '0.75rem', padding: '0.4rem 0' }}>Failed to fetch news — check API configuration.</div>
                )}

                {/* Staged news for review */}
                {stagedNews.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={{ color: T.dim, fontSize: '0.68rem', marginBottom: 2 }}>
                      {stagedNews.length} new item{stagedNews.length !== 1 ? 's' : ''} found — review and add:
                    </div>
                    {stagedNews.map((n, i) => {
                      const ss = newsSaveState[i]
                      const isAccepted = ss?.state === 'accepted'
                      const isRejected = ss?.state === 'rejected'
                      const isSaving   = ss?.state === 'saving'
                      return (
                        <div key={i} style={{ padding: '0.6rem 0.7rem', background: isAccepted ? `${T.emerald}0a` : isRejected ? `${T.crimson}0a` : T.bg, border: `1px solid ${isAccepted ? T.emerald + '44' : isRejected ? T.crimson + '44' : T.border}`, borderRadius: 6 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ color: T.text, fontSize: '0.8rem', lineHeight: 1.4, marginBottom: '0.2rem' }}>{n.headline}</div>
                              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                <span style={{ color: T.dim, fontSize: '0.68rem' }}>{n.date} · {n.source}</span>
                                <span style={{ padding: '1px 5px', borderRadius: 3, fontSize: '0.6rem', fontWeight: 700, background: `${sentimentColor[n.sentiment] || T.dim}22`, color: sentimentColor[n.sentiment] || T.dim, border: `1px solid ${sentimentColor[n.sentiment] || T.dim}44`, textTransform: 'uppercase' }}>{n.sentiment}</span>
                              </div>
                              {n.summary && <div style={{ color: T.dim, fontSize: '0.71rem', marginTop: '0.25rem', lineHeight: 1.4 }}>{n.summary}</div>}
                              {ss?.reason && (
                                <div style={{ fontSize: '0.68rem', color: isAccepted ? T.emerald : T.crimson, marginTop: '0.2rem' }}>
                                  {isAccepted ? '✓ Saved:' : '✗ Skipped:'} {ss.reason} (score {ss.importance}/10)
                                </div>
                              )}
                            </div>
                            <div style={{ flexShrink: 0 }}>
                              {!isAccepted && !isRejected && (
                                <button
                                  onClick={() => addNewsItem(n, i)}
                                  disabled={isSaving}
                                  style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.28rem 0.6rem', background: isSaving ? 'rgba(100,116,139,0.1)' : `${T.emerald}1a`, border: `1px solid ${isSaving ? 'rgba(100,116,139,0.3)' : T.emerald + '44'}`, borderRadius: '4px', color: isSaving ? T.dim : T.emerald, fontSize: '0.72rem', fontWeight: 600, cursor: isSaving ? 'wait' : 'pointer' }}
                                >
                                  {isSaving
                                    ? <><RefreshCw size={11} style={{ animation: 'spin 1s linear infinite' }} /> Judging…</>
                                    : <><Plus size={11} /> Add</>
                                  }
                                </button>
                              )}
                              {isAccepted && <CheckCircle size={14} color={T.emerald} />}
                              {isRejected && <AlertCircle size={14} color={T.crimson} />}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </Card>

            {/* Scorecard */}
            {scorecard.length > 0 && (
              <Card style={{ gridColumn: '1 / -1' }}>
                <SectionTitle>Investment Scorecard</SectionTitle>
                <div className="s-grid6" style={{ display: 'grid', gridTemplateColumns: `repeat(${scorecard.length}, 1fr)`, gap: '0.75rem' }}>
                  {scorecard.map((s) => (
                    <div key={s.label} style={{ textAlign: 'center', background: T.bg, borderRadius: 8, padding: '0.75rem 0.5rem' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'monospace', color: s.score >= 8 ? T.emerald : s.score >= 6 ? T.amber : T.crimson }}>
                        {s.score}
                      </div>
                      <div style={{ color: T.text, fontSize: '0.75rem', fontWeight: 600, marginBottom: 2 }}>{s.label}</div>
                      <div style={{ color: T.dim, fontSize: '0.65rem', lineHeight: 1.3 }}>{s.note}</div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* ═══════════════ GEO RISK ═══════════════ */}
        {activeTab === 'georisk' && geoOverlay && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>

            {/* Header panel */}
            <Card style={{ border: `1px solid ${T.amber}44`, background: '#0f1218' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                    <Globe2 size={15} color={T.amber} />
                    <span style={{ color: T.amber, fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Geopolitical Risk Cross-Reference</span>
                    <Badge color={T.crimson}>HIGH RELEVANCE</Badge>
                  </div>
                  <div style={{ color: T.text, fontWeight: 700, fontSize: '1rem', marginBottom: '0.3rem' }}>{geoOverlay.analysis}</div>
                  <div style={{ color: T.muted, fontSize: '0.8rem', lineHeight: 1.5, maxWidth: 700 }}>{geoOverlay.relevance}</div>
                </div>
                <Link to={geoOverlay.analysisPath} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  color: T.amber, fontSize: '0.78rem', fontWeight: 700,
                  textDecoration: 'none', padding: '0.45rem 1rem',
                  border: `1px solid ${T.amber}66`, borderRadius: '6px',
                  backgroundColor: `${T.amber}10`, whiteSpace: 'nowrap',
                }}>
                  <ExternalLink size={12} /> Open Full Analysis
                </Link>
              </div>
            </Card>

            {/* Transmission channels */}
            {geoOverlay.keyChannels && (
              <Card>
                <SectionTitle>Impact Transmission Channels</SectionTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {geoOverlay.keyChannels.map((c, i) => (
                    <div key={i} style={{ padding: '0.75rem', background: T.bg, borderRadius: 6, border: `1px solid ${T.border}`, display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '0.75rem', alignItems: 'start' }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: c.severity === 'Critical (tail)' || c.severity === 'High' ? T.crimson : T.amber, marginTop: 5, flexShrink: 0 }} />
                      <div>
                        <div style={{ color: T.text, fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.2rem' }}>{c.channel}</div>
                        <div style={{ color: T.muted, fontSize: '0.77rem', lineHeight: 1.5 }}>{c.detail}</div>
                      </div>
                      <Badge color={c.severity === 'Critical (tail)' || c.severity === 'High' ? T.crimson : T.amber}>{c.severity}</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Political Signals */}
            {geoOverlay.keyPoliticalSignals && (
              <Card>
                <SectionTitle>Key Political Signals — Direct Stock Impact</SectionTitle>
                <div style={{ color: T.dim, fontSize: '0.76rem', marginBottom: '0.85rem' }}>
                  Statements from key actors in the <Link to={geoOverlay.analysisPath} style={{ color: T.cyan, textDecoration: 'none' }}>{geoOverlay.analysis}</Link> that directly affect {stock.ticker} entry timing and positioning.
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {geoOverlay.keyPoliticalSignals.map((sig, i) => {
                    const sigColors = { escalatory: T.crimson, 'de-escalatory': T.emerald, diplomatic: T.cyan, economic: T.amber, ambiguous: T.dim }
                    const col = sigColors[sig.signalType] || T.dim
                    return (
                      <div key={i} style={{ padding: '0.75rem', background: T.bg, borderRadius: 7, border: `1px solid ${T.border}`, borderLeft: `3px solid ${col}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.4rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${col}18`, border: `1px solid ${col}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 800, color: col }}>
                              {sig.actor.split(' ').map(w => w[0]).slice(0, 2).join('')}
                            </div>
                            <div>
                              <div style={{ color: T.text, fontWeight: 700, fontSize: '0.83rem' }}>{sig.actor}</div>
                              <div style={{ color: T.dim, fontSize: '0.7rem' }}>{sig.role} · {sig.platform} · {sig.date}</div>
                            </div>
                          </div>
                          <Badge color={col}>{sig.signalType}</Badge>
                        </div>
                        <div style={{ color: T.muted, fontSize: '0.8rem', fontStyle: 'italic', marginBottom: '0.4rem', paddingLeft: '0.5rem', borderLeft: `2px solid ${col}40` }}>
                          "{sig.quote}"
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                          <span style={{ color: T.dim, fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', flexShrink: 0, marginTop: 1 }}>
                            {stock.ticker} impact:
                          </span>
                          <span style={{ color: T.muted, fontSize: '0.77rem', lineHeight: 1.4 }}>{sig.stockImpact}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            )}

            {/* Scenario impact table */}
            <Card>
              <SectionTitle>Scenario Probability &amp; Price Impact on {stock.ticker}</SectionTitle>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                      {['Scenario', 'Probability', 'Price Impact', 'Direction', 'Rationale'].map(h => (
                        <th key={h} style={{ color: T.dim, textAlign: 'left', padding: '0.5rem 0.75rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {geoOverlay.scenarios.map((sc, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
                        <td style={{ padding: '0.65rem 0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: sc.color, flexShrink: 0 }} />
                            <span style={{ color: T.text, fontWeight: 600 }}>{sc.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '0.65rem 0.75rem' }}>
                          <span style={{ color: sc.color, fontFamily: 'monospace', fontWeight: 700, fontSize: '0.9rem' }}>{sc.probability}%</span>
                        </td>
                        <td style={{ padding: '0.65rem 0.75rem' }}>
                          <span style={{ color: sc.direction.includes('Positive') ? T.emerald : sc.direction === 'Catastrophic' ? '#dc2626' : T.crimson, fontFamily: 'monospace', fontWeight: 700 }}>{sc.priceImpact}</span>
                        </td>
                        <td style={{ padding: '0.65rem 0.75rem' }}>
                          <Badge color={sc.direction.includes('Positive') ? T.emerald : sc.direction === 'Catastrophic' || sc.direction === 'Strongly Negative' ? '#dc2626' : T.crimson}>{sc.direction}</Badge>
                        </td>
                        <td style={{ padding: '0.65rem 0.75rem', color: T.muted, lineHeight: 1.4, fontSize: '0.78rem' }}>{sc.rationale}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: '1rem', padding: '0.75rem', background: `${T.amber}10`, border: `1px solid ${T.amber}33`, borderRadius: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <Shield size={13} color={T.amber} />
                  <span style={{ color: T.amber, fontWeight: 700, fontSize: '0.78rem' }}>Probability-Weighted Net Impact</span>
                </div>
                <div style={{ color: T.muted, fontSize: '0.8rem' }}>{geoOverlay.probabilityWeightedImpact}</div>
                <div style={{ color: T.dim, fontSize: '0.73rem', marginTop: '0.3rem' }}>
                  Cross-referenced with <Link to={geoOverlay.analysisPath} style={{ color: T.cyan, textDecoration: 'none' }}>{geoOverlay.analysis}</Link> · {geoOverlay.date}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ═══════════════ TECHNICALS ═══════════════ */}
        {activeTab === 'technicals' && (
          <div className="s-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

            <Card style={{ gridColumn: '1 / -1' }}>
              <SectionTitle>Price vs. Moving Averages</SectionTitle>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={priceHistory}>
                  <CartesianGrid stroke={T.border} strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fill: T.dim, fontSize: 11 }} />
                  <YAxis domain={priceRange} tick={{ fill: T.dim, fontSize: 11 }} tickFormatter={(v) => `€${v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  {maData.filter(ma => ma.name.includes('200')).map(ma => (
                    <ReferenceLine key={ma.name} y={ma.value} stroke={T.violet} strokeDasharray="5 5"
                      label={{ value: `200D MA €${ma.value}`, fill: T.violet, fontSize: 10, position: 'insideTopRight' }} />
                  ))}
                  {maData.filter(ma => ma.name.includes('50')).map(ma => (
                    <ReferenceLine key={ma.name} y={ma.value} stroke={T.amber} strokeDasharray="5 5"
                      label={{ value: `50D MA €${ma.value}`, fill: T.amber, fontSize: 10, position: 'insideTopRight' }} />
                  ))}
                  <ReferenceLine y={stock.price} stroke={T.cyan} strokeDasharray="5 5"
                    label={{ value: `Current €${stock.price}`, fill: T.cyan, fontSize: 10, position: 'insideBottomRight' }} />
                  <Line type="monotone" dataKey="price" stroke={T.text} strokeWidth={2.5} dot={{ fill: T.text, r: 3 }} name="Price (€)" />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <SectionTitle>Moving Average Signals</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {maData.map((ma) => (
                  <div key={ma.name} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.6rem 0.75rem', background: T.bg, borderRadius: 6, border: `1px solid ${T.border}`
                  }}>
                    <span style={{ color: T.muted, fontSize: '0.82rem', fontWeight: 600 }}>{ma.name}</span>
                    <span style={{ color: T.dim, fontFamily: 'monospace', fontSize: '0.82rem' }}>€{ma.value}</span>
                    <Badge color={signalColor[ma.signal] || T.amber}>{ma.signal}</Badge>
                  </div>
                ))}
              </div>
              {maSignal && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', background: `${T.emerald}10`, border: `1px solid ${T.emerald}33`, borderRadius: 6 }}>
                  <div style={{ color: T.emerald, fontSize: '0.78rem', fontWeight: 700, marginBottom: 4 }}>Overall MA Signal</div>
                  <div style={{ color: T.muted, fontSize: '0.73rem' }}>{maSignal}</div>
                </div>
              )}
            </Card>

            <Card>
              <SectionTitle>Oscillators &amp; Momentum</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {oscillators.map((o) => (
                  <div key={o.label} style={{ padding: '0.6rem 0.75rem', background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                      <span style={{ color: T.muted, fontSize: '0.8rem', fontWeight: 600 }}>{o.label}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: T.text, fontFamily: 'monospace', fontSize: '0.82rem' }}>{o.value}</span>
                        <Badge color={signalColor[o.signal] || T.amber}>{o.signal}</Badge>
                      </div>
                    </div>
                    <div style={{ color: T.dim, fontSize: '0.7rem' }}>{o.note}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <SectionTitle>Support &amp; Resistance Levels</SectionTitle>
              <div style={{ position: 'relative' }}>
                {supportLevels.map((lvl) => (
                  <div key={lvl.level} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0.45rem 0.6rem',
                    background: lvl.type === 'current' ? `${T.cyan}15` : 'transparent',
                    borderRadius: 4, marginBottom: 2,
                    borderLeft: `3px solid ${lvl.type === 'resistance' ? T.crimson : lvl.type === 'support' ? T.emerald : lvl.type === 'current' ? T.cyan : T.amber}`,
                  }}>
                    <span style={{ color: lvl.type === 'current' ? T.cyan : T.muted, fontSize: '0.78rem' }}>{lvl.label}</span>
                    <span style={{ color: T.text, fontFamily: 'monospace', fontSize: '0.82rem', fontWeight: 700 }}>€{lvl.level}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ═══════════════ FUNDAMENTALS ═══════════════ */}
        {activeTab === 'fundamentals' && (
          <div className="s-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

            <Card style={{ gridColumn: '1 / -1' }}>
              <SectionTitle>Net Profit &amp; Revenue Trends (€M)</SectionTitle>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={financials} barGap={4}>
                  <CartesianGrid stroke={T.border} strokeDasharray="3 3" />
                  <XAxis dataKey="year" tick={{ fill: T.dim, fontSize: 11 }} />
                  <YAxis tick={{ fill: T.dim, fontSize: 11 }} tickFormatter={(v) => `€${v}M`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ color: T.muted, fontSize: '0.78rem' }} />
                  <Bar dataKey="nii"       name="Net Interest Income" fill={T.cyan}   radius={[3, 3, 0, 0]} />
                  <Bar dataKey="fees"      name="Fee Income"          fill={T.violet} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="netProfit" name="Net Profit"          fill={T.emerald}radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {valuation.length > 0 && (
              <Card>
                <SectionTitle>Valuation vs. European Peers</SectionTitle>
                <div className="s-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  {valuation.map((v) => (
                    <div key={v.label} style={{ background: T.bg, borderRadius: 6, padding: '0.65rem', border: `1px solid ${T.border}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: T.dim, fontSize: '0.7rem', textTransform: 'uppercase' }}>{v.label}</span>
                        <CheckCircle size={12} color={v.ok ? T.emerald : T.crimson} />
                      </div>
                      <div style={{ color: T.text, fontFamily: 'monospace', fontWeight: 700, fontSize: '1rem', margin: '2px 0' }}>{v.value}</div>
                      <div style={{ color: T.dim, fontSize: '0.68rem' }}>{v.bench} · {v.note}</div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <Card>
              <SectionTitle>Operational KPIs</SectionTitle>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={capitalMetrics}>
                  <PolarGrid stroke={T.border} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: T.muted, fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                  <Radar name={stock.ticker} dataKey="value" stroke={T.cyan} fill={T.cyan} fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            </Card>

            {/* ROE trend chart */}
            {financials.some(f => f.roe != null) && (
              <Card>
                <SectionTitle>Return on Equity Trend (%)</SectionTitle>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={financials}>
                    <CartesianGrid stroke={T.border} strokeDasharray="3 3" />
                    <XAxis dataKey="year" tick={{ fill: T.dim, fontSize: 11 }} />
                    <YAxis tick={{ fill: T.dim, fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={10} stroke={`${T.amber}66`} strokeDasharray="4 4" label={{ value: '10% target', fill: T.amber, fontSize: 10 }} />
                    <Bar dataKey="roe" name="ROE %" fill={T.violet} radius={[3, 3, 0, 0]}>
                      {financials.map((_, i) => (
                        <Cell key={i} fill={financials[i].roe >= 10 ? T.emerald : T.amber} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}
          </div>
        )}

        {/* ═══════════════ EVENT IMPACT ═══════════════ */}
        {activeTab === 'events' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
            <Card>
              <SectionTitle>Current Events Impact Matrix</SectionTitle>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr>
                      {['Event', 'Impact Level', 'Direction', 'Rationale'].map((h) => (
                        <th key={h} style={{ color: T.dim, textAlign: 'left', padding: '0.5rem 0.75rem', borderBottom: `1px solid ${T.border}`, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {eventImpacts.map((e, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
                        <td style={{ padding: '0.65rem 0.75rem', color: T.text, fontWeight: 600 }}>{e.event}</td>
                        <td style={{ padding: '0.65rem 0.75rem' }}>
                          <Badge color={e.level === 'High' ? T.crimson : e.level === 'Medium' ? T.amber : T.emerald}>{e.level}</Badge>
                        </td>
                        <td style={{ padding: '0.65rem 0.75rem' }}>
                          <Badge color={directionColor[e.direction] || T.amber}>{e.direction}</Badge>
                        </td>
                        <td style={{ padding: '0.65rem 0.75rem', color: T.muted, lineHeight: 1.4 }}>{e.rationale}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* ═══════════════ PEERS ═══════════════ */}
        {activeTab === 'peers' && (
          <div className="s-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

            <Card style={{ gridColumn: '1 / -1' }}>
              <SectionTitle>Peer Radar Comparison</SectionTitle>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarPeer}>
                  <PolarGrid stroke={T.border} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: T.muted, fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                  {Object.keys(radarPeer[0] || {}).filter(k => k !== 'subject').map((key, i) => {
                    const colors = [T.cyan, T.emerald, T.amber, T.violet, T.crimson]
                    return (
                      <Radar key={key} name={key} dataKey={key} stroke={colors[i % colors.length]} fill={colors[i % colors.length]} fillOpacity={i === 0 ? 0.2 : 0.1} />
                    )
                  })}
                  <Legend wrapperStyle={{ color: T.muted, fontSize: '0.78rem' }} />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </Card>

            <Card style={{ gridColumn: '1 / -1' }}>
              <SectionTitle>Metrics Comparison</SectionTitle>
              <div style={{ overflowX: 'auto' }}>
                <table className="s-peer-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                      {['Bank', 'P/E (TTM)', 'P/B', 'RoTE %', 'CET1 %', 'NPE %', 'Div Yield %', 'Avg Target'].map((h) => (
                        <th key={h} style={{ color: T.dim, textAlign: 'left', padding: '0.5rem 0.75rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {peerComparison.map((p, i) => (
                      <tr key={i} style={{
                        borderBottom: `1px solid ${T.border}`,
                        background: p.bank === stock.name ? `${T.cyan}08` : 'transparent'
                      }}>
                        <td style={{ padding: '0.65rem 0.75rem', color: p.bank === stock.name ? T.cyan : T.text, fontWeight: p.bank === stock.name ? 700 : 400 }}>{p.bank}</td>
                        <td style={{ padding: '0.65rem 0.75rem', color: T.text, fontFamily: 'monospace' }}>{p.pe}</td>
                        <td style={{ padding: '0.65rem 0.75rem', color: p.pb < 0.85 ? T.emerald : T.text, fontFamily: 'monospace' }}>{p.pb}</td>
                        <td style={{ padding: '0.65rem 0.75rem', color: p.rote >= 14 ? T.emerald : T.amber, fontFamily: 'monospace' }}>{p.rote}%</td>
                        <td style={{ padding: '0.65rem 0.75rem', color: p.cet1 >= 16 ? T.emerald : T.text, fontFamily: 'monospace' }}>{p.cet1}%</td>
                        <td style={{ padding: '0.65rem 0.75rem', color: p.npe <= 3.2 ? T.emerald : p.npe <= 3.8 ? T.amber : T.crimson, fontFamily: 'monospace' }}>{p.npe}%</td>
                        <td style={{ padding: '0.65rem 0.75rem', color: T.emerald, fontFamily: 'monospace' }}>{p.divYield}%</td>
                        <td style={{ padding: '0.65rem 0.75rem', color: T.cyan, fontFamily: 'monospace' }}>€{p.target}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* ═══════════════ ANALYSTS ═══════════════ */}
        {activeTab === 'analysts' && (
          <div className="s-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

            <Card style={{ gridColumn: '1 / -1' }}>
              <SectionTitle>Analyst Price Targets ({stock.ticker})</SectionTitle>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={analystTargets} layout="vertical" margin={{ left: 80 }}>
                  <CartesianGrid stroke={T.border} strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fill: T.dim, fontSize: 11 }} domain={[2.5, 5.8]} tickFormatter={(v) => `€${v}`} />
                  <YAxis type="category" dataKey="firm" tick={{ fill: T.muted, fontSize: 11 }} width={80} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine x={stock.price} stroke={T.cyan} strokeDasharray="4 4" label={{ value: 'Current', fill: T.cyan, fontSize: 9, position: 'top' }} />
                  <Bar dataKey="target" name="Price Target (€)" radius={[0, 4, 4, 0]}>
                    {analystTargets.map((a, i) => (
                      <Cell key={i} fill={a.rating === 'Buy' ? T.emerald : a.rating === 'Neutral' ? T.amber : T.crimson} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <SectionTitle>Analyst Details</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {analystTargets.map((a) => (
                  <div key={a.firm} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0.6rem 0.75rem', background: T.bg, borderRadius: 6, border: `1px solid ${T.border}`
                  }}>
                    <span style={{ color: T.text, fontWeight: 600, fontSize: '0.85rem' }}>{a.firm}</span>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <span style={{ color: T.cyan, fontFamily: 'monospace', fontWeight: 700 }}>€{a.target}</span>
                      <span style={{ color: T.emerald, fontSize: '0.75rem', fontFamily: 'monospace' }}>+{a.upside}%</span>
                      <Badge color={a.rating === 'Buy' ? T.emerald : a.rating === 'Neutral' ? T.amber : T.crimson}>{a.rating}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <SectionTitle>Consensus Summary</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  {[
                    { label: 'Buy',  count: analystTargets.filter(a => a.rating === 'Buy').length,     color: T.emerald },
                    { label: 'Hold', count: analystTargets.filter(a => a.rating === 'Hold' || a.rating === 'Neutral').length, color: T.amber },
                    { label: 'Sell', count: analystTargets.filter(a => a.rating === 'Sell').length,    color: T.crimson },
                  ].map((r) => (
                    <div key={r.label} style={{ textAlign: 'center', background: `${r.color}15`, border: `1px solid ${r.color}44`, borderRadius: 8, padding: '0.75rem 0.5rem' }}>
                      <div style={{ color: r.color, fontWeight: 800, fontSize: '1.5rem', fontFamily: 'monospace' }}>{r.count}</div>
                      <div style={{ color: r.color, fontSize: '0.75rem', fontWeight: 600 }}>{r.label}</div>
                    </div>
                  ))}
                </div>

                {[
                  { label: 'Avg Price Target',   value: `€${stock.avgTarget}`,  subtext: `+${upside}% upside` },
                  { label: 'High Target',         value: `€${stock.highTarget}`, subtext: '' },
                  { label: 'Low Target',          value: `€${stock.lowTarget}`,  subtext: '' },
                  { label: 'Analysts Covering',   value: `${stock.analystCount}`,subtext: 'Institutional coverage' },
                ].map((m) => (
                  <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0', borderBottom: `1px solid ${T.border}` }}>
                    <span style={{ color: T.muted, fontSize: '0.8rem' }}>{m.label}</span>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: T.cyan, fontFamily: 'monospace', fontWeight: 700, fontSize: '0.85rem' }}>{m.value}</div>
                      {m.subtext && <div style={{ color: T.dim, fontSize: '0.68rem' }}>{m.subtext}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Disclaimer */}
            <Card style={{ gridColumn: '1 / -1', border: `1px solid ${T.amber}33`, background: '#111a0a' }}>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                <Info size={15} color={T.amber} style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <div style={{ color: T.amber, fontWeight: 700, fontSize: '0.78rem', marginBottom: 4 }}>DISCLAIMER</div>
                  <div style={{ color: T.dim, fontSize: '0.75rem', lineHeight: 1.6 }}>
                    This analysis is for informational purposes only and does not constitute financial advice. All data is sourced from publicly available information and may be subject to change. Past performance is not indicative of future results. Always consult a qualified financial advisor before making investment decisions. Analyst price targets represent estimates and are not guarantees of future performance.
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
