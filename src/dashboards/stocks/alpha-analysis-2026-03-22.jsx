import StockDashboard from '../../components/StockDashboard'

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
  chartNote: 'Stock is ~31% below its 52-week high of €4.489, having pulled back from a Jan-Feb 2026 peak. The 200-day MA at €3.30 is a key support level.',
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
  { name: '5-Day MA',   value: 3.515, signal: 'SELL', current: 3.09 },
  { name: '20-Day MA',  value: 3.350, signal: 'BUY',  current: 3.09 },
  { name: '50-Day MA',  value: 3.436, signal: 'BUY',  current: 3.09 },
  { name: '200-Day MA', value: 3.301, signal: 'BUY',  current: 3.09 },
]

const technicals = {
  priceRange: [1.5, 4.8],
  maSignalSummary: '3 of 4 MAs signal Buy. Price above 50D & 200D MA — bullish medium-term structure intact despite near-term pullback.',
  oscillators: [
    { label: 'RSI (14-day)',      value: '55.7',  signal: 'NEUTRAL', note: 'Not overbought/oversold — healthy range' },
    { label: 'MACD',             value: '+0.021', signal: 'BUY',     note: 'Positive momentum cross signal' },
    { label: 'Stochastic (14,3)',value: '38.4',  signal: 'NEUTRAL', note: 'Mid-range, slight downside pressure' },
    { label: 'Williams %R',      value: '-61.2', signal: 'NEUTRAL', note: 'Approaching oversold territory' },
    { label: 'ADX (14)',         value: '22.1',  signal: 'NEUTRAL', note: 'Trend not strongly defined; consolidation phase' },
  ],
  supportLevels: [
    { level: 4.489, label: '52W High / Strong Resistance',    type: 'resistance' },
    { level: 3.515, label: 'Recent Range Top / Resistance',   type: 'resistance' },
    { level: 3.436, label: '50-Day MA / Resistance',          type: 'resistance' },
    { level: 3.301, label: '200-Day MA / Key Support',        type: 'neutral' },
    { level: 3.09,  label: 'Current Price',                   type: 'current' },
    { level: 2.85,  label: 'Prior Breakout Zone / Support',   type: 'support' },
    { level: 2.48,  label: 'October 2025 Base / Support',     type: 'support' },
    { level: 1.750, label: '52W Low / Major Support',         type: 'support' },
  ],
  priceNote: 'Current price at key near-term support (€3.09). A break below would expose the €2.85 zone. Recovery above €3.44 (50D MA) needed to resume uptrend.',
}

const fundamentalData = {
  valuation: [
    { label: 'P/E (TTM)',     value: 8.41,              bench: '8–10×',       note: 'European avg ~10×',     ok: true },
    { label: 'P/E (Forward)', value: 7.37,              bench: '7–9×',        note: 'Below sector',          ok: true },
    { label: 'P/B Ratio',     value: 0.79,              bench: '0.9–1.1×',    note: 'Below book — discount', ok: true },
    { label: 'PEG Ratio',     value: '0.60',            bench: '<1 = cheap',  note: 'Strong EPS growth',     ok: true },
    { label: 'Div. Yield',    value: '4.14%',           bench: '2–4% sector', note: 'Above average',         ok: true },
    { label: 'Payout Ratio',  value: '55%',             bench: '40–60%',      note: 'Sustainable',           ok: true },
  ],
  scorecard: [
    { label: 'Valuation',      score: 8, note: 'P/B 0.79x — below book' },
    { label: 'Profitability',  score: 7, note: 'RoTE 12.9% vs 14-15% peers' },
    { label: 'Capital Quality',score: 8, note: 'CET1 15.0% — robust' },
    { label: 'Asset Quality',  score: 7, note: 'NPE ~3.5%, declining trend' },
    { label: 'Dividend',       score: 8, note: '4.14% yield + buybacks' },
    { label: 'Growth Outlook', score: 8, note: 'EPS +11% guided 2026' },
  ],
}

const financials = [
  { year: 'FY2022', netProfit: 168, nii: 820,  fees: 380, roe: 3.1  },
  { year: 'FY2023', netProfit: 441, nii: 1420, fees: 430, roe: 7.2  },
  { year: 'FY2024', netProfit: 655, nii: 1680, fees: 490, roe: 9.1  },
  { year: 'FY2025', netProfit: 943, nii: 1650, fees: 582, roe: 10.5 },
]

