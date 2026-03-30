import StockDashboard from '../../components/StockDashboard'

const stock = {
  name: "Eurobank Ergasias Services and Holdings S.A.",
  ticker: "EUROB",
  adr: "",
  exchange: "ATH (Athens Exchange)",
  date: "2026-03-30",
  price: 3.20,
  change: -0.04,
  changePct: -1.23,
  open: 3.22,
  high52w: 4.12,
  low52w: 2.38,
  marketCap: "€11.63B",
  pe: 7.67,
  peForward: 7.05,
  eps: 0.37,
  bookValue: 2.45,
  pbRatio: 1.31,
  dividendYield: "3.4%",
  dividendPerShare: "€0.109 (est.)",
  payoutRatio: "55%",
  beta: 1.18,
  sharesOut: "3.63B",
  sector: "Financials — Banks",
  overallSignal: "BUY",
  analystConsensus: "Buy",
  analystCount: 27,
  avgTarget: 4.44,
  highTarget: 5.93,
  lowTarget: 3.07,
  chartNote: "Eurobank has pulled back significantly from its 52-week high of €4.12, declining roughly 22% and currently trading at €3.20 — well below both its 50-day MA (€3.89) and 200-day MA (~€3.43). The stock is under sustained selling pressure amid broader European banking sector weakness tied to geopolitical uncertainty. However, the pullback has compressed the P/E to just 7.67x against strong 2025 results, and aggressive share buybacks around €3.30 suggest the company views current levels as undervalued. RSI at 43.66 indicates bearish momentum but not yet oversold, suggesting potential further downside before a reversal. Analysts maintain a strong Buy consensus with an average target of €4.44, implying ~39% upside."
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
  { date: "Mar-26", price: 3.20 }
]

const maData = [
  { name: "5-Day MA", value: 3.22, signal: "SELL", current: 3.20 },
  { name: "20-Day MA", value: 3.38, signal: "SELL", current: 3.20 },
  { name: "50-Day MA", value: 3.89, signal: "SELL", current: 3.20 },
  { name: "200-Day MA", value: 3.43, signal: "SELL", current: 3.20 }
]

const technicals = {
  priceRange: [2.38, 4.12],
  maSignalSummary: "Eurobank is trading below all key moving averages — the 5-day (€3.22), 20-day (€3.38), 50-day (€3.89), and 200-day (€3.43) — confirming a strong bearish technical setup. The stock has broken below its 200-day MA, a significant long-term support level, which has now flipped to resistance. The gap between price and the 50-day MA (~18%) is notably wide, indicating the recent selloff may be overextended. A mean reversion back toward the 200-day MA at €3.43 would represent a 7% bounce from current levels.",
  oscillators: [
    { label: "RSI (14)", value: 43.66, signal: "NEUTRAL", note: "Below 50 = bearish bias, but not oversold" },
    { label: "MACD", value: -0.12, signal: "SELL", note: "MACD line below signal line, histogram negative (est.)" },
    { label: "Stochastic %K", value: 28.5, signal: "SELL", note: "Approaching oversold territory below 20 (est.)" },
    { label: "Williams %R", value: -72.3, signal: "SELL", note: "Below -50 indicates bearish momentum (est.)" },
    { label: "ADX", value: 31.2, signal: "SELL", note: "Trend strength moderate; confirms bearish direction (est.)" }
  ],
  supportLevels: [
    { level: 4.12, label: "52-Week High", type: "resistance" },
    { level: 3.89, label: "50-Day MA", type: "resistance" },
    { level: 3.43, label: "200-Day MA", type: "resistance" },
    { level: 3.30, label: "Buyback Zone", type: "resistance" },
    { level: 3.20, label: "Current Price", type: "current" },
    { level: 3.10, label: "Analyst Low Target / Near Support", type: "support" },
    { level: 2.95, label: "July 2025 Support", type: "support" },
    { level: 2.68, label: "June 2025 Low", type: "support" },
    { level: 2.38, label: "52-Week Low", type: "support" }
  ],
  priceNote: "Eurobank's technical picture is decisively bearish on daily and weekly timeframes. All four major moving averages issue Sell signals, and oscillators confirm downward momentum without yet reaching oversold extremes. The nearest support cluster sits at €3.07–€3.10 (analyst low target and psychological support). The company's active buyback program around €3.30 provides a soft floor, but if broader risk-off sentiment persists — driven by geopolitical tensions (US-Iran, Russia-Ukraine) — the stock could test €2.95 or even €2.68. Conversely, stabilization above €3.20 followed by a recapture of the 200-day MA at €3.43 would be the first constructive signal for bulls."
}

