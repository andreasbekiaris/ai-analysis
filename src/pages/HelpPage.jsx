import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, Globe2, BarChart3, Search, Sparkles, CheckCircle, AlertCircle, Plus } from 'lucide-react'
import SiteNavBar from '../components/SiteNavBar'

const glossary = {
  financial: [
    { term: "NPE", full: "Non-Performing Exposure", definition: "A loan or other credit exposure where the borrower has failed to make scheduled payments for a significant period, indicating a high risk of default. It's a critical metric for bank health and financial stability." },
    { term: 'P/E', full: 'Price-to-Earnings Ratio', definition: 'Stock price divided by earnings per share. Measures how much investors pay per dollar of earnings. High P/E = growth expectations or overvaluation.' },
    { term: 'EPS', full: 'Earnings Per Share', definition: 'Net income divided by outstanding shares. Core profitability metric used to compare companies.' },
    { term: 'bbl', full: 'Barrel', definition: 'Unit of oil volume = 42 US gallons (159 liters). All oil prices are quoted per barrel.' },
    { term: 'bbl/d', full: 'Barrels Per Day', definition: 'Rate of oil production or consumption. Saudi Arabia produces ~12M bbl/d; global consumption ~100M bbl/d.' },
    { term: 'WTI', full: 'West Texas Intermediate', definition: 'US benchmark crude oil grade. Typically trades $1–3 below Brent. Futures traded on NYMEX.' },
    { term: 'Brent', full: 'Brent Crude', definition: 'Global benchmark crude from North Sea. Used to price ~2/3 of internationally traded oil. Key geopolitical risk indicator.' },
    { term: 'EBITDA', full: 'Earnings Before Interest, Taxes, Depreciation & Amortization', definition: 'Proxy for operating cash flow. Strips out capital structure and accounting choices — useful for cross-company comparison.' },
    { term: 'Market Cap', full: 'Market Capitalization', definition: 'Total market value of outstanding shares = share price × shares outstanding. Small-cap < $2B, Mid-cap $2–10B, Large-cap > $10B.' },
    { term: 'P/B', full: 'Price-to-Book Ratio', definition: 'Share price vs. net asset value per share. P/B < 1 may signal undervaluation or distress.' },
    { term: 'P/S', full: 'Price-to-Sales Ratio', definition: 'Market cap ÷ annual revenue. Useful for unprofitable growth companies where P/E is not applicable.' },
    { term: 'Beta', full: 'Beta (Market Volatility)', definition: 'Stock volatility relative to the broad market. Beta > 1 = amplifies market moves. Beta < 1 = more defensive.' },
    { term: 'RSI', full: 'Relative Strength Index', definition: 'Momentum oscillator (0–100). RSI > 70 = overbought, RSI < 30 = oversold. Used for timing entries/exits.' },
    { term: 'SMA', full: 'Simple Moving Average', definition: 'Average closing price over N days. 50-day and 200-day SMAs are watched as key support/resistance levels.' },
    { term: 'EMA', full: 'Exponential Moving Average', definition: 'Weighted moving average giving more weight to recent prices. Reacts faster than SMA to price changes.' },
    { term: 'MACD', full: 'Moving Average Convergence Divergence', definition: 'Trend-following momentum indicator. Crossovers signal potential trend changes.' },
    { term: 'ROE', full: 'Return on Equity', definition: 'Net income ÷ shareholders\' equity. Measures how efficiently a company uses equity capital. > 15% is generally strong.' },
    { term: 'ROA', full: 'Return on Assets', definition: 'Net income ÷ total assets. Measures asset utilization efficiency. Useful for capital-intensive sectors.' },
    { term: 'FCF', full: 'Free Cash Flow', definition: 'Operating cash flow minus capital expenditures. Cash available after maintaining and growing the business. Harder to manipulate than earnings.' },
    { term: 'D/E', full: 'Debt-to-Equity Ratio', definition: 'Total debt ÷ shareholders\' equity. Higher = more leveraged. Acceptable levels vary significantly by industry.' },
    { term: 'Gross Margin', full: 'Gross Profit Margin', definition: '(Revenue − Cost of Goods) ÷ Revenue. Shows pricing power and production efficiency.' },
    { term: 'YTD', full: 'Year to Date', definition: 'Performance or change from January 1 of the current year to the present date.' },
    { term: 'TTM', full: 'Trailing Twelve Months', definition: 'Financial metric calculated over the past 12 months regardless of fiscal year. More current than annual reports.' },
    { term: 'YoY', full: 'Year over Year', definition: 'Comparison of a metric to the same period 12 months prior. Removes seasonal distortions.' },
    { term: 'QoQ', full: 'Quarter over Quarter', definition: 'Comparison to the immediately preceding quarter. Captures near-term momentum.' },
    { term: 'GDP', full: 'Gross Domestic Product', definition: 'Total monetary value of all goods and services produced in a country. Primary measure of economic size and health.' },
    { term: 'CPI', full: 'Consumer Price Index', definition: 'Tracks price changes for a basket of consumer goods. Core CPI excludes food and energy. Key inflation gauge.' },
    { term: 'PCE', full: 'Personal Consumption Expenditures', definition: 'Fed\'s preferred inflation measure. Broader than CPI, adjusts for substitution behavior.' },
    { term: 'Fed', full: 'Federal Reserve', definition: 'US central bank. Controls monetary policy (interest rates, money supply). Markets closely watch FOMC meetings.' },
    { term: 'FOMC', full: 'Federal Open Market Committee', definition: 'Fed\'s rate-setting body. Meets ~8x/year. Rate hike/cut decisions drive global capital flows.' },
    { term: 'IPO', full: 'Initial Public Offering', definition: 'First sale of a company\'s stock to the public. Enables early investors to exit and company to raise capital.' },
    { term: 'ETF', full: 'Exchange-Traded Fund', definition: 'Basket of securities traded intraday like a stock. Lower costs than mutual funds; highly liquid.' },
    { term: 'Short Interest', full: 'Short Interest', definition: 'Percentage of float held short. High short interest (> 20%) can lead to short squeezes on positive news.' },
    { term: '52-wk H/L', full: '52-Week High/Low', definition: 'Highest and lowest traded price over the trailing year. Key psychological support and resistance levels.' },
  ],
  geopolitical: [
    { term: 'IRGC', full: 'Islamic Revolutionary Guard Corps', definition: 'Elite parallel military branch in Iran. Controls proxy forces (Hezbollah, Houthis, Iraqi PMF), ballistic missile program, and nuclear enrichment oversight.' },
    { term: 'JCPOA', full: 'Joint Comprehensive Plan of Action', definition: '2015 Iran nuclear deal between Iran and P5+1. Limited enrichment in exchange for sanctions relief. US withdrew May 2018; Iran declared terminated Oct 2025.' },
    { term: 'HEU', full: 'Highly Enriched Uranium', definition: 'Uranium enriched to ≥ 20% U-235. Weapons-grade is typically ≥ 90%. Iran held ~400 kg at 60% enrichment as of early 2026.' },
    { term: 'LEU', full: 'Low Enriched Uranium', definition: 'Uranium enriched to 3–5% U-235. Used in civilian nuclear reactors. Below weapons-usable threshold.' },
    { term: 'SWU', full: 'Separative Work Unit', definition: 'Measure of effort required in uranium enrichment. Used to calculate enrichment capacity of centrifuge cascades.' },
    { term: 'CSG', full: 'Carrier Strike Group', definition: 'US Navy battle group centered on a nuclear aircraft carrier + cruisers, destroyers, submarines. One CSG ≈ 75 aircraft, projects power 600+ miles.' },
    { term: 'NATO', full: 'North Atlantic Treaty Organization', definition: '32-member Western military alliance. Article 5 = attack on one is attack on all. Collective defense cornerstone since 1949.' },
    { term: 'IAEA', full: 'International Atomic Energy Agency', definition: 'UN nuclear watchdog. Conducts inspections, maintains safeguards on civilian nuclear programs, monitors compliance with NPT.' },
    { term: 'NPT', full: 'Nuclear Non-Proliferation Treaty', definition: 'Treaty limiting nuclear weapons spread. 191 signatories. Permits 5 recognized nuclear states (US, UK, France, Russia, China).' },
    { term: 'UNSC', full: 'UN Security Council', definition: '15-member body (5 permanent, 10 rotating). Permanent members (P5) hold veto power. Primary UN body for peace and security.' },
    { term: 'P5+1', full: 'Permanent Five + Germany', definition: 'UNSC permanent members (US, UK, France, Russia, China) plus Germany. Primary negotiating format for Iran nuclear talks.' },
    { term: 'CENTCOM', full: 'US Central Command', definition: 'US military command responsible for Middle East, Central Asia, East Africa. HQ at MacDill AFB, Florida.' },
    { term: 'PMF', full: 'Popular Mobilization Forces', definition: 'Iraqi state-sanctioned umbrella of ~67 militias. Many are Iran-aligned (e.g., Kata\'ib Hezbollah). ~100,000 fighters.' },
    { term: 'WMD', full: 'Weapons of Mass Destruction', definition: 'Nuclear, biological, chemical, or radiological weapons capable of mass casualties. Use triggers international legal obligations.' },
    { term: 'UAV', full: 'Unmanned Aerial Vehicle', definition: 'Military drone. Houthis and Iranian proxies use swarms for long-range strikes on infrastructure and naval targets.' },
    { term: 'UCAV', full: 'Unmanned Combat Aerial Vehicle', definition: 'Armed drone capable of strike missions. Used by US (MQ-9 Reaper), Iran (Shahed-136), and proxies.' },
    { term: 'MANPADS', full: 'Man-Portable Air-Defense Systems', definition: 'Shoulder-fired surface-to-air missiles. Effective against helicopters and low-flying aircraft. Widely proliferated.' },
    { term: 'ICBM', full: 'Intercontinental Ballistic Missile', definition: 'Missile with range > 5,500 km. Can carry nuclear warheads. Capable of striking any point on Earth.' },
    { term: 'IRBM', full: 'Intermediate-Range Ballistic Missile', definition: 'Range 3,000–5,500 km. Iran\'s Shahab-3 and Khorramshahr fall in this category.' },
    { term: 'ICJ', full: 'International Court of Justice', definition: 'UN\'s principal judicial organ. Settles legal disputes between states. Rulings are binding but enforcement depends on UNSC.' },
    { term: 'ICC', full: 'International Criminal Court', definition: 'Prosecutes individuals for war crimes, crimes against humanity, and genocide. Not all major powers are members.' },
    { term: 'BRI', full: 'Belt and Road Initiative', definition: 'China\'s global infrastructure investment strategy (140+ countries). Used to build economic influence and strategic dependencies.' },
    { term: 'G7', full: 'Group of Seven', definition: 'US, UK, France, Germany, Italy, Japan, Canada. Coordinates policy among major advanced democracies. ~45% of global GDP.' },
    { term: 'G20', full: 'Group of Twenty', definition: 'G7 + major emerging economies (China, India, Russia, Brazil, etc.). Represents ~85% of global GDP and 2/3 of world population.' },
    { term: 'IMF', full: 'International Monetary Fund', definition: 'Provides balance-of-payments support and crisis loans. Conditions often require fiscal austerity ("structural adjustment").' },
    { term: 'Strait of Hormuz', full: 'Strait of Hormuz', definition: '33 km wide chokepoint between Iran and Oman. ~20% of global oil supply passes through it. Closure = global oil shock.' },
    { term: 'OPEC+', full: 'OPEC Plus', definition: 'OPEC (13 members) + Russia and allies. Coordinates oil production to influence prices. Saudi Arabia is de facto leader.' },
    { term: 'Sanctions', full: 'Economic Sanctions', definition: 'Trade/financial penalties imposed by states or international bodies. Secondary sanctions target third parties trading with sanctioned nations.' },
  ],
  dashboard: [
    { term: 'Probability %', full: 'Scenario Probability', definition: 'Estimated likelihood this scenario occurs. Probabilities across all scenarios in an analysis sum to ~100%. Based on indicators, precedent, and actor incentives.' },
    { term: 'Impact 1–10', full: 'Impact Score', definition: '1 = negligible impact, 5–6 = significant disruption, 7–8 = severe, 9–10 = catastrophic/civilizational. Color-coded green → amber → red.' },
    { term: 'Observed', full: 'Observed Signal', definition: 'A leading indicator for this scenario that has already materialized in the real world. Red signal dot.' },
    { term: 'Emerging', full: 'Emerging Signal', definition: 'An indicator showing early signs but not yet fully confirmed. Amber signal dot.' },
    { term: 'Not Yet', full: 'Signal Not Observed', definition: 'Watch indicator — has not yet been seen. Gray dot. Monitor for activation.' },
    { term: 'Fully Sustainable', full: 'Sustainability: Fully Sustainable', definition: 'Actor can maintain this course of action indefinitely given current resources, political will, and alliance support.' },
    { term: 'Short-Term Only', full: 'Sustainability: Short-Term Only', definition: 'Sustainable for 6–18 months before economic, political, or military strain forces a change of course.' },
    { term: 'Barely Feasible', full: 'Sustainability: Barely Feasible', definition: 'Severe strain begins immediately. Action is possible but carries high risk of early collapse.' },
    { term: 'Not Feasible', full: 'Sustainability: Not Feasible', definition: 'This course of action is unrealistic despite theoretical capability. Critical constraints make it non-viable.' },
    { term: 'Dealbreaker', full: 'Dealbreaker', definition: 'The single most likely reason an action or strategy fails catastrophically. The critical constraint to watch.' },
    { term: 'Confidence Level', full: 'Analytical Confidence', definition: 'How certain the overall analysis is. High = strong precedents and clear indicators. Medium = meaningful uncertainty. Low = significant fog.' },
    { term: 'Time Horizons', full: 'Time Horizons', definition: 'Short-term (0–6 months), Medium-term (6–24 months), Long-term (2–10 years). Shows how scenarios evolve over time.' },
    { term: 'Signpost', full: 'Indicator / Signpost', definition: 'Observable, real-world signal that would confirm a scenario is unfolding. Monitor these to update probability assessments.' },
  ],
}

