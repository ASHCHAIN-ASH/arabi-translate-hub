/**
 * مصنع المستودعات (Repository factory).
 * كل عمليات القراءة/الكتابة في التطبيق تمر من هنا، وليس من داخل المكوّنات.
 */

import { db } from '../dataClient';
import {
  where,
  type Filter,
  type InsertRow,
  type RealtimeChangePayload,
  type RealtimeEvent,
  type Row,
  type SelectOptions,
  type TableName,
  type UpdateRow,
  type Unsubscribe,
} from '../types';

export interface ListOptions extends Omit<SelectOptions, 'filters'> {
  filters?: Filter[];
}

export interface Repository<T extends TableName> {
  readonly table: T;
  list(options?: ListOptions): Promise<Row<T>[]>;
  listWithCount(options?: ListOptions): Promise<{ rows: Row<T>[]; count: number }>;
  findById(id: string, columns?: string): Promise<Row<T> | null>;
  findOne(filters: Filter[], options?: Omit<SelectOptions, 'filters'>): Promise<Row<T> | null>;
  count(filters?: Filter[]): Promise<number>;
  create(values: InsertRow<T>): Promise<Row<T>>;
  createMany(values: InsertRow<T>[]): Promise<Row<T>[]>;
  update(id: string, values: UpdateRow<T>): Promise<Row<T>>;
  updateWhere(filters: Filter[], values: UpdateRow<T>): Promise<Row<T>[]>;
  upsert(values: InsertRow<T> | InsertRow<T>[], onConflict?: string): Promise<Row<T>[]>;
  remove(id: string): Promise<void>;
  removeWhere(filters: Filter[]): Promise<void>;
  onChange(handler: (payload: RealtimeChangePayload<Row<T>>) => void, options?: { event?: RealtimeEvent; filter?: string; channel?: string }): Unsubscribe;
}

export function createRepository<T extends TableName>(table: T, idColumn = 'id'): Repository<T> {
  return {
    table,

    async list(options: ListOptions = {}) {
      const result = await db.select<Row<T>>(table, options);
      return result.data;
    },

    async listWithCount(options: ListOptions = {}) {
      const result = await db.select<Row<T>>(table, { ...options, count: options.count ?? 'exact' });
      return { rows: result.data, count: result.count ?? result.data.length };
    },

    async findById(id: string, columns?: string) {
      return await db.selectOne<Row<T>>(table, { columns, filters: [where.eq(idColumn, id)] });
    },

    async findOne(filters: Filter[], options: Omit<SelectOptions, 'filters'> = {}) {
      return await db.selectOne<Row<T>>(table, { ...options, filters });
    },

    async count(filters: Filter[] = []) {
      const result = await db.select(table, { columns: idColumn, filters, count: 'exact', limit: 1 });
      return result.count ?? 0;
    },

    async create(values) {
      const rows = await db.insert<Row<T>>(table, values);
      return rows[0];
    },

    async createMany(values) {
      return await db.insert<Row<T>>(table, values);
    },

    async update(id, values) {
      const rows = await db.update<Row<T>>(table, values, [where.eq(idColumn, id)]);
      return rows[0];
    },

    async updateWhere(filters, values) {
      return await db.update<Row<T>>(table, values, filters);
    },

    async upsert(values, onConflict) {
      return await db.upsert<Row<T>>(table, values, { onConflict });
    },

    async remove(id) {
      await db.remove(table, [where.eq(idColumn, id)]);
    },

    async removeWhere(filters) {
      await db.remove(table, filters);
    },

    onChange(handler, options = {}) {
      return db.subscribe<Row<T>>(options.channel ?? `${table}-changes`, [
        { table, event: options.event ?? '*', filter: options.filter },
      ], handler);
    },
  };
}
