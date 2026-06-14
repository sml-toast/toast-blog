import os

OUT = '/Users/simpleli/workspace/blog-design/index.html'

parts = []

# ── Head ──
parts.append('''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Codex Blog · 个人博客</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
<style>
''')

# ── CSS ──
parts.append('''
:root {
  --bg: #f5f5f7;
  --surface: #ffffff;
  --border: #e8e8ed;
  --text: #1d1d1f;
  --text-secondary: #6e6e73;
  --accent: #0071e3;
  --accent-light: #e8f0fe;
  --success: #34c759;
  --orange: #ff9500;
  --radius: 16px;
  --radius-sm: 10px;
  --shadow: 0 2px 12px rgba(0,0,0,0.06);
  --shadow-lg: 0 8px 40px rgba(0,0,0,0.10);
  --transition: all 0.3s cubic-bezier(0.25,0.1,0.25,1);
}

* { margin:0; padding:0; box-sizing:border-box; }
html { scroll-behavior: smooth; }
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

/* ── Navigation ── */
nav {
  position: fixed; top:0; left:0; right:0;
  background: rgba(255,255,255,0.80);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid var(--border);
  z-index: 100;
  padding: 0 40px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
nav .logo { font-weight: 700; font-size: 18px; color: var(--accent); letter-spacing: -0.3px; }
nav .logo span { color: var(--text); }
nav ul { display: flex; gap: 32px; list-style: none; }
nav ul li a {
  text-decoration: none;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  transition: var(--transition);
  position: relative;
}
nav ul li a::after {
  content: ''; position: absolute; bottom: -18px; left: 0; right: 0;
  height: 2px; background: var(--accent);
  transform: scaleX(0); transition: var(--transition);
}
nav ul li a:hover, nav ul li a.active { color: var(--text); }
nav ul li a:hover::after, nav ul li a.active::after { transform: scaleX(1); }

/* ── Layout ── */
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
section { padding: 100px 0 80px; }
.section-label {
  font-size: 13px; font-weight: 600; text-transform: uppercase;
  letter-spacing: 2px; color: var(--accent); margin-bottom: 8px;
}
.section-title {
  font-size: 36px; font-weight: 700; letter-spacing: -0.5px;
  margin-bottom: 16px;
}
.section-desc {
  font-size: 16px; color: var(--text-secondary);
  max-width: 600px; margin-bottom: 48px;
}

/* ── Hero / Profile ── */
.hero {
  min-height: 100vh;
  display: flex; align-items: center;
  padding-top: 60px;
  background: linear-gradient(180deg, #f0f4ff 0%, var(--bg) 100%);
}
.hero .container { display: flex; align-items: center; gap: 80px; padding-top: 40px; }
.hero-avatar {
  flex-shrink: 0;
  width: 180px; height: 180px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), #5856d6);
  display: flex; align-items: center; justify-content: center;
  font-size: 64px; color: #fff; font-weight: 700;
  box-shadow: 0 12px 40px rgba(0,113,227,0.25);
  position: relative;
}
.hero-avatar .status-dot {
  position: absolute; bottom: 12px; right: 12px;
  width: 24px; height: 24px; background: var(--success);
  border: 3px solid #fff; border-radius: 50%;
}
.hero-content h1 {
  font-size: 52px; font-weight: 800; letter-spacing: -1px;
  margin-bottom: 8px; line-height: 1.1;
}
.hero-content h1 span { color: var(--accent); }
.hero-content .tagline {
  font-size: 20px; color: var(--text-secondary);
  margin-bottom: 24px; font-weight: 400;
}
.hero-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px; }
.hero-tags span {
  padding: 6px 14px; border-radius: 20px;
  background: var(--accent-light); color: var(--accent);
  font-size: 13px; font-weight: 500;
}
.hero-actions { display: flex; gap: 12px; }
.btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 12px 24px; border-radius: 24px;
  font-size: 14px; font-weight: 600;
  text-decoration: none; cursor: pointer; border: none;
  transition: var(--transition);
}
.btn-primary { background: var(--accent); color: #fff; }
.btn-primary:hover { background: #0062c4; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,113,227,0.35); }
.btn-outline { background: transparent; color: var(--text); border: 1.5px solid var(--border); }
.btn-outline:hover { border-color: var(--accent); color: var(--accent); }

/* ── Resume Section ── */
.resume-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
.resume-card {
  background: var(--surface);
  border-radius: var(--radius);
  padding: 32px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}
.resume-card h3 {
  font-size: 16px; font-weight: 600; margin-bottom: 20px;
  display: flex; align-items: center; gap: 8px;
}
.resume-card h3 .icon { color: var(--accent); }
.resume-card ul { list-style: none; }
.resume-card li {
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
  font-size: 14px;
}
.resume-card li:last-child { border-bottom: none; }
.resume-card li .date {
  font-size: 12px; color: var(--text-secondary);
  display: block; margin-bottom: 2px;
}
.resume-card li .title { font-weight: 600; }
.resume-card li .org { color: var(--text-secondary); font-size: 13px; }
.skills-pills {
  display: flex; flex-wrap: wrap; gap: 8px;
}
.skills-pills span {
  padding: 6px 14px; border-radius: 8px;
  background: var(--bg); font-size: 13px; font-weight: 500;
  border: 1px solid var(--border);
}

/* ── Workspace / Portfolio ── */
.workspace-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 32px;
}
.workspace-filters {
  display: flex; gap: 8px;
}
.workspace-filters button {
  padding: 8px 16px; border-radius: 20px;
  border: 1px solid var(--border); background: var(--surface);
  font-size: 13px; font-weight: 500; cursor: pointer;
  transition: var(--transition);
}
.workspace-filters button.active,
.workspace-filters button:hover {
  background: var(--accent); color: #fff; border-color: var(--accent);
}
.project-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.project-card {
  background: var(--surface);
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  transition: var(--transition);
  cursor: pointer;
}
.project-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
.project-thumb {
  width: 100%; height: 200px;
  background: linear-gradient(135deg, #e0e7ff, #f0e6ff);
  display: flex; align-items: center; justify-content: center;
  font-size: 48px;
}
.project-body { padding: 20px; }
.project-body .tag {
  display: inline-block;
  padding: 2px 10px; border-radius: 4px;
  font-size: 11px; font-weight: 600; text-transform: uppercase;
  background: var(--accent-light); color: var(--accent);
  margin-bottom: 8px;
}
.project-body h3 { font-size: 18px; font-weight: 600; margin-bottom: 6px; }
.project-body p { font-size: 14px; color: var(--text-secondary); margin-bottom: 12px; }
.project-tech {
  display: flex; flex-wrap: wrap; gap: 4px;
}
.project-tech span {
  padding: 2px 8px; border-radius: 4px;
  background: var(--bg); font-size: 11px; font-weight: 500;
  border: 1px solid var(--border);
}

/* ── Project Detail Modal ── */
.modal-overlay {
  position: fixed; inset:0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(8px);
  z-index: 200;
  display: none;
  align-items: center; justify-content: center;
  padding: 40px;
}
.modal-overlay.open { display: flex; }
.modal {
  background: var(--surface);
  border-radius: var(--radius);
  max-width: 720px; width: 100%;
  max-height: 85vh; overflow-y: auto;
  padding: 40px;
  box-shadow: 0 24px 80px rgba(0,0,0,0.2);
  position: relative;
}
.modal-close {
  position: absolute; top: 16px; right: 16px;
  width: 36px; height: 36px; border-radius: 50%;
  border: none; background: var(--bg);
  font-size: 18px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: var(--transition);
}
.modal-close:hover { background: var(--border); }
.modal-thumb {
  width: 100%; height: 240px;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, #e0e7ff, #f0e6ff);
  display: flex; align-items: center; justify-content: center;
  font-size: 56px; margin-bottom: 24px;
}
.modal h2 { font-size: 28px; font-weight: 700; margin-bottom: 12px; }
.modal .modal-meta {
  display: flex; gap: 16px; flex-wrap: wrap;
  margin-bottom: 24px;
}
.modal .modal-meta a, .modal .modal-meta span {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 13px; color: var(--accent); text-decoration: none;
}
.modal .modal-meta span { color: var(--text-secondary); }
.modal .modal-desc {
  font-size: 15px; color: var(--text-secondary);
  line-height: 1.8; margin-bottom: 24px;
}
.modal .modal-tech-stack {
  display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px;
}
.modal .modal-tech-stack span {
  padding: 6px 14px; border-radius: 8px;
  background: var(--bg); font-size: 13px; font-weight: 500;
  border: 1px solid var(--border);
}
.modal .modal-links {
  display: flex; gap: 12px;
}

/* ── AI Tutorials ── */
.tutorials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 60px;
}
.tutorial-card {
  background: var(--surface);
  border-radius: var(--radius);
  padding: 28px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  transition: var(--transition);
}
.tutorial-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
.tutorial-card .icon {
  width: 48px; height: 48px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; margin-bottom: 16px;
}
.tutorial-card h3 { font-size: 16px; font-weight: 600; margin-bottom: 6px; }
.tutorial-card p { font-size: 13px; color: var(--text-secondary); margin-bottom: 12px; }
.tutorial-card .difficulty {
  font-size: 11px; font-weight: 600; text-transform: uppercase;
  padding: 2px 10px; border-radius: 4px;
  display: inline-block;
}
.difficulty.beginner { background: #e8f5e9; color: #2e7d32; }
.difficulty.intermediate { background: #fff3e0; color: #e65100; }
.difficulty.advanced { background: #fce4ec; color: #c62828; }

/* ── Learning Path ── */
.path-section-title {
  font-size: 22px; font-weight: 700; margin-bottom: 32px;
  text-align: center;
}
.learning-path {
  position: relative;
  max-width: 780px; margin: 0 auto;
}
.learning-path::before {
  content: ''; position: absolute; left: 24px; top: 0; bottom: 0;
  width: 2px; background: linear-gradient(180deg, var(--accent), #5856d6);
}
.path-step {
  position: relative; padding: 0 0 32px 64px;
}
.path-step:last-child { padding-bottom: 0; }
.path-step .dot {
  position: absolute; left: 16px; top: 4px;
  width: 18px; height: 18px; border-radius: 50%;
  background: var(--accent); border: 3px solid #fff;
  box-shadow: 0 0 0 2px var(--accent);
  z-index: 1;
}
.path-step.completed .dot { background: var(--success); box-shadow: 0 0 0 2px var(--success); }
.path-step .step-label {
  font-size: 11px; font-weight: 600; text-transform: uppercase;
  letter-spacing: 1px; color: var(--accent); margin-bottom: 4px;
}
.path-step h4 { font-size: 18px; font-weight: 600; margin-bottom: 4px; }
.path-step p { font-size: 14px; color: var(--text-secondary); }
.path-step .step-tech {
  display: flex; gap: 6px; flex-wrap: wrap; margin-top: 8px;
}
.path-step .step-tech span {
  padding: 2px 8px; border-radius: 4px;
  background: var(--bg); font-size: 11px; font-weight: 500;
  border: 1px solid var(--border);
}

/* ── Footer ── */
footer {
  border-top: 1px solid var(--border);
  padding: 32px 0;
  text-align: center;
  font-size: 13px; color: var(--text-secondary);
}

/* ── Repo badge on card ── */
.project-card .repo-badge {
  position: absolute;
  bottom: 8px; right: 8px;
  display: flex; gap: 4px;
}
.project-card .repo-badge a {
  width: 28px; height: 28px;
  border-radius: 6px;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(4px);
  border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; text-decoration: none;
  transition: var(--transition);
  color: var(--text-secondary);
}
.project-card .repo-badge a:hover {
  background: #fff;
  color: var(--accent);
  border-color: var(--accent);
  transform: scale(1.1);
}
.project-thumb { position: relative; }

.modal .modal-links .btn-repo-github {
  border-color: #24292e;
  color: #24292e;
}
.modal .modal-links .btn-repo-github:hover {
  background: #24292e;
  color: #fff;
}
.modal .modal-links .btn-repo-gitee {
  border-color: #c71d23;
  color: #c71d23;
}
.modal .modal-links .btn-repo-gitee:hover {
  background: #c71d23;
  color: #fff;
}


/* ── Wiki ── */
.wiki-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 32px;
}
.wiki-categories {
  display: flex; gap: 8px; flex-wrap: wrap;
}
.wiki-categories button {
  padding: 8px 16px; border-radius: 20px;
  border: 1px solid var(--border); background: var(--surface);
  font-size: 13px; font-weight: 500; cursor: pointer;
  transition: var(--transition);
}
.wiki-categories button.active,
.wiki-categories button:hover {
  background: var(--accent); color: #fff; border-color: var(--accent);
}
.wiki-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.wiki-card {
  background: var(--surface);
  border-radius: var(--radius);
  padding: 24px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  transition: var(--transition);
  cursor: default;
}
.wiki-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}
.wiki-card .wiki-cat {
  display: inline-block;
  padding: 2px 10px; border-radius: 4px;
  font-size: 11px; font-weight: 600; text-transform: uppercase;
  background: var(--accent-light); color: var(--accent);
  margin-bottom: 10px;
}
.wiki-card .wiki-date {
  font-size: 12px; color: var(--text-secondary);
  display: block; margin-bottom: 4px;
}
.wiki-card h3 {
  font-size: 16px; font-weight: 600; margin-bottom: 8px;
  line-height: 1.4;
}
.wiki-card p {
  font-size: 13px; color: var(--text-secondary);
  margin-bottom: 12px; line-height: 1.6;
}
.wiki-card .wiki-tags {
  display: flex; flex-wrap: wrap; gap: 4px;
}
.wiki-card .wiki-tags span {
  padding: 2px 8px; border-radius: 4px;
  background: var(--bg); font-size: 11px; font-weight: 500;
  border: 1px solid var(--border);
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .hero .container { flex-direction: column; text-align: center; gap: 32px; }
  .hero-avatar { width: 140px; height: 140px; font-size: 48px; }
  .hero-content h1 { font-size: 36px; }
  .hero-tags, .hero-actions { justify-content: center; }
  .resume-grid { grid-template-columns: 1fr; }
  .project-grid { grid-template-columns: 1fr 1fr; }
  .tutorials-grid { grid-template-columns: 1fr 1fr; }
  .wiki-grid { grid-template-columns: 1fr 1fr; }
  .section-title { font-size: 28px; }
}
@media (max-width: 600px) {
  nav { padding: 0 16px; }
  nav ul { gap: 16px; }
  nav ul li a { font-size: 12px; }
  .container { padding: 0 16px; }
  .project-grid { grid-template-columns: 1fr; }
  .tutorials-grid { grid-template-columns: 1fr; }
  .wiki-grid { grid-template-columns: 1fr; }
  section { padding: 60px 0 40px; }
}
</style>
</head>
<body>
''')

