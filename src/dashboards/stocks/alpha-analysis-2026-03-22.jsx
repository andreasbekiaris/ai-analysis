import StockDashboard from '../../components/StockDashboard'

/* ─── DATA ───────────────────────────────────────────────────── */
const stock = {
  name: 'Alpha Bank',
  ticker: 'ALPHA.AT',
  adr: 'ALBKY',
  exchange: 'Athens Stock Exchange',
  date: '2026-03-25',
  price: 3.211,
  change: +0.121,
  changePct: +3.91,
  open: 2.95,
  high52w: 4.489,
  low52w: 1.750,
  marketCap: '€7.29B',
  pe: 7.72,
  peForward: 6.85,
  eps: 0.416,
  bookValue: 3.90,
  pbRatio: 0.82,
  dividendYield: 4.05,
  dividendPerShare: 0.13,
  payoutRatio: 55,
  beta: 0.81,
  sharesOut: '2.27B',
  sector: 'Banking — Greece',
  overallSignal: 'BUY',
  analystConsensus: 'Buy',
  analystCount: 13,
  avgTarget: 4.51,
  highTarget: 5.50,
  lowTarget: 3.12,
  chartNote: 'Stock bounced +3.9% on March 23 from €3.09 to €3.211, recovering off support. Still ~28% below 52-week high of €4.489. March 25 is a Greek holiday (market closed). Brent crude dropped 5% to $99/bbl on Trump–Iran peace talk headlines — if sustained, strongly bullish for Greek banks.',
}

const priceHistory = [
  { date: 'Sep-25', price: 2.15 },
  { date: 'Oct-25', price: 2.48 },
  { date: 'Nov-25', price: 2.85 },
  { date: 'Dec-25', price: 3.12 },
  { date: 'Jan-26', price: 3.75 },
  { date: 'Feb-26', price: 4.10 },
  { date: 'Early Mar', price: 3.51 },
  { date: 'Mar-22', price: 3.09 },
  { date: 'Mar-23', price: 3.211 },
]

const maData = [
  { name: '5-Day MA',   value: 3.12, signal: 'BUY',  current: 3.211 },
  { name: '20-Day MA',  value: 3.32, signal: 'SELL', current: 3.211 },
  { name: '50-Day MA',  value: 3.44, signal: 'SELL', current: 3.211 },
  { name: '200-Day MA', value: 3.30, signal: 'SELL', current: 3.211 },
]

const technicals = {
  priceRange: [1.5, 4.8],
  maSignalSummary: '1 of 4 MAs signal Buy (5D). Price below 20D, 50D, and 200D MAs — near-term bearish, but bounce off €2.95 intraday low shows demand. A close above €3.30 (200D MA) would flip the medium-term signal.',
  oscillators: [
    { label: 'RSI (14-day)',      value: '42.3',  signal: 'NEUTRAL', note: 'Approaching oversold — room for bounce' },
    { label: 'MACD',             value: '-0.035', signal: 'SELL',    note: 'Below signal line; bearish momentum but narrowing' },
    { label: 'Stochastic (14,3)',value: '28.6',  signal: 'BUY',     note: 'Entering oversold territory — buy signal forming' },
    { label: 'Williams %R',      value: '-72.8', signal: 'BUY',     note: 'Oversold — reversal signal emerging' },
    { label: 'ADX (14)',         value: '26.5',  signal: 'NEUTRAL', note: 'Moderate trend strength; selling pressure weakening' },
  ],
  supportLevels: [
    { level: 4.489, label: '52W High / Strong Resistance',    type: 'resistance' },
    { level: 3.57,  label: 'Buyback Avg Price / Resistance',  type: 'resistance' },
    { level: 3.44,  label: '50-Day MA / Resistance',          type: 'resistance' },
    { level: 3.30,  label: '200-Day MA / Key Resistance',     type: 'resistance' },
    { level: 3.211, label: 'Current Price (Mar 23 close)',    type: 'current' },
    { level: 2.95,  label: 'Intraday Low / Immediate Support',type: 'support' },
    { level: 2.85,  label: 'Prior Breakout Zone / Support',   type: 'support' },
    { level: 2.48,  label: 'October 2025 Base / Support',     type: 'support' },
    { level: 1.750, label: '52W Low / Major Support',         type: 'support' },
  ],
  priceNote: 'Price bounced strongly off €2.95 intraday low on Mar 23, closing at €3.211 (+3.9%). The bounce aligns with Trump–Iran peace talk headlines and Brent crude dropping below $100. A sustained close above €3.30 (200D MA) needed to confirm trend reversal. The €2.95 level is now critical near-term support.',
}

