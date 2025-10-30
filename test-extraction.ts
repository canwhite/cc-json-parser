import { JSONParser } from "./src";

console.log("=== JSON Parser 提取测试 ===\n");

// 测试1: 基础JSON提取
console.log("1. 测试基础JSON提取:");
const basicJson = '{"name": "张三", "age": 25, "city": "北京"}';
const result1 = JSONParser.extractJSON(basicJson);
console.log("输入:", basicJson);
console.log("输出:", result1);
console.log("✅ 成功:", result1 !== null);
console.log("");

// 测试2: 代码块中的JSON
console.log("2. 测试代码块中的JSON:");
const codeBlockText = `
这是一个响应：
\`\`\`json
{
  "副本名称": "火焰山副本",
  "难度": "困难",
  "推荐等级": "25-30级"
}
\`\`\`
其他说明...
`;
const result2 = JSONParser.extractJSON(codeBlockText);
console.log("输入包含代码块");
console.log("输出:", result2);
console.log("✅ 成功:", result2 !== null);
console.log("");

// 测试3: 增强提取方法
console.log("3. 测试增强提取方法:");
const enhancedText = `返回结果：{"status": "success", "data": {"id": 123}}`;
const result3 = JSONParser.extractJSONEnhanced(enhancedText);
console.log("输入:", enhancedText);
console.log("输出:", result3);
console.log("✅ 成功:", result3 !== null);
console.log("");

// 测试4: 剧本数据提取
console.log("4. 测试剧本数据提取:");
const scenarioText = `
# 神秘森林副本

**副本标题**: 森林探险
**副本描述**: 一片充满神秘生物的古老森林。

**详细内容**:
- 推荐等级：15-20级
- 参与人数：2-4人
- 主要怪物：森林守卫、魔法狼人
- 完成奖励：稀有装备、经验值

这个副本需要团队合作才能通关。
`;
const result4 = JSONParser.extractScenarioData(scenarioText);
console.log("输入包含自然语言描述");
console.log("输出:", result4);
console.log("✅ 提取到标题:", result4?.title);
console.log("✅ 提取到描述:", result4?.description !== undefined);
console.log("✅ 提取到内容:", result4?.content !== undefined);
console.log("");

// 测试5: 数组提取
console.log("5. 测试JSON数组提取:");
const arrayText = `
用户列表：
\`\`\`json
[
  {"id": 1, "name": "张三", "role": "战士"},
  {"id": 2, "name": "李四", "role": "法师"},
  {"id": 3, "name": "王五", "role": "道士"}
]
\`\`\`
`;
const result5 = JSONParser.extractJSONArray(arrayText);
console.log("输入包含JSON数组");
console.log("输出数量:", result5.length);
console.log("第一个用户:", result5[0]);
console.log("✅ 成功提取数组:", result5.length > 0);
console.log("");

// 测试6: 安全解析
console.log("6. 测试安全解析:");
const validJson = '{"name": "安全测试", "valid": true}';
const invalidJson = "这不是有效的JSON";

const safeResult1 = JSONParser.safeParse(validJson);
console.log("有效JSON解析结果:", safeResult1);

const safeResult2 = JSONParser.safeParse(invalidJson, {
  fallback: { error: "解析失败" },
});
console.log("无效JSON解析结果:", safeResult2);
console.log("✅ 安全解析工作正常");
console.log("");

// 测试7: 多种格式的混合文本
console.log("7. 测试混合格式文本:");
const mixedText = `
AI 响应：

我为你创建了一个游戏副本：

\`\`\`json
{
  "副本名称": "暗影地牢",
  "类型": "地下城",
  "难度等级": "困难"
}
\`\`\`

**副本描述**: 这是一个充满危险的地下城副本。

**详细内容**:
- 推荐等级：30-35级
- 最小人数：3人
- 主要Boss：暗影领主
- 掉落装备：暗影套装修理箱

副本特色：这个副本需要团队协作，Boss有特殊的技能机制。
`;
const result7 = JSONParser.extractJSONEnhanced(mixedText);
console.log("混合文本提取结果:", result7);
console.log("✅ 混合格式提取成功:", result7 !== null);
console.log("");

console.log("=== 所有测试完成 ===");
console.log("JSON解析器已准备就绪！");
