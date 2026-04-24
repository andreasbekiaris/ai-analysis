# dashboard-skills

Project-local Claude Code plugin that bundles the analysis-dashboard skills for this React app. Skills lazy-load when triggered so `CLAUDE.md` no longer has to carry ~600 lines on every session.

## Skills

- **geopolitical-analyzer** — wars, diplomacy, sanctions, trade-war, alliance dynamics. Produces a dashboard in `src/dashboards/geopolitical/`.
- **stock-analyzer** — single-ticker equity research with mandatory geopolitical cross-reference. Produces a dashboard in `src/dashboards/stocks/`.
- **sector-analyzer** — industry / market-wide analysis (casino market, EV industry, semiconductor supply chain, etc.). Produces a dashboard in `src/dashboards/sectors/`.

## Layout

```
.claude/plugins/dashboard-skills/
├── .claude-plugin/plugin.json
├── README.md
└── skills/
    ├── geopolitical-analyzer/
    │   ├── SKILL.md                  ← lean workflow + triggers
    │   └── references/               ← loaded only when consulted
    │       ├── data-structure.md
    │       ├── formulas.md
    │       └── sources.md
    ├── stock-analyzer/
    │   ├── SKILL.md
    │   └── references/
    │       ├── data-structure.md
    │       ├── valuation-formulas.md
    │       └── sources.md
    └── sector-analyzer/
        ├── SKILL.md
        └── references/
            ├── data-structure.md
            └── sources.md
```

Project-wide rules (tech stack, design system, git workflow, universal header) stay in the root `CLAUDE.md`.