const fundamentalData = {
  valuation: [
    { label: 'P/E (TTM)',     value: 7.72,              bench: '8–10×',       note: 'Below European avg ~10×', ok: true },
    { label: 'P/E (Forward)', value: 6.85,              bench: '7–9×',        note: 'Cheap vs sector',         ok: true },
    { label: 'P/B Ratio',     value: 0.82,              bench: '0.9–1.1×',    note: 'Below book — discount',   ok: true },
    { label: 'PEG Ratio',     value: '0.55',            bench: '<1 = cheap',  note: 'Strong EPS growth path',  ok: true },
    { label: 'Div. Yield',    value: '4.05%',           bench: '2–4% sector', note: 'Above average',           ok: true },
    { label: 'Payout Ratio',  value: '55%',             bench: '40–60%',      note: 'Sustainable + buybacks',  ok: true },
  ],
  scorecard: [
    { label: 'Valuation',      score: 9, note: 'P/B 0.82x — deep below book; P/E 7.7x vs sector 10x' },
    { label: 'Profitability',  score: 7, note: 'RoTE 12.9% vs 14-15% peers; improving trajectory' },
    { label: 'Capital Quality',score: 8, note: 'CET1 15.0% — robust; absorbs AstroBank -130bps impact' },
    { label: 'Asset Quality',  score: 8, note: 'NPE ~3.0%, declining from 3.5%; sector-wide improvement' },
    { label: 'Dividend',       score: 8, note: '4.05% yield + active buyback (3.6M shares Mar 2-6)' },
    { label: 'Growth Outlook', score: 8, note: 'NII >€1.7B guided for 2026; fee income → €600M target' },
  ],
}

const financials = [
  { year: 'FY2022', netProfit: 168,  nii: 820,  fees: 380, roe: 3.1  },
  { year: 'FY2023', netProfit: 441,  nii: 1420, fees: 430, roe: 7.2  },
  { year: 'FY2024', netProfit: 655,  nii: 1680, fees: 490, roe: 9.1  },
  { year: 'FY2025', netProfit: 943,  nii: 1653, fees: 582, roe: 10.5 },
  { year: 'FY2026E', netProfit: 1050, nii: 1720, fees: 600, roe: 12.0 },
]

const capitalMetrics = [
  { subject: 'CET1 Capital',  value: 75 },
  { subject: 'NPE Reduction', value: 85 },
  { subject: 'Cost Control',  value: 70 },
  { subject: 'Fee Growth',    value: 88 },
  { subject: 'RoTE',          value: 62 },
  { subject: 'Dividend Yield',value: 68 },
]

const peerComparison = [
  { bank: 'Alpha Bank', pe: 7.72, pb: 0.82, rote: 12.9, cet1: 15.0, npe: 3.0, target: 4.51, divYield: 4.05 },
  { bank: 'Eurobank',   pe: 7.90, pb: 0.92, rote: 15.2, cet1: 17.5, npe: 3.1, target: 4.35, divYield: 3.80 },
  { bank: 'Piraeus',    pe: 8.10, pb: 0.70, rote: 13.8, cet1: 14.2, npe: 4.1, target: 8.95, divYield: 3.50 },
  { bank: 'NBG',        pe: 9.50, pb: 0.88, rote: 14.5, cet1: 18.2, npe: 2.9, target: 15.95, divYield: 5.20 },
]

const radarPeer = [
  { subject: 'Capital',       ALPHA: 75, EUROB: 87, PIR: 71, NBG: 91 },
  { subject: 'Asset Quality', ALPHA: 85, EUROB: 86, PIR: 76, NBG: 88 },
  { subject: 'Profitability', ALPHA: 70, EUROB: 84, PIR: 76, NBG: 80 },
  { subject: 'Valuation',     ALPHA: 90, EUROB: 80, PIR: 86, NBG: 72 },
  { subject: 'Dividend',      ALPHA: 77, EUROB: 72, PIR: 66, NBG: 90 },
  { subject: 'EPS Growth',    ALPHA: 91, EUROB: 80, PIR: 78, NBG: 73 },
]

