import { marked } from 'marked';
import { jsonrepair } from 'jsonrepair';

// 辅助接口定义
export interface ParseResult<T = any> {
  success: boolean;
  data: T;
  error: string | null;
}

export interface ValidationSchema {
  [key: string]: {
    required?: boolean;
    type?: string;
    validate?: (value: any) => boolean;
  };
}

export interface ValidationResult {
  valid: boolean;
  errors: string[] | null;
}

export interface JSONCandidate {
  content: string;
  confidence: number;
  source: string;
}

export interface SafeParseOptions {
  fallback?: any;
  strict?: boolean;
}

export interface NaturalLanguageExtraction {
  title?: string;
  description?: string;
  content?: string;
  [key: string]: any;
}

// 输入类型定义
export type InputType =
  | 'pure-json'           // 纯JSON字符串
  | 'markdown-codeblock'  // 包含JSON代码块的markdown
  | 'embedded-json'       // 文本中嵌入JSON
  | 'structured-text'     // 结构化文本（键值对）
  | 'natural-language'    // 自然语言描述
  | 'mixed-content'       // 混合内容
  | 'invalid-json';       // 无效JSON需要修复

/**
 * 终极JSON解析器 - 只需一个方法，解决所有问题
 * 专门设计用于处理LLM响应中的各种JSON格式
 */
export class JSONParser {
  /**
   * 终极JSON提取方法 - 智能识别输入类型并使用最优策略
   * @param text 要解析的文本
   * @returns 解析结果或null
   */
  static extractJSON(text: string): any | null {
    if (!text || typeof text !== 'string') return null;

    console.log("[JSONParser] 开始智能JSON提取...");

    // 1. 类型检测
    const inputType = this.detectInputType(text);
    console.log(`[JSONParser] 检测到输入类型: ${inputType}`);

    // 2. 根据类型选择最优策略
    switch (inputType) {
      case 'pure-json':
        console.log("[JSONParser] 使用策略: 直接解析");
        return this.tryDirectParse(text);

      case 'markdown-codeblock':
        console.log("[JSONParser] 使用策略: Markdown解析");
        return this.extractFromMarkdown(text) ||
               this.extractFromCodeBlocks(text) ||
               this.extractEmbeddedJSON(text);

      case 'embedded-json':
        console.log("[JSONParser] 使用策略: 嵌入JSON提取");
        return this.extractEmbeddedJSON(text) ||
               this.extractStructuredText(text) ||
               this.extractFromNaturalLanguage(text);

      case 'structured-text':
        console.log("[JSONParser] 使用策略: 结构化文本提取");
        return this.extractStructuredText(text) ||
               this.extractFromNaturalLanguage(text);

      case 'natural-language':
        console.log("[JSONParser] 使用策略: 自然语言提取");
        return this.extractFromNaturalLanguage(text);

      case 'mixed-content':
      case 'invalid-json':
      default:
        console.log("[JSONParser] 使用策略: 多重保障提取");
        return this.multiStrategyExtract(text);
    }
  }

  // ============ 类型检测 ============

  /**
   * 智能检测输入类型
   */
  private static detectInputType(text: string): InputType {
    const trimmed = text.trim();

    // 1. 检查是否是纯JSON
    if (this.isPureJSON(text)) return 'pure-json';

    // 2. 检查是否包含markdown代码块
    if (this.containsMarkdownCodeBlocks(text)) return 'markdown-codeblock';

    // 3. 检查是否嵌入JSON对象
    if (this.containsEmbeddedJSON(text)) return 'embedded-json';

    // 4. 检查是否是结构化文本
    if (this.isStructuredText(text)) return 'structured-text';

    // 5. 检查是否是自然语言
    if (this.isNaturalLanguage(text)) return 'natural-language';

    // 6. 默认混合内容
    return 'mixed-content';
  }

  /**
   * 检查是否是纯JSON
   */
  private static isPureJSON(text: string): boolean {
    const trimmed = text.trim();
    if (!trimmed) return false;

    const startsWithBrace = trimmed.startsWith('{');
    const endsWithBrace = trimmed.endsWith('}');
    const startsWithBracket = trimmed.startsWith('[');
    const endsWithBracket = trimmed.endsWith(']');

    if ((startsWithBrace && endsWithBrace) || (startsWithBracket && endsWithBracket)) {
      try {
        JSON.parse(trimmed);
        return true;
      } catch {
        return false;
      }
    }

    return false;
  }

  /**
   * 检查是否包含markdown代码块
   */
  private static containsMarkdownCodeBlocks(text: string): boolean {
    return /```(?:json|javascript|js)?\s*[\s\S]*?```/.test(text);
  }

  /**
   * 检查是否嵌入JSON对象
   */
  private static containsEmbeddedJSON(text: string): boolean {
    if (this.isPureJSON(text)) return false;

    const objectPattern = /\{[\s\S]*?\}/;
    const arrayPattern = /\[[\s\S]*?\}/;

    return objectPattern.test(text) || arrayPattern.test(text);
  }

