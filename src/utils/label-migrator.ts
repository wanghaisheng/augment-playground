// src/utils/label-migrator.ts
// import * as ts from 'typescript'; // Removed
import * as fs from 'fs';
import * as path from 'path';
import { db } from '@/db-old';
import type { UILabelRecord } from '@/types';
import { detectHardcodedText, type HardcodedTextResult } from './label-detector';

/**
 * 标签迁移结果
 */
interface LabelMigrationResult {
  /** 是否成功 */
  success: boolean;
  /** 错误信息 */
  errors: string[];
  /** 警告信息 */
  warnings: string[];
  /** 迁移的标签数量 */
  migratedLabelsCount: number;
  /** 迁移的文件数量 */
  migratedFilesCount: number;
}

/**
 * 迁移硬编码文本到标签系统
 * @param filePath 文件路径
 * @param results 硬编码文本检测结果
 * @returns 标签迁移结果
 */
export async function migrateHardcodedText(
  filePath: string,
  results: HardcodedTextResult[]
): Promise<LabelMigrationResult> {
  const migrationResult: LabelMigrationResult = {
    success: true,
    errors: [],
    warnings: [],
    migratedLabelsCount: 0,
    migratedFilesCount: 0
  };

  try {
    // 读取文件内容
    const sourceText = fs.readFileSync(filePath, 'utf-8');
    /* // Removed sourceFile declaration
    const sourceFile = ts.createSourceFile(
      filePath,
      sourceText,
      ts.ScriptTarget.Latest,
      true
    );
    */

    // 创建标签记录
    const labelRecords: UILabelRecord[] = [];
    const replacements: { start: number; end: number; text: string }[] = [];

    // 处理每个检测结果
    for (const result of results) {
      // 创建标签记录
      const labelRecord: UILabelRecord = {
        scopeKey: result.suggestedScope,
        labelKey: result.suggestedLabelKey,
        languageCode: 'en', // 默认使用英文
        translatedText: result.text
      };

      // 添加到标签记录数组
      labelRecords.push(labelRecord);

      // 创建替换文本
      const replacement = `labels.${result.suggestedLabelKey}`;
      replacements.push({
        start: result.column - 1,
        end: result.column + result.text.length - 1,
        text: replacement
      });
    }

    // 保存标签到数据库
    await db.table('uiLabels').bulkAdd(labelRecords);
    migrationResult.migratedLabelsCount += labelRecords.length;

    // 更新文件内容
    let newContent = sourceText;
    for (const replacement of replacements.reverse()) {
      newContent =
        newContent.slice(0, replacement.start) +
        replacement.text +
        newContent.slice(replacement.end);
    }

    // 写入文件
    fs.writeFileSync(filePath, newContent);
    migrationResult.migratedFilesCount++;

  } catch (error) {
    migrationResult.success = false;
    migrationResult.errors.push(`Error migrating file ${filePath}: ${error}`);
  }

  return migrationResult;
}

/**
 * 迁移目录中的所有文件
 * @param dirPath 目录路径
 * @param fileExtensions 文件扩展名数组
 * @returns 标签迁移结果
 */
export async function migrateDirectory(
  dirPath: string,
  fileExtensions: string[] = ['.tsx', '.ts']
): Promise<LabelMigrationResult> {
  const migrationResult: LabelMigrationResult = {
    success: true,
    errors: [],
    warnings: [],
    migratedLabelsCount: 0,
    migratedFilesCount: 0
  };

  try {
    // 检测硬编码文本
    const results = await detectHardcodedTextInDirectory(dirPath, fileExtensions);

    // 按文件分组
    const fileGroups = results.reduce((groups, result) => {
      if (!groups[result.filePath]) {
        groups[result.filePath] = [];
      }
      groups[result.filePath].push(result);
      return groups;
    }, {} as Record<string, HardcodedTextResult[]>);

    // 迁移每个文件
    for (const [filePath, fileResults] of Object.entries(fileGroups)) {
      const fileResult = await migrateHardcodedText(filePath, fileResults as HardcodedTextResult[]);

      if (!fileResult.success) {
        migrationResult.success = false;
      }
      migrationResult.errors.push(...fileResult.errors);
      migrationResult.warnings.push(...fileResult.warnings);
      migrationResult.migratedLabelsCount += fileResult.migratedLabelsCount;
      migrationResult.migratedFilesCount += fileResult.migratedFilesCount;
    }

  } catch (error) {
    migrationResult.success = false;
    migrationResult.errors.push(`Error migrating directory ${dirPath}: ${error}`);
  }

  return migrationResult;
}

/**
 * 生成标签迁移报告
 * @param result 标签迁移结果
 * @returns 标签迁移报告
 */
export function generateLabelMigrationReport(result: LabelMigrationResult): string {
  let report = '# 标签迁移报告\n\n';

  // 添加迁移状态
  report += `## 迁移状态\n\n`;
  report += result.success ? '✅ 迁移成功\n\n' : '❌ 迁移失败\n\n';

  // 添加迁移统计
  report += `## 迁移统计\n\n`;
  report += `- 迁移的标签数量: ${result.migratedLabelsCount}\n`;
  report += `- 迁移的文件数量: ${result.migratedFilesCount}\n\n`;

  // 添加错误信息
  if (result.errors.length > 0) {
    report += `## 错误\n\n`;
    for (const error of result.errors) {
      report += `- ${error}\n`;
    }
    report += '\n';
  }

  // 添加警告信息
  if (result.warnings.length > 0) {
    report += `## 警告\n\n`;
    for (const warning of result.warnings) {
      report += `- ${warning}\n`;
    }
    report += '\n';
  }

  return report;
}

/**
 * 检测目录中的硬编码文本
 * @param dirPath 目录路径
 * @param fileExtensions 文件扩展名数组
 * @returns 硬编码文本检测结果数组
 */
async function detectHardcodedTextInDirectory(
  dirPath: string,
  fileExtensions: string[] = ['.tsx', '.ts']
): Promise<HardcodedTextResult[]> {
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