const analystTargets = [
  { firm: 'Goldman Sachs', target: 5.10, rating: 'Buy',     upside: 59 },
  { firm: 'Deutsche Bank', target: 4.45, rating: 'Buy',     upside: 39 },
  { firm: 'UBS',           target: 4.30, rating: 'Buy',     upside: 34 },
  { firm: 'Citi',          target: 4.10, rating: 'Buy',     upside: 28 },
  { firm: 'JPMorgan',      target: 3.90, rating: 'Neutral', upside: 21 },
  { firm: 'Barclays',      target: 3.12, rating: 'Hold',    upside: -3 },
]

const eventImpacts = [
  { event: 'Trump 15-Point Iran Peace Plan (Mar 24-25)',    level: 'Critical', direction: 'Positive', rationale: 'Brent dropped 5% to $99/bbl on reports. If talks progress: oil normalises, ECB resumes cuts, NII compression reverses, Greek bank re-rating accelerates. Single most impactful catalyst.' },
  { event: 'ECB Holds Rates at 2.15% (Mar 19)',            level: 'High',     direction: 'Mixed',    rationale: 'Rates held due to war-driven inflation (2.6% forecast). NII floor maintained but rate cut timeline pushed back. If Iran de-escalates, ECB cuts resume H2 2026.' },
  { event: 'UniCredit Stake → 29.8% Direct (Jan 2026)',    level: 'High',     direction: 'Positive', rationale: 'Strategic anchor investor. Instruments position up to 32.1%. Boosts wholesale banking partnership, institutional credibility, and M&A optionality.' },
  { event: 'AstroBank Integration (Ongoing 2026)',         level: 'Medium',   direction: 'Positive', rationale: 'Q4 NII +3% QoQ driven by AstroBank. Deposits +€2.2B from acquisition. Third-largest bank in Cyprus. Altius insurance deal pending (end-2026).' },
  { event: 'Share Buyback Active (Mar 2-6: 3.6M shares)',  level: 'Medium',   direction: 'Positive', rationale: 'Management buying at avg €3.57 — signals confidence. Part of €519M total distribution (55% payout). Accretive to EPS and P/B.' },
  { event: 'Greek GDP Growth 2.2% (2026 EC forecast)',     level: 'Medium',   direction: 'Positive', rationale: 'Greece outperforming Eurozone avg (0.9%). Investment-grade; EU recovery funds driving loan demand. Supportive credit environment.' },
  { event: 'Athens Exchange -2.07% (Mar 24)',              level: 'Medium',   direction: 'Negative', rationale: 'War-driven risk-off. General Index at 2,058. But oil drop on Mar 25 (market closed - holiday) should provide relief on Mar 26 reopen.' },
  { event: 'Basel IV / EU CRR3 Phase-In (2025-2030)',     level: 'Medium',   direction: 'Negative', rationale: 'New capital output floors could require 10-15% more RWA capital by 2030. Est. impact: -80 to -130bps CET1. Current 15.0% buffer adequate.' },
  { event: 'Fitch/S&P Upgrade Cycle (Greek Banks)',       level: 'High',     direction: 'Positive', rationale: 'Sector-wide credit upgrades reduce funding costs, expand investor base, and re-rate P/B multiples. NPEs below 3% — structural improvement.' },
]

