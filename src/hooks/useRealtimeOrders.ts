import { useState, useEffect } from 'react';
import { supabase } from '@/data/legacy/client';
import { getAllOrders, updateOrderStatus, type DatabaseOrder } from '@/utils/supabaseOrderService';
import { toast } from 'sonner';

export const useRealtimeOrders = () => {
  const [orders, setOrders] = useState<DatabaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  const loadOrders = async () => {
    try {
      setLoading(true);
      const orderData = await getAllOrders();
      setOrders(orderData);
      setError(null);
    } catch (err) {
      console.error('Error loading orders:', err);
      setError('فشل في تحميل الطلبات');
      toast.error('فشل في تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  };

  // Update order status with email notification
  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      // Find the order to get client details
      const order = orders.find(o => o.id === orderId);
      if (!order) {
        throw new Error('الطلب غير موجود');
      }

      // Update the order status locally for immediate UI feedback
      setOrders(prevOrders => 
        prevOrders.map(o => 
          o.id === orderId 
            ? { ...o, current_status: newStatus, updated_at: new Date().toISOString() }
            : o
        )
      );

      // Update in database
      await updateOrderStatus(orderId, newStatus);

      // Send email notification
      await supabase.functions.invoke('send-order-status-email', {
        body: {
          orderId: orderId,
          newStatus: newStatus,
          orderTitle: order.title,
          clientName: order.client_name,
          clientEmail: order.client_email,
          trackingId: order.tracking_id,
          estimatedDelivery: order.estimated_delivery
        }
      });

      toast.success('تم تحديث حالة الطلب وإرسال الإشعار بنجاح', {
        description: `تم تحديث الطلب ${order.tracking_id}`
      });

    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error('فشل في تحديث حالة الطلب');
      
      // Revert the local change if the update failed
      setOrders(prevOrders => 
        prevOrders.map(o => 
          o.id === orderId 
            ? { ...o, current_status: orders.find(orig => orig.id === orderId)?.current_status || o.current_status }
            : o
        )
      );
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    loadOrders();

    // Subscribe to orders table changes (admin-only hook, no user filter needed)
    const ordersChannel = supabase
      .channel('admin-orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Orders table change:', payload);
          
          if (payload.eventType === 'INSERT') {
            setOrders(prev => [...prev, payload.new as DatabaseOrder]);
            toast.success('طلب جديد تم إضافته', {
              description: `رقم التتبع: ${(payload.new as DatabaseOrder).tracking_id}`
            });
          } else if (payload.eventType === 'UPDATE') {
            setOrders(prev => prev.map(order => 
              order.id === payload.new.id 
                ? { ...order, ...payload.new }
                : order
            ));
          } else if (payload.eventType === 'DELETE') {
            setOrders(prev => prev.filter(order => order.id !== payload.old.id));
            toast.info('تم حذف طلب');
          }
        }
      )
      .subscribe();

    // Subscribe to order timeline changes (admin-only)
    const timelineChannel = supabase
      .channel('admin-timeline-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'order_timeline'
        },
        (payload) => {
          console.log('Timeline update:', payload);
          toast.info('تحديث على جدول الطلب', {
            description: `تم إضافة مرحلة جديدة: ${payload.new.title}`
          });
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(timelineChannel);
    };
  }, []);

  return {
    orders,
    loading,
    error,
    updateStatus,
    refreshOrders: loadOrders
  };
};