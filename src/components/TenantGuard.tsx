import React from 'react';
import { useTenant } from '@/contexts/TenantContext';

interface TenantGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const TenantGuard: React.FC<TenantGuardProps> = ({ 
  children, 
  fallback = (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-destructive mb-4">
          الموقع غير متاح
        </h1>
        <p className="text-muted-foreground">
          يرجى التأكد من صحة الرابط أو التواصل مع الإدارة
        </p>
      </div>
    </div>
  )
}) => {
  const { tenant, loading, error } = useTenant();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحديد الموقع...</p>
        </div>
      </div>
    );
  }

  if (error || !tenant) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};