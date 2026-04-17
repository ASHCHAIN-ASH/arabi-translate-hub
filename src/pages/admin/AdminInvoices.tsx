import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, FileText, Mail, Trash2, Edit, Download, Send } from 'lucide-react';

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_id?: string;
  order_id?: string;
  user_id?: string;
  subtotal?: number;
  tax_amount?: number;
  discount_amount?: number;
  total_amount?: number;
  amount?: number;
  vat_amount?: number;
  vat_rate?: number;
  include_vat?: boolean;
  status: string;
  payment_status?: string;
  issue_date?: string;
  due_date?: string;
  paid_at?: string;
  notes?: string;
  created_at: string;
  pdf_generated?: boolean;
  pdf_url?: string;
  invoice_items?: InvoiceItem[];
}

interface InvoiceItem {
  id?: string;
  item_name: string;
  description?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  discount_percentage?: number;
  discount_amount?: number;
}

const AdminInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [generatingPdf, setGeneratingPdf] = useState<string | null>(null);

  const [newInvoice, setNewInvoice] = useState<Partial<Invoice>>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    include_vat: true,
    vat_rate: 15,
    status: 'draft',
    payment_status: 'pending',
    due_date: ''
  });

  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([{
    item_name: '',
    description: '',
    quantity: 1,
    unit_price: 0,
    total_price: 0,
    discount_percentage: 0,
    discount_amount: 0
  }]);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          invoice_items (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices((data || []) as any);
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: "فشل في تحميل الفواتير: " + error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateItemTotal = (item: InvoiceItem) => {
    const subtotal = item.quantity * item.unit_price;
    const discountAmount = item.discount_percentage ? (subtotal * item.discount_percentage) / 100 : (item.discount_amount || 0);
    return subtotal - discountAmount;
  };

  const calculateInvoiceTotals = () => {
    const subtotal = invoiceItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);
    const vatAmount = newInvoice.include_vat ? (subtotal * (newInvoice.vat_rate || 15)) / 100 : 0;
    const total = subtotal + vatAmount;

    return { subtotal, vatAmount, total };
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const updatedItems = [...invoiceItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // إعادة حساب المجموع للعنصر
    if (['quantity', 'unit_price', 'discount_percentage', 'discount_amount'].includes(field)) {
      updatedItems[index].total_price = calculateItemTotal(updatedItems[index]);
    }
    
    setInvoiceItems(updatedItems);
  };

  const addInvoiceItem = () => {
    setInvoiceItems([...invoiceItems, {
      item_name: '',
      description: '',
      quantity: 1,
      unit_price: 0,
      total_price: 0,
      discount_percentage: 0,
      discount_amount: 0
    }]);
  };

  const removeInvoiceItem = (index: number) => {
    if (invoiceItems.length > 1) {
      const updatedItems = invoiceItems.filter((_, i) => i !== index);
      setInvoiceItems(updatedItems);
    }
  };

  const handleCreateInvoice = async () => {
    try {
      if (!newInvoice.customer_name || !newInvoice.customer_email) {
        toast({
          title: "خطأ",
          description: "يرجى ملء جميع البيانات المطلوبة",
          variant: "destructive"
        });
        return;
      }

      const { subtotal, vatAmount, total } = calculateInvoiceTotals();

      // إنشاء الفاتورة  
      const invoiceData: any = {
        customer_name: newInvoice.customer_name!,
        customer_email: newInvoice.customer_email!,
        customer_phone: newInvoice.customer_phone || null,
        amount: total,
        status: newInvoice.status || 'draft',
        payment_status: newInvoice.payment_status || 'pending',
        issue_date: new Date().toISOString(),
        due_date: newInvoice.due_date || null,
        offer_title: `فاتورة ضريبية - ${invoiceItems[0]?.item_name || 'خدمات متنوعة'}`
      };

      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert(invoiceData)
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // إضافة عناصر الفاتورة
      const itemsToInsert = invoiceItems
        .filter(item => item.item_name.trim() !== '')
        .map(item => ({
          ...item,
          invoice_id: invoice.id,
          total_price: calculateItemTotal(item)
        }));

      if (itemsToInsert.length > 0) {
        const { error: itemsError } = await supabase
          .from('invoice_items')
          .insert(itemsToInsert);

        if (itemsError) throw itemsError;
      }

      toast({
        title: "نجح الإنشاء",
        description: `تم إنشاء الفاتورة ${invoice.invoice_number} بنجاح`,
      });

      setShowCreateDialog(false);
      resetForm();
      fetchInvoices();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: "فشل في إنشاء الفاتورة: " + error.message,
        variant: "destructive"
      });
    }
  };

  const generatePDFAndSendEmail = async (invoiceId: string, sendEmail: boolean = false) => {
    setGeneratingPdf(invoiceId);
    try {
      const invoice = invoices.find(inv => inv.id === invoiceId);
      if (!invoice) throw new Error("الفاتورة غير موجودة");

      const { data, error } = await supabase.functions.invoke('generate-invoice-pdf', {
        body: {
          invoice_id: invoiceId,
          send_email: sendEmail,
          recipient_email: sendEmail ? invoice.customer_email : undefined
        }
      });

      if (error) throw error;

      toast({
        title: "تم بنجاح",
        description: sendEmail ? "تم إنشاء وإرسال الفاتورة بالإيميل" : "تم إنشاء الفاتورة PDF",
      });

      if (data?.pdf_data && !sendEmail) {
        // تحميل PDF
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${data.pdf_data}`;
        link.download = `فاتورة_${invoice.invoice_number}.pdf`;
        link.click();
      }

      fetchInvoices();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: "فشل في إنشاء PDF: " + error.message,
        variant: "destructive"
      });
    } finally {
      setGeneratingPdf(null);
    }
  };

  const resetForm = () => {
    setNewInvoice({
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      include_vat: true,
      vat_rate: 15,
      status: 'draft',
      payment_status: 'pending',
      due_date: ''
    });
    setInvoiceItems([{
      item_name: '',
      description: '',
      quantity: 1,
      unit_price: 0,
      total_price: 0,
      discount_percentage: 0,
      discount_amount: 0
    }]);
  };

  const { subtotal, vatAmount, total } = calculateInvoiceTotals();

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center">جاري التحميل...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">إدارة الفواتير الضريبية</h1>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 ml-2" />
                فاتورة جديدة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>إنشاء فاتورة ضريبية جديدة</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* بيانات العميل */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">بيانات العميل</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customer_name">اسم العميل *</Label>
                      <Input
                        id="customer_name"
                        value={newInvoice.customer_name || ''}
                        onChange={(e) => setNewInvoice({...newInvoice, customer_name: e.target.value})}
                        placeholder="أدخل اسم العميل"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="customer_email">البريد الإلكتروني *</Label>
                      <Input
                        id="customer_email"
                        type="email"
                        value={newInvoice.customer_email || ''}
                        onChange={(e) => setNewInvoice({...newInvoice, customer_email: e.target.value})}
                        placeholder="example@domain.com"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="customer_phone">رقم الهاتف</Label>
                      <Input
                        id="customer_phone"
                        value={newInvoice.customer_phone || ''}
                        onChange={(e) => setNewInvoice({...newInvoice, customer_phone: e.target.value})}
                        placeholder="+966 50 000 0000"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="due_date">تاريخ الاستحقاق</Label>
                      <Input
                        id="due_date"
                        type="date"
                        value={newInvoice.due_date || ''}
                        onChange={(e) => setNewInvoice({...newInvoice, due_date: e.target.value})}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* إعدادات الضريبة */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">إعدادات الضريبة</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include_vat"
                        checked={newInvoice.include_vat}
                        onCheckedChange={(checked) => setNewInvoice({...newInvoice, include_vat: !!checked})}
                      />
                      <Label htmlFor="include_vat">تطبيق ضريبة القيمة المضافة</Label>
                    </div>
                    
                    {newInvoice.include_vat && (
                      <div className="w-32">
                        <Label htmlFor="vat_rate">نسبة الضريبة (%)</Label>
                        <Input
                          id="vat_rate"
                          type="number"
                          value={newInvoice.vat_rate || 15}
                          onChange={(e) => setNewInvoice({...newInvoice, vat_rate: parseFloat(e.target.value) || 0})}
                          min="0"
                          max="100"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* عناصر الفاتورة */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex justify-between items-center">
                      عناصر الفاتورة
                      <Button onClick={addInvoiceItem} size="sm" variant="outline">
                        <Plus className="h-4 w-4 ml-2" />
                        إضافة عنصر
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {invoiceItems.map((item, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">العنصر #{index + 1}</h4>
                          {invoiceItems.length > 1 && (
                            <Button
                              onClick={() => removeInvoiceItem(index)}
                              size="sm"
                              variant="destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <Label>اسم الخدمة *</Label>
                            <Input
                              value={item.item_name}
                              onChange={(e) => handleItemChange(index, 'item_name', e.target.value)}
                              placeholder="مثال: ترجمة مستند"
                            />
                          </div>
                          
                          <div>
                            <Label>الكمية</Label>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 1)}
                              min="1"
                            />
                          </div>
                          
                          <div>
                            <Label>سعر الوحدة (ر.س)</Label>
                            <Input
                              type="number"
                              value={item.unit_price}
                              onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                              min="0"
                              step="0.01"
                            />
                          </div>
                          
                          <div>
                            <Label>المجموع (ر.س)</Label>
                            <Input
                              value={item.total_price.toFixed(2)}
                              disabled
                              className="bg-gray-100"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label>وصف الخدمة</Label>
                          <Textarea
                            value={item.description || ''}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            placeholder="وصف تفصيلي للخدمة..."
                            rows={2}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>نسبة الخصم (%)</Label>
                            <Input
                              type="number"
                              value={item.discount_percentage || 0}
                              onChange={(e) => handleItemChange(index, 'discount_percentage', parseFloat(e.target.value) || 0)}
                              min="0"
                              max="100"
                            />
                          </div>
                          
                          <div>
                            <Label>مبلغ الخصم (ر.س)</Label>
                            <Input
                              type="number"
                              value={item.discount_amount || 0}
                              onChange={(e) => handleItemChange(index, 'discount_amount', parseFloat(e.target.value) || 0)}
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* ملخص الفاتورة */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">ملخص الفاتورة</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>المجموع الفرعي:</span>
                      <span>{subtotal.toFixed(2)} ر.س</span>
                    </div>
                    
                    {newInvoice.include_vat && (
                      <div className="flex justify-between text-orange-600">
                        <span>ضريبة القيمة المضافة ({newInvoice.vat_rate}%):</span>
                        <span>{vatAmount.toFixed(2)} ر.س</span>
                      </div>
                    )}
                    
                    <Separator />
                    
                    <div className="flex justify-between font-bold text-lg">
                      <span>المجموع الإجمالي:</span>
                      <span className="text-primary">{total.toFixed(2)} ر.س</span>
                    </div>
                    
                    {newInvoice.include_vat && (
                      <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
                        ⚠️ هذه الفاتورة شاملة ضريبة القيمة المضافة
                      </p>
                    )}
                  </CardContent>
                </Card>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={handleCreateInvoice} disabled={!newInvoice.customer_name || !newInvoice.customer_email}>
                    إنشاء الفاتورة
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* قائمة الفواتير */}
        <div className="grid gap-4">
          {invoices.map((invoice) => (
            <Card key={invoice.id}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4">
                      <h3 className="text-lg font-semibold">{invoice.invoice_number}</h3>
                      <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                        {invoice.status}
                      </Badge>
                      <Badge variant={invoice.payment_status === 'paid' ? 'default' : 'destructive'}>
                        {invoice.payment_status}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p><strong>العميل:</strong> {invoice.customer_name}</p>
                      <p><strong>البريد:</strong> {invoice.customer_email}</p>
                      <p><strong>تاريخ الإصدار:</strong> {new Date(invoice.issue_date).toLocaleDateString('ar-SA')}</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                      <div className="text-lg font-bold text-primary">
                        {Number(invoice.amount ?? 0).toFixed(2)} ر.س
                      </div>
                      {invoice.include_vat && (
                        <Badge variant="outline" className="text-amber-600">
                          شامل ضريبة {invoice.vat_rate}%
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => generatePDFAndSendEmail(invoice.id, false)}
                      disabled={generatingPdf === invoice.id}
                      size="sm"
                      variant="outline"
                    >
                      <Download className="h-4 w-4 ml-2" />
                      {generatingPdf === invoice.id ? 'جاري الإنشاء...' : 'تحميل PDF'}
                    </Button>
                    
                    <Button
                      onClick={() => generatePDFAndSendEmail(invoice.id, true)}
                      disabled={generatingPdf === invoice.id}
                      size="sm"
                      variant="default"
                    >
                      <Send className="h-4 w-4 ml-2" />
                      إرسال بالإيميل
                    </Button>
                  </div>
                </div>
                
                {invoice.invoice_items && invoice.invoice_items.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium mb-2">عناصر الفاتورة:</h4>
                    <div className="space-y-1 text-sm">
                      {invoice.invoice_items.map((item: any) => (
                        <div key={item.id} className="flex justify-between">
                          <span>{item.item_name} (×{item.quantity})</span>
                          <span>{item.total_price.toFixed(2)} ر.س</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {invoices.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">لا توجد فواتير محفوظة</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminInvoices;