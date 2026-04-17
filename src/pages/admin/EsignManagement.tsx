import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NavigationSidebar from '@/components/admin/NavigationSidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { 
  FileText, 
  Send, 
  Eye, 
  Download, 
  Ban, 
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle,
  Users,
  Mail,
  Phone,
  TestTube
} from 'lucide-react';
import { 
  getAllEsignDocuments,
  sendDocumentForSigning,
  voidEsignDocument,
  createEsignDocument,
  generateSigningToken
} from '@/utils/supabaseEsignService';
import { listContracts } from '@/utils/supabaseContractService';
import { EsignDocument, EsignStatus } from '@/types/esign';
type Contract = any;
import { toast } from 'sonner';

const EsignManagement: React.FC = () => {
  const [documents, setDocuments] = useState<EsignDocument[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<EsignStatus | 'all'>('all');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('');
  const [newDocumentDialog, setNewDocumentDialog] = useState(false);

  useEffect(() => {
    loadDocuments();
    loadContracts();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const documentsData = await getAllEsignDocuments();
      setDocuments(documentsData);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('فشل في تحميل مستندات التوقيع');
    } finally {
      setLoading(false);
    }
  };

  const loadContracts = async () => {
    try {
      const contractsData = await listContracts();
      setContracts(contractsData);
    } catch (error) {
      console.error('Error loading contracts:', error);
    }
  };

  const handleSendForSigning = async (documentId: string) => {
    try {
      await sendDocumentForSigning(documentId, []);
      toast.success('تم إرسال المستند للتوقيع بنجاح');
      loadDocuments();
    } catch (error) {
      console.error('Error sending document:', error);
      toast.error('فشل في إرسال المستند للتوقيع');
    }
  };

  const handleVoidDocument = async (documentId: string, reason: string) => {
    try {
      await generateSigningToken(documentId, 'test@example.com');
      toast.success('تم إنشاء رابط التوقيع بنجاح');
      loadDocuments();
    } catch (error) {
      console.error('Error creating signing session:', error);
      toast.error('فشل في إنشاء رابط التوقيع');
    }
  };

  const handleCreateDocument = async (serviceType: string) => {
    try {
      const getServiceTitle = (type: string) => {
        const serviceNames: Record<string, string> = {
          'translation-legal': 'الترجمة القانونية',
          'translation-business': 'الترجمة التجارية',
          'translation-technical': 'الترجمة التقنية',
          'translation-medical': 'الترجمة الطبية',
          'translation-academic': 'الترجمة الأكاديمية',
          'translation-literary': 'الترجمة الأدبية',
          'translation-media': 'ترجمة الوسائط',
          'research-thesis': 'إعداد الرسائل العلمية',
          'research-plan': 'خطة البحث',
          'research-analysis': 'التحليل الإحصائي',
          'research-formatting': 'التنسيق الأكاديمي',
          'research-publication': 'النشر العلمي',
          'research-consultation': 'الاستشارات الأكاديمية',
          'custom-service': 'خدمة مخصصة'
        };
        return serviceNames[type] || 'خدمة غير محددة';
      };

      const signers = [
        {
          role: 'customer' as const,
          name: 'العميل',
          email: 'client@example.com',
          phone: '+966559600824'
        },
        {
          role: 'company' as const,
          name: 'وكالة الترجمة المتخصصة',
          email: 'admin@translation-agency.com',
          phone: '+966559600824'
        }
      ];

      await createEsignDocument(
        `contract-${Date.now()}`,
        `عقد التوقيع الإلكتروني - ${getServiceTitle(serviceType)}`,
        signers
      );

      toast.success('تم إنشاء مستند التوقيع الإلكتروني بنجاح');
      setNewDocumentDialog(false);
      setSelectedServiceType('');
      loadDocuments();
    } catch (error) {
      console.error('Error creating document:', error);
      toast.error('فشل في إنشاء مستند التوقيع الإلكتروني');
    }
  };

  const getStatusBadge = (status: EsignStatus) => {
    const statusConfig = {
      draft: { label: 'مسودة', variant: 'outline' as const, icon: FileText },
      sent: { label: 'مرسل', variant: 'secondary' as const, icon: Send },
      viewed: { label: 'تمت المشاهدة', variant: 'default' as const, icon: Eye },
      partially_signed: { label: 'موقع جزئياً', variant: 'destructive' as const, icon: Clock },
      fully_signed: { label: 'موقع بالكامل', variant: 'default' as const, icon: CheckCircle },
      void: { label: 'ملغي', variant: 'outline' as const, icon: XCircle }
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

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = !searchTerm || 
      doc.docTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.contractId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getDocumentStats = () => {
    const stats = {
      total: documents.length,
      draft: documents.filter(d => d.status === 'draft').length,
      sent: documents.filter(d => d.status === 'sent').length,
      signed: documents.filter(d => d.status === 'fully_signed').length,
      void: documents.filter(d => d.status === 'void').length,
    };
    return stats;
  };

  const stats = getDocumentStats();

  return (
    <div className="flex min-h-screen" dir="rtl">
      <NavigationSidebar />
      <div className="flex-1 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">إدارة التوقيع الإلكتروني</h1>
          <p className="text-muted-foreground">إدارة مستندات التوقيع الإلكتروني وتتبع حالة التوقيعات</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={newDocumentDialog} onOpenChange={setNewDocumentDialog}>
            <DialogTrigger asChild>
              <Button>
                <FileText className="ml-2 h-4 w-4" />
                إنشاء مستند جديد
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إنشاء مستند توقيع إلكتروني</DialogTitle>
                <DialogDescription>
                  اختر نوع الخدمة التي تريد إنشاء مستند توقيع إلكتروني لها
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">نوع الخدمة</label>
                   <select 
                    className="w-full p-2 border rounded-md mt-1"
                    value={selectedServiceType}
                    onChange={(e) => setSelectedServiceType(e.target.value)}
                  >
                    <option value="">-- اختر نوع الخدمة --</option>
                    <optgroup label="خدمات الترجمة">
                      <option value="translation-legal">الترجمة القانونية</option>
                      <option value="translation-business">الترجمة التجارية</option>
                      <option value="translation-technical">الترجمة التقنية</option>
                      <option value="translation-medical">الترجمة الطبية</option>
                      <option value="translation-academic">الترجمة الأكاديمية</option>
                      <option value="translation-literary">الترجمة الأدبية</option>
                      <option value="translation-media">ترجمة الوسائط</option>
                    </optgroup>
                    <optgroup label="خدمات البحث">
                      <option value="research-thesis">إعداد الرسائل العلمية</option>
                      <option value="research-plan">خطة البحث</option>
                      <option value="research-analysis">التحليل الإحصائي</option>
                      <option value="research-formatting">التنسيق الأكاديمي</option>
                      <option value="research-publication">النشر العلمي</option>
                      <option value="research-consultation">الاستشارات الأكاديمية</option>
                    </optgroup>
                    <optgroup label="خدمات أخرى">
                      <option value="custom-service">خدمة مخصصة</option>
                    </optgroup>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewDocumentDialog(false)}>
                  إلغاء
                </Button>
                <Button 
                  onClick={() => handleCreateDocument(selectedServiceType)}
                  disabled={!selectedServiceType}
                >
                  إنشاء المستند
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button onClick={loadDocuments} variant="outline" disabled={loading}>
            <RefreshCw className={`ml-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            تحديث
          </Button>

          <Button 
            onClick={async () => {
              try {
                const { seedEsignData } = await import('@/utils/seedEsignData');
                const result = await seedEsignData();
                if (result.success) {
                  toast.success(result.message);
                  loadDocuments();
                } else {
                  toast.error(result.message);
                }
              } catch (error) {
                toast.error('فشل في إنشاء البيانات التجريبية');
              }
            }}
            variant="outline"
            className="gap-2"
          >
            <TestTube className="h-4 w-4" />
            إنشاء بيانات تجريبية
          </Button>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المستندات</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مسودات</CardTitle>
            <FileText className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.draft}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مرسلة</CardTitle>
            <Send className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.sent}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">موقعة</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.signed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ملغية</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.void}</div>
          </CardContent>
        </Card>
      </div>

      {/* فلاتر البحث */}
      <Card>
        <CardHeader>
          <CardTitle>فلاتر البحث</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <Input
                placeholder="البحث بعنوان المستند أو رقم العقد..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <select
                className="p-2 border rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as EsignStatus | 'all')}
              >
                <option value="all">جميع الحالات</option>
                <option value="draft">مسودة</option>
                <option value="sent">مرسل</option>
                <option value="viewed">تمت المشاهدة</option>
                <option value="partially_signed">موقع جزئياً</option>
                <option value="fully_signed">موقع بالكامل</option>
                <option value="void">ملغي</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* قائمة المستندات */}
      <Card>
        <CardHeader>
          <CardTitle>مستندات التوقيع الإلكتروني</CardTitle>
          <CardDescription>إدارة ومتابعة مستندات التوقيع الإلكتروني</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="mr-3">جاري تحميل البيانات...</span>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-16 w-16 mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">لا توجد مستندات توقيع إلكتروني</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchTerm || statusFilter !== 'all' 
                  ? 'لم يتم العثور على مستندات تطابق الفلاتر المحددة. جرب تغيير مصطلح البحث أو الفلاتر.'
                  : 'لم يتم إنشاء أي مستندات توقيع إلكتروني بعد. ابدأ بإنشاء مستند جديد من العقود الموجودة.'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button onClick={() => setNewDocumentDialog(true)} className="gap-2">
                  <FileText className="h-4 w-4" />
                  إنشاء مستند جديد
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="mx-auto h-12 w-12 mb-4" />
                <p>لا توجد مستندات توقيع إلكتروني حتى الآن</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default EsignManagement;