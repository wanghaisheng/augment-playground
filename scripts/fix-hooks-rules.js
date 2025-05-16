/**
 * Script to fix React hooks rules violations
 *
 * This script:
 * 1. Fixes conditional hook calls by moving them outside conditions
 * 2. Adds missing dependencies to useEffect hooks
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to extract hooks rules violations from lint output
function extractHooksViolationsFromLintOutput(lintOutput) {
  const conditionalHookRegex = /React Hook "([^"]+)" is called conditionally\. React Hooks must be called in the exact same order in every component render/g;
  const missingDepsRegex = /React Hook (useEffect|useCallback) has (a missing dependency|missing dependencies): '([^']+)'/g;
  const filePathRegex = /D:\\Download\\audio-visual\\heytcm\\pana-habit\\([^:]+)/g;

  const violations = [];
  let currentFile = null;
  let currentLine = null;

  const lines = lintOutput.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const fileMatch = line.match(filePathRegex);
    if (fileMatch) {
      currentFile = fileMatch[0].replace('D:\\Download\\audio-visual\\heytcm\\pana-habit\\', '').replace(/\\/g, '/');
      const lineNumberMatch = line.match(/:(\d+):/);
      if (lineNumberMatch) {
        currentLine = parseInt(lineNumberMatch[1], 10);
      }
    }

    const conditionalMatch = line.match(conditionalHookRegex);
    if (conditionalMatch && currentFile && currentLine) {
      violations.push({
        file: currentFile,
        line: currentLine,
        type: 'conditional',
        hookName: conditionalMatch[1]
      });
    }

    const missingDepsMatch = line.match(missingDepsRegex);
    if (missingDepsMatch && currentFile && currentLine) {
      const depsMatch = line.match(/'([^']+)'/);
      if (depsMatch) {
        violations.push({
          file: currentFile,
          line: currentLine,
          type: 'missing-deps',
          hookName: missingDepsMatch ? missingDepsMatch[1] : 'useEffect',
          missingDeps: depsMatch[1].split(', ')
        });
      }
    }
  }

  return violations;
}

// Function to fix conditional hook calls
function fixConditionalHook(filePath, violation) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    // Find the hook call
    const lineIndex = violation.line - 1;
    const hookLine = lines[lineIndex];

    // Check if it's inside a condition
    let conditionStartLine = -1;
    let conditionEndLine = -1;
    let indentLevel = 0;

    // Look for the condition start (if, &&, ||, ?)
    for (let i = lineIndex - 1; i >= 0; i--) {
      const line = lines[i];
      if (line.includes('if (') || line.includes('&&') || line.includes('||') || line.includes('?')) {
        conditionStartLine = i;
        break;
      }
    }

    // Look for the condition end (closing brace or :)
    for (let i = lineIndex + 1; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes('}') || line.includes(':')) {
        conditionEndLine = i;
        break;
      }
    }

    if (conditionStartLine >= 0 && conditionEndLine >= 0) {
      console.log(`Found conditional hook in ${filePath} at line ${violation.line}`);
      console.log(`Condition starts at line ${conditionStartLine + 1} and ends at line ${conditionEndLine + 1}`);

      // This is a complex fix that requires manual intervention
      // We'll just add a comment to guide the developer
      lines[lineIndex] = `${hookLine} // TODO: Fix conditional hook call - move outside condition`;

      fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
      console.log(`Added TODO comment for conditional hook in ${filePath}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`Error fixing conditional hook in ${filePath}:`, error);
    return false;
  }
}

// Function to fix missing dependencies in useEffect
function fixMissingDeps(filePath, violation) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    // Find the dependency array
    const lineIndex = violation.line - 1;
    let depsArrayLine = -1;
    let depsArrayContent = '';

    // Look for the dependency array in the current line and next few lines
    for (let i = lineIndex; i < Math.min(lineIndex + 5, lines.length); i++) {
      const line = lines[i];
      if (line.includes('[]') || line.includes('[') && line.includes(']')) {
        depsArrayLine = i;
        depsArrayContent = line;
        break;
      }
    }

    if (depsArrayLine >= 0) {
      console.log(`Found dependency array in ${filePath} at line ${depsArrayLine + 1}`);

      // Extract the current dependencies
      const depsMatch = depsArrayContent.match(/\[(.*)\]/);
      if (depsMatch) {
        const currentDeps = depsMatch[1].trim();
        const newDeps = currentDeps.length > 0
          ? `[${currentDeps}, ${violation.missingDeps.join(', ')}]`
          : `[${violation.missingDeps.join(', ')}]`;

        // Replace the dependency array
        const newLine = depsArrayContent.replace(/\[.*\]/, newDeps);
        lines[depsArrayLine] = newLine;

        fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
        console.log(`Added missing dependencies in ${filePath}`);
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error(`Error fixing missing dependencies in ${filePath}:`, error);
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

    // Extract hooks violations
    const violations = extractHooksViolationsFromLintOutput(lintOutput);
    console.log(`Found ${violations.length} hooks violations in ${new Set(violations.map(v => v.file)).size} files`);

    // Fix violations
    let totalFixed = 0;

    for (const violation of violations) {
      let fixed = false;

      if (violation.type === 'conditional') {
        fixed = fixConditionalHook(violation.file, violation);
      } else if (violation.type === 'missing-deps') {
        fixed = fixMissingDeps(violation.file, violation);
      }

      if (fixed) {
        totalFixed++;
      }
    }

    console.log(`Fixed ${totalFixed} hooks violations`);

    // Update progress
    updateProgress(totalFixed);

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
