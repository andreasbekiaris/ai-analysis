#!/usr/bin/env node

/**
 * Analysis Watcher — Instant GitHub webhook-driven analysis trigger
 *
 * HOW IT WORKS:
 * 1. Runs in the background on your desktop
 * 2. Connects to smee.io to receive GitHub webhooks instantly
 * 3. When a new issue is created, it launches Claude Code with the title as the prompt
 * 4. Claude Code creates the dashboard, commits, and pushes
 * 5. Vercel auto-deploys — you see results on your phone
 *
 * FIRST-TIME SETUP:
 * 1. Run: `node watcher.js` — it will create a smee channel and GitHub webhook automatically
 * 2. The smee URL is saved to .smee-url so it persists across restarts
 *
 * FROM YOUR PHONE:
 * - Open GitHub app or browser
 * - Go to your repo → Issues → New Issue
 * - Title: "Analyze US-China trade war" (the title IS the prompt)
 * - Body: optional extra context
 * - The watcher triggers instantly.
 */

const { execSync, spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

// ============================================
// CONFIG — EDIT THESE VALUES
// ============================================
const CONFIG = {
  owner: 'andreasbekiaris',
  repo: 'ai-analysis',

  projectPath: path.join(process.env.HOME || process.env.USERPROFILE, 'Documents', 'projects', 'ai-analysis'),

  // Local server port for receiving webhooks
  port: 7890,

  doneLabel: 'completed',
  processingLabel: 'in-progress',

  // File to persist the smee channel URL across restarts
  smeeUrlFile: path.join(process.env.HOME || process.env.USERPROFILE, 'Documents', 'projects', 'ai-analysis', '.smee-url'),
};

// ============================================
// WATCHER LOGIC
// ============================================

const log = (msg) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${msg}`);
};

const logError = (msg) => {
  const timestamp = new Date().toLocaleTimeString();
  console.error(`[${timestamp}] ${msg}`);
};

// Track issues currently being processed to avoid duplicates
const processing = new Set();

/**
 * Get or create a smee.io channel URL
 */
async function getSmeeUrl() {
  // Check if we have a saved URL
  if (fs.existsSync(CONFIG.smeeUrlFile)) {
    const url = fs.readFileSync(CONFIG.smeeUrlFile, 'utf-8').trim();
    if (url) {
      log(`Using saved smee channel: ${url}`);
      return url;
    }
  }

  // Create a new channel using smee-client's built-in static method
  log('Creating new smee.io channel...');
  const SmeeClient = (await import('smee-client')).default;
  const url = await SmeeClient.createChannel();

  fs.writeFileSync(CONFIG.smeeUrlFile, url);
  log(`Created smee channel: ${url}`);
  return url;
}

/**
 * Set up GitHub webhook pointing to smee channel
 */
function setupGitHubWebhook(smeeUrl) {
  try {
    // Check if webhook already exists
    const existing = execSync(
      `gh api repos/${CONFIG.owner}/${CONFIG.repo}/hooks --jq ".[].config.url"`,
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
    ).trim();

    if (existing.includes(smeeUrl)) {
      log('  GitHub webhook already configured');
      return;
    }

    // Create webhook
    execSync(
      `gh api repos/${CONFIG.owner}/${CONFIG.repo}/hooks --method POST --field "config[url]=${smeeUrl}" --field "config[content_type]=json" --field "events[]=issues" --field active=true`,
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
    );
    log('  GitHub webhook created');
  } catch (err) {
    logError(`Could not set up webhook: ${err.message}`);
    logError('You may need to add it manually in GitHub repo Settings > Webhooks');
  }
}

/**
 * Start smee client to proxy webhooks to local server
 */
async function startSmeeClient(smeeUrl) {
  const SmeeClient = (await import('smee-client')).default;

  const smee = new SmeeClient({
    source: smeeUrl,
    target: `http://localhost:${CONFIG.port}/webhook`,
    logger: { info: () => {}, error: logError },
  });

  await smee.start();
  log(`Smee client connected: ${smeeUrl} -> localhost:${CONFIG.port}`);
}

/**
 * Start local HTTP server to receive webhook events
 */
function startWebhookServer() {
  const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/webhook') {
      let body = '';
      req.on('data', (chunk) => body += chunk);
      req.on('end', () => {
        res.writeHead(200);
        res.end('ok');

        try {
          const event = JSON.parse(body);
          handleWebhookEvent(req.headers, event);
        } catch (err) {
          logError(`Failed to parse webhook: ${err.message}`);
        }
      });
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  server.listen(CONFIG.port, () => {
    log(`Webhook server listening on port ${CONFIG.port}`);
  });
}

