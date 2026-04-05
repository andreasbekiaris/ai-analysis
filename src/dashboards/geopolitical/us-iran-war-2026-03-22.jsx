import GeoDashboard from '../../components/GeoDashboard'

// ─── ANALYSIS DATA ────────────────────────────────────────────────────────────
const analysisData = {
  title: "US–Iran War: Operation Epic Fury",
  subtitle: "Trajectory & Outcome Analysis — April 6 Deadline Inflection",
  date: "2026-04-05",
  warStartDate: "2026-02-28",
  daysElapsed: 37,
  overallConfidence: "Medium",
  classification: "OPEN SOURCE ANALYSIS",

  situation: {
    actors: [
      { name: "United States",        role: "Primary belligerent",       stance: "Offensive — infrastructure escalation imminent (April 6 deadline)",     power: 95 },
      { name: "Israel",               role: "Co-belligerent",            stance: "Ground offensive in Lebanon; coordinated Iran strikes",                  power: 72 },
      { name: "Iran (Mojtaba Khamenei)", role: "Defender / new leadership", stance: "Defiant — rejected US 15-point plan; issued 5 counter-conditions",    power: 45 },
      { name: "Hezbollah",            role: "Iran proxy — active front",  stance: "1,045 attack waves since March 2; 150 rockets during Passover",        power: 35 },
      { name: "Houthis (Yemen)",      role: "Iran proxy — escalating",    stance: "Launched 2 ballistic missile attacks on Israel (April 1-2); entering war", power: 32 },
      { name: "Iraqi Militias (PMF)", role: "Iran proxy — active",        stance: "Striking US bases; semi-autonomous operations continue",                power: 25 },
      { name: "Gulf States",          role: "Under direct attack",        stance: "Kuwait refineries hit; UAE installations struck; hosting US assets",    power: 40 },
    ],
    context: "Day 37 of Operation Epic Fury. The war has entered its most critical phase. Trump issued a 48-hour ultimatum on April 4 demanding Iran reopen the Strait of Hormuz by April 6 or face strikes on power plants and bridges. Iran's military rejected the demand, calling it 'desperate and foolish.' Mojtaba Khamenei (son of slain Ali Khamenei) was elected Supreme Leader on March 9 and has vowed to fight. Iran's military has been severely degraded — missile launches down 90%, navy 92% destroyed — but proxy network remains intact and is escalating. On April 3, Iran shot down a US F-15E and A-10 — the first US aircraft lost to enemy fire in 20+ years. Both crews were rescued in dramatic operations. Iran has struck Kuwait's Mina Al-Ahmadi refinery and desalination plants, hitting 90% of Kuwait's drinking water infrastructure. Oil at ~$109/bbl with analysts warning $150+ if Hormuz stays closed. US public approval at 35%, down from 41%. Congress has not approved the $200B war funding request. Ceasefire negotiations at standstill — Iran rejected US 15-point plan and issued 5 maximalist counter-conditions. Pakistan, Turkey, and Egypt mediating but Iran refused to meet US officials in Islamabad.",
    triggers: [
      "CRITICAL: Trump's 48-hour Hormuz ultimatum expires April 6 — 'Power Plant Day and Bridge Day' threatened",
      "April 3: First US aircraft shot down in combat in 20+ years (F-15E + A-10 over Iran)",
      "April 3-5: Iran strikes Kuwait refineries, desalination plants — 90% of Kuwait's water supply at risk",
      "April 1: Trump addresses nation — war 'nearing completion,' 2-3 more weeks of 'extremely hard' strikes",
      "March 25: Iran rejects US 15-point plan, issues 5 counter-conditions including Hormuz sovereignty recognition",
      "March 9: Mojtaba Khamenei elected Supreme Leader — hardliner, 'power behind the robes'",
      "Houthis entering war: 2 ballistic missile attacks on Israel (April 1-2)",
    ],
    keyMetrics: [
      { label: "War Duration",         value: "37 days",        color: "#94a3b8" },
      { label: "Brent Crude",          value: "~$109/bbl",      color: "#f59e0b" },
      { label: "Iran Casualties",      value: "2,076+ killed",  color: "#ef4444" },
      { label: "Iran Wounded",         value: "26,500+",        color: "#ef4444" },
      { label: "Lebanon Killed",       value: "1,318",          color: "#ef4444" },
      { label: "Lebanon Displaced",    value: "1,000,000+",     color: "#ef4444" },
      { label: "Iran Navy Destroyed",  value: "92% (140+ vessels)", color: "#06b6d4" },
      { label: "Iran Missile Capacity",value: "Down 90%",       color: "#06b6d4" },
      { label: "US Aircraft Lost",     value: "2 (F-15E + A-10)", color: "#f59e0b" },
      { label: "US Public Approval",   value: "35%",            color: "#ef4444" },
      { label: "Hezbollah Attack Waves",value: "1,045 since Mar 2", color: "#ef4444" },
      { label: "Countries Iran Struck",value: "9+",             color: "#ef4444" },
    ]
  },

  scenarios: [
    {
      id: 1,
      name: "Escalatory Resolution",
      tagline: "Coerced Capitulation",
      probability: 30,
      color: "#06b6d4",
      description: "Trump's April 6 deadline triggers devastating strikes on Iranian power plants, bridges, and remaining infrastructure. With 90% missile capacity destroyed, 92% navy sunk, and civilian infrastructure collapsing, Iran's remaining leadership accepts terms short of their 5 conditions — likely a modified ceasefire preserving regime survival but conceding on Hormuz and nuclear verification. The war ends within 2-4 weeks through US military coercion, not negotiation.",
      narrative: "RAND's April assessment notes the US has made 'significant progress toward three of four objectives' and the war is 'a dilemma, not a debacle.' Trump's April 1 address framed a 2-3 week endgame. The Hormuz deadline is designed to create a binary: Iran either capitulates or faces infrastructure destruction that makes continued resistance untenable. Iran's military rejection of the ultimatum was expected, but Araghchi's simultaneous signal of willingness to talk suggests internal debate. The key question: does infrastructure destruction break Iranian resolve or harden it? Historical precedent (Serbia 1999) suggests infrastructure campaigns can coerce capitulation — but Iran is larger, more dispersed, and has deeper nationalist resilience.",
      impacts: { military: 8, economic: 7, diplomatic: 6, humanitarian: 9, regional: 7, global: 6 },
      timeHorizons: {
        shortTerm:  "April 6-20: Major infrastructure strikes; power/water/bridge destruction; humanitarian crisis accelerates",
        mediumTerm: "May-June: Coerced settlement; Hormuz reopens; oil retreats to $75-85; IAEA verification framework",
        longTerm:   "Iran weakened but intact; nuclear deal 2.0; regional power vacuum partially filled by Gulf states"
      },
      indicators: [
        { signal: "Trump orders strikes on Iranian power plants after April 6 deadline",     status: "emerging" },
        { signal: "Araghchi signals willingness to talk while military rejects ultimatum",    status: "observed" },
        { signal: "Iran's missile launches down 90% — offensive capacity near-zero",          status: "observed" },
        { signal: "92% of Iranian navy destroyed — no ability to enforce Hormuz closure",     status: "observed" },
        { signal: "Pakistan/Turkey/Egypt mediators working on compromise formula",            status: "observed" },
      ],
      feasibility: [
        {
          action: "US destroys Iranian civilian infrastructure to coerce settlement",
          actor: "United States",
          militaryFeasibility: { score: 9, detail: "Iran's air defenses severely degraded; US has overwhelming strike capability for infrastructure targets" },
          economicCapacity:    { score: 5, detail: "$200B funding request still unapproved; but operations funded from existing DoD budget in short term" },
          politicalWill:       { score: 6, detail: "Trump personally committed to 2-3 week timeline; infrastructure strikes may generate domestic backlash" },
          allianceSupport:     { score: 4, detail: "Israel supports; Gulf states want Hormuz open; European allies will condemn civilian infrastructure strikes" },
          overallSustainability: "sustainable_short_term",
          dealbreaker: "Civilian casualties from infrastructure strikes generate international legal action; US public turns sharply against",
          estimatedCost: "$10-20B in additional munitions + long-term diplomatic cost"
        }
      ]
    },
    {
      id: 2,
      name: "Regional Conflagration",
      tagline: "The Widening Gyre",
      probability: 25,
      color: "#ef4444",
      description: "The April 6 deadline triggers US infrastructure strikes, but Iran responds with a coordinated multi-front escalation: Houthis fully activate against Saudi Aramco and Red Sea shipping, Hezbollah launches precision strikes on Tel Aviv, Iraqi PMF conducts mass-casualty attack on US bases. Kuwait water infrastructure is further targeted. The war becomes a multi-front Middle East conflagration that exceeds US capacity to manage simultaneously.",
      narrative: "This scenario has risen sharply in probability. Iran struck Kuwait's Mina Al-Ahmadi refinery and desalination plants (90% of drinking water). Houthis launched 2 ballistic missile attacks on Israel in April 1-2 — they are entering the war. Hezbollah has conducted 1,045 attack waves with 150 rockets during Passover. Israel's ground offensive in Lebanon has displaced 1M+ people. The F-15E and A-10 shootdowns demonstrate Iran still has lethal air defense capability. If Trump's infrastructure strikes on April 6+ cause massive civilian suffering, the proxy network has both motivation and capability for coordinated retaliation. The Stimson Center warns Houthis 'will almost certainly join the current war soon.'",
      impacts: { military: 10, economic: 10, diplomatic: 9, humanitarian: 10, regional: 10, global: 10 },
      timeHorizons: {
        shortTerm:  "April: Multi-front escalation; Hormuz fully blocked; Saudi Aramco targeted; oil $150+; global recession",
        mediumTerm: "Gulf state direct military involvement; Turkey/Jordan destabilization; refugee crisis 5M+",
        longTerm:   "Restructuring of entire Middle East security architecture; years of multi-front conflict"
      },
      indicators: [
        { signal: "Houthis launch ballistic missiles at Israel (April 1-2) — entering war",          status: "observed" },
        { signal: "Iran strikes Kuwait refineries and desalination plants",                            status: "observed" },
        { signal: "Hezbollah 1,045 attack waves; 150 rockets during Passover",                        status: "observed" },
        { signal: "Iran shoots down 2 US aircraft — first in 20+ years",                               status: "observed" },
        { signal: "Israel ground offensive in Lebanon — 1M+ displaced, 1,318 killed",                  status: "observed" },
        { signal: "Houthis launch mass strike on Saudi Aramco facilities",                             status: "not_observed" },
        { signal: "US warship hit with mass casualties",                                                status: "not_observed" },
      ],
      feasibility: [
        {
          action: "Coordinated multi-front proxy escalation in response to infrastructure strikes",
          actor: "Iran Proxy Network + Houthis",
          militaryFeasibility: { score: 8, detail: "Houthis have 1,500km range and are entering war; Hezbollah has precision munitions; PMF has drone swarms; all active" },
          economicCapacity:    { score: 5, detail: "Houthis self-sufficient; Hezbollah has reserves; PMF has Iraqi state funding" },
          politicalWill:       { score: 9, detail: "Infrastructure destruction of Iranian civilians creates maximum motivation for proxy retaliation" },
          allianceSupport:     { score: 4, detail: "Proxies increasingly autonomous; Iran C2 degraded but standing orders in effect" },
          overallSustainability: "sustainable_short_term",
          dealbreaker: "US retaliates with devastating strikes on proxy home territories — but this further widens the war",
          estimatedCost: "Incalculable — oil shock $150+/bbl; global GDP hit 2-3%"
        }
      ]
    },
    {
      id: 3,
      name: "Prolonged Stalemate",
      tagline: "The Forever War",
      probability: 22,
      color: "#f59e0b",
      description: "Trump's April 6 deadline passes with escalated strikes but no decisive outcome. Iran absorbs infrastructure damage, disperses remaining forces, and sustains proxy attrition. The US cannot force capitulation without ground troops. Congressional funding remains blocked. The war grinds on 3-6+ months with escalating costs, declining public support, and no clear endgame.",
      narrative: "Despite Trump's 2-3 week rhetoric, the structural dynamics of air-only warfare against a large dispersed state favor stalemate. RAND notes 'least progress' on the proxy network objective — Hezbollah, PMF, and Houthis remain intact. Congress lacks votes to pass $200B funding even within the GOP. Public approval at 35% and falling. Iran's 5 conditions are maximalist; US demands are maximalist. Neither side can accept terms the other offers. The F-15E/A-10 losses demonstrate Iran retains the ability to impose costs. Mediators (Pakistan, Turkey, Egypt) struggling but keeping channels open.",
      impacts: { military: 8, economic: 8, diplomatic: 7, humanitarian: 9, regional: 8, global: 8 },
      timeHorizons: {
        shortTerm:  "April-May: Escalated strikes but no resolution; proxy war intensifies; oil $100-120",
        mediumTerm: "June-Sept: Congressional pressure mounts; US midterm politics dominate; Iran reconstitutes",
        longTerm:   "War ends via exhaustion; frozen conflict; Iran's nuclear timeline delayed but not eliminated"
      },
      indicators: [
        { signal: "Trump signals 'winding down' while deploying more assets",                  status: "observed" },
        { signal: "$200B war funding faces bipartisan opposition — GOP lacks votes",            status: "observed" },
        { signal: "Iran refuses ceasefire terms; US refuses Iran's 5 conditions",               status: "observed" },
        { signal: "Iran shot down 2 US aircraft — still capable of imposing costs",             status: "observed" },
        { signal: "Mediators report 'standstill' in negotiations",                              status: "observed" },
      ],
      feasibility: [
        {
          action: "US sustains air campaign without ground forces beyond April",
          actor: "United States",
          militaryFeasibility: { score: 7, detail: "Overwhelming air superiority; but F-15E/A-10 losses show Iran retains lethal AD capability" },
          economicCapacity:    { score: 4, detail: "$200B request blocked; operations running on existing DoD budget — unsustainable beyond 2-3 months" },
          politicalWill:       { score: 3, detail: "35% approval; bipartisan opposition; midterm pressure building; no AUMF" },
          allianceSupport:     { score: 4, detail: "Israel committed; Gulf states want it over; European condemnation growing" },
          overallSustainability: "barely_feasible",
          dealbreaker: "Congressional defunding or third US aircraft loss with captured crew",
          estimatedCost: "$50-80B/year at current tempo; political cost incalculable"
        }
      ]
    },
    {
      id: 4,
      name: "Negotiated Ceasefire",
      tagline: "Off-Ramp Found",
      probability: 15,
      color: "#10b981",
      description: "Pakistan, Turkey, and Egypt mediators find a formula that bridges the gap between US demands (Hormuz reopening, nuclear verification) and Iran's 5 conditions (end to aggression, guarantees, reparations, all-fronts ceasefire, Hormuz sovereignty). A face-saving compromise emerges: Iran allows 'international navigation corridor' through Hormuz, IAEA verification resumes, both sides declare victory. Frozen conflict.",
      narrative: "Despite the standstill, diplomatic channels remain open. Araghchi signaled willingness to talk on April 5 — even as the military rejected Trump's ultimatum. This dual-track (military defiance / diplomatic openness) is classic Iranian negotiating posture. Pakistan, Turkey, and Egypt are actively mediating. The economic pressure on Iran is existential (economy near collapse, infrastructure being destroyed) while US political pressure is mounting (35% approval, no Congressional funding). Both sides have incentives to find an off-ramp — but both need to save face. The Libya 2003 model (nuclear concession in exchange for regime survival) remains plausible if framed correctly.",
      impacts: { military: 5, economic: 5, diplomatic: 7, humanitarian: 6, regional: 6, global: 5 },
      timeHorizons: {
        shortTerm:  "April-May: Back-channel breakthrough via mediators; Hormuz 'navigation corridor' opens; oil drops to $75-85",
        mediumTerm: "June-Sept: IAEA verification framework; partial sanctions relief; new Iranian leadership consolidates",
        longTerm:   "Frozen nuclear deal; Iran weakened but intact; US declares 'mission accomplished'; decade of rebuilding"
      },
      indicators: [
        { signal: "Araghchi signals willingness to talk on April 5",                           status: "observed" },
        { signal: "Pakistan/Turkey/Egypt mediators actively working on compromise",            status: "observed" },
        { signal: "Iran's 5 conditions are negotiating positions, not final demands",          status: "emerging" },
        { signal: "US pauses strikes for 48+ hours ('humanitarian window')",                   status: "not_observed" },
        { signal: "Brent crude falls below $90 on ceasefire speculation",                      status: "not_observed" },
      ],
      feasibility: [
        {
          action: "Iran accepts face-saving compromise on Hormuz and nuclear verification",
          actor: "Iran",
          militaryFeasibility: { score: 4, detail: "Military severely degraded — ceasefire is military survival imperative" },
          economicCapacity:    { score: 2, detail: "Economy near collapse; infrastructure being destroyed; ceasefire is existential" },
          politicalWill:       { score: 5, detail: "Mojtaba Khamenei needs legitimacy; compromise vs. continued destruction is the calculus" },
          allianceSupport:     { score: 6, detail: "Russia/China/Pakistan/Turkey all prefer ceasefire; pressure on Iran to accept terms" },
          overallSustainability: "sustainable_short_term",
          dealbreaker: "IRGC hardliners refuse any terms — internal coup risk against Mojtaba",
          estimatedCost: "Sanctions relief worth $10-20B annually to Iran; reconstruction $50B+"
        }
      ]
    },
    {
      id: 5,
      name: "Regime Collapse / Nuclear Crisis",
      tagline: "The Abyss",
      probability: 8,
      color: "#dc2626",
      description: "Combined military destruction, economic collapse, and internal fracture topple the Islamic Republic. Mojtaba Khamenei (rumored injured/dead since late March) loses control. Competing IRGC factions fight for power. In the chaos, surviving nuclear materials become a proliferation risk. Alternatively, desperate IRGC remnants attempt nuclear weaponization as a survival strategy.",
      narrative: "Mojtaba Khamenei has been absent from public view since his appointment, with rumors of injury or death circulating since April 1. If true, the regime faces a second succession crisis in 37 days. Iran's military is 90% degraded on missiles, 92% on navy. If April 6 infrastructure strikes destroy power/water for 90M civilians, the regime faces internal legitimacy collapse. Brookings warned the Islamic Republic 'won't disappear even if leaders are replaced' but that was before the scale of infrastructure destruction. The nuclear dimension: Iran's 400+ kg of 60% HEU is the wild card. RAND noted strikes 'may not have neutralized nuclear capability.' A desperate faction with nothing to lose could attempt weaponization.",
      impacts: { military: 10, economic: 10, diplomatic: 10, humanitarian: 10, regional: 10, global: 10 },
      timeHorizons: {
        shortTerm:  "Power vacuum; IRGC fragments; proxy forces go fully autonomous; humanitarian catastrophe; nuclear proliferation risk",
        mediumTerm: "Competing authorities; Kurdish/Baloch separatism; refugee crisis 5M+; nuclear materials unaccounted for",
        longTerm:   "Decade-long stabilization; cascade proliferation (Saudi, Turkey, UAE); Middle East restructuring"
      },
      indicators: [
        { signal: "Mojtaba Khamenei absent from public view — injury/death rumors",            status: "emerging" },
        { signal: "Senior IRGC commanders publicly defect or go silent",                        status: "not_observed" },
        { signal: "Mass protests resume inside Iran despite war",                               status: "not_observed" },
        { signal: "IAEA loses track of HEU stockpile location",                                status: "not_observed" },
        { signal: "Saudi Arabia announces nuclear program acceleration",                        status: "emerging" },
      ],
      feasibility: [
        {
          action: "Regime collapses under combined military/economic pressure",
          actor: "Iran",
          militaryFeasibility: { score: 5, detail: "Military 90% degraded; but IRGC has deep domestic security apparatus" },
          economicCapacity:    { score: 1, detail: "Economy near collapse; if power/water infrastructure destroyed, civilian survival threatened" },
          politicalWill:       { score: 6, detail: "Mojtaba's legitimacy untested; second succession crisis in 37 days could fracture regime" },
          allianceSupport:     { score: 2, detail: "Russia/China will not intervene to save regime; may compete for post-collapse influence" },
          overallSustainability: "barely_feasible",
          dealbreaker: "IRGC security apparatus maintains control through repression even under bombardment",
          estimatedCost: "Existential — incalculable for Iran; $3-6T for US if post-collapse stabilization required"
        }
      ]
    }
  ],

  decisionPoints: [
    { actor: "United States",       decision: "Execute April 6 infrastructure strikes vs. extend deadline again",       leadsTo: [1, 3], consequence: "Strikes → coerced settlement or conflagration; Extension → stalemate and credibility loss" },
    { actor: "Iran",                decision: "Accept compromise on Hormuz vs. absorb infrastructure strikes",          leadsTo: [4, 2], consequence: "Compromise → face-saving ceasefire; Absorption → conflagration or regime collapse risk" },
    { actor: "Houthis",             decision: "Full activation vs. continued restraint",                                 leadsTo: [2, 3], consequence: "Full activation → multi-front conflagration; Restraint → stalemate continues" },
    { actor: "US Congress",         decision: "Approve $200B funding vs. defund / force withdrawal timeline",            leadsTo: [3, 4], consequence: "Approval → extended campaign; Rejection → forced ceasefire timeline" },
    { actor: "Mojtaba Khamenei",    decision: "Negotiate from weakness vs. fight to regime collapse",                    leadsTo: [4, 5], consequence: "Negotiation → survival; Fighting to the end → regime collapse risk" },
  ],

  expertOpinions: {
    consensus: {
      summary: "RAND's April 2026 assessment: the war is 'a dilemma, not a debacle.' The US has made significant progress on 3 of 4 objectives — Iran's missile capacity down 90%, navy 92% destroyed, nuclear infrastructure degraded. But the proxy network (Hezbollah, Houthis, Iraqi PMF) remains 'largely intact' and is escalating. Air power alone cannot achieve regime change or proxy elimination. The F-15E/A-10 losses demonstrate Iran retains lethal capability. The April 6 deadline creates a binary escalation point with no guaranteed outcome.",
      supporters: ["RAND", "Brookings", "Stimson Center", "CFR", "IISS"]
    },
    dissenting: [
      {
        expert: "Trump Administration",
        affiliation: "White House",
        position: "War 'nearing completion' — 2-3 more weeks of 'extremely hard' strikes will force Iranian capitulation",
        reasoning: "Military degradation of Iran is unprecedented; infrastructure strikes will break remaining resistance; Hormuz deadline creates decisive pressure",
        credibilityNote: "Trump's March 20 'winding down' prediction was premature. April 1 address pushed timeline to 2-3 more weeks. Previously extended the Hormuz deadline once already (March 26). Pattern of optimistic timelines that slip."
      },
      {
        expert: "Iran's Military Command",
        affiliation: "IRGC / Ali Abdollahi",
        position: "Trump's ultimatum is 'desperate, nervous, unbalanced and foolish' — infrastructure strikes will be met with 'devastating and continuous' attacks on all US assets",
        reasoning: "Iran retains proxy network; shot down 2 US aircraft; struck Gulf infrastructure; can impose escalating costs",
        credibilityNote: "Iran's military posture has been consistent — reject all demands, promise retaliation, deliver on proxy attacks. Credible on capability (proven by F-15E/A-10 shootdowns) but may overstate strategic resilience."
      },
      {
        expert: "Stimson Center",
        affiliation: "Think Tank",
        position: "Houthis 'will almost certainly join the current war soon' — multi-front escalation is the most dangerous near-term risk",
        reasoning: "Houthis have upgraded independent manufacturing capability; already launched 2 ballistic missile attacks on Israel; full activation would add Red Sea/Saudi front",
        credibilityNote: "Stimson's Houthi assessment appears prescient — April 1-2 launches confirm entry into conflict. High credibility on Yemen dynamics."
      },
      {
        expert: "Iranian-American Scholars",
        affiliation: "Academic community",
        position: "Infrastructure strikes will generate nationalist solidarity, not capitulation — repeating the same error as the initial bombing campaign",
        reasoning: "External attacks on Iran consistently produce rally effects; destroying civilian infrastructure (power, water, bridges) will unify population behind regime",
        credibilityNote: "Historically well-founded — Iran's December 2025 protest movement (largest since 1979) has been completely neutralized by nationalist war solidarity"
      }
    ],
    regionalVsWestern: {
      westernView: "RAND frames the war as making 'significant progress' on objectives. US administration sees infrastructure escalation as the decisive lever. The proxy problem is acknowledged but secondary to the nuclear/missile objectives.",
      regionalView: "Regional states (Kuwait, UAE, Bahrain) are absorbing Iranian missile strikes on their civilian infrastructure while hosting US assets. Pakistan, Turkey, Egypt are desperately mediating. Lebanon has 1M+ displaced. The war's regional cost is borne by countries that had no say in starting it.",
      gapAnalysis: "The gap has widened dramatically since March. Western analysis focuses on military metrics (90% missile degradation, 92% navy destroyed). Regional analysis focuses on the 2,076+ dead, 26,500+ wounded, Kuwait's water infrastructure, 1M displaced in Lebanon, and the growing humanitarian catastrophe. The April 6 infrastructure strikes will widen this gap further — power/water destruction for 90M civilians crosses a line that military target lists do not."
    },
    overallExpertConfidence: "Medium — April 6 deadline creates binary outcome; fog of war + internal Iranian dynamics poorly understood"
  },

  impactMatrix: [
    { scenario: "Escalatory Resolution", military: 8,  economic: 7,  diplomatic: 6,  humanitarian: 9,  regional: 7,  global: 6  },
    { scenario: "Conflagration",         military: 10, economic: 10, diplomatic: 9,  humanitarian: 10, regional: 10, global: 10 },
    { scenario: "Stalemate",             military: 8,  economic: 8,  diplomatic: 7,  humanitarian: 9,  regional: 8,  global: 8  },
    { scenario: "Ceasefire",             military: 5,  economic: 5,  diplomatic: 7,  humanitarian: 6,  regional: 6,  global: 5  },
    { scenario: "Collapse/Nuclear",      military: 10, economic: 10, diplomatic: 10, humanitarian: 10, regional: 10, global: 10 },
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
    { month: "Mar 29",  price: 105 },
    { month: "Apr 2",   price: 109 },
    { month: "Apr 5",   price: 109 },
  ],
}

