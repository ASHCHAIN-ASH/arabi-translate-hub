import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, CreditCard, FileSignature, MessageCircle, Receipt, Users, Settings, BarChart3, TrendingUp, Inbox, BookOpen, Wallet, Gift, Settings2 } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from '@/components/ui/sidebar';

const items = [
  { title: 'صندوق الوارد', url: '/adminmaster/inbox', icon: Inbox },
  { title: 'إدارة العملاء', url: '/adminmaster/customers', icon: Users },
  { title: 'إدارة المستخدمين', url: '/adminmaster/users', icon: Settings },
  { title: 'اللوحة المالية', url: '/adminmaster/financial', icon: BarChart3 },
  {
    title: 'العقود',
    url: '/adminmaster/contracts',
    icon: FileText,
  },
  {
    title: 'إحصائيات العقود',
    url: '/adminmaster/contracts/analytics',
    icon: TrendingUp,
  },
  {
    title: 'إنشاء عقد جديد',
    url: '/adminmaster/contracts/new',
    icon: FileSignature,
  },
  {
    title: 'قوالب العقود',
    url: '/adminmaster/contract-templates',
    icon: FileText,
  },
  {
    title: 'الفواتير الضريبية',
    url: '/adminmaster/invoices',
    icon: Receipt,
  },
  {
    title: 'المحاسبة',
    url: '/adminmaster/accounting',
    icon: CreditCard,
  },
  {
    title: 'نشر الأبحاث',
    url: '/adminmaster/research',
    icon: BookOpen,
  },
  {
    title: 'محافظ الطلاب',
    url: '/adminmaster/student-wallets',
    icon: Wallet,
  },
  {
    title: 'طلبات الاستبدال',
    url: '/adminmaster/reward-redemptions',
    icon: Gift,
  },
  {
    title: 'قواعد المكافآت',
    url: '/adminmaster/reward-rules',
    icon: Settings2,
  },
  {
    title: 'واتساب',
    url: '/adminmaster/whatsapp',
    icon: MessageCircle,
  }
];

const NavigationSidebar = () => {
  return (
    <Sidebar>
      <SidebarTrigger className="m-2 self-end" />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>لوحة الإدارة</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default NavigationSidebar;