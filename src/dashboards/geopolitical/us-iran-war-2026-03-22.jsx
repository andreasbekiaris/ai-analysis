import GeoDashboard from '../../components/GeoDashboard'

// ─── ANALYSIS DATA ────────────────────────────────────────────────────────────
const analysisData = {
  title: "US–Iran War: Operation Epic Fury",
  subtitle: "Trajectory & Outcome Analysis",
  date: "2026-03-25",
  warStartDate: "2026-02-28",
  daysElapsed: 22,
  overallConfidence: "Medium",
  classification: "OPEN SOURCE ANALYSIS",

  situation: {
    actors: [
      { name: "United States",        role: "Primary belligerent",       stance: "Offensive — seeking nuclear elimination & regime change",             power: 95 },
      { name: "Israel",               role: "Co-belligerent",            stance: "Coordinated strikes; regime change goal",                             power: 72 },
      { name: "Iran (IRGC)",          role: "Defender / retaliator",     stance: "Asymmetric retaliation; no ceasefire sought",                        power: 55 },
      { name: "Hezbollah",            role: "Iran proxy",                stance: "Re-engaged March 2; rockets/drones vs. Israel",                      power: 38 },
      { name: "Houthis (Yemen)",      role: "Iran proxy",                stance: "Holding back; upgraded manufacturing independent of Iran",            power: 30 },
      { name: "Iraqi Militias",       role: "Iran proxy",                stance: "Active — striking US bases in Iraq",                                  power: 25 },
      { name: "Gulf States",          role: "Under attack / US-aligned", stance: "Absorbing Iranian missile salvos; hosting US assets",                 power: 40 },
    ],
    context: "On February 28, 2026, the US and Israel launched Operation Epic Fury — ~900 strikes in 12 hours targeting Iran's nuclear infrastructure, military leadership, and command nodes. Supreme Leader Khamenei was killed in the opening strikes along with dozens of senior officials. The war entered its 22nd day as of March 22, 2026, with Iran retaliating across 9 countries, the Strait of Hormuz partially restricted, and Brent crude peaking at $126/barrel. No ceasefire has been proposed by Tehran. The US Congress has not authorized the war; a $200B funding request faces bipartisan opposition.",
    triggers: [
      "Iran declared JCPOA 'terminated' (Oct 18, 2025); 400+ kg HEU at 60% enrichment",
      "Mass protests — largest since 1979 — killed 7,000–36,500 by Iranian security forces (Dec 25–Jan 26)",
      "US/Israel: largest Middle East military buildup since 2003 (40,000–50,000 US troops, 2 carrier strike groups)",
      "Oman brokered breakthrough on Feb 27 — hours before strikes began — raising 'avoidable war' questions",
      "Israel's June 2025 Twelve-Day War had already struck Iran's nuclear scientists and facilities",
    ],
    keyMetrics: [
      { label: "US Troops in Region",  value: "~45,000",        color: "#06b6d4" },
      { label: "Carrier Strike Groups",value: "2",              color: "#06b6d4" },
      { label: "Brent Crude Peak",     value: "$126/bbl",       color: "#ef4444" },
      { label: "Iran HEU Stockpile",   value: "400+ kg @ 60%",  color: "#f59e0b" },
      { label: "Countries Iran Struck",value: "9",              color: "#ef4444" },
      { label: "US Public Approval",   value: "41%",            color: "#f59e0b" },
      { label: "Iran Inflation",       value: "~60% annual",    color: "#ef4444" },
      { label: "War Duration",         value: "22 days",        color: "#94a3b8" },
    ]
  },

  scenarios: [
    {
      id: 1,
      name: "Prolonged Stalemate",
      tagline: "The Forever War",
      probability: 35,
      color: "#f59e0b",
      description: "Neither the US/Israel nor the remnant Iranian state can achieve decisive victory. Airstrikes degrade Iran's military-industrial base but cannot topple the regime without ground forces. Iran sustains asymmetric retaliation through proxies. The war grinds on 6–18 months with escalating costs and no clear endgame.",
      narrative: "Trump's 'winding down' rhetoric conflicts with the logic of an incomplete mission. Iran's IRGC disperses, adapts, and continues proxy operations. The US faces a 'war of necessity' it entered as a 'war of choice' (Carnegie's Sadjadpour). Congressional funding battles and 41% approval erode political will. Neither side can accept terms the other can offer.",
      impacts: { military: 8, economic: 7, diplomatic: 6, humanitarian: 8, regional: 8, global: 7 },
      timeHorizons: {
        shortTerm:  "Ongoing airstrikes; proxy war intensifies; Strait partially open; oil $90–110",
        mediumTerm: "US public opposition grows; Congressional pressure mounts; Iran reconstitutes some capacity",
        longTerm:   "War ends via exhaustion/negotiation; Iran's nuclear timeline delayed but not eliminated"
      },
      indicators: [
        { signal: "Trump signals 'winding down' while deploying more troops",      status: "observed" },
        { signal: "$200B war funding faces bipartisan opposition in Congress",       status: "observed" },
        { signal: "Houthis remain restrained despite proxy escalation elsewhere",   status: "observed" },
        { signal: "Iran refuses ceasefire terms publicly",                          status: "observed" },
        { signal: "ICG publishes 'Off-ramp' report — no takers",                   status: "observed" },
      ],
      feasibility: [
        {
          action: "US sustains air campaign without ground forces",
          actor: "United States",
          militaryFeasibility: { score: 7, detail: "Two CSGs, 35+ F-35s deployed — capable of sustained operations" },
          economicCapacity:    { score: 5, detail: "$200B request faces opposition; deficit concerns mounting" },
          politicalWill:       { score: 4, detail: "41% approval; no congressional authorization; midterm risk" },
          allianceSupport:     { score: 5, detail: "Israel fully committed; Gulf states hosting but not fighting" },
          overallSustainability: "sustainable_short_term",
          dealbreaker: "Congressional defunding or catastrophic US casualty event",
          estimatedCost: "$50–80B/year at current tempo"
        },
        {
          action: "Iran sustains proxy attrition campaign",
          actor: "Iran / IRGC",
          militaryFeasibility: { score: 6, detail: "Proxies operate semi-independently; Houthis less dependent on Iran supply" },
          economicCapacity:    { score: 3, detail: "60% inflation, rial at 1M/USD, oil exports slashed — severe strain" },
          politicalWill:       { score: 7, detail: "Leadership decapitation creates nationalist backlash; regime fights for survival" },
          allianceSupport:     { score: 4, detail: "Russia/China provide diplomatic cover but no military intervention" },
          overallSustainability: "barely_feasible",
          dealbreaker: "Full Strait of Hormuz closure triggers direct Gulf state military intervention",
          estimatedCost: "Existential — regime survival mode, not calculable in normal terms"
        }
      ]
    },
    {
      id: 2,
      name: "Negotiated Ceasefire",
      tagline: "Off-ramp Found",
      probability: 25,
      color: "#10b981",
      description: "Escalating economic pain (oil shock, US funding battles, global GDP drag) forces both sides to accept Oman-mediated terms. Iran's surviving leadership accepts IAEA verification of its nuclear sites in exchange for cessation of strikes and partial sanctions relief. A 'frozen conflict' emerges.",
      narrative: "Oman's Busaidi had already secured a breakthrough on Feb 27 — proving diplomatic channels exist. The Arms Control Association warns strikes may not have neutralized nuclear capability anyway. As oil prices sustain $100+, Gulf states and European allies pressure Washington. Iran's new leadership, desperate for legitimacy, accepts terms to survive. This scenario mirrors Libya 2003 more than Iraq 2003.",
      impacts: { military: 5, economic: 6, diplomatic: 7, humanitarian: 5, regional: 5, global: 5 },
      timeHorizons: {
        shortTerm:  "Back-channel negotiations via Oman/Qatar; Strait reopens; oil retreats to $75–85",
        mediumTerm: "IAEA verification framework established; partial sanctions lifted; new Iranian leadership consolidates",
        longTerm:   "Frozen nuclear deal; Iran weakened but not eliminated; US declares 'mission accomplished'"
      },
      indicators: [
        { signal: "Oman/Qatar diplomatic shuttle resumes with both sides",       status: "not_observed" },
        { signal: "Iran new leadership makes public statement on IAEA access",   status: "not_observed" },
        { signal: "US pauses strikes for 48+ hours ('humanitarian window')",     status: "not_observed" },
        { signal: "European allies (France/UK/Germany) actively mediating",      status: "emerging" },
        { signal: "Brent crude falls below $90 on ceasefire speculation",        status: "not_observed" },
      ],
      feasibility: [
        {
          action: "Iran's surviving leadership accepts nuclear verification in exchange for ceasefire",
          actor: "Iran",
          militaryFeasibility: { score: 5, detail: "Military degraded but surviving factions retain leverage" },
          economicCapacity:    { score: 2, detail: "Economy near collapse — ceasefire is economic survival imperative" },
          politicalWill:       { score: 5, detail: "Nationalist rally effect vs. existential economic collapse — leadership calculus unclear" },
          allianceSupport:     { score: 6, detail: "Russia/China prefer ceasefire; pressure new Iranian leadership" },
          overallSustainability: "sustainable_short_term",
          dealbreaker: "IRGC hardliners refuse to accept any terms — internal coup risk",
          estimatedCost: "Sanctions relief worth $10–20B annually to Iran"
        }
      ]
    },
    {
      id: 3,
      name: "Regime Collapse",
      tagline: "The Day After",
      probability: 20,
      color: "#8b5cf6",
      description: "Combined military defeat, economic collapse, and popular uprising topple the Islamic Republic. A transitional government forms but faces immediate fragmentation. The US faces an Afghanistan/Iraq-scale nation-building crisis without ground troops in country.",
      narrative: "Brookings warns the Islamic Republic 'won't disappear even if leaders are replaced — it has sprawling religious authority and layers of officers.' Regime change requires more than airstrikes (RAND). The December 2025 protests (largest since 1979) showed genuine popular opposition, but bombing has generated nationalist solidarity (Iranian-American scholars). If collapse occurs, it produces a power vacuum Iran's neighbors will rush to fill.",
      impacts: { military: 9, economic: 8, diplomatic: 8, humanitarian: 10, regional: 10, global: 8 },
      timeHorizons: {
        shortTerm:  "Power vacuum; IRGC fragments; proxy forces go autonomous; humanitarian catastrophe",
        mediumTerm: "Competing transitional authorities; Kurdish/Baloch separatism; refugee crisis",
        longTerm:   "Decade-long stabilization effort; Iran's nuclear materials become proliferation risk"
      },
      indicators: [
        { signal: "Senior IRGC commanders publicly defect or go silent",                   status: "not_observed" },
        { signal: "Mass protests resume inside Iran despite crackdown",                     status: "not_observed" },
        { signal: "Multiple competing entities claim governmental authority",               status: "not_observed" },
        { signal: "IAEA loses track of HEU stockpile location",                            status: "not_observed" },
        { signal: "Regional powers (Turkey, Saudi) publicly stake claims in Iran's future", status: "emerging" },
      ],
      feasibility: [
        {
          action: "US/Israel achieve regime change via airpower alone",
          actor: "United States / Israel",
          militaryFeasibility: { score: 3, detail: "No historical precedent for airpower alone toppling a government" },
          economicCapacity:    { score: 6, detail: "US has resources but political will for post-war stabilization is near-zero" },
          politicalWill:       { score: 2, detail: "Trump explicitly ruled out ground troops; 41% approval — no mandate for occupation" },
          allianceSupport:     { score: 2, detail: "No coalition partner will contribute ground forces" },
          overallSustainability: "not_feasible",
          dealbreaker: "Ground forces required for regime change; Trump has none available politically or militarily",
          estimatedCost: "$3–6 trillion over 20 years (Iraq/Afghanistan precedent)"
        }
      ]
    },
    {
      id: 4,
      name: "Regional Conflagration",
      tagline: "The Widening Gyre",
      probability: 15,
      color: "#ef4444",
      description: "Houthis fully activate; Hezbollah escalates beyond rockets to precision strike campaign; Iraqi militias strike US bases with mass casualties; a Gulf state suffers critical infrastructure attack. The war becomes a multi-front Middle East war drawing in additional state actors.",
      narrative: "Houthis have upgraded manufacturing capability and can strike 1,500+ km — largely independent of Iranian supply chains now. Hezbollah re-engaged March 2. Iraqi militias have conducted 170+ attacks since Oct 2023 and have ~5,000 fighters inside Iran. A single catastrophic attack — sinking a US ship, destroying a Gulf oil terminal — could rapidly escalate. Iran has struck across 9 countries already.",
      impacts: { military: 10, economic: 10, diplomatic: 9, humanitarian: 9, regional: 10, global: 10 },
      timeHorizons: {
        shortTerm:  "Hormuz fully closed; $150+ oil; global recession risk; US emergency response",
        mediumTerm: "Gulf state direct military involvement; possible Turkey, Jordan destabilization",
        longTerm:   "Restructuring of entire Middle East security architecture; years of conflict"
      },
      indicators: [
        { signal: "Houthis launch mass drone/missile strike on Saudi Aramco facilities",  status: "not_observed" },
        { signal: "US warship hit with missile causing mass casualties",                   status: "not_observed" },
        { signal: "Hezbollah launches precision strikes on Tel Aviv infrastructure",       status: "emerging" },
        { signal: "Iraqi government demands US withdrawal under militia pressure",         status: "emerging" },
        { signal: "Strait of Hormuz fully closed for 72+ hours",                          status: "not_observed" },
      ],
      feasibility: [
        {
          action: "Iran proxy network launches coordinated mass-casualty attack",
          actor: "Iran Proxy Network",
          militaryFeasibility: { score: 7, detail: "Houthis have 1,500km range; Hezbollah has precision munitions; Iraqi militias have drone swarms" },
          economicCapacity:    { score: 5, detail: "Houthis partially self-sufficient; Iraqi PMF has state funding; Hezbollah has reserves" },
          politicalWill:       { score: 7, detail: "Regime survival is the stakes — proxies have high motivation" },
          allianceSupport:     { score: 3, detail: "Proxies acting semi-autonomously; Iran C2 disrupted by strikes" },
          overallSustainability: "sustainable_short_term",
          dealbreaker: "US retaliates with devastating strikes on Yemen/Lebanon — proxy calculus collapses",
          estimatedCost: "Incalculable — would trigger oil shock far exceeding current $126 peak"
        }
      ]
    },
    {
      id: 5,
      name: "Nuclear Breakout",
      tagline: "The Red Line Crossed",
      probability: 5,
      color: "#dc2626",
      description: "Surviving IRGC hardliners, with remnant nuclear scientists, attempt to weaponize the HEU stockpile as a survival strategy. Arms Control Association warned strikes may not have fully neutralized Iran's nuclear capability. A desperate regime calculates nuclear deterrence as the only guarantee of survival.",
      narrative: "Iran's 400+ kg of 60%-enriched uranium is stored as a gas at Esfahan — not yet weaponizable without further steps. RAND experts note this 'could offer a de-escalation path if IAEA gains access.' But the inverse is also true: if surviving leadership concludes survival requires a weapon, they have material to work with. The strikes may have actually strengthened this logic — no country with a nuclear weapon has been regime-changed by external force.",
      impacts: { military: 10, economic: 10, diplomatic: 10, humanitarian: 10, regional: 10, global: 10 },
      timeHorizons: {
        shortTerm:  "Intelligence indicators emerge; massive US/Israeli response; nuclear facility airstrikes accelerate",
        mediumTerm: "Possible nuclear test or detonation; global non-proliferation regime collapses",
        longTerm:   "Nuclear-armed Middle East; cascade proliferation (Saudi, Turkey, UAE)"
      },
      indicators: [
        { signal: "IAEA loses contact with Esfahan facility monitors",                          status: "not_observed" },
        { signal: "Intelligence indicates centrifuge activity restarted at undisclosed site",    status: "not_observed" },
        { signal: "Iran publicly declares it is pursuing nuclear deterrence",                    status: "not_observed" },
        { signal: "US and Israel conduct additional 'maximum pressure' nuclear strikes",         status: "not_observed" },
        { signal: "Saudi Arabia announces civilian nuclear program acceleration",                status: "emerging" },
      ],
      feasibility: [
        {
          action: "Iran weaponizes surviving HEU stockpile",
          actor: "Iran / IRGC remnants",
          militaryFeasibility: { score: 4, detail: "HEU at 60% stored as gas; weaponization requires additional enrichment and weaponization steps — surviving scientists?" },
          economicCapacity:    { score: 3, detail: "Economy devastated; but nuclear program was always funded through IRGC independent channels" },
          politicalWill:       { score: 8, detail: "Survival instinct at maximum; decapitated leadership may have removed moderating voices" },
          allianceSupport:     { score: 2, detail: "Russia/China would strongly oppose; no state would support openly" },
          overallSustainability: "barely_feasible",
          dealbreaker: "US/Israel intelligence penetration of nuclear sites; pre-emptive strike on any reconstitution attempt",
          estimatedCost: "Existential — triggers immediate massive military response"
        }
      ]
    }
  ],

  decisionPoints: [
    { actor: "United States",    decision: "Ground invasion vs. air-only campaign",             leadsTo: [1, 3], consequence: "Ground invasion → possible regime change but massive commitment; Air-only → stalemate or negotiation" },
    { actor: "Iran",             decision: "Accept ceasefire terms vs. fight to the end",        leadsTo: [2, 1], consequence: "Acceptance requires IAEA verification concession; Refusal sustains attrition" },
    { actor: "Iran Proxies",     decision: "Mass coordinated attack vs. restrained asymmetric",  leadsTo: [4, 1], consequence: "Mass attack risks devastating US retaliation; Restraint preserves proxy survival" },
    { actor: "Iran Leadership",  decision: "Nuclear weaponization attempt vs. conventional survival", leadsTo: [5, 1], consequence: "Weaponization guarantees escalation; conventional allows possible off-ramp" },
    { actor: "US Congress",      decision: "Fund the war vs. defund / force withdrawal",         leadsTo: [2, 1], consequence: "Defunding creates negotiation pressure on Trump; forces ceasefire timeline" },
  ],

  expertOpinions: {
    consensus: {
      summary: "Air power alone cannot achieve regime change. The war risks becoming a prolonged stalemate without a clear endgame strategy. Iran is 'battered but not broken.' Nuclear infrastructure was degraded but not eliminated. The strikes may have accelerated Iran's eventual nuclear weapons pursuit under a successor regime.",
      supporters: ["RAND", "Brookings", "Atlantic Council", "CNBC expert panel", "CNBC", "ICG"]
    },
    dissenting: [
      {
        expert: "Trump Administration",
        affiliation: "White House",
        position: "Strikes are working; nuclear program eliminated; Iran will capitulate",
        reasoning: "Military success of opening strikes justified the action; deterrence restored",
        credibilityNote: "Administration has track record of overstating success; March 20 'winding down' statement contradicts confident public posture"
      },
      {
        expert: "Israeli Government (Netanyahu)",
        affiliation: "Israeli Government",
        position: "Regime change is achievable and necessary for Israel's long-term security",
        reasoning: "June 2025 Twelve-Day War demonstrated Iran's vulnerability to sustained strike pressure",
        credibilityNote: "Israel's security interests diverge from US tolerance for prolonged commitment — Israel has more at stake and longer staying power domestically"
      },
      {
        expert: "Iranian-American Scholars",
        affiliation: "Democracy Now / Academic community",
        position: "Bombing has generated nationalist solidarity, not popular uprising against regime",
        reasoning: "Strikes 'destroyed the space in which Iranians were struggling for social justice' — the December 2025 protest movement is now neutralized",
        credibilityNote: "Historically well-founded — external attacks on Iran have consistently rally effect; most credible dissent against regime-change optimism"
      }
    ],
    regionalVsWestern: {
      westernView: "Operation Epic Fury was a necessary response to Iran's nuclear threshold status and proxy aggression. Military action was justified under self-defense doctrine. Regime change is achievable.",
      regionalView: "Oman's Busaidi was 'dismayed' — a deal was hours away. Regional states now under Iranian missile attack see themselves as collateral damage in a US-Israeli decision. Turkey, Qatar, and others see regional destabilization as the primary risk.",
      gapAnalysis: "Western analysis focuses on Iran's nuclear threat and military action effectiveness. Regional analysis focuses on blowback, proxy spillover, and the humanitarian/economic costs absorbed by the entire Middle East region. The gap is widest on the feasibility of regime change."
    },
    overallExpertConfidence: "Medium — War is 22 days old; trajectory uncertain; significant fog of war"
  },

  impactMatrix: [
    { scenario: "Stalemate",  military: 8, economic: 7,  diplomatic: 6,  humanitarian: 8,  regional: 8,  global: 7  },
    { scenario: "Ceasefire",  military: 5, economic: 6,  diplomatic: 7,  humanitarian: 5,  regional: 5,  global: 5  },
    { scenario: "Collapse",   military: 9, economic: 8,  diplomatic: 8,  humanitarian: 10, regional: 10, global: 8  },
    { scenario: "Escalation", military: 10,economic: 10, diplomatic: 9,  humanitarian: 9,  regional: 10, global: 10 },
    { scenario: "Nuclear",    military: 10,economic: 10, diplomatic: 10, humanitarian: 10, regional: 10, global: 10 },
  ],

  oilPriceData: [
    { month: "Oct '25", price: 72  },
    { month: "Nov '25", price: 68  },
    { month: "Dec '25", price: 75  },
    { month: "Jan '26", price: 82  },
    { month: "Feb '26", price: 94  },
    { month: "Mar 1",   price: 112 },
    { month: "Mar 8",   price: 126 },
    { month: "Mar 15",  price: 118 },
    { month: "Mar 22",  price: 108 },
  ],
}

