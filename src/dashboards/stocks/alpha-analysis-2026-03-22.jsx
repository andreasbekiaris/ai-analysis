import StockDashboard from '../../components/StockDashboard'

/* ─── DATA (Updated April 5, 2026) ──────────────────────────── */
const stock = {
  name: 'Alpha Bank',
  ticker: 'ALPHA.AT',
  adr: 'ALBKY',
  exchange: 'Athens Stock Exchange',
  date: '2026-04-05',
  price: 3.361,
  change: +0.010,
  changePct: +0.30,
  open: 3.35,
  high52w: 4.489,
  low52w: 1.750,
  marketCap: '€7.63B',
  pe: 8.09,
  peForward: 7.27,
  eps: 0.416,
  bookValue: 3.90,
  pbRatio: 0.86,
  dividendYield: 3.87,
  dividendPerShare: 0.13,
  payoutRatio: 55,
  beta: 0.81,
  sharesOut: '2.27B',
  sector: 'Banking — Greece',
  overallSignal: 'HOLD',
  analystConsensus: 'Buy',
  analystCount: 15,
  avgTarget: 4.51,
  highTarget: 5.50,
  lowTarget: 3.12,
  chartNote: 'Stock recovered +4.7% from €3.211 (Mar 23) to €3.361 (Apr 2 close), boosted by MSCI Developed Market upgrade on Mar 31 (+5.68% on Apr 1). Still ~25% below 52-week high of €4.489. Brent at $109/bbl — Trump Apr 6 Hormuz deadline imminent. ECB rate hike 88% probability at Apr 30 meeting. MSCI upgrade is structural positive; geo risk is acute near-term negative.',
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
  { date: 'Mar-26', price: 3.18 },
  { date: 'Mar-31', price: 3.28 },
  { date: 'Apr-1', price: 3.47 },
  { date: 'Apr-2', price: 3.361 },
]

const maData = [
  { name: '5-Day MA',   value: 3.34, signal: 'BUY',     current: 3.361 },
  { name: '20-Day MA',  value: 3.25, signal: 'BUY',     current: 3.361 },
  { name: '50-Day MA',  value: 3.40, signal: 'SELL',    current: 3.361 },
  { name: '200-Day MA', value: 3.32, signal: 'BUY',     current: 3.361 },
]

const technicals = {
  priceRange: [1.5, 4.8],
  maSignalSummary: '3 of 4 MAs signal Buy (5D, 20D, 200D). Price above 200D MA (€3.32) — key bullish reclaim after MSCI upgrade rally. Still below 50D MA (€3.40). The MSCI-driven surge on Apr 1 (+5.68%) pushed price back above the 200D MA for the first time since early March. A sustained close above €3.40 (50D MA) would confirm medium-term trend reversal. Apr 6 geo deadline creates extreme binary risk.',
  oscillators: [
    { label: 'RSI (14-day)',      value: '54.2',  signal: 'NEUTRAL', note: 'Mid-range — recovered from oversold; room to move in either direction' },
    { label: 'MACD',             value: '+0.012', signal: 'BUY',    note: 'Crossed above signal line on Apr 1 MSCI rally — bullish crossover' },
    { label: 'Stochastic (14,3)',value: '62.4',  signal: 'NEUTRAL', note: 'Mid-range after sharp bounce; no extreme reading' },
    { label: 'Williams %R',      value: '-38.1', signal: 'NEUTRAL', note: 'Neutral zone — recovered from oversold in late March' },
    { label: 'ADX (14)',         value: '22.8',  signal: 'NEUTRAL', note: 'Weak trend strength; directional move pending geo catalyst' },
  ],
  supportLevels: [
    { level: 4.489, label: '52W High / Major Resistance',         type: 'resistance' },
    { level: 3.57,  label: 'Buyback Avg Price / Resistance',      type: 'resistance' },
    { level: 3.47,  label: 'Apr 1 MSCI Rally High / Resistance',  type: 'resistance' },
    { level: 3.40,  label: '50-Day MA / Key Resistance',          type: 'resistance' },
    { level: 3.361, label: 'Current Price (Apr 2 close)',         type: 'current' },
    { level: 3.32,  label: '200-Day MA / Immediate Support',      type: 'support' },
    { level: 3.18,  label: 'Mar 26 Low / Support',                type: 'support' },
    { level: 2.95,  label: 'Mar 23 Intraday Low / Strong Support',type: 'support' },
    { level: 2.85,  label: 'Prior Breakout Zone / Support',       type: 'support' },
    { level: 2.48,  label: 'October 2025 Base / Major Support',   type: 'support' },
    { level: 1.750, label: '52W Low / Floor',                     type: 'support' },
  ],
  priceNote: 'Price reclaimed the 200-day MA (€3.32) on the MSCI Developed Market upgrade rally (Apr 1: +5.68%). Gave back some gains on Apr 2 (-3.1%) as geo risk reasserted — Trump reaffirmed April 6 Hormuz ultimatum. The 200D MA is now the critical support level. A break below it would signal the MSCI rally was a head-fake. A push above €3.40 (50D MA) confirms trend reversal. The April 6 deadline is the single biggest near-term catalyst — outcome determines whether ALPHA retests €3.47+ or falls back to €3.00.',
}