const keyMetrics = [
  { label: 'Net Profit FY2025',      value: '€943.3M',  change: '+44% YoY',               pos: true  },
  { label: 'CET1 Capital Ratio',     value: '15.0%',    change: 'Well above 12% min',     pos: true  },
  { label: 'NPE Ratio',              value: '~3.0%',    change: 'Down from 3.5% (mid-25)', pos: true  },
  { label: 'Cost-to-Income',         value: '39.5%',    change: 'Target: ~37%',            pos: true  },
  { label: 'RoTE (Normalised)',       value: '12.9%',    change: 'Vs 14-15% peers',         pos: null  },
  { label: 'Net Interest Income',    value: '€1.65B',   change: '2026 guide: >€1.7B',     pos: true  },
  { label: 'Fee Income',             value: '€582M',    change: '+19% YoY; 2026E: €600M', pos: true  },
  { label: 'Total Distribution',     value: '€519M',    change: '55% payout + buyback',    pos: true  },
  { label: 'UniCredit Stake',        value: '29.8%',    change: 'Up to 32.1% w/ instruments', pos: true },
  { label: 'AstroBank Deposits',     value: '+€2.2B',   change: 'Integration through 2026', pos: true },
]

const newsItems = [
  {
    headline: "Trump sends 15-point peace plan to Iran; oil drops 5% to $99/bbl",
    source: "CNBC",
    date: "2026-03-25",
    url: "https://www.cnbc.com/2026/03/25/oil-price-wti-brent-gas-lng-trump-iran-talks-hormuz.html",
    sentiment: "positive",
  },
  {
    headline: "Iran suspects Trump push to end war with peace talks is a trick",
    source: "Axios",
    date: "2026-03-25",
    url: "https://www.axios.com/2026/03/25/iran-war-trump-peace-talks-tehran-suspicious",
    sentiment: "neutral",
  },
  {
    headline: "ECB holds rates, predicts 2.6% inflation for 2026 amid Middle East war",
    source: "Central Banking",
    date: "2026-03-19",
    url: "https://www.centralbanking.com/central-banks/monetary-policy/monetary-policy-decisions/7975422/ecb-holds-rates-predicts-26-inflation-for-2026",
    sentiment: "neutral",
  },
  {
    headline: "Alpha Bank posts higher 2025 profit on strong fee income, loan expansion",
    source: "Reuters / TradingView",
    date: "2026-02-27",
    url: "https://www.tradingview.com/news/reuters.com,2026:newsml_L1N3ZN083:0-alpha-bank-posts-higher-2025-profit-on-strong-fee-income-loan-expansion/",
    sentiment: "positive",
  },
  {
    headline: "Alpha Bank shares rated 'buy' as analysts cite attractive returns",
    source: "Cyprus Mail",
    date: "2026-03-11",
    url: "https://cyprus-mail.com/2026/03/11/alpha-bank-shares-rated-buy-as-analysts-cite-attractive-returns",
    sentiment: "positive",
  },
  {
    headline: "Goldman Sachs meets Alpha Bank management in Athens; maintains Buy, €5.10 target",
    source: "Goldman Sachs / Cyprus Mail",
    date: "2026-03-10",
    url: "https://cyprus-mail.com/2026/03/11/alpha-bank-shares-rated-buy-as-analysts-cite-attractive-returns",
    sentiment: "positive",
  },
  {
    headline: "UniCredit converts Alpha Bank stake to direct 29.8% holding; instruments up to 32.1%",
    source: "Bloomberg",
    date: "2026-01-05",
    url: "https://www.bloomberg.com/news/articles/2026-01-05/unicredit-converts-alpha-bank-stake-to-direct-holding-of-29-8",
    sentiment: "positive",
  },
  {
    headline: "Alpha Bank income boosted by AstroBank acquisition in Cyprus",
    source: "Cyprus Mail",
    date: "2026-02-27",
    url: "https://cyprus-mail.com/2026/02/27/alpha-bank-income-boosted-by-astrobank-acquisition-in-cyprus",
    sentiment: "positive",
  },
  {
    headline: "Athens Stock Exchange falls 2.07% amid war fears; General Index at 2,058",
    source: "Athens Times",
    date: "2026-03-24",
    url: "https://athens-times.com/athens-stock-exchange-general-index-plunges-over-2-after-yesterdays-gains/",
    sentiment: "negative",
  },
  {
    headline: "From Grexit to Grecovery: ECB blog highlights Greece's structural transformation",
    source: "ECB",
    date: "2026-03-21",
    url: "https://www.ecb.europa.eu/press/blog/date/2026/html/ecb.blog20260321~0df0ef78e7.en.html",
    sentiment: "positive",
  },
]

