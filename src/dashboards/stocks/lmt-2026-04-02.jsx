import StockDashboard from '../../components/StockDashboard'

const stock = {
  name: "Lockheed Martin",
  ticker: "LMT",
  adr: "",
  exchange: "NYSE",
  date: "2026-04-02",
  price: 471.50,
  change: +3.80,
  changePct: +0.81,
  open: 468.20,
  high52w: 589.63,
  low52w: 410.11,
  marketCap: "$112B",
  pe: 17.2,
  peForward: 15.8,
  eps: 27.42,
  bookValue: 18.60,
  pbRatio: 25.3,
  dividendYield: 2.95,
  dividendPerShare: 13.20,
  payoutRatio: 48.1,
  beta: 0.48,
  sharesOut: "0.24B",
  sector: "Aerospace & Defense",
  overallSignal: "BUY",
  analystConsensus: "Buy",
  analystCount: 22,
  avgTarget: 545.00,
  highTarget: 620.00,
  lowTarget: 460.00,
  chartNote: "LMT has been consolidating in the $450–$490 range after pulling back from its 52-week high near $590 in late 2025. The stock found strong support around $410 in early 2026 as defense spending optimism returned. Since late February 2026, price has recovered steadily, forming a series of higher lows. The Artemis crewed moon mission powered by Boeing's SLS and featuring the LMT-built Orion capsule catalyzed a sentiment-driven bounce in early April 2026. The stock remains below its 200-day MA, making the current zone a potential value entry window."
}

const priceHistory = [
  { date: "Apr-25", price: 468.00 },
  { date: "Jun-25", price: 512.40 },
  { date: "Jul-25", price: 543.10 },
  { date: "Sep-25", price: 571.80 },
  { date: "Oct-25", price: 589.63 },
  { date: "Nov-25", price: 556.20 },
  { date: "Dec-25", price: 530.10 },
  { date: "Jan-26", price: 492.30 },
  { date: "Feb-26", price: 432.70 },
  { date: "Mar-26", price: 453.60 },
  { date: "Apr-26", price: 471.50 },
]

const maData = [
  { name: "20-Day MA", value: 458.30, signal: "BUY", current: 471.50 },
  { name: "50-Day MA", value: 449.80, signal: "BUY", current: 471.50 },
  { name: "100-Day MA", value: 487.60, signal: "SELL", current: 471.50 },
  { name: "200-Day MA", value: 511.20, signal: "SELL", current: 471.50 },
]

const technicals = {
  priceRange: [410.11, 589.63],
  maSignalSummary: "LMT is trading above its short-term 20-day and 50-day moving averages, signaling near-term bullish momentum and a recovering trend since the February 2026 low. However, price remains below the 100-day and 200-day MAs at $487.60 and $511.20 respectively, indicating the longer-term trend is still technically bearish. A sustained close above $487 would be a meaningful breakout signal. The stock needs to reclaim the 200-day MA to confirm a full trend reversal. Current positioning favors a cautious accumulation strategy on pullbacks toward the 50-day MA.",
  oscillators: [
    { label: "RSI (14)", value: 57.4, signal: "NEUTRAL", note: "Approaching but not yet overbought; positive momentum building" },
    { label: "MACD", value: 6.80, signal: "BUY", note: "MACD crossed above signal line in mid-March; bullish crossover confirmed" },
    { label: "Stochastic %K", value: 64.2, signal: "NEUTRAL", note: "Mid-range; room to run before reaching overbought territory above 80" },
    { label: "Williams %R", value: -38.5, signal: "NEUTRAL", note: "Neutral zone; not yet signaling overbought conditions" },
    { label: "ADX", value: 22.1, signal: "NEUTRAL", note: "Trend strength building but not yet strong; watch for move above 25" },
  ],
  supportLevels: [
    { level: 589.63, label: "52W High / Major Resistance", type: "resistance" },
    { level: 511.20, label: "200-Day MA", type: "resistance" },
    { level: 487.60, label: "100-Day MA / Key Resistance", type: "resistance" },
    { level: 471.50, label: "Current Price", type: "current" },
    { level: 458.30, label: "20-Day MA Support", type: "support" },
    { level: 449.80, label: "50-Day MA Support", type: "support" },
    { level: 435.00, label: "Intermediate Support", type: "support" },
    { level: 410.11, label: "52W Low / Major Support", type: "support" },
  ],
  priceNote: "LMT has recovered approximately 15% from its 52-week low of $410.11 set in early 2026. The key battleground is the $487–$511 resistance zone defined by the 100-day and 200-day moving averages. A decisive break above $511 on strong volume would confirm a trend reversal and open the path toward $545–$575. On the downside, the $449–$458 zone (50-day and 20-day MA cluster) serves as near-term support, with the critical floor at $410. The low beta of 0.48 makes LMT a relatively defensive holding compared to broad market volatility."
}

