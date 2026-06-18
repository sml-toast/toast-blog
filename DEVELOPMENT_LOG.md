# 开发日志

> 每完成一个功能，记录测试结果。

## [2026-06-17] 后台管理面板 (Iter 7)

### 架构
- 数据层: data/loader.js → localStorage 优先，静态 JS 做默认值
- 管理面板: admin.js + admin.css → 加密访问 + 5 页签管理
- 前台: main.js 整合 loader，数据变更自动重新渲染

### 功能
- [x] 密码保护登录（默认密码 admin）
- [x] 仪表盘：数据统计总览
- [x] 作品 CRUD：表格 + 静态表单（分类/标题/描述/URL/标签）
- [x] 教程 CRUD：表格 + 表单（标题/难度/图标/内容/Markdown）
- [x] Wiki CRUD：表格 + 表单（分类/标题/日期/内容/Markdown）
- [x] 学习路线 CRUD：拖拽样式列表
- [x] JSON 导出/导入
- [x] 数据重置为默认值

### 数据流
```
用户操作 → admin.js → data/loader.js → localStorage
                                          ↓
前台 main.js ← CustomEvent(data-changed) ←┘
```

### 已知问题
- admin.css 在构建时需要手动复制到 dist/
- Vite 构建不支持动态生成表单字段 HTML，改用静态表单

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

## [2026-06-18] Phase 1 — 后台管理重构

### 1.1 登录缓存 (✅)
- sessionStorage → localStorage + 30min 过期
- 退出按钮清除 auth + expiry
- 页面刷新不丢失登录状态，超时自动过期

### 1.2 环境切换配色 (✅)
- DEV 🟢 / TEST 🟠 / PROD 🔵 色块标签
- 切换时 loading 动画
- 当前环境高亮 + 色块区分
- DEV 🟢 / TEST 🟠 / PROD 🔵 色块标签
- 切换时动画反馈
