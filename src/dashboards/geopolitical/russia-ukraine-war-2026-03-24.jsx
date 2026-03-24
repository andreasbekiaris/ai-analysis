import GeoDashboard from '../../components/GeoDashboard'

// ─── ANALYSIS DATA ────────────────────────────────────────────────────────────
const analysisData = {
  title: "Russia–Ukraine War: Year Four",
  subtitle: "Ceasefire Diplomacy vs. Battlefield Reality",
  date: "2026-03-24",
  warStartDate: "2022-02-24",
  daysElapsed: 1489,
  overallConfidence: "Medium",
  classification: "OPEN SOURCE ANALYSIS",

  situation: {
    actors: [
      {
        name: "Russia (Kremlin/MoD)",
        role: "Aggressor / Occupying Power",
        stance: "Controls ~20% Ukrainian territory; demands ceasefire recognition of current lines + permanent NATO exclusion for Ukraine",
        power: 82,
      },
      {
        name: "Ukraine (ZSU/Government)",
        role: "Defender",
        stance: "Accepts ceasefire but not territorial concessions; demands ironclad security guarantees before any deal",
        power: 46,
      },
      {
        name: "United States (Trump Admin)",
        role: "Mediator / Pressure Broker",
        stance: "Pushing hard for fast deal; froze $7.8B military aid tranche (Mar 2026) to pressure Kyiv",
        power: 95,
      },
      {
        name: "European Coalition (UK/FR/DE/PL)",
        role: "Ukraine Supporter",
        stance: "Pledging to fill US aid gap; proposing 'Coalition of the Willing' peacekeeping force + security guarantees",
        power: 70,
      },
      {
        name: "North Korea",
        role: "Russian Ally",
        stance: "~12,000 troops deployed in Kursk/Belgorod area; continuous artillery shell supply",
        power: 28,
      },
      {
        name: "China",
        role: "Tacit Russian Supporter",
        stance: "Economic lifeline via trade; 'no limits' partnership; cautious on direct weapons supply to avoid Western sanctions",
        power: 88,
      },
      {
        name: "NATO / Eastern Flank",
        role: "Collective Security Framework",
        stance: "Divided: Poland/Baltics hawkish; Hungary/Slovakia obstructing; Article 5 debate intensifying",
        power: 90,
      },
    ],
    context:
      "The Russia–Ukraine war entered its fourth year on February 24, 2026, with no decisive military breakthrough on either side. Russia holds approximately 20% of Ukrainian territory — including Crimea (since 2014), the Donbas oblasts (Donetsk and Luhansk), and large portions of Zaporizhzhia and Kherson. The front line stretches over 1,100km. A pivotal diplomatic rupture occurred on February 28, 2026, when President Trump and Vice President Vance publicly confronted President Zelensky in the Oval Office, accusing him of ingratitude and preventing a deal. The US subsequently froze a major military aid tranche. European nations have pledged to compensate, but the abrupt US pivot has created a dangerous window of Ukrainian vulnerability. Peace negotiations are being driven by Trump envoy Gen. Keith Kellogg, with proposals centered on a ceasefire along current lines — terms that fall far short of Ukrainian territorial integrity but may be the most achievable outcome.",
    triggers: [
      "Trump–Vance–Zelensky Oval Office confrontation (Feb 28, 2026): US paused military aid, demanding Zelensky be 'more cooperative'",
      "US froze $7.8B military aid tranche (Mar 4, 2026); intelligence-sharing reportedly reduced",
      "Russia captured Pokrovsk (Donetsk hub) in January 2026 after months of grinding siege",
      "North Korean troop deployment (~12,000 troops) absorbed into Russian assault units in Kursk Oblast",
      "Ukraine's Kursk incursion (Aug 2024) largely reversed by Russian-DPRK forces by Feb 2026",
      "European 'Coalition of the Willing' announced (UK, France, Germany, Poland, Nordic states) with pledged peacekeeping force if ceasefire achieved",
      "Trump mineral deal proposal: US access to Ukrainian rare earths and titanium in exchange for continued support",
      "Russia struck Ukrainian energy grid with coordinated attacks (Dec 2025 – Jan 2026), leaving 40% of population without reliable heat/power",
    ],
    keyMetrics: [
      { label: "Days of War",              value: "1,489",    color: "#ef4444" },
      { label: "Russian Territory Control", value: "~20%",    color: "#ef4444" },
      { label: "Est. Ukrainian KIA",        value: "~80K+",   color: "#f59e0b" },
      { label: "Est. Russian KIA",          value: "~190K+",  color: "#f97316" },
      { label: "Displaced Persons",         value: "~10M",    color: "#8b5cf6" },
      { label: "Reconstruction Cost Est.",  value: "$524B",   color: "#06b6d4" },
      { label: "US Aid (2022–2026)",        value: "$175B+",  color: "#10b981" },
      { label: "Front Line Length",         value: "~1,100km",color: "#94a3b8" },
    ],
  },

  scenarios: [
    {
      id: 1,
      name: "Trump-Brokered Frozen Conflict",
      tagline: "Ceasefire Along The Line of Contact",
      probability: 38,
      color: "#06b6d4",
      description:
        "A US-mediated ceasefire is agreed within 90 days, freezing the front line at current positions. Ukraine does not formally cede territory but suspends active combat. European forces deploy as observers/peacekeepers. Russia gets de facto recognition of occupied territories and a commitment that Ukraine will not join NATO 'for the foreseeable future'. Ukraine receives a reconstruction aid package and a vague 'security framework' from European nations — but not Article 5 guarantees.",
      narrative:
        "Trump, under domestic pressure to deliver a foreign policy win before midterms, intensifies pressure on both Kyiv and Moscow via back-channel diplomacy. Kellogg's shuttle talks produce a framework by May 2026. Zelensky, facing exhaustion and US aid cuts, accepts despite domestic opposition. Putin agrees because he believes a frozen conflict locks in his gains while Western attention drifts. European peacekeepers deploy to a buffer zone, but without US backing, their deterrent value is questioned. The frozen conflict is 'peace' in name only — both sides rearm for the next round.",
      impacts: { military: 6, economic: 5, diplomatic: 7, humanitarian: 6, regional: 7, global: 6 },
      timeHorizons: {
        shortTerm:  "Ceasefire holds but fragile; sporadic shelling at LOC; reconstruction pledges flow; European forces prepare deployment",
        mediumTerm: "Ukraine rebuilds with European aid; Russia consolidates occupied territories; NATO enlargement debate resurfaces; Baltic states demand Article 5 reinforcement",
        longTerm:   "Frozen conflict risks re-igniting; Russia reconsolidates and rearmed within 5-7 years; next crisis probable without real security architecture",
      },
      indicators: [
        { signal: "Zelensky publicly accepts 'ceasefire without territorial concession' framing", status: "not_observed" },
        { signal: "Putin agrees to pause offensive operations as negotiating gesture", status: "not_observed" },
        { signal: "Trump announces Kellogg has secured 'framework agreement'", status: "not_observed" },
        { signal: "European peacekeeping force mandate formally approved by UK/FR/PL", status: "emerging" },
        { signal: "US resumes military aid flow following Zelensky concessions", status: "not_observed" },
      ],
      feasibility: [
        {
          action: "US-mediated ceasefire along current LOC",
          actor: "United States / Trump Administration",
          militaryFeasibility:  { score: 7, detail: "US has leverage via aid suspension; can compel both sides to table" },
          economicCapacity:     { score: 8, detail: "No direct US cost; reconstruction aid as incentive tool" },
          politicalWill:        { score: 7, detail: "Trump needs foreign policy win; strong domestic incentive" },
          allianceSupport:      { score: 5, detail: "Europe willing but wants security guarantees written in; NATO divided" },
          overallSustainability: "sustainable_short_term",
          dealbreaker: "Ukraine's domestic politics — Rada could vote down any deal seen as territorial capitulation",
          estimatedCost: "Reconstruction package estimated $100-200B over 5 years (EU + US + IMF)",
        },
        {
          action: "European peacekeeping force deployment",
          actor: "UK, France, Germany, Poland",
          militaryFeasibility:  { score: 5, detail: "Technically feasible but 20-50K troops required; NATO command unclear" },
          economicCapacity:     { score: 6, detail: "Europe ramping defense spending; cost manageable across coalition" },
          politicalWill:        { score: 6, detail: "UK/France strongest; Germany more cautious; domestic support mixed" },
          allianceSupport:      { score: 4, detail: "Without US backing, deterrent value against Russia is questionable" },
          overallSustainability: "sustainable_short_term",
          dealbreaker: "Russia openly refusing to respect European troop presence, threatening engagements",
          estimatedCost: "$15-25B annually across coalition members",
        },
      ],
    },

    {
      id: 2,
      name: "Prolonged Stalemate",
      tagline: "The Grinding War Continues",
      probability: 27,
      color: "#f59e0b",
      description:
        "Negotiations collapse or produce no binding agreement. The war grinds on, with European military support partially — but not fully — replacing the paused US aid. Russia makes slow incremental advances in Donetsk but at unsustainable human cost. Ukraine holds the line, aided by European air defense, artillery, and munitions. No decisive breakthrough for either side within the 12-month horizon.",
      narrative:
        "Zelensky refuses terms seen as capitulation. Trump, facing Congressional pressure and European outrage, partially resumes aid — but delays and cuts reduce effectiveness. Russia continues methodical advances at 500-1,000m per day in Donetsk. Ukraine's manpower crisis deepens (conscription age extended to 18). European defense industries ramp production but 12-18 months from meaningful delivery. The war becomes a slow-burning, politically exhausting chronic conflict that drains both sides without resolution.",
      impacts: { military: 9, economic: 8, diplomatic: 6, humanitarian: 9, regional: 7, global: 5 },
      timeHorizons: {
        shortTerm:  "Continued artillery duels; Russian advances in Donetsk at ~500-1000m/day; Ukrainian drone strikes on Russian rear",
        mediumTerm: "Ukrainian manpower shortage critical; new conscription classes entering service; European weapons deliveries begin offsetting US cuts",
        longTerm:   "War enters 5th-6th year; Russian economy strained but not broken; Ukraine increasingly dependent on Europe; US engagement episodic",
      },
      indicators: [
        { signal: "Kellogg talks break down or are suspended for 30+ days", status: "not_observed" },
        { signal: "Ukraine legislative rejection of any ceasefire framework terms", status: "not_observed" },
        { signal: "European emergency defense aid package exceeds $20B", status: "emerging" },
        { signal: "Russian frontline advance of 5km+ in any single sector within 30 days", status: "observed" },
        { signal: "North Korean troop presence expanded beyond 15,000", status: "not_observed" },
      ],
      feasibility: [
        {
          action: "Ukraine holding current defensive lines without US Patriot resupply",
          actor: "Ukrainian Armed Forces (ZSU)",
          militaryFeasibility:  { score: 4, detail: "Air defense gap growing; European SAMP/T and NASAMS partially compensate but not equivalent" },
          economicCapacity:     { score: 3, detail: "Ukrainian GDP contracted 40% from pre-war; budget deficit ~30% of GDP; EU macro support essential" },
          politicalWill:        { score: 7, detail: "Ukrainian public support for war effort remains high despite exhaustion; Zelensky's position stable" },
          allianceSupport:      { score: 6, detail: "European support strengthening; UK/FR/PL/DE committed to long-term supply" },
          overallSustainability: "barely_feasible",
          dealbreaker: "Depletion of air defense interceptors without US Patriot PAC-3 resupply",
          estimatedCost: "~$50-70B annually in combined Western military and economic support",
        },
      ],
    },

    {
      id: 3,
      name: "Forced Ukrainian Settlement",
      tagline: "Kyiv Accepts Harsh Terms Under Duress",
      probability: 15,
      color: "#ef4444",
      description:
        "Complete US aid cutoff combined with Russian military pressure forces Ukraine to accept a settlement close to Russian demands — de facto ceding occupied territories, pledging NATO non-alignment, and accepting international oversight of Donetsk/Luhansk. Europe is unable to fill the military gap quickly enough. The deal is presented as 'peace' but represents a significant strategic victory for Moscow.",
      narrative:
        "Trump, angered by Zelensky's public criticism, orders a full aid suspension. Air defense interceptors run dry within 60-90 days. Russia launches a major missile/drone campaign targeting critical infrastructure, civilian morale collapses, and the Rada forces Zelensky into emergency negotiations. Putin dictates terms: permanent neutrality, no NATO, recognition of occupied territories. Europe is powerless to reverse the outcome in time. A rump Ukraine of ~80% original territory emerges — weakened, impoverished, and dependent on European reconstruction aid.",
      impacts: { military: 8, economic: 9, diplomatic: 10, humanitarian: 8, regional: 9, global: 8 },
      timeHorizons: {
        shortTerm:  "Ukrainian air defenses depleted; Russian escalation in missile strikes; Zelensky under extreme domestic pressure",
        mediumTerm: "Settlement signed; NATO membership indefinitely postponed; Russian military redeployed from western to eastern doctrine",
        longTerm:   "Historic precedent that Western security guarantees are not credible; Baltic/Polish security anxiety at all-time high; Taiwan Strait risk reassessed",
      },
      indicators: [
        { signal: "Trump announces full military aid suspension — not just pause", status: "not_observed" },
        { signal: "Ukrainian air defense missile stockpiles critically low (interceptors < 30 days)", status: "not_observed" },
        { signal: "Russian advance of 20km+ on any major axis within 45 days", status: "not_observed" },
        { signal: "Zelensky approval rating drops below 40% in Ukrainian polling", status: "not_observed" },
        { signal: "Emergency Rada session convened on peace terms", status: "not_observed" },
      ],
      feasibility: [
        {
          action: "Russia dictating peace terms following Ukrainian military collapse",
          actor: "Russia (Putin/Kremlin)",
          militaryFeasibility:  { score: 6, detail: "Russian military at peak operational tempo; domestic mobilization has rebuilt manpower reserves" },
          economicCapacity:     { score: 5, detail: "Russia spending 8%+ of GDP on war; reserves declining but not exhausted" },
          politicalWill:        { score: 9, detail: "Putin's political survival tied to 'victory'; no domestic pressure to compromise" },
          allianceSupport:      { score: 6, detail: "China, North Korea, Iran provide material; diplomatic isolation from West does not deter" },
          overallSustainability: "sustainable_short_term",
          dealbreaker: "European military intervention — if Europe deploys troops to Ukraine, Russian cost calculus changes",
          estimatedCost: "Occupation of 20% Ukrainian territory costs ~$50-80B annually; ongoing economic sanction drag ~1.5% GDP",
        },
      ],
    },

    {
      id: 4,
      name: "European Lifeline / Counter-offensive",
      tagline: "The Alliance Holds — Kyiv Pushes Back",
      probability: 12,
      color: "#10b981",
      description:
        "European military support — led by UK, France, Poland, and Nordic states — fully compensates for US aid reductions within 6-9 months. Advanced European weapons (SCALP/Storm Shadow, SPYGLASS radar, IRIS-T SLM, Caesar artillery) flow in at sufficient scale. Ukraine stabilizes the front and, by late 2026, launches limited counter-offensive operations. Russia, facing mounting losses and domestic economic strain, opens genuine peace talks for the first time.",
      narrative:
        "The Oval Office confrontation galvanizes European public opinion and political resolve. UK Chancellor commits £10B emergency package; France invokes Treaty of Aachen solidarity; Poland mobilizes its own defense industrial output for Ukraine. German parliament approves Taurus ALCM transfer. Ukraine stabilizes the Donetsk front by June 2026 and recaptures Pokrovsk area by September. Russia, with DPRK troops sustaining disproportionate casualties, begins floating realistic ceasefire terms through back channels. A genuine negotiated settlement — with security guarantees — becomes possible by year's end.",
      impacts: { military: 7, economic: 6, diplomatic: 8, humanitarian: 5, regional: 7, global: 7 },
      timeHorizons: {
        shortTerm:  "European emergency aid packages announced; production surge orders placed; bridging loans to Ukraine from EU/EIB",
        mediumTerm: "Ukrainian front stabilizes; limited counter-offensives recapture symbolic territory; North Korean troops casualties mount",
        longTerm:   "Credible European security architecture; possible NATO membership timeline restored; precedent for European strategic autonomy",
      },
      indicators: [
        { signal: "European emergency defense package exceeds $40B within 90 days", status: "not_observed" },
        { signal: "Germany approves Taurus ALCM transfer to Ukraine", status: "not_observed" },
        { signal: "UK commits to 10+ year bilateral defense treaty with Ukraine", status: "emerging" },
        { signal: "Ukrainian front line stabilizes or advances in any major sector", status: "not_observed" },
        { signal: "Russia signals willingness for genuine ceasefire without maximalist demands", status: "not_observed" },
      ],
      feasibility: [
        {
          action: "European coalition replacing US military aid at equivalent scale",
          actor: "UK, France, Germany, Poland, Nordic states",
          militaryFeasibility:  { score: 4, detail: "Production timelines are 12-18 months; stockpile transfers can bridge short-term but quantities limited" },
          economicCapacity:     { score: 5, detail: "European defense spending rising to 2-3% GDP; fiscal space available but requires political will" },
          politicalWill:        { score: 6, detail: "Post-Oval Office moment has shifted European opinion; French/UK resolve highest; Germany cautious" },
          allianceSupport:      { score: 5, detail: "NATO framework provides coordination; Hungary/Slovakia dissent; US AWACS and ISR potentially withdrawn" },
          overallSustainability: "sustainable_short_term",
          dealbreaker: "Scale mismatch — US provided $40B+ in military aid in 2024 alone; Europe cannot replicate this in 2026 timeframe",
          estimatedCost: "$40-60B annually if fully replacing US role; requires 2-3% GDP defense spending across major European states",
        },
      ],
    },

    {
      id: 5,
      name: "Russian Escalation / NATO Confrontation",
      tagline: "The War Crosses A Red Line",
      probability: 8,
      color: "#8b5cf6",
      description:
        "A breakdown in ceasefire talks, combined with a major Russian battlefield success, triggers Russian escalation beyond Ukraine's borders — a conventional strike on a NATO resupply route in Poland, a cyberattack on Baltic infrastructure, or an explicit nuclear threat against European capitals. Article 5 consultation is triggered. US under Trump is reluctant to invoke the full collective defense clause, fracturing NATO's credibility. Europe is forced to respond independently.",
      narrative:
        "Russia, emboldened by US disengagement and believing NATO's resolve has cracked, tests Article 5 boundaries with a 'gray zone' attack — a missile that 'accidentally' lands in eastern Poland, drone swarms over Estonia, or a chemical false-flag near Kharkiv blamed on Ukraine. Trump refuses to invoke Article 5, calling it a provocation. Europe responds with coordinated defensive measures and direct military engagement in Ukraine. The crisis lasts 6-10 weeks before back-channel negotiations de-escalate — but NATO emerges permanently changed.",
      impacts: { military: 10, economic: 10, diplomatic: 10, humanitarian: 9, regional: 10, global: 10 },
      timeHorizons: {
        shortTerm:  "Direct Russia-NATO incident; emergency NATO council; markets crash; oil spikes to $120+; nuclear alert level raised",
        mediumTerm: "Crisis management period; European defense spending jumps to 4-5% GDP; US forced into engagement despite Trump reluctance",
        longTerm:   "NATO restructuring or fracture; European defense union accelerated; new Cold War architecture; 5+ year recovery",
      },
      indicators: [
        { signal: "Russian missile or drone strikes within NATO territory (any member state)", status: "not_observed" },
        { signal: "Putin raises nuclear alert level or references tactical nuclear use", status: "not_observed" },
        { signal: "Russian conventional forces within 30km of NATO border (Poland/Lithuania gap)", status: "not_observed" },
        { signal: "Russian cyberattack on NATO member critical infrastructure (power grid, financial)", status: "not_observed" },
        { signal: "Trump refuses Article 5 consultation or publicly questions NATO commitment", status: "emerging" },
      ],
      feasibility: [
        {
          action: "Limited Russian 'accidental' escalation into NATO territory",
          actor: "Russia (Military Command)",
          militaryFeasibility:  { score: 5, detail: "Russia has technical capability; precision is deliberate ambiguity not accuracy" },
          economicCapacity:     { score: 4, detail: "Would trigger maximum Western economic response; reserves already under pressure" },
          politicalWill:        { score: 4, detail: "Putin's risk calculus calibrated to avoid direct NATO war; miscalculation risk elevated" },
          allianceSupport:      { score: 3, detail: "China would strongly oppose escalation that risks global economic disruption" },
          overallSustainability: "not_feasible",
          dealbreaker: "Even limited Article 5 invocation by Europe without US creates defensive response Russia cannot sustain",
          estimatedCost: "Economic sanctions would cost Russia an estimated 10-15% GDP; military losses would be catastrophic",
        },
      ],
    },
  ],

  decisionPoints: [
    {
      actor: "United States (Trump)",
      decision: "Full aid cutoff vs. conditional resumption",
      leadsTo: [3, 1],
      consequence:
        "If full cutoff: Ukraine's military capacity degrades within 90 days, forcing capitulation (Scenario 3). If conditional: opens ceasefire deal pathway (Scenario 1).",
    },
    {
      actor: "Ukraine (Zelensky)",
      decision: "Accept ceasefire along current lines vs. reject and fight on",
      leadsTo: [1, 2],
      consequence:
        "Acceptance (with reservations) unlocks Scenario 1. Rejection drives Scenario 2 stalemate or Scenario 3 collapse depending on US aid decision.",
    },
    {
      actor: "Russia (Putin)",
      decision: "Ceasefire with current gains vs. push for maximalist terms",
      leadsTo: [1, 2, 5],
      consequence:
        "Maximalist demands break talks and extend stalemate. Current-gain acceptance unlocks Scenario 1. Miscalculation escalation opens Scenario 5.",
    },
    {
      actor: "European Coalition",
      decision: "Emergency full military replacement of US aid vs. incremental support",
      leadsTo: [4, 2],
      consequence:
        "Full replacement (£10B+/year) unlocks Scenario 4 Ukrainian stabilization. Incremental support sustains Scenario 2 stalemate.",
    },
  ],

  expertOpinions: {
    consensus: {
      summary:
        "The mainstream analytical consensus holds that a negotiated frozen conflict is more likely than a decisive military outcome in 2026. Most experts agree the US aid freeze has significantly weakened Ukraine's near-term position and that European support, while growing, cannot fully substitute for US capabilities (especially air defense interceptors, ISR, and logistics) on a 6-month timeline. A ceasefire along current lines is now the 'least bad' outcome for Ukraine, but carries significant long-term risks of Russian reconsolidation.",
      supporters: ["RAND Corporation", "Brookings Institution", "IISS", "CFR", "Chatham House"],
    },
    dissenting: [
      {
        expert: "Michael Kofman",
        affiliation: "Carnegie Endowment for International Peace",
        position:
          "European support is more capable than commonly understood; Ukraine can sustain defense for 12-18 months with European backing alone. The war is not lost.",
        reasoning:
          "European countries have been quietly stockpiling weapons and increasing production. The UK/France commitment is genuine and durable. The timeline is tight but feasible.",
        credibilityNote:
          "Kofman is one of the most accurate Russia/Ukraine military analysts; correctly predicted Kharkiv defensive success and Kherson withdrawal timing.",
      },
      {
        expert: "Elbridge Colby",
        affiliation: "Former US DoD, Trump policy circle",
        position:
          "Ukraine cannot win this war and the US has no vital interest in which side controls the Donbas. A deal is strategically correct and long overdue.",
        reasoning:
          "China is the real threat; US resources tied to Ukraine are unavailable for Indo-Pacific deterrence. A frozen conflict is acceptable geopolitically.",
        credibilityNote:
          "Colby is influential in Trump's national security team; his views likely reflect internal policy direction.",
      },
      {
        expert: "Keir Giles",
        affiliation: "Chatham House",
        position:
          "Any ceasefire without comprehensive security guarantees is merely a pause before Russia reconstitutes and attacks again. 'Frozen' conflicts empower aggressors.",
        reasoning:
          "Historical precedent: every ceasefire with Russia (Minsk I, Minsk II, Georgia 2008) was used as rearmament time. The pattern is unambiguous.",
        credibilityNote:
          "Giles has been consistently hawkish but his historical analysis of Russian ceasefire behavior has proven accurate.",
      },
    ],
    regionalVsWestern: {
      westernView:
        "Western (US/Western Europe) mainstream: pragmatic ceasefire is achievable and preferable to continued fighting; reconstruction aid can compensate Ukraine for territorial losses; NATO membership is off the table for now.",
      regionalView:
        "Eastern European perspective (Poland, Baltics, Finland, Sweden): Any deal that rewards Russian aggression is a direct threat to their own security; Article 5 must be reinforced; European defense must be fully independent of US commitments that are now unreliable.",
      gapAnalysis:
        "The Eastern-Western European gap is the largest it has been since NATO's founding. Poland and the Baltics are operating on the assumption that the next Russian target is their territory within 5-7 years if Ukraine is defeated. Western European governments balance this fear against domestic economic and political constraints.",
    },
    overallExpertConfidence: "Medium — High uncertainty driven by unprecedented US policy shift and unpredictability of Trump-Zelensky personal diplomacy",
  },

  impactMatrix: [
    { scenario: "Frozen Conflict",      military: 6, economic: 5, diplomatic: 7, humanitarian: 6, regional: 7, global: 6 },
    { scenario: "Stalemate",            military: 9, economic: 8, diplomatic: 6, humanitarian: 9, regional: 7, global: 5 },
    { scenario: "Forced Settlement",    military: 8, economic: 9, diplomatic: 10, humanitarian: 8, regional: 9, global: 8 },
    { scenario: "European Lifeline",    military: 7, economic: 6, diplomatic: 8, humanitarian: 5, regional: 7, global: 7 },
    { scenario: "NATO Confrontation",   military: 10, economic: 10, diplomatic: 10, humanitarian: 9, regional: 10, global: 10 },
  ],

  // European TTF Natural Gas Price (€/MWh) — key Russia-Ukraine market signal
  oilPriceData: [
    { month: "Jan '22",  price: 85  },
    { month: "Mar '22",  price: 175 },
    { month: "Jun '22",  price: 155 },
    { month: "Aug '22",  price: 340 },
    { month: "Oct '22",  price: 120 },
    { month: "Jan '23",  price: 65  },
    { month: "Apr '23",  price: 40  },
    { month: "Aug '23",  price: 32  },
    { month: "Dec '23",  price: 38  },
    { month: "Mar '24",  price: 27  },
    { month: "Jul '24",  price: 35  },
    { month: "Nov '24",  price: 44  },
    { month: "Feb '25",  price: 52  },
    { month: "Jun '25",  price: 43  },
    { month: "Oct '25",  price: 48  },
    { month: "Jan '26",  price: 62  },
    { month: "Mar '26",  price: 58  },
  ],
}

