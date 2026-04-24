# Project: Analysis Dashboard Hub

This is an auto-deploying React analysis dashboard site. Every analysis (geopolitical, stock, or other) is created as a `.jsx` component, committed, and pushed to GitHub — which triggers an automatic Vercel deployment.

## Project Structure

```
/src
  /dashboards          ← All analysis dashboards go here
    /geopolitical       ← Geopolitical analysis dashboards (wars, diplomacy, sanctions)
    /stocks             ← Stock analysis dashboards (individual tickers)
    /sectors            ← Sector & industry analysis dashboards (casino market, EV industry, etc.)
  /components           ← Shared UI components (charts, cards, etc.)
  App.jsx               ← Main app with routing to all dashboards
  index.jsx             ← Entry point
/public
/AGENTS.md              ← This file
```

## Git Workflow

After creating or updating any dashboard:
1. `git add .`
2. `git commit -m "feat: [type] analysis - [subject] - [date]"` (e.g., `feat: geopolitical analysis - US-China Trade War - 2026-03-22`)
3. `git push origin main`

Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`

## Tech Stack

- React 18+ with functional components and hooks
- Tailwind CSS (core utility classes only)
- Recharts for all charts and data visualizations
- lucide-react for icons
- No localStorage — use React state only

## Design System

### Theme: Dark Financial Terminal
- **Backgrounds**: Deep navy (`#0a0f1e`), charcoal (`#111827`), slate (`#1e293b`)
- **Text**: White (`#f8fafc`), muted (`#94a3b8`), dim (`#64748b`)
- **Accents**: Cyan (`#06b6d4`), emerald (`#10b981`), amber (`#f59e0b`), crimson (`#ef4444`), violet (`#8b5cf6`)
- **Typography**: Monospace for numbers/data, clean sans-serif for labels and headers
- **Layout**: Dense, information-rich, CSS grid multi-panel layouts
- **Interactivity**: Tabs, toggleable sections, hover states, tooltips

### Anti-Patterns (NEVER do these)
- Generic AI aesthetics (purple gradients on white)
- Cookie-cutter card layouts
- Inter/Roboto/Arial fonts
- Sparse, empty layouts — every pixel should convey information

---

# SKILL: Geopolitical Decision Analyzer & Predictor

## When to Use
Trigger when the user asks about: geopolitical analysis, international relations, foreign policy predictions, trade war outcomes, military strategy, diplomatic scenarios, sanctions impact, alliance dynamics, regional conflict assessment, or any question about how countries might act and what consequences could follow.

## Core Analytical Framework

Every geopolitical analysis follows this pipeline — don't skip steps:

### Step 1: Situation Assessment
- **Actors**: Key state and non-state actors, stated and unstated interests
- **Context**: Historical precedents, treaties, alliances, economic relationships
- **Triggers**: Recent events or emerging trends prompting the analysis
- **Power Dynamics**: Relative military, economic, technological, and soft power
- **Domestic Politics**: Election cycles, public opinion, factions, leadership stability

### Step 2: Decision Tree Mapping
- Realistic options available to each major actor
- Constraints (legal, economic, military, domestic political)
- Sequences: if Actor A does X, what opens/closes for Actor B?

### Step 3: Multi-Scenario Construction (3-5 scenarios)
Each scenario must have:
- **Name**: Evocative label (e.g., "Cold Detente", "Economic Iron Curtain")
- **Description**: Paragraph narrative of how events unfold
- **Probability**: Percentage likelihood (all must sum to ~100%)
- **Time horizons**: Short-term (0-6mo), Medium (6-24mo), Long (2-10yr)
- **Impact ratings**: Scored 1-10 across dimensions

### Step 4: Feasibility & Sustainability Assessment
For every major action in each scenario, assess:

**Military Feasibility**: Force projection, sustainability, terrain, track record
**Economic Capacity**: Reserves, debt tolerance, sanctions resilience, GDP impact
**Political Will**: Public support, elite consensus, electoral vulnerability, casualty tolerance
**Alliance Viability**: Who's actually committed, coalition fracture points

**Sustainability Ratings**:
- Fully Sustainable (can maintain indefinitely)
- Sustainable Short-Term (6-18 months before strain)
- Barely Feasible (severe strain immediately)
- Not Feasible (unrealistic despite theoretical capability)

### Step 5: Impact Assessment (1-10 scale)
| Dimension | What It Measures |
|---|---|
| Military/Security | Armed conflict risk, arms races, security posture |
| Economic/Trade | GDP impact, trade disruption, sanctions, market volatility |
| Diplomatic | Alliance shifts, institutional changes, treaty implications |
| Humanitarian | Civilian impact, refugees, human rights |
| Regional Stability | Spillover effects, neighboring responses |
| Global Systemic | International norms, precedents, world order |

### Step 5b: Game Theory Framework (apply to 2-3 most critical decision points)

For the key strategic decisions, model as a game:

**Payoff Matrix Construction:**
```
                    Actor B: Cooperate       Actor B: Defect
Actor A: Cooperate  (A: +3, B: +3)          (A: −5, B: +5)
Actor A: Defect     (A: +5, B: −5)          (A: −2, B: −2)
```
- Assign payoff values (−10 to +10) based on: territorial/strategic gains, economic impact, domestic political benefit, international standing
- Identify game type: **Prisoner's Dilemma** (mutual defection likely), **Chicken Game** (one must swerve), **Assurance Game** (both prefer cooperation if mutual), **Asymmetric**
- **Nash Equilibrium**: Outcome(s) where no actor can improve by unilaterally changing strategy → this is the "stable" scenario
- **Commitment problems**: Public statements create audience costs → more credible threats. Secret channels → less credible
- **Repeated game dynamics**: If actors will interact repeatedly, cooperation becomes more likely (shadow of the future)

### Step 5c: Bayesian Probability Updates (apply to all scenario probabilities)

All scenario probabilities must be tracked with explicit update reasoning:

