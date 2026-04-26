#!/usr/bin/env node
/**
 * فحص ما قبل البناء: يبحث عن أي سلاسل محظورة (أرقام مستبدَلة) في الكود.
 * فشل العملية → فشل البناء.
 *
 * تشغيل: node scripts/check-forbidden.mjs
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

const FORBIDDEN = [
  { pattern: /0500776343/g, label: '0500776343', hint: 'استخدم 0559600824' },
  { pattern: /\+?966\s*50\s*077\s*6343/g, label: '+966 50 077 6343', hint: 'استخدم +966559600824' },
  { pattern: /966500776343/g, label: '966500776343', hint: 'استخدم 966559600824' },
  { pattern: /\+966\s*920\s*000\s*000/g, label: '+966 920 000 000 (رقم تجريبي)', hint: 'استخدم +966559600824' },
];

const SCANNABLE_EXT = new Set(['.ts', '.tsx', '.js', '.jsx', '.html', '.md', '.json', '.css']);
const IGNORE_DIRS = new Set(['node_modules', 'dist', 'build', '.git', '.vite', 'coverage', 'scripts']);

const ROOT = process.cwd();
const SCAN_ROOTS = ['src', 'public', 'supabase/functions', 'index.html'];

const violations = [];

function scan(absPath) {
  let stat;
  try { stat = statSync(absPath); } catch { return; }
  if (stat.isDirectory()) {
    const base = absPath.split('/').pop();
    if (IGNORE_DIRS.has(base)) return;
    for (const entry of readdirSync(absPath)) scan(join(absPath, entry));
    return;
  }
  if (!stat.isFile()) return;
  if (!SCANNABLE_EXT.has(extname(absPath))) return;

  let content;
  try { content = readFileSync(absPath, 'utf8'); } catch { return; }

  for (const { pattern, label, hint } of FORBIDDEN) {
    const re = new RegExp(pattern.source, pattern.flags);
    let m;
    while ((m = re.exec(content)) !== null) {
      const lineNo = content.slice(0, m.index).split('\n').length;
      violations.push({
        file: relative(ROOT, absPath),
        line: lineNo,
        match: m[0],
        label,
        hint,
      });
    }
  }
}

for (const r of SCAN_ROOTS) scan(join(ROOT, r));

if (violations.length > 0) {
  console.error('\n❌ فحص الأرقام المحظورة فشل — تم العثور على قيم قديمة:\n');
  for (const v of violations) {
    console.error(`  • ${v.file}:${v.line} → "${v.match}"  [${v.label}]${v.hint ? `\n      ↳ ${v.hint}` : ''}`);
  }
  console.error(`\nالإجمالي: ${violations.length} مخالفة. يرجى الإصلاح قبل البناء.\n`);
  process.exit(1);
}

console.log('✅ فحص الأرقام المحظورة: لم يتم العثور على قيم قديمة.');
