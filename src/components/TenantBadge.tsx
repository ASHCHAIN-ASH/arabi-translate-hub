import React from 'react';
import { useTenant } from '@/contexts/TenantContext';
import { Badge } from '@/components/ui/badge';

export const TenantBadge: React.FC = () => {
  const { tenant } = useTenant();

  if (!tenant) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <Badge variant="secondary" className="px-3 py-1 text-xs">
        أنت تعمل على: {tenant.name}
      </Badge>
    </div>
  );
};