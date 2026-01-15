import { CONFIG } from './config';
import OpenAI from 'openai';

async function testUrl(url: string): Promise<boolean> {
  try {
    const client = new OpenAI({ baseURL: url });
    // 尝试列出模型（最轻量的测试）
    await client.models.list();
    return true;
  } catch (error) {
    return false;
  }
}

async function run() {
  console.log('🔍 OpenAI API 连接诊断\n');

  const baseUrl = CONFIG.OPENAI_BASE_URL;
  const apiKey = CONFIG.OPENAI_API_KEY;

  console.log(`Base URL: ${baseUrl}`);
  console.log(`API Key: ${apiKey ? '已配置 (' + apiKey.slice(0, 10) + '...)' : '❌ 未配置'}`);

  if (!apiKey) {
    console.log('\n⚠️  未配置 API Key，无法测试连接');
    console.log('请在 .env 文件中设置 OPENAI_API_KEY');
    return;
  }

  console.log('\n测试连接中...');

  // 测试基础 URL
  if (await testUrl(baseUrl)) {
    console.log(`✅ 连接成功: ${baseUrl}`);
  } else {
    console.log(`❌ 连接失败: ${baseUrl}`);
    console.log('\n可能的原因：');
    console.log('1. Base URL 配置错误');
    console.log('2. API Key 无效');
    console.log('3. 网络连接问题');
  }
}

run().catch(console.error);
