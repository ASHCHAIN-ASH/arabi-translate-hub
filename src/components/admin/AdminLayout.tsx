import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/SimpleAuthProvider';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AdminDashboardService } from '@/utils/adminDashboardService';
import { supabase } from '@/integrations/supabase/client';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart,
  FileText, 
  CreditCard, 
  HelpCircle,
  Settings,
  LogOut,
  Shield,
  Bell,
  Briefcase,
  Menu,
  X,
  ChevronDown,
  Activity,
  TrendingUp,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  
  // State for dynamic counts
  const [counts, setCounts] = useState({
    invoices: 0
  });

  const navItems = [
    { 
      name: 'لوحة التحكم', 
      href: '/adminmaster', 
      icon: LayoutDashboard,
      badge: null
    },
    { 
      name: 'نظام الإشعارات البريدية', 
      href: '/adminmaster/email-notifications', 
      icon: Mail,
      badge: 'جديد'
    },
    { 
      name: 'إدارة الفواتير', 
      href: '/adminmaster/invoices', 
      icon: CreditCard,
      badge: counts.invoices > 0 ? counts.invoices.toString() : null
    },
    { 
      name: 'إدارة المدفوعات', 
      href: '/adminmaster/transactions', 
      icon: CreditCard,
      badge: null
    },
    { 
      name: 'الإعدادات', 
      href: '/adminmaster/settings', 
      icon: Settings,
      badge: null
    },
  ];

  // الإشعارات الافتراضية
  const defaultNotifications = [
    { id: 1, title: 'طلب جديد', message: 'تم استلام طلب خدمة جديد', time: 'منذ دقيقتين', type: 'order' },
    { id: 2, title: 'دفعة جديدة', message: 'تم استلام دفعة بقيمة 500 ريال', time: 'منذ 5 دقائق', type: 'payment' },
    { id: 3, title: 'تذكرة دعم', message: 'تذكرة دعم جديدة تحتاج انتباه', time: 'منذ 10 دقائق', type: 'support' },
  ];

  // جلب الإشعارات الحقيقية
  const [realNotifications, setRealNotifications] = useState(defaultNotifications);
  
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const notifs = await AdminDashboardService.getRecentNotifications();
        if (notifs.length > 0) {
          setRealNotifications(notifs);
        }
      } catch (error) {
        console.error('Error loading notifications:', error);
        // نبقي على الإشعارات الافتراضية في حالة الخطأ
      }
    };
    
    loadNotifications();
    loadCounts();
  }, []);

  // جلب الأعداد الديناميكية
  const loadCounts = async () => {
    try {
      const [invoicesRes] = await Promise.all([
        supabase.from('invoices').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      ]);

      setCounts({
        invoices: invoicesRes.count || 0
      });
    } catch (error) {
      console.error('Error loading counts:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('خطأ في تسجيل الخروج:', error);
    }
  };

  const SidebarContent = () => (
    <nav className="p-4 space-y-2">
      {navItems.map((item, index) => {
        const isActive = location.pathname === item.href || 
          (item.href !== '/adminmaster' && location.pathname.startsWith(item.href));
        
        return (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link
              to={item.href}
              onClick={() => setIsSidebarOpen(false)}
              className={`
                group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105
                ${isActive 
                  ? 'bg-gradient-to-r from-primary via-primary to-secondary text-white shadow-lg shadow-primary/25' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/80 hover:shadow-md'
                }
              `}
            >
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-white/20' : 'group-hover:bg-primary/10'}`}>
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'group-hover:text-primary'}`} />
                </div>
                <span className="font-medium">{item.name}</span>
              </div>
              {item.badge && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`px-2 py-1 rounded-full text-xs font-bold ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-primary/10 text-primary group-hover:bg-primary/20'
                  }`}
                >
                  {item.badge}
                </motion.div>
              )}
            </Link>
          </motion.div>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/20" dir="rtl">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-50 shadow-lg">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu & Logo */}
            <div className="flex items-center space-x-4 space-x-reverse">
              {/* Mobile Menu Toggle */}
              <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden p-2 hover:bg-primary/10">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  side="right" 
                  className="w-80 bg-card/95 backdrop-blur-md border-l border-border/50 p-0"
                  dir="rtl"
                >
                  <div className="p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-secondary/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <motion.div 
                          className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Shield className="w-6 h-6 text-white" />
                        </motion.div>
                        <div>
                          <h1 className="text-lg font-arabic-formal font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">منصة التعليم</h1>
                          <p className="text-xs text-muted-foreground">لوحة الإدارة</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setIsSidebarOpen(false)}
                        className="p-1 hover:bg-red-50 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <SidebarContent />
                </SheetContent>
              </Sheet>

              {/* Logo */}
              <Link to="/adminmaster" className="flex items-center space-x-3 space-x-reverse group">
                <motion.div 
                  className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Shield className="w-6 h-6 text-white" />
                </motion.div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-arabic-formal font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    منصة التعليم
                  </h1>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <Activity className="w-3 h-3 ml-1" />
                    لوحة الإدارة المتقدمة
                  </p>
                </div>
              </Link>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-3 space-x-reverse">
              {/* Activity Indicator */}
              <motion.div
                className="hidden lg:flex items-center space-x-2 space-x-reverse px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-medium"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>نشط الآن</span>
              </motion.div>

              {/* Notifications */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative p-2 hover:bg-primary/10 group"
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                >
                  <Bell className="w-5 h-5 group-hover:text-primary transition-colors" />
                  <motion.span 
                    className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    {realNotifications.length}
                  </motion.span>
                </Button>

                <AnimatePresence>
                  {isNotificationOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute left-0 mt-2 w-80 bg-card/95 backdrop-blur-md border border-border/50 rounded-xl shadow-xl z-50"
                    >
                      <div className="p-4 border-b border-border/50">
                        <h3 className="font-semibold text-sm">الإشعارات الحديثة</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {realNotifications.map((notification, index) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-3 border-b border-border/30 last:border-0 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-start space-x-3 space-x-reverse">
                              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                              <div className="flex-1">
                                <h4 className="text-sm font-medium">{notification.title}</h4>
                                <p className="text-xs text-muted-foreground">{notification.message}</p>
                                <p className="text-xs text-primary mt-1">{notification.time}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Profile */}
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {user?.name || user?.email}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingUp className="w-3 h-3 ml-1" />
                    مدير النظام
                  </div>
                </div>
                <motion.div 
                  className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-white text-sm font-bold">
                    {(user?.name || user?.email || '').charAt(0).toUpperCase()}
                  </span>
                </motion.div>
              </div>

              {/* Sign Out */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                className="p-2 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="w-64 bg-card/80 backdrop-blur-sm border-l border-border/50 min-h-screen hidden md:block">
          <div className="sticky top-0 h-screen overflow-y-auto">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-secondary/5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center space-x-3 space-x-reverse"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    القائمة الرئيسية
                  </h2>
                  <p className="text-xs text-muted-foreground">إدارة شاملة للنظام</p>
                </div>
              </motion.div>
            </div>
            <SidebarContent />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;