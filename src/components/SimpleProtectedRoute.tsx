import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './SimpleAuthProvider';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  adminOnly?: boolean;
}

const SimpleProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  adminOnly = false
}) => {
  const { user, userRole, loading } = useAuth();
  const location = useLocation();
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

  if (!user) {
    const isAdminRoute = location.pathname.startsWith('/adminmaster');
    const loginPath = isAdminRoute ? '/adminmaster/login' : '/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (adminOnly && userRole !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredRole && userRole !== requiredRole && userRole !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default SimpleProtectedRoute;
