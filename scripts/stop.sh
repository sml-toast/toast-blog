#!/bin/bash
# ─────────────────────────────────────────────────────
# stop.sh — 停止 Vite 开发服务器
# 用法: bash scripts/stop.sh [端口号]
# ─────────────────────────────────────────────────────

cd "$(dirname "$0")/.."
PORT="${1:-5174}"
SCRIPT_NAME="com.toast.blog.vite"

# 1. 优先用 launchctl 停止
if launchctl list | grep -q "$SCRIPT_NAME" 2>/dev/null; then
  launchctl bootout "gui/$(id -u)/$SCRIPT_NAME" 2>/dev/null
  sleep 1
  rm -f .vite.pid
  echo "✅ 已停止 Vite 服务 (launchctl: $SCRIPT_NAME)"
  exit 0
fi

# 2. 退化：通过 .vite.pid
if [ -f .vite.pid ]; then
  PID=$(cat .vite.pid)
  if kill -0 "$PID" 2>/dev/null; then
    kill "$PID" 2>/dev/null
    rm -f .vite.pid
    echo "✅ 已停止 Vite (PID: $PID)"
    exit 0
  fi
  rm -f .vite.pid
fi

# 3. 退化：通过端口查找
PID=$(lsof -ti :"$PORT" 2>/dev/null)
if [ -n "$PID" ]; then
  kill "$PID" 2>/dev/null
  echo "✅ 已停止 Vite 进程 (PID: $PID)"
  exit 0
fi

echo "ℹ️  没有运行中的 Vite 进程"
exit 0
