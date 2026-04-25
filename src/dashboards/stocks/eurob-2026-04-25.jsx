import StockDashboard from '../../components/StockDashboard'

const stock = {
  name: "Eurobank Ergasias Services and Holdings S.A.",
  ticker: "EUROB",
  adr: "",
  exchange: "ATH (Athens Exchange)",
  date: "2026-04-25",
  price: 3.58,
  change: -0.10,
  changePct: -2.72,
  open: 3.65,
  high52w: 4.12,
  low52w: 2.38,
  marketCap: "€13.01B",
  pe: 8.61,
  peForward: 7.93,
  eps: 0.37,
  bookValue: 2.45,
  pbRatio: 1.46,
  dividendYield: "3.0%",
  dividendPerShare: "€0.109 (est.)",
  payoutRatio: "55%",
  beta: 1.18,
  sharesOut: "3.63B",
  sector: "Financials — Banks",
  overallSignal: "HOLD",
  analystConsensus: "Buy",
  analystCount: 27,
  avgTarget: 4.44,
  highTarget: 5.93,
  lowTarget: 3.07,
  chartNote: "Eurobank has staged a partial recovery from its March lows, rising from €3.20 to current levels around €3.58. However, the stock remains 13% below its January high of €4.12 and continues to trade below key moving averages. The recent rally has been supported by the ongoing share buyback program (1.023M shares repurchased in April at €3.9950 average) and anticipation for Q1 2026 earnings on May 7. RSI has improved to 45.2, suggesting oversold conditions are easing. Technical signals remain mixed with the stock testing resistance at the 200-day MA around €3.65. The geopolitical overhang from both US-Iran and Russia-Ukraine conflicts continues to weigh on European banking sector sentiment, though Greek banks are showing relative outperformance vs EU peers."
}

const priceHistory = [
  { date: "Jun-25", price: 2.68 },
  { date: "Jul-25", price: 2.95 },
  { date: "Aug-25", price: 3.18 },
  { date: "Sep-25", price: 3.42 },
  { date: "Oct-25", price: 3.65 },
  { date: "Nov-25", price: 3.88 },
  { date: "Dec-25", price: 4.02 },
  { date: "Jan-26", price: 4.12 },
  { date: "Feb-26", price: 3.78 },
  { date: "Mar-26", price: 3.20 },
  { date: "Apr-26", price: 3.58 }
]

const maData = [
  { name: "5-Day MA", value: 3.61, signal: "NEUTRAL", current: 3.58 },
  { name: "20-Day MA", value: 3.52, signal: "BUY", current: 3.58 },
  { name: "50-Day MA", value: 3.75, signal: "SELL", current: 3.58 },
  { name: "200-Day MA", value: 3.65, signal: "SELL", current: 3.58 }
]

const technicals = {
  priceRange: [2.38, 4.12],
  maSignalSummary: "Eurobank's technical picture shows improvement from the March lows but remains mixed. The stock has reclaimed the 20-day MA (€3.52) and is testing the 200-day MA at €3.65, which represents critical resistance. A sustained break above €3.65 would signal a technical reversal. The 50-day MA at €3.75 remains the next major hurdle. Recent share buybacks at €3.9950 average provide institutional support, but broader geopolitical risks continue to cap momentum. Volume has been above average around €3.60 levels, suggesting institutional accumulation.",
  oscillators: [
    { label: "RSI (14)", value: 45.2, signal: "NEUTRAL", note: "Recovering from oversold; above 30 but below 50" },
    { label: "MACD", value: -0.08, signal: "NEUTRAL", note: "MACD line approaching signal line; potential bullish crossover" },
    { label: "Stochastic %K", value: 42.1, signal: "NEUTRAL", note: "Moving out of oversold territory" },
    { label: "Williams %R", value: -58.3, signal: "NEUTRAL", note: "Improved from deeply oversold levels" },
    { label: "ADX", value: 28.5, signal: "NEUTRAL", note: "Trend strength weakening; consolidation phase" }
  ],
  supportLevels: [
    { level: 4.12, label: "52-Week High / Major Resistance", type: "resistance" },
    { level: 3.99, label: "Buyback Zone (April avg)", type: "resistance" },
    { level: 3.75, label: "50-Day MA", type: "resistance" },
    { level: 3.65, label: "200-Day MA / Critical Resistance", type: "resistance" },
    { level: 3.58, label: "Current Price", type: "current" },
    { level: 3.52, label: "20-Day MA / Support", type: "support" },
    { level: 3.20, label: "March Low / Strong Support", type: "support" },
    { level: 2.95, label: "July 2025 Support", type: "support" },
    { level: 2.38, label: "52-Week Low", type: "support" }
  ],
  priceNote: "Eurobank is at a technical inflection point, testing the 200-day MA at €3.65. A break above would target the 50-day MA at €3.75 and potentially the buyback zone around €3.99. Support at €3.52 (20-day MA) and €3.20 (March low) remains intact. The ongoing share buyback program provides a fundamental floor, but geopolitical risks create overhead resistance. Q1 2026 earnings on May 7 will be the key catalyst for the next directional move."
}

