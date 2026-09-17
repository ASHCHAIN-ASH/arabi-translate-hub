#!/usr/bin/env node
/**
 * منفّذ ملفات الترحيل بالترتيب على سيرفر PostgreSQL الخاص بنا.
 * ⚠️ لا يعمل تلقائيًا — يُشغَّل يدويًا وقت النقل الفعلي:
 *
 *   DATABASE_URL=postgresql://... node scripts/migrate.mjs
 *   DATABASE_URL=... node scripts/migrate.mjs --include-rls
 */

import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const here = dirname(fileURLToPath(import.meta.url));
const migrationsDir = join(here, '..', 'migrations');

const includeRls = process.argv.includes('--include-rls');
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL مفقود');
  process.exit(1);
}

const files = readdirSync(migrationsDir)
  .filter((file) => file.endsWith('.sql'))
  .filter((file) => includeRls || !file.includes('rls_policies'))
  .sort();

const client = new pg.Client({ connectionString: databaseUrl });
await client.connect();
await client.query(`CREATE TABLE IF NOT EXISTS _migrations (name text primary key, applied_at timestamptz default now())`);

for (const file of files) {
  const { rowCount } = await client.query('SELECT 1 FROM _migrations WHERE name = $1', [file]);
  if (rowCount) {
    console.log(`تخطّي ${file} (مطبّق مسبقًا)`);
    continue;
  }
  console.log(`تنفيذ ${file} ...`);
  const sql = readFileSync(join(migrationsDir, file), 'utf8');
  await client.query('BEGIN');
  try {
    await client.query(sql);
    await client.query('INSERT INTO _migrations (name) VALUES ($1)', [file]);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`فشل ${file}:`, error.message);
    process.exit(1);
  }
}

await client.end();
console.log('اكتملت جميع ملفات الترحيل.');
