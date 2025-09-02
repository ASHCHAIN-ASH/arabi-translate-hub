import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  User, 
  Mail, 
  Phone, 
  FileText, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Send,
  Upload,
  Clock,
  DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Service {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar?: string;
  unit_type: string;
  min_units: number;
  max_units?: number;
  base_price?: number;
  price_per_unit?: number;
  delivery_time_days: number;
  rush_delivery_available: boolean;
  service_categories?: {
    name_ar: string;
    color: string;
  };
}

interface OrderFormProps {
  selectedService?: Service;
  onSuccess?: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ selectedService, onSuccess }) => {
  const [formData, setFormData] = useState({
    service_id: selectedService?.id || '',
    client_name: '',
    client_email: '',
    client_phone: '',
    title: '',
    description: '',
    requirements: '',
    quantity: selectedService?.min_units || 1,
    rush_delivery: false,
    additional_notes: ''
  });
  
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadServices();
    if (selectedService) {
      setFormData(prev => ({
        ...prev,
        service_id: selectedService.id,
        quantity: selectedService.min_units || 1
      }));
    }
  }, [selectedService]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select(`
          id,
          name_ar,
          name_en,
          description_ar,
          unit_type,
          min_units,
          max_units,
          base_price,
          price_per_unit,
          delivery_time_days,
          rush_delivery_available,
          service_categories (
            name_ar,
            color
          )
        `)
        .eq('is_active', true)
        .eq('show_to_clients', true);

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error loading services:', error);
      toast({
        title: "خطأ في تحميل الخدمات",
        description: "حدث خطأ أثناء تحميل قائمة الخدمات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateTrackingId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'ORD-';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const calculatePrice = () => {
    const service = services.find(s => s.id === formData.service_id);
    if (!service) return 0;

    let price = 0;
    if (service.base_price) {
      price = service.base_price;
    }
    if (service.price_per_unit) {
      price += service.price_per_unit * formData.quantity;
    }
    
    if (formData.rush_delivery && service.rush_delivery_available) {
      price *= 1.5; // 50% extra for rush delivery
    }

    return price;
  };

  const calculateDeliveryTime = () => {
    const service = services.find(s => s.id === formData.service_id);
    if (!service) return 0;

    let days = service.delivery_time_days;
    if (formData.rush_delivery && service.rush_delivery_available) {
      days = Math.ceil(days / 2); // Half the time for rush delivery
    }
    return days;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.service_id || !formData.client_name || !formData.client_email || !formData.title) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى تعبئة جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      
      const trackingId = generateTrackingId();
      const service = services.find(s => s.id === formData.service_id);
      const estimatedPrice = calculatePrice();
      const deliveryTime = calculateDeliveryTime();
      
      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from('service_orders')
        .insert({
          tracking_id: trackingId,
          service_id: formData.service_id,
          client_name: formData.client_name,
          client_email: formData.client_email,
          client_phone: formData.client_phone,
          title: formData.title,
          description: formData.description,
          requirements: formData.requirements,
          quantity: formData.quantity,
          unit_type: service?.unit_type || 'page',
          estimated_price: estimatedPrice,
          rush_delivery: formData.rush_delivery,
          expected_delivery: new Date(Date.now() + (deliveryTime * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
          additional_notes: formData.additional_notes,
          current_status: 'received'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Handle file upload if any
      if (files && files.length > 0) {
        const filePromises = Array.from(files).map(async (file) => {
          const fileName = `${orderData.id}/${Date.now()}_${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from('order-files')
            .upload(fileName, file);
          
          if (uploadError) {
            console.error('File upload error:', uploadError);
            return null;
          }
          
          return fileName;
        });
        
        await Promise.all(filePromises);
      }

      // Create initial timeline entry
      await supabase
        .from('service_order_timeline')
        .insert({
          order_id: orderData.id,
          title: 'تم استلام الطلب',
          description: 'تم استلام طلبكم بنجاح وسيتم مراجعته قريباً',
          status: 'received',
          actor_type: 'system',
          actor_name: 'النظام',
          completed_date: new Date().toISOString().split('T')[0]
        });

      toast({
        title: "تم إرسال الطلب بنجاح! 🎉",
        description: `رقم التتبع: ${trackingId}. سيتم التواصل معك قريباً.`,
      });

      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/order-tracking', { state: { trackingId } });
      }

      // Reset form
      setFormData({
        service_id: '',
        client_name: '',
        client_email: '',
        client_phone: '',
        title: '',
        description: '',
        requirements: '',
        quantity: 1,
        rush_delivery: false,
        additional_notes: ''
      });
      setFiles(null);

    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        title: "خطأ في إرسال الطلب",
        description: "حدث خطأ أثناء إرسال طلبك، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedServiceData = services.find(s => s.id === formData.service_id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            نموذج طلب خدمة
          </CardTitle>
          <CardDescription className="text-lg">
            املأ النموذج أدناه لطلب الخدمة المناسبة لاحتياجاتك
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Service Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                اختيار الخدمة *
              </label>
              <Select 
                value={formData.service_id} 
                onValueChange={(value) => handleInputChange('service_id', value)}
                disabled={!!selectedService}
              >
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="اختر الخدمة المطلوبة" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      <div className="text-right w-full">
                        <div className="font-medium">{service.name_ar}</div>
                        <div className="text-sm text-muted-foreground">{service.description_ar?.slice(0, 50)}...</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedServiceData && (
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge 
                      style={{ backgroundColor: selectedServiceData.service_categories?.color }}
                      className="text-white"
                    >
                      {selectedServiceData.service_categories?.name_ar}
                    </Badge>
                    <span className="font-medium">{selectedServiceData.name_ar}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedServiceData.description_ar}</p>
                </div>
              )}
            </div>

            {/* Client Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  الاسم الكامل *
                </label>
                <Input
                  placeholder="أدخل اسمك الكامل"
                  value={formData.client_name}
                  onChange={(e) => handleInputChange('client_name', e.target.value)}
                  className="text-right"
                  required
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  البريد الإلكتروني *
                </label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.client_email}
                  onChange={(e) => handleInputChange('client_email', e.target.value)}
                  className="text-right"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                رقم الهاتف
              </label>
              <Input
                placeholder="05xxxxxxxx"
                value={formData.client_phone}
                onChange={(e) => handleInputChange('client_phone', e.target.value)}
                className="text-right"
              />
            </div>

            {/* Project Details */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                عنوان المشروع *
              </label>
              <Input
                placeholder="أدخل عنوان مشروعك أو الخدمة المطلوبة"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="text-right"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">وصف تفصيلي للمشروع</label>
              <Textarea
                placeholder="اشرح تفاصيل مشروعك والنتائج المتوقعة..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="text-right min-h-[120px]"
                rows={5}
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">المتطلبات والمواصفات</label>
              <Textarea
                placeholder="اذكر أي متطلبات خاصة أو مواصفات تقنية..."
                value={formData.requirements}
                onChange={(e) => handleInputChange('requirements', e.target.value)}
                className="text-right min-h-[100px]"
                rows={4}
              />
            </div>

            {/* Quantity and Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  الكمية ({selectedServiceData?.unit_type || 'صفحة'})
                </label>
                <Input
                  type="number"
                  min={selectedServiceData?.min_units || 1}
                  max={selectedServiceData?.max_units || 999}
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                  className="text-right"
                />
              </div>

              {selectedServiceData?.rush_delivery_available && (
                <div className="space-y-3">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    التسليم العاجل
                  </label>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="checkbox"
                      id="rush_delivery"
                      checked={formData.rush_delivery}
                      onChange={(e) => handleInputChange('rush_delivery', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="rush_delivery" className="text-sm">
                      تسليم عاجل (+50% من السعر)
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* File Upload */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <Upload className="w-4 h-4 text-primary" />
                رفع ملفات (اختياري)
              </label>
              <Input
                type="file"
                multiple
                onChange={(e) => setFiles(e.target.files)}
                className="text-right"
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              />
              <p className="text-xs text-muted-foreground">
                يمكن رفع ملفات: PDF, Word, نصوص، صور (حد أقصى 10 ميجابايت للملف الواحد)
              </p>
            </div>

            {/* Additional Notes */}
            <div className="space-y-3">
              <label className="text-sm font-medium">ملاحظات إضافية</label>
              <Textarea
                placeholder="أي ملاحظات أو طلبات خاصة..."
                value={formData.additional_notes}
                onChange={(e) => handleInputChange('additional_notes', e.target.value)}
                className="text-right"
                rows={3}
              />
            </div>

            {/* Price Estimate */}
            {selectedServiceData && formData.quantity > 0 && (
              <motion.div 
                className="bg-primary/5 border border-primary/20 rounded-lg p-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  ملخص الطلب
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>الخدمة:</span>
                    <span className="font-medium">{selectedServiceData.name_ar}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>الكمية:</span>
                    <span>{formData.quantity} {selectedServiceData.unit_type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>مدة التسليم:</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {calculateDeliveryTime()} يوم
                    </span>
                  </div>
                  {calculatePrice() > 0 && (
                    <div className="border-t pt-2 flex justify-between items-center text-lg font-bold">
                      <span>السعر المتوقع:</span>
                      <span className="text-primary">{calculatePrice().toLocaleString()} ر.س</span>
                    </div>
                  )}
                  {formData.rush_delivery && (
                    <p className="text-sm text-amber-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      تم إضافة 50% للتسليم العاجل
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              size="lg" 
              className="w-full py-4 text-lg font-medium"
              disabled={submitting || loading}
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 ml-2" />
                  إرسال الطلب
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OrderForm;