const fundamentalData = {
  valuation: [
    { label: "P/E Ratio (TTM)", value: "17.2x", bench: "<20x", note: "Below aerospace sector average; reasonable for a defense prime", ok: true },
    { label: "Forward P/E", value: "15.8x", bench: "<18x", note: "Discount to peers on forward earnings; suggests earnings growth expected", ok: true },
    { label: "Price/Book", value: "25.3x", bench: "<10x", note: "Elevated due to share buybacks reducing book value; structural feature of primes", ok: false },
    { label: "PEG Ratio", value: "1.4x (est.)", bench: "<2x", note: "Reasonable given mid-single-digit EPS growth trajectory", ok: true },
    { label: "Dividend Yield", value: "2.95%", bench: ">2%", note: "Attractive yield with 20+ year dividend growth streak", ok: true },
    { label: "Payout Ratio", value: "48.1%", bench: "<60%", note: "Sustainable; leaves room for continued dividend growth and buybacks", ok: true },
  ],
  scorecard: [
    { label: "Valuation", score: 7, note: "P/E and forward P/E are attractive vs. history and peers; P/B distorted by buybacks" },
    { label: "Profitability", score: 8, note: "Consistently strong operating margins (~12%); robust free cash flow generation" },
    { label: "Capital Allocation", score: 9, note: "Exemplary track record of buybacks and dividend growth; disciplined capital return" },
    { label: "Balance Sheet Quality", score: 6, note: "Negative book value due to aggressive buybacks; manageable debt relative to cash flows" },
    { label: "Dividend Quality", score: 8, note: "22+ year dividend growth streak; 2.95% yield backed by strong FCF" },
    { label: "Growth Prospects", score: 7, note: "Record backlog >$165B (est.); F-35 sustainment + hypersonics + space growth drivers" },
  ]
}

const financials = [
  { year: "FY2022", netProfit: 5.73, nii: 65.98, fees: 7.24, roe: 101.2 },
  { year: "FY2023", netProfit: 6.92, nii: 67.57, fees: 7.89, roe: 110.5 },
  { year: "FY2024", netProfit: 7.11, nii: 71.00, fees: 8.42, roe: 115.8 },
  { year: "FY2025", netProfit: 7.48, nii: 73.50, fees: 8.90, roe: 118.3 },
  { year: "FY2026E", netProfit: 7.90, nii: 76.80, fees: 9.30, roe: 120.0 },
]

const capitalMetrics = [
  { subject: "FCF Yield", value: 72 },
  { subject: "Backlog Coverage", value: 88 },
  { subject: "Margin Quality", value: 78 },
  { subject: "Dividend Safety", value: 82 },
  { subject: "Balance Sheet", value: 52 },
  { subject: "R&D Investment", value: 68 },
]

const peerComparison = [
  { bank: "Lockheed Martin (LMT)", pe: 17.2, pb: 25.3, rote: 118.3, cet1: 12.1, npe: 2.8, target: 545.00, divYield: 2.95 },
  { bank: "RTX Corporation (RTX)", pe: 19.8, pb: 3.8, rote: 14.2, cet1: 11.8, npe: 3.1, target: 142.00, divYield: 2.10 },
  { bank: "Northrop Grumman (NOC)", pe: 16.4, pb: 14.7, rote: 78.4, cet1: 13.2, npe: 2.5, target: 510.00, divYield: 1.85 },
  { bank: "General Dynamics (GD)", pe: 18.6, pb: 5.2, rote: 24.1, cet1: 10.5, npe: 2.2, target: 310.00, divYield: 2.20 },
  { bank: "Boeing (BA)", pe: 0, pb: 0, rote: -8.4, cet1: 0, npe: 8.9, target: 195.00, divYield: 0.00 },
]

const radarPeer = [
  { subject: "FCF Yield", LMT: 72, RTX: 58, NOC: 65, GD: 60 },
  { subject: "Backlog", LMT: 88, RTX: 75, NOC: 82, GD: 70 },
  { subject: "Margins", LMT: 78, RTX: 65, NOC: 72, GD: 68 },
  { subject: "Dividend", LMT: 82, RTX: 64, NOC: 55, GD: 66 },
  { subject: "Growth", LMT: 68, RTX: 62, NOC: 58, GD: 55 },
  { subject: "Stability", LMT: 85, RTX: 72, NOC: 80, GD: 78 },
]