const fundamentalData = {
  valuation: [
    { label: 'P/E (TTM)',     value: 8.09,              bench: '8–10×',       note: 'Fair vs sector ~9× for Greek banks',  ok: true },
    { label: 'P/E (Forward)', value: 7.27,              bench: '7–9×',        note: 'Cheap on 2026E earnings',             ok: true },
    { label: 'P/B Ratio',     value: 0.86,              bench: '0.9–1.1×',    note: 'Below book — MSCI upgrade narrows gap', ok: true },
    { label: 'PEG Ratio',     value: '0.58',            bench: '<1 = cheap',  note: 'Strong EPS growth path',              ok: true },
    { label: 'Div. Yield',    value: '3.87%',           bench: '2–4% sector', note: 'In-line; buyback adds total return',  ok: true },
    { label: 'Payout Ratio',  value: '55%',             bench: '40–60%',      note: 'Sustainable + buybacks',              ok: true },
  ],
  scorecard: [
    { label: 'Valuation',      score: 8, note: 'P/B 0.86x — still below book; P/E 8.1x vs sector 9x. MSCI upgrade should compress discount.' },
    { label: 'Profitability',  score: 7, note: 'RoTE 12.9% vs 14-15% peers; Q4 beat by 16%. Improving but not sector-leading.' },
    { label: 'Capital Quality',score: 8, note: 'CET1 15.0% — robust; 206bps organic capital generated in FY2025. AstroBank absorbed.' },
    { label: 'Asset Quality',  score: 8, note: 'NPE ~3.0%, declining from 3.5%. Sector-wide improvement continues.' },
    { label: 'Dividend',       score: 7, note: '3.87% yield + active buyback (3.6M shares at €3.57 avg). Total return ~5.5%.' },
    { label: 'Growth Outlook', score: 8, note: 'NII >€1.7B guided for 2026; fee income → €600M target. ECB hike would boost NII further.' },
  ],
}

const financials = [
  { year: 'FY2022', netProfit: 168,  nii: 820,  fees: 380, roe: 3.1  },
  { year: 'FY2023', netProfit: 441,  nii: 1420, fees: 430, roe: 7.2  },
  { year: 'FY2024', netProfit: 655,  nii: 1680, fees: 490, roe: 9.1  },
  { year: 'FY2025', netProfit: 943,  nii: 1653, fees: 582, roe: 10.5 },
  { year: 'FY2026E', netProfit: 1050, nii: 1750, fees: 620, roe: 12.0 },
]

const capitalMetrics = [
  { subject: 'CET1 Capital',  value: 75 },
  { subject: 'NPE Reduction', value: 85 },
  { subject: 'Cost Control',  value: 70 },
  { subject: 'Fee Growth',    value: 88 },
  { subject: 'RoTE',          value: 65 },
  { subject: 'Dividend Yield',value: 68 },
]

const peerComparison = [
  { bank: 'Alpha Bank', pe: 8.09, pb: 0.86, rote: 12.9, cet1: 15.0, npe: 3.0, target: 4.51, divYield: 3.87 },
  { bank: 'Eurobank',   pe: 7.90, pb: 0.92, rote: 15.2, cet1: 17.5, npe: 3.1, target: 4.35, divYield: 3.80 },
  { bank: 'Piraeus',    pe: 8.10, pb: 0.70, rote: 13.8, cet1: 14.2, npe: 4.1, target: 8.95, divYield: 3.50 },
  { bank: 'NBG',        pe: 9.50, pb: 0.88, rote: 14.5, cet1: 18.2, npe: 2.9, target: 15.95, divYield: 5.20 },
]

const radarPeer = [
  { subject: 'Capital',       ALPHA: 75, EUROB: 87, PIR: 71, NBG: 91 },
  { subject: 'Asset Quality', ALPHA: 85, EUROB: 86, PIR: 76, NBG: 88 },
  { subject: 'Profitability', ALPHA: 70, EUROB: 84, PIR: 76, NBG: 80 },
  { subject: 'Valuation',     ALPHA: 88, EUROB: 80, PIR: 86, NBG: 72 },
  { subject: 'Dividend',      ALPHA: 74, EUROB: 72, PIR: 66, NBG: 90 },
  { subject: 'EPS Growth',    ALPHA: 91, EUROB: 80, PIR: 78, NBG: 73 },
]

const analystTargets = [
  { firm: 'Goldman Sachs', target: 5.10, rating: 'Buy',     upside: 52 },
  { firm: 'Deutsche Bank', target: 4.45, rating: 'Buy',     upside: 32 },
  { firm: 'UBS',           target: 4.30, rating: 'Buy',     upside: 28 },
  { firm: 'Citi',          target: 4.10, rating: 'Buy',     upside: 22 },
  { firm: 'JPMorgan',      target: 3.90, rating: 'Overweight', upside: 16 },
  { firm: 'Barclays',      target: 3.12, rating: 'Hold',    upside: -7 },
]

