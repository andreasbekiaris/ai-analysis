import GeoDashboard from '../../components/GeoDashboard'

const analysisData = {
  title: "Global Casino Market: Regulatory Disruption & Strategic Realignment",
  subtitle: "Trajectory & Outcome Analysis",
  date: "2026-04-02",
  overallConfidence: "Medium-High",
  classification: "OPEN SOURCE ANALYSIS",
  situation: {
    actors: [
      {
        name: "U.S. Congress (Schiff/Curtis/Vasquez)",
        role: "Regulatory Legislator",
        stance: "Actively hostile to prediction markets; pushing legislation to ban or restrict casino-style event contracts and sweepstakes casinos",
        power: 72,
      },
      {
        name: "CFTC",
        role: "Federal Regulatory Body",
        stance: "Jurisdiction over prediction markets contested; under pressure to assert or cede authority",
        power: 58,
      },
      {
        name: "BetMGM / Adam Greenblatt",
        role: "Online Casino Operator & CEO",
        stance: "Expansionary; identifies iGaming as primary growth engine, bullish on new regulated markets",
        power: 65,
      },
      {
        name: "PENN Entertainment",
        role: "Casino Operator",
        stance: "Neutral-positive; awaiting Q1 2026 earnings disclosure, monitoring regulatory environment",
        power: 55,
      },
      {
        name: "Caesars Entertainment",
        role: "Integrated Casino Operator",
        stance: "Cautious expansion; Q1 2026 results pending, watching iGaming legislation closely",
        power: 62,
      },
      {
        name: "Las Vegas Sands / MGM Mirage",
        role: "Luxury Casino Operators",
        stance: "Opportunistic; monitoring Massachusetts tax rate proposals before committing to market entry",
        power: 70,
      },
      {
        name: "UK Government / HMRC",
        role: "National Regulatory Authority",
        stance: "Fiscally aggressive; remote gaming duty raised to 40% effective April 2026",
        power: 68,
      },
      {
        name: "Tribal Gaming Authorities",
        role: "Sovereign Gaming Operators",
        stance: "Defensive; alarmed by unregulated prediction markets eroding revenue and sovereignty",
        power: 50,
      },
      {
        name: "bet365",
        role: "Global Online Gambling Leader",
        stance: "Technologically aggressive; partnering with AI platforms to accelerate software release velocity",
        power: 67,
      },
      {
        name: "VICI Properties",
        role: "Gaming REIT",
        stance: "Expansionary; closing Canadian sale-leaseback portfolio deal, growing real estate base",
        power: 60,
      },
      {
        name: "ABC-BET (Brazil)",
        role: "Sports Betting Industry Association",
        stance: "Defensive; pushing back on presidential criticism with empirical data on moderate bettor spending",
        power: 38,
      },
      {
        name: "State Legislatures (NY, AL, VA, ME)",
        role: "Sub-National Regulatory Bodies",
        stance: "Mixed — fiscally motivated to expand iGaming while simultaneously imposing responsible gaming restrictions",
        power: 55,
      },
    ],
    context:
      "The global casino and gambling market in April 2026 is experiencing a period of acute regulatory bifurcation. On one hand, fiscal pressures are driving multiple U.S. states — including Alabama, New York, Virginia, and Maine — to expand legal online casino and sports betting frameworks, attracted by projected tax windfalls. On the other hand, a concurrent wave of political backlash targets prediction markets, sweepstakes casinos, and AI-driven personalized promotions. In the UK, a steep remote gaming duty hike to 40% is compressing operator margins and reshaping valuation models across European-listed gambling stocks. In the U.S., a new federal provision capping gambling loss deductions at 90% threatens to create widespread 'phantom income' tax liabilities, prompting intense lobbying by casino industry coalitions. Technological disruption is a cross-cutting theme: AI is viewed simultaneously as the industry's growth engine and a regulatory liability, with New York proposing to ban AI-personalized gambling promotions outright. Prediction markets — straddling the line between financial derivatives and gambling — represent the sector's most contested frontier, drawing scrutiny from both the CFTC and multiple Congressional legislators. Tribal gaming interests are particularly vulnerable, as unregulated digital competitors erode both revenue streams and the political justification for their sovereign gaming compacts. Brazil's nascent regulated sports betting market faces its own political headwinds, while the global shift toward regulated crypto casinos remains nascent but structurally significant.",
    triggers: [
      "UK remote gaming duty hike to 40% effective April 2026",
      "U.S. Senate legislation introduced to ban casino-style prediction market contracts (Schiff/Curtis bill)",
      "Maine poised to become eighth U.S. state with legal online casino market",
      "Federal gambling loss deduction cap at 90% effective 2026 tax year",
      "Alberta, Canada opens as new regulated online gaming market (BetMGM entry)",
      "VICI Properties announces Canadian sale-leaseback portfolio transaction",
      "Golden Entertainment shareholders approve Sartini/VICI master transaction",
      "New York proposes biometric data requirement and AI promotion ban for online gambling",
      "California and New York ban sweepstakes casino dual-currency model",
      "Brazil's ABC-BET issues rebuttal to presidential criticism of sports betting sector",
      "bet365 partners with TestMu AI to accelerate release velocity",
      "Churchill Downs wins legal victory over HISA fee methodology",
    ],
    keyMetrics: [
      { label: "UK Remote Gaming Duty (2026)", value: "40%", color: "#ef4444" },
      { label: "U.S. W-2G Reporting Threshold", value: "$2,000", color: "#06b6d4" },
      { label: "Gambling Loss Deduction Cap (U.S.)", value: "90%", color: "#f59e0b" },
      { label: "U.S. States w/ Legal Online Casinos (post-Maine)", value: "8", color: "#10b981" },
      { label: "iGaming Expansion Bills Active", value: "4+ States", color: "#8b5cf6" },
      { label: "Prediction Market Legislation Bills", value: "2+ Federal", color: "#ef4444" },
      { label: "PENN/Caesars Q1 Reporting", value: "Late Apr 2026", color: "#06b6d4" },
      { label: "BetMGM New Market: Alberta", value: "Open", color: "#10b981" },
    ],
  },
  scenarios: [
    {
      id: 1,
      name: "Regulatory Fragmentation & Managed Expansion",
      tagline: "iGaming grows state-by-state while federal crackdown fragments prediction markets",
      probability: 42,
      color: "#f59e0b",
      description:
        "The most probable near-term trajectory sees the U.S. gambling landscape expand incrementally through state-level iGaming legislation while federal legislators successfully restrict or ban prediction market casino-style contracts. Operators like BetMGM, Caesars, and PENN benefit from new state markets but face a patchwork compliance burden. The UK's 40% duty suppresses European operator margins. Tribal gaming interests partially protected by prediction market restrictions.",
      narrative:
        "In this scenario, Maine passes its online casino legislation, joining seven predecessor states. Alabama and Virginia advance iGaming bills through committee stages with strong fiscal coalitions behind them. The Schiff-Curtis bill gains sufficient co-sponsors to pass the Senate, forcing prediction market platforms to restructure or exit casino-style contracts. The CFTC retains nominal jurisdiction but effectively defers to Congress on event contract gambling. BetMGM accelerates into Alberta and monitors New York's biometric and AI rules carefully. Caesars and PENN post modest Q1 earnings beats driven by Las Vegas recovery and digital growth, providing political ammunition against excessive federal gaming restrictions. The UK's operator ecosystem adjusts to 40% RGD through market consolidation and cost optimization. Tribal gaming revenues stabilize as unregulated digital competition is curtailed.",
      impacts: {
        military: "None — sector has no direct military dimension",
        economic:
          "Moderate positive for licensed U.S. operators; negative for prediction market platforms; UK operators face material margin compression; net new tax revenue for expanding states estimated in hundreds of millions annually",
        diplomatic:
          "Minimal direct diplomatic impact; Canadian market openings (Alberta) reflect bilateral regulatory alignment; Brazil's gaming regulation remains a domestic political issue",
        humanitarian:
          "Responsible gaming provisions expand alongside market growth; AI promotion bans and biometric requirements in New York may reduce problem gambling incidence; phantom income tax issue creates financial hardship for recreational gamblers",
        regional:
          "U.S. tribal gaming sovereignty partially restored through prediction market restrictions; state-level iGaming expansion creates revenue competition between jurisdictions",
        global:
          "Global online gambling market continues on growth trajectory; regulated crypto casinos gain incremental legitimacy; AI integration accelerates among well-capitalized operators",
      },
      timeHorizons: {
        shortTerm:
          "Q2 2026: Maine legalizes online casinos; Schiff-Curtis bill advances in Senate; PENN and Caesars Q1 earnings released; UK operators adjust guidance post-40% RGD",
        mediumTerm:
          "Q3-Q4 2026: 1-2 additional states pass iGaming legislation; prediction market platforms restructure product offerings; BetMGM establishes Alberta market presence; Massachusetts casino debate resolved",
        longTerm:
          "2027-2028: U.S. reaches 12-15 legal online casino states; federal framework for online gambling discussed but not legislated; tribal gaming revenues recover; AI-driven personalization banned in multiple jurisdictions but thrives elsewhere",
      },
      indicators: [
        {
          signal: "Maine governor signs online casino legislation",
          status: "emerging",
        },
        {
          signal: "Schiff-Curtis bill receives committee hearing date",
          status: "observed",
        },
        {
          signal: "UK operator (Flutter, Entain) issues profit warning citing 40% RGD",
          status: "emerging",
        },
        {
          signal: "BetMGM announces Alberta launch date",
          status: "emerging",
        },
        {
          signal: "New York biometric bill passes committee",
          status: "not_observed",
        },
        {
          signal: "CFTC issues formal guidance deferring to Congress on event contracts",
          status: "not_observed",
        },
        {
          signal: "Massachusetts sets casino tax rate enabling Sands/MGM entry",
          status: "not_observed",
        },
      ],
      feasibility: [
        {
          action: "Passage of state iGaming legislation in 2-3 additional U.S. states",
          actor: "State Legislatures (NY, AL, VA, ME)",
          militaryFeasibility: { score: 0, detail: "Not applicable" },
          economicCapacity: {
            score: 85,
            detail: "Strong fiscal incentive — projected tax revenues in hundreds of millions per state annually justify legislative effort",
          },
          politicalWill: {
            score: 72,
            detail: "Bipartisan support exists where fiscal arguments dominate; tribal opposition and responsible gaming advocates create friction",
          },
          allianceSupport: {
            score: 65,
            detail: "Casino industry lobbying coalitions well-funded; tribal gaming opposition organized; public opinion mixed",
          },
          overallSustainability: "sustainable_short_term",
          dealbreaker: "Unified tribal gaming opposition combined with social conservative bloc could stall bills in states with strong indigenous political coalitions",
          estimatedCost: "Minimal direct legislative cost; regulatory infrastructure setup $20-50M per state",
        },
        {
          action: "Federal ban on casino-style prediction market contracts",
          actor: "U.S. Congress (Schiff/Curtis/Vasquez)",
          militaryFeasibility: { score: 0, detail: "Not applicable" },
          economicCapacity: {
            score: 60,
            detail: "Prediction market platforms have significant financial resources and First Amendment arguments; legislation will be contested",
          },
          politicalWill: {
            score: 68,
            detail: "Rare bipartisan consensus against unregulated prediction markets; tribal gaming interests provide additional political pressure",
          },
          allianceSupport: {
            score: 70,
            detail: "Tribal gaming, state regulators, and traditional casino operators all support federal action; prediction market platforms oppose strongly",
          },
          overallSustainability: "sustainable_short_term",
          dealbreaker: "CFTC asserts exclusive jurisdiction preempting Congressional action; prediction market platforms win injunctive relief in federal courts",
          estimatedCost: "Regulatory enforcement cost $50-100M annually; legal challenge costs borne by federal government",
        },
      ],
    },
    {
      id: 2,
      name: "Accelerated iGaming Nationalization",
      tagline: "Federal online gambling framework emerges, displacing state-by-state patchwork",
      probability: 18,
      color: "#10b981",
      description:
        "A less probable but structurally significant scenario in which fiscal pressures at the federal level — combined with lobbying from major casino operators — produce a federal online gambling framework that supersedes state-level inconsistencies. This would dramatically accelerate market access for large operators while potentially undermining state tax autonomy and tribal compacts.",
      narrative:
        "The phantom income tax controversy over gambling loss deductions, combined with the iGaming expansion momentum across multiple states, creates a political opening for federal legislators to propose a unified online gambling framework. Major operators including BetMGM, Caesars, and PENN Entertainment back a federal bill that would establish a national licensing regime with a federal tax rate, eliminating the compliance burden of 50 different state regimes. The legislation faces fierce opposition from tribal gaming authorities and states protective of their gaming tax revenues. Ultimately a compromise framework emerges that preserves state opt-in rights while establishing federal minimum standards.",
      impacts: {
        military: "None",
        economic:
          "Highly positive for large national operators; creates significant valuation re-rating for PENN, Caesars, BetMGM parent companies; negative for state tax revenues if federal rate is lower; mixed for tribal gaming",
        diplomatic:
          "Minimal international impact; Canadian operators may seek bilateral equivalency recognition",
        humanitarian:
          "Risk of inadequate responsible gaming standards in federal framework; potential for increased problem gambling incidence if market access dramatically expands without matching safeguards",
        regional:
          "State gaming commissions lose authority; tribal gaming compacts require renegotiation; Las Vegas and Atlantic City physical casino markets face structural headwinds",
        global:
          "U.S. becomes world's largest regulated online gambling market; global operators accelerate U.S. licensing applications; sets precedent for other federally fragmented markets",
      },
      timeHorizons: {
        shortTerm: "Q2-Q3 2026: Federal online gambling discussion bill introduced; lobbying coalitions form",
        mediumTerm: "Q4 2026-Q1 2027: Congressional hearings; tribal opposition mounts; framework negotiations begin",
        longTerm: "2027-2028: Federal framework enacted or abandoned; if passed, major market structure reset",
      },
      indicators: [
        { signal: "Federal online gambling bill introduced with bipartisan co-sponsors", status: "not_observed" },
        { signal: "Major operator CEOs testify before Congress on national framework", status: "not_observed" },
        { signal: "Treasury Department releases study on federal gambling tax framework", status: "not_observed" },
        { signal: "State gaming commission coalition forms to oppose federal preemption", status: "not_observed" },
      ],
      feasibility: [
        {
          action: "Federal online gambling legalization framework",
          actor: "U.S. Congress with major operator lobbying",
          militaryFeasibility: { score: 0, detail: "Not applicable" },
          economicCapacity: {
            score: 78,
            detail: "Major operators have extensive lobbying budgets; federal fiscal motivation exists but state revenue concerns complicate equation",
          },
          politicalWill: {
            score: 38,
            detail: "Low near-term political will; Congress has other priorities; tribal opposition is politically potent; states jealously guard gaming authority",
          },
          allianceSupport: {
            score: 35,
            detail: "Large operator coalition exists but faces unified state/tribal opposition; no clear Congressional champion identified",
          },
          overallSustainability: "barely_feasible",
          dealbreaker: "Tribal gaming sovereignty arguments; state revenue protection concerns; lack of Congressional bandwidth in 2026 election cycle",
          estimatedCost: "Federal regulatory agency setup $200-500M; ongoing enforcement $100M+ annually",
        },
      ],
    },
    {
      id: 3,
      name: "Regulatory Overcorrection & Market Contraction",
      tagline: "Political backlash produces sweeping restrictions that stall market growth",
      probability: 25,
      color: "#ef4444",
      description:
        "A scenario in which the political backlash against prediction markets, sweepstakes casinos, and AI-driven gambling expands into broader restrictions on online gaming, creating a regulatory overhang that stalls the iGaming expansion wave and compresses operator valuations. The UK's 40% RGD catalyzes a global trend toward higher gambling taxes.",
      narrative:
        "Congressional hearings on prediction markets attract extensive media coverage of gambling addiction statistics, triggering a moral panic dynamic. Multiple states that were advancing iGaming bills pause or reverse course under political pressure. New York's proposed biometric and AI restrictions are adopted as a model by 3-5 other states, dramatically increasing compliance costs. The 90% gambling loss deduction cap survives lobbying efforts, becoming a permanent feature that suppresses recreational gambling volume. The UK's 40% RGD is interpreted as a global template, with Australia, Germany, and Canada considering similar increases. Sweepstakes casino bans spread to 8-10 states, eliminating a significant player acquisition channel for operators. Crypto casino regulatory action intensifies globally.",
      impacts: {
        military: "None",
        economic:
          "Significantly negative for online gambling operators globally; PENN, Caesars, Flutter, Entain face material valuation compression; prediction market platforms face existential regulatory risk; tribal gaming benefits from reduced digital competition",
        diplomatic:
          "Global regulatory coordination on gambling taxes and digital gambling restrictions emerges as a nascent multilateral theme",
        humanitarian:
          "Positive responsible gaming outcomes; reduced problem gambling incidence; however, pushes some gambling activity to unregulated offshore platforms",
        regional:
          "Tribal gaming experiences revenue recovery; physical Las Vegas and Atlantic City casinos benefit relatively from online contraction; state tax revenues from gambling decline",
        global:
          "Global online gambling market growth decelerates; offshore and crypto casino operators capture diverted demand; regulated market innovation stalled",
      },
      timeHorizons: {
        shortTerm: "Q2 2026: Congressional hearings generate negative media cycle; iGaming bills stall in 2-3 states",
        mediumTerm: "Q3-Q4 2026: Multiple states adopt New York-style AI/biometric restrictions; operator guidance cuts emerge",
        longTerm: "2027: Global gambling tax harmonization discussions begin; offshore market grows to absorb diverted demand",
      },
      indicators: [
        { signal: "High-profile gambling addiction congressional hearing generates major media coverage", status: "not_observed" },
        { signal: "Alabama or Virginia iGaming bill fails committee vote citing social harm concerns", status: "not_observed" },
        { signal: "Australia or Germany announces RGD increase citing UK precedent", status: "not_observed" },
        { signal: "Major operator (PENN, Caesars) issues profit warning citing regulatory headwinds", status: "not_observed" },
        { signal: "90% loss deduction cap survives reconciliation in tax legislation", status: "emerging" },
        { signal: "Sweepstakes casino ban adopted in 5+ additional states", status: "emerging" },
      ],
      feasibility: [
        {
          action: "Coordinated multi-state restriction on online gambling expansion",
          actor: "State Legislatures + Federal Congressional pressure",
          militaryFeasibility: { score: 0, detail: "Not applicable" },
          economicCapacity: {
            score: 55,
            detail: "States forgo significant tax revenue, creating fiscal pressure against over-restriction; however moral panic dynamics can override fiscal logic",
          },
          politicalWill: {
            score: 58,
            detail: "Social conservative and progressive anti-gambling coalitions both exist; prediction market controversy creates political opening for broader gambling restriction narrative",
          },
          allianceSupport: {
            score: 52,
            detail: "Tribal gaming, religious conservatives, and some progressive consumer protection advocates form unusual coalition favoring restriction",
          },
          overallSustainability: "barely_feasible",
          dealbreaker: "Fiscal reality — states desperate for non-tax revenue will not forgo hundreds of millions in gambling taxes without an alternative revenue source",
          estimatedCost: "Revenue cost to states: $200M-$1B+ annually in foregone gambling tax revenue",
        },
      ],
    },
    {
      id: 4,
      name: "AI & Crypto Casino Disruption",
      tagline: "Technological transformation outpaces regulation, reshaping competitive landscape",
      probability: 15,
      color: "#8b5cf6",
      description:
        "A scenario in which the rapid integration of AI across casino operations — from personalization engines to game design to fraud detection — combined with the normalization of regulated crypto casinos, fundamentally reshapes competitive dynamics faster than regulators can respond. Well-capitalized tech-forward operators like bet365 and BetMGM gain structural advantages while traditional land-based operators struggle to adapt.",
      narrative:
        "bet365's partnership with TestMu AI proves transformative, enabling release cycles 3-4x faster than competitors. BetMGM's AI-driven customer experience investments, combined with its Alberta expansion, deliver outsized market share gains. Regulated crypto casino frameworks emerge in Malta, Gibraltar, and select U.S. states, attracting a new demographic of digital-native gamblers who value transaction transparency and low fees. Traditional operators like Caesars scramble to acquire AI capabilities through M&A. The New York biometric requirement, initially seen as a burden, becomes an industry standard that paradoxically benefits large operators (who can afford compliance) over smaller ones, accelerating market consolidation. Blockchain-based provably fair gaming attracts regulatory acceptance in forward-leaning jurisdictions.",
      impacts: {
        military: "None",
        economic:
          "Strong positive for AI-integrated online operators; transformative for crypto casino platforms achieving regulatory acceptance; negative for traditional operators without digital capabilities; significant M&A wave in sector",
        diplomatic:
          "Malta, Gibraltar, and Isle of Man gain geopolitical significance as regulated crypto casino hubs; creates international regulatory arbitrage",
        humanitarian:
          "AI-driven responsible gaming tools (spending monitors, self-exclusion AI) improve outcomes; but AI personalization for retention creates competing addiction risks",
        regional:
          "Las Vegas and Atlantic City physical casino markets face long-term structural decline; technology hubs (Las Vegas tech ecosystem, London) benefit from gambling-tech convergence",
        global:
          "Global online gambling market accelerates to $150B+ by 2028; crypto casino market achieves mainstream legitimacy; AI-driven game design transforms product economics",
      },
      timeHorizons: {
        shortTerm: "Q2-Q3 2026: bet365 AI partnership shows measurable release velocity improvements; BetMGM AI features launch",
        mediumTerm: "Q4 2026-Q1 2027: First regulated crypto casino frameworks operational in forward-leaning jurisdictions",
        longTerm: "2027-2028: AI-driven personalization standard across industry; crypto casinos represent 10-15% of online gambling handle",
      },
      indicators: [
        { signal: "bet365 reports materially faster product release cycle in annual results", status: "not_observed" },
        { signal: "Malta or Gibraltar issues regulated crypto casino licensing framework", status: "not_observed" },
        { signal: "Major traditional operator announces AI company acquisition", status: "not_observed" },
        { signal: "BetMGM reports AI-driven customer retention improvement in Alberta launch metrics", status: "not_observed" },
        { signal: "U.S. state introduces crypto casino licensing bill", status: "not_observed" },
      ],
      feasibility: [
        {
          action: "Industry-wide AI integration and regulated crypto casino framework adoption",
          actor: "bet365, BetMGM, forward-leaning regulators (Malta, Gibraltar)",
          militaryFeasibility: { score: 0, detail: "Not applicable" },
          economicCapacity: {
            score: 80,
            detail: "Large operators have capital and motivation; AI tools increasingly accessible; crypto infrastructure mature",
          },
          politicalWill: {
            score: 48,
            detail: "Regulators cautious about crypto anonymity and AI addiction risks; New York explicitly banning AI personalization signals political resistance",
          },
          allianceSupport: {
            score: 55,
            detail: "Tech sector enthusiasm; some progressive regulators open to innovation; traditional gaming establishment skeptical",
          },
          overallSustainability: "sustainable_short_term",
          dealbreaker: "Regulatory prohibition of AI personalization spreads beyond New York; major crypto casino hack or fraud scandal triggers global regulatory backlash",
          estimatedCost: "AI integration: $50-200M per major operator over 2 years; crypto casino licensing infrastructure $20-50M per jurisdiction",
        },
      ],
    },
  ],
  decisionPoints: [
    {
      actor: "U.S. Senate",
      decision: "Vote on Schiff-Curtis prediction market prohibition bill",
      leadsTo: [1, 3],
      consequence:
        "If passed, prediction market platforms restructure or exit casino-style contracts, partially restoring tribal gaming revenues and removing CFTC jurisdictional ambiguity. If defeated, prediction markets expand aggressively, intensifying competitive pressure on traditional casinos.",
    },
    {
      actor: "Maine Governor",
      decision: "Sign or veto online casino legalization bill",
      leadsTo: [1, 2],
      consequence:
        "Signature creates eighth U.S. legal online casino state, accelerating legislative momentum in Alabama, Virginia, and New York. Veto signals political vulnerability of iGaming expansion and may stall bills in neighboring states.",
    },
    {
      actor: "Massachusetts Legislature",
      decision: "Set casino tax rate for proposed facilities",
      leadsTo: [1, 4],
      consequence:
        "Tax rate above 35% likely deters Las Vegas Sands and MGM entry, leaving Massachusetts with limited casino development. Rate below 30% triggers operator entry, generating competition with existing Connecticut and Rhode Island facilities.",
    },
    {
      actor: "U.S. Congress",
      decision: "Preserve or repeal 90% gambling loss deduction cap in 2026 tax reconciliation",
      leadsTo: [1, 3],
      consequence:
        "Repeal restores full deductibility, reducing phantom income burden on recreational gamblers and removing a political grievance that unites casino industry against Congress. Preservation creates lasting distortion in recreational gambling economics and suppresses handle growth.",
    },
    {
      actor: "CFTC",
      decision: "Issue formal jurisdictional ruling on prediction market event contracts",
      leadsTo: [1, 2],
      consequence:
        "CFTC claiming exclusive jurisdiction over prediction markets as financial derivatives would preempt state gambling laws and Congressional gambling legislation, dramatically expanding prediction market legality and triggering constitutional challenges from tribal gaming interests.",
    },
    {
      actor: "New York Legislature",
      decision: "Pass biometric + AI promotion ban for online gambling operators",
      leadsTo: [3, 4],
      consequence:
        "If enacted, creates national compliance template that other states adopt, dramatically increasing operator costs and accelerating market consolidation toward large players. If defeated, AI-personalized marketing expands across all states without restriction.",
    },
    {
      actor: "UK Government",
      decision: "Maintain or adjust 40% remote gaming duty post-implementation review",
      leadsTo: [1, 3],
      consequence:
        "Maintaining 40% RGD at first annual review signals global template for gambling tax increases, catalyzing similar moves in Australia, Germany, and Canada. A downward adjustment would signal fiscal overreach and provide relief to UK-listed operators.",
    },
  ],
  expertOpinions: {
    consensus: {
      summary:
        "Most analysts agree that the U.S. iGaming expansion trajectory is intact despite regulatory headwinds, with 10-15 states likely to have legal online casinos by 2028. The prediction market controversy is seen as a solvable regulatory problem rather than an existential threat. AI integration is broadly viewed as inevitable and positive for well-capitalized operators. The UK's 40% RGD is seen as a near-term margin headwind but not a market-breaking development.",
      supporters: [
        "American Gaming Association",
        "Eilers & Krejcik Gaming",
        "Union Gaming Analytics",
        "Deutsche Bank Gaming Research",
        "Macquarie Capital Gaming Team",
      ],
    },
    dissenting: [
      {
        expert: "Dr. Rachel Volberg",
        affiliation: "University of Massachusetts Gambling Research Group",
        position:
          "The pace of iGaming expansion dramatically underestimates the public health burden; problem gambling rates are likely to increase 30-50% in newly legalized states within three years of legalization.",
        reasoning:
          "Historical data from sports betting legalization shows sharp increases in gambling disorder prevalence; online casino games are structurally more addictive than sports betting due to rapid play cycles.",
        credibilityNote:
          "Leading academic authority on problem gambling epidemiology; research widely cited in Congressional testimony; potential conflict with public health funding interests.",
      },
      {
        expert: "Tribal Gaming Institute (composite position)",
        affiliation: "National Indian Gaming Association",
        position:
          "State-level iGaming expansion without explicit tribal revenue sharing agreements constitutes a breach of existing compact frameworks and will trigger years of litigation that will slow or halt online gaming rollouts.",
        reasoning:
          "Multiple tribal compacts contain exclusivity clauses that give tribes legal standing to challenge state online gaming frameworks; tribes in Connecticut, California, and New Mexico have already indicated willingness to litigate.",
        credibilityNote:
          "Tribal gaming interests have a strong track record of successful litigation against competing gaming frameworks; this dissenting view is underweighted by Wall Street gaming analysts.",
      },
      {
        expert: "John Holden",
        affiliation: "Oklahoma State University Sports Gambling Research",
        position:
          "The CFTC's jurisdictional claim over prediction markets is constitutionally fragile and will not survive judicial review; prediction markets will ultimately be regulated as gambling, not derivatives.",
        reasoning:
          "The economic reality of prediction market contracts — fixed-odds, event-contingent payoffs — is functionally identical to sports betting; courts will look through the financial instrument label to the underlying economic substance.",
        credibilityNote:
          "Specialist in sports gambling law; credible on jurisdictional questions but may underestimate CFTC's regulatory capacity to define instruments.",
      },
    ],
    regionalVsWestern: {
      westernView:
        "Western financial analysts and U.S./UK regulators frame the casino market evolution primarily through the lens of taxation, operator compliance, and consumer protection. The dominant concern is ensuring regulated markets capture revenue that would otherwise flow to offshore or unregulated platforms. AI is viewed cautiously but not hostilely, with the UK's 40% RGD seen as an appropriately calibrated fiscal response to market growth.",
      regionalView:
        "Regional actors — including tribal gaming authorities, Brazilian sports betting associations, and state-level gaming commissions — view the market primarily through sovereignty, revenue sharing, and social contract lenses. Tribal nations see digital gambling expansion as an existential economic and political threat. Brazil's ABC-BET emphasizes that regulated betting provides public health and revenue benefits that presidential critics ignore. State gaming commissions fear federal preemption.",
      gapAnalysis:
        "The primary analytical gap lies between the financial market's treatment of gambling stocks as pure growth assets and the on-the-ground political reality facing operators. Wall Street models consistently underweight tribal opposition, phantom income tax impacts on player volume, and the regulatory contagion risk from the UK's 40% RGD to other markets. The gap between operator bullishness and legislative hostility is wider than in any previous iGaming expansion cycle.",
    },
    overallExpertConfidence: "Medium",
  },
  impactMatrix: [
    {
      scenario: "Regulatory Fragmentation & Managed Expansion",
      military: 0,
      economic: 6,
      diplomatic: 2,
      humanitarian: 4,
      regional: 7,
      global: 5,
    },
    {
      scenario: "Accelerated iGaming Nationalization",
      military: 0,
      economic: 8,
      diplomatic: 3,
      humanitarian: 5,
      regional: 9,
      global: 7,
    },
    {
      scenario: "Regulatory Overcorrection & Market Contraction",
      military: 0,
      economic: 7,
      diplomatic: 4,
      humanitarian: 6,
      regional: 6,
      global: 6,
    },
    {
      scenario: "AI & Crypto Casino Disruption",
      military: 0,
      economic: 9,
      diplomatic: 5,
      humanitarian: 5,
      regional: 7,
      global: 8,
    },
  ],
}

