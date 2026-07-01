# 开发任务计划

---

## 任务 1：后台管理多语言与多环境功能独立

**状态：进行中**
**目标：** 多语言配置、多环境配置在管理后台互为独立模块，各自独立控制博客首页显示

### 确认事项
- 多语言（enabled / defaultLang / supportedLangs）→ `toast_blog_i18n_config_{env}`
- 多环境（envEnabled / enabledEnvs）→ `toast_blog_env_config_{env}`
- 两个模块的启用/禁用只影响博客首页的切换按钮显示
- 不干预后台管理界面的环境切换（DEV/TEST/PROD 数据隔离）

### 已完成
- [x] admin.html 清理内联 getConfig/saveConfig 脚本，统一走 admin.js
- [x] admin.js getConfig/saveConfig 改用 per-env 独立 key
- [x] admin.html renderEnvConfig() 读取 cfg.envEnabled
- [x] admin.html renderI18nConfig() 读取 cfg.enabled / defaultLang / supportedLangs
- [x] admin.html saveEnvConfig() / saveI18nConfig() 分别写入独立 key

### 待测试
- [ ] DEV 开启多语言 → 博客首页出现语言切换按钮
- [ ] DEV 关闭多环境 → 博客首页隐藏环境标签
- [ ] PROD 设置不同值 → 互相不影响
- [ ] 管理后台环境切换时，数据/配置完全独立

---

## 任务 2：后台管理增加简历模块

**状态：待开发**
**目标：** 在管理后台新增「简历管理」标签页，提供：
- 简历文件导入（PDF / Word / Markdown）
- 简历内容智能解析（职能/技能/经验识别）
- 解析结果回填到简历模板
- 预生成 3 套简历模板

### 功能拆分

#### 2.1 简历文件上传与解析
```
[上传简历] → [文件格式校验] → [内容提取] → [职能/技能/经验识别] → [结构化数据]
```
- 支持 PDF、Word（.docx）、Markdown
- 使用正则或简单 NLP 提取：姓名、电话、邮箱、教育经历、工作经历、技能标签
- 解析结果存入 localStorage（per-env 隔离）

#### 2.2 解析数据回填
```
[结构化数据] → [映射到简历模板字段] → [实时预览] → [保存]
```
- 字段：个人信息、工作经历、教育经历、技能、项目经验
- 支持手动纠偏/补充

#### 2.3 简历模板预生成
- 模板 A：简约现代（单栏，适合技术岗）
- 模板 B：经典商务（双栏，适合传统行业）
- 模板 C：创意视觉（带头像/色块，适合设计/创意岗）
- 每个模板可预览、切换、保存

### 技术方案
- 前端解析库：`pdf.js` 或 `mammoth.js`（Word 解析）
- 简历渲染：现有简历预览组件（main.js 内的 resume section）复用
- 数据存储：localStorage + data/loader.js 的 per-env 机制

### 检查点
- [ ] 解析结果准确率 ≥ 80%
- [ ] 模板切换时内容保留
- [ ] 导出 PDF 正常
- [ ] 支持多语言简历内容
- [ ] 浏览器测试覆盖

---

## 任务 3：验证与测试

**状态：待完成**
- [ ] 多语言/多环境配置 UI 隔离测试
- [ ] 博客首页按钮显示与后台配置一致
- [ ] localStorage 独立 key 验证
- [ ] 简历模块端到端测试
- [ ] Lighthouse 审计

---

