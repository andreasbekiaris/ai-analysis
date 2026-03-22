#!/usr/bin/env node

/**
 * Analysis Watcher — Polls GitHub Issues and triggers Claude Code
 *
 * HOW IT WORKS:
 * 1. Runs in the background on your desktop
 * 2. Checks your GitHub repo for new open Issues every 2 minutes
 * 3. When it finds one, it launches Claude Code with the analysis request
 * 4. Claude Code creates the dashboard, commits, and pushes
 * 5. Vercel auto-deploys — you see results on your phone
 *
 * SETUP:
 * 1. Make sure `gh` (GitHub CLI) is installed and authenticated: `gh auth login`
 * 2. Make sure `claude` (Claude Code) is installed and authenticated
 * 3. Edit the CONFIG section below with your repo details
 * 4. Run: `node watcher.js`
 *
 * FROM YOUR PHONE:
 * - Open GitHub app or browser
 * - Go to your repo → Issues → New Issue
 * - Title: "US-China trade war analysis" (the title IS the prompt)
 * - Body: optional extra context
 * - That's it! The watcher picks it up automatically.
 */

const { execSync, spawn } = require('child_process');
const path = require('path');

// ============================================
// CONFIG — EDIT THESE VALUES
// ============================================
const CONFIG = {
  // Your GitHub username and repo name
  owner: 'andreasbekiaris',
  repo: 'ai-analysis',

  // How often to check for new issues (in milliseconds)
  // 120000 = 2 minutes
  pollInterval: 120000,

  // The path to your local project folder
  projectPath: path.join(process.env.HOME || process.env.USERPROFILE, 'Documents', 'projects', 'ai-analysis'),

  // Label to add to issues after processing
  doneLabel: 'completed',

  // Label to add to issues that are currently being processed
  processingLabel: 'in-progress',
};

// ============================================
// WATCHER LOGIC — NO NEED TO EDIT BELOW
// ============================================

const log = (msg) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${msg}`);
};

const logError = (msg) => {
  const timestamp = new Date().toLocaleTimeString();
  console.error(`[${timestamp}] ${msg}`);
};

/**
 * Fetch open issues that haven't been processed yet
 */
function getAnalysisIssues() {
  try {
    const result = execSync(
      `gh issue list --repo ${CONFIG.owner}/${CONFIG.repo} --state open --json number,title,body,labels --limit 10`,
      { encoding: 'utf-8', timeout: 30000 }
    );

    const issues = JSON.parse(result);

    // Skip issues already labeled as in-progress or completed
    return issues.filter(issue => {
      const labelNames = (issue.labels || []).map(l => l.name.toLowerCase());
      return !labelNames.includes(CONFIG.processingLabel) &&
             !labelNames.includes(CONFIG.doneLabel);
    });
  } catch (err) {
    logError(`Failed to fetch issues: ${err.message}`);
    return [];
  }
}

/**
 * Add a label and comment to an issue
 */
function updateIssue(issueNumber, status, comment) {
  try {
    // Add comment
    execSync(
      `gh issue comment ${issueNumber} --repo ${CONFIG.owner}/${CONFIG.repo} --body "${comment}"`,
      { encoding: 'utf-8', timeout: 15000 }
    );

    // Update title to show status
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
      // Close the issue
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
      timeout: 600000, // 10 minute timeout
    });

    let stdout = '';
    let stderr = '';

    claude.stdout.on('data', (data) => {
      const text = data.toString();
      stdout += text;
      process.stdout.write(text); // Show Claude's output in real-time
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

  // The issue title IS the prompt
  const additionalContext = body ? `\n\nAdditional context: ${body}` : '';
  const fullRequest = `${title}${additionalContext}`;

  log(`Processing issue #${number}: "${title}"`);

  // Mark as processing
  updateIssue(number, 'processing', 'Analysis started. Claude Code is working on this. You will be notified when the dashboard is live.');

  try {
    await runClaudeCode(fullRequest, number);

    // Get the Vercel URL (you can customize this)
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
  }
}

/**
 * Main polling loop
 */
async function poll() {
  log('Checking for new analysis requests...');

  const issues = getAnalysisIssues();

  if (issues.length === 0) {
    log('No new requests found.');
    return;
  }

  log(`Found ${issues.length} new request(s)!`);

  // Process one at a time (to avoid overwhelming Claude Code)
  for (const issue of issues) {
    await processIssue(issue);
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

  // Check if project directory exists
  try {
    const fs = require('fs');
    if (!fs.existsSync(CONFIG.projectPath)) {
      logError(`Project directory not found: ${CONFIG.projectPath}`);
      logError('Please update CONFIG.projectPath in this script.');
      process.exit(1);
    }
    log(`  Project directory found: ${CONFIG.projectPath}`);
  } catch {
    logError('Could not verify project directory');
    process.exit(1);
  }

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

console.log('');
console.log('========================================');
console.log('  Analysis Dashboard Watcher v1.0');
console.log('');
console.log('  Watching for GitHub Issues...');
console.log('  Create an issue — the title is the prompt.');
console.log('  e.g. "Analyze US-China trade war"');
console.log('');
console.log('  Press Ctrl+C to stop');
console.log('========================================');
console.log('');

checkPrerequisites();

log(`Polling every ${CONFIG.pollInterval / 1000} seconds`);
log('Watcher started! Waiting for analysis requests...');
console.log('');

// Run immediately, then on interval
poll();
setInterval(poll, CONFIG.pollInterval);
