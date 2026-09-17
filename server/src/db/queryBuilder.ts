/**
 * تحويل مواصفات الاستعلام القادمة من طبقة البيانات في الواجهة إلى SQL آمن.
 * كل الأسماء تمر عبر قائمة سماح + اقتباس، وكل القيم عبر بارامترات ($1, $2 ...).
 */

const IDENTIFIER = /^[a-z_][a-z0-9_]*$/i;

export interface Filter {
  column: string;
  op: string;
  value: unknown;
}

export interface SelectOptions {
  columns?: string;
  filters?: Filter[];
  order?: { column: string; ascending?: boolean } | { column: string; ascending?: boolean }[];
  limit?: number;
  range?: [number, number];
  count?: 'exact' | 'planned' | 'estimated';
}

export function ident(name: string): string {
  if (!IDENTIFIER.test(name)) throw new Error(`اسم غير صالح: ${name}`);
  return `"${name}"`;
}

const OPERATORS: Record<string, string> = {
  eq: '=',
  neq: '<>',
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<=',
  like: 'LIKE',
  ilike: 'ILIKE',
};

export function buildWhere(filters: Filter[] = [], params: unknown[] = []) {
  const clauses: string[] = [];
  for (const filter of filters) {
    const column = ident(filter.column);
    if (filter.op === 'in') {
      const list = (filter.value as unknown[]) ?? [];
      if (!list.length) {
        clauses.push('false');
        continue;
      }
      const placeholders = list.map((value) => `$${params.push(value)}`);
      clauses.push(`${column} IN (${placeholders.join(', ')})`);
    } else if (filter.op === 'is') {
      clauses.push(filter.value === null ? `${column} IS NULL` : `${column} IS ${filter.value ? 'TRUE' : 'FALSE'}`);
    } else if (filter.op === 'contains') {
      clauses.push(`${column} @> $${params.push(filter.value)}`);
    } else if (filter.op === 'overlaps') {
      clauses.push(`${column} && $${params.push(filter.value)}`);
    } else {
      const sqlOp = OPERATORS[filter.op];
      if (!sqlOp) throw new Error(`عامل غير مدعوم: ${filter.op}`);
      clauses.push(`${column} ${sqlOp} $${params.push(filter.value)}`);
    }
  }
  return { sql: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '', params };
}

export function buildSelect(table: string, options: SelectOptions) {
  const params: unknown[] = [];
  const columns = !options.columns || options.columns === '*'
    ? '*'
    : options.columns.split(',').map((c) => ident(c.trim())).join(', ');
  const { sql: whereSql } = buildWhere(options.filters, params);

  const orderList = options.order ? (Array.isArray(options.order) ? options.order : [options.order]) : [];
  const orderSql = orderList.length
    ? `ORDER BY ${orderList.map((o) => `${ident(o.column)} ${o.ascending === false ? 'DESC' : 'ASC'}`).join(', ')}`
    : '';

  let limitSql = '';
  if (options.range) {
    const [from, to] = options.range;
    limitSql = `LIMIT ${Math.max(0, to - from + 1)} OFFSET ${Math.max(0, from)}`;
  } else if (options.limit) {
    limitSql = `LIMIT ${Number(options.limit)}`;
  }

  return {
    text: `SELECT ${columns} FROM ${ident(table)} ${whereSql} ${orderSql} ${limitSql}`.replace(/\s+/g, ' ').trim(),
    countText: `SELECT count(*)::int AS count FROM ${ident(table)} ${whereSql}`.replace(/\s+/g, ' ').trim(),
    params,
  };
}

export function buildInsert(table: string, values: Record<string, unknown> | Record<string, unknown>[]) {
  const rows = Array.isArray(values) ? values : [values];
  if (!rows.length) throw new Error('لا توجد بيانات للإدراج');
  const columns = Object.keys(rows[0]);
  const params: unknown[] = [];
  const tuples = rows.map(
    (row) => `(${columns.map((column) => `$${params.push(row[column])}`).join(', ')})`,
  );
  return {
    text: `INSERT INTO ${ident(table)} (${columns.map(ident).join(', ')}) VALUES ${tuples.join(', ')} RETURNING *`,
    params,
  };
}

export function buildUpsert(table: string, values: Record<string, unknown> | Record<string, unknown>[], onConflict?: string) {
  const base = buildInsert(table, values);
  if (!onConflict) return base;
  const conflictColumns = onConflict.split(',').map((c) => ident(c.trim())).join(', ');
  const rows = Array.isArray(values) ? values : [values];
  const updates = Object.keys(rows[0])
    .map((column) => `${ident(column)} = EXCLUDED.${ident(column)}`)
    .join(', ');
  return {
    text: base.text.replace(' RETURNING *', ` ON CONFLICT (${conflictColumns}) DO UPDATE SET ${updates} RETURNING *`),
    params: base.params,
  };
}

export function buildUpdate(table: string, values: Record<string, unknown>, filters: Filter[]) {
  const params: unknown[] = [];
  const sets = Object.keys(values).map((column) => `${ident(column)} = $${params.push(values[column])}`);
  if (!sets.length) throw new Error('لا توجد حقول للتحديث');
  const { sql: whereSql } = buildWhere(filters, params);
  if (!whereSql) throw new Error('التحديث بدون شرط ممنوع');
  return { text: `UPDATE ${ident(table)} SET ${sets.join(', ')} ${whereSql} RETURNING *`, params };
}

export function buildDelete(table: string, filters: Filter[]) {
  const params: unknown[] = [];
  const { sql: whereSql } = buildWhere(filters, params);
  if (!whereSql) throw new Error('الحذف بدون شرط ممنوع');
  return { text: `DELETE FROM ${ident(table)} ${whereSql}`, params };
}
