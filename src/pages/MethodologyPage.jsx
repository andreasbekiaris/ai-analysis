import { useState } from 'react'
import { Link } from 'react-router-dom'
import SiteNavBar from '../components/SiteNavBar'
import {
  TrendingUp, Globe2, BarChart3, ChevronDown, ChevronUp,
  Target, Shield, Activity, Zap, DollarSign, Scale,
  Crosshair, Brain, Flame, Users, BookOpen, Database,
  AlertTriangle,
} from 'lucide-react'

/* ─── THEME ──────────────────────────────────────────────────── */
const T = {
  bg: '#0a0f1e', card: '#111827', border: '#1e293b',
  text: '#f8fafc', muted: '#94a3b8', dim: '#64748b',
  cyan: '#06b6d4', emerald: '#10b981', amber: '#f59e0b',
  crimson: '#ef4444', violet: '#8b5cf6',
}

/* ─── COLLAPSIBLE SECTION ────────────────────────────────────── */
function Section({ icon: Icon, title, color, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, marginBottom: '1rem', overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '0.65rem',
          padding: '1rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer',
          color: T.text, fontSize: '1rem', fontWeight: 700, textAlign: 'left',
        }}
      >
        <Icon size={18} color={color} />
        <span style={{ flex: 1 }}>{title}</span>
        {open ? <ChevronUp size={16} color={T.dim} /> : <ChevronDown size={16} color={T.dim} />}
      </button>
      {open && (
        <div style={{ padding: '0 1.25rem 1.25rem', color: T.muted, fontSize: '0.85rem', lineHeight: 1.75 }}>
          {children}
        </div>
      )}
    </div>
  )
}

function Formula({ label, formula, example }) {
  return (
    <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, padding: '0.85rem 1rem', marginBottom: '0.75rem' }}>
      <div style={{ color: T.cyan, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
        {label}
      </div>
      <div style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: T.text, whiteSpace: 'pre-wrap', marginBottom: example ? '0.5rem' : 0 }}>
        {formula}
      </div>
      {example && (
        <div style={{ fontSize: '0.78rem', color: T.dim, fontStyle: 'italic' }}>
          {example}
        </div>
      )}
    </div>
  )
}

function Badge({ children, color }) {
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 4,
      fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase',
      letterSpacing: '0.06em', background: `${color}18`, color, border: `1px solid ${color}33`,
    }}>
      {children}
    </span>
  )
}

