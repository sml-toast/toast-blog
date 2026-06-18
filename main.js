import { initData, getData } from "./data/loader.js";
import { initI18n, setLang, getLang, t, getLangMeta, onLangChange, getConfig } from "./data/i18n.js";

let projects = [], tutorials = [], wikiEntries = [], pathSteps = [];

// ── Initialize Data ──
(async () => {
  const data = await initData();
  projects = data.projects;
  tutorials = data.tutorials;
  wikiEntries = data.wiki;
  pathSteps = data.pathSteps;
  
  // Render after data is ready
  renderProjects();
  renderWiki();
  renderTutorials();
  renderPath();
  observeContainers();
  // Initialize i18n and UI switchers
  await initI18n();
  buildLangSwitcher();
  buildEnvSwitcher();
  translatePage();
})();

// ── Skeleton Loading ──
function showSkeleton(gridId, count) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const card = document.createElement('div');
    card.className = 'skeleton skeleton-card';
    grid.appendChild(card);
  }
}
function hideSkeleton(gridId) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.querySelectorAll('.skeleton').forEach(el => el.remove());
}

// ── Render Projects ──
showSkeleton("projectGrid", 6);
const grid = document.getElementById("projectGrid");
function renderProjects(filter = "all") {
  const filtered = filter === "all" ? projects : projects.filter(p => p.cat === filter);
  hideSkeleton("projectGrid");
  grid.innerHTML = filtered.map(p => {
    let badge = "";
    if (p.githubUrl || p.giteeUrl) {
      const items = [];
      if (p.githubUrl) items.push(`<a href="${p.githubUrl}" target="_blank" onclick="event.stopPropagation()" title="GitHub">⌨️</a>`);
      if (p.giteeUrl) items.push(`<a href="${p.giteeUrl}" target="_blank" onclick="event.stopPropagation()" title="Gitee">🟠</a>`);
      badge = `<div class="repo-badge">${items.join("")}</div>`;
    }
    return `<div class="project-card" data-id="${p.id}" onclick="openModal(${p.id})">
      <div class="project-thumb">${badge}</div>
      <div class="project-body">
        <span class="tag">${p.cat==='ai'?'AI / LLM':p.cat==='web'?'Web 应用':'开发工具'}</span>
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <div class="project-tech">${p.tags.map(t=>'<span>'+t+'</span>').join('')}</div>
      </div>
    </div>`;
  }).join('');
}

// ── Project Filters ──
document.querySelectorAll('.workspace-filters button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.workspace-filters button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProjects(btn.dataset.filter);
  });
});

// ── Open Modal ──
window.openModal = function(id) {
  const p = projects.find(x => x.id === id);
  if (!p) return;
  document.getElementById('modalTitle').textContent = p.title;
  document.getElementById('modalDesc').textContent = p.fullDesc || p.desc;
  document.getElementById('modalTech').textContent = p.tech;
  document.getElementById('modalMeta').innerHTML = `${p.tags.map(t=>'<span>'+t+'</span>').join('')}`;
  let links = '';
  if (p.demoUrl) links += `<a href="${p.demoUrl}" target="_blank" class="btn btn-sm">🔗 Demo</a>`;
  if (p.githubUrl) links += `<a href="${p.githubUrl}" target="_blank" class="btn btn-sm">⌨️ GitHub</a>`;
  if (p.giteeUrl) links += `<a href="${p.giteeUrl}" target="_blank" class="btn btn-sm">🟠 Gitee</a>`;
  if (p.docUrl) links += `<a href="${p.docUrl}" target="_blank" class="btn btn-sm">📄 文档</a>`;
  document.getElementById('modalLinks').innerHTML = links;
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeModal = function(e) {
  if (e && e.target && e.target.id !== 'modalOverlay') return;
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
};

// ── Render Tutorials ──
function renderTutorials() {
  showSkeleton("tutorialGrid", 6);
  const tutGrid = document.getElementById("tutorialGrid");
  hideSkeleton("tutorialGrid");
  if (!tutGrid) return;
  tutGrid.innerHTML = tutorials.map(t => `
  <div class="tutorial-card">
    <div class="icon" style="background:${t.iconBg}">${t.icon}</div>
    <span class="level level-${t.level}">${t.levelText}</span>
    <h3>${t.title}</h3>
    <p>${t.desc}</p>
  </div>
`).join('');
}

// ── Render Wiki ──
showSkeleton("wikiGrid", 10);
let wikiFilter = 'all';
const wikiGrid = document.getElementById("wikiGrid");
function renderWiki(filter = 'all') {
  wikiFilter = filter;
  const filtered = filter === 'all' ? wikiEntries : wikiEntries.filter(w => w.cat === filter);
  hideSkeleton("wikiGrid");
  wikiGrid.innerHTML = filtered.map(w => `
    <div class="wiki-card" onclick="openWiki('${w.title}')">
      <div class="wiki-icon">${w.icon}</div>
      <div class="wiki-body">
        <h3>${w.title}</h3>
        <p>${w.desc}</p>
        <span class="wiki-date">${w.date}</span>
      </div>
    </div>
  `).join('');
}
document.querySelectorAll('.wiki-categories button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.wiki-categories button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderWiki(btn.dataset.filter);
  });
});

