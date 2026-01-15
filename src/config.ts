import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true });

// 向后兼容的环境变量读取
// 优先使用 OpenAI 配置，如果不存在则回退到 Anthropic 配置
const getEnvWithFallback = (openaiKey: string, anthropicKey: string) => {
  return process.env[openaiKey] || process.env[anthropicKey];
};

// 配置接口
interface AppConfig {
  // OpenAI 配置
  OPENAI_API_KEY?: string;
  OPENAI_BASE_URL: string;
  OPENAI_MODEL: string;
  OPENAI_MODEL_COMBO?: string;
  OPENAI_MODEL_VERIFY?: string;
  OPENAI_MODEL_LIST?: string;

  // 测试模式
  MOCK_MODE: boolean;

  // 路径配置
  INPUT_DIR: string;
  OUTPUT_DIR: string;
  OUTPUT_ARTICLES_DIR: string;
  OUTPUT_TRENDS_DIR: string;
  PROCESSING_DIR: string;
  ARCHIVE_DIR: string;
  ERRORS_DIR: string;
}

// 验证配置：检查 OpenAI 或 Anthropic API Key
const hasApiKey = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;
if (!process.env.MOCK_MODE && !hasApiKey) {
  console.warn('⚠️  API Key not configured (OPENAI_API_KEY or ANTHROPIC_API_KEY). Running in MOCK_MODE automatically.');
  process.env.MOCK_MODE = 'true';
}

export const CONFIG: AppConfig = {
  // OpenAI 配置
  OPENAI_API_KEY: getEnvWithFallback('OPENAI_API_KEY', 'ANTHROPIC_API_KEY'),
  OPENAI_BASE_URL: getEnvWithFallback('OPENAI_BASE_URL', 'ANTHROPIC_BASE_URL') || 'https://api.openai.com/v1',
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  OPENAI_MODEL_COMBO: process.env.OPENAI_MODEL_COMBO,
  OPENAI_MODEL_VERIFY: process.env.OPENAI_MODEL_VERIFY,
  OPENAI_MODEL_LIST: process.env.OPENAI_MODEL_LIST,

  // 测试模式
  MOCK_MODE: process.env.MOCK_MODE === 'true',

  // 路径配置
  INPUT_DIR: path.resolve(__dirname, '../inputs'),
  OUTPUT_DIR: path.resolve(__dirname, '../outputs'),
  OUTPUT_ARTICLES_DIR: path.resolve(__dirname, '../outputs/articles'),
  OUTPUT_TRENDS_DIR: path.resolve(__dirname, '../outputs/trends'),
  PROCESSING_DIR: path.resolve(__dirname, '../processing'),
  ARCHIVE_DIR: path.resolve(__dirname, '../archive'),
  ERRORS_DIR: path.resolve(__dirname, '../errors'),
};
