import { useState } from 'react'
import { Link } from 'react-router-dom'
import AddToAnalysis from './AddToAnalysis'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, Cell
} from 'recharts'
import {
  AlertTriangle, Shield, Globe2, TrendingDown, Zap, Clock,
  Target, Activity, Eye, Users, DollarSign,
  Crosshair, Radio, Flag, BookOpen, ArrowRight, Home, MessageSquare,
  BarChart3
} from 'lucide-react'

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const sustainabilityConfig = {
  fully_sustainable:    { label: "Fully Sustainable",           color: "#10b981", bg: "rgba(16,185,129,0.15)" },
  sustainable_short_term: { label: "Short-Term Only (6–18mo)", color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
  barely_feasible:      { label: "Barely Feasible",             color: "#ef4444", bg: "rgba(239,68,68,0.15)" },
  not_feasible:         { label: "Not Feasible",                color: "#dc2626", bg: "rgba(220,38,38,0.15)" },
}

const statusConfig = {
  observed:     { label: "OBSERVED", color: "#ef4444", dot: "#ef4444" },
  emerging:     { label: "EMERGING", color: "#f59e0b", dot: "#f59e0b" },
  not_observed: { label: "NOT YET",  color: "#64748b", dot: "#334155" },
}

const impactColor = (score) => {
  if (score >= 9) return "#dc2626"
  if (score >= 7) return "#ef4444"
  if (score >= 5) return "#f59e0b"
  if (score >= 3) return "#10b981"
  return "#06b6d4"
}

const s = {
  page:      { minHeight: '100vh', backgroundColor: '#0a0f1e', color: '#f8fafc', fontFamily: 'system-ui, sans-serif', padding: '1.5rem' },
  container: { maxWidth: '1400px', margin: '0 auto' },
  panel:     { backgroundColor: '#111827', border: '1px solid #1e293b', borderRadius: '8px', padding: '1.25rem', marginBottom: '1rem' },
  panelTitle:{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#06b6d4', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
  grid2:     { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  grid3:     { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' },
  mono:      { fontFamily: 'monospace' },
  tag:       (color) => ({ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color, border: `1px solid ${color}`, borderRadius: '3px', padding: '2px 6px', display: 'inline-block' }),
  muted:     { color: '#94a3b8', fontSize: '0.8rem' },
  dim:       { color: '#64748b', fontSize: '0.75rem' },
}

function ScoreBar({ score, max = 10 }) {
  const pct = (score / max) * 100
  const color = impactColor(score)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ flex: 1, height: '4px', backgroundColor: '#1e293b', borderRadius: '2px' }}>
        <div style={{ width: `${pct}%`, height: '100%', backgroundColor: color, borderRadius: '2px' }} />
      </div>
      <span style={{ ...s.mono, fontSize: '0.75rem', color, minWidth: '1.5rem', textAlign: 'right' }}>{score}</span>
    </div>
  )
}

function ProbGauge({ probability, color }) {
  const r = 30, cx = 40, cy = 40
  const circumference = 2 * Math.PI * r
  const arc = (probability / 100) * circumference
  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e293b" strokeWidth="7" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="7"
        strokeDasharray={`${arc} ${circumference}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`} />
      <text x={cx} y={cy + 5} textAnchor="middle" fill={color} fontSize="14" fontWeight="700" fontFamily="monospace">
        {probability}%
      </text>
    </svg>
  )
}

