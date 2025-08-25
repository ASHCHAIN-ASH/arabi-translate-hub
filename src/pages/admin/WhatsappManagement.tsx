import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NavigationSidebar from '@/components/admin/NavigationSidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { 
  MessageCircle, 
  Send, 
  Settings, 
  TestTube,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Phone,
  Eye,
  AlertCircle
} from 'lucide-react';
import { 
  getAllWhatsappProviders,
  getAllWhatsappTemplates,
  getWhatsappLogs,
  updateWhatsappProvider,
  testWhatsappMessage
} from '@/utils/supabaseWhatsappService';
import { WhatsappProvider, WhatsappTemplate, WhatsappLog, WhatsappStatus } from '@/types/whatsapp';
import { toast } from 'sonner';

const WhatsappManagement: React.FC = () => {
  const [providers, setProviders] = useState<WhatsappProvider[]>([]);
  const [templates, setTemplates] = useState<WhatsappTemplate[]>([]);
  const [logs, setLogs] = useState<WhatsappLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [testDialog, setTestDialog] = useState(false);
  const [testPhone, setTestPhone] = useState('');
  const [testTemplate, setTestTemplate] = useState('');
  const [testVariables, setTestVariables] = useState('');
  const [configDialog, setConfigDialog] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<WhatsappProvider | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [providersData, templatesData, logsData] = await Promise.all([
        getAllWhatsappProviders(),
        getAllWhatsappTemplates(),
        getWhatsappLogs({})
      ]);

      setProviders(providersData);
      setTemplates(templatesData);
      setLogs(logsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('فشل في تحميل بيانات واتساب');
    } finally {
      setLoading(false);
    }
  };

  const handleProviderToggle = async (provider: WhatsappProvider) => {
    try {
      // إذا كنا نفعّل مزود، قم بتعطيل الآخرين أولاً
      if (!provider.isEnabled) {
        for (const p of providers) {
          if (p.isEnabled && p.id !== provider.id) {
            await updateWhatsappProvider(p.id, p.configJson, false);
          }
        }
      }

      await updateWhatsappProvider(provider.id, provider.configJson, !provider.isEnabled);
      toast.success(`تم ${!provider.isEnabled ? 'تفعيل' : 'تعطيل'} مزود ${provider.name} بنجاح`);
      loadData();
    } catch (error) {
      console.error('Error toggling provider:', error);
      toast.error('فشل في تحديث إعدادات المزود');
    }
  };

  const handleTestMessage = async () => {
    if (!testPhone || !testTemplate) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      let variables: Record<string, string> = {};
      if (testVariables) {
        variables = JSON.parse(testVariables);
      }

      const result = await testWhatsappMessage(testPhone, testTemplate, variables);
      
      if (result.success) {
        toast.success('تم إرسال الرسالة التجريبية بنجاح');
      } else {
        toast.error(`فشل في إرسال الرسالة: ${result.error}`);
      }

      setTestDialog(false);
      setTestPhone('');
      setTestTemplate('');
      setTestVariables('');
      loadData(); // إعادة تحميل السجلات
    } catch (error) {
      console.error('Error testing message:', error);
      toast.error('خطأ في إرسال الرسالة التجريبية');
    }
  };

  const getStatusBadge = (status: WhatsappStatus) => {
    const statusConfig = {
      queued: { label: 'في الانتظار', variant: 'secondary' as const, icon: Clock },
      sent: { label: 'مرسل', variant: 'default' as const, icon: CheckCircle },
      failed: { label: 'فشل', variant: 'destructive' as const, icon: XCircle }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getLogStats = () => {
    const stats = {
      total: logs.length,
      sent: logs.filter(log => log.status === 'sent').length,
      failed: logs.filter(log => log.status === 'failed').length,
      queued: logs.filter(log => log.status === 'queued').length,
    };
    return stats;
  };

  const stats = getLogStats();
  const activeProvider = providers.find(p => p.isEnabled);

  return (
    <div className="flex min-h-screen" dir="rtl">
      <NavigationSidebar />
      <div className="flex-1 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">إدارة واتساب</h1>
          <p className="text-muted-foreground">إدارة إشعارات واتساب والقوالب والمزودين</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={testDialog} onOpenChange={setTestDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <TestTube className="ml-2 h-4 w-4" />
                اختبار الإرسال
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>اختبار إرسال رسالة واتساب</DialogTitle>
                <DialogDescription>
                  أرسل رسالة تجريبية لاختبار إعدادات واتساب
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">رقم الهاتف</label>
                  <Input
                    placeholder="+966500000000"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">القالب</label>
                  <select 
                    className="w-full p-2 border rounded-md mt-1"
                    value={testTemplate}
                    onChange={(e) => setTestTemplate(e.target.value)}
                  >
                    <option value="">-- اختر القالب --</option>
                    {templates.map(template => (
                      <option key={template.id} value={template.templateName}>
                        {template.templateName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">متغيرات القالب (JSON)</label>
                  <Textarea
                    placeholder='{"customer_name": "أحمد", "invoice_number": "INV-001"}'
                    value={testVariables}
                    onChange={(e) => setTestVariables(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setTestDialog(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleTestMessage}>
                  <Send className="ml-2 h-4 w-4" />
                  إرسال
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button onClick={loadData} variant="outline" disabled={loading}>
            <RefreshCw className={`ml-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
        </div>
      </div>

      {/* حالة المزود النشط */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            حالة الخدمة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {activeProvider ? (
                <>
                  <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">المزود النشط: {activeProvider.name}</span>
                  <Badge variant="default">متصل</Badge>
                </>
              ) : (
                <>
                  <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                  <span className="font-medium">لا يوجد مزود نشط</span>
                  <Badge variant="destructive">غير متصل</Badge>
                </>
              )}
            </div>
            {activeProvider && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSelectedProvider(activeProvider);
                  setConfigDialog(true);
                }}
              >
                <Settings className="ml-2 h-4 w-4" />
                إعدادات المزود
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* إحصائيات الرسائل */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الرسائل</CardTitle>
            <MessageCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مرسلة بنجاح</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.sent}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">فشل الإرسال</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">في الانتظار</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.queued}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="logs">سجل الرسائل</TabsTrigger>
          <TabsTrigger value="templates">القوالب</TabsTrigger>
          <TabsTrigger value="providers">المزودين</TabsTrigger>
        </TabsList>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>سجل رسائل واتساب</CardTitle>
              <CardDescription>تتبع جميع رسائل واتساب المرسلة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {logs.map((log) => (
                  <Card key={log.id} className="border border-border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span className="font-medium">{log.toPhone}</span>
                            {getStatusBadge(log.status)}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                            <div>
                              <span className="font-medium">القالب:</span> {log.templateName || 'غير محدد'}
                            </div>
                            <div>
                              <span className="font-medium">وقت الإرسال:</span>{' '}
                              {format(new Date(log.createdAt), 'dd/MM/yyyy HH:mm', { locale: ar })}
                            </div>
                            {log.providerMessageId && (
                              <div>
                                <span className="font-medium">معرف الرسالة:</span> {log.providerMessageId}
                              </div>
                            )}
                          </div>

                          {log.errorMessage && (
                            <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-md">
                              <AlertCircle className="h-4 w-4 text-red-600" />
                              <span className="text-sm text-red-700">{log.errorMessage}</span>
                            </div>
                          )}

                          {Object.keys(log.variablesJson).length > 0 && (
                            <details className="text-sm">
                              <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                                متغيرات الرسالة
                              </summary>
                              <pre className="mt-2 p-2 bg-muted rounded-md text-xs overflow-x-auto">
                                {JSON.stringify(log.variablesJson, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {logs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="mx-auto h-12 w-12 mb-4" />
                    <p>لا توجد رسائل واتساب حتى الآن</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>قوالب الرسائل</CardTitle>
              <CardDescription>قوالب رسائل واتساب المعتمدة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.map((template) => (
                  <Card key={template.id} className="border border-border">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{template.templateName}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant={template.isApproved ? 'default' : 'outline'}>
                              {template.isApproved ? 'معتمد' : 'غير معتمد'}
                            </Badge>
                            <Badge variant="outline">{template.language}</Badge>
                          </div>
                        </div>
                        
                        <div className="bg-muted p-3 rounded-md">
                          <p className="text-sm whitespace-pre-wrap">{template.bodyText}</p>
                        </div>
                        
                        {template.variables.length > 0 && (
                          <div>
                            <span className="text-sm font-medium">المتغيرات: </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {template.variables.map((variable, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {variable}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="providers">
          <Card>
            <CardHeader>
              <CardTitle>مزودين واتساب</CardTitle>
              <CardDescription>إدارة مزودين خدمة واتساب</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {providers.map((provider) => (
                  <Card key={provider.id} className="border border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{provider.name}</h3>
                          <p className="text-sm text-muted-foreground">{provider.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={provider.isEnabled}
                            onCheckedChange={() => handleProviderToggle(provider)}
                          />
                          <Badge variant={provider.isEnabled ? 'default' : 'outline'}>
                            {provider.isEnabled ? 'نشط' : 'غير نشط'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};

export default WhatsappManagement;