# Anthropic SDK 到 OpenAI SDK 迁移设计文档

> **设计日期**: 2025-01-15
> **设计目标**: 将项目从 Anthropic SDK 迁移到 OpenAI 兼容 API
> **方案类型**: 方案 A - 直接使用 OpenAI SDK

---

## 1. 设计概述

### 1.1 背景

Defou Workflow Agent 当前使用 `@anthropic-ai/sdk` 调用 Claude API。为了支持更多 AI 提供商和降低成本，需要迁移到 OpenAI 兼容的 API 方式。

### 1.2 设计目标

- ✅ 完全移除 Anthropic SDK 依赖
- ✅ 支持任何 OpenAI 兼容端点（通过环境变量配置）
- ✅ 支持灵活配置不同模型
- ✅ 保持现有功能完全不变
- ✅ 最小化代码改动

### 1.3 技术选型

**选择方案 A：直接使用 OpenAI SDK**

| 对比项 | OpenAI SDK | 原生 fetch | 抽象层 |
|--------|-----------|-----------|--------|
| 稳定性 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| 维护成本 | 低 | 中 | 高 |
| 功能完整 | ✅ | 需手动实现 | 需设计 |
| 类型支持 | ✅ | ❌ | 需定义 |

---

## 2. 依赖与环境配置

### 2.1 依赖变更

**package.json**:
```diff
{
  "dependencies": {
-   "@anthropic-ai/sdk": "^0.33.1",
+   "openai": "^4.77.0",
    // ... 其他依赖保持不变
  }
}
```

### 2.2 环境变量

**.env**:
```env
# OpenAI 配置
OPENAI_API_KEY=sk-your-openai-key-here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini

# 技能级别模型配置（可选）
OPENAI_MODEL_COMBO=gpt-4o
OPENAI_MODEL_VERIFY=gpt-4o-mini
OPENAI_MODEL_LIST=gpt-4o-mini

# Mock 模式（保留用于测试）
MOCK_MODE=false
```

### 2.3 配置文件重构

**src/config.ts**:
```typescript
export const CONFIG = {
  // OpenAI 配置
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_BASE_URL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  OPENAI_MODEL_COMBO: process.env.OPENAI_MODEL_COMBO,
  OPENAI_MODEL_VERIFY: process.env.OPENAI_MODEL_VERIFY,
  OPENAI_MODEL_LIST: process.env.OPENAI_MODEL_LIST,

  // 测试模式
  MOCK_MODE: process.env.MOCK_MODE === 'true',

  // 路径配置（保持不变）
  INPUT_DIR: path.resolve(__dirname, '../inputs'),
  OUTPUT_DIR: path.resolve(__dirname, '../outputs'),
  OUTPUT_ARTICLES_DIR: path.resolve(__dirname, '../outputs/articles'),
  OUTPUT_TRENDS_DIR: path.resolve(__dirname, '../outputs/trends'),
  PROCESSING_DIR: path.resolve(__dirname, '../processing'),
  ARCHIVE_DIR: path.resolve(__dirname, '../archive'),
  ERRORS_DIR: path.resolve(__dirname, '../errors'),
};
```

---

## 3. API 调用适配

### 3.1 核心差异对比

| 特性 | Anthropic SDK | OpenAI SDK |
|------|--------------|------------|
| 导入方式 | `import Anthropic from '@anthropic-ai/sdk'` | `import OpenAI from 'openai'` |
| 客户端创建 | `new Anthropic({ apiKey, baseURL })` | `new OpenAI({ apiKey, baseURL })` |
| API 方法 | `anthropic.messages.create()` | `openai.chat.completions.create()` |
| System Prompt | `system: "prompt"` 参数 | `{ role: "system", content: "prompt" }` 消息 |
| 响应结构 | `msg.content[0].text` | `msg.choices[0].message.content` |

### 3.2 代码迁移示例

**迁移前 (Anthropic)**:
```typescript
import Anthropic from '@anthropic-ai/sdk';
const anthropic = new Anthropic({
  apiKey: CONFIG.ANTHROPIC_API_KEY || 'dummy',
  baseURL: CONFIG.ANTHROPIC_BASE_URL,
});

const msg = await anthropic.messages.create({
  model: "anthropic/claude-sonnet-4",
  max_tokens: 4000,
  temperature: 0.7,
  system: DEFOU_SYSTEM_PROMPT,
  messages: [
    { role: "user", content: `Here is the raw content:\n\n${content}` }
  ]
});

const result = (msg.content[0] as any).text;
```

**迁移后 (OpenAI)**:
```typescript
import OpenAI from 'openai';
const openai = new OpenAI({
  apiKey: CONFIG.OPENAI_API_KEY || 'dummy',
  baseURL: CONFIG.OPENAI_BASE_URL,
});

const msg = await openai.chat.completions.create({
  model: CONFIG.OPENAI_MODEL || "gpt-4o-mini",
  max_tokens: 4000,
  temperature: 0.7,
  messages: [
    { role: "system", content: DEFOU_SYSTEM_PROMPT },
    { role: "user", content: `Here is the raw content:\n\n${content}` }
  ]
});

const result = msg.choices[0].message.content || '';
```