const capitalMetrics = [
  { subject: 'CET1 Capital',  value: 75 },
  { subject: 'NPE Reduction', value: 80 },
  { subject: 'Cost Control',  value: 70 },
  { subject: 'Fee Growth',    value: 85 },
  { subject: 'RoTE',          value: 60 },
  { subject: 'Dividend Yield',value: 65 },
]

const peerComparison = [
  { bank: 'Alpha Bank', pe: 8.41, pb: 0.79, rote: 12.9, cet1: 15.0, npe: 3.5, target: 4.53,  divYield: 4.14 },
  { bank: 'Eurobank',   pe: 7.90, pb: 0.92, rote: 15.2, cet1: 17.5, npe: 3.1, target: 4.35,  divYield: 3.80 },
  { bank: 'Piraeus',    pe: 8.10, pb: 0.70, rote: 13.8, cet1: 14.2, npe: 4.1, target: 8.95,  divYield: 3.50 },
  { bank: 'NBG',        pe: 9.50, pb: 0.88, rote: 14.5, cet1: 18.2, npe: 2.9, target: 15.95, divYield: 5.20 },
]

const radarPeer = [
  { subject: 'Capital',       ALPHA: 75, EUROB: 87, PIR: 71, NBG: 91 },
  { subject: 'Asset Quality', ALPHA: 82, EUROB: 86, PIR: 76, NBG: 88 },
  { subject: 'Profitability', ALPHA: 70, EUROB: 84, PIR: 76, NBG: 80 },
  { subject: 'Valuation',     ALPHA: 88, EUROB: 80, PIR: 86, NBG: 72 },
  { subject: 'Dividend',      ALPHA: 77, EUROB: 72, PIR: 66, NBG: 90 },
  { subject: 'EPS Growth',    ALPHA: 91, EUROB: 80, PIR: 78, NBG: 73 },
]

const analystTargets = [
  { firm: 'Goldman Sachs', target: 5.10, rating: 'Buy',     upside: 65 },
  { firm: 'Deutsche Bank', target: 4.45, rating: 'Buy',     upside: 44 },
  { firm: 'UBS',           target: 4.30, rating: 'Buy',     upside: 39 },
  { firm: 'Citi',          target: 4.10, rating: 'Buy',     upside: 33 },
  { firm: 'JPMorgan',      target: 3.90, rating: 'Neutral', upside: 26 },
  { firm: 'Barclays',      target: 3.12, rating: 'Hold',    upside: 1  },
]

const eventImpacts = [
  { event: 'ECB Rates Hold (Mar 2026)',            level: 'Medium', direction: 'Negative', rationale: 'Rate hiking cycle over; NII declined 2% YoY. Fee growth (+19%) partially offsets but NIM compression continues.' },
  { event: 'Greek GDP Growth ~2% (2026)',          level: 'Medium', direction: 'Positive', rationale: 'Greece outperforming Eurozone; investment-grade credit environment supports loan growth and asset quality.' },
  { event: 'AstroBank Acquisition (Cyprus)',       level: 'Medium', direction: 'Positive', rationale: 'Expands Cypriot franchise; ~€200M+ annual revenue addition. CET1 temporarily lowered by 130 bps but growth accretive.' },
  { event: 'Ukraine War / SE Europe Risk',         level: 'Low',    direction: 'Negative', rationale: 'Indirect spillovers via Romania (~10% exposure) and energy prices. ECB stress test shows 300 bps CET1 buffer is adequate.' },
  { event: 'UniCredit Partnership Expansion',      level: 'Low',    direction: 'Positive', rationale: 'Strategic product & geographic broadening; boosts wholesale banking credibility with institutional investors.' },
  { event: 'Fitch/S&P Upgrade Cycle (Greek Banks)',level: 'High',   direction: 'Positive', rationale: 'Sector-wide credit upgrades in 2025 reduce cost of funding, expand investor base, and re-rate P/B multiples upward.' },
]

const keyMetrics = [
  { label: 'Net Profit FY2025',    value: '€943.3M',  change: '+44% YoY',             pos: true  },
  { label: 'CET1 Capital Ratio',   value: '15.0%',    change: 'Well above 12% min',   pos: true  },
  { label: 'NPE Ratio',            value: '~3.5%',    change: 'Down from 7.8% (2022)', pos: true  },
  { label: 'Cost-to-Income',       value: '39.5%',    change: 'Target: ~37%',          pos: true  },
  { label: 'RoTE (Normalised)',     value: '12.9%',    change: 'Vs 14-15% peers',       pos: null  },
  { label: 'Net Interest Income',  value: '€1.65B',   change: '-2% YoY',               pos: false },
  { label: 'Fee Income',           value: '€582M',    change: '+19% YoY',              pos: true  },
  { label: 'Total Distribution',   value: '€519M',    change: '55% payout ratio',      pos: true  },
]

