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

  // Single-instance lock — prevents duplicate daemons racing on schedule.json and port 7890
  pidFile: path.join(process.env.HOME || process.env.USERPROFILE, 'Documents', 'projects', 'ai-analysis', '.watcher.pid'),
};

const DEFAULT_MODEL_CONFIG = {
  version: 1,
  generationModel: 'claude-sonnet-4-20250514',
  fallbackModel: 'claude-3-7-sonnet-20250219',
  reanalysisModel: 'claude-sonnet-4-20250514',
  stockReanalysisModel: 'claude-sonnet-4-20250514',
  searchModel: 'gemini-2.5-flash',
};

const MODEL_ID_ALIASES = {
  'claude-opus-4-6': 'claude-opus-4-1-20250805',
  'claude-opus-4-5': 'claude-opus-4-1-20250805',
  'claude-sonnet-4-6': 'claude-sonnet-4-20250514',
  'claude-sonnet-4-5-20250929': 'claude-sonnet-4-20250514',
  'claude-haiku-4-5-20251001': 'claude-3-5-haiku-20241022',
};

const CLAUDE_MODEL_OPTIONS = new Set([
  'claude-opus-4-1-20250805',
  'claude-opus-4-20250514',
  'claude-sonnet-4-20250514',
  'claude-3-7-sonnet-20250219',
  'claude-3-5-sonnet-20241022',
  'claude-3-5-haiku-20241022',
  'claude-3-haiku-20240307',
]);

const CLAUDE_CODE_TIMEOUT_MS = 30 * 60 * 1000;

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

function normalizeModelId(value) {
  if (typeof value !== 'string') return '';
  const model = value.trim();
  if (!/^[a-zA-Z0-9._:-]+$/.test(model)) return '';
  return MODEL_ID_ALIASES[model] || model;
}

function normalizeModelConfig(input = {}) {
  const next = { ...DEFAULT_MODEL_CONFIG, ...(input || {}), version: 1 };
  for (const key of ['generationModel', 'fallbackModel', 'reanalysisModel', 'stockReanalysisModel']) {
    const normalized = normalizeModelId(next[key]);
    next[key] = CLAUDE_MODEL_OPTIONS.has(normalized) ? normalized : DEFAULT_MODEL_CONFIG[key];
  }
  return next;
}

function readLocalModelConfig() {
  const configPath = path.join(CONFIG.projectPath, 'model-config.json');
  try {
    return normalizeModelConfig(JSON.parse(fs.readFileSync(configPath, 'utf-8')));
  } catch {
    return { ...DEFAULT_MODEL_CONFIG };
  }
}

/**
 * Single-instance lock. Prevents two watcher daemons from racing on
 * schedule.json, port 7890, and duplicate scheduled fires.
 */
function isProcessAlive(pid) {
  if (!pid || Number.isNaN(pid)) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (err) {
    // EPERM means the process exists but we lack permission — still alive.
    return err.code === 'EPERM';
  }
}

function acquireLock() {
  if (fs.existsSync(CONFIG.pidFile)) {
    const content = fs.readFileSync(CONFIG.pidFile, 'utf-8').trim();
    const existingPid = parseInt(content, 10);
    if (isProcessAlive(existingPid)) {
      logError(`Watcher already running as PID ${existingPid}. Refusing to start a second instance.`);
      logError(`Stop the existing process, then delete ${CONFIG.pidFile} if needed.`);
      process.exit(1);
    }
    log(`Removing stale pidfile (PID ${existingPid || 'unknown'} not running)`);
    try { fs.unlinkSync(CONFIG.pidFile); } catch {}
  }
  fs.writeFileSync(CONFIG.pidFile, String(process.pid));
  log(`Acquired single-instance lock (PID ${process.pid})`);

  const release = () => {
    try {
      if (fs.existsSync(CONFIG.pidFile)) {
        const current = fs.readFileSync(CONFIG.pidFile, 'utf-8').trim();
        if (current === String(process.pid)) fs.unlinkSync(CONFIG.pidFile);
      }
    } catch {}
  };
  process.on('exit', release);
  process.on('SIGINT', () => { release(); process.exit(0); });
  process.on('SIGTERM', () => { release(); process.exit(0); });
}

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

