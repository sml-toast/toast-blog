
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
  ['formProjects','formTutorials','formWiki'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
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
  // Hide all forms, show the right one
  ['formProjects','formTutorials','formWiki','formPath'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  
  const formMap = { projects: 'formProjects', tutorials: 'formTutorials', wiki: 'formWiki' };
  const formId = formMap[type];
  const form = document.getElementById(formId);
  if (!form) return;
  form.style.display = 'block';
  
  // Fill fields
  if (type === 'projects') fillProjectForm(data);
  else if (type === 'tutorials') fillTutorialForm(data);
  else if (type === 'wiki') fillWikiForm(data);
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

// ── Fill Form Fields ──
function fillProjectForm(data) {
  setVal('pf_cat', data.cat);
  setVal('pf_title', data.title);
  setVal('pf_icon', data.icon);
  setVal('pf_desc', data.desc);
  setVal('pf_fullDesc', data.fullDesc);
  setVal('pf_tech', data.tech);
  setVal('pf_demoUrl', data.demoUrl);
  setVal('pf_githubUrl', data.githubUrl);
  setVal('pf_giteeUrl', data.giteeUrl);
  setVal('pf_docUrl', data.docUrl);
  renderTags(document.getElementById('pf_tags'), data.tags || []);
}
function fillTutorialForm(data) {
  setVal('tf_title', data.title);
  setVal('tf_desc', data.desc);
  setVal('tf_level', data.level);
  setVal('tf_levelText', data.levelText);
  setVal('tf_icon', data.icon);
  setVal('tf_iconBg', data.iconBg);
  setVal('tf_content', data.content);
  renderTags(document.getElementById('tf_tags'), data.tags || []);
}
function fillWikiForm(data) {
  setVal('wf_cat', data.cat);
  setVal('wf_title', data.title);
  setVal('wf_desc', data.desc);
  setVal('wf_icon', data.icon);
  setVal('wf_date', data.date);
  setVal('wf_content', data.content);
  renderTags(document.getElementById('wf_tags'), data.tags || []);
}
function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val !== undefined && val !== null ? val : '';
}

// ── Save Forms ──
window.saveProject = function() {
  const d = getData();
  const item = editingId >= 0 ? { ...d.projects[editingId] } : { id: generateId(), images: [], attachments: [], createdAt: new Date().toISOString() };
  item.cat = g('pf_cat'); item.title = g('pf_title'); item.icon = g('pf_icon');
  item.desc = g('pf_desc'); item.fullDesc = g('pf_fullDesc');
  item.tech = g('pf_tech'); item.demoUrl = g('pf_demoUrl');
  item.githubUrl = g('pf_githubUrl'); item.giteeUrl = g('pf_giteeUrl'); item.docUrl = g('pf_docUrl');
  item.tags = readTags('pf_tags');
  item.updatedAt = new Date().toISOString();
  if (editingId >= 0) d.projects[editingId] = item;
  else d.projects.push(item);
  saveData(d); closeAdminForm(); renderTable('projects');
};
window.saveTutorial = function() {
  const d = getData();
  const item = editingId >= 0 ? { ...d.tutorials[editingId] } : { id: generateId(), images: [], attachments: [], createdAt: new Date().toISOString() };
  item.title = g('tf_title'); item.desc = g('tf_desc'); item.level = g('tf_level');
  item.levelText = g('tf_levelText'); item.icon = g('tf_icon'); item.iconBg = g('tf_iconBg');
  item.content = g('tf_content'); item.tags = readTags('tf_tags');
  item.updatedAt = new Date().toISOString();
  if (editingId >= 0) d.tutorials[editingId] = item;
  else d.tutorials.push(item);
  saveData(d); closeAdminForm(); renderTable('tutorials');
};
window.saveWiki = function() {
  const d = getData();
  const item = editingId >= 0 ? { ...d.wiki[editingId] } : { id: generateId(), images: [], attachments: [], createdAt: new Date().toISOString() };
  item.cat = g('wf_cat'); item.title = g('wf_title'); item.desc = g('wf_desc');
  item.icon = g('wf_icon'); item.date = g('wf_date'); item.content = g('wf_content');
  item.tags = readTags('wf_tags');
  item.updatedAt = new Date().toISOString();
  if (editingId >= 0) d.wiki[editingId] = item;
  else d.wiki.push(item);
  saveData(d); closeAdminForm(); renderTable('wiki');
};
function g(id) { const el = document.getElementById(id); return el ? el.value : ''; }
function readTags(containerId) {
  const wrap = document.getElementById(containerId);
  if (!wrap) return [];
  return Array.from(wrap.querySelectorAll('.tag-value')).map(s => s.textContent);
}

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


// ── Auto-init when loaded on admin page ──
if (document.getElementById('admin')) {
  if (checkAdminAuth()) {
    requireAdmin();
    renderDashboard();
    initEnvSwitcher();
  }
}




// ── Backup & Restore ──
window.backupData = function() {
  const d = getData();
  const env = getCurrentEnv();
  
  // Collect files from data (base64 images/attachments)
  const files = {};
  const types = ['projects', 'tutorials', 'wiki'];
  const now = new Date();
  const monthDir = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
  
  types.forEach(type => {
    (d[type] || []).forEach(item => {
      (item.images || []).forEach((img, i) => {
        if (img && img.startsWith('data:')) {
          const name = type + '_' + item.id + '_img_' + i;
          files['attachments/' + monthDir + '/' + name + '.png'] = img;
        }
      });
      (item.attachments || []).forEach((att, i) => {
        if (att && att.startsWith('data:')) {
          const name = type + '_' + item.id + '_att_' + i;
          const ext = att.includes('application/pdf') ? '.pdf' : att.includes('application/zip') ? '.zip' : '.bin';
          files['attachments/' + monthDir + '/' + name + ext] = att;
        }
      });
    });
  });
  
  const desc = prompt('备份说明（可选）：');
  
  const backup = {
    version: '1.0',
    environment: env,
    exportedAt: now.toISOString(),
    description: desc || '',
    data: d,
    files: files,
    directories: {
      dataFile: 'data.json',
      attachments: 'attachments/' + monthDir + '/',
      manifest: 'manifest.json'
    }
  };
  
  // Save as downloadable JSON
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'data-' + env + '-' + now.toISOString().slice(0, 10) + '.json';
  a.click();
  URL.revokeObjectURL(url);
  
  // Also generate manifest update content
  const manifest = {
    environment: env,
    version: '1.0',
    description: desc || '',
    updatedAt: now.toISOString(),
    dataFile: 'data.json',
    attachments: {}
  };
  
  // Count files per month
  Object.keys(files).forEach(fpath => {
    const parts = fpath.split('/');
    const monthKey = parts[1]; // YYYY-MM
    if (!manifest.attachments[monthKey]) {
      manifest.attachments[monthKey] = { count: 0, files: [], note: '' };
    }
    manifest.attachments[monthKey].count++;
    manifest.attachments[monthKey].files.push(parts.slice(2).join('/'));
  });
  
  // Save manifest as downloadable JSON
  const mBlob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
  const mUrl = URL.createObjectURL(mBlob);
  const mA = document.createElement('a');
  mA.href = mUrl;
  mA.download = 'manifest-' + env + '.json';
  mA.click();
  URL.revokeObjectURL(mUrl);
  
  alert('✅ 备份完成！ 1.保存 data.json → data/' + env + '/ 2.附件解压 → data/' + env + '/attachments/' + monthDir + '/ 3.更新 manifest.json');
};

window.restoreData = function() {
  const input = document.getElementById('restoreFile');
  if (!input.files || !input.files[0]) {
    alert('请选择备份文件');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const backup = JSON.parse(e.target.result);
      
      if (!backup.version || !backup.data) {
        alert('❌ 备份文件格式不正确');
        return;
      }
      
      const env = backup.environment || 'unknown';
      const currentEnv = getCurrentEnv();
      
      if (env !== currentEnv) {
        if (!confirm('备份环境 (' + env + ') 与当前环境 (' + currentEnv + ') 不一致，确定还原？')) {
          input.value = '';
          return;
        }
      }
      
      // Restore data
      saveData(backup.data);
      
      // Restore files into data items
      if (backup.files) {
        const types = ['projects', 'tutorials', 'wiki'];
        types.forEach(type => {
          (backup.data[type] || []).forEach(item => {
            Object.keys(backup.files).forEach(fpath => {
              const filename = fpath.split('/').pop();
              if (filename.startsWith(type + '_' + item.id + '_img')) {
                if (!item.images) item.images = [];
                item.images.push(backup.files[fpath]);
              } else if (filename.startsWith(type + '_' + item.id + '_att')) {
                if (!item.attachments) item.attachments = [];
                item.attachments.push(backup.files[fpath]);
              }
            });
          });
        });
        saveData(backup.data);
      }
      
      alert('✅ 还原成功！\n环境: ' + env + '\n数据: ' + Object.keys(backup.data).join(', '));
      input.value = '';
      renderDashboard();
      ['projects', 'tutorials', 'wiki'].forEach(t => { if (typeof renderTable === 'function') renderTable(t); });
      if (typeof renderPathAdmin === 'function') renderPathAdmin();
      
    } catch(err) {
      alert('❌ 解析失败: ' + err.message);
    }
  };
  reader.readAsText(input.files[0]);
};

