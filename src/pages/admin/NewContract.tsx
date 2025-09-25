import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Calculator, Save, Send } from 'lucide-react';
import { toast } from 'sonner';

interface ContractType {
  id: string;
  name_ar: string;
}

interface Client {
  id: string;
  full_name: string;
}

interface ContractTemplate {
  id: string;
  title: string;
  variables: any;
}

const NewContract = () => {
  const [contractTypes, setContractTypes] = useState<ContractType[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [contractNumber, setContractNumber] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    client_id: '',
    service_type: '',
    service_description: '',
    service_price: 0,
    currency: 'SAR',
    client_type: 'business',
    payment_terms: 'دفعة واحدة',
    contract_duration: '30 يوم'
  });

  const [calculations, setCalculations] = useState({
    subtotal: 0,
    vat_amount: 0,
    total_amount: 0
  });

  useEffect(() => {
    loadInitialData();
    generateContractNumber();
  }, []);

  const loadInitialData = async () => {
    try {
      // تحميل العملاء
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('id, display_name')
        .order('created_at', { ascending: false });

      if (clientsError) throw clientsError;
      const formattedClients = clientsData?.map(client => ({
        id: client.id,
        full_name: client.display_name || 'غير محدد'
      })) || [];
      setClients(formattedClients);

    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('خطأ في تحميل البيانات');
    }
  };

  const generateContractNumber = async () => {
    try {
      const { data, error } = await supabase.rpc('next_contract_number');
      if (error) throw error;
      setContractNumber(data || `MUP-${new Date().getFullYear()}-0001`);
    } catch (error) {
      console.error('Error generating contract number:', error);
      setContractNumber(`MUP-${new Date().getFullYear()}-0001`);
    }
  };

  const calculateTotals = () => {
    try {
      const price = Number(formData.service_price || 0);
      const vatPercent = 15; // ضريبة ثابتة
      const vatAmount = +(price * vatPercent / 100).toFixed(2);
      const totalAmount = +(price + vatAmount).toFixed(2);

      setCalculations({
        subtotal: price,
        vat_amount: vatAmount,
        total_amount: totalAmount
      });

      toast.success('تم حساب الإجمالي');
    } catch (error) {
      toast.error('خطأ في حساب الإجمالي');
    }
  };

  const handleSave = async (sendAfterSave = false) => {
    if (!formData.client_id || !formData.service_type) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setLoading(true);
      
      const contractData = {
        contract_number: contractNumber,
        client_name: clients.find(c => c.id === formData.client_id)?.full_name || '',
        client_email: 'temp@example.com', // يجب إضافة حقل البريد الإلكتروني للعميل
        client_phone: '000000000', // يجب إضافة حقل الهاتف للعميل
        client_type: formData.client_type,
        service_type: formData.service_type,
        service_description: formData.service_description,
        service_price: calculations.total_amount,
        currency: formData.currency,
        payment_terms: formData.payment_terms,
        contract_duration: formData.contract_duration,
        status: 'draft',
        user_id: 'temp-user-id' // يجب ربطه بالمستخدم الحالي
      };

      const { data, error } = await supabase
        .from('contracts')
        .insert([contractData])
        .select()
        .single();

      if (error) throw error;

      toast.success('تم حفظ العقد بنجاح');

      if (sendAfterSave) {
        // هنا يمكن إضافة منطق إرسال العقد
        toast.success('سيتم إرسال العقد قريباً');
      }

      navigate('/adminmaster/contracts');
    } catch (error) {
      console.error('Error saving contract:', error);
      toast.error('خطأ في حفظ العقد');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/adminmaster/contracts')}
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-bold">إنشاء عقد جديد</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* الحقول الأساسية */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>بيانات العقد الأساسية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="contract_no">رقم العقد</Label>
                <Input
                  id="contract_no"
                  value={contractNumber}
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <div>
                <Label htmlFor="client_id">العميل *</Label>
                <Select value={formData.client_id} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, client_id: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر العميل" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="service_type">نوع الخدمة *</Label>
                <Input
                  id="service_type"
                  value={formData.service_type}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    service_type: e.target.value 
                  }))}
                  placeholder="أدخل نوع الخدمة"
                />
              </div>

              <div>
                <Label htmlFor="service_description">وصف الخدمة</Label>
                <Textarea
                  id="service_description"
                  value={formData.service_description}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    service_description: e.target.value 
                  }))}
                  placeholder="أدخل وصف مفصل للخدمة"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="service_price">سعر الخدمة (قبل الضريبة)</Label>
                  <Input
                    id="service_price"
                    type="number"
                    value={formData.service_price}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      service_price: Number(e.target.value) 
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="currency">العملة</Label>
                  <Input
                    id="currency"
                    value={formData.currency}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      currency: e.target.value 
                    }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client_type">نوع العميل</Label>
                  <Select value={formData.client_type} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, client_type: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business">شركة</SelectItem>
                      <SelectItem value="individual">فرد</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="contract_duration">مدة العقد</Label>
                  <Input
                    id="contract_duration"
                    value={formData.contract_duration}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      contract_duration: e.target.value 
                    }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="payment_terms">شروط الدفع</Label>
                <Input
                  id="payment_terms"
                  value={formData.payment_terms}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    payment_terms: e.target.value 
                  }))}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* الحاسبة والإجراءات */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>حساب الإجمالي</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={calculateTotals}
                className="w-full"
                variant="outline"
              >
                <Calculator className="w-4 h-4 ml-2" />
                حساب الإجمالي
              </Button>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>قبل الضريبة:</span>
                  <span>{calculations.subtotal.toLocaleString()} {formData.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span>الضريبة (15%):</span>
                  <span>{calculations.vat_amount.toLocaleString()} {formData.currency}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>الإجمالي:</span>
                  <span>{calculations.total_amount.toLocaleString()} {formData.currency}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>الإجراءات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => handleSave(false)}
                disabled={loading}
                className="w-full"
              >
                <Save className="w-4 h-4 ml-2" />
                حفظ
              </Button>

              <Button
                onClick={() => handleSave(true)}
                disabled={loading}
                variant="secondary"
                className="w-full"
              >
                <Send className="w-4 h-4 ml-2" />
                حفظ + PDF + إرسال
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewContract;