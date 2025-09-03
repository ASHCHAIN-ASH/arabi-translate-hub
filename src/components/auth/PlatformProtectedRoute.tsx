import { Navigate } from 'react-router-dom';
import { usePlatformAuth } from './PlatformAuthProvider';

interface PlatformProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  fallbackPath?: string;
}

export function PlatformProtectedRoute({ 
  children, 
  requiredRole, 
  fallbackPath = '/platform/login' 
}: PlatformProtectedRouteProps) {
  const { user, loading } = usePlatformAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={fallbackPath} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/platform/unauthorized" replace />;
  }

  return <>{children}</>;
}