print("css done")

# ── Nav ──
parts.append('''<nav>
  <div class="logo">Codex<span>Blog</span></div>
  <ul>
    <li><a href="#home" class="active">首页</a></li>
    <li><a href="#resume">简历</a></li>
    <li><a href="#workspace">作品</a></li>
    <li><a href="#tutorials">教程</a></li>
    <li><a href="#wiki">Wiki</a></li>
    <li><a href="#learning-path">学习路线</a></li>
  </ul>
</nav>
''')

# ── Hero ──
parts.append('''
<section class="hero" id="home">
  <div class="container">
    <div class="hero-avatar">
      👨‍💻
      <span class="status-dot"></span>
    </div>
    <div class="hero-content">
      <h1>Hi, 我是 <span>Codex</span></h1>
      <p class="tagline">全栈开发者 · AI 技术布道者 · 开源贡献者</p>
      <div class="hero-tags">
        <span>React / Vue</span>
        <span>Python / Go</span>
        <span>LLM / RAG</span>
        <span>DevOps</span>
        <span>系统设计</span>
      </div>
      <div class="hero-actions">
        <a href="#workspace" class="btn btn-primary">查看作品 →</a>
        <a href="#resume" class="btn btn-outline">关于我</a>
      </div>
    </div>
  </div>
</section>
''')