const fundamentalData = {
  valuation: [
    { label: "P/E Ratio", value: "7.67x", bench: "EU Banks ~8.5x", note: "Discount to European banking peers", ok: true },
    { label: "P/B Ratio", value: "1.31x", bench: "EU Banks ~0.85x", note: "Premium reflects higher RoTBV; justified by 16% returns", ok: true },
    { label: "PEG Ratio", value: "0.86x (est.)", bench: "<1.0 undervalued", note: "Based on ~8.9% projected earnings growth", ok: true },
    { label: "Dividend Yield", value: "3.4% (est.)", bench: "EU Banks ~4.5%", note: "Growing; payout ratio rising to ~55%", ok: true },
    { label: "Payout Ratio", value: "~55%", bench: "30-60%", note: "Increasing from prior years; 50% cumulative uplift planned 2026-28", ok: true }
  ],
  scorecard: [
    { label: "Valuation", score: 8, note: "P/E of 7.67x is attractive for a bank earning 16% RoTBV" },
    { label: "Profitability", score: 8, note: "RoTBV at 16%, NII growth, strong fee income expansion of 15.7%" },
    { label: "Capital Adequacy", score: 7, note: "BBB- rating from S&P, adequate CET1 though Eurolife acquisition consumes 80-100bps" },
    { label: "Asset Quality", score: 7, note: "NPE ratio at 2.6% with 95.2% coverage — significant improvement" },
    { label: "Dividend & Shareholder Returns", score: 7, note: "Rising payout ratio to 55%, active share buybacks at €3.30 avg" },
    { label: "Growth", score: 8, note: "Organic loan growth of €5.3B in 2025; 7.5% CAGR projected, AUM growth 16% CAGR" }
  ]
}

const financials = [
  { year: "FY2022", netProfit: "€1,180M (est.)", nii: "€2,150M (est.)", fees: "€560M (est.)", roe: "13.5% (est.)" },
  { year: "FY2023", netProfit: "€1,310M (est.)", nii: "€2,380M (est.)", fees: "€620M (est.)", roe: "14.8% (est.)" },
  { year: "FY2024", netProfit: "€1,485M (est.)", nii: "€2,506M (est.)", fees: "€665M (est.)", roe: "15.4% (est.)" },
  { year: "FY2025", netProfit: "€1,362M", nii: "€2,549M", fees: "€770M", roe: "16.0%" },
  { year: "FY2026E", netProfit: "€1,480M (est.)", nii: "€2,700M (est.)", fees: "€890M (est.)", roe: "16.0%" }
]

const capitalMetrics = [
  { subject: "Profitability", value: 85 },
  { subject: "Capital Strength", value: 72 },
  { subject: "Asset Quality", value: 78 },
  { subject: "Growth", value: 82 },
  { subject: "Dividend", value: 68 },
  { subject: "Valuation", value: 80 }
]

const peerComparison = [
  { bank: "Eurobank (EUROB)", pe: 7.67, pb: 1.31, rote: 16.0, cet1: "14.2% (est.)", npe: 2.6, target: 4.44, divYield: "3.4% (est.)" },
  { bank: "Alpha Bank (ALPHA)", pe: 6.8, pb: 0.75, rote: 12.5, cet1: "14.5% (est.)", npe: 4.1, target: 2.10, divYield: "2.8% (est.)" },
  { bank: "NBG (ETE)", pe: 7.2, pb: 0.95, rote: 14.8, cet1: "16.0% (est.)", npe: 3.2, target: 10.50, divYield: "3.8% (est.)" },
  { bank: "Piraeus Bank (TPEIR)", pe: 5.9, pb: 0.62, rote: 11.2, cet1: "12.8% (est.)", npe: 4.8, target: 5.20, divYield: "2.2% (est.)" },
  { bank: "UniCredit (UCG)", pe: 6.5, pb: 0.98, rote: 15.2, cet1: "15.5% (est.)", npe: 2.2, target: 52.00, divYield: "5.5% (est.)" }
]

