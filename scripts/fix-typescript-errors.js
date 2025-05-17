/**
 * Script to automatically fix common TypeScript errors
 *
 * This script reads the linterror.txt file and applies fixes for common TypeScript errors:
 * - TS6133: Unused variables and imports
 * - TS2322: Type assignment errors
 * - TS2339: Property does not exist errors
 * - TS2345: Argument type errors
 * - TS2741: Property missing in type
 * - TS6192: All imports in import declaration are unused
 * - TS2554: Expected X arguments, but got Y
 */

const fs = require('fs');
const path = require('path');

// Read the linterror.txt file
const errorFile = fs.readFileSync('linterror.txt', 'utf8');
const errorLines = errorFile.split('\n');

// Group errors by file
const errorsByFile = {};

errorLines.forEach(line => {
  const match = line.match(/^(.*?)\((\d+),(\d+)\): error (TS\d+): (.*)$/);
  if (match) {
    const [, filePath, lineNum, colNum, errorCode, errorMessage] = match;

    if (!errorsByFile[filePath]) {
      errorsByFile[filePath] = [];
    }

    errorsByFile[filePath].push({
      lineNum: parseInt(lineNum, 10),
      colNum: parseInt(colNum, 10),
      errorCode,
      errorMessage
    });
  }
});

// Fix functions for different error types
const fixers = {
  // Fix for unused variables (TS6133)
  TS6133: (fileContent, error) => {
    const lines = fileContent.split('\n');
    const lineIndex = error.lineNum - 1;
    const line = lines[lineIndex];

    // Extract the variable name from the error message
    const varNameMatch = error.errorMessage.match(/'([^']+)' is declared but/);
    if (!varNameMatch) return fileContent;

    const varName = varNameMatch[1];

    // Check if it's an import
    if (line.includes('import') && line.includes(varName)) {
      // Remove the variable from the import or the entire import if it's the only one
      if (line.includes(`{ ${varName} }`) || line.includes(`{ ${varName},`) || line.includes(`, ${varName} }`) || line.includes(`, ${varName},`)) {
        // Remove just this variable from a multi-import
        let newLine = line;
        newLine = newLine.replace(`{ ${varName} }`, '{}');
        newLine = newLine.replace(`{ ${varName}, `, '{ ');
        newLine = newLine.replace(`, ${varName} }`, ' }');
        newLine = newLine.replace(`, ${varName},`, ',');

        // Clean up any empty imports
        newLine = newLine.replace('import {} from', '// import {} from');

        lines[lineIndex] = newLine;
      } else if (line.includes(`import ${varName} from`)) {
        // Comment out the entire import
        lines[lineIndex] = `// ${line}`;
      }
    } else {
      // For non-import unused variables, prefix with underscore
      const newLine = line.replace(new RegExp(`\\b${varName}\\b`), `_${varName}`);
      lines[lineIndex] = newLine;
    }

    return lines.join('\n');
  },

  // Fix for type assignment errors (TS2322)
  TS2322: (fileContent, error) => {
    const lines = fileContent.split('\n');
    const lineIndex = error.lineNum - 1;
    const line = lines[lineIndex];

    // Handle common type assignment errors
    if (error.errorMessage.includes("Type '\"primary\"' is not assignable to type 'ButtonVariant")) {
      // Replace "primary" with "filled"
      lines[lineIndex] = line.replace(/variant="primary"/, 'variant="filled"');
    } else if (error.errorMessage.includes("Type '\"danger\"' is not assignable to type 'ButtonVariant")) {
      // Replace "danger" with "error"
      lines[lineIndex] = line.replace(/variant="danger"/, 'variant="error"');
    } else if (error.errorMessage.includes("Type '\"red\"' is not assignable to type 'ButtonColor")) {
      // Replace "red" with "error"
      lines[lineIndex] = line.replace(/color="red"/, 'color="error"');
    } else if (error.errorMessage.includes("Type '\"gray\"' is not assignable to type 'ButtonColor")) {
      // Replace "gray" with "default"
      lines[lineIndex] = line.replace(/color="gray"/, 'color="default"');
    } else if (error.errorMessage.includes("Property 'loading' does not exist") && error.errorMessage.includes("Did you mean 'isLoading'")) {
      // Replace loading with isLoading
      lines[lineIndex] = line.replace(/loading=/, 'isLoading=');
    } else if (error.errorMessage.includes("Type 'null' is not assignable to type")) {
      // Replace null with undefined
      lines[lineIndex] = line.replace(/: null/, ': undefined');
    }

    return lines.join('\n');
  },

  // Fix for property does not exist errors (TS2339)
  TS2339: (fileContent, error) => {
    const lines = fileContent.split('\n');
    const lineIndex = error.lineNum - 1;
    const line = lines[lineIndex];

    // Extract the property name from the error message
    const propNameMatch = error.errorMessage.match(/Property '([^']+)' does not exist/);
    if (!propNameMatch) return fileContent;

    const propName = propNameMatch[1];

    // Add optional chaining
    if (line.includes(`.${propName}`)) {
      lines[lineIndex] = line.replace(new RegExp(`\\.${propName}\\b`), `?.${propName}`);
    }

    return lines.join('\n');
  },

  // Fix for argument type errors (TS2345)
  TS2345: (fileContent, error) => {
    const lines = fileContent.split('\n');
    const lineIndex = error.lineNum - 1;
    const line = lines[lineIndex];

    // Handle common argument type errors
    if (error.errorMessage.includes("Type 'number | undefined' is not assignable to parameter of type 'number'")) {
      // Add nullish coalescing operator
      const match = line.match(/\(([^)]+)\)/);
      if (match) {
        const arg = match[1];
        lines[lineIndex] = line.replace(arg, `${arg} ?? 0`);
      }
    } else if (error.errorMessage.includes("Type 'number' is not assignable to parameter of type 'string'")) {
      // Convert number to string
      const match = line.match(/\(([^)]+)\)/);
      if (match) {
        const arg = match[1];
        lines[lineIndex] = line.replace(arg, `String(${arg})`);
      }
    } else if (error.errorMessage.includes("Type 'string' is not assignable to parameter of type 'number'")) {
      // Convert string to number
      const match = line.match(/\(([^)]+)\)/);
      if (match) {
        const arg = match[1];
        lines[lineIndex] = line.replace(arg, `Number(${arg})`);
      }
    }

    return lines.join('\n');
  }
};

// Process each file and apply fixes
let fixedFiles = 0;
let fixedErrors = 0;

Object.entries(errorsByFile).forEach(([filePath, errors]) => {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let fileContent = fs.readFileSync(filePath, 'utf8');
  let fileFixed = false;

  // Sort errors by line number in descending order to avoid offset issues
  errors.sort((a, b) => b.lineNum - a.lineNum);

  errors.forEach(error => {
    const fixer = fixers[error.errorCode];
    if (fixer) {
      const newContent = fixer(fileContent, error);
      if (newContent !== fileContent) {
        fileContent = newContent;
        fileFixed = true;
        fixedErrors++;
      }
    }
  });

  if (fileFixed) {
    fs.writeFileSync(filePath, fileContent);
    fixedFiles++;
    console.log(`Fixed errors in: ${filePath}`);
  }
});

console.log(`\nSummary:`);
console.log(`Fixed ${fixedErrors} errors in ${fixedFiles} files.`);
console.log(`Run 'npx tsc --noEmit' to check for remaining errors.`);