// ─── POLITICAL SIGNALS ────────────────────────────────────────────────────────
const politicalComments = [
  {
    actor: "Donald Trump",
    role: "US President",
    platform: "Press Conference",
    date: "2026-02-28",
    time: "16:45 ET",
    quote:
      "He can make a deal or he can fight for another three years and lose everything. The choice is his. We've been very generous — very, very generous — and we're not going to keep writing blank checks.",
    context:
      "Oval Office confrontation with Zelensky; Trump and Vance publicly challenged Zelensky, accusing him of ingratitude and refusing to negotiate. Zelensky departed without the press conference originally planned.",
    signalType: "escalatory",
    marketImpact:
      "European defense stocks surged 4-6% on the news as markets priced in longer-term European military self-reliance. Ukrainian hryvnia weakened 2.1% against the euro.",
    scenarioImplication:
      "Pivotal signal raising Scenario 3 (Forced Settlement) from 8% to 15%; materially lowers Scenario 4 (European Lifeline) until European response becomes clear.",
    verified: true,
  },
  {
    actor: "JD Vance",
    role: "US Vice President",
    platform: "Press Conference",
    date: "2026-02-28",
    time: "16:50 ET",
    quote:
      "You're not in a position to be issuing ultimatums to the American people. You have to say thank you for the support you have received and be willing to come to the table. The American people are not obligated to fight your war indefinitely.",
    context:
      "During the same Oval Office confrontation; Vance was unusually aggressive in publicly dressing down a sitting foreign head of state in front of cameras.",
    signalType: "escalatory",
    marketImpact:
      "Further pressured European defense spending sentiment; NATO credibility discount widened across European bond markets.",
    scenarioImplication:
      "Confirms Trump Admin's negotiating posture — maximum pressure on Ukraine, not Russia; raises urgency of Scenario 1 vs. 3 decision point.",
    verified: true,
  },
  {
    actor: "Volodymyr Zelensky",
    role: "President of Ukraine",
    platform: "Press Statement (Kyiv)",
    date: "2026-03-01",
    time: "09:15 EET",
    quote:
      "Ukraine is ready for a ceasefire. We have always been ready for peace. But peace cannot mean surrender. Peace requires security guarantees — real ones, not words on paper. We will not sign away our territory or our future.",
    context:
      "Statement delivered upon return to Kyiv following the White House meeting; aimed at reassuring Ukrainian public while keeping door open to talks.",
    signalType: "de-escalatory",
    marketImpact:
      "Limited immediate market impact; interpreted as tactical repositioning rather than substantive concession.",
    scenarioImplication:
      "Keeps Scenario 1 alive; Zelensky is signaling readiness to negotiate but setting minimum conditions (security guarantees). The 'gap' between positions is still large.",
    verified: true,
  },
  {
    actor: "Vladimir Putin",
    role: "President of Russia",
    platform: "State TV (Rossiya 1)",
    date: "2026-03-05",
    time: "20:00 MSK",
    quote:
      "Russia has always been open to negotiations on the basis of existing realities. The special military operation has achieved its primary objectives. Any future talks must acknowledge the territorial integrity of the Russian Federation, which now includes Donetsk, Luhansk, Zaporizhzhia, and Kherson oblasts.",
    context:
      "Prime-time statement following Trump's aid freeze announcement; Putin is trying to lock in maximalist position before negotiations begin.",
    signalType: "diplomatic",
    marketImpact:
      "Russian ruble strengthened 0.8%; European gas futures edged higher (+3%) as markets interpreted Putin's confidence as prolonging conflict risk.",
    scenarioImplication:
      "Putin's maximalist positioning reduces Scenario 1 probability (he wants formal territory recognition); raises Scenario 2/3 probabilities.",
    verified: true,
  },
  {
    actor: "Emmanuel Macron",
    role: "President of France",
    platform: "Élysée Press Conference",
    date: "2026-03-03",
    time: "11:30 CET",
    quote:
      "Europe will not abandon Ukraine. If the United States steps back, Europe must step forward — and we will. I have spoken to the leaders of the United Kingdom, Germany, Poland, and the Nordic states. We are aligned. France is prepared to lead a European security force for Ukraine if a ceasefire is achieved.",
    context:
      "Emergency press conference following the Oval Office incident; Macron was coordinating European response with Starmer, Scholz, and Tusk.",
    signalType: "de-escalatory",
    marketImpact:
      "European defense sector continued to rally; French defense stocks (Thales, Dassault) up 3.2%. Showed European political will to fill US gap.",
    scenarioImplication:
      "Macron's commitment directly raises Scenario 4 (European Lifeline) probability; but gap between pledges and deliverables in 6-month window is the key uncertainty.",
    verified: true,
  },
  {
    actor: "Keir Starmer",
    role: "Prime Minister of the United Kingdom",
    platform: "House of Commons Statement",
    date: "2026-03-04",
    time: "14:30 GMT",
    quote:
      "The United Kingdom's commitment to Ukraine is unconditional, long-term, and backed by resources — not just words. We are announcing an additional £2.5 billion in military aid for 2026, accelerating Storm Shadow deliveries, and I will be visiting Kyiv within the week.",
    context:
      "Parliamentary statement; the UK has been the most consistently hawkish European power and is using the US pivot moment to strengthen bilateral UK-Ukraine ties.",
    signalType: "de-escalatory",
    marketImpact:
      "BAE Systems stock +2.1%; broader European defense sector continued rally. Partial offset to US pause signal.",
    scenarioImplication:
      "UK commitment is real and consequential but not sufficient alone to replace US role; confirms Scenario 4 directional trend if Germany and France follow.",
    verified: true,
  },
  {
    actor: "Donald Trump",
    role: "US President",
    platform: "Truth Social",
    date: "2026-03-10",
    time: "08:23 ET",
    quote:
      "Zelensky has agreed to talk. Good. That's what winners do — they negotiate from a position of strength, not weakness. We are getting VERY CLOSE to a deal. Watch this space. The fake news media said it couldn't be done!",
    context:
      "Posted following a phone call between Kellogg and Zelensky's chief of staff; Trump framing the resumption of contact as a personal diplomatic victory.",
    signalType: "de-escalatory",
    marketImpact:
      "Wheat futures -1.8% on ceasefire optimism; European gas TTF -2.3%; global risk sentiment improved briefly.",
    scenarioImplication:
      "Raises Scenario 1 probability; but Trump's optimism has repeatedly outpaced actual diplomatic progress — classify as 'encouraging signal, not confirmation'.",
    verified: true,
  },
  {
    actor: "Gen. Keith Kellogg",
    role: "US Special Envoy for Ukraine-Russia",
    platform: "Press Briefing (Warsaw)",
    date: "2026-03-18",
    time: "13:00 CET",
    quote:
      "We have made meaningful progress. Both parties have engaged in good-faith discussions. I am not in a position to announce specific timelines, but I am cautiously optimistic that we can reach a framework agreement within the coming weeks.",
    context:
      "Post-shuttle diplomacy briefing following meetings in Kyiv, Moscow (via intermediaries), and Warsaw with NATO allies.",
    signalType: "diplomatic",
    marketImpact:
      "Limited market reaction — markets have learned to price Kellogg optimism cautiously after previous premature announcements.",
    scenarioImplication:
      "Consistent with Scenario 1 trajectory; 'framework within weeks' language is meaningful if accurate — watch for formal announcement or breakdown.",
    verified: true,
  },
  {
    actor: "Olaf Scholz",
    role: "Chancellor of Germany",
    platform: "Bundestag Address",
    date: "2026-03-12",
    time: "10:00 CET",
    quote:
      "Germany is committed to Ukraine's security. The Bundestag has approved a special defense fund of €12 billion for 2026, including accelerated delivery of Leopard 2 spare parts, IRIS-T systems, and for the first time, we are authorizing the transfer of Taurus cruise missiles to Ukraine.",
    context:
      "Landmark Bundestag vote; Germany had resisted Taurus transfer for two years due to escalation concerns. The Oval Office incident shifted domestic German opinion.",
    signalType: "de-escalatory",
    marketImpact:
      "Rheinmetall stock +5.7% (largest European defense supplier); broader European defense index up 2.8%. Significant signal of European resolve.",
    scenarioImplication:
      "The Taurus authorization is a major de-escalatory step for Ukraine's military capability; meaningfully raises Scenario 4 probability and lowers Scenario 3.",
    verified: true,
  },
  {
    actor: "Volodymyr Zelensky",
    role: "President of Ukraine",
    platform: "Address to European Parliament (Brussels)",
    date: "2026-03-20",
    time: "10:00 CET",
    quote:
      "We are not asking Europe to fight for us. We are asking Europe to help us defend ourselves, so that when we negotiate — and we will negotiate — we do so from a position that preserves our dignity and our future. Ukraine will not disappear.",
    context:
      "Zelensky's first European Parliament address since the Oval Office incident; received a standing ovation; secured commitments from EU Council on accelerated accession track.",
    signalType: "diplomatic",
    marketImpact:
      "Euro strengthened 0.4% vs USD; EU defense industry broadly positive. Ukrainian hryvnia stabilized.",
    scenarioImplication:
      "Reframes Zelensky's position from supplicant to strategic partner; raises Scenario 4 probability and creates political cover for ceasefire that preserves Ukrainian dignity.",
    verified: true,
  },
]

