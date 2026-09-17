import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, User, Building2, Loader2 } from 'lucide-react';
import { supabase } from '@/data/legacy/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import EmailComposer from '@/components/EmailComposer';
import type { Customer } from '@/hooks/useCustomers';

const AdminCustomerEmail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!id) return;
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error || !data) {
        toast.error('تعذر تحميل بيانات العميل');
      } else {
        setCustomer(data as Customer);
      }
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!customer) {
    return (
      <AdminLayout>
        <div className="text-center py-20">
          <p className="text-muted-foreground mb-4">العميل غير موجود</p>
          <Button onClick={() => navigate('/adminfekrah/customers')}>العودة</Button>
        </div>
      </AdminLayout>
    );
  }

  if (!customer.email) {
    return (
      <AdminLayout>
        <div className="space-y-6" dir="rtl">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/adminfekrah/customers/${customer.id}`)}>
              <ArrowRight className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">إرسال بريد إلكتروني</h1>
          </div>
          <Card>
            <CardContent className="py-16 text-center">
              <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">هذا العميل لا يملك بريدًا إلكترونيًا مسجلاً</p>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/adminfekrah/customers/${customer.id}`)}
          >
            <ArrowRight className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Mail className="w-6 h-6 text-blue-600" />
              إرسال بريد إلكتروني
            </h1>
            <p className="text-sm text-muted-foreground">إنشاء وإرسال بريد إلى {customer.name}</p>
          </div>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">المستلم</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{customer.name}</span>
              </div>
              <Badge variant="outline" className="gap-1">
                <Mail className="w-3 h-3" />
                {customer.email}
              </Badge>
              {customer.company && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  <span>{customer.company}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <EmailComposer
          defaultTo={customer.email}
          onSent={() => {
            toast.success('تم إرسال البريد بنجاح');
            navigate(`/adminfekrah/customers/${customer.id}`);
          }}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminCustomerEmail;