const politicalComments = [
  {
    actor: "Sen. Adam Schiff",
    role: "U.S. Senator (D-California), Co-Sponsor of Prediction Market Ban Bill",
    platform: "Press Conference",
    date: "2026-03-28",
    time: "14:00 ET",
    quote:
      "These prediction market platforms are operating as unlicensed casinos, taking bets on political events and sporting outcomes while hiding behind the label of 'financial derivatives.' They undermine state gambling laws, cut out tribal gaming communities, and expose Americans to unregulated gambling risks. We are introducing legislation to close this loophole.",
    context:
      "Joint press conference with Sen. John Curtis announcing bipartisan bill to prohibit sports and casino-style event contracts on prediction market platforms",
    signalType: "escalatory",
    marketImpact:
      "Negative for prediction market platforms (Kalshi, Polymarket); neutral-to-positive for traditional casino operators and tribal gaming stocks",
    scenarioImplication:
      "Strengthens Scenario 1 (Regulatory Fragmentation); increases probability of prediction market restructuring",
    verified: false,
  },
  {
    actor: "Sen. John Curtis",
    role: "U.S. Senator (R-Utah), Co-Sponsor of Prediction Market Ban Bill",
    platform: "Press Conference",
    date: "2026-03-28",
    time: "14:00 ET",
    quote:
      "This is not a partisan issue. When private platforms profit from gambling on the outcomes of our elections and sporting events without any of the protections that licensed casinos provide, that's a problem for consumers and for the integrity of our markets. Utah has no casinos, but we understand the importance of regulated, accountable gambling frameworks.",
    context:
      "Bipartisan framing of prediction market legislation; unusual alliance between California Democrat and Utah Republican signals broad Congressional concern",
    signalType: "escalatory",
    marketImpact:
      "Bipartisan signal amplifies regulatory risk for prediction market sector; reduces probability of platforms successfully lobbying the bill to death in committee",
    scenarioImplication: "Increases probability of Scenario 1; reduces Scenario 4 probability if crypto casino platforms are swept into broader legislation",
    verified: false,
  },
  {
    actor: "Rep. Gabe Vasquez",
    role: "U.S. Representative (D-N.M.)",
    platform: "Congressional Floor Statement",
    date: "2026-03-25",
    time: "11:30 ET",
    quote:
      "Tribal nations in New Mexico built their gaming enterprises under compact agreements that guaranteed them a meaningful share of the gambling market. Unregulated prediction markets are now eating into those revenues without contributing a single dollar to tribal communities, state education funds, or problem gambling treatment. This is a sovereignty issue.",
    context:
      "Floor statement during debate on CFTC reauthorization; highlights tribal gaming revenue impact of prediction market competition",
    signalType: "escalatory",
    marketImpact:
      "Strengthens political coalition for prediction market restriction; adds tribal sovereignty dimension that resonates across party lines",
    scenarioImplication: "Increases probability of Scenario 1; reinforces tribal gaming as political constituency against prediction market expansion",
    verified: false,
  },
  {
    actor: "Adam Greenblatt",
    role: "CEO, BetMGM",
    platform: "Industry Conference",
    date: "2026-03-30",
    time: "10:00 ET",
    quote:
      "iGaming expansion is the single biggest dial-mover for our business. Alberta opening as a regulated online gaming market is exactly the kind of development we've been working toward. Every new regulated jurisdiction is an opportunity, and we're positioned to move quickly when markets open.",
    context:
      "Keynote address at gaming industry conference; highlights BetMGM's positioning for iGaming expansion and Alberta market entry",
    signalType: "de-escalatory",
    marketImpact:
      "Positive for BetMGM (MGM Resorts subsidiary); signals confident growth posture; may reassure investors ahead of Q1 results season",
    scenarioImplication: "Consistent with Scenario 1 and Scenario 4; operator confidence in regulated market expansion pathway",
    verified: false,
  },
  {
    actor: "ABC-BET (Association of Sports Betting Companies, Brazil)",
    role: "Brazilian Sports Betting Industry Association",
    platform: "Official Statement",
    date: "2026-03-29",
    time: "09:00 BRT",
    quote:
      "Data from regulated operators shows that the average Brazilian sports bettor spends within moderate limits that are comparable to other entertainment expenditures. The suggestion that sports betting is causing widespread financial harm to Brazilian families is not supported by the data we are providing to authorities. We also highlight that the current allocation of betting revenues to public health is minimal and a policy choice that can be changed.",
    context:
      "Response to Brazilian President's public criticism of the sports betting sector; defensive industry positioning in an emerging regulated market",
    signalType: "de-escalatory",
    marketImpact:
      "Neutral to mildly positive for operators in Brazilian market; political risk remains elevated given presidential attention to the sector",
    scenarioImplication:
      "Highlights Scenario 3 risk in Brazil specifically; political pushback against gambling expansion is not uniquely American",
    verified: false,
  },
  {
    actor: "VICI Properties (corporate statement)",
    role: "Gaming Real Estate Investment Trust",
    platform: "Press Release",
    date: "2026-03-31",
    time: "08:00 ET",
    quote:
      "VICI Properties announces the pending sale-leaseback of a Canadian portfolio, reflecting our continued commitment to expanding our international real estate footprint in the gaming and hospitality sector. This transaction with Golden Entertainment advances our strategic objectives in North America.",
    context:
      "Corporate announcement of Canadian portfolio transaction and Golden Entertainment master agreement shareholder approval",
    signalType: "diplomatic",
    marketImpact:
      "Positive for VICI Properties stock; signals continued gaming REIT expansion; Canadian market activity validates Alberta iGaming opportunity",
    scenarioImplication: "Consistent with Scenario 1; real estate capital flowing into gaming sector reflects investor confidence in regulated expansion",
    verified: false,
  },
  {
    actor: "Churchill Downs Incorporated (corporate statement)",
    role: "Horseracing and Casino Operator",
    platform: "Press Release",
    date: "2026-03-26",
    time: "09:00 ET",
    quote:
      "We are pleased to report our legal victory against the Horseracing Integrity and Safety Authority regarding its fee methodology. This decision validates our position that the HISA fee structure as applied was legally defective and will have significant implications for the entire horseracing industry's relationship with federal oversight.",
    context:
      "Legal victory over HISA fee challenge; relevant to the broader theme of industry pushback against regulatory overreach",
    signalType: "de-escalatory",
    marketImpact:
      "Positive for Churchill Downs; sets precedent for industry legal challenges to regulatory fee methodologies",
    scenarioImplication:
      "Marginal signal that operators are willing and able to litigate against regulatory overreach; relevant to Scenario 3 resistance dynamics",
    verified: false,
  },
  {
    actor: "UK Government / HM Treasury (policy action)",
    role: "UK National Government",
    platform: "Official Gazette / Budget Implementation",
    date: "2026-04-01",
    time: "00:01 GMT",
    quote:
      "The remote gaming duty rate increases to 40% with effect from 1 April 2026, as announced in the Autumn Statement. Operators are required to account for this rate on all applicable gaming activity from this date.",
    context:
      "Implementation of previously announced UK remote gaming duty increase; effective date April 1, 2026",
    signalType: "economic",
    marketImpact:
      "Materially negative for UK-listed gambling operators including Flutter Entertainment, Entain, and bet365; expected to compress EBITDA margins by 2-5 percentage points for UK-facing revenue",
    scenarioImplication:
      "Increases probability of Scenario 3 globally if other jurisdictions follow; creates near-term headwind for Scenario 4 AI investment spending by UK operators",
    verified: true,
  },
]

