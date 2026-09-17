import pg from 'pg';
import { env } from '../env.js';

export const pool = new pg.Pool({
  connectionString: env.databaseUrl,
  max: env.databasePoolMax,
  ssl: env.databaseSsl ? { rejectUnauthorized: false } : undefined,
});

export async function query<T = Record<string, unknown>>(text: string, params: unknown[] = []) {
  const result = await pool.query(text, params);
  return { rows: result.rows as T[], rowCount: result.rowCount ?? 0 };
}

/**
 * تنفيذ داخل معاملة مع ضبط هوية المستخدم الحالي،
 * بحيث تعمل سياسات RLS الحالية كما هي (current_setting('app.user_id')).
 */
export async function withUser<T>(userId: string | null, fn: (client: pg.PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query("select set_config('app.user_id', $1, true)", [userId ?? '']);
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