// ── Wiki Modal ──
window.openWiki = function(title) {
  const w = wikiEntries.find(x => x.title === title);
  if (!w) return;
  document.getElementById('modalTitle').textContent = w.title;
  document.getElementById('modalDesc').innerHTML = renderMarkdown(w.content);
  document.getElementById('modalTech').innerHTML = w.tags.map(t => '<span>'+t+'</span>').join('');
  document.getElementById('modalMeta').innerHTML = `<span>${w.cat === 'dev' ? '开发' : w.cat === 'ai' ? 'AI' : w.cat === 'ops' ? '运维' : '工具'}</span><span>${w.date}</span>`;
  document.getElementById('modalLinks').innerHTML = '';
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
};

// ── Markdown Renderer ──
function renderMarkdown(text) {
  if (!text) return '';
  return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="lang-$1">$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/### (.+)/g, '<h3>$1</h3>')
    .replace(/## (.+)/g, '<h2>$1</h2>')
    .replace(/# (.+)/g, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>')
    .replace(/\n\n/g, '<br>');
}

// ── Render Learning Path ──
function renderPath() {
  showSkeleton("learningPath", 6);
  const pathEl = document.getElementById("learningPath");
  hideSkeleton("learningPath");
  if (!pathEl) return;
  pathEl.innerHTML = pathSteps.map((s, i) => `
  <div class="path-step ${s.completed ? 'completed' : ''}">
    <div class="path-marker">${s.completed ? '✓' : (i + 1)}</div>
    <div class="path-content">
      <div class="path-label">${s.label}</div>
      <h3>${s.title}</h3>
      <p>${s.desc}</p>
      <div class="path-techs">${s.techs.map(t => '<span>'+t+'</span>').join('')}</div>
    </div>
  </div>
`).join('');
}

// ── Language Switcher ──
let langSwitcherEl = null;

function buildLangSwitcher() {
  const cfg = getConfig();
  if (!cfg.enabled || cfg.supportedLangs.length <= 1) {
    // Remove existing switcher if disabled
    if (langSwitcherEl) { langSwitcherEl.remove(); langSwitcherEl = null; }
    return;
  }
  
  const nav = document.querySelector('nav');
  if (!nav) return;
  
  // Create or reuse the container
  if (!langSwitcherEl) {
    langSwitcherEl = document.createElement('div');
    langSwitcherEl.className = 'lang-switcher';
    langSwitcherEl.setAttribute('role', 'button');
    langSwitcherEl.setAttribute('tabindex', '0');
    nav.appendChild(langSwitcherEl);
  }
  langSwitcherEl.innerHTML = '';
  
  const current = getLangMeta(getLang());
  const flagSpan = document.createElement('span');
  flagSpan.className = 'lang-flag';
  flagSpan.textContent = current.flag;
  langSwitcherEl.appendChild(flagSpan);
  
  const nameSpan = document.createElement('span');
  nameSpan.className = 'lang-name';
  nameSpan.textContent = current.nativeName;
  langSwitcherEl.appendChild(nameSpan);
  
  // Create/reuse dropdown
  let dropdown = langSwitcherEl.querySelector('.lang-dropdown');
  if (!dropdown) {
    dropdown = document.createElement('div');
    dropdown.className = 'lang-dropdown';
    dropdown.setAttribute('role', 'menu');
    langSwitcherEl.appendChild(dropdown);
  }
  dropdown.innerHTML = '';
  
  cfg.supportedLangs.forEach(l => {
    const meta = getLangMeta(l);
    const item = document.createElement('button');
    item.className = 'lang-dropdown-item' + (l === getLang() ? ' active' : '');
    item.setAttribute('role', 'menuitem');
    item.innerHTML = '<span class="lflag">' + meta.flag + '</span><span>' + meta.nativeName + '</span><span class="lcheck">' + (l === getLang() ? '✓' : '') + '</span>';
    item.onclick = async function() {
      await setLang(l);
      flagSpan.textContent = meta.flag;
      nameSpan.textContent = meta.nativeName;
      dropdown.querySelectorAll('.lang-dropdown-item').forEach(di => {
        di.classList.toggle('active', di === item);
        di.querySelector('.lcheck').textContent = di === item ? '✓' : '';
      });
      dropdown.classList.remove('open');
      translatePage();
      renderProjects();
      renderWiki();
      renderTutorials();
      renderPath();
    };
    dropdown.appendChild(item);
  });
  
  // Attach click handler once
  if (!langSwitcherEl._clickAttached) {
    langSwitcherEl.onclick = function(e) {
      e.stopPropagation();
      const dd = this.querySelector('.lang-dropdown');
      if (dd) dd.classList.toggle('open');
    };
    document.addEventListener('click', function() {
      const dd = document.querySelector('.lang-dropdown');
      if (dd) dd.classList.remove('open');
    });
    langSwitcherEl._clickAttached = true;
  }
}


// ── Build Environment Switcher (frontend) ──
function buildEnvSwitcher() {
  const cfg = getConfig();
  if (!cfg.envEnabled) return;
  
  const nav = document.querySelector('nav');
  if (!nav) return;
  
  let el = nav.querySelector('.env-badge-wrap');
  if (!el) {
    el = document.createElement('div');
    el.className = 'env-badge-wrap';
    el.style.cssText = 'display:flex;align-items:center;margin:0 2px;cursor:pointer;position:relative';
    nav.appendChild(el);
  }
  el.innerHTML = '';
  
  const env = localStorage.getItem('toast_blog_env') || 'prod';
  const envMap = { dev: { label: 'DEV', color: '#2e7d32', bg: '#e8f5e9' },
                   test: { label: 'TEST', color: '#e65100', bg: '#fff3e0' },
                   prod: { label: 'PROD', color: '#1565c0', bg: '#e3f2fd' } };
  const current = envMap[env] || envMap.prod;
  
  el.setAttribute('title', '环境: ' + env.toUpperCase());
  
  const badge = document.createElement('span');
  badge.textContent = current.label;
  badge.style.cssText = 'font-size:10px;font-weight:700;padding:1px 6px;border-radius:3px;background:' + current.bg + ';color:' + current.color;
  el.appendChild(badge);
  
  // Dropdown
  let dd = el.querySelector('.env-dd');
  if (!dd) {
    dd = document.createElement('div');
    dd.className = 'env-dd';
    dd.style.cssText = 'position:absolute;top:100%;right:0;margin-top:4px;background:var(--surface);border:1px solid var(--border);border-radius:6px;box-shadow:0 4px 16px rgba(0,0,0,0.1);display:none;z-index:200;overflow:hidden;min-width:80px';
    el.appendChild(dd);
  }
  dd.innerHTML = '';
  
  Object.keys(envMap).forEach(key => {
    const m = envMap[key];
    const item = document.createElement('button');
    item.style.cssText = 'display:flex;align-items:center;gap:4px;padding:6px 10px;border:none;background:none;width:100%;text-align:left;cursor:pointer;font-size:12px;font-weight:' + (key === env ? '700' : '400') + ';color:var(--text)';
    item.innerHTML = '<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:' + m.color + '"></span> ' + m.label;
    item.onmouseover = function() { this.style.background = 'var(--accent-light)'; };
    item.onmouseout = function() { this.style.background = 'none'; };
    item.onclick = function() {
      localStorage.setItem('toast_blog_env', key);
      badge.textContent = m.label;
      badge.style.background = m.bg;
      badge.style.color = m.color;
      dd.style.display = 'none';
      location.reload();
    };
    dd.appendChild(item);
  });
  
  if (!el._clickAttached) {
    el.onclick = function(e) { e.stopPropagation(); var d = this.querySelector(".env-dd"); if (d) d.style.display = d.style.display === "block" ? "none" : "block"; };
    el._clickAttached = true;
  }
}
// ── Translate Static Page Elements ──
function translatePage() {
  // Translate nav items
  document.querySelectorAll('nav a[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  
  // Translate static text elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (!key) return;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = t(key);
    } else if (el.dataset.i18nHtml) {
      el.innerHTML = t(key);
    } else {
      el.textContent = t(key);
    }
  });
  
  // Translate section labels and titles
  const sectionLabel = document.querySelector('.section-label');
  // These are handled by dynamic rendering
}