/* ─── MAIN PAGE ──────────────────────────────────────────────── */
export default function MethodologyPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: T.bg, color: T.text, fontFamily: 'system-ui, sans-serif' }}>
      <SiteNavBar />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <BookOpen size={28} color={T.cyan} />
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Methodology</h1>
          </div>
          <p style={{ color: T.muted, fontSize: '0.95rem', margin: 0 }}>
            How Promithea builds analysis dashboards — the frameworks, formulas, data sources, and theories behind every assessment.
          </p>
        </div>

        {/* ─── STOCK ANALYSIS ────────────────────────────────── */}
        <h2 style={{ color: T.emerald, fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingUp size={16} /> Stock Analysis
        </h2>

        <Section icon={Target} title="How Stock Analysis Works" color={T.emerald} defaultOpen={true}>
          <p>Every stock analysis follows a structured 5-step pipeline:</p>
          <ol style={{ paddingLeft: '1.25rem' }}>
            <li><strong>Geopolitical Cross-Reference</strong> — Before any stock research, we scan all active geopolitical dashboards for relevance. If a conflict affects the stock's sector, region, or macro backdrop, it directly gates the investment verdict.</li>
            <li><strong>Data Gathering</strong> — Real-time price data from Yahoo Finance, technical consensus from TradingView, fundamentals from MacroTrends, analyst ratings from MarketBeat/TipRanks, and news from Reuters/Bloomberg/CNBC.</li>
            <li><strong>Valuation Models</strong> — Three independent valuations (DCF, DDM, Relative) produce bull/base/bear fair values that anchor the price target.</li>
            <li><strong>Sensitivity & Risk</strong> — We model how key variables (interest rates, oil prices, FX, loan growth) affect earnings, then quantify risk using expected return, max drawdown, Sharpe ratio, and Kelly Criterion.</li>
            <li><strong>Verdict</strong> — Synthesize all inputs into a stance, entry zone, stop-loss, price targets, and key conditions. If geopolitical risk is active, political signals explicitly gate the timing.</li>
          </ol>
        </Section>

        <Section icon={DollarSign} title="Valuation Models" color={T.emerald}>
          <p>We use three independent valuation approaches and average them for the base case:</p>

          <Formula
            label="Discounted Cash Flow (DCF)"
            formula={`Fair Value = Σ(FCF × (1+g)^t / (1+WACC)^t) + Terminal Value / (1+WACC)^5
                     ─────────────────────────────────────────────────────
                                    Shares Outstanding

WACC = Risk-Free Rate + Beta × Equity Risk Premium (5.5%)
Terminal Value = FCF₅ × (1 + 2.5%) / (WACC − 2.5%)`}
            example="Example: FCF €1.2B, growth 8.9%, WACC 9.8% → DCF Fair Value = €4.12/share"
          />

          <Formula
            label="Dividend Discount Model (DDM)"
            formula={`Fair Value = DPS × (1 + g) / (r − g)

g = ROE × (1 − Payout Ratio)     ← sustainable growth rate
r = Risk-Free + Beta × 5.5%       ← required return`}
            example="Example: DPS €0.109, ROE 16%, payout 55% → g=7.2%, r=9.5% → DDM = €5.10"
          />

          <Formula
            label="Relative Valuation"
            formula={`P/E Implied = Sector Median P/E × Company EPS
P/B Implied = Historical Avg P/B × Current Book Value
EV/EBITDA Implied = (Sector Median × EBITDA − Net Debt) / Shares`}
            example="Three independent cross-checks — if all agree, conviction is high."
          />

          <p style={{ marginTop: '0.5rem' }}>
            The <strong>Bull Case</strong> uses the highest model, <strong>Base Case</strong> averages all models,
            and <strong>Bear Case</strong> uses the lowest or applies conservative DCF assumptions.
          </p>
        </Section>

        <Section icon={Activity} title="Sensitivity Analysis" color={T.emerald}>
          <p>We identify the top variables that move earnings and model their impact chains:</p>

          <Formula
            label="NII Sensitivity (Banks)"
            formula={`NII Impact per 25bps = Loan Book × Repricing Gap % × 0.0025`}
            example="€60B loan book × 20% repricing gap × 0.0025 = €30M per 25bps rate change"
          />

          <Formula
            label="Oil Price Transmission Chain"
            formula={`Oil +10% → Inflation +0.3-0.5pp (passthrough 0.03-0.05)
Inflation +0.5pp → Central bank +25bps probability +30%
Rate +25bps → Bank NII uplift vs equity multiple compression (-1.5 to -2.5%)`}
          />

          <Formula
            label="Earnings Tornado"
            formula={`Top 5 variables ranked by EPS impact:
Variable | Bear (−1σ) | Bull (+1σ) | EPS Swing`}
            example="Displayed as a horizontal butterfly chart — widest bars = most sensitivity."
          />
        </Section>

        <Section icon={Shield} title="Risk Quantification" color={T.emerald}>
          <Formula
            label="Probability-Weighted Expected Return"
            formula={`E[Return] = Σ(scenario_probability × scenario_return)`}
            example="0.25×(+20%) + 0.50×(+8%) + 0.25×(−15%) = +5.25% expected"
          />

          <Formula
            label="Sharpe Ratio"
            formula={`Sharpe = (Expected Return − Risk-Free Rate) / Volatility
Volatility ≈ Beta × Market Vol (~15-18% for developed markets)`}
            example="Sharpe > 1.0 is good; > 1.5 is excellent. We compare vs sector benchmark."
          />

          <Formula
            label="Kelly Criterion (Position Sizing)"
            formula={`Kelly % = (Win_Prob × Avg_Win/Avg_Loss − Loss_Prob) / (Avg_Win/Avg_Loss)
Practitioners use quarter-Kelly to account for estimation error.`}
            example="Kelly = 30.6% → quarter-Kelly = 7.7% of portfolio. Conservative but mathematically optimal."
          />

          <Formula
            label="Maximum Drawdown"
            formula={`Max Drawdown = (Trough − Peak) / Peak × 100`}
            example="Peak €4.12, Trough €3.20 → Max Drawdown = −22.3% — this is what you must be willing to endure."
          />
        </Section>

        {/* ─── GEO ANALYSIS ──────────────────────────────────── */}
        <h2 style={{ color: T.amber, fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '2rem 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Globe2 size={16} /> Geopolitical Analysis
        </h2>

        <Section icon={Crosshair} title="How Geopolitical Analysis Works" color={T.amber} defaultOpen={true}>
          <p>Every geopolitical analysis follows an 8-step pipeline:</p>
          <ol style={{ paddingLeft: '1.25rem' }}>
            <li><strong>Situation Assessment</strong> — Map all actors (state and non-state), power dynamics (0-100), domestic politics, and triggering events.</li>
            <li><strong>Decision Tree Mapping</strong> — For each actor: realistic options, constraints, and if-then sequences.</li>
            <li><strong>Multi-Scenario Construction</strong> — 3-5 scenarios with probabilities summing to ~100%, each with impact ratings (1-10) across 6 dimensions.</li>
            <li><strong>Feasibility Assessment</strong> — Each action scored on military feasibility, economic capacity, political will, and alliance support. Rated from "Fully Sustainable" to "Not Feasible".</li>
            <li><strong>Advanced Frameworks</strong> — Game theory, Bayesian probability tracking, economic impact modeling, escalation dynamics, and political economy analysis.</li>
            <li><strong>Key Indicators</strong> — Observable signals that shift scenario probabilities. Tracked as Observed / Emerging / Not Yet.</li>
            <li><strong>Expert Synthesis</strong> — Consensus vs dissenting views from RAND, Brookings, CFR, IISS, regional analysts. Western vs regional perspective gaps.</li>
            <li><strong>Political Signals</strong> — Real quotes from key actors with platform, date, signal type, and market impact.</li>
          </ol>
        </Section>

        <Section icon={Brain} title="Game Theory" color={T.amber}>
          <p>We model the 2-3 most critical strategic decisions as formal games:</p>

          <Formula
            label="Payoff Matrix"
            formula={`                    Actor B: Cooperate    Actor B: Defect
Actor A: Cooperate   (+3, +3)             (−5, +5)
Actor A: Defect      (+5, −5)             (−2, −2)`}
            example="Payoffs scored −10 to +10 across strategic, economic, domestic, and reputational dimensions."
          />

          <div style={{ marginBottom: '0.75rem' }}>
            <p><strong>Game Types We Identify:</strong></p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
              <Badge color={T.crimson}>Prisoner's Dilemma</Badge>
              <Badge color={T.amber}>Chicken Game</Badge>
              <Badge color={T.emerald}>Assurance Game</Badge>
              <Badge color={T.violet}>Asymmetric</Badge>
            </div>
          </div>

          <p>
            <strong>Nash Equilibrium</strong> — The outcome where no actor can improve by unilaterally changing strategy.
            This is the "stable" scenario — the one that persists unless external shocks change the payoff structure.
          </p>
          <p>
            <strong>Commitment Problems</strong> — Public statements create <em>audience costs</em> (domestic punishment for backing down),
            making threats more credible. Secret channels reduce audience costs, enabling face-saving exits.
          </p>
        </Section>

        <Section icon={BarChart3} title="Bayesian Probability Updates" color={T.amber}>
          <p>Scenario probabilities are not static — they update with every new signal using Bayes' theorem:</p>

          <Formula
            label="Bayesian Update"
            formula={`P(Scenario | Signal) ∝ P(Signal | Scenario) × P(Scenario)

Likelihood Ratio approach:
  If signal is 3× more likely under Scenario A than B:
  New_P(A) ≈ Old_P(A) × 3 / (Old_P(A) × 3 + Old_P(B) × 1 + ...)
  Then normalize so all scenarios sum to 100%`}
            example="Iran rejects peace plan → rejection is 3× more likely if no ceasefire → Ceasefire drops from 30% to 22%."
          />

          <p>
            Every probability change is tracked in a <strong>probability history</strong> array with the date, signal, direction, and likelihood ratio.
            Displayed as a line chart showing how each scenario's probability evolves over time.
          </p>
        </Section>

        <Section icon={DollarSign} title="Economic Impact Modeling" color={T.amber}>
          <Formula
            label="Oil Shock Transmission"
            formula={`ΔOil% → ΔInflation = ΔOil% × passthrough coefficient
  US: 0.03 | Eurozone: 0.04 | Emerging Markets: 0.05-0.07

ΔOil% → ΔGDP = −0.15% per 10% sustained oil increase (IMF)`}
            example="Oil +50% ($75→$112) → EU inflation +2.0pp, GDP −0.75% over 4 quarters."
          />

          <Formula
            label="Trade Disruption"
            formula={`Impact = Affected Trade Volume × Disruption Probability × GDP Multiplier`}
            example="Hormuz closure: $5.5T/yr trade × 40% disruption × 0.8 multiplier = $1.76T risk-adjusted impact."
          />

          <Formula
            label="Phillips Curve"
            formula={`π = π_expected + α(Y − Y*) + supply_shock
  α ≈ 0.3-0.5 for developed economies
  supply_shock = oil/commodity price shock component`}
            example="Maps the inflation-unemployment trade-off for affected economies."
          />

          <div style={{ marginTop: '0.5rem' }}>
            <p><strong>Sanctions Impact — Historical Analogs:</strong></p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginTop: '0.5rem' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                  {['Country', 'Year', 'Type', 'GDP Impact'].map(h => (
                    <th key={h} style={{ padding: '0.4rem 0.6rem', textAlign: 'left', color: T.dim, fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Iran', '2012', 'Oil + financial', '−6.6%'],
                  ['Russia', '2022', 'Comprehensive', '−2.1%'],
                  ['Iran', '2018', 'Oil (US unilateral)', '−4.8%'],
                  ['Venezuela', '2019', 'Oil + financial', '−35%'],
                ].map(([c, y, t, g], i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
                    <td style={{ padding: '0.4rem 0.6rem', color: T.text }}>{c}</td>
                    <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{y}</td>
                    <td style={{ padding: '0.4rem 0.6rem' }}>{t}</td>
                    <td style={{ padding: '0.4rem 0.6rem', color: T.crimson, fontFamily: 'monospace', fontWeight: 700 }}>{g}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section icon={Flame} title="Escalation Dynamics" color={T.amber}>
          <p>We place every conflict on a 6-level escalation ladder (adapted from Herman Kahn):</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', margin: '0.75rem 0' }}>
            {[
              { level: 1, label: 'Diplomatic Tension', desc: 'Harsh words, ambassador recalls, UN votes', color: T.emerald },
              { level: 2, label: 'Economic Warfare', desc: 'Sanctions, trade restrictions, asset freezes', color: T.cyan },
              { level: 3, label: 'Proxy Conflict', desc: 'Armed group support, cyberattacks, covert ops', color: T.amber },
              { level: 4, label: 'Limited Military Strikes', desc: 'Targeted attacks on military assets only', color: '#f97316' },
              { level: 5, label: 'Strategic Strikes', desc: 'Infrastructure targeting, economic destruction', color: T.crimson },
              { level: 6, label: 'Total War', desc: 'Full mobilization, civilian targeting, WMD risk', color: '#dc2626' },
            ].map(l => (
              <div key={l.level} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.85rem', color: l.color, minWidth: '1.5rem' }}>{l.level}</span>
                <div>
                  <span style={{ color: T.text, fontWeight: 600, fontSize: '0.82rem' }}>{l.label}</span>
                  <span style={{ color: T.dim, fontSize: '0.75rem', marginLeft: '0.5rem' }}>{l.desc}</span>
                </div>
              </div>
            ))}
          </div>
          <p>For each conflict we identify: current level, what moves up or down, and which scenarios correspond to which levels.</p>

          <p style={{ marginTop: '0.75rem' }}><strong>Thucydides Trap</strong> — When a rising power threatens a ruling power (12 of 16 historical cases resulted in war). We assess: rate of power shift, alliance entanglement, domestic nationalism, and mitigating factors (nuclear deterrence, economic interdependence).</p>

          <p><strong>Security Dilemma</strong> — When one side's defensive preparations are perceived as offensive. We assess the offense-defense balance and spiral risk.</p>
        </Section>

        <Section icon={Users} title="Political Economy" color={T.amber}>
          <p>Understanding leaders' incentives is critical for prediction:</p>

          <Formula
            label="Selectorate Theory"
            formula={`Winning Coalition (W) = group whose support is essential
Selectorate (S) = broader pool from which W is drawn
W/S Ratio: Low → autocracy (private goods) | High → democracy (public goods)`}
            example="Small W → leaders can sustain unpopular wars longer. Large W → constrained by public opinion."
          />

          <Formula
            label="Rally-Around-the-Flag Effect"
            formula={`Approval boost: +5 to +15 percentage points (empirical average)
Duration: 2-6 months, then decay at ~1-2pp per month
Historical: Bush 9/11 +35pp, Falklands +11pp, Gulf War +18pp`}
          />

          <Formula
            label="Audience Costs"
            formula={`Public threats → domestic punishment for backing down
High audience costs (democracies) → harder to back down → more credible threats
Low audience costs (autocracies) → easier to back down → less credible`}
          />

          <Formula
            label="Economic Voting Model"
            formula={`Approval ≈ f(GDP growth, Inflation, Unemployment)
~3pp drop per 1pp inflation increase
~2pp drop per 1pp unemployment increase`}
            example="If war causes economic pain → approval drops → political pressure for resolution."
          />
        </Section>

        {/* ─── DATA SOURCES ──────────────────────────────────── */}
        <h2 style={{ color: T.cyan, fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '2rem 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Database size={16} /> Data Sources
        </h2>

        <Section icon={TrendingUp} title="Stock Analysis Sources" color={T.cyan}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {[
              ['Yahoo Finance', 'Real-time quotes, financials, ratios'],
              ['TradingView', 'Technical analysis consensus'],
              ['MacroTrends', 'Historical ratios over 5-10 years'],
              ['MarketBeat', 'Analyst ratings & price targets'],
              ['TipRanks', 'Smart score, insider trading'],
              ['Reuters / Bloomberg', 'Breaking news with verified URLs'],
              ['ECB / Federal Reserve', 'Rate decisions & monetary policy'],
              ['FRED (St. Louis Fed)', 'Yield curves, CPI, unemployment'],
            ].map(([name, desc], i) => (
              <div key={i} style={{ padding: '0.5rem 0.65rem', background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                <div style={{ color: T.text, fontSize: '0.8rem', fontWeight: 600 }}>{name}</div>
                <div style={{ color: T.dim, fontSize: '0.72rem' }}>{desc}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section icon={Globe2} title="Geopolitical Analysis Sources" color={T.cyan}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {[
              ['Glint Trade Terminal', 'Live breaking signals & market-moving headlines'],
              ['Reuters / Al Jazeera / BBC', 'Multi-perspective news coverage'],
              ['RAND Corporation', 'Defense & security assessments'],
              ['Brookings / CFR', 'Think tank policy analysis'],
              ['SIPRI', 'Military expenditure data'],
              ['ACLED', 'Conflict event data & fatality counts'],
              ['IMF / World Bank', 'GDP forecasts & trade data'],
              ['UN OCHA / ReliefWeb', 'Humanitarian crisis data'],
              ['EIA (Energy Info Admin)', 'Oil supply & demand data'],
              ['IISS / Chatham House', 'Strategic analysis (fallback)'],
            ].map(([name, desc], i) => (
              <div key={i} style={{ padding: '0.5rem 0.65rem', background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                <div style={{ color: T.text, fontSize: '0.8rem', fontWeight: 600 }}>{name}</div>
                <div style={{ color: T.dim, fontSize: '0.72rem' }}>{desc}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* ─── LIMITATIONS ───────────────────────────────────── */}
        <h2 style={{ color: T.crimson, fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '2rem 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={16} /> Limitations & Disclaimers
        </h2>

        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: '1.25rem' }}>
          <ul style={{ paddingLeft: '1.25rem', margin: 0, color: T.muted, fontSize: '0.85rem', lineHeight: 1.8 }}>
            <li><strong>Not financial advice.</strong> All analyses are for informational and educational purposes only. Always consult a qualified financial advisor before making investment decisions.</li>
            <li><strong>AI-generated analysis.</strong> Dashboards are produced by Claude (Anthropic) using web search results. Data may be approximate, delayed, or incomplete.</li>
            <li><strong>Scenario probabilities are estimates.</strong> They reflect analytical judgment informed by frameworks, not statistical certainty. All models are wrong — some are useful.</li>
            <li><strong>DCF and DDM valuations are simplified.</strong> They use single-stage growth models and estimated WACC. Professional equity research uses multi-stage models with more granular assumptions.</li>
            <li><strong>Historical analogs have limits.</strong> Sanctions impact, rally effects, and passthrough coefficients are drawn from past events. Every situation is unique.</li>
            <li><strong>Data freshness varies.</strong> Prices may be delayed. News may not reflect the last few hours. Check the analysis date on each dashboard.</li>
            <li><strong>Geopolitical prediction is inherently uncertain.</strong> Black swan events, intelligence gaps, and irrational actors can invalidate any framework.</li>
          </ul>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '2rem 0 1rem', color: T.dim, fontSize: '0.72rem' }}>
          <Link to="/help" style={{ color: T.cyan, textDecoration: 'none', fontWeight: 600 }}>
            Glossary
          </Link>
          {' · '}
          <Link to="/" style={{ color: T.cyan, textDecoration: 'none', fontWeight: 600 }}>
            Home
          </Link>
        </div>
      </div>
    </div>
  )
}