function FeasibilityRow({ dim, data }) {
  return (
    <div className="g-feasibility-row" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
      <span style={{ ...s.dim, minWidth: '90px', flexShrink: 0 }}>{dim}</span>
      <div className="g-feasibility-bar" style={{ flex: 1, minWidth: 0 }}><ScoreBar score={data.score} /></div>
      <span className="g-feasibility-detail" style={{ ...s.dim, fontSize: '0.7rem', flex: 2 }}>{data.detail}</span>
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function GeoDashboard({ data, politicalComments, verdict, gaps }) {
  const [activeScenario, setActiveScenario] = useState(0)
  const [activeTab, setActiveTab] = useState('verdict')
  const d = data
  const scenario = d.scenarios[activeScenario]

  const tabs = [
    { id: 'verdict',    label: 'Verdict',         icon: Zap,       highlight: true },
    { id: 'overview',   label: 'Situation',        icon: Globe2 },
    { id: 'signals',    label: 'Political Signals',icon: MessageSquare },
    { id: 'scenarios',  label: 'Scenarios',        icon: Target },
    { id: 'feasibility',label: 'Feasibility',      icon: Shield },
    { id: 'impact',     label: 'Impact',           icon: Activity },
    { id: 'indicators', label: 'Indicators',       icon: Eye },
    { id: 'experts',    label: 'Expert Views',     icon: Users },
    { id: 'decisions',  label: 'Decision Tree',    icon: Crosshair },
  ]

  const radarData = ['Military', 'Economic', 'Diplomatic', 'Humanitarian', 'Regional', 'Global'].map(dim => ({
    subject: dim,
    value: scenario.impacts[dim.toLowerCase()],
    fullMark: 10,
  }))

  const marketData = d.marketData || d.oilPriceData || []
  const marketDataLabel = d.marketDataLabel || 'Brent Crude ($/bbl)'

  return (
    <div style={s.page} className="g-page">
      <style>{`
        @media (max-width: 768px) {
          .g-grid2 { grid-template-columns: 1fr !important; }
          .g-grid3 { grid-template-columns: 1fr !important; }
          .g-metrics { grid-template-columns: 1fr 1fr !important; }
          .g-header { flex-direction: column !important; }
          .g-header-right { align-items: flex-start !important; flex-direction: row !important; flex-wrap: wrap !important; }
          .g-tabs { overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; flex-wrap: nowrap !important; padding-bottom: 2px; }
          .g-tabs::-webkit-scrollbar { display: none; }
          .g-signals-grid { grid-template-columns: 1fr !important; }
          .g-page { padding: 0.75rem !important; }
          .g-verdict-flex { flex-direction: column !important; }
          .g-feasibility-rows { grid-template-columns: 1fr !important; }
          .g-scenario-detail { grid-template-columns: 1fr !important; }
          .g-watchpoints-grid { grid-template-columns: 1fr !important; }
          .g-feasibility-row { flex-direction: column !important; gap: 0.2rem !important; align-items: flex-start !important; }
          .g-feasibility-row .g-feasibility-bar { width: 100% !important; }
          .g-feasibility-row .g-feasibility-detail { flex: none !important; }
          .g-watchpoint-header { flex-direction: column !important; align-items: flex-start !important; gap: 0.3rem !important; }
        }
        @media (max-width: 480px) {
          .g-metrics { grid-template-columns: 1fr 1fr !important; }
          h1 { font-size: 1.3rem !important; }
          .g-header-tags { flex-wrap: wrap !important; gap: 0.3rem !important; }
        }
      `}</style>

      <div style={s.container}>

        {/* ── HEADER ── */}
        <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #1e293b', paddingBottom: '1rem' }}>
          <div className="g-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="g-header-tags" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                <span style={s.tag('#ef4444')}>ACTIVE CONFLICT</span>
                <span style={s.tag('#f59e0b')}>OPEN SOURCE</span>
                <span style={s.tag('#8b5cf6')}>GEOPOLITICAL</span>
              </div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 0.2rem', letterSpacing: '-0.02em' }}>
                {d.title}
              </h1>
              <p style={{ ...s.muted, margin: 0 }}>{d.subtitle} · Analysis Date: {d.date}</p>
            </div>
            <div className="g-header-right" style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <Link to="/" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                  color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600,
                  textDecoration: 'none', padding: '0.3rem 0.7rem',
                  border: '1px solid #1e293b', borderRadius: '6px',
                  backgroundColor: '#0a0f1e', transition: 'all 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#06b6d4'; e.currentTarget.style.color = '#06b6d4' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e293b'; e.currentTarget.style.color = '#94a3b8' }}
                >
                  <Home size={12} /> Home
                </Link>
                <Link to="/help" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                  color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600,
                  textDecoration: 'none', padding: '0.3rem 0.7rem',
                  border: '1px solid #1e293b', borderRadius: '6px',
                  backgroundColor: '#0a0f1e', transition: 'all 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#06b6d4'; e.currentTarget.style.color = '#06b6d4' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e293b'; e.currentTarget.style.color = '#94a3b8' }}
                >
                  <BookOpen size={12} /> Glossary
                </Link>
              </div>
              {d.daysElapsed != null && (
                <div style={{ ...s.mono, fontSize: '2rem', fontWeight: 800, color: '#ef4444' }}>DAY {d.daysElapsed}</div>
              )}
              {d.warStartDate && <div style={{ ...s.dim }}>War began {d.warStartDate}</div>}
              <div style={{ ...s.dim }}>Confidence: <span style={{ color: '#f59e0b' }}>{d.overallConfidence}</span></div>
            </div>
          </div>
        </div>

        {/* ── KEY METRICS STRIP ── */}
        {d.situation.keyMetrics && (
          <div className="g-metrics" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
            {d.situation.keyMetrics.map((m) => (
              <div key={m.label} style={{ ...s.panel, padding: '0.85rem', marginBottom: 0 }}>
                <div style={{ ...s.dim, marginBottom: '0.2rem' }}>{m.label}</div>
                <div style={{ ...s.mono, fontSize: '1.1rem', fontWeight: 700, color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── TABS ── */}
        <div className="g-tabs" style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem', borderBottom: '1px solid #1e293b', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
          {tabs.map(({ id, label, icon: Icon, highlight }) => (
            <button key={id} onClick={() => setActiveTab(id)} style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.4rem 0.85rem', borderRadius: '6px', border: 'none', cursor: 'pointer',
              fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.03em',
              backgroundColor: activeTab === id ? '#06b6d4' : highlight && activeTab !== id ? 'rgba(245,158,11,0.12)' : 'transparent',
              color: activeTab === id ? '#0a0f1e' : highlight && activeTab !== id ? '#f59e0b' : '#94a3b8',
              border: highlight && activeTab !== id ? '1px solid rgba(245,158,11,0.4)' : '1px solid transparent',
              transition: 'all 0.15s', whiteSpace: 'nowrap',
            }}>
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: STRATEGIC VERDICT                                             */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'verdict' && (
          <div>
            {/* Stance banner */}
            <div style={{ ...s.panel, border: `2px solid ${verdict.stanceColor}66`, background: 'rgba(245,158,11,0.06)', marginBottom: '1rem' }}>
              <div className="g-verdict-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
                    <div style={{
                      padding: '0.3rem 1rem', borderRadius: '6px',
                      background: `${verdict.stanceColor}22`, border: `2px solid ${verdict.stanceColor}`,
                      color: verdict.stanceColor, fontWeight: 800, fontSize: '1rem', letterSpacing: '0.05em',
                    }}>{verdict.stance}</div>
                    <span style={{ color: '#f8fafc', fontWeight: 700 }}>{verdict.timing}</span>
                    <span style={s.tag('#94a3b8')}>Conviction: {verdict.conviction}</span>
                  </div>
                  <p style={{ ...s.muted, lineHeight: 1.65, margin: 0, maxWidth: 780, fontSize: '0.875rem' }}>{verdict.timingDetail}</p>
                </div>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ ...s.dim, marginBottom: 2 }}>Primary Scenario</div>
                  <div style={{ color: '#f59e0b', fontWeight: 800, fontFamily: 'monospace', fontSize: '1.1rem' }}>{verdict.primaryProb}%</div>
                  <div style={{ ...s.dim }}>{verdict.primaryScenario}</div>
                </div>
              </div>
            </div>

            <div className="g-grid2" style={s.grid2}>
              {/* Immediate watchpoints */}
              <div style={s.panel}>
                <div style={s.panelTitle}><Eye size={13} /> Immediate Watchpoints (Act On These)</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  {verdict.immediateWatchpoints.map((w, i) => {
                    const urgencyColor = w.urgency === 'Critical' || w.urgency === 'Critical (tail)' ? '#ef4444' : '#f59e0b'
                    return (
                      <div key={i} style={{ backgroundColor: '#0a0f1e', borderRadius: '6px', padding: '0.75rem', border: `1px solid ${urgencyColor}33` }}>
                        <div className="g-watchpoint-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', gap: '0.5rem' }}>
                          <span style={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.82rem' }}>{w.signal}</span>
                          <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0, flexWrap: 'wrap' }}>
                            <span style={s.tag(urgencyColor)}>{w.urgency}</span>
                            <span style={{ ...s.dim, fontSize: '0.7rem' }}>{w.timing}</span>
                          </div>
                        </div>
                        <div style={{ ...s.muted, fontSize: '0.77rem', lineHeight: 1.5 }}>{w.implication}</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Market positioning */}
              <div style={s.panel}>
                <div style={s.panelTitle}><Activity size={13} /> Market Positioning Guide</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {verdict.marketPositioning.map((p, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', backgroundColor: '#0a0f1e', borderRadius: '6px', border: '1px solid #1e293b' }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.82rem' }}>{p.asset}</span>
                        <div style={{ ...s.dim, fontSize: '0.72rem', marginTop: 2 }}>{p.rationale}</div>
                      </div>
                      <span style={{ ...s.tag(p.color), flexShrink: 0 }}>{p.stance}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#0a0f1e', borderRadius: '6px', border: '1px solid #1e293b' }}>
                  <div style={{ ...s.panelTitle, marginBottom: '0.4rem' }}><Radio size={12} /> Probability Update</div>
                  <p style={{ ...s.dim, fontSize: '0.75rem', margin: 0, lineHeight: 1.5 }}>{verdict.probabilityUpdate}</p>
                  <div style={{ ...s.dim, fontSize: '0.72rem', marginTop: '0.4rem' }}>
                    Next review trigger: <span style={{ color: '#f59e0b' }}>{verdict.nextReview}</span>
                  </div>
                </div>
              </div>
            </div>

            <AddToAnalysis
              analysisTitle={d.title}
              analysisType="geopolitical"
              gaps={gaps}
            />
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: POLITICAL SIGNALS                                             */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'signals' && (
          <div>
            <div style={{ ...s.panel, marginBottom: '0.75rem', background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.2)' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.8rem', lineHeight: 1.6 }}>
                Real statements, posts, and broadcasts from key actors — sorted newest first.
                Signal types: <span style={{ color: '#ef4444', fontWeight: 700 }}>Escalatory</span> ·{' '}
                <span style={{ color: '#10b981', fontWeight: 700 }}>De-escalatory</span> ·{' '}
                <span style={{ color: '#06b6d4', fontWeight: 700 }}>Diplomatic</span> ·{' '}
                <span style={{ color: '#f59e0b', fontWeight: 700 }}>Economic</span> ·{' '}
                <span style={{ color: '#64748b', fontWeight: 700 }}>Ambiguous</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[...politicalComments].sort((a, b) => new Date(b.date) - new Date(a.date)).map((c, i) => {
                const signalColors = {
                  escalatory: '#ef4444',
                  'de-escalatory': '#10b981',
                  diplomatic: '#06b6d4',
                  economic: '#f59e0b',
                  ambiguous: '#64748b',
                }
                const col = signalColors[c.signalType] || '#64748b'
                return (
                  <div key={i} style={{ ...s.panel, marginBottom: 0, borderLeft: `3px solid ${col}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.6rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: `${col}22`, border: `1px solid ${col}44`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.75rem', fontWeight: 800, color: col, flexShrink: 0,
                        }}>
                          {c.actor.split(' ').map(w => w[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.9rem' }}>{c.actor}</div>
                          <div style={{ color: '#64748b', fontSize: '0.72rem' }}>{c.role}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <span style={{ ...s.tag('#334155'), fontSize: '0.65rem' }}>{c.platform}</span>
                        <span style={{ ...s.tag(col), fontSize: '0.65rem', textTransform: 'capitalize' }}>{c.signalType}</span>
                        <span style={{ color: '#64748b', fontSize: '0.72rem' }}>{c.date}{c.time ? ` · ${c.time}` : ''}</span>
                        {c.verified === false && <span style={{ ...s.tag('#f59e0b'), fontSize: '0.62rem' }}>PARAPHRASE</span>}
                      </div>
                    </div>
                    <blockquote style={{
                      margin: '0 0 0.75rem',
                      padding: '0.6rem 0.85rem',
                      background: `${col}0a`,
                      borderLeft: `2px solid ${col}66`,
                      borderRadius: '0 6px 6px 0',
                      color: '#e2e8f0',
                      fontSize: '0.85rem',
                      fontStyle: 'italic',
                      lineHeight: 1.55,
                    }}>
                      "{c.quote}"
                    </blockquote>
                    <div className="g-signals-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                      <div>
                        <div style={{ color: '#64748b', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>Context</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.75rem', lineHeight: 1.4 }}>{c.context}</div>
                      </div>
                      <div>
                        <div style={{ color: '#64748b', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>Market Impact</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.75rem', lineHeight: 1.4 }}>{c.marketImpact}</div>
                      </div>
                      <div>
                        <div style={{ color: '#64748b', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>Scenario Implication</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.75rem', lineHeight: 1.4 }}>{c.scenarioImplication}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: SITUATION OVERVIEW                                            */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <div>
            <div className="g-grid2" style={s.grid2}>
              {/* Context */}
              <div style={s.panel}>
                <div style={s.panelTitle}><Globe2 size={13} /> Situation Context</div>
                <p style={{ ...s.muted, lineHeight: 1.65, margin: 0 }}>{d.situation.context}</p>
              </div>

              {/* Market data chart */}
              <div style={s.panel}>
                <div style={s.panelTitle}><TrendingDown size={13} /> {marketDataLabel}</div>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={marketData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1e293b', borderRadius: '6px' }} labelStyle={{ color: '#94a3b8' }} itemStyle={{ color: '#06b6d4' }} />
                    <Line type="monotone" dataKey="price" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4', r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                  <span style={s.dim}>War began {d.warStartDate} →</span>
                  <span style={{ ...s.mono, color: '#ef4444', fontSize: '0.8rem' }}>
                    Peak: {marketData.length > 0 ? Math.max(...marketData.map(x => x.price)) : '–'}
                  </span>
                </div>
              </div>
            </div>

            {/* Triggers */}
            <div style={s.panel}>
              <div style={s.panelTitle}><Zap size={13} /> Key Triggers & Escalation Ladder</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.6rem' }}>
                {d.situation.triggers.map((t, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                    <span style={{ ...s.mono, color: '#ef4444', fontSize: '0.8rem', minWidth: '1.2rem' }}>{String(i + 1).padStart(2, '0')}</span>
                    <span style={{ ...s.muted, fontSize: '0.8rem', lineHeight: 1.5 }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actors */}
            <div style={s.panel}>
              <div style={s.panelTitle}><Users size={13} /> Key Actors & Power Index</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                {d.situation.actors.map((a) => (
                  <div key={a.name} style={{ backgroundColor: '#0a0f1e', borderRadius: '6px', padding: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#f8fafc' }}>{a.name}</span>
                      <span style={{ ...s.mono, fontSize: '0.75rem', color: '#06b6d4' }}>{a.power}</span>
                    </div>
                    <div style={s.dim}>{a.role}</div>
                    <div style={{ ...s.muted, fontSize: '0.78rem', marginTop: '0.2rem', lineHeight: 1.4 }}>{a.stance}</div>
                    <div style={{ marginTop: '0.4rem', height: '3px', backgroundColor: '#1e293b', borderRadius: '2px' }}>
                      <div style={{ width: `${a.power}%`, height: '100%', backgroundColor: '#06b6d4', borderRadius: '2px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: SCENARIOS                                                     */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'scenarios' && (
          <div>
            {/* Scenario Selector */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {d.scenarios.map((sc, i) => (
                <button key={sc.id} onClick={() => setActiveScenario(i)} style={{
                  padding: '0.5rem 1rem', borderRadius: '6px', border: `1px solid ${activeScenario === i ? sc.color : '#1e293b'}`,
                  backgroundColor: activeScenario === i ? `${sc.color}22` : 'transparent',
                  color: activeScenario === i ? sc.color : '#94a3b8',
                  cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.15s'
                }}>
                  {sc.name} <span style={{ opacity: 0.7 }}>({sc.probability}%)</span>
                </button>
              ))}
            </div>

            {/* Probability Bar */}
            <div style={{ ...s.panel, marginBottom: '1rem' }}>
              <div style={s.panelTitle}><Activity size={13} /> Scenario Probability Distribution</div>
              <div style={{ display: 'flex', height: '28px', borderRadius: '4px', overflow: 'hidden', gap: '2px' }}>
                {d.scenarios.map((sc) => (
                  <div key={sc.id} style={{
                    width: `${sc.probability}%`, backgroundColor: sc.color, opacity: 0.85,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.65rem', fontWeight: 700, color: '#0a0f1e', transition: 'opacity 0.2s',
                    cursor: 'pointer', minWidth: sc.probability > 8 ? 'auto' : 0
                  }} onClick={() => setActiveScenario(d.scenarios.indexOf(sc))}>
                    {sc.probability > 8 ? `${sc.probability}%` : ''}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                {d.scenarios.map((sc) => (
                  <div key={sc.id} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: sc.color }} />
                    <span style={s.dim}>{sc.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Scenario Detail */}
            <div className="g-scenario-detail" style={s.grid2}>
              <div style={s.panel}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ ...s.tag(scenario.color), marginBottom: '0.4rem' }}>{scenario.tagline}</div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: scenario.color, margin: 0 }}>{scenario.name}</h2>
                  </div>
                  <ProbGauge probability={scenario.probability} color={scenario.color} />
                </div>
                <p style={{ ...s.muted, lineHeight: 1.65, fontSize: '0.85rem', marginBottom: '0.75rem' }}>{scenario.description}</p>
                <p style={{ ...s.dim, lineHeight: 1.6, fontSize: '0.78rem', margin: 0 }}>{scenario.narrative}</p>
              </div>

              <div style={s.panel}>
                <div style={s.panelTitle}><Clock size={13} /> Time Horizons</div>
                {[
                  { label: '0–6 Months',  content: scenario.timeHorizons.shortTerm,  color: '#ef4444' },
                  { label: '6–24 Months', content: scenario.timeHorizons.mediumTerm, color: '#f59e0b' },
                  { label: '2–10 Years',  content: scenario.timeHorizons.longTerm,   color: '#10b981' },
                ].map((h) => (
                  <div key={h.label} style={{ marginBottom: '0.85rem', paddingLeft: '0.75rem', borderLeft: `2px solid ${h.color}` }}>
                    <div style={{ ...s.tag(h.color), marginBottom: '0.3rem' }}>{h.label}</div>
                    <p style={{ ...s.muted, fontSize: '0.8rem', margin: 0, lineHeight: 1.55 }}>{h.content}</p>
                  </div>
                ))}

                {/* Mini Impact Chart */}
                <div style={s.panelTitle}><Activity size={13} /> Impact Radar</div>
                <ResponsiveContainer width="100%" height={180}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#1e293b" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: '#1e293b', fontSize: 8 }} />
                    <Radar name="Impact" dataKey="value" stroke={scenario.color} fill={scenario.color} fillOpacity={0.2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: FEASIBILITY                                                   */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'feasibility' && (
          <div>
            {/* Scenario Selector */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {d.scenarios.map((sc, i) => (
                <button key={sc.id} onClick={() => setActiveScenario(i)} style={{
                  padding: '0.4rem 0.85rem', borderRadius: '6px', border: `1px solid ${activeScenario === i ? sc.color : '#1e293b'}`,
                  backgroundColor: activeScenario === i ? `${sc.color}22` : 'transparent',
                  color: activeScenario === i ? sc.color : '#94a3b8',
                  cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600
                }}>
                  {sc.name}
                </button>
              ))}
            </div>

            {scenario.feasibility.map((f, fi) => {
              const sust = sustainabilityConfig[f.overallSustainability]
              return (
                <div key={fi} style={s.panel}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={s.panelTitle}><Shield size={13} /> Feasibility Assessment #{fi + 1}</div>
                      <h3 style={{ color: '#f8fafc', fontSize: '1rem', fontWeight: 700, margin: '0 0 0.25rem' }}>{f.action}</h3>
                      <span style={s.dim}>Actor: <span style={{ color: '#94a3b8' }}>{f.actor}</span></span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ ...sust, padding: '4px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', display: 'inline-block' }}>
                        {sust.label}
                      </div>
                    </div>
                  </div>

                  <div className="g-feasibility-rows" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
                    <FeasibilityRow dim="Military"      data={f.militaryFeasibility} />
                    <FeasibilityRow dim="Economic"      data={f.economicCapacity} />
                    <FeasibilityRow dim="Political Will" data={f.politicalWill} />
                    <FeasibilityRow dim="Alliance"      data={f.allianceSupport} />
                  </div>

                  <div className="g-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '6px', padding: '0.75rem' }}>
                      <div style={{ ...s.dim, marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <AlertTriangle size={11} color="#ef4444" /> DEALBREAKER
                      </div>
                      <p style={{ ...s.muted, fontSize: '0.8rem', margin: 0, lineHeight: 1.5 }}>{f.dealbreaker}</p>
                    </div>
                    <div style={{ backgroundColor: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: '6px', padding: '0.75rem' }}>
                      <div style={{ ...s.dim, marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <DollarSign size={11} color="#06b6d4" /> ESTIMATED COST
                      </div>
                      <p style={{ ...s.mono, fontSize: '0.85rem', color: '#06b6d4', margin: 0 }}>{f.estimatedCost}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: IMPACT HEATMAP                                                */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'impact' && (
          <div>
            <div style={s.panel}>
              <div style={s.panelTitle}><Activity size={13} /> Impact Heatmap — All Scenarios</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', color: '#64748b', fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '1px solid #1e293b' }}>Scenario</th>
                      {['Military', 'Economic', 'Diplomatic', 'Humanitarian', 'Regional', 'Global'].map(dim => (
                        <th key={dim} style={{ padding: '0.5rem', color: '#64748b', fontWeight: 600, fontSize: '0.65rem', letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: '1px solid #1e293b', textAlign: 'center', minWidth: '85px' }}>{dim}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {d.scenarios.map((sc) => (
                      <tr key={sc.id} style={{ borderBottom: '1px solid #0f172a' }}>
                        <td style={{ padding: '0.6rem 0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: sc.color }} />
                            <span style={{ color: '#f8fafc', fontWeight: 600 }}>{sc.name}</span>
                            <span style={{ ...s.mono, color: sc.color, fontSize: '0.7rem' }}>{sc.probability}%</span>
                          </div>
                        </td>
                        {['military', 'economic', 'diplomatic', 'humanitarian', 'regional', 'global'].map(dim => {
                          const val = sc.impacts[dim]
                          const bg = impactColor(val)
                          return (
                            <td key={dim} style={{ padding: '0.5rem', textAlign: 'center' }}>
                              <div style={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                width: '36px', height: '36px', borderRadius: '6px',
                                backgroundColor: `${bg}22`, border: `1px solid ${bg}44`,
                                ...s.mono, fontSize: '0.9rem', fontWeight: 800, color: bg
                              }}>
                                {val}
                              </div>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                {[
                  { label: '9–10 Catastrophic', color: '#dc2626' },
                  { label: '7–8 Severe',         color: '#ef4444' },
                  { label: '5–6 Significant',    color: '#f59e0b' },
                  { label: '3–4 Moderate',       color: '#10b981' },
                ].map(({ label, color }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: color }} />
                    <span style={s.dim}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Radar Comparison */}
            <div style={s.panel}>
              <div style={s.panelTitle}><Activity size={13} /> Impact Profile — Scenario Radar Comparison (All 6 Dimensions)</div>
              <ResponsiveContainer width="100%" height={340}>
                <RadarChart
                  data={['Military', 'Economic', 'Diplomatic', 'Humanitarian', 'Regional', 'Global'].map(dim => {
                    const entry = { dimension: dim }
                    d.scenarios.forEach(sc => { entry[sc.name] = sc.impacts[dim.toLowerCase()] })
                    return entry
                  })}
                  margin={{ top: 10, right: 30, left: 30, bottom: 10 }}
                >
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="dimension" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <PolarRadiusAxis domain={[0, 10]} tick={{ fill: '#64748b', fontSize: 8 }} tickCount={6} />
                  {d.scenarios.map(sc => (
                    <Radar key={sc.id} name={sc.name} dataKey={sc.name} stroke={sc.color} fill={sc.color} fillOpacity={0.07} strokeWidth={2} />
                  ))}
                  <Legend wrapperStyle={{ fontSize: '0.72rem', paddingTop: '0.5rem' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1e293b', borderRadius: '6px' }} labelStyle={{ color: '#94a3b8' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Per-dimension bar chart */}
            <div style={s.panel}>
              <div style={s.panelTitle}><BarChart3 size={13} /> Impact by Dimension — Scenario Comparison</div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={['Military', 'Economic', 'Diplomatic', 'Humanitarian', 'Regional', 'Global'].map(dim => {
                    const entry = { dimension: dim }
                    d.scenarios.forEach(sc => { entry[sc.name] = sc.impacts[dim.toLowerCase()] })
                    return entry
                  })}
                  margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="dimension" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <YAxis domain={[0, 10]} tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1e293b', borderRadius: '6px' }} labelStyle={{ color: '#94a3b8' }} />
                  <Legend wrapperStyle={{ fontSize: '0.7rem', paddingTop: '0.5rem' }} />
                  {d.scenarios.map(sc => (
                    <Bar key={sc.id} dataKey={sc.name} fill={sc.color} opacity={0.85} radius={[2, 2, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: INDICATORS                                                    */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'indicators' && (
          <div>
            {/* Scenario Selector */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {d.scenarios.map((sc, i) => (
                <button key={sc.id} onClick={() => setActiveScenario(i)} style={{
                  padding: '0.4rem 0.85rem', borderRadius: '6px', border: `1px solid ${activeScenario === i ? sc.color : '#1e293b'}`,
                  backgroundColor: activeScenario === i ? `${sc.color}22` : 'transparent',
                  color: activeScenario === i ? sc.color : '#94a3b8',
                  cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600
                }}>
                  {sc.name}
                </button>
              ))}
            </div>

            <div style={s.panel}>
              <div style={s.panelTitle}><Eye size={13} /> Signpost Indicators — {scenario.name}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {scenario.indicators.map((ind, i) => {
                  const cfg = statusConfig[ind.status]
                  return (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      backgroundColor: '#0a0f1e', borderRadius: '6px', padding: '0.75rem 1rem',
                      border: `1px solid ${ind.status === 'not_observed' ? '#1e293b' : cfg.dot + '44'}`
                    }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: cfg.dot, flexShrink: 0 }} />
                      <span style={{ flex: 1, color: ind.status === 'not_observed' ? '#64748b' : '#f8fafc', fontSize: '0.875rem', lineHeight: 1.5 }}>{ind.signal}</span>
                      <span style={s.tag(cfg.color)}>{cfg.label}</span>
                    </div>
                  )
                })}
              </div>

              {/* Summary */}
              <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#0a0f1e', borderRadius: '6px' }}>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  {(['observed', 'emerging', 'not_observed']).map(status => {
                    const count = scenario.indicators.filter(i => i.status === status).length
                    const cfg = statusConfig[status]
                    return (
                      <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: cfg.dot }} />
                        <span style={s.dim}>{cfg.label}: </span>
                        <span style={{ ...s.mono, color: cfg.color, fontWeight: 700 }}>{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* All indicators across scenarios */}
            <div style={s.panel}>
              <div style={s.panelTitle}><Radio size={13} /> All Active Signals (Observed + Emerging)</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {d.scenarios.flatMap(sc =>
                  sc.indicators
                    .filter(ind => ind.status !== 'not_observed')
                    .map((ind, i) => ({ ...ind, scenario: sc.name, color: sc.color, key: `${sc.id}-${i}` }))
                ).map(ind => {
                  const cfg = statusConfig[ind.status]
                  return (
                    <div key={ind.key} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', backgroundColor: '#0a0f1e', borderRadius: '4px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: cfg.dot, flexShrink: 0 }} />
                      <span style={{ ...s.tag(ind.color), flexShrink: 0 }}>{ind.scenario}</span>
                      <span style={{ flex: 1, color: '#94a3b8', fontSize: '0.8rem' }}>{ind.signal}</span>
                      <span style={s.tag(cfg.color)}>{cfg.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: EXPERT VIEWS                                                  */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'experts' && (
          <div>
            {/* Consensus */}
            <div style={s.panel}>
              <div style={s.panelTitle}><BookOpen size={13} /> Expert Consensus View</div>
              <p style={{ ...s.muted, lineHeight: 1.7, fontSize: '0.875rem', marginBottom: '0.75rem' }}>{d.expertOpinions.consensus.summary}</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {d.expertOpinions.consensus.supporters.map(org => (
                  <span key={org} style={s.tag('#10b981')}>{org}</span>
                ))}
              </div>
              <div style={{ marginTop: '0.5rem', ...s.dim }}>
                Expert Confidence: <span style={{ color: '#f59e0b' }}>{d.expertOpinions.overallExpertConfidence}</span>
              </div>
            </div>

            {/* Dissenting Views */}
            <div style={s.panel}>
              <div style={s.panelTitle}><AlertTriangle size={13} /> Dissenting Views</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {d.expertOpinions.dissenting.map((dv, i) => (
                  <div key={i} style={{ backgroundColor: '#0a0f1e', borderRadius: '6px', padding: '0.85rem', border: '1px solid #1e293b' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.3rem' }}>
                      <div>
                        <span style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.875rem' }}>{dv.expert}</span>
                        <span style={{ ...s.dim, marginLeft: '0.5rem' }}>· {dv.affiliation}</span>
                      </div>
                    </div>
                    <p style={{ color: '#06b6d4', fontSize: '0.82rem', fontWeight: 600, margin: '0 0 0.4rem', lineHeight: 1.4 }}>{dv.position}</p>
                    <p style={{ ...s.muted, fontSize: '0.8rem', margin: '0 0 0.4rem', lineHeight: 1.5 }}>Reasoning: {dv.reasoning}</p>
                    <p style={{ ...s.dim, fontSize: '0.75rem', margin: 0, fontStyle: 'italic' }}>Assessment: {dv.credibilityNote}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Regional vs Western */}
            <div className="g-grid2" style={s.grid2}>
              <div style={s.panel}>
                <div style={s.panelTitle}><Globe2 size={13} /> Western View</div>
                <p style={{ ...s.muted, lineHeight: 1.65, fontSize: '0.85rem', margin: 0 }}>{d.expertOpinions.regionalVsWestern.westernView}</p>
              </div>
              <div style={s.panel}>
                <div style={s.panelTitle}><Flag size={13} /> Regional View</div>
                <p style={{ ...s.muted, lineHeight: 1.65, fontSize: '0.85rem', margin: 0 }}>{d.expertOpinions.regionalVsWestern.regionalView}</p>
              </div>
            </div>
            <div style={s.panel}>
              <div style={s.panelTitle}><ArrowRight size={13} /> Gap Analysis</div>
              <p style={{ ...s.muted, lineHeight: 1.65, fontSize: '0.85rem', margin: 0 }}>{d.expertOpinions.regionalVsWestern.gapAnalysis}</p>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: DECISION TREE                                                 */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'decisions' && (
          <div>
            <div style={s.panel}>
              <div style={s.panelTitle}><Crosshair size={13} /> Key Decision Points — War Trajectory</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {d.decisionPoints.map((dp, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '1rem', alignItems: 'start', backgroundColor: '#0a0f1e', borderRadius: '6px', padding: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#1e293b', border: '2px solid #06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', ...s.mono, fontSize: '0.8rem', color: '#06b6d4', fontWeight: 700 }}>
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      {i < d.decisionPoints.length - 1 && (
                        <div style={{ width: '2px', height: '40px', backgroundColor: '#1e293b' }} />
                      )}
                    </div>
                    <div>
                      <div style={{ ...s.tag('#f59e0b'), marginBottom: '0.3rem' }}>{dp.actor}</div>
                      <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.9rem', marginBottom: '0.3rem' }}>{dp.decision}</div>
                      <div style={{ ...s.muted, fontSize: '0.78rem', lineHeight: 1.5 }}>{dp.consequence}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      {dp.leadsTo.map(sid => {
                        const sc = d.scenarios.find(s => s.id === sid)
                        return (
                          <span key={sid} style={{ ...s.tag(sc.color), fontSize: '0.6rem', whiteSpace: 'nowrap' }}>→ {sc.name}</span>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scenario Probability Chart */}
            <div style={s.panel}>
              <div style={s.panelTitle}><Target size={13} /> Scenario Probability — Current Assessment</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={d.scenarios.map(sc => ({ name: sc.name, probability: sc.probability, color: sc.color }))} margin={{ top: 5, right: 20, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} unit="%" domain={[0, 45]} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1e293b', borderRadius: '6px' }} labelStyle={{ color: '#94a3b8' }} formatter={(v) => [`${v}%`, 'Probability']} />
                  <Bar dataKey="probability" radius={[4, 4, 0, 0]}>
                    {d.scenarios.map((sc) => (
                      <Cell key={sc.id} fill={sc.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── FOOTER ── */}
        <div style={{ marginTop: '2rem', padding: '1rem', borderTop: '1px solid #1e293b', color: '#64748b', fontSize: '0.75rem', textAlign: 'center', lineHeight: 1.6 }}>
          Analysis date: {d.date}{d.daysElapsed != null ? ` · War Day ${d.daysElapsed}` : ''} · Sources: RAND, Brookings, CFR, IISS, ICG, Atlantic Council, Arms Control Association, Oman Foreign Ministry, US Congressional Record, UK House of Commons Library, Britannica, Wikipedia, Al Jazeera, NPR, CNBC, Democracy Now, Times of Israel, Iran International, Military.com, CSIS
          <br />
          <span style={{ color: '#475569' }}>Open source analysis only. All probabilities represent analytical estimates subject to significant uncertainty. Not for policy use without independent verification.</span>
        </div>

      </div>
    </div>
  )
}
