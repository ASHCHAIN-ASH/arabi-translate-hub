import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Construction } from 'lucide-react';

const ContractTemplates = () => {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/adminmaster/contracts')}
              size="sm"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                قوالب العقود
              </h1>
              <p className="text-muted-foreground mt-1">إدارة قوالب العقود المختلفة</p>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="text-center py-12">
            <Construction className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">قيد التطوير</h3>
            <p className="text-gray-600 mb-4">
              هذه الميزة قيد التطوير حالياً. سيتم إضافة نظام إدارة قوالب العقود قريباً.
            </p>
            <p className="text-sm text-gray-500">
              في الوقت الحالي، يمكنك إنشاء العقود مباشرة من صفحة العقود.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ContractTemplates;