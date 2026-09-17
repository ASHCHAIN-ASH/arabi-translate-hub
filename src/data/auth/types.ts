/** عقد المصادقة المستقل عن أي مزوّد. */

export interface AuthUser {
  id: string;
  email: string | null;
  phone: string | null;
  metadata: Record<string, unknown>;
  createdAt: string | null;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string | null;
  expiresAt: number | null;
  user: AuthUser;
}

export interface AuthResult {
  session: AuthSession | null;
  user: AuthUser | null;
  error?: string;
}

export type AuthEvent = 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'USER_UPDATED' | 'PASSWORD_RECOVERY';

export interface AuthProvider {
  readonly name: string;
  getSession(): Promise<AuthSession | null>;
  getUser(): Promise<AuthUser | null>;
  onAuthStateChange(handler: (event: AuthEvent, session: AuthSession | null) => void): () => void;
  signInWithPassword(email: string, password: string): Promise<AuthResult>;
  signUp(email: string, password: string, metadata?: Record<string, unknown>, redirectTo?: string): Promise<AuthResult>;
  signInWithOAuth(provider: 'google', redirectTo?: string): Promise<{ error?: string }>;
  signOut(): Promise<void>;
  requestPasswordReset(email: string, redirectTo?: string): Promise<{ error?: string }>;
  updatePassword(password: string): Promise<{ error?: string }>;
  updateUser(attributes: { email?: string; phone?: string; data?: Record<string, unknown> }): Promise<{ error?: string }>;
  /** التوكن الحالي لإرساله لأي API خارجي */
  getAccessToken(): Promise<string | null>;
}
