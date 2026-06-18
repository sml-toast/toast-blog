
// ── i18n attached to window to prevent tree-shaking ──
/**
 * i18n 多语言引擎
 * 用法: import { t, setLang, getLang, initI18n } from './data/i18n.js'
 */

const LANG_KEY = 'toast_blog_lang';
const CONFIG_KEY = 'toast_blog_i18n_config';
let currentLang = 'zh-CN';
let strings = {};
let config = {
  enabled: true,
  envEnabled: true,
  defaultLang: 'zh-CN',
  supportedLangs: ['zh-CN', 'en']
};
let loadedLangs = {};
let callbacks = [];

// 语言元数据
export const LANG_META = {
  'zh-CN': { name: '中文', flag: '🇨🇳', nativeName: '中文' },
  'en': { name: 'English', flag: '🇺🇸', nativeName: 'English' }
};

// 获取深层嵌套值
function getValue(obj, path) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

// 加载语言包
async function loadLang(lang) {
  if (loadedLangs[lang]) return loadedLangs[lang];
  try {
    const module = await import(`./lang/${lang}.json`);
    loadedLangs[lang] = module.default || module;
    return loadedLangs[lang];
  } catch (e) {
    console.warn(`[i18n] Failed to load ${lang}, falling back to zh-CN`);
    if (lang !== 'zh-CN') return loadLang('zh-CN');
    return {};
  }
}

// 翻译函数
export function t(key, replacements = {}) {
  let val = getValue(strings, key);
  if (!val) {
    // 回退到英文
    if (currentLang !== 'en') {
      const enStrings = loadedLangs['en'];
      val = enStrings ? getValue(enStrings, key) : undefined;
    }
    if (!val) return key;
  }
  if (typeof val === 'string') {
    Object.entries(replacements).forEach(([k, v]) => {
      val = val.replace(`{${k}}`, v);
    });
  }
  return val;
}

// 获取当前语言
export function getLang() { return currentLang; }

// 获取语言元数据
export function getLangMeta(lang) { return LANG_META[lang] || LANG_META['zh-CN']; }

// 设置语言
export async function setLang(lang) {
  if (!config.supportedLangs.includes(lang)) return;
  currentLang = lang;
  strings = await loadLang(lang);
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.lang = lang;
  // 触发回调
  callbacks.forEach(fn => fn(lang, strings));
  // 更新 meta
  updateMeta();
  return strings;
}

// 注册语言变更回调
export function onLangChange(fn) {
  callbacks.push(fn);
  return () => { callbacks = callbacks.filter(f => f !== fn); };
}

// 更新页面 meta
function updateMeta() {
  const meta = strings.meta || {};
  document.title = meta.title || document.title;
  const desc = document.querySelector('meta[name="description"]');
  if (desc && meta.description) desc.content = meta.description;
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle && meta.ogTitle) ogTitle.content = meta.ogTitle;
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc && meta.ogDescription) ogDesc.content = meta.ogDescription;
}

// 初始化 i18n
export async function initI18n() {
  // 加载配置
  loadConfig();
  
  // 从 localStorage 或配置加载语言
  const saved = localStorage.getItem(LANG_KEY) || config.defaultLang;
  currentLang = config.supportedLangs.includes(saved) ? saved : config.defaultLang;
  
  // 预加载所有支持的语言
  await Promise.all(config.supportedLangs.map(loadLang));
  
  // 设置当前语言
  strings = await loadLang(currentLang);
  document.documentElement.lang = currentLang;
  updateMeta();
  
  return { currentLang, strings, config };
}

// ── 配置管理 ──
export function loadConfig() {
  try {
    const saved = localStorage.getItem(CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      config = { ...config, ...parsed };
    }
  } catch(e) {}
  return config;
}

export function saveConfig(newConfig) {
  config = { ...config, ...newConfig };
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  return config;
}

export function getConfig() { return config; }

// ── Globals for admin panel access ──
window.initI18n = initI18n;
window.setLang = setLang;
window.getLang = getLang;
window.t = t;
window.getLangMeta = getLangMeta;
window.onLangChange = onLangChange;
window.getConfig = getConfig;
window.saveConfig = saveConfig;
window.loadConfig = loadConfig;
window.LANG_META = LANG_META;
