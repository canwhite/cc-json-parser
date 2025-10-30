# 最佳 JSON 提取方法指南

## 🎯 推荐使用：`extractJSONEnhanced()`

### 为什么这是最佳选择？

`extractJSONEnhanced()` 是当前最强大和通用的 JSON 提取方法，它提供了**4层提取策略**，确保在各种情况下都能成功提取数据。

### 核心优势

✅ **多策略保障**：自动尝试4种不同的提取方法
✅ **智能回退**：一种方法失败，自动尝试下一种
✅ **通用性强**：处理各种 LLM 响应格式
✅ **容错性好**：即使格式不完美也能提取

### 提取策略顺序

1. **直接解析** - 尝试标准 JSON.parse()
2. **直接匹配** - 用正则表达式匹配 JSON 对象
3. **自然语言提取** - 从中文/英文描述中提取结构化信息
4. **代码块提取** - 从 markdown 代码块中提取 JSON

---

## 🚀 基础使用

```typescript
import { JSONParser } from './src/jsonParser.js';

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

**副本描述**：一个充满危险的火山副本。
`;

// 使用最佳提取方法
const result = JSONParser.extractJSONEnhanced(llmResponse);

console.log("提取结果：", result);
```

**输出结果可能为：**
```json
{
  "recommendedLevel": "30-35级",
  "playerCount": "3-5人"
}
```
**或者自然语言提取的结果：**
```json
{
  "title": "火焰山副本",
  "description": "一个充满危险的火山副本",
  "content": "**副本名称**：火焰山副本..."
}
```

---

## 📦 处理不同格式的例子

### 1. 标准 JSON
```typescript
const jsonStr = '{"name": "张三", "age": 25}';
const result = JSONParser.extractJSONEnhanced(jsonStr);
// ✅ 成功提取
```

### 2. 代码块中的 JSON
```typescript
const codeBlockText = `
响应内容：
\`\`\`json
{"status": "success", "data": {"id": 123}}
\`\`\`
`;
const result = JSONParser.extractJSONEnhanced(codeBlockText);
// ✅ 成功提取代码块中的JSON
```

### 3. 嵌入文本的 JSON
```typescript
const embeddedText = `处理结果：{"success": true, "message": "完成"} 时间：2024-01-01`;
const result = JSONParser.extractJSONEnhanced(embeddedText);
// ✅ 成功提取嵌入文本中的JSON
```

### 4. 纯自然语言描述
```typescript
const naturalText = `
# 副本创建成功

**副本标题**：暗影地牢
**副本描述**：一个神秘的地下城副本

详细内容：
- 推荐等级：25-30级
- 参与人数：2-4人
- Boss：暗影领主
`;
const result = JSONParser.extractJSONEnhanced(naturalText);
// ✅ 自动提取结构化信息
```

---

## 🛡️ 安全使用建议

### 推荐的工作流

```typescript
// 1. 使用增强提取
const extracted = JSONParser.extractJSONEnhanced(response);

// 2. 安全解析（可选）
const safeResult = JSONParser.safeParse(JSON.stringify(extracted || {}), {
  fallback: { error: "数据提取失败" }
});

if (safeResult.success) {
  // 使用提取的数据
  const data = safeResult.data;
  console.log("成功提取数据：", data);
} else {
  // 处理错误情况
  console.log("提取失败：", safeResult.error);
}
```

### 错误处理

```typescript
const result = JSONParser.extractJSONEnhanced(someText);

if (result) {
  // 成功提取
  console.log("提取成功：", result);
} else {
  // 提取失败
  console.log("未能提取到有效数据");
}
```

---

## 🎮 游戏副本数据的专门处理

如果确定处理的是游戏副本相关的 LLM 响应，可以使用专门的提取方法：

```typescript
const gameResponse = `
我为你生成了一个游戏副本：

副本名称：**神秘森林**
副本难度：**中等**
推荐等级：**20-25级**

副本内容：
这是一个充满魔法生物的古老森林...
`;

// 使用专门的剧本数据提取
const scenarioData = JSONParser.extractScenarioData(gameResponse);

console.log(scenarioData);
// 输出：
// {
//   title: "神秘森林",
//   description: "一个充满魔法生物的古老森林...",
//   content: "副本名称：**神秘森林**..."
// }
```

---

## 💡 使用技巧

### 1. 检查提取结果
```typescript
const result = JSONParser.extractJSONEnhanced(text);
console.log("提取结果：", result);

// 检查特定字段
if (result && result.name) {
  console.log("名称：", result.name);
}
```

### 2. 组合使用
```typescript
// 先尝试提取，如果失败则尝试其他方法
let data = JSONParser.extractJSONEnhanced(response);

if (!data) {
  // 回退到专门的剧本提取
  data = JSONParser.extractScenarioData(response);
}

if (!data) {
  // 最后的回退
  data = { error: "无法提取数据" };
}
```

### 3. 调试输出
```typescript
// 方法内部有 console.log 输出，可以看到提取过程
const result = JSONParser.extractJSONEnhanced(response);
// 控制台会显示使用了哪种提取策略
```

---

## 📝 总结

**`extractJSONEnhanced()` 是最佳选择，因为：**

1. **一次调用，多重保障** - 不需要自己尝试多种方法
2. **智能选择策略** - 根据内容自动选择最合适的提取方式
3. **容错性强** - 适应各种 LLM 输出格式
4. **使用简单** - 一个方法搞定大部分场景

**记住：** 当你需要从 LLM 响应中提取 JSON 数据时，首先考虑 `extractJSONEnhanced()`！