// ─── STRATEGIC VERDICT ────────────────────────────────────────────────────────
const strategicVerdict = {
  stance: "ESCALATE CAUTION — CRITICAL INFLECTION",
  stanceColor: "#ef4444",
  primaryScenario: "Escalatory Resolution",
  primaryProb: 30,
  timing: "IMMEDIATE — April 6 deadline is tomorrow",
  timingDetail: "Trump's 48-hour Hormuz ultimatum expires April 6. He has explicitly threatened 'Power Plant Day and Bridge Day' — strikes on Iranian civilian infrastructure. Iran's military has rejected the demand. Araghchi has simultaneously signaled willingness to talk. This creates a 24-hour window where either: (a) last-minute diplomatic breakthrough via Pakistan/Turkey/Egypt mediators prevents infrastructure strikes, or (b) strikes proceed and the war enters its most destructive and unpredictable phase. The April 6 deadline is the single most important inflection point since the war began on February 28. All scenario probabilities shift dramatically based on what happens in the next 24-48 hours. Previous deadline (March 26) was extended — but Trump's language has escalated significantly ('Open the F***in' Strait, you crazy bastards, or you'll be living in Hell'). The probability of follow-through is materially higher this time.",
  immediateWatchpoints: [
    {
      signal: "April 6 Hormuz deadline — does Trump execute infrastructure strikes?",
      timing: "TOMORROW (April 6)",
      implication: "If strikes proceed: Escalatory Resolution surges to 40%, Conflagration to 30%. If deadline extended again: Stalemate rises to 35%, Trump credibility erodes. This is the gating signal for all scenario probabilities.",
      urgency: "Critical",
    },
    {
      signal: "Iran's response to infrastructure strikes (if they occur)",
      timing: "24-72h after strikes",
      implication: "Coordinated proxy retaliation (Houthis + Hezbollah + PMF) → Conflagration. Iranian capitulation signals → Escalatory Resolution. Mixed/asymmetric response → Stalemate continues.",
      urgency: "Critical",
    },
    {
      signal: "Houthi full activation — next ballistic missile strike on Saudi Aramco or Red Sea",
      timing: "24-96h",
      implication: "Houthis launched 2 attacks on Israel (April 1-2). Stimson: 'almost certainly will join soon.' Full activation → Conflagration probability jumps to 30%+. Oil $130-150+.",
      urgency: "Critical",
    },
    {
      signal: "Pakistan/Turkey/Egypt mediation breakthrough",
      timing: "24-48h (pre-deadline window)",
      implication: "Araghchi signaled willingness to talk. If mediators deliver a compromise formula before April 6: Ceasefire surges to 25-30%. The diplomatic window is extremely narrow.",
      urgency: "Critical",
    },
    {
      signal: "Congressional action on $200B war funding",
      timing: "1-2 weeks",
      implication: "GOP lacks votes within own party. Passage → extended campaign. Rejection → forced ceasefire timeline. Senate filibuster likely requires Democratic votes.",
      urgency: "High",
    },
    {
      signal: "Mojtaba Khamenei status — alive, injured, or dead?",
      timing: "Ongoing",
      implication: "Absent from public view since appointment. Injury/death rumors since April 1. Confirmation of incapacitation → Regime Collapse probability jumps to 15-20%.",
      urgency: "High",
    },
  ],
  marketPositioning: [
    {
      asset: "Brent Crude",
      stance: "HOLD — brace for $130-150 spike",
      color: "#ef4444",
      rationale: "At $109 with Hormuz closed and April 6 infrastructure strikes imminent. IEA warns April 'will be much worse than March.' If strikes proceed → oil spikes $130+. If Houthis activate fully → $150+. Hold energy longs; prepare for extreme volatility in next 48h.",
    },
    {
      asset: "Gold",
      stance: "CAUTIOUS ADD",
      color: "#f59e0b",
      rationale: "Paradoxically down 14.6% in March as dollar strengthened on oil-driven inflation expectations. But if conflagration scenario materializes (25% probability), gold reprices sharply higher. J.P. Morgan target $6,300 by year-end. Small additions on dips.",
    },
    {
      asset: "US Treasuries (10Y)",
      stance: "HOLD",
      color: "#f59e0b",
      rationale: "Safe-haven bid vs. inflation pressure from oil shock. Net neutral. Hold as portfolio hedge. Watch for flight-to-safety spike if conflagration materializes.",
    },
    {
      asset: "USD (DXY)",
      stance: "HOLD",
      color: "#f59e0b",
      rationale: "Dollar supported by oil-driven rate expectations; but $200B unfunded war spending is long-term negative. Crosscurrents continue.",
    },
    {
      asset: "US Equities (S&P 500)",
      stance: "REDUCE",
      color: "#ef4444",
      rationale: "S&P down 4.31% since Feb 28. April 6 deadline creates extreme binary risk: escalatory resolution → relief rally; conflagration → further 5-10% decline. Risk-reward skewed negative into deadline. Reduce to underweight.",
    },
    {
      asset: "Defense Sector (LMT, RTX, NOC)",
      stance: "HOLD",
      color: "#10b981",
      rationale: "Continued war spending regardless of scenario. $200B funding request, even if trimmed, benefits defense. Maintain overweight.",
    },
    {
      asset: "Gulf State Equities / EM MENA",
      stance: "AVOID",
      color: "#ef4444",
      rationale: "Kuwait infrastructure under direct attack. UAE installations struck. Conflagration at 25% makes MENA uninvestable on risk-adjusted basis. Avoid entirely.",
    },
  ],
  probabilityUpdate: "Escalatory Resolution 30% / Conflagration 25% / Stalemate 22% / Ceasefire 15% / Collapse-Nuclear 8%. MAJOR SHIFT: Conflagration doubled from 15% to 25% on Houthi activation + Kuwait strikes + aircraft losses. Stalemate dropped from 35% to 22% as April 6 deadline forces binary outcome. New 'Escalatory Resolution' scenario (30%) captures Trump's coercion strategy. Next trigger: April 6 deadline outcome.",
  conviction: "Medium-High",
  nextReview: "April 6 — MANDATORY review upon deadline outcome. Intra-day if strikes begin.",
}