const radarPeer = [
  { subject: "Profitability", EUROB: 85, ALPHA: 68, ETE: 78, TPEIR: 60 },
  { subject: "Capital", EUROB: 72, ALPHA: 74, ETE: 82, TPEIR: 65 },
  { subject: "Asset Quality", EUROB: 80, ALPHA: 62, ETE: 72, TPEIR: 55 },
  { subject: "Growth", EUROB: 82, ALPHA: 70, ETE: 72, TPEIR: 68 },
  { subject: "Valuation", EUROB: 75, ALPHA: 82, ETE: 78, TPEIR: 88 },
  { subject: "Dividend", EUROB: 68, ALPHA: 55, ETE: 72, TPEIR: 45 }
]

const analystTargets = [
  { firm: "Goldman Sachs", target: 5.20, rating: "Buy", upside: "62.5%" },
  { firm: "JP Morgan", target: 4.80, rating: "Buy", upside: "50.0%" },
  { firm: "Morgan Stanley", target: 4.50, rating: "Buy", upside: "40.6%" },
  { firm: "HSBC", target: 4.40, rating: "Buy", upside: "37.5%" },
  { firm: "Deutsche Bank", target: 4.20, rating: "Buy", upside: "31.3%" },
  { firm: "Citi", target: 3.89, rating: "Buy", upside: "21.6%" },
  { firm: "Piraeus Securities", target: 5.81, rating: "Buy", upside: "81.6%" },
  { firm: "Barclays", target: 3.10, rating: "Hold", upside: "-3.1%" }
]

const eventImpacts = [
  { event: "Eurolife Life 80% Acquisition Completion (H1 2026)", level: "High", direction: "Positive", rationale: "Strengthens life insurance franchise in Greece; 80-100bps CET1 drag already priced in. Accretive to long-term earnings diversification." },
  { event: "Share Buyback Program Ongoing", level: "Medium", direction: "Positive", rationale: "Active repurchases at €3.30 avg price signal management confidence and provide price support." },
  { event: "Q1 2026 Earnings (May 7, 2026)", level: "High", direction: "Mixed", rationale: "Critical catalyst — will validate or challenge 2026 guidance of ~€1.9B core operating profit and 16% RoTBV." },
  { event: "ECB Monetary Policy / Rate Path", level: "High", direction: "Mixed", rationale: "Further rate cuts compress NII tailwinds; however, cautiously accommodative stance expected to support growth." },
  { event: "Russia-Ukraine War Escalation", level: "High", direction: "Negative", rationale: "Elevates European energy/commodity risk, potentially disrupting economic recovery in Greece and Southeast Europe." },
  { event: "US-Iran Conflict Escalation", level: "Medium", direction: "Negative", rationale: "Oil price spikes and shipping disruption in Eastern Mediterranean could impact Greek economy and trade finance." },
  { event: "CRR3/CRD6 Implementation", level: "Medium", direction: "Mixed", rationale: "New capital requirements framework — Eurobank's capital buffers appear adequate but transition costs may arise." },
  { event: "Greek GDP Growth Trajectory", level: "Medium", direction: "Positive", rationale: "Greece expected to outperform Eurozone average; supports organic loan growth of 7.5% CAGR target." },
  { event: "Annual Shareholders Meeting (Apr 28, 2026)", level: "Medium", direction: "Positive", rationale: "Dividend approval and strategic update; payout increase to ~55% is a key shareholder return catalyst." },
  { event: "AMLA Transfer of AML Supervision (2026)", level: "Low", direction: "Negative", rationale: "New regulatory body may introduce transitional compliance costs, though Eurobank appears well-prepared." }
]

