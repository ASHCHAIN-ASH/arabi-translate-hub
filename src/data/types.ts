/**
 * أنواع طبقة البيانات المستقلة عن أي مزوّد.
 * هذه الأنواع هي العقد الوحيد بين المستودعات (Repositories) والمزوّد الفعلي.
 */

import type { Database } from '@/integrations/supabase/types';

/** أسماء الجداول المتاحة (مشتقة من توثيق المخطط الحالي). */
export type TableName = keyof Database['public']['Tables'];

export type Row<T extends TableName> = Database['public']['Tables'][T]['Row'];
export type InsertRow<T extends TableName> = Database['public']['Tables'][T]['Insert'];
export type UpdateRow<T extends TableName> = Database['public']['Tables'][T]['Update'];

export type FilterOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'like'
  | 'ilike'
  | 'in'
  | 'is'
  | 'contains'
  | 'overlaps';

export interface Filter {
  column: string;
  op: FilterOperator;
  value: unknown;
}

export interface OrderBy {
  column: string;
  ascending?: boolean;
  nullsFirst?: boolean;
}

export interface SelectOptions {
  /** الأعمدة المطلوبة (نفس صياغة PostgREST، الافتراضي "*") */
  columns?: string;
  filters?: Filter[];
  /** شرط OR بصياغة PostgREST مثل: "status.eq.new,status.eq.open" */
  or?: string;
  order?: OrderBy | OrderBy[];
  limit?: number;
  /** ترقيم الصفحات: [from, to] شامل الطرفين */
  range?: [number, number];
  /** إرجاع عدد السجلات الكلي */
  count?: 'exact' | 'planned' | 'estimated';
}

export interface WriteOptions {
  /** إرجاع الصفوف بعد الكتابة (افتراضي true) */
  returning?: boolean;
  /** أعمدة التعارض لعملية upsert */
  onConflict?: string;
}

export interface DataResult<T> {
  data: T;
  count?: number | null;
}

export class DataError extends Error {
  readonly code?: string;
  readonly details?: string;
  readonly hint?: string;
  readonly status?: number;

  constructor(
    message: string,
    options: { code?: string; details?: string; hint?: string; status?: number; cause?: unknown } = {},
  ) {
    super(message);
    this.name = 'DataError';
    this.code = options.code;
    this.details = options.details;
    this.hint = options.hint;
    this.status = options.status;
    if (options.cause) (this as { cause?: unknown }).cause = options.cause;
  }
}

export type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

export interface RealtimeSubscription {
  table: string;
  event?: RealtimeEvent;
  /** فلتر بصياغة PostgREST مثل: "user_id=eq.123" */
  filter?: string;
}

export interface RealtimeChangePayload<T = Record<string, unknown>> {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: T | null;
  old: Partial<T> | null;
  table: string;
}

export type Unsubscribe = () => void;

export interface UploadOptions {
  contentType?: string;
  upsert?: boolean;
  cacheControl?: string;
}

export interface StorageBackend {
  upload(bucket: string, path: string, file: File | Blob | ArrayBuffer, options?: UploadOptions): Promise<{ path: string }>;
  getPublicUrl(bucket: string, path: string): string;
  createSignedUrl(bucket: string, path: string, expiresInSeconds: number): Promise<string>;
  remove(bucket: string, paths: string[]): Promise<void>;
  download(bucket: string, path: string): Promise<Blob>;
}

/**
 * واجهة مزوّد البيانات. أي مزوّد مستقبلي (PostgreSQL + API خاص بنا)
 * يكفي أن ينفّذ هذه الواجهة ليعمل الموقع كما هو.
 */
export interface DataBackend {
  readonly name: string;

  select<T = Record<string, unknown>>(table: string, options?: SelectOptions): Promise<DataResult<T[]>>;
  selectOne<T = Record<string, unknown>>(table: string, options?: SelectOptions): Promise<T | null>;
  insert<T = Record<string, unknown>>(table: string, values: unknown | unknown[], options?: WriteOptions): Promise<T[]>;
  upsert<T = Record<string, unknown>>(table: string, values: unknown | unknown[], options?: WriteOptions): Promise<T[]>;
  update<T = Record<string, unknown>>(table: string, values: unknown, filters: Filter[], options?: WriteOptions): Promise<T[]>;
  remove(table: string, filters: Filter[]): Promise<void>;

  /** استدعاء دالة قاعدة بيانات (RPC) */
  rpc<T = unknown>(fn: string, args?: Record<string, unknown>): Promise<T>;

  /** استدعاء دالة خادم (حاليًا Edge Function، مستقبلًا مسار في الـ API الخاص بنا) */
  callFunction<T = unknown>(name: string, payload?: unknown, options?: { method?: string }): Promise<T>;

  /** الاشتراك في التغييرات اللحظية */
  subscribe<T = Record<string, unknown>>(
    channelName: string,
    subscriptions: RealtimeSubscription[],
    handler: (payload: RealtimeChangePayload<T>) => void,
  ): Unsubscribe;

  readonly storage: StorageBackend;
}

/** مساعدات بناء الفلاتر */
export const where = {
  eq: (column: string, value: unknown): Filter => ({ column, op: 'eq', value }),
  neq: (column: string, value: unknown): Filter => ({ column, op: 'neq', value }),
  gt: (column: string, value: unknown): Filter => ({ column, op: 'gt', value }),
  gte: (column: string, value: unknown): Filter => ({ column, op: 'gte', value }),
  lt: (column: string, value: unknown): Filter => ({ column, op: 'lt', value }),
  lte: (column: string, value: unknown): Filter => ({ column, op: 'lte', value }),
  like: (column: string, value: string): Filter => ({ column, op: 'like', value }),
  ilike: (column: string, value: string): Filter => ({ column, op: 'ilike', value }),
  in: (column: string, value: unknown[]): Filter => ({ column, op: 'in', value }),
  is: (column: string, value: null | boolean): Filter => ({ column, op: 'is', value }),
  contains: (column: string, value: unknown): Filter => ({ column, op: 'contains', value }),
};