const eventImpacts = [
  { event: 'MSCI Upgrades Greece to Developed Market (Mar 31)',          level: 'Critical', direction: 'Positive', rationale: 'Greece returns to developed-market status after 13 years. Implementation at May 2027 index review. Triggers passive fund inflows (est. $2-4B) into Greek equities. Alpha Bank as largest private bank is a primary beneficiary. Structural re-rating catalyst — narrows P/B discount to European peers over 12-18 months.' },
  { event: 'Trump April 6 Hormuz Ultimatum — Infrastructure Strikes',    level: 'Critical', direction: 'Negative', rationale: 'Trump threatens "Power Plant Day and Bridge Day" if Iran doesn\'t reopen Hormuz by Apr 6. Iran\'s military rejected demand. If strikes proceed: oil spikes $130-150+, ECB rate hike accelerates, risk-off hits peripheral EU banks hard. If deadline extended again: stalemate continues, oil stays $100-110. Binary event for ALPHA.' },
  { event: 'ECB Rate Hike 88% Probability at Apr 30 Meeting',           level: 'High',     direction: 'Mixed',    rationale: 'ECB raised 2026 inflation forecast to 2.6% (from 1.9%) at March meeting. Oil at $109 driving energy inflation. Hawkish ECB officials (Villeroy, Nagel) signaling hike. SHORT-TERM: Higher rates = higher NII for Alpha (positive). MEDIUM-TERM: Tighter conditions = slower growth, loan demand risk (negative).' },
  { event: 'UniCredit Stake 29.8% Direct → Instruments to 32.1%',       level: 'High',     direction: 'Positive', rationale: 'Converted to direct holding Jan 5, 2026. Financial instruments for additional 2.3% (swaps expiring Q1-Q2). Strategic anchor investor. Boosts wholesale banking, institutional credibility, M&A optionality. No change since last analysis.' },
  { event: 'AstroBank Integration + Altius/Universal Life Merger',       level: 'Medium',   direction: 'Positive', rationale: 'AstroBank creating Cyprus\' 3rd-largest bank (€6.6B assets). Digital platform unification completing in 2026. Altius-Universal Life insurance merger expected Q3 2026 — creates top-3 Cyprus insurer. RoCET >20% expected from Cyprus activities. NII +3% QoQ from AstroBank in Q4.' },
  { event: 'Q4 2025 Results Beat — Profit +44% YoY',                    level: 'High',     direction: 'Positive', rationale: 'Net profit €237M in Q4, 16% above analyst expectations. Fee income +12% QoQ to €136M. NII up 3% QoQ on AstroBank consolidation. CET1 at 15.0% after absorbing acquisitions. FY2025 net profit €943M (+44% YoY). Demonstrated strong organic capital generation of 206bps.' },
  { event: 'Share Buyback Active (Mar 2-6: 3.6M shares at €3.57 avg)',  level: 'Medium',   direction: 'Positive', rationale: 'Management buying at avg €3.57 — well above current price of €3.36. Signals conviction. Part of €519M total distribution (55% payout). Total treasury shares now 42.5M (1.84% of outstanding). Accretive to EPS and P/B.' },
  { event: 'Greek GDP Growth 2.2% (2026 EC forecast)',                   level: 'Medium',   direction: 'Positive', rationale: 'Greece outperforming Eurozone avg (0.9%). Investment-grade; RRP-driven investment activity robust. Corporate lending double-digit growth. Moderates to 1.7% in 2027 as RRP winds down.' },
  { event: 'Athens Exchange Surges 3%+ on MSCI Upgrade (Apr 1)',        level: 'Medium',   direction: 'Positive', rationale: 'ALPHA +5.68% on Apr 1. Piraeus +5.24%, NBG +3.85%. JP Morgan maintains overweight Greece in SE Europe. Greek banks now at ~9x 2026E earnings — 15-20% discount to regional peers despite favorable macro.' },
  { event: 'Basel IV / EU CRR3 Phase-In (2025-2030)',                    level: 'Medium',   direction: 'Negative', rationale: 'New capital output floors could require 10-15% more RWA capital by 2030. Est. impact: -80 to -130bps CET1. Current 15.0% buffer adequate.' },
  { event: 'Fitch/S&P Upgrade Cycle (Greek Banks)',                      level: 'High',     direction: 'Positive', rationale: 'Sector-wide credit upgrades reduce funding costs, expand investor base, and re-rate P/B multiples. NPEs below 3% — structural improvement. MSCI DM status reinforces the upgrade narrative.' },
  { event: 'US-Iran War Day 37 — Houthis Entering, Aircraft Downed',    level: 'Critical', direction: 'Negative', rationale: 'Houthis launched 2 ballistic missiles at Israel (Apr 1-2). Iran shot down F-15E + A-10 (first US aircraft lost in 20+ years). Iran struck Kuwait refineries and 90% of water infrastructure. Conflagration probability rose from 15% to 25%. Oil at $109, analysts warn $150+ if Hormuz stays closed.' },
]