/* ─── GEOPOLITICAL CROSS-REFERENCE ──────────────────────────── */
const geoOverlay = {
  analysis: 'US–Iran War: Operation Epic Fury',
  analysisPath: '/geo/us-iran-war',
  date: '2026-03-25',
  relevance: 'CRITICAL — Trump\'s 15-point peace plan sent to Iran (Mar 24-25) dropped Brent 5% to $99/bbl. If talks progress: oil normalises to $75-85, ECB resumes cuts, Alpha Bank NII outlook improves, P/B re-rates. If talks collapse: oil rebounds $110+, ECB hold extends, NII compressed, risk-off resumes. This is the single biggest near-term catalyst for ALPHA.',
  keyChannels: [
    { channel: 'Oil → Inflation → ECB Rate Path',     detail: 'Brent dropped to $99/bbl on Mar 25 from $104.49 on Mar 24. If peace talks deliver: oil to $75-85 within weeks, ECB resumes cuts H2 2026, NII outlook upgrades from €1.7B to €1.75B+. If talks fail: oil re-spikes $110+, ECB hold extends through 2026.', severity: 'Critical' },
    { channel: 'Global Risk Sentiment → Sovereign Spreads', detail: 'Athens General Index -2.07% on Mar 24 (risk-off). Oil dropping below $100 on Mar 25 (holiday) should provide relief on Mar 26 reopen. Greek sovereign spreads have widened ~40bps since war began — ceasefire would compress them sharply.', severity: 'High' },
    { channel: 'SE Europe Spillover → Romania',       detail: 'Romania (~10% of Alpha loan book) exposed to energy prices and Balkans instability. The ECB\'s revised growth forecast (0.9% Eurozone 2026) pressures Romanian macro. De-escalation removes this overhang.', severity: 'Medium' },
    { channel: 'Iran Peace → Full Re-Rating Unlock',  detail: 'Alpha trades at 0.82x book vs 1.0x+ fair value. The war is the primary reason for the discount. A credible ceasefire removes the single largest obstacle to the analyst consensus target of €4.51 (+40%).', severity: 'Critical' },
  ],
  scenarios: [
    { name: 'Negotiated Ceasefire (Rising)',  probability: 30, color: '#10b981', priceImpact: '+15% to +25%', direction: 'Strongly Positive', rationale: 'Oil to $75-85. ECB cuts resume. Risk-on flows into peripheral EU banks. P/B re-rates toward 1.0x. Most favorable scenario — probability rising after 15-point plan delivery.' },
    { name: 'Prolonged Stalemate',           probability: 35, color: '#f59e0b', priceImpact: '-5% to -12%',  direction: 'Negative',          rationale: 'Oil stays $90-105. ECB hold continues. NII compression persists. Greek spreads elevated. Slow grind — no re-rating catalyst.' },
    { name: 'Regime Collapse',               probability: 15, color: '#8b5cf6', priceImpact: '-15% to -25%', direction: 'Negative',          rationale: 'Iran power vacuum → regional chaos → oil volatile $95-130 → global uncertainty. Greek risk premium rises sharply. Reduced from 20% as peace talks reduce this path.' },
    { name: 'Regional Conflagration',         probability: 15, color: '#ef4444', priceImpact: '-30% to -50%', direction: 'Strongly Negative', rationale: 'Oil $130+. Eurozone recession (ECB: 0.9% growth). Greek GDP contracts. NPEs spike. Alpha -30-50%. Tail risk but non-negligible.' },
    { name: 'Nuclear Breakout',              probability: 5,  color: '#dc2626', priceImpact: '-60%+',        direction: 'Catastrophic',      rationale: 'Global market collapse. All financial assets decimated. Extreme tail risk — unchanged at 5%.' },
  ],
  probabilityWeightedImpact: 'Net: -2% to -5% (improving from -5% to -10% last week). Ceasefire probability rising (25% → 30%) offsets tail risk. If Iran peace talks produce a meeting in Pakistan this week, shift to net positive.',
  keyPoliticalSignals: [
    {
      actor: 'Donald Trump',
      role: 'US President',
      platform: 'White House / Press',
      date: '2026-03-25',
      quote: 'We are in negotiations right now. Iran wants to make a deal very badly.',
      signalType: 'de-escalatory',
      stockImpact: 'If genuine: Brent to $80-85 within weeks, ALPHA gaps +15-20% as ECB cut expectations re-price. Iran denies — ambiguity persists. Key test: does an in-person meeting in Pakistan happen Thursday?',
    },
    {
      actor: 'Donald Trump',
      role: 'US President',
      platform: 'Oval Office',
      date: '2026-03-25',
      quote: 'Told Hegseth to keep up the military pressure. We negotiate with bombs.',
      signalType: 'ambiguous',
      stockImpact: 'Contradicts peace talk rhetoric. Suggests dual-track approach: military pressure + diplomacy. Markets will discount until concrete progress (meeting, ceasefire announcement).',
    },
    {
      actor: 'Pete Hegseth',
      role: 'US Secretary of Defense',
      platform: 'Oval Office Press Gaggle',
      date: '2026-03-25',
      quote: 'We negotiate with bombs.',
      signalType: 'escalatory',
      stockImpact: 'Hawkish framing undermines de-escalation narrative. Oil reversed some losses after this statement. Suggests "maximum pressure" strategy — ceasefire not imminent.',
    },
    {
      actor: 'Ebrahim Zolfaqari',
      role: 'Iran Military Spokesman',
      platform: 'State TV',
      date: '2026-03-25',
      quote: 'No one like us will make a deal with you. Not now. Not ever.',
      signalType: 'escalatory',
      stockImpact: 'Public denial of talks — standard Iranian posture before back-channel engagement. Does not rule out talks via intermediaries (Pakistan, Turkey, Egypt). Markets largely discounting this.',
    },
    {
      actor: 'US Administration (unnamed)',
      role: 'Senior Officials',
      platform: 'Briefing via NBC/AP',
      date: '2026-03-24',
      quote: '15-point peace plan delivered to Iran via Pakistani intermediaries. Covers: war end, Strait reopening, sanctions, nuclear, missiles, proxies.',
      signalType: 'diplomatic',
      stockImpact: 'Most concrete diplomatic framework since war began. If Iran engages: oil collapses, Greek banks rally hard. Pakistan meeting Thursday is the binary event. ALPHA entry timing hinges on this.',
    },
    {
      actor: 'Speaker Mike Johnson',
      role: 'US Speaker of the House',
      platform: 'House Floor',
      date: '2026-03-21',
      quote: 'This chamber will not write a blank check for a war that was not authorized. We will vote.',
      signalType: 'de-escalatory',
      stockImpact: 'Congressional resistance = structural de-escalation pressure. A funding defeat forces ceasefire timeline. Very positive for ALPHA if it materialises.',
    },
  ],
}

