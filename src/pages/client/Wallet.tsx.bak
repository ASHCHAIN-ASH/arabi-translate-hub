import React, { useState, useEffect } from 'react';
import ClientLayout from '@/components/client/ClientLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/components/SimpleAuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ClientDashboardService } from '@/utils/clientDashboardService';
import { 
  Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownRight, 
  RefreshCw, CreditCard, TrendingUp, History 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface WalletTransaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  created_at: string;
  reference_id?: string;
}

const Wallet = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [topUpAmount, setTopUpAmount] = useState('');

  const loadWalletData = async () => {
    if (!user?.id) return;
    try {
      // Get balance from payment_transactions (sum of completed payments)
      const { data: payments, error } = await supabase
        .from('payment_transactions')
        .select('amount, status, type, created_at, description, reference, id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate wallet balance from completed transactions
      const totalCredits = payments
        ?.filter(p => p.status === 'completed' && p.type === 'credit')
        .reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

      const totalDebits = payments
        ?.filter(p => p.status === 'completed' && p.type === 'debit')
        .reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

      setBalance(totalCredits - totalDebits);
      setTransactions(payments?.map(p => ({
        id: p.id,
        type: p.type === 'credit' ? 'credit' : 'debit',
        amount: p.amount || 0,
        description: p.description || (p.type === 'credit' ? 'شحن المحفظة' : 'خصم من المحفظة'),
        created_at: p.created_at,
        reference_id: p.reference
      })) || []);
    } catch (err) {
      console.error('Error loading wallet:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWalletData();
  }, [user?.id]);

  const handleTopUpRequest = () => {
    const amount = parseFloat(topUpAmount);
    if (!amount || amount <= 0) {
      toast.error('يرجى إدخال مبلغ صحيح');
      return;
    }
    toast.success(`تم إرسال طلب شحن بمبلغ ${amount} ريال. سيتم مراجعته من الإدارة.`);
    setTopUpAmount('');
  };

  const quickAmounts = [50, 100, 250, 500, 1000];

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="p-4 lg:p-6 space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">محفظتي</h1>
            <p className="text-muted-foreground">إدارة رصيدك والمعاملات المالية</p>
          </div>
          <Button variant="outline" onClick={loadWalletData} size="sm">
            <RefreshCw className="w-4 h-4 ml-2" />
            تحديث
          </Button>
        </div>

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-10" />
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                    <WalletIcon className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm">الرصيد المتاح</p>
                    <p className="text-4xl font-black">{ClientDashboardService.formatCurrency(balance)}</p>
                  </div>
                </div>
                <CreditCard className="w-16 h-16 text-white/20" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Up Section */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              شحن المحفظة
            </CardTitle>
            <CardDescription>اختر مبلغ الشحن أو أدخل مبلغاً مخصصاً</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant={topUpAmount === String(amount) ? 'default' : 'outline'}
                  onClick={() => setTopUpAmount(String(amount))}
                  className="min-w-[80px]"
                >
                  {amount} ريال
                </Button>
              ))}
            </div>
            <div className="flex gap-3">
              <Input
                type="number"
                placeholder="مبلغ مخصص..."
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleTopUpRequest} disabled={!topUpAmount}>
                <Plus className="w-4 h-4 ml-2" />
                طلب شحن
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              سجل المعاملات
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium">لا توجد معاملات</p>
                <p className="text-muted-foreground">ستظهر المعاملات هنا عند شحن المحفظة أو إتمام عمليات الدفع</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.slice(0, 20).map((tx, index) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {tx.type === 'credit' 
                          ? <ArrowDownRight className="w-5 h-5 text-green-600" />
                          : <ArrowUpRight className="w-5 h-5 text-red-600" />
                        }
                      </div>
                      <div>
                        <p className="font-medium text-sm">{tx.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(tx.created_at).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                    </div>
                    <span className={`font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'credit' ? '+' : '-'}{ClientDashboardService.formatCurrency(tx.amount)}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default Wallet;