const keyMetrics = [
  { label: 'Net Profit FY2025',      value: '€943.3M',  change: '+44% YoY',                pos: true  },
  { label: 'CET1 Capital Ratio',     value: '15.0%',    change: '206bps organic generation', pos: true  },
  { label: 'NPE Ratio',              value: '~3.0%',    change: 'Down from 3.5% (mid-25)',  pos: true  },
  { label: 'Cost-to-Income',         value: '39.5%',    change: 'Target: ~37%',             pos: true  },
  { label: 'RoTE (Normalised)',       value: '12.9%',    change: 'Vs 14-15% peers',          pos: null  },
  { label: 'Net Interest Income',    value: '€1.65B',   change: '2026 guide: >€1.7B',      pos: true  },
  { label: 'Fee Income',             value: '€582M',    change: '+19% YoY; Q4 +12% QoQ',  pos: true  },
  { label: 'Total Distribution',     value: '€519M',    change: '55% payout + buyback',     pos: true  },
  { label: 'UniCredit Stake',        value: '29.8%',    change: 'Instruments to 32.1%',     pos: true },
  { label: 'AstroBank Deposits',     value: '+€2.2B',   change: 'Cyprus 3rd-largest bank',  pos: true },
  { label: 'Brent Crude (Apr 5)',    value: '$109/bbl', change: 'Apr 6 deadline → $130-150?', pos: false },
  { label: 'MSCI Status',           value: 'Developed', change: 'Upgraded Mar 31 — DM from May 2027', pos: true },
]

const newsItems = [
  {
    headline: "MSCI upgrades Greece to Developed Market status — first time since 2013",
    source: "Bloomberg",
    date: "2026-03-31",
    url: "https://www.bloomberg.com/news/articles/2026-03-31/msci-names-greece-a-developed-market-for-first-time-since-2013",
    sentiment: "positive",
  },
  {
    headline: "Athens Stock Exchange jumps 3%+ as MSCI upgrade drives buyers; Alpha Bank +5.68%",
    source: "Athens Times",
    date: "2026-04-01",
    url: "https://athens-times.com/athens-stock-exchange-jumps-over-3-as-buyers-take-control/",
    sentiment: "positive",
  },
  {
    headline: "Trump's Iran war speech: 'Power Plant Day and Bridge Day' — 600M+ barrels at risk",
    source: "CNBC",
    date: "2026-04-02",
    url: "https://www.cnbc.com/2026/04/02/trumps-iran-war-speech-oil-price-strait-hormuz.html",
    sentiment: "negative",
  },
  {
    headline: "Oil supply crunch will worsen in April, IEA warns — Brent at $109/bbl",
    source: "CNBC",
    date: "2026-04-01",
    url: "https://www.cnbc.com/2026/04/01/oil-price-iea-fatih-birol-brent-iran-strait-hormuz.html",
    sentiment: "negative",
  },
  {
    headline: "Eurozone inflation jumps to 2.5% amid Iran war — ECB rate hike odds surge",
    source: "Euronews",
    date: "2026-03-31",
    url: "https://www.euronews.com/business/2026/03/31/eurozone-inflation-jumps-to-25-amid-iran-war-will-the-ecb-hike-rates",
    sentiment: "negative",
  },
  {
    headline: "ECB officials weigh April rate hike on inflation risks from Iran conflict",
    source: "Bloomberg",
    date: "2026-03-19",
    url: "https://www.bloomberg.com/news/articles/2026-03-19/ecb-officials-see-possibility-of-rate-hike-at-april-meeting",
    sentiment: "neutral",
  },
  {
    headline: "Alpha Bank Q4 2025: profit surges 44% YoY on M&A strategy; Q4 net profit 16% above expectations",
    source: "Investing.com",
    date: "2026-02-27",
    url: "https://www.investing.com/news/company-news/alpha-bank-q4-2025-slides-profit-surges-44-on-ma-strategy-93CH-4530826",
    sentiment: "positive",
  },
  {
    headline: "Alpha Bank announces merger of Altius Insurance and Universal Life in Cyprus — top-3 insurer",
    source: "Yahoo Finance",
    date: "2026-03-15",
    url: "https://finance.yahoo.com/news/alpha-bank-announces-merger-altius-111947495.html",
    sentiment: "positive",
  },
  {
    headline: "Alpha Bank shares rated 'buy' as analysts cite attractive returns; Goldman maintains Buy, €5.10 target",
    source: "Cyprus Mail",
    date: "2026-03-11",
    url: "https://cyprus-mail.com/2026/03/11/alpha-bank-shares-rated-buy-as-analysts-cite-attractive-returns",
    sentiment: "positive",
  },
  {
    headline: "JP Morgan maintains overweight Greece — banks 'most attractive' in SE Europe at 9x 2026E",
    source: "Athens Times",
    date: "2026-04-01",
    url: "https://athens-times.com/alpha-finance-axia-research-greek-banks-show-resilience-amid-uncertainty/",
    sentiment: "positive",
  },
  {
    headline: "IMF Article IV consultation: Greece growth 'robust' at 2.2%; structural improvements continue",
    source: "IMF",
    date: "2026-03-24",
    url: "https://www.imf.org/en/news/articles/2026/03/24/cs-03242026-greece-staff-concluding-statement-of-the-2026-article-iv-consultation-mission",
    sentiment: "positive",
  },
  {
    headline: "ECB ready to hike rates even if inflation surge is short-lived, Lagarde says",
    source: "CNBC",
    date: "2026-03-25",
    url: "https://www.cnbc.com/2026/03/25/ecb-rate-hikes-inflation-forecasts-christine-lagarde-iran-war.html",
    sentiment: "negative",
  },
]

