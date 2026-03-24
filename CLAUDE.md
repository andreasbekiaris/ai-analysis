# Project: Analysis Dashboard Hub

This is an auto-deploying React analysis dashboard site. Every analysis (geopolitical, stock, or other) is created as a `.jsx` component, committed, and pushed to GitHub — which triggers an automatic Vercel deployment.

## Project Structure

```
/src
  /dashboards          ← All analysis dashboards go here
    /geopolitical       ← Geopolitical analysis dashboards
    /stocks             ← Stock analysis dashboards
  /components           ← Shared UI components (charts, cards, etc.)
  App.jsx               ← Main app with routing to all dashboards
  index.jsx             ← Entry point
/public
/CLAUDE.md              ← This file
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
  oilPriceData: [{ month, price }],  // or whatever market data is relevant
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
0. **Glint Trade Terminal (MANDATORY — check first)**: Search Glint Trade Terminal for the latest global news, live market signals, and breaking developments relevant to this situation before running any other searches. Use it to anchor the analysis in the most current real-world state.
1. Latest developments on the specific situation
2. Recent policy statements from key actors
3. Expert/think tank analysis (RAND, Brookings, CFR, IISS, etc.)
4. Dissenting/contrarian expert views
5. Analysts from the affected region
6. Relevant economic/military data
7. Historical precedents

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

Run multiple web searches in parallel:
- **Price & Technical**: `[TICKER] stock price today`, `[TICKER] technical analysis [YEAR]`
- **Fundamentals**: `[TICKER] financials earnings revenue P/E ratio`, `[TICKER] balance sheet market cap`
- **News**: `[TICKER] stock news latest`, `[COMPANY NAME] news [MONTH YEAR]` — collect actual article titles, sources, dates, and URLs
- **Analyst Sentiment**: `[TICKER] analyst rating price target [YEAR]`, `[TICKER] analyst consensus`
- **Legal & Regulatory**: `[COMPANY] lawsuit 2025 2026`, `[COMPANY] SEC investigation`, `[COMPANY] regulatory fine`
- **Geopolitical Exposure**: `[TICKER] geopolitical risk`, `[COMPANY] supply chain [country]`, `[TICKER] sanctions tariffs exposure`
- **Comparison** (if multiple tickers): Each ticker individually, then `[TICKER1] vs [TICKER2]`

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

### Technical Requirements
- Single `.jsx` file, default export
- Tailwind core utilities only
- Recharts for charts
- lucide-react for icons
- All data in component state — no localStorage
- News links must use real URLs (`<a href={url} target="_blank" rel="noreferrer">`)
- **Always include disclaimer**: "This analysis is for informational purposes only and does not constitute financial advice. Always consult a qualified financial advisor before making investment decisions."

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
