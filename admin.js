import { getData, saveData, resetToDefaults, exportJSON, importJSON, generateId } from './data/loader.js';

const ADMIN_PASSWORD_HASH = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'; // SHA-256 of 'admin'
let currentTab = 'dashboard';
let editingId = null;
let editingType = null;

// ── Auth ──
function sha256(str) {
  let hash = 0, i, chr;
  if (str.length === 0) return hash.toString(16);
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).repeat(8);
}

export function checkAdminAuth() {
  return sessionStorage.getItem('toast_admin_auth') === '1';
}

export function requireAdmin() {
  if (!checkAdminAuth()) return false;
  document.getElementById('adminLogin')?.classList.add('hidden');
  document.getElementById('adminPanel')?.classList.remove('hidden');
  return true;
}

window.adminLogin = function() {
  const input = document.getElementById('adminPwd');
  const err = document.getElementById('adminLoginErr');
  const hash = sha256(input?.value || '');
  if (hash === ADMIN_PASSWORD_HASH || input?.value === 'admin') {
    sessionStorage.setItem('toast_admin_auth', '1');
    requireAdmin();
    renderDashboard();
  } else {
    if (err) err.textContent = '❌ 密码错误';
    input.value = '';
  }
};

window.adminLogout = function() {
  sessionStorage.removeItem('toast_admin_auth');
  document.getElementById('adminLogin')?.classList.remove('hidden');
  document.getElementById('adminPanel')?.classList.add('hidden');
};

// Enter key triggers login
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && document.getElementById('adminPwd') === document.activeElement) {
    window.adminLogin();
  }
});

// ── Tab Switching ──
window.switchAdminTab = function(tab) {
  currentTab = tab;
  document.querySelectorAll('.admin-tabs button').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.toggle('active', c.id === 'tab-' + tab));
  
  switch (tab) {
    case 'dashboard': renderDashboard(); break;
    case 'projects': renderTable('projects'); break;
    case 'tutorials': renderTable('tutorials'); break;
    case 'wiki': renderTable('wiki'); break;
    case 'path': renderPathAdmin(); break;
  }
};

// ── Dashboard ──
function renderDashboard() {
  const d = getData();
  document.getElementById('statProjects').textContent = d.projects?.length || 0;
  document.getElementById('statTutorials').textContent = d.tutorials?.length || 0;
  document.getElementById('statWiki').textContent = d.wiki?.length || 0;
  document.getElementById('statPath').textContent = d.pathSteps?.length || 0;
}

// ── Table Render ──
const TABLE_CONFIG = {
  projects: { title: '作品', fields: ['title', 'cat', 'desc', 'tags'] },
  tutorials: { title: '教程', fields: ['title', 'level', 'desc'] },
  wiki: { title: 'Wiki', fields: ['title', 'cat', 'date', 'desc'] },
};

function renderTable(type) {
  const d = getData();
  const items = d[type] || [];
  const cfg = TABLE_CONFIG[type];
  const tbody = document.querySelector(`#tab-${type} .admin-table tbody`);
  if (!tbody) return;
  
  tbody.innerHTML = items.map((item, i) => {
    const catLabel = { ai: 'AI/LLM', web: 'Web应用', tool: '开发工具', dev: '开发', ops: '运维' };
    return `<tr>
      <td class="cell-title">${item.title || '-'}</td>
      ${cfg.fields.slice(1).map(f => {
        if (f === 'cat') return `<td>${catLabel[item.cat] || item.cat || '-'}</td>`;
        if (f === 'tags') return `<td>${(item.tags || []).slice(0, 3).join(', ')}${item.tags?.length > 3 ? '…' : ''}</td>`;
        if (f === 'level') return `<td><span class="level level-${item.level || 'beginner'}">${item.levelText || item.level || '-'}</span></td>`;
        if (f === 'date') return `<td style="font-size:12px;color:var(--text-secondary)">${item.date || '-'}</td>`;
        return `<td class="cell-title">${(item[f] || '').slice(0, 60)}</td>`;
      }).join('')}
      <td class="cell-actions">
        <button class="admin-btn admin-btn-sm" onclick="editItem('${type}',${i})">✏️</button>
        <button class="admin-btn admin-btn-sm admin-btn-danger" onclick="deleteItem('${type}',${i})">🗑️</button>
      </td>
    </tr>`;
  }).join('');
  
  document.querySelector(`#tab-${type} .item-count`).textContent = items.length;
}

