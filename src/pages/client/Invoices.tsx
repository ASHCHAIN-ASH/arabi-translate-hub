import React from 'react';
import ClientLayout from '@/components/client/ClientLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ClientInvoices = () => {
  return (
    <ClientLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-arabic-formal font-bold">فواتيري</h1>
        <Card>
          <CardHeader>
            <CardTitle>قريباً</CardTitle>
          </CardHeader>
          <CardContent>
            <p>صفحة الفواتير قيد التطوير</p>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default ClientInvoices;