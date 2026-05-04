import StockDashboard from '../../components/StockDashboard'

/* ─── DATA (Updated May 4, 2026) ──────────────────────────── */
const stock = {
  name: 'Alpha Bank',
  ticker: 'ALPHA.AT',
  adr: 'ALBKY',
  exchange: 'Athens Stock Exchange',
  date: '2026-05-04',
  price: 3.440,
  change: 0.040,
  changePct: 1.18,
  open: 3.460,
  high52w: 4.489,
  low52w: 2.118,
  marketCap: '€7.75B',
  pe: 9.37,
  peForward: 8.19,
  eps: 0.38,
  bookValue: 3.90,
  pbRatio: 0.88,
  dividendYield: 3.82,
  dividendPerShare: 0.13,
  payoutRatio: 55,
  beta: 0.83,
  sharesOut: '2.25B',
  sector: 'Banking — Greece',
  overallSignal: 'EVENT-RISK WATCH',
  analystConsensus: 'Buy',
  analystCount: 14,
  avgTarget: 4.54,
  highTarget: 5.50,
  lowTarget: 3.12,
  chartNote: 'Alpha closed May 4 at €3.44 (+1.18%), down ~9.7% from the Apr 21 ceasefire-rally high (€3.81). The ECB held its deposit rate at 2.00% on Apr 30, but April euro-area inflation jumped to 3.0% and Greece to 4.6%, while Brent Jul 2026 moved to $113.79 as Project Freedom clashes in Hormuz stressed the US-Iran ceasefire. The stock is no longer deeply oversold (RSI 43.83), but remains below short-term moving averages and near the 200D support band. Structural positives remain: buyback execution, €600M green bond demand, MSCI DM upgrade path, and FY2026 EPS guidance near €0.40.',
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
  { date: 'May-04', price: 3.44 },
]

const maData = [
  { name: '5-Day MA',   value: 3.51, signal: 'SELL', current: 3.44 },
  { name: '20-Day MA',  value: 3.60, signal: 'SELL', current: 3.44 },
  { name: '50-Day MA',  value: 3.68, signal: 'SELL', current: 3.44 },
  { name: '200-Day MA', value: 3.41, signal: 'BUY',  current: 3.44 },
]

const technicals = {
  priceRange: [1.5, 4.8],
  maSignalSummary: '1 of 4 MAs signal Buy (200D only). Price is below the 5D (€3.51), 20D (€3.60), and 50D (€3.68) moving averages, but still just above the estimated 200D band (€3.41). The Apr 30 ECB hold avoided the immediate hike shock, but May 4 Hormuz fighting and Brent above $110 reintroduced macro pressure. RSI has recovered to 43.83, so the setup is no longer a pure oversold bounce; it is now an event-risk support test around €3.38-€3.44.',
  oscillators: [
    { label: 'RSI (14-day)',      value: '43.83', signal: 'NEUTRAL', note: 'Recovered from late-April oversold levels but still below the 50 momentum threshold. Needs >50 plus a close above €3.60 to confirm reversal.' },
    { label: 'MACD',             value: '-0.052', signal: 'SELL',    note: 'Momentum remains negative after the Apr 21 high. Watch for flattening only if Hormuz news calms and price reclaims the 20D MA.' },
    { label: 'Stochastic (9,6)', value: '38.0',  signal: 'NEUTRAL', note: 'No longer washed out; still vulnerable to another support test if Brent stays above $110.' },
    { label: 'Williams %R',      value: '-62',   signal: 'NEUTRAL', note: 'The maximum-oversold bounce signal has faded. Risk/reward now depends more on geopolitics than oscillator mean reversion.' },
    { label: 'ADX (14)',         value: '24.0',  signal: 'NEUTRAL', note: 'Trend strength is moderate; current move is a support-zone test rather than a confirmed breakdown.' },
  ],
  supportLevels: [
    { level: 4.489, label: '52W High / Major Resistance',          type: 'resistance' },
    { level: 3.81,  label: 'Apr 21 Ceasefire Rally High',          type: 'resistance' },
    { level: 3.68,  label: '50-Day MA / Key Resistance',           type: 'resistance' },
    { level: 3.60,  label: '20-Day MA / Reclaim Level',            type: 'resistance' },
    { level: 3.51,  label: '5-Day MA / Immediate Resistance',      type: 'resistance' },
    { level: 3.440, label: 'Current Price (May 4 close)',          type: 'current' },
    { level: 3.41,  label: '200-Day MA / Critical Support Band',   type: 'support' },
    { level: 3.384, label: 'May 4 Intraday Low / First Support',   type: 'support' },
    { level: 3.28,  label: 'Mar 31 Pre-MSCI Level / Support',      type: 'support' },
    { level: 3.15,  label: 'Apr 4 Ultimatum Low / Support',        type: 'support' },
    { level: 2.95,  label: 'Mar Intraday Low / Strong Support',    type: 'support' },
    { level: 2.48,  label: 'October 2025 Base / Major Support',    type: 'support' },
    { level: 2.118, label: '52W Low / Floor',                      type: 'support' },
  ],
  priceNote: 'Price is now testing the €3.38-€3.44 support area after the ceasefire rally unwound. The ECB did not hike on Apr 30, but the April inflation flash and May 4 Hormuz clashes shifted the catalyst from "ECB event" to "oil/ceasefire event." A daily close above €3.60 would repair the short-term trend. A close below €3.38 exposes €3.28 and then €3.15. This is no longer a clean oversold setup; position timing should be gated by whether Project Freedom produces a navigable Hormuz corridor or a renewed US-Iran shooting cycle.',
}