const fundamentalData = {
  valuation: [
    { label: "P/E Ratio", value: "8.61x", bench: "EU Banks ~8.5x", note: "Slight premium to European banking peers", ok: true },
    { label: "P/B Ratio", value: "1.46x", bench: "EU Banks ~0.85x", note: "Premium reflects strong RoTBV; geopolitical discount vs historical", ok: true },
    { label: "PEG Ratio", value: "0.78x (est.)", bench: "<1.0 undervalued", note: "Based on ~11% projected earnings growth for 2026", ok: true },
    { label: "Dividend Yield", value: "3.0% (est.)", bench: "EU Banks ~4.5%", note: "Expected DPS €0.109; awaits AGM approval April 28", ok: true },
    { label: "Payout Ratio", value: "~55%", bench: "30-60%", note: "Target maintained despite geopolitical pressures", ok: true }
  ],
  scorecard: [
    { label: "Valuation", score: 8, note: "P/E of 8.61x attractive despite geopolitical premium compression" },
    { label: "Profitability", score: 8, note: "RoTBV maintained at 16% target; NII growth resilient" },
    { label: "Capital Adequacy", score: 7, note: "CET1 >15% well above regulatory minimums; Eurolife drag contained" },
    { label: "Asset Quality", score: 8, note: "NPE ratio 2.6% with 95.2% coverage; Greek recovery continuing" },
    { label: "Dividend & Shareholder Returns", score: 7, note: "Active buybacks in April at €3.9950; dividend policy stable" },
    { label: "Growth", score: 7, note: "2026 outlook: 6% loan volume growth, NII strength despite margin pressure" }
  ]
}

const financials = [
  { year: "FY2022", netProfit: "€1,180M (est.)", nii: "€2,150M (est.)", fees: "€560M (est.)", roe: "13.5% (est.)" },
  { year: "FY2023", netProfit: "€1,310M (est.)", nii: "€2,380M (est.)", fees: "€620M (est.)", roe: "14.8% (est.)" },
  { year: "FY2024", netProfit: "€1,485M (est.)", nii: "€2,506M (est.)", fees: "€665M (est.)", roe: "15.4% (est.)" },
  { year: "FY2025", netProfit: "€1,362M", nii: "€2,549M", fees: "€770M", roe: "16.0%" },
  { year: "FY2026E", netProfit: "€1,510M (est.)", nii: "€2,720M (est.)", fees: "€840M (est.)", roe: "16.2%" }
]

const capitalMetrics = [
  { subject: "Profitability", value: 88 },
  { subject: "Capital Strength", value: 76 },
  { subject: "Asset Quality", value: 82 },
  { subject: "Growth", value: 79 },
  { subject: "Dividend", value: 72 },
  { subject: "Valuation", value: 77 }
]