const keyMetrics = [
  { label: "Stock Price", value: "€3.20", change: "-22.3% from 52w high", pos: false },
  { label: "Market Cap", value: "€11.63B", change: "", pos: null },
  { label: "P/E Ratio", value: "7.67x", change: "vs EU Banks ~8.5x", pos: true },
  { label: "RoTBV", value: "16.0%", change: "Target ≥16% maintained", pos: true },
  { label: "Net Profit (FY2025)", value: "€1,362M", change: "-4.9% YoY (adj)", pos: false },
  { label: "NII (FY2025)", value: "€2,549M", change: "+1.7% YoY", pos: true },
  { label: "Fee Income (FY2025)", value: "€770M", change: "+15.7% YoY", pos: true },
  { label: "NPE Ratio", value: "2.6%", change: "Coverage 95.2%", pos: true },
  { label: "Total Assets", value: "€108.0B", change: "+€6.8B YoY", pos: true },
  { label: "Customer Deposits", value: "€82.7B", change: "+€4.1B YoY", pos: true },
  { label: "Organic Loan Growth", value: "€5.3B", change: "7.5% CAGR target", pos: true },
  { label: "Analyst Avg Target", value: "€4.44", change: "+38.7% upside", pos: true }
]

const newsItems = [
  {
    headline: "Eurobank repurchases 1.84M shares in buyback program (Mar 23-27, 2026)",
    source: "Athens Exchange",
    date: "2026-03-28",
    url: "",
    sentiment: "positive"
  },
  {
    headline: "Eurobank reports FY2025 net profit of €1.36B, exceeding internal targets",
    source: "Eurobank Investor Relations",
    date: "2026-02-26",
    url: "",
    sentiment: "positive"
  },
  {
    headline: "Eurobank unveils 2026-2028 Business Plan: 16%+ RoTBV, 10% EPS CAGR",
    source: "Reuters",
    date: "2026-02-26",
    url: "",
    sentiment: "positive"
  },
  {
    headline: "Eurolife Life acquisition (80% stake) expected to close H1 2026",
    source: "S&P Global Ratings",
    date: "2025-10-15",
    url: "",
    sentiment: "positive"
  },
  {
    headline: "S&P affirms Eurobank BBB-/A-3 ratings with stable outlook",
    source: "S&P Global",
    date: "2025-10-22",
    url: "",
    sentiment: "positive"
  },
  {
    headline: "Eurobank share buyback: 1.91M shares acquired at €3.43 avg (Mar 16-20)",
    source: "Athens Exchange",
    date: "2026-03-21",
    url: "",
    sentiment: "positive"
  },
  {
    headline: "European banks face heightened geopolitical risk as ECB integrates stress tests",
    source: "ECB Supervisory Report",
    date: "2026-03-15",
    url: "",
    sentiment: "negative"
  },
  {
    headline: "Greek economy expected to outperform Eurozone in 2026 — GDP growth above 2%",
    source: "Bank of Greece",
    date: "2026-03-10",
    url: "",
    sentiment: "positive"
  },
  {
    headline: "CRR3/CRD6 implementation timeline accelerates for EU banks in 2026",
    source: "European Banking Authority",
    date: "2026-02-18",
    url: "",
    sentiment: "neutral"
  }
]

