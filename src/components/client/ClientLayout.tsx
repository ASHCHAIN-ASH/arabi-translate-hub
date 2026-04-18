import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/SimpleAuthProvider';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import NotificationCenter from '@/components/NotificationCenter';
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  CreditCard,
  HelpCircle,
  LogOut,
  GraduationCap,
  Wallet,
  ScrollText,
  Menu,
  Sparkles,
  ChevronLeft,
  Crown,
  Trophy,
  Users,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatFloatingButton from '@/components/chat/ChatFloatingButton';

interface ClientLayoutProps {
  children: React.ReactNode;
}

type NavItem = {
  name: string;
  href: string;
  icon: React.ElementType;
  description: string;
  gradient: string;
};

const navItems: NavItem[] = [
  { name: 'لوحة التحكم', href: '/dashboard', icon: LayoutDashboard, description: 'نظرة عامة', gradient: 'from-indigo-500 to-purple-600' },
  { name: 'خدماتنا', href: '/client-services', icon: Sparkles, description: 'استكشف الخدمات', gradient: 'from-fuchsia-500 to-pink-600' },
  { name: 'سجل الطلبات', href: '/orders', icon: ShoppingCart, description: 'كل طلباتك', gradient: 'from-blue-500 to-cyan-600' },
  { name: 'الطلبات الجماعية', href: '/group-orders', icon: Users, description: 'شارك التكلفة مع زملائك', gradient: 'from-indigo-500 to-purple-600' },
  { name: 'فواتيري', href: '/invoices', icon: FileText, description: 'الفواتير والمدفوعات', gradient: 'from-emerald-500 to-teal-600' },
  { name: 'عقودي', href: '/client/contracts', icon: ScrollText, description: 'عقود الخدمة', gradient: 'from-amber-500 to-orange-600' },
  { name: 'محفظتي', href: '/wallet', icon: Wallet, description: 'الرصيد والحركات', gradient: 'from-violet-500 to-purple-600' },
  { name: 'عضويتي', href: '/membership', icon: Crown, description: 'باقات ماستر', gradient: 'from-yellow-500 to-amber-600' },
  { name: 'مكافآتي', href: '/rewards', icon: Trophy, description: 'النقاط والمستويات', gradient: 'from-amber-500 to-orange-600' },
  { name: 'المدفوعات', href: '/billing/payments', icon: CreditCard, description: 'سجل المدفوعات', gradient: 'from-rose-500 to-pink-600' },
  { name: 'الدعم الفني', href: '/support/tickets', icon: HelpCircle, description: 'تذاكر الدعم', gradient: 'from-sky-500 to-blue-600' },
];

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('خطأ في تسجيل الخروج:', error);
    }
  };

  const isActiveItem = (href: string) =>
    location.pathname === href || (href !== '/dashboard' && location.pathname.startsWith(href));

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'عميل';
  const initial = (user?.user_metadata?.full_name || user?.email || 'U').charAt(0).toUpperCase();

  const SidebarInner = ({ onItemClick }: { onItemClick?: () => void }) => (
    <div className="h-full flex flex-col">
      {/* Brand header */}
      <div className="relative overflow-hidden p-5 border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-primary opacity-95" />
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
        <div className="relative flex items-center gap-3 text-white">
          <motion.div
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg ring-1 ring-white/30"
          >
            <GraduationCap className="w-6 h-6" />
          </motion.div>
          <div>
            <h2 className="text-base font-black tracking-tight">ماستر إيدو باث</h2>
            <p className="text-xs text-white/80">لوحة العميل</p>
          </div>
        </div>
      </div>

      {/* User chip */}
      <div className="p-4">
        <div
          className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-br from-muted/60 to-muted/20 border border-border/50"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-bold shadow-md">
              {initial}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-background rounded-full" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold truncate">{displayName}</p>
            <p className="text-[11px] text-muted-foreground">عميل مميز ✨</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-1.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-3 mb-2">القائمة الرئيسية</p>
        {navItems.map((item, idx) => {
          const active = isActiveItem(item.href);
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.04 }}
            >
              <Link
                to={item.href}
                onClick={onItemClick}
                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold overflow-hidden transition-all duration-300
                  ${active
                    ? 'text-white shadow-lg'
                    : 'text-foreground/80 hover:text-foreground hover:bg-muted/60'
                  }`}
              >
                {active && (
                  <motion.span
                    layoutId="active-nav-bg"
                    className={`absolute inset-0 bg-gradient-to-r ${item.gradient}`}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 w-9 h-9 rounded-lg flex items-center justify-center transition-all shrink-0
                  ${active
                    ? 'bg-white/20 text-white'
                    : `bg-gradient-to-br ${item.gradient} text-white opacity-80 group-hover:opacity-100 group-hover:scale-110`
                  }`}
                >
                  <item.icon className="w-[18px] h-[18px]" strokeWidth={2.2} />
                </span>
                <span className="relative z-10 flex-1 truncate text-right">{item.name}</span>
                <ChevronLeft className={`relative z-10 w-4 h-4 transition-all shrink-0
                  ${active ? 'text-white opacity-100 translate-x-0' : 'opacity-0 group-hover:opacity-60 translate-x-1 group-hover:translate-x-0'}`}
                />
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-border/60">
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
        >
          <LogOut className="w-4 h-4" />
          تسجيل الخروج
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-muted/20 to-background" dir="rtl">
      <div className="flex">
        {/* Desktop Sidebar — visible on lg and up */}
        <aside className="w-72 flex-shrink-0 hidden lg:block">
          <div className="sticky top-0 h-screen bg-card/80 backdrop-blur-xl border-s border-border/60 shadow-sm">
            <SidebarInner />
          </div>
        </aside>

        {/* Main Area */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <header className="bg-card/80 backdrop-blur-xl border-b border-border/60 sticky top-0 z-40">
            <div className="px-3 sm:px-4 lg:px-6">
              <div className="flex items-center justify-between h-14 sm:h-16">
                <div className="flex items-center gap-3">
                  {/* Mobile/Tablet Menu — visible below lg */}
                  <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="sm" className="lg:hidden p-2 shrink-0">
                        <Menu className="w-5 h-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[85vw] max-w-sm p-0 border-l border-border/60 overflow-y-auto" dir="rtl">
                      <SidebarInner onItemClick={() => setIsSidebarOpen(false)} />
                    </SheetContent>
                  </Sheet>

                  <Link to="/dashboard" className="flex items-center gap-2 lg:hidden">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow shrink-0">
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-sm sm:text-base font-black hidden xs:block truncate">ماستر إيدو باث</h1>
                  </Link>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <NotificationCenter />
                  <div className="hidden sm:flex items-center gap-2 ps-2 pe-3 border-s border-border/60">
                    <div className="text-end">
                      <p className="text-xs font-bold leading-tight">{displayName}</p>
                      <p className="text-[10px] text-muted-foreground leading-tight">عميل</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-sm font-bold shadow">
                      {initial}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {user?.id && <ChatFloatingButton userId={user.id} />}
    </div>
  );
};

export default ClientLayout;