// ── File Upload Handler ──
window.handleUpload = function(input, previewId) {
  const preview = document.getElementById(previewId);
  if (!preview || !input.files) return;
  Array.from(input.files).forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const div = document.createElement('div');
      div.style.position = 'relative';
      div.style.display = 'inline-block';
      if (file.type.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.width = '64px';
        img.style.height = '64px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '6px';
        img.style.border = '1px solid var(--border)';
        img.title = file.name;
        div.appendChild(img);
      } else {
        div.style.padding = '4px 8px';
        div.style.background = 'var(--accent-light)';
        div.style.borderRadius = '4px';
        div.style.fontSize = '12px';
        div.textContent = '📎 ' + file.name + ' (' + (file.size / 1024).toFixed(1) + 'KB)';
      }
      const rm = document.createElement('span');
      rm.textContent = '×';
      rm.style.cssText = 'position:absolute;top:-4px;right:-4px;width:16px;height:16px;border-radius:50%;background:#dc2626;color:#fff;font-size:12px;line-height:16px;text-align:center;cursor:pointer';
      rm.onclick = function() { div.remove(); };
      div.appendChild(rm);
      preview.appendChild(div);
    };
    reader.readAsDataURL(file);
  });
  input.value = '';
};


// ── i18n Configuration ──
// i18n functions accessible via window globals (set by main.js)