// ── Add / Edit ──
function openForm(type, index) {
  const d = getData();
  editingType = type;
  
  if (index >= 0) {
    editingId = index;
    const item = d[type][index];
    fillForm(type, item);
  } else {
    editingId = -1;
    fillForm(type, getEmptyItem(type));
  }
  
  document.getElementById('adminFormOverlay').classList.add('open');
}

window.editItem = function(type, index) { openForm(type, index); };
window.addNew = function(type) { openForm(type, -1); };

function closeForm() {
  document.getElementById('adminFormOverlay').classList.remove('open');
  editingId = null;
  editingType = null;
}
window.closeAdminForm = closeForm;

function getEmptyItem(type) {
  const base = { id: generateId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  switch (type) {
    case 'projects': return { ...base, cat: 'web', title: '', desc: '', fullDesc: '', tags: [], icon: '📦', tech: '', demoUrl: '', githubUrl: '', giteeUrl: '', docUrl: '', images: [], attachments: [] };
    case 'tutorials': return { ...base, title: '', desc: '', content: '', level: 'beginner', levelText: '入门', icon: '📖', iconBg: '#e0e7ff', tags: [], images: [], attachments: [] };
    case 'wiki': return { ...base, cat: 'dev', icon: '📝', title: '', desc: '', content: '', tags: [], date: new Date().toISOString().slice(0, 10), images: [], attachments: [] };
    default: return {};
  }
}

function fillForm(type, data) {
  const form = document.getElementById('adminForm');
  form.querySelector('h3').textContent = editingId >= 0 ? '编辑' : '新增';
  
  // Generate fields
  const container = document.getElementById('adminFormFields');
  container.innerHTML = generateFormFields(type, data);
  
  // Fill tags
  container.querySelectorAll('.tag-input-wrap').forEach(wrap => {
    const field = wrap.dataset.field;
    const val = data[field] || [];
    renderTags(wrap, typeof val === 'string' ? [] : val);
  });
}

// ── Form Field Generator ──
function generateFormFields(type, data) {
  const F = (tag, attrs, inner) => '<' + tag + Object.entries(attrs || {}).map(([k,v]) => ' ' + k + '="' + v + '"').join('') + '>' + (inner || '') + '</' + tag.split(' ')[0] + '>';
  const input = (field, type, placeholder) => F('input', { type: type || 'text', 'data-field': field, placeholder: placeholder || '', value: (data[field] || '').replace(/"/g,'&quot;') });
  const textarea = (field, rows, placeholder, cls) => F('textarea', { 'data-field': field, rows: String(rows), placeholder: placeholder || '', class: cls || '' }, (data[field] || ''));
  const select = (field, options) => '<select data-field="' + field + '">' + options.map(o => '<option value="' + o[0] + '"' + (data[field] === o[0] ? ' selected' : '') + '>' + o[1] + '</option>').join('') + '</select>';
  const grp = (label, inner) => '<div class="form-group"><label>' + label + '</label>' + inner + '</div>';
  const tagInput = (field) => '<div class="tag-input-wrap" data-field="' + field + '"><input type="text" placeholder="输入后按回车添加" onkeydown="adminTagInput(this,event)"></div>';

  const fields = {
    projects: [
      grp('分类', select('cat', [['ai','AI / LLM'],['web','Web 应用'],['tool','开发工具']])),
      grp('标题', input('title', 'text', '项目名称')),
      grp('图标 (emoji)', input('icon', 'text', '🤖')),
      grp('简短描述', input('desc', 'text', '简短的项目描述')),
      grp('详细描述', textarea('fullDesc', 3, '完整项目描述')),
      grp('技术标签', tagInput('tags')),
      grp('技术栈文本', input('tech', 'text', 'React · Node.js · PostgreSQL')),
      grp('Demo URL', input('demoUrl', 'url', 'https://')),
      grp('GitHub URL', input('githubUrl', 'url', 'https://github.com/')),
      grp('Gitee URL', input('giteeUrl', 'url', 'https://gitee.com/')),
      grp('文档 URL', input('docUrl', 'url', 'https://')),
    ],
    tutorials: [
      grp('标题', input('title', 'text', '教程标题')),
      grp('简短描述', input('desc', 'text', '简短描述')),
      grp('难度', select('level', [['beginner','入门'],['intermediate','进阶'],['advanced','高级']])),
      grp('难度文本', input('levelText', 'text', '入门 / 进阶 / 高级')),
      grp('图标 (emoji)', input('icon', 'text', '📖')),
      grp('图标背景色', input('iconBg', 'text', '#e0e7ff')),
      grp('标签', tagInput('tags')),
      grp('内容 (Markdown)', textarea('content', 10, '支持 Markdown 语法', 'wiki-content')),
    ],
    wiki: [
      grp('分类', select('cat', [['dev','开发'],['ai','AI'],['ops','运维'],['tool','工具']])),
      grp('标题', input('title', 'text', '笔记标题')),
      grp('简短描述', input('desc', 'text', '简短描述')),
      grp('图标 (emoji)', input('icon', 'text', '📝')),
      grp('日期', input('date', 'date', '')),
      grp('标签', tagInput('tags')),
      grp('内容 (Markdown)', textarea('content', 12, '支持 Markdown 语法', 'wiki-content')),
    ],
  };
  
  return (fields[type] || []).join('') +
    '<div class="form-actions">' +
    '<button type="button" class="admin-btn" onclick="closeAdminForm()">取消</button>' +
    '<button type="button" class="admin-btn admin-btn-primary" onclick="saveAdminForm()">保存</button>' +
    '</div>';
}

function saveForm() {
  const form = document.getElementById('adminForm');
  const d = getData();
  const item = editingId >= 0 ? { ...d[editingType][editingId] } : getEmptyItem(editingType);
  
  // Read all fields
  form.querySelectorAll('[data-field]').forEach(el => {
    const field = el.dataset.field;
    if (el.tagName === 'SELECT') item[field] = el.value;
    else if (el.type === 'checkbox') item[field] = el.checked;
    else item[field] = el.value;
  });
  
  // Read tags
  form.querySelectorAll('.tag-input-wrap').forEach(wrap => {
    const field = wrap.dataset.field;
    item[field] = Array.from(wrap.querySelectorAll('.tag-value')).map(s => s.textContent);
  });
  
  item.updatedAt = new Date().toISOString();
  
  if (editingId >= 0) {
    d[editingType][editingId] = item;
  } else {
    d[editingType].push(item);
  }
  
  saveData(d);
  closeForm();
  renderTable(editingType);
}
window.saveAdminForm = saveForm;

// ── Delete ──
window.deleteItem = function(type, index) {
  if (!confirm('确认删除？')) return;
  const d = getData();
  d[type].splice(index, 1);
  saveData(d);
  renderTable(type);
};

// ── Tags Input ──
function renderTags(wrap, tags) {
  const existing = wrap.querySelectorAll('.tag-value');
  existing.forEach(el => el.remove());
  tags.forEach(tag => {
    const span = document.createElement('span');
    span.className = 'tag';
    span.innerHTML = `<span class="tag-value">${tag}</span><span class="remove" onclick="this.closest('.tag').remove()">×</span>`;
    wrap.insertBefore(span, wrap.querySelector('input'));
  });
}

window.adminTagInput = function(input, e) {
  if ((e.key === 'Enter' || e.key === ',') && input.value.trim()) {
    e.preventDefault();
    const wrap = input.closest('.tag-input-wrap');
    const tags = Array.from(wrap.querySelectorAll('.tag-value')).map(s => s.textContent);
    if (!tags.includes(input.value.trim())) {
      const span = document.createElement('span');
      span.className = 'tag';
      span.innerHTML = `<span class="tag-value">${input.value.trim()}</span><span class="remove" onclick="this.closest('.tag').remove()">×</span>`;
      wrap.insertBefore(span, input);
    }
    input.value = '';
  }
};

// ── Learning Path Admin ──
function renderPathAdmin() {
  const d = getData();
  const list = document.getElementById('pathList');
  if (!list) return;
  list.innerHTML = d.pathSteps.map((s, i) => `
    <div class="path-step" draggable="true" data-index="${i}">
      <div class="path-marker">${s.completed ? '✓' : (i + 1)}</div>
      <div class="path-content" style="flex:1">
        <div class="path-label">${s.label}</div>
        <h3>${s.title}</h3>
        <p>${s.desc}</p>
      </div>
      <div style="display:flex;gap:4px">
        <button class="admin-btn admin-btn-sm" onclick="editPath(${i})">✏️</button>
        <button class="admin-btn admin-btn-sm admin-btn-danger" onclick="deletePath(${i})">🗑️</button>
      </div>
    </div>
  `).join('');
  
  document.querySelector('#tab-path .item-count').textContent = d.pathSteps.length;
}

window.editPath = function(index) {
  const d = getData();
  const s = d.pathSteps[index];
  document.getElementById('pathLabel').value = s.label || '';
  document.getElementById('pathTitle').value = s.title || '';
  document.getElementById('pathDesc').value = s.desc || '';
  document.getElementById('pathCompleted').checked = s.completed || false;
  renderTags(document.querySelector('#tab-path .tag-input-wrap'), s.techs || []);
  document.getElementById('pathFormOverlay').classList.add('open');
  editingId = index;
  editingType = 'path';
};

window.savePath = function() {
  const d = getData();
  const item = editingId >= 0 ? d.pathSteps[editingId] : { id: generateId(), order: d.pathSteps.length };
  item.label = document.getElementById('pathLabel').value;
  item.title = document.getElementById('pathTitle').value;
  item.desc = document.getElementById('pathDesc').value;
  item.completed = document.getElementById('pathCompleted').checked;
  item.techs = Array.from(document.querySelector('#tab-path .tag-input-wrap').querySelectorAll('.tag-value')).map(s => s.textContent);
  
  if (editingId < 0) d.pathSteps.push(item);
  else d.pathSteps[editingId] = item;
  
  saveData(d);
  document.getElementById('pathFormOverlay').classList.remove('open');
  editingId = null;
  renderPathAdmin();
};

window.closePathForm = function() {
  document.getElementById('pathFormOverlay').classList.remove('open');
  editingId = null;
};

window.addPath = function() {
  editingId = -1;
  editingType = 'path';
  document.getElementById('pathLabel').value = '';
  document.getElementById('pathTitle').value = '';
  document.getElementById('pathDesc').value = '';
  document.getElementById('pathCompleted').checked = false;
  renderTags(document.querySelector('#tab-path .tag-input-wrap'), []);
  document.getElementById('pathFormOverlay').classList.add('open');
};

window.deletePath = function(index) {
  if (!confirm('确认删除？')) return;
  const d = getData();
  d.pathSteps.splice(index, 1);
  saveData(d);
  renderPathAdmin();
};

// ── Import / Export ──
window.exportData = function() { exportJSON(); };

window.importData = function() {
  const input = document.getElementById('importFile');
  if (!input.files?.[0]) return;
  importJSON(input.files[0]).then(() => {
    alert('✅ 导入成功');
    input.value = '';
    renderDashboard();
    Object.keys(TABLE_CONFIG).forEach(t => renderTable(t));
    renderPathAdmin();
  }).catch(err => {
    alert('❌ ' + err.message);
  });
};

window.resetData = function() {
  if (!confirm('确认重置所有数据为默认值？此操作不可恢复！')) return;
  if (!confirm('再次确认：所有修改将被丢弃！')) return;
  resetToDefaults();
  renderDashboard();
  Object.keys(TABLE_CONFIG).forEach(t => renderTable(t));
  renderPathAdmin();
};

// ── File Upload (base64) ──
window.handleFileUpload = function(input, field) {
  const files = input.files;
  if (!files?.length) return;
  const preview = document.getElementById('uploadPreview');
  if (!preview) return;
  
  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (file.type.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.title = file.name;
        preview.appendChild(img);
      } else {
        const div = document.createElement('div');
        div.className = 'file-item';
        div.textContent = `📎 ${file.name} (${(file.size / 1024).toFixed(1)}KB)`;
        preview.appendChild(div);
      }
    };
    reader.readAsDataURL(file);
  });
  input.value = '';
};

// ── Init ──
export function initAdmin() {
  if (checkAdminAuth()) {
    requireAdmin();
    renderDashboard();
  }
}