const categories = [
  { id: 'financial', label: 'Financial Terms', icon: TrendingUp, color: '#10b981', count: glossary.financial.length },
  { id: 'geopolitical', label: 'Geopolitical Terms', icon: Globe2, color: '#f59e0b', count: glossary.geopolitical.length },
  { id: 'dashboard', label: 'Dashboard Guide', icon: BarChart3, color: '#8b5cf6', count: glossary.dashboard.length },
]

function TermCard({ item, accentColor }) {
  const [aiState, setAiState] = useState('idle') // idle | loading | done | error
  const [aiText, setAiText] = useState('')
  const [expanded, setExpanded] = useState(false)

  const explain = async () => {
    if (aiState === 'done') { setExpanded(p => !p); return }
    setAiState('loading')
    setExpanded(true)
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: `Explain "${item.term}" (${item.full}) in depth. Give a concrete, practical example relevant to financial markets or geopolitical analysis. Keep it under 120 words. Be direct — no preamble.`,
          context: `Term: ${item.term} — ${item.full}\nDefinition: ${item.definition}`,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setAiText(data.text)
      setAiState('done')
    } catch (err) {
      setAiText(err.message)
      setAiState('error')
    }
  }

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, rgba(17,24,39,0.78), rgba(17,24,39,0.55))',
        backdropFilter: 'blur(10px) saturate(140%)',
        WebkitBackdropFilter: 'blur(10px) saturate(140%)',
        border: '1px solid rgba(148,163,184,0.08)',
        borderLeft: `2px solid ${accentColor}55`,
        borderRadius: 12,
        padding: '0.95rem 1.1rem',
        transition: 'all 0.2s cubic-bezier(0.22,1,0.36,1)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${accentColor}55`
        e.currentTarget.style.borderLeftColor = accentColor
        e.currentTarget.style.transform = 'translateX(2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(148,163,184,0.08)'
        e.currentTarget.style.borderLeftColor = `${accentColor}55`
        e.currentTarget.style.transform = 'translateX(0)'
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '0 1rem', alignItems: 'start' }}>
        {/* Term */}
        <div style={{ minWidth: '80px', paddingTop: '0.05rem' }}>
          <span style={{
            fontFamily: 'ui-monospace, monospace', fontWeight: 800, fontSize: '0.9rem',
            color: accentColor, whiteSpace: 'nowrap',
            letterSpacing: '-0.01em',
            textShadow: `0 0 18px ${accentColor}33`,
          }}>
            {item.term}
          </span>
        </div>
        {/* Definition */}
        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.3rem', letterSpacing: '-0.005em' }}>
            {item.full}
          </div>
          <div style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.65 }}>
            {item.definition}
          </div>
          {/* AI explanation */}
          {expanded && aiState !== 'idle' && (
            <div style={{
              marginTop: '0.65rem', padding: '0.65rem 0.85rem',
              background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.2)',
              borderRadius: '6px', borderLeft: '3px solid #8b5cf6',
            }}>
              {aiState === 'loading' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#8b5cf6', fontSize: '0.78rem' }}>
                  <Sparkles size={12} style={{ animation: 'spin 1s linear infinite' }} /> Explaining…
                </div>
              )}
              {aiState === 'done' && (
                <div style={{ color: '#c4b5fd', fontSize: '0.8rem', lineHeight: 1.65 }}>{aiText}</div>
              )}
              {aiState === 'error' && (
                <div style={{ color: '#ef4444', fontSize: '0.78rem' }}>Error: {aiText}</div>
              )}
            </div>
          )}
        </div>
        {/* Explain button */}
        <div style={{ paddingTop: '0.05rem' }}>
          <button
            onClick={explain}
            disabled={aiState === 'loading'}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
              padding: '0.25rem 0.55rem',
              background: aiState === 'done' ? 'rgba(139,92,246,0.12)' : 'transparent',
              border: `1px solid ${aiState === 'done' ? 'rgba(139,92,246,0.35)' : '#1e293b'}`,
              borderRadius: '4px', cursor: aiState === 'loading' ? 'wait' : 'pointer',
              color: aiState === 'done' ? '#8b5cf6' : '#64748b',
              fontSize: '0.7rem', fontWeight: 600, whiteSpace: 'nowrap',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (aiState !== 'loading') { e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.color = '#8b5cf6' } }}
            onMouseLeave={e => { if (aiState !== 'done') { e.currentTarget.style.borderColor = '#1e293b'; e.currentTarget.style.color = '#64748b' } }}
          >
            {aiState === 'loading'
              ? <Sparkles size={10} style={{ animation: 'spin 1s linear infinite' }} />
              : <Sparkles size={10} />
            }
            {aiState === 'done' ? (expanded ? 'Hide' : 'Show') : '✦ Explain'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── AI Glossary Lookup (shown when search returns 0 results) ─────────────────
function AiGlossaryLookup({ query, onTermAdded }) {
  const [state, setAiState] = useState('idle') // idle | loading | relevant | irrelevant | error
  const [result, setResult] = useState(null)   // { term, full, definition, category, reason }
  const [saveState, setSaveState] = useState('idle') // idle | saving | saved | error
  const [saveMsg, setSaveMsg] = useState('')
  const askedRef = useRef('')

  useEffect(() => {
    if (!query.trim() || query === askedRef.current) return
    askedRef.current = query

    const timer = setTimeout(async () => {
      setAiState('loading')
      setResult(null)
      setSaveState('idle')
      setSaveMsg('')

      try {
        const res = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: `The user searched for "${query}" in a financial and geopolitical analysis glossary but got no results.

Determine:
1. Is "${query}" related to financial markets, stock analysis, geopolitical analysis, international relations, macroeconomics, or the dashboard/analytical concepts used in such analysis?
2. If yes, produce a concise glossary entry for it.

Respond ONLY with valid JSON, no markdown:
{
  "relevant": true or false,
  "term": "the term or acronym exactly as it should appear",
  "full": "full expanded name",
  "definition": "clear, dense definition under 60 words — specific, no fluff",
  "category": "financial" or "geopolitical" or "dashboard",
  "reason": "one sentence explaining relevance or why it doesn't fit"
}

If not relevant, set relevant: false and leave term/full/definition/category as empty strings.`,
            context: 'Glossary categories: financial (stocks, ratios, oil, macro), geopolitical (conflicts, treaties, military, international bodies), dashboard (analytical terms, scenario labels, signal types).',
          }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'AI lookup failed')

        let parsed
        try {
          const clean = data.text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
          parsed = JSON.parse(clean)
        } catch {
          const match = data.text.match(/\{[\s\S]*?\}/)
          if (match) parsed = JSON.parse(match[0])
          else throw new Error('Could not parse AI response')
        }

        if (parsed.relevant && parsed.term && parsed.definition) {
          setResult(parsed)
          setAiState('relevant')
        } else {
          setResult(parsed)
          setAiState('irrelevant')
        }
      } catch (err) {
        setAiState('error')
        setResult({ reason: err.message })
      }
    }, 600) // debounce — wait for user to stop typing

    return () => clearTimeout(timer)
  }, [query])

  const saveTerm = async () => {
    if (!result) return
    setSaveState('saving')
    setSaveMsg('')
    try {
      const res = await fetch('/api/save-glossary-term', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          term: result.term,
          full: result.full,
          definition: result.definition,
          category: result.category,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      setSaveState('saved')
      setSaveMsg(`"${result.term}" added to ${result.category} glossary — will appear after the next page refresh.`)
      if (onTermAdded) onTermAdded(result)
    } catch (err) {
      setSaveState('error')
      setSaveMsg(err.message)
    }
  }

  const catColor = { financial: '#10b981', geopolitical: '#f59e0b', dashboard: '#8b5cf6' }

  return (
    <div className="fade-in" style={{ marginTop: '1.5rem' }}>
      {state === 'loading' && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1.25rem',
          background: 'rgba(139,92,246,0.06)',
          border: '1px solid rgba(139,92,246,0.22)',
          borderRadius: 12,
          color: '#c4b5fd', fontSize: '0.85rem',
        }}>
          <Sparkles size={14} style={{ animation: 'spin 1s linear infinite' }} />
          AI is looking up "{query}"…
        </div>
      )}

      {state === 'relevant' && result && (
        <div style={{
          background: 'linear-gradient(180deg, rgba(17,24,39,0.85), rgba(17,24,39,0.6))',
          backdropFilter: 'blur(12px) saturate(140%)',
          WebkitBackdropFilter: 'blur(12px) saturate(140%)',
          border: '1px solid rgba(139,92,246,0.32)',
          borderLeft: '3px solid #8b5cf6',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 12px 32px rgba(139,92,246,0.12)',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.7rem 1.1rem',
            background: 'linear-gradient(90deg, rgba(139,92,246,0.10), rgba(139,92,246,0.02))',
            borderBottom: '1px solid rgba(139,92,246,0.15)',
          }}>
            <Sparkles size={13} color="#8b5cf6" />
            <span style={{ color: '#8b5cf6', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              AI Lookup — not in glossary yet
            </span>
            {result.category && (
              <span style={{ marginLeft: 'auto', fontSize: '0.62rem', fontWeight: 700, padding: '2px 7px', borderRadius: '3px', background: `${catColor[result.category] || '#64748b'}20`, color: catColor[result.category] || '#64748b', textTransform: 'capitalize' }}>
                {result.category}
              </span>
            )}
          </div>

          {/* Term */}
          <div style={{ padding: '0.9rem 1.1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '0 1rem', alignItems: 'start' }}>
              <div style={{ minWidth: '80px' }}>
                <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.9rem', color: catColor[result.category] || '#8b5cf6' }}>
                  {result.term}
                </span>
              </div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.25rem' }}>{result.full}</div>
                <div style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.6 }}>{result.definition}</div>
              </div>
              {/* Add button */}
              <div>
                {saveState === 'idle' && (
                  <button
                    onClick={saveTerm}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.28rem 0.65rem', background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.35)', borderRadius: '5px', color: '#8b5cf6', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                  >
                    <Plus size={11} /> Add to Glossary
                  </button>
                )}
                {saveState === 'saving' && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.28rem 0.65rem', color: '#64748b', fontSize: '0.72rem', fontWeight: 600 }}>
                    <Sparkles size={11} style={{ animation: 'spin 1s linear infinite' }} /> Saving…
                  </span>
                )}
                {saveState === 'saved' && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.28rem 0.65rem', color: '#10b981', fontSize: '0.72rem', fontWeight: 700 }}>
                    <CheckCircle size={11} /> Added
                  </span>
                )}
                {saveState === 'error' && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.28rem 0.65rem', color: '#ef4444', fontSize: '0.72rem', fontWeight: 600 }}>
                    <AlertCircle size={11} /> Failed
                  </span>
                )}
              </div>
            </div>
            {saveMsg && (
              <div style={{ marginTop: '0.6rem', fontSize: '0.72rem', color: saveState === 'saved' ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                {saveState === 'saved' ? <CheckCircle size={11} /> : <AlertCircle size={11} />}
                {saveMsg}
              </div>
            )}
          </div>
        </div>
      )}

      {state === 'irrelevant' && result && (
        <div className="surface" style={{
          display: 'flex', alignItems: 'center', gap: '0.55rem',
          padding: '1rem 1.25rem',
          color: '#64748b', fontSize: '0.82rem',
        }}>
          <AlertCircle size={13} color="#475569" />
          <span>
            <strong style={{ color: '#cbd5e1' }}>"{query}"</strong> doesn't appear to relate to financial markets or geopolitical analysis. {result.reason}
          </span>
        </div>
      )}

      {state === 'error' && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.55rem',
          padding: '1rem 1.25rem',
          background: 'rgba(239,68,68,0.06)',
          border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: 12,
          color: '#fca5a5', fontSize: '0.8rem',
        }}>
          <AlertCircle size={13} />
          AI lookup failed: {result?.reason}
        </div>
      )}
    </div>
  )
}