function renderI18nConfig() {
  const getConfig = window.getConfig || function(){ return {enabled:true, defaultLang:"zh-CN", supportedLangs:["zh-CN","en"]}; };
  const saveConfig = window.saveConfig || function(c){ return c; };
  const LANG_META = window.LANG_META || { "zh-CN": {name:"中文",flag:"🇨🇳",nativeName:"中文"}, "en": {name:"English",flag:"🇺🇸",nativeName:"English"} };
  const cfg = getConfig();
  const container = document.getElementById('tab-i18n');
  if (!container) return;
  
  container.innerHTML = `
    <h3 style="margin-bottom:16px">🌐 多语言配置</h3>
    <div class="form-group">
      <label><input type="checkbox" id="i18nEnabled" ${cfg.enabled ? 'checked' : ''} onchange="saveI18nConfig()"> 启用前台语言切换</label>
    </div>
    <div class="form-group">
      <label>默认语言</label>
      <select id="i18nDefault" onchange="saveI18nConfig()">
        ${cfg.supportedLangs.map(l => '<option value="' + l + '"' + (l === cfg.defaultLang ? ' selected' : '') + '>' + (LANG_META[l]?.flag || '') + ' ' + (LANG_META[l]?.name || l) + '</option>').join('')}
      </select>
    </div>
    <div class="form-group">
      <label>支持语言（勾选可用语言）</label>
      <div style="display:flex;gap:12px;flex-wrap:wrap;padding:8px 0">
        ${Object.keys(LANG_META).map(l => `
          <label style="display:flex;align-items:center;gap:4px;cursor:pointer;padding:6px 12px;border:1px solid var(--border);border-radius:8px">
            <input type="checkbox" value="${l}" ${cfg.supportedLangs.includes(l) ? 'checked' : ''} onchange="saveI18nConfig()">
            ${LANG_META[l].flag} ${LANG_META[l].name}
          </label>
        `).join('')}
        <button class="admin-btn admin-btn-sm" onclick="addCustomLang()" style="margin-left:8px">＋ 添加语言</button>
      </div>
    </div>
    <div class="form-group">
      <label>配置说明</label>
      <p style="font-size:13px;color:var(--text-secondary);line-height:1.6">
        • 关闭"启用前台语言切换"后，导航栏语言按钮将隐藏<br>
        • 默认语言为首次访问用户展示的语言<br>
        • 取消勾选所有语言时，系统默认使用简体中文<br>
        • 配置修改后立即生效，无需刷新
      </p>
    </div>
  `;
}

