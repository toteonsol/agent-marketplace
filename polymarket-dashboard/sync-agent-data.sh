#!/bin/bash

# Sync agent-data.json from agent directory to public folder
# On local builds: copies from agent directory
# On Vercel: file already exists in repo, just ensure it's in public

SOURCE="/home/openclaw/.openclaw/workspace/polymarket-agent/agent-data.json"
DEST="./public/agent-data.json"

# Create public directory if it doesn't exist
mkdir -p ./public

# Try to copy from local agent directory if it exists
if [ -f "$SOURCE" ]; then
  cp "$SOURCE" "$DEST"
  echo "Synced agent-data.json"
else
  # Vercel doesn't have local agent directory, which is expected
  # The file should already be in the repo
  if [ ! -f "$DEST" ]; then
    echo "Creating empty agent-data.json stub"
    cat > "$DEST" << 'EOF'
{"lastUpdate":"2026-02-25T00:00:00Z","bankroll":0,"totalWagered":0,"totalWon":0,"totalLost":0,"trades":[],"equity":[]}
EOF
  fi
fi

exit 0
