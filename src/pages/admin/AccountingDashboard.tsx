import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NavigationSidebar from '@/components/admin/NavigationSidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { 
  CalendarIcon, 
  Download, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Users,
  FileText,
  AlertCircle
} from 'lucide-react';
import { 
  getAllAccounts, 
  getTrialBalance, 
  getGeneralLedger, 
  getTaxSummary,
  syncWithProvider 
} from '@/utils/supabaseAccountingService';
import { LedgerAccount, TrialBalance, GLEntry, TaxSummary } from '@/types/accounting';
import { toast } from 'sonner';

const AccountingDashboard: React.FC = () => {
  const [accounts, setAccounts] = useState<LedgerAccount[]>([]);
  const [trialBalance, setTrialBalance] = useState<TrialBalance[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [glEntries, setGlEntries] = useState<GLEntry[]>([]);
  const [taxSummary, setTaxSummary] = useState<TaxSummary[]>([]);
  const [fromDate, setFromDate] = useState<Date>(new Date(new Date().getFullYear(), 0, 1));
  const [toDate, setToDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadAccounts();
    loadReports();
  }, []);

  const loadAccounts = async () => {
    try {
      const accountsData = await getAllAccounts();
      setAccounts(accountsData);
    } catch (error) {
      console.error('Error loading accounts:', error);
      toast.error('فشل في تحميل دليل الحسابات');
    }
  };

  const loadReports = async () => {
    setLoading(true);
    try {
      const fromDateStr = format(fromDate, 'yyyy-MM-dd');
      const toDateStr = format(toDate, 'yyyy-MM-dd');

      const [trialBalanceData, taxSummaryData] = await Promise.all([
        getTrialBalance(fromDateStr, toDateStr),
        getTaxSummary(fromDateStr, toDateStr)
      ]);

      setTrialBalance(trialBalanceData);
      setTaxSummary(taxSummaryData);
    } catch (error) {
      console.error('Error loading reports:', error);
      toast.error('فشل في تحميل التقارير المحاسبية');
    } finally {
      setLoading(false);
    }
  };

  const loadGeneralLedger = async (accountId: string) => {
    if (!accountId) return;
    
    setLoading(true);
    try {
      const fromDateStr = format(fromDate, 'yyyy-MM-dd');
      const toDateStr = format(toDate, 'yyyy-MM-dd');
      
      const glData = await getGeneralLedger(accountId, fromDateStr, toDateStr);
      setGlEntries(glData);
      setSelectedAccount(accountId);
    } catch (error) {
      console.error('Error loading general ledger:', error);
      toast.error('فشل في تحميل دفتر الأستاذ العام');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await syncWithProvider('mock');
      toast.success('تمت المزامنة بنجاح');
      loadReports();
    } catch (error) {
      console.error('Error syncing:', error);
      toast.error('فشل في المزامنة');
    } finally {
      setSyncing(false);
    }
  };

  const exportToPDF = (reportType: string) => {
    toast.info(`سيتم تصدير ${reportType} قريباً`);
  };

  // حساب الملخص المالي
  const totalAssets = trialBalance
    .filter(item => accounts.find(acc => acc.code === item.accountCode)?.type === 'asset')
    .reduce((sum, item) => sum + item.balance, 0);

  const totalLiabilities = trialBalance
    .filter(item => accounts.find(acc => acc.code === item.accountCode)?.type === 'liability')
    .reduce((sum, item) => sum + Math.abs(item.balance), 0);

  const totalRevenue = trialBalance
    .filter(item => accounts.find(acc => acc.code === item.accountCode)?.type === 'revenue')
    .reduce((sum, item) => sum + Math.abs(item.balance), 0);

  const totalExpenses = trialBalance
    .filter(item => accounts.find(acc => acc.code === item.accountCode)?.type === 'expense')
    .reduce((sum, item) => sum + item.balance, 0);

  const netIncome = totalRevenue - totalExpenses;

  return (
    <div className="flex min-h-screen" dir="rtl">
      <NavigationSidebar />
      <div className="flex-1 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">لوحة المحاسبة</h1>
          <p className="text-muted-foreground">إدارة الحسابات والتقارير المالية</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSync} disabled={syncing} variant="outline">
            <RefreshCw className={`ml-2 h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            مزامنة
          </Button>
        </div>
      </div>

      {/* بطاقات الملخص المالي */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الأصول</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalAssets.toLocaleString('ar-SA')} ر.س
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الخصوم</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {totalLiabilities.toLocaleString('ar-SA')} ر.س
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalRevenue.toLocaleString('ar-SA')} ر.س
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">صافي الدخل</CardTitle>
            <Users className={`h-4 w-4 ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {netIncome.toLocaleString('ar-SA')} ر.س
            </div>
          </CardContent>
        </Card>
      </div>

      {/* فلاتر التاريخ */}
      <Card>
        <CardHeader>
          <CardTitle>فلاتر التقارير</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">من تاريخ</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-48 justify-start text-right">
                    <CalendarIcon className="ml-2 h-4 w-4" />
                    {format(fromDate, 'dd/MM/yyyy', { locale: ar })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={(date) => date && setFromDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">إلى تاريخ</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-48 justify-start text-right">
                    <CalendarIcon className="ml-2 h-4 w-4" />
                    {format(toDate, 'dd/MM/yyyy', { locale: ar })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={(date) => date && setToDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button onClick={loadReports} disabled={loading}>
              <FileText className="ml-2 h-4 w-4" />
              تحديث التقارير
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* التقارير */}
      <Tabs defaultValue="trial-balance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trial-balance">ميزان المراجعة</TabsTrigger>
          <TabsTrigger value="general-ledger">دفتر الأستاذ العام</TabsTrigger>
          <TabsTrigger value="tax-summary">ملخص الضريبة</TabsTrigger>
        </TabsList>

        <TabsContent value="trial-balance">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>ميزان المراجعة</CardTitle>
                  <CardDescription>
                    من {format(fromDate, 'dd/MM/yyyy', { locale: ar })} إلى {format(toDate, 'dd/MM/yyyy', { locale: ar })}
                  </CardDescription>
                </div>
                <Button onClick={() => exportToPDF('ميزان المراجعة')} variant="outline">
                  <Download className="ml-2 h-4 w-4" />
                  تصدير PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-right">رقم الحساب</th>
                      <th className="border border-border p-3 text-right">اسم الحساب</th>
                      <th className="border border-border p-3 text-right">مدين</th>
                      <th className="border border-border p-3 text-right">دائن</th>
                      <th className="border border-border p-3 text-right">الرصيد</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trialBalance.map((item, index) => (
                      <tr key={index} className="hover:bg-muted/50">
                        <td className="border border-border p-3">{item.accountCode}</td>
                        <td className="border border-border p-3">{item.accountName}</td>
                        <td className="border border-border p-3 text-green-600">
                          {item.debitTotal > 0 ? item.debitTotal.toLocaleString('ar-SA') : '-'}
                        </td>
                        <td className="border border-border p-3 text-red-600">
                          {item.creditTotal > 0 ? item.creditTotal.toLocaleString('ar-SA') : '-'}
                        </td>
                        <td className={`border border-border p-3 font-medium ${
                          item.balance >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {Math.abs(item.balance).toLocaleString('ar-SA')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general-ledger">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>دفتر الأستاذ العام</CardTitle>
                  <CardDescription>تفاصيل حركة الحساب المحدد</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedAccount} onValueChange={loadGeneralLedger}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="اختر الحساب" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.code} - {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={() => exportToPDF('دفتر الأستاذ العام')} variant="outline">
                    <Download className="ml-2 h-4 w-4" />
                    تصدير PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedAccount ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border p-3 text-right">التاريخ</th>
                        <th className="border border-border p-3 text-right">رقم القيد</th>
                        <th className="border border-border p-3 text-right">المرجع</th>
                        <th className="border border-border p-3 text-right">البيان</th>
                        <th className="border border-border p-3 text-right">مدين</th>
                        <th className="border border-border p-3 text-right">دائن</th>
                        <th className="border border-border p-3 text-right">الرصيد</th>
                      </tr>
                    </thead>
                    <tbody>
                      {glEntries.map((entry, index) => (
                        <tr key={index} className="hover:bg-muted/50">
                          <td className="border border-border p-3">
                            {format(new Date(entry.date), 'dd/MM/yyyy', { locale: ar })}
                          </td>
                          <td className="border border-border p-3">{entry.entryNumber}</td>
                          <td className="border border-border p-3">{entry.reference || '-'}</td>
                          <td className="border border-border p-3">{entry.memo || '-'}</td>
                          <td className="border border-border p-3 text-green-600">
                            {entry.debitAmount > 0 ? entry.debitAmount.toLocaleString('ar-SA') : '-'}
                          </td>
                          <td className="border border-border p-3 text-red-600">
                            {entry.creditAmount > 0 ? entry.creditAmount.toLocaleString('ar-SA') : '-'}
                          </td>
                          <td className={`border border-border p-3 font-medium ${
                            entry.balance >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {Math.abs(entry.balance).toLocaleString('ar-SA')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="mx-auto h-12 w-12 mb-4" />
                  <p>يرجى اختيار حساب لعرض دفتر الأستاذ العام</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax-summary">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>ملخص الضريبة</CardTitle>
                  <CardDescription>
                    ملخص ضريبة القيمة المضافة للفترة المحددة
                  </CardDescription>
                </div>
                <Button onClick={() => exportToPDF('ملخص الضريبة')} variant="outline">
                  <Download className="ml-2 h-4 w-4" />
                  تصدير PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {taxSummary.map((tax, index) => (
                  <Card key={index} className="border border-border">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm text-muted-foreground">المبيعات الخاضعة للضريبة</label>
                          <p className="text-lg font-semibold text-blue-600">
                            {tax.taxableSales.toLocaleString('ar-SA')} ر.س
                          </p>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">معدل الضريبة</label>
                          <p className="text-lg font-semibold">
                            {tax.taxRate}%
                          </p>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">مبلغ الضريبة</label>
                          <p className="text-lg font-semibold text-red-600">
                            {tax.taxAmount.toLocaleString('ar-SA')} ر.س
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {taxSummary.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="mx-auto h-12 w-12 mb-4" />
                    <p>لا توجد بيانات ضريبية للفترة المحددة</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};

export default AccountingDashboard;