const peerComparison = [
  { bank: "Eurobank (EUROB)", pe: 8.61, pb: 1.46, rote: 16.2, cet1: "15.2% (est.)", npe: 2.6, target: 4.44, divYield: "3.0% (est.)" },
  { bank: "Alpha Bank (ALPHA)", pe: 6.4, pb: 0.92, rote: 15.8, cet1: "14.8% (est.)", npe: 3.1, target: 3.81, divYield: "2.9% (est.)" },
  { bank: "NBG (ETE)", pe: 7.5, pb: 1.12, rote: 15.2, cet1: "16.1% (est.)", npe: 3.0, target: 7.20, divYield: "3.5% (est.)" },
  { bank: "Piraeus Bank (TPEIR)", pe: 6.2, pb: 0.71, rote: 12.8, cet1: "13.2% (est.)", npe: 4.2, target: 4.85, divYield: "2.5% (est.)" },
  { bank: "UniCredit (UCG)", pe: 6.8, pb: 1.05, rote: 16.1, cet1: "15.8% (est.)", npe: 2.1, target: 48.50, divYield: "5.8% (est.)" }
]

const radarPeer = [
  { subject: "Profitability", EUROB: 88, ALPHA: 85, ETE: 82, TPEIR: 68 },
  { subject: "Capital", EUROB: 76, ALPHA: 75, ETE: 85, TPEIR: 68 },
  { subject: "Asset Quality", EUROB: 82, ALPHA: 78, ETE: 80, TPEIR: 62 },
  { subject: "Growth", EUROB: 79, ALPHA: 75, ETE: 78, TPEIR: 72 },
  { subject: "Valuation", EUROB: 77, ALPHA: 88, ETE: 81, TPEIR: 92 },
  { subject: "Dividend", EUROB: 72, ALPHA: 68, ETE: 78, TPEIR: 55 }
]

const analystTargets = [
  { firm: "Goldman Sachs", target: 5.20, rating: "Buy", upside: "45.3%" },
  { firm: "JP Morgan", target: 4.80, rating: "Buy", upside: "34.1%" },
  { firm: "Morgan Stanley", target: 4.50, rating: "Buy", upside: "25.7%" },
  { firm: "HSBC", target: 4.40, rating: "Buy", upside: "22.9%" },
  { firm: "Deutsche Bank", target: 4.20, rating: "Buy", upside: "17.3%" },
  { firm: "Citi", target: 3.89, rating: "Buy", upside: "8.7%" },
  { firm: "Piraeus Securities", target: 5.81, rating: "Buy", upside: "62.3%" },
  { firm: "Barclays", target: 3.45, rating: "Hold", upside: "-3.6%" }
]

const eventImpacts = [
  { event: "Q1 2026 Earnings (May 7, 2026)", level: "High", direction: "Mixed", rationale: "Critical catalyst — will determine if 16%+ RoTBV and NII growth targets are on track. Geopolitical impact on provisioning will be watched closely." },
  { event: "Annual Shareholders Meeting (April 28, 2026)", level: "Medium", direction: "Positive", rationale: "Dividend approval expected at €0.109 DPS (3.0% yield). Management strategic update on geopolitical risk management." },
  { event: "US-Iran War Escalation Risk (April 6+ deadline)", level: "High", direction: "Negative", rationale: "Oil spike to $130-150+ would compress ECB easing cycle, hurt Greek growth, widen risk premiums on peripheral banks." },
  { event: "Russia-Ukraine Frozen Conflict", level: "Medium", direction: "Mixed", rationale: "Ceasefire stabilizes energy markets but prolongs uncertainty. European peacekeeping costs may affect fiscal policy." },
  { event: "ECB April 29-30 Meeting", level: "High", direction: "Mixed", rationale: "Rates expected held at 2.15%/2.0%. Geopolitical stress test integration could affect supervisory expectations." },
  { event: "Share Buyback Program Continuation", level: "Medium", direction: "Positive", rationale: "April buybacks at €3.9950 average show confidence. Provides price support around current levels." },
  { event: "Eurolife Life Acquisition (H1 2026)", level: "Medium", direction: "Mixed", rationale: "80-100bps CET1 drag confirmed but manageable. Diversification benefits vs. capital consumption." },
  { event: "Greek GDP Growth (2% target 2026)", level: "Medium", direction: "Positive", rationale: "Outperforming Eurozone average supports loan demand. Tourism recovery despite geopolitical concerns." },
  { event: "European Banking Authority Stress Tests", level: "Medium", direction: "Negative", rationale: "Geopolitical scenarios integrated. Greek banks may face higher risk weightings." }
]