const strategicVerdict = {
  stance: "MONITOR — SELECTIVE POSITIONING",
  stanceColor: "#f59e0b",
  primaryScenario: "Regulatory Fragmentation & Managed Expansion",
  primaryProb: 42,
  timing: "Re-assess in 48-72h or on Maine governor action / Schiff-Curtis bill committee vote",
  timingDetail:
    "The most critical near-term catalyst is the Maine governor's decision on online casino legalization, which will either confirm the iGaming expansion trajectory or signal its political vulnerability. The Schiff-Curtis prediction market bill's committee scheduling will indicate whether federal legislative action is imminent or stalled. Watch for UK operator Q1 earnings guidance (Flutter, Entain) to assess the real magnitude of the 40% RGD impact. PENN and Caesars Q1 results in late April will provide the first hard data point on Las Vegas recovery thesis. Any CFTC formal guidance on prediction market jurisdiction would be a market-moving event requiring immediate reassessment.",
  immediateWatchpoints: [
    {
      signal: "Maine governor signs or vetoes online casino bill",
      timing: "Within 2-4 weeks",
      implication:
        "Signature confirms Scenario 1 trajectory and accelerates Alabama/Virginia bills; veto signals Scenario 3 risk and may trigger operator stock selloff",
      urgency: "Critical",
    },
    {
      signal: "Schiff-Curtis prediction market bill receives Senate committee hearing",
      timing: "Within 2-6 weeks",
      implication:
        "Hearing signals bill is advancing; prediction market platforms will face immediate restructuring pressure; CFTC may respond with preemptive jurisdictional guidance",
      urgency: "Critical",
    },
    {
      signal: "Flutter Entertainment or Entain issues Q1 guidance revision citing UK 40% RGD",
      timing: "Within 3-4 weeks (Q1 earnings cycle)",
      implication:
        "Profit warning would confirm Scenario 3 margin compression thesis and trigger contagion concerns for global gambling valuations",
      urgency: "High",
    },
    {
      signal: "PENN Entertainment or Caesars Q1 2026 earnings release",
      timing: "Late April 2026",
      implication:
        "Results above consensus confirm Las Vegas recovery thesis and Scenario 1; miss increases Scenario 3 probability",
      urgency: "High",
    },
    {
      signal: "New York biometric/AI gambling bill advances to full chamber vote",
      timing: "Within 4-8 weeks",
      implication:
        "Passage creates national compliance template; large operators (Scenario 4) benefit; small operators face existential compliance cost challenge",
      urgency: "High",
    },
    {
      signal: "CFTC issues formal guidance on prediction market event contract jurisdiction",
      timing: "Unknown — event-driven",
      implication:
        "CFTC claiming exclusive jurisdiction would preempt Congressional action and dramatically expand prediction market legality; major market structure event",
      urgency: "Critical",
    },
    {
      signal: "Massachusetts legislature sets casino tax rate enabling or blocking Sands/MGM entry",
      timing: "Within 6-10 weeks",
      implication:
        "Rate below 30% triggers Sands/MGM entry and creates major new gaming market; rate above 35% leaves Massachusetts underdeveloped",
      urgency: "Medium",
    },
    {
      signal: "Brazil government announces regulatory action against sports betting operators",
      timing: "Within 4-8 weeks",
      implication:
        "Would signal Scenario 3 dynamic spreading to Latin America's largest emerging gambling market",
      urgency: "Medium",
    },
  ],
  marketPositioning: [
    {
      asset: "U.S. Large-Cap Casino Operators (PENN, Caesars, MGM Resorts)",
      stance: "HOLD",
      color: "#f59e0b",
      rationale:
        "Fundamentals supported by Las Vegas recovery and iGaming expansion trajectory; however, phantom income deduction cap, prediction market controversy, and regulatory uncertainty create near-term overhang. Hold positions pending Q1 earnings clarity.",
    },
    {
      asset: "BetMGM / Online-Pure-Play Operators",
      stance: "ADD",
      color: "#10b981",
      rationale:
        "iGaming expansion is the primary growth driver; Alberta opening, Maine legalization, and AI integration all support bullish thesis. Best positioned to benefit from Scenario 1 (primary scenario).",
    },
    {
      asset: "UK-Listed Gambling Stocks (Flutter, Entain, bet365)",
      stance: "CAUTIOUS",
      color: "#f59e0b",
      rationale:
        "40% RGD creates meaningful margin headwind for UK-facing revenue; Q1 earnings guidance risk is elevated. Flutter's U.S. FanDuel exposure provides partial hedge. Wait for Q1 guidance before adding.",
    },
    {
      asset: "Prediction Market Platforms (Kalshi, Polymarket)",
      stance: "AVOID",
      color: "#ef4444",
      rationale:
        "Bipartisan Congressional opposition and CFTC jurisdictional uncertainty create existential regulatory risk for casino-style event contracts. Business model under direct legislative threat.",
    },
    {
      asset: "Tribal Gaming Revenue Bonds / Related Instruments",
      stance: "HOLD",
      color: "#f59e0b",
      rationale:
        "Prediction market restriction legislation, if passed, provides meaningful revenue protection. However, state iGaming expansion continues to erode tribal exclusivity advantages in several markets.",
    },
    {
      asset: "Gaming REITs (VICI Properties, Gaming & Leisure Properties)",
      stance: "ADD",
      color: "#10b981",
      rationale:
        "Canadian portfolio expansion and Golden Entertainment transaction show active deal pipeline. Physical casino real estate is structurally insulated from digital regulatory risks. Dividend yield attractive.",
    },
    {
      asset: "Sweepstakes Casino Operators",
      stance: "REDUCE",
      color: "#ef4444",
      rationale:
        "Dual-currency model already banned in California and New York; regulatory contagion to additional states is the base case. Business model faces existential threat in largest U.S. markets.",
    },
    {
      asset: "AI-Integrated Gambling Technology Providers",
      stance: "ADD",
      color: "#10b981",
      rationale:
        "bet365/TestMu AI partnership signals industry direction; B2B providers of responsible gaming AI tools are positioned to benefit from both growth and regulatory compliance demand simultaneously.",
    },
  ],
  probabilityUpdate:
    "Scenario 1 (Fragmentation & Managed Expansion) 42% / Scenario 3 (Regulatory Overcorrection) 25% / Scenario 2 (Federal Framework) 18% / Scenario 4 (AI & Crypto Disruption) 15%",
  conviction: "Medium",
  nextReview: "48-72 hours or on Maine governor action / Schiff-Curtis committee vote / UK operator Q1 guidance",
}

