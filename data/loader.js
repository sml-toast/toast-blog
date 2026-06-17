/**
 * 数据加载层 — localStorage 优先，静态文件做默认值
 * 前台通过此模块读取数据，后台通过此模块读写数据
 */

// ── Environment ──
const ENV_KEY = 'toast_blog_env';
const STORAGE_PREFIX = 'toast_blog_data_';

function getEnv() {
  return localStorage.getItem(ENV_KEY) || 'prod';
}

export function setEnv(env) {
  localStorage.setItem(ENV_KEY, env);
  // Reload data for new environment
  _data = null;
  return initData();
}

export function getCurrentEnv() {
  return getEnv();
}

function getStorageKey() {
  return STORAGE_PREFIX + getEnv();
}

// 默认数据结构（与静态文件一致）
let _defaultData = null;
let _data = null;

export async function initData() {
  if (_data) return _data;

  // 加载静态数据作为默认值
  const [projects, tutorials, wiki, pathSteps] = await Promise.all([
    import('./projects.js').then(m => m.projects),
    import('./tutorials.js').then(m => m.tutorials),
    import('./wiki.js').then(m => m.wikiEntries),
    import('./path.js').then(m => m.pathSteps),
  ]);

  _defaultData = { projects, tutorials, wiki, pathSteps };

  // 尝试从 localStorage 读取
  const saved = localStorage.getItem(getStorageKey());
  if (saved) {
    try {
      _data = JSON.parse(saved);
      return _data;
    } catch (e) {
      console.warn('localStorage 数据解析失败，使用默认值');
    }
  }

  _data = JSON.parse(JSON.stringify(_defaultData));
  return _data;
}

export function getData() {
  if (!_data) return _defaultData || { projects: [], tutorials: [], wiki: [], pathSteps: [] };
  return _data;
}

export function saveData(data) {
  _data = data;
  if (_data) {
    localStorage.setItem(getStorageKey(), JSON.stringify(_data));
  }
  // 触发自定义事件通知前台更新
  window.dispatchEvent(new CustomEvent('toast:data-changed', { detail: _data }));
  return true;
}

export function resetToDefaults() {
  localStorage.removeItem(getStorageKey());
  _data = _defaultData ? JSON.parse(JSON.stringify(_defaultData)) : null;
  window.dispatchEvent(new CustomEvent('toast:data-changed', { detail: _data }));
  return _data;
}

export function exportJSON() {
  const d = getData();
  const blob = new Blob([JSON.stringify(d, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `toast-blog-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const d = JSON.parse(e.target.result);
        if (d.projects && d.tutorials && d.wiki && d.pathSteps) {
          saveData(d);
          resolve(d);
        } else {
          reject(new Error('数据格式不正确，缺少 projects/tutorials/wiki/pathSteps'));
        }
      } catch (err) {
        reject(new Error('JSON 解析失败：' + err.message));
      }
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsText(file);
  });
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
