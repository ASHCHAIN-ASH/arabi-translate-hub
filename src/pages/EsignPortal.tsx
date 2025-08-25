import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { 
  FileText, 
  Pen, 
  CheckCircle, 
  AlertCircle, 
  Users,
  Clock,
  Shield,
  Phone,
  Mail
} from 'lucide-react';
import { 
  validateSigningToken,
  signDocument,
  logEsignEvent 
} from '@/utils/supabaseEsignService';
import { SigningSession, SignatureData } from '@/types/esign';
import { toast } from 'sonner';

const EsignPortal: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<SigningSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [signature, setSignature] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [comments, setComments] = useState('');
  const [showSigningForm, setShowSigningForm] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (token) {
      validateToken();
    }
  }, [token]);

  const validateToken = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const sessionData = await validateSigningToken(token);
      
      if (!sessionData) {
        toast.error('رابط التوقيع غير صالح أو منتهي الصلاحية');
        return;
      }

      setSession(sessionData);
      
      // تسجيل حدث المشاهدة
      await logEsignEvent({
        documentId: sessionData.document.id,
        eventType: 'viewed',
        signerName: sessionData.signer.signerName
      });
    } catch (error) {
      console.error('Error validating token:', error);
      toast.error('خطأ في التحقق من رابط التوقيع');
    } finally {
      setLoading(false);
    }
  };

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // إعداد الكانفاس
    canvas.width = 400;
    canvas.height = 200;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    initializeCanvas();
    setSignature('');
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const signatureDataUrl = canvas.toDataURL();
    setSignature(signatureDataUrl);
  };

  const handleSign = async () => {
    if (!session || !signature) {
      toast.error('يرجى إضافة التوقيع أولاً');
      return;
    }

    setSigning(true);
    try {
      const signatureData: SignatureData = {
        signatureImage: signature,
        timestamp: new Date().toISOString(),
        ipAddress: '127.0.0.1', // في التطبيق الحقيقي، سيتم الحصول على IP الحقيقي
        userAgent: navigator.userAgent,
        otpVerified: !!otpCode
      };

      await signDocument(token!, signatureData);
      
      toast.success('تم توقيع المستند بنجاح! شكراً لك.');
      
      // انتظار ثواني قليلة ثم إعادة توجيه
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      console.error('Error signing document:', error);
      toast.error('فشل في توقيع المستند. يرجى المحاولة مرة أخرى.');
    } finally {
      setSigning(false);
    }
  };

  useEffect(() => {
    if (showSigningForm) {
      // تأخير قصير للتأكد من أن الكانفاس موجود في DOM
      setTimeout(initializeCanvas, 100);
    }
  }, [showSigningForm]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30" dir="rtl">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>جاري التحقق من رابط التوقيع...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30" dir="rtl">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 mb-4 text-red-500" />
            <h2 className="text-xl font-semibold mb-2">رابط غير صالح</h2>
            <p className="text-muted-foreground mb-4">
              رابط التوقيع غير صالح أو منتهي الصلاحية
            </p>
            <Button onClick={() => navigate('/')}>
              العودة للرئيسية
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // إذا كان المستند موقع بالفعل
  if (session.signer.signedAt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30" dir="rtl">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="mx-auto h-12 w-12 mb-4 text-green-500" />
            <h2 className="text-xl font-semibold mb-2">تم التوقيع بنجاح</h2>
            <p className="text-muted-foreground mb-4">
              لقد قمت بتوقيع هذا المستند بالفعل في {format(new Date(session.signer.signedAt), 'dd/MM/yyyy HH:mm', { locale: ar })}
            </p>
            <Button onClick={() => navigate('/')}>
              العودة للرئيسية
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8" dir="rtl">
      <div className="container mx-auto max-w-4xl space-y-6">
        {/* رأس الصفحة */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">توقيع إلكتروني آمن</CardTitle>
            <CardDescription>
              يرجى مراجعة المستند وإضافة توقيعك الإلكتروني
            </CardDescription>
          </CardHeader>
        </Card>

        {/* معلومات المستند */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              معلومات المستند
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">عنوان المستند</label>
                <p className="font-semibold">{session.document.docTitle}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">رقم العقد</label>
                <p className="font-semibold">{session.document.contractId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">تاريخ الإنشاء</label>
                <p>{format(new Date(session.document.createdAt), 'dd/MM/yyyy', { locale: ar })}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">صالح حتى</label>
                <p className="text-red-600">
                  {format(new Date(session.expiresAt), 'dd/MM/yyyy HH:mm', { locale: ar })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* معلومات الموقع */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              معلومات الموقع
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="space-y-1">
                <p className="font-semibold">{session.signer.signerName}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {session.signer.signerEmail}
                  </div>
                  {session.signer.signerPhone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {session.signer.signerPhone}
                    </div>
                  )}
                </div>
              </div>
              <Badge variant="outline">
                {session.signer.role === 'customer' ? 'عميل' : 'الشركة'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* نموذج التوقيع */}
        {!showSigningForm ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Pen className="mx-auto h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">جاهز للتوقيع؟</h3>
              <p className="text-muted-foreground mb-6">
                بالنقر على "بدء التوقيع"، فإنك توافق على محتويات هذا المستند
              </p>
              <Button 
                onClick={() => setShowSigningForm(true)}
                size="lg"
                className="gap-2"
              >
                <Pen className="h-5 w-5" />
                بدء التوقيع
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>إضافة التوقيع</CardTitle>
              <CardDescription>
                يرجى رسم توقيعك في المربع أدناه
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* منطقة التوقيع */}
              <div className="space-y-4">
                <label className="text-sm font-medium">التوقيع الإلكتروني *</label>
                <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-4 text-center">
                  <canvas
                    ref={canvasRef}
                    className="border border-border rounded-md cursor-crosshair mx-auto"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                  <div className="mt-4 space-x-2 space-x-reverse">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={clearSignature}
                      type="button"
                    >
                      مسح
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={saveSignature}
                      type="button"
                    >
                      حفظ التوقيع
                    </Button>
                  </div>
                </div>
              </div>

              {/* كود التحقق (اختياري) */}
              <div>
                <label className="text-sm font-medium">كود التحقق (اختياري)</label>
                <Input
                  type="text"
                  placeholder="أدخل كود التحقق إذا تم إرساله إليك"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                />
              </div>

              {/* تعليقات */}
              <div>
                <label className="text-sm font-medium">تعليقات (اختياري)</label>
                <Textarea
                  placeholder="أي تعليقات أو ملاحظات..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={3}
                />
              </div>

              {/* تنبيه قانوني */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  بإضافة توقيعك الإلكتروني، فإنك تؤكد موافقتك على جميع شروط وأحكام هذا المستند.
                  التوقيع الإلكتروني له نفس القوة القانونية للتوقيع اليدوي.
                </AlertDescription>
              </Alert>

              {/* أزرار العمل */}
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={() => setShowSigningForm(false)}
                  variant="outline"
                  className="flex-1"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={handleSign}
                  disabled={!signature || signing}
                  className="flex-1 gap-2"
                >
                  {signing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      جاري التوقيع...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      توقيع المستند
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EsignPortal;