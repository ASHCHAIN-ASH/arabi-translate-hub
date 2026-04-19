import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './SimpleAuthProvider';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /**
   * If provided, only users whose DB role matches will be allowed.
   * 'admin' → only admins. 'client' → only NON-admin authenticated users.
   * NOTE: Admins are NOT auto-allowed on client-only routes — this prevents
   * bleed-through and mixed UI states.
   */
  requiredRole?: 'admin' | 'client';
  /**
   * Convenience flag equivalent to requiredRole="admin".
   * Kept for backwards compatibility with existing route definitions.
   */
  adminOnly?: boolean;
}

const SimpleProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  adminOnly = false,
}) => {
  const { user, userRole, loading } = useAuth();
  const location = useLocation();

  // While auth state is initializing OR while a logged-in user's role is being
  // resolved from the DB, render a loader. We must NEVER render protected
  // content with an unresolved role.
  const isResolvingRole = Boolean(user && !userRole);
  if (loading || isResolvingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // Not authenticated → send to the appropriate login page.
  if (!user) {
    const isAdminRoute =
      adminOnly ||
      requiredRole === 'admin' ||
      location.pathname.startsWith('/adminmaster');
    const loginPath = isAdminRoute ? '/adminmaster/login' : '/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Normalize the requirement.
  const effectiveRequired: 'admin' | 'client' | undefined = adminOnly
    ? 'admin'
    : requiredRole;

  // SECURITY: explicit whitelist checks — no implicit "admin can access
  // everything" bleed-through.
  if (effectiveRequired === 'admin') {
    // Only true admins. Anyone else (including unresolved/null) → client area.
    if (userRole !== 'admin') {
      return <Navigate to="/dashboard" replace />;
    }
  } else if (effectiveRequired === 'client') {
    // Only non-admin authenticated users by default.
    // EXCEPTION: admins are allowed to enter the order creation flow so they
    // can test/preview the client experience without being kicked back to /adminmaster.
    const isOrderFlow = location.pathname.startsWith('/orders/new');
    if (userRole !== 'client' && !(userRole === 'admin' && isOrderFlow)) {
      return <Navigate to="/adminmaster" replace />;
    }
  }

  return <>{children}</>;
};

export default SimpleProtectedRoute;
