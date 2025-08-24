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
  createEsignDocument
} from '@/utils/supabaseEsignService';
import { getAllContracts } from '@/utils/supabaseContractService';
import { EsignDocument, EsignStatus } from '@/types/esign';
import { Contract } from '@/types/contract';
import { toast } from 'sonner';

const EsignManagement: React.FC = () => {
  const [documents, setDocuments] = useState<EsignDocument[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<EsignStatus | 'all'>('all');
  const [selectedContract, setSelectedContract] = useState<string>('');
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
      const contractsData = await getAllContracts();
      setContracts(contractsData);
    } catch (error) {
      console.error('Error loading contracts:', error);
    }
  };

  const handleSendForSigning = async (documentId: string) => {
    try {
      await sendDocumentForSigning(documentId);
      toast.success('تم إرسال المستند للتوقيع بنجاح');
      loadDocuments();
    } catch (error) {
      console.error('Error sending document:', error);
      toast.error('فشل في إرسال المستند للتوقيع');
    }
  };

  const handleVoidDocument = async (documentId: string, reason: string) => {
    try {
      await voidEsignDocument(documentId, reason);
      toast.success('تم إبطال المستند بنجاح');
      loadDocuments();
    } catch (error) {
      console.error('Error voiding document:', error);
      toast.error('فشل في إبطال المستند');
    }
  };

  const handleCreateDocument = async (contractId: string) => {
    try {
      const contract = contracts.find(c => c.id === contractId);
      if (!contract) return;

      const signers = [
        {
          role: 'customer' as const,
          name: contract.clientName,
          email: contract.clientEmail,
          phone: contract.clientPhone,
          order: 1
        },
        {
          role: 'company' as const,
          name: 'وكالة الترجمة المتخصصة',
          email: 'admin@translation-agency.com',
          phone: '+966500000000',
          order: 2
        }
      ];

      await createEsignDocument(
        contractId,
        `عقد التوقيع الإلكتروني - ${contract.serviceDetails.title}`,
        signers
      );

      toast.success('تم إنشاء مستند التوقيع الإلكتروني بنجاح');
      setNewDocumentDialog(false);
      setSelectedContract('');
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
                  اختر العقد الذي تريد إنشاء مستند توقيع إلكتروني له
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">اختر العقد</label>
                  <select 
                    className="w-full p-2 border rounded-md mt-1"
                    value={selectedContract}
                    onChange={(e) => setSelectedContract(e.target.value)}
                  >
                    <option value="">-- اختر العقد --</option>
                    {contracts.map(contract => (
                      <option key={contract.id} value={contract.id}>
                        {contract.serviceDetails.title} - {contract.clientName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewDocumentDialog(false)}>
                  إلغاء
                </Button>
                <Button 
                  onClick={() => handleCreateDocument(selectedContract)}
                  disabled={!selectedContract}
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
              // إنشاء بيانات تجريبية للاختبار
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
              {filteredDocuments.map((document) => (
              <Card key={document.id} className="border border-border">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{document.docTitle}</h3>
                        {getStatusBadge(document.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">رقم العقد:</span> {document.contractId}
                        </div>
                        <div>
                          <span className="font-medium">تاريخ الإنشاء:</span>{' '}
                          {format(new Date(document.createdAt), 'dd/MM/yyyy HH:mm', { locale: ar })}
                        </div>
                        <div>
                          <span className="font-medium">آخر تحديث:</span>{' '}
                          {format(new Date(document.updatedAt), 'dd/MM/yyyy HH:mm', { locale: ar })}
                        </div>
                      </div>

                      {/* الموقعون */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">الموقعون:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {document.signers.map((signer) => (
                            <div key={signer.id} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                              <Users className="h-4 w-4" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{signer.signerName}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {signer.role === 'customer' ? 'عميل' : 'الشركة'}
                                  </Badge>
                                  {signer.signedAt && (
                                    <Badge variant="default" className="text-xs">
                                      <CheckCircle className="h-3 w-3 ml-1" />
                                      موقع
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {signer.signerEmail}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {document.status === 'draft' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleSendForSigning(document.id)}
                          className="gap-1"
                        >
                          <Send className="h-4 w-4" />
                          إرسال للتوقيع
                        </Button>
                      )}

                      {document.status === 'fully_signed' && (
                        <Button size="sm" variant="outline" className="gap-1">
                          <Download className="h-4 w-4" />
                          تحميل PDF
                        </Button>
                      )}

                      {document.status !== 'void' && document.status !== 'fully_signed' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="gap-1 text-red-600 border-red-200 hover:bg-red-50">
                              <Ban className="h-4 w-4" />
                              إبطال
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>إبطال المستند</AlertDialogTitle>
                              <AlertDialogDescription>
                                هل أنت متأكد من إبطال هذا المستند؟ هذا الإجراء لا يمكن التراجع عنه.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>إلغاء</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleVoidDocument(document.id, 'تم الإبطال من لوحة الإدارة')}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                إبطال المستند
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          )}

            {/* رسالة عدم وجود نتائج للبحث */}
            {!loading && filteredDocuments.length === 0 && (searchTerm || statusFilter !== 'all') && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="mx-auto h-12 w-12 mb-4" />
                <p>لا توجد مستندات تطابق البحث المحدد</p>
                <p className="text-sm">جرب تغيير مصطلح البحث أو الفلاتر</p>
              </div>
            )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default EsignManagement;