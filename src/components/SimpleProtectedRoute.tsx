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
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
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
    // Redirect to login with current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check admin access
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check specific role requirement
  if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default SimpleProtectedRoute;