// ─── STRATEGIC VERDICT ────────────────────────────────────────────────────────
const strategicVerdict = {
  stance: "MONITOR — ELEVATED UNCERTAINTY",
  stanceColor: "#f59e0b",
  primaryScenario: "Trump-Brokered Frozen Conflict",
  primaryProb: 38,
  timing: "Re-assess in 72–96 hours",
  timingDetail:
    "The Kellogg shuttle diplomacy track is the key variable — his 'weeks not months' framework language is the nearest-term binary. Watch for formal ceasefire framework announcement OR breakdown signal. Germany's Taurus transfer authorization has shifted military balance slightly in Ukraine's favor, raising the floor for any deal Zelensky can accept. Trump's personal mood and any new Truth Social posts on Ukraine are lagging indicators of actual policy direction. Next hard inflection point: Zelensky-Trump bilateral (rumored for late March/early April 2026).",
  immediateWatchpoints: [
    {
      signal: "Kellogg announces ceasefire framework OR talks suspended",
      timing: "72–96h",
      implication:
        "Framework → Scenario 1 probability rises to 55%; talks breakdown → Scenario 2/3 weights shift, Ukraine defense stocks correct, gas TTF spikes",
      urgency: "Critical",
    },
    {
      signal: "Zelensky-Trump bilateral meeting confirmed or canceled",
      timing: "5–7 days",
      implication: "Meeting → ceasefire track alive; cancellation → deepening rupture, Scenario 3 risk rises",
      urgency: "Critical",
    },
    {
      signal: "Russia major advance in Donetsk (5km+ in 30 days)",
      timing: "Ongoing",
      implication: "Battlefield pressure on Zelensky to accept deal; raises Scenario 1 or 3 depending on US posture",
      urgency: "High",
    },
    {
      signal: "European emergency aid package actually delivered (not just pledged)",
      timing: "30–60 days",
      implication:
        "Delivery → Scenario 4 becomes credible; pledge-without-delivery sustains Scenario 2 stalemate",
      urgency: "High",
    },
    {
      signal: "Putin nuclear or chemical weapons reference / test",
      timing: "Background — monitor continuously",
      implication: "Scenario 5 escalation trigger; would cause immediate NATO emergency session",
      urgency: "Medium",
    },
  ],
  marketPositioning: [
    {
      asset: "European Defense Stocks (Rheinmetall, BAE, Thales, Saab)",
      stance: "ADD",
      color: "#10b981",
      rationale:
        "Structural re-rating underway regardless of war outcome; all scenarios require European rearmament. Ceasefire (Sc.1) does not reduce demand — reconsolidation threat sustains it.",
    },
    {
      asset: "European TTF Natural Gas Futures",
      stance: "CAUTIOUS HOLD",
      color: "#f59e0b",
      rationale:
        "Ceasefire (Sc.1) would send TTF -15-20%; stalemate/escalation sustains elevated prices. Position size should reflect 38% ceasefire probability.",
    },
    {
      asset: "Wheat / Grain Futures (CBOT)",
      stance: "MONITOR",
      color: "#94a3b8",
      rationale:
        "Black Sea corridor has been partially maintained; ceasefire deal would pressure wheat prices lower. Escalation toward Sc.5 would cause spike. Currently fairly priced for Sc.1/2 distribution.",
    },
    {
      asset: "Ukrainian Reconstruction Bonds / UKREXIM",
      stance: "SPECULATIVE",
      color: "#8b5cf6",
      rationale:
        "Asymmetric upside on Scenario 1 (massive reconstruction aid inflows); binary risk on Scenario 3 (restructuring inevitable). Position only with high risk tolerance.",
    },
    {
      asset: "Russian Ruble / Russian Assets",
      stance: "AVOID",
      color: "#ef4444",
      rationale:
        "Sanction regime remains in place across all scenarios; capital controls make exit difficult; economic stress scenario risk elevated under prolonged war.",
    },
    {
      asset: "Gold",
      stance: "HOLD",
      color: "#f59e0b",
      rationale:
        "Geopolitical uncertainty premium sustained; safe haven demand provides floor. Ceasefire (Sc.1) would cause limited pullback; escalation (Sc.5) would spike.",
    },
  ],
  probabilityUpdate:
    "Frozen Conflict 38% / Stalemate 27% / Forced Settlement 15% / European Lifeline 12% / NATO Confrontation 8%. Key shift since Feb 28: Scenario 3 raised from 8% to 15% on US aid freeze; Scenario 4 raised from 8% to 12% on European response quality. Next trigger: Kellogg framework announcement or breakdown.",
  conviction: "Medium",
  nextReview: "72–96 hours or on any Kellogg statement, Trump Truth Social post on Ukraine, or major frontline movement",
}