const keyMetrics = [
  { label: "Stock Price", value: "€3.58", change: "+11.9% from March low", pos: true },
  { label: "Market Cap", value: "€13.01B", change: "+12% from March", pos: true },
  { label: "P/E Ratio", value: "8.61x", change: "vs EU Banks ~8.5x", pos: true },
  { label: "RoTBV", value: "16.2%", change: "Above 16% target maintained", pos: true },
  { label: "Net Profit (FY2025)", value: "€1,362M", change: "Q1 2026 results May 7", pos: null },
  { label: "NII Growth Target", value: "+6.6%", change: "2026E: driven by loan growth", pos: true },
  { label: "Fee Income Target", value: "+9.1%", change: "2026E: diversification push", pos: true },
  { label: "NPE Ratio", value: "2.6%", change: "Coverage 95.2%", pos: true },
  { label: "CET1 Ratio", value: "15.2% (est.)", change: "Post-Eurolife acquisition", pos: true },
  { label: "Dividend Yield", value: "3.0% (est.)", change: "AGM April 28 approval", pos: true },
  { label: "Share Buybacks", value: "1.023M shares", change: "April 2026 at €3.9950 avg", pos: true },
  { label: "Analyst Avg Target", value: "€4.44", change: "+24.0% upside", pos: true }
]

const newsItems = [
  {
    headline: "Eurobank to announce Q1 2026 results on May 7, followed by conference call",
    source: "Cyprus Inform",
    date: "2026-04-21",
    url: "https://www.kiprinform.com/en/cyprus_news/eurobank-to-release-first-quarter-2026-results-on-may-7-followed-by-conference-call/",
    sentiment: "neutral"
  },
  {
    headline: "Eurobank buys back over one million shares",
    source: "Cyprus Mail",
    date: "2026-04-20",
    url: "https://cyprus-mail.com/2026/04/20/eurobank-buys-back-over-one-million-shares",
    sentiment: "positive"
  },
  {
    headline: "Greek Banks: Stable Outlook in 2026 – Scope Ratings",
    source: "Athens Times",
    date: "2026-04-15",
    url: "https://athens-times.com/scope-ratings-stable-outlook-and-resilient-profits-for-greek-banks-amid-geopolitical-risks/",
    sentiment: "positive"
  },
  {
    headline: "ECB holds rates steady at April meeting, integrates geopolitical stress tests",
    source: "Central Banking",
    date: "2026-04-10",
    url: "",
    sentiment: "neutral"
  },
  {
    headline: "Eurobank successfully raises €400M through bond issue",
    source: "Reuters",
    date: "2026-04-05",
    url: "",
    sentiment: "positive"
  },
  {
    headline: "European banks face heightened geopolitical risk as conflicts escalate",
    source: "ECB Banking Supervision",
    date: "2026-04-02",
    url: "",
    sentiment: "negative"
  }
]

