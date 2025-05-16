// src/utils/label-detector.ts
import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';

/**
 * 硬编码文本检测结果
 */
export interface HardcodedTextResult {
  /** 文件路径 */
  filePath: string;
  /** 行号 */
  line: number;
  /** 列号 */
  column: number;
  /** 硬编码文本 */
  text: string;
  /** 建议的标签键 */
  suggestedLabelKey: string;
  /** 建议的标签作用域 */
  suggestedScope: string;
}

/**
 * 检测文件中的硬编码文本
 * @param filePath 文件路径
 * @returns 硬编码文本检测结果数组
 */
export function detectHardcodedText(filePath: string): HardcodedTextResult[] {
  const sourceFile = ts.createSourceFile(
    filePath,
    fs.readFileSync(filePath, 'utf-8'),
    ts.ScriptTarget.Latest,
    true
  );

  const results: HardcodedTextResult[] = [];

  // 访问每个节点
  function visit(node: ts.Node) {
    // 检查字符串字面量
    if (ts.isStringLiteral(node)) {
      const text = node.text;
      
      // 跳过空字符串和单字符
      if (text.length <= 1) {
        return;
      }

      // 跳过注释中的文本
      if (isInComment(node, sourceFile)) {
        return;
      }

      // 跳过标签键和标签作用域
      if (isLabelKeyOrScope(node)) {
        return;
      }

      // 生成建议的标签键和作用域
      const { suggestedLabelKey, suggestedScope } = generateLabelSuggestion(node, sourceFile);

      results.push({
        filePath,
        line: sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1,
        column: sourceFile.getLineAndCharacterOfPosition(node.getStart()).character + 1,
        text,
        suggestedLabelKey,
        suggestedScope
      });
    }

    // 递归访问子节点
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return results;
}

/**
 * 检查节点是否在注释中
 */
function isInComment(node: ts.Node, sourceFile: ts.SourceFile): boolean {
  const nodeStart = node.getStart();
  const nodeEnd = node.getEnd();
  
  // 获取节点前的注释
  const comments = ts.getLeadingCommentRanges(sourceFile.text, nodeStart) || [];
  
  // 检查节点是否在注释范围内
  return comments.some(comment => {
    return nodeStart >= comment.pos && nodeEnd <= comment.end;
  });
}

/**
 * 检查节点是否是标签键或作用域
 */
function isLabelKeyOrScope(node: ts.Node): boolean {
  // 检查父节点是否是标签相关的属性
  const parent = node.parent;
  if (!parent) {
    return false;
  }

  // 检查是否是标签键或作用域属性
  if (ts.isPropertyAssignment(parent)) {
    const name = parent.name.getText();
    return name === 'labelKey' || name === 'scopeKey';
  }

  return false;
}

/**
 * 生成标签建议
 */
function generateLabelSuggestion(node: ts.Node, _sourceFile: ts.SourceFile): { suggestedLabelKey: string; suggestedScope: string } {
  // 获取组件或页面的名称
  let componentName = '';
  let current = node.parent;
  
  while (current) {
    if (ts.isClassDeclaration(current) || ts.isFunctionDeclaration(current)) {
      componentName = current.name?.getText() || '';
      break;
    }
    current = current.parent;
  }

  // 生成标签键
  const text = (node as ts.StringLiteral).text;
  const suggestedLabelKey = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

  // 生成作用域
  const suggestedScope = componentName
    ? `${componentName.charAt(0).toLowerCase() + componentName.slice(1)}View`
    : 'common';

  return { suggestedLabelKey, suggestedScope };
}

/**
 * 检测目录中的所有文件
 * @param dirPath 目录路径
 * @param fileExtensions 文件扩展名数组
 * @returns 硬编码文本检测结果数组
 */
export function detectHardcodedTextInDirectory(
  dirPath: string,
  fileExtensions: string[] = ['.tsx', '.ts']
): HardcodedTextResult[] {
  const results: HardcodedTextResult[] = [];

  function traverse(currentPath: string) {
    const files = fs.readdirSync(currentPath);

    for (const file of files) {
      const filePath = path.join(currentPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        traverse(filePath);
      } else if (fileExtensions.includes(path.extname(file))) {
        try {
          const fileResults = detectHardcodedText(filePath);
          results.push(...fileResults);
        } catch (error) {
          console.error(`Error processing file ${filePath}:`, error);
        }
      }
    }
  }

  traverse(dirPath);
  return results;
}

/**
 * 生成标签迁移报告
 * @param results 硬编码文本检测结果数组
 * @returns 标签迁移报告
 */
export function generateLabelMigrationReport(results: HardcodedTextResult[]): string {
  let report = '# 标签迁移报告\n\n';

  // 按文件分组
  const fileGroups = results.reduce((groups, result) => {
    if (!groups[result.filePath]) {
      groups[result.filePath] = [];
    }
    groups[result.filePath].push(result);
    return groups;
  }, {} as Record<string, HardcodedTextResult[]>);

  // 生成每个文件的报告
  for (const [filePath, fileResults] of Object.entries(fileGroups)) {
    report += `## ${filePath}\n\n`;
    report += '| 行号 | 列号 | 硬编码文本 | 建议的标签键 | 建议的作用域 |\n';
    report += '|------|------|------------|--------------|--------------|\n';

    for (const result of fileResults) {
      report += `| ${result.line} | ${result.column} | ${result.text} | ${result.suggestedLabelKey} | ${result.suggestedScope} |\n`;
    }

    report += '\n';
  }

  return report;
} 