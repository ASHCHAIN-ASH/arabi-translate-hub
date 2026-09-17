/**
 * المزوّد الحالي (Lovable Cloud / PostgREST).
 * هذا هو الملف الوحيد — مع مزوّد المصادقة — الذي يعرف تفاصيل المزوّد الحالي.
 */

import { supabase } from '@/integrations/supabase/client';
import {
  DataError,
  type DataBackend,
  type DataResult,
  type Filter,
  type OrderBy,
  type RealtimeChangePayload,
  type RealtimeSubscription,
  type SelectOptions,
  type StorageBackend,
  type Unsubscribe,
  type UploadOptions,
  type WriteOptions,
} from '../types';

/* eslint-disable @typescript-eslint/no-explicit-any */

function fail(error: { message: string; code?: string; details?: string; hint?: string } | null): never | void {
  if (!error) return;
  throw new DataError(error.message, {
    code: (error as any).code,
    details: (error as any).details,
    hint: (error as any).hint,
    cause: error,
  });
}

function applyFilters(query: any, filters?: Filter[]) {
  if (!filters?.length) return query;
  let q = query;
  for (const f of filters) {
    switch (f.op) {
      case 'in':
        q = q.in(f.column, f.value as unknown[]);
        break;
      case 'is':
        q = q.is(f.column, f.value as null | boolean);
        break;
      case 'contains':
        q = q.contains(f.column, f.value as any);
        break;
      case 'overlaps':
        q = q.overlaps(f.column, f.value as any);
        break;
      default:
        q = q[f.op](f.column, f.value as any);
    }
  }
  return q;
}

function applyOrder(query: any, order?: OrderBy | OrderBy[]) {
  if (!order) return query;
  const list = Array.isArray(order) ? order : [order];
  let q = query;
  for (const o of list) {
    q = q.order(o.column, { ascending: o.ascending ?? true, nullsFirst: o.nullsFirst });
  }
  return q;
}

function buildSelect(table: string, options: SelectOptions = {}) {
  let query: any = (supabase as any).from(table).select(options.columns ?? '*', options.count ? { count: options.count } : undefined);
  query = applyFilters(query, options.filters);
  if (options.or) query = query.or(options.or);
  query = applyOrder(query, options.order);
  if (options.range) query = query.range(options.range[0], options.range[1]);
  if (options.limit) query = query.limit(options.limit);
  return query;
}

const storage: StorageBackend = {
  async upload(bucket, path, file, options: UploadOptions = {}) {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file as any, {
      contentType: options.contentType,
      upsert: options.upsert ?? false,
      cacheControl: options.cacheControl,
    });
    fail(error as any);
    return { path: data!.path };
  },
  getPublicUrl(bucket, path) {
    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  },
  async createSignedUrl(bucket, path, expiresInSeconds) {
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresInSeconds);
    fail(error as any);
    return data!.signedUrl;
  },
  async remove(bucket, paths) {
    const { error } = await supabase.storage.from(bucket).remove(paths);
    fail(error as any);
  },
  async download(bucket, path) {
    const { data, error } = await supabase.storage.from(bucket).download(path);
    fail(error as any);
    return data as Blob;
  },
};

export const lovableCloudDriver: DataBackend = {
  name: 'lovable-cloud',

  async select<T>(table: string, options: SelectOptions = {}): Promise<DataResult<T[]>> {
    const { data, error, count } = await buildSelect(table, options);
    fail(error);
    return { data: (data ?? []) as T[], count };
  },

  async selectOne<T>(table: string, options: SelectOptions = {}): Promise<T | null> {
    const { data, error } = await buildSelect(table, { ...options, limit: options.limit ?? 1 }).maybeSingle();
    fail(error);
    return (data ?? null) as T | null;
  },

  async insert<T>(table: string, values: unknown, options: WriteOptions = {}): Promise<T[]> {
    let query: any = (supabase as any).from(table).insert(values as any);
    if (options.returning !== false) query = query.select();
    const { data, error } = await query;
    fail(error);
    return (data ?? []) as T[];
  },

  async upsert<T>(table: string, values: unknown, options: WriteOptions = {}): Promise<T[]> {
    let query: any = (supabase as any).from(table).upsert(values as any, { onConflict: options.onConflict });
    if (options.returning !== false) query = query.select();
    const { data, error } = await query;
    fail(error);
    return (data ?? []) as T[];
  },

  async update<T>(table: string, values: unknown, filters: Filter[], options: WriteOptions = {}): Promise<T[]> {
    let query: any = applyFilters((supabase as any).from(table).update(values as any), filters);
    if (options.returning !== false) query = query.select();
    const { data, error } = await query;
    fail(error);
    return (data ?? []) as T[];
  },

  async remove(table: string, filters: Filter[]): Promise<void> {
    const { error } = await applyFilters((supabase as any).from(table).delete(), filters);
    fail(error);
  },

  async rpc<T>(fn: string, args: Record<string, unknown> = {}): Promise<T> {
    const { data, error } = await (supabase as any).rpc(fn, args);
    fail(error);
    return data as T;
  },

  async callFunction<T>(name: string, payload?: unknown): Promise<T> {
    const { data, error } = await supabase.functions.invoke(name, payload === undefined ? undefined : { body: payload as any });
    if (error) {
      throw new DataError(error.message ?? `فشل استدعاء الدالة ${name}`, { cause: error });
    }
    return data as T;
  },

  subscribe<T>(
    channelName: string,
    subscriptions: RealtimeSubscription[],
    handler: (payload: RealtimeChangePayload<T>) => void,
  ): Unsubscribe {
    let channel: any = supabase.channel(channelName);
    for (const sub of subscriptions) {
      channel = channel.on(
        'postgres_changes',
        { event: sub.event ?? '*', schema: 'public', table: sub.table, filter: sub.filter },
        (payload: any) => {
          handler({
            eventType: payload.eventType,
            new: (payload.new ?? null) as T | null,
            old: (payload.old ?? null) as Partial<T> | null,
            table: sub.table,
          });
        },
      );
    }
    channel.subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  },

  storage,
};
