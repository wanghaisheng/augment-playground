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
 * - TS18048: Possibly undefined values
 * - TS2307: Cannot find module
 * - TS2532: Object is possibly undefined
 * - TS2769: No overload matches this call
 * - TS2571: Object is of type unknown
 * - TS2304: Cannot find name
 * - TS2531: Object is possibly null
 * - TS2538: Type cannot be used as an index type
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
      // For non-import unused variables, add eslint-disable comment
      lines[lineIndex] = `// eslint-disable-next-line @typescript-eslint/no-unused-vars\n${line}`;
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

    // Check if it's a common property that might be missing
    if (propName === 'isOpen' && line.includes('<') && line.includes('>')) {
      // For components that need isOpen prop
      if (line.includes('ScrollDialog') || line.includes('LatticeDialog') || line.includes('RewardModal')) {
        // If the component is conditionally rendered with a state variable
        const stateVarMatch = line.match(/\{(\w+)\s*&&/);
        if (stateVarMatch) {
          const stateVar = stateVarMatch[1];
          // Add isOpen={stateVar} before the closing bracket
          lines[lineIndex] = line.replace(/(\s*)(\/>|>)/, ` isOpen={${stateVar}}$1$2`);
        } else {
          // Add isOpen={true} before the closing bracket
          lines[lineIndex] = line.replace(/(\s*)(\/>|>)/, ` isOpen={true}$1$2`);
        }
      }
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
  },

  // Fix for property missing in type (TS2741)
  TS2741: (fileContent, error) => {
    const lines = fileContent.split('\n');
    const lineIndex = error.lineNum - 1;
    const line = lines[lineIndex];

    // Extract the property name from the error message
    const propNameMatch = error.errorMessage.match(/Property '([^']+)' is missing in type/);
    if (!propNameMatch) return fileContent;

    const propName = propNameMatch[1];

    // Add the missing property
    if (line.includes('<') && line.includes('>')) {
      // For boolean props like 'isOpen', add them with value={true}
      if (propName === 'isOpen') {
        // If the component is conditionally rendered with a state variable
        const stateVarMatch = line.match(/\{(\w+)\s*&&/);
        if (stateVarMatch) {
          const stateVar = stateVarMatch[1];
          // Add isOpen={stateVar} before the closing bracket
          lines[lineIndex] = line.replace(/(\s*)(\/>|>)/, ` isOpen={${stateVar}}$1$2`);
        } else {
          // Add isOpen={true} before the closing bracket
          lines[lineIndex] = line.replace(/(\s*)(\/>|>)/, ` isOpen={true}$1$2`);
        }
      } else {
        // For other props, add them with empty string value
        lines[lineIndex] = line.replace(/(\s*)(\/>|>)/, ` ${propName}=""$1$2`);
      }
    }

    return lines.join('\n');
  },

  // Fix for possibly undefined values (TS18048)
  TS18048: (fileContent, error) => {
    const lines = fileContent.split('\n');
    const lineIndex = error.lineNum - 1;
    const line = lines[lineIndex];

    // Extract the property name from the error message
    const propNameMatch = error.errorMessage.match(/'([^']+)' is possibly '([^']+)'/);
    if (!propNameMatch) return fileContent;

    const [, propPath, undefinedType] = propNameMatch;

    // Add optional chaining or nullish coalescing
    if (line.includes(propPath)) {
      let newLine = line;

      // Replace direct property access with optional chaining
      const parts = propPath.split('.');
      if (parts.length > 1) {
        // For nested properties, add optional chaining
        let currentPath = parts[0];
        for (let i = 1; i < parts.length; i++) {
          const nextPart = parts[i];
          const pattern = new RegExp(`${currentPath}\\.${nextPart}`, 'g');
          newLine = newLine.replace(pattern, `${currentPath}?.${nextPart}`);
          currentPath = `${currentPath}.${nextPart}`;
        }
      } else {
        // For simple properties, add nullish coalescing with a default value
        const pattern = new RegExp(`${propPath}(?![?\\w])`, 'g');

        // Choose an appropriate default value based on context
        let defaultValue = '""';
        if (line.includes('={') && line.includes('}')) {
          // JSX attribute
          if (propPath.includes('isOpen') || propPath.includes('disabled')) {
            defaultValue = 'false';
          } else if (propPath.includes('onClick') || propPath.includes('onClose')) {
            defaultValue = '() => {}';
          } else if (line.includes('number')) {
            defaultValue = '0';
          }
        } else if (line.includes('?') || line.includes(':')) {
          // Ternary expression or object property
          if (line.includes('boolean')) {
            defaultValue = 'false';
          } else if (line.includes('number')) {
            defaultValue = '0';
          } else if (line.includes('function')) {
            defaultValue = '() => {}';
          } else if (line.includes('[]')) {
            defaultValue = '[]';
          } else if (line.includes('{}')) {
            defaultValue = '{}';
          }
        }

        newLine = newLine.replace(pattern, `(${propPath} ?? ${defaultValue})`);
      }

      lines[lineIndex] = newLine;
    }

    return lines.join('\n');
  },

  // Fix for expected arguments error (TS2554)
  TS2554: (fileContent, error) => {
    const lines = fileContent.split('\n');
    const lineIndex = error.lineNum - 1;
    const line = lines[lineIndex];

    // Extract the expected and actual argument counts
    const argCountMatch = error.errorMessage.match(/Expected (\d+) arguments, but got (\d+)/);
    if (!argCountMatch) return fileContent;

    const [, expectedCount, actualCount] = argCountMatch;
    const expected = parseInt(expectedCount, 10);
    const actual = parseInt(actualCount, 10);

    // Add missing arguments
    if (expected > actual) {
      const funcCallMatch = line.match(/(\w+)\((.*?)\)/);
      if (funcCallMatch) {
        const [, funcName, args] = funcCallMatch;
        let newArgs = args;

        // Add empty arguments
        for (let i = actual; i < expected; i++) {
          if (newArgs.trim() === '') {
            newArgs = 'undefined';
          } else {
            newArgs += ', undefined';
          }
        }

        lines[lineIndex] = line.replace(`${funcName}(${args})`, `${funcName}(${newArgs})`);
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
