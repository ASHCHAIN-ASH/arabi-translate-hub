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

  // Only block the very first auth initialization (no user info at all yet).
  // Once we have a user, render the page immediately even if the role is still
  // resolving — this avoids the disruptive "جاري التحميل..." flash on every
  // route change.
  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
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

  // If role is still resolving for an authenticated user, show a minimal
  // inline spinner (no full-screen "جاري التحميل..." text) to avoid the
  // disruptive flash on every navigation.
  if (effectiveRequired && !userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary/60" />
      </div>
    );
  }

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
