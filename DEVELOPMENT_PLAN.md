# Toast Blog — 开发计划

> 最后更新: 2026-06-17 | 项目: Vite 6 + 原生 JS

## 迭代完成状态

| 迭代 | 状态 | 核心内容 |
|------|------|---------|
| Iter 0: 骨架 | ✅ | Vite 初始化、6 板块 HTML、CSS 变量、导航 |
| Iter 1: MVP | ✅ | 深色模式、入场动画、返回顶部、ESC 关闭、汉堡菜单 |
| Iter 2: 内容 | ✅ | Wiki 20 条、教程 11 条、作品 7 个、简历数据 |
| Iter 3: 性能 | ✅ | Lighthouse P100、a11y 93、SEO 100 |
| Iter 4: 平台 | ✅ | JSON-LD、Sitemap、RSS、PWA、Giscus、GitHub Actions |
| Iter 5: 迭代 | ✅ | 数据统计、反馈通道、技术栈评估 |
| Iter 6: 增强 | ✅ | Pages 部署修复、Logo 设计、弹窗修复、简历功能补齐、打印优化 |
| Iter 7: 管理 | 🔜 | 后台管理面板 — localStorage CRUD + 加密访问 + 静态表单 |
| Iter 8: 存储 | 💡 | GitHub API 数据持久化 + 文件上传 |

## 后台管理 (Iter 7)

| # | 任务 | 状态 |
|---|------|------|
| 7.1 | data/loader.js — 数据层（localStorage 优先） | ✅ |
| 7.2 | main.js — 整合数据加载器 | ✅ |
| 7.3 | admin.js — 管理面板（登录/CRUD/导入导出） | ✅ |
| 7.4 | admin.css — 管理面板样式 | ✅ |
| 7.5 | index.html — 后台管理 section + 表单 + 导航 | ✅ |
| 7.6 | 后台管理文档 | 🔜 |
| 7.7 | 测试 & 修复 | 🔜 |
| 7.8 | 构建 & 部署验证 | 🔜 |

## 后续迭代

| # | 任务 | 优先级 | 状态 |
|---|------|--------|------|
| 8.1 | GitHub API 数据持久化 | P1 | 💡 |
| 8.2 | 图片/文件上传（GitHub commit） | P1 | 💡 |
| 8.3 | 页面动效增强 | P2 | 🔲 |
| 8.4 | 图片懒加载 | P2 | 🔲 |
