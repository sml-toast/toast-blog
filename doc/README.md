# Toast Blog · 项目文档

> 作者：简单的李
> 仓库：https://github.com/sml-toast/toast-blog
> 在线：https://sml-toast.github.io/toast-blog/
> 最后更新：2026-06-16

---

## 一、项目目的

个人技术博客 + 作品集网站。展示简历、开源作品、技术教程、知识笔记（Wiki）和学习路线。

## 二、项目架构图

```
┌─────────────────────────────────────┐
│          Toast Blog (Vite)           │
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐  │
│  │       SPA 单页应用              │  │
│  │  index.html → main.js → style  │  │
│  └───────────┬───────────────────┘  │
│              │                      │
│  ┌───────────┴───────────────────┐  │
│  │       页面板块 (Section)        │  │
│  │  Home → 首页 / Hero           │  │
│  │  Resume → 简历                │  │
│  │  Workspace → 作品展示          │  │
│  │  Tutorials → 教程             │  │
│  │  Wiki → 知识笔记              │  │
│  │  Learning Path → 学习路线      │  │
│  └───────────────────────────────┘  │
│                                      │
│  ┌───────────────────────────────┐  │
│  │       数据层 (data/)          │  │
│  │  projects.js · tutorials.js   │  │
│  │  wiki.js · path.js            │  │
│  └───────────────────────────────┘  │
│                                      │
│  ┌───────────────────────────────┐  │
│  │        构建 & 部署             │  │
│  │  Vite build → dist/           │  │
│  │  GitHub Actions → Pages       │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

## 三、模块图

| 模块 | 职责 | 文件 |
|------|------|------|
| **导航** | 6 页面签切换、Scroll Spy 高亮 | index.html `<nav>` |
| **首页** | 头像、自我介绍、社交链接 | `#home` section |
| **简历** | 加密信息栏、工作经历、技能标签、预览/导出 PDF | `#resume` section |
| **作品** | 分类筛选（AI/Web/工具）、弹窗详情、GitHub/Gitee 链接 | `#workspace` + `#projectGrid` |
| **教程** | 教程卡片展示 | `#tutorials` + `#tutorialGrid` |
| **Wiki** | 分类筛选、Markdown 弹窗渲染 | `#wiki` + `#wikiCategories` |
| **学习路线** | 步骤进度展示 | `#learning-path` + `#learningPath` |
| **主题切换** | 明/暗切换，localStorage 持久化 | `theme-toggle-btn` |
| **骨架屏** | 加载动画 | `data-skeleton` cards |
| **模态框** | 作品/Wiki 详情弹窗，ESC 关闭 | `#modalOverlay` |
| **回到顶部** | 滚动 ≥300px 显示 | `back-to-top` |
| **PWA** | Service Worker 缓存 | `public/sw.js` |
| **SEO** | JSON-LD、Sitemap、RSS、OG/Twitter 卡片 | `<head>` |

## 四、思维导图

```mermaid
mindmap
  root((Toast Blog))
    前端 Vite
      index.html
        页面骨架
        SEO Meta
        JSON-LD
      main.js
        渲染逻辑
        事件绑定
        主题切换
        PWA 注册
      style.css
        1202 行样式
        明暗变量
        响应式
      public
        404.html
        sw.js
        manifest.json
        feed.xml / sitemap.xml
    数据层 data
      projects.js
        7 个作品
        GitHub/Gitee 链接
      tutorials.js
        11 个教程
        难度等级
      wiki.js
        20 条笔记
        4 分类
      path.js
        6 步学习路线
    功能模块
      导航栏
        6 页面签
        Scroll Spy
        汉堡菜单
      首页 Hero
        头像
        社交链接
        标签云
      简历 Resume
        加密信息
        预览 / PDF
        工作经历
      作品 Workspace
        分类筛选
        模态弹窗
        仓库外链
      Wiki
        分类标签
        Markdown 渲染
        弹窗展示
      学习路线
        步骤进度
    脚本工具
      dev.sh
        端口检测
        自动清理
      start.sh
        后台启动
        PID 管理
      auto-commit.sh
        --watch 模式
        10 分钟轮询
    部署 CI/CD
      GitHub Actions
        npm ci + build
        Upload dist/
        Deploy Pages
    文档 doc
      README.md
      原型设计
```

## 五、代码树

