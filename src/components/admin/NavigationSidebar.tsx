import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard,
  FileText,
  Calculator,
  PenTool,
  MessageCircle,
  Users,
  Settings,
  BarChart3,
  CreditCard
} from 'lucide-react';

interface NavigationItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  badge?: string;
}

const navigationItems: NavigationItem[] = [
  {
    path: '/admin/orders',
    label: 'إدارة الطلبات',
    icon: LayoutDashboard,
    description: 'متابعة جميع الطلبات والخدمات'
  },
  {
    path: '/admin/contracts',
    label: 'إدارة العقود',
    icon: FileText,
    description: 'إنشاء وإدارة العقود والاتفاقيات'
  },
  {
    path: '/admin/accounting',
    label: 'المحاسبة',
    icon: Calculator,
    description: 'النظام المحاسبي والتقارير المالية'
  },
  {
    path: '/admin/esign',
    label: 'التوقيع الإلكتروني',
    icon: PenTool,
    description: 'إدارة مستندات التوقيع الإلكتروني'
  },
  {
    path: '/admin/whatsapp',
    label: 'إدارة واتساب',
    icon: MessageCircle,
    description: 'إعدادات وسجلات إشعارات واتساب'
  }
];

const NavigationSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="w-80 bg-muted/30 border-l border-border p-4 space-y-3" dir="rtl">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-foreground mb-2">لوحة الإدارة</h2>
        <p className="text-sm text-muted-foreground">
          إدارة جميع خدمات ومتطلبات النظام
        </p>
      </div>

      <div className="space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link key={item.path} to={item.path}>
              <Card className={`transition-all duration-200 hover:shadow-md cursor-pointer ${
                isActive 
                  ? 'bg-primary/10 border-primary/20 shadow-sm' 
                  : 'hover:bg-muted/50'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      isActive 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-medium text-sm ${
                          isActive ? 'text-primary' : 'text-foreground'
                        }`}>
                          {item.label}
                        </h3>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-tight">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* إحصائيات سريعة */}
      <Card className="mt-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm mb-3 text-foreground">إحصائيات سريعة</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">الطلبات النشطة</span>
              <Badge variant="outline" className="text-xs">12</Badge>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">العقود المُوقعة</span>
              <Badge variant="outline" className="text-xs">8</Badge>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">رسائل واتساب اليوم</span>
              <Badge variant="outline" className="text-xs">24</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* معلومات النظام */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-xs text-foreground">معلومات النظام</h3>
          </div>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>الإصدار:</span>
              <span>v2.1.0</span>
            </div>
            <div className="flex justify-between">
              <span>آخر تحديث:</span>
              <span>اليوم</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NavigationSidebar;