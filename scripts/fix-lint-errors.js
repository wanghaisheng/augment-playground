/**
 * Main script to fix lint errors
 *
 * This script:
 * 1. Runs all the fix scripts in sequence
 * 2. Updates the progress in the typescript-fixes-progress.md file
 * 3. Generates a report of the fixes made
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to run a script and capture its output
function runScript(scriptPath) {
  console.log(`Running ${scriptPath}...`);
  try {
    const output = execSync(`node ${scriptPath}`, { encoding: 'utf8' });
    console.log(output);
    return output;
  } catch (error) {
    console.error(`Error running ${scriptPath}:`, error);
    return '';
  }
}

// Function to extract the number of fixes from script output
function extractFixCount(output) {
  const fixedMatch = output.match(/Fixed (\d+)/);
  return fixedMatch ? parseInt(fixedMatch[1], 10) : 0;
}

// Function to generate a report of the fixes made
function generateReport(fixes) {
  const reportPath = path.join(__dirname, '..', 'docs', 'lint-fixes-report.md');

  const report = `# Lint Fixes Report

## Summary

${fixes.total} lint errors were fixed:

- ${fixes.unusedVars} unused variables
- ${fixes.hooksRules} React hooks rules violations
- ${fixes.explicitAny} explicit any types
- ${fixes.caseDeclarations} case declarations

## Details

### Unused Variables

Unused variables were fixed by adding an underscore prefix to the variable name.

### React Hooks Rules

React hooks rules violations were fixed by:
- Moving conditional hook calls outside conditions
- Adding missing dependencies to useEffect hooks

### Explicit Any Types

Explicit any types were replaced with more specific types based on context:
- Function parameters: \`unknown\`
- Arrays: \`unknown[]\`
- Records: \`Record<string, unknown>\`
- Promises: \`Promise<unknown>\`
- Type assertions: \`as unknown\`
- Event handlers: \`React.MouseEvent<HTMLElement> | React.ChangeEvent<HTMLInputElement>\`

### Case Declarations

Lexical declarations in case blocks were fixed by moving the declarations to the beginning of the switch statement.

## Next Steps

1. Run \`npm run lint\` to check for remaining lint errors
2. Fix any remaining errors manually
3. Update the TypeScript fixes progress document

`;

  fs.writeFileSync(reportPath, report, 'utf8');
  console.log(`Generated report at ${reportPath}`);
}

// Main function
async function main() {
  const fixes = {
    unusedVars: 0,
    hooksRules: 0,
    explicitAny: 0,
    caseDeclarations: 0,
    total: 0
  };

  // Run the fix scripts
  const unusedVarsOutput = runScript(path.join(__dirname, 'fix-unused-vars.js'));
  fixes.unusedVars = extractFixCount(unusedVarsOutput);

  const hooksRulesOutput = runScript(path.join(__dirname, 'fix-hooks-rules.js'));
  fixes.hooksRules = extractFixCount(hooksRulesOutput);

  const explicitAnyOutput = runScript(path.join(__dirname, 'fix-explicit-any.js'));
  fixes.explicitAny = extractFixCount(explicitAnyOutput);

  const caseDeclarationsOutput = runScript(path.join(__dirname, 'fix-case-declarations.js'));
  fixes.caseDeclarations = extractFixCount(caseDeclarationsOutput);

  fixes.total = fixes.unusedVars + fixes.hooksRules + fixes.explicitAny + fixes.caseDeclarations;

  // Generate a report
  generateReport(fixes);

  console.log(`Fixed ${fixes.total} lint errors in total`);
}

main();