// ─── GEOPOLITICAL OVERLAY ────────────────────────────────────────────────────
const geoOverlay = {
  analysis: "Eurobank faces dual geopolitical headwinds from the active US-Iran War (Day 37, critical April 6+ deadline passed) and ongoing Russia-Ukraine conflict (Day 1,489). Both conflicts directly impact European energy costs, trade routes, ECB policy responses, and risk premiums on peripheral European banks.",
  analysisPath: "/geo/us-iran-war",
  date: "2026-04-25",
  relevance: "Greece's banking sector is exposed to Eastern Mediterranean trade disruptions, oil price volatility, ECB policy shifts, and European risk-off sentiment from both active conflicts. Energy-dependent Greek economy amplifies transmission channels.",
  keyChannels: [
    { channel: "Oil Price → ECB Policy → NII Impact", detail: "Oil at $109/bbl (vs $75 baseline) delays ECB cuts, supports NII but hurts loan demand", severity: "High" },
    { channel: "Risk Premium on Greek Assets", detail: "Peripheral bank selloffs in risk-off environments; high beta (1.18) amplifies volatility", severity: "High" },
    { channel: "Eastern Mediterranean Trade", detail: "Hormuz closure + potential Red Sea disruption affects Greek shipping/trade finance", severity: "Medium" },
    { channel: "Energy Cost Inflation", detail: "European gas/oil costs impact Greek corporate creditworthiness and consumer spending", severity: "Medium" },
    { channel: "Tourism Sector Impact", detail: "Regional instability perception could dampen Greek tourism recovery", severity: "Low" },
    { channel: "Capital Flow Disruption", detail: "Severe escalation could trigger deposit migration from periphery to core", severity: "Low" }
  ],
  scenarios: [
    {
      name: "Escalatory Resolution (US-Iran)",
      probability: "30%",
      color: "#06b6d4",
      priceImpact: "+15-25%",
      direction: "Positive",
      rationale: "War ends via US coercion by May; oil drops to $75-85; ECB cuts resume; risk premium compression; Greek banks outperform on recovery"
    },
    {
      name: "Prolonged Stalemate",
      probability: "40%",
      color: "#f59e0b",
      priceImpact: "+5-10%",
      direction: "Neutral",
      rationale: "Conflicts continue at current intensity; oil $100-110; ECB cautious; gradual fundamental re-rating toward €4.44 target"
    },
    {
      name: "Regional Conflagration",
      probability: "20%",
      color: "#ef4444",
      priceImpact: "-20-30%",
      direction: "Negative",
      rationale: "Multi-front escalation; oil $130-150+; ECB tightening; risk-off crushes peripheral banks; test €2.80-3.00 support"
    },
    {
      name: "Broader European Involvement",
      probability: "10%",
      color: "#dc2626",
      priceImpact: "-35-45%",
      direction: "Negative",
      rationale: "NATO/EU direct involvement; massive defense spending; deposit flight to core; systemic banking sector stress"
    }
  ],
  probabilityWeightedImpact: "Weighted expected impact: +2.5% (scenarios lean slightly positive on base case assumptions, but tail risks create significant downside volatility). High beta amplifies both upside and downside moves.",
  keyPoliticalSignals: [
    {
      actor: "Donald Trump",
      role: "US President",
      platform: "Truth Social",
      date: "2026-04-05",
      quote: "Open the F***in' Strait, you crazy bastards, or you'll be living in Hell. Tuesday will be Power Plant Day, and Bridge Day.",
      signalType: "escalatory",
      stockImpact: "Infrastructure strikes proceeding — oil spike risk; Greek banks vulnerable to energy shock transmission",
    },
    {
      actor: "ECB Banking Supervision",
      role: "Regulatory Authority",
      platform: "April 2026 Statement",
      date: "2026-04-02",
      quote: "Geopolitical risks are being integrated into supervisory stress tests for European banks",
      signalType: "risk warning",
      stockImpact: "Regulatory scrutiny increasing — potential for higher risk weights or capital requirements",
    }
  ]
}

