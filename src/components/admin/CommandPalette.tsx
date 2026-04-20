import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  LayoutDashboard, ShoppingCart, Users, FileText, MessageSquare,
  Wallet, Settings, BarChart3, HelpCircle, Bell, Package, CreditCard,
  Mail, Award, UserPlus, Briefcase, TrendingUp, Building2, Sparkles
} from 'lucide-react';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAskAI?: (query: string) => void;
}

const navigationItems = [
  { label: 'لوحة التحكم', href: '/adminmaster', icon: LayoutDashboard, group: 'الرئيسية' },
  { label: 'طلبات الخدمات', href: '/adminmaster/service-orders', icon: Package, group: 'الطلبات' },
  { label: 'الطلبات العامة', href: '/adminmaster/orders', icon: ShoppingCart, group: 'الطلبات' },
  { label: 'صندوق الوارد', href: '/adminmaster/inbox', icon: Mail, group: 'العملاء' },
  { label: 'العملاء', href: '/adminmaster/customers', icon: Users, group: 'العملاء' },
  { label: 'المستخدمين', href: '/adminmaster/users', icon: Users, group: 'العملاء' },
  { label: 'إضافة مستخدم', href: '/adminmaster/add-user', icon: UserPlus, group: 'العملاء' },
  { label: 'خدمة العملاء', href: '/adminmaster/chat', icon: MessageSquare, group: 'العملاء' },
  { label: 'الفواتير', href: '/adminmaster/invoices', icon: FileText, group: 'المالية' },
  { label: 'المعاملات الداخلية', href: '/adminmaster/transactions', icon: CreditCard, group: 'المالية' },
  { label: 'بوابة المدفوعات', href: '/adminmaster/payments', icon: CreditCard, group: 'المالية' },
  { label: 'المحافظ الرقمية', href: '/adminmaster/wallets', icon: Wallet, group: 'المالية' },
  { label: 'اللوحة المالية', href: '/adminmaster/financial', icon: TrendingUp, group: 'المالية' },
  { label: 'الخدمات', href: '/adminmaster/services', icon: Briefcase, group: 'الإعدادات' },
  { label: 'العضويات', href: '/adminmaster/memberships', icon: Award, group: 'الإعدادات' },
  { label: 'نظام الإحالة', href: '/adminmaster/referrals', icon: Users, group: 'الإعدادات' },
  { label: 'التحفيز', href: '/adminmaster/gamification', icon: Award, group: 'الإعدادات' },
  { label: 'العقود', href: '/adminmaster/contracts', icon: FileText, group: 'الإعدادات' },
  { label: 'إدارة البريد', href: '/adminmaster/email-management', icon: Mail, group: 'الإعدادات' },
  { label: 'موارد الطلاب', href: '/adminmaster/student-resources', icon: BarChart3, group: 'الإعدادات' },
  { label: 'ساعات العمل', href: '/adminmaster/working-hours', icon: Settings, group: 'الإعدادات' },
];

export const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onOpenChange, onAskAI }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  const handleSelect = useCallback((href: string) => {
    onOpenChange(false);
    navigate(href);
  }, [navigate, onOpenChange]);

  const handleAskAI = () => {
    if (onAskAI && search.trim()) {
      onAskAI(search);
      onOpenChange(false);
      setSearch('');
    }
  };

  // تجميع العناصر
  const grouped = navigationItems.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {} as Record<string, typeof navigationItems>);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="ابحث أو اكتب سؤالاً للمساعد الذكي..."
        value={search}
        onValueChange={setSearch}
        dir="rtl"
      />
      <CommandList>
        <CommandEmpty>
          <div className="py-6 text-center">
            <p className="text-sm text-muted-foreground mb-3">لا توجد نتائج</p>
            {search && onAskAI && (
              <button
                onClick={handleAskAI}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
              >
                <Sparkles className="w-4 h-4" />
                اسأل المساعد الذكي عن "{search}"
              </button>
            )}
          </div>
        </CommandEmpty>

        {search && onAskAI && (
          <>
            <CommandGroup heading="المساعد الذكي">
              <CommandItem onSelect={handleAskAI} className="gap-2">
                <Sparkles className="w-4 h-4 text-violet-500" />
                <span>اسأل عن: "{search}"</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {Object.entries(grouped).map(([group, items], idx) => (
          <React.Fragment key={group}>
            {idx > 0 && <CommandSeparator />}
            <CommandGroup heading={group}>
              {items.map((item) => (
                <CommandItem
                  key={item.href}
                  onSelect={() => handleSelect(item.href)}
                  className="gap-2"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </React.Fragment>
        ))}
      </CommandList>
    </CommandDialog>
  );
};
