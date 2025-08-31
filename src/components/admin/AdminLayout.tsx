import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
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
  Briefcase
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const navItems = [
    { 
      name: 'لوحة التحكم', 
      href: '/admin', 
      icon: LayoutDashboard 
    },
    { 
      name: 'إدارة الخدمات', 
      href: '/admin/services', 
      icon: Briefcase 
    },
    { 
      name: 'إدارة الطلبات', 
      href: '/admin/orders', 
      icon: ShoppingCart 
    },
    { 
      name: 'إدارة الفواتير', 
      href: '/admin/invoices', 
      icon: FileText 
    },
    { 
      name: 'إدارة المدفوعات', 
      href: '/admin/transactions', 
      icon: CreditCard 
    },
    { 
      name: 'إدارة المستخدمين', 
      href: '/admin/users', 
      icon: Users 
    },
    { 
      name: 'إدارة التذاكر', 
      href: '/admin/tickets', 
      icon: HelpCircle 
    },
    { 
      name: 'الإعدادات', 
      href: '/admin/settings', 
      icon: Settings 
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('خطأ في تسجيل الخروج:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Link to="/admin" className="flex items-center space-x-2 space-x-reverse">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-arabic-formal font-bold">منصة التعليم</h1>
                  <p className="text-xs text-muted-foreground">لوحة الإدارة</p>
                </div>
              </Link>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4 space-x-reverse">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              {/* User Profile */}
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="text-right">
                  <p className="text-sm font-medium">{user?.user_metadata?.name || user?.email}</p>
                  <p className="text-xs text-muted-foreground">مدير</p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {(user?.user_metadata?.name || user?.email || '').charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Sign Out */}
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border min-h-screen">
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href || 
                  (item.href !== '/admin' && location.pathname.startsWith(item.href));
                
                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className={`
                        flex items-center space-x-3 space-x-reverse px-3 py-2 rounded-lg text-sm font-medium transition-colors
                        ${isActive 
                          ? 'bg-red-500 text-white' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }
                      `}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
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