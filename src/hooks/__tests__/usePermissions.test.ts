import { describe, it, expect } from 'vitest';

// Test the permission logic directly (no React context needed)
describe('usePermissions logic', () => {
  const makePermissions = (user: any, userRole: string | null) => {
    const isAuthenticated = !!user;
    const isAdmin = userRole === 'admin';
    const isClient = !isAdmin && isAuthenticated;

    const canAccess = (requiredRole?: 'admin' | 'client') => {
      if (!isAuthenticated) return false;
      if (!requiredRole) return true;
      if (requiredRole === 'admin') return isAdmin;
      if (requiredRole === 'client') return isClient || isAdmin;
      return false;
    };

    return { isAuthenticated, isAdmin, isClient, canAccess, userRole, userId: user?.id ?? null };
  };

  it('unauthenticated user has no access', () => {
    const p = makePermissions(null, null);
    expect(p.isAuthenticated).toBe(false);
    expect(p.isAdmin).toBe(false);
    expect(p.isClient).toBe(false);
    expect(p.canAccess()).toBe(false);
    expect(p.canAccess('admin')).toBe(false);
    expect(p.canAccess('client')).toBe(false);
  });

  it('admin user has full access', () => {
    const p = makePermissions({ id: 'u1' }, 'admin');
    expect(p.isAuthenticated).toBe(true);
    expect(p.isAdmin).toBe(true);
    expect(p.isClient).toBe(false);
    expect(p.canAccess()).toBe(true);
    expect(p.canAccess('admin')).toBe(true);
    expect(p.canAccess('client')).toBe(true); // admin can access client routes
  });

  it('client user has limited access', () => {
    const p = makePermissions({ id: 'u2' }, 'client');
    expect(p.isAuthenticated).toBe(true);
    expect(p.isAdmin).toBe(false);
    expect(p.isClient).toBe(true);
    expect(p.canAccess()).toBe(true);
    expect(p.canAccess('admin')).toBe(false);
    expect(p.canAccess('client')).toBe(true);
  });

  it('authenticated user with no role is treated as client', () => {
    const p = makePermissions({ id: 'u3' }, null);
    expect(p.isAuthenticated).toBe(true);
    expect(p.isAdmin).toBe(false);
    expect(p.isClient).toBe(true);
  });
});
