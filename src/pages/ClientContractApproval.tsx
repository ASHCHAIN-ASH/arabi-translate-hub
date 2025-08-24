import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  FileText, 
  Calendar, 
  DollarSign, 
  User, 
  Phone, 
  Mail,
  CheckCircle,
  AlertCircle,
  Download,
  Signature,
  Shield
} from 'lucide-react';
import { Contract, ClientApproval } from '@/types/contract';
import { getContractById, saveClientApproval } from '@/utils/supabaseContractService';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ClientContractApproval = () => {
  const [searchParams] = useSearchParams();
  const contractId = searchParams.get('id');
  
  const [contract, setContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  
  // بيانات الموافقة
  const [clientName, setClientName] = useState('');
  const [signature, setSignature] = useState('');
  const [comments, setComments] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState<string[]>([]);
  const [finalAcceptance, setFinalAcceptance] = useState(false);

  useEffect(() => {
    if (contractId) {
      loadContract();
    }
  }, [contractId]);

  const loadContract = async () => {
    if (!contractId) return;
    
    try {
      setIsLoading(true);
      const contractData = await getContractById(contractId);
      
      if (contractData) {
        setContract(contractData);
        setClientName(contractData.clientName);
        
        // التحقق من حالة العقد
        if (contractData.status === 'approved' || contractData.status === 'signed') {
          setIsApproved(true);
        }
      } else {
        toast.error('لم يتم العثور على العقد');
      }
    } catch (error) {
      console.error('Error loading contract:', error);
      toast.error('خطأ في تحميل العقد');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTermAcceptance = (termId: string, accepted: boolean) => {
    if (accepted) {
      setAcceptedTerms(prev => [...prev.filter(id => id !== termId), termId]);
    } else {
      setAcceptedTerms(prev => prev.filter(id => id !== termId));
    }
  };

  const handleSubmitApproval = async () => {
    if (!contract) return;

    // التحقق من صحة البيانات
    if (!clientName.trim()) {
      toast.error('يجب إدخال الاسم الكامل');
      return;
    }

    if (!signature.trim()) {
      toast.error('يجب كتابة التوقيع الرقمي');
      return;
    }

    if (acceptedTerms.length !== contract.terms.filter(t => t.required).length) {
      toast.error('يجب الموافقة على جميع الشروط المطلوبة');
      return;
    }

    if (!finalAcceptance) {
      toast.error('يجب الموافقة النهائية على العقد');
      return;
    }

    try {
      setIsSubmitting(true);

      const approval: ClientApproval = {
        contractId: contract.id,
        clientName: clientName,
        approvalDate: new Date().toISOString(),
        ipAddress: await getClientIP(),
        userAgent: navigator.userAgent,
        signature: signature,
        comments: comments
      };

      await saveClientApproval(approval);
      
      toast.success('تم حفظ موافقتك بنجاح!', {
        description: 'سيتم التواصل معك قريباً لبدء تنفيذ المشروع'
      });
      
      setIsApproved(true);
      
    } catch (error) {
      console.error('Error saving approval:', error);
      toast.error('خطأ في حفظ الموافقة، يرجى المحاولة مرة أخرى');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return 'unknown';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 mt-20">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>جاري تحميل العقد...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 mt-20">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-12">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
              <h2 className="text-xl font-semibold mb-2">عقد غير موجود</h2>
              <p className="text-muted-foreground">لم يتم العثور على العقد المطلوب</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (isApproved) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 mt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <Card>
              <CardContent className="py-12">
                <CheckCircle className="h-16 w-16 mx-auto mb-6 text-green-600" />
                <h1 className="text-3xl font-bold mb-4 text-green-600">تمت الموافقة بنجاح!</h1>
                <p className="text-lg text-muted-foreground mb-6">
                  شكراً لك على موافقتك على العقد. سيتم التواصل معك قريباً لبدء تنفيذ المشروع.
                </p>
                <div className="bg-muted p-4 rounded-lg mb-6">
                  <p className="text-sm"><strong>رقم العقد:</strong> {contract.id}</p>
                  <p className="text-sm"><strong>تاريخ الموافقة:</strong> {formatDate(new Date().toISOString())}</p>
                </div>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  تحميل نسخة من العقد
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              موافقة على <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">العقد</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              يرجى مراجعة تفاصيل العقد والموافقة عليه لبدء تنفيذ المشروع
            </p>
          </div>

          {/* Contract Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                تفاصيل العقد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">العميل:</span>
                    <span>{contract.clientName}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">البريد:</span>
                    <span>{contract.clientEmail}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">الهاتف:</span>
                    <span>{contract.clientPhone}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">التكلفة:</span>
                    <span className="font-bold text-primary">{contract.totalAmount.toLocaleString()} ريال</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">تاريخ التسليم:</span>
                    <span>{contract.deliveryDate}</span>
                  </div>
                  
                  <Badge variant="outline" className="w-fit">
                    {contract.serviceDetails.title}
                  </Badge>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Service Details */}
              <div>
                <h3 className="text-lg font-semibold mb-3">وصف الخدمة</h3>
                <p className="text-muted-foreground mb-4">{contract.serviceDetails.description}</p>
                
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">المواصفات:</h4>
                  <ul className="text-sm space-y-1">
                    {Object.entries(contract.serviceDetails.specifications).map(([key, value]) => (
                      <li key={key}>
                        <strong>{key}:</strong> {String(value)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contract Content */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>محتوى العقد</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-6 rounded-lg max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                  {contract.contractContent}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Terms Acceptance */}
          {contract.terms.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  الشروط والأحكام
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contract.terms.map((term) => (
                    <div key={term.id} className="flex items-start space-x-3 space-x-reverse">
                      <Checkbox
                        id={term.id}
                        checked={acceptedTerms.includes(term.id)}
                        onCheckedChange={(checked) => handleTermAcceptance(term.id, !!checked)}
                        required={term.required}
                      />
                      <div className="flex-1">
                        <Label 
                          htmlFor={term.id} 
                          className={`font-medium ${term.required ? 'text-red-600' : ''}`}
                        >
                          {term.title} {term.required && '*'}
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {term.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Approval Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Signature className="h-5 w-5" />
                الموافقة والتوقيع
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="clientName">الاسم الكامل *</Label>
                <Input
                  id="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="أدخل اسمك الكامل كما هو في الهوية"
                  required
                />
              </div>

              <div>
                <Label htmlFor="signature">التوقيع الرقمي *</Label>
                <Input
                  id="signature"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="اكتب اسمك كتوقيع رقمي"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  بكتابة اسمك هنا، فإنك توافق على أن هذا بمثابة توقيعك الرقمي على العقد
                </p>
              </div>

              <div>
                <Label htmlFor="comments">تعليقات إضافية (اختياري)</Label>
                <Textarea
                  id="comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="أي ملاحظات أو استفسارات إضافية"
                  rows={3}
                />
              </div>

              <div className="flex items-start space-x-3 space-x-reverse">
                <Checkbox
                  id="finalAcceptance"
                  checked={finalAcceptance}
                  onCheckedChange={(checked) => setFinalAcceptance(!!checked)}
                  required
                />
                <Label htmlFor="finalAcceptance" className="text-sm font-medium">
                  أوافق على جميع بنود العقد المذكورة أعلاه وأتعهد بالالتزام بها. 
                  أؤكد أنني قرأت العقد بالكامل وفهمت جميع الشروط والأحكام. *
                </Label>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>ملاحظة مهمة:</strong> بالموافقة على هذا العقد، فإنك تتعهد بالالتزام بجميع الشروط المذكورة. 
                  سيتم حفظ موافقتك مع معلومات التوقيع الرقمي وتاريخ الموافقة لأغراض التوثيق القانوني.
                </p>
              </div>

              <Button 
                onClick={handleSubmitApproval}
                disabled={isSubmitting || !finalAcceptance || !clientName.trim() || !signature.trim()}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    أوافق على العقد وأوقعه رقمياً
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ClientContractApproval;