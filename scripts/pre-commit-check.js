/**
 * Pre-commit check script
 * 
 * This script runs TypeScript compiler and ESLint to check for errors before committing.
 * It can be used as a pre-commit hook to prevent committing code with errors.
 * 
 * Usage:
 * node scripts/pre-commit-check.js
 * 
 * To set up as a pre-commit hook:
 * 1. Create a file .git/hooks/pre-commit
 * 2. Add the following content:
 *    #!/bin/sh
 *    node scripts/pre-commit-check.js
 * 3. Make the file executable:
 *    chmod +x .git/hooks/pre-commit
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  // Whether to block commit if there are errors
  blockCommitOnError: true,
  // Whether to check only staged files
  checkOnlyStagedFiles: true,
  // Whether to run TypeScript check
  runTypeScriptCheck: true,
  // Whether to run ESLint check
  runESLintCheck: true,
  // Maximum number of errors to display
  maxErrorsToDisplay: 10
};

// Function to get staged files
function getStagedFiles() {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACMR').toString();
    return output.split('\n')
      .filter(file => file.trim() !== '')
      .filter(file => file.endsWith('.ts') || file.endsWith('.tsx'));
  } catch (error) {
    console.error('Error getting staged files:', error.message);
    return [];
  }
}

// Function to run TypeScript check
function runTypeScriptCheck(files) {
  console.log('\nRunning TypeScript check...');
  
  try {
    const filesToCheck = config.checkOnlyStagedFiles ? files : [];
    const fileArgs = filesToCheck.length > 0 ? filesToCheck.join(' ') : '';
    
    try {
      execSync(`npx tsc --noEmit ${fileArgs}`, { stdio: 'pipe' });
      console.log('TypeScript check passed!');
      return { success: true, errors: [] };
    } catch (error) {
      const errorOutput = error.stdout.toString();
      const errorLines = errorOutput.split('\n').filter(line => line.includes('error TS'));
      
      console.log(`TypeScript check failed with ${errorLines.length} errors.`);
      
      if (errorLines.length > 0) {
        console.log('\nSample errors:');
        errorLines.slice(0, config.maxErrorsToDisplay).forEach(line => {
          console.log(`  ${line}`);
        });
        
        if (errorLines.length > config.maxErrorsToDisplay) {
          console.log(`  ... and ${errorLines.length - config.maxErrorsToDisplay} more errors.`);
        }
      }
      
      return { success: false, errors: errorLines };
    }
  } catch (error) {
    console.error('Error running TypeScript check:', error.message);
    return { success: false, errors: [error.message] };
  }
}

// Function to run ESLint check
function runESLintCheck(files) {
  console.log('\nRunning ESLint check...');
  
  try {
    const filesToCheck = config.checkOnlyStagedFiles ? files : ['.'];
    const fileArgs = filesToCheck.join(' ');
    
    try {
      execSync(`npx eslint ${fileArgs} --max-warnings=0`, { stdio: 'pipe' });
      console.log('ESLint check passed!');
      return { success: true, errors: [] };
    } catch (error) {
      const errorOutput = error.stdout.toString();
      const errorLines = errorOutput.split('\n').filter(line => line.includes('error') || line.includes('warning'));
      
      console.log(`ESLint check failed with ${errorLines.length} issues.`);
      
      if (errorLines.length > 0) {
        console.log('\nSample issues:');
        errorLines.slice(0, config.maxErrorsToDisplay).forEach(line => {
          console.log(`  ${line}`);
        });
        
        if (errorLines.length > config.maxErrorsToDisplay) {
          console.log(`  ... and ${errorLines.length - config.maxErrorsToDisplay} more issues.`);
        }
      }
      
      return { success: false, errors: errorLines };
    }
  } catch (error) {
    console.error('Error running ESLint check:', error.message);
    return { success: false, errors: [error.message] };
  }
}

// Main function
function main() {
  console.log('Running pre-commit checks...');
  
  // Get staged files
  const stagedFiles = getStagedFiles();
  console.log(`Found ${stagedFiles.length} staged TypeScript files.`);
  
  let hasErrors = false;
  
  // Run TypeScript check
  if (config.runTypeScriptCheck) {
    const tsResult = runTypeScriptCheck(stagedFiles);
    hasErrors = hasErrors || !tsResult.success;
  }
  
  // Run ESLint check
  if (config.runESLintCheck) {
    const eslintResult = runESLintCheck(stagedFiles);
    hasErrors = hasErrors || !eslintResult.success;
  }
  
  // Block commit if there are errors
  if (hasErrors && config.blockCommitOnError) {
    console.log('\n❌ Pre-commit check failed. Please fix the errors before committing.');
    console.log('   You can run the following commands to fix errors:');
    console.log('   - node scripts/fix-typescript-errors.js');
    console.log('   - npx eslint --fix .');
    process.exit(1);
  } else {
    console.log('\n✅ Pre-commit check passed!');
  }
}

main();
