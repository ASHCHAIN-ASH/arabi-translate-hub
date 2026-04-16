import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { 
  DollarSign, TrendingUp, CreditCard, FileText, 
  ArrowUpRight, ArrowDownRight, RefreshCw, BarChart3,
  Wallet, Receipt, PieChart
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';

const AdminFinancial = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingPayments: 0,
    completedPayments: 0,
    totalInvoices: 0
  });
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFinancialData();
  }, []);

  const loadFinancialData = async () => {
    try {
      // Revenue stats
      const { data: payments } = await (supabase
        .from('payment_transactions') as any)
        .select('amount, status, created_at, description, user_id, type')
        .order('created_at', { ascending: false });

      const completed = payments?.filter((p: any) => p.status === 'completed') || [];
      const pending = payments?.filter((p: any) => p.status === 'pending') || [];

      const { count: invoiceCount } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalRevenue: completed.reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
        pendingPayments: pending.reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
        completedPayments: completed.length,
        totalInvoices: invoiceCount || 0
      });

      setRecentPayments(payments?.slice(0, 15) || []);
    } catch (err) {
      console.error('Error loading financial data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Generate chart data from recent payments
  const chartData = React.useMemo(() => {
    const monthlyData: Record<string, number> = {};
    recentPayments
      .filter(p => p.status === 'COMPLETED')
      .forEach(p => {
        const month = new Date(p.created_at).toLocaleDateString('ar-SA', { month: 'short' });
        monthlyData[month] = (monthlyData[month] || 0) + (p.amount || 0);
      });
    return Object.entries(monthlyData).map(([name, revenue]) => ({ name, revenue }));
  }, [recentPayments]);

  const pieData = [
    { name: 'مكتملة', value: stats.completedPayments, color: '#22c55e' },
    { name: 'معلقة', value: recentPayments.filter(p => p.status === 'PENDING').length, color: '#eab308' },
    { name: 'ملغية', value: recentPayments.filter(p => p.status === 'FAILED').length, color: '#ef4444' }
  ];

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(amount);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">اللوحة المالية</h1>
            <p className="text-muted-foreground">نظرة شاملة على الإيرادات والمدفوعات</p>
          </div>
          <Button variant="outline" onClick={loadFinancialData} size="sm">
            <RefreshCw className="w-4 h-4 ml-2" />
            تحديث
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي الإيرادات</p>
                  <p className="text-xl font-bold text-green-700">{formatCurrency(stats.totalRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-amber-50">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">مدفوعات معلقة</p>
                  <p className="text-xl font-bold text-yellow-700">{formatCurrency(stats.pendingPayments)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">عمليات مكتملة</p>
                  <p className="text-xl font-bold text-blue-700">{stats.completedPayments}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي الفواتير</p>
                  <p className="text-xl font-bold text-purple-700">{stats.totalInvoices}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-2 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                الإيرادات الشهرية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                توزيع المدفوعات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPie>
                  <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPie>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Payments Table */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              أحدث المعاملات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الوصف</TableHead>
                  <TableHead className="text-right">المبلغ</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">طريقة الدفع</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPayments.map((payment) => (
                  <TableRow key={payment.id || Math.random()}>
                    <TableCell className="font-medium">{payment.description || '-'}</TableCell>
                    <TableCell className="font-bold">{formatCurrency(payment.amount || 0)}</TableCell>
                    <TableCell>
                      <Badge className={
                        payment.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                        payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }>
                        {payment.status === 'COMPLETED' ? 'مكتمل' : payment.status === 'PENDING' ? 'معلق' : 'فاشل'}
                      </Badge>
                    </TableCell>
                    <TableCell>{payment.payment_method || '-'}</TableCell>
                    <TableCell>{new Date(payment.created_at).toLocaleDateString('ar-SA')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminFinancial;
