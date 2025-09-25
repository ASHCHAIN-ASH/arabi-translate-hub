import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface ContractType {
  id: string;
  name_ar: string;
}

interface ContractTemplate {
  id: string;
  type_id: string;
  title: string;
  variables: any;
  body_html: string;
  is_default: boolean;
  created_at: string;
  contract_types?: {
    name_ar: string;
  };
}

const ContractTemplates = () => {
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [contractTypes, setContractTypes] = useState<ContractType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ContractTemplate | null>(null);

  const [formData, setFormData] = useState({
    type_id: '',
    title: '',
    variables: '',
    body_html: '',
    is_default: false
  });

  useEffect(() => {
    loadTemplates();
    loadContractTypes();
  }, []);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('contract_templates')
        .select(`
          *,
          contract_types!inner(name_ar)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('خطأ في تحميل القوالب');
    } finally {
      setLoading(false);
    }
  };

  const loadContractTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('contract_types')
        .select('id, name_ar')
        .order('name_ar');

      if (error) throw error;
      setContractTypes(data || []);
    } catch (error) {
      console.error('Error loading contract types:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      type_id: '',
      title: '',
      variables: '',
      body_html: '',
      is_default: false
    });
    setEditingTemplate(null);
  };

  const handleEdit = (template: ContractTemplate) => {
    setEditingTemplate(template);
    setFormData({
      type_id: template.type_id,
      title: template.title,
      variables: JSON.stringify(template.variables, null, 2),
      body_html: template.body_html,
      is_default: template.is_default
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.type_id || !formData.title || !formData.body_html) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      let variables;
      try {
        variables = formData.variables ? JSON.parse(formData.variables) : {};
      } catch (error) {
        toast.error('خطأ في تنسيق JSON للمتغيرات');
        return;
      }

      const templateData = {
        type_id: formData.type_id,
        title: formData.title,
        variables,
        body_html: formData.body_html,
        is_default: formData.is_default
      };

      if (editingTemplate) {
        const { error } = await supabase
          .from('contract_templates')
          .update(templateData)
          .eq('id', editingTemplate.id);

        if (error) throw error;
        toast.success('تم تحديث القالب بنجاح');
      } else {
        const { error } = await supabase
          .from('contract_templates')
          .insert([templateData]);

        if (error) throw error;
        toast.success('تم إضافة القالب بنجاح');
      }

      setIsDialogOpen(false);
      resetForm();
      loadTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('خطأ في حفظ القالب');
    }
  };

  const handleDelete = async (templateId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا القالب؟')) return;

    try {
      const { error } = await supabase
        .from('contract_templates')
        .delete()
        .eq('id', templateId);

      if (error) throw error;
      toast.success('تم حذف القالب بنجاح');
      loadTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('خطأ في حذف القالب');
    }
  };

  const addDefaultTemplates = async () => {
    const defaultTemplates = [
      {
        type_id: contractTypes.find(t => t.name_ar === 'عقود الأبحاث')?.id,
        title: 'عقد خدمات بحثية',
        variables: {
          service_name: 'إعداد دراسة/بحث',
          price: 0,
          deliverables: ['ملف PDF نهائي', 'عرض تقديمي'],
          payment_terms: '50% مقدّمًا و50% عند التسليم',
          start_date: '', end_date: '', pages: 0, notes: ''
        },
        body_html: '<h1>عقد خدمات بحثية</h1><p>رقم العقد: {{contract_no}} | التاريخ: {{issue_date}}</p><p><b>الطرف الأول:</b> {{agency_name}} — <b>الطرف الثاني:</b> {{client_name}}</p><h2>موضوع العقد</h2><p>تقديم خدمة: <b>{{service_name}}</b> وفق البنود:</p><ul>{{#each deliverables}}<li>{{this}}</li>{{/each}}</ul><h2>المدة</h2><p>من {{start_date}} إلى {{end_date}}</p><h2>الأتعاب</h2><p>الإجمالي: {{currency total_amount currency}}</p><p>شروط الدفع: {{payment_terms}}</p><h2>السرية والأمانة العلمية</h2><p>يلتزم الطرف الأول بالحفاظ على السرية والأمانة العلمية وعدم انتهاك حقوق الملكية.</p><h2>حل النزاعات</h2><p>تطبق أنظمة المملكة العربية السعودية.</p><hr/><div>{{{signature_block_html}}}</div>',
        is_default: true
      },
      {
        type_id: contractTypes.find(t => t.name_ar === 'عقود الترجمة')?.id,
        title: 'عقد ترجمة معتمدة',
        variables: {
          service_name: 'ترجمة معتمدة',
          price: 0,
          deliverables: ['ملف PDF مترجم', 'نسخة مختومة إن لزم'],
          payment_terms: 'دفعة واحدة قبل التسليم',
          language_from: 'العربية', language_to: 'الإنجليزية',
          word_count: 0, notes: ''
        },
        body_html: '<h1>عقد ترجمة</h1><p>رقم العقد: {{contract_no}} | التاريخ: {{issue_date}}</p><p><b>من:</b> {{language_from}} <b>إلى:</b> {{language_to}} | عدد الكلمات: {{word_count}}</p><p>الخدمة: <b>{{service_name}}</b></p><h2>المخرجات</h2><ul>{{#each deliverables}}<li>{{this}}</li>{{/each}}</ul><h2>الأتعاب</h2><p>الإجمالي: {{currency total_amount currency}}</p><p>شروط الدفع: {{payment_terms}}</p><h2>الاعتمادية والجودة</h2><p>تقدّم الترجمة بمستوى مهني مع اعتماد عند الطلب.</p><hr/><div>{{{signature_block_html}}}</div>',
        is_default: true
      }
    ];

    try {
      for (const template of defaultTemplates) {
        if (template.type_id) {
          await supabase.from('contract_templates').insert([template]);
        }
      }
      toast.success('تم إضافة القوالب الافتراضية');
      loadTemplates();
    } catch (error) {
      console.error('Error adding default templates:', error);
      toast.error('خطأ في إضافة القوالب الافتراضية');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">قوالب العقود</h1>
        <div className="flex gap-2">
          <Button onClick={addDefaultTemplates} variant="outline">
            إضافة القوالب الافتراضية
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة قالب جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingTemplate ? 'تعديل القالب' : 'إضافة قالب جديد'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                    <Label htmlFor="title">عنوان القالب *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        title: e.target.value 
                      }))}
                      placeholder="أدخل عنوان القالب"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_default"
                    checked={formData.is_default}
                    onCheckedChange={(checked) => setFormData(prev => ({ 
                      ...prev, 
                      is_default: checked 
                    }))}
                  />
                  <Label htmlFor="is_default">قالب افتراضي</Label>
                </div>

                <div>
                  <Label htmlFor="variables">المتغيرات (JSON)</Label>
                  <Textarea
                    id="variables"
                    value={formData.variables}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      variables: e.target.value 
                    }))}
                    rows={8}
                    className="font-mono text-sm"
                    placeholder='{"service_name": "—", "price": 0, "deliverables": ["—"]}'
                  />
                </div>

                <div>
                  <Label htmlFor="body_html">نص القالب (HTML) *</Label>
                  <Textarea
                    id="body_html"
                    value={formData.body_html}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      body_html: e.target.value 
                    }))}
                    rows={15}
                    className="font-mono text-sm"
                    placeholder="أدخل نص القالب بصيغة HTML"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={handleSave}>
                    {editingTemplate ? 'تحديث' : 'حفظ'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* قائمة القوالب */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">لا توجد قوالب</p>
              <Button onClick={addDefaultTemplates} className="mt-4">
                إضافة القوالب الافتراضية
              </Button>
            </CardContent>
          </Card>
        ) : (
          templates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{template.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {template.contract_types?.name_ar}
                    </p>
                  </div>
                  {template.is_default && (
                    <Badge variant="secondary">افتراضي</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-500">
                    تاريخ الإنشاء: {new Date(template.created_at).toLocaleDateString('ar-SA')}
                  </p>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(template)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(template.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ContractTemplates;