import React from 'react';
import ClientLayout from '@/components/client/ClientLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ClientTickets = () => {
  return (
    <ClientLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-arabic-formal font-bold">تذاكر الدعم</h1>
        <Card>
          <CardHeader>
            <CardTitle>قريباً</CardTitle>
          </CardHeader>
          <CardContent>
            <p>صفحة تذاكر الدعم قيد التطوير</p>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default ClientTickets;