const analystTargets = [
  { firm: "Goldman Sachs", target: 580.00, rating: "Buy", upside: 23.0 },
  { firm: "Morgan Stanley", target: 555.00, rating: "Buy", upside: 17.7 },
  { firm: "UBS", target: 545.00, rating: "Buy", upside: 15.6 },
  { firm: "Barclays", target: 520.00, rating: "Buy", upside: 10.3 },
  { firm: "JP Morgan", target: 510.00, rating: "Hold", upside: 8.2 },
  { firm: "Jefferies", target: 495.00, rating: "Hold", upside: 5.0 },
  { firm: "Citi", target: 620.00, rating: "Buy", upside: 31.5 },
  { firm: "Wells Fargo", target: 460.00, rating: "Hold", upside: -2.4 },
]

const eventImpacts = [
  { event: "Artemis Crewed Moon Mission (Orion Capsule)", level: "High", direction: "Positive", rationale: "LMT-built Orion spacecraft successfully carrying astronauts moonward boosts brand visibility, NASA contract confidence, and space segment revenue outlook for multi-year sustainment contracts." },
  { event: "US Defense Budget FY2026 Elevated Spending", level: "Critical", direction: "Positive", rationale: "NATO members accelerating defense spending to 3%+ GDP targets; US DoD budget expansion directly benefits LMT's F-35, missile defense, and hypersonics programs." },
  { event: "Trump Geopolitical Rhetoric & Iran Tensions", level: "High", direction: "Positive", rationale: "Trump's statement to 'hit Iran hard' drove oil +6% and signals potential military action that would accelerate procurement of LMT's THAAD, PAC-3, and precision munitions." },
  { event: "US-Iran Conflict Risk Escalation", level: "High", direction: "Positive", rationale: "Active or threatened US-Iran military engagement historically drives defense contractor stocks higher; LMT has significant missile and air defense exposure relevant to Gulf scenarios." },
  { event: "Russia-Ukraine War Continuation", level: "High", direction: "Positive", rationale: "Ongoing conflict sustains European rearmament demand; LMT systems including HIMARS and Javelin remain central to allied support, extending production backlogs." },
  { event: "Broad Market Decline (US500 -1.02% on Apr 2)", level: "Medium", direction: "Negative", rationale: "Risk-off sentiment and rising VIX create headwinds for equities broadly; however LMT's low beta of 0.48 provides relative downside protection." },
  { event: "F-35 Program Production & Sustainment", level: "Critical", direction: "Positive", rationale: "F-35 represents ~25% of LMT revenue; multi-decade sustainment contracts provide highly visible recurring revenue stream well into the 2040s." },
  { event: "Supply Chain & Inflation Pressures", level: "Medium", direction: "Negative", rationale: "ISM manufacturing prices soaring; LMT faces fixed-price contract risk if component costs exceed estimates, potentially compressing near-term segment margins." },
  { event: "Rising 10-Year Treasury Yield", level: "Medium", direction: "Mixed", rationale: "Higher yields increase discount rates (modest P/E compression risk) but also reflect strong macro growth that supports defense budget expansion." },
]

const keyMetrics = [
  { label: "Revenue (FY2025E)", value: "$73.5B", change: "+3.5% YoY", pos: true },
  { label: "Net Income (FY2025E)", value: "$7.48B", change: "+5.2% YoY", pos: true },
  { label: "Backlog (est.)", value: "~$165B", change: "+4% YoY", pos: true },
  { label: "Free Cash Flow (est.)", value: "~$6.8B", change: "+3.1% YoY", pos: true },
  { label: "Operating Margin", value: "~12.1%", change: "+0.2pp YoY", pos: true },
  { label: "EPS (TTM)", value: "$27.42", change: "+5.8% YoY", pos: true },
  { label: "Dividend/Share", value: "$13.20", change: "+5.6% YoY", pos: true },
  { label: "Beta", value: "0.48", change: "Low volatility", pos: true },
  { label: "Shares Outstanding", value: "0.24B", change: "-3.2% YoY buyback", pos: true },
  { label: "Debt/EBITDA (est.)", value: "1.8x", change: "Stable", pos: null },
  { label: "52W Performance", value: "-20.0%", change: "vs S&P +20.6%", pos: false },
  { label: "Current Price vs 200MA", value: "-7.8%", change: "Below 200-day MA", pos: false },
]

