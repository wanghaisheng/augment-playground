import { db } from '@/db-old';
import type { UILabelRecord } from '@/types';

/**
 * 标签文档生成选项
 */
interface LabelDocGeneratorOptions {
  /** 是否包含示例 */
  includeExamples?: boolean;
  /** 是否包含类型定义 */
  includeTypeDefinitions?: boolean;
  /** 是否包含使用说明 */
  includeUsageGuide?: boolean;
  /** 是否包含迁移指南 */
  includeMigrationGuide?: boolean;
}

/**
 * 生成标签文档
 * @param options 文档生成选项
 * @returns 标签文档
 */
export async function generateLabelDocumentation(
  options: LabelDocGeneratorOptions = {}
): Promise<string> {
  const {
    includeExamples = true,
    includeTypeDefinitions = true,
    includeUsageGuide = true,
    includeMigrationGuide = true
  } = options;

  let doc = '# 标签系统文档\n\n';

  // 添加概述
  doc += `## 概述\n\n`;
  doc += `本文档描述了项目中的标签系统，包括标签的类型定义、使用方法和迁移指南。\n\n`;

  // 添加标签列表
  doc += await generateLabelList();

  // 添加类型定义
  if (includeTypeDefinitions) {
    doc += await generateTypeDefinitions();
  }

  // 添加使用说明
  if (includeUsageGuide) {
    doc += await generateUsageGuide();
  }

  // 添加示例
  if (includeExamples) {
    doc += await generateExamples();
  }

  // 添加迁移指南
  if (includeMigrationGuide) {
    doc += await generateMigrationGuide();
  }

  return doc;
}

/**
 * 生成标签列表
 */
async function generateLabelList(): Promise<string> {
  let doc = `## 标签列表\n\n`;

  try {
    // 获取所有标签
    const allLabels = await db.table('uiLabels').toArray();

    // 按作用域分组
    const scopeGroups = allLabels.reduce((groups: Record<string, UILabelRecord[]>, label: UILabelRecord) => {
      if (!groups[label.scopeKey]) {
        groups[label.scopeKey] = [];
      }
      groups[label.scopeKey].push(label);
      return groups;
    }, {} as Record<string, UILabelRecord[]>);

    // 生成每个作用域的文档
    for (const [scopeKey, labels] of Object.entries(scopeGroups) as [string, UILabelRecord[]][]) {
      doc += `### ${scopeKey}\n\n`;
      doc += `| 标签键 | 英文 | 中文 |\n`;
      doc += `|--------|------|------|\n`;

      // 按标签键分组
      const labelGroups = labels.reduce((groups: Record<string, Record<string, string>>, label: UILabelRecord) => {
        if (!groups[label.labelKey]) {
          groups[label.labelKey] = {};
        }
        groups[label.labelKey][label.languageCode] = label.translatedText;
        return groups;
      }, {} as Record<string, Record<string, string>>);

      // 生成每个标签的文档
      for (const [labelKey, translations] of Object.entries(labelGroups) as [string, Record<string, string>][]) {
        doc += `| ${labelKey} | ${translations['en'] || ''} | ${translations['zh'] || ''} |\n`;
      }

      doc += '\n';
    }

  } catch (error) {
    doc += `Error generating label list: ${error}\n\n`;
  }

  return doc;
}

/**
 * 生成类型定义
 */
async function generateTypeDefinitions(): Promise<string> {
  let doc = `## 类型定义\n\n`;

  try {
    // 获取所有标签
    const allLabels = await db.table('uiLabels').toArray();

    // 按作用域分组
    const scopeGroups = allLabels.reduce((groups: Record<string, UILabelRecord[]>, label: UILabelRecord) => {
      if (!groups[label.scopeKey]) {
        groups[label.scopeKey] = [];
      }
      groups[label.scopeKey].push(label);
      return groups;
    }, {} as Record<string, UILabelRecord[]>);

    // 生成每个作用域的类型定义
    for (const [scopeKey, labels] of Object.entries(scopeGroups) as [string, UILabelRecord[]][]) {
      doc += `### ${scopeKey}\n\n`;
      doc += '```typescript\n';
      doc += `interface ${scopeKey}Labels {\n`;

      // 按标签键分组
      const labelGroups = labels.reduce((groups: Record<string, boolean>, label: UILabelRecord) => {
        if (!groups[label.labelKey]) {
          groups[label.labelKey] = true;
        }
        return groups;
      }, {} as Record<string, boolean>);

      // 生成每个标签的类型定义
      for (const labelKey of Object.keys(labelGroups)) {
        doc += `  ${labelKey}: string;\n`;
      }

      doc += '}\n';
      doc += '```\n\n';
    }

  } catch (error) {
    doc += `Error generating type definitions: ${error}\n\n`;
  }

  return doc;
}

/**
 * 生成使用说明
 */