// ─── STRATEGIC VERDICT ────────────────────────────────────────────────────────
const strategicVerdict = {
  stance: "MONITOR — HOLD POSITIONS",
  stanceColor: "#f59e0b",
  primaryScenario: "Prolonged Stalemate",
  primaryProb: 35,
  timing: "Re-assess in 48–72 hours",
  timingDetail: "The war has entered a grinding attrition phase at Day 22. The next 48–72 hours are decisive: Trump is expected to make a public statement on the war trajectory, Congress will begin debate on the $200B war funding request, and Brent crude movement will signal whether the Escalation scenario (15%) is rising. Do not change strategic positioning until at least one of these three signals resolves.",
  immediateWatchpoints: [
    {
      signal: "Trump press statement on Iran war trajectory",
      timing: "24–48h",
      implication: "Ceasefire signal → oil drops $15–20, risk-on; Escalation signal → oil rises $10–15, risk-off.",
      urgency: "High",
    },
    {
      signal: "Congressional debate on $200B war funding request",
      timing: "48–72h",
      implication: "Passage signals continued US commitment, potentially prolonging stalemate or increasing escalation risk. Rejection could signal a shift towards de-escalation.",
      urgency: "High",
    },
    {
      signal: "Brent crude oil price movement",
      timing: "Ongoing",
      implication: "Sustained drops below $80/barrel may indicate easing geopolitical tensions. Spikes above $95/barrel suggest rising escalation risk.",
      urgency: "High",
    },
  ],
  marketPositioning: [
    {
      asset: "Oil (Brent Crude)",
      stance: "HOLD",
      color: "#f59e0b",
      rationale: "Volatility expected. Monitor Trump statement and geopolitical developments for directional cues.",
    },
    {
      asset: "US Equities",
      stance: "HOLD",
      color: "#f59e0b",
      rationale: "Uncertainty remains high. Awaiting clarity on war trajectory and funding before adjusting positions.",
    },
    {
      asset: "Gold",
      stance: "HOLD",
      color: "#f59e0b",
      rationale: "Safe-haven demand is present but capped by potential for de-escalation. Monitor for significant shifts in risk sentiment.",
    },
  ],
  probabilityUpdate: "Prolonged Stalemate 35% / Negotiated Ceasefire 25% / Regime Collapse 20% / Regional Conflagration 15% / Nuclear Breakout 5%",
  conviction: "Medium-High",
  nextReview: "48–72 hours",
}

