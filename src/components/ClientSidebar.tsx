import { useState } from "react";
import { Home, FileText, Eye, Settings, LogOut, User, Bell } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const clientMenuItems = [
  { title: "لوحة التحكم", url: "/client/dashboard", icon: Home },
  { title: "عقودي", url: "/client/contracts", icon: FileText },
  { title: "طلب عقد جديد", url: "/contract-request", icon: Eye },
  { title: "الإشعارات", url: "/client/notifications", icon: Bell },
  { title: "الملف الشخصي", url: "/client/profile", icon: User },
  { title: "الإعدادات", url: "/client/settings", icon: Settings },
];

export function ClientSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const isExpanded = clientMenuItems.some((item) => isActive(item.url));
  
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-muted text-primary font-medium" : "hover:bg-muted/50";

  return (
    <Sidebar className="w-60">
      <SidebarContent>
        {/* User Info */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 rounded-full p-2">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">أهلاً بك</p>
              <p className="text-xs text-muted-foreground">
                {user?.email || 'العميل الكريم'}
              </p>
            </div>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>القائمة الرئيسية</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {clientMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => getNavCls({ isActive })}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout */}
        <div className="mt-auto p-4 border-t">
          <SidebarMenuButton 
            onClick={async () => {
              try {
                await signOut();
                navigate('/');
              } catch (error) {
                console.error('Error signing out:', error);
              }
            }}
            className="flex items-center gap-2 text-red-600 hover:bg-red-50 w-full justify-start"
          >
            <LogOut className="h-4 w-4" />
            <span>تسجيل الخروج</span>
          </SidebarMenuButton>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}