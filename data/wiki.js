export const wikiEntries = [
  {
    "cat": "dev",
    "icon": "📝",
    "title": "React Hooks 常用模式总结",
    "desc": "useEffect、useCallback、useMemo 的最佳实践",
    "tags": [
      "React",
      "Hooks"
    ],
    "date": "2026-06-10",
    "content": "## useCallback vs useMemo\n\n- **useCallback(fn,deps)** 返回 memoized 回调\n- **useMemo(()=>value,deps)** 返回 memoized 值"
  },
  {
    "cat": "dev",
    "icon": "📝",
    "title": "CSS Grid 布局实战备忘",
    "desc": "Grid 布局的核心概念与常见布局模式",
    "tags": [
      "CSS",
      "Grid"
    ],
    "date": "2026-06-08",
    "content": "## 基础模板\n\n```css\n.container{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:24px;}\n```"
  },
  {
    "cat": "ai",
    "icon": "🤖",
    "title": "Prompt Engineering 技巧合集",
    "desc": "Few-shot、Chain-of-Thought、ReAct 技巧",
    "tags": [
      "LLM",
      "Prompt"
    ],
    "date": "2026-06-05",
    "content": "## Few-shot Prompting\n\n给模型提供几个输入输出示例，引导它按照模式回答。"
  },
  {
    "cat": "ai",
    "icon": "🧠",
    "title": "RAG 检索优化笔记",
    "desc": "分块策略、向量化模型选型、混合检索、重排序",
    "tags": [
      "RAG",
      "Vector DB"
    ],
    "date": "2026-06-03",
    "content": "## 分块策略\n\n1. **固定大小** — 简单但可能截断语义\n2. **语义分块** — 按句子/段落边界分割\n3. **递归分块** — LangChain 默认方式"
  },
  {
    "cat": "ops",
    "icon": "⚙️",
    "title": "Docker 生产环境最佳实践",
    "desc": "多阶段构建、镜像瘦身、安全扫描",
    "tags": [
      "Docker",
      "DevOps"
    ],
    "date": "2026-05-28",
    "content": "## 多阶段构建\n\n```dockerfile\nFROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\n```"
  },
  {
    "cat": "tool",
    "icon": "🔧",
    "title": "Vim 高效操作备忘录",
    "desc": "批量编辑、多光标、宏录制",
    "tags": [
      "Vim",
      "Editor"
    ],
    "date": "2026-05-25",
    "content": "## 批量编辑\n\n- `ciw` — 删除当前词并进入插入模式\n- `:%s/old/new/g` — 全局替换"
  },
  {
    "cat": "dev",
    "icon": "📝",
    "title": "Python 类型注解进阶指南",
    "desc": "Typing 模块高级用法：泛型、Protocol、TypedDict",
    "tags": [
      "Python",
      "Typing"
    ],
    "date": "2026-05-20",
    "content": "## TypedDict\n\n```python\nfrom typing import TypedDict\nclass User(TypedDict):\n    id:int\n    name:str\n```"
  },
  {
    "cat": "ai",
    "icon": "🔗",
    "title": "Function Calling 实现细节",
    "desc": "OpenAI Function Calling 参数声明与调度",
    "tags": [
      "OpenAI",
      "Agent"
    ],
    "date": "2026-05-18",
    "content": "## 参数声明\n\n描述要清晰但不要过度约束。required 只放真正必需的参数。"
  },
  {
    "cat": "ops",
    "icon": "☁️",
    "title": "AWS 成本控制实用技巧",
    "desc": "预算告警、预留实例、Spot 实例",
    "tags": [
      "AWS",
      "Cost"
    ],
    "date": "2026-05-15",
    "content": "## 关键策略\n\n1. 设置 Budget 告警（50%/80%/90%）\n2. 无状态工作负载用 Spot 实例"
  },
  {
    "cat": "tool",
    "icon": "🎨",
    "title": "Git 高级操作速查",
    "desc": "Interactive Rebase、Bisect 调试、Cherry-pick",
    "tags": [
      "Git"
    ],
    "date": "2026-05-12",
    "content": "## Interactive Rebase\n\n```bash\ngit rebase -i HEAD~5\n```"
  },
  {
    "cat": "dev",
    "icon": "⚛️",
    "title": "Java 线程池核心参数与最佳实践",
    "desc": "corePoolSize、maxPoolSize、workQueue 协作机制",
    "tags": [
      "Java",
      "多线程"
    ],
    "date": "2026-06-14",
    "content": "## 核心参数\n\n- **corePoolSize** — 核心线程数\n- **maxPoolSize** — 最大线程数"
  },
  {
    "cat": "dev",
    "icon": "🌐",
    "title": "Spring Boot 自动配置原理",
    "desc": "从 @SpringBootApplication 到自动装配",
    "tags": [
      "Spring Boot",
      "Java"
    ],
    "date": "2026-06-13",
    "content": "## 启动流程\n\n1. @SpringBootApplication = @Configuration + @EnableAutoConfiguration + @ComponentScan\n2. AutoConfigurationImportSelector 加载 spring.factories"
  },
  {
    "cat": "dev",
    "icon": "🗄️",
    "title": "MySQL 索引优化实战笔记",
    "desc": "覆盖索引、最左前缀、索引下推等优化策略",
    "tags": [
      "MySQL",
      "索引"
    ],
    "date": "2026-06-12",
    "content": "## EXPLAIN 关键列\n\n- **type** — ALL < index < range < ref < eq_ref < const\n- **Extra** — Using index、Using filesort"
  },
  {
    "cat": "dev",
    "icon": "☕",
    "title": "JVM 内存模型与调优实战",
    "desc": "堆/栈/元空间内存布局、GC 算法选型",
    "tags": [
      "JVM",
      "Java"
    ],
    "date": "2026-06-11",
    "content": "## 内存区域\n\n- **堆** — 新生代（Eden/S0/S1）+ 老年代\n- **栈** — 线程私有\n- **元空间** — 类元数据"
  },
  {
    "cat": "ops",
    "icon": "🐳",
    "title": "Docker Compose 生产配置指南",
    "desc": "健康检查、资源限制、日志轮转",
    "tags": [
      "Docker",
      "Compose"
    ],
    "date": "2026-06-09",
    "content": "## 健康检查\n\n```yaml\nhealthcheck:\n  test: [\"CMD\",\"curl\",\"-f\",\"http://localhost:8080/actuator/health\"]\n  interval:30s\n```"
  },
  {
    "cat": "ops",
    "icon": "📊",
    "title": "Prometheus+Grafana 监控搭建",
    "desc": "指标采集、告警规则、可视化大屏",
    "tags": [
      "Prometheus",
      "Grafana"
    ],
    "date": "2026-06-07",
    "content": "## 架构\n\n应用 → /metrics → Prometheus 拉取 → AlertManager → 告警通知"
  },
  {
    "cat": "ops",
    "icon": "☸️",
    "title": "Kubernetes Pod 排错指南",
    "desc": "Pod 卡住 Pending/CrashLoopBackOff 的排查步骤",
    "tags": [
      "K8s",
      "Pod"
    ],
    "date": "2026-06-06",
    "content": "## 常见状态\n\n- **Pending** — 资源不足 / PVC 未就绪\n- **CrashLoopBackOff** — 进程退出 / 健康检查失败"
  },
  {
    "cat": "ai",
    "icon": "🧩",
    "title": "LangChain LCEL 表达式语言",
    "desc": "LCEL 管道语法与可组合性",
    "tags": [
      "LangChain",
      "LCEL"
    ],
    "date": "2026-06-04",
    "content": "## 基础管道\n\n```python\nchain = prompt | model | StrOutputParser()\nresult = chain.invoke({\"language\":\"Python\"})\n```"
  },
  {
    "cat": "ai",
    "icon": "📎",
    "title": "Embedding 模型选型对比",
    "desc": "OpenAI/BGE/M3E/E5 主流嵌入模型对比",
    "tags": [
      "Embedding",
      "RAG"
    ],
    "date": "2026-06-02",
    "content": "## 模型对比\n\n| 模型 | 维度 | 最大输入 |\n|------|------|---------|\n| text-embedding-3-small | 512-1536 | 8192 |"
  },
  {
    "cat": "tool",
    "icon": "🐙",
    "title": "Git 分支策略与工作流规范",
    "desc": "Git Flow / GitHub Flow / Trunk-Based 对比",
    "tags": [
      "Git",
      "工作流"
    ],
    "date": "2026-06-01",
    "content": "## 三种策略\n\n**GitHub Flow**：main → feature → PR → merge\n**Git Flow**：main + develop + feature + release + hotfix\n**Trunk-Based**：频繁提交 + 短命分支 + Feature Flag"
  }
];
