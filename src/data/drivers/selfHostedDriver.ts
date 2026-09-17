/**
 * مزوّد البيانات المستقل — PostgreSQL على سيرفرنا الخاص عبر API الموجود في مجلد `server/`.
 *
 * غير مفعّل حاليًا. يعمل تلقائيًا عند ضبط:
 *   VITE_DATA_DRIVER=self-hosted
 *   VITE_API_BASE_URL=https://api.fekrahedu.com
 *
 * العقود هنا مطابقة تمامًا لمسارات `server/src/routes/*`.
 */

import { dataConfig, assertSelfHostedConfig } from '../config';
import {
  DataError,
  type DataBackend,
  type DataResult,
  type Filter,
  type RealtimeChangePayload,
  type RealtimeSubscription,
  type SelectOptions,
  type StorageBackend,
  type Unsubscribe,
  type WriteOptions,
} from '../types';

function authToken(): string | null {
  try {
    return localStorage.getItem(dataConfig.authStorageKey);
  } catch {
    return null;
  }
}

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  assertSelfHostedConfig();
  const token = authToken();
  const response = await fetch(`${dataConfig.apiBaseUrl.replace(/\/$/, '')}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = `خطأ في الاتصال بالخادم (${response.status})`;
    let code: string | undefined;
    try {
      const body = await response.json();
      message = body.message ?? body.error ?? message;
      code = body.code;
    } catch {
      /* الرد ليس JSON */
    }
    throw new DataError(message, { status: response.status, code });
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

const storage: StorageBackend = {
  async upload(bucket, path, file, options = {}) {
    assertSelfHostedConfig();
    const token = authToken();
    const form = new FormData();
    form.append('file', file instanceof Blob ? file : new Blob([file as ArrayBuffer]));
    form.append('path', path);
    if (options.contentType) form.append('contentType', options.contentType);
    if (options.upsert) form.append('upsert', 'true');
    const response = await fetch(`${dataConfig.apiBaseUrl}/storage/${bucket}/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: form,
    });
    if (!response.ok) throw new DataError(`فشل رفع الملف (${response.status})`, { status: response.status });
    return (await response.json()) as { path: string };
  },
  getPublicUrl(bucket, path) {
    return `${dataConfig.apiBaseUrl}/storage/${bucket}/public/${path}`;
  },
  async createSignedUrl(bucket, path, expiresInSeconds) {
    const result = await api<{ url: string }>(`/storage/${bucket}/sign`, {
      method: 'POST',
      body: JSON.stringify({ path, expiresIn: expiresInSeconds }),
    });
    return result.url;
  },
  async remove(bucket, paths) {
    await api(`/storage/${bucket}/remove`, { method: 'POST', body: JSON.stringify({ paths }) });
  },
  async download(bucket, path) {
    const response = await fetch(`${dataConfig.apiBaseUrl}/storage/${bucket}/download?path=${encodeURIComponent(path)}`);
    if (!response.ok) throw new DataError(`فشل تنزيل الملف (${response.status})`, { status: response.status });
    return await response.blob();
  },
};

export const selfHostedDriver: DataBackend = {
  name: 'self-hosted',

  async select<T>(table: string, options: SelectOptions = {}): Promise<DataResult<T[]>> {
    return await api<DataResult<T[]>>(`/data/${table}/select`, {
      method: 'POST',
      body: JSON.stringify(options),
    });
  },

  async selectOne<T>(table: string, options: SelectOptions = {}): Promise<T | null> {
    const result = await api<DataResult<T[]>>(`/data/${table}/select`, {
      method: 'POST',
      body: JSON.stringify({ ...options, limit: 1 }),
    });
    return result.data[0] ?? null;
  },

  async insert<T>(table: string, values: unknown, options: WriteOptions = {}): Promise<T[]> {
    const result = await api<DataResult<T[]>>(`/data/${table}/insert`, {
      method: 'POST',
      body: JSON.stringify({ values, options }),
    });
    return result.data;
  },

  async upsert<T>(table: string, values: unknown, options: WriteOptions = {}): Promise<T[]> {
    const result = await api<DataResult<T[]>>(`/data/${table}/upsert`, {
      method: 'POST',
      body: JSON.stringify({ values, options }),
    });
    return result.data;
  },

  async update<T>(table: string, values: unknown, filters: Filter[], options: WriteOptions = {}): Promise<T[]> {
    const result = await api<DataResult<T[]>>(`/data/${table}/update`, {
      method: 'POST',
      body: JSON.stringify({ values, filters, options }),
    });
    return result.data;
  },

  async remove(table: string, filters: Filter[]): Promise<void> {
    await api(`/data/${table}/delete`, { method: 'POST', body: JSON.stringify({ filters }) });
  },

  async rpc<T>(fn: string, args: Record<string, unknown> = {}): Promise<T> {
    const result = await api<{ data: T }>(`/rpc/${fn}`, { method: 'POST', body: JSON.stringify(args) });
    return result.data;
  },

  async callFunction<T>(name: string, payload?: unknown, options: { method?: string } = {}): Promise<T> {
    const result = await api<{ data: T }>(`/functions/${name}`, {
      method: options.method ?? 'POST',
      body: payload === undefined ? undefined : JSON.stringify(payload),
    });
    return result.data ?? (result as unknown as T);
  },

  subscribe<T>(
    channelName: string,
    subscriptions: RealtimeSubscription[],
    handler: (payload: RealtimeChangePayload<T>) => void,
  ): Unsubscribe {
    assertSelfHostedConfig();
    // التحديث اللحظي على السيرفر الخاص يتم عبر SSE (server/src/routes/realtime.ts)
    const params = new URLSearchParams({
      channel: channelName,
      subscriptions: JSON.stringify(subscriptions),
    });
    const source = new EventSource(`${dataConfig.apiBaseUrl}/realtime/stream?${params.toString()}`);
    source.onmessage = (event) => {
      try {
        handler(JSON.parse(event.data) as RealtimeChangePayload<T>);
      } catch {
        /* تجاهل الرسائل غير الصالحة */
      }
    };
    return () => source.close();
  },

  storage,
};
