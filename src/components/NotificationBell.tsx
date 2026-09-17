import React, { useEffect, useState, useCallback } from 'react';
import { Bell, Check, CheckCheck, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/data/legacy/client';
import { useAuth } from '@/components/SimpleAuthProvider';
import { cn } from '@/lib/utils';

interface InboxNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

const TYPE_STYLES: Record<string, string> = {
  success: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
  warning: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
  payment: 'bg-violet-500/10 text-violet-600 border-violet-500/30',
  financing: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
  info: 'bg-muted text-foreground border-border',
};

const timeAgo = (iso: string): string => {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'الآن';
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} د`;
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} س`;
  return `منذ ${Math.floor(diff / 86400)} ي`;
};

export const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<InboxNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const unreadCount = items.filter((n) => !n.is_read).length;

  const load = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    const { data } = await supabase
      .from('user_inbox_notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);
    setItems((data as InboxNotification[]) || []);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    load();

    const channel = supabase
      .channel(`inbox-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_inbox_notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => load()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, load]);

  const markAsRead = async (id: string) => {
    await supabase
      .from('user_inbox_notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', id);
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const markAllRead = async () => {
    if (!user?.id) return;
    await supabase
      .from('user_inbox_notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('is_read', false);
    setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  if (!user) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="الإشعارات">
          <Bell className="w-5 h-5" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center px-1"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-80 sm:w-96 p-0"
        sideOffset={8}
      >
        <div className="flex items-center justify-between p-3 border-b">
          <div className="font-semibold text-sm flex items-center gap-2">
            <Bell className="w-4 h-4" />
            الإشعارات
            {unreadCount > 0 && (
              <span className="text-xs text-muted-foreground">({unreadCount} جديدة)</span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs gap-1"
              onClick={markAllRead}
            >
              <CheckCheck className="w-3.5 h-3.5" />
              قراءة الكل
            </Button>
          )}
        </div>

        <ScrollArea className="max-h-[420px]">
          {loading ? (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              لا توجد إشعارات
            </div>
          ) : (
            <ul className="divide-y">
              {items.map((n) => {
                const content = (
                  <div
                    onClick={() => !n.is_read && markAsRead(n.id)}
                    className={cn(
                      'p-3 transition-colors hover:bg-muted/50 cursor-pointer',
                      !n.is_read && 'bg-primary/5'
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className={cn(
                          'shrink-0 mt-1 w-2 h-2 rounded-full',
                          n.is_read ? 'bg-muted-foreground/30' : 'bg-primary'
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h5 className="text-sm font-semibold truncate">
                            {n.title}
                          </h5>
                          <span className="text-[10px] text-muted-foreground shrink-0">
                            {timeAgo(n.created_at)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {n.message}
                        </p>
                        <span
                          className={cn(
                            'inline-block mt-1.5 text-[10px] px-1.5 py-0.5 rounded border',
                            TYPE_STYLES[n.type] || TYPE_STYLES.info
                          )}
                        >
                          {n.type}
                        </span>
                      </div>
                      {!n.is_read && (
                        <Check className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100" />
                      )}
                    </div>
                  </div>
                );
                return (
                  <li key={n.id}>
                    {n.link ? (
                      <Link to={n.link} onClick={() => setOpen(false)}>
                        {content}
                      </Link>
                    ) : (
                      content
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