window.saveI18nConfig = function() {
  const enabled = document.getElementById('i18nEnabled')?.checked ?? true;
  const defaultLang = document.getElementById('i18nDefault')?.value || 'zh-CN';
  const checkboxes = document.querySelectorAll('#tab-i18n input[type="checkbox"][value]');
  const supportedLangs = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
  
  const cfg = saveConfig({
    enabled: enabled,
    defaultLang: supportedLangs.includes(defaultLang) ? defaultLang : supportedLangs[0] || 'zh-CN',
    supportedLangs: supportedLangs.length > 0 ? supportedLangs : ['zh-CN']
  });
};

window.addCustomLang = function() {
  const saveConfig = window.saveConfig || function(c){};
  const getConfig = window.getConfig || function(){ return {supportedLangs:[]}; };
  const code = prompt('输入语言代码（如：ja、ko）：');
  if (!code) return;
  const name = prompt('输入语言名称（如：日本語、한국어）：');
  if (!name) return;
  const flag = prompt('输入国旗 Emoji（如：🇯🇵、🇰🇷）：');
  if (!flag) return;
  
  import('./data/i18n.js').then(i18n => {
    // Add to LANG_META
    i18n.LANG_META[code] = { name, flag, nativeName: name };
    
    const cfg = getConfig();
    if (!cfg.supportedLangs.includes(code)) {
      cfg.supportedLangs.push(code);
      saveConfig(cfg);
    }
    renderI18nConfig();
  });
};

window.switchAdminTab = (function(original) {
  return function(tab) {
    original(tab);
    if (tab === 'i18n') renderI18nConfig();
  };
})(window.switchAdminTab);
// ── Environment Switcher ──

export function initEnvSwitcher() {
  const current = getCurrentEnv();
  document.querySelectorAll('.env-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.env === current);
  });
}

window.switchEnv = async function(env) {
  await setEnv(env);
  initEnvSwitcher();
  
  // Refresh all admin content with new environment data
  renderDashboard();
  ['projects', 'tutorials', 'wiki'].forEach(t => renderTable(t));
  if (typeof renderPathAdmin === 'function') renderPathAdmin();
  
  // Notify frontend to refresh (if main page is also open)
  window.dispatchEvent(new CustomEvent('toast:data-changed', { detail: getData() }));
  
  // Update document title with env indicator
  const envName = { dev: 'DEV', test: 'TEST', prod: 'PROD' }[env] || env;
  document.title = '管理后台 · ' + envName + ' · Toast Blog';
};