/* ─── GEOPOLITICAL CROSS-REFERENCE: US-IRAN WAR ───────────────── */
const geoOverlay = {
  analysis: 'US–Iran War: Operation Epic Fury — Day 37 / April 6 Deadline',
  analysisPath: '/geo/us-iran-war',
  date: '2026-04-05',
  relevance: 'CRITICAL — The US-Iran war has entered its most dangerous phase. Trump\'s April 6 Hormuz ultimatum expires TOMORROW with explicit threats of "Power Plant Day and Bridge Day" infrastructure strikes. Oil at $109/bbl with analysts warning $150+ if Hormuz stays closed. The war has dramatically worsened since the March 22 analysis: Houthis entering war, US aircraft shot down, Kuwait infrastructure struck, ceasefire probability dropped from 30% to 15%, Conflagration risk doubled from 15% to 25%. The ECB has raised inflation forecast to 2.6% and an April rate hike is 88% probable. This is no longer a "peace talks might happen" story — it is a "will infrastructure strikes trigger regional conflagration" story. The April 6 outcome is the SINGLE BIGGEST near-term catalyst for ALPHA.',
  keyChannels: [
    { channel: 'Oil → Inflation → ECB Rate Hike', detail: 'Brent at $109 (up from $99 on Mar 25). If Apr 6 strikes proceed: oil spikes $130-150+, ECB rate HIKE at Apr 30 meeting accelerates from likely to certain. SHORT-TERM: higher rates boost NII (positive). MEDIUM-TERM: stagflation risk — growth contracts, loan demand drops, NPE risk rises (negative). Net impact on Alpha: mildly positive for NII, strongly negative for valuation/growth.', severity: 'Critical' },
    { channel: 'Global Risk Sentiment → Greek Sovereign Spreads', detail: 'Athens General Index volatile — surged 3%+ on MSCI upgrade (Apr 1), but geo risk caps upside. Greek sovereign spreads widened ~50bps since war began. Conflagration (25% probability) would blow spreads out 100bps+, crushing Greek bank valuations. MSCI upgrade partially offsets with structural bid.', severity: 'Critical' },
    { channel: 'MSCI DM Upgrade → Structural Floor', detail: 'Greece\'s March 31 MSCI Developed Market upgrade (effective May 2027) creates a structural bid under Greek equities. Passive fund inflows estimated $2-4B over 12-18 months. This provides a medium-term floor that partially insulates Alpha from geo shocks — but cannot prevent a 20-30% drawdown in a Conflagration scenario.', severity: 'High' },
    { channel: 'SE Europe Spillover → Romania', detail: 'Romania (~10% of Alpha loan book) exposed to energy prices and Balkans instability. ECB revised Eurozone growth to 0.9% for 2026. De-escalation removes this overhang; conflagration amplifies it.', severity: 'Medium' },
    { channel: 'Iran Conflagration → Full Re-Rating Blocked', detail: 'Alpha trades at 0.86x book vs 1.0x+ fair value. MSCI upgrade should compress this discount — but the war prevents it. With Conflagration at 25% and Stalemate at 22%, a 47% combined probability of prolonged geo risk keeps the discount in place. Only a ceasefire (15%) unlocks full re-rating to €4.50+.', severity: 'Critical' },
  ],
  scenarios: [
    { name: 'Escalatory Resolution (Coerced)',  probability: 30, color: '#06b6d4', priceImpact: '+5% to +15%', direction: 'Moderately Positive', rationale: 'Trump\'s infrastructure strikes force Iranian capitulation within 2-4 weeks. Oil drops to $80-90. ECB hike still happens but signals pause. Alpha rallies on oil relief but gains capped by destruction aftermath. Better than stalemate, worse than clean ceasefire.' },
    { name: 'Regional Conflagration',           probability: 25, color: '#ef4444', priceImpact: '-25% to -40%', direction: 'Strongly Negative', rationale: 'April 6 strikes trigger coordinated Houthi-Hezbollah-PMF retaliation. Oil $130-150+. Eurozone recession. Greek spreads blow out. Alpha retests €2.00-2.50. MSCI flows cannot offset this magnitude of shock. DOUBLED from 15% since last analysis.' },
    { name: 'Prolonged Stalemate',              probability: 22, color: '#f59e0b', priceImpact: '-8% to -15%', direction: 'Negative', rationale: 'April 6 deadline passes with escalated strikes but no resolution. Oil $100-120. ECB hikes. NII benefits offset by growth drag. Alpha drifts to €2.85-3.10. No re-rating catalyst. War grinds 3-6+ months.' },
    { name: 'Negotiated Ceasefire',             probability: 15, color: '#10b981', priceImpact: '+20% to +35%', direction: 'Strongly Positive', rationale: 'Pakistan/Turkey/Egypt mediators bridge gap before or after strikes. Oil collapses to $75-85. ECB pivots back to cuts. Alpha surges to €4.00-4.50 as MSCI + ceasefire = full re-rating. DROPPED from 30% since last analysis as Iran rejected talks and war escalated.' },
    { name: 'Regime Collapse / Nuclear Crisis',  probability: 8,  color: '#dc2626', priceImpact: '-50%+', direction: 'Catastrophic', rationale: 'Combined military/economic destruction topples Islamic Republic. Nuclear proliferation risk. Global market panic. All financial assets decimated. Tail risk — Mojtaba Khamenei\'s absence fuels speculation.' },
  ],
  probabilityWeightedImpact: 'Net probability-weighted impact: -6% to -10% (WORSENED from -2% to -5% two weeks ago). Conflagration doubling (15%→25%) and Ceasefire halving (30%→15%) significantly shift the expected value negative. MSCI upgrade provides structural medium-term offset but cannot prevent short-term geo-driven drawdown. The April 6 deadline is a binary event that will resolve much of this uncertainty within 48 hours.',
  keyPoliticalSignals: [
    {
      actor: 'Donald Trump',
      role: 'US President',
      platform: 'Truth Social',
      date: '2026-04-05',
      quote: 'Open the F***in\' Strait, you crazy bastards, or you\'ll be living in Hell. Tuesday will be Power Plant Day, and Bridge Day.',
      signalType: 'escalatory',
      stockImpact: 'Most aggressive statement of the war. Confirms intent to execute infrastructure strikes. Oil +$2 on release. If strikes proceed on Apr 6: ALPHA drops 5-10% on risk-off. If Hormuz reopens under duress: ALPHA rallies 10-15%.',
    },
    {
      actor: 'Abbas Araghchi',
      role: 'Iran Foreign Minister',
      platform: 'Al Jazeera Interview',
      date: '2026-04-05',
      quote: 'At present there is no negotiation. Iran is not looking for a ceasefire — we are seeking to end the war. But we are willing to join talks.',
      signalType: 'diplomatic',
      stockImpact: 'Critical dual signal: military defiance + diplomatic openness. "Willing to join talks" = crack in defiance. If mediators exploit this before Apr 6: Ceasefire probability jumps to 25%. ALPHA entry signal.',
    },
    {
      actor: 'Donald Trump',
      role: 'US President',
      platform: 'Primetime Address to the Nation',
      date: '2026-04-01',
      quote: 'The war is nearing completion. We will hit Iran extremely hard over the next two to three weeks. If they don\'t make a deal, we will bring them back to the stone ages.',
      signalType: 'escalatory',
      stockImpact: 'Establishes 2-3 week escalation timeline. Markets initially read as de-escalatory (war ending), then repriced as escalatory (infrastructure destruction). Creates the April 6 deadline context.',
    },
    {
      actor: 'Ali Abdollahi',
      role: 'Iran Central Military Commander',
      platform: 'State Media',
      date: '2026-04-05',
      quote: 'Trump\'s threat is a desperate, nervous, unbalanced and foolish action. Any strike on Iran\'s infrastructure will be met with devastating and continuous attacks on all US military assets.',
      signalType: 'escalatory',
      stockImpact: 'Military rejection of ultimatum. But note: Araghchi simultaneously signaled openness. Military rejection ≠ political rejection. If retaliation follows strikes → Conflagration (ALPHA -25-40%). If bluster → Stalemate.',
    },
    {
      actor: 'Masoud Pezeshkian',
      role: 'Iranian President',
      platform: 'Via Intermediaries',
      date: '2026-04-01',
      quote: '5 conditions: end aggression; guarantees against recurrence; war reparations; all-fronts ceasefire; Hormuz sovereignty recognition.',
      signalType: 'diplomatic',
      stockImpact: 'Maximalist positions, not final demands. Gap between US and Iranian positions is enormous but not unbridgeable. Markets discounting these as opening bids. Any movement toward compromise = massive positive for ALPHA.',
    },
    {
      actor: 'ECB (Villeroy de Galhau)',
      role: 'Bank of France Governor / ECB GC',
      platform: 'Public Statement',
      date: '2026-04-02',
      quote: 'We are monitoring the energy shock carefully. Price stability is non-negotiable. The April meeting will be a live decision.',
      signalType: 'economic',
      stockImpact: 'Confirms April 30 rate hike is "live" — markets pricing 88%. For Alpha: NII uplift ~€20-30M annually from 25bps hike. But growth impact is negative. Net: slightly positive for earnings, negative for valuation multiple.',
    },
  ],
}

