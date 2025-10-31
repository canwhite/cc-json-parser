// 测试解析 AI 响应中的 JSON 结构
import { JSONParser } from './src/index.js';

// 模拟 AI 响应格式
const aiResponse = `Based on my analysis of current project, here's JSON structure you requested:

\`\`\`json
{
  "target": "这是一个用于测试和演示 @iamqc/cc-session 和 @iamqc/cc-json-parser 两个自定义包功能的项目，提供基础的会话管理和JSON解析能力。",
  "main_structure": {
    "root": "/Users/zack/Desktop/cc-session-parser-test",
    "files": {
      "index.ts": "项目入口文件，简单的控制台输出",
      "session-example.ts": "cc-session 包的基础应用示例，展示会话管理功能",
      "json-parser-example.ts": "cc-json-parser 包的基础应用示例，展示JSON解析功能",
      "combined-test.ts": "组合测试文件",
      "simple-test.ts": "简单测试文件",
      "test-final-result.ts": "最终结果测试文件"
    },
    "dependencies": {
      "@iamqc/cc-json-parser": "^1.0.0",
      "@iamqc/cc-session": "^1.1.0"
    },
    "runtime": "使用 Bun 作为 JavaScript 运行时环境"
  }
\`\`\`

---

--分隔符以上都是结果，也是常规的ai返回的结构，这种如何解析呢`;

console.log("=== AI 响应解析测试 ===\n");

// 解析函数 - 使用增强的JSONParser
function parseAIResponse(response) {
  return JSONParser.extractJSON(response);
}

// 执行解析
const result = parseAIResponse(aiResponse);

if (result) {
  console.log("🎉 AI 响应解析成功！\n");

  // 分析结果
  console.log("📊 项目信息摘要:");
  console.log(`  🎯 目标: ${result.target}`);
  console.log(`  📁 根目录: ${result.main_structure.root}`);
  console.log(`  📄 文件数量: ${Object.keys(result.main_structure.files).length}`);
  console.log(`  📦 依赖包数: ${Object.keys(result.main_structure.dependencies).length}`);
  console.log(`  🔧 运行时: ${result.main_structure.runtime}\n`);

  console.log("📋 文件列表:");
  Object.entries(result.main_structure.files).forEach(([file, desc]) => {
    console.log(`  📄 ${file}: ${desc}`);
  });

  console.log("\n📦 依赖包详情:");
  Object.entries(result.main_structure.dependencies).forEach(([pkg, version]) => {
    console.log(`  📦 ${pkg}: ${version}`);
  });

} else {
  console.log("❌ AI 响应解析失败");
}

console.log("\n" + "=".repeat(60) + "\n");

// 测试不同的 AI 响应格式
console.log("🧪 测试不同 AI 响应格式:\n");

// 测试格式1: 嵌入文本中的 JSON
const format1 = `根据你的要求，以下是项目配置：

${JSON.stringify(result)}

请确认配置是否正确。`;
console.log("格式1 - 嵌入 JSON:");
const result1 = parseAIResponse(format1);
console.log(result1 ? "✅ 解析成功" : "❌ 解析失败");

// 测试格式2: 自然语言 + 代码块
const format2 = `
我分析了你的项目，得到以下信息：

项目目标：${result.target}

项目结构：
\`\`\`json
{
  "root": "${result.main_structure.root}",
  "fileCount": ${Object.keys(result.main_structure.files).length}
}
\`\`\`

这是一个测试项目。
`;
console.log("\n格式2 - 自然语言 + 代码块:");
const result2 = parseAIResponse(format2);
console.log(result2 ? "✅ 解析成功" : "❌ 解析失败");

// 测试格式3: 纯代码块
const format3 = `\`\`\`json
${JSON.stringify(result, null, 2)}
\`\`\``;
console.log("\n格式3 - 纯代码块:");
const result3 = parseAIResponse(format3);
console.log(result3 ? "✅ 解析成功" : "❌ 解析失败");

// 测试格式4: 标记语言中的 JSON
const format4 = `response.start({
  "data": ${JSON.stringify(result)},
  "status": "success"
});`;
console.log("\n格式4 - 标记语言中的 JSON:");
const result4 = parseAIResponse(format4);
console.log(result4 ? "✅ 解析成功" : "❌ 解析失败");

console.log("\n" + "=".repeat(60));
console.log("🔍 解析策略总结:");
console.log("1. 优先解析代码块中的 JSON (最可靠)");
console.log("2. 尝试直接匹配 JSON 对象");
console.log("3. 检测键值对模式");
console.log("4. 多种格式的 AI 响应都能处理！");