**Prior → Posterior framework:**
```
P(Scenario | Signal) = P(Signal | Scenario) × P(Scenario) / P(Signal)

Simplified likelihood ratio approach:
  If Signal is 3× more likely under Scenario A than Scenario B:
  → New_P(A) ≈ Old_P(A) × 3 / (Old_P(A) × 3 + Old_P(B) × 1 + ...)
  → Normalize so all scenarios sum to 100%
```

**Track probability evolution:**
```javascript
probabilityHistory: [
  { date: "2026-03-01", scenarios: { "Ceasefire": 30, "Escalation": 20 }, signal: "Initial assessment", direction: "baseline" },
  { date: "2026-03-15", scenarios: { "Ceasefire": 25, "Escalation": 25 }, signal: "Iran rejects 15-point plan", direction: "escalatory", likelihoodRatio: "Rejection 3× more likely if no ceasefire" },
]
```
Display as: LineChart showing probability evolution per scenario over time, with signal annotations.

### Step 5d: Economic Impact Modeling

For every geopolitical scenario, quantify economic transmission:

**Oil Shock Transmission:**
```
ΔOil% → ΔInflation (pp) = ΔOil% × passthrough_coefficient
  Passthrough coefficients (empirical, IMF):
  - US: 0.03 (10% oil increase → +0.3pp inflation)
  - Eurozone: 0.04 (higher energy import dependence)
  - Emerging markets: 0.05-0.07
ΔOil% → ΔGDP = −0.15% per 10% sustained oil price increase (IMF rule of thumb)
Example: Oil +50% ($75 → $112) → GDP impact ≈ −0.75% over 4 quarters
```

**Trade Disruption:**
```
Impact = Affected Trade Volume × Disruption Probability × GDP Multiplier
  GDP Multiplier for trade: 0.5-1.5× depending on sector substitutability
Example: Hormuz closure affects $5.5T annual trade → 40% disruption → multiplier 0.8
```

**Sanctions Impact — Historical Analogs:**
| Country | Year | Type | GDP Impact |
|---------|------|------|-----------|
| Iran | 2012 | Oil + financial | −6.6% |
| Russia | 2022 | Comprehensive | −2.1% |
| Iran | 2018 | Oil (US unilateral) | −4.8% |
| Venezuela | 2019 | Oil + financial | −35% (compounded) |

**Phillips Curve Implications:**
```
Modern Phillips Curve: π = π_expected + α(Y − Y*) + supply_shock
  where supply_shock = oil/commodity price shock component
  α ≈ 0.3-0.5 for developed economies
For affected economies: map ΔUnemployment ↔ ΔInflation trade-off
```

### Step 5e: Escalation Dynamics

**Escalation Ladder (adapted from Herman Kahn):**
```
Level 1: Diplomatic Tension — Harsh words, ambassador recalls, UN votes
Level 2: Economic Warfare — Sanctions, trade restrictions, asset freezes
Level 3: Proxy Conflict — Support for armed groups, cyberattacks, covert ops
Level 4: Limited Military Strikes — Targeted attacks on military assets only
Level 5: Strategic Strikes — Infrastructure targeting, economic destruction
Level 6: Total War — Full mobilization, civilian targeting, WMD risk
```
Identify: Current level + what actions move up/down + which scenario corresponds to which level.

**Thucydides Trap (for great power competition):**
Does this conflict involve a rising power threatening a ruling power?
- Historical rate: 12 of 16 cases resulted in war (Graham Allison)
- Conditions: rapid power shift, alliance entanglement, domestic nationalism
- Mitigating factors: nuclear deterrence, economic interdependence, institutional frameworks

**Security Dilemma:**
When one side's defensive preparations are perceived as offensive threats:
- Identify which actions create the dilemma
- Offense-defense balance: is it easier to attack or defend?
- Spiral model risk: could mutual defensive moves escalate the conflict?

### Step 5f: Political Economy

**Selectorate Theory (who matters for leader survival):**
For each key leader, identify:
- Winning coalition (W): Group whose support is essential (military, oligarchs, voters, party)
- Selectorate (S): Broader group from which W is drawn
- W/S ratio: Low (autocracy) → private goods; High (democracy) → public goods
- Implication: Small W → can sustain unpopular wars longer; Large W → constrained by public opinion

**Rally-Around-the-Flag Effect:**
```
Expected approval boost: +5-15pp (empirical average)
Duration: 2-6 months, then decay at ~1-2pp per month
Historical data: Bush 9/11 +35pp (exceptional), Falklands +11pp, Gulf War +18pp
Current status: Is rally active? How far into decay?
```

**Audience Costs:**
Leaders who make public threats face domestic punishment for backing down:
- High audience costs: democratic leaders with public commitments → harder to back down
- Low audience costs: autocratic leaders with controlled media → easier to back down
- If Leader X has made public threats, following through becomes more likely

**Economic Voting Model:**
```
Approval ≈ f(GDP_growth, Inflation, Unemployment)
Rule of thumb: approval drops ~3pp per 1pp increase in inflation, ~2pp per 1pp increase in unemployment
If war causes economic pain → approval drops → political pressure for resolution
```

### Step 6: Key Indicators & Signposts
For each scenario, identify 3-5 observable, monitorable indicators:
- Diplomatic appointments/recalls
- Military deployment patterns
- Trade data shifts
- Public statements with specific language
- Votes at international bodies
- Economic indicators crossing thresholds

### Step 7: Expert & Institutional Opinion Analysis
Search for and synthesize expert opinions from:
- **Think tanks**: Brookings, RAND, CFR, IISS, Chatham House, Carnegie, CSIS, SIPRI, RUSI, Lowy, ECFR
- **Government-adjacent**: Former diplomats, ex-intel officials, retired military
- **Academics**: Regional/domain specialists
- **Local/regional voices**: Analysts from affected countries

Structure as:
1. **Consensus View** — mainstream position
2. **Dissenting Views** — credible contrarians and reasoning
3. **Regional vs. Western Gap** — perspective differences
4. **Expert Confidence Level** — high confidence or heavy hedging?
5. **Track Record** — did they get previous calls right?

