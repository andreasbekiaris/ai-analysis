import { useState } from 'react'
import { Link } from 'react-router-dom'
import AddToAnalysis from '../../components/AddToAnalysis'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, Cell
} from 'recharts'
import {
  AlertTriangle, Shield, Globe2, TrendingDown, Zap, Clock,
  Target, ChevronRight, Activity, Eye, Users, DollarSign,
  Crosshair, Radio, Flag, BookOpen, ArrowRight, Home
} from 'lucide-react'

// ─── ANALYSIS DATA ────────────────────────────────────────────────────────────
const analysisData = {
  title: "US–Iran War: Operation Epic Fury",
  subtitle: "Trajectory & Outcome Analysis",
  date: "2026-03-22",
  warStartDate: "2026-02-28",
  daysElapsed: 22,
  overallConfidence: "Medium",
  classification: "OPEN SOURCE ANALYSIS",

  situation: {
    actors: [
      { name: "United States", role: "Primary belligerent", stance: "Offensive — seeking nuclear elimination & regime change", power: 95 },
      { name: "Israel", role: "Co-belligerent", stance: "Coordinated strikes; regime change goal", power: 72 },
      { name: "Iran (IRGC)", role: "Defender / retaliator", stance: "Asymmetric retaliation; no ceasefire sought", power: 55 },
      { name: "Hezbollah", role: "Iran proxy", stance: "Re-engaged March 2; rockets/drones vs. Israel", power: 38 },
      { name: "Houthis (Yemen)", role: "Iran proxy", stance: "Holding back; upgraded manufacturing independent of Iran", power: 30 },
      { name: "Iraqi Militias", role: "Iran proxy", stance: "Active — striking US bases in Iraq", power: 25 },
      { name: "Gulf States", role: "Under attack / US-aligned", stance: "Absorbing Iranian missile salvos; hosting US assets", power: 40 },
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
      { label: "US Troops in Region", value: "~45,000", color: "#06b6d4" },
      { label: "Carrier Strike Groups", value: "2", color: "#06b6d4" },
      { label: "Brent Crude Peak", value: "$126/bbl", color: "#ef4444" },
      { label: "Iran HEU Stockpile", value: "400+ kg @ 60%", color: "#f59e0b" },
      { label: "Countries Iran Struck", value: "9", color: "#ef4444" },
      { label: "US Public Approval", value: "41%", color: "#f59e0b" },
      { label: "Iran Inflation", value: "~60% annual", color: "#ef4444" },
      { label: "War Duration", value: "22 days", color: "#94a3b8" },
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
        shortTerm: "Ongoing airstrikes; proxy war intensifies; Strait partially open; oil $90–110",
        mediumTerm: "US public opposition grows; Congressional pressure mounts; Iran reconstitutes some capacity",
        longTerm: "War ends via exhaustion/negotiation; Iran's nuclear timeline delayed but not eliminated"
      },
      indicators: [
        { signal: "Trump signals 'winding down' while deploying more troops", status: "observed" },
        { signal: "$200B war funding faces bipartisan opposition in Congress", status: "observed" },
        { signal: "Houthis remain restrained despite proxy escalation elsewhere", status: "observed" },
        { signal: "Iran refuses ceasefire terms publicly", status: "observed" },
        { signal: "ICG publishes 'Off-ramp' report — no takers", status: "observed" },
      ],
      feasibility: [
        {
          action: "US sustains air campaign without ground forces",
          actor: "United States",
          militaryFeasibility: { score: 7, detail: "Two CSGs, 35+ F-35s deployed — capable of sustained operations" },
          economicCapacity: { score: 5, detail: "$200B request faces opposition; deficit concerns mounting" },
          politicalWill: { score: 4, detail: "41% approval; no congressional authorization; midterm risk" },
          allianceSupport: { score: 5, detail: "Israel fully committed; Gulf states hosting but not fighting" },
          overallSustainability: "sustainable_short_term",
          dealbreaker: "Congressional defunding or catastrophic US casualty event",
          estimatedCost: "$50–80B/year at current tempo"
        },
        {
          action: "Iran sustains proxy attrition campaign",
          actor: "Iran / IRGC",
          militaryFeasibility: { score: 6, detail: "Proxies operate semi-independently; Houthis less dependent on Iran supply" },
          economicCapacity: { score: 3, detail: "60% inflation, rial at 1M/USD, oil exports slashed — severe strain" },
          politicalWill: { score: 7, detail: "Leadership decapitation creates nationalist backlash; regime fights for survival" },
          allianceSupport: { score: 4, detail: "Russia/China provide diplomatic cover but no military intervention" },
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
        shortTerm: "Back-channel negotiations via Oman/Qatar; Strait reopens; oil retreats to $75–85",
        mediumTerm: "IAEA verification framework established; partial sanctions lifted; new Iranian leadership consolidates",
        longTerm: "Frozen nuclear deal; Iran weakened but not eliminated; US declares 'mission accomplished'"
      },
      indicators: [
        { signal: "Oman/Qatar diplomatic shuttle resumes with both sides", status: "not_observed" },
        { signal: "Iran new leadership makes public statement on IAEA access", status: "not_observed" },
        { signal: "US pauses strikes for 48+ hours ('humanitarian window')", status: "not_observed" },
        { signal: "European allies (France/UK/Germany) actively mediating", status: "emerging" },
        { signal: "Brent crude falls below $90 on ceasefire speculation", status: "not_observed" },
      ],
      feasibility: [
        {
          action: "Iran's surviving leadership accepts nuclear verification in exchange for ceasefire",
          actor: "Iran",
          militaryFeasibility: { score: 5, detail: "Military degraded but surviving factions retain leverage" },
          economicCapacity: { score: 2, detail: "Economy near collapse — ceasefire is economic survival imperative" },
          politicalWill: { score: 5, detail: "Nationalist rally effect vs. existential economic collapse — leadership calculus unclear" },
          allianceSupport: { score: 6, detail: "Russia/China prefer ceasefire; pressure new Iranian leadership" },
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
        shortTerm: "Power vacuum; IRGC fragments; proxy forces go autonomous; humanitarian catastrophe",
        mediumTerm: "Competing transitional authorities; Kurdish/Baloch separatism; refugee crisis",
        longTerm: "Decade-long stabilization effort; Iran's nuclear materials become proliferation risk"
      },
      indicators: [
        { signal: "Senior IRGC commanders publicly defect or go silent", status: "not_observed" },
        { signal: "Mass protests resume inside Iran despite crackdown", status: "not_observed" },
        { signal: "Multiple competing entities claim governmental authority", status: "not_observed" },
        { signal: "IAEA loses track of HEU stockpile location", status: "not_observed" },
        { signal: "Regional powers (Turkey, Saudi) publicly stake claims in Iran's future", status: "emerging" },
      ],
      feasibility: [
        {
          action: "US/Israel achieve regime change via airpower alone",
          actor: "United States / Israel",
          militaryFeasibility: { score: 3, detail: "No historical precedent for airpower alone toppling a government" },
          economicCapacity: { score: 6, detail: "US has resources but political will for post-war stabilization is near-zero" },
          politicalWill: { score: 2, detail: "Trump explicitly ruled out ground troops; 41% approval — no mandate for occupation" },
          allianceSupport: { score: 2, detail: "No coalition partner will contribute ground forces" },
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
        shortTerm: "Hormuz fully closed; $150+ oil; global recession risk; US emergency response",
        mediumTerm: "Gulf state direct military involvement; possible Turkey, Jordan destabilization",
        longTerm: "Restructuring of entire Middle East security architecture; years of conflict"
      },
      indicators: [
        { signal: "Houthis launch mass drone/missile strike on Saudi Aramco facilities", status: "not_observed" },
        { signal: "US warship hit with missile causing mass casualties", status: "not_observed" },
        { signal: "Hezbollah launches precision strikes on Tel Aviv infrastructure", status: "emerging" },
        { signal: "Iraqi government demands US withdrawal under militia pressure", status: "emerging" },
        { signal: "Strait of Hormuz fully closed for 72+ hours", status: "not_observed" },
      ],
      feasibility: [
        {
          action: "Iran proxy network launches coordinated mass-casualty attack",
          actor: "Iran Proxy Network",
          militaryFeasibility: { score: 7, detail: "Houthis have 1,500km range; Hezbollah has precision munitions; Iraqi militias have drone swarms" },
          economicCapacity: { score: 5, detail: "Houthis partially self-sufficient; Iraqi PMF has state funding; Hezbollah has reserves" },
          politicalWill: { score: 7, detail: "Regime survival is the stakes — proxies have high motivation" },
          allianceSupport: { score: 3, detail: "Proxies acting semi-autonomously; Iran C2 disrupted by strikes" },
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
        shortTerm: "Intelligence indicators emerge; massive US/Israeli response; nuclear facility airstrikes accelerate",
        mediumTerm: "Possible nuclear test or detonation; global non-proliferation regime collapses",
        longTerm: "Nuclear-armed Middle East; cascade proliferation (Saudi, Turkey, UAE)"
      },
      indicators: [
        { signal: "IAEA loses contact with Esfahan facility monitors", status: "not_observed" },
        { signal: "Intelligence indicates centrifuge activity restarted at undisclosed site", status: "not_observed" },
        { signal: "Iran publicly declares it is pursuing nuclear deterrence", status: "not_observed" },
        { signal: "US and Israel conduct additional 'maximum pressure' nuclear strikes", status: "not_observed" },
        { signal: "Saudi Arabia announces civilian nuclear program acceleration", status: "emerging" },
      ],
      feasibility: [
        {
          action: "Iran weaponizes surviving HEU stockpile",
          actor: "Iran / IRGC remnants",
          militaryFeasibility: { score: 4, detail: "HEU at 60% stored as gas; weaponization requires additional enrichment and weaponization steps — surviving scientists?" },
          economicCapacity: { score: 3, detail: "Economy devastated; but nuclear program was always funded through IRGC independent channels" },
          politicalWill: { score: 8, detail: "Survival instinct at maximum; decapitated leadership may have removed moderating voices" },
          allianceSupport: { score: 2, detail: "Russia/China would strongly oppose; no state would support openly" },
          overallSustainability: "barely_feasible",
          dealbreaker: "US/Israel intelligence penetration of nuclear sites; pre-emptive strike on any reconstitution attempt",
          estimatedCost: "Existential — triggers immediate massive military response"
        }
      ]
    }
  ],

  decisionPoints: [
    { actor: "United States", decision: "Ground invasion vs. air-only campaign", leadsTo: [1, 3], consequence: "Ground invasion → possible regime change but massive commitment; Air-only → stalemate or negotiation" },
    { actor: "Iran", decision: "Accept ceasefire terms vs. fight to the end", leadsTo: [2, 1], consequence: "Acceptance requires IAEA verification concession; Refusal sustains attrition" },
    { actor: "Iran Proxies", decision: "Mass coordinated attack vs. restrained asymmetric", leadsTo: [4, 1], consequence: "Mass attack risks devastating US retaliation; Restraint preserves proxy survival" },
    { actor: "Iran Leadership", decision: "Nuclear weaponization attempt vs. conventional survival", leadsTo: [5, 1], consequence: "Weaponization guarantees escalation; conventional allows possible off-ramp" },
    { actor: "US Congress", decision: "Fund the war vs. defund / force withdrawal", leadsTo: [2, 1], consequence: "Defunding creates negotiation pressure on Trump; forces ceasefire timeline" },
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
    { scenario: "Stalemate", military: 8, economic: 7, diplomatic: 6, humanitarian: 8, regional: 8, global: 7 },
    { scenario: "Ceasefire", military: 5, economic: 6, diplomatic: 7, humanitarian: 5, regional: 5, global: 5 },
    { scenario: "Collapse", military: 9, economic: 8, diplomatic: 8, humanitarian: 10, regional: 10, global: 8 },
    { scenario: "Escalation", military: 10, economic: 10, diplomatic: 9, humanitarian: 9, regional: 10, global: 10 },
    { scenario: "Nuclear", military: 10, economic: 10, diplomatic: 10, humanitarian: 10, regional: 10, global: 10 },
  ],

  oilPriceData: [
    { month: "Oct '25", price: 72 },
    { month: "Nov '25", price: 68 },
    { month: "Dec '25", price: 75 },
    { month: "Jan '26", price: 82 },
    { month: "Feb '26", price: 94 },
    { month: "Mar 1", price: 112 },
    { month: "Mar 8", price: 126 },
    { month: "Mar 15", price: 118 },
    { month: "Mar 22", price: 108 },
  ],
}

// ─── STRATEGIC VERDICT ────────────────────────────────────────────────────────
const strategicVerdict = {
  stance: 'MONITOR — HOLD POSITIONS',
  stanceColor: '#f59e0b',
  primaryScenario: 'Prolonged Stalemate',
  primaryProb: 35,
  timing: 'Re-assess in 48–72 hours',
  timingDetail: 'The war has entered a grinding attrition phase at Day 22. The next 48–72 hours are decisive: Trump is expected to make a public statement on the war trajectory, Congress will begin debate on the $200B war funding request, and Brent crude movement will signal whether the Escalation scenario (15%) is rising. Do not change strategic positioning until at least one of these three signals resolves.',
  immediateWatchpoints: [
    { signal: 'Trump press statement on Iran war trajectory', timing: '24–48h', implication: 'Ceasefire signal → oil drops $15–20, risk-on; Escalation → oil > $125, risk-off globally', urgency: 'Critical' },
    { signal: 'Congressional vote — $200B war funding', timing: '7–14 days', implication: 'Defeat forces de-escalation/negotiation (raises Ceasefire prob to 35%+); Passage = Stalemate entrenches', urgency: 'High' },
    { signal: 'Brent crude sustained above $115/bbl', timing: 'Ongoing', implication: 'Signals Escalation scenario rising; revise probability from 15% → 20–25%', urgency: 'High' },
    { signal: 'Oman/Qatar diplomatic shuttle resumes', timing: 'Watch', implication: 'Ceasefire probability jumps; adjust all financial market positioning immediately', urgency: 'High' },
    { signal: 'Houthis mass strike on Saudi Aramco', timing: 'Unknown', implication: 'Triggers Regional Conflagration — most catastrophic market event', urgency: 'Critical (tail)' },
  ],
  marketPositioning: [
    { asset: 'Long Oil (futures/ETF)', stance: 'HOLD', color: '#f59e0b', rationale: 'Stalemate keeps Brent $90–115. Do not add. Set stop if ceasefire signals emerge.' },
    { asset: 'Long Gold', stance: 'HOLD', color: '#f59e0b', rationale: 'Geopolitical safe-haven premium persists. Add on dips if Congressional vote uncertain.' },
    { asset: 'Long Defense (RTX, LMT, BAESY)', stance: 'REDUCE', color: '#ef4444', rationale: 'Most upside already priced. Take profits on 30–40% of position.' },
    { asset: 'Peripheral EU Equities (Greek banks, etc.)', stance: 'CAUTIOUS', color: '#ef4444', rationale: 'Sovereign spread widening risk. Wait for war signal to resolve before adding.' },
    { asset: 'Long USD', stance: 'HOLD', color: '#f59e0b', rationale: 'Safe-haven flows continue. Could unwind sharply on ceasefire — hedge accordingly.' },
    { asset: 'Short Airlines / Tourism', stance: 'REDUCE', color: '#f59e0b', rationale: 'Travel disruption largely priced; upside limited. Cover shorts partially.' },
  ],
  probabilityUpdate: 'No change from base case. Stalemate 35% / Ceasefire 25% / Collapse 20% / Escalation 15% / Nuclear 5%. Next update trigger: Trump statement OR Congressional vote.',
  conviction: 'Medium',
  nextReview: '48–72 hours or on any watchpoint signal',
}

// ─── ANALYSIS GAPS ────────────────────────────────────────────────────────────
const analysisGaps = [
  {
    topic: 'Turkey\'s Strategic Role & NATO Implications',
    description: 'Turkey holds a unique position — NATO member, regional power, historically mediates Iran conflicts. Not covered in this analysis.',
    issueTitle: 'Extend US-Iran War analysis: Turkey\'s strategic role — NATO implications, Erdogan\'s mediation position, Bosporus strait dynamics',
  },
  {
    topic: 'Russia & China: Strategic Support & Limits',
    description: 'Both provide diplomatic cover but what are their actual limits? Would either intervene militarily if Iran faces collapse?',
    issueTitle: 'Extend US-Iran War analysis: Russia and China\'s strategic interests — what support will they actually provide Iran and where do they draw the line?',
  },
  {
    topic: 'Iran Post-Khamenei Succession Crisis',
    description: 'With Khamenei killed in the opening strikes, Iran\'s succession dynamics are unanalyzed. Who fills the power vacuum?',
    issueTitle: 'Extend US-Iran War analysis: Iran post-Khamenei succession — power vacuum dynamics, IRGC factions, Assembly of Experts, legitimacy crisis',
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
    description: 'Iraq\'s 100,000 PMF fighters are acting semi-autonomously. The risk of Iraq becoming a second theater is underweighted.',
    issueTitle: 'Extend US-Iran War analysis: Iraq stability — PMF autonomous escalation, US base casualties, Iraqi government position, second-theater risk',
  },
]

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const sustainabilityConfig = {
  fully_sustainable: { label: "Fully Sustainable", color: "#10b981", bg: "rgba(16,185,129,0.15)" },
  sustainable_short_term: { label: "Short-Term Only (6–18mo)", color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
  barely_feasible: { label: "Barely Feasible", color: "#ef4444", bg: "rgba(239,68,68,0.15)" },
  not_feasible: { label: "Not Feasible", color: "#dc2626", bg: "rgba(220,38,38,0.15)" },
}

const statusConfig = {
  observed: { label: "OBSERVED", color: "#ef4444", dot: "#ef4444" },
  emerging: { label: "EMERGING", color: "#f59e0b", dot: "#f59e0b" },
  not_observed: { label: "NOT YET", color: "#64748b", dot: "#334155" },
}

const impactColor = (score) => {
  if (score >= 9) return "#dc2626"
  if (score >= 7) return "#ef4444"
  if (score >= 5) return "#f59e0b"
  if (score >= 3) return "#10b981"
  return "#06b6d4"
}

const s = {
  page: { minHeight: '100vh', backgroundColor: '#0a0f1e', color: '#f8fafc', fontFamily: 'system-ui, sans-serif', padding: '1.5rem' },
  container: { maxWidth: '1400px', margin: '0 auto' },
  panel: { backgroundColor: '#111827', border: '1px solid #1e293b', borderRadius: '8px', padding: '1.25rem', marginBottom: '1rem' },
  panelTitle: { fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#06b6d4', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' },
  mono: { fontFamily: 'monospace' },
  tag: (color) => ({ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color, border: `1px solid ${color}`, borderRadius: '3px', padding: '2px 6px', display: 'inline-block' }),
  muted: { color: '#94a3b8', fontSize: '0.8rem' },
  dim: { color: '#64748b', fontSize: '0.75rem' },
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function ScoreBar({ score, max = 10 }) {
  const pct = (score / max) * 100
  const color = impactColor(score)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ flex: 1, height: '4px', backgroundColor: '#1e293b', borderRadius: '2px' }}>
        <div style={{ width: `${pct}%`, height: '100%', backgroundColor: color, borderRadius: '2px' }} />
      </div>
      <span style={{ ...s.mono, fontSize: '0.75rem', color, minWidth: '1.5rem', textAlign: 'right' }}>{score}</span>
    </div>
  )
}

function ProbGauge({ probability, color }) {
  const r = 30, cx = 40, cy = 40
  const circumference = 2 * Math.PI * r
  const arc = (probability / 100) * circumference
  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e293b" strokeWidth="7" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="7"
        strokeDasharray={`${arc} ${circumference}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`} />
      <text x={cx} y={cy + 5} textAnchor="middle" fill={color} fontSize="14" fontWeight="700" fontFamily="monospace">
        {probability}%
      </text>
    </svg>
  )
}

function FeasibilityRow({ dim, data }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
      <span style={{ ...s.dim, minWidth: '90px' }}>{dim}</span>
      <ScoreBar score={data.score} />
      <span style={{ ...s.dim, fontSize: '0.7rem', flex: 2 }}>{data.detail}</span>
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function UsIranWar20260322() {
  const [activeScenario, setActiveScenario] = useState(0)
  const [activeTab, setActiveTab] = useState('verdict')
  const d = analysisData
  const scenario = d.scenarios[activeScenario]

  const tabs = [
    { id: 'verdict', label: 'Verdict', icon: Zap, highlight: true },
    { id: 'overview', label: 'Situation', icon: Globe2 },
    { id: 'scenarios', label: 'Scenarios', icon: Target },
    { id: 'feasibility', label: 'Feasibility', icon: Shield },
    { id: 'impact', label: 'Impact', icon: Activity },
    { id: 'indicators', label: 'Indicators', icon: Eye },
    { id: 'experts', label: 'Expert Views', icon: Users },
    { id: 'decisions', label: 'Decision Tree', icon: Crosshair },
  ]

  const radarData = ['Military', 'Economic', 'Diplomatic', 'Humanitarian', 'Regional', 'Global'].map(dim => ({
    subject: dim,
    value: scenario.impacts[dim.toLowerCase()],
    fullMark: 10,
  }))

  return (
    <div style={s.page}>
      <div style={s.container}>

        {/* ── HEADER ── */}
        <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #1e293b', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                <span style={s.tag('#ef4444')}>ACTIVE CONFLICT</span>
                <span style={s.tag('#f59e0b')}>OPEN SOURCE</span>
                <span style={s.tag('#8b5cf6')}>GEOPOLITICAL</span>
              </div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 0.2rem', letterSpacing: '-0.02em' }}>
                {d.title}
              </h1>
              <p style={{ ...s.muted, margin: 0 }}>{d.subtitle} · Analysis Date: {d.date}</p>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <Link to="/" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                  color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600,
                  textDecoration: 'none', padding: '0.3rem 0.7rem',
                  border: '1px solid #1e293b', borderRadius: '6px',
                  backgroundColor: '#0a0f1e', transition: 'all 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#06b6d4'; e.currentTarget.style.color = '#06b6d4' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e293b'; e.currentTarget.style.color = '#94a3b8' }}
                >
                  <Home size={12} /> Home
                </Link>
                <Link to="/help" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                  color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600,
                  textDecoration: 'none', padding: '0.3rem 0.7rem',
                  border: '1px solid #1e293b', borderRadius: '6px',
                  backgroundColor: '#0a0f1e', transition: 'all 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#06b6d4'; e.currentTarget.style.color = '#06b6d4' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e293b'; e.currentTarget.style.color = '#94a3b8' }}
                >
                  <BookOpen size={12} /> Glossary
                </Link>
              </div>
              <div style={{ ...s.mono, fontSize: '2rem', fontWeight: 800, color: '#ef4444' }}>DAY {d.daysElapsed}</div>
              <div style={{ ...s.dim }}>War began {d.warStartDate}</div>
              <div style={{ ...s.dim }}>Confidence: <span style={{ color: '#f59e0b' }}>{d.overallConfidence}</span></div>
            </div>
          </div>
        </div>

        {/* ── KEY METRICS STRIP ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
          {d.situation.keyMetrics.map((m) => (
            <div key={m.label} style={{ ...s.panel, padding: '0.85rem', marginBottom: 0 }}>
              <div style={{ ...s.dim, marginBottom: '0.2rem' }}>{m.label}</div>
              <div style={{ ...s.mono, fontSize: '1.1rem', fontWeight: 700, color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* ── TABS ── */}
        <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem', borderBottom: '1px solid #1e293b', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
          {tabs.map(({ id, label, icon: Icon, highlight }) => (
            <button key={id} onClick={() => setActiveTab(id)} style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.4rem 0.85rem', borderRadius: '6px', border: 'none', cursor: 'pointer',
              fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.03em',
              backgroundColor: activeTab === id ? '#06b6d4' : highlight && activeTab !== id ? 'rgba(245,158,11,0.12)' : 'transparent',
              color: activeTab === id ? '#0a0f1e' : highlight && activeTab !== id ? '#f59e0b' : '#94a3b8',
              border: highlight && activeTab !== id ? '1px solid rgba(245,158,11,0.4)' : '1px solid transparent',
              transition: 'all 0.15s'
            }}>
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: STRATEGIC VERDICT                                             */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'verdict' && (
          <div>
            {/* Stance banner */}
            <div style={{ ...s.panel, border: `2px solid ${strategicVerdict.stanceColor}66`, background: 'rgba(245,158,11,0.06)', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
                    <div style={{
                      padding: '0.3rem 1rem', borderRadius: '6px',
                      background: `${strategicVerdict.stanceColor}22`, border: `2px solid ${strategicVerdict.stanceColor}`,
                      color: strategicVerdict.stanceColor, fontWeight: 800, fontSize: '1rem', letterSpacing: '0.05em',
                    }}>{strategicVerdict.stance}</div>
                    <span style={{ color: '#f8fafc', fontWeight: 700 }}>{strategicVerdict.timing}</span>
                    <span style={{ ...s.tag('#94a3b8') }}>Conviction: {strategicVerdict.conviction}</span>
                  </div>
                  <p style={{ ...s.muted, lineHeight: 1.65, margin: 0, maxWidth: 780, fontSize: '0.875rem' }}>{strategicVerdict.timingDetail}</p>
                </div>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ ...s.dim, marginBottom: 2 }}>Primary Scenario</div>
                  <div style={{ color: '#f59e0b', fontWeight: 800, fontFamily: 'monospace', fontSize: '1.1rem' }}>{strategicVerdict.primaryProb}%</div>
                  <div style={{ ...s.dim }}>{strategicVerdict.primaryScenario}</div>
                </div>
              </div>
            </div>

            <div style={s.grid2}>
              {/* Immediate watchpoints */}
              <div style={s.panel}>
                <div style={s.panelTitle}><Eye size={13} /> Immediate Watchpoints (Act On These)</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  {strategicVerdict.immediateWatchpoints.map((w, i) => {
                    const urgencyColor = w.urgency === 'Critical' || w.urgency === 'Critical (tail)' ? '#ef4444' : '#f59e0b'
                    return (
                      <div key={i} style={{ backgroundColor: '#0a0f1e', borderRadius: '6px', padding: '0.75rem', border: `1px solid ${urgencyColor}33` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', gap: '0.5rem' }}>
                          <span style={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.82rem' }}>{w.signal}</span>
                          <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                            <span style={{ ...s.tag(urgencyColor) }}>{w.urgency}</span>
                            <span style={{ ...s.dim, fontSize: '0.7rem' }}>{w.timing}</span>
                          </div>
                        </div>
                        <div style={{ ...s.muted, fontSize: '0.77rem', lineHeight: 1.5 }}>{w.implication}</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Market positioning */}
              <div style={s.panel}>
                <div style={s.panelTitle}><Activity size={13} /> Market Positioning Guide</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {strategicVerdict.marketPositioning.map((p, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', backgroundColor: '#0a0f1e', borderRadius: '6px', border: '1px solid #1e293b' }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.82rem' }}>{p.asset}</span>
                        <div style={{ ...s.dim, fontSize: '0.72rem', marginTop: 2 }}>{p.rationale}</div>
                      </div>
                      <span style={{ ...s.tag(p.color), flexShrink: 0 }}>{p.stance}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#0a0f1e', borderRadius: '6px', border: '1px solid #1e293b' }}>
                  <div style={{ ...s.panelTitle, marginBottom: '0.4rem' }}><Radio size={12} /> Probability Update</div>
                  <p style={{ ...s.dim, fontSize: '0.75rem', margin: 0, lineHeight: 1.5 }}>{strategicVerdict.probabilityUpdate}</p>
                  <div style={{ ...s.dim, fontSize: '0.72rem', marginTop: '0.4rem' }}>
                    Next review trigger: <span style={{ color: '#f59e0b' }}>{strategicVerdict.nextReview}</span>
                  </div>
                </div>
              </div>
            </div>

            <AddToAnalysis
              analysisTitle="US–Iran War: Operation Epic Fury"
              analysisType="geopolitical"
              gaps={analysisGaps}
            />
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: SITUATION OVERVIEW                                            */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <div>
            <div style={s.grid2}>
              {/* Context */}
              <div style={s.panel}>
                <div style={s.panelTitle}><Globe2 size={13} /> Situation Context</div>
                <p style={{ ...s.muted, lineHeight: 1.65, margin: 0 }}>{d.situation.context}</p>
              </div>

              {/* Oil Price Chart */}
              <div style={s.panel}>
                <div style={s.panelTitle}><TrendingDown size={13} /> Brent Crude — War Impact ($/bbl)</div>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={d.oilPriceData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 10 }} domain={[60, 135]} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1e293b', borderRadius: '6px' }} labelStyle={{ color: '#94a3b8' }} itemStyle={{ color: '#06b6d4' }} />
                    <Line type="monotone" dataKey="price" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4', r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                  <span style={s.dim}>War began Feb 28 →</span>
                  <span style={{ ...s.mono, color: '#ef4444', fontSize: '0.8rem' }}>Peak: $126</span>
                </div>
              </div>
            </div>

            {/* Triggers */}
            <div style={s.panel}>
              <div style={s.panelTitle}><Zap size={13} /> Key Triggers & Escalation Ladder</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.6rem' }}>
                {d.situation.triggers.map((t, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                    <span style={{ ...s.mono, color: '#ef4444', fontSize: '0.8rem', minWidth: '1.2rem' }}>{String(i + 1).padStart(2, '0')}</span>
                    <span style={{ ...s.muted, fontSize: '0.8rem', lineHeight: 1.5 }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actors */}
            <div style={s.panel}>
              <div style={s.panelTitle}><Users size={13} /> Key Actors & Power Index</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                {d.situation.actors.map((a) => (
                  <div key={a.name} style={{ backgroundColor: '#0a0f1e', borderRadius: '6px', padding: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#f8fafc' }}>{a.name}</span>
                      <span style={{ ...s.mono, fontSize: '0.75rem', color: '#06b6d4' }}>{a.power}</span>
                    </div>
                    <div style={s.dim}>{a.role}</div>
                    <div style={{ ...s.muted, fontSize: '0.78rem', marginTop: '0.2rem', lineHeight: 1.4 }}>{a.stance}</div>
                    <div style={{ marginTop: '0.4rem', height: '3px', backgroundColor: '#1e293b', borderRadius: '2px' }}>
                      <div style={{ width: `${a.power}%`, height: '100%', backgroundColor: '#06b6d4', borderRadius: '2px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: SCENARIOS                                                     */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'scenarios' && (
          <div>
            {/* Scenario Selector */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {d.scenarios.map((sc, i) => (
                <button key={sc.id} onClick={() => setActiveScenario(i)} style={{
                  padding: '0.5rem 1rem', borderRadius: '6px', border: `1px solid ${activeScenario === i ? sc.color : '#1e293b'}`,
                  backgroundColor: activeScenario === i ? `${sc.color}22` : 'transparent',
                  color: activeScenario === i ? sc.color : '#94a3b8',
                  cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.15s'
                }}>
                  {sc.name} <span style={{ opacity: 0.7 }}>({sc.probability}%)</span>
                </button>
              ))}
            </div>

            {/* Probability Bar */}
            <div style={{ ...s.panel, marginBottom: '1rem' }}>
              <div style={s.panelTitle}><Activity size={13} /> Scenario Probability Distribution</div>
              <div style={{ display: 'flex', height: '28px', borderRadius: '4px', overflow: 'hidden', gap: '2px' }}>
                {d.scenarios.map((sc) => (
                  <div key={sc.id} style={{
                    width: `${sc.probability}%`, backgroundColor: sc.color, opacity: 0.85,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.65rem', fontWeight: 700, color: '#0a0f1e', transition: 'opacity 0.2s',
                    cursor: 'pointer', minWidth: sc.probability > 8 ? 'auto' : 0
                  }} onClick={() => setActiveScenario(d.scenarios.indexOf(sc))}>
                    {sc.probability > 8 ? `${sc.probability}%` : ''}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                {d.scenarios.map((sc) => (
                  <div key={sc.id} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: sc.color }} />
                    <span style={s.dim}>{sc.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Scenario Detail */}
            <div style={s.grid2}>
              <div style={s.panel}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ ...s.tag(scenario.color), marginBottom: '0.4rem' }}>{scenario.tagline}</div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: scenario.color, margin: 0 }}>{scenario.name}</h2>
                  </div>
                  <ProbGauge probability={scenario.probability} color={scenario.color} />
                </div>
                <p style={{ ...s.muted, lineHeight: 1.65, fontSize: '0.85rem', marginBottom: '0.75rem' }}>{scenario.description}</p>
                <p style={{ ...s.dim, lineHeight: 1.6, fontSize: '0.78rem', margin: 0 }}>{scenario.narrative}</p>
              </div>

              <div style={s.panel}>
                <div style={s.panelTitle}><Clock size={13} /> Time Horizons</div>
                {[
                  { label: '0–6 Months', content: scenario.timeHorizons.shortTerm, color: '#ef4444' },
                  { label: '6–24 Months', content: scenario.timeHorizons.mediumTerm, color: '#f59e0b' },
                  { label: '2–10 Years', content: scenario.timeHorizons.longTerm, color: '#10b981' },
                ].map((h) => (
                  <div key={h.label} style={{ marginBottom: '0.85rem', paddingLeft: '0.75rem', borderLeft: `2px solid ${h.color}` }}>
                    <div style={{ ...s.tag(h.color), marginBottom: '0.3rem' }}>{h.label}</div>
                    <p style={{ ...s.muted, fontSize: '0.8rem', margin: 0, lineHeight: 1.55 }}>{h.content}</p>
                  </div>
                ))}

                {/* Mini Impact Chart */}
                <div style={s.panelTitle}><Activity size={13} /> Impact Radar</div>
                <ResponsiveContainer width="100%" height={180}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#1e293b" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: '#1e293b', fontSize: 8 }} />
                    <Radar name="Impact" dataKey="value" stroke={scenario.color} fill={scenario.color} fillOpacity={0.2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: FEASIBILITY                                                   */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'feasibility' && (
          <div>
            {/* Scenario Selector */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {d.scenarios.map((sc, i) => (
                <button key={sc.id} onClick={() => setActiveScenario(i)} style={{
                  padding: '0.4rem 0.85rem', borderRadius: '6px', border: `1px solid ${activeScenario === i ? sc.color : '#1e293b'}`,
                  backgroundColor: activeScenario === i ? `${sc.color}22` : 'transparent',
                  color: activeScenario === i ? sc.color : '#94a3b8',
                  cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600
                }}>
                  {sc.name}
                </button>
              ))}
            </div>

            {scenario.feasibility.map((f, fi) => {
              const sust = sustainabilityConfig[f.overallSustainability]
              return (
                <div key={fi} style={s.panel}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={s.panelTitle}><Shield size={13} /> Feasibility Assessment #{fi + 1}</div>
                      <h3 style={{ color: '#f8fafc', fontSize: '1rem', fontWeight: 700, margin: '0 0 0.25rem' }}>{f.action}</h3>
                      <span style={s.dim}>Actor: <span style={{ color: '#94a3b8' }}>{f.actor}</span></span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ ...sust, padding: '4px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', display: 'inline-block' }}>
                        {sust.label}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
                    <FeasibilityRow dim="Military" data={f.militaryFeasibility} />
                    <FeasibilityRow dim="Economic" data={f.economicCapacity} />
                    <FeasibilityRow dim="Political Will" data={f.politicalWill} />
                    <FeasibilityRow dim="Alliance" data={f.allianceSupport} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '6px', padding: '0.75rem' }}>
                      <div style={{ ...s.dim, marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <AlertTriangle size={11} color="#ef4444" /> DEALBREAKER
                      </div>
                      <p style={{ ...s.muted, fontSize: '0.8rem', margin: 0, lineHeight: 1.5 }}>{f.dealbreaker}</p>
                    </div>
                    <div style={{ backgroundColor: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: '6px', padding: '0.75rem' }}>
                      <div style={{ ...s.dim, marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <DollarSign size={11} color="#06b6d4" /> ESTIMATED COST
                      </div>
                      <p style={{ ...s.mono, fontSize: '0.85rem', color: '#06b6d4', margin: 0 }}>{f.estimatedCost}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: IMPACT HEATMAP                                                */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'impact' && (
          <div>
            <div style={s.panel}>
              <div style={s.panelTitle}><Activity size={13} /> Impact Heatmap — All Scenarios</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', color: '#64748b', fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '1px solid #1e293b' }}>Scenario</th>
                      {['Military', 'Economic', 'Diplomatic', 'Humanitarian', 'Regional', 'Global'].map(dim => (
                        <th key={dim} style={{ padding: '0.5rem', color: '#64748b', fontWeight: 600, fontSize: '0.65rem', letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: '1px solid #1e293b', textAlign: 'center', minWidth: '85px' }}>{dim}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {d.scenarios.map((sc) => (
                      <tr key={sc.id} style={{ borderBottom: '1px solid #0f172a' }}>
                        <td style={{ padding: '0.6rem 0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: sc.color }} />
                            <span style={{ color: '#f8fafc', fontWeight: 600 }}>{sc.name}</span>
                            <span style={{ ...s.mono, color: sc.color, fontSize: '0.7rem' }}>{sc.probability}%</span>
                          </div>
                        </td>
                        {['military', 'economic', 'diplomatic', 'humanitarian', 'regional', 'global'].map(dim => {
                          const val = sc.impacts[dim]
                          const bg = impactColor(val)
                          return (
                            <td key={dim} style={{ padding: '0.5rem', textAlign: 'center' }}>
                              <div style={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                width: '36px', height: '36px', borderRadius: '6px',
                                backgroundColor: `${bg}22`, border: `1px solid ${bg}44`,
                                ...s.mono, fontSize: '0.9rem', fontWeight: 800, color: bg
                              }}>
                                {val}
                              </div>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                {[
                  { label: '9–10 Catastrophic', color: '#dc2626' },
                  { label: '7–8 Severe', color: '#ef4444' },
                  { label: '5–6 Significant', color: '#f59e0b' },
                  { label: '3–4 Moderate', color: '#10b981' },
                ].map(({ label, color }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: color }} />
                    <span style={s.dim}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Radar Comparison — all 6 dimensions, all 5 scenarios */}
            <div style={s.panel}>
              <div style={s.panelTitle}><Activity size={13} /> Impact Profile — Scenario Radar Comparison (All 6 Dimensions)</div>
              <ResponsiveContainer width="100%" height={340}>
                <RadarChart
                  data={['Military', 'Economic', 'Diplomatic', 'Humanitarian', 'Regional', 'Global'].map(dim => {
                    const entry = { dimension: dim }
                    d.scenarios.forEach(sc => { entry[sc.name] = sc.impacts[dim.toLowerCase()] })
                    return entry
                  })}
                  margin={{ top: 10, right: 30, left: 30, bottom: 10 }}
                >
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="dimension" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <PolarRadiusAxis domain={[0, 10]} tick={{ fill: '#64748b', fontSize: 8 }} tickCount={6} />
                  {d.scenarios.map(sc => (
                    <Radar key={sc.id} name={sc.name} dataKey={sc.name} stroke={sc.color} fill={sc.color} fillOpacity={0.07} strokeWidth={2} />
                  ))}
                  <Legend wrapperStyle={{ fontSize: '0.72rem', paddingTop: '0.5rem' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1e293b', borderRadius: '6px' }} labelStyle={{ color: '#94a3b8' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Per-dimension bar chart */}
            <div style={s.panel}>
              <div style={s.panelTitle}><BarChart3 size={13} /> Impact by Dimension — Scenario Comparison</div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={['Military', 'Economic', 'Diplomatic', 'Humanitarian', 'Regional', 'Global'].map(dim => {
                    const entry = { dimension: dim }
                    d.scenarios.forEach(sc => { entry[sc.name] = sc.impacts[dim.toLowerCase()] })
                    return entry
                  })}
                  margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="dimension" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <YAxis domain={[0, 10]} tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1e293b', borderRadius: '6px' }} labelStyle={{ color: '#94a3b8' }} />
                  <Legend wrapperStyle={{ fontSize: '0.7rem', paddingTop: '0.5rem' }} />
                  {d.scenarios.map(sc => (
                    <Bar key={sc.id} dataKey={sc.name} fill={sc.color} opacity={0.85} radius={[2, 2, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: INDICATORS                                                    */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'indicators' && (
          <div>
            {/* Scenario Selector */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {d.scenarios.map((sc, i) => (
                <button key={sc.id} onClick={() => setActiveScenario(i)} style={{
                  padding: '0.4rem 0.85rem', borderRadius: '6px', border: `1px solid ${activeScenario === i ? sc.color : '#1e293b'}`,
                  backgroundColor: activeScenario === i ? `${sc.color}22` : 'transparent',
                  color: activeScenario === i ? sc.color : '#94a3b8',
                  cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600
                }}>
                  {sc.name}
                </button>
              ))}
            </div>

            <div style={s.panel}>
              <div style={s.panelTitle}><Eye size={13} /> Signpost Indicators — {scenario.name}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {scenario.indicators.map((ind, i) => {
                  const cfg = statusConfig[ind.status]
                  return (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      backgroundColor: '#0a0f1e', borderRadius: '6px', padding: '0.75rem 1rem',
                      border: `1px solid ${ind.status === 'not_observed' ? '#1e293b' : cfg.dot + '44'}`
                    }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: cfg.dot, flexShrink: 0 }} />
                      <span style={{ flex: 1, color: ind.status === 'not_observed' ? '#64748b' : '#f8fafc', fontSize: '0.875rem', lineHeight: 1.5 }}>{ind.signal}</span>
                      <span style={{ ...s.tag(cfg.color) }}>{cfg.label}</span>
                    </div>
                  )
                })}
              </div>

              {/* Summary */}
              <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#0a0f1e', borderRadius: '6px' }}>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  {(['observed', 'emerging', 'not_observed']).map(status => {
                    const count = scenario.indicators.filter(i => i.status === status).length
                    const cfg = statusConfig[status]
                    return (
                      <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: cfg.dot }} />
                        <span style={s.dim}>{cfg.label}: </span>
                        <span style={{ ...s.mono, color: cfg.color, fontWeight: 700 }}>{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* All indicators across scenarios */}
            <div style={s.panel}>
              <div style={s.panelTitle}><Radio size={13} /> All Active Signals (Observed + Emerging)</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {d.scenarios.flatMap(sc =>
                  sc.indicators
                    .filter(ind => ind.status !== 'not_observed')
                    .map((ind, i) => ({ ...ind, scenario: sc.name, color: sc.color, key: `${sc.id}-${i}` }))
                ).map(ind => {
                  const cfg = statusConfig[ind.status]
                  return (
                    <div key={ind.key} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', backgroundColor: '#0a0f1e', borderRadius: '4px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: cfg.dot, flexShrink: 0 }} />
                      <span style={{ ...s.tag(ind.color), flexShrink: 0 }}>{ind.scenario}</span>
                      <span style={{ flex: 1, color: '#94a3b8', fontSize: '0.8rem' }}>{ind.signal}</span>
                      <span style={s.tag(cfg.color)}>{cfg.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: EXPERT VIEWS                                                  */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'experts' && (
          <div>
            {/* Consensus */}
            <div style={s.panel}>
              <div style={s.panelTitle}><BookOpen size={13} /> Expert Consensus View</div>
              <p style={{ ...s.muted, lineHeight: 1.7, fontSize: '0.875rem', marginBottom: '0.75rem' }}>{d.expertOpinions.consensus.summary}</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {d.expertOpinions.consensus.supporters.map(org => (
                  <span key={org} style={{ ...s.tag('#10b981') }}>{org}</span>
                ))}
              </div>
              <div style={{ marginTop: '0.5rem', ...s.dim }}>
                Expert Confidence: <span style={{ color: '#f59e0b' }}>{d.expertOpinions.overallExpertConfidence}</span>
              </div>
            </div>

            {/* Dissenting Views */}
            <div style={s.panel}>
              <div style={s.panelTitle}><AlertTriangle size={13} /> Dissenting Views</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {d.expertOpinions.dissenting.map((dv, i) => (
                  <div key={i} style={{ backgroundColor: '#0a0f1e', borderRadius: '6px', padding: '0.85rem', border: '1px solid #1e293b' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.3rem' }}>
                      <div>
                        <span style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.875rem' }}>{dv.expert}</span>
                        <span style={{ ...s.dim, marginLeft: '0.5rem' }}>· {dv.affiliation}</span>
                      </div>
                    </div>
                    <p style={{ color: '#06b6d4', fontSize: '0.82rem', fontWeight: 600, margin: '0 0 0.4rem', lineHeight: 1.4 }}>{dv.position}</p>
                    <p style={{ ...s.muted, fontSize: '0.8rem', margin: '0 0 0.4rem', lineHeight: 1.5 }}>Reasoning: {dv.reasoning}</p>
                    <p style={{ ...s.dim, fontSize: '0.75rem', margin: 0, fontStyle: 'italic' }}>Assessment: {dv.credibilityNote}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Regional vs Western */}
            <div style={s.grid2}>
              <div style={s.panel}>
                <div style={s.panelTitle}><Globe2 size={13} /> Western View</div>
                <p style={{ ...s.muted, lineHeight: 1.65, fontSize: '0.85rem', margin: 0 }}>{d.expertOpinions.regionalVsWestern.westernView}</p>
              </div>
              <div style={s.panel}>
                <div style={s.panelTitle}><Flag size={13} /> Regional View</div>
                <p style={{ ...s.muted, lineHeight: 1.65, fontSize: '0.85rem', margin: 0 }}>{d.expertOpinions.regionalVsWestern.regionalView}</p>
              </div>
            </div>
            <div style={s.panel}>
              <div style={s.panelTitle}><ArrowRight size={13} /> Gap Analysis</div>
              <p style={{ ...s.muted, lineHeight: 1.65, fontSize: '0.85rem', margin: 0 }}>{d.expertOpinions.regionalVsWestern.gapAnalysis}</p>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: DECISION TREE                                                 */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'decisions' && (
          <div>
            <div style={s.panel}>
              <div style={s.panelTitle}><Crosshair size={13} /> Key Decision Points — War Trajectory</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {d.decisionPoints.map((dp, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '1rem', alignItems: 'start', backgroundColor: '#0a0f1e', borderRadius: '6px', padding: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#1e293b', border: '2px solid #06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', ...s.mono, fontSize: '0.8rem', color: '#06b6d4', fontWeight: 700 }}>
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      {i < d.decisionPoints.length - 1 && (
                        <div style={{ width: '2px', height: '40px', backgroundColor: '#1e293b' }} />
                      )}
                    </div>
                    <div>
                      <div style={{ ...s.tag('#f59e0b'), marginBottom: '0.3rem' }}>{dp.actor}</div>
                      <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.9rem', marginBottom: '0.3rem' }}>{dp.decision}</div>
                      <div style={{ ...s.muted, fontSize: '0.78rem', lineHeight: 1.5 }}>{dp.consequence}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      {dp.leadsTo.map(sid => {
                        const sc = d.scenarios.find(s => s.id === sid)
                        return (
                          <span key={sid} style={{ ...s.tag(sc.color), fontSize: '0.6rem', whiteSpace: 'nowrap' }}>→ {sc.name}</span>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scenario Probability Chart */}
            <div style={s.panel}>
              <div style={s.panelTitle}><Target size={13} /> Scenario Probability — Current Assessment</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={d.scenarios.map(sc => ({ name: sc.name, probability: sc.probability, color: sc.color }))} margin={{ top: 5, right: 20, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} unit="%" domain={[0, 45]} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1e293b', borderRadius: '6px' }} labelStyle={{ color: '#94a3b8' }} formatter={(v) => [`${v}%`, 'Probability']} />
                  <Bar dataKey="probability" radius={[4, 4, 0, 0]}>
                    {d.scenarios.map((sc) => (
                      <Cell key={sc.id} fill={sc.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── FOOTER ── */}
        <div style={{ marginTop: '2rem', padding: '1rem', borderTop: '1px solid #1e293b', ...s.dim, textAlign: 'center', lineHeight: 1.6 }}>
          Analysis date: {d.date} · War Day {d.daysElapsed} · Sources: RAND, Brookings, CFR, IISS, ICG, Atlantic Council, Arms Control Association, Oman Foreign Ministry, US Congressional Record, UK House of Commons Library, Britannica, Wikipedia (2026 Iran War), Al Jazeera, NPR, CNBC, Democracy Now, Times of Israel, Iran International, Military.com, CSIS
          <br />
          <span style={{ color: '#475569' }}>Open source analysis only. All probabilities represent analytical estimates subject to significant uncertainty. Not for policy use without independent verification.</span>
        </div>

      </div>
    </div>
  )
}
