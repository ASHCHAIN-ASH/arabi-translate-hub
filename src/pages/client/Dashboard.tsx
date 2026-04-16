import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/SimpleAuthProvider';
import { useNavigate } from 'react-router-dom';
import { useClientData } from '@/hooks/useClientData';
import { useToast } from '@/hooks/use-toast';
import ClientLayout from '@/components/client/ClientLayout';
import DashboardStatsGrid from '@/components/client/DashboardStatsGrid';
import DashboardQuickActions from '@/components/client/DashboardQuickActions';
import DashboardRecentOrders from '@/components/client/DashboardRecentOrders';
import DashboardRecentInvoices from '@/components/client/DashboardRecentInvoices';
import DashboardActiveTickets from '@/components/client/DashboardActiveTickets';

const ClientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { stats, orders, invoices, tickets, payments, loading, error, refresh } = useClientData(user?.id);

  const handleRefresh = async () => {
    await refresh();
    toast({ title: "تم تحديث البيانات", description: "تم تحديث بيانات لوحة التحكم بنجاح" });
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">جاري تحميل البيانات...</p>
          </div>
        </div>
      </ClientLayout>
    );
  }

  if (error) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-4 text-destructive" />
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="w-4 h-4 ml-2" />
              إعادة المحاولة
            </Button>
          </div>
        </div>
      </ClientLayout>
    );
  }

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'عزيزي العميل';

  return (
    <ClientLayout>
      <div className="p-3 sm:p-5 lg:p-6 space-y-5" dir="rtl">
        {/* Hero Section — compact */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-purple-700 p-5 sm:p-8 text-white"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-purple-300 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                  مرحباً، {displayName}
                </h1>
                <p className="text-white/80 text-sm sm:text-base mt-1">
                  ابدأ رحلتك الأكاديمية مع خدماتنا المتخصصة
                </p>
              </div>
            </div>
            <Button
              onClick={handleRefresh}
              variant="secondary"
              size="sm"
              className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hidden sm:flex"
            >
              <RefreshCw className="w-4 h-4 ml-2" />
              تحديث
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <DashboardStatsGrid stats={stats} payments={payments} />

        {/* Quick Actions */}
        <DashboardQuickActions />

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <DashboardRecentOrders orders={orders} />
          </div>
          <div className="space-y-5">
            <DashboardRecentInvoices invoices={invoices} />
            <DashboardActiveTickets tickets={tickets} />
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default ClientDashboard;