// ─── ANALYSIS GAPS ────────────────────────────────────────────────────────────
const analysisGaps = [
  {
    topic: "Houthi Full Activation: Red Sea & Saudi Aramco Targeting",
    description: "Houthis launched 2 ballistic missile attacks on Israel (April 1-2) and Stimson Center says they 'will almost certainly join soon.' Full activation would add Red Sea shipping lane closure + Saudi Aramco targeting — potentially doubling the oil supply shock.",
    issueTitle: "URGENT: Extend US-Iran War analysis: Houthi full activation scenarios — Red Sea closure, Saudi Aramco targeting, oil price impact modeling",
  },
  {
    topic: "Mojtaba Khamenei Status & Iranian Succession",
    description: "Mojtaba Khamenei has been absent from public view since his March 9 appointment. Rumors of injury or death since April 1. If confirmed, Iran faces a second succession crisis in 37 days — with massive implications for regime survival and negotiating capacity.",
    issueTitle: "Extend US-Iran War analysis: Mojtaba Khamenei status — succession crisis 2.0, IRGC factional dynamics, implications for ceasefire negotiations",
  },
  {
    topic: "April 6 Infrastructure Strikes: Humanitarian Impact Modeling",
    description: "Trump threatens power plants and bridges for 90M civilians. Iran already has 2,076+ killed, 26,500+ wounded. Infrastructure destruction could create humanitarian catastrophe and international legal consequences.",
    issueTitle: "Extend US-Iran War analysis: April 6 infrastructure strike humanitarian impact — civilian casualties modeling, international legal implications, ICC referral risk",
  },
  {
    topic: "Kuwait Water Crisis: Desalination Plant Targeting",
    description: "Iran struck Kuwait desalination plants providing 90% of drinking water. This is a potential humanitarian crisis for a US ally that creates severe political pressure on the coalition.",
    issueTitle: "Extend US-Iran War analysis: Kuwait water infrastructure crisis — desalination targeting, humanitarian impact, coalition fracture risk",
  },
  {
    topic: "US Aircraft Vulnerability Assessment",
    description: "F-15E and A-10 shot down April 3 — first US combat losses in 20+ years. What Iranian air defense capability remains? What is the risk to ongoing air operations?",
    issueTitle: "Extend US-Iran War analysis: US aircraft vulnerability — Iranian residual air defense capability, operational risk assessment, force protection implications",
  },
  {
    topic: "Global Oil Supply Crisis: Strategic Reserve Depletion",
    description: "IEA warns April will be 'much worse' than March. SPR and exempted supplies running out by mid-April. Oil could hit $150+ if Hormuz stays closed. OPEC+ response dynamics unanalyzed.",
    issueTitle: "Extend US-Iran War analysis: Global oil supply crisis — SPR depletion timeline, OPEC+ response, $150+ oil demand destruction modeling",
  },
]

