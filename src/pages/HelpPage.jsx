import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Home, BookOpen, TrendingUp, Globe2, BarChart3, Search, ChevronRight } from 'lucide-react'

const glossary = {
  financial: [
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

export default function HelpPage() {
  const [activeCategory, setActiveCategory] = useState('financial')
  const [search, setSearch] = useState('')

  const allTerms = Object.values(glossary).flat()
  const filtered = search.trim()
    ? allTerms.filter(t =>
        t.term.toLowerCase().includes(search.toLowerCase()) ||
        t.full.toLowerCase().includes(search.toLowerCase()) ||
        t.definition.toLowerCase().includes(search.toLowerCase())
      )
    : glossary[activeCategory]

  const activeCat = categories.find(c => c.id === activeCategory)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0f1e', color: '#f8fafc', fontFamily: 'system-ui, sans-serif', padding: '1.5rem' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem', borderBottom: '1px solid #1e293b', paddingBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                <BookOpen size={22} color="#06b6d4" />
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
                  Glossary & Reference
                </h1>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
                Definitions for financial, geopolitical, and dashboard terms used across analyses
              </p>
            </div>
            <Link to="/" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600,
              textDecoration: 'none', padding: '0.4rem 0.85rem',
              border: '1px solid #1e293b', borderRadius: '6px',
              backgroundColor: '#111827',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#06b6d4'; e.currentTarget.style.color = '#06b6d4' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e293b'; e.currentTarget.style.color = '#94a3b8' }}
            >
              <Home size={13} /> Home
            </Link>
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
          <Search size={15} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search all terms — e.g. P/E, IRGC, bbl, ceasefire..."
            style={{
              width: '100%', boxSizing: 'border-box',
              background: '#111827', border: '1px solid #1e293b',
              borderRadius: '8px', padding: '0.65rem 1rem 0.65rem 2.5rem',
              color: '#f8fafc', fontSize: '0.9rem', outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = '#06b6d4'}
            onBlur={e => e.target.style.borderColor = '#1e293b'}
          />
        </div>

        {/* Category tabs — hide when searching */}
        {!search.trim() && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            {categories.map(cat => {
              const Icon = cat.icon
              const active = activeCategory === cat.id
              return (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.45rem 1rem', borderRadius: '6px', cursor: 'pointer',
                  border: `1px solid ${active ? cat.color : '#1e293b'}`,
                  backgroundColor: active ? `${cat.color}18` : 'transparent',
                  color: active ? cat.color : '#94a3b8',
                  fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.15s',
                }}>
                  <Icon size={13} />
                  {cat.label}
                  <span style={{
                    fontSize: '0.65rem', padding: '1px 5px', borderRadius: '3px',
                    backgroundColor: active ? `${cat.color}28` : '#1e293b',
                    color: active ? cat.color : '#64748b',
                  }}>{cat.count}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* Search result header */}
        {search.trim() && (
          <div style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '1rem' }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
          </div>
        )}

        {/* Terms list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', fontSize: '0.875rem' }}>
              No terms found for "{search}"
            </div>
          ) : filtered.map((item, i) => (
            <div key={i} style={{
              backgroundColor: '#111827', border: '1px solid #1e293b',
              borderRadius: '8px', padding: '0.9rem 1.1rem',
              display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0 1rem', alignItems: 'start',
            }}>
              <div style={{ minWidth: '80px', paddingTop: '0.05rem' }}>
                <span style={{
                  fontFamily: 'monospace', fontWeight: 800, fontSize: '0.9rem',
                  color: search.trim() ? '#06b6d4' : activeCat?.color ?? '#06b6d4',
                  whiteSpace: 'nowrap',
                }}>
                  {item.term}
                </span>
              </div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.25rem' }}>
                  {item.full}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.6 }}>
                  {item.definition}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#111827', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '0.75rem', color: '#475569', textAlign: 'center' }}>
          {glossary.financial.length + glossary.geopolitical.length + glossary.dashboard.length} terms across {categories.length} categories · Analysis Dashboard Hub
        </div>
      </div>
    </div>
  )
}
