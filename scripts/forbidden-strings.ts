/**
 * قائمة السلاسل المحظورة (أرقام/قيم قديمة لا يجب أن تظهر في الكود).
 * يُستخدم بواسطة:
 *  - Vite plugin (build/dev)
 *  - سكربت قبل البناء (npm/bun script)
 */
export interface ForbiddenEntry {
  pattern: RegExp;
  label: string;
  hint?: string;
}

export const FORBIDDEN: ForbiddenEntry[] = [
  {
    pattern: /0500776343/g,
    label: '0500776343',
    hint: 'تم استبداله نهائياً برقم المنصة الرسمي 0559600824',
  },
  {
    pattern: /\+?966\s*50\s*077\s*6343/g,
    label: '+966 50 077 6343',
    hint: 'استخدم +966559600824 بدل الرقم القديم',
  },
  {
    pattern: /966500776343/g,
    label: '966500776343 (international format)',
    hint: 'استخدم 966559600824',
  },
  {
    pattern: /\+966\s*920\s*000\s*000/g,
    label: '+966 920 000 000',
    hint: 'رقم تجريبي — استخدم +966559600824',
  },
];

/** ملحقات الملفات التي يجب فحصها */
export const SCANNABLE_EXT = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.html', '.md', '.json', '.css',
]);

/** مجلدات يجب تجاهلها */
export const IGNORE_DIRS = new Set([
  'node_modules', 'dist', 'build', '.git', '.vite', 'coverage',
  'scripts', // السكربت نفسه يحتوي على الأنماط
]);
