#!/bin/bash
set -euo pipefail

# Only run in remote/web environments (Claude Code on mobile/web)
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

echo "==> Installing frontend dependencies..."
npm install

echo "==> Installing server dependencies..."
(cd server && npm install)

echo "==> Configuring git user (if not already set)..."
if [ -z "$(git config user.email 2>/dev/null || true)" ]; then
  git config user.email "claude@analysis-dashboard.ai"
  git config user.name "Claude Analysis"
fi

echo "==> Session environment ready."
