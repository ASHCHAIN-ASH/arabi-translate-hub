import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Customer {
  id: string;
  user_id?: string;
  full_name: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive' | 'blocked';
  email_verified: boolean;
  phone_verified: boolean;
  last_login_at?: string;
  profile_data?: any;
  created_at: string;
  updated_at: string;
}

export interface CustomerStats {
  total: number;
  active: number;
  blocked: number;
  newToday: number;
}

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<CustomerStats>({ total: 0, active: 0, blocked: 0, newToday: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCustomers((data || []) as Customer[]);
      
      // حساب الإحصائيات
      const today = new Date().toDateString();
      const newStats = {
        total: data?.length || 0,
        active: data?.filter(c => c.status === 'active').length || 0,
        blocked: data?.filter(c => c.status === 'blocked').length || 0,
        newToday: data?.filter(c => new Date(c.created_at).toDateString() === today).length || 0
      };
      setStats(newStats);

    } catch (err: any) {
      console.error('Error fetching customers:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateCustomerPassword = async (customerId: string, newPassword: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-management', {
        body: {
          customerId,
          action: 'update_password',
          data: { newPassword }
        }
      });

      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error('Error updating password:', err);
      throw err;
    }
  };

  const updateCustomerStatus = async (customerId: string, status: string, reason?: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-management', {
        body: {
          customerId,
          action: 'update_status',
          data: { status, reason }
        }
      });

      if (error) throw error;
      
      // تحديث البيانات محلياً
      setCustomers(prev => prev.map(customer => 
        customer.id === customerId 
          ? { ...customer, status: status as any, updated_at: new Date().toISOString() }
          : customer
      ));

      return data;
    } catch (err: any) {
      console.error('Error updating status:', err);
      throw err;
    }
  };

  const updateCustomerProfile = async (customerId: string, profileData: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-management', {
        body: {
          customerId,
          action: 'update_profile',
          data: profileData
        }
      });

      if (error) throw error;

      // تحديث البيانات محلياً
      setCustomers(prev => prev.map(customer => 
        customer.id === customerId 
          ? { ...customer, ...profileData, updated_at: new Date().toISOString() }
          : customer
      ));

      return data;
    } catch (err: any) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  const deleteCustomer = async (customerId: string) => {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', customerId);

      if (error) throw error;

      setCustomers(prev => prev.filter(customer => customer.id !== customerId));
      return { success: true, message: 'تم حذف العميل بنجاح' };
    } catch (err: any) {
      console.error('Error deleting customer:', err);
      throw err;
    }
  };

  // إعداد التحديثات اللحظية
  useEffect(() => {
    fetchCustomers();

    // الاشتراك في التحديثات اللحظية
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'customers'
        },
        (payload) => {
          console.log('Customer realtime update:', payload);
          fetchCustomers(); // إعادة تحميل البيانات عند أي تغيير
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    customers,
    stats,
    loading,
    error,
    updateCustomerPassword,
    updateCustomerStatus,
    updateCustomerProfile,
    deleteCustomer,
    refresh: fetchCustomers
  };
}