/**
 * Handle incoming webhook event
 */
function handleWebhookEvent(headers, event) {
  const githubEvent = headers['x-github-event'];

  // Only care about new issues being opened
  if (githubEvent !== 'issues' || event.action !== 'opened') {
    return;
  }

  const issue = event.issue;
  if (!issue) return;

  log(`New issue detected instantly: #${issue.number} "${issue.title}"`);

  // Avoid processing the same issue twice
  if (processing.has(issue.number)) {
    log(`Issue #${issue.number} is already being processed, skipping`);
    return;
  }

  processIssue({
    number: issue.number,
    title: issue.title,
    body: issue.body || '',
  });
}

/**
 * Add a label and comment to an issue
 */
function updateIssue(issueNumber, status, comment) {
  // Synthetic issues (scheduled runs) use negative numbers — skip GitHub I/O.
  if (typeof issueNumber === 'number' && issueNumber < 0) {
    log(`[scheduled ${issueNumber}] ${status}: ${comment.slice(0, 160)}`);
    return;
  }
  try {
    execSync(
      `gh issue comment ${issueNumber} --repo ${CONFIG.owner}/${CONFIG.repo} --body "${comment}"`,
      { encoding: 'utf-8', timeout: 15000 }
    );

    if (status === 'processing') {
      execSync(
        `gh issue edit ${issueNumber} --repo ${CONFIG.owner}/${CONFIG.repo} --add-label "${CONFIG.processingLabel}"`,
        { encoding: 'utf-8', timeout: 15000 }
      );
    } else if (status === 'done') {
      execSync(
        `gh issue edit ${issueNumber} --repo ${CONFIG.owner}/${CONFIG.repo} --add-label "${CONFIG.doneLabel}" --remove-label "${CONFIG.processingLabel}"`,
        { encoding: 'utf-8', timeout: 15000 }
      );
      execSync(
        `gh issue close ${issueNumber} --repo ${CONFIG.owner}/${CONFIG.repo}`,
        { encoding: 'utf-8', timeout: 15000 }
      );
    }
  } catch (err) {
    logError(`Failed to update issue #${issueNumber}: ${err.message}`);
  }
}

/**
 * Build the Claude Code prompt for a fresh analysis (new dashboard)
 */
function buildAnalysisPrompt(analysisRequest) {
  return [
    analysisRequest,
    '',
    'FAST-PATH INSTRUCTIONS — follow these exactly to minimize time:',
    '1. Read CLAUDE.md first to understand the skill (geopolitical or stock) and data structure.',
    '2. Use the shared GeoDashboard component at src/components/GeoDashboard.jsx — do NOT rebuild the UI. Your job is only to produce the DATA file (analysisData, politicalComments, strategicVerdict, analysisGaps, affectedCountries) and export a thin wrapper component that passes them to <GeoDashboard />.',
    '3. Run all web searches in parallel — do not do them sequentially.',
    '4. Skip generating a Word document — dashboard only.',
    '5. After writing the .jsx file: update App.jsx routing, git add the new file + App.jsx, commit, then push.',
    '6. The commit message must follow: feat: [type] analysis - [subject] - [YYYY-MM-DD]',
    '',
    'KEY FORMULAS (use directly — saves re-reading full CLAUDE.md):',
    '',
    'STOCK VALUATION:',
    '- DCF: Project FCF at growth rate g for 5yr, discount at WACC (Rf + Beta×5.5%), terminal = FCF5×(1+2.5%)/(WACC−2.5%)',
    '- DDM: DPS×(1+g)/(r−g) where g = ROE×(1−payout), r = Rf + Beta×5.5%',
    '- Relative: P/E vs sector median × EPS, P/B vs historical avg × book value, EV/EBITDA vs sector',
    '- Sensitivity (banks): NII per 25bps = LoanBook × RepricingGap% × 0.0025',
    '- Oil chain: ΔOil+10% → ΔInflation+0.4pp → CB +25bps prob +30%',
    '- Risk: E[R]=Σ(prob×return); MaxDD=(trough−peak)/peak; Sharpe=(E[R]−Rf)/σ',
    '- Kelly%=(WinProb×AvgWin/AvgLoss−LossProb)/(AvgWin/AvgLoss); use quarter-Kelly',
    '',
    'GEO FRAMEWORKS:',
    '- Game theory: model key decisions as Chicken/PD/Assurance game, payoff matrix, find Nash equilibrium',
    '- Bayesian: P(scenario|signal)∝P(signal|scenario)×P(scenario); track probabilityHistory array',
    '- Oil shock: passthrough US 0.03, EU 0.04, EM 0.05-0.07; GDP impact −0.15% per 10% oil increase',
    '- Sanctions analogs: Iran 2012 −6.6%, Russia 2022 −2.1%, Iran 2018 −4.8%',
    '- Escalation ladder: 6 levels (Diplomatic→Economic→Proxy→Limited Military→Strategic Strikes→Total War)',
    '- Political economy: selectorate theory, rally effect +5-15pp decaying 1-2pp/mo, audience costs',
  ].join('\n')
}

