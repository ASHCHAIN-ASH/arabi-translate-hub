import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard,
  FileText,
  Calculator,
  PenTool,
  MessageCircle,
  Users,
  BarChart3,
  Settings,
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

interface SystemCard {
  title: string;
  description: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'active' | 'warning' | 'normal';
  stats?: {
    label: string;
    value: string | number;
    trend?: 'up' | 'down' | 'stable';
  }[];
}

const systems: SystemCard[] = [
  {
    title: 'إدارة الطلبات',
    description: 'متابعة وإدارة جميع طلبات العملاء والخدمات المقدمة',
    path: '/admin/orders',
    icon: LayoutDashboard,
    status: 'active',
    stats: [
      { label: 'الطلبات النشطة', value: 12, trend: 'up' },
      { label: 'قيد المراجعة', value: 5 }
    ]
  },
  {
    title: 'إدارة العقود',
    description: 'إنشاء وإدارة العقود والاتفاقيات مع العملاء',
    path: '/admin/contracts',
    icon: FileText,
    status: 'normal',
    stats: [
      { label: 'العقود النشطة', value: 8 },
      { label: 'في الانتظار', value: 3 }
    ]
  },
  {
    title: 'النظام المحاسبي',
    description: 'إدارة الحسابات والتقارير المالية وميزان المراجعة',
    path: '/admin/accounting',
    icon: Calculator,
    status: 'active',
    stats: [
      { label: 'الأرباح الشهرية', value: '45,230 ر.س', trend: 'up' },
      { label: 'الفواتير المستحقة', value: 7 }
    ]
  },
  {
    title: 'التوقيع الإلكتروني',
    description: 'إدارة مستندات التوقيع الإلكتروني وتتبع حالة التوقيعات',
    path: '/admin/esign',
    icon: PenTool,
    status: 'normal',
    stats: [
      { label: 'المستندات الموقعة', value: 15 },
      { label: 'في انتظار التوقيع', value: 4 }
    ]
  },
  {
    title: 'إدارة واتساب',
    description: 'إعدادات إشعارات واتساب وسجل الرسائل المرسلة',
    path: '/admin/whatsapp',
    status: 'warning',
    icon: MessageCircle,
    stats: [
      { label: 'الرسائل اليوم', value: 24, trend: 'up' },
      { label: 'معدل النجاح', value: '94%' }
    ]
  }
];

const AdminDashboard: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'warning': return AlertCircle;
      default: return Clock;
    }
  };

  const getTrendIcon = (trend?: string) => {
    if (trend === 'up') return <TrendingUp className="h-3 w-3 text-green-600" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-muted/30" dir="rtl">
      {/* رأس الصفحة */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">لوحة الإدارة الرئيسية</h1>
              <p className="text-muted-foreground">إدارة شاملة لجميع أنظمة الوكالة</p>
            </div>
            <Link to="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                العودة للرئيسية
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
              <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground">
                +12% من الشهر الماضي
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">العقود النشطة</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">
                8 موقعة، 7 في المراجعة
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الإيرادات الشهرية</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">67,430 ر.س</div>
              <p className="text-xs text-muted-foreground">
                +18% من الشهر الماضي
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">رسائل واتساب</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">
                24 اليوم، 94% معدل نجاح
              </p>
            </CardContent>
          </Card>
        </div>

        {/* الأنظمة */}
        <div>
          <h2 className="text-xl font-semibold mb-6 text-foreground">الأنظمة الإدارية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {systems.map((system) => {
              const Icon = system.icon;
              const StatusIcon = getStatusIcon(system.status);
              
              return (
                <Card key={system.path} className="hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{system.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <StatusIcon className={`h-4 w-4 rounded-full p-0.5 ${getStatusColor(system.status)}`} />
                            <span className="text-xs text-muted-foreground">
                              {system.status === 'active' ? 'نشط' : 
                               system.status === 'warning' ? 'يحتاج انتباه' : 'عادي'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <CardDescription className="text-sm leading-relaxed">
                      {system.description}
                    </CardDescription>
                    
                    {system.stats && (
                      <div className="space-y-2">
                        {system.stats.map((stat, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{stat.label}</span>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">{stat.value}</span>
                              {getTrendIcon(stat.trend)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <Link to={system.path} className="block">
                      <Button className="w-full gap-2">
                        <Settings className="h-4 w-4" />
                        إدارة النظام
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* معلومات سريعة */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                الأنشطة الأخيرة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-muted/50 rounded-md">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">تم توقيع عقد جديد - أحمد محمد</span>
                  <span className="text-xs text-muted-foreground mr-auto">منذ 5 دقائق</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-muted/50 rounded-md">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">فاتورة جديدة - خدمات ترجمة</span>
                  <span className="text-xs text-muted-foreground mr-auto">منذ 15 دقيقة</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-muted/50 rounded-md">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">تذكير فاتورة مستحقة</span>
                  <span className="text-xs text-muted-foreground mr-auto">منذ ساعة</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                معلومات النظام
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                  <span className="text-sm">حالة قاعدة البيانات</span>
                  <Badge variant="default" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    متصلة
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                  <span className="text-sm">خدمة واتساب</span>
                  <Badge variant="secondary" className="gap-1">
                    <AlertCircle className="h-3 w-3" />
                    محاكاة
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                  <span className="text-sm">النسخ الاحتياطي</span>
                  <Badge variant="outline">
                    آخر نسخ: اليوم
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                  <span className="text-sm">إصدار النظام</span>
                  <Badge variant="outline">
                    v2.1.0
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;