// ── Listen for data changes ──
window.addEventListener('toast:data-changed', async (e) => {
  if (e.detail) {
    projects = e.detail.projects || [];
    tutorials = e.detail.tutorials || [];
    wikiEntries = e.detail.wiki || [];
    pathSteps = e.detail.pathSteps || [];
    renderProjects();
    renderWiki();
    renderTutorials();
    renderPath();
  }
});

// ── Theme Toggle ──
const themeBtn = document.createElement('button');
themeBtn.className = 'theme-toggle-btn';
themeBtn.setAttribute('aria-label', '切换主题');
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
themeBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
themeBtn.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  themeBtn.textContent = next === 'dark' ? '☀️' : '🌙';
});
document.body.appendChild(themeBtn);

// ── Entry Animation ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
const observeContainers = () => {
  document.querySelectorAll('.project-grid, .tutorials-grid, .wiki-grid, .learning-path').forEach(c => {
    if (c.children.length) observer.observe(c.children[0]);
  });
};
setTimeout(observeContainers, 100);

// ── Back to Top ──
const backToTop = document.createElement('button');
backToTop.className = 'back-to-top';
backToTop.setAttribute('aria-label', '回到顶部');
backToTop.textContent = '↑';
backToTop.addEventListener('click', () => { window.scrollTo(0, 0); backToTop.classList.remove('visible'); });
document.body.appendChild(backToTop);
window.addEventListener('scroll', () => backToTop.classList.toggle('visible', window.scrollY > 300));

