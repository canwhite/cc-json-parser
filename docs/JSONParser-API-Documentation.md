# JSONParser API 文档

## 概述

`JSONParser` 是一个专门用于处理 LLM 响应中 JSON 数据的强大工具集。它提供了多种提取策略，能够从各种格式的文本中智能提取和解析 JSON 数据。

## TypeScript 接口

### ParseResult<T>

```typescript
interface ParseResult<T = any> {
  success: boolean; // 解析是否成功
  data: T; // 解析后的数据
  error: string | null; // 错误信息，成功时为 null
}
```

### ValidationSchema

```typescript
interface ValidationSchema {
  [key: string]: {
    required?: boolean; // 是否必填
    type?: string; // 期望的数据类型
    validate?: (value: any) => boolean; // 自定义验证函数
  };
}
```

### ValidationResult

```typescript
interface ValidationResult {
  valid: boolean; // 验证是否通过
  errors: string[] | null; // 错误列表，通过时为 null
}
```

### JSONCandidate

```typescript
interface JSONCandidate {
  content: string; // JSON 字符串内容
  confidence: number; // 置信度 (0-1)
  source: string; // 来源标识
}
```

### SafeParseOptions

```typescript
interface SafeParseOptions {
  fallback?: any; // 解析失败时的回退值
  strict?: boolean; // 是否严格模式
}
```

### NaturalLanguageExtraction

```typescript
interface NaturalLanguageExtraction {
  title?: string; // 提取的标题
  description?: string; // 提取的描述
  content?: string; // 提取的内容
  [key: string]: any; // 其他自定义字段
}
```

## 静态方法

### 基础提取方法

#### `extractJSON(text: string): any | null`

**作用**: 从文本中提取 JSON 对象（增强版）

**参数**:

- `text`: 包含 JSON 的文本字符串

**返回值**: 解析后的 JSON 对象，失败时返回 `null`

**特点**:

- 支持代码块中的 JSON
- 支持对象/数组字面量匹配
- 支持键值对模式提取
- 包含多种容错机制

**示例**:

```typescript
const text = `
响应：
\`\`\`json
{"name": "张三", "age": 25}
\`\`\`
`;
const result = JSONParser.extractJSON(text);
// 返回: { name: "张三", "age": 25 }
```

---

### 增强提取方法

#### `extractJSONEnhanced(text: string): any | null`

**作用**: 综合多种策略的增强型 JSON 提取

**参数**:

- `text`: 要解析的文本

**返回值**: 解析结果，失败时返回 `null`

**提取策略顺序**:

1. 尝试直接 JSON 解析
2. 直接 JSON 对象匹配
3. 自然语言信息提取
4. 代码块 JSON 解析

**示例**:

```typescript
const text = `返回结果：{"status": "success"}`;
const result = JSONParser.extractJSONEnhanced(text);
// 返回: { status: "success" }
```

#### `extractDirectJSONObject(text: string): any | null`

**作用**: 直接匹配文本中的 JSON 对象

**参数**:

- `text`: 包含 JSON 对象的文本

**返回值**: 解析后的 JSON 对象

**特点**:

- 使用正则表达式 `\{[\s\S]*?\}` 匹配
- 自动处理嵌套对象

#### `extractFromNaturalLanguage(text: string): NaturalLanguageExtraction`

**作用**: 从自然语言中提取结构化信息

**参数**:

- `text`: 自然语言文本

**返回值**: 结构化的提取结果

**提取字段**:

- `title`: 从"副本标题"或"标题"字段提取
- `description`: 从"描述"字段提取，或取第一段有意义内容
- `content`: 从"详细内容"字段提取，或取主要内容

**示例**:

```typescript
const text = `
副本标题：暗影地牢
副本描述：一个危险的地下城
详细内容：推荐等级 25-30 级
`;
const result = JSONParser.extractFromNaturalLanguage(text);
// 返回: { title: "暗影地牢", description: "一个危险的地下城", content: "推荐等级 25-30 级" }
```

#### `extractFromCodeBlocks(text: string): any | null`

**作用**: 从 markdown 代码块中提取 JSON

**参数**:

- `text`: 包含代码块的文本

**返回值**: 解析后的 JSON 对象

**支持格式**:

- \`\`\`json\` ...\` \`\`\`
- \`\`\` ...\` \`\`\`

#### `extractScenarioData(response: string): any | null`

**作用**: 专门为场景副本设计的提取方法

**参数**:

- `response`: LLM 响应文本

**返回值**: 剧本数据对象

**提取策略**:

1. 标准 JSON 解析
2. 直接 JSON 对象匹配
3. 自然语言解析
4. 代码块解析

---

### 安全解析方法

#### `safeParse<T>(jsonString: string, options?: SafeParseOptions): ParseResult<T>`

**作用**: 安全的 JSON 解析，包含错误处理和回退机制

**泛型参数**:

- `T`: 期望的返回数据类型

**参数**:

- `jsonString`: 要解析的 JSON 字符串
- `options`: 解析选项

**返回值**: 包含解析结果的结构化对象

**特点**:

- 包含成功/失败状态
- 提供错误信息
- 支持回退值
- 支持严格模式

**示例**:

```typescript
const result = JSONParser.safeParse<{ name: string }>(jsonString, {
  fallback: { name: "默认值" },
  strict: false,
});