const riskNotices = [
  {
    type: "Critical Geopolitical Event",
    icon: "⚠️",
    event: "US-Iran Infrastructure Strikes (April 6+ deadline)",
    description: "Trump's deadline for Hormuz reopening passed; infrastructure strikes proceeding. Oil could spike $130-150+, triggering ECB hawkish pivot and risk-off in peripheral banks.",
    impact: "Critical",
    impactColor: "#dc2626",
    suggestion: "Monitor oil prices and US military briefings. Consider hedging energy exposure; reduce position size in high-beta scenarios."
  },
  {
    type: "Earnings Catalyst Risk",
    icon: "📊",
    event: "Q1 2026 Results (May 7, 2026)",
    description: "First quarterly read on geopolitical impact, NII trends, and provisioning. Miss on guidance could trigger 10-15% decline.",
    impact: "High",
    impactColor: "#ef4444",
    suggestion: "Await earnings before major position changes. Strong results could drive breakout above €3.65."
  },
  {
    type: "Technical Resistance",
    icon: "📈",
    event: "200-Day MA at €3.65",
    description: "Stock testing critical resistance level. Failure to break above could signal return to €3.20-3.40 range.",
    impact: "Medium",
    impactColor: "#f59e0b",
    suggestion: "Watch for volume confirmation on any break above €3.65. Use tight stops if initiating above resistance."
  },
  {
    type: "Capital Consumption",
    icon: "🏦",
    event: "Eurolife Acquisition CET1 Impact",
    description: "80-100bps capital reduction from acquisition reduces buffer for geopolitical stress scenarios.",
    impact: "Medium",
    impactColor: "#f59e0b",
    suggestion: "Monitor CET1 disclosure in Q1 results. Ensure ratio stays >14% post-acquisition."
  }
]

// ─── VALUATION MODELS ─────────────────────────────────────────────────────────
const valuationModels = {
  dcf: {
    fcf: 1380,                    // Estimated FCF FY2025 in millions EUR
    growthRate: 0.089,            // Analyst consensus growth rate
    wacc: 0.102,                  // Risk-free 3.2% + beta 1.18 × 5.5% ERP + geopolitical premium
    terminalGrowthRate: 0.025,
    projectedFCFs: [1503, 1637, 1784, 1943, 2116],  // 5-year projection
    terminalValue: 27532,
    fairValuePerShare: 4.35,
    currentPrice: 3.58,
    upside: 21.5,
    assumptions: "FCF €1.38B base; growth 8.9%; WACC 10.2% (Rf 3.2% + 1.18 × 5.5% + 0.8% geopolitical premium); terminal 2.5%"
  },
  ddm: {
    dps: 0.109,
    growthRate: 0.065,            // ROE 16.2% × (1 - 55% payout) = 7.3%, adjusted for geopolitical risks
    requiredReturn: 0.098,
    fairValuePerShare: 3.52,
    assumptions: "DPS €0.109; g = 16.2% RoE × 45% retention - geopolitical adjustment = 6.5%; r = 9.8%"
  },
  relativeValuation: [
    { model: "P/E vs Sector", sectorMedian: 8.5, companyMetric: 0.37, impliedPrice: 3.15, verdict: "Fair" },
    { model: "P/B vs Historical", historicalAvg: 1.3, currentBookValue: 2.45, impliedPrice: 3.19, verdict: "Fair" },
    { model: "EV/EBITDA vs Sector", sectorMedian: 6.8, companyEBITDA: 2950, netDebt: 4200, impliedPrice: 4.12, verdict: "Undervalued" },
  ],
  summary: {
    bullCase: 4.35,    // DCF fair value
    baseCase: 3.62,    // Average of all models
    bearCase: 3.15,    // P/E relative valuation
    currentPrice: 3.58,
    verdict: "Fairly Valued — base case implies minimal upside; await geopolitical clarity"
  }
}

