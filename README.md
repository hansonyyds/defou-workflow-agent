# Defou Workflow Agent

这是一个智能化的内容创作工作流代理，结合了 Defou 方法论和 AI 能力。它旨在帮助内容创作者自动化地完成从"灵感获取"到"内容重塑"再到"爆款验证"的全过程。

## ✨ 核心功能

该项目包含四个主要的功能模块：

### 1. 🤖 自动化内容生成代理 (Content Agent)
全自动的文件监听与处理系统。你只需要把草稿扔进文件夹，剩下的交给 AI。
- **👀 实时监听**：监控 `inputs/` 目录，检测到 `.md` 或 `.txt` 文件即刻响应。
- **🧠 三重视角重塑**：
  - **🔥 版本 A (Stanley Style)**：追求极致的点击率和传播度，情绪饱满，金句频出。
  - **🧠 版本 B (Defou Style)**：侧重底层逻辑拆解和深度认知，提供长期价值。
  - **🌟 版本 C (Combo Style)**：**[NEW]** Defou x Stanley 终极融合版，结合了传播节奏与深度内核。
- **📊 智能评估**：自动进行潜力打分（好奇心、共鸣度、清晰度、传播值）。
- **📂 自动归档**：处理完毕后自动整理文件，保持工作区整洁。

### 2. 🔥 热点挖掘技能 (TopHub Skill)
主动出击的流量猎手。
- **🕷️ 实时采集**：从 TopHub 抓取全网实时热榜数据。
- **💡 智能分析**：使用 AI 分析每个热点的"流量潜力"（争议性、紧迫感、好奇心）。
- **🎯 选题建议**：针对高潜力话题，自动生成具体的切入角度和标题建议。

### 3. 🌟 自动化爆款生成技能 (TopHub x Stanley)
全自动化的"热点发现 -> 爆款生成"流水线。
- **🤖 全自动流程**：自动抓取热榜 -> 智能筛选最佳选题 -> 自动应用 Defou x Stanley 风格生成内容。
- **📝 多版本输出**：
  - **Version A (Stanley)**：极致爆款、情绪共鸣。
  - **Version B (Defou)**：深度认知、底层逻辑。
  - **Version C (Combo)**：结合二者优点的终极版本。
- **⏱️ 零人工干预**：一键运行，直接拿到可以直接发布的成品稿件。

### 4. 🧪 爆款要素验证技能 (Viral Verification)
对已生成内容的"终极体检"。
- **🩺 深度诊断**：基于6大爆款要素（好奇心、情绪、价值、时效、节奏、新颖性）进行评分。
- **📈 增长黑客**：模拟资深运营专家，给出具体的优化建议。
- **🚀 自动重写**：不仅指出问题，还会自动重写一个优化后的高潜力版本。

## 🛠️ 快速开始

### 5. 👑 全自动总指挥 (Master Orchestrator)
一键启动全流程的终极技能。
- **⚙️ 全自动调度**：按顺序自动执行 "Combo (生成)" -> "Verify (验证)"。
- **🏭 流水线作业**：从热点抓取到最终成品验证，中间无需任何人工干预。
- **✅ 结果导向**：直接交付经过双重 AI 处理（生成+验证）的高质量稿件。

## 🛠️ 快速开始

### 前置要求
- Node.js (v16 或更高版本)
- OpenAI API Key (或兼容的 API Key)

### 安装依赖

```bash
npm install
```

## 环境配置

创建 `.env` 文件：

```env
# OpenAI 配置
OPENAI_API_KEY=sk-your-openai-key-here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini

# 技能级别模型配置（可选）
OPENAI_MODEL_COMBO=gpt-4o
OPENAI_MODEL_VERIFY=gpt-4o-mini
OPENAI_MODEL_LIST=gpt-4o-mini

# Mock 模式（用于测试）
MOCK_MODE=false
```

### 兼容的 AI 提供商

本项目使用 OpenAI SDK，支持任何 OpenAI 兼容端点：

- **OpenAI 官方**: `https://api.openai.com/v1`
- **Azure OpenAI**: 你的 Azure 端点
- **DeepSeek**: `https://api.deepseek.com/v1`
- **Moonshot**: `https://api.moonshot.cn/v1`
- **其他**: 任何支持 OpenAI API 格式的端点

## 🚀 使用指南

### 场景一：我有草稿，帮我优化

1. **启动代理服务**：
   ```bash
   npm start
   ```
   *终端显示 `👀 Watching for new files in: .../inputs` 即表示启动成功。*

2. **投放素材**：
   将你的原始草稿（可以是凌乱的笔记、文章大纲或全文）放入 `inputs/` 文件夹。