### Specific Data Sources for Geopolitical Analysis

Run searches in 3 parallel batches using specific sources:

**Batch 1 — Situation & Breaking News (run in parallel):**
- Glint Trade Terminal (check first, per existing rule)
- `site:reuters.com [conflict/topic] [current month year]` → breaking news with real URLs
- `site:aljazeera.com [topic]`, `site:bbc.com [topic]` → multi-perspective coverage

**Batch 2 — Expert Analysis & Data (run in parallel):**
- `site:rand.org [topic]` → RAND assessments
- `site:brookings.edu [topic]`, `site:cfr.org [topic]` → think tank analysis
- `site:sipri.org military expenditure [country]` → military spending data
- `site:acleddata.com [country/region]` → conflict event data and fatality counts
- `site:worldbank.org [country] GDP` → GDP and trade data

**Batch 3 — Economic & Humanitarian Data (run in parallel):**
- `site:imf.org world economic outlook [country]` → IMF growth forecasts
- `site:fred.stlouisfed.org [indicator]` → US economic data (oil prices, CPI, treasury yields)
- `site:ecb.europa.eu economic bulletin` → Eurozone macro data
- `site:reliefweb.int [country/crisis]` → UN OCHA humanitarian data
- `site:eia.gov petroleum supply` → oil supply/demand data

**Fallback rule:** If RAND/Brookings have no analysis, check IISS, Chatham House, CSIS, Carnegie, ECFR, RUSI.

### Step 8: Political Signals Collection (MANDATORY)
Search for and collect real statements, posts, and public communications from key actors that directly signal intent or shift probabilities. These are the raw political inputs that move markets and change scenario weights.

**Check Glint Trade Terminal first** for live breaking signals, market-moving headlines, and real-time political communications before searching other platforms.

Search for: `[leader name] statement [topic]`, `[leader name] tweet [topic]`, `[country] official statement [topic]`, `[leader] press conference [date]`

For each statement collect:
- **Who**: Actor name + role
- **Platform**: Twitter/X, Truth Social, Telegram, Press Conference, State TV, Parliament, UN speech, etc.
- **Date & time** (precision matters — a tweet before a market open vs. after close)
- **Exact quote** (or closest verified paraphrase — mark unverified as `verified: false`)
- **Context**: What was happening when this was said?
- **Signal type**: `escalatory` | `de-escalatory` | `diplomatic` | `economic` | `ambiguous`
- **Market impact**: Immediate price/market reaction if any
- **Scenario implication**: Which scenario does this raise or lower probability for?

## Dashboard Output

Create a React `.jsx` file in `/src/dashboards/geopolitical/` with these sections:

0. **Header with Home Button** ← REQUIRED ON EVERY DASHBOARD: A persistent header bar with a `← Home` link (using react-router-dom `Link` to `/`) so the user can return to the homepage at any time. Style it as a small button in the top-right of the header panel.
1. **Verdict Tab** (default, amber highlight): Stance · timing · immediate watchpoints · market positioning guide · AddToAnalysis
2. **Situation Tab**: Actors table · context · triggers · key metrics · commodity/market chart
3. **Political Signals Tab** ← NEW: Feed of real statements, tweets, and public communications from key actors. Each entry shows: actor avatar-initial + role badge · platform tag · date · quote block · signal-type badge (Escalatory/De-escalatory/Diplomatic/Economic/Ambiguous) · scenario implication. Sort newest first.
4. **Scenarios Tab**: Scenario cards with ProbGauge · narrative · time horizons
5. **Feasibility Tab**: Per-scenario radar (4 dimensions) · sustainability badge · dealbreaker · cost
6. **Impact Tab**: RadarChart (all 6 dims × all scenarios) · per-dimension grouped BarChart
7. **Indicators Tab**: Per-scenario signpost checklist with status dots (Observed/Emerging/Not Yet)
8. **Expert Views Tab**: Consensus · dissenting views · Western vs regional gap

## Data Structure

