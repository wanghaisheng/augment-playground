/**
 * Script to check TypeScript errors in the project
 * 
 * This script runs the TypeScript compiler in noEmit mode and counts the number of errors.
 * It also categorizes the errors by type and provides a summary.
 * 
 * Usage:
 * node scripts/check-typescript-errors.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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
    const errorFile = path.join(__dirname, '../tsc-errors.txt');
    try {
      execSync('npx tsc --noEmit > tsc-errors.txt 2>&1', { stdio: 'inherit' });
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

// Main function
function main() {
  console.log('Checking TypeScript errors...');
  
  const errors = getTypeScriptErrors();
  
  if (errors.length === 0) {
    console.log('No TypeScript errors found!');
    return;
  }
  
  printErrorSummary(errors);
  
  // Save errors to a file for further analysis
  const errorSummaryFile = path.join(__dirname, '../typescript-error-summary.json');
  fs.writeFileSync(errorSummaryFile, JSON.stringify({
    totalErrors: errors.length,
    categories: categorizeErrors(errors),
    fileCategories: categorizeErrorsByFile(errors)
  }, null, 2));
  
  console.log(`Error summary saved to ${errorSummaryFile}`);
}

main();