```
toast-blog/
├── index.html              # 主页面 (所有 Section)
├── main.js                 # 核心 JS 逻辑
├── style.css               # 全局样式 (1202 行)
├── vite.config.js          # Vite 配置
├── package.json            # NPM 依赖
├── .gitignore              # Git 忽略规则
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Pages 自动部署
├── data/
│   ├── projects.js         # 作品数据 (7 个)
│   ├── tutorials.js        # 教程数据 (11 个)
│   ├── wiki.js             # Wiki 数据 (20 条)
│   └── path.js             # 学习路线数据 (6 步)
├── public/
│   ├── 404.html            # 404 页面
│   ├── feed.xml            # RSS
│   ├── manifest.json       # PWA Manifest
│   ├── robots.txt          # 爬虫规则
│   ├── sitemap.xml         # 站点地图
│   ├── sw.js               # Service Worker
│   └── project-thumbs/     # 作品缩略图 SVG
│       ├── ai-cs.svg
│       ├── lowcode.svg
│       ├── create-toast.svg
│       ├── flowforge.svg
│       ├── toast-ui.svg
│       ├── agent-forge.svg
│       └── devbox.svg
├── scripts/
│   ├── dev.sh              # 开发启动
│   ├── start.sh            # 后台启动
│   ├── stop.sh             # 停止
│   ├── auto-commit.sh      # 自动提交
│   └── com.toastblog.autocommit.plist  # macOS 定时任务
├── dist/                   # 构建产物
├── doc/
│   ├── README.md           # ← 本文档
│   ├── .gitignore
│   ├── gen.py
│   ├── generate_blog.py
│   └── test.txt
├── DEVELOPMENT_PLAN.md     # 开发计划
└── DEVELOPMENT_LOG.md      # 开发日志
```

## 六、本地启动命令

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器 (端口自动检测)
npm run dev

# 3. 构建生产版本
npm run build

# 4. 预览构建产物
npm run preview
```

### 可用脚本

| 脚本 | 功能 |
|------|------|
| `npm run dev` 或 `bash scripts/dev.sh` | 启动 Vite 开发服务器 |
| `bash scripts/dev.sh 5174` | 指定端口启动 |
| `bash scripts/start.sh` | 后台持久运行 |
| `bash scripts/stop.sh` | 停止后台进程 |
| `bash scripts/auto-commit.sh` | 自动检测变更并提交 |
| `bash scripts/auto-commit.sh --watch` | 每 10 分钟轮询提交 |

## 七、服务器部署

### GitHub Pages

```yaml
# .github/workflows/deploy.yml
# Push 到 main 分支自动触发：
# 1. npm ci + npm run build
# 2. 上传 dist/ 到 Pages
# 3. 部署到 https://sml-toast.github.io/toast-blog/
```

**手动触发：**
```bash
npm run build
# 推送 main 分支 → GitHub Actions 自动部署
```

**GitHub Pages 配置：**
- Source: GitHub Actions
- 域名: https://sml-toast.github.io/toast-blog/（待修复）
- 需要配置 Pages 自定义域名或等待 Actions 部署完成

## 八、开发任务 & 进度

| # | 任务 | 状态 |
|---|------|------|
| 1 | Vite 初始化 + 6 板块 HTML 骨架 | ✅ |
| 2 | 深色模式、入场动画、返回顶部、ESC关闭、汉堡菜单 | ✅ |
| 3 | 内容填充（Wiki 20 + 教程 11 + 作品 7 + 简历） | ✅ |
| 4 | Lighthouse P100 性能优化 | ✅ |
| 5 | SEO/JSON-LD/Sitemap/RSS/PWA/Giscus/GitHub Actions | ✅ |
| 6 | GitHub Pages 开启 | 🔲 待修复 |
| 7 | 页面动效增强 | 🔲 |
| 8 | 图片懒加载 | 🔲 |

## 九、测试任务 & 进度

| # | 测试项 | 状态 |
|---|--------|------|
| 1 | 页面标题正确 | ✅ |
| 2 | 6 个导航标签切换 | ✅ |
| 3 | 作品分类筛选 (全部/AI/Web/工具) | ✅ |
| 4 | 作品弹窗 + ESC 关闭 | ✅ |
| 5 | Wiki 分类筛选 + Markdown 弹窗 | ✅ |
| 6 | 主题切换持久化 | ✅ |
| 7 | 回到顶部按钮 | ✅ |
| 8 | 汉堡菜单（移动端） | ✅ |
| 9 | 简历加密切换 + 预览 + PDF 导出 | ✅ |
| 10 | GitHub Pages 可访问 | 🔲 |

## 十、开发工具

| 工具 | 用途 |
|------|------|
| Vite 6 | 构建工具 |
| VS Code / Cursor | 编辑器 |
| Chrome DevTools + Lighthouse | 调试 & 审计 |
| Figma | 原型设计 |
| GitHub Actions | CI/CD |
| html2pdf.js (CDN) | PDF 导出 |
| Lucide Icons | 图标库 |
| Giscus | 评论区 |

## 十一、测试工具

| 工具 | 用途 |
|------|------|
| Playwright | E2E 浏览器测试 |
| Chrome Lighthouse | 性能/SEO/可访问性审计 |
| 手动测试 | 功能完整性验证 |

## 十二、测试脚本

```bash
# 启动开发服务器
npm run dev

# 手动测试清单：
# 1. 首页 - 标题、导航、滚动
# 2. 简历 - 加密切换、预览、PDF
# 3. 作品 - 筛选、弹窗、仓库链接
# 4. 教程 - 卡片展示
# 5. Wiki - 分类、弹窗内容
# 6. 学习路线 - 步骤展示
```
