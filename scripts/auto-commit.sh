#!/bin/bash
# ─────────────────────────────────────────────────────
# auto-commit.sh — 自动检测变更并提交
# 使用方法:
#   chmod +x scripts/auto-commit.sh
#   ./scripts/auto-commit.sh           # 单次运行
#   ./scripts/auto-commit.sh --watch   # 每10分钟轮询
# ─────────────────────────────────────────────────────

set -e

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_DIR"

# ── 生成提交描述 ──
generate_commit_message() {
  local changed_files
  changed_files=$(git status --porcelain)

  if [ -z "$changed_files" ]; then
    return 1
  fi

  # 统计变更类型
  local added=0 modified=0 deleted=0 renamed=0
  while IFS= read -r line; do
    local status="${line:0:2}"
    case "$status" in
      "?? "|"A ") ((added++));;
      " M"|"M ") ((modified++));;
      " D"|"D ") ((deleted++));;
      "R ") ((renamed++));;
      *) ((modified++));;
    esac
  done <<< "$changed_files"

  # 提取变更的文件列表（最多 5 个）
  local file_list
  file_list=$(git status --porcelain | sed 's/^...//' | head -5 | tr '\n' ', ' | sed 's/, $//')
  local more_count
  more_count=$(git status --porcelain | wc -l | tr -d ' ')
  if [ "$more_count" -gt 5 ]; then
    file_list="$file_list 等 ${more_count} 个文件"
  fi

  # 构建提交信息
  local msg="chore: auto-commit"
  local parts=""
  [ "$added" -gt 0 ]    && parts="${parts} +${added}"
  [ "$modified" -gt 0 ] && parts="${parts} ~${modified}"
  [ "$deleted" -gt 0 ]  && parts="${parts} -${deleted}"
  [ "$renamed" -gt 0 ]  && parts="${parts} >${renamed}"

  if [ -n "$parts" ]; then
    msg="chore: ${parts# } — ${file_list}"
  fi

  echo "$msg"
  return 0
}

# ── 执行提交 ──
do_commit() {
  local msg
  msg=$(generate_commit_message) || {
    echo "$(date '+%Y-%m-%d %H:%M:%S') [SKIP] 没有变更"
    return 0
  }

  git add -A
  git commit -m "$msg"
  echo "$(date '+%Y-%m-%d %H:%M:%S') [OK] 已提交: $msg"

  # 尝试推送（忽略网络错误）
  git push 2>/dev/null && echo "  └─ 已推送到远程" || echo "  └─ 推送跳过（网络/权限）"
}

# ── 入口 ──
if [ "${1:-}" = "--watch" ]; then
  echo "🔁 自动提交守护已启动（每 10 分钟检查一次）"
  echo "   项目: $PROJECT_DIR"
  echo "   停止: kill $PPID 或按 Ctrl+C"
  echo "────────────────────────────────────"
  while true; do
    do_commit
    sleep 600
  done
else
  do_commit
fi
