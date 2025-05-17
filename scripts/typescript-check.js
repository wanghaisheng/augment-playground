/**
 * Script to check TypeScript errors and generate a report
 * 
 * This script runs the TypeScript compiler in noEmit mode and generates a report of errors.
 * It also tracks the progress of error fixes over time.
 * 
 * Usage:
 * node scripts/typescript-check.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  errorOutputFile: 'tsc-errors.txt',
  errorSummaryFile: 'typescript-error-summary.json',
  progressFile: 'docs/typescript-fixes-progress.md',
  historyFile: 'docs/typescript-error-history.json'
};

// Error type patterns
const ERROR_PATTERNS = {
  'TS6133': /TS6133: '(.+)' is declared but its value is never read/,
  'TS2322': /TS2322: Type '(.+)' is not assignable to type '(.+)'/,
  'TS2339': /TS2339: Property '(.+)' does not exist on type '(.+)'/,
  'TS2345': /TS2345: Argument of type '(.+)' is not assignable to parameter of type '(.+)'/,
  'TS2741': /TS2741: Property '(.+)' is missing in type '(.+)' but required in type '(.+)'/,
  'TS6192': /TS6192: All imports in import declaration are unused/,
  'TS2554': /TS2554: Expected (\d+) arguments, but got (\d+)/,
  'TS18048': /TS18048: '(.+)' is possibly '(.+)'/,
  'TS2307': /TS2307: Cannot find module '(.+)' or its corresponding type declarations/,
  'TS2532': /TS2532: Object is possibly '(.+)'/,
  'TS2769': /TS2769: No overload matches this call/,
  'TS2571': /TS2571: Object is of type 'unknown'/,
  'TS2304': /TS2304: Cannot find name '(.+)'/,
  'TS2531': /TS2531: Object is possibly 'null'/,
  'TS2538': /TS2538: Type '(.+)' cannot be used as an index type/,
  'Other': /.*/
};

// Function to run TypeScript compiler and get errors
function getTypeScriptErrors() {
  try {
    // Run TypeScript compiler in noEmit mode and redirect output to a file
    const errorFile = path.join(process.cwd(), config.errorOutputFile);
    try {
      execSync(`npx tsc --noEmit > ${config.errorOutputFile} 2>&1`, { stdio: 'inherit' });
    } catch (error) {
      // TypeScript compiler will exit with non-zero code if there are errors
      // We expect this, so we ignore the error
    }

    // Read the error file
    if (!fs.existsSync(errorFile)) {
      console.log('No TypeScript errors found!');
      return [];
    }

    const errorOutput = fs.readFileSync(errorFile, 'utf8');
    
    // Parse the error output
    const errors = [];
    const lines = errorOutput.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes('.tsx(') || line.includes('.ts(')) {
        // Extract file path, line, and column
        const fileMatch = line.match(/(.+\.tsx?)\((\d+),(\d+)\):/);
        if (!fileMatch) continue;
        
        const [, filePath, lineNum, colNum] = fileMatch;
        
        // Extract error code and message
        const errorMatch = line.match(/: error (TS\d+):/);
        if (!errorMatch) continue;
        
        const [, errorCode] = errorMatch;
        const errorMessage = line.substring(line.indexOf(errorCode) + errorCode.length + 1).trim();
        
        errors.push({
          filePath,
          lineNum: parseInt(lineNum),
          colNum: parseInt(colNum),
          errorCode,
          errorMessage
        });
      }
    }
    
    // Clean up the error file
    fs.unlinkSync(errorFile);
    
    return errors;
  } catch (error) {
    console.error('Error running TypeScript compiler:', error);
    return [];
  }
}

// Function to categorize errors by type
function categorizeErrors(errors) {
  const categories = {};
  
  for (const error of errors) {
    let matched = false;
    
    for (const [category, pattern] of Object.entries(ERROR_PATTERNS)) {
      if (category === 'Other') continue;
      
      if (error.errorCode === category || error.errorMessage.match(pattern)) {
        if (!categories[category]) {
          categories[category] = [];
        }
        categories[category].push(error);
        matched = true;
        break;
      }
    }
    
    if (!matched) {
      if (!categories['Other']) {
        categories['Other'] = [];
      }
      categories['Other'].push(error);
    }
  }
  
  return categories;
}