/**
 * Build the Claude Code prompt for a reanalysis (update existing dashboard)
 */
function buildReanalyzePrompt(dashboardFile, analysisTitle, extraContext) {
  const today = new Date().toISOString().slice(0, 10)
  const lines = [
    `Fully reanalyze and update the existing dashboard: ${dashboardFile}`,
    `Analysis title: ${analysisTitle}`,
    `Today's date: ${today}`,
    '',
    'REANALYSIS INSTRUCTIONS — follow exactly:',
    '1. Read CLAUDE.md to understand the project structure and data formats.',
    `2. Read the existing file at ${dashboardFile} in full — understand all current data, actors, scenarios, signals, and verdict.`,
    '3. Run ALL web searches in parallel:',
    '   - Latest developments / news (last 24-48h)',
    '   - Current market prices (all relevant commodities, stocks, indices)',
    '   - New public statements or signals from all key actors',
    '   - Expert opinion updates from major think tanks or analysts',
    '4. UPDATE the existing file with everything you found:',
    '   - Prepend new political signals / news items to the TOP of their arrays',
    '   - Revise scenario probabilities to reflect the latest situation',
    '   - Rewrite the verdict (stance, timing, watchpoints, market positioning)',
    '   - Update all price and metric values to current figures',
    '   - Update the analysis date field to today',
    '   - For stock dashboards: update stock.price, stock.change, stock.changePct, and add a new priceHistory entry',
    '   - For valuationModels: update DCF with latest FCF/growth; update DDM with current DPS; recalculate relative valuation with current sector medians',
    '   - For sensitivityAnalysis: update only if macro conditions changed (rate decisions, oil moves >5%)',
    '   - For riskQuantification: recalculate expectedReturn with updated scenario probs; update maxDrawdown if new trough',
    '   - For geo dashboards: add new entry to probabilityHistory; recalculate economicImpact with current oil/trade data; update escalationLadder status',
    `5. Do NOT create a new file — update ONLY the existing file at ${dashboardFile}`,
    '6. Do NOT change App.jsx — the route already exists.',
    `7. git add ${dashboardFile}`,
    `8. Commit: "refactor: reanalyze — ${analysisTitle} — ${today}"`,
    '9. Push to origin main',
  ]
  if (extraContext) lines.push('', `Additional context: ${extraContext}`)
  return lines.join('\n')
}

/**
 * Build the Claude Code prompt for a twice-daily Best Picks screening run.
 * Cheap screening pass — no full fundamentals, no new .jsx files, only writes src/data/best-picks.json.
 */