// ─── SENSITIVITY ANALYSIS ────────────────────────────────────────────────────
const sensitivityAnalysis = {
  niiSensitivity: {
    loanBookSize: 64500,          // millions EUR (6% growth from 2025)
    repricingGapPct: 0.22,
    impactPer25bps: 35,           // millions EUR
    note: "€64.5B × 22% gap × 0.0025 = €35M per 25bps rate change"
  },
  oilSensitivity: {
    chain: [
      { variable: "Oil +20% ($109→$131)", impact: "Eurozone inflation +0.8pp", mechanism: "ECB passthrough coefficient 0.04" },
      { variable: "Inflation +0.8pp", impact: "ECB hawkish pivot +50bps", mechanism: "Taylor rule response to persistent inflation" },
      { variable: "ECB +50bps vs expectations", impact: "NII +€70M, multiple compression −8%", mechanism: "Rate benefit vs. valuation drag from growth concerns" },
    ],
    netImpact: "Oil +20% → net slightly positive for NII (+€70M) but negative for equity valuation (−5-8% from multiple compression)"
  },
  fxSensitivity: {
    exposures: [
      { currency: "USD", exposure: "15%", impact: "+1% USD = +0.15% revenue" },
      { currency: "BGN", exposure: "8%", impact: "Pegged to EUR; minimal impact" }
    ],
    impactPer1Pct: "Net +0.15% revenue per 1% USD strength (Bulgaria operations EUR-linked)"
  },
  earningsTornado: [
    { variable: "Oil price ±20%", epsImpactBear: -0.04, epsImpactBull: +0.03, baseEps: 0.37 },
    { variable: "ECB rates ±50bps", epsImpactBear: -0.03, epsImpactBull: +0.05, baseEps: 0.37 },
    { variable: "NPE ratio ±1pp", epsImpactBear: -0.06, epsImpactBull: +0.02, baseEps: 0.37 },
    { variable: "Greek GDP ±1pp", epsImpactBear: -0.03, epsImpactBull: +0.04, baseEps: 0.37 },
    { variable: "Loan growth ±2pp", epsImpactBear: -0.02, epsImpactBull: +0.03, baseEps: 0.37 },
  ]
}

// ─── RISK QUANTIFICATION ─────────────────────────────────────────────────────
const riskQuantification = {
  expectedReturn: {
    scenarios: [
      { name: "Escalatory Resolution", probability: 0.30, return: 0.20 },
      { name: "Prolonged Stalemate", probability: 0.40, return: 0.08 },
      { name: "Regional Conflagration", probability: 0.20, return: -0.25 },
      { name: "European Involvement", probability: 0.10, return: -0.40 }
    ],
    weightedReturn: 0.025,       // 2.5% weighted expected return
    calculation: "0.30×20% + 0.40×8% + 0.20×(−25%) + 0.10×(−40%) = 2.5%"
  },
  maxDrawdown: {
    peak: 4.12,
    trough: 3.20,
    drawdownPct: -22.3,
    period: "January 2026 — March 2026"
  },
  sharpeRatio: {
    expectedReturn: 0.24,         // annualized from current to target
    riskFreeRate: 0.032,
    volatility: 0.28,            // beta 1.18 × market vol ~24% + geopolitical premium
    sharpe: 0.74,
    sectorBenchmark: 1.10,
    verdict: "Below sector average due to geopolitical risk premium"
  },
  kellyCriterion: {
    winProbability: 0.70,        // Escalatory + Stalemate scenarios
    avgWin: 0.14,
    avgLoss: 0.32,
    kellyPct: 0.098,
    halfKelly: 0.049,
    quarterKelly: 0.024,
    note: "Full Kelly = 9.8%; half = 4.9%; quarter = 2.4%. Use quarter-Kelly given high geopolitical uncertainty."
  }
}

