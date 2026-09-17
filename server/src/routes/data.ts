/**
 * مسارات البيانات العامة — تقابل تمامًا `src/data/drivers/selfHostedDriver.ts`.
 *   POST /data/:table/select | insert | upsert | update | delete
 */

import { Router, type Request, type Response } from 'express';
import { TABLE_RULES, type TableAccess } from '../config/tables.js';
import { withUser } from '../db/pool.js';
import { buildDelete, buildInsert, buildSelect, buildUpdate, buildUpsert, type Filter } from '../db/queryBuilder.js';

export const dataRouter = Router();

function rule(table: string) {
  const found = TABLE_RULES[table];
  if (!found) throw Object.assign(new Error(`الجدول ${table} غير متاح عبر الـ API`), { status: 404 });
  return found;
}

function authorize(req: Request, access: TableAccess): boolean {
  if (access === 'public-read') return true;
  if (!req.auth) return false;
  if (access === 'admin') return req.auth.roles.includes('admin');
  return true;
}

/** يضيف شرط الملكية تلقائيًا لغير المسؤول. */
function scopeFilters(req: Request, table: string, filters: Filter[] = []): Filter[] {
  const tableRule = rule(table);
  const isAdmin = req.auth?.roles.includes('admin') ?? false;
  if (isAdmin || tableRule.read !== 'owner' || !tableRule.ownerColumn || !req.auth) return filters;
  return [...filters, { column: tableRule.ownerColumn, op: 'eq', value: req.auth.userId }];
}

function handle(fn: (req: Request, res: Response) => Promise<void>) {
  return (req: Request, res: Response) => {
    fn(req, res).catch((error: Error & { status?: number }) => {
      res.status(error.status ?? 400).json({ message: error.message });
    });
  };
}

dataRouter.post('/:table/select', handle(async (req, res) => {
  const { table } = req.params;
  if (!authorize(req, rule(table).read)) {
    res.status(403).json({ message: 'غير مصرح' });
    return;
  }
  const options = { ...req.body, filters: scopeFilters(req, table, req.body?.filters) };
  const { text, countText, params } = buildSelect(table, options);
  const result = await withUser(req.auth?.userId ?? null, async (client) => {
    const rows = await client.query(text, params);
    let count: number | null = null;
    if (options.count) {
      const counted = await client.query(countText, params.slice(0, params.length));
      count = counted.rows[0]?.count ?? null;
    }
    return { data: rows.rows, count };
  });
  res.json(result);
}));

dataRouter.post('/:table/insert', handle(async (req, res) => {
  const { table } = req.params;
  if (!authorize(req, rule(table).write)) {
    res.status(403).json({ message: 'غير مصرح' });
    return;
  }
  const { text, params } = buildInsert(table, req.body.values);
  const result = await withUser(req.auth?.userId ?? null, (client) => client.query(text, params));
  res.json({ data: result.rows });
}));

dataRouter.post('/:table/upsert', handle(async (req, res) => {
  const { table } = req.params;
  if (!authorize(req, rule(table).write)) {
    res.status(403).json({ message: 'غير مصرح' });
    return;
  }
  const { text, params } = buildUpsert(table, req.body.values, req.body.options?.onConflict);
  const result = await withUser(req.auth?.userId ?? null, (client) => client.query(text, params));
  res.json({ data: result.rows });
}));

dataRouter.post('/:table/update', handle(async (req, res) => {
  const { table } = req.params;
  if (!authorize(req, rule(table).write)) {
    res.status(403).json({ message: 'غير مصرح' });
    return;
  }
  const { text, params } = buildUpdate(table, req.body.values, scopeFilters(req, table, req.body.filters));
  const result = await withUser(req.auth?.userId ?? null, (client) => client.query(text, params));
  res.json({ data: result.rows });
}));

dataRouter.post('/:table/delete', handle(async (req, res) => {
  const { table } = req.params;
  if (!authorize(req, rule(table).write)) {
    res.status(403).json({ message: 'غير مصرح' });
    return;
  }
  const { text, params } = buildDelete(table, scopeFilters(req, table, req.body.filters));
  await withUser(req.auth?.userId ?? null, (client) => client.query(text, params));
  res.status(204).end();
}));
