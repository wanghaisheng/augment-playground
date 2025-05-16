/**
 * Script to fix explicit any types
 *
 * This script:
 * 1. Identifies explicit any types in the codebase
 * 2. Suggests appropriate replacements based on context
 * 3. Updates the files with the suggested replacements
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to extract explicit any types from lint output
function extractExplicitAnyFromLintOutput(lintOutput) {
  const explicitAnyRegex = /Unexpected any\. Specify a different type/g;
  const filePathRegex = /D:\\Download\\audio-visual\\heytcm\\pana-habit\\([^:]+)/g;

  const anyTypes = [];
  let currentFile = null;
  let currentLine = null;

  const lines = lintOutput.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const fileMatch = line.match(filePathRegex);
    if (fileMatch) {
      currentFile = fileMatch[0].replace('D:\\Download\\audio-visual\\heytcm\\pana-habit\\', '').replace(/\\/g, '/');
      const lineNumberMatch = line.match(/:(\d+):(\d+)/);
      if (lineNumberMatch) {
        currentLine = parseInt(lineNumberMatch[1], 10);
        currentColumn = parseInt(lineNumberMatch[2], 10);
      }
    }

    const anyMatch = line.match(explicitAnyRegex);
    if (anyMatch && currentFile && currentLine) {
      anyTypes.push({
        file: currentFile,
        line: currentLine,
        column: currentColumn
      });
    }
  }

  return anyTypes;
}

// Function to analyze context and suggest type replacement
function analyzeContextAndSuggestType(filePath, lineNumber, columnNumber) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const line = lines[lineNumber - 1];

    // Extract variable name and context
    const beforeAny = line.substring(0, columnNumber - 1).trim();
    const afterAny = line.substring(columnNumber + 2).trim(); // +2 to skip "any"

    // Common patterns and suggested replacements
    const patterns = [
      {
        pattern: /\(.*\):\s*any\s*=>/,
        replacement: 'unknown',
        description: 'Function parameter type'
      },
      {
        pattern: /:\s*any\[\]/,
        replacement: 'unknown[]',
        description: 'Array of unknown type'
      },
      {
        pattern: /Record<string,\s*any>/,
        replacement: 'Record<string, unknown>',
        description: 'Record with unknown values'
      },
      {
        pattern: /Promise<any>/,
        replacement: 'Promise<unknown>',
        description: 'Promise with unknown result'
      },
      {
        pattern: /as\s*any/,
        replacement: 'as unknown',
        description: 'Type assertion to unknown'
      },
      {
        pattern: /Map<.*,\s*any>/,
        replacement: 'Map<string, unknown>',
        description: 'Map with unknown values'
      },
      {
        pattern: /Set<any>/,
        replacement: 'Set<unknown>',
        description: 'Set of unknown type'
      },
      {
        pattern: /\(.*\):\s*any/,
        replacement: 'unknown',
        description: 'Function return type'
      }
    ];

    // Check for event handlers
    if (line.includes('event') || line.includes('onChange') || line.includes('onClick') || line.includes('onSubmit')) {
      return {
        original: 'any',
        suggestion: 'React.MouseEvent<HTMLElement> | React.ChangeEvent<HTMLInputElement>',
        description: 'Event handler type'
      };
    }

    // Check for common patterns
    for (const { pattern, replacement, description } of patterns) {
      if (pattern.test(line)) {
        return {
          original: 'any',
          suggestion: replacement,
          description
        };
      }
    }

    // Default suggestion
    return {
      original: 'any',
      suggestion: 'unknown',
      description: 'Generic unknown type'
    };
  } catch (error) {
    console.error(`Error analyzing ${filePath}:`, error);
    return {
      original: 'any',
      suggestion: 'unknown',
      description: 'Default replacement'
    };
  }
}

// Function to fix explicit any in a file
function fixExplicitAny(filePath, anyType) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    // Analyze context and suggest replacement
    const { original, suggestion, description } = analyzeContextAndSuggestType(filePath, anyType.line, anyType.column);

    // Replace any with the suggested type
    const line = lines[anyType.line - 1];
    const newLine = line.replace(/:\s*any\b/, `: ${suggestion}`).replace(/as\s+any\b/, `as ${suggestion}`);

    if (newLine !== line) {
      lines[anyType.line - 1] = newLine;
      fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
      console.log(`Fixed explicit any in ${filePath} at line ${anyType.line} (${description})`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error);
    return false;
  }
}

// Function to update progress in the typescript-fixes-progress.md file
function updateProgress(fixedCount) {
  const progressFilePath = path.join(__dirname, '..', 'docs', 'typescript-fixes-progress.md');

  try {
    let content = fs.readFileSync(progressFilePath, 'utf8');

    // Update the fixed count
    const currentFixedMatch = content.match(/\*\*已修复错误数:\*\* (\d+)/);
    if (currentFixedMatch) {
      const currentFixed = parseInt(currentFixedMatch[1], 10);
      const newFixed = currentFixed + fixedCount;
      content = content.replace(/\*\*已修复错误数:\*\* \d+/, `**已修复错误数:** ${newFixed}`);

      // Update remaining count
      const totalMatch = content.match(/\*\*总错误数:\*\* (\d+)/);
      if (totalMatch) {
        const total = parseInt(totalMatch[1], 10);
        const remaining = total - newFixed;
        content = content.replace(/\*\*剩余错误数:\*\* \d+/, `**剩余错误数:** ${remaining}`);

        // Update percentage
        const percentage = ((newFixed / total) * 100).toFixed(2);
        content = content.replace(/\*\*完成百分比:\*\* [\d.]+%/, `**完成百分比:** ${percentage}%`);
      }
    }

    // Update type compatibility section
    const typeCompatMatch = content.match(/### 类型兼容性问题\n- 总错误数: 约 (\d+)\n- 已修复: (\d+)\n- 剩余: 约 (\d+)/);
    if (typeCompatMatch) {
      const total = parseInt(typeCompatMatch[1], 10);
      const currentFixed = parseInt(typeCompatMatch[2], 10);
      const newFixed = currentFixed + fixedCount;
      const remaining = total - newFixed;

      content = content.replace(
        /### 类型兼容性问题\n- 总错误数: 约 \d+\n- 已修复: \d+\n- 剩余: 约 \d+/,
        `### 类型兼容性问题\n- 总错误数: 约 ${total}\n- 已修复: ${newFixed}\n- 剩余: 约 ${remaining}`
      );
    }

    fs.writeFileSync(progressFilePath, content, 'utf8');
    console.log(`Updated progress in ${progressFilePath}`);
  } catch (error) {
    console.error('Error updating progress:', error);
  }
}

// Main function
async function main() {
  try {
    // Run lint and capture output
    const lintOutput = execSync('npm run lint', { encoding: 'utf8' });

    // Extract explicit any types
    const anyTypes = extractExplicitAnyFromLintOutput(lintOutput);
    console.log(`Found ${anyTypes.length} explicit any types in ${new Set(anyTypes.map(a => a.file)).size} files`);

    // Fix explicit any types
    let totalFixed = 0;

    for (const anyType of anyTypes) {
      const fixed = fixExplicitAny(anyType.file, anyType);
      if (fixed) {
        totalFixed++;
      }
    }

    console.log(`Fixed ${totalFixed} explicit any types`);

    // Update progress
    updateProgress(totalFixed);

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