# ── Resume ──
parts.append('''
<section id="resume">
  <div class="container">
    <div class="section-label">Resume</div>
    <h2 class="section-title">个人简历</h2>
    <p class="section-desc">5 年全栈开发经验，专注于 AI 应用架构与工程化落地。</p>
    <div class="resume-grid">
      <div class="resume-card">
        <h3><span class="icon">💼</span> 工作经历</h3>
        <ul>
          <li>
            <span class="date">2023 - 至今</span>
            <div class="title">高级全栈工程师</div>
            <div class="org">某 AI 科技公司 · 负责 AI 平台架构设计与核心开发</div>
          </li>
          <li>
            <span class="date">2021 - 2023</span>
            <div class="title">全栈开发工程师</div>
            <div class="org">某互联网公司 · 主导低代码平台与数据可视化项目</div>
          </li>
          <li>
            <span class="date">2020 - 2021</span>
            <div class="title">前端开发工程师</div>
            <div class="org">某创业公司 · 从零搭建前端工程体系</div>
          </li>
        </ul>
      </div>
      <div class="resume-card">
        <h3><span class="icon">🎓</span> 教育 &amp; 技能</h3>
        <ul>
          <li>
            <div class="title">计算机科学与技术 硕士</div>
            <div class="org">某985高校 · 2017 - 2020</div>
          </li>
          <li>
            <div class="title" style="margin-bottom:12px">技术栈</div>
            <div class="skills-pills">
              <span>TypeScript</span><span>React</span><span>Vue</span><span>Node.js</span>
              <span>Python</span><span>Go</span><span>PostgreSQL</span><span>Redis</span>
              <span>Docker</span><span>K8s</span><span>AWS</span><span>LangChain</span>
              <span>OpenAI API</span><span>RAG</span><span>Agent</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</section>
''')