async function generateUsageGuide(): Promise<string> {
  let doc = `## 使用说明\n\n`;

  doc += `### 在组件中使用标签\n\n`;
  doc += '```typescript\n';
  doc += `import { useComponentLabels } from '@/hooks/useComponentLabels';\n\n`;
  doc += `function MyComponent() {\n`;
  doc += `  const { labels } = useComponentLabels();\n\n`;
  doc += `  return (\n`;
  doc += `    <div>\n`;
  doc += `      <h1>{labels.title}</h1>\n`;
  doc += `      <p>{labels.description}</p>\n`;
  doc += `    </div>\n`;
  doc += `  );\n`;
  doc += `}\n`;
  doc += '```\n\n';

  doc += `### 在页面中使用标签\n\n`;
  doc += '```typescript\n';
  doc += `import { useLocalizedView } from '@/hooks/useLocalizedView';\n\n`;
  doc += `function MyPage() {\n`;
  doc += `  const { labels } = useLocalizedView('myPageView', fetchMyPageView);\n\n`;
  doc += `  return (\n`;
  doc += `    <div>\n`;
  doc += `      <h1>{labels.pageTitle}</h1>\n`;
  doc += `      <p>{labels.welcomeMessage}</p>\n`;
  doc += `    </div>\n`;
  doc += `  );\n`;
  doc += `}\n`;
  doc += '```\n\n';

  return doc;
}

/**
 * 生成示例
 */
async function generateExamples(): Promise<string> {
  let doc = `## 示例\n\n`;

  doc += `### 组件标签示例\n\n`;
  doc += '```typescript\n';
  doc += `// 定义组件标签接口\n`;
  doc += `interface MyComponentLabels {\n`;
  doc += `  title: string;\n`;
  doc += `  description: string;\n`;
  doc += `  buttonText: string;\n`;
  doc += `}\n\n`;
  doc += `// 使用组件标签\n`;
  doc += `function MyComponent() {\n`;
  doc += `  const { labels } = useComponentLabels<MyComponentLabels>();\n\n`;
  doc += `  return (\n`;
  doc += `    <div>\n`;
  doc += `      <h1>{labels.title}</h1>\n`;
  doc += `      <p>{labels.description}</p>\n`;
  doc += `      <button>{labels.buttonText}</button>\n`;
  doc += `    </div>\n`;
  doc += `  );\n`;
  doc += `}\n`;
  doc += '```\n\n';

  doc += `### 页面标签示例\n\n`;
  doc += '```typescript\n';
  doc += `// 定义页面标签接口\n`;
  doc += `interface MyPageLabels {\n`;
  doc += `  pageTitle: string;\n`;
  doc += `  welcomeMessage: string;\n`;
  doc += `  sectionTitle: string;\n`;
  doc += `}\n\n`;
  doc += `// 使用页面标签\n`;
  doc += `function MyPage() {\n`;
  doc += `  const { labels } = useLocalizedView<null, MyPageLabels>(\n`;
  doc += `    'myPageView',\n`;
  doc += `    fetchMyPageView\n`;
  doc += `  );\n\n`;
  doc += `  return (\n`;
  doc += `    <div>\n`;
  doc += `      <h1>{labels.pageTitle}</h1>\n`;
  doc += `      <p>{labels.welcomeMessage}</p>\n`;
  doc += `      <h2>{labels.sectionTitle}</h2>\n`;
  doc += `    </div>\n`;
  doc += `  );\n`;
  doc += `}\n`;
  doc += '```\n\n';

  return doc;
}

/**
 * 生成迁移指南
 */
async function generateMigrationGuide(): Promise<string> {
  let doc = `## 迁移指南\n\n`;

  doc += `### 从硬编码文本迁移到标签系统\n\n`;
  doc += `1. 使用标签检测工具检测硬编码文本\n`;
  doc += `2. 使用标签迁移工具自动迁移硬编码文本\n`;
  doc += `3. 手动检查和调整迁移结果\n\n`;

  doc += `### 迁移步骤\n\n`;
  doc += `1. 检测硬编码文本\n`;
  doc += '```typescript\n';
  doc += `import { detectHardcodedText } from '@/utils/label-detector';\n\n`;
  doc += `const results = detectHardcodedText('path/to/file.tsx');\n`;
  doc += '```\n\n';

  doc += `2. 迁移硬编码文本\n`;
  doc += '```typescript\n';
  doc += `import { migrateHardcodedText } from '@/utils/label-migrator';\n\n`;
  doc += `const result = await migrateHardcodedText('path/to/file.tsx', results);\n`;
  doc += '```\n\n';

  doc += `3. 生成迁移报告\n`;
  doc += '```typescript\n';
  doc += `import { generateLabelMigrationReport } from '@/utils/label-migrator';\n\n`;
  doc += `const report = generateLabelMigrationReport(result);\n`;
  doc += '```\n\n';

  return doc;
} 