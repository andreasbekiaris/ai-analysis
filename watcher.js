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

  // Create a new channel
  log('Creating new smee.io channel...');
  const SmeeClient = (await import('smee-client')).default;
  const url = await new Promise((resolve, reject) => {
    https_get('https://smee.io/new', (res) => {
      // smee.io/new redirects to the new channel URL
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        resolve(res.headers.location);
      } else {
        // Read the response to get the URL from the body/redirect
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve(data.trim()));
      }
    }).on('error', reject);
  });

  fs.writeFileSync(CONFIG.smeeUrlFile, url);
  log(`Created smee channel: ${url}`);
  return url;
}

function https_get(url, callback) {
  return require('https').get(url, callback);
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

  smee.start();
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
 * Run Claude Code with the analysis prompt
 */
function runClaudeCode(analysisRequest, issueNumber) {
  return new Promise((resolve, reject) => {
    const fullPrompt = `${analysisRequest}. After creating the dashboard JSX file, update App.jsx to include routing for it, then commit all changes with a descriptive message and push to origin main.`;

    log(`Launching Claude Code: "${analysisRequest}"`);

    const claude = spawn('claude', ['-p', fullPrompt], {
      cwd: CONFIG.projectPath,
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true,
      timeout: 600000,
    });

    let stdout = '';
    let stderr = '';

    claude.stdout.on('data', (data) => {
      const text = data.toString();
      stdout += text;
      process.stdout.write(text);
    });

    claude.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    claude.on('close', (code) => {
      if (code === 0) {
        log(`Claude Code finished successfully for issue #${issueNumber}`);
        resolve(stdout);
      } else {
        logError(`Claude Code exited with code ${code}`);
        reject(new Error(`Claude Code failed: ${stderr}`));
      }
    });

    claude.on('error', (err) => {
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

  const additionalContext = body ? `\n\nAdditional context: ${body}` : '';
  const fullRequest = `${title}${additionalContext}`;

  log(`Processing issue #${number}: "${title}"`);

  updateIssue(number, 'processing', 'Analysis started. Claude Code is working on this. You will be notified when the dashboard is live.');

  try {
    await runClaudeCode(fullRequest, number);

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
}

main().catch((err) => {
  logError(`Fatal error: ${err.message}`);
  process.exit(1);
});
