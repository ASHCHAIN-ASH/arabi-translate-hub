import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/data/legacy/client';
import { toast } from 'sonner';

/**
 * Hook to subscribe to realtime updates of a client's service_orders.
 * - Tracks "live" connection state (visible badge in UI).
 * - Shows toast notifications when an order is updated by admin.
 * - Highlights newly inserted/updated rows for animation.
 */
export function useRealtimeServiceOrders(userId: string | undefined, onChange: () => void) {
  const [isLive, setIsLive] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const lastStatusRef = useRef<Record<string, string>>({});

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`client-service-orders-rt-${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'service_orders', filter: `user_id=eq.${userId}` },
        (payload) => {
          const newOrder = payload.new as any;
          setHighlightedId(newOrder.id);
          setTimeout(() => setHighlightedId(null), 4000);
          toast.success('🎉 طلب جديد تم إنشاؤه', {
            description: `رقم التتبع: ${newOrder.tracking_id}`,
          });
          onChange();
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'service_orders', filter: `user_id=eq.${userId}` },
        (payload) => {
          const newRow = payload.new as any;
          const oldRow = payload.old as any;
          const prevStatus = lastStatusRef.current[newRow.id] ?? oldRow?.current_status;

          if (prevStatus && prevStatus !== newRow.current_status) {
            setHighlightedId(newRow.id);
            setTimeout(() => setHighlightedId(null), 4000);
            toast.info('🔄 تحديث على طلبك', {
              description: `تم تحديث حالة الطلب ${newRow.tracking_id}`,
            });
          }
          if (newRow.quote_status === 'pending' && oldRow?.quote_status !== 'pending') {
            toast.message('💰 وصلك عرض سعر جديد', {
              description: `الطلب ${newRow.tracking_id} بانتظار ردك`,
            });
          }
          lastStatusRef.current[newRow.id] = newRow.current_status;
          onChange();
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'service_order_timeline' },
        () => {
          onChange();
        }
      )
      .subscribe((status) => {
        setIsLive(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
      setIsLive(false);
    };
  }, [userId, onChange]);

  return { isLive, highlightedId };
}