const STATUS_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Watcher Status</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{height:100%}
  body{background:#0a0f1e;color:#f8fafc;font-family:Consolas,'SF Mono',Menlo,monospace;padding:14px;display:flex;flex-direction:column;gap:12px;overflow:hidden}
  header{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px}
  h1{font-size:13px;color:#06b6d4;font-weight:700;letter-spacing:.08em;text-transform:uppercase;display:flex;align-items:center;gap:8px}
  .meta{color:#64748b;font-size:11px;font-weight:400;letter-spacing:.02em}
  .dot{width:9px;height:9px;border-radius:50%;display:inline-block}
  .dot.ok{background:#10b981;box-shadow:0 0 8px #10b981}
  .dot.err{background:#ef4444;box-shadow:0 0 8px #ef4444}
  .dot.warn{background:#f59e0b}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px}
  .card{background:#111827;border:1px solid #1e293b;border-radius:6px;padding:11px 13px}
  .card .label{color:#64748b;font-size:10px;text-transform:uppercase;letter-spacing:.12em;font-weight:600}
  .card .value{color:#f8fafc;font-size:15px;margin-top:5px;font-weight:600;line-height:1.2}
  .card .sub{color:#94a3b8;font-size:11px;margin-top:3px;line-height:1.3}
  .card.ok .value{color:#10b981}
  .card.warn .value{color:#f59e0b}
  .card.err .value{color:#ef4444}
  .logwrap{flex:1;display:flex;flex-direction:column;background:#111827;border:1px solid #1e293b;border-radius:6px;min-height:0}
  .loghead{display:flex;justify-content:space-between;align-items:center;padding:7px 12px;border-bottom:1px solid #1e293b;color:#64748b;font-size:10px;text-transform:uppercase;letter-spacing:.1em;font-weight:600}
  .loghead .controls{display:flex;gap:10px;align-items:center;text-transform:none;letter-spacing:0}
  .loghead label{color:#94a3b8;font-size:11px;cursor:pointer;display:flex;align-items:center;gap:5px}
  .loghead button{background:#1e293b;color:#94a3b8;border:1px solid #334155;border-radius:4px;padding:3px 9px;font-size:10px;cursor:pointer;font-family:inherit;text-transform:uppercase;letter-spacing:.06em}
  .loghead button:hover{color:#f8fafc;background:#334155}
  pre{flex:1;overflow:auto;padding:10px 13px;font-size:11.5px;color:#cbd5e1;white-space:pre-wrap;word-break:break-word;line-height:1.45}
  pre::-webkit-scrollbar{width:8px}
  pre::-webkit-scrollbar-track{background:#0a0f1e}
  pre::-webkit-scrollbar-thumb{background:#334155;border-radius:4px}
</style>
</head>
<body>
<header>
  <h1><span class="dot ok" id="live"></span> Analysis Watcher</h1>
  <span class="meta" id="meta">connecting…</span>
</header>
<div class="grid">
  <div class="card" id="c-sched"><div class="label">Scheduler</div><div class="value">—</div><div class="sub"></div></div>
  <div class="card" id="c-athens"><div class="label">Athens Time</div><div class="value">—</div><div class="sub"></div></div>
  <div class="card" id="c-last"><div class="label">Last Best Picks Run</div><div class="value">—</div><div class="sub"></div></div>
  <div class="card" id="c-next"><div class="label">Next Best Picks Run</div><div class="value">—</div><div class="sub"></div></div>
  <div class="card" id="c-list"><div class="label">Watchlist</div><div class="value">—</div><div class="sub"></div></div>
  <div class="card" id="c-work"><div class="label">In Flight</div><div class="value">—</div><div class="sub"></div></div>
</div>
<div class="logwrap">
  <div class="loghead">
    <span>watcher.log — last 128KB</span>
    <div class="controls">
      <label><input type="checkbox" id="follow" checked> follow</label>
      <button onclick="location.reload()">reload</button>
    </div>
  </div>
  <pre id="log">loading…</pre>
</div>
<script>
  const $ = (id) => document.getElementById(id);
  const set = (id, v, sub, cls) => { const c = $(id); c.querySelector('.value').textContent = v; c.querySelector('.sub').textContent = sub || ''; if (cls !== undefined) c.className = 'card ' + cls; };
  const fmtRel = (iso) => {
    if (!iso) return 'never';
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return mins + 'm ago';
    const h = Math.floor(mins / 60);
    if (h < 24) return h + 'h ago';
    return Math.floor(h / 24) + 'd ago';
  };
  const fmtUptime = (s) => {
    if (s < 60) return s + 's';
    const m = Math.floor(s / 60); if (m < 60) return m + 'm ' + (s % 60) + 's';
    const h = Math.floor(m / 60); if (h < 24) return h + 'h ' + (m % 60) + 'm';
    return Math.floor(h / 24) + 'd ' + (h % 24) + 'h';
  };
  async function pullStatus() {
    try {
      const r = await fetch('/status', { cache: 'no-store' });
      if (!r.ok) throw 0;
      const s = await r.json();
      $('live').className = 'dot ok';
      $('meta').textContent = 'PID ' + s.pid + ' · up ' + fmtUptime(s.uptimeSec);
      set('c-sched', 'Running', 'polls schedule.json every 60s', 'card ok');
      set('c-athens', s.athensNow, 'local: ' + new Date().toLocaleTimeString());
      const lastStamp = s.bestPicks.lastAfterCloseRun || s.bestPicks.lastMorningRun;
      set('c-last', fmtRel(lastStamp), 'morning: ' + fmtRel(s.bestPicks.lastMorningRun) + ' · close: ' + fmtRel(s.bestPicks.lastAfterCloseRun));
      set('c-next', s.bestPicks.nextMorningRun, 'after-close: ' + s.bestPicks.nextAfterCloseRun);
      set('c-list', s.bestPicks.watchlistSize + ' tickers', s.bestPicks.enabled ? 'enabled' : 'disabled', s.bestPicks.enabled ? 'card ok' : 'card warn');
      const active = (s.inFlight || []).length + (s.processing || []).length;
      set('c-work', active ? active + ' active' : 'idle', ((s.inFlight || []).concat(s.processing || [])).join(', ') || 'waiting', active ? 'card warn' : 'card');
    } catch (e) {
      $('live').className = 'dot err';
      $('meta').textContent = 'watcher not reachable';
      set('c-sched', 'Offline', 'daemon not responding', 'card err');
    }
  }
  async function pullLog() {
    try {
      const r = await fetch('/logs', { cache: 'no-store' });
      const text = await r.text();
      const pre = $('log');
      const follow = $('follow').checked;
      pre.textContent = text || '(empty)';
      if (follow) pre.scrollTop = pre.scrollHeight;
    } catch {}
  }
  pullStatus(); pullLog();
  setInterval(pullStatus, 4000);
  setInterval(pullLog, 3000);
</script>
</body>
</html>`;

/**
 * Start local HTTP server to receive webhook events
 */
function startWebhookServer() {
  return new Promise((resolve) => {
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
      } else if (req.method === 'GET' && (req.url === '/' || req.url === '/status.html')) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(STATUS_HTML);
      } else if (req.method === 'GET' && req.url === '/logs') {
        try {
          const logPath = path.join(CONFIG.projectPath, 'watcher.log');
          const stat = fs.statSync(logPath);
          const maxBytes = 128 * 1024;
          const readBytes = Math.min(stat.size, maxBytes);
          const fd = fs.openSync(logPath, 'r');
          const buf = Buffer.alloc(readBytes);
          fs.readSync(fd, buf, 0, readBytes, stat.size - readBytes);
          fs.closeSync(fd);
          res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end(buf.toString('utf-8'));
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end(`Could not read log: ${err.message}`);
        }
      } else if (req.method === 'GET' && req.url === '/status') {
        try {
          const schedule = readSchedule() || {};
          const bp = schedule.bestPicks || {};
          const athens = getAthensNow();
          const morn = bp.morningModeAthens || { hour: 8, minute: 0 };
          const mornMin = morn.hour * 60 + morn.minute;
          const afterDelay = bp.afterCloseDelayMinutes ?? 15;
          const afterMin = 23 * 60 + afterDelay;
          const pad = (n) => String(n).padStart(2, '0');
          const hhmm = (m) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
          const nextMorning = athens.minutes < mornMin
            ? `today ${hhmm(mornMin)} Athens`
            : `tomorrow ${hhmm(mornMin)} Athens`;
          const nextAfterClose = athens.minutes < afterMin
            ? `today ${hhmm(afterMin)} Athens`
            : `tomorrow ${hhmm(afterMin)} Athens`;
          const uptimeSec = Math.floor(process.uptime());
          const body = {
            pid: process.pid,
            uptimeSec,
            startedAt: new Date(Date.now() - uptimeSec * 1000).toISOString(),
            athensNow: `${pad(athens.hour)}:${pad(athens.minute)}`,
            bestPicks: {
              enabled: !!bp.enabled,
              lastMorningRun: bp.lastMorningRun || null,
              lastAfterCloseRun: bp.lastAfterCloseRun || null,
              nextMorningRun: nextMorning,
              nextAfterCloseRun: nextAfterClose,
              watchlistSize: (bp.watchlist || []).length,
            },
            scheduledDashboards: Object.keys(schedule.dashboards || {}).length,
            inFlight: Array.from(scheduledInFlight),
            processing: Array.from(processing),
          };
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify(body, null, 2));
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end(`status error: ${err.message}`);
        }
      } else {
        res.writeHead(404);
        res.end();
      }
    });

    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        logError(`Port ${CONFIG.port} is already in use — webhook server disabled. Scheduler will still run. (Another watcher instance may be active.)`);
      } else {
        logError(`Webhook server error: ${err.message}`);
      }
      resolve(false);
    });

    server.listen(CONFIG.port, () => {
      log(`Webhook server listening on port ${CONFIG.port}`);
      resolve(true);
    });
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
    '10. Do not stop to ask whether to commit or push; these steps are already authorized by this task.',
  ]
  if (extraContext) lines.push('', `Additional context: ${extraContext}`)
  return lines.join('\n')
}

/**
 * Build the Claude Code prompt for a deep auto-watchlist research run.
 * Appends quality tickers to schedule.json → bestPicks.watchlist. Commits + pushes.
 */
function buildAutoWatchlistPrompt(scope, extraContext) {
  const today = new Date().toISOString().slice(0, 10);
  const scopeDescriptions = {
    GLOBAL: 'any of ATHEX / NYSE / NASDAQ / LSE — produce a diversified basket across all four',
    GR: 'Athens Stock Exchange only — focus on Greek blue chips, banks, shipping, energy, industrials',
    US: 'NYSE + NASDAQ — mega-caps and high-conviction mid-caps across sectors',
    GB: 'London Stock Exchange — FTSE 100 / 250 quality names across sectors',
  };
  const scopeDesc = scopeDescriptions[scope] || scopeDescriptions.GLOBAL;
  return [
    `AUTO-WATCHLIST deep research run — scope: ${scope} (${today})`,
    '',
    `OBJECTIVE: Identify 10–15 top-quality stocks worth tracking for ${scope} and APPEND them to schedule.json → bestPicks.watchlist.`,
    '',
    `SCOPE: ${scopeDesc}`,
    '',
    'SELECTION CRITERIA:',
    '1. High-quality businesses with meaningful analyst coverage and liquidity',
    '2. Prioritise sectors exposed to active geopolitical conflicts (read /src/dashboards/geopolitical/*.jsx first — identify which sectors are under active stress)',
    '3. Mix of long candidates (strong fundamentals, good entry) and potential shorts (weakening, overvalued, structural risk)',
    '4. Diversify across sectors — do not stack three banks if avoidable',
    '',
    'STEPS:',
    '1. Read /src/dashboards/geopolitical/*.jsx to identify sectors under active stress (defence, energy, banking under war risk, shipping).',
    '2. Read schedule.json — capture bestPicks.watchlist entries so you do NOT duplicate them.',
    '3. Run parallel web searches (one batch):',
    `   - "top ${scope} stocks by market cap 2026"`,
    `   - "${scope} most traded stocks today"`,
    `   - "${scope} stocks to watch 2026"`,
    `   - "${scope} sector leaders 2026"`,
    '   - For sectors under stress (from step 1): name the top 2 exposed names on this exchange',
    '4. Shortlist 10–15 final tickers. For each, note: ticker, exchange, sector, one-line rationale.',
    '5. UPDATE schedule.json:',
    '   - APPEND (do not remove) new entries to bestPicks.watchlist',
    `   - Each new entry shape: { "ticker": "XXX", "exchange": "NYSE|NASDAQ|ATHEX|LSE", "sector": "...", "rationale": "...", "addedBy": "auto-${scope}", "addedAt": "${today}" }`,
    '   - Set updatedAt at the top level to the current ISO timestamp',
    '6. git add schedule.json',
    `7. Commit: "chore: auto-watchlist ${scope} - ${today}"`,
    '8. Push to origin main',
    '',
    'DO NOT run full analyses. DO NOT create or touch any .jsx files. This is research-only and updates ONLY schedule.json. Keep the search cheap — one parallel batch, no deep fundamentals.',
    extraContext ? ('\nAdditional context: ' + extraContext) : '',
  ].filter(Boolean).join('\n');
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
function runClaudeCode(prompt, issueNumber, modelId) {
  return new Promise((resolve, reject) => {
    const fullPrompt = prompt;
    const model = normalizeModelId(modelId) || DEFAULT_MODEL_CONFIG.generationModel;

    log(`Launching Claude Code for issue #${issueNumber} with ${model}`);

    // Escape double quotes for cmd.exe and wrap prompt in quotes
    const escapedPrompt = fullPrompt.replace(/"/g, '""');
    const claude = spawn(
      `claude --model ${model} --dangerously-skip-permissions -p "${escapedPrompt}"`,
      { cwd: CONFIG.projectPath, stdio: ['pipe', 'pipe', 'pipe'], shell: true, timeout: CLAUDE_CODE_TIMEOUT_MS }
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
  const isAutoWatchlist = title.startsWith('AutoWatchlist:');
  let prompt;
  let selectedModelKey = 'generationModel';

  if (isAutoWatchlist) {
    // "AutoWatchlist: GLOBAL" | "AutoWatchlist: GR" | "AutoWatchlist: US" | "AutoWatchlist: GB"
    const scope = title.slice('AutoWatchlist:'.length).trim().toUpperCase() || 'GLOBAL';
    prompt = buildAutoWatchlistPrompt(scope, body || '');
    log(`  → AutoWatchlist research: ${scope}`);
  } else if (isBestPicks) {
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
    selectedModelKey = dashboardFile.includes('/stocks/') || dashboardFile.includes('\\stocks\\')
      ? 'stockReanalysisModel'
      : 'reanalysisModel';
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

  // Sync with remote before spawning Claude so pushes don't get rejected.
  // --autostash handles the common case where the scheduler has just written
  // lastMorningRun/lastAfterCloseRun to schedule.json, leaving it dirty.
  try {
    log('Pulling latest changes from origin/main...');
    execSync('git pull --rebase --autostash origin main', { cwd: CONFIG.projectPath, encoding: 'utf-8', stdio: 'pipe' });
    log('  Repo synced.');
  } catch (err) {
    logError(`git pull failed: ${err.message} — continuing anyway`);
  }

  const modelConfig = readLocalModelConfig();
  const selectedModel = modelConfig[selectedModelKey] || modelConfig.generationModel;

  const startMsg = isReanalyze
    ? `Reanalysis started. Claude Code is researching fresh data and updating the dashboard. You will be notified when done (~5–10 minutes).`
    : `Analysis started. Claude Code is working on this. You will be notified when the dashboard is live.`;
  updateIssue(number, 'processing', startMsg);

  try {
    await runClaudeCode(prompt, number, selectedModel);

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
    logError('GitHub CLI not authenticated — issue comments/labels will fail, but scheduler will still run. Fix with: gh auth login -h github.com');
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

  acquireLock();
  checkPrerequisites();

  // Set up webhook pipeline: GitHub -> smee.io -> localhost.
  // Any failure here (bad port, bad auth, bad smee) is non-fatal — the
  // scheduler still runs and can fire synthetic issues locally.
  try {
    const smeeUrl = await getSmeeUrl();
    setupGitHubWebhook(smeeUrl);
    const bound = await startWebhookServer();
    if (bound) {
      await startSmeeClient(smeeUrl);
      log('Watcher is live! Create a GitHub issue to trigger an analysis.');
    } else {
      log('Watcher running in scheduler-only mode (no webhook listener).');
    }
  } catch (err) {
    logError(`Webhook pipeline setup failed: ${err.message} — continuing in scheduler-only mode.`);
  }

  // Process any issues that were opened while the watcher was offline
  try {
    await processExistingIssues();
  } catch (err) {
    logError(`processExistingIssues failed: ${err.message} — continuing.`);
  }

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
