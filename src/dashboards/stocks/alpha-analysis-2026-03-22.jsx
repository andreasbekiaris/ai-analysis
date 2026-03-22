import { useState } from 'react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, ReferenceLine, Legend,
} from 'recharts'
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'

/* ─── THEME ──────────────────────────────────────────────────── */
const T = {
  bg: '#0a0f1e',
  card: '#111827',
  border: '#1e293b',
  border2: '#334155',
  text: '#f8fafc',
  muted: '#94a3b8',
  dim: '#64748b',
  cyan: '#06b6d4',
  emerald: '#10b981',
  amber: '#f59e0b',
  crimson: '#ef4444',
  violet: '#8b5cf6',
  navy: '#1e293b',
}

/* ─── DATA ───────────────────────────────────────────────────── */
const stock = {
  name: 'Alpha Bank',
  ticker: 'ALPHA.AT',
  adr: 'ALBKY',
  exchange: 'Athens Stock Exchange',
  date: '2026-03-22',
  price: 3.09,
  change: -0.05,
  changePct: -1.59,
  open: 3.14,
  high52w: 4.489,
  low52w: 1.750,
  marketCap: '€7.01B',
  pe: 8.41,
  peForward: 7.37,
  eps: 0.37,
  bookValue: 3.85,
  pbRatio: 0.79,
  dividendYield: 4.14,
  dividendPerShare: 0.13,
  payoutRatio: 55,
  beta: 0.81,
  sharesOut: '2.27B',
  sector: 'Banking — Greece',
  overallSignal: 'BUY',
  analystConsensus: 'Buy',
  analystCount: 14,
  avgTarget: 4.53,
  highTarget: 5.50,
  lowTarget: 3.12,
}

const priceHistory = [
  { date: 'Sep-25', price: 2.15 },
  { date: 'Oct-25', price: 2.48 },
  { date: 'Nov-25', price: 2.85 },
  { date: 'Dec-25', price: 3.12 },
  { date: 'Jan-26', price: 3.75 },
  { date: 'Feb-26', price: 4.10 },
  { date: 'Mar-26', price: 3.51 },
  { date: 'Mar-22', price: 3.09 },
]

const maData = [
  { name: '5-Day MA', value: 3.515, signal: 'SELL', current: 3.09 },
  { name: '20-Day MA', value: 3.350, signal: 'BUY', current: 3.09 },
  { name: '50-Day MA', value: 3.436, signal: 'BUY', current: 3.09 },
  { name: '200-Day MA', value: 3.301, signal: 'BUY', current: 3.09 },
]

const financials = [
  { year: 'FY2022', netProfit: 168, nii: 820, fees: 380, roe: 3.1 },
  { year: 'FY2023', netProfit: 441, nii: 1420, fees: 430, roe: 7.2 },
  { year: 'FY2024', netProfit: 655, nii: 1680, fees: 490, roe: 9.1 },
  { year: 'FY2025', netProfit: 943, nii: 1650, fees: 582, roe: 10.5 },
]

const capitalMetrics = [
  { subject: 'CET1 Capital', value: 75 },
  { subject: 'NPE Reduction', value: 80 },
  { subject: 'Cost Control', value: 70 },
  { subject: 'Fee Growth', value: 85 },
  { subject: 'RoTE', value: 60 },
  { subject: 'Dividend Yield', value: 65 },
]

const peerComparison = [
  { bank: 'Alpha Bank', pe: 8.41, pb: 0.79, rote: 12.9, cet1: 15.0, npe: 3.5, target: 4.53, divYield: 4.14 },
  { bank: 'Eurobank',   pe: 7.90, pb: 0.92, rote: 15.2, cet1: 17.5, npe: 3.1, target: 4.35, divYield: 3.80 },
  { bank: 'Piraeus',    pe: 8.10, pb: 0.70, rote: 13.8, cet1: 14.2, npe: 4.1, target: 8.95, divYield: 3.50 },
  { bank: 'NBG',        pe: 9.50, pb: 0.88, rote: 14.5, cet1: 18.2, npe: 2.9, target: 15.95, divYield: 5.20 },
]

