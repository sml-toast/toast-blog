#!/bin/bash
# ─────────────────────────────────────────────────────
# stop.sh — 停止 Vite 开发服务器
# ─────────────────────────────────────────────────────

if [ -f .vite.pid ]; then
  PID=$(cat .vite.pid)
  kill "$PID" 2>/dev/null && echo "✅ 已停止 Vite (PID: $PID)"
  rm -f .vite.pid
else
  pkill -f "vite" 2>/dev/null && echo "✅ 已停止所有 Vite 进程" || echo "ℹ️ 没有运行的 Vite 进程"
fi
