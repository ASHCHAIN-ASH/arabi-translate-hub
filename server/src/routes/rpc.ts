/** استدعاء دوال قاعدة البيانات المسموح بها فقط. */

import { Router } from 'express';
import { ALLOWED_RPC } from '../config/tables.js';
import { withUser } from '../db/pool.js';
import { ident } from '../db/queryBuilder.js';

export const rpcRouter = Router();

rpcRouter.post('/:fn', async (req, res) => {
  const { fn } = req.params;
  if (!ALLOWED_RPC.has(fn)) return res.status(404).json({ message: `الدالة ${fn} غير متاحة` });

  const args = (req.body ?? {}) as Record<string, unknown>;
  const names = Object.keys(args);
  const params = names.map((name) => args[name]);
  const signature = names.map((name, index) => `${ident(name)} => $${index + 1}`).join(', ');

  try {
    const result = await withUser(req.auth?.userId ?? null, (client) =>
      client.query(`SELECT ${ident(fn)}(${signature}) AS data`, params),
    );
    return res.json({ data: result.rows[0]?.data ?? null });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
});