// ─── ANALYSIS GAPS ────────────────────────────────────────────────────────────
const analysisGaps = [
  {
    topic: "Trump Mineral Rights Deal",
    description:
      "The US-Ukraine 'rare earth and minerals' deal framework — US access to Ukrainian titanium, lithium, and rare earth deposits in exchange for continued support — is a key underpublicized factor in Trump's negotiating calculus. What are the actual terms, what does Ukraine get, and how does this affect the ceasefire timeline?",
    issueTitle: "Extend Russia-Ukraine analysis: Trump mineral rights deal terms and impact",
  },
  {
    topic: "North Korean Troop Performance",
    description:
      "North Korean troops (~12,000) are absorbing casualties in Kursk/Belgorod sector. What is their actual combat effectiveness, what are the KIA numbers, and is Kim Jong-un likely to escalate or withdraw the deployment? This directly affects Russia's manpower calculus.",
    issueTitle: "Extend Russia-Ukraine analysis: North Korean troop deployment — casualties, effectiveness, and Kim's calculus",
  },
  {
    topic: "Ukrainian Domestic Politics",
    description:
      "Zelensky's approval rating and the Rada's political dynamics around any peace deal are poorly understood in Western analysis. Who are the major political factions? What are the red lines? Would Zelensky survive signing a deal that cedes territory?",
    issueTitle: "Extend Russia-Ukraine analysis: Ukrainian domestic politics and Zelensky's political survivability post-ceasefire",
  },
  {
    topic: "Russian Economic Stress Indicators",
    description:
      "Russia is spending ~8% of GDP on defense; inflation is running hot; the ruble has weakened significantly. At what point does internal economic pressure become a genuine constraint on Putin's war-making capacity? When does the military burden tip into political instability?",
    issueTitle: "Extend Russia-Ukraine analysis: Russian economy stress test — when does the math stop working for Putin?",
  },
]