function buildBestPicksPrompt(runType, watchlistContext) {
  const today = new Date().toISOString().slice(0, 10);
  return [
    `BEST PICKS screening run — ${runType} (${today})`,
    '',
    'OBJECTIVE: Identify the top 3 BUY candidates and top 3 SHORT candidates for each of:',
    '  - Global (any exchange), Greek (ATHEX), US (NYSE/NASDAQ), UK (LSE)',
    '',
    'CRITICAL: This is a CHEAP screening pass. Do NOT run full fundamentals. Do NOT create any .jsx dashboards.',
    'Your only output is the file src/data/best-picks.json.',
    '',
    'STEPS:',
    '1. Read schedule.json → bestPicks.watchlist for the user-added universe (tickers + exchanges).',
    '2. List /src/dashboards/stocks/*.jsx to see which stocks already have analyses and their dates.',
    '3. List /src/dashboards/geopolitical/*.jsx — note any active conflicts to bias picks (sectors exposed to oil, defense, banking under war risk).',
    '4. Run ONE parallel batch of CHEAP web searches:',
    '   - News for each watchlist ticker (today only)',
    '   - "Top movers today ATHEX", "top movers today NYSE", "top movers today LSE"',
    '   - "News-driven stocks today" for each exchange',
    '5. For each candidate, extract only: ticker, name, exchange, current price, changePct today, 1-sentence reason, 1-sentence catalyst. Do NOT pull fundamentals, financials, or analyst targets.',
    '6. Classify each pick against existing dashboards:',
    '   - hasRecentAnalysis=true if dashboard exists AND its "date" field is today',
    '   - hasStaleAnalysis=true if dashboard exists AND date is older than today → suggest deep reanalysis',
    '   - hasNoAnalysis=true if no dashboard yet',
    '   - analysisPath: e.g. "/stocks/alpha" (read App.jsx to confirm path) or null',
    '   - analysisDate: the date field from the dashboard file or null',
    '7. WRITE src/data/best-picks.json with this exact structure (overwrite):',
    '   {',
    `     "generatedAt": "<ISO timestamp>",`,
    `     "runType": "${runType}",`,
    '     "global": { "buy": [...3...], "short": [...3...] },',
    '     "byCountry": {',
    '       "GR": { "buy": [...3 or fewer...], "short": [...3 or fewer...] },',
    '       "US": { "buy": [...3...], "short": [...3...] },',
    '       "GB": { "buy": [...3 or fewer...], "short": [...3 or fewer...] }',
    '     }',
    '   }',
    '   Each entry: { ticker, name, exchange, price, changePct, reason, catalyst, analysisPath, analysisDate, hasRecentAnalysis, hasStaleAnalysis, hasNoAnalysis }',
    '8. git add src/data/best-picks.json && git commit -m "chore: best picks ' + runType + ' screening - ' + today + '" && git push origin main',
    '',
    'DO NOT modify any other files. DO NOT create new dashboards. Speed matters — this is a low-token run.',
    watchlistContext ? ('\nAdditional context: ' + watchlistContext) : '',
  ].filter(Boolean).join('\n');
}

/**
 * Run Claude Code with the analysis prompt
 */
