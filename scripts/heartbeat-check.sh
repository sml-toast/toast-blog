#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/.."
PORT="${1:-5174}"
LOG_DIR="logs"
LOG_FILE="$LOG_DIR/heartbeat.log"
mkdir -p "$LOG_DIR"
if lsof -i :"$PORT" -P -s TCP:LISTEN >/dev/null 2>&1; then
  STATUS="RUNNING"
else
  STATUS="STOPPED"
fi
TS=$(date '+%Y-%m-%d %H:%M:%S %Z')
ID=$(date +%s%N)
echo "[$TS] id=$ID port=$PORT status=$STATUS" >> "$LOG_FILE"
if [ "$STATUS" != "RUNNING" ]; then
  echo "Heartbeat check failed: dev server not running on port $PORT" >&2
  exit 1
fi
echo "Heartbeat ok: $TS"