```javascript
const analysisData = {
  title: "Analysis Title",
  date: "YYYY-MM-DD",
  overallConfidence: "Medium-High",
  situation: {
    actors: [{ name, role, stance, power }],   // power 0-100
    context: "...",
    triggers: ["..."],
    keyMetrics: [{ label, value, color }],
  },
  scenarios: [
    {
      id: 1,
      name: "Scenario Name",
      tagline: "Short evocative label",
      probability: 35,
      color: "#hex",
      description: "...",
      narrative: "...",
      impacts: { military: 7, economic: 8, diplomatic: 5, humanitarian: 6, regional: 7, global: 6 },
      timeHorizons: { shortTerm: "...", mediumTerm: "...", longTerm: "..." },
      indicators: [{ signal: "...", status: "not_observed" | "emerging" | "observed" }],
      feasibility: [
        {
          action: "Description of the action",
          actor: "Country/entity",
          militaryFeasibility: { score: 3, detail: "..." },
          economicCapacity: { score: 4, detail: "..." },
          politicalWill: { score: 2, detail: "..." },
          allianceSupport: { score: 5, detail: "..." },
          overallSustainability: "fully_sustainable" | "sustainable_short_term" | "barely_feasible" | "not_feasible",
          dealbreaker: "The single biggest reason this could fail",
          estimatedCost: "$X billion/trillion over Y years"
        }
      ]
    }
  ],
  decisionPoints: [{ actor: "...", decision: "...", leadsTo: [scenarioIds], consequence: "..." }],
  expertOpinions: {
    consensus: { summary: "...", supporters: ["RAND", "Brookings"] },
    dissenting: [{ expert: "...", affiliation: "...", position: "...", reasoning: "...", credibilityNote: "..." }],
    regionalVsWestern: { westernView: "...", regionalView: "...", gapAnalysis: "..." },
    overallExpertConfidence: "High"
  },
  impactMatrix: [{ scenario, military, economic, diplomatic, humanitarian, regional, global }],
  // Optional: commodity/market time-series relevant to the conflict
  oilPriceData: [{ month, price }],

  // ─── GAME THEORY (per-scenario, for 2-3 key decisions) ──────────────────────
  gameTheory: {
    gameType: "Chicken Game",  // "Prisoner's Dilemma" | "Chicken Game" | "Assurance Game" | "Asymmetric"
    actors: ["US", "Iran"],
    actions: [["Strike", "Extend Deadline"], ["Capitulate", "Retaliate"]],
    payoffs: [[[-2, -8], [5, -5]], [[3, 3], [-5, 5]]],  // [row][col] = [actorA, actorB]
    nashEquilibrium: "One side swerves — question is which one",
    stabilityAssessment: "Unstable — both sides have incentive to defect"
  },

  // ─── BAYESIAN PROBABILITY TRACKING ──────────────────────────────────────────
  probabilityHistory: [
    { date: "YYYY-MM-DD", scenarios: { "Scenario1": 30, "Scenario2": 25 }, signal: "Description", direction: "escalatory" | "de-escalatory" | "baseline" }
  ],

  // ─── ECONOMIC IMPACT MODELING ───────────────────────────────────────────────
  economicImpact: {
    oilShock: { currentPrice: 109, baselinePrice: 75, deltaPercent: 45, inflationImpact: "+1.8pp (Eurozone)", gdpImpact: "-0.68% over 4Q" },
    tradeDisruption: { affectedVolume: "$5.5T/yr", disruptionProbability: "40%", gdpMultiplier: 0.8, estimatedImpact: "-$1.76T risk-adjusted" },
    sanctionsAnalog: { reference: "Iran 2012", gdpImpact: "-6.6%", applicability: "Directly applicable" },
    phillipsCurve: { currentInflation: 2.5, expectedInflation: 2.8, outputGap: "-0.5%", supplyShockComponent: "+1.2pp from oil" }
  },

  // ─── ESCALATION LADDER ──────────────────────────────────────────────────────
  escalationLadder: {
    currentLevel: 5,
    levels: [
      { level: 1, label: "Diplomatic Tension", status: "passed" },
      { level: 2, label: "Economic Warfare", status: "passed" },
      { level: 3, label: "Proxy Conflict", status: "active" },
      { level: 4, label: "Limited Military Strikes", status: "active" },
      { level: 5, label: "Strategic Strikes", status: "imminent" },
      { level: 6, label: "Total War / WMD Risk", status: "tail_risk" },
    ],
    movesUp: ["Infrastructure strikes proceed", "Houthi full activation"],
    movesDown: ["Mediator breakthrough", "Congressional defunding"]
  },

  // ─── POLITICAL ECONOMY ──────────────────────────────────────────────────────
  politicalEconomy: [
    {
      leader: "Trump",
      winningCoalition: "GOP base + evangelical voters + defense establishment",
      audienceCosts: "Very high — public threats cannot be walked back",
      rallyEffect: { boost: "+6pp initially", currentDecay: "Rally fully decayed at 35%", monthsElapsed: 1.5 },
      economicPressure: "Rising — inflation from oil, no Congressional funding"
    }
  ],
};

// ─── POLITICAL SIGNALS (MANDATORY — search for real quotes) ───────────────────
const politicalComments = [
  {
    actor: "Donald Trump",
    role: "US President",
    platform: "Truth Social",   // Twitter/X | Truth Social | Telegram | Press Conference | State TV | Parliament | UN Speech
    date: "2026-03-20",
    time: "14:32 ET",           // include if known — pre/post market matters
    quote: "The strikes are going very well. Iran is finished. We will wind this down soon.",
    context: "Posted 3 hours after Congressional leaders demanded a war briefing",
    signalType: "de-escalatory",  // escalatory | de-escalatory | diplomatic | economic | ambiguous
    marketImpact: "Oil dropped $4/bbl on release; reversed within 2 hours as timeline remained unclear",
    scenarioImplication: "Raises Ceasefire probability if serious (→ +5%); classified as ambiguous until follow-up",
    verified: true,   // true = confirmed real quote; false = representative paraphrase
  },
  // ... collect 6-12 statements covering ALL key actors
]

// ─── STRATEGIC VERDICT ────────────────────────────────────────────────────────
const strategicVerdict = {
  stance: "MONITOR — HOLD POSITIONS",   // e.g. ESCALATE CAUTION | REDUCE RISK | HOLD | RE-ASSESS
  stanceColor: "#f59e0b",
  primaryScenario: "Scenario Name",
  primaryProb: 35,
  timing: "Re-assess in 48–72 hours",
  timingDetail: "Explain exactly what you are waiting for and why timing matters now",
  immediateWatchpoints: [
    { signal: "...", timing: "24–48h", implication: "...", urgency: "Critical" | "High" | "Medium" }
  ],
  marketPositioning: [
    { asset: "Long Oil (futures/ETF)", stance: "HOLD" | "ADD" | "REDUCE" | "AVOID" | "CAUTIOUS", color: "#hex", rationale: "..." }
  ],
  probabilityUpdate: "No change: Scenario1 X% / Scenario2 Y% / ... Next trigger: ...",
  conviction: "High" | "Medium-High" | "Medium" | "Low",
  nextReview: "48–72 hours or on any watchpoint signal",
}

// ─── ANALYSIS GAPS ────────────────────────────────────────────────────────────
const analysisGaps = [
  { topic: "...", description: "...", issueTitle: "Extend [analysis title]: [specific request]" }
]
```

## Written Report

Also generate a Word document (.docx) report with this structure:
1. Executive Summary
2. Situation Assessment
3. Scenario Analysis
4. Feasibility & Sustainability Deep Dive
5. Key Indicators & Signposts
6. Expert & Institutional Analysis
7. Risk Matrix
8. Recommendations & Watchpoints
9. Methodology Note

## Analytical Principles

- **Epistemic humility**: Acknowledge uncertainty, be explicit about assumptions
- **Avoid single-outcome thinking**: Map the full range of possibilities
- **Second-order effects**: Think in systems — A affects B, C, D, E...
- **Historical analogies**: Draw on precedents but note differences
- **Domestic politics matters enormously**: Analyze the humans, not just the states
- **Economic interdependence is double-edged**: Can prevent or intensify conflict

