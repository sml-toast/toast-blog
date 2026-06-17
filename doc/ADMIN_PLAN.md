# 数据后台管理 — 规划文档

> 2026-06-17 | 当前数据位于 `data/*.js`，静态 JS 模块

---

## 现状

| 数据 | 文件 | 条目 | 来源 |
|------|------|------|------|
| 作品 | `data/projects.js` | 7 | 测试数据 |
| 教程 | `data/tutorials.js` | 11 | 测试数据 |
| Wiki | `data/wiki.js` | 20 | 测试数据 |
| 学习路线 | `data/path.js` | 6 | 测试数据 |
| 简历 | `index.html` 硬编码 | 1 | 真实数据 |

所有数据都是静态写死在 JS 里的，改一条就要改代码、重构建、重部署。

---

## 目标

一个**后台管理面板**，支持：

1. ✅ 作品 / 教程 / Wiki / 学习路线 / 简历 → 增、删、改
2. ✅ 上传附件（PDF、ZIP 等技术文档）
3. ✅ 上传图片（项目截图、教程配图、头像等）
4. ✅ 数据持久化、不丢
5. ✅ 部署后可用、不依赖本地环境

---

## 方案对比

### 方案 A：客户端管理 + localStorage（立即可用）

```
                    ┌────────────────────┐
                    │   toast-blog site  │
                    │   ┌──────────────┐ │
                    │   │ 前台展示 (SPA) │ │
                    │   └──────┬───────┘ │
                    │   ┌──────┴───────┐ │
                    │   │ 后台管理面板  │ │
                    │   │ (hidden tab) │ │
                    │   └──────┬───────┘ │
                    └──────────┼─────────┘
                               │
                    ┌──────────┴──────────┐
                    │   localStorage       │
                    │   + JSON 导入/导出   │
                    └─────────────────────┘
```

**优点：** 零后端，零依赖，立即能用，不干扰前台
**缺点：** 数据只存当前浏览器，清缓存就丢；图片只能 base64（<2MB）；不支持多人协作

**适用场景：** 本地开发测试、个人临时管理

### 方案 B：GitHub API 作为后端（推荐）

```
                    ┌────────────────────┐
                    │   toast-blog site  │
                    │   ┌──────────────┐ │
                    │   │ 前台展示 (SPA) │ │
                    │   └──────┬───────┘ │
                    │   ┌──────┴───────┐ │
                    │   │ 后台管理面板  │ │
                    │   │ (password)   │ │
                    │   └──────┬───────┘ │
                    └──────────┼─────────┘
                               │ GitHub API (REST)
                    ┌──────────┴──────────┐
                    │ sml-toast/toast-blog │
                    │  data/*.js          │
                    │  public/uploads/    │
                    │  GitHub Actions     │
                    │  → 自动构建部署      │
                    └─────────────────────┘
```

**优点：** 数据持久化、版本控制、自动部署、可多人协作
**缺点：** 需要 GitHub Token 配置，操作有 API 速率限制

**适用场景：** 生产环境

### 方案 C：独立后端 API（未来）

```
┌──────────────┐     ┌──────────────┐     ┌──────────┐
│  前台 SPA    │────▶│  API 服务    │────▶│ Database │
│  toast-blog │     │  Node/Python │     │ SQLite   │
└──────────────┘     └──────┬───────┘     └──────────┘
                            │
                    ┌───────┴───────┐
                    │   文件存储     │
                    │  S3/R2/本地   │
                    └───────────────┘
```

**优点：** 完整 CRUD、权限控制、文件管理、多人协作
**缺点：** 需要服务器、部署维护、成本

**适用场景：** 用户量增长、多人编辑、需要 API 开放

---

## 推荐路径

```
现在 ─────────────────────────→ 短期 ────────────────────→ 未来
方案 A (localStorage)    方案 B (GitHub API)       方案 C (独立后端)
  ├ 快速验证               ├ 数据持久化               ├ 完整 API
  ├ 本地开发               ├ 版本控制                 ├ 数据库
  └ 最小成本               ├ 自动部署                 └ 文件存储
                           └ 不另起服务
```

**建议：先做方案 A，1-2 天内切换到方案 B，未来按需升级到方案 C。**

---

## 数据模型设计

### 作品 Project

```json
{
  "id": "uuid",
  "cat": "ai | web | tool",
  "title": "String",
  "desc": "String",
  "fullDesc": "String",
  "tags": ["String"],
  "icon": "emoji | image URL",
  "thumbnail": "image URL",
  "tech": "String",
  "demoUrl": "URL",
  "githubUrl": "URL",
  "giteeUrl": "URL",
  "docUrl": "URL",
  "images": ["URL"],
  "attachments": [{"name": "String", "url": "URL"}],
  "createdAt": "ISO date",
  "updatedAt": "ISO date"
}
```

### 教程 Tutorial

```json
{
  "id": "uuid",
  "title": "String",
  "desc": "String",
  "content": "Markdown",
  "level": "beginner | intermediate | advanced",
  "levelText": "String",
  "icon": "emoji",
  "iconBg": "color hex",
  "tags": ["String"],
  "images": ["URL"],
  "attachments": [{"name": "String", "url": "URL"}],
  "createdAt": "ISO date",
  "updatedAt": "ISO date"
}
```

### Wiki