const newsItems = [
  { date: '27 Feb 2026', source: 'Alpha Bank IR',       headline: 'Alpha Bank reports €943.3M net profit for FY2025, up 44% — announces €519M shareholder distribution', sentiment: 'positive', url: 'https://www.alpha.gr/en/investor-relations/financial-results' },
  { date: '19 Mar 2026', source: 'Deutsche Bank Research', headline: 'Deutsche Bank raises Greek bank targets; Alpha Bank to €4.45 (Buy) — second top pick after Eurobank', sentiment: 'positive', url: null },
  { date: '13 Mar 2026', source: 'Reuters',             headline: 'Greek banks draw strong institutional interest entering 2026 — Eurozone re-rating underway',             sentiment: 'positive', url: null },
  { date: '19 Mar 2026', source: 'ECB / Bloomberg',     headline: 'ECB holds rates unchanged; NII pressure on Greek banks set to persist through H1 2026',                 sentiment: 'neutral',  url: 'https://www.ecb.europa.eu/press/pr/date/2026/html/index.en.html' },
  { date: '10 Mar 2026', source: 'Kathimerini',         headline: 'Alpha Bank HQ expansion: acquires 38 Stadiou Street building for unified financial hub in Athens',       sentiment: 'neutral',  url: null },
]

/* ─── GEOPOLITICAL CROSS-REFERENCE ──────────────────────────── */
const geoOverlay = {
  analysis: 'US–Iran War: Operation Epic Fury',
  analysisPath: '/geo/us-iran-war',
  date: '2026-03-22',
  relevance: 'HIGH — Oil price shock ($108–126/bbl) feeds directly into Greek inflation, ECB rate path, and Alpha Bank NII. SE Europe risk premium affects funding costs. Romania exposure (~10% of loans) faces Balkans spillover risk.',
  keyChannels: [
    { channel: 'Oil → Inflation → ECB Rate Path',    detail: 'Brent at $108+ sustains Greek inflation. ECB holds rates. Alpha Bank NII compression continues longer than base case. Probability-weighted: −€50–120M NII impact.',                                                        severity: 'High' },
    { channel: 'Global Risk-Off → Sovereign Spreads',detail: 'War-driven risk aversion widens Greek sovereign spreads (~+40bps current). Raises Alpha Bank wholesale funding costs and pressures P/B multiple re-rating timeline.',                                                     severity: 'Medium' },
    { channel: 'SE Europe Spillover → Romania',      detail: 'Romania (~10% of Alpha loan book) exposed to Balkans instability, energy price pass-through, and FX pressure under Escalation scenarios.',                                                                                severity: 'Medium' },
    { channel: 'Global Recession Risk (Escalation)', detail: 'Under Regional Conflagration (15% prob), oil $150+ triggers Eurozone recession. Greek GDP growth reverses, NPEs re-accelerate, all Greek banks severely impacted.',                                                     severity: 'Critical (tail)' },
  ],
  scenarios: [
    { name: 'Prolonged Stalemate',    probability: 35, color: '#f59e0b', priceImpact: '−8% to −15%',  direction: 'Negative',          rationale: 'Oil $90–110 sustains ECB hold. NII compressed. Greek spreads elevated. Modest drag on re-rating.' },
    { name: 'Negotiated Ceasefire',   probability: 25, color: '#10b981', priceImpact: '+12% to +20%', direction: 'Positive',          rationale: 'Oil retreats to $75–85. ECB resumes cuts. Risk-on boosts peripheral EU banks. Most favorable scenario for ALPHA.' },
    { name: 'Regime Collapse',        probability: 20, color: '#8b5cf6', priceImpact: '−15% to −25%', direction: 'Negative',          rationale: 'Iran power vacuum → regional chaos → oil volatile → global uncertainty. Greek risk premium rises sharply.' },
    { name: 'Regional Conflagration', probability: 15, color: '#ef4444', priceImpact: '−30% to −50%', direction: 'Strongly Negative', rationale: 'Oil $150+. Eurozone recession. Greek GDP contracts. NPEs re-accelerate. SE Europe destabilized. Severe impact.' },
    { name: 'Nuclear Breakout',       probability: 5,  color: '#dc2626', priceImpact: '−60%+',        direction: 'Catastrophic',      rationale: 'Global market collapse. All financial assets decimated. Tail risk only but non-zero.' },
  ],
  probabilityWeightedImpact: '−5% to −10% net (35% stalemate drag offsets 25% ceasefire upside; tail scenarios pull negative)',
  keyPoliticalSignals: [
    {
      actor: 'Donald Trump',
      role: 'US President',
      platform: 'Truth Social',
      date: '2026-03-20',
      quote: 'The strikes on Iran are going PERFECTLY. We will be winding this down very soon.',
      signalType: 'de-escalatory',
      stockImpact: 'If genuine: oil −$15/bbl, ECB cuts resume, ALPHA could gap +10–15%. If posturing: no re-rating.',
    },
    {
      actor: 'Marco Rubio',
      role: 'US Secretary of State',
      platform: 'UN Security Council',
      date: '2026-03-17',
      quote: 'The United States is open to a diplomatic resolution. The door is not closed.',
      signalType: 'diplomatic',
      stockImpact: 'First genuine US off-ramp signal. Raises Ceasefire prob — most positive scenario for Greek banks.',
    },
    {
      actor: 'Speaker Mike Johnson',
      role: 'US Speaker of the House',
      platform: 'House Floor',
      date: '2026-03-21',
      quote: 'This chamber will not write a blank check for a war that was not authorized. We will vote.',
      signalType: 'de-escalatory',
      stockImpact: 'Congressional resistance = structural de-escalation pressure. Failed vote → ceasefire forced. Very positive for ALPHA if it materialises.',
    },
    {
      actor: 'Acting Iranian Leadership (IRGC)',
      role: 'De facto Iranian executive',
      platform: 'Telegram',
      date: '2026-03-15',
      quote: 'The resistance front is unified. Our proxies operate with full authority.',
      signalType: 'escalatory',
      stockImpact: 'Proxy escalation confirmed → oil stays elevated → ECB hold persists → ALPHA NII compression continues. Negative near-term.',
    },
  ],
}

