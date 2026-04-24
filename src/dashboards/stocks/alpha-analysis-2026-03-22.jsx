import StockDashboard from '../../components/StockDashboard'

/* ─── DATA (Updated April 24, 2026) ──────────────────────────── */
const stock = {
  name: 'Alpha Bank',
  ticker: 'ALPHA.AT',
  adr: 'ALBKY',
  exchange: 'Athens Stock Exchange',
  date: '2026-04-24',
  price: 3.580,
  change: -0.080,
  changePct: -2.05,
  open: 3.66,
  high52w: 4.489,
  low52w: 2.084,
  marketCap: '€8.35B',
  pe: 8.61,
  peForward: 7.73,
  eps: 0.416,
  bookValue: 3.90,
  pbRatio: 0.92,
  dividendYield: 3.63,
  dividendPerShare: 0.13,
  payoutRatio: 55,
  beta: 0.81,
  sharesOut: '2.27B',
  sector: 'Banking — Greece',
  overallSignal: 'BUY (Oversold)',
  analystConsensus: 'Strong Buy',
  analystCount: 13,
  avgTarget: 4.57,
  highTarget: 5.50,
  lowTarget: 3.12,
  chartNote: 'Stock rallied +13% from €3.36 to €3.81 on Iran ceasefire (Apr 8-21), then pulled back to €3.58 as ECB hike looms (Apr 30) and Islamabad talks stalled. Now deeply oversold (RSI 34.4, Williams %R -100) below all short-term MAs but above 200D MA (€3.45). Brent eased to $104-106 from $109 but Hormuz blockade continues. MSCI DM upgrade structural positive. ECB "layer cake of shocks" rhetoric weighing on sentiment. Pullback into support zone creates potential entry.',
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
  { date: 'Mar-31', price: 3.28 },
  { date: 'Apr-1', price: 3.47 },
  { date: 'Apr-2', price: 3.361 },
  { date: 'Apr-4', price: 3.15 },
  { date: 'Apr-8', price: 3.45 },
  { date: 'Apr-11', price: 3.68 },
  { date: 'Apr-14', price: 3.72 },
  { date: 'Apr-17', price: 3.80 },
  { date: 'Apr-21', price: 3.81 },
  { date: 'Apr-24', price: 3.58 },
]

const maData = [
  { name: '5-Day MA',   value: 3.61, signal: 'SELL',  current: 3.58 },
  { name: '20-Day MA',  value: 3.65, signal: 'SELL',  current: 3.58 },
  { name: '50-Day MA',  value: 3.73, signal: 'SELL',  current: 3.58 },
  { name: '200-Day MA', value: 3.45, signal: 'BUY',   current: 3.58 },
]

const technicals = {
  priceRange: [1.5, 4.8],
  maSignalSummary: '1 of 4 MAs signal Buy (200D only). Price pulled back sharply from €3.81 ceasefire-rally high to €3.58, falling below 5D (€3.61), 20D (€3.65), and 50D (€3.73) MAs. Crucially still above 200D MA (€3.45) — the long-term trend remains intact. The pullback is driven by ECB hawkish rhetoric ahead of Apr 30 meeting and stalled Iran talks. RSI at 34.4 and Williams %R at -100 signal deeply oversold conditions — historically a reversal zone for ALPHA. A bounce from the 200D MA toward the 20D MA (€3.65) would be the first bullish signal.',
  oscillators: [
    { label: 'RSI (14-day)',      value: '34.4',  signal: 'SELL',    note: 'Approaching oversold territory (<30). Last time RSI was this low (late Mar): stock bounced +19% to €3.81' },
    { label: 'MACD',             value: '-0.038', signal: 'SELL',    note: 'Below signal line after ceasefire rally faded. Histogram narrowing — bearish momentum may be exhausting' },
    { label: 'Stochastic (9,6)', value: '28.6',  signal: 'SELL',    note: 'Near oversold zone. A cross above 20 from below would trigger buy signal' },
    { label: 'Williams %R',      value: '-100',  signal: 'SELL',    note: 'Maximum oversold — has historically preceded 5-15% bounces within 5-10 sessions' },
    { label: 'ADX (14)',         value: '26.5',  signal: 'SELL',    note: 'Moderate trend strength in the bearish direction. Above 25 confirms a real trend, not noise' },
  ],
  supportLevels: [
    { level: 4.489, label: '52W High / Major Resistance',          type: 'resistance' },
    { level: 3.81,  label: 'Apr 21 Ceasefire Rally High',          type: 'resistance' },
    { level: 3.73,  label: '50-Day MA / Key Resistance',           type: 'resistance' },
    { level: 3.65,  label: '20-Day MA / Near Resistance',          type: 'resistance' },
    { level: 3.61,  label: '5-Day MA / Immediate Resistance',      type: 'resistance' },
    { level: 3.580, label: 'Current Price (Apr 24 close)',         type: 'current' },
    { level: 3.45,  label: '200-Day MA / Critical Support',        type: 'support' },
    { level: 3.28,  label: 'Mar 31 Pre-MSCI Level / Support',      type: 'support' },
    { level: 3.15,  label: 'Apr 4 Ultimatum Low / Support',        type: 'support' },
    { level: 2.95,  label: 'Mar Intraday Low / Strong Support',    type: 'support' },
    { level: 2.48,  label: 'October 2025 Base / Major Support',    type: 'support' },
    { level: 2.084, label: '52W Low / Floor',                      type: 'support' },
  ],
  priceNote: 'Price pulled back 6% from the Apr 21 ceasefire-extension high (€3.81) to €3.58 on Apr 24. The selloff is driven by three factors: (1) ECB "layer cake of shocks" rhetoric on Apr 16 raised hike certainty to near-100%, (2) Islamabad peace talks stalled as Iran refuses to negotiate under US naval blockade, (3) profit-taking after the 13% ceasefire rally. The 200D MA (€3.45) is the critical support — 13 cents below current price. A break below would negate the medium-term uptrend and expose €3.15 (April 4 ultimatum low). However, the deeply oversold RSI (34.4) and Williams %R (-100) historically precede reversals. The ECB Apr 30 decision is the next catalyst — a hawkish hold could trigger the bounce; a larger-than-expected hike could push through the 200D MA.',
}