const geoOverlay = {
  analysis: "Eurobank operates primarily in Greece, Bulgaria, Cyprus, and Luxembourg — all regions with significant exposure to geopolitical spillovers from both the Russia-Ukraine war and the US-Iran conflict. The Russia-Ukraine war impacts European energy costs, commodity pricing, and overall economic sentiment in the Eurozone, directly affecting loan growth, credit risk, and deposit flows. The US-Iran conflict poses additional risks through oil price volatility, Eastern Mediterranean shipping disruptions, and broader risk-off sentiment that weighs on Greek and Southern European equities. Eurobank's management explicitly identifies geopolitical developments as 'tail risks' that could disrupt supply chains and commodity prices.",
  analysisPath: "/geo/russia-ukraine-war",
  date: "2026-03-24",
  relevance: "Eurobank's Southeast European operations and Greek economic exposure make it highly sensitive to energy costs, trade disruptions, and geopolitical risk premiums from both the Russia-Ukraine and US-Iran conflicts.",
  keyChannels: [
    { channel: "Energy & Commodity Prices", detail: "European gas/oil price spikes from Russia-Ukraine or US-Iran escalation directly impact Greek inflation, consumer spending, and corporate creditworthiness", severity: "High" },
    { channel: "Risk Premium on Greek/EU Assets", detail: "Escalation drives capital flows away from Southern European equities; Greek bank stocks are disproportionately sold in risk-off environments", severity: "High" },
    { channel: "ECB Policy Response", detail: "Geopolitical inflation may delay or reverse rate cuts, compressing bank NII outlook and dampening loan demand", severity: "Medium" },
    { channel: "Trade & Shipping Disruption", detail: "Eastern Mediterranean trade routes affected by Iran conflict; Eurobank's trade finance business directly exposed", severity: "Medium" },
    { channel: "Tourism Impact on Greek Economy", detail: "Perceived regional instability could dampen Greek tourism — a key GDP driver affecting Eurobank's retail banking", severity: "Medium" },
    { channel: "Deposit & Funding Stability", detail: "Severe escalation scenarios could trigger deposit migration from peripheral banks to core Eurozone safe havens", severity: "Low" }
  ],
  scenarios: [
    { name: "Ceasefire / De-escalation", probability: "25%", color: "#10b981", priceImpact: "+15-25%", direction: "Positive", rationale: "Risk premium compression, energy cost normalization, accelerated Greek GDP growth — stock re-rates toward €4.00+" },
    { name: "Status Quo / Contained Conflict", probability: "45%", color: "#f59e0b", priceImpact: "+5-10%", direction: "Positive", rationale: "Gradual normalization as markets adapt; fundamentals drive re-rating toward analyst consensus of €4.44" },
    { name: "Moderate Escalation", probability: "20%", color: "#ef4444", priceImpact: "-10-15%", direction: "Negative", rationale: "Energy spike and risk-off sentiment push stock toward €2.80-€2.95 support zone" },
    { name: "Major Escalation / NATO Involvement", probability: "10%", color: "#dc2626", priceImpact: "-25-35%", direction: "Negative", rationale: "Severe economic disruption; Greek banks face deposit outflows, credit deterioration — stock tests €2.38 or below" }
  ],
  probabilityWeightedImpact: "The probability-weighted geopolitical impact on Eurobank is moderately positive (+3-6% expected), as the most likely scenario (45% — Status Quo) supports gradual fundamental re-rating, while the de-escalation tail (25%) offers meaningful upside. However, the 30% combined probability of escalation scenarios warrants caution, particularly given the stock's high beta (1.18) and its sensitivity to European risk sentiment. The buyback program provides a partial floor, but investors should size positions to accommodate a potential -15% drawdown in a moderate escalation scenario.",
  keyPoliticalSignals: [
    { actor: "ECB", role: "Monetary Policy Authority", platform: "March 2026 Statement", date: "2026-03-15", quote: "Geopolitical risk remains elevated and is being integrated into supervisory stress tests for European banks", signalType: "Risk Warning", stockImpact: "Near-term cautious — may weigh on banking sector valuations" },
    { actor: "Eurobank Management", role: "CEO/CFO — FY2025 Presentation", platform: "Investor Relations", date: "2026-02-26", quote: "Geopolitical developments remain a tail risk, though our core markets are performing better than the Eurozone average", signalType: "Balanced Assessment", stockImpact: "Reassuring but acknowledges risk — management actively monitoring" }
  ]
}