---

## 4. 文件修改清单

### 4.1 需要修改的文件

| 序号 | 文件 | API 调用次数 | 优先级 | 复杂度 |
|------|------|-------------|--------|--------|
| 1 | `package.json` | - | 高 | 低 |
| 2 | `src/config.ts` | - | 高 | 低 |
| 3 | `src/diagnose.ts` | 1 | 中 | 低 |
| 4 | `src/index.ts` | 1 | 高 | 低 |
| 5 | `skills/tophub-trends/tophub.ts` | 1 | 中 | 低 |
| 6 | `skills/viral-verification/index.ts` | 1 | 中 | 低 |
| 7 | `skills/article-list-processor/index.ts` | 1 | 中 | 低 |
| 8 | `skills/tophub-defou-stanley-combo/index.ts` | 2 | 高 | 中 |

### 4.2 详细修改内容

详见设计讨论部分（第 4 节），每个文件的具体修改已在设计阶段确认。

---

## 5. 错误处理与兼容性

### 5.1 OpenAI SDK 错误处理

```typescript
import OpenAI from 'openai';

async function callOpenAI(messages: any[]) {
  try {
    const msg = await openai.chat.completions.create({
      model: CONFIG.OPENAI_MODEL || "gpt-4o-mini",
      max_tokens: 4000,
      temperature: 0.7,
      messages,
    });
    return msg.choices[0].message.content;
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error(`OpenAI API Error: ${error.status} - ${error.message}`);
      if (error.status === 429) {
        console.error('Rate limit exceeded, consider reducing concurrency');
      }
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}
```

### 5.2 配置验证

在 `config.ts` 中添加验证逻辑：

```typescript
// 验证 OpenAI 配置
if (!CONFIG.MOCK_MODE && !CONFIG.OPENAI_API_KEY) {
  console.warn('⚠️  OPENAI_API_KEY not configured. Running in MOCK_MODE automatically.');
  process.env.MOCK_MODE = 'true';
  CONFIG.MOCK_MODE = true;
}
```

---

## 6. 迁移执行计划

### 6.1 执行步骤

**阶段 1：依赖更新**
```bash
npm uninstall @anthropic-ai/sdk
npm install openai@^4.77.0
```

**阶段 2：配置文件修改**
1. 更新 `.env` 文件
2. 修改 `src/config.ts`

**阶段 3：代码迁移**（按顺序）
1. `src/diagnose.ts`
2. `src/index.ts`
3. `skills/tophub-trends/tophub.ts`
4. `skills/viral-verification/index.ts`
5. `skills/article-list-processor/index.ts`
6. `skills/tophub-defou-stanley-combo/index.ts`

**阶段 4：文档更新**
1. 更新 `CLAUDE.md` 系列文档
2. 更新 README.md

### 6.2 验证测试

**Mock 模式测试**（每个文件修改后）：
```bash
MOCK_MODE=true npm start
MOCK_MODE=true npm run skill:combo
MOCK_MODE=true npm run skill:verify
MOCK_MODE=true npm run skill:list
```

**集成验证**（全部完成后）：
```bash
# API 连接测试
ts-node src/diagnose.ts

# 完整工作流测试
npm run skill:master

# 各技能测试
npm run skill:tophub
npm run skill:verify -- outputs/defou-stanley-posts/xxx.md
npm run skill:list
```

### 6.3 回滚方案

```bash
# 查看迁移前的提交
git log --oneline -5

# 回滚到指定提交
git reset --hard <commit-hash>

# 重新安装依赖
npm install
```

---

## 7. 影响评估

| 影响类别 | 影响程度 | 说明 |
|---------|---------|------|
| 代码改动 | 中 | 7 个文件需修改，主要是 API 调用方式 |
| 依赖变更 | 低 | 仅替换一个 npm 包 |
| 配置变更 | 低 | 环境变量重命名，功能相同 |
| 功能影响 | 无 | OpenAI SDK 提供相同功能 |
| 性能影响 | 无 | API 调用延迟主要在网络 |
| 向后兼容 | 破坏性 | 完全移除 Anthropic 支持 |

---

## 8. 后续优化建议

1. **性能监控**: 添加 Token 消耗和执行时间监控
2. **模型 A/B 测试**: 支持同一技能使用不同模型进行对比
3. **成本优化**: 根据任务复杂度动态选择模型
4. **错误重试**: 实现指数退避的重试机制
5. **流式响应**: 对长文本生成启用流式响应

---

## 附录：OpenAI 兼容端点示例

### 官方端点
```env
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini
```

### Azure OpenAI
```env
OPENAI_BASE_URL=https://your-resource.openai.azure.com/openai/deployments/your-deployment
OPENAI_MODEL=gpt-4o
```

### DeepSeek
```env
OPENAI_BASE_URL=https://api.deepseek.com/v1
OPENAI_MODEL=deepseek-chat
```

### Moonshot
```env
OPENAI_BASE_URL=https://api.moonshot.cn/v1
OPENAI_MODEL=moonshot-v1-8k
```

---

**文档版本**: 1.0
**最后更新**: 2025-01-15