const fundamentalData = {
  valuation: [
    { label: 'P/E (TTM)',     value: 8.61,              bench: '8–10×',       note: 'Fair vs sector ~9× for Greek banks; cheapened by pullback',  ok: true },
    { label: 'P/E (Forward)', value: 7.73,              bench: '7–9×',        note: 'Cheap on 2026E pre-AT1 earnings (€0.463)',                   ok: true },
    { label: 'P/B Ratio',     value: 0.92,              bench: '0.9–1.1×',    note: 'Still below book — MSCI upgrade narrows gap over 12-18 months', ok: true },
    { label: 'PEG Ratio',     value: '0.58',            bench: '<1 = cheap',  note: 'Strong EPS growth path; 11% normalised growth guided',       ok: true },
    { label: 'Div. Yield',    value: '3.63%',           bench: '2–4% sector', note: 'In-line; buyback program adds ~1.5% total return',           ok: true },
    { label: 'Payout Ratio',  value: '55%',             bench: '40–60%',      note: 'Sustainable — split 50/50 dividends + buybacks',             ok: true },
  ],
  scorecard: [
    { label: 'Valuation',      score: 8, note: 'P/B 0.92x — still below book; P/E 8.6x vs sector 9x. MSCI DM upgrade should compress discount. Pullback improved entry.' },
    { label: 'Profitability',  score: 7, note: 'RoTE 12.9% reported, 13.8% normalized. Improving but not sector-leading vs Eurobank (15.2%).' },
    { label: 'Capital Quality',score: 8, note: 'CET1 15.0% — robust; 206bps organic capital generated in FY2025. Well above sector avg 15.6%.' },
    { label: 'Asset Quality',  score: 9, note: 'NPE ~3.0%, declining. Sector avg 2.6%. Scope Ratings: risk costs falling below 50bps.' },
    { label: 'Dividend',       score: 7, note: '3.63% yield + active buyback (61M treasury shares, 2.63% of capital). Total return ~5-5.5%.' },
    { label: 'Growth Outlook', score: 8, note: 'NII >€1.7B guided for 2026; fee income → €600M target. ECB hike would boost NII. Q2 investor day expected.' },
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
  { bank: 'Alpha Bank', pe: 8.61, pb: 0.92, rote: 12.9, cet1: 15.0, npe: 3.0, target: 4.57, divYield: 3.63 },
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
  { firm: 'Goldman Sachs',  target: 5.10, rating: 'Buy',        upside: 42 },
  { firm: 'Deutsche Bank',  target: 4.45, rating: 'Buy',        upside: 24 },
  { firm: 'UBS',            target: 4.30, rating: 'Buy',        upside: 20 },
  { firm: 'Citi',           target: 4.10, rating: 'Buy',        upside: 15 },
  { firm: 'JPMorgan',       target: 3.90, rating: 'Overweight', upside: 9 },
  { firm: 'Morgan Stanley', target: 4.20, rating: 'Overweight', upside: 17 },
  { firm: 'Barclays',       target: 3.12, rating: 'Hold',       upside: -13 },
]

const eventImpacts = [
  { event: 'US-Iran Ceasefire Agreed (Apr 8) — Extended Indefinitely (Apr 21)',   level: 'Critical', direction: 'Positive', rationale: 'Two-week ceasefire mediated by Pakistan on Apr 8 — called off Trump\'s "Power Plant Day" strikes. Extended indefinitely Apr 21 after Iran described as "seriously fractured." Ceasefire reduced Conflagration risk from 25% to 12%. Oil dropped from $109 to $104-106. Alpha rallied +13% from €3.36 to €3.81. However: US naval blockade of Iranian ports continues, Hormuz traffic remains a trickle, and Iran refuses to negotiate "under shadow of threats." Ceasefire is fragile — could collapse if talks fail.' },
  { event: 'Islamabad Talks Stalled — Iran Demands Blockade Removal (Apr 11-24)', level: 'High',     direction: 'Negative', rationale: 'Vance-led 300-member US team vs Ghalibaf-led 70-member Iranian team at Islamabad Talks (Apr 11-12). First round failed. Iran\'s core demand: blockade removal before negotiations. US demand: Hormuz fully reopened + nuclear verification. Impasse persists. US envoys heading back to Pakistan Apr 24 for fresh talks. Stalemate keeps oil elevated and blocks full risk-off rally for Greek equities.' },
  { event: 'ECB April 30 Rate Decision — Hike 88% Probable',                     level: 'Critical', direction: 'Mixed',    rationale: 'ECB held at 2.15% in March. April 30 meeting near-certain to deliver 25bps hike. March CPI 2.6%, energy inflation surged to +5.1%. ECB staff projects inflation surging to 3.1% in Q2 on Middle East energy shock. Markets pricing deposit rate reaching 2.5%+ by year-end (50bps+ of hikes). SHORT-TERM: Higher rates boost Alpha NII (positive). MEDIUM-TERM: Tighter conditions slow growth, compress multiples, raise NPE risk (negative). ECB Governing Council member described the economic environment as a "layer cake of shocks" on Apr 16.' },
  { event: 'MSCI Developed Market Upgrade (Mar 31 — effective May 2027)',         level: 'High',     direction: 'Positive', rationale: 'Greece upgraded from Emerging to Developed Market status — first time since 2013. Implementation confirmed for May 2027 index review. Passive fund inflows est. $2-4B over 12-18 months. Alpha Bank as largest private bank is a primary beneficiary. Structural re-rating catalyst that operates on a 12-18 month horizon. Athens General Index up 8.7% in past month, up 31% YoY. Provides medium-term floor under the stock.' },
  { event: 'S&P/Fitch Greece Reviews Due April-May 2026',                         level: 'High',     direction: 'Positive', rationale: 'Greece currently at BBB (Fitch upgraded from BBB- in Nov 2025). S&P and Fitch reviews expected in April and May 2026. Further sovereign upgrade would reduce funding costs for Greek banks, expand investor base, and support re-rating. All four systemic banks already at investment grade with positive outlooks. A sovereign upgrade to BBB+ would be a significant catalyst for Alpha.' },
  { event: 'Alpha Bank Share Buyback Active (Apr 14-17: 2.15M shares at €3.77)',  level: 'Medium',   direction: 'Positive', rationale: 'Management buying at avg €3.77 — above current price of €3.58. Total treasury shares now 61M (2.63% of outstanding). Part of €519M total distribution (55% payout, split 50/50 dividends/buybacks). Management buying into the pullback signals conviction. Accretive to EPS and P/B.' },
  { event: 'UniCredit Stake 29.8% Direct → Instruments to 32.1%',                level: 'Medium',   direction: 'Positive', rationale: 'Converted to direct holding Jan 5. Financial instruments (TRS, options) for additional 2.3% expired Q1. CEO Orcel building cooperation without triggering mandatory takeover bid. Strategic anchor investor. Boosts wholesale banking and institutional credibility.' },
  { event: 'AstroBank Integration — Digital Unification Completing 2026',         level: 'Medium',   direction: 'Positive', rationale: 'Created Cyprus\' 3rd-largest bank (€6.6B assets). Digital platform, cards, and applications unification completing in 2026. Altius-Universal Life insurance merger expected Q3 2026 — creates top-3 Cyprus insurer. RoCET >20% expected from Cyprus. 2026 is "year of consolidation and targeted growth" per Cyprus CEO.' },
  { event: 'Q4 2025 Results Beat — Profit +44% YoY, Q1 2026 Pending',            level: 'High',     direction: 'Positive', rationale: 'FY2025 net profit €943M (+44% YoY). Fee income +19% YoY. CET1 at 15.0%. For FY2026: guides normalized EPS ~€0.40, NII >€1.7B, 11% earnings growth. Q2 2026 investor day to lay out new strategic priorities. Q1 2026 results not yet reported.' },
  { event: 'Greek GDP Growth 1.8-2.2% (2026 Forecasts)',                          level: 'Medium',   direction: 'Positive', rationale: 'EC forecasts 2.2%, IMF 1.8% for 2026. Greece outperforming Eurozone avg (0.9%). Investment-grade; RRP-driven investment robust. Corporate lending double-digit growth. However, IMF warns inflation may reach 3.5% in Greece in 2026 due to energy costs.' },
  { event: 'Israel-Lebanon Ceasefire Extended 3 Weeks (Apr 21)',                  level: 'Medium',   direction: 'Positive', rationale: 'Fragile Lebanon ceasefire extended after White House talks. However, Israel and Hezbollah continue exchanging attacks during the extension. Partial de-escalation of the broader Middle East conflict reduces tail risk for European banks. But risk persists — any breakdown reignites regional conflagration fears.' },
  { event: 'Basel IV / EU CRR3 Phase-In (2025-2030)',                             level: 'Medium',   direction: 'Negative', rationale: 'New capital output floors could require 10-15% more RWA capital by 2030. Est. impact: -80 to -130bps CET1. Current 15.0% buffer adequate. Scope Ratings: stable outlook for Greek banks despite regulatory phase-in.' },
]

const keyMetrics = [
  { label: 'Net Profit FY2025',      value: '€943.3M',  change: '+44% YoY',                pos: true  },
  { label: 'CET1 Capital Ratio',     value: '15.0%',    change: '206bps organic generation', pos: true  },
  { label: 'NPE Ratio',              value: '~3.0%',    change: 'Sector avg 2.6%, declining', pos: true  },
  { label: 'Cost-to-Income',         value: '39.5%',    change: 'Target: ~37%',             pos: true  },
  { label: 'RoTE (Normalised)',       value: '13.8%',    change: 'Vs 14-15% peers',          pos: null  },
  { label: 'Net Interest Income',    value: '€1.65B',   change: '2026 guide: >€1.7B',      pos: true  },
  { label: 'Fee Income',             value: '€582M',    change: '+19% YoY; target €620M',  pos: true  },
  { label: 'Total Distribution',     value: '€519M',    change: '55% payout + buyback',     pos: true  },
  { label: 'UniCredit Stake',        value: '29.8%',    change: 'Instruments to 32.1%',     pos: true },
  { label: 'Treasury Shares',        value: '61.0M',    change: '2.63% of capital; buying at €3.77', pos: true },
  { label: 'Brent Crude (Apr 24)',   value: '$104-106', change: 'Down from $109; blockade continues', pos: null },
  { label: 'MSCI Status',           value: 'Developed', change: 'Effective May 2027; $2-4B inflows', pos: true },
]

const newsItems = [
  {
    headline: "Trump extends Iran ceasefire indefinitely, citing 'seriously fractured' Tehran government",
    source: "CNBC",
    date: "2026-04-21",
    url: "https://www.cnbc.com/2026/04/21/trump-iran-war-ceasefire.html",
    sentiment: "positive",
  },
  {
    headline: "US envoys to head to Pakistan for fresh Iran peace talks as blockade standoff grows",
    source: "CNN",
    date: "2026-04-24",
    url: "https://www.cnn.com/2026/04/24/world/live-news/iran-war-trump-israel-lebanon",
    sentiment: "neutral",
  },
  {
    headline: "ECB keeps markets guessing on rates with two weeks to go, warns of 'layer cake of shocks'",
    source: "CNBC",
    date: "2026-04-16",
    url: "https://www.cnbc.com/2026/04/16/ecb-interest-rates-hike-inflation-iran-washington.html",
    sentiment: "negative",
  },
  {
    headline: "Eurozone March inflation revised up to 2.6% — energy costs surge 5.1% on Iran conflict",
    source: "Eurostat",
    date: "2026-04-16",
    url: "https://ec.europa.eu/eurostat/web/products-euro-indicators/w/2-16042026-ap",
    sentiment: "negative",
  },
  {
    headline: "MSCI upgrades Greece to Developed Market status — first time since 2013",
    source: "Bloomberg",
    date: "2026-03-31",
    url: "https://www.bloomberg.com/news/articles/2026-03-31/msci-names-greece-a-developed-market-for-first-time-since-2013",
    sentiment: "positive",
  },
  {
    headline: "Alpha Bank completes share buyback: 2.15M shares at €3.77 avg (Apr 14-17)",
    source: "Cyprus Inform",
    date: "2026-04-17",
    url: "https://www.kiprinform.com/en/cyprus_news/alpha-bank-completes-share-buyback-acquiring-2-15-million-shares-on-athens-stock-exchange/",
    sentiment: "positive",
  },
  {
    headline: "Scope Ratings: Stable outlook for Greek banks — resilient profits amid geopolitical risks",
    source: "Athens Times",
    date: "2026-04-10",
    url: "https://athens-times.com/scope-ratings-stable-outlook-and-resilient-profits-for-greek-banks-amid-geopolitical-risks/",
    sentiment: "positive",
  },
  {
    headline: "S&P Global revises outlook on Greek banks to Positive on sovereign re-rating momentum",
    source: "S&P Global",
    date: "2026-04-01",
    url: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/sourceId/101666174",
    sentiment: "positive",
  },
  {
    headline: "Deutsche Bank raises target prices for Greek banks — top pick Eurobank",
    source: "Sofokleous10",
    date: "2026-03-19",
    url: "https://sofokleous10.gr/2026/03/19/deutsche-bank-raises-target-prices-for-greek-banks-top-pick-eurobank/",
    sentiment: "positive",
  },
  {
    headline: "IMF forecasts 1.8% growth and 3.5% inflation for Greece in 2026",
    source: "Athens Times",
    date: "2026-04-14",
    url: "https://athens-times.com/imf-forecasts-1-8-growth-and-3-5-inflation-for-greece-in-2026/",
    sentiment: "neutral",
  },
  {
    headline: "Alpha Bank Cyprus CEO: 2026 will be year of consolidation and targeted growth",
    source: "Cyprus Business Now",
    date: "2026-03-28",
    url: "https://www.cbn.com.cy/article/125468/christoforos-stylianides-2026-will-be-a-year-of-consolidation-and-targeted-growth-for-alpha-bank-cyprus-in-2026",
    sentiment: "positive",
  },
  {
    headline: "EIA boosts 2026 Brent oil price projection to $96 — blockade risk premium persists",
    source: "Rigzone",
    date: "2026-04-15",
    url: "https://www.rigzone.com/news/eia_boosts_2026_brent_oil_price_projection_to_96-15-apr-2026-183451-article/",
    sentiment: "negative",
  },
]

/* ─── GEOPOLITICAL CROSS-REFERENCE: US-IRAN WAR / CEASEFIRE ────── */
const geoOverlay = {
  analysis: 'US–Iran War: Operation Epic Fury — Ceasefire Day 16 / Talks Stalled',
  analysisPath: '/geo/us-iran-war',
  date: '2026-04-24',
  relevance: 'HIGH — The Iran war has shifted from active combat to a fragile ceasefire with indefinite extension. The April 6 "Power Plant Day" deadline that dominated the last analysis was averted by Pakistan-mediated ceasefire on April 8. Ceasefire extended indefinitely on April 21. However, US naval blockade of Iranian ports continues, Hormuz traffic remains minimal, and Islamabad talks have stalled as Iran refuses to negotiate "under shadow of threats." Oil eased from $109 to $104-106 but remains elevated due to ongoing disruption. The Conflagration risk has dropped sharply (25%→12%) but the Stalemate risk has risen (22%→35%). ECB now near-certain to hike on Apr 30, driven by energy inflation from the blockade. For Alpha Bank: the acute binary event risk is gone, replaced by grinding uncertainty that caps the re-rating thesis.',
  keyChannels: [
    { channel: 'Oil → Inflation → ECB Rate Hike', detail: 'Brent at $104-106 (down from $109 at last analysis). Ceasefire eased acute pressure but blockade keeps prices elevated. March CPI 2.6%, energy +5.1%. Q2 inflation projected at 3.1%. ECB near-certain to hike 25bps on Apr 30, markets pricing 2.5%+ deposit rate by year-end. SHORT-TERM: higher rates boost NII (positive ~€20-30M per 25bps). MEDIUM-TERM: stagflation risk — growth slows, loan demand drops, NPE risk rises (negative). Net for Alpha: earnings mildly positive, valuation multiple negative.', severity: 'Critical' },
    { channel: 'Ceasefire → Risk Sentiment → Greek Equities', detail: 'Ceasefire reduced tail risk significantly — Conflagration probability dropped from 25% to 12%. Athens General Index up 8.7% in past month. But the stalemate (blockade + stalled talks) prevents a full risk-off rally. Greek sovereign spreads have partially normalized but remain wider than pre-war. MSCI DM upgrade provides structural floor.', severity: 'High' },
    { channel: 'MSCI DM Upgrade → Structural Floor', detail: 'Greece\'s MSCI Developed Market upgrade (effective May 2027) creates a structural bid under Greek equities. Passive fund inflows estimated $2-4B over 12-18 months. This provides a medium-term floor that partially insulates Alpha from further geo shocks. The floor is estimated around €3.20-3.40 (0.85x book).', severity: 'High' },
    { channel: 'Blockade → Hormuz → Energy Supply', detail: 'Hormuz traffic at "relative trickle" despite ceasefire. US naval blockade of Iranian ports continues as leverage. Iran demands blockade removal as precondition for talks. This impasse keeps Brent at $100+ and drives the ECB hawkish stance. Resolution of the blockade is the key catalyst for oil normalization and Alpha re-rating.', severity: 'Critical' },
    { channel: 'SE Europe Spillover → Romania', detail: 'Romania (~10% of Alpha loan book) exposed to energy prices and Balkans instability. Ceasefire reduced acute risk. Israel-Lebanon ceasefire extended 3 weeks. But ongoing energy shock weighs on Eastern European growth.', severity: 'Medium' },
  ],
  scenarios: [
    { name: 'Prolonged Stalemate / Cold Standoff',   probability: 35, color: '#f59e0b', priceImpact: '-5% to +5%', direction: 'Neutral-Negative', rationale: 'Ceasefire holds but talks drag for months. Blockade continues. Oil $95-110. ECB hikes. Alpha drifts in €3.40-3.80 range. No re-rating catalyst. THIS IS ESSENTIALLY THE CURRENT SCENARIO. Management buyback at €3.77 provides some support.' },
    { name: 'Negotiated Settlement',                  probability: 25, color: '#10b981', priceImpact: '+20% to +35%', direction: 'Strongly Positive', rationale: 'Pakistan/US/Iran mediators bridge gap over 1-3 months. Hormuz reopens fully. Blockade lifted. Oil collapses to $75-85. ECB pivots back to cuts. Alpha surges to €4.20-4.57 as MSCI + peace = full re-rating. Requires Iran to accept modified terms and US to lift blockade. UPGRADED from 15% — ceasefire existence proves both sides can negotiate.' },
    { name: 'Escalatory Resolution (Coerced)',        probability: 18, color: '#06b6d4', priceImpact: '-10% then +15%', direction: 'Volatile then Positive', rationale: 'Talks fail completely. Trump resumes infrastructure strikes or tightens blockade to force Iranian capitulation within 2-4 weeks. Short-term negative (risk-off), medium-term positive (oil drops on resolution). Alpha: initial drop to €3.20-3.40, then recovery to €3.80+.' },
    { name: 'Ceasefire Collapse / Conflagration',     probability: 12, color: '#ef4444', priceImpact: '-20% to -35%', direction: 'Strongly Negative', rationale: 'Ceasefire breaks down on blockade dispute or proxy provocation. War resumes with Houthi-Hezbollah-PMF escalation. Oil $130-150+. Eurozone recession. Alpha retests €2.50-2.80. SHARPLY REDUCED from 25% — ceasefire existence and Trump\'s willingness to extend indicate preference for diplomacy over escalation.' },
    { name: 'Regime Change / Nuclear Crisis',         probability: 10, color: '#dc2626', priceImpact: '-40%+', direction: 'Catastrophic', rationale: 'Trump cited Iran\'s government as "seriously fractured." If combined military/economic pressure topples Islamic Republic or triggers nuclear breakout: global market panic. Tail risk — SLIGHTLY INCREASED from 8% given Trump\'s "fractured government" language and extended blockade pressure on Iranian economy.' },
  ],
  probabilityWeightedImpact: 'Net probability-weighted impact: -1% to +5% (IMPROVED from -6% to -10% three weeks ago). Ceasefire halved the Conflagration risk and nearly doubled the Negotiated Settlement probability. The dominant scenario (35% Stalemate) is now neutral-negative rather than actively destructive. MSCI structural floor provides medium-term support. The key remaining risk is the ECB hike cycle — if energy inflation from the blockade forces 75bps+ of hikes in 2026, the growth/valuation drag could offset the NII benefit.',
  keyPoliticalSignals: [
    {
      actor: 'Donald Trump',
      role: 'US President',
      platform: 'Truth Social',
      date: '2026-04-21',
      quote: 'I have directed the Military to continue the Blockade, and to extend the Ceasefire, until such time as Iran submits a unified proposal. Their government is seriously fractured.',
      signalType: 'diplomatic',
      stockImpact: 'De-escalatory: ceasefire extended indefinitely. But blockade maintained as leverage — keeps oil elevated. "Seriously fractured" language suggests Trump believes time pressure is working. For Alpha: reduces acute risk, but blockade prevents oil normalization. Net: mildly positive for risk sentiment, neutral for oil/ECB path.',
    },
    {
      actor: 'Iran Foreign Ministry',
      role: 'Official Statement',
      platform: 'State Media',
      date: '2026-04-22',
      quote: 'Iran will not negotiate under the shadow of threats or while an illegal blockade remains in place. The blockade is a violation of the ceasefire terms.',
      signalType: 'escalatory',
      stockImpact: 'Increases Stalemate probability. Iran making blockade removal a precondition for talks creates a chicken-and-egg impasse. If maintained: oil stays $100+, ECB hikes, Alpha capped at current levels. Break in this stance would be a major positive signal.',
    },
    {
      actor: 'Donald Trump',
      role: 'US President',
      platform: 'Primetime Address to the Nation',
      date: '2026-04-01',
      quote: 'The war is nearing completion. We will hit Iran extremely hard over the next two to three weeks.',
      signalType: 'escalatory',
      stockImpact: 'Established the April 6 deadline context. Subsequently AVERTED by Pakistan ceasefire mediation. Now historical context — shows Trump was willing to escalate but also willing to accept ceasefire. Reveals preference for deal over destruction when presented with a face-saving option.',
    },
    {
      actor: 'ECB (Villeroy de Galhau)',
      role: 'Bank of France Governor / ECB GC',
      platform: 'Public Statement',
      date: '2026-04-16',
      quote: 'We face a layer cake of shocks. The energy shock from the Middle East conflict requires a firm response. Price stability is non-negotiable.',
      signalType: 'economic',
      stockImpact: 'Confirms April 30 rate hike. "Layer cake of shocks" = multiple inflationary pressures stacking. For Alpha: NII uplift ~€20-30M per 25bps hike, but growth/multiple drag. This statement drove the Apr 17-24 pullback from €3.81 to €3.58.',
    },
    {
      actor: 'Pakistani PM Shehbaz Sharif',
      role: 'Mediator',
      platform: 'Press Conference',
      date: '2026-04-08',
      quote: 'I requested President Trump to hold off the destructive force being sent tonight to Iran. He agreed.',
      signalType: 'de-escalatory',
      stockImpact: 'The statement that averted "Power Plant Day." Ceasefire triggered +13% rally in Alpha. Pakistan\'s continued mediation role is the key diplomatic channel. Any signals from Islamabad about progress = positive for Alpha.',
    },
    {
      actor: 'Abbas Araghchi',
      role: 'Iran Foreign Minister',
      platform: 'Islamabad Talks',
      date: '2026-04-12',
      quote: 'We came here in good faith. But we cannot negotiate while our ports are blockaded and our people starve. Lift the blockade, then we talk.',
      signalType: 'diplomatic',
      stockImpact: 'Confirms Iran is willing to engage but not under current conditions. This is the core impasse. Resolution requires either: (1) US partial blockade easing as confidence-building measure, or (2) Iran accepting talks despite blockade. Either would be massive positive for oil and Alpha.',
    },
  ],
}

const riskNotices = [
  {
    type: 'Monetary Policy — IMMINENT',
    icon: '🏦',
    event: 'ECB Rate Hike 88% Probability at April 30 Meeting — 6 Days Away',
    description: 'ECB near-certain to deliver 25bps hike on April 30. March CPI revised up to 2.6%, energy inflation at +5.1%. Markets pricing deposit rate reaching 2.5%+ by year-end. ECB GC member described economic outlook as "layer cake of shocks." For Alpha: NII upside from higher rates, but growth/valuation downside from tighter conditions. This is the IMMEDIATE catalyst driving the pullback from €3.81 to €3.58.',
    impact: 'Critical',
    impactColor: '#ef4444',
    suggestion: 'Monitor ECB April 30 decision and press conference closely. A 25bps hike is priced in — watch for forward guidance: hawkish (more hikes signaled) = negative for Alpha multiple; dovish hold (one-and-done) = positive. Alpha is deeply oversold (RSI 34.4) going into the decision — a dovish surprise could trigger a sharp bounce.',
  },
  {
    type: 'Geopolitical — FRAGILE CEASEFIRE',
    icon: '🇮🇷',
    event: 'US-Iran Ceasefire Holding But Talks Stalled — Blockade Continues',
    description: 'Ceasefire agreed Apr 8, extended indefinitely Apr 21. But Islamabad talks stalled — Iran demands blockade removal as precondition, US demands Hormuz reopened. US envoys heading to Pakistan Apr 24 for fresh round. Hormuz traffic at a "trickle." Oil at $104-106. Conflagration risk reduced to 12% (from 25%) but stalemate risk elevated to 35%. Ceasefire could collapse if proxy forces provoke or talks fail permanently.',
    impact: 'High',
    impactColor: '#f59e0b',
    suggestion: 'The ceasefire has transformed the risk profile from "binary event" to "grinding uncertainty." Monitor Islamabad talks for breakthrough signals. Any indication of partial blockade easing or Iran returning to talks = strong positive for Alpha. Ceasefire breakdown = immediate risk-off.',
  },
  {
    type: 'Structural Positive',
    icon: '📈',
    event: 'MSCI Developed Market Upgrade (Effective May 2027) + S&P/Fitch Reviews Due',
    description: 'Greece upgraded to DM status Mar 31. Implementation May 2027. Passive fund inflows $2-4B est. S&P review due April 2026, Fitch review May 2026. Greece currently at BBB (Fitch upgraded Nov 2025). Further sovereign upgrade to BBB+ would be significant catalyst. S&P Global already revised Greek bank outlooks to Positive.',
    impact: 'High',
    impactColor: '#10b981',
    suggestion: 'MSCI + potential sovereign upgrades create a structural re-rating trajectory that operates independently of the Iran conflict. Every geo-driven dip below €3.50 is a structural accumulation opportunity on this thesis alone.',
  },
  {
    type: 'Technical — OVERSOLD',
    icon: '📉',
    event: 'RSI 34.4 / Williams %R -100 — Deeply Oversold After -6% Pullback',
    description: 'Alpha Bank pulled back from €3.81 (Apr 21) to €3.58 (Apr 24) as ECB hike fears and stalled talks weighed. RSI at 34.4, Williams %R at -100, price below 5D/20D/50D MAs but above 200D MA (€3.45). Last time these oversold levels were reached (late March): stock bounced +19% over the next 3 weeks.',
    impact: 'Medium',
    impactColor: '#06b6d4',
    suggestion: 'Oversold technicals are a tactical buying signal, NOT a fundamental all-clear. Wait for ECB Apr 30 decision before acting. If ECB delivers expected 25bps with no hawkish surprise: buy the oversold bounce toward €3.73 (50D MA). If ECB signals aggressive hiking cycle: wait for 200D MA test at €3.45.',
  },
  {
    type: 'Geopolitical',
    icon: '🇺🇦',
    event: 'Russia–Ukraine War — Year 4 (Peace Talks Still on Hold)',
    description: 'Conflict continues. Romania (~10% of Alpha loan book) in spillover zone. Peace talks paused since March. Israel-Lebanon ceasefire extended 3 weeks but fragile.',
    impact: 'Medium',
    impactColor: '#f59e0b',
    suggestion: 'See Russia–Ukraine War dashboard. Secondary risk — manageable at current probability.',
  },
  {
    type: 'Regulatory',
    icon: '⚖️',
    event: 'Basel IV / EU CRR3 Capital Requirements (Phased 2025–2030)',
    description: 'New capital output floors phase in from Jan 2025. Could require Greek banks to hold 10–15% more RWA capital by 2030. Est. impact: -80 to -130bps CET1. Scope Ratings: stable outlook despite phase-in.',
    impact: 'Medium',
    impactColor: '#f59e0b',
    suggestion: "Monitor Alpha Bank's disclosed Basel IV impact against current 15.0% CET1 ratio. Buffer is adequate.",
  },
]

/* ─── VERDICT ────────────────────────────────────────────────── */
const verdict = {
  stance: "CAUTIOUS BUY — ACCUMULATE ON OVERSOLD PULLBACK",
  stanceColor: "#10b981",
  stanceBg: "rgba(16,185,129,0.1)",
  timing: "Initiate 50% position now; add on ECB Apr 30 clarity",
  timingDetail: "The situation has IMPROVED MATERIALLY since the April 5 analysis. The April 6 'Power Plant Day' deadline — which was a 25% Conflagration event — was averted by Pakistan-mediated ceasefire on April 8. The ceasefire was extended indefinitely on April 21. Conflagration risk dropped from 25% to 12%. Alpha rallied +13% from €3.36 to €3.81 on the ceasefire, then pulled back to €3.58 on ECB hike concerns and stalled talks.\n\nThe pullback has created a TACTICAL BUYING OPPORTUNITY. Alpha is deeply oversold (RSI 34.4, Williams %R -100) at levels that historically precede 10-19% bounces. The stock trades at 0.92x book, 7.7x forward P/E, with management actively buying back shares at €3.77 (above current price). The fundamental thesis is intact: MSCI DM upgrade, S&P/Fitch review upgrades pending, NII upside from ECB hike, and FY2026E net profit of €1.05B.\n\nPOSITION SIZING STRATEGY:\n• PHASE 1 (NOW): Initiate 50% of target position at €3.55-3.60. Stop at €3.20 (-10.6%). The oversold bounce is the near-term trade.\n• PHASE 2 (POST-ECB Apr 30): If ECB delivers 25bps with dovish forward guidance → add remaining 50% on bounce toward €3.73. If ECB signals aggressive hiking cycle → wait for 200D MA test at €3.45 to add.\n• If Islamabad talks produce breakthrough → full position immediately. Oil drops → ECB pivots → Alpha gaps to €4.20+.\n• If ceasefire collapses → stop out at €3.20, reassess at €2.80 for structural MSCI-floor entry.\n\nThe MSCI DM upgrade means every geo-driven dip below €3.50 is a structural buying opportunity on a 12-18 month horizon. The question is no longer WHETHER to buy Alpha, but WHEN and HOW MUCH.",
  entryZone: { low: 3.45, high: 3.60, ideal: 3.55 },
  stopLoss:  { price: 3.20, pct: -10.6, rationale: 'Below Apr 4 ultimatum low (€3.15) and well below 200D MA (€3.45). Triggers only in ceasefire collapse scenario (12% probability). Tight enough to protect capital, wide enough to survive ECB-driven volatility.' },
  targets: [
    { price: 3.73, label: 'Target 1',  horizon: '1–2 weeks',     upside: 4.2,  trigger: 'Oversold bounce to 50D MA; ECB Apr 30 dovish hold or expected hike with no hawkish surprise' },
    { price: 4.00, label: 'Target 2',  horizon: '1–3 months',    upside: 11.7, trigger: 'Iran talks progress; partial blockade easing; oil drops below $95; Fitch/S&P sovereign upgrade' },
    { price: 4.57, label: 'Consensus', horizon: '6–12 months',   upside: 27.7, trigger: 'Analyst avg target; requires Hormuz reopened + oil normalized + MSCI passive inflows begin + RoTE → 14%' },
    { price: 5.10, label: 'Bull case', horizon: '12–18 months',  upside: 42.5, trigger: 'Goldman target; full peace deal + MSCI DM inflows + ECB cuts resume + UniCredit premium bid' },
  ],
  riskReward: '4.1:1',
  conviction: "Medium-High (UPGRADED from Medium — ceasefire materially reduced tail risk)",
  keyConditions: [
    { label: 'Iran ceasefire extended indefinitely (Apr 21)',                    status: 'met',      impact: 'MAJOR POSITIVE — Conflagration risk halved from 25% to 12%. Active combat ceased. Diplomatic channel exists.' },
    { label: 'MSCI Developed Market upgrade (Mar 31)',                          status: 'met',      impact: 'STRUCTURAL POSITIVE — $2-4B passive inflows over 12-18 months. Floor under the stock at ~€3.20-3.40.' },
    { label: 'S&P/Fitch Greece sovereign review (Apr-May 2026)',               status: 'emerging', impact: 'Upgrade to BBB+ would be significant catalyst. S&P Global already revised Greek bank outlooks to Positive.' },
    { label: 'ECB April 30 rate decision — hike near-certain',                 status: 'pending',  impact: 'IMMEDIATE CATALYST — 25bps priced in. Watch forward guidance. Dovish = bounce; hawkish = 200D MA test.' },
    { label: 'Islamabad talks — breakthrough or failure',                      status: 'pending',  impact: 'Fresh US envoys heading to Pakistan Apr 24. Breakthrough = oil drops, Alpha surges. Failure = stalemate continues.' },
    { label: 'Hormuz blockade removal / oil normalization below $95',          status: 'failed',   impact: 'STILL FAILING — blockade continues, oil at $104-106. Key impasse: Iran demands removal, US demands Hormuz open.' },
    { label: 'ALPHA holds above 200D MA (€3.45)',                              status: 'met',      impact: 'At €3.58, 13 cents above 200D MA. Long-term uptrend intact. Break below = bearish signal.' },
    { label: 'Management buyback signals conviction',                          status: 'met',      impact: 'Buying at €3.77 avg (above current price). 61M treasury shares, 2.63% of capital. Management actions > words.' },
    { label: 'Alpha Bank oversold bounce (RSI <35, Williams %R -100)',         status: 'emerging', impact: 'Technical setup favors near-term bounce of 5-10%. Last similar setup (late Mar): stock rallied +19%.' },
  ],
  bearCase: 'If ECB delivers aggressive hiking cycle (75bps+ in 2026) AND Iran talks collapse AND ceasefire breaks down: triple negative. Oil $130+, Eurozone recession, Greek spreads blow out. ALPHA retests €2.50-2.80 (-30%). Probability of this combined scenario: ~8%. The MSCI upgrade provides a structural floor around €3.00-3.20 that limits permanent capital loss. Position sizing at 50% and stop at €3.20 protects against this tail.',
  disclaimer: 'Analytical data only. Not financial advice. Consult a qualified advisor.',
}

/* ─── ANALYSIS GAPS ──────────────────────────────────────────── */
const analysisGaps = [
  {
    topic: 'Q1 2026 Earnings Impact Assessment',
    description: 'Q1 2026 results not yet reported. Need to assess: NII trajectory under rising rate environment, fee income momentum, NPE trend, cost-to-income progress, and whether FY2026E guidance of €1.05B net profit / €0.40 EPS remains achievable.',
    issueTitle: 'Extend Alpha Bank analysis: Q1 2026 earnings — NII sensitivity, fee income, NPE, and FY guidance validation',
  },
  {
    topic: 'ECB Hiking Cycle NII Sensitivity Model',
    description: 'ECB is expected to hike 50bps+ in 2026. Need precise NII sensitivity modeling per 25bps: deposit beta assumptions, loan repricing lag, and net P&L impact. Alpha guides NII >€1.7B — how much upside does the hiking cycle provide?',
    issueTitle: 'Extend Alpha Bank analysis: ECB hiking cycle NII sensitivity — deposit beta, repricing, net impact per 25bps',
  },
  {
    topic: 'Iran Blockade Resolution Scenarios — Oil Price Paths',
    description: 'The Hormuz blockade is the key variable for oil prices and ECB policy. Model specific oil price paths under: full blockade (current), partial easing, conditional reopening, and full Hormuz normalization. Map each to ECB rate path and Alpha fair value.',
    issueTitle: 'Extend Alpha Bank analysis: Oil price paths per blockade scenario → ECB rate path → Alpha fair value',
  },
  {
    topic: 'MSCI DM Passive Inflow Quantification',
    description: 'Greece upgraded to DM (effective May 2027). Need detailed modeling: which indices add Greece, estimated AUM allocation, timeline of inflows, and Alpha Bank\'s specific weight and expected inflow share.',
    issueTitle: 'Extend Alpha Bank analysis: MSCI DM upgrade — quantify passive fund inflows, index weights, timeline for Alpha',
  },
  {
    topic: 'UniCredit Strategic Options Analysis',
    description: 'UniCredit holds 29.8% direct + instruments to 32.1%. Staying just below mandatory takeover trigger. Model scenarios: (1) gradual increase to 33%+, (2) full takeover bid — at what price? (3) status quo, (4) stake disposal. What does Orcel\'s strategy signal?',
    issueTitle: 'Extend Alpha Bank analysis: UniCredit strategic options — takeover bid price, regulatory, probability analysis',
  },
  {
    topic: 'Greece Sovereign Upgrade Impact',
    description: 'S&P review due April 2026, Fitch due May 2026. Model impact of BBB+ upgrade on: bank funding costs, CDS spreads, investor base expansion, and Alpha Bank P/B re-rating.',
    issueTitle: 'Extend Alpha Bank analysis: Greece BBB+ upgrade impact — funding costs, spreads, P/B re-rating',
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
