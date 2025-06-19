#!/bin/bash

# ── Start Arduino‐button listener ─────────────────────────────────────────────
# Assumes buttonScript.py is in the same folder and executable
echo "Starting button listener..."
nohup python3 ./buttonScript.py > button.log 2>&1 &

# ── Entry file for your Node.js server ───────────────────────────────────────
ENTRY_FILE="./server.js"
URL="http://localhost:3000"

# Optional: Load environment variables from .env
if [ -f .env ]; then
  echo "Loading environment variables from .env..."
  export $(grep -v '^#' .env | xargs)
fi

# ── Function to open browser when server is up (kiosk mode) ──────────────────
open_browser_when_ready() {
  echo "Waiting for server to be ready at $URL..."
  until curl --output /dev/null --silent --head --fail "$URL"; do
    sleep 0.5
  done
  echo "Server is up! Opening $URL in Firefox kiosk mode..."
  chromium --kiosk "$URL" &
}

# Start the browser wait function in background
open_browser_when_ready &

# ── Start the server with nodemon (or npx nodemon) ──────────────────────────
if ! command -v nodemon &> /dev/null; then
  echo "nodemon not found. Using npx..."
  npx nodemon "$ENTRY_FILE"
else
  echo "Starting server with nodemon: $ENTRY_FILE"
  nodemon "$ENTRY_FILE"
fi