const riskNotices = [
  {
    type: 'Geopolitical — IMMINENT',
    icon: '🇮🇷',
    event: 'Trump April 6 Hormuz Ultimatum — "Power Plant Day and Bridge Day"',
    description: 'Trump\'s 48-hour ultimatum expires TOMORROW (Apr 6). He has explicitly threatened infrastructure strikes on Iranian power plants and bridges. Iran\'s military rejected the demand; FM Araghchi signaled willingness to talk. Conflagration probability at 25% (doubled since last analysis). Ceasefire at 15% (halved). Oil at $109, analysts warn $150+ if Hormuz stays closed.',
    impact: 'Critical',
    impactColor: '#ef4444',
    suggestion: 'DO NOT add new positions before April 6 deadline outcome. If strikes proceed: expect 5-10% drawdown on risk-off. If Hormuz reopens: entry window opens. See US–Iran War dashboard for full scenario analysis.',
  },
  {
    type: 'Monetary Policy — HAWKISH SHIFT',
    icon: '🏦',
    event: 'ECB Rate Hike 88% Probability at April 30 Meeting',
    description: 'ECB raised 2026 inflation forecast to 2.6% (from 1.9%). Hawkish officials (Villeroy, Nagel, Lagarde) signaling hike. Oil at $109 driving energy inflation. For Alpha: NII upside from higher rates, but growth/valuation downside from tighter conditions.',
    impact: 'High',
    impactColor: '#f59e0b',
    suggestion: 'Monitor ECB communication and April inflation data. Rate hike is net neutral-to-slightly-positive for Alpha earnings (NII uplift) but negative for multiple expansion.',
  },
  {
    type: 'Geopolitical',
    icon: '🇺🇦',
    event: 'Russia–Ukraine War — Year 4 (Peace talks on hold)',
    description: 'Conflict continues with Romania (~10% of Alpha loan book) in spillover zone. Peace talks paused. European defense spending crowding out fiscal capacity.',
    impact: 'Medium',
    impactColor: '#f59e0b',
    suggestion: 'See Russia–Ukraine War dashboard. Monitor resumption of peace talks.',
  },
  {
    type: 'Structural Positive — NEW',
    icon: '📈',
    event: 'MSCI Developed Market Upgrade (Mar 31 — effective May 2027)',
    description: 'Greece upgraded from Emerging to Developed Market status for the first time since 2013. Triggers passive fund inflows est. $2-4B into Greek equities. Alpha Bank as largest private bank is primary beneficiary. Structural long-term positive that provides a floor under the stock.',
    impact: 'High',
    impactColor: '#10b981',
    suggestion: 'This is a structural catalyst that operates on a 12-18 month horizon. It does NOT protect against near-term geo shocks but provides a strong medium-term re-rating anchor.',
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
    event: 'UniCredit Stake Build-Up (29.8% direct, instruments to 32.1%)',
    description: 'UniCredit converted to direct holding Jan 5. Financial instruments (TRS, options) for additional 2.3% expiring Q1-Q2 2026. Takeover bid at premium remains plausible. Regulatory stance on further increases is the gating factor.',
    impact: 'Medium',
    impactColor: '#06b6d4',
    suggestion: 'Monitor ECB/SSM stance on UniCredit cross-border banking stakes. A takeover bid would be significant upside catalyst; regulatory friction would be neutral.',
  },
]