print("hero+resume done")

# ── Workspace ──
parts.append('''
<section id="workspace">
  <div class="container">
    <div class="section-label">Portfolio</div>
    <h2 class="section-title">工作台 · 作品展示</h2>
    <p class="section-desc">点击任一卡片查看详细的项目文档、演示链接与技术栈信息。</p>
    <div class="workspace-header">
      <div class="workspace-filters">
        <button class="active" data-filter="all">全部</button>
        <button data-filter="ai">AI / LLM</button>
        <button data-filter="web">Web 应用</button>
        <button data-filter="tool">开发工具</button>
      </div>
    </div>
    <div class="project-grid" id="projectGrid">
      <!-- filled by JS -->
    </div>
  </div>
</section>
''')

# ── Project Detail Modal ──
parts.append('''
<div class="modal-overlay" id="modalOverlay">
  <div class="modal" id="projectModal">
    <button class="modal-close" id="modalClose">✕</button>
    <div class="modal-thumb" id="modalThumb">🚀</div>
    <h2 id="modalTitle">项目名称</h2>
    <div class="modal-meta" id="modalMeta"></div>
    <p class="modal-desc" id="modalDesc"></p>
    <div class="modal-tech-stack" id="modalTech"></div>
    <div class="modal-links" id="modalLinks"></div>
  </div>
</div>
''')

print("workspace section done")

# ── Tutorials ──
parts.append('''
<section id="tutorials" style="background:#fff;">
  <div class="container">
    <div class="section-label">Tutorials</div>
    <h2 class="section-title">AI 技术教程</h2>
    <p class="section-desc">从入门到进阶，涵盖 LLM 应用开发、RAG 实战、Agent 构建等热门方向。</p>
    <div class="tutorials-grid" id="tutorialGrid">
      <!-- filled by JS -->
    </div>
  </div>
</section>
''')

