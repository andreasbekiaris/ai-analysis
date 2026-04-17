// Exchange metadata — open/close times in the local timezone of each exchange,
// plus country codes and currency. All times are expressed in minutes since local midnight.
//
// Used by:
//   - watcher.cjs scheduler (to convert "before-all-open" / "country-of-origin" / "after-own-close"
//     modes into concrete firing times in Europe/Athens)
//   - ReanalyzeScheduleButton and BestPicks UI (for labels and country filters)

export const EXCHANGES = {
  ATHEX: {
    code: 'ATHEX',
    name: 'Athens Stock Exchange',
    country: 'GR',
    countryLabel: 'Greek',
    flag: 'GR',
    timezone: 'Europe/Athens',
    openMinutes: 10 * 60 + 30,   // 10:30 local
    closeMinutes: 17 * 60 + 20,  // 17:20 local
    currency: 'EUR',
    tickerSuffixes: ['.AT', '.ATH'],
  },
  NYSE: {
    code: 'NYSE',
    name: 'New York Stock Exchange',
    country: 'US',
    countryLabel: 'US',
    flag: 'US',
    timezone: 'America/New_York',
    openMinutes: 9 * 60 + 30,    // 09:30 local
    closeMinutes: 16 * 60,       // 16:00 local
    currency: 'USD',
    tickerSuffixes: [],          // US tickers typically have no suffix
  },
  NASDAQ: {
    code: 'NASDAQ',
    name: 'NASDAQ',
    country: 'US',
    countryLabel: 'US',
    flag: 'US',
    timezone: 'America/New_York',
    openMinutes: 9 * 60 + 30,
    closeMinutes: 16 * 60,
    currency: 'USD',
    tickerSuffixes: [],
  },
  LSE: {
    code: 'LSE',
    name: 'London Stock Exchange',
    country: 'GB',
    countryLabel: 'UK',
    flag: 'GB',
    timezone: 'Europe/London',
    openMinutes: 8 * 60,         // 08:00 local
    closeMinutes: 16 * 60 + 30,  // 16:30 local
    currency: 'GBP',
    tickerSuffixes: ['.L', '.LON'],
  },
}

export const COUNTRIES = [
  { code: 'GLOBAL', label: 'Global',  exchanges: ['ATHEX', 'NYSE', 'NASDAQ', 'LSE'] },
  { code: 'GR',     label: 'Greek',   exchanges: ['ATHEX'] },
  { code: 'US',     label: 'US',      exchanges: ['NYSE', 'NASDAQ'] },
  { code: 'GB',     label: 'UK',      exchanges: ['LSE'] },
]

// Resolve a ticker to its exchange code.
// Falls back to NYSE for unrecognised US-style tickers.
export function resolveExchange(ticker, explicitExchange) {
  if (explicitExchange && EXCHANGES[explicitExchange]) return EXCHANGES[explicitExchange]
  if (!ticker) return EXCHANGES.NYSE

  const t = ticker.toUpperCase()
  for (const ex of Object.values(EXCHANGES)) {
    if (ex.tickerSuffixes.some(suffix => t.endsWith(suffix))) return ex
  }
  return EXCHANGES.NYSE
}

// Default "before all exchanges open" fires at 08:00 Athens time —
// 2 hours before the earliest opener (LSE at 10:00 Athens in EEST, 09:00 in EET).
export const BEFORE_ALL_OPEN_ATHENS = { hour: 8, minute: 0 }

// Schedule modes the user can pick per dashboard.
export const SCHEDULE_MODES = {
  BEFORE_ALL_OPEN: 'before-all-open',     // 08:00 Athens local
  BEFORE_OWN_OPEN: 'before-own-open',     // 30m before the stock's own exchange opens
  AFTER_OWN_CLOSE: 'after-own-close',     // 15m after the stock's own exchange closes  (default)
  CUSTOM: 'custom',                        // user-specified HH:MM in Athens time
}
