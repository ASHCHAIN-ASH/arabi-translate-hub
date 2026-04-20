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
import DashboardRecentContracts from '@/components/client/DashboardRecentContracts';
import DashboardRecentInvoices from '@/components/client/DashboardRecentInvoices';
import DashboardActiveTickets from '@/components/client/DashboardActiveTickets';
import DashboardRewardsWidget from '@/components/client/DashboardRewardsWidget';
import { DashboardChallengeNotice } from '@/components/client/DashboardChallengeNotice';

const ClientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { stats, orders, invoices, contracts, tickets, payments, loading, error, refresh } = useClientData(user?.id);

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
        {/* Hero — animated */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white"
        >
          {/* Animated gradient bg */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600" />
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-24 -right-24 w-80 h-80 bg-pink-400/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -25, 0], y: [0, 20, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-400/30 rounded-full blur-3xl"
          />
          {/* Shimmer */}
          <div className="absolute inset-0 opacity-[0.08]" style={{
            backgroundImage: 'linear-gradient(45deg, transparent 25%, white 25%, white 26%, transparent 26%, transparent 75%, white 75%, white 76%, transparent 76%)',
            backgroundSize: '40px 40px',
          }} />

          <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 180, delay: 0.2 }}
                className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center ring-2 ring-white/30 shadow-2xl"
              >
                <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8" />
              </motion.div>
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-bold mb-2 ring-1 ring-white/30"
                >
                  <span className="relative flex w-2 h-2">
                    <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-400" />
                  </span>
                  أهلاً بعودتك
                </motion.div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                  مرحباً، {displayName} 👋
                </h1>
                <p className="text-white/85 text-sm sm:text-base mt-1 font-medium">
                  لوحة تحكمك الذكية — كل ما تحتاجه في مكان واحد
                </p>
              </div>
            </div>
            <Button
              onClick={handleRefresh}
              size="sm"
              className="bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 rounded-xl"
            >
              <RefreshCw className="w-4 h-4 ml-2" />
              تحديث
            </Button>
          </div>
        </motion.div>

        {/* Challenge Academy Notice — smart banner */}
        <DashboardChallengeNotice />

        {/* Stats */}
        <DashboardStatsGrid stats={stats} payments={payments} />

        {/* Quick Actions */}
        <DashboardQuickActions />

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <DashboardRecentOrders orders={orders} />
            <DashboardRecentContracts contracts={contracts} />
          </div>
          <div className="space-y-5">
            <DashboardRewardsWidget />
            <DashboardRecentInvoices invoices={invoices} />
            <DashboardActiveTickets tickets={tickets} />
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default ClientDashboard;
