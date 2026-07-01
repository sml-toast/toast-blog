#!/bin/bash
# ─────────────────────────────────────────────────────
# dev.sh — Toast Blog 开发服务器启动脚本（前台）
# 用法: ./scripts/dev.sh [端口号]
# 功能: 自动清理占用端口，启动 Vite 开发服务器（前台运行）
# 注意: 后台持久运行请使用 bash scripts/start.sh
# ─────────────────────────────────────────────────────

set -e

cd "$(dirname "$0")/.."
PORT="${1:-5174}"

# 检查端口是否被占用
if lsof -i :"$PORT" -P -s TCP:LISTEN 2>/dev/null | grep -q LISTEN; then
  PID=$(lsof -ti :"$PORT" 2>/dev/null)
  echo "⚠️  端口 $PORT 被进程 $PID 占用，正在清理..."
  kill -9 "$PID" 2>/dev/null
  sleep 1
fi

echo "🚀 启动 Vite 开发服务器 → http://localhost:$PORT/"
./node_modules/.bin/vite --host 0.0.0.0 --port "$PORT"
