#!/bin/bash
# ─────────────────────────────────────────────────────
# start.sh — 一键启动（后台持久运行）
# 用法: bash scripts/start.sh
# ─────────────────────────────────────────────────────

cd "$(dirname "$0")/.."

# 清理旧的 Vite 进程
pkill -f "vite" 2>/dev/null
sleep 1

PORT="${1:-5174}"

# 启动 Vite 并将进程写到 PID 文件
nohup npx vite --host localhost --port "$PORT" > .vite.log 2>&1 &
VITE_PID=$!
echo $VITE_PID > .vite.pid

# 等待就绪
sleep 2
if lsof -i :"$PORT" -P -n 2>/dev/null | grep -q LISTEN; then
  echo "✅ Vite 开发服务器已启动 → http://localhost:$PORT/"
  echo "   PID: $VITE_PID"
  echo "   日志: .vite.log"
  echo "   停止: kill $VITE_PID 或 bash scripts/stop.sh"
else
  echo "❌ 启动失败，查看日志: cat .vite.log"
  exit 1
fi
