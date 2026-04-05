/**
 * Find duplicate exports in index.ts files
 * Usage: npx ts-node scripts/find-duplicate-exports.ts
 */

import fs from 'fs';
import path from 'path';

interface ExportInfo {
  name: string;
  type: 'named' | 'default' | 'type';
  line: number;
  file: string;
}

function parseExports(content: string, filePath: string): ExportInfo[] {
  const exports: ExportInfo[] = [];
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // Match: export { Component } from './path'
    const namedMatch = line.match(/export\s*{\s*([^}]+)\s*}\s*from/);
    if (namedMatch) {
      const names = namedMatch[1].split(',').map((n) => n.trim());
      names.forEach((name) => {
        if (name) {
          exports.push({
            name,
            type: 'named',
            line: lineNum,
            file: filePath,
          });
        }
      });
    }

    // Match: export { Component as Alias }
    const aliasMatch = line.match(/export\s*{\s*([^}]+)\s*as\s*([^}]+)\s*}/);
    if (aliasMatch) {
      const alias = aliasMatch[2].trim();
      exports.push({
        name: alias,
        type: 'named',
        line: lineNum,
        file: filePath,
      });
    }

    // Match: export type { Type }
    const typeMatch = line.match(/export\s+type\s*{\s*([^}]+)\s*}\s*from/);
    if (typeMatch) {
      const names = typeMatch[1].split(',').map((n) => n.trim());
      names.forEach((name) => {
        if (name) {
          exports.push({
            name,
            type: 'type',
            line: lineNum,
            file: filePath,
          });
        }
      });
    }

    // Match: export default Component
    const defaultMatch = line.match(/export\s+default\s+(\w+)/);
    if (defaultMatch) {
      exports.push({
        name: defaultMatch[1],
        type: 'default',
        line: lineNum,
        file: filePath,
      });
    }
  });

  return exports;
}

function findDuplicates(exports: ExportInfo[]): Map<string, ExportInfo[]> {
  const duplicates = new Map<string, ExportInfo[]>();

  exports.forEach((exp) => {
    const key = `${exp.name}:${exp.type}`;
    if (!duplicates.has(key)) {
      duplicates.set(key, []);
    }
    duplicates.get(key)!.push(exp);
  });

  // Filter to only actual duplicates
  const result = new Map<string, ExportInfo[]>();
  duplicates.forEach((exps, key) => {
    if (exps.length > 1) {
      result.set(key, exps);
    }
  });

  return result;
}

function main() {
  const indexFiles = [
    'packages/components/src/index.ts',
    'packages/core/src/index.ts',
    'packages/hooks/src/index.ts',
    'packages/backgrounds/src/index.ts',
    'packages/frames/src/index.ts',
    'packages/charts/src/index.ts',
  ];

  console.log('🔍 Scanning for duplicate exports...\n');

  let totalDuplicates = 0;

  indexFiles.forEach((filePath) => {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const exports = parseExports(content, filePath);
    const duplicates = findDuplicates(exports);

    if (duplicates.size > 0) {
      console.log(`\n📄 ${filePath}`);
      console.log('─'.repeat(60));

      duplicates.forEach((exps, key) => {
        console.log(`\n  ❌ Duplicate: ${key}`);
        exps.forEach((exp) => {
          console.log(`     Line ${exp.line}: ${exp.file}`);
        });
        totalDuplicates++;
      });
    }
  });

  console.log(`\n\n📊 Total duplicate exports found: ${totalDuplicates}`);

  if (totalDuplicates === 0) {
    console.log('✅ No duplicate exports found!');
  }
}

main();