const riskNotices = [
  { type: "Geopolitical Risk", icon: "🌍", event: "Russia-Ukraine / US-Iran Escalation", description: "Eurobank is exposed to European energy cost spikes, risk premium widening, and Eastern Mediterranean trade disruptions from both active conflicts.", impact: "High", impactColor: "#ef4444", suggestion: "Monitor energy prices and NATO statements; consider scaling into position rather than full allocation." },
  { type: "Technical Breakdown", icon: "📉", event: "Trading Below All Major Moving Averages", description: "Stock is below 5-day, 20-day, 50-day, and 200-day MAs. Strong Sell signals across all technical indicators. No confirmed reversal pattern yet.", impact: "High", impactColor: "#ef4444", suggestion: "Wait for stabilization above €3.30 or RSI < 30 oversold bounce before initiating new positions." },
  { type: "Capital Consumption", icon: "🏦", event: "Eurolife Life Acquisition", description: "80% stake acquisition expected to reduce CET1 by 80-100bps. While S&P confirmed BBB- rating, reduced capital buffers increase sensitivity to economic shocks.", impact: "Medium", impactColor: "#f59e0b", suggestion: "Monitor CET1 ratio in Q1 2026 earnings; ensure it remains above 13% post-acquisition." },
  { type: "Earnings Deceleration", icon: "⚠️", event: "Adjusted Net Profit Down 4.9% YoY in FY2025", description: "Despite strong topline growth, higher operating expenses (+17.4% YoY) compressed adjusted net profit. Cost efficiency is a key watch item.", impact: "Medium", impactColor: "#f59e0b", suggestion: "Track cost-income ratio in Q1 2026; management must demonstrate operating leverage." },
  { type: "Regulatory Transition", icon: "📋", event: "CRR3/CRD6 and AMLA Implementation", description: "New EU capital requirements and AML supervision transfer to AMLA may create transitional compliance costs and reporting burden.", impact: "Medium", impactColor: "#f59e0b", suggestion: "Monitor regulatory guidance and assess any incremental capital requirement disclosures." },
  { type: "ECB Rate Path Risk", icon: "🏛️", event: "Potential Rate Cuts Compressing NII", description: "Eurobank's NII grew only 1.7% in FY2025 as rate tailwinds faded. Further ECB cuts could pressure the bank's largest revenue line.", impact: "Medium", impactColor: "#f59e0b", suggestion: "Focus on fee income growth (15.7% YoY) as a diversification offset; monitor NII trends in quarterly results." }
]