const verdict = {
  stance: "CAUTIOUS HOLD",
  stanceColor: "#f59e0b",
  stanceBg: "rgba(245,158,11,0.1)",
  timing: "Await Q1 Results & Geopolitical Clarity",
  timingDetail: "Eurobank sits at a critical technical and fundamental inflection. The stock has recovered +11.9% from March lows but faces the 200-day MA resistance at €3.65. With Q1 2026 earnings on May 7 and ongoing geopolitical volatility (US-Iran war escalation, oil at $109), the risk-reward is balanced. Wait for: (1) Q1 earnings confirmation of 16%+ RoTBV targets, (2) break above €3.65 resistance with volume, (3) geopolitical de-escalation signal. The April share buybacks at €3.9950 provide upside guidance, but 30% combined probability of conflagration scenarios (20% + 10%) warrants caution.",
  entryZone: { low: 3.45, high: 3.65, ideal: 3.55 },
  stopLoss: { price: 3.20, pct: "-10.6%", rationale: "March low support; breach signals return to broader downtrend and potential test of €2.80-3.00" },
  targets: [
    { price: 3.75, label: "Target 1", horizon: "2-3 weeks", upside: "4.7%", trigger: "Break above 200-day MA; Q1 earnings beat" },
    { price: 3.99, label: "Target 2", horizon: "1-2 months", upside: "11.5%", trigger: "Reach buyback zone; geopolitical stabilization" },
    { price: 4.44, label: "Target 3", horizon: "3-6 months", upside: "24.0%", trigger: "Full analyst consensus on conflict resolution" },
    { price: 5.20, label: "Target 4", horizon: "6-12 months", upside: "45.3%", trigger: "Peace dividend + sector re-rating + ECB easing cycle" }
  ],
  riskReward: "2.4:1",
  conviction: "Medium",
  keyConditions: [
    { label: "Q1 2026 earnings meet/beat guidance (May 7)", status: "pending", impact: "Critical — validates 16%+ RoTBV trajectory and geopolitical resilience" },
    { label: "Break above €3.65 (200-day MA) with volume", status: "pending", impact: "Technical confirmation; opens path to €3.75-€3.99" },
    { label: "Oil stabilizes below $115/bbl", status: "pending", impact: "Prevents ECB hawkish pivot; supports peripheral bank valuations" },
    { label: "No major escalation in US-Iran conflict", status: "at risk", impact: "Regional conflagration (20% probability) would trigger significant selloff" },
    { label: "Share buyback program continues", status: "met", impact: "1.023M shares at €3.9950 average provides price support and management confidence signal" },
    { label: "CET1 ratio >14% post-Eurolife acquisition", status: "pending", impact: "Capital adequacy for stress scenarios; confirm in Q1 results" }
  ],
  bearCase: "In a bear scenario driven by regional conflagration (20% probability) or broader European involvement (10% probability), EUROB could decline to €2.50-€2.80 (−25-30% downside). Key catalysts: oil spike to $150+, ECB emergency tightening, mass capital flight from periphery to core, tourism collapse, deposit bank runs. The high beta of 1.18 amplifies downside moves. Earnings miss on Q1 2026 results due to higher provisioning or NII compression would accelerate the decline. Greek sovereign spreads widening beyond 200bps vs. Bunds would signal systemic stress affecting all Greek banks.",
  disclaimer: "Analytical data only. Not financial advice. Consult a qualified advisor before making investment decisions. Geopolitical scenarios based on current conflicts and may change rapidly."
}

const analysisGaps = [
  { topic: "Q1 2026 CET1 Ratio Post-Eurolife", description: "Exact post-acquisition capital ratio crucial for stress test capacity under geopolitical scenarios", issueTitle: "Confirm Q1 2026 CET1 ratio and Eurolife drag impact in May 7 earnings" },
  { topic: "NII Sensitivity to Oil Price Shocks", description: "Quantified impact of $130-150 oil on ECB policy path and resulting NII effects for Greek banks", issueTitle: "Model ECB response function to oil shocks and Greek bank NII sensitivity" },
  { topic: "Tourism Sector Exposure", description: "Indirect exposure to Greek tourism via SME lending; geopolitical impact on 2026 summer season", issueTitle: "Assess tourism loan book exposure and regional instability impact" },
  { topic: "Deposit Flight Risk Assessment", description: "Probability and magnitude of deposit migration from Greek banks to core European banks in stress scenarios", issueTitle: "Model deposit beta and flight risk under conflagration scenarios" },
  { topic: "Trade Finance Exposure to Eastern Med", description: "Direct exposure to Suez/Red Sea/Eastern Mediterranean trade routes affected by conflicts", issueTitle: "Quantify trade finance revenue at risk from shipping disruptions" }
]

export default function EurobankDashboard() {
  return <StockDashboard
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
    dashboardFile="src/dashboards/stocks/eurob-2026-04-25.jsx"
  />
}