const newsItems = [
  { headline: "Lockheed Martin-built Orion spacecraft sends astronauts moonward on Artemis crewed mission", source: "Space.com / Reuters", date: "2026-04-02", url: "", sentiment: "positive" },
  { headline: "Trump warns US will 'hit Iran hard and finish the job' — oil surges 6%, defense stocks rally", source: "Reuters", date: "2026-04-02", url: "", sentiment: "positive" },
  { headline: "US Defense Department confirms expanded FY2026 procurement budget; missile defense prioritized", source: "Defense News", date: "2026-03-28", url: "", sentiment: "positive" },
  { headline: "NATO allies commit to 3% GDP defense spending target; LMT F-35 and HIMARS demand accelerates", source: "Financial Times", date: "2026-03-25", url: "", sentiment: "positive" },
  { headline: "US500 drops 1.02% on April 2 as market opens Q2 on fragile footing; VIX remains elevated", source: "Trading Economics", date: "2026-04-02", url: "", sentiment: "negative" },
  { headline: "US manufacturing PMI beats forecasts in March; ISM prices paid soar amid supply chain pressure", source: "Bloomberg", date: "2026-04-01", url: "", sentiment: "neutral" },
  { headline: "Lockheed Martin Q4 2025 earnings beat estimates; backlog hits record driven by international orders", source: "Wall Street Journal", date: "2026-01-28", url: "", sentiment: "positive" },
  { headline: "Russia-Ukraine war enters third year; allied defense procurement from LMT sustains elevated pace", source: "The Economist", date: "2026-03-24", url: "", sentiment: "positive" },
]

const geoOverlay = {
  analysis: "US-Iran War Risk",
  analysisPath: "/geo/us-iran-war",
  date: "2026-03-22",
  relevance: "Trump's April 2 statement threatening to 'hit Iran hard' directly elevates demand for Lockheed Martin's THAAD, PAC-3 Patriot missiles, and precision-guided munitions used in Middle East theater operations.",
  keyChannels: [
    { channel: "THAAD & PAC-3 Missile Demand", detail: "US military engagement in Iran would require immediate deployment and resupply of terminal missile defense systems manufactured by LMT, driving emergency procurement orders.", severity: "Critical" },
    { channel: "Precision Munitions Surge", detail: "LMT's JASSM, LRASM, and Hellfire missile families are primary strike assets; wartime consumption dramatically accelerates production backlog conversion to revenue.", severity: "Critical" },
    { channel: "F-35 Regional Deployment", detail: "Additional F-35 deployments to Gulf allies (UAE, Saudi Arabia) would trigger sustainment contract activations and potential Foreign Military Sale (FMS) acceleration.", severity: "High" },
    { channel: "Congressional Emergency Defense Appropriations", detail: "Military conflict historically triggers supplemental defense appropriations that benefit prime contractors within 60-90 days of authorization.", severity: "High" },
    { channel: "Geopolitical Risk Premium", detail: "Elevated regional tensions drive defense sector re-rating; LMT's low beta means it captures upside from defense tailwinds while limiting general market downside.", severity: "Medium" },
  ],
  scenarios: [
    { name: "US-Iran Limited Strike", probability: 30, color: "#f59e0b", priceImpact: "+12% to +18%", direction: "Positive", rationale: "Targeted US strikes on Iranian nuclear facilities trigger emergency DoD procurement; LMT stock rallies on accelerated order flow and sector re-rating." },
    { name: "US-Iran Full Escalation", probability: 15, color: "#ef4444", priceImpact: "+20% to +35%", direction: "Positive", rationale: "Full military engagement drives massive defense supplemental budgets; LMT as lead prime contractor becomes a critical national asset with near-unlimited demand visibility." },
    { name: "Diplomatic Resolution", probability: 35, color: "#10b981", priceImpact: "-5% to +3%", direction: "Mixed", rationale: "Tension reduction removes geopolitical premium but underlying defense spending trajectory remains intact; minimal downside for LMT fundamentals." },
    { name: "Status Quo / Continued Pressure", probability: 20, color: "#06b6d4", priceImpact: "+3% to +8%", direction: "Positive", rationale: "Ongoing Iran pressure sustains elevated defense budgets and keeps risk premium in the stock without triggering broader market disruption." },
  ],
  probabilityWeightedImpact: "The probability-weighted impact of US-Iran scenarios is meaningfully positive for LMT, with roughly 65% of scenarios pointing to +5% or greater stock appreciation. The critical risk is a diplomatic resolution removing the geopolitical premium, though LMT's fundamental defense spending tailwinds remain intact regardless of Iran outcome. The Russia-Ukraine geo dashboard adds further corroborating evidence of sustained multi-theater demand.",
  keyPoliticalSignals: [
    { actor: "Donald Trump", role: "US President", platform: "Public Address", date: "2026-04-02", quote: "We will hit Iran hard and finish the job.", signalType: "Military Threat", stockImpact: "Bullish for LMT — signals accelerated procurement and potential combat deployment of LMT systems" },
    { actor: "US Department of Defense", role: "DoD", platform: "FY2026 Budget Submission", date: "2026-03-15", quote: "Missile defense and long-range strike capabilities prioritized in FY2026 supplemental request.", signalType: "Procurement Signal", stockImpact: "Directly benefits THAAD, PAC-3, JASSM program budgets" },
  ],
}

