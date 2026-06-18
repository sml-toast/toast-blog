/**
 * i18n 多语言引擎 — 使用 window 作为共享状态
 */

const LANG_KEY = 'toast_blog_lang';
const CONFIG_KEY = 'toast_blog_i18n_config';

// 默认配置
window.__i18nState = {
  currentLang: 'zh-CN',
  strings: {},
  loadedLangs: {},
  config: {
    enabled: true,
    envEnabled: true,
    defaultLang: 'zh-CN',
    supportedLangs: ['zh-CN', 'en']
  }
};

export const LANG_META = window.LANG_META = {
  'zh-CN': { name: '中文', flag: '🇨🇳', nativeName: '中文' },
  'en': { name: 'English', flag: '🇺🇸', nativeName: 'English' }
};

function getValue(obj, path) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

async function loadLang(lang) {
  const state = window.__i18nState;
  if (state.loadedLangs[lang]) return state.loadedLangs[lang];
  try {
    const resp = await fetch('./data/lang/' + lang + '.json');
    const data = await resp.json();
    state.loadedLangs[lang] = data;
    return data;
  } catch (e) {
    console.warn('[i18n] Failed to load ' + lang);
    if (lang !== 'zh-CN') return loadLang('zh-CN');
    return {};
  }
}

export function t(key, replacements = {}) {
  const state = window.__i18nState;
  let val = getValue(state.strings, key);
  if (!val && state.loadedLangs[state.currentLang]) {
    val = getValue(state.loadedLangs[state.currentLang], key);
  }
  if (!val && state.currentLang !== 'en' && state.loadedLangs['en']) {
    val = getValue(state.loadedLangs['en'], key);
  }
  if (!val) return key;
  if (typeof val === 'string') {
    Object.entries(replacements).forEach(([k, v]) => {
      val = val.replace('{' + k + '}', v);
    });
  }
  return val;
}
window.t = t;

export function getLang() {
  return window.__i18nState.currentLang;
}
window.getLang = getLang;

export function getLangMeta(lang) {
  return LANG_META[lang] || LANG_META['zh-CN'];
}
window.getLangMeta = getLangMeta;

export async function setLang(lang) {
  const state = window.__i18nState;
  if (!state.config.supportedLangs.includes(lang)) return;
  state.currentLang = lang;
  state.strings = await loadLang(lang);
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.lang = lang;
  updateMeta();
  return state.strings;
}
window.setLang = setLang;

export function onLangChange(fn) {
  window.__i18nState.callbacks = window.__i18nState.callbacks || [];
  window.__i18nState.callbacks.push(fn);
  return () => {
    window.__i18nState.callbacks = window.__i18nState.callbacks.filter(f => f !== fn);
  };
}
window.onLangChange = onLangChange;

function updateMeta() {
  const state = window.__i18nState;
  const meta = state.strings.meta || {};
  if (meta.title) document.title = meta.title;
  const desc = document.querySelector('meta[name="description"]');
  if (desc && meta.description) desc.content = meta.description;
}

export async function initI18n() {
  const state = window.__i18nState;
  loadConfig();
  
  const saved = localStorage.getItem(LANG_KEY) || state.config.defaultLang;
  state.currentLang = state.config.supportedLangs.includes(saved) ? saved : state.config.defaultLang;
  
  await Promise.all(state.config.supportedLangs.map(loadLang));
  state.strings = await loadLang(state.currentLang);
  
  document.documentElement.lang = state.currentLang;
  updateMeta();
  
  return state;
}
window.initI18n = initI18n;

export function loadConfig() {
  const state = window.__i18nState;
  try {
    const saved = localStorage.getItem(CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      state.config = { ...state.config, ...parsed };
    }
  } catch(e) {}
  return state.config;
}
window.loadConfig = loadConfig;

export function saveConfig(newConfig) {
  const state = window.__i18nState;
  state.config = { ...state.config, ...newConfig };
  localStorage.setItem(CONFIG_KEY, JSON.stringify(state.config));
  return state.config;
}
window.saveConfig = saveConfig;

export function getConfig() {
  return window.__i18nState.config;
}
window.getConfig = getConfig;