## Web Search Strategy
Use the **Specific Data Sources** defined in Step 7 above. Always check Glint Trade Terminal first, then run the 3 parallel batches. The `site:` queries target authoritative sources directly — avoid generic searches that return noise.

---

# SKILL: Stock Analyzer

## When to Use
Trigger for: stock analysis, financial analysis, investment research, portfolio review, market analysis, stock comparison, equity research, ticker symbols (AAPL, TSLA, etc.), "should I invest in...", "how is X stock doing", P/E ratios, market sentiment.

## Workflow

### Step 0: Cross-Reference ALL Existing Geopolitical Analyses (MANDATORY — do this before any stock research)
List every file in `/src/dashboards/geopolitical/`. For **each one**, read its `analysisData.title`, `scenarios`, `strategicVerdict`, and — critically — its `politicalComments`. Then ask:

**Relevance checklist (run for every geo dashboard):**
- Does this conflict affect the company's sector (energy, defense, banking, shipping, tech)?
- Does it affect commodities this company depends on (oil, gas, metals, food)?
- Does it affect the country/region where this company operates, manufactures, or sells?
- Does it change the macroeconomic backdrop (oil price, inflation, ECB/Fed path, sovereign spreads)?
- Are there key political statements in `politicalComments` with a `marketImpact` that touches this stock's sector?

**If YES — this geo analysis directly impacts this stock:**
- Read the full `strategicVerdict` from that dashboard — its `immediateWatchpoints` become **entry timing gates** for the stock verdict
- Read `politicalComments` — any `escalatory` or `de-escalatory` signals from key actors must be surfaced in the stock's Verdict tab with explicit "wait for X before entering" language
- Build a `geoOverlay` object (see data structure below) incorporating scenario probabilities, price impact per scenario, and probability-weighted net impact
- In the dashboard, show a **Geo Risk tab** with the full overlay — link directly to the geo dashboard
- The stock's `verdict.timingDetail` MUST reference specific political signals: e.g. "Wait for Trump's statement on Iran (expected 24–48h) — a ceasefire signal closes the entry gap, an escalation signal drops the entry price"

**If NO — no existing geo analysis is directly relevant:**
- Run web searches: `[COMPANY] lawsuits 2025 2026`, `[COMPANY] regulatory investigation`, `[COMPANY] sanctions exposure`, `[TICKER] geopolitical risk`, `[SECTOR] geopolitical headwinds`
- If you find open lawsuits, regulatory probes, or significant unanalyzed risks, add them to `riskNotices[]` and show the **Risk Notice banner**

**Rule: NEVER write a stock verdict that ignores an active geo dashboard.** If a geo analysis exists and is relevant, its scenario probabilities directly gate the timing, position size, and stop-loss in the stock verdict. A stock verdict that says "buy now" while a geo dashboard shows 15% catastrophic escalation probability must reduce position size and widen the stop accordingly.

### Step 1: Gather Stock Information
**Check Glint Trade Terminal first (MANDATORY)** for live global news, breaking signals, and market-moving headlines relevant to this ticker or sector before running the searches below.

Run searches in 3 parallel batches using specific sources:

**Batch 1 — Price, Technicals, Fundamentals (run in parallel):**
- `site:finance.yahoo.com [TICKER] quote` → current price, P/E, EPS, market cap, 52w range, dividend yield, beta
- `site:finance.yahoo.com [TICKER] financials` → income statement, balance sheet, cash flow statement
- `site:tradingview.com [TICKER] technical analysis` → oscillators consensus, moving averages consensus, overall signal
- `site:macrotrends.net [TICKER] financial-ratios` → historical P/E, P/B, ROE, margins over 5-10 years

**Batch 2 — Analyst Consensus, News (run in parallel):**
- `site:marketbeat.com [TICKER] analyst-ratings` → analyst consensus, price targets, recent upgrades/downgrades
- `[TICKER] OR [COMPANY] news [MONTH YEAR] site:reuters.com OR site:bloomberg.com OR site:cnbc.com` → news with real URLs
- `site:tipranks.com [TICKER]` → analyst consensus, smart score, insider trading

**Batch 3 — Macro, Sector, Risk (run in parallel):**
- `site:ecb.europa.eu monetary policy decisions` → ECB rate decisions (for EU stocks)
- `site:federalreserve.gov federal funds rate` → Fed rate decisions (for US stocks)
- `site:fred.stlouisfed.org [INDICATOR]` → specific economic data (yield curves, CPI, unemployment)
- `[COMPANY] lawsuit OR investigation OR fine 2025 2026` → legal/regulatory risks
- `[TICKER] geopolitical risk OR sanctions OR tariffs` → geopolitical exposure
- **Comparison** (if multiple tickers): Each ticker individually, then `[TICKER1] vs [TICKER2]`

**Fallback rule:** If a primary source returns no results, fall back: Yahoo Finance → MarketWatch → Investing.com → Google Finance.

**Data freshness rule (reanalysis only):** If the existing dashboard was updated < 24 hours ago, skip Batch 1 (fundamentals) and only update Batch 2 (news) and Batch 3 (macro). Always update price.

### Step 2: Build the Dashboard
Create a React `.jsx` file in `/src/dashboards/stocks/` with these sections:

0. **Header with Home Button** ← REQUIRED: Persistent header with stock name, ticker, a `← Home` link (react-router-dom `Link` to `/`), and a help/glossary link to `/help`. Style consistently with geopolitical dashboards.

1. **Header / Overview**: Stock name, ticker, current price, daily change %, key stats strip (Market Cap, P/E, EPS, Dividend Yield, 52-week range, Beta)

2. **⚠️ Risk Notice Panel** (conditional — show if risks found in Step 0):
   - Amber/red banner listing unanalyzed geopolitical events, open lawsuits, or regulatory risks
   - Each entry: icon + type tag + brief description + suggested analysis action
   - Only omit this panel if zero material risks were found