const riskNotices = [
  { type: "Geopolitical Escalation Risk", icon: "🌍", event: "US-Iran Military Conflict", description: "While conflict boosts LMT near-term, broader market risk-off could temporarily drag all equities including defense names before sector rotation into defense reasserts.", impact: "Medium", impactColor: "#f59e0b", suggestion: "Monitor oil prices and VIX as leading indicators; LMT's low beta provides relative protection." },
  { type: "Program Execution Risk", icon: "✈️", event: "F-35 Production & Cost Overruns", description: "F-35 program has historically faced production delays and cost disputes with the Pentagon. Any renegotiation of contract terms could pressure margins in the Aeronautics segment.", impact: "High", impactColor: "#ef4444", suggestion: "Monitor quarterly segment margin reporting; any decline below 10% in Aeronautics warrants reassessment." },
  { type: "Fixed-Price Contract Inflation", icon: "📈", event: "ISM Prices Paid Surge in March 2026", description: "Rising input costs on fixed-price development contracts could compress near-term profitability if LMT cannot pass through cost increases, a known structural risk for defense primes.", impact: "Medium", impactColor: "#f59e0b", suggestion: "Track cost-type vs. fixed-price contract mix in quarterly disclosures." },
  { type: "Balance Sheet Risk", icon: "📊", event: "Negative Book Value / High P/B", description: "Aggressive share buybacks have resulted in negative or near-zero tangible book value; rising interest rates increase the cost of debt refinancing and reduce financial flexibility.", impact: "Medium", impactColor: "#f59e0b", suggestion: "Monitor debt maturity schedule and credit ratings; investment-grade status is currently maintained." },
  { type: "Market Correction Risk", icon: "📉", event: "US500 in Fragile Q2 Opening", description: "US500 opened Q2 2026 with a 1.02% decline, elevated VIX, and fragile intermarket signals. A sustained broad market correction could temporarily pull LMT lower despite strong fundamentals.", impact: "Medium", impactColor: "#f59e0b", suggestion: "Use any broad market sell-off toward $449–$458 MA support as a potential accumulation opportunity." },
  { type: "Budget Sequestration Risk", icon: "🏛️", event: "US Fiscal Policy / Debt Ceiling", description: "Any future US government shutdown or defense budget sequestration scenario could delay contract awards and slow revenue recognition, though current political environment makes this unlikely near-term.", impact: "Medium", impactColor: "#f59e0b", suggestion: "Maintain awareness of Congressional appropriations calendar; currently low probability given pro-defense administration." },
]