```json
{
  "id": "uuid",
  "cat": "dev | ai | ops | tool",
  "icon": "emoji",
  "title": "String",
  "desc": "String",
  "content": "Markdown",
  "tags": ["String"],
  "images": ["URL"],
  "attachments": [{"name": "String", "url": "URL"}],
  "date": "YYYY-MM-DD",
  "createdAt": "ISO date",
  "updatedAt": "ISO date"
}
```

### 学习路线 Step

```json
{
  "id": "uuid",
  "label": "String",
  "title": "String",
  "desc": "String",
  "techs": ["String"],
  "completed": false,
  "order": number,
  "createdAt": "ISO date"
}
```

### 简历 Resume

```json
{
  "name": "String",
  "phone": "String",
  "email": "String",
  "school": "String",
  "company": "String",
  "bio": "String",
  "skills": [{"group": "String", "items": ["String"]}],
  "experience": [{"date": "String", "company": "String", "title": "String", "duties": ["String"]}],
  "education": [{"date": "String", "school": "String", "major": "String", "degree": "String"}],
  "avatar": "image URL",
  "encrypted": {"name": true, "phone": true, "school": true, "company": true}
}
```

---

## 方案 A 详细设计（立即实现）

### 页面结构

```
#admin (隐藏页签 / 密码进入)
├── 仪表盘 — 数据统计总览
├── 作品管理 — CRUD 表格 + 表单弹窗
├── 教程管理 — CRUD 表格 + Markdown 编辑器
├── Wiki 管理 — CRUD 表格 + Markdown 编辑器
├── 学习路线 — 拖拽排序 CRUD
├── 简历编辑 — 表单编辑
├── 文件管理 — 图片/附件上传 & 浏览
└── 数据导入/导出 — JSON 整体导入导出
```

### 技术选型

```
前端:   Vite + 原生 JS（与现有一致，不引入框架）
编辑器: 简单 Markdown textarea（后续可升级为 CodeMirror）
上传:   FileReader → base64（方案A）/ GitHub API → commits（方案B）
存储:   localStorage（方案A）/ GitHub API（方案B）
图标:   Lucide Icons（与现有一致）
样式:   现有 CSS 变量系统
密码:   sessionStorage 存储，简单 hash 验证
```

### 文件结构

```
public/admin/           ← 管理面板入口
├── admin.html          ← 管理面板主页面（或 #admin section）
├── admin.js            ← 管理面板逻辑
└── admin.css           ← 管理面板样式

data/
├── admin-schema.js     ← 数据模型 schema 定义
└── admin-helpers.js    ← CRUD 工具函数
```

### 入口方式

```
#admin 密码保护：
  1. 访问 /#admin 或底部链接
  2. 弹出密码输入
  3. 密码验证通过 → session 存储 → 显示管理面板
  4. 默认密码: toast-admin (可改)
```

---

## 方案 B 扩展（GitHub API）

在方案 A 基础上，存储层从 localStorage 替换为 GitHub API：

```
GitHub API 调用:
  GET    /repos/sml-toast/toast-blog/contents/data/projects.js
  PUT    /repos/sml-toast/toast-blog/contents/data/projects.js
  POST   /repos/sml-toast/toast-blog/git/blobs
  POST   /repos/sml-toast/toast-blog/git/trees
  POST   /repos/sml-toast/toast-blog/git/commits
  POST   /repos/sml-toast/toast-blog/git/refs/heads/main

文件上传:
  图片 → public/uploads/{uuid}.{ext} → GitHub commit
  附件 → public/uploads/{uuid}.{ext} → GitHub commit

自动部署:
  提交 → GitHub Actions 触发 → 构建 → 部署 → Pages 更新
```

访问令牌通过环境变量或管理面板设置界面配置。

---

## 实施步骤

| 步骤 | 内容 | 预估 |
|------|------|------|
| 1 | admin 入口 + 密码保护 | 0.5h |
| 2 | 数据模型 + localStorage CRUD 工具 | 1h |
| 3 | 作品管理界面（表格 + 增删改弹窗） | 1.5h |
| 4 | 教程管理界面（Markdown 编辑） | 1h |
| 5 | Wiki 管理界面（Markdown 编辑 + 分类） | 1h |
| 6 | 学习路线管理（排序） | 0.5h |
| 7 | 简历编辑界面 | 1h |
| 8 | 图片/文件上传界面 | 1h |
| 9 | JSON 导入/导出 | 0.5h |
| 10 | 前台数据从 localStorage 读取 | 0.5h |
| 11 | 测试 & 修复 | 1h |
| **总计** | **方案 A 完整实现** | **9h** |

| 步骤 | 内容 | 预估 |
|------|------|------|
| 12 | GitHub API 鉴权 | 0.5h |
| 13 | storage 层替换为 GitHub API | 2h |
| 14 | 文件上传 → GitHub 存储 | 1h |
| 15 | 自动 commit + deploy | 0.5h |
| **总计** | **方案 B 升级** | **4h** |

---

## 需要确认的问题

1. ✅ **先用方案 A（localStorage）还是直接上方案 B（GitHub API）？**
2. ✅ **管理面板入口：`#admin` 隐藏页签 vs 独立文件 `admin/index.html`？**
3. ✅ **是否需要 Markdown 富文本编辑器？简单 textarea 还是 CodeMirror？**
4. ✅ **图片上传目前用 base64 还是需要 GitHub API 存储？**