  /**
   * 检查是否是结构化文本
   */
  private static isStructuredText(text: string): boolean {
    const patterns = [
      /["\w\u4e00-\u9fa5]+\s*[:=]\s*["\w\d\u4e00-\u9fa5]+/,
      /["\w\u4e00-\u9fa5]+\s*[:=]\s*\d+/,
      /["\w\u4e00-\u9fa5]+\s*[:=]\s*(true|false|null)/,
    ];
    return patterns.some(pattern => pattern.test(text));
  }

  /**
   * 检查是否是自然语言
   */
  private static isNaturalLanguage(text: string): boolean {
    if (this.containsEmbeddedJSON(text) || this.isPureJSON(text)) return false;

    const indicators = [
      /[\u4e00-\u9fa5]/,                          // 中文
      /^[A-Z]/,                                  // 英文大写开头
      /\b(is|are|was|were|have|has|the|this)\b/, // 英文常见词
      /(?:标题|描述|内容|详情|项目|副本)/,        // 中文关键词
    ];

    return indicators.some(pattern => pattern.test(text));
  }

  // ============ 核心提取方法 ============

  /**
   * 直接解析JSON
   */
  private static tryDirectParse(text: string): any | null {
    try {
      return JSON.parse(text.trim());
    } catch {
      try {
        const repaired = jsonrepair(text.trim());
        return JSON.parse(repaired);
      } catch {
        return null;
      }
    }
  }

  /**
   * 从Markdown中提取JSON
   */
  private static extractFromMarkdown(text: string): any | null {
    try {
      const tokens = marked.lexer(text);

      for (const token of tokens) {
        if (token.type === 'code') {
          const codeToken = token as any;
          const result = this.tryParseCodeBlock(codeToken.text);
          if (result) return result;
        }

        if (token.type === 'paragraph') {
          const paragraphToken = token as any;
          const result = this.tryExtractEmbeddedJSON(paragraphToken.text);
          if (result) return result;
        }
      }

      return null;
    } catch (error) {
      console.log("[JSONParser] Markdown解析失败:", error instanceof Error ? error.message : String(error));
      return null;
    }
  }

  /**
   * 从代码块中提取JSON
   */
  private static extractFromCodeBlocks(text: string): any | null {
    const patterns = [
      /```(?:json|javascript|js)?\s*([\s\S]*?)\s*```/g,
      /```\s*([\s\S]*?)\s*```/g,
    ];

    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const result = this.tryParseCodeBlock(match[1]);
        if (result) return result;
      }
    }

    return null;
  }