3. **Geo Risk Tab** (show if any existing geo analysis is relevant — link to it):
   - Which existing analysis applies and why (relevance summary)
   - **Political Signals Feed**: pull the most market-relevant `politicalComments` from the geo dashboard — show actor, platform, quote, signal type, and what it means for THIS stock right now
   - Scenario probability table: scenario name, probability, price impact direction, magnitude, rationale for this specific stock
   - Key transmission channels (e.g. oil → ECB rate path → NII compression)
   - Overall probability-weighted net impact on price
   - Direct link to the full geo dashboard (`Link to={analysisPath}`)

4. **Technical Analysis Panel**: Price chart (Recharts LineChart), support/resistance levels, trend direction, 50/200-day MA, RSI gauge, buy/sell/hold signal with rationale

5. **Fundamental Analysis Panel**: Financial metrics grid, revenue/earnings trend (BarChart), valuation vs sector peers, competitive positioning, growth catalysts

6. **News & Sentiment Panel**:
   - 5-8 news items with: headline, source name, date, sentiment tag (Bullish/Bearish/Neutral), and a **clickable `<a href="..." target="_blank">` link** to the actual article
   - Sources must be real URLs found during web search — do NOT fabricate URLs
   - If you cannot find a real URL, show the headline with source + date but no link, and note "(link unavailable)"
   - Analyst consensus bar (Buy/Hold/Sell distribution), average price target
   - Overall sentiment gauge

7. **Event Impact Analysis Panel**: Impact matrix table (event → severity → direction → rationale), historical parallels, key risk/opportunity factors

8. **Comparison Panel** (multi-stock only): Side-by-side metrics table, radar chart comparison, relative YTD performance

9. **Valuation Models Tab**: DCF fair value, DDM value (if dividend-paying), relative valuation vs sector, valuation summary table with bull/base/bear fair values

10. **Sensitivity Analysis Tab**: Earnings sensitivity tornado chart (top 5 variables), rate sensitivity (for banks), oil/FX sensitivity chains, scenario-based EPS table

11. **Risk Quantification Tab**: Probability-weighted expected return table, maximum drawdown, Sharpe ratio vs sector, Kelly Criterion position sizing hint

### Technical Requirements
- Single `.jsx` file, default export
- Tailwind core utilities only
- Recharts for charts
- lucide-react for icons
- All data in component state — no localStorage
- News links must use real URLs (`<a href={url} target="_blank" rel="noreferrer">`)
- **Always include disclaimer**: "This analysis is for informational purposes only and does not constitute financial advice. Always consult a qualified financial advisor before making investment decisions."

### Step 3: Valuation Models (MANDATORY for all stock analyses)

Calculate and present these valuations. Use numbers from Yahoo Finance/MacroTrends. Show your work — display the formula with actual numbers filled in.

**A. Simplified DCF (Discounted Cash Flow)**
```
FCF (last reported) = Operating Cash Flow − CapEx
Growth rate (g) = average of analyst consensus growth rate and 5-year historical revenue CAGR
WACC estimate:
  - Risk-free rate = current 10Y government bond yield (US Treasury or German Bund)
  - Equity risk premium = 5.5% (standard)
  - Beta = from Yahoo Finance
  - WACC ≈ Risk-free + Beta × ERP (simplified, assumes ~100% equity; if debt is material, note this)
Terminal value = FCF₅ × (1 + g_terminal) / (WACC − g_terminal), where g_terminal = 2.5%
Fair value per share = (Sum of discounted FCFs over 5 years + discounted terminal value) / shares outstanding
```
Display as: "DCF Fair Value: €X.XX (vs current price €Y.YY → Z% upside/downside)"

**B. Dividend Discount Model (for dividend-paying stocks)**
```
DDM Fair Value = DPS × (1 + g) / (r − g)
  where DPS = current annual dividend per share
        g = sustainable dividend growth rate = ROE × (1 − payout ratio)
        r = required return = Risk-free + Beta × ERP
```
Display as: "DDM Fair Value: €X.XX (yield-based valuation)"

**C. Relative Valuation**
```
Relative P/E Value = Sector median P/E × Company EPS = implied price
Relative P/B Value = Company historical avg P/B × current book value per share = implied price
Relative EV/EBITDA = Sector median EV/EBITDA × Company EBITDA − Net Debt = implied equity value / shares
```
Display as table: Model | Fair Value | vs Current | Verdict (Undervalued/Fair/Overvalued)

**D. Valuation Summary**
Aggregate: Bull case (highest model) / Base case (average of models) / Bear case (lowest model or DCF with conservative assumptions)

### Step 4: Sensitivity Analysis

**A. NII Sensitivity (for banks only)**
```
NII impact per 25bps rate change ≈ (Loan Book Size × Repricing Gap %) × 0.0025
  Repricing Gap = assets repricing within 1 year − liabilities repricing within 1 year
  If exact gap not available, estimate: repricing gap ≈ 15-25% of total loan book (typical for EU banks)
Example: Loan book €60B × 20% repricing gap × 0.0025 = €30M NII impact per 25bps
```

**B. Oil Price Sensitivity Chain**
```
ΔOil +10% → ΔInflation ≈ +0.3-0.5pp (passthrough coefficient 0.03-0.05)
ΔInflation +0.5pp → Central bank response: +25bps rate hike probability increases by ~30%
Rate hike +25bps → Bank NII: use formula from (A)
Rate hike +25bps → Equity market: S&P/EuroStoxx typically -1.5% to -2.5% per unexpected 25bps
Net: ΔOil +10% → Equity impact = NII benefit − valuation multiple compression
```

**C. FX Sensitivity (if company has multi-currency exposure)**
```
Revenue by currency: X% EUR, Y% USD, Z% other
FX impact per 1% move = Revenue in foreign currency × 1% × operating margin
```

**D. Earnings Sensitivity Tornado**
Identify the top 5 variables that move EPS the most. For each, show:
```
Variable | Base Case | Bear (−1σ) | Bull (+1σ) | EPS Impact (bear) | EPS Impact (bull)
```
Display as horizontal tornado/butterfly chart in Recharts.