# ── Learning Path ──
parts.append('''
<section id="learning-path">
  <div class="container">
    <div class="section-label">Roadmap</div>
    <h2 class="section-title">学习路线</h2>
    <p class="section-desc" style="margin-bottom:48px;">一条从零基础到 AI 全栈工程师的系统学习路径。</p>
    <div class="learning-path" id="learningPath">
      <!-- filled by JS -->
    </div>
  </div>
</section>
''')

# ── Wiki ──
parts.append('''
<section id="wiki" style="background:#fff;">
  <div class="container">
    <div class="section-label">Wiki</div>
    <h2 class="section-title">知识笔记</h2>
    <p class="section-desc">日常积累的技术笔记、踩坑记录与实用速查。</p>
    <div class="wiki-header">
      <div class="wiki-categories" id="wikiCategories">
        <button class="active" data-cat="all">全部</button>
        <button data-cat="dev">开发</button>
        <button data-cat="ai">AI</button>
        <button data-cat="ops">运维</button>
        <button data-cat="tool">工具</button>
      </div>
    </div>
    <div class="wiki-grid" id="wikiGrid">
      <!-- filled by JS -->
    </div>
  </div>
</section>
''')

# ── Footer ──
parts.append('''
<footer>
  <div class="container">
    &copy; 2026 Codex Blog. Built with ❤️
  </div>
</footer>
''')

