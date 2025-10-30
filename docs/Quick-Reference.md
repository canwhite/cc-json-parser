# JSONParser 快速参考

## 核心方法速查

### 🔧 基础提取
```typescript
JSONParser.extractJSON(text)              // 通用 JSON 提取
JSONParser.extractDirectJSONObject(text)   // 直接对象匹配
JSONParser.extractJSONArray(text)         // 批量数组提取
```

### 🚀 增强提取
```typescript
JSONParser.extractJSONEnhanced(text)       // 多策略增强提取
JSONParser.extractScenarioData(text)       // 剧本数据提取
JSONParser.extractFromNaturalLanguage(text) // 自然语言提取
JSONParser.extractFromCodeBlocks(text)     // 代码块提取
```

### 🛡️ 安全解析
```typescript
JSONParser.safeParse(text, { fallback, strict }) // 安全解析
```

### ✅ 验证检查
```typescript
JSONParser.validateJSON(data, schema)         // 数据验证
JSONParser.hasJSONStructure(text)              // 结构检查
JSONParser.isLikelyNonJSON(text)               // 非JSON检测
```

### 🧹 工具方法
```typescript
JSONParser.cleanJSONString(text)              // 字符串清理
JSONParser.extractJSONCandidates(text)        // 候选提取
```

## 使用场景

### 场景1: LLM 响应解析
```typescript
// 最佳选择
const result = JSONParser.extractJSONEnhanced(llmResponse);

// 或专门的剧本数据提取
const scenario = JSONParser.extractScenarioData(gameResponse);
```

### 场景2: 日志解析
```typescript
// 批量提取日志事件
const events = JSONParser.extractJSONArray(logData);
```

### 场景3: API 响应处理
```typescript
// 安全解析，避免崩溃
const result = JSONParser.safeParse(apiResponse, {
  fallback: { error: "解析失败" }
});
```

## 提取策略优先级

### `extractJSONEnhanced` 策略顺序:
1. 直接 JSON 解析
2. 直接 JSON 对象匹配
3. 自然语言信息提取
4. 代码块 JSON 解析

### `extractScenarioData` 策略顺序:
1. 标准 JSON 解析
2. 直接 JSON 对象匹配
3. 自然语言解析
4. 代码块解析

## 常见模式

### 模式1: 处理代码块
```typescript
const codeBlock = `
\`\`\`json
{"data": "value"}
\`\`\`
`;
const result = JSONParser.extractFromCodeBlocks(codeBlock);
```

### 模式2: 自然语言提取
```typescript
const nlText = `
标题：测试副本
描述：这是一个测试
内容：详情信息
`;
const result = JSONParser.extractFromNaturalLanguage(nlText);
// 结果: { title: "测试副本", description: "...", content: "..." }
```

### 模式3: 数据验证
```typescript
const schema = {
  name: { required: true, type: "string" },
  age: { required: true, type: "number" }
};
const validation = JSONParser.validateJSON(data, schema);
```

## 错误处理

### 推荐模式
```typescript
const result = JSONParser.safeParse(jsonString);
if (result.success) {
  // 使用 result.data
} else {
  // 处理 result.error
}
```

### 回退值
```typescript
const result = JSONParser.safeParse(jsonString, {
  fallback: { default: true }
});
```

## 性能提示

- 优先使用 `extractJSONEnhanced`，它内置了多种策略
- 对于已知格式，使用专门方法（如 `extractFromCodeBlocks`）
- 使用 `isLikelyNonJSON` 快速过滤明显非JSON内容
- 批量处理使用 `extractJSONArray`

## 调试技巧

### 启用日志
```typescript
// 许多方法内置了 console.log 输出
// 可以查看提取过程的详细信息
```

### 查看候选
```typescript
// 当提取失败时，查看候选结果
const candidates = JSONParser.extractJSONCandidates(text);
console.log(candidates);
```

### 验证结构
```typescript
// 检查文本是否包含JSON结构
const hasStructure = JSONParser.hasJSONStructure(text);
console.log("是否有JSON结构:", hasStructure);
```