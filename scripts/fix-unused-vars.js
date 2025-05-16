/**
 * Script to automatically fix unused variables by adding underscore prefix
 *
 * This script:
 * 1. Reads the lint output to identify unused variables
 * 2. Modifies the files to add underscore prefix to unused variables
 * 3. Updates the typescript-fixes-progress.md file with progress
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to extract unused variable information from lint output
function extractUnusedVarsFromLintOutput(lintOutput) {
  const unusedVarsRegex = /'([^']+)' is (assigned a value but never used|defined but never used)\. Allowed unused (vars|args) must match \/\^_\/u/g;
  const filePathRegex = /D:\\Download\\audio-visual\\heytcm\\pana-habit\\([^:]+)/g;

  const unusedVars = [];
  let currentFile = null;

  const lines = lintOutput.split('\n');

  for (const line of lines) {
    const fileMatch = line.match(filePathRegex);
    if (fileMatch) {
      currentFile = fileMatch[0].replace('D:\\Download\\audio-visual\\heytcm\\pana-habit\\', '').replace(/\\/g, '/');
    }

    const unusedMatch = line.match(unusedVarsRegex);
    if (unusedMatch && currentFile) {
      const varNameMatch = line.match(/'([^']+)'/);
      if (varNameMatch) {
        const varName = varNameMatch[1];
        const isAssigned = line.includes('assigned a value but never used');
        const isArg = line.includes('args must match');

        unusedVars.push({
          file: currentFile,
          varName,
          isAssigned,
          isArg
        });
      }
    }
  }

  return unusedVars;
}

// Function to fix unused variables in a file
function fixUnusedVarsInFile(filePath, unusedVars) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Group unused vars by file
    const fileUnusedVars = unusedVars.filter(v => v.file === filePath);

    for (const { varName, isAssigned, isArg } of fileUnusedVars) {
      // Different regex patterns based on variable type
      let regex;

      if (isArg) {
        // For function arguments
        regex = new RegExp(`(\\(|,\\s*)${varName}(\\s*[:,]|\\s*\\))`, 'g');
        content = content.replace(regex, (match, before, after) => {
          return `${before}_${varName}${after}`;
        });
      } else if (isAssigned) {
        // For assigned variables (like in useState, destructuring)
        regex = new RegExp(`(const|let|var)\\s+${varName}\\s*(,|=|:|\\))`, 'g');
        content = content.replace(regex, (match, before, after) => {
          return `${before} _${varName}${after}`;
        });

        // Also handle destructuring patterns
        regex = new RegExp(`(\\{[^\\}]*?)\\b${varName}\\b([^\\}]*?\\})`, 'g');
        content = content.replace(regex, (match, before, after) => {
          // Only replace if it's not already part of a renamed pattern
          if (!before.includes(`as ${varName}`) && !before.includes(`${varName}:`)) {
            return `${before}_${varName}${after}`;
          }
          return match;
        });
      } else {
        // For imported variables
        regex = new RegExp(`import\\s+\\{([^\\}]*)\\b${varName}\\b([^\\}]*)\\}\\s+from`, 'g');
        content = content.replace(regex, (match, before, after) => {
          // Only replace if it's not already part of a renamed import
          if (!before.includes(`as ${varName}`) && !after.includes(`as ${varName}`)) {
            return `import {${before}_${varName}${after}} from`;
          }
          return match;
        });
      }

      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed unused variables in ${filePath}`);
      return fileUnusedVars.length;
    }

    return 0;
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error);
    return 0;
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

    // Update unused declarations section
    const unusedDeclMatch = content.match(/### 未使用的声明\n- 总错误数: 约 (\d+)\n- 已修复: (\d+)\n- 剩余: 约 (\d+)/);
    if (unusedDeclMatch) {
      const total = parseInt(unusedDeclMatch[1], 10);
      const currentFixed = parseInt(unusedDeclMatch[2], 10);
      const newFixed = currentFixed + fixedCount;
      const remaining = total - newFixed;

      content = content.replace(
        /### 未使用的声明\n- 总错误数: 约 \d+\n- 已修复: \d+\n- 剩余: 约 \d+/,
        `### 未使用的声明\n- 总错误数: 约 ${total}\n- 已修复: ${newFixed}\n- 剩余: 约 ${remaining}`
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

    // Extract unused variables
    const unusedVars = extractUnusedVarsFromLintOutput(lintOutput);
    console.log(`Found ${unusedVars.length} unused variables in ${new Set(unusedVars.map(v => v.file)).size} files`);

    // Fix unused variables in files
    let totalFixed = 0;
    const processedFiles = new Set();

    for (const { file } of unusedVars) {
      if (!processedFiles.has(file)) {
        const fileUnusedVars = unusedVars.filter(v => v.file === file);
        const fixedCount = fixUnusedVarsInFile(file, fileUnusedVars);
        totalFixed += fixedCount;
        processedFiles.add(file);
      }
    }

    console.log(`Fixed ${totalFixed} unused variables in ${processedFiles.size} files`);

    // Update progress
    updateProgress(totalFixed);

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