const verdict = {
  stance: "CAUTIOUS BUY",
  stanceColor: "#10b981",
  stanceBg: "rgba(16,185,129,0.1)",
  timing: "Accumulate on Weakness — Phased Entry",
  timingDetail: "Eurobank's fundamentals are compelling: 16% RoTBV, 7.67x P/E, declining NPEs at 2.6%, and a well-articulated 2026-2028 growth plan with 10% EPS CAGR. However, the stock is in a confirmed technical downtrend, trading 18% below its 50-day MA with Strong Sell signals across all timeframes. The Q1 2026 earnings report on May 7 is the next major catalyst. We recommend initiating a 50% position in the €3.00–€3.15 zone and adding the remaining 50% upon either (a) a confirmed break above the 200-day MA at €3.43 or (b) positive Q1 2026 earnings print validating 2026 guidance.",
  entryZone: { low: 3.00, high: 3.20, ideal: 3.10 },
  stopLoss: { price: 2.75, pct: "-11.3%", rationale: "Below 52-week low support cluster of €2.68–€2.80; breach signals fundamental deterioration beyond technical correction" },
  targets: [
    { price: 3.43, label: "Target 1", horizon: "1-2 months", upside: "7.2%", trigger: "Recapture of 200-day moving average; technical sentiment shift" },
    { price: 3.89, label: "Target 2", horizon: "3-4 months", upside: "21.6%", trigger: "Q1 2026 earnings beat and recapture of 50-day MA; analyst consensus validation" },
    { price: 4.44, label: "Target 3", horizon: "6-9 months", upside: "38.8%", trigger: "Full fundamental re-rating to analyst consensus; dividend increase confirmation" },
    { price: 5.20, label: "Target 4", horizon: "12-18 months", upside: "62.5%", trigger: "Geopolitical de-escalation premium + 2026-2028 plan execution + multiple expansion" },
    { price: 5.81, label: "Target 5 (Bull)", horizon: "18-24 months", upside: "81.6%", trigger: "Full business plan delivery, Greek sovereign upgrade cycle, sector re-rating" }
  ],
  riskReward: "3.5:1",
  conviction: "Medium-High",
  keyConditions: [
    { label: "Stock stabilizes above €3.10 support", status: "pending", impact: "Critical for entry validation; breach below implies further downside" },
    { label: "Q1 2026 earnings confirm 2026 guidance", status: "pending", impact: "Validates 16% RoTBV and ~€1.9B core operating profit targets" },
    { label: "Buyback program continues at current pace", status: "met", impact: "Provides soft price floor around €3.20-€3.30" },
    { label: "NPE ratio remains ≤3.0%", status: "met", impact: "2.6% NPE with 95.2% coverage confirms strong asset quality trajectory" },
    { label: "No major geopolitical escalation in Eastern Mediterranean", status: "pending", impact: "Escalation would trigger risk-off selling disproportionately impacting Greek banks" },
    { label: "Eurolife acquisition closes without capital surprises", status: "pending", impact: "CET1 drawdown of 80-100bps must remain within guided range" }
  ],
  bearCase: "In a bear scenario, Eurobank could see its stock decline to €2.40–€2.70 (a further 15-25% downside) driven by a confluence of geopolitical escalation (Russia-Ukraine or US-Iran), ECB rate cuts compressing NII, higher-than-expected operating expense growth, and capital erosion from the Eurolife acquisition. If the Greek economy underperforms or European risk sentiment deteriorates sharply, the stock's high beta of 1.18 would amplify losses. Additionally, if Q1 2026 earnings disappoint or the NPE ratio begins ticking upward, the current P/B premium over Greek peers would compress, potentially pushing the stock toward its 52-week low of €2.38. The €17.4% YoY increase in operating expenses in FY2025 is a yellow flag — if not contained, it could erode the profitability advantage that justifies Eurobank's premium valuation.",
  disclaimer: "Analytical data only. Not financial advice. Consult a qualified advisor before making investment decisions. All estimates marked (est.) are derived from available data and analyst projections, not confirmed company filings."
}

const analysisGaps = [
  { topic: "CET1 Ratio Post-Eurolife Acquisition", description: "Exact CET1 ratio post-Eurolife 80% acquisition not confirmed; only estimated 80-100bps impact disclosed. Need Q1 2026 data.", issueTitle: "Track CET1 ratio in May 7 Q1 2026 earnings" },
  { topic: "Detailed Cost-Income Ratio Trajectory", description: "Operating expenses rose 17.4% YoY in FY2025 but granular cost breakdown and management guidance for 2026 efficiency targets not fully detailed.", issueTitle: "Analyze cost-income ratio trend in upcoming quarters" },
  { topic: "Bulgaria & Cyprus Segment Breakdown", description: "Revenue contribution and growth rates by geography (Greece vs Bulgaria vs Cyprus) not granularly available in current research data.", issueTitle: "Request segment-level financial data from IR" },
  { topic: "Exact Dividend Per Share for FY2025", description: "Dividend yield estimated at ~3.4% based on payout ratio guidance; actual DPS awaits AGM approval on April 28, 2026.", issueTitle: "Confirm DPS at Annual Shareholders Meeting" },
  { topic: "Interest Rate Sensitivity / NII Modeling", description: "Impact of further ECB rate cuts on NII not quantified; management guided 1.7% NII growth but forward sensitivity unknown.", issueTitle: "Build NII sensitivity model with rate scenario analysis" }
]

export default function EurobankDashboard() {
  return <StockDashboard stock={stock} priceHistory={priceHistory} maData={maData} technicals={technicals} fundamentalData={fundamentalData} financials={financials} capitalMetrics={capitalMetrics} peerComparison={peerComparison} radarPeer={radarPeer} analystTargets={analystTargets} eventImpacts={eventImpacts} keyMetrics={keyMetrics} newsItems={newsItems} geoOverlay={geoOverlay} riskNotices={riskNotices} verdict={verdict} analysisGaps={analysisGaps} dashboardFile="src/dashboards/stocks/eurob-2026-03-30.jsx" />
}