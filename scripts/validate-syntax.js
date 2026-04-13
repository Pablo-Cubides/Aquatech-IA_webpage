#!/usr/bin/env node

/**
 * validate-syntax.js
 * 
 * A lightweight syntax validator that specifically checks for brace depth imbalance.
 * Primarily used to catch corrupted article definitions in library files (like blog-articles.ts).
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Files that are highly sensitive to brace imbalance
const CRITICAL_FILES = [
  'apps/web/src/lib/blog-articles.ts',
  'apps/web/src/lib/new-ambiental-articles.ts'
];

function checkBraces(filePath) {
  if (!fs.existsSync(filePath)) return true;
  
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let depth = 0;
  let errors = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Ignore comments
    if (line.trim().startsWith('//') || line.trim().startsWith('/*')) continue;

    const opens = (line.match(/\{/g) || []).length;
    const closes = (line.match(/\}/g) || []).length;
    
    depth += opens;
    depth -= closes;
    
    if (depth < 0) {
      errors.push(`Line ${i + 1}: Negative brace depth detected (too many closing braces).`);
      depth = 0; // Reset to avoid cascading errors
    }
  }

  if (depth !== 0) {
    errors.push(`End of file: Unbalanced braces. Final depth is ${depth} (missing ${depth} closing braces).`);
  }

  if (errors.length > 0) {
    console.error(`\n❌ Syntax Error in ${filePath}:`);
    errors.forEach(err => console.error(`   - ${err}`));
    return false;
  }

  console.log(`✅ ${filePath}: Syntax validated (braces balanced).`);
  return true;
}

// Main execution
let targetFiles = process.argv.slice(2);

// If no files provided, check staged files or defaults
if (targetFiles.length === 0) {
  try {
    const staged = execSync('git diff --cached --name-only --diff-filter=ACM').toString().trim().split('\n').filter(Boolean);
    targetFiles = staged;
  } catch (e) {
    // Git error or not in a repo
  }
}

// Fallback to critical files if still empty
if (targetFiles.length === 0) {
  targetFiles = CRITICAL_FILES;
}

let hasError = false;
targetFiles.forEach(file => {
  // Only check .ts and .tsx files
  if (file.endsWith('.ts') || file.endsWith('.tsx')) {
    if (!checkBraces(file)) {
      hasError = true;
    }
  }
});

if (hasError) {
  console.error('\nTerminating due to syntax errors.\n');
  process.exit(1);
}

process.exit(0);