/* ─── VERDICT ────────────────────────────────────────────────── */
const verdict = {
  stance: "HOLD — WAIT FOR APRIL 6 CLARITY",
  stanceColor: "#f59e0b",
  stanceBg: "rgba(245,158,11,0.1)",
  timing: "DO NOT add positions before April 6 deadline outcome",
  timingDetail: "The situation has deteriorated sharply since March 22. Ceasefire probability HALVED (30%→15%) while Conflagration DOUBLED (15%→25%). Trump's April 6 Hormuz ultimatum expires TOMORROW with the most aggressive language of the war ('Power Plant Day and Bridge Day'). Iran's military rejected the demand. Adding positions ahead of a binary event with 25% catastrophic downside risk is poor risk management — even though the MSCI Developed Market upgrade (Mar 31) is a powerful structural positive.\n\nPOST-APRIL 6 DECISION TREE:\n• If strikes proceed + Iran retaliates (→Conflagration): ALPHA drops to €2.50-2.80. BUY at €2.50-2.60 with wide stop at €2.10. MSCI structural bid provides floor.\n• If strikes proceed + Iran capitulates (→Escalatory Resolution): ALPHA rallies to €3.50-3.80. BUY on confirmation of Hormuz reopening. Target €4.00+.\n• If deadline extended again (→Stalemate): ALPHA drifts to €3.10-3.30. CAUTIOUS BUY at €3.10-3.15 with stop at €2.80.\n• If mediators deliver breakthrough (→Ceasefire): ALPHA gaps to €3.80-4.20. BUY immediately — full re-rating begins. Target €4.51 (consensus) to €5.10 (Goldman).\n\nThe MSCI upgrade changes the MEDIUM-TERM thesis from 'hold until geo clears' to 'structural accumulate on any geo-driven dip.' Passive fund inflows ($2-4B est.) will flow into Greek equities over 12-18 months regardless of the war outcome. Alpha Bank is the primary beneficiary. Every geo-driven dip is now a structural buying opportunity — but let the April 6 outcome determine the entry price.",
  entryZone: { low: 2.50, high: 3.15, ideal: 2.80 },
  stopLoss:  { price: 2.10, pct: -37.5, rationale: 'Extreme-wide stop for Conflagration scenario. Below Oct 2025 base and MSCI structural floor. Only triggers in catastrophic outcome. If entered at €2.80 ideal, stop at €2.10 = 25% risk — appropriate for 25% Conflagration probability.' },
  targets: [
    { price: 3.47, label: 'Target 1',  horizon: '1–4 weeks',    upside: 3.2,  trigger: 'Recovery above Apr 1 MSCI high on strike resolution; 50D MA breakout' },
    { price: 4.05, label: 'Target 2',  horizon: '3–6 months',   upside: 20.5, trigger: 'Oil normalises to $80-90; ECB hike absorbed; MSCI passive inflows begin; P/B re-rates toward 1.0x' },
    { price: 4.51, label: 'Consensus', horizon: '6–12 months',  upside: 34.2, trigger: 'Analyst avg target; requires geo de-escalation + ECB stabilization + RoTE → 14%' },
    { price: 5.10, label: 'Bull case', horizon: '12–18 months', upside: 51.7, trigger: 'Goldman target; full ceasefire + MSCI DM inflows + ECB cuts resume + UniCredit premium bid' },
  ],
  riskReward: '3.1:1',
  conviction: "Medium (DOWNGRADED from Medium-High — geo risk materially elevated)",
  keyConditions: [
    { label: 'April 6 Hormuz deadline outcome — binary event',                  status: 'pending', impact: 'CRITICAL — determines entry price and scenario. DO NOT enter before resolution.' },
    { label: 'MSCI Developed Market upgrade (Mar 31)',                           status: 'met',     impact: 'STRUCTURAL POSITIVE — provides medium-term floor and passive inflow anchor. Every geo dip is now a buying opportunity.' },
    { label: 'Iran FM Araghchi signals willingness to talk (Apr 5)',            status: 'emerging', impact: 'Crack in Iranian defiance — if mediators exploit before Apr 6: Ceasefire probability jumps. Watch for Pakistan/Turkey channel.' },
    { label: 'ECB April 30 rate decision — hike 88% probable',                 status: 'emerging', impact: 'Rate hike is net NII-positive but growth-negative. Pre-positioned in consensus expectations — limited surprise.' },
    { label: 'Brent crude sustains below $100/bbl',                            status: 'failed',   impact: 'FAILED — oil at $109, up from $99 on Mar 25. IEA warns April "much worse." Ceasefire needed to break $100.' },
    { label: 'ALPHA holds above 200D MA (€3.32)',                              status: 'met',      impact: 'Reclaimed on MSCI rally (Apr 1). Critical support — break below invalidates recovery thesis.' },
    { label: 'Athens market confirms MSCI rally not a head-fake',              status: 'emerging', impact: 'Apr 1 +3%+ followed by Apr 2 -0.55%. Need sustained buying above pre-MSCI levels to confirm.' },
    { label: 'Congressional vote on $200B war funding',                        status: 'pending',  impact: 'Defeat = forced ceasefire timeline. Very positive for ALPHA. GOP lacks votes within own party.' },
    { label: 'Mojtaba Khamenei status — alive, injured, or dead?',            status: 'pending',  impact: 'Absent since March 12. Confirmation of incapacitation → Regime Collapse risk rises to 15-20%.' },
  ],
  bearCase: 'If April 6 infrastructure strikes trigger coordinated Houthi-Hezbollah-PMF retaliation: Conflagration (25% probability). Oil $130-150+. Eurozone recession. Greek spreads blow out 100bps+. ALPHA retests €2.00-2.50 (-25% to -40%). This is no longer a tail risk — it is a QUARTER PROBABILITY event. The MSCI upgrade provides a structural floor around €2.30-2.50 (0.6x book) but cannot prevent the drawdown. Position sizing must account for this: maximum 50% of intended allocation before geo clarity.',
  disclaimer: 'Analytical data only. Not financial advice. Consult a qualified advisor.',
}