const riskNotices = [
  {
    type: 'Geopolitical',
    icon: '🌍',
    event: 'Russia-Ukraine War — Year 4 (Ongoing)',
    description: 'Conflict continues with Romania (~10% of Alpha loan book) in spillover zone. SE European energy prices and FX pressure persist.',
    impact: 'Medium',
    impactColor: '#f59e0b',
    suggestion: 'Run a "Russia-Ukraine War" geopolitical analysis for full scenario modeling of SE European economic spillover and Alpha Bank Romania exposure.',
  },
  {
    type: 'Regulatory',
    icon: '⚖️',
    event: 'Basel IV / EU CRR3 Capital Requirements (Phased 2025–2030)',
    description: 'New capital output floors (Basel IV) phase in from Jan 2025. Could require Greek banks to hold 10–15% more RWA capital by 2030 depending on model outcomes.',
    impact: 'Medium',
    impactColor: '#f59e0b',
    suggestion: "Monitor Alpha Bank's disclosed Basel IV impact (est. −80 to −130bps CET1) against current 15.0% ratio. Run a \"EU Banking Regulation 2025–2030\" analysis for sector-wide context.",
  },
]

/* ─── VERDICT ────────────────────────────────────────────────── */
const verdict = {
  stance: "CAUTIOUS BUY",
  stanceColor: "#f59e0b",
  stanceBg: "rgba(245,158,11,0.1)",
  timing: "Wait 24–48 hours, then buy on dip",
  timingDetail: "President Trump is expected to comment on the US-Iran war trajectory within 24 hours. Markets are pricing in mixed signals — if he signals ceasefire talks, ALPHA could gap up 8–12% on open. If he escalates rhetoric, oil spikes and peripheral EU banks sell off — offering a better entry near €2.85 support. In either case, do not chase today's price. Set a limit order at €2.95–3.05.",
  entryZone: { low: 2.85, high: 3.10, ideal: 2.95 },
  stopLoss:  { price: 2.75, pct: -11.0, rationale: 'Break below €2.75 invalidates bullish structure; below Oct 2025 base' },
  targets: [
    { price: 3.51, label: 'Target 1',  horizon: '1–3 months',   upside: 13.6, trigger: 'Recovery above 50D MA + war de-escalation signal' },
    { price: 4.45, label: 'Target 2',  horizon: '6–12 months',  upside: 44.0, trigger: 'RoTE convergence to 14%+ + Greek sovereign re-rating continuation' },
    { price: 5.10, label: 'Bull case', horizon: '12–18 months', upside: 65.0, trigger: 'Goldman Sachs target; ECB cuts resume + full ceasefire' },
  ],
  riskReward: '3.5:1',
  conviction: "Medium-High",
  keyConditions: [
    { label: 'Brent crude < €105/bbl sustained',                 status: 'pending', impact: 'Positive — relieves ECB hold and NII compression pressure' },
    { label: 'No Trump escalation statement (24–48h)',           status: 'pending', impact: 'Critical timing gate — watch before entering any position' },
    { label: 'ALPHA holds above €2.85 support',                 status: 'met',     impact: 'Bullish structure intact — medium-term uptrend unbroken' },
    { label: 'Greek sovereign spread remains < 100bps',         status: 'met',     impact: 'Favorable funding environment; institutional access maintained' },
    { label: 'Congressional vote on $200B war funding',         status: 'pending', impact: 'Defeat triggers ceasefire scenario (very positive); passage = stalemate' },
  ],
  bearCase: 'If oil breaks above $130 (Regional Conflagration scenario, 15%), Greek banks could correct 20–30%. Stop-loss at €2.75 is essential. Probability: 15%.',
  disclaimer: 'Analytical data only. Not financial advice. Consult a qualified advisor.',
}