# ── JS data ──
parts.append('''
<script>
const projects = [
  { id:1, cat:'ai', icon:'🤖', title:'AI 智能客服平台', desc:'基于 RAG 架构构建的企业级智能客服系统，支持多轮对话、知识库检索、上下文记忆。', tags:['LLM','RAG','FastAPI','React'], color:'#e0e7ff',
    demoUrl:'https://demo.example.com/ai-cs', docUrl:'https://docs.example.com/ai-cs',  githubUrl:'https://github.com/codex/ai-cs', giteeUrl:'https://gitee.com/codex/ai-cs', tech:'Python · FastAPI · LangChain · ChromaDB · React · WebSocket',
    fullDesc:'采用 RAG (Retrieval-Augmented Generation) 架构，结合企业知识库实现精准问答。支持文档上传自动分块、向量检索、多轮对话上下文管理、人工坐席切换等功能。日均处理 10万+ 查询，准确率 92%。' },
  { id:2, cat:'web', icon:'📊', title:'低代码数据平台', desc:'可视化拖拽式数据分析平台，支持多数据源接入、图表配置、仪表盘分享。', tags:['Vue','D3.js','Node.js','MySQL'], color:'#e0f2e6',
    demoUrl:'https://demo.example.com/lowcode', docUrl:'https://docs.example.com/lowcode',  githubUrl:'https://github.com/codex/lowcode-platform', tech:'Vue 3 · D3.js · Node.js · Express · MySQL · Redis',
    fullDesc:'从零搭建的低代码数据分析平台，提供 30+ 图表组件、自定义 SQL 查询面板、数据看板分享协作功能。支持 MySQL/PostgreSQL/CSV 等多数据源接入，一键导出 PDF/图片。' },
  { id:3, cat:'tool', icon:'⚡', title:'CLI 脚手架工具', desc:'快速生成项目的 CLI 工具，支持模板管理、插件扩展、自动代码生成。', tags:['Go','Cobra','Viper','Docker'], color:'#fef3e2',
    demoUrl:'https://www.npmjs.com/package/xxx', docUrl:'https://github.com/xxx/cli',  githubUrl:'https://github.com/codex/cli-scaffold', giteeUrl:'https://gitee.com/codex/cli-scaffold', tech:'Go · Cobra · Viper · Docker · GitHub Actions',
    fullDesc:'使用 Go 语言开发的 CLI 脚手架，支持多种项目模板的快速初始化。集成插件系统，支持自定义模板源。提供代码生成器、Docker 开发环境一键配置、CI/CD 流水线集成。' },
  { id:4, cat:'ai', icon:'🧠', title:'LLM 对话编排引擎', desc:'可视化编排 LLM 调用流程的工具，支持 Prompt 模板、多模型切换、日志追踪。', tags:['Python','LangChain','React Flow','FastAPI'], color:'#e8e0ff',
    demoUrl:'https://demo.example.com/llm-orch', docUrl:'https://docs.example.com/llm-orch',  githubUrl:'https://github.com/codex/llm-orch', tech:'Python · LangChain · React Flow · FastAPI · PostgreSQL',
    fullDesc:'可视化的 LLM 对话编排平台，通过拖拽方式构建复杂的多轮对话流程。支持 Prompt 版本管理、A/B 测试、模型切换（GPT-4/Claude/开源模型）、对话日志分析与成本追踪。' },
  { id:5, cat:'web', icon:'🎨', title:'设计系统组件库', desc:'企业级 UI 组件库，包含 50+ 高质量组件，支持主题定制与无障碍访问。', tags:['React','TypeScript','Storybook','Rollup'], color:'#ffe0ec',
    demoUrl:'https://storybook.example.com', docUrl:'https://github.com/xxx/ui-kit',  githubUrl:'https://github.com/codex/ui-kit', tech:'React · TypeScript · Storybook · Rollup · Testing Library',
    fullDesc:'企业级 React UI 组件库，遵循 WAI-ARIA 无障碍标准。50+ 组件覆盖表单、导航、数据展示等场景。支持全局主题定制、按需加载、单元测试覆盖率 95%+。' },
  { id:6, cat:'ai', icon:'🔗', title:'Agent 协作框架', desc:'多 Agent 协作框架，支持任务分解、工具调用、记忆管理与人类反馈。', tags:['Python','Agent','OpenAI','Redis'], color:'#d5f5e3',
    demoUrl:'https://demo.example.com/agents', docUrl:'https://docs.example.com/agents',  githubUrl:'https://github.com/codex/agent-framework', giteeUrl:'https://gitee.com/codex/agent-framework', tech:'Python · OpenAI API · Redis · Docker · FastAPI',
    fullDesc:'构建于 AutoGen/CrewAI 理念之上的多 Agent 协作框架。支持 Agent 角色定义、动态任务分解、工具注册与调用、短期/长期记忆管理、人工审核介入。适用于复杂工作流自动化。' },
];

const tutorials = [
  { icon:'🌱', iconBg:'#e8f5e9', title:'Prompt Engineering 入门', desc:'学习如何设计高质量的 Prompt，掌握 Few-shot、Chain-of-Thought 等核心技巧。', level:'beginner', levelText:'入门' },
  { icon:'📚', iconBg:'#e3f2fd', title:'RAG 从零到部署', desc:'从文档加载、分块、向量化到检索生成的完整 RAG 流水线实战。', level:'intermediate', levelText:'进阶' },
  { icon:'🤖', iconBg:'#f3e5f5', title:'LangChain 实战指南', desc:'深入 LangChain 的核心概念：Chain、Agent、Memory、Tool 的工程化使用。', level:'intermediate', levelText:'进阶' },
  { icon:'⚙️', iconBg:'#fff3e0', title:'构建 AI Agent', desc:'从单 Agent 到多 Agent 协作，掌握工具调用与自主决策体系建设。', level:'advanced', levelText:'高级' },
  { icon:'🔍', iconBg:'#e0f2fe', title:'向量数据库选型与优化', desc:'对比 Chroma、Pinecone、Weaviate、Milvus，掌握索引策略与检索优化。', level:'advanced', levelText:'高级' },
  { icon:'📈', iconBg:'#fce4ec', title:'LLM 应用性能调优', desc:'延迟优化、成本控制、缓存策略、监控追踪，打造生产级 LLM 应用。', level:'advanced', levelText:'高级' },
];

const wikiEntries = [
  { cat:'dev', icon:'📝', title:'React Hooks 常用模式总结', desc:'useEffect、useCallback、useMemo 的最佳实践与常见陷阱，附实际项目中的代码示例。', tags:['React','Hooks','TypeScript'], date:'2026-06-10',
    content:'## useCallback vs useMemo\\\n\\\n- **useCallback(fn, deps)** 返回 memoized 回调\\\n- **useMemo(() => value, deps)** 返回 memoized 值\\\n\\\n原则: 只在传给子组件或作为 effect 依赖时才用，不要过早优化。' },
  { cat:'dev', icon:'📝', title:'CSS Grid 布局实战备忘', desc:'Grid 布局的核心概念与常见布局模式：圣杯布局、瀑布流、响应式网格。', tags:['CSS','Grid','Layout'], date:'2026-06-08',
    content:'## 基础模板\\\n\\\n```css\\\n.container {\\\n  display: grid;\\\n  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));\\\n  gap: 24px;\\\n}\\\n```' },
  { cat:'ai', icon:'🤖', title:'Prompt Engineering 技巧合集', desc:'Few-shot、Chain-of-Thought、ReAct 等提示工程技巧的实际应用场景与对比。', tags:['LLM','Prompt','GPT'], date:'2026-06-05',
    content:'## Few-shot Prompting\\\n\\\n给模型提供几个输入输出示例，引导它按照模式回答。适用于分类、格式化等任务。' },
  { cat:'ai', icon:'🧠', title:'RAG 检索优化笔记', desc:'关于分块策略、向量化模型选型、混合检索、重排序等 RAG 优化方向的实践记录。', tags:['RAG','Vector DB','Embedding'], date:'2026-06-03',
    content:'## 分块策略\\\n\\\n1. **固定大小** — 简单但可能截断语义\\\n2. **语义分块** — 按句子/段落边界分割，效果更好\\\n3. **递归分块** — LangChain 默认方式' },
  { cat:'ops', icon:'⚙️', title:'Docker 生产环境最佳实践', desc:'多阶段构建、镜像瘦身、安全扫描、健康检查与容器编排的配置心得。', tags:['Docker','K8s','DevOps'], date:'2026-05-28',
    content:'## 多阶段构建\\\n\\\n```dockerfile\\\nFROM node:20-alpine AS builder\\\nWORKDIR /app\\\nCOPY package*.json ./\\\nRUN npm ci --only=production\\\n\\\nFROM node:20-alpine\\\nCOPY --from=builder /app /app\\\nCMD [\"node\", \"server.js\"]\\\n```' },
  { cat:'tool', icon:'🔧', title:'Vim 高效操作备忘录', desc:'日常开发中最实用的 Vim 操作：批量编辑、多光标、宏录制与配置项。', tags:['Vim','Editor','Productivity'], date:'2026-05-25',
    content:'## 批量编辑\\\n\\\n- `ciw` — 删除当前词并进入插入模式\\\n- `:%s/old/new/g` — 全局替换\\\n- `V` 选中行后 `j`/`k` 多选，按 `:` 批量操作' },
  { cat:'dev', icon:'📝', title:'Python 类型注解进阶指南', desc:'Typing 模块高级用法：泛型、Protocol、TypedDict、Literal 等类型系统特性。', tags:['Python','Typing','Static Analysis'], date:'2026-05-20',
    content:'## TypedDict\\\n\\\n```python\\\nfrom typing import TypedDict\\\n\\\nclass User(TypedDict):\\\n    id: int\\\n    name: str\\\n    email: str\\\n```' },
  { cat:'ai', icon:'🔗', title:'Function Calling 实现细节', desc:'OpenAI Function Calling 的参数声明规范、工具调度逻辑与错误处理模式。', tags:['OpenAI','Function Calling','Agent'], date:'2026-05-18',
    content:'## 参数声明\\\n\\\n描述要清晰但不要过度约束。`required` 字段只放真正必需的参数，其余保持可选。' },
  { cat:'ops', icon:'☁️', title:'AWS 成本控制实用技巧', desc:'利用预算告警、预留实例、Spot 实例和自动缩放策略来优化云成本。', tags:['AWS','Cost','Cloud'], date:'2026-05-15',
    content:'## 关键策略\\\n\\\n1. 设置 Budget 告警（50%/80%/90%）\\\n2. 无状态工作负载用 Spot 实例\\\n3. S3 生命周期策略自动归档/删除' },
  { cat:'tool', icon:'🎨', title:'Git 高级操作速查', desc:'交互式 Rebase、Bisect 调试、Cherry-pick、Submodule 等 Git 进阶命令。', tags:['Git','Version Control'], date:'2026-05-12',
    content:'## Interactive Rebase\\\n\\\n```bash\\\ngit rebase -i HEAD~5\\\n# pick / squash / reword / edit / drop\\\n```' },
];

const pathSteps = [
  { label:'Step 1', title:'编程基础', desc:'掌握 Python 或 TypeScript 基础语法与编程思维，了解 HTTP 协议与 RESTful API 设计。', techs:['Python','TypeScript','Git','HTTP'], completed:true },
  { label:'Step 2', title:'Web 开发基础', desc:'学习前后端开发基础，能独立搭建完整的 CRUD 应用，掌握数据库设计与部署。', techs:['React/Vue','Node.js','SQL','Docker'], completed:true },
  { label:'Step 3', title:'AI 基础与 NLP', desc:'了解机器学习基础概念、自然语言处理基础，熟悉 Transformer 架构原理。', techs:['ML Basics','NLP','Transformers','HuggingFace'], completed:true },
  { label:'Step 4', title:'LLM 应用开发', desc:'掌握 Prompt Engineering、RAG 架构、LangChain 框架，能构建简单的 AI 应用。', techs:['Prompt','RAG','LangChain','OpenAI API'], completed:false },
  { label:'Step 5', title:'Agent 与工具链', desc:'深入 Agent 架构，掌握工具调用、多 Agent 协作、记忆管理，构建复杂 AI 工作流。', techs:['Agent','CrewAI','Function Calling','MCP'], completed:false },
  { label:'Step 6', title:'生产化与架构', desc:'掌握 LLM 应用的监控、评估、安全与成本优化，设计可扩展的 AI 系统架构。', techs:['Monitoring','Evaluation','Security','Architecture'], completed:false },
];

''')
print("data done")

