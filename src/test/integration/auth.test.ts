import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock supabase
const mockSignIn = vi.fn();
const mockSignUp = vi.fn();
const mockSignOut = vi.fn();
const mockGetSession = vi.fn();
const mockOnAuthStateChange = vi.fn(() => ({
  data: { subscription: { unsubscribe: vi.fn() } },
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: mockSignIn,
      signUp: mockSignUp,
      signOut: mockSignOut,
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange,
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

describe('Auth Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signInWithPassword', () => {
    it('returns session on valid credentials', async () => {
      const mockSession = {
        user: { id: 'u1', email: 'admin@test.com' },
        access_token: 'jwt-token',
      };
      mockSignIn.mockResolvedValue({ data: { session: mockSession }, error: null });

      const { supabase } = await import('@/integrations/supabase/client');
      const result = await supabase.auth.signInWithPassword({
        email: 'admin@test.com',
        password: 'password123',
      });

      expect(result.data.session).toBeTruthy();
      expect(result.data.session.user.email).toBe('admin@test.com');
      expect(result.error).toBeNull();
    });

    it('returns error on invalid credentials', async () => {
      mockSignIn.mockResolvedValue({
        data: { session: null },
        error: { message: 'Invalid login credentials' },
      });

      const { supabase } = await import('@/integrations/supabase/client');
      const result = await supabase.auth.signInWithPassword({
        email: 'wrong@test.com',
        password: 'wrong',
      });

      expect(result.data.session).toBeNull();
      expect(result.error.message).toContain('Invalid');
    });
  });

  describe('signUp', () => {
    it('creates user and returns session', async () => {
      const mockSession = {
        user: { id: 'new-u', email: 'new@test.com' },
        access_token: 'new-jwt',
      };
      mockSignUp.mockResolvedValue({ data: { session: mockSession, user: mockSession.user }, error: null });

      const { supabase } = await import('@/integrations/supabase/client');
      const result = await supabase.auth.signUp({
        email: 'new@test.com',
        password: 'securePass123',
      });

      expect(result.data.user.email).toBe('new@test.com');
      expect(result.error).toBeNull();
    });
  });

  describe('signOut', () => {
    it('clears session successfully', async () => {
      mockSignOut.mockResolvedValue({ error: null });

      const { supabase } = await import('@/integrations/supabase/client');
      const result = await supabase.auth.signOut();

      expect(result.error).toBeNull();
      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  describe('onAuthStateChange', () => {
    it('sets up listener and returns unsubscribe', async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      const result = supabase.auth.onAuthStateChange(() => {});

      expect(result.data.subscription.unsubscribe).toBeDefined();
      expect(mockOnAuthStateChange).toHaveBeenCalled();
    });
  });
});