/* ─── RUSSIA-UKRAINE GEO CROSS-REFERENCE ──────────────────────── */
const geoOverlay2 = {
  analysis: 'Russia–Ukraine War: Year Four',
  analysisPath: '/geo/russia-ukraine-war',
  date: '2026-03-24',
  relevance: 'MEDIUM — Romania (~10% of Alpha loan book) sits in the spillover zone. Energy price pass-through and FX pressure (RON/EUR) affect loan quality. A frozen conflict (38% prob) is neutral for Alpha; prolonged war is mildly negative via energy costs and sentiment.',
  keyChannels: [
    { channel: 'Energy Prices → Romanian Macro', detail: 'Russia-Ukraine war sustains elevated European gas prices. Romania absorbs energy cost inflation, pressuring consumer loan repayment capacity in Alpha\'s ~10% Romanian book.', severity: 'Medium' },
    { channel: 'EU Defense Spending → Fiscal Space', detail: 'European defense ramp-up (Coalition of the Willing) may crowd out fiscal capacity for Greek/Romanian investment. Marginal negative for growth outlook.', severity: 'Low' },
  ],
}

const riskNotices = [
  {
    type: 'Geopolitical — DEVELOPING',
    icon: '🇮🇷',
    event: 'US–Iran 15-Point Peace Plan (Mar 24-25)',
    description: 'Trump claims active negotiations; Iran denies. Brent dropped 5% to $99/bbl. Pakistan meeting expected Thursday. If talks materialise: strongly bullish for ALPHA. If they collapse: oil re-spikes, risk-off resumes.',
    impact: 'Critical',
    impactColor: '#ef4444',
    suggestion: 'Monitor Iran peace talks hourly. Entry timing for ALPHA hinges on Pakistan meeting outcome (expected Thu Mar 27). See US–Iran War dashboard for full analysis.',
  },
  {
    type: 'Geopolitical',
    icon: '🇺🇦',
    event: 'Russia–Ukraine War — Year 4 (Peace talks on hold since Mar 10)',
    description: 'Conflict continues with Romania (~10% of Alpha loan book) in spillover zone. Peace talks paused; both sides citing front-line progress. DPRK $14B military aid to Russia escalates conflict.',
    impact: 'Medium',
    impactColor: '#f59e0b',
    suggestion: 'See Russia–Ukraine War dashboard. Monitor resumption of peace talks and North Korean involvement escalation.',
  },
  {
    type: 'Regulatory',
    icon: '⚖️',
    event: 'Basel IV / EU CRR3 Capital Requirements (Phased 2025–2030)',
    description: 'New capital output floors phase in from Jan 2025. Could require Greek banks to hold 10–15% more RWA capital by 2030. Est. impact: -80 to -130bps CET1.',
    impact: 'Medium',
    impactColor: '#f59e0b',
    suggestion: "Monitor Alpha Bank's disclosed Basel IV impact against current 15.0% CET1 ratio. Buffer is adequate but reduces room for shareholder returns.",
  },
  {
    type: 'Strategic',
    icon: '🏦',
    event: 'UniCredit Stake Build-Up (29.8% direct, up to 32.1%)',
    description: 'UniCredit continues accumulating Alpha Bank shares. While bullish for partnership, a potential full takeover bid at premium could emerge. Alternatively, a regulatory block on further stake increases is possible.',
    impact: 'Medium',
    impactColor: '#06b6d4',
    suggestion: 'Monitor ECB/SSM regulatory stance on UniCredit cross-border banking stakes. A takeover bid would be a significant upside catalyst; regulatory friction would be neutral.',
  },
]

