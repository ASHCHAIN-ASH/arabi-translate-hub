// Tenant management system for multi-tenant isolation

import { supabase } from '@/integrations/supabase/client';

export interface Tenant {
  id: string;
  code: string;
  name: string;
  primary_domain: string;
  extra_domains: string[];
  cookie_name: string;
  jwt_secret: string;
  storage_prefix: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Global tenant context
let currentTenantInstance: Tenant | null = null;

export const TenantContext = {
  current: null as Tenant | null,
  
  set(tenant: Tenant | null) {
    this.current = tenant;
    currentTenantInstance = tenant;
    
    // Set tenant in Supabase context if available
    if (tenant && typeof window !== 'undefined') {
      // Store in sessionStorage for the duration of the session
      sessionStorage.setItem('current_tenant', JSON.stringify(tenant));
    }
  },
  
  get(): Tenant | null {
    if (this.current) return this.current;
    if (currentTenantInstance) return currentTenantInstance;
    
    // Try to restore from sessionStorage
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('current_tenant');
      if (stored) {
        try {
          const tenant = JSON.parse(stored);
          this.current = tenant;
          currentTenantInstance = tenant;
          return tenant;
        } catch (e) {
          console.error('Failed to parse stored tenant:', e);
        }
      }
    }
    
    return null;
  },
  
  clear() {
    this.current = null;
    currentTenantInstance = null;
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('current_tenant');
    }
  }
};

// Helper functions
export const currentTenant = (): Tenant | null => {
  return TenantContext.get();
};

export const cookieName = (): string => {
  const tenant = currentTenant();
  return tenant?.cookie_name || 'sid_default';
};

export const jwtSecret = (): string => {
  const tenant = currentTenant();
  return tenant?.jwt_secret || '';
};

export const storagePrefix = (): string => {
  const tenant = currentTenant();
  return tenant?.storage_prefix || 'uploads/default/';
};

// Tenant resolution by host
export const resolveTenantByHost = async (host: string): Promise<Tenant | null> => {
  try {
    console.log('Resolving tenant for host:', host);
    
    // Check for tenant parameter in preview environment
    if (host.includes('sandbox.lovable.dev') || host.includes('localhost')) {
      const urlParams = new URLSearchParams(window.location.search);
      const tenantParam = urlParams.get('tenant');
      
      if (tenantParam && ['mep', 'ash', 'fka'].includes(tenantParam)) {
        console.log('Using tenant from parameter:', tenantParam);
        const { data: tenant, error } = await supabase
          .from('tenants')
          .select('*')
          .eq('code', tenantParam)
          .eq('is_active', true)
          .single();
          
        if (!error && tenant) {
          TenantContext.set(tenant);
          return tenant;
        }
      }
    }
    
    // Resolve by domain
    const { data: tenants, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('is_active', true);
      
    if (error) {
      console.error('Error fetching tenants:', error);
      return null;
    }
    
    // Find matching tenant by primary domain or extra domains
    const tenant = tenants?.find(t => 
      t.primary_domain === host || 
      t.extra_domains?.includes(host) ||
      (host.includes('sandbox.lovable.dev') && t.extra_domains?.includes('*.sandbox.lovable.dev'))
    );
    
    if (tenant) {
      console.log('Found tenant:', tenant);
      TenantContext.set(tenant);
      return tenant;
    }
    
    // Fallback to first tenant for development
    if (tenants && tenants.length > 0) {
      console.log('Using fallback tenant:', tenants[0]);
      TenantContext.set(tenants[0]);
      return tenants[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error resolving tenant:', error);
    return null;
  }
};

// Normalize functions
export const normalizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

export const normalizeDigits = (input: string): string => {
  return input.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
};

// Tenant isolation utilities
export const withTenantIsolation = async <T>(
  query: any,
  tenant?: Tenant | null
): Promise<T> => {
  const activeTenant = tenant || currentTenant();
  if (!activeTenant) {
    throw new Error('No active tenant found');
  }
  
  return query.eq('tenant_id', activeTenant.id);
};

// Initialize tenant resolution
export const initializeTenant = async (): Promise<Tenant | null> => {
  if (typeof window === 'undefined') return null;
  
  const host = window.location.hostname;
  return await resolveTenantByHost(host);
};