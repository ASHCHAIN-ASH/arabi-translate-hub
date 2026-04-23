import React, { useState, useCallback, memo } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/SimpleAuthProvider';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import NotificationCenter from '@/components/NotificationCenter';
import { useChallengeAcademy } from '@/hooks/useChallengeAcademy';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  CreditCard,
  Headphones,
  LogOut,
  GraduationCap,
  Wallet,
  ScrollText,
  Menu,
  Sparkles,
  Crown,
  Trophy,
  Users,
  Gift,
  GraduationCap as StudentIcon,
  BookOpen,
  Swords,
  Megaphone,
} from 'lucide-react';
import ChatFloatingButton from '@/components/chat/ChatFloatingButton';
import { cn } from '@/lib/utils';

interface ClientLayoutProps {
  children: React.ReactNode;
}

type NavItem = {
  name: string;
  href: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  { name: 'لوحة التحكم', href: '/dashboard', icon: LayoutDashboard },
  { name: 'قسم الطالب', href: '/student', icon: StudentIcon },
  { name: 'خدماتنا', href: '/client-services', icon: Sparkles },
  { name: 'سجل الطلبات', href: '/orders', icon: ShoppingCart },
  { name: 'الطلبات الجماعية', href: '/group-orders', icon: Users },
  { name: 'فواتيري', href: '/invoices', icon: FileText },
  { name: 'عقودي', href: '/client/contracts', icon: ScrollText },
  { name: 'نشر الأبحاث', href: '/client/research', icon: BookOpen },
  { name: 'محفظتي', href: '/wallet', icon: Wallet },
  { name: 'التمويل (Master PayLater)', href: '/financing', icon: CreditCard },
  { name: 'عضويتي', href: '/membership', icon: Crown },
  { name: 'الإحالات والعمولات', href: '/referrals', icon: Gift },
  { name: 'مركز التسويق', href: '/marketing-hub', icon: Megaphone },
  { name: 'مكافآتي', href: '/rewards', icon: Trophy },
  { name: 'متجر XP', href: '/marketplace', icon: ShoppingCart },
  { name: 'أكاديمية التحدي', href: '/challenge-academy', icon: Sparkles },
  { name: 'أكاديمية المبارزة', href: '/battle-academy', icon: Swords },
  { name: 'بنك الأسئلة', href: '/quiz-bank', icon: BookOpen },
  { name: 'خدمة العملاء', href: '/support/tickets', icon: Headphones },
];

interface SidebarInnerProps {
  displayName: string;
  initial: string;
  userId?: string;
  onItemClick?: () => void;
  onSignOut: () => void;
}

const SidebarInner = memo<SidebarInnerProps>(({ displayName, initial, userId, onItemClick, onSignOut }) => {
  const { summary } = useChallengeAcademy(userId);
  const level = summary?.current_level;
  const nextLevel = summary?.next_level;
  const totalXp = (summary as any)?.xp?.total_xp ?? (summary as any)?.total_xp ?? 0;
  const requiredXp = nextLevel?.required_xp ?? level?.required_xp ?? 0;
  const baseXp = level?.required_xp ?? 0;
  const progress = nextLevel
    ? Math.min(100, Math.round(((totalXp - baseXp) / Math.max(1, requiredXp - baseXp)) * 100))
    : 100;

  const badgeLabel = level?.name_ar || 'عميل جديد';
  const badgeIcon = (level as any)?.icon || '🌱';
  const badgeColor = (level as any)?.badge_color || 'hsl(var(--primary))';

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Brand header */}
      <div className="p-5 border-b border-border bg-gradient-to-br from-primary to-secondary text-white">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center ring-1 ring-white/30">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-black tracking-tight truncate">ماستر إيدو باث</h2>
            <p className="text-xs text-white/80">لوحة العميل</p>
          </div>
        </div>
      </div>

      {/* User chip with real level badge — clickable, links to challenge academy */}
      <div className="p-4">
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/challenge-academy"
                onClick={onItemClick}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border hover:bg-muted transition"
              >
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-bold">
                    {initial}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-card rounded-full" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold truncate">{displayName}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold text-white"
                      style={{ backgroundColor: badgeColor }}
                    >
                      <span>{badgeIcon}</span>
                      <span className="truncate max-w-[80px]">{badgeLabel}</span>
                    </span>
                    <span className="text-[10px] text-muted-foreground font-semibold">
                      {Number(totalXp).toLocaleString('ar')} XP
                    </span>
                  </div>
                  {nextLevel && (
                    <div className="mt-1.5 h-1 w-full bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${progress}%`, backgroundColor: badgeColor }}
                      />
                    </div>
                  )}
                </div>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              {nextLevel
                ? `${Number(requiredXp - totalXp).toLocaleString('ar')} XP للوصول إلى ${nextLevel.name_ar}`
                : 'وصلت إلى أعلى مستوى 🎉'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-3 mb-2">
          القائمة الرئيسية
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            onClick={onItemClick}
            end={item.href === '/dashboard'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground/80 hover:bg-muted'
              )
            }
          >
            <item.icon className="w-[18px] h-[18px] shrink-0" strokeWidth={2.2} />
            <span className="flex-1 truncate text-right">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-border">
        <Button
          variant="ghost"
          onClick={onSignOut}
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg"
        >
          <LogOut className="w-4 h-4" />
          تسجيل الخروج
        </Button>
      </div>
    </div>
  );
});
SidebarInner.displayName = 'SidebarInner';

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('خطأ في تسجيل الخروج:', error);
    }
  }, [signOut, navigate]);

  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'عميل';
  const initial = (user?.user_metadata?.full_name || user?.email || 'U').charAt(0).toUpperCase();

  return (
    <div className="min-h-screen w-full bg-background" dir="rtl">
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="w-72 flex-shrink-0 hidden lg:block">
          <div className="sticky top-0 h-screen border-s border-border">
            <SidebarInner
              displayName={displayName}
              initial={initial}
              userId={user?.id}
              onSignOut={handleSignOut}
            />
          </div>
        </aside>

        {/* Main Area */}
        <div className="flex-1 min-w-0">
          <header className="bg-card border-b border-border sticky top-0 z-40">
            <div className="px-3 sm:px-4 lg:px-6">
              <div className="flex items-center justify-between h-14 sm:h-16">
                <div className="flex items-center gap-3">
                  {/* Mobile/Tablet Menu */}
                  <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="sm" className="lg:hidden p-2 shrink-0">
                        <Menu className="w-5 h-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      disableAnimation
                      side="right"
                      className="w-[85vw] max-w-sm p-0 border-l border-border bg-card overflow-y-auto"
                      dir="rtl"
                    >
                      <SidebarInner
                        displayName={displayName}
                        initial={initial}
                        userId={user?.id}
                        onItemClick={closeSidebar}
                        onSignOut={handleSignOut}
                      />
                    </SheetContent>
                  </Sheet>

                  <Link to="/dashboard" className="flex items-center gap-2 lg:hidden">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-sm sm:text-base font-black hidden xs:block truncate">
                      ماستر إيدو باث
                    </h1>
                  </Link>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <NotificationCenter />
                  <div className="hidden sm:flex items-center gap-2 ps-2 pe-3 border-s border-border">
                    <div className="text-end">
                      <p className="text-xs font-bold leading-tight">{displayName}</p>
                      <p className="text-[10px] text-muted-foreground leading-tight">عميل</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-sm font-bold">
                      {initial}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="w-full h-full">{children}</div>
          </main>
        </div>
      </div>

      {user?.id && <ChatFloatingButton userId={user.id} />}
    </div>
  );
};

export default ClientLayout;