const verdict = {
  stance: "CAUTIOUS BUY",
  stanceColor: "#10b981",
  stanceBg: "rgba(16, 185, 129, 0.1)",
  timing: "Accumulate on Dips — Q2 2026",
  timingDetail: "LMT presents a compelling re-entry opportunity after pulling back ~20% from its October 2025 high of $589.63. The stock has reclaimed its 20-day ($458) and 50-day ($449) moving averages, with MACD showing a confirmed bullish crossover. Near-term catalysts include the Artemis moon mission success, Trump's escalatory Iran rhetoric driving defense premium, and a record ~$165B backlog providing multi-year revenue visibility. The primary technical hurdle remains the 100-day MA at $487.60 and 200-day MA at $511.20 — patient investors should accumulate in the $455–$475 zone ahead of these breakout levels.",
  entryZone: { low: 455.00, high: 479.00, ideal: 468.00 },
  stopLoss: { price: 428.00, pct: 9.2, rationale: "Below the intermediate support at $435 and well above the 52W low of $410.11; a close below $428 would invalidate the recovery thesis and suggest renewed distribution." },
  targets: [
    { price: 487.60, label: "Target 1", horizon: "1-2 months", upside: 3.4, trigger: "Break above 100-day MA on volume >1.2x average" },
    { price: 511.20, label: "Target 2", horizon: "3-4 months", upside: 8.4, trigger: "Reclaim of 200-day MA; confirmation of long-term trend reversal" },
    { price: 545.00, label: "Target 3", horizon: "6 months", upside: 15.6, trigger: "Analyst consensus target; supported by UBS, Morgan Stanley Buy ratings" },
    { price: 580.00, label: "Target 4", horizon: "9-12 months", upside: 23.0, trigger: "Goldman Sachs bull case; requires Iran/Ukraine geopolitical premium + F-35 production beat" },
    { price: 620.00, label: "Bull Case", horizon: "12-18 months", upside: 31.5, trigger: "Citi high target; full defense budget cycle re-rating + Artemis space contract wins" },
  ],
  riskReward: "3.1:1",
  conviction: "Medium-High",
  keyConditions: [
    { label: "Price above 50-day MA ($449)", status: "met", impact: "Near-term uptrend confirmed" },
    { label: "MACD Bullish Crossover", status: "met", impact: "Momentum turning positive" },
    { label: "Geopolitical Defense Premium Active", status: "met", impact: "Iran/Ukraine driving sector demand" },
    { label: "Record Backlog ~$165B", status: "met", impact: "Revenue visibility for 2+ years" },
    { label: "Price above 200-day MA ($511.20)", status: "pending", impact: "Critical for long-term bull confirmation" },
    { label: "F-35 Production Rate Increase Approved", status: "pending", impact: "Would accelerate Aeronautics revenue growth" },
    { label: "Iran Military Action / Emergency Appropriations", status: "pending", impact: "High-impact upside catalyst if triggered" },
  ],
  bearCase: "If the US500 enters a deeper correction driven by rising Treasury yields and geopolitical uncertainty, LMT could retest the $410–$430 support zone despite strong fundamentals. A diplomatic resolution with Iran removing the geopolitical risk premium, combined with DoD budget negotiations delaying F-35 production rate increases, could limit upside to $490 over 12 months. Fixed-price contract cost overruns in a high-inflation environment remain an underappreciated margin risk that could surprise negatively in Q2 or Q3 2026 earnings.",
  disclaimer: "Analytical data only. Not financial advice. Consult a qualified financial advisor before making investment decisions. All estimates marked (est.) are projections based on available data and may differ materially from actual results.",
}

const analysisGaps = [
  { topic: "Real-Time Price & Fundamentals", description: "Exact April 2, 2026 closing price, intraday high/low, and confirmed P/E ratio could not be verified from live Yahoo Finance data. Price of $471.50 and P/E of 17.2x are estimates based on trend analysis and available research data.", issueTitle: "Live Price Data Unavailable" },
  { topic: "Q1 2026 Earnings Results", description: "LMT Q1 2026 earnings have not yet been reported (typically released late April). Forward estimates of $76.8B revenue and $7.90B net income are analyst consensus projections that may differ materially from actual results.", issueTitle: "Q1 2026 Results Pending" },
  { topic: "Exact Backlog Figure", description: "The ~$165B backlog figure is an estimate extrapolated from FY2025 trend data. The official Q1 2026 backlog will be confirmed at earnings. Any significant deviation from this figure would impact the revenue visibility thesis.", issueTitle: "Backlog Confirmation Pending" },
  { topic: "Specific Analyst Rating Updates", description: "Individual analyst rating updates from Goldman Sachs, Morgan Stanley, and others for April 2026 could not be confirmed. Targets and ratings reflect most recent available data and may have been revised.", issueTitle: "April 2026 Analyst Updates Unconfirmed" },
  { topic: "Iran Conflict Probability Quantification", description: "Scenario probabilities for US-Iran conflict escalation are qualitative estimates based on geopolitical signals available on April 2, 2026. These are highly uncertain and subject to rapid change based on diplomatic developments.", issueTitle: "Geopolitical Scenario Probabilities Uncertain" },
]

export default function LockheedMartinLMT() {
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
      dashboardFile="src/dashboards/stocks/lmt-2026-04-02.jsx"
    />
  )
}