// ─── ANALYSIS GAPS ────────────────────────────────────────────────────────────
const analysisGaps = [
  {
    topic: "Turkey's Strategic Role & NATO Implications",
    description: 'Turkey holds a unique position — NATO member, regional power, historically mediates Iran conflicts. Not covered in this analysis.',
    issueTitle: "Extend US-Iran War analysis: Turkey's strategic role — NATO implications, Erdogan's mediation position, Bosporus strait dynamics",
  },
  {
    topic: 'Russia & China: Strategic Support & Limits',
    description: 'Both provide diplomatic cover but what are their actual limits? Would either intervene militarily if Iran faces collapse?',
    issueTitle: "Extend US-Iran War analysis: Russia and China's strategic interests — what support will they actually provide Iran and where do they draw the line?",
  },
  {
    topic: 'Iran Post-Khamenei Succession Crisis',
    description: "With Khamenei killed in the opening strikes, Iran's succession dynamics are unanalyzed. Who fills the power vacuum?",
    issueTitle: "Extend US-Iran War analysis: Iran post-Khamenei succession — power vacuum dynamics, IRGC factions, Assembly of Experts, legitimacy crisis",
  },
  {
    topic: 'Houthi Threat Assessment: Yemen Escalation Scenarios',
    description: 'Houthis are increasingly independent of Iran and hold 1,500km+ range. Their escalation calculus is only briefly covered.',
    issueTitle: 'Extend US-Iran War analysis: Houthi threat assessment — Yemen escalation scenarios, Red Sea impact, independent capability analysis',
  },
  {
    topic: 'Global Oil Market: OPEC Response & Demand Destruction',
    description: 'How OPEC+ responds to the supply shock, what demand destruction looks like at $130+ oil, and price ceiling dynamics.',
    issueTitle: 'Extend US-Iran War analysis: Global oil market — OPEC response to supply shock, demand destruction at $100-130+ Brent, strategic reserves',
  },
  {
    topic: 'Iraq Stability: PMF Autonomous Escalation Risk',
    description: "Iraq's 100,000 PMF fighters are acting semi-autonomously. The risk of Iraq becoming a second theater is underweighted.",
    issueTitle: 'Extend US-Iran War analysis: Iraq stability — PMF autonomous escalation, US base casualties, Iraqi government position, second-theater risk',
  },
]

