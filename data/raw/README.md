# 原始数据目录

> 按环境区分，用于数据持久化、备份与恢复

## 目录结构

```
data/raw/
├── README.md    ← 本文档
├── dev/         ← 开发环境
│   ├── data.json   ← 完整数据导出（localStorage 备份）
│   └── uploads/    ← 上传附件/图片
├── test/        ← 测试环境
│   ├── data.json
│   └── uploads/
└── prod/        ← 生产环境
    ├── data.json
    └── uploads/
```

## 使用方式

### 备份（后台管理 → 备份）
1. 进入后台管理 `/admin.html`
2. 确认当前环境（DEV / TEST / PROD）
3. 点击「📤 备份」按钮
4. 下载 JSON 文件，放入对应环境的目录
5. 上传的图片/附件也会包含在备份包中

### 还原（后台管理 → 还原）
1. 进入后台管理 `/admin.html`
2. 切换到目标环境
3. 点击「📥 还原」按钮
4. 选择对应环境的 `data.json` 文件
5. 数据自动恢复到当前环境 localStorage
6. 附件/图片也会一起还原

### data.json 格式
```json
{
  "version": "1.0",
  "environment": "dev|test|prod",
  "exportedAt": "ISO 时间戳",
  "description": "自定义说明",
  "data": {
    "projects": [...],
    "tutorials": [...],
    "wiki": [...],
    "pathSteps": [...]
  },
  "files": {
    "uploads/img_001.png": "base64...",
    "uploads/doc_001.pdf": "base64..."
  }
}
```

## 维护

- 定期导出备份 → `data/raw/{env}/data.json`
- 提交 git 记录可回溯
- 跨设备使用时先还原再操作
- 清空 localStorage 后通过还原恢复