# ── JS rendering ──
parts.append('''
// Render project cards
const grid = document.getElementById('projectGrid');
function renderProjects(filter = 'all') {
  const filtered = filter === 'all' ? projects : projects.filter(p => p.cat === filter);
  grid.innerHTML = filtered.map(p => {
    let badge = '';
    if (p.githubUrl || p.giteeUrl) {
      const items = [];
      if (p.githubUrl) items.push(`<a href="${p.githubUrl}" target="_blank" onclick="event.stopPropagation()" title="GitHub 仓库">⌨️</a>`);
      if (p.giteeUrl) items.push(`<a href="${p.giteeUrl}" target="_blank" onclick="event.stopPropagation()" title="Gitee 仓库">🟠</a>`);
      badge = `<div class="repo-badge">${items.join('')}</div>`;
    }
    return `
    <div class="project-card" data-id="${p.id}" onclick="openModal(${p.id})">
      <div class="project-thumb" style="background:${p.color}">${p.icon}${badge}</div>
      <div class="project-body">
        <span class="tag">${p.cat === 'ai' ? 'AI / LLM' : p.cat === 'web' ? 'Web 应用' : '开发工具'}</span>
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <div class="project-tech">${p.tags.map(t => '<span>'+t+'</span>').join('')}</div>
      </div>
    </div>
  `;
  }).join('');
}

// Filter buttons
document.querySelectorAll('.workspace-filters button').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.workspace-filters button').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    renderProjects(this.dataset.filter);
  });
});

// Modal
function openModal(id) {
  const p = projects.find(x => x.id === id);
  if (!p) return;
  document.getElementById('modalTitle').textContent = p.title;
  document.getElementById('modalThumb').textContent = p.icon;
  document.getElementById('modalThumb').style.background = p.color;
  document.getElementById('modalDesc').textContent = p.fullDesc;
  document.getElementById('modalTech').innerHTML = p.tech.split(' · ').map(t => '<span>'+t+'</span>').join('');
  document.getElementById('modalMeta').innerHTML = `
    <span>🔧 ${p.tags.join(' · ')}</span>
  `;
  let linksHtml = '';
  if (p.demoUrl) linksHtml += '<a href="' + p.demoUrl + '" target="_blank" class="btn btn-primary">🔗 在线演示</a>';
  if (p.docUrl) linksHtml += '<a href="' + p.docUrl + '" target="_blank" class="btn btn-outline">📄 项目文档</a>';
  if (p.githubUrl) linksHtml += '<a href="' + p.githubUrl + '" target="_blank" class="btn btn-outline btn-repo-github">⌨️ GitHub 源码</a>';
  if (p.giteeUrl) linksHtml += '<a href="' + p.giteeUrl + '" target="_blank" class="btn btn-outline btn-repo-gitee">🟠 Gitee 仓库</a>';
  document.getElementById('modalLinks').innerHTML = linksHtml;
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// Render tutorials
const tutGrid = document.getElementById('tutorialGrid');
tutGrid.innerHTML = tutorials.map(t => `
  <div class="tutorial-card">
    <div class="icon" style="background:${t.iconBg}">${t.icon}</div>
    <h3>${t.title}</h3>
    <p>${t.desc}</p>
    <span class="difficulty ${t.level}">${t.levelText}</span>
  </div>
`).join('');

// Wiki category filter
document.querySelectorAll('.wiki-categories button').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.wiki-categories button').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    renderWiki(this.dataset.cat);
  });
});

// Render wiki entries
const wikiGrid = document.getElementById('wikiGrid');
function renderWiki(filter = 'all') {
  const filtered = filter === 'all' ? wikiEntries : wikiEntries.filter(w => w.cat === filter);
  wikiGrid.innerHTML = filtered.map((w, i) => {
    const idx = wikiEntries.indexOf(w);
    return `
    <div class="wiki-card" onclick="openWikiModal(${idx})">
      <span class="wiki-date">${w.date}</span>
      <span class="wiki-cat">${w.cat === 'dev' ? '开发' : w.cat === 'ai' ? 'AI' : w.cat === 'ops' ? '运维' : '工具'}</span>
      <h3>${w.title}</h3>
      <p>${w.desc}</p>
      <div class="wiki-tags">${w.tags.map(t => '<span>'+t+'</span>').join('')}</div>
    </div>
  `;
  }).join('');
}


function openWikiModal(idx) {
  const w = wikiEntries[idx];
  if (!w) return;
  document.getElementById('modalTitle').textContent = w.title;
  document.getElementById('modalThumb').textContent = w.icon;
  const catColors = {dev:'#e0e7ff', ai:'#f3e5f5', ops:'#e0f2e6', tool:'#fff3e0'};
  document.getElementById('modalThumb').style.background = catColors[w.cat] || '#e0e7ff';
  document.getElementById('modalDesc').innerHTML = w.content.replace(/\\n/g, '<br>');
  document.getElementById('modalTech').innerHTML = w.tags.map(t => '<span>'+t+'</span>').join('');
  const catNames = {dev:'开发', ai:'AI', ops:'运维', tool:'工具'};
  document.getElementById('modalMeta').innerHTML = '<span>📅 ' + w.date + '</span><span>🔖 ' + (catNames[w.cat] || w.cat) + '</span>';
  document.getElementById('modalLinks').innerHTML = '';
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

// Render learning path
const pathEl = document.getElementById('learningPath');
pathEl.innerHTML = pathSteps.map((s, i) => `
  <div class="path-step${s.completed ? ' completed' : ''}">
    <div class="dot"></div>
    <div class="step-label">${s.label}</div>
    <h4>${s.title}</h4>
    <p>${s.desc}</p>
    <div class="step-tech">${s.techs.map(t => '<span>'+t+'</span>').join('')}</div>
  </div>
`).join('');

// Scroll nav highlight
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav ul li a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

renderProjects();
</script>
</body>
</html>''')

# ── Write everything ──
with open(OUT, 'w') as f:
    f.write(''.join(parts))

print("full HTML written successfully!")