3. **获取结果**：
   - 处理完成后，生成的详细分析报告会出现在 `outputs/` 文件夹中（文件名后缀为 `_report.md`）。
   - 原始文件会被自动移动到 `archive/` 文件夹备份。

### 场景二：我没灵感，帮我找选题

1. **进入项目目录**：
   务必确保你在 `defou-workflow-agent` 目录下运行命令：
   ```bash
   cd defou-workflow-agent
   ```

2. **运行热点挖掘指令**：
   ```bash
   npm run skill:tophub
   ```

3. **查看分析报告**：
   - 系统会自动抓取最新热榜。
   - 几秒钟后，在 `outputs/trends/` 文件夹下查看生成的 `tophub_analysis_xxxx.md` 报告。

### 场景三：全自动热点爆款生成

1. **进入项目目录**：
   ```bash
   cd defou-workflow-agent
   ```

2. **运行全自动生成指令**：
   ```bash
   npm run skill:combo
   ```

3. **查看生成结果**：
   - 系统会自动完成抓取、选题、生成全过程。
   - 结果保存在 `outputs/defou-stanley-posts/` 目录下。

### 场景四：验证并优化爆款文章

1. **进入项目目录**：
   ```bash
   cd defou-workflow-agent
   ```

2. **运行验证指令**：
   ```bash
   # 验证最新生成的文章
   npm run skill:verify
   
   # 或者验证指定文件
   npm run skill:verify -- outputs/defou-stanley-posts/你的文章.md
   ```

3. **查看优化结果**：
   - 结果保存在 `outputs/viral-verified-posts/` 目录下。
   - 包含评分卡、改进建议以及最终优化后的版本。

### 场景五：🔗 批量处理文章链接 (Link List Mode)

如果你有一个包含多篇文章链接的 Markdown 清单（例如 `[标题](链接)` 格式）。

1. **启动监听**：
   ```bash
   npm run skill:list
   ```
   *程序进入等待状态...*

2. **投放清单**：
   将你的清单文件（如 `links.md`）拖入 `defou-workflow-agent/local_inputs/`。

3. **自动执行**：
   系统会自动抓取链接 -> 生成初稿 -> **自动验证优化**。
   最终成品直接去 `outputs/viral-verified-posts/` 领取。

### 场景六：🚀 一键托管 (Master Mode)

最推荐的使用方式，全自动完成所有工作。

1. **进入项目目录**：
   ```bash
   cd defou-workflow-agent
   ```

2. **运行总指挥指令**：
   ```bash
   npm run skill:master
   ```

3. **等待收货**：
   - 系统将自动串联执行 `skill:combo` 和 `skill:verify`。
   - 你只需等待几分钟，然后去 `outputs/viral-verified-posts/` 目录下收取最终成品。

## 📂 项目结构

```
defou-workflow-agent/
├── inputs/             # [入口] 这里的文稿会被自动处理
├── outputs/            # [出口]
│   ├── articles/       # AI 重塑后的文章报告
│   ├── trends/         # 热榜分析报告
│   ├── defou-stanley-posts/ # 自动生成的爆款文章
│   └── viral-verified-posts/ # 经过验证优化的最终稿件
├── archive/            # [归档] 处理完的源文件移入此处
├── src/
│   ├── index.ts        # 核心监听代理逻辑
│   ├── master.ts       # [新增] 总指挥调度脚本
│   ├── templates.ts    # Prompt 提示词
│   └── config.ts       # 环境配置
├── skills/             # 技能库
│   ├── tophub-trends/              # 热榜抓取技能
│   ├── tophub-defou-stanley-combo/ # 自动创作组合技能
│   └── viral-verification/         # 爆款验证技能
│       ├── SKILL.md                # 验证标准与 Prompt (可修改)
│       └── index.ts                # 执行脚本
└── .env                # 配置文件
```

## ⚡️ TL;DR (极简版)

复制下方命令，直接开始工作：

```bash
# 1. 进入目录
cd defou-workflow-agent

# 2. 安装依赖 (仅首次)
npm install

# --- 常用指令 ---

# [🔥 推荐] 模式 E: 一键全自动 (生成 + 验证)
npm run skill:master

# 模式 A: 启动自动监听 (处理 inputs/ 下的草稿)
npm start

# 模式 B: 抓取全网热点 (生成选题建议)
npm run skill:tophub

# 模式 C: 全自动爆款生成 (抓取+选题+生成)
npm run skill:combo

# 模式 D: 爆款验证与优化 (为生成的内容做最后体检)
npm run skill:verify

# 模式 E: 批量处理文章链接 (启动监听 -> 投放清单 -> 自动生成+验证)
npm run skill:list
```
