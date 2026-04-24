---
name: geopolitical-analyzer
description: Use when the user asks for geopolitical analysis, foreign policy predictions, war or diplomatic scenario modeling, sanctions impact, alliance dynamics, trade-war outcomes, regional conflict assessment, or anything about how countries might act and what consequences could follow. Produces a multi-tab React dashboard at src/dashboards/geopolitical/ with scenarios, feasibility, game theory, Bayesian probability tracking, escalation ladder, political economy, expert opinions, and political signals feed.
---

# Geopolitical Decision Analyzer & Predictor

Build a multi-scenario geopolitical analysis dashboard. Output is a single `.jsx` file in `src/dashboards/geopolitical/` plus updated routing in `App.jsx`.

## Workflow — execute in order

### 1. Situation Assessment
Identify: actors (state and non-state, stated/unstated interests), context (history, treaties, alliances, economic ties), triggers (recent events), power dynamics (military/economic/tech/soft), domestic politics (elections, opinion, factions, leadership stability).

### 2. Decision Tree Mapping
For each major actor: realistic options, constraints (legal/economic/military/political), and sequence dependencies (if A does X, what opens/closes for B).

### 3. Multi-Scenario Construction (3–5 scenarios)
Each scenario needs: evocative name, narrative paragraph, probability (all sum to ~100%), short/medium/long-term horizons, impact ratings 1–10 across six dimensions.

### 4. Feasibility & Sustainability
For every major action in every scenario rate four dimensions (1–10): military feasibility, economic capacity, political will, alliance viability. Assign overall sustainability: `fully_sustainable` | `sustainable_short_term` | `barely_feasible` | `not_feasible`. Name the single biggest dealbreaker. Estimate cost.

### 5. Impact Assessment (1–10 per dimension)
Military/Security · Economic/Trade · Diplomatic · Humanitarian · Regional Stability · Global Systemic.

### 5b–5f. Quantitative & Strategic Models
Apply game theory, Bayesian probability updates, economic transmission, escalation ladder, and political economy. **See `references/formulas.md` for all formulas, payoff matrix construction, escalation levels, selectorate theory, audience costs, rally-around-the-flag empirics.**

### 6. Key Indicators & Signposts
Per scenario: 3–5 observable, monitorable indicators (diplomatic appointments/recalls, military deployments, trade-data shifts, specific public statements, votes at international bodies, economic thresholds). Each gets status `not_observed` | `emerging` | `observed`.

### 7. Expert & Institutional Opinion
Synthesize: consensus view · dissenting views · regional vs. Western gap · expert confidence level · track record. **See `references/sources.md` for the full source list and three-batch search strategy** (Glint Trade Terminal first, then Reuters/Al Jazeera/BBC, then RAND/Brookings/CFR/SIPRI/ACLED, then IMF/FRED/ECB/ReliefWeb/EIA).

### 8. Political Signals Collection (MANDATORY)
Real statements/posts from key actors that signal intent or shift probabilities. Check Glint Trade Terminal first. Collect 6–12 statements covering all key actors. Each entry: who, role, platform (Twitter/X, Truth Social, Telegram, Press Conference, State TV, Parliament, UN), date+time, exact quote, context, signal type (`escalatory` | `de-escalatory` | `diplomatic` | `economic` | `ambiguous`), market impact, scenario implication. Mark unverified paraphrases with `verified: false`.

## Dashboard tabs (REQUIRED order)

0. Persistent header with `← Home` and `Glossary` buttons (see root CLAUDE.md "Universal Header Rule")
1. **Verdict** (default, amber highlight) — stance · timing · immediate watchpoints · market positioning · AddToAnalysis
2. **Situation** — actors table · context · triggers · key metrics · commodity/market chart
3. **Political Signals** — feed of real statements/posts; sort newest first
4. **Scenarios** — cards with ProbGauge · narrative · time horizons
5. **Feasibility** — per-scenario radar (4 dims) · sustainability badge · dealbreaker · cost
6. **Impact** — RadarChart (6 dims × all scenarios) · per-dimension grouped BarChart
7. **Indicators** — per-scenario signpost checklist with status dots
8. **Expert Views** — consensus · dissenting · Western vs regional gap

## Data shape

The `analysisData` object plus `politicalComments`, `strategicVerdict`, and `analysisGaps` are documented exactly in **`references/data-structure.md`**. Copy the shape verbatim — other skills (`stock-analyzer`) read these fields by name.

## Analytical principles

- Epistemic humility: acknowledge uncertainty, surface assumptions
- Avoid single-outcome thinking — map the full range
- Second-order effects: A → B, C, D, E
- Historical analogies with explicit differences
- Domestic politics matters as much as state behaviour
- Economic interdependence cuts both ways

## After implementing

1. Save `.jsx` in `src/dashboards/geopolitical/` using filename `[country1]-[country2]-[topic]-[YYYY-MM-DD].jsx`
2. Add the route in `App.jsx`
3. Commit: `feat: geopolitical analysis - [subject] - [date]`
4. Push (triggers Vercel auto-deploy)
5. Confirm deployment URL to the user

## Tech constraints (from root CLAUDE.md)

React 18 functional components, Tailwind core utilities only, Recharts for all charts, lucide-react for icons, React state only (no localStorage), dark financial-terminal theme.