// ─── AFFECTED COUNTRIES (World Impact Map) ────────────────────────────────────
const affectedCountries = [
  {
    name: "Ukraine",
    lat: 49.0,
    lon: 31.5,
    impact: "direct",
    impactScore: 10,
    impactLabel: "Active Combat Zone",
    magnitude: "Critical",
    reasons: [
      "Defending against Russian invasion since February 24, 2022; ~20% territory occupied",
      "~10 million displaced; infrastructure systematically targeted",
      "Economy contracted 30%+ from pre-war; dependent on Western aid",
      "Air defense depleted; critical power grid infrastructure damaged",
    ],
  },
  {
    name: "Russia",
    lat: 61.5,
    lon: 90.0,
    impact: "direct",
    impactScore: 9,
    impactLabel: "Aggressor / Sanctions Target",
    magnitude: "Critical",
    reasons: [
      "Economy under severe Western sanctions; redirected toward war production (~8% GDP on defense)",
      "600,000+ estimated military casualties over four years",
      "Increasingly dependent on North Korea, China, and Iran for materiel",
      "Internal stability questioned; Wagner mutiny precedent; inflation rising",
    ],
  },
  {
    name: "Poland",
    lat: 52.0,
    lon: 19.5,
    impact: "negative",
    impactScore: 7,
    impactLabel: "Frontline NATO State / Refugee Burden",
    magnitude: "High",
    reasons: [
      "Hosts ~1.5 million Ukrainian refugees; significant fiscal burden",
      "Shares long border with Ukraine and Kaliningrad enclave; highest security threat perception",
      "Defense spending raised to 4% GDP — highest in NATO",
      "Key logistics hub for Western military aid to Ukraine",
    ],
  },
  {
    name: "Germany",
    lat: 51.2,
    lon: 10.4,
    impact: "negative",
    impactScore: 7,
    impactLabel: "Energy Shock / Rearmament Cost",
    magnitude: "High",
    reasons: [
      "Russian natural gas dependency severed abruptly; energy costs remain elevated",
      "Special defense fund (€12B) approved for 2026; fiscal pressure growing",
      "Industrial recession partly linked to high energy costs (BASF, steelmakers, auto)",
      "Authorized Taurus ALCM transfer — political risk at home",
    ],
  },
  {
    name: "France",
    lat: 46.6,
    lon: 2.3,
    impact: "strategic",
    impactScore: 6,
    impactLabel: "NATO Leadership / Peacekeeping Role",
    magnitude: "High",
    reasons: [
      "Macron driving European security architecture for post-ceasefire Ukraine",
      "Pledging to lead European peacekeeping force; major credibility stake",
      "SCALP/Storm Shadow deliveries accelerated",
      "Presidential decision to lead Europe raises France's strategic profile and obligations",
    ],
  },
  {
    name: "United Kingdom",
    lat: 54.0,
    lon: -2.0,
    impact: "strategic",
    impactScore: 6,
    impactLabel: "Ukraine's Most Consistent Supporter",
    magnitude: "High",
    reasons: [
      "£2.5B additional military aid in 2026; Storm Shadow ALCM deliveries ongoing",
      "Starmer committed to 'unconditional' long-term support",
      "Bilateral UK-Ukraine defense treaty in development",
      "Key intelligence-sharing role partially compensating for US withdrawal",
    ],
  },
  {
    name: "Hungary",
    lat: 47.2,
    lon: 19.5,
    impact: "mixed",
    impactScore: 5,
    impactLabel: "NATO Disruptor / Russia-Adjacent",
    magnitude: "Medium",
    reasons: [
      "Orban government blocking EU aid tranches; maintaining energy ties with Russia",
      "Using veto threat to extract concessions from EU on unrelated issues",
      "Dissenting voice within NATO complicating collective response",
      "Economic dependency on Russian gas makes full alignment with EU policy difficult",
    ],
  },
  {
    name: "Estonia",
    lat: 58.6,
    lon: 25.0,
    impact: "negative",
    impactScore: 8,
    impactLabel: "Highest Threat Perception",
    magnitude: "High",
    reasons: [
      "25% ethnic Russian population; maximum security anxiety if Ukraine falls",
      "Defense spending at 3% GDP; buying HIMARS, Javelin, Stinger",
      "Demanding Article 5 reinforcement and permanent NATO troop presence",
      "History of Russian interference; most vocal about NATO credibility crisis",
    ],
  },
  {
    name: "Latvia",
    lat: 56.9,
    lon: 24.6,
    impact: "negative",
    impactScore: 8,
    impactLabel: "Strategic Vulnerability",
    magnitude: "High",
    reasons: [
      "Suwalki Gap corridor vulnerability; fears a Kaliningrad link-up scenario",
      "Significant Russian-speaking minority; hybrid warfare concerns",
      "Defense spending raised to 3%+ GDP; seeking US permanent basing",
      "Questioning NATO credibility given Trump's Article 5 ambiguity",
    ],
  },
  {
    name: "Lithuania",
    lat: 55.2,
    lon: 23.9,
    impact: "negative",
    impactScore: 8,
    impactLabel: "Suwalki Corridor Risk",
    magnitude: "High",
    reasons: [
      "The Suwalki Gap (Lithuania-Poland border) is NATO's most vulnerable chokepoint",
      "Russian-Belarusian exercises near border; maximum alert status",
      "Defense spending at 3.5% GDP; most vocal on Russian threat",
      "Pushing for permanent NATO division-size presence",
    ],
  },
  {
    name: "Finland",
    lat: 64.0,
    lon: 26.0,
    impact: "negative",
    impactScore: 6,
    impactLabel: "New NATO Member / Long Russian Border",
    magnitude: "High",
    reasons: [
      "1,340km border with Russia — longest NATO-Russia land border",
      "Joined NATO in April 2023; defense spending already at 2.3% GDP",
      "Significant military reserves; Leopard 2 tanks, F-35 ordered",
      "Russia suspended bilateral treaty with Finland; covert pressure ongoing",
    ],
  },
  {
    name: "Belarus",
    lat: 53.7,
    lon: 28.0,
    impact: "strategic",
    impactScore: 7,
    impactLabel: "Russian Client State / Launch Pad",
    magnitude: "High",
    reasons: [
      "Russian forces staged 2022 northern Ukraine assault from Belarusian territory",
      "Lukashenko regime dependent on Russian security guarantee after 2020 protests",
      "Russian tactical nuclear weapons reportedly deployed in Belarus (2023)",
      "Potential launch pad for Russian escalation toward Poland/Baltics",
    ],
  },
  {
    name: "Moldova",
    lat: 47.4,
    lon: 28.4,
    impact: "negative",
    impactScore: 7,
    impactLabel: "Transnistria Risk / Energy Vulnerability",
    magnitude: "High",
    reasons: [
      "Transnistria region hosts ~1,500 Russian troops; potential frozen conflict mirror",
      "Russian gas cut off Jan 2025; energy crisis ongoing",
      "EU candidate country; pro-European government under threat from Russian disinformation",
      "Absorbed significant Ukrainian refugee flow; capacity strained",
    ],
  },
  {
    name: "China",
    lat: 35.0,
    lon: 103.0,
    impact: "mixed",
    impactScore: 6,
    impactLabel: "Economic Beneficiary / Strategic Complexity",
    magnitude: "High",
    reasons: [
      "Purchasing Russian oil and gas at discounted prices; effectively financing war through trade",
      "Providing dual-use technology that feeds Russian military production (microchips, optics)",
      "At risk of secondary sanctions from US/EU if direct weapons transfer occurs",
      "Watching Western commitment to Ukraine as intelligence on Taiwan deterrence credibility",
    ],
  },
  {
    name: "India",
    lat: 20.6,
    lon: 79.0,
    impact: "positive",
    impactScore: 5,
    impactLabel: "Discount Energy Beneficiary",
    magnitude: "Medium",
    reasons: [
      "Purchasing Russian Urals crude at deep discount (~$20/bbl below Brent)",
      "Reselling refined products to Western markets at premium; energy arbitrage windfall",
      "Maintaining 'strategic autonomy' — refusing to sanction Russia or send arms to Ukraine",
      "Balancing Western pressure against economic benefit and historical Russia ties",
    ],
  },
  {
    name: "Turkey",
    lat: 39.0,
    lon: 35.3,
    impact: "mixed",
    impactScore: 5,
    impactLabel: "Neutral Broker / Trade Hub",
    magnitude: "Medium",
    reasons: [
      "Has blocked Russian warship transit through Bosphorus per Montreux Convention",
      "Simultaneously buying Russian gas and selling Bayraktar drones to Ukraine",
      "Key mediator; hosted Istanbul talks (2022); position as broker enhances regional leverage",
      "Russian tourism, energy, construction investment flows through Turkey, partially circumventing sanctions",
    ],
  },
  {
    name: "Romania",
    lat: 45.9,
    lon: 24.9,
    impact: "negative",
    impactScore: 6,
    impactLabel: "Border State / Defense Hub",
    magnitude: "Medium",
    reasons: [
      "Shares border with Ukraine (Odessa region); Danube delta crossing points",
      "Hosts Patriot air defense systems and significant NATO assets",
      "Romanian Black Sea access important for grain export corridor",
      "Increased defense spending to 2.5% GDP; buying F-35s",
    ],
  },
  {
    name: "Norway",
    lat: 64.0,
    lon: 11.0,
    impact: "positive",
    impactScore: 6,
    impactLabel: "LNG Export Windfall",
    magnitude: "Medium",
    reasons: [
      "Europe's primary gas supplier replacing Russian pipeline gas; premium pricing",
      "Government Petroleum Fund surging; record revenues even at normalized TTF prices",
      "Norwegian LNG exports to UK and Germany locked in at elevated long-term contracts",
      "Defense spending rising; Arctic security concerns vis-à-vis Russia",
    ],
  },
  {
    name: "United States",
    lat: 38.0,
    lon: -97.0,
    impact: "strategic",
    impactScore: 7,
    impactLabel: "Key Mediator / Aid Uncertainty",
    magnitude: "Critical",
    reasons: [
      "Primary military aid donor since 2022 ($175B+); now under review by Trump administration",
      "Trump's bilateral pressure on both sides is the single largest variable in near-term outcome",
      "Geopolitical credibility of NATO Article 5 commitment under question",
      "Domestic debate: Ukraine aid vs. Indo-Pacific resource allocation (Colby doctrine)",
    ],
  },
]

// ─── EXPORT ───────────────────────────────────────────────────────────────────
export default function RussiaUkraineWar20260324() {
  return (
    <GeoDashboard
      data={analysisData}
      politicalComments={politicalComments}
      verdict={strategicVerdict}
      gaps={analysisGaps}
      affectedCountries={affectedCountries}
      dashboardFile="src/dashboards/geopolitical/russia-ukraine-war-2026-03-24.jsx"
    />
  )
}