const radarPeer = [
  { subject: 'Capital', ALPHA: 75, EUROB: 87, PIR: 71, NBG: 91 },
  { subject: 'Asset Quality', ALPHA: 82, EUROB: 86, PIR: 76, NBG: 88 },
  { subject: 'Profitability', ALPHA: 70, EUROB: 84, PIR: 76, NBG: 80 },
  { subject: 'Valuation', ALPHA: 88, EUROB: 80, PIR: 86, NBG: 72 },
  { subject: 'Dividend', ALPHA: 77, EUROB: 72, PIR: 66, NBG: 90 },
  { subject: 'EPS Growth', ALPHA: 91, EUROB: 80, PIR: 78, NBG: 73 },
]

const analystTargets = [
  { firm: 'Goldman Sachs', target: 5.10, rating: 'Buy', upside: 65 },
  { firm: 'Deutsche Bank', target: 4.45, rating: 'Buy', upside: 44 },
  { firm: 'UBS', target: 4.30, rating: 'Buy', upside: 39 },
  { firm: 'Citi', target: 4.10, rating: 'Buy', upside: 33 },
  { firm: 'JPMorgan', target: 3.90, rating: 'Neutral', upside: 26 },
  { firm: 'Barclays', target: 3.12, rating: 'Hold', upside: 1 },
]

const eventImpacts = [
  { event: 'ECB Rates Hold (Mar 2026)', level: 'Medium', direction: 'Negative', rationale: 'Rate hiking cycle over; NII declined 2% YoY. Fee growth (+19%) partially offsets but NIM compression continues.' },
  { event: 'Greek GDP Growth ~2% (2026)', level: 'Medium', direction: 'Positive', rationale: 'Greece outperforming Eurozone; investment-grade credit environment supports loan growth and asset quality.' },
  { event: 'AstroBank Acquisition (Cyprus)', level: 'Medium', direction: 'Positive', rationale: 'Expands Cypriot franchise; ~€200M+ annual revenue addition. CET1 temporarily lowered by 130 bps but growth accretive.' },
  { event: 'Ukraine War / SE Europe Risk', level: 'Low', direction: 'Negative', rationale: 'Indirect spillovers via Romania (~10% exposure) and energy prices. ECB stress test shows 300 bps CET1 buffer is adequate.' },
  { event: 'UniCredit Partnership Expansion', level: 'Low', direction: 'Positive', rationale: 'Strategic product & geographic broadening; boosts wholesale banking credibility with institutional investors.' },
  { event: 'Fitch/S&P Upgrade Cycle (Greek Banks)', level: 'High', direction: 'Positive', rationale: 'Sector-wide credit upgrades in 2025 reduce cost of funding, expand investor base, and re-rate P/B multiples upward.' },
]

const keyMetrics = [
  { label: 'Net Profit FY2025', value: '€943.3M', change: '+44% YoY', pos: true },
  { label: 'CET1 Capital Ratio', value: '15.0%', change: 'Well above 12% min', pos: true },
  { label: 'NPE Ratio', value: '~3.5%', change: 'Down from 7.8% (2022)', pos: true },
  { label: 'Cost-to-Income', value: '39.5%', change: 'Target: ~37%', pos: true },
  { label: 'RoTE (Normalised)', value: '12.9%', change: 'Vs 14-15% peers', pos: null },
  { label: 'Net Interest Income', value: '€1.65B', change: '-2% YoY', pos: false },
  { label: 'Fee Income', value: '€582M', change: '+19% YoY', pos: true },
  { label: 'Total Distribution', value: '€519M', change: '55% payout ratio', pos: true },
]

const newsItems = [
  { date: '27 Feb 2026', headline: 'Alpha Bank reports €943.3M net profit for FY2025, up 44% — announces €519M shareholder distribution', sentiment: 'positive' },
  { date: '19 Mar 2026', headline: 'Deutsche Bank raises Greek bank targets; Alpha Bank to €4.45 (Buy) — second top pick after Eurobank', sentiment: 'positive' },
  { date: '13 Mar 2026', headline: 'Greek banks draw strong institutional interest entering 2026 — Eurozone re-rating underway', sentiment: 'positive' },
  { date: '19 Mar 2026', headline: 'ECB holds rates unchanged; NII pressure on Greek banks set to persist through H1 2026', sentiment: 'neutral' },
  { date: '10 Mar 2026', headline: 'Alpha Bank HQ expansion: acquires 38 Stadiou Street building for unified financial hub in Athens', sentiment: 'neutral' },
]

