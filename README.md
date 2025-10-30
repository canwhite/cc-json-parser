# @iamqc/cc-json-parser

[![npm version](https://badge.fury.io/js/@iamqc%2Fcc-json-parser.svg)](https://badge.fury.io/js/@iamqc%2Fcc-json-parser)
[![npm downloads](https://img.shields.io/npm/dm/@iamqc/cc-json-parser.svg)](https://www.npmjs.com/package/@iamqc/cc-json-parser)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

一个专门为处理 LLM 响应设计的强大 JSON 解析工具集，支持多种提取策略和智能容错。

## ✨ 特性

- 🚀 **多重提取策略** - 4层自动回退机制，确保最大成功率
- 🎯 **智能识别** - 自动识别 JSON 对象、代码块和自然语言描述
- 🛡️ **安全解析** - 内置错误处理和回退机制
- 🎮 **场景优化** - 专门针对游戏副本数据优化
- 📦 **批量处理** - 支持从文本中提取多个 JSON 对象
- 🔍 **数据验证** - 强大的 JSON 数据验证功能
- 🧹 **内容清理** - 自动清理 markdown 标记和格式化问题
- 📦 **NPM 包** - 开箱即用，支持 TypeScript

## 🚀 安装

```bash
# npm
npm install @iamqc/cc-json-parser

# yarn
yarn add @iamqc/cc-json-parser

# pnpm
pnpm add @iamqc/cc-json-parser

# bun
bun add @iamqc/cc-json-parser
```

## 🎯 快速开始

### 基础使用

```typescript
import { JSONParser } from '@iamqc/cc-json-parser';

const llmResponse = `
# AI 生成的副本数据

**副本名称**：火焰山副本
**副本难度**：困难

\`\`\`json
{
  "recommendedLevel": "30-35级",
  "playerCount": "3-5人"
}
\`\`\`
`;

// 使用最佳提取方法
const result = JSONParser.extractJSONEnhanced(llmResponse);
console.log(result);
// 输出: { recommendedLevel: "30-35级", playerCount: "3-5人" }
```

## 🎯 最佳实践

### 推荐：使用增强提取方法

```typescript
// 处理 LLM 响应的最佳选择
const result = JSONParser.extractJSONEnhanced(response);

// 游戏副本数据的专门提取
const scenario = JSONParser.extractScenarioData(gameResponse);

// 安全解析，避免程序崩溃
const safeResult = JSONParser.safeParse(jsonString, {
  fallback: { error: "解析失败" }
});
```

### 处理不同格式

```typescript
// 标准JSON
const result1 = JSONParser.extractJSONEnhanced('{"name": "张三"}');

// 代码块中的JSON
const result2 = JSONParser.extractJSONEnhanced('```json\n{"data": "value"}\n```');

// 嵌入文本的JSON
const result3 = JSONParser.extractJSONEnhanced('结果：{"status": "success"}');

// 纯自然语言描述
const result4 = JSONParser.extractJSONEnhanced('标题：测试\n描述：这是一个测试');
```

## 📚 文档和资源

- [📖 API 完整文档](https://github.com/iamqc/cc-json-parser/blob/main/docs/JSONParser-API-Documentation.md) - 所有接口和方法的详细说明
- [🔥 最佳提取方法指南](https://github.com/iamqc/cc-json-parser/blob/main/docs/Best-Extraction-Method.md) - 推荐的使用方法和示例
- [📋 快速参考](https://github.com/iamqc/cc-json-parser/blob/main/docs/Quick-Reference.md) - 方法速查表和使用模式
- [🏠 npm 包页面](https://www.npmjs.com/package/@iamqc/cc-json-parser) - npm 包信息和版本历史

## 🛠️ 开发

### 构建项目

```bash
# 生成类型声明文件
bun run build:types

# 构建项目
bun run build

# 开发模式
bun run dev
```

### 运行测试

```bash
# 运行测试用例
bun test

# 运行示例测试
bun run test-extraction.ts
```

## 🏗️ 项目结构

```
@iamqc/cc-json-parser/
├── src/
│   ├── jsonParser.ts      # 核心 JSON 解析类
│   ├── index.ts          # 导出文件
│   └── jsonParser.test.ts # 测试文件
├── docs/
│   ├── JSONParser-API-Documentation.md  # 完整 API 文档
│   ├── Best-Extraction-Method.md         # 最佳方法指南
│   └── Quick-Reference.md                # 快速参考
├── dist/                  # 构建输出（发布到 npm）
├── test-extraction.ts    # 提取示例
├── README.md             # 项目文档
└── LICENSE               # MIT 许可证
```

## 🎮 核心方法

### 提取方法

```typescript
JSONParser.extractJSON(text)                    // 基础 JSON 提取
JSONParser.extractJSONEnhanced(text)           // 🏆 推荐：多策略增强提取
JSONParser.extractScenarioData(text)           // 游戏剧本数据提取
JSONParser.extractDirectJSONObject(text)        // 直接 JSON 对象匹配
JSONParser.extractFromNaturalLanguage(text)    // 自然语言提取
JSONParser.extractFromCodeBlocks(text)          // 代码块提取
JSONParser.extractJSONArray(text)              // 批量数组提取
```

### 安全和验证

```typescript
JSONParser.safeParse(text, options)             // 安全 JSON 解析
JSONParser.validateJSON(data, schema)          // 数据验证
JSONParser.hasJSONStructure(text)               // JSON 结构检查
JSONParser.isLikelyNonJSON(text)                // 非JSON 内容检测
```

### 工具方法

```typescript
JSONParser.cleanJSONString(text)                // JSON 字符串清理
JSONParser.extractJSONCandidates(text)          // 候选 JSON 提取
```

## 💡 使用场景

### 1. LLM 响应解析
```typescript
const aiResponse = `
我为你生成了一个游戏副本：

\`\`\`json
{
  "name": "火焰山副本",
  "difficulty": "困难"
}
\`\`\`
`;

const gameData = JSONParser.extractJSONEnhanced(aiResponse);
```

### 2. 日志批量处理
```typescript
const logData = `
{"event": "login", "user": "user1", "time": "10:00"}
{"event": "purchase", "user": "user1", "item": "sword"}
{"event": "logout", "user": "user1", "time": "10:30"}
`;

const events = JSONParser.extractJSONArray(logData);
```

### 3. API 响应安全解析
```typescript
const apiResponse = getApiResponse(); // 可能返回无效 JSON
const result = JSONParser.safeParse(apiResponse, {
  fallback: { status: "error", message: "解析失败" }
});

if (result.success) {
  console.log("成功:", result.data);
} else {
  console.log("失败:", result.error);
}
```

## 🔧 TypeScript 支持

项目完全支持 TypeScript，提供完整的类型定义：

```typescript
import { JSONParser, type ParseResult, type ValidationSchema } from '@iamqc/cc-json-parser';

// 类型安全的解析
const result: ParseResult<UserData> = JSONParser.safeParse<UserData>(jsonString);

// 类型安全的数据验证
const schema: ValidationSchema = {
  name: { required: true, type: "string" },
  age: { required: true, type: "number" }
};
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🎯 发布信息

- **包名**: `@iamqc/cc-json-parser`
- **版本**: `1.0.0`
- **作者**: iamqc
- **许可证**: MIT
- **发布日期**: 2024-01-30

## 📞 反馈和支持

- 🐛 **报告问题**: [GitHub Issues](https://github.com/iamqc/cc-json-parser/issues)
- 💡 **功能请求**: [GitHub Discussions](https://github.com/iamqc/cc-json-parser/discussions)
- 📧 **联系作者**: [GitHub Profile](https://github.com/iamqc)

## 🙏 致谢

基于 [jsonrepair](https://github.com/josdejong/jsonrepair) 项目构建 JSON 修复功能。
