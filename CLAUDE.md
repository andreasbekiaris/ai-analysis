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

## Dashboard Output

Create a React `.jsx` file in `/src/dashboards/geopolitical/` with these sections:

0. **Header with Home Button** ← REQUIRED ON EVERY DASHBOARD: A persistent header bar with a `← Home` link (using react-router-dom `Link` to `/`) so the user can return to the homepage at any time. Style it as a small button in the top-right of the header panel.
1. **Situation Overview Panel**: Actors, context, timeline
2. **Scenario Cards**: Name, probability gauge, description
3. **Feasibility Reality Check Panel**: Radar charts of 4 feasibility dimensions, sustainability badges, dealbreaker callouts, estimated costs
4. **Impact Heatmap**: Matrix of impact scores, color-coded green→red
5. **Decision Tree Visualization**: Flowchart of decisions leading to scenarios
6. **Key Indicators Tracker**: Checklist of signposts per scenario
7. **Expert Opinion Panel**: Consensus, dissenting views, regional vs Western gap
8. **Timeline View**: Projected events per scenario across time horizons

## Data Structure

```javascript
const analysisData = {
  title: "Analysis Title",
  date: "YYYY-MM-DD",
  overallConfidence: "Medium-High",
  situation: {
    actors: [...],
    context: "...",
    triggers: ["..."],
    powerDynamics: {...}
  },
  scenarios: [
    {
      id: 1,
      name: "Scenario Name",
      probability: 35,
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
          overallSustainability: "not_feasible",
          dealbreaker: "The single biggest reason this could fail",
          estimatedCost: "$X billion/trillion over Y years"
        }
      ]
    }
  ],
  decisionPoints: [{ actor: "...", decision: "...", leadsTo: [scenarioIds] }],
  expertOpinions: {
    consensus: { summary: "...", supporters: ["RAND", "Brookings"] },
    dissenting: [{ expert: "...", affiliation: "...", position: "...", reasoning: "...", credibilityNote: "..." }],
    regionalVsWestern: { westernView: "...", regionalView: "...", gapAnalysis: "..." },
    overallExpertConfidence: "High"
  }
};
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

### Step 0: Cross-Reference Existing Geopolitical Analyses (MANDATORY)
Before gathering any stock data, scan `/src/dashboards/geopolitical/` to see what geopolitical analyses already exist in this project.

**For each existing geopolitical dashboard, ask:**
- Does this conflict/event affect the company's sector (energy, defense, tech, shipping, finance)?
- Does it affect supply chains, commodities, or markets this company is exposed to?
- Does it affect the country/region where this company operates, manufactures, or sells?
- Does it change the macroeconomic backdrop (oil price, sanctions, tariffs, inflation)?

**If YES — a geopolitical analysis directly impacts this stock:**
- Incorporate its scenario probabilities and impact scores into the stock analysis
- In the dashboard, add a **Geopolitical Risk Overlay Panel** showing which scenario is most relevant, what the probability-weighted price impact is, and what position the data suggests under each scenario
- Clearly state: "This analysis is cross-referenced with the [Title] geopolitical analysis (YYYY-MM-DD)"

**If NO — no existing analysis is directly relevant:**
- Run web searches for: `[COMPANY] lawsuits 2025 2026`, `[COMPANY] regulatory investigation`, `[COMPANY] sanctions exposure`, `[TICKER] geopolitical risk`, `[SECTOR] geopolitical headwinds`
- If you find open lawsuits, regulatory probes, or significant geopolitical risks not yet analyzed:
  - Add a **Risk Notice Panel** at the top of the dashboard (amber/red banner) with this structure:
    - "⚠️ For a more complete analysis, consider running a full analysis on the following events which may materially affect this stock:"
    - List each event: type (Legal/Geopolitical/Regulatory), brief description, estimated impact level (Low/Medium/High/Critical)
    - Example: "⚠️ Geopolitical: US-China semiconductor export controls — run 'US-China Tech War' analysis for full scenario modeling"
    - Example: "⚠️ Legal: [Company] antitrust lawsuit (DOJ, filed Jan 2026) — unresolved, $X billion exposure"

### Step 1: Gather Stock Information
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

3. **Geopolitical Risk Overlay Panel** (conditional — show if existing geo analysis is relevant):
   - Which existing analysis applies and why
   - Scenario probability table: scenario name, probability, price impact direction, magnitude
   - Recommended position per scenario (data-driven, not a personal recommendation)
   - Overall probability-weighted impact on price

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

### Important Rules
- **Never give direct buy/sell recommendations** — present data objectively
- **Be honest about data limitations** — note when figures are approximate or estimated
- **Real news links only** — never fabricate article URLs; omit the link if you can't verify it
- Frame as "the data suggests..." not "you should buy/sell..."
- The geopolitical cross-reference (Step 0) is not optional — always do it, even if the result is "no existing analysis is relevant"

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