// Function to categorize errors by file
function categorizeErrorsByFile(errors) {
  const fileCategories = {};
  
  for (const error of errors) {
    if (!fileCategories[error.filePath]) {
      fileCategories[error.filePath] = [];
    }
    fileCategories[error.filePath].push(error);
  }
  
  return fileCategories;
}

// Function to print error summary
function printErrorSummary(errors) {
  console.log('\n=== TypeScript Error Summary ===\n');
  
  // Total errors
  console.log(`Total errors: ${errors.length}`);
  
  // Errors by type
  const categories = categorizeErrors(errors);
  console.log('\nErrors by type:');
  for (const [category, categoryErrors] of Object.entries(categories)) {
    console.log(`  ${category}: ${categoryErrors.length}`);
  }
  
  // Errors by file
  const fileCategories = categorizeErrorsByFile(errors);
  console.log('\nTop 10 files with most errors:');
  const sortedFiles = Object.entries(fileCategories)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 10);
  
  for (const [filePath, fileErrors] of sortedFiles) {
    console.log(`  ${filePath}: ${fileErrors.length} errors`);
  }
  
  console.log('\n=== End of Summary ===\n');
}

// Function to update error history
function updateErrorHistory(errors) {
  const historyFile = path.join(process.cwd(), config.historyFile);
  let history = [];
  
  if (fs.existsSync(historyFile)) {
    history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
  }
  
  const categories = categorizeErrors(errors);
  const categoryCounts = {};
  
  for (const [category, categoryErrors] of Object.entries(categories)) {
    categoryCounts[category] = categoryErrors.length;
  }
  
  history.push({
    date: new Date().toISOString(),
    totalErrors: errors.length,
    categories: categoryCounts
  });
  
  fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
}

// Function to update progress file
function updateProgressFile(errors) {
  const progressFile = path.join(process.cwd(), config.progressFile);
  
  if (!fs.existsSync(progressFile)) {
    console.log(`Progress file not found: ${progressFile}`);
    return;
  }
  
  let progressContent = fs.readFileSync(progressFile, 'utf8');
  
  // Update error counts
  const totalErrorsMatch = progressContent.match(/\*\*总错误数:\*\* (\d+)/);
  const fixedErrorsMatch = progressContent.match(/\*\*已修复错误数:\*\* (\d+)/);
  
  if (totalErrorsMatch && fixedErrorsMatch) {
    const initialTotal = parseInt(totalErrorsMatch[1], 10);
    const fixedErrors = parseInt(fixedErrorsMatch[1], 10);
    const remainingErrors = errors.length;
    const completionPercentage = Math.round((fixedErrors / (fixedErrors + remainingErrors)) * 100);
    
    progressContent = progressContent.replace(
      /\*\*总错误数:\*\* \d+/,
      `**总错误数:** ${fixedErrors + remainingErrors}`
    );
    
    progressContent = progressContent.replace(
      /\*\*已修复错误数:\*\* \d+/,
      `**已修复错误数:** ${fixedErrors}`
    );
    
    progressContent = progressContent.replace(
      /\*\*剩余错误数:\*\* \d+/,
      `**剩余错误数:** ${remainingErrors}`
    );
    
    progressContent = progressContent.replace(
      /\*\*完成百分比:\*\* [\d.]+%/,
      `**完成百分比:** ${completionPercentage}%`
    );
    
    // Update check date
    progressContent = progressContent.replace(
      /\*\*最新检查时间:\*\* .+/,
      `**最新检查时间:** ${new Date().toISOString().split('T')[0]}`
    );
    
    fs.writeFileSync(progressFile, progressContent);
  }
}

// Function to save error summary
function saveErrorSummary(errors) {
  const errorSummaryFile = path.join(process.cwd(), config.errorSummaryFile);
  
  fs.writeFileSync(errorSummaryFile, JSON.stringify({
    totalErrors: errors.length,
    categories: categorizeErrors(errors),
    fileCategories: categorizeErrorsByFile(errors)
  }, null, 2));
  
  console.log(`Error summary saved to ${errorSummaryFile}`);
}

// Main function
function main() {
  console.log('Checking TypeScript errors...');
  
  const errors = getTypeScriptErrors();
  
  if (errors.length === 0) {
    console.log('No TypeScript errors found!');
    return;
  }
  
  printErrorSummary(errors);
  updateErrorHistory(errors);
  updateProgressFile(errors);
  saveErrorSummary(errors);
  
  console.log(`Run 'node scripts/fix-typescript-errors.js' to automatically fix common errors.`);
}

main();