### Step 5: Risk Quantification

**A. Probability-Weighted Expected Return**
Using the geo overlay scenarios (if applicable) or 3 custom scenarios (bull/base/bear):
```
E[Return] = Σ(scenario_probability × scenario_return)
Example: 0.25 × (+20%) + 0.50 × (+8%) + 0.25 × (−15%) = +5.25%
```

**B. Maximum Drawdown**
From price history: max peak-to-trough decline over 52 weeks.
```
Max Drawdown = (Trough − Peak) / Peak × 100
Example: Peak €4.12, Trough €3.20 → Max Drawdown = −22.3%
```

**C. Sharpe Ratio (simplified)**
```
Sharpe = (Expected Return − Risk-Free Rate) / Standard Deviation of Returns
Use: annualized return from analyst consensus target / 12-month horizon
Use: estimated volatility = Beta × market volatility (~15-18% for developed markets)
```
Compare vs sector benchmark.

**D. Kelly Criterion Position Sizing (informational only)**
```
Kelly % = (Win Probability × Avg Win / Avg Loss − Loss Probability) / (Avg Win / Avg Loss)
Where:
  Win Probability = probability of scenarios with positive return
  Avg Win = probability-weighted average positive return
  Avg Loss = probability-weighted average negative return
Note: "Full Kelly is aggressive — most practitioners use half-Kelly or quarter-Kelly"
```
Display as: "Kelly suggests X% allocation; half-Kelly = Y%; quarter-Kelly = Z%"

### Stock Data Structures

```javascript
// ─── GEO OVERLAY (one per relevant geo dashboard) ────────────────────────────
const geoOverlay = {
  analysis: "Analysis Title",
  analysisPath: "/geo/slug",
  date: "YYYY-MM-DD",
  relevance: "One sentence: why this geo situation directly affects this stock",
  keyChannels: [
    { channel: "Oil → ECB Rate Path → NII", detail: "...", severity: "Critical" | "High" | "Medium" | "Low" }
  ],
  // Pull the most market-relevant political comments from the geo dashboard:
  keyPoliticalSignals: [
    {
      actor: "Donald Trump",
      role: "US President",
      platform: "Truth Social",
      date: "2026-03-20",
      quote: "We will wind this down soon.",
      signalType: "de-escalatory",
      stockImpact: "If genuine: oil -$15, ECB cuts resume, ALPHA +10–15%. If posturing: no change.",
    }
  ],
  scenarios: [
    { name, probability, color, priceImpact, direction, rationale }
  ],
  probabilityWeightedImpact: "Net impact summary string",
}

// ─── RISK NOTICES ─────────────────────────────────────────────────────────────
const riskNotices = [
  { type, icon, event, description, impact: "Critical"|"High"|"Medium"|"Low", impactColor, suggestion }
]

// ─── VERDICT ──────────────────────────────────────────────────────────────────
const verdict = {
  stance: "CAUTIOUS BUY",
  stanceColor: "#f59e0b",
  stanceBg: "rgba(245,158,11,0.1)",
  timing: "Short timing label",
  // timingDetail MUST reference specific geo political signals if a geo overlay exists:
  timingDetail: "Wait for [specific political event from geo dashboard] before entering. If [signal] → [action]. If [opposite signal] → [alternative action].",
  entryZone: { low, high, ideal },
  stopLoss: { price, pct, rationale },
  // stopLoss should be widened if geo tail scenarios (≥10%) are active
  targets: [
    { price, label, horizon, upside, trigger }
  ],
  riskReward: "X:1",
  conviction: "High" | "Medium-High" | "Medium" | "Low",
  keyConditions: [
    { label, status: "met" | "pending" | "failed", impact }
  ],
  bearCase: "Reference the worst geo scenario probability explicitly",
  disclaimer: "Analytical data only. Not financial advice. Consult a qualified advisor.",
}

// ─── VALUATION MODELS (MANDATORY — show your work) ───────────────────────────
const valuationModels = {
  dcf: {
    fcf: 1200,                    // last reported FCF in millions
    growthRate: 0.089,            // analyst consensus or historical CAGR
    wacc: 0.098,                  // risk-free + beta × ERP
    terminalGrowthRate: 0.025,
    projectedFCFs: [1306, 1357, 1411, 1468, 1527],  // 5-year nominal
    terminalValue: 21456,
    fairValuePerShare: 4.12,
    currentPrice: 3.20,
    upside: 28.8,                 // percentage
    assumptions: "FCF from FY2025; growth = 8.9%; WACC = 9.8% (Rf 3.0% + 1.18 × 5.5%); terminal g = 2.5%"
  },
  ddm: {                          // null if no dividend
    dps: 0.109,
    growthRate: 0.072,            // ROE × (1 − payout)
    requiredReturn: 0.095,
    fairValuePerShare: 5.10,
    assumptions: "DPS €0.109; g = 16% ROE × (1−55%) = 7.2%; r = 9.5%"
  },
  relativeValuation: [
    { model: "P/E vs Sector", sectorMedian: 8.5, companyMetric: 0.37, impliedPrice: 3.15, verdict: "Fair" },
    { model: "P/B vs Historical", historicalAvg: 1.1, currentBookValue: 2.45, impliedPrice: 2.70, verdict: "Overvalued" },
    { model: "EV/EBITDA vs Sector", sectorMedian: 6.5, companyEBITDA: 2800, netDebt: 5000, impliedPrice: 3.85, verdict: "Undervalued" },
  ],
  summary: {
    bullCase: 5.10,    // highest model
    baseCase: 3.84,    // average of models
    bearCase: 2.70,    // lowest model
    currentPrice: 3.20,
    verdict: "Moderately Undervalued — base case implies 20% upside"
  }
}

// ─── SENSITIVITY ANALYSIS ────────────────────────────────────────────────────
const sensitivityAnalysis = {
  niiSensitivity: {               // null for non-banks
    loanBookSize: 60000,          // millions
    repricingGapPct: 0.20,
    impactPer25bps: 30,           // millions
    note: "€60B × 20% gap × 0.0025 = €30M per 25bps"
  },
  oilSensitivity: {
    chain: [
      { variable: "Oil +10%", impact: "Inflation +0.4pp", mechanism: "Passthrough 0.04 (Eurozone)" },
      { variable: "Inflation +0.4pp", impact: "ECB +25bps probability +30%", mechanism: "Taylor rule response" },
      { variable: "ECB +25bps", impact: "NII +€30M, multiple compression −5%", mechanism: "NII uplift vs valuation drag" },
    ],
    netImpact: "Oil +10% → net neutral for bank earnings; negative for equity valuation (−2-3%)"
  },
  fxSensitivity: null,            // or { exposures: [...], impactPer1Pct: ... }
  earningsTornado: [
    { variable: "ECB rate +25bps", epsImpactBear: -0.01, epsImpactBull: +0.03, baseEps: 0.37 },
    { variable: "NPE ratio +1pp", epsImpactBear: -0.05, epsImpactBull: +0.02, baseEps: 0.37 },
    { variable: "Loan growth ±2pp", epsImpactBear: -0.02, epsImpactBull: +0.02, baseEps: 0.37 },
    { variable: "Fee income ±10%", epsImpactBear: -0.02, epsImpactBull: +0.02, baseEps: 0.37 },
    { variable: "Cost-income ratio ±2pp", epsImpactBear: -0.03, epsImpactBull: +0.03, baseEps: 0.37 },
  ]
}

// ─── RISK QUANTIFICATION ─────────────────────────────────────────────────────
const riskQuantification = {
  expectedReturn: {
    scenarios: [
      { name: "Bull", probability: 0.25, return: 0.20 },
      { name: "Base", probability: 0.50, return: 0.08 },
      { name: "Bear", probability: 0.25, return: -0.15 },
    ],
    weightedReturn: 0.0525,       // Σ(prob × return)
    calculation: "0.25×20% + 0.50×8% + 0.25×(−15%) = 5.25%"
  },
  maxDrawdown: {
    peak: 4.12,
    trough: 3.20,
    drawdownPct: -22.3,
    period: "Jan 2026 — Mar 2026"
  },
  sharpeRatio: {
    expectedReturn: 0.387,        // annualized from consensus target
    riskFreeRate: 0.030,
    volatility: 0.212,            // beta × market vol
    sharpe: 1.68,
    sectorBenchmark: 1.20,
    verdict: "Above sector average — attractive risk-adjusted return"
  },
  kellyCriterion: {
    winProbability: 0.70,
    avgWin: 0.127,
    avgLoss: 0.16,
    kellyPct: 0.306,
    halfKelly: 0.153,
    quarterKelly: 0.077,
    note: "Full Kelly = 30.6%; half = 15.3%; quarter = 7.7%. Use quarter-Kelly given uncertainty."
  }
}

// ─── ANALYSIS GAPS ────────────────────────────────────────────────────────────
const analysisGaps = [
  { topic, description, issueTitle }
]
```

