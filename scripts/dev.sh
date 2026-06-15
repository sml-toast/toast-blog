#!/bin/bash
# ─────────────────────────────────────────────────────
# dev.sh — Toast Blog 开发服务器启动脚本
# 用法: ./scripts/dev.sh [端口号]
# 功能: 自动清理占用端口，启动 Vite 开发服务器
# ─────────────────────────────────────────────────────

set -e

PORT="${1:-5173}"

# 检查端口是否被占用
check_port() {
  lsof -i :"$1" -P -n 2>/dev/null | grep LISTEN >/dev/null 2>&1
  return $?
}

if check_port "$PORT"; then
  PID=$(lsof -i :"$PORT" -P -n -F p 2>/dev/null | head -1 | sed 's/^p//')
  if [ -n "$PID" ] && [ "$PID" -gt 0 ] 2>/dev/null; then
    echo "⚠️  端口 $PORT 被进程 $PID 占用，正在清理..."
    kill -9 "$PID" 2>/dev/null
    # 等待端口完全释放
    for i in $(seq 1 10); do
      sleep 0.5
      if ! check_port "$PORT"; then
        echo "✅ 端口 $PORT 已释放"
        break
      fi
    done
  fi
fi

echo "🚀 启动 Vite 开发服务器 → http://localhost:$PORT/"
npx vite --host localhost --port "$PORT"

# 如果指定端口被占用，打印提示
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
  echo "❌ 启动失败，请尝试: ./scripts/dev.sh 5174"
fi
exit $EXIT_CODE