/* ─── ANALYSIS GAPS ──────────────────────────────────────────── */
const analysisGaps = [
  {
    topic: 'April 6 Deadline Outcome Modeling',
    description: 'Trump\'s Hormuz ultimatum expires April 6. Need real-time scenario modeling of Alpha Bank price paths under each outcome: strikes + capitulation, strikes + retaliation, deadline extension, mediation breakthrough.',
    issueTitle: 'URGENT: Extend Alpha Bank analysis: April 6 deadline outcome modeling — price paths per scenario',
  },
  {
    topic: 'MSCI Developed Market Inflow Quantification',
    description: 'Greece upgraded to DM (effective May 2027). Need detailed modeling of passive fund inflows: which indices add Greece, estimated AUM allocation, timeline, and Alpha Bank\'s specific weight/benefit.',
    issueTitle: 'Extend Alpha Bank analysis: MSCI DM upgrade — quantify passive fund inflows, index weights, and timeline for Alpha Bank',
  },
  {
    topic: 'ECB Rate Hike Impact on Alpha Bank NII',
    description: 'ECB rate hike at April 30 is 88% probable. Need precise NII sensitivity modeling: impact per 25bps on NII, deposit beta assumptions, loan repricing lag, and net P&L effect.',
    issueTitle: 'Extend Alpha Bank analysis: ECB rate hike NII sensitivity — deposit beta, loan repricing, net earnings impact',
  },
  {
    topic: 'Currency Risk: EUR/USD & RON/EUR',
    description: 'Alpha Bank has ~10% Romania exposure. RON/EUR volatility and EUR/USD impact on institutional flows remain unanalyzed.',
    issueTitle: 'Extend Alpha Bank analysis: Add EUR/USD and RON/EUR currency risk analysis for Romania loan book',
  },
  {
    topic: 'UniCredit Takeover Scenario Analysis',
    description: 'UniCredit holds 29.8% direct + instruments to 32.1%. A full takeover bid at premium is plausible. Model bid price, regulatory hurdles, and probability.',
    issueTitle: 'Extend Alpha Bank analysis: UniCredit takeover scenario — bid price, ECB/SSM approval odds, premium analysis',
  },
  {
    topic: 'Conflagration Stress Test',
    description: 'With Conflagration at 25% probability, need formal stress test: oil at $150, ECB emergency hike, Greek spread blowout, NPE impact on Alpha\'s loan book, CET1 drawdown under extreme scenario.',
    issueTitle: 'Extend Alpha Bank analysis: Conflagration stress test — $150 oil, ECB emergency hike, NPE spike, CET1 impact',
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