// ─── POLITICAL SIGNALS ────────────────────────────────────────────────────────
const politicalComments = [
  {
    actor: "Donald Trump",
    role: "US President",
    platform: "Truth Social",
    date: "2026-04-05",
    time: "Morning ET",
    quote: "Open the F***in' Strait, you crazy bastards, or you'll be living in Hell. Tuesday will be Power Plant Day, and Bridge Day.",
    context: "Profanity-laced rant posted after successful rescue of F-15E WSO from Iran; Hormuz deadline expires April 6",
    signalType: "escalatory",
    marketImpact: "Oil +$2/bbl; defense stocks up 1.5%; markets bracing for infrastructure strikes",
    scenarioImplication: "Confirms intent to execute infrastructure strikes if Hormuz not reopened. Escalatory Resolution probability elevated. Language is the most aggressive of the war.",
    verified: true,
  },
  {
    actor: "Donald Trump",
    role: "US President",
    platform: "Truth Social",
    date: "2026-04-05",
    time: "After rescue",
    quote: "WE GOT HIM! One of the most daring search and rescue operations in U.S. history.",
    context: "Celebrating rescue of F-15E weapons systems officer from mountain crevice 7,000ft inside Iran",
    signalType: "ambiguous",
    marketImpact: "Minor positive — human interest story; no strategic shift",
    scenarioImplication: "Successful rescue removes the hostage/POW risk that could have dramatically escalated the war. Slightly reduces Conflagration probability.",
    verified: true,
  },
  {
    actor: "Donald Trump",
    role: "US President",
    platform: "Primetime Address to the Nation",
    date: "2026-04-01",
    time: "21:00 ET",
    quote: "The war is nearing completion. We will hit Iran extremely hard over the next two to three weeks. If they don't make a deal, we will bring them back to the stone ages. Their power plants, their oil sites — everything.",
    context: "First national address on the Iran war; framed 2-3 week timeline with escalating strikes",
    signalType: "escalatory",
    marketImpact: "S&P 500 rallied 0.69% (war-end hopes); oil surged 8-11% in following sessions on escalation reality; Nasdaq entered correction",
    scenarioImplication: "Establishes the 2-3 week escalation timeline. Markets initially read as de-escalatory (war ending) then repriced as escalatory (infrastructure destruction). Creates the April 6 deadline context.",
    verified: true,
  },
  {
    actor: "Donald Trump",
    role: "US President",
    platform: "Truth Social",
    date: "2026-04-04",
    time: "N/A",
    quote: "Remember when I gave Iran ten days to MAKE A DEAL or OPEN UP THE HORMUZ STRAIT... Time is running out — 48 hours before all Hell will reign down on them. Glory be to GOD!",
    context: "Reaffirming the April 6 deadline set on March 26; this time with 48-hour precision",
    signalType: "escalatory",
    marketImpact: "Oil up; volatility spiked; markets pricing in April 6 strikes",
    scenarioImplication: "Trump previously extended the March 26 deadline. This reaffirmation with explicit 48-hour countdown suggests higher probability of follow-through. Escalatory Resolution probability +5%.",
    verified: true,
  },
  {
    actor: "Ali Abdollahi",
    role: "Iran Central Military Commander",
    platform: "State Media — Official Statement",
    date: "2026-04-05",
    time: "N/A",
    quote: "Trump's threat is a desperate, nervous, unbalanced and foolish action. Any strike on Iran's infrastructure will be met with devastating and continuous attacks on all US military assets in West Asia and Israeli infrastructure.",
    context: "Official military rejection of Trump's April 6 Hormuz ultimatum",
    signalType: "escalatory",
    marketImpact: "Oil held above $109; defense stocks bid; Gulf equities declined",
    scenarioImplication: "Military defiance confirmed. But note: Araghchi simultaneously signaled willingness to talk — dual-track posture. Military rejection ≠ political rejection.",
    verified: true,
  },
  {
    actor: "Abbas Araghchi",
    role: "Iran Foreign Minister",
    platform: "Al Jazeera Interview",
    date: "2026-04-05",
    time: "N/A",
    quote: "At present there is no negotiation. Iran is not looking for a ceasefire — we are seeking to end the war. But we are willing to join talks.",
    context: "Contradicts Trump's claim that Pezeshkian requested a ceasefire; but signals diplomatic openness",
    signalType: "diplomatic",
    marketImpact: "Modest positive — markets interpreted 'willing to join talks' as a crack in Iranian defiance",
    scenarioImplication: "Critical signal: distinguishes between 'ceasefire' (temporary) and 'ending the war' (permanent). Iran's 5 conditions are negotiating positions. Raises Ceasefire probability slightly if mediators can bridge the gap before April 6.",
    verified: true,
  },
  {
    actor: "Donald Trump",
    role: "US President",
    platform: "CNBC / Public Statement",
    date: "2026-04-01",
    time: "N/A",
    quote: "Iran's president has asked the US for a ceasefire. We will consider the offer only once the Strait of Hormuz is open and clear.",
    context: "Claim that Pezeshkian requested ceasefire — immediately denied by Iran",
    signalType: "diplomatic",
    marketImpact: "Oil dropped briefly; reversed as Iran denied the claim",
    scenarioImplication: "Classic Trump negotiating tactic — claiming the other side wants a deal to create pressure. Whether true or not, it signals US is thinking about off-ramps. Marginally positive for Ceasefire scenario.",
    verified: true,
  },
  {
    actor: "Masoud Pezeshkian",
    role: "Iranian President",
    platform: "Via Intermediaries (Iran denied direct contact)",
    date: "2026-04-01",
    time: "N/A",
    quote: "Iran demands: end to aggression; guarantees against war recurrence; war reparations; end to hostilities on all fronts; international recognition of Iranian sovereignty over the Strait of Hormuz.",
    context: "Iran's 5 counter-conditions after rejecting US 15-point ceasefire proposal; delivered via intermediaries",
    signalType: "diplomatic",
    marketImpact: "Markets read as maximalist — oil held above $105; no ceasefire rally",
    scenarioImplication: "These are opening negotiating positions, not final demands. The gap between US demands (Hormuz reopening, nuclear verification) and Iran's conditions (reparations, sovereignty recognition) is enormous but not unbridgeable if both sides are desperate enough.",
    verified: true,
  },
  {
    actor: "Mojtaba Khamenei",
    role: "Supreme Leader of Iran (new — elected March 9)",
    platform: "Written Statement via IRGC",
    date: "2026-03-12",
    time: "N/A",
    quote: "The Islamic Republic will fight with every breath. My father's blood will not be in vain. The resistance front stands united.",
    context: "First statement as Supreme Leader; issued in writing only — has not appeared publicly, fueling injury/death rumors",
    signalType: "escalatory",
    marketImpact: "Minimal — markets already priced in continued Iranian resistance under new leadership",
    scenarioImplication: "Written-only statement + absence from public view since March 12 is the key intelligence gap. If Mojtaba is incapacitated, Iran's command authority is fractured — raises both Ceasefire and Regime Collapse probabilities.",
    verified: true,
  },
  {
    actor: "Speaker Mike Johnson",
    role: "US Speaker of the House",
    platform: "House Floor Speech",
    date: "2026-03-21",
    time: "14:30 ET",
    quote: "The President has asked Congress for $200 billion to fund a war that was not authorized. This chamber will not write a blank check. We will debate this. We will vote.",
    context: "Opening debate on $200B supplemental war funding; bipartisan opposition; GOP lacks votes even within own party",
    signalType: "de-escalatory",
    marketImpact: "Dollar weakened; bond yields fell on fiscal constraint interpretation",
    scenarioImplication: "Congressional funding resistance is the structural constraint on US war capacity. If funding fails, the war has a hard expiration date — raising Ceasefire probability significantly. Senate needs Democratic votes to overcome filibuster.",
    verified: true,
  },
  {
    actor: "Marco Rubio",
    role: "US Secretary of State",
    platform: "UN Security Council Address",
    date: "2026-03-17",
    time: "N/A",
    quote: "The United States is open to a diplomatic resolution. Iran's surviving leadership must demonstrate it has chosen a path without nuclear weapons. The door is not closed.",
    context: "First US diplomatic signal at UN level; one day after IAEA emergency session",
    signalType: "diplomatic",
    marketImpact: "Oil -$4/bbl; markets interpreted as genuine off-ramp signal",
    scenarioImplication: "State Department maintains diplomatic track even as Trump escalates militarily. This dual-track approach mirrors Iran's own posture. The question: do both sides' diplomatic tracks converge before April 6?",
    verified: true,
  },
  {
    actor: "Sergei Lavrov",
    role: "Russian Foreign Minister",
    platform: "Press Conference — Moscow",
    date: "2026-03-16",
    time: "N/A",
    quote: "Russia condemns this illegal aggression. We will pursue all diplomatic channels. Military support to any party is not on the table.",
    context: "Explicitly ruled out Russian military intervention; positioned as diplomatic mediator",
    signalType: "diplomatic",
    marketImpact: "Minimal — already priced in",
    scenarioImplication: "Russia benefits economically ($126 peak oil) and strategically (US distracted from Ukraine). Will not intervene but will not help end it quickly either. Diplomatic pressure on Iran to accept terms is limited.",
    verified: true,
  },
]

