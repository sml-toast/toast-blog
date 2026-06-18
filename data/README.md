# 数据目录

## 目录结构

```
data/
├── README.md         ← 本文档
├── dev/              ← 开发环境
│   ├── manifest.json     ← 文件清单与说明
│   ├── data.json         ← localStorage 数据备份
│   └── attachments/      ← 附件原始文件
│       └── YYYY-MM/          ← 按月归档
├── test/             ← 测试环境（结构同 dev）
├── pro/              ← 生产环境（结构同 dev）
├── backups/          ← 时间戳备份快照
│   ├── dev/
│   │   └── YYYY-MM-DD_HHMMSS/
│   ├── test/
│   └── pro/
├── raw/              ← 原始数据（旧结构，逐步迁移）
├── projects.js       ← 静态默认数据
├── tutorials.js
├── wiki.js
├── path.js
└── loader.js         ← 数据加载层
```

## 环境说明

| 环境 | 目录 | 用途 |
|------|------|------|
| dev | `data/dev/` | 开发测试，内容可随意修改 |
| test | `data/test/` | 功能验证，模拟生产数据 |
| pro | `data/pro/` | 生产数据备份，谨慎修改 |

## 文件说明

### manifest.json
每个环境的文件清单，记录附件索引和说明。格式：
```json
{
  "environment": "dev",
  "version": "1.0",
  "description": "文件说明",
  "updatedAt": "2026-06-18T00:00:00Z",
  "dataFile": "data.json",
  "attachments": {
    "2026-06": {
      "count": 0,
      "files": [],
      "note": ""
    }
  }
}
```

### data.json
从后台管理面板导出的完整数据备份，包含：
- 作品 / 教程 / Wiki / 学习路线
- 上传的图片和附件（base64）
- 导出时间、环境标记

### attachments/
上传的图片和附件原始文件，按月归档到 `attachments/YYYY-MM/` 目录。
文件名格式：`{类型}_{ID}_{序号}.{ext}`

## 备份与恢复

### 手动备份
1. 后台管理 → 切换目标环境
2. 点击「💾 备份」→ 下载 data.json
3. 放入 `data/{env}/data.json`
4. 附件文件放入 `data/{env}/attachments/YYYY-MM/`
5. 更新 `data/{env}/manifest.json`

### 手动恢复
1. 后台管理 → 切换目标环境
2. 点击「📂 还原」→ 选择 data.json
3. 数据自动写入当前环境 localStorage
4. 附件自动还原

### 时间戳备份
完整快照存储在 `data/backups/{env}/YYYY-MM-DD_HHMMSS/`
包含当时的所有数据文件和附件。
