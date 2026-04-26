import type { Plugin } from 'vite';
import { FORBIDDEN, SCANNABLE_EXT } from './forbidden-strings';
import { extname } from 'node:path';

/**
 * Vite plugin يفحص كل ملف عند التحويل (transform) ويرفض البناء
 * عند وجود أي سلسلة محظورة (أرقام مستبدَلة).
 *
 * - في وضع build: يرمي خطأ يفشل البناء بالكامل.
 * - في وضع dev: يطبع تحذيراً واضحاً في كونسول الخادم.
 */
export function forbiddenStringsPlugin(): Plugin {
  let isBuild = false;

  return {
    name: 'forbidden-strings-guard',
    apply: () => true,
    configResolved(config) {
      isBuild = config.command === 'build';
    },
    transform(code, id) {
      // تجاهل ملفات node_modules والملفات الافتراضية
      if (id.includes('node_modules')) return null;
      if (id.startsWith('\0')) return null;

      const ext = extname(id.split('?')[0]);
      if (!SCANNABLE_EXT.has(ext)) return null;

      const hits: { label: string; match: string; line: number; hint?: string }[] = [];
      for (const { pattern, label, hint } of FORBIDDEN) {
        const re = new RegExp(pattern.source, pattern.flags);
        let m;
        while ((m = re.exec(code)) !== null) {
          const line = code.slice(0, m.index).split('\n').length;
          hits.push({ label, match: m[0], line, hint });
        }
      }

      if (hits.length === 0) return null;

      const msg =
        `\n[forbidden-strings] تم العثور على قيم محظورة في ${id}:\n` +
        hits.map((h) => `  • السطر ${h.line}: "${h.match}" [${h.label}]${h.hint ? ` — ${h.hint}` : ''}`).join('\n') +
        `\n`;

      if (isBuild) {
        this.error(msg);
      } else {
        // dev: تحذير لا يكسر HMR
        this.warn(msg);
      }
      return null;
    },
  };
}