function runClaudeCode(prompt, issueNumber) {
  return new Promise((resolve, reject) => {
    const fullPrompt = prompt;

    log(`Launching Claude Code for issue #${issueNumber}`);

    // Escape double quotes for cmd.exe and wrap prompt in quotes
    const escapedPrompt = fullPrompt.replace(/"/g, '""');
    const claude = spawn(
      `claude --model claude-opus-4-6 --dangerously-skip-permissions -p "${escapedPrompt}"`,
      { cwd: CONFIG.projectPath, stdio: ['pipe', 'pipe', 'pipe'], shell: true, timeout: 600000 }
    );

    let stdout = '';
    let stderr = '';
    let elapsed = 0;

    // Post a progress comment every 30 seconds while Claude is working
    const isSynthetic = typeof issueNumber === 'number' && issueNumber < 0;
    const progressInterval = setInterval(() => {
      elapsed += 30;
      const mins = Math.floor(elapsed / 60);
      const secs = elapsed % 60;
      const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
      log(`[Issue #${issueNumber}] Still working... ${timeStr} elapsed`);
      if (isSynthetic) return;
      try {
        execSync(
          `gh issue comment ${issueNumber} --repo ${CONFIG.owner}/${CONFIG.repo} --body "⏳ Still working... (${timeStr} elapsed). Claude Code is researching and building your dashboard."`,
          { encoding: 'utf-8', timeout: 15000 }
        );
      } catch (err) {
        logError(`Could not post progress update: ${err.message}`);
      }
    }, 30000);

    claude.stdout.on('data', (data) => {
      const text = data.toString();
      stdout += text;
      process.stdout.write(text);
    });

    claude.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    claude.on('close', (code) => {
      clearInterval(progressInterval);
      if (code === 0) {
        log(`Claude Code finished successfully for issue #${issueNumber}`);
        resolve(stdout);
      } else {
        logError(`Claude Code exited with code ${code}`);
        reject(new Error(`Claude Code failed: ${stderr}`));
      }
    });

    claude.on('error', (err) => {
      clearInterval(progressInterval);
      logError(`Failed to start Claude Code: ${err.message}`);
      reject(err);
    });
  });
}

/**
 * Process a single issue
 */
async function processIssue(issue) {
  const { number, title, body } = issue;

  processing.add(number);

  log(`Processing issue #${number}: "${title}"`);

  // Detect reanalyze issues: "Reanalyze: src/dashboards/... — Analysis Title"
  const isReanalyze = title.startsWith('Reanalyze:');
  const isBestPicks = title.startsWith('BestPicks:');
  let prompt;

  if (isBestPicks) {
    // "BestPicks: morning" | "BestPicks: after-close"
    const runType = title.slice('BestPicks:'.length).trim() || 'morning';
    prompt = buildBestPicksPrompt(runType, body || '');
    log(`  → BestPicks screening mode: ${runType}`);
  } else if (isReanalyze) {
    const match = title.match(/^Reanalyze:\s*(.+?)\s*—\s*(.+)$/);
    if (!match) {
      updateIssue(number, 'done', 'Could not parse reanalyze request. Expected format: `Reanalyze: path/to/file.jsx — Analysis Title`');
      processing.delete(number);
      return;
    }
    const dashboardFile = match[1].trim();
    const analysisTitle = match[2].trim();
    const isQuick = (body || '').toLowerCase().includes('quick');
    const extraContext = isQuick
      ? 'QUICK MODE: Only update prices, political signals, scenario probabilities, and verdict. Skip full web research, valuation model recalculation, and fundamental data refresh.'
      : (body || '');
    prompt = buildReanalyzePrompt(dashboardFile, analysisTitle, extraContext);
    log(`  → Reanalyze mode${isQuick ? ' (QUICK)' : ''}: ${dashboardFile}`);
  } else {
    const additionalContext = body ? `\n\nAdditional context: ${body}` : '';
    prompt = buildAnalysisPrompt(`${title}${additionalContext}`);
  }

  // Sync with remote before spawning Claude so pushes don't get rejected
  try {
    log('Pulling latest changes from origin/main...');
    execSync('git pull --rebase origin main', { cwd: CONFIG.projectPath, encoding: 'utf-8', stdio: 'pipe' });
    log('  Repo synced.');
  } catch (err) {
    logError(`git pull failed: ${err.message} — continuing anyway`);
  }

  const startMsg = isReanalyze
    ? `Reanalysis started. Claude Code is researching fresh data and updating the dashboard. You will be notified when done (~5–10 minutes).`
    : `Analysis started. Claude Code is working on this. You will be notified when the dashboard is live.`;
  updateIssue(number, 'processing', startMsg);

  try {
    await runClaudeCode(prompt, number);

    const siteUrl = `https://${CONFIG.repo}.vercel.app`;

    updateIssue(
      number,
      'done',
      `Analysis complete!\n\nDashboard deployed: ${siteUrl}\n\nThe analysis has been pushed to the repository and should be live on Vercel within ~30 seconds.`
    );
  } catch (err) {
    updateIssue(
      number,
      'done',
      `Analysis failed.\n\nError: ${err.message}\n\nPlease check the desktop logs or try again.`
    );
  } finally {
    processing.delete(number);
  }
}

/**
 * Ensure required tools are available
 */
function checkPrerequisites() {
  log('Checking prerequisites...');

  try {
    execSync('gh --version', { encoding: 'utf-8', stdio: 'pipe' });
    log('  GitHub CLI (gh) found');
  } catch {
    logError('GitHub CLI (gh) not found. Install: https://cli.github.com');
    process.exit(1);
  }

  try {
    execSync('claude --version', { encoding: 'utf-8', stdio: 'pipe' });
    log('  Claude Code found');
  } catch {
    logError('Claude Code not found. Install: npm install -g @anthropic-ai/claude-code');
    process.exit(1);
  }

  try {
    execSync('gh auth status', { encoding: 'utf-8', stdio: 'pipe' });
    log('  GitHub CLI authenticated');
  } catch {
    logError('GitHub CLI not authenticated. Run: gh auth login');
    process.exit(1);
  }

  if (!fs.existsSync(CONFIG.projectPath)) {
    logError(`Project directory not found: ${CONFIG.projectPath}`);
    process.exit(1);
  }
  log(`  Project directory found: ${CONFIG.projectPath}`);

  // Ensure labels exist
  try {
    execSync(
      `gh label create "${CONFIG.doneLabel}" --repo ${CONFIG.owner}/${CONFIG.repo} --color 0E8A16 --description "Analysis completed" --force`,
      { encoding: 'utf-8', stdio: 'pipe' }
    );
    execSync(
      `gh label create "${CONFIG.processingLabel}" --repo ${CONFIG.owner}/${CONFIG.repo} --color FBCA04 --description "Analysis in progress" --force`,
      { encoding: 'utf-8', stdio: 'pipe' }
    );
    log('  GitHub labels configured');
  } catch {
    log('  Could not create labels (may already exist)');
  }
}

/**
 * Fetch and process any open issues not already labelled completed or in-progress
 */
async function processExistingIssues() {
  log('Checking for existing open issues...');
  try {
    const output = execSync(
      `gh issue list --repo ${CONFIG.owner}/${CONFIG.repo} --state open --json number,title,body,labels --limit 50`,
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
    ).trim();

    const issues = JSON.parse(output);
    if (!issues.length) {
      log('  No open issues found.');
      return;
    }

    const pending = issues.filter((issue) => {
      const labels = issue.labels.map((l) => l.name);
      return !labels.includes(CONFIG.doneLabel) && !labels.includes(CONFIG.processingLabel);
    });

    if (!pending.length) {
      log(`  ${issues.length} open issue(s) found, all already labelled — skipping.`);
      return;
    }

    log(`  Found ${pending.length} unprocessed issue(s). Processing sequentially...`);
    for (const issue of pending) {
      if (!processing.has(issue.number)) {
        await processIssue({ number: issue.number, title: issue.title, body: issue.body || '' });
      }
    }
  } catch (err) {
    logError(`Failed to fetch existing issues: ${err.message}`);
  }
}

// ============================================
// START
// ============================================

async function main() {
  console.log('');
  console.log('========================================');
  console.log('  Analysis Dashboard Watcher v2.0');
  console.log('  INSTANT via GitHub Webhooks');
  console.log('');
  console.log('  Create an issue — the title is the prompt.');
  console.log('  Triggers instantly, no polling delay.');
  console.log('');
  console.log('  Press Ctrl+C to stop');
  console.log('========================================');
  console.log('');

  checkPrerequisites();

  // Set up webhook pipeline: GitHub -> smee.io -> localhost
  const smeeUrl = await getSmeeUrl();
  setupGitHubWebhook(smeeUrl);
  startWebhookServer();
  await startSmeeClient(smeeUrl);

  log('Watcher is live! Create a GitHub issue to trigger an analysis.');

  // Process any issues that were opened while the watcher was offline
  await processExistingIssues();

  // Start the per-minute scheduler for auto-reanalysis + best picks
  startScheduler();
}

// ============================================
// SCHEDULER — reads schedule.json every minute and triggers synthetic issues
// ============================================

const SCHEDULE_FILE = path.join(CONFIG.projectPath, 'schedule.json');

// Athens-local open/close minutes for supported exchanges. DST on the US/UK/EU
// sides is synchronised closely enough that these values are stable year-round.
const EXCHANGE_ATHENS = {
  ATHEX:  { openAthens: 10 * 60 + 30, closeAthens: 17 * 60 + 20 },
  NYSE:   { openAthens: 16 * 60 + 30, closeAthens: 23 * 60 + 0  },
  NASDAQ: { openAthens: 16 * 60 + 30, closeAthens: 23 * 60 + 0  },
  LSE:    { openAthens: 10 * 60 + 0,  closeAthens: 18 * 60 + 30 },
};

function readSchedule() {
  try {
    if (!fs.existsSync(SCHEDULE_FILE)) return null;
    return JSON.parse(fs.readFileSync(SCHEDULE_FILE, 'utf-8'));
  } catch (err) {
    logError(`Could not read schedule.json: ${err.message}`);
    return null;
  }
}

function writeSchedule(schedule) {
  try {
    fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(schedule, null, 2));
  } catch (err) {
    logError(`Could not write schedule.json: ${err.message}`);
  }
}

