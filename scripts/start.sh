#!/bin/bash
# ─────────────────────────────────────────────────────
# start.sh — 一键启动（后台持久运行，不受 shell 退出影响）
# 用法: bash scripts/start.sh [端口号]
#
# 使用 launchd 管理进程，完全独立于 shell 会话生命周期。
# 即使关闭终端/SSH 断开，服务持续运行。
# ─────────────────────────────────────────────────────

cd "$(dirname "$0")/.."
PROJECT_DIR="$(pwd)"
PORT="${1:-5174}"

NODE_BIN="$(which node 2>/dev/null || echo '/usr/local/bin/node')"
SCRIPT_NAME="com.toast.blog.vite"

# ── 停止已有服务 ──
if launchctl list | grep -q "$SCRIPT_NAME" 2>/dev/null; then
  echo "⚠️  发现已有服务，正在停止..."
  launchctl bootout "gui/$(id -u)/$SCRIPT_NAME" 2>/dev/null
  sleep 1
fi

# ── 清理旧端口 ──
if lsof -i :"$PORT" -P -s TCP:LISTEN 2>/dev/null | grep -q LISTEN; then
  echo "⚠️  端口 $PORT 被占用，正在清理..."
  kill -9 $(lsof -ti :"$PORT") 2>/dev/null
  sleep 1
fi

rm -f .vite.log .vite.pid

# ── 创建启动脚本（launchd 需要完整环境） ──
LAUNCH_SCRIPT="/tmp/start-blog-vite-${PORT}.sh"
cat > "$LAUNCH_SCRIPT" << 'LAUNCH'
#!/bin/bash
export PATH="LAUNCHPATH"
cd "LAUNCHDIR"
exec ./node_modules/.bin/vite --host 0.0.0.0 --port LPORT
LAUNCH

# 替换占位符
sed -i '' "s|LAUNCHPATH|$PATH|g" "$LAUNCH_SCRIPT"
sed -i '' "s|LAUNCHDIR|$PROJECT_DIR|g" "$LAUNCH_SCRIPT"
sed -i '' "s|LPORT|$PORT|g" "$LAUNCH_SCRIPT"
chmod +x "$LAUNCH_SCRIPT"

# ── 通过 launchd 提交 ──
launchctl submit -l "$SCRIPT_NAME" -- "$LAUNCH_SCRIPT" 2>&1

# ── 等待就绪 ──
sleep 3
ACTUAL_PID=$(lsof -i :"$PORT" -P -s TCP:LISTEN -F p 2>/dev/null | head -1 | sed 's/^p//')
if [ -n "$ACTUAL_PID" ] && [ "$ACTUAL_PID" -gt 0 ] 2>/dev/null; then
  echo "$ACTUAL_PID" > .vite.pid
  echo "✅ Vite 开发服务器已启动 → http://localhost:$PORT/"
  echo "   PID: $ACTUAL_PID (launchd 管理)"
  echo "   日志: .vite.log"
  echo "   停止: bash scripts/stop.sh"
else
  echo "❌ 启动失败，查看日志: cat .vite.log"
  cat .vite.log 2>/dev/null || true
  exit 1
fi
