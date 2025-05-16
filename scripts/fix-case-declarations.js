/**
 * Script to fix no-case-declarations lint errors
 *
 * This script:
 * 1. Identifies lexical declarations in case blocks
 * 2. Moves the declarations to the beginning of the switch statement
 * 3. Updates the files with the fixed code
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to extract no-case-declarations from lint output
function extractCaseDeclarationsFromLintOutput(lintOutput) {
  const caseDeclarationRegex = /Unexpected lexical declaration in case block/g;
  const filePathRegex = /D:\\Download\\audio-visual\\heytcm\\pana-habit\\([^:]+)/g;

  const caseDeclarations = [];
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

    const declarationMatch = line.match(caseDeclarationRegex);
    if (declarationMatch && currentFile && currentLine) {
      caseDeclarations.push({
        file: currentFile,
        line: currentLine,
        column: currentColumn
      });
    }
  }

  return caseDeclarations;
}

// Function to fix case declarations in a file
function fixCaseDeclarations(filePath, declaration) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    // Find the case statement
    const lineIndex = declaration.line - 1;
    const caseLine = lines[lineIndex];

    // Find the switch statement
    let switchLineIndex = -1;
    for (let i = lineIndex - 1; i >= 0; i--) {
      if (lines[i].includes('switch (')) {
        switchLineIndex = i;
        break;
      }
    }

    if (switchLineIndex >= 0) {
      // Extract the declaration
      const declarationMatch = caseLine.match(/(const|let|var)\s+([a-zA-Z0-9_]+)\s*=/);
      if (declarationMatch) {
        const declarationType = declarationMatch[1];
        const variableName = declarationMatch[2];

        // Add the declaration before the switch statement
        const indent = lines[switchLineIndex].match(/^\s*/)[0];
        const newDeclaration = `${indent}${declarationType} ${variableName};`;
        lines.splice(switchLineIndex, 0, newDeclaration);

        // Update the case line to remove the declaration
        const newCaseLine = caseLine.replace(`${declarationType} ${variableName}`, variableName);
        lines[lineIndex + 1] = newCaseLine; // +1 because we inserted a line

        fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
        console.log(`Fixed case declaration in ${filePath} at line ${declaration.line}`);
        return true;
      }
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

    // Extract case declarations
    const caseDeclarations = extractCaseDeclarationsFromLintOutput(lintOutput);
    console.log(`Found ${caseDeclarations.length} case declarations in ${new Set(caseDeclarations.map(d => d.file)).size} files`);

    // Fix case declarations
    let totalFixed = 0;

    for (const declaration of caseDeclarations) {
      const fixed = fixCaseDeclarations(declaration.file, declaration);
      if (fixed) {
        totalFixed++;
      }
    }

    console.log(`Fixed ${totalFixed} case declarations`);

    // Update progress
    updateProgress(totalFixed);

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
