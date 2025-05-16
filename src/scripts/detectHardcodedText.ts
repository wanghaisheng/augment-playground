// src/scripts/detectHardcodedText.ts
/**
 * Hardcoded Text Detection Tool
 * 
 * This script scans the codebase for potential hardcoded text in React components
 * that should be using the multilingual system instead.
 * 
 * Usage:
 * - Run with `npm run detect-hardcoded-text`
 * - Optionally specify a directory to scan: `npm run detect-hardcoded-text -- --dir=src/components/task`
 * - Optionally specify output format: `npm run detect-hardcoded-text -- --format=json`
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Default configuration
const config = {
  // Root directory to scan (relative to project root)
  rootDir: path.resolve(__dirname, '../../src'),
  
  // Directories to scan (relative to rootDir)
  dirsToScan: ['components', 'pages', 'features'],
  
  // File extensions to scan
  extensions: ['.tsx', '.ts', '.jsx', '.js'],
  
  // Directories to exclude
  excludeDirs: ['node_modules', 'dist', 'build', '.git'],
  
  // Minimum length of text to consider (to avoid false positives)
  minTextLength: 2,
  
  // Output format (text or json)
  outputFormat: 'text',
  
  // Whether to include line numbers in the output
  includeLineNumbers: true,
  
  // Whether to detect Chinese text
  detectChinese: true,
  
  // Whether to detect English text in JSX
  detectEnglish: true,
  
  // Patterns to ignore (won't be reported as hardcoded)
  ignorePatterns: [
    // Import statements
    /import\s+.*?from\s+['"].*?['"]/,
    // Comments
    /\/\/.*|\/\*[\s\S]*?\*\//,
    // Console logs
    /console\.(log|warn|error|info|debug)\(/,
    // Variable names
    /const\s+\w+\s*=|let\s+\w+\s*=|var\s+\w+\s*=/,
    // Function names
    /function\s+\w+\s*\(/,
    // Class names
    /class\s+\w+/,
    // Type definitions
    /type\s+\w+|interface\s+\w+/,
    // URLs
    /https?:\/\/[^\s'"]+/,
    // File paths
    /['"]\.\.?\/[^\s'"]+['"]/,
    // CSS class names
    /className=['"]([\w\s-]+)['"]/,
    // Component names
    /<([A-Z]\w+)/,
    // Property names
    /\w+:\s*[^,}]+/,
  ],
  
  // Common English words to ignore (to reduce false positives)
  commonEnglishWords: [
    'div', 'span', 'button', 'input', 'form', 'label', 'select', 'option',
    'table', 'tr', 'td', 'th', 'ul', 'li', 'ol', 'nav', 'header', 'footer',
    'main', 'section', 'article', 'aside', 'details', 'summary', 'figure',
    'figcaption', 'time', 'mark', 'audio', 'video', 'source', 'track', 'canvas',
    'map', 'area', 'svg', 'math', 'data', 'object', 'param', 'embed', 'iframe'
  ]
};

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  
  for (const arg of args) {
    if (arg.startsWith('--dir=')) {
      const dir = arg.split('=')[1];
      config.dirsToScan = [dir.replace(/^src\//, '')];
    } else if (arg.startsWith('--format=')) {
      const format = arg.split('=')[1];
      if (format === 'json' || format === 'text') {
        config.outputFormat = format;
      }
    } else if (arg === '--no-chinese') {
      config.detectChinese = false;
    } else if (arg === '--no-english') {
      config.detectEnglish = false;
    } else if (arg === '--no-line-numbers') {
      config.includeLineNumbers = false;
    }
  }
}

// Interface for detected issues
interface DetectedIssue {
  file: string;
  line: number;
  column: number;
  text: string;
  type: 'chinese' | 'english';
  context: string;
}

// Function to check if a string contains Chinese characters
function containsChinese(str: string): boolean {
  return /[\u4e00-\u9fff]/.test(str);
}

// Function to check if a string contains English text in JSX context
function containsEnglishInJSX(str: string, line: string): boolean {
  // Check if the string is in JSX context (between > and <, or in quotes within JSX tags)
  const jsxTextPattern = />([^<>]+)</;
  const jsxAttributePattern = /=["']([^"']+)["']/;
  
  const jsxTextMatch = jsxTextPattern.exec(line);
  const jsxAttributeMatch = jsxAttributePattern.exec(line);
  
  if (jsxTextMatch && jsxTextMatch[1].includes(str)) {
    // Ignore if it's just a common HTML element name
    if (config.commonEnglishWords.includes(str.toLowerCase().trim())) {
      return false;
    }
    return true;
  }
  
  if (jsxAttributeMatch && jsxAttributeMatch[1].includes(str)) {
    // Check if it's a value for an attribute that might need localization
    const attributeContext = line.substring(0, jsxAttributeMatch.index).trim();
    const localizableAttributes = ['placeholder', 'title', 'alt', 'aria-label', 'label'];
    
    for (const attr of localizableAttributes) {
      if (attributeContext.endsWith(attr + '=')) {
        return true;
      }
    }
  }
  
  return false;
}

// Function to check if a line should be ignored based on patterns
function shouldIgnore(line: string): boolean {
  for (const pattern of config.ignorePatterns) {
    if (pattern.test(line)) {
      return true;
    }
  }
  return false;
}

// Function to scan a file for hardcoded text
async function scanFile(filePath: string): Promise<DetectedIssue[]> {
  const issues: DetectedIssue[] = [];
  
  try {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip if the line should be ignored
      if (shouldIgnore(line)) {
        continue;
      }
      
      // Check for Chinese text
      if (config.detectChinese && containsChinese(line)) {
        // Extract Chinese text segments
        const chineseSegments = line.match(/[\u4e00-\u9fff]+/g) || [];
        
        for (const segment of chineseSegments) {
          if (segment.length >= config.minTextLength) {
            const column = line.indexOf(segment);
            issues.push({
              file: filePath,
              line: i + 1,
              column,
              text: segment,
              type: 'chinese',
              context: line.trim()
            });
          }
        }
      }
      
      // Check for English text in JSX context
      if (config.detectEnglish && line.includes('<')) {
        // Extract potential English text segments
        const words = line.split(/[^a-zA-Z]+/).filter(word => 
          word.length >= config.minTextLength && 
          !config.commonEnglishWords.includes(word.toLowerCase())
        );
        
        for (const word of words) {
          if (containsEnglishInJSX(word, line)) {
            const column = line.indexOf(word);
            issues.push({
              file: filePath,
              line: i + 1,
              column,
              text: word,
              type: 'english',
              context: line.trim()
            });
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning file ${filePath}:`, error);
  }
  
  return issues;
}

// Function to recursively scan directories
async function scanDirectory(dirPath: string): Promise<DetectedIssue[]> {
  const issues: DetectedIssue[] = [];
  
  try {
    const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        // Skip excluded directories
        if (config.excludeDirs.includes(entry.name)) {
          continue;
        }
        
        // Recursively scan subdirectories
        const subDirIssues = await scanDirectory(fullPath);
        issues.push(...subDirIssues);
      } else if (entry.isFile()) {
        // Check if the file has a supported extension
        const ext = path.extname(entry.name);
        if (config.extensions.includes(ext)) {
          const fileIssues = await scanFile(fullPath);
          issues.push(...fileIssues);
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error);
  }
  
  return issues;
}

// Function to format and output the results
function outputResults(issues: DetectedIssue[]) {
  if (issues.length === 0) {
    console.log('No hardcoded text detected!');
    return;
  }
  
  if (config.outputFormat === 'json') {
    console.log(JSON.stringify(issues, null, 2));
    return;
  }
  
  // Group issues by file
  const issuesByFile: Record<string, DetectedIssue[]> = {};
  
  for (const issue of issues) {
    if (!issuesByFile[issue.file]) {
      issuesByFile[issue.file] = [];
    }
    issuesByFile[issue.file].push(issue);
  }
  
  // Output issues grouped by file
  console.log(`\nDetected ${issues.length} potential hardcoded text issues in ${Object.keys(issuesByFile).length} files:\n`);
  
  for (const [file, fileIssues] of Object.entries(issuesByFile)) {
    // Get relative path from project root
    const relativePath = path.relative(path.resolve(__dirname, '../..'), file);
    console.log(`\n${relativePath} (${fileIssues.length} issues):`);
    
    for (const issue of fileIssues) {
      const lineInfo = config.includeLineNumbers ? `Line ${issue.line}: ` : '';
      const typeLabel = issue.type === 'chinese' ? 'Chinese' : 'English';
      console.log(`  ${lineInfo}${typeLabel} text "${issue.text}" in context: ${issue.context}`);
    }
  }
  
  console.log('\nSuggestions:');
  console.log('1. Replace hardcoded text with labels from the multilingual system');
  console.log('2. Use the useLocalizedView hook for page components');
  console.log('3. Use the useComponentLabels hook for shared components');
  console.log('4. Define label types in the appropriate interface files');
  console.log('5. Add the new labels to the database for all supported languages');
}

// Main function
async function main() {
  parseArgs();
  
  console.log('Scanning for hardcoded text...');
  console.log(`Directories to scan: ${config.dirsToScan.join(', ')}`);
  
  const allIssues: DetectedIssue[] = [];
  
  for (const dir of config.dirsToScan) {
    const dirPath = path.join(config.rootDir, dir);
    
    try {
      // Check if directory exists
      await fs.promises.access(dirPath);
      
      const issues = await scanDirectory(dirPath);
      allIssues.push(...issues);
    } catch (error) {
      console.error(`Error: Directory ${dirPath} does not exist or cannot be accessed.`);
    }
  }
  
  outputResults(allIssues);
}

// Run the script
main().catch(error => {
  console.error('Error running hardcoded text detection tool:', error);
  process.exit(1);
});