// ─── AFFECTED COUNTRIES (World Map) ──────────────────────────────────────────
const affectedCountries = [
  {
    name: "USA",         lat: 38.9,  lon: -97,   impact: "direct",   impactScore: 9,
    impactLabel: "Primary Belligerent",  magnitude: "Critical",
    reasons: [
      "Day 37 of Operation Epic Fury — April 6 Hormuz deadline imminent with infrastructure strike threats",
      "~45,000 troops in region; 2 CSGs; first US aircraft lost to enemy fire in 20+ years (F-15E + A-10)",
      "$200B war funding blocked in Congress; bipartisan opposition; GOP lacks votes even internally",
      "Public approval at 35% (down from 41%); 61% disapprove of war handling; Trump approval at historic low",
    ],
  },
  {
    name: "Iran",        lat: 32.4,  lon: 53.7,  impact: "direct",   impactScore: 10,
    impactLabel: "Primary Target — Devastated",  magnitude: "Critical",
    reasons: [
      "2,076+ killed, 26,500+ wounded; 600+ schools, 13+ health facilities, 120+ historical sites struck",
      "Military 90% degraded on missiles, 92% on navy; F-15E/A-10 shootdowns show residual AD capability",
      "Mojtaba Khamenei (new Supreme Leader) absent from public view — injury/death rumors since April 1",
      "Economy near collapse; infrastructure strikes on power/water/bridges threatened for April 6",
      "Rejected US 15-point plan; issued 5 maximalist counter-conditions; FM Araghchi signals willingness to talk",
    ],
  },
  {
    name: "Israel",      lat: 31.8,  lon: 35.0,  impact: "direct",   impactScore: 9,
    impactLabel: "Co-Belligerent — Ground War in Lebanon",  magnitude: "Critical",
    reasons: [
      "Ground offensive in Lebanon since March 16 — planning to occupy southern Lebanon (1/10th of country)",
      "Under 1,045 Hezbollah attack waves; 150 rockets during Passover; Houthis launched 2 BM attacks (April 1-2)",
      "1,318 killed in Lebanon; 1M+ displaced; senior Hezbollah commander killed in Beirut strike",
      "Seeks permanent security zone in southern Lebanon barring 600,000 from returning home",
    ],
  },
  {
    name: "Kuwait",      lat: 29.4, lon: 47.6,   impact: "direct",   impactScore: 9,
    impactLabel: "Infrastructure Under Attack",  magnitude: "Critical",
    reasons: [
      "Mina Al-Ahmadi refinery (largest) struck by drone waves — fires across operational units",
      "Desalination plants hit — 90% of Kuwait's drinking water supply at risk",
      "Kuwait Petroleum HQ set ablaze by drone strike; power generation facilities damaged",
      "New escalation: Iran now targeting Gulf civilian infrastructure, not just military assets",
    ],
  },
  {
    name: "Russia",      lat: 55.75, lon: 37.6,  impact: "positive",  impactScore: 7,
    impactLabel: "Economic Beneficiary",  magnitude: "High",
    reasons: [
      "Oil at $109/bbl; using 'Larak corridor' through Hormuz for exempted shipments",
      "US strategic focus diverted from Ukraine — reduced military pressure on Russian operations",
      "Diplomatic leverage as potential mediator; Lavrov explicitly ruled out military intervention",
      "Arms exports accelerating as Gulf states rearm; benefiting from global chaos",
    ],
  },
  {
    name: "China",       lat: 35.0,  lon: 105.0, impact: "strategic",  impactScore: 7,
    impactLabel: "Strategic Risk / Hormuz Dependent",  magnitude: "High",
    reasons: [
      "65% of Chinese oil imports transit Hormuz — using 'Larak corridor' for select vessels",
      "Strategic opportunity: US carrier groups focused on Persian Gulf, not Taiwan Strait",
      "Global supply chain disruption adds cost; but benefits from weakened US position",
      "Providing diplomatic cover for Iran at UN but no military support",
    ],
  },
  {
    name: "Iraq",        lat: 33.3,  lon: 44.4,  impact: "negative",  impactScore: 8,
    impactLabel: "Proxy Conflict Zone",  magnitude: "High",
    reasons: [
      "PMF militias actively striking US bases; operating semi-autonomously with standing orders",
      "Government sovereignty eroded; caught between US demands and Iranian proxy pressure",
      "Oil infrastructure at risk; civilian areas affected by cross-border operations",
      "RAND notes PMF as part of the 'proxy network that remains largely intact' despite the war",
    ],
  },
  {
    name: "Lebanon",     lat: 33.9,  lon: 35.5,  impact: "direct",    impactScore: 9,
    impactLabel: "Israel Ground War",  magnitude: "Critical",
    reasons: [
      "Israeli ground offensive since March 16 — advancing past Naqoura, destroying border towns",
      "1,318 killed, 3,935 injured; 1,000,000+ displaced (1/6th of population)",
      "Israel plans permanent occupation of southern Lebanon — 'security zone' covering 1/10th of country",
      "Hezbollah conducting 1,045 attack waves; bridges destroyed; hospital in Tyre damaged",
    ],
  },
  {
    name: "Yemen",       lat: 15.3,  lon: 44.2,  impact: "direct",    impactScore: 8,
    impactLabel: "Houthis Entering War",  magnitude: "Critical",
    reasons: [
      "Houthis launched 2 ballistic missile attacks on Israel (April 1-2) — entering the war",
      "Stimson Center: 'will almost certainly join the current war soon'",
      "Independent manufacturing capability; 1,500km+ range; Red Sea shipping lanes under threat",
      "Full activation would add Saudi Aramco targeting and Red Sea closure to the conflict",
    ],
  },
  {
    name: "Saudi Arabia", lat: 24.7, lon: 46.7,  impact: "mixed",     impactScore: 8,
    impactLabel: "Oil Windfall / Houthi Target Risk",  magnitude: "Critical",
    reasons: [
      "Oil revenue windfall at $109/bbl — massive fiscal surplus",
      "But: Houthi full activation threatens Saudi Aramco facilities directly",
      "Hosting US forces makes Saudi Arabia an Iranian counter-target",
      "Nuclear program acceleration signaled — cascade proliferation indicator",
    ],
  },
  {
    name: "UAE",         lat: 24.5,  lon: 54.4,  impact: "negative",  impactScore: 8,
    impactLabel: "Under Direct Attack",  magnitude: "High",
    reasons: [
      "Habshan gas facilities halted following Iranian missile strike",
      "Iranian missiles targeting UAE installations hosting US military assets",
      "Dubai financial markets rattled; safe-haven outflows accelerating",
      "Hosting US forces = legitimate target under Iranian doctrine",
    ],
  },
  {
    name: "Qatar",       lat: 25.3,  lon: 51.2,  impact: "negative",  impactScore: 7,
    impactLabel: "US Base — Target Risk",  magnitude: "High",
    reasons: [
      "Al-Udeid Air Base — primary US operational hub — under persistent missile threat",
      "LNG exports disrupted by Hormuz closure; Qatar GDP at risk",
      "Previously served as mediator; now displaced by Pakistan/Turkey/Egypt mediation track",
    ],
  },
  {
    name: "Pakistan",    lat: 30.4,  lon: 69.3,  impact: "mixed",     impactScore: 5,
    impactLabel: "Unlikely Peace Broker",  magnitude: "Medium",
    reasons: [
      "Emerged as would-be mediator — stepping into vacuum left by traditional intermediaries",
      "Working with Turkey and Egypt to bring US and Iran to talks in Islamabad",
      "Iran refused to meet US officials in Islamabad — mediation effort struggling",
      "Energy costs surging; economy under IMF restructuring; domestic crisis compounding",
    ],
  },
  {
    name: "Turkey",      lat: 39.9,  lon: 32.9,  impact: "mixed",     impactScore: 6,
    impactLabel: "Mediator / NATO Ally",  magnitude: "Medium",
    reasons: [
      "Active mediator alongside Pakistan and Egypt — working on compromise formula",
      "NATO obligations for US operations vs. Iran-Turkey trade disruption ($10B/yr)",
      "Refugee flows from Iraq and Lebanon straining southeastern Turkey",
      "Erdogan positioning for regional influence in post-war order",
    ],
  },
  {
    name: "Greece",      lat: 37.9,  lon: 23.7,  impact: "negative",  impactScore: 6,
    impactLabel: "Oil Import Shock",  magnitude: "Medium",
    reasons: [
      "60% of Greek oil imports transit Suez/Hormuz — price shock hits hard",
      "Shipping sector (world's largest fleet) exposed to Red Sea/Hormuz insurance surge",
      "Tourism-dependent economy vulnerable to regional instability deterring travel",
      "ECB rate cut path delayed by oil-driven inflation spike → mortgage burden remains high",
    ],
  },
  {
    name: "India",       lat: 20.6,  lon: 78.9,  impact: "negative",  impactScore: 7,
    impactLabel: "Oil Import Crisis",  magnitude: "High",
    reasons: [
      "85% of oil imported; 60% transits Hormuz — using 'Larak corridor' for select vessels",
      "Iran was India's 3rd largest oil supplier — supply now cut",
      "Rupee under pressure as import bill surges; RBI burning reserves",
      "Forced to navigate between US alliance and Hormuz access needs",
    ],
  },
  {
    name: "Germany",     lat: 51.2,  lon: 10.5,  impact: "negative",  impactScore: 5,
    impactLabel: "Energy Cost Spike / Recession Risk",  magnitude: "Medium",
    reasons: [
      "Energy-intensive industry hit by $109/bbl oil and LNG disruption",
      "Already in recession; oil shock accelerating economic contraction",
      "NATO obligations demand increased defense spending amid fiscal pressure",
    ],
  },
  {
    name: "Japan",       lat: 36.2,  lon: 138.3, impact: "negative",  impactScore: 7,
    impactLabel: "Hormuz Dependency Crisis",  magnitude: "High",
    reasons: [
      "90% of Japanese oil imports transit Hormuz — critical vulnerability",
      "Yen weakening as import costs surge; stagflation risk accelerating",
      "Japan-Iran energy deals collapsed; scrambling for alternative LNG",
      "BOJ policy path complicated by oil shock dynamics",
    ],
  },
  {
    name: "Egypt",       lat: 26.8,  lon: 30.1,  impact: "mixed",     impactScore: 5,
    impactLabel: "Mediator / Suez Revenue Risk",  magnitude: "Medium",
    reasons: [
      "Active mediator alongside Pakistan and Turkey — working on compromise formula",
      "Suez Canal revenues under threat as shipping reroutes around Cape of Good Hope",
      "Regional instability on eastern border; net oil importer with domestic subsidies",
    ],
  },
  {
    name: "Norway",      lat: 60.5,  lon: 8.5,   impact: "positive",  impactScore: 6,
    impactLabel: "Oil & Gas Windfall",  magnitude: "Medium",
    reasons: [
      "Europe's largest oil/gas supplier; $109/bbl = exceptional government fund revenues",
      "European buyers locked into Norwegian LNG at spot premiums",
      "GPFG energy holdings surging in value",
    ],
  },
  {
    name: "Bahrain",     lat: 26.0,  lon: 50.5,  impact: "negative",  impactScore: 7,
    impactLabel: "Under Iranian Attack",  magnitude: "High",
    reasons: [
      "Iranian missiles targeting Bahrain infrastructure alongside Kuwait and UAE",
      "Hosts US Fifth Fleet — primary naval command for Gulf operations",
      "Small island state extremely vulnerable to Iranian missile/drone strikes",
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