/* ─── VERDICT ────────────────────────────────────────────────── */
const verdict = {
  stance: "BUY — ACCUMULATE ON DIP",
  stanceColor: "#10b981",
  stanceBg: "rgba(16,185,129,0.1)",
  timing: "Enter €2.95–3.20 zone; scale in around Pakistan meeting outcome",
  timingDetail: "The 15-point Iran peace plan is a game-changer for Greek banks. Brent dropping below $100 for the first time since the war began is a leading indicator. TWO GATES before full position: (1) Does Iran engage at the Pakistan meeting (expected Thu Mar 27)? If yes → add aggressively, target €4.00+. If Iran refuses → hold initial position, re-assess. (2) Does Athens market rally on Mar 26 reopen after the Mar 25 oil drop? A gap-up above €3.30 (200D MA) confirms momentum shift. The buyback at €3.57 avg sets a floor for management's own conviction.",
  entryZone: { low: 2.95, high: 3.20, ideal: 3.05 },
  stopLoss:  { price: 2.70, pct: -15.9, rationale: 'Wide stop to accommodate geo volatility. Break below €2.70 = war escalation + Greek macro deterioration thesis. Below Oct 2025 base.' },
  targets: [
    { price: 3.44, label: 'Target 1',  horizon: '1–4 weeks',    upside: 7.1,  trigger: 'Recovery above 50D MA on Iran de-escalation + Athens market relief rally' },
    { price: 4.05, label: 'Target 2',  horizon: '3–6 months',   upside: 26.1, trigger: 'Oil normalises to $80-85; ECB signals rate cut; P/B re-rates toward 1.0x' },
    { price: 4.51, label: 'Consensus', horizon: '6–12 months',  upside: 40.5, trigger: 'Analyst avg target; requires ceasefire + ECB cuts + RoTE → 14%' },
    { price: 5.10, label: 'Bull case', horizon: '12–18 months', upside: 58.9, trigger: 'Goldman target; full ceasefire + ECB cuts + Greek sovereign re-rating + UniCredit premium' },
  ],
  riskReward: '4.2:1',
  conviction: "Medium-High (upgrading from Medium-High — geo catalysts aligning)",
  keyConditions: [
    { label: 'Iran engages at Pakistan meeting (Thu Mar 27)',            status: 'pending', impact: 'CRITICAL — binary event for oil/Greek bank re-rating. Success → add; failure → hold' },
    { label: 'Brent crude sustains below $100/bbl',                    status: 'emerging', impact: 'First close below $100 since war. If sustained: ECB cut expectations re-price, NII outlook upgrades' },
    { label: 'Athens market rallies on Mar 26 reopen',                 status: 'pending', impact: 'Mar 25 oil drop not yet priced in (holiday). Gap-up above €3.30 = bullish confirmation' },
    { label: 'ALPHA holds above €2.95 support',                       status: 'met',     impact: 'Intraday bounce from €2.95 on Mar 23 shows demand. Critical near-term floor' },
    { label: 'Congressional vote on $200B war funding',                status: 'pending', impact: 'Defeat = forced ceasefire timeline. Very positive for ALPHA' },
    { label: 'Greek sovereign spread remains < 100bps',               status: 'met',     impact: 'Favorable funding environment maintained; institutional access intact' },
    { label: 'ECB signals rate cut path (next meeting: Apr 17)',       status: 'pending', impact: 'If Iran de-escalation holds, ECB could signal June cut. Bullish for NII outlook beyond 2026' },
  ],
  bearCase: 'If Iran peace talks collapse and Hegseth\'s "negotiate with bombs" is the real policy: oil re-spikes to $110-130, Athens sells off, ALPHA retests €2.50-2.70. Regional Conflagration (15%): ALPHA could drop 30-50%. Wide stop at €2.70 accounts for this.',
  disclaimer: 'Analytical data only. Not financial advice. Consult a qualified advisor.',
}

