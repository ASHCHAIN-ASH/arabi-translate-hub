import { useAuth } from '@/components/SimpleAuthProvider';

export function usePermissions() {
  const { user, userRole, loading } = useAuth();

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

  return {
    isAuthenticated,
    isAdmin,
    isClient,
    canAccess,
    loading,
    userRole,
    userId: user?.id ?? null,
    userEmail: user?.email ?? null,
  };
}