const fundamentalData = {
  valuation: [
    { label: 'P/E (TTM)',     value: 9.37,              bench: '8–10×',       note: 'Near the top half of the Greek-bank range after EPS normalization; not distressed despite pullback', ok: null },
    { label: 'P/E (Forward)', value: 8.19,              bench: '7–9×',        note: 'Fair-to-cheap on 2026E EPS around €0.40, but geopolitical discount is now justified', ok: true },
    { label: 'P/B Ratio',     value: 0.88,              bench: '0.85–1.05×',  note: 'Back below book; support depends on stable CET1 and no energy-driven NPE deterioration', ok: true },
    { label: 'PEG Ratio',     value: '0.58',            bench: '<1 = cheap',  note: 'Strong EPS growth path; 11% normalised growth guided',       ok: true },
    { label: 'Div. Yield',    value: '3.82%',           bench: '2–4% sector', note: 'Yield improved as price fell; buyback remains the more flexible return lever', ok: true },
    { label: 'Payout Ratio',  value: '55%',             bench: '40–60%',      note: 'Sustainable — split 50/50 dividends + buybacks',             ok: true },
  ],
  scorecard: [
    { label: 'Valuation',      score: 7, note: 'P/B 0.88x and forward P/E 8.2x look reasonable, but not enough to offset a 36% combined ceasefire-collapse / regime-crisis tail in the geo overlay.' },
    { label: 'Profitability',  score: 7, note: 'RoTE 12.9% reported, 13.8% normalized. Improving but not sector-leading vs Eurobank (15.2%).' },
    { label: 'Capital Quality',score: 8, note: 'CET1 15.0% — robust; 206bps organic capital generated in FY2025. Well above sector avg 15.6%.' },
    { label: 'Asset Quality',  score: 9, note: 'NPE ~3.0%, declining. Sector avg 2.6%. Scope Ratings: risk costs falling below 50bps.' },
    { label: 'Dividend',       score: 7, note: '3.82% yield + active buyback support. Treasury shares were already 60.997M after Apr 14-17 activity; Apr 29 ATHEX notice indicates continued programme activity.' },
    { label: 'Growth Outlook', score: 7, note: 'NII >€1.7B guided for 2026 and fee income target near €600M, but Greece HICP at 4.6% raises loan-demand and credit-cost sensitivity.' },
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
  { bank: 'Alpha Bank', pe: 9.37, pb: 0.88, rote: 13.5, cet1: 15.0, npe: 3.0, target: 4.54, divYield: 3.82 },
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
  { firm: 'Jefferies',      target: 4.85, rating: 'Buy',        upside: 41 },
  { firm: 'Goldman Sachs',  target: 5.10, rating: 'Buy',        upside: 48 },
  { firm: 'Deutsche Bank',  target: 4.45, rating: 'Buy',        upside: 29 },
  { firm: 'UBS',            target: 4.30, rating: 'Buy',        upside: 25 },
  { firm: 'Citi',           target: 4.10, rating: 'Buy',        upside: 19 },
  { firm: 'JPMorgan',       target: 3.90, rating: 'Overweight', upside: 13 },
  { firm: 'MarketScreener Consensus', target: 4.54, rating: 'Buy', upside: 32 },
  { firm: 'Barclays',       target: 3.12, rating: 'Hold',       upside: -9 },
]

const eventImpacts = [
  { event: 'Project Freedom / Hormuz Shooting Resumes (May 4)',                    level: 'Critical', direction: 'Negative', rationale: 'The US began a military-backed effort to reopen Hormuz. Reuters reported US forces destroyed six Iranian small boats and intercepted Iranian missiles/drones; AP reported the UAE came under Iranian attack and two cargo vessels were ablaze off the UAE. This is the largest stress test of the Apr 8 ceasefire. For Alpha: Brent at $113.79 raises Greek inflation, ECB hike risk, sovereign-spread sensitivity, and bank multiple compression.' },
  { event: 'ECB Holds at 2.00% But Flags Higher Inflation / Lower Growth (Apr 30)', level: 'Critical', direction: 'Mixed',    rationale: 'The ECB kept deposit/refi/marginal rates at 2.00% / 2.15% / 2.40%. This avoided the immediate 25bps hike feared on Apr 24, but the statement said upside inflation risks and downside growth risks intensified because of the Middle East energy shock. For Alpha: no instant NII bump from an Apr hike, but June-hike optionality remains; the bigger issue is stagflation pressure on loan demand and NPEs.' },
  { event: 'Eurostat April Flash: EA HICP 3.0%, Greece 4.6%, Energy 10.9%',        level: 'High',     direction: 'Negative', rationale: 'Euro-area inflation accelerated to 3.0% in April from 2.6% in March; energy jumped to 10.9% and Greece printed an estimated 4.6%. This confirms the oil shock is reaching consumer prices. Higher rates help bank NII only if credit losses and valuation multiples stay contained; at current inflation levels that trade-off is deteriorating.' },
  { event: 'Alpha Bank €600M Senior Preferred Green Bond Priced (Apr 28)',         level: 'Medium',   direction: 'Positive', rationale: 'Alpha successfully priced a 6NC5 senior preferred green bond of €600M, with Greek press reporting orders above €2.5B. This is a strong funding-access signal during a volatile week and supports the bank\'s MREL/funding plan. It partially offsets the broader macro-risk premium.' },
  { event: 'Alpha Bank Buyback Continues / Treasury Shares Already 2.63%',         level: 'Medium',   direction: 'Positive', rationale: 'The Apr 14-17 buyback acquired 2.148M shares at €3.7676 average, leaving 60.998M treasury shares, 2.6346% of capital. ATHEX posted another own-share announcement on Apr 29. Management is buying above the current €3.44 price, providing tactical support but not enough to neutralize geopolitical beta.' },
  { event: 'Alpha Trust 69.61% Acquisition Agreement (Apr 7)',                     level: 'Medium',   direction: 'Positive', rationale: 'Alpha signed binding agreements to acquire 69.61% of Alpha Trust Holdings and intends a voluntary bid for the remainder. Strategic rationale: deepen asset management, fee income, and wealth platform. This supports the 2026 fee target but integration risk now matters more under a weaker macro tape.' },
  { event: 'MSCI Developed Market Upgrade (Mar 31 — effective May 2027)',          level: 'High',     direction: 'Positive', rationale: 'Greece upgraded from Emerging to Developed Market status, with implementation expected in May 2027. Passive inflow estimates remain a medium-term floor for Greek banks, but the May 4 oil/geopolitical shock delays the re-rating path rather than invalidating it.' },
  { event: 'S&P/Fitch Greece Reviews Due April-May 2026',                          level: 'High',     direction: 'Positive', rationale: 'Further sovereign-rating progress would reduce funding costs and widen the investor base. However, energy inflation and Middle East risk raise the bar for near-term upgrades. Treat as a catalyst, not a base-case guarantee.' },
  { event: 'UniCredit Stake 29.8% Direct → Instruments to 32.1%',                  level: 'Medium',   direction: 'Positive', rationale: 'UniCredit remains a strategic anchor and a governance/wholesale-banking credibility signal. It supports the medium-term thesis, but does not protect short-term price action if oil and Greek spreads gap higher.' },
  { event: 'AstroBank Integration — Digital Unification Completing 2026',          level: 'Medium',   direction: 'Positive', rationale: 'Cyprus integration is still a fee and RoTE catalyst. The key watch is whether higher energy prices slow Cyprus/Greece/Romania credit growth before synergies arrive.' },
  { event: 'Q4 2025 Results Beat — Profit +44% YoY, Q1 2026 Due May 28',           level: 'High',     direction: 'Positive', rationale: 'FY2025 profit was €943M (+44% YoY), normalized profit €907M, and management guided 2026 normalized EPS near €0.40 / reported profit around €950M, NII above €1.7B, and fee growth. Next hard company data point is Q1 2026 results on May 28.' },
  { event: 'Greek Macro: IMF 2026 Growth 1.8%, Inflation 3.5%',                    level: 'Medium',   direction: 'Mixed',    rationale: 'Greece still outgrows much of the euro area, but IMF assumptions were already revised for higher inflation before the latest Hormuz flare-up. Alpha\'s bull case needs credit expansion without a material rise in NPEs.' },
  { event: 'Basel IV / EU CRR3 Phase-In (2025-2030)',                              level: 'Medium',   direction: 'Negative', rationale: 'New capital output floors could require Greek banks to hold 10-15% more RWA capital by 2030. Est. impact: -80 to -130bps CET1. Current 15.0% buffer remains adequate, but capital-return assumptions should not be stretched.' },
]

const keyMetrics = [
  { label: 'Net Profit FY2025',      value: '€943.3M',  change: '+44% YoY',                pos: true  },
  { label: 'CET1 Capital Ratio',     value: '15.0%',    change: '206bps organic generation', pos: true  },
  { label: 'NPE Ratio',              value: '~3.0%',    change: 'Sector avg 2.6%, declining', pos: true  },
  { label: 'Cost-to-Income',         value: '39.5%',    change: 'Target: ~37%',             pos: true  },
  { label: 'RoTE Target',             value: '13-14%',   change: 'Jefferies sees ~13.5% by 2028', pos: null  },
  { label: 'Net Interest Income',    value: '€1.65B',   change: '2026 guide: >€1.7B',      pos: true  },
  { label: 'Fee Income',             value: '€582M',    change: 'Target near €600M; Alpha Trust adds optionality', pos: true  },
  { label: 'Total Distribution',     value: '€519M',    change: '55% payout + buyback',     pos: true  },
  { label: 'UniCredit Stake',        value: '29.8%',    change: 'Instruments to 32.1%',     pos: true },
  { label: 'Treasury Shares',        value: '61.0M',    change: '2.63% of capital; buying at €3.77', pos: true },
  { label: 'Brent Jul 2026',         value: '$113.79',  change: '+5.2% on May 4; Hormuz clash', pos: false },
  { label: 'ECB Deposit Rate',       value: '2.00%',    change: 'Held Apr 30; June hike risk alive', pos: null },
  { label: 'EA / Greece HICP',       value: '3.0% / 4.6%', change: 'April flash inflation spike', pos: false },
  { label: 'MSCI Status',           value: 'Developed', change: 'Effective May 2027; $2-4B inflows', pos: true },
  { label: 'Q1 2026 Results',        value: 'May 28',   change: 'Next company catalyst', pos: null },
]

const newsItems = [
  {
    headline: "Reuters: US sinks Iranian small boats and intercepts missiles/drones as Project Freedom opens Hormuz",
    source: "Reuters via Investing.com",
    date: "2026-05-04",
    url: "https://za.investing.com/news/stock-market-news/us-sinks-iranian-small-boats-shoots-down-missiles-drones-as-it-opens-strait-4250942",
    sentiment: "negative",
  },
  {
    headline: "AP: UAE under attack as US effort to reopen Strait of Hormuz tests Iran truce",
    source: "Associated Press",
    date: "2026-05-04",
    url: "https://apnews.com/article/iran-us-war-ceasefire-negotiations-strait-a4857f28d9b47e0170b65ced19451a25",
    sentiment: "negative",
  },
  {
    headline: "Athens market closes higher; Alpha Bank ends at €3.44, up 1.18%",
    source: "Dnews",
    date: "2026-05-04",
    url: "https://www.dnews.gr/eidhseis/oikonomia/586201/me-kerdi-ekleise-ti-deftera-to-xrimatistirio-athinon",
    sentiment: "neutral",
  },
  {
    headline: "ECB holds deposit rate at 2.00% but says inflation and growth risks have intensified",
    source: "European Central Bank",
    date: "2026-04-30",
    url: "https://www.ecb.europa.eu/press/pr/date/2026/html/ecb.mp260430~81b7179e6f.en.html",
    sentiment: "negative",
  },
  {
    headline: "Eurostat April flash: euro-area inflation 3.0%, Greece 4.6%, energy 10.9%",
    source: "Eurostat",
    date: "2026-04-30",
    url: "https://ec.europa.eu/eurostat/en/web/products-euro-indicators/w/2-30042026-ap",
    sentiment: "negative",
  },
  {
    headline: "Brent Jul 2026 trades at $113.79 as Hormuz disruption premium returns",
    source: "Oilprice.com",
    date: "2026-05-04",
    url: "https://oilprice.com/futures/brent/",
    sentiment: "negative",
  },
  {
    headline: "Alpha Bank prices €600M 6NC5 senior preferred green bond",
    source: "Euronext Athens",
    date: "2026-04-28",
    url: "https://athens.euronext.com/el/more-options/announcements/alpha-bank-epityhis-timologisi-6etoys-prasinoy-omologoy-ypsilis",
    sentiment: "positive",
  },
  {
    headline: "Alpha Bank buys 2.15M own shares at €3.7676 average; treasury shares reach 2.63%",
    source: "Cyprus Mail",
    date: "2026-04-22",
    url: "https://cyprus-mail.com/2026/04/22/alpha-bank-buys-over-2-1-million-of-its-own-shares",
    sentiment: "positive",
  },
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
  analysis: 'US–Iran War: Operation Epic Fury — Project Freedom Stress Test',
  analysisPath: '/geo/us-iran-war',
  date: '2026-05-04',
  relevance: 'CRITICAL — The Iran-war overlay has worsened since Apr 24. The ceasefire did not collapse immediately, but the May 4 US Project Freedom operation to reopen Hormuz triggered direct US-Iran fire, Iranian attacks on the UAE, and renewed oil-price stress. Brent Jul 2026 is $113.79, euro-area HICP is 3.0%, and Greece HICP is 4.6%. For Alpha Bank, this directly gates position timing through three channels: oil → Greek inflation → ECB path, risk sentiment → Greek bank multiples, and sovereign spreads → bank funding costs.',
  keyChannels: [
    { channel: 'Oil → Greece HICP → ECB Path', detail: 'Brent moved from the Apr 24 $104-106 zone to $113.79. Eurostat April flash shows energy inflation at 10.9%, euro-area HICP at 3.0%, and Greece at 4.6%. The ECB held on Apr 30, but the next move is now more likely higher unless energy cools. Alpha gets some NII optionality from rate hikes, but the growth/NPE/multiple drag dominates above $110 oil.', severity: 'Critical' },
    { channel: 'Hormuz Firefight → Risk Sentiment → Greek Banks', detail: 'May 4 created a genuine ceasefire stress point: US boats/aircraft defending ships, Iranian missiles/drones, UAE attacked. Greek banks are high-beta financials; ALPHA can fall faster than fundamentals if investors de-risk Europe/periphery exposure.', severity: 'Critical' },
    { channel: 'Sovereign Spreads → Funding Cost', detail: 'Greek 10Y yields were already around 3.7-3.8% in mid-April. A sustained oil shock can widen spreads and raise wholesale funding costs. Alpha\'s €600M green bond demand is positive, but future issuance costs remain macro-sensitive.', severity: 'High' },
    { channel: 'MSCI DM Upgrade → Structural Floor', detail: 'The May 2027 MSCI developed-market path remains the main medium-term floor for Alpha. It supports accumulation on clean de-escalation dips, but does not neutralize a near-term naval escalation shock.', severity: 'High' },
    { channel: 'SE Europe Spillover → Romania/Cyprus', detail: 'Romania and Cyprus exposure makes Alpha sensitive to energy prices, tourism, shipping, and regional confidence. A short Hormuz corridor crisis is manageable; a multi-week naval conflict is not.', severity: 'Medium' },
  ],
  scenarios: [
    { name: 'Frozen Maritime Confrontation',          probability: 30, color: '#f59e0b', priceImpact: '-8% to +2%',  direction: 'Negative', rationale: 'Project Freedom opens limited corridors but Iran keeps contesting control. Brent $100-120, ECB remains hawkish, Alpha trades around €3.25-3.60 until oil falls or Q1 results surprise positively. This is the current center of gravity.' },
    { name: 'Ceasefire Collapse / Limited Naval War', probability: 30, color: '#ef4444', priceImpact: '-25% to -40%', direction: 'Strongly Negative', rationale: 'May 4 fire escalates into repeated US-Iran maritime exchanges, UAE/Gulf infrastructure attacks, or a ship casualty event. Brent $130-150, Greece inflation stays above 4%, ECB hikes into weak growth. Alpha could retest €2.75-3.05 despite buybacks.' },
    { name: 'Negotiated Hormuz Corridor',             probability: 22, color: '#10b981', priceImpact: '+20% to +35%', direction: 'Strongly Positive', rationale: 'US/Iran/Qatar/Oman agree a monitored shipping channel and verification sequencing. Brent falls below $95, ECB June hike risk fades, and ALPHA reclaims €3.80 then targets the €4.54 consensus path.' },
    { name: 'Escalatory Coercive Resolution',         probability: 12, color: '#06b6d4', priceImpact: '-15% then +10%', direction: 'Volatile', rationale: 'US force opens Hormuz through heavier strikes. Short-term risk-off hits Greek banks, but if shipping normalizes quickly the stock recovers. Path depends on whether Iran absorbs the blow or widens the war.' },
    { name: 'Regime / Nuclear Crisis',                probability: 6,  color: '#dc2626', priceImpact: '-40%+', direction: 'Catastrophic', rationale: 'Internal Iranian fracture, nuclear-site incident, or proxy mass-casualty event breaks containment. Not base case, but the May 4 shooting raises the need for a wider stop and smaller tactical sizing.' },
  ],
  probabilityWeightedImpact: 'Net probability-weighted impact: approximately -6% to -8% for Alpha. The positive 22% negotiated-corridor case is now outweighed by a 36% combined ceasefire-collapse / regime-crisis tail. This reverses the Apr 24 improvement. Position timing should wait for evidence that Project Freedom produces stable transit rather than repeated fire.',
  keyPoliticalSignals: [
    {
      actor: 'Donald Trump',
      role: 'US President',
      platform: 'Truth Social',
      date: '2026-05-03',
      quote: 'We will guide their Ships safely out of these restricted Waterways.',
      signalType: 'ambiguous',
      stockImpact: 'Project Freedom is positive only if it opens a shipping corridor without sustained fire. For Alpha it is a binary signal: corridor success lowers oil/ECB risk; Iranian interference converts the signal into escalation.',
    },
    {
      actor: 'US Central Command / Adm. Brad Cooper',
      role: 'US CENTCOM Commander',
      platform: 'Press Briefing',
      date: '2026-05-04',
      quote: 'The IRGC has launched multiple cruise missiles, drones and small boats at ships we are protecting.',
      signalType: 'escalatory',
      stockImpact: 'Confirms Project Freedom is already kinetic. Raises ceasefire-collapse probability and keeps Alpha below the €3.60 repair level unless the confrontation stops quickly.',
    },
    {
      actor: 'Ali Abdollahi',
      role: 'Iran Central Military Commander',
      platform: 'Official Statement',
      date: '2026-05-04',
      quote: 'Any foreign armed forces... will be attacked if they intend to approach and enter the Strait of Hormuz.',
      signalType: 'escalatory',
      stockImpact: 'Clear red line against US naval operations. For Alpha, this is a wait signal: no full-risk entry until commercial transit occurs without follow-on missile/drone attacks.',
    },
    {
      actor: 'European Central Bank',
      role: 'Governing Council',
      platform: 'Monetary Policy Decision',
      date: '2026-04-30',
      quote: 'Upside risks to inflation and downside risks to growth have intensified.',
      signalType: 'economic',
      stockImpact: 'The ECB hold helped near-term sentiment, but the statement validates stagflation risk. For Alpha, higher rates are not automatically bullish if Greek HICP and NPE risk rise together.',
    },
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
      stockImpact: 'Pre-Apr 30 hawkish signal rather than a realized hike. The ECB ultimately held at 2.00%, but the "layer cake of shocks" framing foreshadowed the later inflation/growth-risk language. For Alpha: possible NII uplift if hikes resume, offset by growth, credit-cost, and multiple drag.',
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
    type: 'Geopolitical — CRITICAL',
    icon: '🇮🇷',
    event: 'Project Freedom triggered direct US-Iran fire in Hormuz on May 4',
    description: 'The ceasefire is no longer simply stalled. US forces began reopening Hormuz, Iran fired missiles/drones/small boats, US forces destroyed Iranian boats, and the UAE reported Iranian attacks. The geo-overlay collapse tail rises to 36% combined for Ceasefire Collapse plus Regime/Nuclear Crisis.',
    impact: 'Critical',
    impactColor: '#ef4444',
    suggestion: 'Gate any larger exposure on 24-72 hours of evidence: commercial vessels transit without additional missile/drone strikes, UAE/Gulf attacks stop, and Brent retreats below $105. If the next signal is another hit ship or US casualty, downside toward €3.05 becomes more relevant than analyst targets.',
  },
  {
    type: 'Monetary Policy — HAWKISH HOLD',
    icon: '🏦',
    event: 'ECB held rates at 2.00%, but inflation risks intensified',
    description: 'The Apr 30 ECB decision removed the immediate hike event, but not the risk. Euro-area inflation is 3.0%, Greece is 4.6%, energy is 10.9%, and the ECB statement explicitly tied the Middle East war to higher inflation and weaker sentiment.',
    impact: 'High',
    impactColor: '#f59e0b',
    suggestion: 'Watch June ECB pricing and Lagarde follow-up language. A June hike is modestly positive for NII but negative for multiples if paired with slower GDP and higher NPE assumptions.',
  },
  {
    type: 'Commodity / Inflation',
    icon: '🛢️',
    event: 'Brent back above $110 and Greece HICP at 4.6%',
    description: 'Brent Jul 2026 is $113.79 and Oilprice shows a +47% YTD move. Eurostat estimates Greek April HICP at 4.6%. This is the direct transmission channel from Hormuz to Alpha Bank valuation: inflation → ECB path → loan demand/NPEs → P/B multiple.',
    impact: 'High',
    impactColor: '#f59e0b',
    suggestion: 'Treat Brent below $100 as the first macro all-clear. Brent above $120 would likely force another valuation haircut even if Alpha-specific fundamentals stay sound.',
  },
  {
    type: 'Funding Positive',
    icon: '💶',
    event: '€600M senior preferred green bond priced on Apr 28',
    description: 'Alpha priced a 6NC5 senior preferred green bond, with Greek press indicating demand above €2.5B. This shows market access remains open despite volatility and supports MREL/funding execution.',
    impact: 'Medium',
    impactColor: '#10b981',
    suggestion: 'Positive for funding confidence, but not a timing override while Hormuz is kinetic. It matters most if the stock tests book-value support on macro panic rather than company weakness.',
  },
  {
    type: 'Structural Positive',
    icon: '📈',
    event: 'MSCI Developed Market upgrade path remains intact',
    description: 'Greece remains on the May 2027 developed-market implementation path. This is the main 12-18 month re-rating support for Greek banks, but the timing of realization is now hostage to the oil/ECB shock.',
    impact: 'High',
    impactColor: '#10b981',
    suggestion: 'Use the MSCI thesis as the medium-term floor, not as permission to ignore a 30% ceasefire-collapse scenario.',
  },
  {
    type: 'Technical — SUPPORT TEST',
    icon: '📉',
    event: '€3.38-€3.44 support zone; RSI 43.83',
    description: 'Alpha is below the 5D/20D/50D averages and only just above the 200D support band. RSI is no longer deeply oversold, so the setup depends on event de-risking rather than oscillator mean reversion.',
    impact: 'Medium',
    impactColor: '#06b6d4',
    suggestion: 'A close above €3.60 repairs the short-term chart. A close below €3.38 exposes €3.28 and €3.15.',
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
  stance: "CAUTIOUS HOLD — EVENT-RISK WATCH",
  stanceColor: "#f59e0b",
  stanceBg: "rgba(245,158,11,0.1)",
  timing: "Wait 24-72h for Hormuz transit clarity",
  timingDetail: "The April 24 thesis has deteriorated. The expected ECB Apr 30 hike did not happen, which was initially supportive, but the market now has a worse macro/geopolitical mix: April euro-area inflation is 3.0%, Greece is 4.6%, Brent is $113.79, and the US-Iran ceasefire is being stress-tested by Project Freedom in Hormuz.\n\nThe key political signals are explicit: Trump announced the US would guide ships through the strait; Iran's Ali Abdollahi warned US forces would be attacked if they entered; CENTCOM then confirmed the IRGC launched missiles, drones, and small boats at protected shipping. These signals raise the geo-overlay downside tail. The prior 'oversold pullback' setup has become an event-risk support test.\n\nTACTICAL FRAMEWORK:\n• Keep risk staged while the next 24-72 hours clarify whether commercial vessels can transit without follow-on fire.\n• If Project Freedom stabilizes, Brent falls below $105, and ALPHA closes back above €3.60, the data supports rebuilding exposure toward the €3.81 / €4.54 target path.\n• If another ship is hit, UAE/Gulf attacks continue, or Brent moves above $120, wait for the €3.28-€3.15 support band rather than treating €3.44 as a clean entry.\n• Q1 2026 results on May 28 are the company-specific checkpoint: NII >€1.7B guide, fee growth, NPE ratio, and cost-of-risk commentary decide whether the structural MSCI thesis can absorb the oil shock.",
  entryZone: { low: 3.35, high: 3.45, ideal: 3.40 },
  stopLoss:  { price: 3.05, pct: -11.3, rationale: 'Widened below the Apr 4 ultimatum low (€3.15) because the combined ceasefire-collapse / regime-crisis tail is now 36%. A break below €3.05 would imply the market is pricing sustained oil shock and wider Greek spreads, not just a technical dip.' },
  targets: [
    { price: 3.58, label: 'Target 1',  horizon: '1–2 weeks',     upside: 4.1,  trigger: 'Hormuz transit stabilizes; Brent below $105; price reclaims Apr 24 breakdown level' },
    { price: 3.81, label: 'Target 2',  horizon: '1–3 months',    upside: 10.8, trigger: 'Ceasefire holds and Q1 results confirm NII/fee guide; reclaim Apr 21 high' },
    { price: 4.54, label: 'Consensus', horizon: '6–12 months',   upside: 32.0, trigger: 'MarketScreener average target; needs oil normalization, MSCI path, and no NPE deterioration' },
    { price: 4.85, label: 'Bull case', horizon: '12–18 months',  upside: 41.0, trigger: 'Jefferies target; requires negotiated Hormuz corridor, Greek spread stability, and fee-growth delivery' },
  ],
  riskReward: '0.4:1 to T1 / 2.8:1 to consensus',
  conviction: "Medium (downgraded from Medium-High — May 4 Hormuz clash raised tail risk)",
  keyConditions: [
    { label: 'Project Freedom produces stable Hormuz transit',                   status: 'pending',  impact: 'CRITICAL — commercial ships must transit without repeated missile/drone/small-boat attacks. This is the main entry gate.' },
    { label: 'No further UAE/Gulf infrastructure attacks after May 4',           status: 'pending',  impact: 'CRITICAL — repeated Gulf attacks would move the ceasefire-collapse scenario above 35% and push ALPHA toward €3.15 or lower.' },
    { label: 'Brent crude falls back below $105',                                status: 'failed',   impact: 'FAILED — Brent Jul 2026 is $113.79. Above $110 keeps ECB and Greek HICP risk active.' },
    { label: 'ECB Apr 30: no immediate hike, deposit rate held at 2.00%',        status: 'met',      impact: 'POSITIVE NEAR TERM — but statement was hawkish on inflation/growth risks, so June remains live.' },
    { label: 'Eurostat April inflation: EA 3.0%, Greece 4.6%',                  status: 'failed',   impact: 'NEGATIVE — confirms oil shock transmission into Alpha\'s home market.' },
    { label: 'MSCI Developed Market upgrade (Mar 31)',                          status: 'met',      impact: 'STRUCTURAL POSITIVE — $2-4B passive inflows over 12-18 months. Floor under the stock at ~€3.20-3.40.' },
    { label: 'Alpha Bank green bond demand / funding access',                  status: 'met',      impact: 'POSITIVE — €600M 6NC5 senior preferred green bond priced Apr 28; demand reported above €2.5B.' },
    { label: 'ALPHA holds €3.38-€3.41 support band',                           status: 'met',      impact: 'At €3.44, the support band is holding by a narrow margin. Close below €3.38 shifts focus to €3.28/€3.15.' },
    { label: 'Q1 2026 results confirm guidance on May 28',                     status: 'pending',  impact: 'Company-specific catalyst. Need NII, fees, NPE, and cost-of-risk confirmation under higher inflation.' },
  ],
  bearCase: 'If Project Freedom becomes a sustained naval fight, Brent trades $130+, and the ECB prepares a June hike into slowing growth: Alpha retests €2.75-3.05 despite strong capital and buybacks. This is now a 30% ceasefire-collapse scenario plus a 6% regime/nuclear crisis tail, not an 8-12% remote risk. The MSCI upgrade remains the 12-18 month floor, but the near-term drawdown path is governed by oil, Greek inflation, and sovereign spreads.',
  disclaimer: 'Analytical data only. Not financial advice. Consult a qualified advisor.',
}

/* ─── VALUATION MODELS (Updated May 4, 2026) ──────────────────────────── */
const valuationModels = {
  dcf: {
    fcf: 450,
    growthRate: 0.05,
    wacc: 0.076,
    terminalGrowthRate: 0.02,
    projectedFCFs: [472, 496, 521, 547, 574],
    terminalValue: 10461,
    fairValuePerShare: 4.15,
    currentPrice: 3.44,
    upside: 20.7,
    assumptions: 'Bank cash-flow DCF is used as a conservative FCFE proxy: distributable free equity cash flow €450M after growth capital. g = 5.0%; WACC = 3.05% German 10Y proxy + 0.83 beta * 5.5% ERP = 7.6%; terminal g = 2.0%; shares = 2.25B. Full reported profit DCF would overstate bank value, so this is intentionally haircut.',
  },
  ddm: {
    dps: 0.13,
    growthRate: 0.035,
    requiredReturn: 0.076,
    fairValuePerShare: 3.28,
    assumptions: 'DDM = €0.13 * (1 + 3.5%) / (7.6% - 3.5%) = €3.28. Dividend growth is capped at nominal sustainable growth rather than ROE * retention because the raw Gordon model would overstate value when r-g is too narrow.',
  },
  relativeValuation: [
    { model: 'P/E vs European Banks', sectorMedian: 8.5, companyMetric: 0.40, impliedPrice: 3.40, verdict: 'Fair' },
    { model: 'P/B vs Historical', historicalAvg: 0.95, currentBookValue: 3.90, impliedPrice: 3.71, verdict: 'Slightly Undervalued' },
    { model: 'Consensus Target', sectorMedian: 14, companyMetric: 4.54, impliedPrice: 4.54, verdict: 'Undervalued if geo risk normalizes' },
  ],
  summary: {
    bullCase: 4.85,
    baseCase: 3.82,
    bearCase: 3.28,
    currentPrice: 3.44,
    verdict: 'Moderately undervalued on base models, but near-term expected return is negative until Hormuz/oil risk clears.',
  },
}

/* ─── SENSITIVITY ANALYSIS (Updated for oil/ECB shock) ─────────────────── */
const sensitivityAnalysis = {
  niiSensitivity: {
    loanBookSize: 37500,
    repricingGapPct: 0.20,
    impactPer25bps: 19,
    note: '€37.5B performing loans * 20% repricing gap * 0.0025 = ~€18.8M pre-tax NII impact per 25bps. Deposit beta and wholesale-funding costs can offset part of this.',
  },
  oilSensitivity: {
    chain: [
      { variable: 'Brent +8% vs Apr 24', impact: 'EA energy HICP 10.9%; Greece HICP 4.6%', mechanism: 'Eurostat Apr flash confirms pass-through already visible' },
      { variable: 'Inflation above target', impact: 'June ECB hike probability rises', mechanism: 'ECB held Apr 30 but flagged higher inflation/lower growth risks' },
      { variable: 'ECB +25bps', impact: 'NII +~€19M, but P/B multiple -3% to -7%', mechanism: 'NII benefit is smaller than valuation/growth drag if oil remains above $110' },
    ],
    netImpact: 'Oil +10% from here is negative for ALPHA unless it is paired with a fast Hormuz resolution. NII uplift does not compensate for Greek HICP, NPE, and multiple pressure.',
  },
  fxSensitivity: {
    exposures: [
      { currency: 'EUR', share: 'Core', note: 'Primary reporting and loan currency' },
      { currency: 'RON/Cyprus-linked activity', share: '~10% Romania plus Cyprus operations', note: 'Indirect sensitivity through regional credit quality, tourism, shipping and energy costs' },
    ],
    impactPer1Pct: 'Low direct translation impact; medium indirect credit-cycle impact in SE Europe.',
  },
  earningsTornado: [
    { variable: 'ECB rate +25bps', epsImpactBear: -0.01, epsImpactBull: 0.02, baseEps: 0.40 },
    { variable: 'NPE ratio +1pp', epsImpactBear: -0.06, epsImpactBull: 0.01, baseEps: 0.40 },
    { variable: 'Loan growth +/-2pp', epsImpactBear: -0.02, epsImpactBull: 0.03, baseEps: 0.40 },
    { variable: 'Fee income +/-10%', epsImpactBear: -0.02, epsImpactBull: 0.02, baseEps: 0.40 },
    { variable: 'Cost-income ratio +/-2pp', epsImpactBear: -0.03, epsImpactBull: 0.03, baseEps: 0.40 },
  ],
}

/* ─── RISK QUANTIFICATION (Updated May 4, 2026) ────────────────────────── */
const riskQuantification = {
  expectedReturn: {
    scenarios: [
      { name: 'Frozen Maritime Confrontation', probability: 0.30, return: -0.03 },
      { name: 'Ceasefire Collapse / Limited Naval War', probability: 0.30, return: -0.30 },
      { name: 'Negotiated Hormuz Corridor', probability: 0.22, return: 0.27 },
      { name: 'Escalatory Coercive Resolution', probability: 0.12, return: -0.05 },
      { name: 'Regime / Nuclear Crisis', probability: 0.06, return: -0.45 },
    ],
    weightedReturn: -0.073,
    calculation: '0.30*(-3%) + 0.30*(-30%) + 0.22*(+27%) + 0.12*(-5%) + 0.06*(-45%) = -7.3%',
  },
  maxDrawdown: {
    peak: 4.489,
    trough: 3.384,
    drawdownPct: -24.6,
    period: '52W high to May 4 intraday support test',
  },
  sharpeRatio: {
    expectedReturn: -0.073,
    riskFreeRate: 0.0305,
    volatility: 0.149,
    sharpe: -0.70,
    sectorBenchmark: 0.20,
    verdict: 'Negative until geopolitical expected return turns positive; this is timing risk, not a balance-sheet failure signal.',
  },
  kellyCriterion: {
    winProbability: 0.22,
    avgWin: 0.27,
    avgLoss: 0.19,
    kellyPct: -0.33,
    halfKelly: 0,
    quarterKelly: 0,
    note: 'Scenario-weighted Kelly is negative after the May 4 Hormuz signal. Treat any exposure as discretionary and staged, not formula-driven sizing.',
  },
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
    description: 'ECB held at 2.00% on Apr 30 but inflation risk shifted higher. Need precise NII sensitivity per 25bps under a possible June hike: deposit beta, wholesale funding costs, loan repricing lag, and net P&L impact. Alpha guides NII >€1.7B.',
    issueTitle: 'Extend Alpha Bank analysis: ECB June-hike NII sensitivity — deposit beta, repricing, net impact per 25bps',
  },
  {
    topic: 'Project Freedom / Hormuz Transit Scenarios — Oil Price Paths',
    description: 'May 4 turned Hormuz from a stalled blockade into a kinetic transit operation. Model oil paths under: stable escorted corridor, contested corridor, renewed closure, and full naval escalation. Map each to ECB rate path, Greek HICP, NPE risk, and Alpha fair value.',
    issueTitle: 'Extend Alpha Bank analysis: Project Freedom oil scenarios → ECB path → Alpha fair value',
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
    description: 'Model whether the April-May energy inflation shock delays the Greece BBB+ path. Quantify impact on bank funding costs, CDS spreads, investor base expansion, and Alpha Bank P/B re-rating.',
    issueTitle: 'Extend Alpha Bank analysis: Greece BBB+ upgrade sensitivity under oil shock — funding costs, spreads, P/B re-rating',
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
      valuationModels={valuationModels}
      sensitivityAnalysis={sensitivityAnalysis}
      riskQuantification={riskQuantification}
      analysisGaps={analysisGaps}
      dashboardFile="src/dashboards/stocks/alpha-analysis-2026-03-22.jsx"
    />
  )
}