if (result.success) {
  console.log(result.data.name);
}
```

---

### 批量提取方法

#### `extractJSONArray(text: string): any[]`

**作用**: 从文本中提取 JSON 对象数组

**参数**:

- `text`: 包含多个 JSON 对象的文本

**返回值**: JSON 对象数组

**特点**:

- 支持代码块中的数组
- 支持全文对象匹配
- 自动过滤无效结果

**示例**:

```typescript
const text = `
\`\`\`json
[
  {"id": 1, "name": "张三"},
  {"id": 2, "name": "李四"}
]
\`\`\`
`;
const results = JSONParser.extractJSONArray(text);
// 返回: [{ id: 1, name: "张三" }, { id: 2, name: "李四" }]
```

#### `extractJSONCandidates(text: string): string[]`

**作用**: 提取所有可能的 JSON 候选字符串

**参数**:

- `text`: 原始文本

**返回值**: 按置信度排序的 JSON 字符串数组

**提取源**:

- 代码块 (置信度: 0.9)
- 大括号结构 (置信度: 0.7)
- 中括号结构 (置信度: 0.6)

---

### 验证和检查方法

#### `validateJSON(data: any, schema: ValidationSchema): ValidationResult`

**作用**: 验证 JSON 数据是否符合指定的模式

**参数**:

- `data`: 要验证的数据
- `schema`: 验证模式定义

**返回值**: 验证结果对象

**验证规则**:

- `required`: 检查必填字段
- `type`: 检查数据类型
- `validate`: 执行自定义验证

**示例**:

```typescript
const schema = {
  name: { required: true, type: "string" },
  age: { required: true, type: "number", validate: (v) => v >= 0 },
};

const data = { name: "张三", age: 25 };
const result = JSONParser.validateJSON(data, schema);
// 返回: { valid: true, errors: null }
```

#### `hasJSONStructure(text: string): boolean`

**作用**: 检查文本是否具有 JSON 结构特征

**参数**:

- `text`: 要检查的文本

**返回值**: 是否具有 JSON 结构

**检查条件**:

- 以 `{` 或 `[` 开头
- 以 `}` 或 `]` 结尾
- 包含基本 JSON 结构特征

#### `isLikelyNonJSON(text: string): boolean`

**作用**: 快速检测是否为非 JSON 内容

**参数**:

- `text`: 要检测的文本

**返回值**: 是否可能是非 JSON 内容

**检测规则**:

- 中文字符开头
- Python/JavaScript 代码模式
- Markdown 标题
- 函数/类定义

#### `isValidJSONStructure(data: any): boolean`

**作用**: 验证 JSON 结构是否有效

**参数**:

- `data`: 解析后的数据

**返回值**: 结构是否有效

---

### 工具方法

#### `cleanJSONString(text: string): string`

**作用**: 清理和标准化 JSON 字符串

**参数**:

- `text`: 原始文本

**返回值**: 清理后的文本

**清理操作**:

- 转义换行符、制表符
- 转义引号
- 去除首尾空格

#### `cleanContent(content: string): string`

**作用**: 私有方法，清理内容中的 markdown 标记

**参数**:

- `content`: 包含 markdown 的内容

**返回值**: 清理后的纯文本

**清理标记**:

- `#` 标题标记
- `**` 粗体标记
- `*` 列表标记
- 数字列表
- 多余空行

---

## 使用示例

### 基础使用

```typescript
import { JSONParser } from "./jsonParser";

// 简单 JSON 提取
const jsonStr = '{"name": "测试", "value": 123}';
const result = JSONParser.extractJSON(jsonStr);

// 安全解析
const safeResult = JSONParser.safeParse(jsonStr, {
  fallback: { error: "解析失败" },
});
```

### 处理 LLM 响应

```typescript
const response = `
# 副本创建成功

**副本标题**: 火焰山副本
**副本描述**: 一个充满熔岩的火山副本

\`\`\`json
{
  "difficulty": "困难",
  "recommendedLevel": "30-35",
  "rewards": ["史诗装备", "大量金币"]
}
\`\`\`
`;

// 使用增强提取
const enhanced = JSONParser.extractJSONEnhanced(response);
// 或使用专门的剧本数据提取
const scenario = JSONParser.extractScenarioData(response);
```

### 批量处理

```typescript
const logData = `
登录事件：{"event": "login", "user": "user1", "time": "10:00"}
购买事件：{"event": "purchase", "user": "user1", "item": "sword"}
登出事件：{"event": "logout", "user": "user1", "time": "10:30"}
`;

const events = JSONParser.extractJSONArray(logData);
// events 包含所有解析后的事件对象
```

### 数据验证

```typescript
const userSchema = {
  username: { required: true, type: "string" },
  age: { required: true, type: "number", validate: (v) => v >= 0 },
  email: { required: false, type: "string" },
};

const userData = { username: "张三", age: 25 };
const validation = JSONParser.validateJSON(userData, userSchema);

if (validation.valid) {
  console.log("数据验证通过");
} else {
  console.log("验证失败:", validation.errors);
}
```

## 最佳实践

1. **优先使用 `extractJSONEnhanced`**: 它综合了多种提取策略，成功率最高
2. **使用 `safeParse` 处理不可信输入**: 提供错误处理和回退机制
3. **为复杂数据定义验证模式**: 使用 `validateJSON` 确保数据结构正确
4. **针对特定场景使用专门方法**: 如 `extractScenarioData` 处理游戏副本数据
5. **合理使用提取结果数组**: `extractJSONArray` 可以处理多个 JSON 对象

## 注意事项

- 所有方法都是静态方法，直接通过 `JSONParser.methodName()` 调用
- 解析失败时会返回 `null` 或包含错误信息的结构化对象
- 自然语言提取依赖于特定的中文/英文关键词匹配
- 复杂嵌套结构可能需要多次调用或自定义处理逻辑
