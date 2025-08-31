import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Tenant {
  id: string;
  code: string;
  name: string;
  primary_domain: string;
  extra_domains: string[];
  is_active: boolean;
  jwt_secret: string;
  cookie_name: string;
  storage_prefix: string;
  created_at: string;
  updated_at: string;
}

interface TenantContextType {
  tenant: Tenant | null;
  loading: boolean;
  error: string | null;
  resolveTenant: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

// Helper functions for normalization
export const normalizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

export const normalizeDigits = (input: string): string => {
  return input.replace(/[٠١٢٣٤٥٦٧٨٩]/g, (match) => {
    const arabicDigits = '٠١٢٣٤٥٦٧٨٩';
    const englishDigits = '0123456789';
    return englishDigits[arabicDigits.indexOf(match)];
  });
};

const resolveTenantByHost = async (hostname: string): Promise<Tenant | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('tenant-auth', {
      body: {
        action: 'resolve-tenant',
        hostname
      }
    });

    if (error) {
      console.error('Error resolving tenant:', error);
      return null;
    }

    return data?.tenant || null;
  } catch (error) {
    console.error('Error in resolveTenantByHost:', error);
    return null;
  }
};

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resolveTenant = async () => {
    try {
      setLoading(true);
      setError(null);

      const hostname = window.location.hostname + (window.location.port ? `:${window.location.port}` : '');
      const resolvedTenant = await resolveTenantByHost(hostname);

      if (!resolvedTenant) {
        setError('الموقع غير مفعّل');
        setTenant(null);
        return;
      }

      setTenant(resolvedTenant);

      // Set current tenant in Supabase session for RLS by using a custom header
      // This will be handled at the database level through policies

    } catch (err) {
      console.error('Error resolving tenant:', err);
      setError('حدث خطأ في تحديد الموقع');
      setTenant(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    resolveTenant();
  }, []);

  // Set up tenant-specific storage prefix
  useEffect(() => {
    if (tenant?.code) {
      // Use tenant code as localStorage prefix
      const originalSetItem = localStorage.setItem;
      const originalGetItem = localStorage.getItem;
      const originalRemoveItem = localStorage.removeItem;

      localStorage.setItem = function(key: string, value: string) {
        return originalSetItem.call(this, `${tenant.code}:${key}`, value);
      };

      localStorage.getItem = function(key: string) {
        return originalGetItem.call(this, `${tenant.code}:${key}`);
      };

      localStorage.removeItem = function(key: string) {
        return originalRemoveItem.call(this, `${tenant.code}:${key}`);
      };
    }
  }, [tenant]);

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">
            {error || 'الموقع غير متاح'}
          </h1>
          <p className="text-muted-foreground">
            يرجى التأكد من صحة الرابط أو التواصل مع الإدارة
          </p>
        </div>
      </div>
    );
  }

  const value = {
    tenant,
    loading,
    error,
    resolveTenant,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};