  /**
   * 提取嵌入的JSON
   */
  private static extractEmbeddedJSON(text: string): any | null {
    const patterns = [
      /\{[\s\S]*?\}/g,
      /\[[\s\S]*?\]/g,
      /(?:var|let|const)\s*\w*\s*=\s*(\{[\s\S]*?\})/g,
      /\w+\((\{[\s\S]*?\})\)/g,
    ];

    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const jsonStr = match[1] || match[0];
        const result = this.tryParseJSONString(jsonStr);
        if (result) return result;
      }
    }

    return null;
  }

  /**
   * 提取结构化文本
   */
  private static extractStructuredText(text: string): any | null {
    const keyValuePairs: Record<string, any> = {};

    const patterns = [
      /"([^"]+)"\s*:\s*"([^"]*)"/g,
      /"([^"]+)"\s*:\s*(\d+)/g,
      /"([^"]+)"\s*:\s*(true|false|null)/g,
      /([^:]+)\s*[:=]\s*"([^"]*)"/g,
      /([^:]+)\s*[:=]\s*(\d+)/g,
      /([^:]+)\s*[:=]\s*(true|false|null)/g,
    ];

    let foundPairs = false;

    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const key = match[1].trim().replace(/['"]/g, '');
        let value: any = match[2];

        if (value === 'true') value = true;
        else if (value === 'false') value = false;
        else if (value === 'null') value = null;
        else if (/^\d+$/.test(value)) value = parseInt(value);
        else if (/^\d+\.\d+$/.test(value)) value = parseFloat(value);

        keyValuePairs[key] = value;
        foundPairs = true;
      }
    }

    return foundPairs && Object.keys(keyValuePairs).length > 0 ? keyValuePairs : null;
  }

  /**
   * 从自然语言中提取
   */
  private static extractFromNaturalLanguage(text: string): NaturalLanguageExtraction | null {
    const result: NaturalLanguageExtraction = {};

    // 提取标题
    const titlePatterns = [
      /(?:标题|title|name)[:：]\s*([^\n]+)/i,
      /[#*]?\s*([^\n]+?)[：:]\s*[^\n]*/,
      /^#+\s*([^\n]+)/m,
    ];

    for (const pattern of titlePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        result.title = match[1].trim();
        break;
      }
    }

    // 提取描述
    const descPatterns = [
      /(?:描述|description|详情|内容)[:：]\s*([^\n]+)/i,
      /(?:这是一个|项目为|副本是)[：:]?\s*([^\n]+)/,
    ];

    for (const pattern of descPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        result.description = match[1].trim();
        break;
      }
    }

    // 如果没有找到描述，取第一段有意义的内容
    if (!result.description) {
      const lines = text.split('\n').filter(line => line.trim());
      for (const line of lines) {
        const cleanLine = line.replace(/^[#*\s]+/, '').trim();
        if (cleanLine && cleanLine.length > 10 && !cleanLine.includes('```')) {
          result.description = cleanLine;
          break;
        }
      }
    }

    result.content = text;

    return Object.keys(result).length > 1 ? result : null;
  }

  /**
   * 多策略提取（最后的保障）
   */
  private static multiStrategyExtract(text: string): any | null {
    const strategies = [
      () => this.extractFromMarkdown(text),
      () => this.extractFromCodeBlocks(text),
      () => this.extractEmbeddedJSON(text),
      () => this.extractStructuredText(text),
      () => this.extractFromNaturalLanguage(text),
    ];

    for (const strategy of strategies) {
      try {
        const result = strategy();
        if (result) return result;
      } catch {
        continue;
      }
    }

    return null;
  }

  // ============ 辅助方法 ============

  /**
   * 尝试解析代码块
   */
  private static tryParseCodeBlock(code: string): any | null {
    const trimmed = code.trim();
    if (!trimmed) return null;
    return this.tryParseJSONString(trimmed);
  }

  /**
   * 尝试提取嵌入JSON
   */
  private static tryExtractEmbeddedJSON(text: string): any | null {
    const jsonMatch = text.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
      return this.tryParseJSONString(jsonMatch[0]);
    }
    return null;
  }

  /**
   * 尝试解析JSON字符串
   */
  private static tryParseJSONString(jsonStr: string): any | null {
    try {
      return JSON.parse(jsonStr);
    } catch {
      try {
        const repaired = jsonrepair(jsonStr);
        return JSON.parse(repaired);
      } catch {
        return null;
      }
    }
  }

  // ============ 其他工具方法 ============

  /**
   * 安全的JSON解析
   */
  static safeParse<T>(jsonString: string, options?: SafeParseOptions): ParseResult<T> {
    try {
      const parsed = JSON.parse(jsonString);
      return {
        success: true,
        data: parsed,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: options?.fallback || null,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * 提取JSON数组
   */
  static extractJSONArray(text: string): any[] {
    const results: any[] = [];
    const arrayPattern = /\[[\s\S]*?\]/g;
    let match;

    while ((match = arrayPattern.exec(text)) !== null) {
      try {
        const parsed = JSON.parse(match[0]);
        if (Array.isArray(parsed)) {
          results.push(...parsed);
        }
      } catch {
        continue;
      }
    }

    return results;
  }

  /**
   * 验证JSON数据
   */
  static validateJSON(data: any, schema: ValidationSchema): ValidationResult {
    const errors: string[] = [];

    for (const [key, rules] of Object.entries(schema)) {
      if (rules.required && !(key in data)) {
        errors.push(`缺少必填字段: ${key}`);
        continue;
      }

      if (!(key in data)) continue;

      const value = data[key];

      if (rules.type && typeof value !== rules.type) {
        errors.push(`字段 ${key} 类型错误，期望 ${rules.type}，实际 ${typeof value}`);
      }

      if (rules.validate && !rules.validate(value)) {
        errors.push(`字段 ${key} 验证失败`);
      }
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : null,
    };
  }

  /**
   * 检查是否有JSON结构
   */
  static hasJSONStructure(text: string): boolean {
    return text.trim().startsWith('{') || text.trim().startsWith('[');
  }

  /**
   * 检查是否可能不是JSON
   */
  static isLikelyNonJSON(text: string): boolean {
    if (!text || text.length < 2) return true;

    const trimmed = text.trim();
    const nonJSONPatterns = [
      /^[\u4e00-\u9fa5]/, // 中文开头
      /^(function|class|const|let|var)\s/, // JS代码开头
      /^import\s/, // import语句
      /^export\s/, // export语句
      /^<[^>]+>/, // HTML标签
      /^(https?:|ftp:)/, // URL开头
    ];

    return nonJSONPatterns.some(pattern => pattern.test(trimmed));
  }

  /**
   * 清理JSON字符串
   */
  static cleanJSONString(text: string): string {
    return text
      .replace(/\n/g, '\\n')
      .replace(/\t/g, '\\t')
      .replace(/\r/g, '\\r')
      .trim();
  }

  /**
   * 提取所有可能的JSON候选
   */
  static extractJSONCandidates(text: string): string[] {
    const candidates: string[] = [];

    const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/g;
    let match;
    while ((match = codeBlockRegex.exec(text)) !== null) {
      candidates.push(match[1]);
    }

    const objectRegex = /\{[\s\S]*?\}/g;
    while ((match = objectRegex.exec(text)) !== null) {
      candidates.push(match[0]);
    }

    const arrayRegex = /\[[\s\S]*?\]/g;
    while ((match = arrayRegex.exec(text)) !== null) {
      candidates.push(match[0]);
    }

    return candidates;
  }
}