import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/SimpleAuthProvider';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  LayoutDashboard, Users, ShoppingCart, FileText, 
  CreditCard, HelpCircle, Settings, LogOut, Shield, Bell, Menu,
  Activity, Mail, Briefcase, Clock, Receipt, ChevronDown,
  BarChart3, Package, Ticket, UserPlus, Star, Wallet, Gift, Trophy, BookOpen, Inbox, MessageCircle,
  TrendingUp, Sparkles, FlaskConical, Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatFloatingButton from '@/components/chat/ChatFloatingButton';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string | null;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [counts, setCounts] = useState({ invoices: 0, tickets: 0, orders: 0 });
  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; message: string; time: string; type: string }>>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const navGroups: NavGroup[] = [
    // 1. نظرة عامة سريعة
    {
      label: 'نظرة عامة',
      items: [
        { name: 'لوحة التحكم', href: '/adminmaster', icon: LayoutDashboard },
        { name: 'اللوحة المالية', href: '/adminmaster/financial', icon: BarChart3 },
      ]
    },
    // 2. العمل اليومي - أكثر الأقسام استخدامًا
    {
      label: 'العمل اليومي',
      items: [
        { name: 'صندوق الوارد', href: '/adminmaster/inbox', icon: Inbox },
        { name: 'طلبات الخدمات', href: '/adminmaster/service-orders', icon: Package, badge: counts.orders > 0 ? counts.orders.toString() : null },
        { name: 'الطلبات العامة', href: '/adminmaster/orders', icon: ShoppingCart },
        { name: 'خدمة العملاء', href: '/adminmaster/tickets', icon: Ticket, badge: counts.tickets > 0 ? counts.tickets.toString() : null },
        { name: 'المحادثات', href: '/adminmaster/chat', icon: Activity },
      ]
    },
    // 3. العملاء والمستخدمين
    {
      label: 'العملاء والمستخدمين',
      items: [
        { name: 'العملاء', href: '/adminmaster/customers', icon: Users },
        { name: 'المستخدمين', href: '/adminmaster/users', icon: Settings },
        { name: 'إضافة مستخدم', href: '/adminmaster/add-user', icon: UserPlus },
      ]
    },
    // 4. الفوترة والمدفوعات
    {
      label: 'الفوترة والمدفوعات',
      items: [
        { name: 'الفواتير', href: '/adminmaster/invoices', icon: Receipt, badge: counts.invoices > 0 ? counts.invoices.toString() : null },
        { name: 'المعاملات الداخلية', href: '/adminmaster/transactions', icon: CreditCard },
        { name: 'بوابة المدفوعات', href: '/adminmaster/payments', icon: CreditCard },
        { name: 'المحافظ الرقمية', href: '/adminmaster/wallets', icon: Wallet },
      ]
    },
    // 5. التسويق والولاء
    {
      label: 'التسويق والولاء',
      items: [
        { name: 'العضويات', href: '/adminmaster/memberships', icon: Star },
        { name: 'الإحالات والعمولات', href: '/adminmaster/referrals', icon: Gift },
        { name: 'النقاط والمكافآت', href: '/adminmaster/gamification', icon: Trophy },
      ]
    },
    // 5.5 النمو والتحليلات
    {
      label: 'النمو والتحليلات',
      items: [
        { name: 'تحليلات النمو', href: '/adminmaster/growth', icon: TrendingUp },
        { name: 'الأتمتة الذكية', href: '/adminmaster/growth/automation', icon: Sparkles },
        { name: 'تجارب A/B', href: '/adminmaster/experiments', icon: FlaskConical },
        { name: 'اختبارات المستوى', href: '/adminmaster/assessments', icon: Target },
      ]
    },
    // 6. المحتوى والخدمات
    {
      label: 'المحتوى والخدمات',
      items: [
        { name: 'إدارة الخدمات', href: '/adminmaster/services', icon: Briefcase },
        { name: 'مكتبة الطالب', href: '/adminmaster/student-resources', icon: BookOpen },
        { name: 'سجل طلبات النشر', href: '/adminmaster/research', icon: BookOpen },
        { name: 'عقود النشر العلمي', href: '/adminmaster/research/contracts', icon: FileText },
      ]
    },
    // 7. العقود والتوثيق
    {
      label: 'العقود والتوثيق',
      items: [
        { name: 'نظام العقود', href: '/adminmaster/contracts', icon: FileText },
      ]
    },
    // 8. التواصل والإشعارات
    {
      label: 'التواصل والإشعارات',
      items: [
        { name: 'الإشعارات البريدية', href: '/adminmaster/email-notifications', icon: Mail },
        { name: 'إدارة واتساب', href: '/adminmaster/whatsapp', icon: MessageCircle },
      ]
    },
    // 9. إعدادات النظام
    {
      label: 'إعدادات النظام',
      items: [
        { name: 'ساعات العمل', href: '/adminmaster/working-hours', icon: Clock },
      ]
    },
  ];

  const getTimeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${Math.floor(hours / 24)} يوم`;
  };

  const loadCounts = useCallback(async () => {
    try {
      const [inv, tkt, ord] = await Promise.all([
        supabase.from('invoices').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('status', 'open'),
        supabase.from('service_orders').select('*', { count: 'exact', head: true }).eq('current_status', 'pending'),
      ]);
      setCounts({ invoices: inv.count || 0, tickets: tkt.count || 0, orders: ord.count || 0 });
    } catch (e) {
      console.error('Error loading counts:', e);
    }
  }, []);

  const loadNotifications = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('user_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (data) {
        setNotifications(data.map((n: any) => ({
          id: n.id,
          title: n.title,
          message: n.message || '',
          time: getTimeAgo(n.created_at),
          type: n.type || 'info',
        })));
        setUnreadCount(data.filter((n: any) => !n.read_at).length);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (e) {
      console.error('Error loading notifications:', e);
    }
  }, []);

  useEffect(() => {
    loadCounts();
    loadNotifications();

    // Realtime subscriptions for badge counts
    const countChannel = supabase
      .channel('admin-layout-counts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices' }, () => loadCounts())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, () => loadCounts())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'service_orders' }, () => loadCounts())
      .subscribe();

    // Realtime for notifications
    const notifChannel = supabase
      .channel('admin-layout-notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'user_notifications' }, () => loadNotifications())
      .subscribe();

    return () => {
      supabase.removeChannel(countChannel);
      supabase.removeChannel(notifChannel);
    };
  }, [loadCounts, loadNotifications]);

  const handleSignOut = async () => {
    try { await signOut(); navigate('/'); } catch (e) { console.error(e); }
  };

  const toggleGroup = (label: string) => {
    setCollapsedGroups(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (href: string) =>
    location.pathname === href || (href !== '/adminmaster' && location.pathname.startsWith(href));

  const SidebarNav = ({ onItemClick }: { onItemClick?: () => void }) => (
    <ScrollArea className="h-full" dir="rtl">
      <div className="py-3 space-y-1">
        {navGroups.map((group) => (
          <div key={group.label}>
            <button
              onClick={() => toggleGroup(group.label)}
              className="w-full flex items-center justify-between px-5 py-2 text-[11px] font-bold text-muted-foreground/70 uppercase tracking-wider hover:text-muted-foreground transition-colors"
              dir="rtl"
            >
              <span>{group.label}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${collapsedGroups[group.label] ? 'rotate-90' : ''}`} />
            </button>

            <AnimatePresence initial={false}>
              {!collapsedGroups[group.label] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  {group.items.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={onItemClick}
                        className={`
                          group flex items-center justify-between mx-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200
                          ${active
                            ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 font-semibold'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                          }
                        `}
                        dir="rtl"
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className={`w-[18px] h-[18px] ${active ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-primary'}`} />
                          <span>{item.name}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            active
                              ? 'bg-primary-foreground/20 text-primary-foreground'
                              : 'bg-destructive/10 text-destructive'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mx-3 mt-4 mb-6">
        <Separator className="mb-4" />
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-foreground">إجراءات سريعة</span>
          </div>
          <div className="space-y-2">
            <Link to="/adminmaster/add-user" className="block text-xs text-muted-foreground hover:text-primary transition-colors">+ إضافة مستخدم جديد</Link>
            <Link to="/adminmaster/service-orders" className="block text-xs text-muted-foreground hover:text-primary transition-colors">+ متابعة الطلبات</Link>
            <Link to="/adminmaster/email-notifications" className="block text-xs text-muted-foreground hover:text-primary transition-colors">+ إرسال إشعار بريدي</Link>
          </div>
        </div>
      </div>
    </ScrollArea>
  );

  return (
    <div className="min-h-screen w-full bg-background" dir="rtl">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-xl border-b border-border/40 sticky top-0 z-50 shadow-sm">
        <div className="px-4 lg:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              {/* Mobile Menu */}
              <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72 p-0" dir="rtl">
                  <div className="p-4 border-b border-border/40">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                        <Shield className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold">لوحة الإدارة</h2>
                        <p className="text-[11px] text-muted-foreground">إدارة شاملة</p>
                      </div>
                    </div>
                  </div>
                  <SidebarNav onItemClick={() => setIsSidebarOpen(false)} />
                </SheetContent>
              </Sheet>

              {/* Logo */}
              <Link to="/adminmaster" className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-sm">
                  <Shield className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-sm font-bold text-foreground leading-tight">منصة ماستر إيدو باث</h1>
                  <p className="text-[11px] text-muted-foreground leading-tight">لوحة الإدارة</p>
                </div>
              </Link>
            </div>

            {/* Left side (in RTL) */}
            <div className="flex items-center gap-2">
              {/* Status */}
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-medium">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span>نشط الآن</span>
              </div>

              {/* Notifications */}
              <div className="relative">
                <Button variant="ghost" size="icon" className="relative h-9 w-9" onClick={() => setIsNotificationOpen(!isNotificationOpen)}>
                  <Bell className="w-[18px] h-[18px]" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -end-0.5 min-w-4 h-4 px-1 bg-destructive rounded-full flex items-center justify-center text-[9px] text-destructive-foreground font-bold">
                      {unreadCount}
                    </span>
                  )}
                </Button>

                <AnimatePresence>
                  {isNotificationOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsNotificationOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        className="absolute end-0 mt-2 w-80 max-w-[calc(100vw-1rem)] bg-card border border-border/50 rounded-xl shadow-xl z-50"
                      >
                        <div className="p-3 border-b border-border/40">
                          <h3 className="text-sm font-bold">الإشعارات</h3>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-6 text-center">
                              <Bell className="w-6 h-6 mx-auto mb-2 text-muted-foreground/40" />
                              <p className="text-xs text-muted-foreground">لا توجد إشعارات</p>
                            </div>
                          ) : (
                            notifications.map((n) => (
                              <div key={n.id} className="p-3 border-b border-border/20 last:border-0 hover:bg-muted/40 transition-colors">
                                <h4 className="text-sm font-medium">{n.title}</h4>
                                <p className="text-xs text-muted-foreground">{n.message}</p>
                                <p className="text-[11px] text-primary mt-1">{n.time}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* User */}
              <div className="flex items-center gap-2">
                <div className="text-start hidden sm:block">
                  <p className="text-xs font-semibold text-foreground leading-tight">
                    {user?.user_metadata?.full_name || 'admin'}
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-tight">مدير النظام</p>
                </div>
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">
                  {(user?.user_metadata?.full_name || user?.email || 'A').charAt(0).toUpperCase()}
                </div>
              </div>

              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="w-[260px] bg-card/60 backdrop-blur-sm border-border/30 border-s min-h-[calc(100vh-56px)] hidden lg:block">
          <div className="sticky top-14 h-[calc(100vh-56px)]">
            <SidebarNav />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 overflow-auto">
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Chat */}
      {user?.id && <ChatFloatingButton userId={user.id} isAdmin />}
    </div>
  );
};

export default AdminLayout;
