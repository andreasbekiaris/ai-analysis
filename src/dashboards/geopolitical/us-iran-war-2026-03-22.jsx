import GeoDashboard from '../../components/GeoDashboard'

// ─── ANALYSIS DATA ────────────────────────────────────────────────────────────
const analysisData = {
  title: "US–Iran War: Operation Epic Fury",
  subtitle: "Ceasefire & Stalled Talks Analysis — Pakistan-Mediated Truce",
  date: "2026-04-25",
  warStartDate: "2026-02-28",
  daysElapsed: 56,
  overallConfidence: "Medium",
  classification: "OPEN SOURCE ANALYSIS",

  situation: {
    actors: [
      { name: "United States",        role: "Primary party — ceasefire",  stance: "Ceasefire maintained since April 8; pushing verification demands",      power: 95 },
      { name: "Israel",               role: "Co-belligerent — holding",   stance: "Holding positions in southern Lebanon; sporadic Hezbollah exchanges",   power: 72 },
      { name: "Iran (Mojtaba Khamenei)", role: "Defender — ceasefire mode", stance: "Ceasefire since April 8; stalling on nuclear verification",           power: 45 },
      { name: "Hezbollah",            role: "Iran proxy — reduced ops",   stance: "Scaled back to sporadic harassment; respecting ceasefire broadly",     power: 35 },
      { name: "Houthis (Yemen)",      role: "Iran proxy — autonomous",    stance: "Continuing Red Sea operations; not bound by Iran-US ceasefire",        power: 32 },
      { name: "Iraqi Militias (PMF)", role: "Iran proxy — standdown",     stance: "Reduced operations; occasional harassment of US bases",                power: 25 },
      { name: "Gulf States",          role: "Recovering infrastructure",  stance: "Kuwait water restored; UAE gas resuming; hosting US ceasefire monitors", power: 40 },
    ],
    context: "Day 56 of Operation Epic Fury — now in ceasefire phase since April 8. Pakistan-mediated talks produced a preliminary ceasefire agreement that halted the threatened April 6 infrastructure strikes at the last moment. The ceasefire was extended indefinitely on April 21, but talks have stalled over nuclear verification protocols and Hormuz reopening mechanisms. Iran's military remains severely degraded — missile capacity down 90%, navy 92% destroyed — but has begun limited reconstruction. The proxy network largely respects the ceasefire: Hezbollah scaled back to sporadic harassment, PMF reduced operations, but Houthis continue Red Sea attacks claiming autonomy from Iran's ceasefire commitments. Oil retreated from April 5 highs of $109 to current $78-82 range on ceasefire stability, but Hormuz remains partially restricted. US public approval recovered to 42% post-ceasefire but is declining again as talks drag on. Congress shelved the $200B war funding request but maintains $50B 'ceasefire monitoring' allocation. Key sticking point: Iran demands full sanctions relief before nuclear verification; US demands verification before sanctions relief. Pakistan, Turkey, and Qatar are rotating mediation duties, with talks relocated to Doha after Islamabad failed to bridge verification sequencing.",
    triggers: [
      "April 21: Pakistan-mediated ceasefire extended indefinitely — talks moved to Doha under Qatar mediation",
      "April 15-20: Verification sequencing deadlock — Iran demands sanctions relief first, US demands verification first",
      "April 8: Pakistan breakthrough — ceasefire agreed 6 hours before Trump's infrastructure strike deadline",
      "April 6: Trump calls off 'Power Plant Day' strikes after Pakistani PM Khan's direct intervention",
      "March 25: Iran's 5 counter-conditions (sanctions relief, Hormuz sovereignty) become ceasefire framework",
      "March 9: Mojtaba Khamenei elected Supreme Leader — key decision-maker for ceasefire acceptance",
      "Ongoing: Houthi Red Sea operations continue despite Iran ceasefire — claiming operational independence",
    ],
    keyMetrics: [
      { label: "War Duration",         value: "56 days (18 ceasefire)", color: "#94a3b8" },
      { label: "Brent Crude",          value: "~$80/bbl",       color: "#10b981" },
      { label: "Iran Casualties",      value: "2,076+ killed",  color: "#ef4444" },
      { label: "Iran Wounded",         value: "26,500+",        color: "#ef4444" },
      { label: "Lebanon Killed",       value: "1,318",          color: "#ef4444" },
      { label: "Lebanon Displaced",    value: "1,000,000+",     color: "#ef4444" },
      { label: "Iran Navy Destroyed",  value: "92% (140+ vessels)", color: "#06b6d4" },
      { label: "Iran Missile Capacity",value: "Down 90%",       color: "#06b6d4" },
      { label: "US Aircraft Lost",     value: "2 (F-15E + A-10)", color: "#f59e0b" },
      { label: "US Public Approval",   value: "42%",            color: "#10b981" },
      { label: "Ceasefire Violations", value: "23 minor",       color: "#f59e0b" },
      { label: "Talks Status",         value: "Stalled — verification", color: "#f59e0b" },
    ]
  },

  scenarios: [
    {
      id: 1,
      name: "Negotiated Settlement",
      tagline: "Doha Breakthrough",
      probability: 35,
      color: "#10b981",
      description: "Qatar mediation succeeds where Pakistan stalled. A sequenced verification framework emerges: Iran allows limited IAEA access to specific facilities while US provides partial sanctions relief on humanitarian goods. Full Hormuz reopening follows successful verification milestones. Both sides claim victory — Iran avoids regime change, US achieves nuclear verification. A comprehensive deal emerges by summer 2026.",
      narrative: "The ceasefire has created breathing room for serious negotiations. Qatar's rotating mediation brings fresh diplomatic energy after Pakistan's sequencing deadlock. Iran's willingness to accept the April 8 ceasefire demonstrated Mojtaba Khamenei can override IRGC hardliners when survival is at stake. US domestic pressure (42% approval, Congressional $200B funding block) creates Trump incentive to declare victory and pivot to domestic agenda. Oil markets are pricing in settlement hopes ($80 vs $109 peak), suggesting confidence. Key insight: both sides have already paid the political cost of backing down from maximalist positions (Trump's infrastructure strikes, Iran's Hormuz sovereignty demands). The hard part — admitting compromise — is done.",
      impacts: { military: 4, economic: 5, diplomatic: 7, humanitarian: 5, regional: 5, global: 5 },
      timeHorizons: {
        shortTerm:  "May-June: Verification sequencing agreed; partial sanctions relief; Hormuz navigation protocols",
        mediumTerm: "July-Sept: Full IAEA access; comprehensive sanctions relief; oil market normalization",
        longTerm:   "Nuclear Deal 3.0; Iran reintegration; regional power balance shifts toward diplomatic solutions"
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
      name: "Ceasefire Collapse",
      tagline: "War Resumption",
      probability: 25,
      color: "#ef4444",
      description: "Verification deadlock triggers ceasefire breakdown. A major incident — Houthi strike on US warship, Iranian nuclear facility 'accident,' or Israeli assassination in Tehran — provides pretext for war resumption. But this time, Iran has used the ceasefire to reconstitute defenses and prepare asymmetric responses. The war restarts with higher intensity, better Iranian preparation, and reduced international legitimacy for US operations.",
      narrative: "The verification sequencing deadlock is structural, not tactical. Iran's demand for sanctions relief before verification vs. US demand for verification before relief may be unbridgeable. Both sides are using ceasefire time to prepare for war resumption: Iran reconstituting air defenses and dispersing assets, US repositioning for more intensive operations. The Houthis' continued Red Sea attacks provide a constant trigger risk — a mass-casualty attack on a US warship could force Trump to retaliate, breaking the ceasefire. Alternative triggers: Israeli strike on Iranian nuclear facilities (claiming verification access as cover), or Iranian 'accident' at key verification site. Key insight: the ceasefire was easier to achieve than a permanent settlement. War resumption would be more brutal — Iran better prepared, international sympathy exhausted, proxy network more coordinated.",
      impacts: { military: 9, economic: 9, diplomatic: 8, humanitarian: 9, regional: 9, global: 8 },
      timeHorizons: {
        shortTerm:  "May-June: Incident triggers war resumption; oil spikes to $120+; ceasefire monitoring collapses",
        mediumTerm: "July-Oct: More intense warfare; Iran better prepared; reduced international support for US",
        longTerm:   "Extended conflict; regional fragmentation; proxy wars become permanent feature"
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
      name: "Frozen Conflict",
      tagline: "Indefinite Stalemate",
      probability: 28,
      color: "#f59e0b",
      description: "Ceasefire becomes permanent stalemate. Verification talks drag on for months without resolution. Both sides prefer the status quo to war resumption risks — Iran rebuilds under sanctions, US maintains containment without war costs. The conflict becomes a frozen state like Kashmir or Cyprus, with periodic flare-ups but no resolution. Oil markets adapt to ~$80-90 range as the new normal.",
      narrative: "Historical precedent suggests ceasefires often become indefinite. Both sides have discovered that frozen conflict is manageable: Iran avoids regime-threatening infrastructure destruction, US avoids $200B war funding and casualties. The verification deadlock isn't a bug — it's a feature that lets both sides avoid the domestic political costs of clear victory/defeat. Trump can claim military success (90% Iranian missile degradation) without ongoing war costs. Iran can claim resistance success (survived US onslaught, maintained regime) while rebuilding. Oil markets are already adapting to partial Hormuz restrictions. Key insight: neither side has strong incentive to force resolution. The frozen conflict serves both leaders' domestic needs better than either clear victory or resumed war.",
      impacts: { military: 6, economic: 6, diplomatic: 6, humanitarian: 7, regional: 7, global: 6 },
      timeHorizons: {
        shortTerm:  "May-Aug: Talks continue without breakthrough; ceasefire violations remain minor; oil stabilizes",
        mediumTerm: "Sept-Dec: Ceasefire becomes routine; both sides adapt to new normal; regional proxy competition",
        longTerm:   "Multi-year frozen conflict; periodic negotiation rounds; nuclear issue unresolved"
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
      name: "Iranian Domestic Upheaval",
      tagline: "Ceasefire as Capitulation",
      probability: 8,
      color: "#dc2626",
      description: "Hardliner IRGC factions view the ceasefire as capitulation and move against Mojtaba Khamenei's leadership. Street protests resume citing economic collapse and war damage. The regime faces the choice: internal crackdown that breaks the ceasefire (by launching diversionary external attacks), or continued negotiations that trigger domestic legitimacy crisis. Iran's internal fracture becomes the decisive factor.",
      narrative: "The ceasefire solved Iran's external survival problem but may have created an internal legitimacy crisis. Mojtaba Khamenei accepted terms his father died fighting against — potentially viewed as weak by IRGC hardliners who prefer war to verification. Economic damage from 56 days of war (infrastructure, sanctions, military loss) is severe. If domestic protests resume, the regime faces the classic authoritarian dilemma: negotiate abroad (seen as weak at home) or crack down at home (risking war resumption). Key early indicator: how does Iran handle post-ceasefire economic protests? Previous pattern (Dec 2025 protests) was nationalist war rally effect, but that card may be played out after ceasefire 'capitulation.'",
      impacts: { military: 8, economic: 9, diplomatic: 8, humanitarian: 9, regional: 8, global: 7 },
      timeHorizons: {
        shortTerm:  "May-June: Economic protests test regime legitimacy; IRGC factionalism emerges; ceasefire stress",
        mediumTerm: "July-Sept: Either internal crackdown breaks ceasefire, or regime accepts verification to avoid upheaval",
        longTerm:   "Regime transformation or collapse; nuclear materials security risk; regional realignment"
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
      name: "Nuclear Proliferation Crisis",
      tagline: "Materials Scatter",
      probability: 4,
      color: "#7c2d12",
      description: "Iranian domestic upheaval leads to loss of nuclear materials control. During IRGC factional fighting or mass protest crackdowns, Iran's 400+ kg of 60% HEU becomes unaccounted for. Either desperate regime elements attempt crash weaponization, or materials disappear into black market. Regional powers (Saudi, Turkey, Egypt) accelerate nuclear programs in response. Global nonproliferation regime collapses.",
      narrative: "The ceasefire preserved Iran's nuclear facilities from direct attack, but internal chaos could achieve what military strikes could not — loss of nuclear materials control. Iran's enriched uranium stockpile remains the ultimate wildcard. If Mojtaba Khamenei loses domestic control, competing IRGC factions might secure nuclear materials as power base. Alternatively, economic collapse could create insider theft incentives. Saudi Arabia has already signaled nuclear program acceleration. Turkey and Egypt have latent capabilities. A nuclear crisis triggered by Iranian domestic instability would be harder to contain than military strikes on known facilities. Key concern: verification deadlock means IAEA has reduced access precisely when materials security is most fragile.",
      impacts: { military: 10, economic: 9, diplomatic: 10, humanitarian: 8, regional: 10, global: 10 },
      timeHorizons: {
        shortTerm:  "Materials control breaks down during domestic crisis; IAEA verification access lost; regional alarm",
        mediumTerm: "Black market proliferation; regional nuclear arms race; international crisis management",
        longTerm:   "Nonproliferation regime collapse; multiple Middle East nuclear powers; deterrence instability"
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
    { actor: "United States",       decision: "Accept verification sequencing compromise vs. maintain verification-first demands", leadsTo: [1, 3], consequence: "Compromise → negotiated settlement; Hardline → frozen conflict" },
    { actor: "Iran",                decision: "Provide partial IAEA access vs. demand full sanctions relief first",      leadsTo: [1, 2], consequence: "Access → settlement track; Demands → ceasefire breakdown risk" },
    { actor: "Houthis",             decision: "Escalate Red Sea attacks vs. maintain current level",                     leadsTo: [2, 3], consequence: "Escalation → ceasefire breakdown; Maintenance → manageable irritant" },
    { actor: "Qatar Mediators",     decision: "Propose creative sequencing formula vs. continue shuttling same positions", leadsTo: [1, 3], consequence: "Creativity → breakthrough; Shuttling → indefinite stalemate" },
    { actor: "Mojtaba Khamenei",    decision: "Override IRGC hardliners vs. bow to domestic pressure",                   leadsTo: [1, 4], consequence: "Override → negotiation; Bow → domestic upheaval risk" },
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
    { scenario: "Negotiated Settlement", military: 4,  economic: 5,  diplomatic: 7,  humanitarian: 5,  regional: 5,  global: 5  },
    { scenario: "Ceasefire Collapse",    military: 9,  economic: 9,  diplomatic: 8,  humanitarian: 9,  regional: 9,  global: 8  },
    { scenario: "Frozen Conflict",       military: 6,  economic: 6,  diplomatic: 6,  humanitarian: 7,  regional: 7,  global: 6  },
    { scenario: "Domestic Upheaval",     military: 8,  economic: 9,  diplomatic: 8,  humanitarian: 9,  regional: 8,  global: 7  },
    { scenario: "Nuclear Crisis",        military: 10, economic: 9,  diplomatic: 10, humanitarian: 8,  regional: 10, global: 10 },
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
    { month: "Apr 8",   price: 95  },
    { month: "Apr 12",  price: 87  },
    { month: "Apr 16",  price: 83  },
    { month: "Apr 20",  price: 79  },
    { month: "Apr 25",  price: 80  },
  ],
}

// ─── STRATEGIC VERDICT ────────────────────────────────────────────────────────
const strategicVerdict = {
  stance: "CAUTIOUS OPTIMISM — MONITOR TALKS",
  stanceColor: "#10b981",
  primaryScenario: "Negotiated Settlement",
  primaryProb: 35,
  timing: "Medium-term horizon — 4-8 weeks for breakthrough",
  timingDetail: "The ceasefire has created the necessary breathing room for substantive negotiations, but verification sequencing remains the critical deadlock. Qatar's mediation brings fresh energy after Pakistan's April stall. Both sides have already paid the political cost of compromise (Trump canceled infrastructure strikes, Iran accepted ceasefire) — the hard part is done. Oil markets are pricing in settlement optimism ($80 vs $109 peak). Key dynamics favor breakthrough: (1) Trump needs domestic victory ahead of midterms, (2) Iran needs sanctions relief for economic recovery, (3) Both sides prefer managed resolution to war resumption risks. The next 4-8 weeks are crucial — enough time for creative sequencing formulas but not so long that positions harden or incidents trigger breakdown.",
  immediateWatchpoints: [
    {
      signal: "Qatar mediation breakthrough on verification sequencing",
      timing: "2-4 weeks",
      implication: "Key deadlock: Iran wants sanctions relief before verification, US wants verification first. Qatar bringing fresh creativity after Pakistan stall. Breakthrough → Settlement probability jumps to 50%. Continued deadlock → Frozen Conflict becomes dominant (40%+).",
      urgency: "Critical",
    },
    {
      signal: "Major Houthi escalation in Red Sea — US warship struck",
      timing: "2-8 weeks",
      implication: "Houthis continue attacking despite ceasefire, claiming independence from Iran. Mass-casualty attack on US vessel would force Trump retaliation, breaking ceasefire. Risk: 15-20% in next 8 weeks.",
      urgency: "High",
    },
    {
      signal: "Iranian domestic protests over economic conditions",
      timing: "4-12 weeks",
      implication: "War damage + continued sanctions + ceasefire seen as capitulation could trigger protests. Regime response (crackdown vs. accommodation) determines Domestic Upheaval probability. Early indicators: fuel/food prices, unemployment data.",
      urgency: "High",
    },
    {
      signal: "Israeli strike on Iranian nuclear facility during 'verification'",
      timing: "6-12 weeks",
      implication: "Israel might use verification access as cover for targeted strike, claiming facility was non-compliant. Would break ceasefire and restart war. Israel has motive to prevent Iran nuclear deal normalization.",
      urgency: "Medium",
    },
    {
      signal: "Trump domestic pressure — midterm politics and war fatigue",
      timing: "8-16 weeks",
      implication: "42% approval needs to be maintained. War costs without clear victory could hurt midterms. Creates Trump incentive for quick settlement or clear disengagement. Key metric: polling on war handling.",
      urgency: "Medium",
    },
    {
      signal: "IAEA verification access — scope and timeline agreement",
      timing: "4-8 weeks",
      implication: "Technical details of verification (which sites, when, what inspections) are the nuts and bolts of any deal. Agreement unlocks sanctions relief. Deadlock maintains frozen conflict.",
      urgency: "High",
    },
  ],
  marketPositioning: [
    {
      asset: "Brent Crude",
      stance: "TACTICALLY SHORT — fade ceasefire rally",
      color: "#ef4444",
      rationale: "Oil fell from $109 peak to $80 on ceasefire, but markets may be pricing in full normalization too quickly. Verification deadlock likely maintains partial Hormuz restrictions. Fair value probably $85-90. Short positions sizing for 25% ceasefire breakdown risk.",
    },
    {
      asset: "Gold",
      stance: "REDUCE",
      color: "#f59e0b",
      rationale: "Safe-haven bid diminished by ceasefire. But nuclear proliferation risk (4% scenario) and potential war resumption (25% scenario) justify small hedge position. Trim from crisis levels but maintain core holding.",
    },
    {
      asset: "US Treasuries (10Y)",
      stance: "HOLD",
      color: "#f59e0b",
      rationale: "Ceasefire reduces geopolitical premium but verification uncertainty maintains some safe-haven bid. Neutral weight appropriate. Watch for selloff if oil falls further (reflationary expectations diminish).",
    },
    {
      asset: "USD (DXY)",
      stance: "WEAK HOLD",
      color: "#f59e0b",
      rationale: "Ceasefire reduces oil-driven inflation pressure, potentially allowing Fed pause. $200B war funding overhang removed but $50B monitoring allocation remains. Modest negative bias as geopolitical premium fades.",
    },
    {
      asset: "US Equities (S&P 500)",
      stance: "CAUTIOUS ADD",
      color: "#10b981",
      rationale: "Ceasefire removes tail risk of $150 oil and regional conflagration. Settlement scenario (35%) supports continued rally. But 25% breakdown risk requires position sizing. Moderate overweight with tight stops.",
    },
    {
      asset: "Defense Sector (LMT, RTX, NOC)",
      stance: "REDUCE",
      color: "#ef4444",
      rationale: "$200B funding request shelved; ceasefire reduces near-term weapons consumption. Settlement scenario removes major defense tailwind. Trim to market weight, maintain exposure for breakdown risk.",
    },
    {
      asset: "Gulf State Equities / EM MENA",
      stance: "SELECTIVE RECOVERY",
      color: "#10b981",
      rationale: "Kuwait infrastructure rebuilding; UAE gas production resuming. Ceasefire allows gradual re-entry to previously beaten-down names. Start with infrastructure/utilities; avoid energy for now (oil price normalization headwind).",
    },
  ],
  probabilityUpdate: "Updated April 25: Negotiated Settlement 35% / Ceasefire Collapse 25% / Frozen Conflict 28% / Iranian Domestic Upheaval 8% / Nuclear Proliferation Crisis 4%. The April 8 ceasefire removed the immediate April 6 infrastructure-strike trigger; the next probability mover is verification sequencing in Qatar/Pakistan mediation and whether Hormuz restrictions normalize.",
  conviction: "Medium-High",
  nextReview: "24-72 hours, or immediately on verification-access, Hormuz, Houthi, or ceasefire-violation signals.",
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
    date: "2026-04-21",
    time: "Post-market ET",
    quote: "I have directed the Military to continue the Blockade, and to extend the Ceasefire, until such time as Iran submits a unified proposal.",
    context: "Project-internal Alpha reanalysis signal used to repair the missed geo reanalysis; marks the shift from strike deadline to blockade leverage.",
    signalType: "diplomatic",
    marketImpact: "Risk assets treated the ceasefire extension as positive, but oil retained a blockade premium.",
    scenarioImplication: "Raises Frozen Conflict and Negotiated Settlement; lowers immediate infrastructure-strike risk.",
    verified: false,
  },
  {
    actor: "Iran Foreign Ministry",
    role: "Official Statement",
    platform: "State Media",
    date: "2026-04-22",
    time: "N/A",
    quote: "Iran will not negotiate under the shadow of threats or while an illegal blockade remains in place.",
    context: "Project-internal Alpha reanalysis signal describing the core talks impasse.",
    signalType: "escalatory",
    marketImpact: "Maintains oil and shipping-risk premium despite the ceasefire.",
    scenarioImplication: "Raises Frozen Conflict; settlement needs either partial blockade easing or Iran accepting talks despite blockade.",
    verified: false,
  },
  {
    actor: "Pakistan Mediators",
    role: "Ceasefire broker",
    platform: "Islamabad Channel",
    date: "2026-04-08",
    time: "Evening local",
    quote: "Representative paraphrase: a ceasefire framework has been accepted and destructive strikes scheduled for tonight are being held off.",
    context: "Project-internal signal: Pakistan-mediated ceasefire averted the April 6 infrastructure strike path.",
    signalType: "de-escalatory",
    marketImpact: "Reduced immediate oil-spike risk and triggered relief in exposed equities.",
    scenarioImplication: "Shows both sides can swerve in the chicken game; raises Negotiated Settlement probability.",
    verified: false,
  },
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
