import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  AlertCircle, 
  CheckCircle, 
  X, 
  Clock,
  User,
  Building2,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  AlertTriangleIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface OrderNotification {
  id: string;
  type: 'new_order' | 'urgent_order' | 'high_priority' | 'payment_pending';
  timestamp: Date;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  serviceType: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  budget: string;
  timeline: string;
  description: string;
  isRead: boolean;
}

interface AdminNotificationSystemProps {
  onNotificationReceived?: (notification: OrderNotification) => void;
}

const AdminNotificationSystem: React.FC<AdminNotificationSystemProps> = ({ onNotificationReceived }) => {
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // محاكاة تلقي إشعارات جديدة
  useEffect(() => {
    const interval = setInterval(() => {
      // محاكاة إشعار جديد كل 30 ثانية للاختبار
      if (Math.random() > 0.7) {
        const newNotification = createMockNotification();
        addNotification(newNotification);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const createMockNotification = (): OrderNotification => {
    const mockData = [
      {
        companyName: 'شركة أرامكو السعودية',
        contactPerson: 'أحمد محمد العلي',
        email: 'ahmed.ali@aramco.com',
        serviceType: 'academic-translation',
        priority: 'high' as const,
      },
      {
        companyName: 'مجموعة سامبا المالية',
        contactPerson: 'فاطمة أحمد',
        email: 'fatima@samba.com',
        serviceType: 'business-translation',
        priority: 'critical' as const,
      },
      {
        companyName: 'جامعة الملك سعود',
        contactPerson: 'د. محمد الخالد',
        email: 'm.alkhalid@ksu.edu.sa',
        serviceType: 'research-writing',
        priority: 'medium' as const,
      },
    ];

    const randomData = mockData[Math.floor(Math.random() * mockData.length)];
    
    return {
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: randomData.priority === 'critical' ? 'urgent_order' : 'new_order',
      timestamp: new Date(),
      phone: '+966501234567',
      budget: '15k-30k',
      timeline: 'week',
      description: 'طلب خدمة عاجلة من عميل مهم يتطلب اهتماماً خاصاً',
      isRead: false,
      ...randomData,
    };
  };

  const addNotification = (notification: OrderNotification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 19)]); // الاحتفاظ بـ 20 إشعار فقط
    setUnreadCount(prev => prev + 1);
    
    if (onNotificationReceived) {
      onNotificationReceived(notification);
    }

    // إشعار صوتي (اختياري)
    if ('Notification' in window && window.Notification.permission === 'granted') {
      new window.Notification('طلب جديد - وكالة ماستر إيدو باث', {
        body: `طلب جديد من ${notification.companyName}`,
        icon: '/favicon.ico',
      });
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
    
    if (unreadCount > 0) {
      setUnreadCount(prev => prev - 1);
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && !notification.isRead && unreadCount > 0) {
      setUnreadCount(prev => prev - 1);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-blue-600 bg-blue-100 border-blue-200';
      default: return 'text-green-600 bg-green-100 border-green-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return AlertTriangleIcon;
      case 'high': return AlertCircle;
      case 'medium': return Clock;
      default: return CheckCircle;
    }
  };

  const getServiceLabel = (serviceType: string) => {
    const services: Record<string, string> = {
      'academic-translation': 'الترجمة الأكاديمية',
      'research-writing': 'كتابة البحوث',
      'business-translation': 'الترجمة التجارية',
      'technical-translation': 'الترجمة التقنية',
      'statistical-analysis': 'التحليل الإحصائي',
      'journal-publication': 'النشر في المجلات',
    };
    return services[serviceType] || serviceType;
  };

  // طلب إذن الإشعارات عند التحميل
  useEffect(() => {
    if ('Notification' in window && window.Notification.permission === 'default') {
      window.Notification.requestPermission();
    }
  }, []);

  return (
    <div className="fixed top-4 left-4 z-50" dir="rtl">
      {/* زر الإشعارات */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative"
      >
        <Button
          onClick={() => setShowPanel(!showPanel)}
          variant="outline"
          size="lg"
          className="bg-white/90 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300 relative"
        >
          <Bell className="h-5 w-5 text-blue-600" />
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.div>
          )}
        </Button>
      </motion.div>

      {/* لوحة الإشعارات */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 left-0 w-96 max-h-[600px] bg-white border-2 border-gray-200 rounded-xl shadow-2xl overflow-hidden z-50"
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  <h3 className="font-bold text-lg">إشعارات الطلبات</h3>
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button
                      onClick={markAllAsRead}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/10 text-xs"
                    >
                      تحديد الكل كمقروء
                    </Button>
                  )}
                  <Button
                    onClick={() => setShowPanel(false)}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/10 p-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="max-h-[500px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>لا توجد إشعارات حالياً</p>
                </div>
              ) : (
                <div className="p-2">
                  {notifications.map((notification, index) => {
                    const PriorityIcon = getPriorityIcon(notification.priority);
                    
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        className={`mb-3 p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                          notification.isRead 
                            ? 'bg-gray-50 border-gray-200' 
                            : 'bg-blue-50 border-blue-200 shadow-md'
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`p-2 rounded-full ${getPriorityColor(notification.priority)}`}>
                              <PriorityIcon className="h-4 w-4" />
                            </div>
                            <div>
                              <Badge variant="outline" className={getPriorityColor(notification.priority)}>
                                {notification.priority === 'critical' ? 'عاجل جداً' :
                                 notification.priority === 'high' ? 'عاجل' :
                                 notification.priority === 'medium' ? 'متوسط' : 'عادي'}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {notification.timestamp.toLocaleString('ar-SA')}
                            </span>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notification.id);
                              }}
                              variant="ghost"
                              size="sm"
                              className="p-1 hover:bg-red-100 text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-blue-600" />
                            <span className="font-semibold text-gray-800">{notification.companyName}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-green-600" />
                            <span className="text-gray-700">{notification.contactPerson}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              <span className="truncate">{notification.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <span>{notification.phone}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {getServiceLabel(notification.serviceType)}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <DollarSign className="h-3 w-3 ml-1" />
                              {notification.budget}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Calendar className="h-3 w-3 ml-1" />
                              {notification.timeline}
                            </Badge>
                          </div>

                          {notification.description && (
                            <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded mt-2">
                              {notification.description}
                            </p>
                          )}
                        </div>

                        {!notification.isRead && (
                          <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1 bg-blue-600 hover:bg-blue-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                                // هنا يمكن إضافة منطق فتح تفاصيل الطلب
                              }}
                            >
                              عرض التفاصيل
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-200 text-green-600 hover:bg-green-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                // هنا يمكن إضافة منطق الرد السريع
                              }}
                            >
                              رد سريع
                            </Button>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminNotificationSystem;