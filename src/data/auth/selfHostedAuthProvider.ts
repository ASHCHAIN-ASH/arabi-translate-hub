/**
 * مزوّد مصادقة مستقل (JWT من سيرفرنا الخاص) — غير مفعّل حاليًا.
 * يقابل مسارات `server/src/routes/auth.ts`.
 */

import { dataConfig, assertSelfHostedConfig } from '../config';
import type { AuthEvent, AuthProvider, AuthResult, AuthSession } from './types';

type Listener = (event: AuthEvent, session: AuthSession | null) => void;
const listeners = new Set<Listener>();

function emit(event: AuthEvent, session: AuthSession | null) {
  listeners.forEach((listener) => listener(event, session));
}

function readStoredSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(`${dataConfig.authStorageKey}.session`);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

function storeSession(session: AuthSession | null) {
  try {
    if (session) {
      localStorage.setItem(`${dataConfig.authStorageKey}.session`, JSON.stringify(session));
      localStorage.setItem(dataConfig.authStorageKey, session.accessToken);
    } else {
      localStorage.removeItem(`${dataConfig.authStorageKey}.session`);
      localStorage.removeItem(dataConfig.authStorageKey);
    }
  } catch {
    /* التخزين غير متاح */
  }
}

async function authApi<T>(path: string, body?: unknown): Promise<T> {
  assertSelfHostedConfig();
  const session = readStoredSession();
  const response = await fetch(`${dataConfig.apiBaseUrl.replace(/\/$/, '')}/auth${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(session ? { Authorization: `Bearer ${session.accessToken}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const payload = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok) throw new Error((payload.message as string) ?? 'فشل طلب المصادقة');
  return payload as T;
}

export const selfHostedAuthProvider: AuthProvider = {
  name: 'self-hosted',

  async getSession() {
    return readStoredSession();
  },

  async getUser() {
    return readStoredSession()?.user ?? null;
  },

  onAuthStateChange(handler) {
    listeners.add(handler);
    return () => listeners.delete(handler);
  },

  async signInWithPassword(email, password): Promise<AuthResult> {
    try {
      const { session } = await authApi<{ session: AuthSession }>('/sign-in', { email, password });
      storeSession(session);
      emit('SIGNED_IN', session);
      return { session, user: session.user };
    } catch (error) {
      return { session: null, user: null, error: (error as Error).message };
    }
  },

  async signUp(email, password, metadata = {}): Promise<AuthResult> {
    try {
      const { session } = await authApi<{ session: AuthSession | null }>('/sign-up', { email, password, metadata });
      if (session) {
        storeSession(session);
        emit('SIGNED_IN', session);
      }
      return { session, user: session?.user ?? null };
    } catch (error) {
      return { session: null, user: null, error: (error as Error).message };
    }
  },

  async signInWithOAuth(provider, redirectTo) {
    assertSelfHostedConfig();
    const target = new URL(`${dataConfig.apiBaseUrl}/auth/oauth/${provider}`);
    target.searchParams.set('redirect_to', redirectTo ?? window.location.origin);
    window.location.href = target.toString();
    return {};
  },

  async signOut() {
    try {
      await authApi('/sign-out');
    } catch {
      /* تجاهل — نُنهي الجلسة محليًا على أي حال */
    }
    storeSession(null);
    emit('SIGNED_OUT', null);
  },

  async requestPasswordReset(email, redirectTo) {
    try {
      await authApi('/password-reset', { email, redirectTo });
      return {};
    } catch (error) {
      return { error: (error as Error).message };
    }
  },

  async updatePassword(password) {
    try {
      await authApi('/password-update', { password });
      return {};
    } catch (error) {
      return { error: (error as Error).message };
    }
  },

  async updateUser(attributes) {
    try {
      const { session } = await authApi<{ session: AuthSession }>('/user-update', attributes);
      storeSession(session);
      emit('USER_UPDATED', session);
      return {};
    } catch (error) {
      return { error: (error as Error).message };
    }
  },

  async getAccessToken() {
    return readStoredSession()?.accessToken ?? null;
  },
};
