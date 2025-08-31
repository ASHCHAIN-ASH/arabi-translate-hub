import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { initializeTenant, Tenant, TenantContext } from '@/lib/tenant';

interface TenantProviderProps {
  children: ReactNode;
}

interface TenantContextType {
  tenant: Tenant | null;
  loading: boolean;
  error: string | null;
}

const TenantContextProvider = createContext<TenantContextType | undefined>(undefined);

export const useTenant = () => {
  const context = useContext(TenantContextProvider);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initTenant = async () => {
      try {
        setLoading(true);
        const resolvedTenant = await initializeTenant();
        
        if (!resolvedTenant) {
          setError('الموقع غير مفعّل');
          return;
        }
        
        setTenant(resolvedTenant);
        TenantContext.set(resolvedTenant);
        setError(null);
      } catch (err) {
        console.error('Tenant initialization error:', err);
        setError('حدث خطأ في تحديد الموقع');
      } finally {
        setLoading(false);
      }
    };

    initTenant();
  }, []);

  // Show error page if tenant resolution failed
  if (error && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-destructive mb-4">خطأ</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  // Show loading spinner while resolving tenant
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل الموقع...</p>
        </div>
      </div>
    );
  }

  return (
    <TenantContextProvider.Provider value={{ tenant, loading, error }}>
      {children}
    </TenantContextProvider.Provider>
  );
};