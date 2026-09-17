/**
 * التحديث اللحظي عبر SSE مبني على LISTEN/NOTIFY في PostgreSQL.
 * يقابل `selfHostedDriver.subscribe`.
 *
 * عند النقل: أضف Trigger عام يستدعي pg_notify('table_changes', payload)
 * على الجداول التي تحتاج تحديثًا لحظيًا (نفس جداول REPLICA IDENTITY FULL
 * الموجودة في server/migrations/0010_replica_identity.sql).
 */

import { Router } from 'express';
import pg from 'pg';
import { env } from '../env.js';

export const realtimeRouter = Router();

interface Subscription {
  table: string;
  event?: string;
  filter?: string;
}

realtimeRouter.get('/stream', async (req, res) => {
  const subscriptions: Subscription[] = JSON.parse((req.query.subscriptions as string) ?? '[]');
  const tables = new Set(subscriptions.map((s) => s.table));

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  const client = new pg.Client({
    connectionString: env.databaseUrl,
    ssl: env.databaseSsl ? { rejectUnauthorized: false } : undefined,
  });
  await client.connect();
  await client.query('LISTEN table_changes');

  client.on('notification', (message) => {
    if (!message.payload) return;
    try {
      const payload = JSON.parse(message.payload) as { table: string };
      if (!tables.has(payload.table)) return;
      res.write(`data: ${message.payload}\n\n`);
    } catch {
      /* تجاهل الرسائل غير الصالحة */
    }
  });

  const keepAlive = setInterval(() => res.write(': ping\n\n'), 25_000);

  req.on('close', () => {
    clearInterval(keepAlive);
    client.end().catch(() => undefined);
  });
});
