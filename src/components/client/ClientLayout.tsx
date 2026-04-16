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
  Menu,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { name: 'لوحة التحكم', href: '/dashboard', icon: LayoutDashboard },
    { name: 'سجل الطلبات', href: '/orders', icon: ShoppingCart },
    { name: 'فواتيري', href: '/invoices', icon: FileText },
    { name: 'محفظتي', href: '/wallet', icon: Wallet },
    { name: 'المدفوعات', href: '/billing/payments', icon: CreditCard },
    { name: 'الدعم الفني', href: '/support/tickets', icon: HelpCircle },
  ];

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
      {navItems.map((item) => {
        const isActive = location.pathname === item.href || 
          (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
        
        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => setIsSidebarOpen(false)}
            className={`
              flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
              ${isActive 
                ? 'bg-gradient-to-r from-primary to-primary-600 text-white shadow-lg' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }
            `}
          >
            <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
            <span>{item.name}</span>
          </Link>
        );
      })}
      
      {/* Sign Out Button في الجوال */}
      <div className="pt-4 mt-4 border-t border-border md:hidden">
        <Button 
          variant="ghost" 
          onClick={handleSignOut}
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5 ml-3" />
          تسجيل الخروج
        </Button>
      </div>
    </nav>
  );

  // Debug log
  console.log('ClientLayout rendering - window width:', typeof window !== 'undefined' ? window.innerWidth : 'server');
  console.log('Should show sidebar:', typeof window !== 'undefined' ? window.innerWidth >= 900 : 'server');

  return (
    <div className="min-h-screen w-full bg-background" dir="rtl">
      <div className="flex">
        {/* Desktop Sidebar - Always visible on screens 900px+ */}
        <aside className="w-64 bg-card/80 backdrop-blur-sm border-l rtl:border-l-0 rtl:border-r border-border flex-shrink-0 hidden md:block">
          <div className="sticky top-0 h-screen overflow-y-auto">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-secondary/5">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-gray-900">القائمة الرئيسية</h2>
                  <p className="text-xs text-muted-foreground">إدارة حسابك</p>
                </div>
              </div>
            </div>
            <SidebarContent />
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
        {/* Header */}
        <header className="bg-card/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
          <div className="px-3 sm:px-4 lg:px-6">
            <div className="flex items-center justify-between h-14 sm:h-16">
              {/* Mobile Menu Button & Logo */}
              <div className="flex items-center space-x-3 space-x-reverse">
                {/* Mobile Menu Toggle */}
                <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                  <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden p-2">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent 
                    side="right" 
                    className="w-80 bg-card/95 backdrop-blur-md border-l border-border p-0"
                    dir="rtl"
                  >
                    <div className="p-4 border-b border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h1 className="text-lg font-arabic-formal font-bold">منصة التعليم</h1>
                            <p className="text-xs text-muted-foreground">لوحة العميل</p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setIsSidebarOpen(false)}
                          className="p-1"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <SidebarContent />
                  </SheetContent>
                </Sheet>

                {/* Logo */}
                <Link to="/dashboard" className="flex items-center space-x-2 space-x-reverse">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-lg font-arabic-formal font-bold">منصة التعليم</h1>
                    <p className="text-xs text-muted-foreground">لوحة العميل</p>
                  </div>
                </Link>
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-2 sm:space-x-4 space-x-reverse">
                {/* Notifications */}
                <NotificationCenter />

                {/* User Profile */}
                <div className="flex items-center space-x-2 sm:space-x-3 space-x-reverse">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium truncate max-w-24 sm:max-w-none">
                      {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                    </p>
                    <p className="text-xs text-muted-foreground">عميل</p>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {(user?.user_metadata?.full_name || user?.email || '').charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Desktop Sign Out */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="hidden lg:flex p-2"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ClientLayout;