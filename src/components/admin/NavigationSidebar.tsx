import React from 'react';
import { FileText, CreditCard, FileSignature, MessageCircle, Receipt, Users, Settings } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from '@/components/ui/sidebar';

const items = [
  {
    title: 'إدارة العملاء',
    url: '/admin/customers',
    icon: Users,
  },
  {
    title: 'إدارة المستخدمين',
    url: '/admin/users',
    icon: Settings,
  },
  {
    title: 'العقود',
    url: '/admin/contracts',
    icon: FileText,
  },
  {
    title: 'الفواتير الضريبية',
    url: '/admin/invoices',
    icon: Receipt,
  },
  {
    title: 'المحاسبة',
    url: '/admin/accounting',
    icon: CreditCard,
  },
  {
    title: 'التوقيع الإلكتروني',
    url: '/admin/esign',
    icon: FileSignature,
  },
  {
    title: 'واتساب',
    url: '/admin/whatsapp',
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
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
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