const analysisGaps = [
  {
    topic: "CFTC Internal Position on Prediction Market Jurisdiction",
    description:
      "The CFTC's actual internal legal analysis of its jurisdictional authority over prediction market event contracts has not been publicly disclosed. Whether the agency will assert exclusive jurisdiction (preempting Congressional action) or effectively cede ground to Congress is the single most consequential unknown in the near-term market structure question. No public CFTC statements post-Schiff-Curtis bill introduction have been identified.",
    issueTitle: "CFTC Jurisdictional Posture Unknown",
  },
  {
    topic: "Actual Player Volume Impact of 90% Loss Deduction Cap",
    description:
      "The empirical estimate of how the federal 90% gambling loss deduction cap will affect recreational player volumes in 2026 is absent from available research. Casino industry lobbyists claim material harm; independent economists have not yet published impact assessments. The phantom income effect could suppress handle growth significantly in the $50B+ U.S. gambling market.",
    issueTitle: "Gambling Deduction Cap Player Impact Unquantified",
  },
  {
    topic: "UK Operator Revenue Attribution by Jurisdiction",
    description:
      "Precise breakdown of how much of Flutter, Entain, and bet365 revenue is subject to the UK's 40% remote gaming duty versus international revenue is not available in research data. This makes it difficult to quantify the exact earnings-per-share impact of the duty increase on each major operator.",
    issueTitle: "UK RGD Impact Per Operator Unquantified",
  },
  {
    topic: "Brazilian Presidential Position — Specific Policy Action",
    description:
      "The research indicates the Brazilian President made critical public comments about the sports betting sector, triggering the ABC-BET response. However, the specific nature of those comments — whether threatening new taxation, operational restrictions, or operator licensing reviews — is not captured in available research data.",
    issueTitle: "Brazil Presidential Gambling Position Unclear",
  },
  {
    topic: "Massachusetts Casino Tax Rate Proposal Specifics",
    description:
      "The specific tax rate(s) being proposed in Massachusetts casino legislation, and the positions of Las Vegas Sands and MGM Mirage on what threshold would make market entry economically viable, are not detailed in available research. This is a critical data point for assessing whether Massachusetts becomes a major new gaming market.",
    issueTitle: "Massachusetts Casino Tax Rate Proposal Unknown",
  },
  {
    topic: "AI Governance in Online Gambling — Technical Standards",
    description:
      "New York's proposed ban on AI for personalized gambling promotions raises the question of what constitutes 'AI' in this context and whether existing recommendation algorithms would qualify. No technical standards or enforcement guidance has been identified, creating significant compliance uncertainty for operators planning system investments.",
    issueTitle: "AI Definition in NY Gambling Regulation Undefined",
  },
  {
    topic: "Regulated Crypto Casino Legal Status by Jurisdiction",
    description:
      "The current legal status of crypto-denominated casino operations across major jurisdictions (Malta, Gibraltar, Isle of Man, select U.S. states) is not comprehensively mapped in available research. The 'regulated crypto casino' trend mentioned in research lacks specific jurisdiction-level policy details.",
    issueTitle: "Crypto Casino Regulatory Map Incomplete",
  },
]

const affectedCountries = [
  "USA",
  "GBR",
  "CAN",
  "BRA",
  "AUS",
  "DEU",
  "MLT",
  "GIB",
]

export default function CasinoMarketDashboard() {
  return (
    <GeoDashboard
      data={analysisData}
      politicalComments={politicalComments}
      verdict={strategicVerdict}
      gaps={analysisGaps}
      affectedCountries={affectedCountries}
      dashboardFile="src/dashboards/geopolitical/casino-market-analysis-2026-04-02.jsx"
    />
  )
}