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
    type_id: '',
    client_id: '',
    template_id: '',
    variables: JSON.stringify({
      service_name: '—',
      price: 0,
      deliverables: ['—'],
      payment_terms: '—'
    }, null, 2),
    vat_percent: 15,
    currency: 'SAR',
    valid_until: ''
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
      // تحميل أنواع العقود
      const { data: types, error: typesError } = await supabase
        .from('contract_types')
        .select('id, name_ar')
        .order('name_ar');

      if (typesError) throw typesError;
      setContractTypes(types || []);

      // تحميل العملاء
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('id, full_name')
        .order('created_at', { ascending: false });

      if (clientsError) throw clientsError;
      setClients(clientsData || []);

      // تحميل القوالب
      const { data: templatesData, error: templatesError } = await supabase
        .from('contract_templates')
        .select('id, title, variables')
        .order('created_at', { ascending: false });

      if (templatesError) throw templatesError;
      setTemplates(templatesData || []);

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
      const variables = JSON.parse(formData.variables);
      const price = Number(variables.price || 0);
      const vatPercent = Number(formData.vat_percent || 0);
      const vatAmount = +(price * vatPercent / 100).toFixed(2);
      const totalAmount = +(price + vatAmount).toFixed(2);

      setCalculations({
        subtotal: price,
        vat_amount: vatAmount,
        total_amount: totalAmount
      });

      toast.success('تم حساب الإجمالي');
    } catch (error) {
      toast.error('خطأ في حساب الإجمالي - تأكد من صحة JSON');
    }
  };

  const handleSave = async (sendAfterSave = false) => {
    if (!formData.type_id || !formData.client_id || !formData.template_id) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setLoading(true);
      
      const contractData = {
        contract_number: contractNumber,
        type_id: formData.type_id,
        client_id: formData.client_id,
        template_id: formData.template_id,
        variables: JSON.parse(formData.variables),
        subtotal: calculations.subtotal,
        vat_percent: formData.vat_percent,
        vat_amount: calculations.vat_amount,
        total_amount: calculations.total_amount,
        currency: formData.currency,
        valid_until: formData.valid_until || null,
        status: 'draft'
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
                <Label htmlFor="type_id">نوع العقد *</Label>
                <Select value={formData.type_id} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, type_id: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع العقد" />
                  </SelectTrigger>
                  <SelectContent>
                    {contractTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name_ar}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Label htmlFor="template_id">القالب *</Label>
                <Select value={formData.template_id} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, template_id: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر القالب" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vat_percent">الضريبة (%)</Label>
                  <Input
                    id="vat_percent"
                    type="number"
                    value={formData.vat_percent}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      vat_percent: Number(e.target.value) 
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

              <div>
                <Label htmlFor="valid_until">صالح حتى</Label>
                <Input
                  id="valid_until"
                  type="date"
                  value={formData.valid_until}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    valid_until: e.target.value 
                  }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>متغيرات العقد (JSON)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.variables}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  variables: e.target.value 
                }))}
                rows={10}
                className="font-mono text-sm"
                placeholder="أدخل متغيرات العقد بصيغة JSON"
              />
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
                  <span>الضريبة ({formData.vat_percent}%):</span>
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