import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminServices = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-arabic-formal font-bold">إدارة الخدمات</h1>
        <Card>
          <CardHeader>
            <CardTitle>قريباً</CardTitle>
          </CardHeader>
          <CardContent>
            <p>صفحة إدارة الخدمات قيد التطوير</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminServices;