import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClientLayout from '@/components/client/ClientLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  X, 
  FileText, 
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const OrderEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock order data
  const [orderData, setOrderData] = useState({
    title: 'مراجعة لغوية وتدوية متخصصة للنص الأكاديمي مع تحسين الأسلوب',
    service: 'statistical_analysis',
    priority: 'medium',
    deadline: '2024-01-30',
    description: 'تحليل إحصائي شامل للبيانات البحثية باستخدام R و SPSS',
    specialRequirements: 'يرجى التركيز على التحليل الوصفي والاستنتاجي',
    budget: 899
  });

  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const services = [
    { value: 'statistical_analysis', label: 'مساعدة في التحليل الإحصائي' },
    { value: 'language_review', label: 'مراجعة وتدقيق لغوي' },
    { value: 'research_plan', label: 'إعداد خطة البحث' },
    { value: 'thesis_assistance', label: 'مساعدة أكاديمية في الأطروحة' },
    { value: 'data_analysis', label: 'تحليل ومناقشة البيانات' }
  ];

  const priorities = [
    { value: 'low', label: 'منخفضة', color: 'bg-blue-100 text-blue-700' },
    { value: 'medium', label: 'متوسطة', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'high', label: 'عالية', color: 'bg-red-100 text-red-700' }
  ];

  const handleInputChange = (field: string, value: string | number) => {
    setOrderData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setNewFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "تم حفظ التعديلات بنجاح",
        description: "تم تحديث بيانات الطلب بنجاح",
        action: (
          <CheckCircle2 className="w-4 h-4 text-green-600" />
        ),
      });
      
      navigate(`/orders/${id}`);
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "لم يتم حفظ التعديلات، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPriority = priorities.find(p => p.value === orderData.priority);

  return (
    <ClientLayout>
      <div className="space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(`/orders/${id}`)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              العودة
            </Button>
            <div className="text-right">
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                تعديل الطلب #{id}
              </h1>
              <p className="text-muted-foreground">قم بتعديل تفاصيل الطلب حسب احتياجاتك</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/orders/${id}`)}
            >
              إلغاء
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              حفظ التعديلات
            </Button>
          </div>
        </div>

        {/* Warning Notice */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3 text-right">
              <div>
                <h4 className="font-medium text-yellow-800 mb-1">تنبيه مهم</h4>
                <p className="text-sm text-yellow-700">
                  بعض التعديلات قد تؤثر على الجدول الزمني أو تكلفة المشروع. سيتم مراجعة التغييرات من قبل فريقنا وإشعارك بأي تحديثات.
                </p>
              </div>
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Summary Sidebar */}
          <Card className="h-fit order-1 lg:order-2">
            <CardHeader>
              <CardTitle className="text-right">ملخص الطلب</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-right">
              <div className="space-y-3">
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-sm font-medium">
                    {services.find(s => s.value === orderData.service)?.label}
                  </span>
                  <span className="text-sm text-muted-foreground">:الخدمة</span>
                </div>

                <div className="flex items-center gap-2 justify-end">
                  {selectedPriority && (
                    <Badge className={selectedPriority.color}>
                      {selectedPriority.label}
                    </Badge>
                  )}
                  <span className="text-sm text-muted-foreground">:الأولوية</span>
                </div>

                <div className="flex items-center gap-2 justify-end">
                  <span className="text-sm">{orderData.deadline}</span>
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </div>

                <div className="flex items-center gap-2 justify-end">
                  <span className="text-sm font-bold text-primary">
                    {orderData.budget} ريال
                  </span>
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              <Separator />

              <div className="space-y-2 text-right">
                <h4 className="font-medium text-sm">ملفات جديدة</h4>
                <p className="text-xs text-muted-foreground">
                  {newFiles.length} ملف محدد
                </p>
              </div>

              <Button 
                onClick={handleSave}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4 ml-2" />
                    حفظ التعديلات
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">المعلومات الأساسية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2 text-right">
                  <Label htmlFor="title">عنوان المشروع</Label>
                  <Input
                    id="title"
                    value={orderData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="text-right"
                    dir="rtl"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 text-right">
                    <Label htmlFor="service">نوع الخدمة</Label>
                    <Select value={orderData.service} onValueChange={(value) => handleInputChange('service', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.value} value={service.value}>
                            {service.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 text-right">
                    <Label htmlFor="priority">الأولوية</Label>
                    <Select value={orderData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem key={priority.value} value={priority.value}>
                            <div className="flex items-center gap-2">
                              <span>{priority.label}</span>
                              <div className={`w-3 h-3 rounded-full ${priority.color}`} />
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 text-right">
                    <Label htmlFor="deadline">الموعد النهائي</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={orderData.deadline}
                      onChange={(e) => handleInputChange('deadline', e.target.value)}
                      dir="rtl"
                    />
                  </div>

                  <div className="space-y-2 text-right">
                    <Label htmlFor="budget">الميزانية (ريال سعودي)</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={orderData.budget}
                      onChange={(e) => handleInputChange('budget', Number(e.target.value))}
                      className="text-right"
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="space-y-2 text-right">
                  <Label htmlFor="description">وصف المشروع</Label>
                  <Textarea
                    id="description"
                    value={orderData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="min-h-[100px] text-right"
                    placeholder="اكتب وصفاً مفصلاً عن المشروع..."
                    dir="rtl"
                  />
                </div>

                <div className="space-y-2 text-right">
                  <Label htmlFor="requirements">متطلبات خاصة</Label>
                  <Textarea
                    id="requirements"
                    value={orderData.specialRequirements}
                    onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                    className="min-h-[80px] text-right"
                    placeholder="أي متطلبات أو ملاحظات خاصة..."
                    dir="rtl"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Files Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-right">الملفات الإضافية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">
                    اسحب الملفات هنا أو اضغط لتحديد ملفات
                  </p>
                  <Input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button variant="outline" asChild>
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      اختر ملفات
                    </Label>
                  </Button>
                </div>

                {newFiles.length > 0 && (
                  <div className="space-y-3 text-right">
                    <h4 className="font-medium">الملفات المحددة</h4>
                    {newFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg" dir="rtl">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        <div className="flex items-center gap-3 text-right">
                          <div>
                            <p className="font-medium text-sm">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default OrderEdit;