function getAthensNow(now = new Date()) {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Athens',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });
  const parts = Object.fromEntries(fmt.formatToParts(now).map((p) => [p.type, p.value]));
  return {
    ymd: `${parts.year}-${parts.month}-${parts.day}`,
    hour: parseInt(parts.hour, 10),
    minute: parseInt(parts.minute, 10),
    minutes: parseInt(parts.hour, 10) * 60 + parseInt(parts.minute, 10),
  };
}

function computeDashboardFiringMinutes(entry) {
  const exCode = (entry.exchange || 'NYSE').toUpperCase();
  const ex = EXCHANGE_ATHENS[exCode] || EXCHANGE_ATHENS.NYSE;
  switch (entry.mode) {
    case 'before-all-open':
      return 8 * 60; // 08:00 Athens — before LSE opens at 10:00 Athens
    case 'before-own-open':
      return Math.max(0, ex.openAthens - 30);
    case 'after-own-close':
      return Math.min(23 * 60 + 59, ex.closeAthens + 15);
    case 'custom': {
      const t = entry.customTimeAthens || { hour: 8, minute: 0 };
      return t.hour * 60 + t.minute;
    }
    default:
      return null;
  }
}

// Track in-flight scheduled runs so we never double-fire on a slow minute.
const scheduledInFlight = new Set();

