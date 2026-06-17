# 开发日志

> 每完成一个功能，记录测试结果。

## [2026-06-17] 后台管理面板规划
- 完成 Iter 0-5 所有任务
- 完成 Iter 6 增强（Pages 修复、Logo、弹窗、简历、打印）
- 规划后台管理方案（localStorage → GitHub API → 独立后端）
- 更新开发计划，新增 Iter 7

## [2026-06-16] 项目文档 & 开源
- 创建主目录 README.md（中英双语项目介绍）
- 补充 doc/README.md（架构/模块/思维导图/部署/任务进度/测试）
- 修复 .gitignore 冲突标记
- 仓库开源并迁移到 sml-toast organization
- 配置 GitHub Pages + CI/CD
- Vite base 路径配置 `/toast-blog/`

## [2026-06-15] 项目重建
- 敏感数据清理后部分文件丢失
- 从 dist 构建产物恢复 index.html
- 手动重建 data/projects.js (7)、tutorials.js (11)、wiki.js (20)、path.js (6)
- 重建 main.js、public/sw.js / 404.html / manifest.json
- 构建: ✅ 通过