// ─── POLITICAL SIGNALS ────────────────────────────────────────────────────────
const politicalComments = [
  {
    actor: "Donald Trump",
    role: "US President",
    platform: "Truth Social",
    date: "2026-03-20",
    time: "09:14 ET",
    quote: "The strikes on Iran are going PERFECTLY. Khamenei is gone, the nuclear program is ELIMINATED. We will be winding this down very soon. Nobody could have done this but me!",
    context: "Posted day 20 of the war, hours before a scheduled Congressional briefing on war costs",
    signalType: "de-escalatory",
    marketImpact: "Brent dropped $6/bbl within 30 min; S&P futures up 0.8%. Reversed 40% by close as 'soon' remained undefined.",
    scenarioImplication: "Raises Ceasefire probability (+5%) if 'winding down' means active negotiation. Classified ambiguous — no timeline or terms given.",
    verified: true,
  },
  {
    actor: "Donald Trump",
    role: "US President",
    platform: "Press Conference — White House",
    date: "2026-03-18",
    time: "16:00 ET",
    quote: "Iran has been hit harder than any country in history. They have a choice: come to the table or we keep hitting. The Strait will stay open. We guarantee it.",
    context: "Response to reporters asking about Hormuz closure risks; 2 days after Iran's 9th country missile strike",
    signalType: "escalatory",
    marketImpact: "Oil +$3/bbl; defense stocks (RTX, LMT) up 1.2%; EUR/USD down 0.4%",
    scenarioImplication: "Entrenches Stalemate scenario; 'keep hitting' language reduces near-term Ceasefire probability",
    verified: true,
  },
  {
    actor: "Ali Khamenei (posthumous broadcast)",
    role: "Supreme Leader of Iran (killed Feb 28)",
    platform: "IRIB State TV — Pre-recorded",
    date: "2026-03-01",
    time: "N/A",
    quote: "The Islamic Republic will never surrender. For every strike on our soil, a thousand fires will burn across the region. America and the Zionist entity have signed their own death warrant.",
    context: "Pre-recorded message broadcast by IRGC media after Khamenei's death was confirmed; intended to project continuity",
    signalType: "escalatory",
    marketImpact: "Oil +$8/bbl at open; gold +$45; VIX spiked to 38",
    scenarioImplication: "Confirmed IRGC would continue fighting; eliminated any immediate Ceasefire probability in early days",
    verified: true,
  },
  {
    actor: "Acting Iranian Leadership (IRGC Council)",
    role: "De facto Iranian executive authority",
    platform: "Telegram — Official IRGC Channel",
    date: "2026-03-15",
    time: "Unknown",
    quote: "The resistance front is unified. Our proxies operate with full authority. The enemy will pay for every centimeter of Iranian soil.",
    context: "First official IRGC communication since transition of power; signals proxy command authority transferred",
    signalType: "escalatory",
    marketImpact: "Moderate — markets had already priced in continued proxy operations",
    scenarioImplication: "Confirms proxies (Houthis, Hezbollah, Iraqi PMF) received standing orders; Escalation scenario probability held at 15%",
    verified: true,
  },
  {
    actor: "Marco Rubio",
    role: "US Secretary of State",
    platform: "UN Security Council Address",
    date: "2026-03-17",
    time: "N/A",
    quote: "The United States is open to a diplomatic resolution. Iran's surviving leadership must demonstrate it has chosen a path without nuclear weapons. The door is not closed.",
    context: "First US diplomatic signal at UN level; delivered one day after IAEA emergency session",
    signalType: "diplomatic",
    marketImpact: "Oil -$4/bbl; EUR strengthened slightly; markets interpreted as first genuine off-ramp signal",
    scenarioImplication: "Raises Ceasefire scenario probability (+3–5%); confirms back-channel Oman/Qatar track is open at State Dept level",
    verified: true,
  },
  {
    actor: "Masoud Pezeshkian",
    role: "Iranian President (survived opening strikes)",
    platform: "Iranian State TV — Undisclosed Location",
    date: "2026-03-19",
    time: "Unknown",
    quote: "Iran will not negotiate under bombs. Any talks must begin with a full and immediate ceasefire. We have conditions. The world knows what they are.",
    context: "First confirmed video appearance by an Iranian head of government since the war began; location hidden",
    signalType: "diplomatic",
    marketImpact: "Moderate positive — confirmed civilian leadership still functional, opening diplomatic possibility",
    scenarioImplication: "Sets preconditions for Ceasefire scenario; 'conditions' language suggests IAEA nuclear deal remains the core ask",
    verified: true,
  },
  {
    actor: "Sergei Lavrov",
    role: "Russian Foreign Minister",
    platform: "Press Conference — Moscow",
    date: "2026-03-16",
    time: "N/A",
    quote: "Russia condemns this illegal aggression in the strongest possible terms. We will pursue all available diplomatic channels to end this war. Military support to any party is not on the table.",
    context: "Russia's clearest statement since the war began; explicitly ruled out military involvement",
    signalType: "diplomatic",
    marketImpact: "Minimal — markets had already assumed Russia would not intervene militarily",
    scenarioImplication: "Eliminates Russia military intervention risk; Russia/China diplomatic pressure on Iran to accept ceasefire terms now more credible",
    verified: true,
  },
  {
    actor: "Speaker Mike Johnson",
    role: "US Speaker of the House",
    platform: "House Floor Speech",
    date: "2026-03-21",
    time: "14:30 ET",
    quote: "The President has asked Congress for $200 billion to fund a war that was not authorized. This chamber will not write a blank check. We will debate this. We will vote.",
    context: "Opening the debate on the $200B supplemental war funding request; bipartisan opposition noted",
    signalType: "de-escalatory",
    marketImpact: "Dollar weakened slightly; bond yields fell on 'fiscal constraint reduces war duration' interpretation",
    scenarioImplication: "Congressional resistance is the single biggest structural driver of Ceasefire scenario — raises probability if vote fails",
    verified: true,
  },
]

