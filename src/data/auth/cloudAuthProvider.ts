/** مزوّد المصادقة الحالي (Lovable Cloud). لا يغيّر أي سلوك قائم. */

import { supabase } from '@/integrations/supabase/client';
import type { Session, User } from '@supabase/supabase-js';
import type { AuthEvent, AuthProvider, AuthResult, AuthSession, AuthUser } from './types';

function mapUser(user: User | null | undefined): AuthUser | null {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email ?? null,
    phone: user.phone ?? null,
    metadata: (user.user_metadata ?? {}) as Record<string, unknown>,
    createdAt: user.created_at ?? null,
  };
}

function mapSession(session: Session | null | undefined): AuthSession | null {
  if (!session) return null;
  return {
    accessToken: session.access_token,
    refreshToken: session.refresh_token ?? null,
    expiresAt: session.expires_at ?? null,
    user: mapUser(session.user)!,
  };
}

export const cloudAuthProvider: AuthProvider = {
  name: 'lovable-cloud',

  async getSession() {
    const { data } = await supabase.auth.getSession();
    return mapSession(data.session);
  },

  async getUser() {
    const { data } = await supabase.auth.getUser();
    return mapUser(data.user);
  },

  onAuthStateChange(handler) {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      handler(event as AuthEvent, mapSession(session));
    });
    return () => data.subscription.unsubscribe();
  },

  async signInWithPassword(email, password): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { session: null, user: null, error: error.message };
    return { session: mapSession(data.session), user: mapUser(data.user) };
  },

  async signUp(email, password, metadata = {}, redirectTo): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata, emailRedirectTo: redirectTo },
    });
    if (error) return { session: null, user: null, error: error.message };
    return { session: mapSession(data.session), user: mapUser(data.user) };
  },

  async signInWithOAuth(provider, redirectTo) {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: redirectTo ?? window.location.origin },
    });
    return { error: error?.message };
  },

  async signOut() {
    await supabase.auth.signOut();
  },

  async requestPasswordReset(email, redirectTo) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    return { error: error?.message };
  },

  async updatePassword(password) {
    const { error } = await supabase.auth.updateUser({ password });
    return { error: error?.message };
  },

  async updateUser(attributes) {
    const { error } = await supabase.auth.updateUser(attributes);
    return { error: error?.message };
  },

  async getAccessToken() {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  },
};
