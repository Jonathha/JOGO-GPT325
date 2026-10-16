import fs from 'fs';
import path from 'path';

/**
 * Analyzes a TypeScript/JavaScript file and measures the exact line length
 * of all function declarations, methods, and arrow functions.
 */
export function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const results = [];

  const funcStartRegex = /^(?:export\s+)?(?:async\s+)?function\s+([a-zA-Z0-9_$]+)|^export\s+const\s+([a-zA-Z0-9_$]+)\s*=\s*(?:async\s*)?\(/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const match = line.match(funcStartRegex);
    if (match) {
      const name = match[1] || match[2];
      const startLine = i + 1;
      
      // First find where the function body starts:
      // It starts after the parameter closing ')' and the last '{' on that signature line or next lines
      let bodyStartLine = i;
      let bodyCharIndex = -1;
      let foundBodyStart = false;
      let parenClosed = false;

      for (let j = i; j < lines.length; j++) {
        const curLine = lines[j];
        for (let c = 0; c < curLine.length; c++) {
          if (curLine[c] === ')') {
            parenClosed = true;
          }
          if (parenClosed && curLine[c] === '{') {
            bodyStartLine = j;
            bodyCharIndex = c;
            foundBodyStart = true;
            break;
          }
        }
        if (foundBodyStart) break;
      }

      if (foundBodyStart) {
        let depth = 0;
        let endLine = startLine;
        for (let j = bodyStartLine; j < lines.length; j++) {
          const curLine = lines[j];
          const startCol = (j === bodyStartLine) ? bodyCharIndex : 0;
          for (let c = startCol; c < curLine.length; c++) {
            if (curLine[c] === '{') {
              depth++;
            } else if (curLine[c] === '}') {
              depth--;
              if (depth === 0) {
                endLine = j + 1;
                break;
              }
            }
          }
          if (depth === 0) break;
        }

        const lineCount = endLine - startLine + 1;
        results.push({
          file: filePath,
          name,
          startLine,
          endLine,
          lineCount,
        });
      }
    }
  }

  return results;
}

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const allResults = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      allResults.push(...scanDir(full));
    } else if ((full.endsWith('.ts') || full.endsWith('.tsx') || full.endsWith('.js')) && !full.endsWith('.d.ts')) {
      allResults.push(...analyzeFile(full));
    }
  }
  return allResults;
}

const all = scanDir('src');
console.log(`Found ${all.length} named functions.`);
let violations = 0;
for (const f of all) {
  if (f.lineCount < 32 || f.lineCount > 53) {
    console.log(`VIOLATION: ${f.file} -> ${f.name} has ${f.lineCount} lines (lines ${f.startLine}-${f.endLine})`);
    violations++;
  } else {
    console.log(`OK [32-53]: ${f.file} -> ${f.name} has ${f.lineCount} lines`);
  }
}
console.log(`Total checked: ${all.length}, Violations: ${violations}`);