// ── Modal ESC ──
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modal = document.getElementById('modalOverlay');
    if (modal?.classList.contains('open')) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
    const resume = document.getElementById('resumePreviewOverlay');
    if (resume?.classList.contains('open')) {
      resume.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
});

// ── Hamburger Menu ──
const nav = document.querySelector('nav');
const hamburger = document.createElement('button');
hamburger.className = 'hamburger';
hamburger.setAttribute('aria-label', '菜单');
hamburger.innerHTML = '<span></span><span></span><span></span>';
nav.insertBefore(hamburger, nav.querySelector('ul'));
hamburger.addEventListener('click', () => nav.querySelector('ul').classList.toggle('open'));
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.querySelector('ul').classList.remove('open')));

// ── Scroll Spy ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a');
const scrollSpy = () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 150) current = s.getAttribute('id');
  });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
};
window.addEventListener('scroll', scrollSpy);

// ── PWA ──
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}

// ── Expose Globals ──
// ── Resume: Encrypt Toggle ──
window.toggleEncrypt = function(btn) {
  var field = btn.closest('.encrypted-field, .preview-info-item, .preview-edu, .encrypted');
  if (!field) return;
  var val = field.querySelector('.enc-value, .enc-hidden, .pi-value.enc-hidden');
  if (!val) return;
  val.classList.toggle('enc-hidden');
  btn.textContent = val.classList.contains('enc-hidden') ? '🔒' : '🔓';
};

// ── Resume: Preview ──
window.openResumePreview = function() {
  var overlay = document.getElementById('resumePreviewOverlay');
  if (overlay) {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
};

window.closeResumePreview = function() {
  var overlay = document.getElementById('resumePreviewOverlay');
  if (overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
};

// ── Resume: Export PDF ──
window.exportResumePDF = function() {
  var overlay = document.getElementById('resumePreviewOverlay');
  if (overlay && !overlay.classList.contains('open')) {
    overlay.classList.add('open');
  }
  // Suppress browser print header by setting a small delay
  setTimeout(function() {
    window.print();
  }, 100);
};