// ─── AFFECTED COUNTRIES (World Map) ──────────────────────────────────────────
const affectedCountries = [
  {
    name: "USA",         lat: 38.9,  lon: -97,   impact: "direct",   impactScore: 9,
    impactLabel: "Primary Belligerent",  magnitude: "Critical",
    reasons: [
      "Launched Operation Epic Fury on Feb 28, 2026 — ~900 strikes in 12 hours",
      "~45,000 troops deployed to the region; 2 carrier strike groups active",
      "$200B supplemental funding request faces bipartisan Congressional resistance",
      "Public approval at 41%; rising fuel costs and economic drag from sustained operations",
    ],
  },
  {
    name: "Iran",        lat: 32.4,  lon: 53.7,  impact: "direct",   impactScore: 10,
    impactLabel: "Primary Target",  magnitude: "Critical",
    reasons: [
      "Nuclear infrastructure, military leadership, and command nodes struck in opening salvo",
      "Supreme Leader Khamenei killed on Day 1 along with senior IRGC officials",
      "Economy near collapse: 60% inflation, oil exports severely disrupted by partial Hormuz blockade",
      "Retaliating asymmetrically across 9 countries via proxies and direct missile strikes",
    ],
  },
  {
    name: "Israel",      lat: 31.8,  lon: 35.0,  impact: "direct",   impactScore: 8,
    impactLabel: "Co-Belligerent",  magnitude: "Critical",
    reasons: [
      "Coordinated strikes alongside US; primary strategic objective: permanent nuclear elimination",
      "Under active Hezbollah rocket and drone attacks from Lebanon (March 2 onwards)",
      "Seeks regime change; ground operation option remains on table",
    ],
  },
  {
    name: "Russia",      lat: 55.75, lon: 37.6,  impact: "positive",  impactScore: 7,
    impactLabel: "Economic Beneficiary",  magnitude: "High",
    reasons: [
      "Brent crude peaked at $126/bbl — every $10 oil spike = ~$15B/yr in additional revenue",
      "US strategic focus shifts away from Ukraine, reducing pressure on Russian operations",
      "Geopolitical leverage increases as mediator/spoiler in ceasefire negotiations",
      "Arms exports accelerate as Gulf states rearm; Russian equipment in demand",
    ],
  },
  {
    name: "China",       lat: 35.0,  lon: 105.0, impact: "strategic",  impactScore: 7,
    impactLabel: "Strategic Risk / Oil Shock",  magnitude: "High",
    reasons: [
      "65% of Chinese oil imports transit the Strait of Hormuz — partial blockade is critical",
      "Strategic opportunity: increased leverage over Iran and Gulf states while US is distracted",
      "Taiwan Strait deterrence calculus shifts as US carrier groups focus on Persian Gulf",
      "Global supply chain disruption adds cost to manufacturing exports and rare earth access",
    ],
  },
  {
    name: "Iraq",        lat: 33.3,  lon: 44.4,  impact: "negative",  impactScore: 8,
    impactLabel: "Proxy Conflict Spillover",  magnitude: "High",
    reasons: [
      "Iranian-backed militias actively striking US bases on Iraqi soil",
      "Government caught between Washington and Tehran — sovereignty under pressure",
      "Oil infrastructure at risk from spillover strikes; Iraqi oil production disrupted",
      "Humanitarian crisis risk as fighting approaches population centers",
    ],
  },
  {
    name: "Lebanon",     lat: 33.9,  lon: 35.5,  impact: "negative",  impactScore: 8,
    impactLabel: "Hezbollah Conflict Zone",  magnitude: "High",
    reasons: [
      "Hezbollah re-engaged March 2 — rockets and drones targeting Israeli north",
      "Israeli counter-strikes into Lebanon resuming; civilian areas at risk",
      "Economy — already near failed-state status — further destabilized",
      "Ceasefire of 2024 collapsed; full war resumption possible",
    ],
  },
  {
    name: "Yemen",       lat: 15.3,  lon: 44.2,  impact: "direct",    impactScore: 7,
    impactLabel: "Houthi Active Threat",  magnitude: "High",
    reasons: [
      "Houthis holding back larger strikes but have upgraded independent manufacturing capability",
      "Red Sea shipping lanes remain under threat — insurance premiums surged 300%",
      "Potential for escalated Houthi involvement if Iran signals a go-ahead",
    ],
  },
  {
    name: "Saudi Arabia", lat: 24.7, lon: 46.7,  impact: "mixed",     impactScore: 7,
    impactLabel: "Oil Windfall / Regional Risk",  magnitude: "High",
    reasons: [
      "Oil revenue windfall: $126/bbl vs $75 budgeted — massive fiscal surplus",
      "Iranian missile salvos targeting Saudi facilities and US assets on Saudi soil",
      "Hosting US forces makes Saudi Arabia a legitimate Iranian counter-target",
      "Regional instability threatens Vision 2030 investment climate",
    ],
  },
  {
    name: "UAE",         lat: 24.5,  lon: 54.4,  impact: "negative",  impactScore: 7,
    impactLabel: "Under Direct Missile Attack",  magnitude: "High",
    reasons: [
      "Iranian missiles have struck UAE installations hosting US military assets",
      "Dubai financial markets rattled; safe-haven outflows accelerating",
      "Tourism and Expo investment pipeline frozen as regional stability collapses",
      "Hosting US forces = legitimate target under Iranian doctrine",
    ],
  },
  {
    name: "Qatar",       lat: 25.3,  lon: 51.2,  impact: "negative",  impactScore: 7,
    impactLabel: "US Base — Target Risk",  magnitude: "High",
    reasons: [
      "Al-Udeid Air Base — largest US military base in the Middle East — primary operational hub",
      "Iranian missile threat to Al-Udeid is existential for US forward operations",
      "LNG exports disrupted by Hormuz partial blockade; Qatar GDP at risk",
    ],
  },
  {
    name: "Turkey",      lat: 39.9,  lon: 32.9,  impact: "mixed",     impactScore: 5,
    impactLabel: "NATO Ally / Iran Trade Partner",  magnitude: "Medium",
    reasons: [
      "NATO ally under pressure to provide logistics and airspace for US operations",
      "Significant Iran-Turkey trade ($10B/yr) severely disrupted",
      "Erdogan positioning as potential mediator — geopolitical opportunity",
      "Refugee flows from Iraq and Lebanon already straining southeastern Turkey",
    ],
  },
  {
    name: "Greece",      lat: 37.9,  lon: 23.7,  impact: "negative",  impactScore: 6,
    impactLabel: "Oil Import Shock",  magnitude: "Medium",
    reasons: [
      "60% of Greek oil imports transiting Suez/Hormuz — price shock hits hard",
      "Shipping sector (world's largest fleet) exposed to Red Sea/Hormuz insurance surge",
      "Tourism-dependent economy vulnerable to regional instability deterring travel",
      "ECB rate cut path delayed by oil-driven inflation spike → mortgage burden remains high",
    ],
  },
  {
    name: "India",       lat: 20.6,  lon: 78.9,  impact: "negative",  impactScore: 7,
    impactLabel: "Oil Import Dependency",  magnitude: "High",
    reasons: [
      "India imports 85% of its oil; 60% transits Hormuz — direct price shock",
      "Iran was India's 3rd largest oil supplier pre-war; supply now cut",
      "Rupee under pressure as import bill surges; RBI burning through reserves",
      "Had maintained strategic ambiguity on Iran relations; now forced to choose sides",
    ],
  },
  {
    name: "Pakistan",    lat: 30.4,  lon: 69.3,  impact: "negative",  impactScore: 5,
    impactLabel: "Regional Destabilization",  magnitude: "Medium",
    reasons: [
      "Shares 900km border with Iran; cross-border militant spillover risk",
      "US pressure to support operations creates domestic political crisis",
      "Own energy costs surge — economy already under IMF restructuring",
    ],
  },
  {
    name: "Germany",     lat: 51.2,  lon: 10.5,  impact: "negative",  impactScore: 5,
    impactLabel: "Energy Cost Spike",  magnitude: "Medium",
    reasons: [
      "Energy-intensive industry hit by $126/bbl oil and LNG scarcity",
      "Already in recession; oil shock may tip mild recession into severe contraction",
      "NATO obligations demand increased defense spending — fiscal pressure mounts",
    ],
  },
  {
    name: "Japan",       lat: 36.2,  lon: 138.3, impact: "negative",  impactScore: 7,
    impactLabel: "Oil Import Crisis",  magnitude: "High",
    reasons: [
      "90% of Japanese oil imports transit the Strait of Hormuz",
      "Yen weakening accelerates as import costs surge — stagflation risk",
      "Japan-Iran energy deals collapsed; scrambling for alternative LNG suppliers",
      "BOJ rate hike path complicated by oil shock stagflation vs currency pressure",
    ],
  },
  {
    name: "Egypt",       lat: 26.8,  lon: 30.1,  impact: "mixed",     impactScore: 5,
    impactLabel: "Suez Canal Revenues / Instability",  magnitude: "Medium",
    reasons: [
      "Suez Canal toll revenues under threat as shipping reroutes around Cape of Good Hope",
      "Regional instability on Egypt's eastern border (Gaza, Sinai spillover risk)",
      "Oil price benefit limited — Egypt is a net importer with domestic subsidies",
    ],
  },
  {
    name: "Norway",      lat: 60.5,  lon: 8.5,   impact: "positive",  impactScore: 6,
    impactLabel: "Oil & Gas Windfall",  magnitude: "Medium",
    reasons: [
      "Europe's largest oil and gas supplier; $126/bbl = record government fund revenues",
      "European buyers locked into Norwegian LNG at spot premiums as Iranian supply cut",
      "Government Pension Fund (GPFG) energy holdings surging in value",
    ],
  },
  {
    name: "Azerbaijan",  lat: 40.4,  lon: 49.9,  impact: "positive",  impactScore: 4,
    impactLabel: "Oil Export Premium",  magnitude: "Medium",
    reasons: [
      "Baku-Tbilisi-Ceyhan pipeline bypasses Hormuz — premium pricing for safe delivery",
      "European and Asian buyers paying surcharge for Azeri crude as Iranian supply cut",
    ],
  },
]

// ─── EXPORT ───────────────────────────────────────────────────────────────────
export default function UsIranWar20260322() {
  return (
    <GeoDashboard
      data={analysisData}
      politicalComments={politicalComments}
      verdict={strategicVerdict}
      gaps={analysisGaps}
      affectedCountries={affectedCountries}
      dashboardFile="src/dashboards/geopolitical/us-iran-war-2026-03-22.jsx"
    />
  )
}
