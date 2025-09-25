import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Construction } from 'lucide-react';

const ContractTemplates = () => {
  const navigate = useNavigate();

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
          <h1 className="text-3xl font-bold">قوالب العقود</h1>
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
  );
};

export default ContractTemplates;