### Important Rules
- **Never give direct buy/sell recommendations** — present data objectively
- **Be honest about data limitations** — note when figures are approximate or estimated
- **Real news links only** — never fabricate article URLs; omit the link if you can't verify it
- Frame as "the data suggests..." not "you should buy/sell..."
- The geopolitical cross-reference (Step 0) is not optional — always do it, even if the result is "no existing analysis is relevant"
- **Political signals gate the verdict** — if a geo dashboard has active `politicalComments` with pending signals, the stock verdict MUST reference them in `timingDetail` and `keyConditions`

---

# General Dashboard Guidelines

## Universal Header Rule (ALL dashboards — no exceptions)

Every dashboard `.jsx` file — geopolitical or stock — MUST include a persistent header containing:
- A `← Home` button using react-router-dom `Link to="/"` that is always visible
- A `Glossary` link using `Link to="/help"`
- Import `{ Link }` from `'react-router-dom'` and `{ Home, BookOpen }` from `'lucide-react'`

Style the home button consistently:
```jsx
import { Link } from 'react-router-dom'
import { Home, BookOpen } from 'lucide-react'

// In header JSX:
<div style={{ display: 'flex', gap: '0.5rem' }}>
  <Link to="/" style={{
    display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
    color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600,
    textDecoration: 'none', padding: '0.3rem 0.7rem',
    border: '1px solid #1e293b', borderRadius: '6px',
    backgroundColor: '#0a0f1e',
  }}>
    <Home size={12} /> Home
  </Link>
  <Link to="/help" style={{
    display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
    color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600,
    textDecoration: 'none', padding: '0.3rem 0.7rem',
    border: '1px solid #1e293b', borderRadius: '6px',
    backgroundColor: '#0a0f1e',
  }}>
    <BookOpen size={12} /> Glossary
  </Link>
</div>
```

## After Every Analysis

1. Save the `.jsx` file to the appropriate `/src/dashboards/` subdirectory
2. Update `App.jsx` to include routing to the new dashboard
3. Commit with descriptive message
4. Push to GitHub (triggers Vercel auto-deploy)
5. Confirm the deployment URL to the user

## File Naming Convention
- Geopolitical: `[country1]-[country2]-[topic]-[YYYY-MM-DD].jsx` (e.g., `us-china-trade-war-2026-03-22.jsx`)
- Stocks: `[ticker]-analysis-[YYYY-MM-DD].jsx` (e.g., `tsla-analysis-2026-03-22.jsx`)
- Sectors: `[industry]-[topic]-[YYYY-MM-DD].jsx` (e.g., `casino-market-analysis-2026-04-02.jsx`)

## Dashboard Type Classification
- **geopolitical** — Wars, diplomacy, sanctions, international relations between countries
- **stocks** — Individual ticker / equity analysis
- **sectors** — Industry or market-wide analysis (casino market, EV industry, semiconductor supply chain, etc.). These are NOT geopolitical — they focus on market dynamics, regulation, competitive landscape, and sector economics rather than inter-state conflict