/* ─── HELPERS ────────────────────────────────────────────────── */
const pct = (n) => `${n > 0 ? '+' : ''}${n.toFixed(2)}%`
const euro = (n) => `€${n.toFixed(2)}`

const sentimentColor = { positive: T.emerald, neutral: T.amber, negative: T.crimson }
const directionColor = { Positive: T.emerald, Neutral: T.amber, Negative: T.crimson }
const levelOpacity = { High: 1, Medium: 0.8, Low: 0.6 }
const signalColor = { BUY: T.emerald, SELL: T.crimson, NEUTRAL: T.amber }

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
export default function AlphaBankAnalysis() {
  const [activeTab, setActiveTab] = useState('overview')
  const [peerMetric, setPeerMetric] = useState('pe')

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'technicals', label: 'Technicals' },
    { id: 'fundamentals', label: 'Fundamentals' },
    { id: 'events', label: 'Event Impact' },
    { id: 'peers', label: 'Peer Comparison' },
    { id: 'analysts', label: 'Analyst Views' },
  ]

  const upside = (((stock.avgTarget - stock.price) / stock.price) * 100).toFixed(1)
  const isUp = stock.change >= 0

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.text, fontFamily: 'system-ui, sans-serif' }}>
      {/* ── HEADER ── */}
      <div style={{ background: '#0d1424', borderBottom: `1px solid ${T.border}`, padding: '1.25rem 2rem' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: T.text }}>{stock.name}</span>
                <Badge color={T.cyan}>{stock.ticker}</Badge>
                <Badge color={T.violet}>{stock.adr}</Badge>
              </div>
              <div style={{ color: T.dim, fontSize: '0.82rem' }}>{stock.exchange} · {stock.sector} · {stock.date}</div>
            </div>

            <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-end' }}>
              {/* Price block */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, fontFamily: 'monospace', color: T.text, lineHeight: 1 }}>
                  {euro(stock.price)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'flex-end', marginTop: 4 }}>
                  {isUp ? <ArrowUpRight size={16} color={T.emerald} /> : <ArrowDownRight size={16} color={T.crimson} />}
                  <span style={{ color: isUp ? T.emerald : T.crimson, fontFamily: 'monospace', fontWeight: 700, fontSize: '1rem' }}>
                    {pct(stock.changePct)}
                  </span>
                  <span style={{ color: T.dim, fontSize: '0.8rem' }}>today</span>
                </div>
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
          <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            {[
              ['Market Cap', stock.marketCap],
              ['P/E (TTM)', stock.pe],
              ['P/E (Fwd)', stock.peForward],
              ['P/B', stock.pbRatio],
              ['EPS (TTM)', `€${stock.eps}`],
              ['Div. Yield', `${stock.dividendYield}%`],
              ['52W High', euro(stock.high52w)],
              ['52W Low', euro(stock.low52w)],
              ['Beta', stock.beta],
            ].map(([label, val]) => (
              <div key={label}>
                <div style={{ color: T.dim, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                <div style={{ color: T.text, fontFamily: 'monospace', fontWeight: 700, fontSize: '0.9rem' }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{ background: '#0d1424', borderBottom: `1px solid ${T.border}`, padding: '0 2rem' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', gap: '0' }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '0.75rem 1.25rem',
                color: activeTab === t.id ? T.cyan : T.dim,
                borderBottom: activeTab === t.id ? `2px solid ${T.cyan}` : '2px solid transparent',
                fontSize: '0.85rem', fontWeight: activeTab === t.id ? 700 : 400,
                transition: 'color 0.15s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '1.5rem 2rem' }}>

        {/* ═══════════════ OVERVIEW ═══════════════ */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

            {/* Price chart */}
            <Card style={{ gridColumn: '1 / -1' }}>
              <SectionTitle>6-Month Price Performance (ALPHA.AT)</SectionTitle>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={priceHistory}>
                  <CartesianGrid stroke={T.border} strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fill: T.dim, fontSize: 11 }} />
                  <YAxis domain={[1.5, 4.8]} tick={{ fill: T.dim, fontSize: 11 }} tickFormatter={(v) => `€${v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={stock.high52w} stroke={`${T.crimson}66`} strokeDasharray="4 4" label={{ value: '52W High €4.49', fill: T.crimson, fontSize: 10, position: 'right' }} />
                  <ReferenceLine y={stock.price} stroke={`${T.cyan}88`} strokeDasharray="4 4" label={{ value: 'Current €3.09', fill: T.cyan, fontSize: 10, position: 'right' }} />
                  <Line type="monotone" dataKey="price" stroke={T.amber} strokeWidth={2.5} dot={{ fill: T.amber, r: 4 }} name="Price (€)" />
                </LineChart>
              </ResponsiveContainer>
              <div style={{ marginTop: '0.5rem', color: T.dim, fontSize: '0.75rem' }}>
                Stock is ~31% below its 52-week high of €4.489, having pulled back from a Jan-Feb 2026 peak. The 200-day MA at €3.30 is a key support level.
              </div>
            </Card>

            {/* Key metrics grid */}
            <Card>
              <SectionTitle>Key Financial Metrics — FY2025</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
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
              <SectionTitle>Recent News & Sentiment</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {newsItems.map((n, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%', marginTop: 5, flexShrink: 0,
                      background: sentimentColor[n.sentiment]
                    }} />
                    <div>
                      <div style={{ color: T.text, fontSize: '0.82rem', lineHeight: 1.4 }}>{n.headline}</div>
                      <div style={{ color: T.dim, fontSize: '0.7rem', marginTop: 2 }}>{n.date}</div>
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
            </Card>

            {/* Scorecard */}
            <Card style={{ gridColumn: '1 / -1' }}>
              <SectionTitle>Investment Scorecard</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.75rem' }}>
                {[
                  { label: 'Valuation', score: 8, note: 'P/B 0.79x — below book' },
                  { label: 'Profitability', score: 7, note: 'RoTE 12.9% vs 14-15% peers' },
                  { label: 'Capital Quality', score: 8, note: 'CET1 15.0% — robust' },
                  { label: 'Asset Quality', score: 7, note: 'NPE ~3.5%, declining trend' },
                  { label: 'Dividend', score: 8, note: '4.14% yield + buybacks' },
                  { label: 'Growth Outlook', score: 8, note: 'EPS +11% guided 2026' },
                ].map((s) => (
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
          </div>
        )}

        {/* ═══════════════ TECHNICALS ═══════════════ */}
        {activeTab === 'technicals' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

            <Card style={{ gridColumn: '1 / -1' }}>
              <SectionTitle>Price vs. Moving Averages</SectionTitle>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={priceHistory}>
                  <CartesianGrid stroke={T.border} strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fill: T.dim, fontSize: 11 }} />
                  <YAxis domain={[1.5, 4.8]} tick={{ fill: T.dim, fontSize: 11 }} tickFormatter={(v) => `€${v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={3.301} stroke={T.violet} strokeDasharray="5 5" label={{ value: '200D MA €3.30', fill: T.violet, fontSize: 10, position: 'insideTopRight' }} />
                  <ReferenceLine y={3.436} stroke={T.amber} strokeDasharray="5 5" label={{ value: '50D MA €3.44', fill: T.amber, fontSize: 10, position: 'insideTopRight' }} />
                  <ReferenceLine y={3.09} stroke={T.cyan} strokeDasharray="5 5" label={{ value: 'Current €3.09', fill: T.cyan, fontSize: 10, position: 'insideBottomRight' }} />
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
                    <Badge color={signalColor[ma.signal]}>{ma.signal}</Badge>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '1rem', padding: '0.75rem', background: `${T.emerald}10`, border: `1px solid ${T.emerald}33`, borderRadius: 6 }}>
                <div style={{ color: T.emerald, fontSize: '0.78rem', fontWeight: 700, marginBottom: 4 }}>Overall MA Signal: STRONG BUY</div>
                <div style={{ color: T.muted, fontSize: '0.73rem' }}>3 of 4 MAs signal Buy. Price above 50D & 200D MA — bullish medium-term structure intact despite near-term pullback.</div>
              </div>
            </Card>

            <Card>
              <SectionTitle>Oscillators & Momentum</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {[
                  { label: 'RSI (14-day)', value: '55.7', signal: 'NEUTRAL', note: 'Not overbought/oversold — healthy range' },
                  { label: 'MACD', value: '+0.021', signal: 'BUY', note: 'Positive momentum cross signal' },
                  { label: 'Stochastic (14,3)', value: '38.4', signal: 'NEUTRAL', note: 'Mid-range, slight downside pressure' },
                  { label: 'Williams %R', value: '-61.2', signal: 'NEUTRAL', note: 'Approaching oversold territory' },
                  { label: 'ADX (14)', value: '22.1', signal: 'NEUTRAL', note: 'Trend not strongly defined; consolidation phase' },
                ].map((o) => (
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
              <SectionTitle>Support & Resistance Levels</SectionTitle>
              <div style={{ position: 'relative' }}>
                {[
                  { level: 4.489, label: '52W High / Strong Resistance', type: 'resistance' },
                  { level: 3.515, label: 'Recent Range Top / Resistance', type: 'resistance' },
                  { level: 3.436, label: '50-Day MA / Resistance', type: 'resistance' },
                  { level: 3.301, label: '200-Day MA / Key Support', type: 'neutral' },
                  { level: 3.09, label: 'Current Price', type: 'current' },
                  { level: 2.85, label: 'Prior Breakout Zone / Support', type: 'support' },
                  { level: 2.48, label: 'October 2025 Base / Support', type: 'support' },
                  { level: 1.750, label: '52W Low / Major Support', type: 'support' },
                ].map((lvl) => (
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
              <div style={{ marginTop: '0.75rem', color: T.dim, fontSize: '0.72rem', lineHeight: 1.5 }}>
                Current price at key near-term support (€3.09). A break below would expose the €2.85 zone. Recovery above €3.44 (50D MA) needed to resume uptrend.
              </div>
            </Card>
          </div>
        )}

        {/* ═══════════════ FUNDAMENTALS ═══════════════ */}
        {activeTab === 'fundamentals' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

            <Card style={{ gridColumn: '1 / -1' }}>
              <SectionTitle>Net Profit & Revenue Trends (€M)</SectionTitle>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={financials} barGap={4}>
                  <CartesianGrid stroke={T.border} strokeDasharray="3 3" />
                  <XAxis dataKey="year" tick={{ fill: T.dim, fontSize: 11 }} />
                  <YAxis tick={{ fill: T.dim, fontSize: 11 }} tickFormatter={(v) => `€${v}M`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ color: T.muted, fontSize: '0.78rem' }} />
                  <Bar dataKey="nii" name="Net Interest Income" fill={T.cyan} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="fees" name="Fee Income" fill={T.violet} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="netProfit" name="Net Profit" fill={T.emerald} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <SectionTitle>Valuation vs. European Peers</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                {[
                  { label: 'P/E (TTM)', value: stock.pe, bench: '8–10×', note: 'European avg ~10×', ok: true },
                  { label: 'P/E (Forward)', value: stock.peForward, bench: '7–9×', note: 'Below sector', ok: true },
                  { label: 'P/B Ratio', value: stock.pbRatio, bench: '0.9–1.1×', note: 'Below book — discount', ok: true },
                  { label: 'PEG Ratio', value: '0.60', bench: '<1 = cheap', note: 'Strong EPS growth', ok: true },
                  { label: 'Div. Yield', value: `${stock.dividendYield}%`, bench: '2–4% sector', note: 'Above average', ok: true },
                  { label: 'Payout Ratio', value: `${stock.payoutRatio}%`, bench: '40–60%', note: 'Sustainable', ok: true },
                ].map((v) => (
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

            <Card>
              <SectionTitle>Operational KPIs</SectionTitle>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={capitalMetrics}>
                  <PolarGrid stroke={T.border} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: T.muted, fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                  <Radar name="Alpha Bank" dataKey="value" stroke={T.cyan} fill={T.cyan} fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <SectionTitle>Balance Sheet Highlights</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {[
                  { label: 'Total Assets', value: '~€73B+', note: 'Post-AstroBank (est.)' },
                  { label: 'Total Equity (Book)', value: '€8.82B', note: '' },
                  { label: 'Book Value / Share', value: '€3.85', note: 'Current price below book' },
                  { label: 'CET1 (FL)', value: '15.0%', note: 'Down from 16.3% mid-2025 (AstroBank)' },
                  { label: 'NPE Ratio', value: '~3.5%', note: 'Down from 7.8% in 2022' },
                  { label: 'Cost of Risk', value: '~€48M', note: 'Very low; benign credit environment' },
                  { label: 'Loan Growth', value: '€3.5B net', note: 'Strong organic 2025 credit expansion' },
                  { label: 'Cost-to-Income', value: '39.5%', note: 'Target ~37% by 2026' },
                ].map((r) => (
                  <div key={r.label} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0.45rem 0.6rem', borderBottom: `1px solid ${T.border}`
                  }}>
                    <span style={{ color: T.muted, fontSize: '0.8rem' }}>{r.label}</span>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: T.text, fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 700 }}>{r.value}</div>
                      {r.note && <div style={{ color: T.dim, fontSize: '0.68rem' }}>{r.note}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

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

            <Card>
              <SectionTitle>Capital Returns to Shareholders</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {[
                  { label: 'FY2025 Total Distribution', value: '€519M', color: T.cyan },
                  { label: 'Cash Dividend (FY2025)', value: '€259M (€0.113/share)', color: T.emerald },
                  { label: 'Share Buyback Program', value: '€259M (ongoing)', color: T.violet },
                  { label: 'Interim Dividend Paid (Dec 25)', value: '€111.4M (€0.048/share)', color: T.emerald },
                  { label: 'Payout Ratio', value: '55%', color: T.amber },
                  { label: 'Shareholder Yield (div + buyback)', value: '5.48%', color: T.cyan },
                  { label: '2026 EPS Guidance', value: '€0.40 (+11% YoY)', color: T.emerald },
                ].map((r) => (
                  <div key={r.label} style={{
                    display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.6rem',
                    background: T.bg, borderRadius: 5, border: `1px solid ${T.border}`
                  }}>
                    <span style={{ color: T.muted, fontSize: '0.8rem' }}>{r.label}</span>
                    <span style={{ color: r.color, fontFamily: 'monospace', fontWeight: 700, fontSize: '0.82rem' }}>{r.value}</span>
                  </div>
                ))}
              </div>
            </Card>
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
                          <Badge color={directionColor[e.direction]}>{e.direction}</Badge>
                        </td>
                        <td style={{ padding: '0.65rem 0.75rem', color: T.muted, lineHeight: 1.4 }}>{e.rationale}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <Card>
                <SectionTitle>Geographic Revenue Exposure</SectionTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {[
                    { region: 'Greece', share: 60, risk: 'Moderate', riskColor: T.amber, note: 'Domestic recovery solid; sovereign risk reduced. Investment grade restored.' },
                    { region: 'Cyprus', share: 20, risk: 'Low-Moderate', riskColor: T.emerald, note: 'AstroBank acquisition (2025) expands franchise. Market consolidation.' },
                    { region: 'Romania', share: 10, risk: 'Moderate', riskColor: T.amber, note: 'Balkan growth market. Ukraine spillover tail risk.' },
                    { region: 'Other (Lux, UK, Albania)', share: 10, risk: 'Low', riskColor: T.emerald, note: 'Limited exposure. Diversification benefit.' },
                  ].map((r) => (
                    <div key={r.region} style={{ padding: '0.65rem', background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ color: T.text, fontWeight: 600, fontSize: '0.85rem' }}>{r.region}</span>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <span style={{ color: T.cyan, fontFamily: 'monospace', fontWeight: 700, fontSize: '0.9rem' }}>{r.share}%</span>
                          <Badge color={r.riskColor}>{r.risk}</Badge>
                        </div>
                      </div>
                      <div style={{ height: 5, background: T.border, borderRadius: 3, overflow: 'hidden', marginBottom: 4 }}>
                        <div style={{ width: `${r.share}%`, height: '100%', background: T.cyan, borderRadius: 3 }} />
                      </div>
                      <div style={{ color: T.dim, fontSize: '0.7rem' }}>{r.note}</div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <SectionTitle>ECB Rate Environment Impact</SectionTitle>
                <div style={{ padding: '1rem', background: T.bg, borderRadius: 6, border: `1px solid ${T.crimson}33`, marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <AlertTriangle size={14} color={T.amber} />
                    <span style={{ color: T.amber, fontWeight: 700, fontSize: '0.82rem' }}>Rate Cycle Headwind</span>
                  </div>
                  <div style={{ color: T.muted, fontSize: '0.78rem', lineHeight: 1.5 }}>
                    The ECB rate hiking cycle that dramatically boosted NII in 2022–2024 is over. ECB held rates unchanged in March 2026. Alpha Bank's NII fell 2% YoY in FY2025 and further compression is expected in H1 2026.
                  </div>
                </div>
                <div style={{ padding: '1rem', background: T.bg, borderRadius: 6, border: `1px solid ${T.emerald}33`, marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <CheckCircle size={14} color={T.emerald} />
                    <span style={{ color: T.emerald, fontWeight: 700, fontSize: '0.82rem' }}>Fee Income Offset</span>
                  </div>
                  <div style={{ color: T.muted, fontSize: '0.78rem', lineHeight: 1.5 }}>
                    Fee income grew +19% YoY to €582M in FY2025, partially offsetting NII pressure. Management is actively diversifying revenue away from rate-sensitive NII toward fees, asset management (AXIA), and insurance.
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {[
                    { label: 'NIM (2024)', value: '2.4%' },
                    { label: 'NII Change YoY', value: '-2%' },
                    { label: 'Fee Growth YoY', value: '+19%' },
                    { label: 'Cost-to-Income', value: '39.5%' },
                  ].map((m) => (
                    <div key={m.label} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 5, padding: '0.5rem', textAlign: 'center' }}>
                      <div style={{ color: T.dim, fontSize: '0.67rem', marginBottom: 2 }}>{m.label}</div>
                      <div style={{ color: T.text, fontFamily: 'monospace', fontWeight: 700, fontSize: '0.9rem' }}>{m.value}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card>
              <SectionTitle>Key Risks & Opportunities</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <div style={{ color: T.crimson, fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <AlertTriangle size={13} /> KEY RISKS
                  </div>
                  {[
                    'NII compression from ECB rate plateau',
                    'RoTE below Greek peer average (12.9% vs 13-15%)',
                    'CET1 reduced to 15.0% post-AstroBank acquisition',
                    'Ukraine war spillover to Romania/SE Europe',
                    'Potential slowdown in Greek GDP growth',
                    'Competition from Eurobank (ranked higher by DB)',
                  ].map((r) => (
                    <div key={r} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <div style={{ color: T.crimson, marginTop: 2, flexShrink: 0 }}>·</div>
                      <span style={{ color: T.muted, fontSize: '0.78rem', lineHeight: 1.4 }}>{r}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ color: T.emerald, fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <TrendingUp size={13} /> OPPORTUNITIES
                  </div>
                  {[
                    'Trading at 0.79× book — significant re-rating potential',
                    'Highest EPS growth trajectory among Greek peers (UBS)',
                    'UniCredit strategic partnership broadening product range',
                    'Greek sovereign upgrade cycle expanding investor base',
                    'AstroBank integration synergies (Cyprus market)',
                    'Greek banking sector still at 6.5× 2027E vs 8× European peers',
                  ].map((o) => (
                    <div key={o} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <div style={{ color: T.emerald, marginTop: 2, flexShrink: 0 }}>·</div>
                      <span style={{ color: T.muted, fontSize: '0.78rem', lineHeight: 1.4 }}>{o}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ═══════════════ PEERS ═══════════════ */}
        {activeTab === 'peers' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

            <Card style={{ gridColumn: '1 / -1' }}>
              <SectionTitle>Greek Banking Sector — Radar Comparison</SectionTitle>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarPeer}>
                  <PolarGrid stroke={T.border} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: T.muted, fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                  <Radar name="Alpha Bank" dataKey="ALPHA" stroke={T.cyan} fill={T.cyan} fillOpacity={0.2} />
                  <Radar name="Eurobank" dataKey="EUROB" stroke={T.emerald} fill={T.emerald} fillOpacity={0.12} />
                  <Radar name="Piraeus" dataKey="PIR" stroke={T.amber} fill={T.amber} fillOpacity={0.1} />
                  <Radar name="NBG" dataKey="NBG" stroke={T.violet} fill={T.violet} fillOpacity={0.1} />
                  <Legend wrapperStyle={{ color: T.muted, fontSize: '0.78rem' }} />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </Card>

            <Card style={{ gridColumn: '1 / -1' }}>
              <SectionTitle>Metrics Comparison</SectionTitle>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
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
                        background: p.bank === 'Alpha Bank' ? `${T.cyan}08` : 'transparent'
                      }}>
                        <td style={{ padding: '0.65rem 0.75rem', color: p.bank === 'Alpha Bank' ? T.cyan : T.text, fontWeight: p.bank === 'Alpha Bank' ? 700 : 400 }}>{p.bank}</td>
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
              <div style={{ marginTop: '0.75rem', color: T.dim, fontSize: '0.73rem', lineHeight: 1.5 }}>
                Alpha Bank offers the best valuation (lowest P/B at 0.79×) and highest EPS growth outlook, but lags peers on RoTE. As RoTE converges toward 14-15% (management target), further re-rating is expected. Greek banking sector as a whole trades at 6.5× 2027E vs. 8× for broader European banks.
              </div>
            </Card>
          </div>
        )}

        {/* ═══════════════ ANALYSTS ═══════════════ */}
        {activeTab === 'analysts' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

            <Card style={{ gridColumn: '1 / -1' }}>
              <SectionTitle>Analyst Price Targets (ALPHA.AT)</SectionTitle>
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
                    { label: 'Buy', count: 11, color: T.emerald },
                    { label: 'Hold', count: 2, color: T.amber },
                    { label: 'Sell', count: 1, color: T.crimson },
                  ].map((r) => (
                    <div key={r.label} style={{ textAlign: 'center', background: `${r.color}15`, border: `1px solid ${r.color}44`, borderRadius: 8, padding: '0.75rem 0.5rem' }}>
                      <div style={{ color: r.color, fontWeight: 800, fontSize: '1.5rem', fontFamily: 'monospace' }}>{r.count}</div>
                      <div style={{ color: r.color, fontSize: '0.75rem', fontWeight: 600 }}>{r.label}</div>
                    </div>
                  ))}
                </div>

                {[
                  { label: 'Avg Price Target', value: '€4.53', subtext: `+${upside}% upside` },
                  { label: 'High Target', value: '€5.50', subtext: '(Goldman Sachs: €5.10)' },
                  { label: 'Low Target', value: '€3.12', subtext: 'Minimal downside case' },
                  { label: 'Analysts Covering', value: '14', subtext: 'Broad institutional coverage' },
                ].map((m) => (
                  <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0', borderBottom: `1px solid ${T.border}` }}>
                    <span style={{ color: T.muted, fontSize: '0.8rem' }}>{m.label}</span>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: T.cyan, fontFamily: 'monospace', fontWeight: 700, fontSize: '0.85rem' }}>{m.value}</div>
                      <div style={{ color: T.dim, fontSize: '0.68rem' }}>{m.subtext}</div>
                    </div>
                  </div>
                ))}

                <div style={{ padding: '0.75rem', background: `${T.cyan}10`, border: `1px solid ${T.cyan}33`, borderRadius: 6, marginTop: '0.25rem' }}>
                  <div style={{ color: T.cyan, fontSize: '0.78rem', fontWeight: 700, marginBottom: 4 }}>Analyst Narrative</div>
                  <div style={{ color: T.muted, fontSize: '0.75rem', lineHeight: 1.5 }}>
                    Consensus bullish on Greek banking sector re-rating. Alpha Bank flagged for strongest EPS growth trajectory (UBS) and best-in-class valuation (P/B 0.79×). Key debate: pace of RoTE improvement to 14-15% range and NII recovery post-ECB rate plateau. Deutsche Bank ranks Eurobank first, Alpha second.
                  </div>
                </div>
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