/* ─── ANALYSIS GAPS ──────────────────────────────────────────── */
const analysisGaps = [
  {
    topic: 'Currency Risk: EUR/USD & RON/EUR',
    description: 'Alpha Bank has ~10% Romania exposure. RON/EUR volatility and EUR/USD impact on institutional flows are unanalyzed.',
    issueTitle: 'Extend Alpha Bank (ALPHA.AT) analysis: Add EUR/USD and RON/EUR currency risk analysis for Romania loan book',
  },
  {
    topic: 'Options Market: Put/Call Ratio & Implied Volatility',
    description: 'Derivatives market sentiment and IV surface for ALPHA.AT / ALBKY not covered. Options data often leads price moves.',
    issueTitle: 'Extend Alpha Bank (ALPHA.AT) analysis: Add options market analysis — put/call ratio, implied volatility, open interest',
  },
  {
    topic: 'Insider Ownership Changes (Q4 2025 – Q1 2026)',
    description: 'Institutional and insider buying/selling patterns since the Jan-Feb peak not analyzed. UniCredit stake changes pending.',
    issueTitle: 'Extend Alpha Bank (ALPHA.AT) analysis: Add insider and institutional ownership changes Q4 2025 - Q1 2026',
  },
  {
    topic: 'Eurobank vs Alpha Bank: Full Head-to-Head',
    description: 'Deutsche Bank ranks Eurobank first, Alpha second. A dedicated side-by-side deep dive would sharpen positioning.',
    issueTitle: 'Extend Alpha Bank analysis: Full head-to-head comparison of Alpha Bank vs Eurobank — strategy, financials, valuation',
  },
  {
    topic: 'ECB 2026 Stress Test Scenario Modeling',
    description: 'How Alpha Bank performs under ECB adverse scenario (e.g., GDP −3%, NPE ratio spike) is not modeled.',
    issueTitle: 'Extend Alpha Bank (ALPHA.AT) analysis: Model ECB 2026 stress test scenarios — adverse case CET1 and NPE impact',
  },
  {
    topic: 'Greek Real Estate & Mortgage Book Exposure',
    description: "Alpha's domestic mortgage portfolio risk under rising rates + geopolitical scenario not assessed.",
    issueTitle: 'Extend Alpha Bank analysis: Analyze Greek residential real estate market and Alpha Bank mortgage book risk',
  },
]

/* ─── EXPORT ─────────────────────────────────────────────────── */
export default function AlphaBankAnalysis() {
  return (
    <StockDashboard
      stock={stock}
      priceHistory={priceHistory}
      maData={maData}
      technicals={technicals}
      fundamentalData={fundamentalData}
      financials={financials}
      capitalMetrics={capitalMetrics}
      peerComparison={peerComparison}
      radarPeer={radarPeer}
      analystTargets={analystTargets}
      eventImpacts={eventImpacts}
      keyMetrics={keyMetrics}
      newsItems={newsItems}
      geoOverlay={geoOverlay}
      riskNotices={riskNotices}
      verdict={verdict}
      analysisGaps={analysisGaps}
      dashboardFile="src/dashboards/stocks/alpha-analysis-2026-03-22.jsx"
    />
  )
}