export default function HelpPage() {
  const [activeCategory, setActiveCategory] = useState('financial')
  const [search, setSearch] = useState('')
  const [localTerms, setLocalTerms] = useState({ financial: [], geopolitical: [], dashboard: [] })

  const allTerms = [
    ...Object.values(glossary).flat(),
    ...Object.values(localTerms).flat(),
  ]
  const filtered = search.trim()
    ? allTerms.filter(t =>
        t.term.toLowerCase().includes(search.toLowerCase()) ||
        t.full.toLowerCase().includes(search.toLowerCase()) ||
        t.definition.toLowerCase().includes(search.toLowerCase())
      )
    : [...glossary[activeCategory], ...(localTerms[activeCategory] || [])]

  const activeCat = categories.find(c => c.id === activeCategory)
  const noResults = search.trim() && filtered.length === 0

  const handleTermAdded = (result) => {
    // Optimistically add to local state so it shows immediately without a page reload
    setLocalTerms(prev => ({
      ...prev,
      [result.category]: [
        { term: result.term, full: result.full, definition: result.definition },
        ...(prev[result.category] || []),
      ],
    }))
  }

  return (
    <div style={{ minHeight: '100vh', color: '#f8fafc' }}>
      <SiteNavBar />

      <div style={{ maxWidth: '980px', margin: '0 auto', padding: '2.25rem 1.5rem' }}>

        {/* Header */}
        <div className="float-in" style={{ marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(148,163,184,0.06)' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.28rem 0.7rem', borderRadius: 999,
            background: 'rgba(6,182,212,0.08)',
            border: '1px solid rgba(6,182,212,0.22)',
            color: '#22d3ee',
            fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '0.85rem',
          }}>
            <BarChart3 size={11} /> Reference
          </div>
          <h1 className="display-1" style={{ fontSize: 'clamp(1.6rem, 3vw, 2rem)', margin: '0 0 0.5rem' }}>
            Glossary &amp; <span className="gradient-text-cyan">Reference</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.92rem', margin: 0, lineHeight: 1.55, maxWidth: 720 }}>
            Definitions for financial, geopolitical, and dashboard terms. Click{' '}
            <span style={{
              color: '#c4b5fd', fontWeight: 700,
              background: 'rgba(139,92,246,0.12)', padding: '1px 6px', borderRadius: 4,
              border: '1px solid rgba(139,92,246,0.3)',
            }}>✦ Explain</span>{' '}
            for an AI deep-dive. Unknown terms are looked up and added automatically.
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
          <Search size={15} color="#64748b" style={{ position: 'absolute', left: '0.95rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1 }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search all terms — unknown terms are looked up by AI…"
            className="input"
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '0.7rem 1rem 0.7rem 2.6rem',
              fontSize: '0.92rem',
            }}
          />
        </div>

        {/* Category tabs */}
        {!search.trim() && (
          <div style={{
            display: 'flex', gap: '0.3rem', marginBottom: '1.25rem', flexWrap: 'wrap',
            padding: '0.4rem',
            background: 'rgba(17,24,39,0.5)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(148,163,184,0.08)',
            borderRadius: 14,
          }}>
            {categories.map(cat => {
              const Icon = cat.icon
              const active = activeCategory === cat.id
              const count = cat.count + (localTerms[cat.id]?.length || 0)
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
                    padding: '0.5rem 0.95rem', borderRadius: 10, cursor: 'pointer',
                    border: active ? `1px solid ${cat.color}66` : '1px solid transparent',
                    background: active
                      ? `linear-gradient(135deg, ${cat.color}22, ${cat.color}10)`
                      : 'transparent',
                    color: active ? cat.color : '#94a3b8',
                    fontSize: '0.8rem', fontWeight: 600, fontFamily: 'inherit',
                    transition: 'all 0.18s cubic-bezier(0.22,1,0.36,1)',
                    boxShadow: active ? `0 6px 18px ${cat.color}22` : 'none',
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.color = '#f1f5f9'; e.currentTarget.style.background = 'rgba(148,163,184,0.06)' } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent' } }}
                >
                  <Icon size={13} />
                  {cat.label}
                  <span style={{
                    fontSize: '0.66rem', padding: '1px 7px', borderRadius: 999,
                    background: active ? `${cat.color}28` : 'rgba(148,163,184,0.10)',
                    color: active ? cat.color : '#64748b',
                    fontFamily: 'ui-monospace, monospace',
                    fontWeight: 700,
                  }}>{count}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* Search result count */}
        {search.trim() && filtered.length > 0 && (
          <div style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '1rem' }}>
            <span style={{ color: '#cbd5e1', fontWeight: 700 }}>{filtered.length}</span>{' '}
            result{filtered.length !== 1 ? 's' : ''} for "{search}"
          </div>
        )}

        {/* Terms list */}
        <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {filtered.map((item, i) => (
            <TermCard
              key={`${item.term}-${i}`}
              item={item}
              accentColor={search.trim() ? '#06b6d4' : activeCat?.color ?? '#06b6d4'}
            />
          ))}
        </div>

        {/* AI fallback when search finds nothing */}
        {noResults && (
          <AiGlossaryLookup query={search.trim()} onTermAdded={handleTermAdded} />
        )}

        <div className="surface" style={{
          marginTop: '2.25rem', padding: '1rem 1.25rem',
          fontSize: '0.74rem', color: '#64748b', textAlign: 'center',
          fontFamily: 'ui-monospace, monospace',
        }}>
          <span style={{ color: '#cbd5e1', fontWeight: 700 }}>
            {glossary.financial.length + glossary.geopolitical.length + glossary.dashboard.length + Object.values(localTerms).flat().length}
          </span>{' '}
          terms across {categories.length} categories · Analysis Dashboard Hub
        </div>
      </div>
    </div>
  )
}