function fireSyntheticIssue(syntheticIssue, label) {
  if (scheduledInFlight.has(label)) {
    log(`Scheduler skip: ${label} already in flight`);
    return;
  }
  scheduledInFlight.add(label);
  log(`Scheduler firing: ${label}`);
  processIssue(syntheticIssue).finally(() => scheduledInFlight.delete(label));
}

function tickScheduler() {
  const schedule = readSchedule();
  if (!schedule) return;
  const athens = getAthensNow();
  let changed = false;

  // Per-dashboard scheduled reanalyses
  for (const [id, entry] of Object.entries(schedule.dashboards || {})) {
    if (!entry.enabled) continue;
    const fireAt = computeDashboardFiringMinutes(entry);
    if (fireAt == null) continue;
    // Fire within the first 5 minutes of the scheduled window, once per day.
    if (athens.minutes < fireAt || athens.minutes > fireAt + 5) continue;
    const lastYmd = entry.lastRunAt ? String(entry.lastRunAt).slice(0, 10) : null;
    if (lastYmd === athens.ymd) continue;

    entry.lastRunAt = new Date().toISOString();
    changed = true;

    const syntheticNumber = -Math.floor(Date.now() / 1000);
    fireSyntheticIssue(
      {
        number: syntheticNumber,
        title: `Reanalyze: ${entry.dashboardFile} — ${entry.title}`,
        body: 'Scheduled auto-reanalysis\n\nquick',
      },
      `dashboard:${id}`
    );
  }

  // Best Picks twice-daily run
  const bp = schedule.bestPicks;
  if (bp && bp.enabled) {
    // Morning run
    const morn = bp.morningModeAthens || { hour: 8, minute: 0 };
    const mornAt = morn.hour * 60 + morn.minute;
    if (athens.minutes >= mornAt && athens.minutes <= mornAt + 5) {
      const lastYmd = bp.lastMorningRun ? String(bp.lastMorningRun).slice(0, 10) : null;
      if (lastYmd !== athens.ymd) {
        bp.lastMorningRun = new Date().toISOString();
        changed = true;
        fireSyntheticIssue(
          {
            number: -Math.floor(Date.now() / 1000) - 1,
            title: 'BestPicks: morning',
            body: `Watchlist: ${JSON.stringify(bp.watchlist || [])}`,
          },
          'bestpicks:morning'
        );
      }
    }

    // After-close run: NYSE close (23:00 Athens) + configurable delay
    const afterAt = 23 * 60 + (bp.afterCloseDelayMinutes ?? 15);
    if (athens.minutes >= afterAt && athens.minutes <= afterAt + 5) {
      const lastYmd = bp.lastAfterCloseRun ? String(bp.lastAfterCloseRun).slice(0, 10) : null;
      if (lastYmd !== athens.ymd) {
        bp.lastAfterCloseRun = new Date().toISOString();
        changed = true;
        fireSyntheticIssue(
          {
            number: -Math.floor(Date.now() / 1000) - 2,
            title: 'BestPicks: after-close',
            body: `Watchlist: ${JSON.stringify(bp.watchlist || [])}`,
          },
          'bestpicks:after-close'
        );
      }
    }
  }

  if (changed) writeSchedule(schedule);
}

function startScheduler() {
  log('Scheduler started — checking schedule.json every 60s (Europe/Athens timezone)');
  // Run a tick immediately on startup and then every 60 seconds.
  tickScheduler();
  setInterval(tickScheduler, 60 * 1000);
}

main().catch((err) => {
  logError(`Fatal error: ${err.message}`);
  process.exit(1);
});
