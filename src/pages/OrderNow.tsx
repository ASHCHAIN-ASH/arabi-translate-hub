import React from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '@/components/SimpleAuthProvider';

const OrderNow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const selectedService = (location.state as { selectedService?: { id?: string } } | null)?.selectedService;
    const serviceId = selectedService?.id;

    if (!user) {
      const target = serviceId ? `/orders/new?service=${serviceId}` : '/client-services';
      navigate('/login', { replace: true, state: { from: { pathname: target } } });
      return;
    }

    if (serviceId) {
      navigate(`/orders/new?service=${serviceId}`, { replace: true });
      return;
    }

    navigate('/client-services', { replace: true });
  }, [loading, location.state, navigate, user]);

  return (
    <div className="min-h-screen flex items-center justify-center" dir="rtl">
      <div className="flex items-center gap-3 text-muted-foreground">
        <RefreshCw className="w-5 h-5 animate-spin" />
        <span>جارٍ تحويلك إلى صفحة الطلب...</span>
      </div>
    </div>
  );
};

export default OrderNow;