/* ─── ANALYSIS GAPS ──────────────────────────────────────────── */
const analysisGaps = [
  {
    topic: 'Iran Peace Talks Outcome Modeling',
    description: 'The Pakistan meeting (Thu Mar 27) is a binary event for Greek banks. Need scenario modeling of oil price paths and Alpha Bank NII impact under each outcome.',
    issueTitle: 'Extend Alpha Bank (ALPHA.AT) analysis: Model Iran peace talk outcomes — oil price × NII × P/B re-rating scenarios',
  },
  {
    topic: 'Currency Risk: EUR/USD & RON/EUR',
    description: 'Alpha Bank has ~10% Romania exposure. RON/EUR volatility and EUR/USD impact on institutional flows remain unanalyzed.',
    issueTitle: 'Extend Alpha Bank (ALPHA.AT) analysis: Add EUR/USD and RON/EUR currency risk analysis for Romania loan book',
  },
  {
    topic: 'UniCredit Takeover Scenario Analysis',
    description: 'UniCredit holds 29.8% direct + instruments to 32.1%. A full takeover bid at premium is plausible. Model bid price, regulatory hurdles, and probability.',
    issueTitle: 'Extend Alpha Bank (ALPHA.AT) analysis: UniCredit takeover scenario — bid price, ECB/SSM approval odds, premium analysis',
  },
  {
    topic: 'Options Market: Put/Call Ratio & Implied Volatility',
    description: 'Derivatives market sentiment and IV surface for ALPHA.AT / ALBKY not covered. Options data often leads price moves.',
    issueTitle: 'Extend Alpha Bank (ALPHA.AT) analysis: Add options market analysis — put/call ratio, implied volatility, open interest',
  },
  {
    topic: 'ECB April 17 Meeting Preview',
    description: 'If Iran de-escalation holds, the April ECB meeting becomes a potential rate cut catalyst. Need to model rate sensitivity for Alpha Bank NII.',
    issueTitle: 'Extend Alpha Bank (ALPHA.AT) analysis: ECB April 17 rate decision preview — rate sensitivity and NII impact modeling',
  },
  {
    topic: 'Eurobank vs Alpha Bank: Full Head-to-Head',
    description: 'Deutsche Bank ranks Eurobank first, Alpha second. A dedicated side-by-side deep dive would sharpen positioning.',
    issueTitle: 'Extend Alpha Bank analysis: Full head-to-head comparison of Alpha Bank vs Eurobank — strategy, financials, valuation',
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
