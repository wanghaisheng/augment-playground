import { db } from '@/db-old';
import type { UILabelRecord } from '@/types';
import type { LabelsBundle } from '@/types/labels';

/**
 * 标签验证结果
 */
interface LabelValidationResult {
  /** 是否有效 */
  isValid: boolean;
  /** 错误信息 */
  errors: string[];
  /** 警告信息 */
  warnings: string[];
}

/**
 * 验证标签的完整性
 * @param scopeKey 标签作用域
 * @param languageCode 语言代码
 * @param requiredLabels 必需的标签键数组
 * @returns 标签验证结果
 */
export async function validateLabels(
  scopeKey: string,
  languageCode: string,
  requiredLabels: string[]
): Promise<LabelValidationResult> {
  const result: LabelValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  try {
    // 获取指定作用域和语言的所有标签
    const labels = await db.table('uiLabels')
      .where({ scopeKey, languageCode })
      .toArray();

    // 检查必需的标签是否存在
    const missingLabels = requiredLabels.filter(
      labelKey => !labels.some(label => label.labelKey === labelKey)
    );

    if (missingLabels.length > 0) {
      result.isValid = false;
      result.errors.push(
        `Missing required labels for scope ${scopeKey} in ${languageCode}: ${missingLabels.join(', ')}`
      );
    }

    // 检查标签格式
    for (const label of labels) {
      // 检查标签键格式
      if (!/^[a-z0-9_]+(\.[a-z0-9_]+)*$/.test(label.labelKey)) {
        result.warnings.push(
          `Invalid label key format in ${scopeKey}: ${label.labelKey}`
        );
      }

      // 检查翻译文本是否为空
      if (!label.translatedText.trim()) {
        result.warnings.push(
          `Empty translation for ${scopeKey}.${label.labelKey} in ${languageCode}`
        );
      }
    }

    // 检查是否有未使用的标签
    const unusedLabels = labels.filter(
      label => !requiredLabels.includes(label.labelKey)
    );

    if (unusedLabels.length > 0) {
      result.warnings.push(
        `Unused labels in ${scopeKey}: ${unusedLabels.map(l => l.labelKey).join(', ')}`
      );
    }

  } catch (error) {
    result.isValid = false;
    result.errors.push(`Error validating labels: ${error}`);
  }

  return result;
}

/**
 * 验证标签包的完整性
 * @param labelsBundle 标签包
 * @param scopeKey 标签作用域
 * @param languageCode 语言代码
 * @returns 标签验证结果
 */
export async function validateLabelsBundle(
  labelsBundle: LabelsBundle,
  scopeKey: string,
  languageCode: string
): Promise<LabelValidationResult> {
  const result: LabelValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  try {
    // 获取标签包中所有必需的标签键
    const requiredLabels = getRequiredLabelsFromBundle(labelsBundle);

    // 验证标签
    const validationResult = await validateLabels(
      scopeKey,
      languageCode,
      requiredLabels
    );

    // 合并结果
    result.isValid = validationResult.isValid;
    result.errors.push(...validationResult.errors);
    result.warnings.push(...validationResult.warnings);

  } catch (error) {
    result.isValid = false;
    result.errors.push(`Error validating labels bundle: ${error}`);
  }

  return result;
}

/**
 * 从标签包中获取所有必需的标签键
 */
function getRequiredLabelsFromBundle(labelsBundle: LabelsBundle): string[] {
  const requiredLabels: string[] = [];

  function traverse(obj: any, prefix: string = '') {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        requiredLabels.push(prefix ? `${prefix}.${key}` : key);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        traverse(obj[key], prefix ? `${prefix}.${key}` : key);
      }
    }
  }

  traverse(labelsBundle);
  return requiredLabels;
}

/**
 * 验证所有标签的完整性
 * @returns 标签验证结果
 */
export async function validateAllLabels(): Promise<LabelValidationResult> {
  const result: LabelValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  try {
    // 获取所有标签
    const allLabels = await db.table('uiLabels').toArray();

    // 按作用域和语言分组
    const labelGroups = allLabels.reduce((groups, label: UILabelRecord) => {
      const key = `${label.scopeKey}:${label.languageCode}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(label);
      return groups;
    }, {} as Record<string, UILabelRecord[]>);

    // 验证每个分组
    for (const [key, labels] of Object.entries(labelGroups)) {
      const [scopeKey, languageCode] = key.split(':');
      const requiredLabels = (labels as UILabelRecord[]).map((label: UILabelRecord) => label.labelKey);

      const validationResult = await validateLabels(
        scopeKey,
        languageCode,
        requiredLabels
      );

      if (!validationResult.isValid) {
        result.isValid = false;
      }
      result.errors.push(...validationResult.errors);
      result.warnings.push(...validationResult.warnings);
    }

  } catch (error) {
    result.isValid = false;
    result.errors.push(`Error validating all labels: ${error}`);
  }

  return result;
}

/**
 * 生成标签验证报告
 * @param result 标签验证结果
 * @returns 标签验证报告
 */
export function generateLabelValidationReport(result: LabelValidationResult): string {
  let report = '# 标签验证报告\n\n';

  // 添加验证状态
  report += `## 验证状态\n\n`;
  report += result.isValid ? '✅ 验证通过\n\n' : '❌ 验证失败\n\n';

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