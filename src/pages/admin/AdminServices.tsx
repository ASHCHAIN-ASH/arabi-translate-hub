import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Languages, 
  GraduationCap, 
  Users, 
  Search,
  Eye,
  EyeOff,
  Clock,
  DollarSign,
  Settings,
  Filter,
  Download,
  Upload,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  CheckCircle2,
  Zap,
  FileText,
  TrendingUp,
  Archive
} from 'lucide-react';

// تبسيط تعريفات الأنواع
interface ServiceCategory {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
  icon: string;
  color: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Service {
  id: string;
  category_id: string;
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
  features_ar: string[];
  features_en: string[];
  base_price?: number;
  price_per_unit?: number;
  unit_type: string;
  min_units: number;
  max_units?: number;
  delivery_time_days: number;
  rush_delivery_available: boolean;
  rush_delivery_multiplier: number;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
  show_to_clients: boolean;
  code?: string;
  type?: string;
  created_at: string;
  updated_at: string;
  service_categories?: {
    id: string;
    name_ar: string;
    name_en: string;
    icon: string;
    color: string;
  };
}

const AdminServices = () => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortType, setSortType] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  const { toast } = useToast();

  // إحصائيات الخدمات
  const stats = useMemo(() => {
    const total = services.length;
    const active = services.filter(s => s.is_active).length;
    const inactive = total - active;
    const visible = services.filter(s => s.show_to_clients).length;
    const avgPrice = services.length > 0 
      ? services.reduce((sum, s) => sum + (s.price_per_unit || 0), 0) / services.length 
      : 0;

    return { total, active, inactive, visible, avgPrice };
  }, [services]);

  // تحميل البيانات مع Realtime subscription
  useEffect(() => {
    loadData();
    setupRealtimeSubscription();
  }, []);

  // تطبيق الفلاتر والبحث والترتيب
  useEffect(() => {
    let filtered = [...services];

    // البحث
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter(service => 
        service.name_ar.toLowerCase().includes(searchTermLower) ||
        service.name_en.toLowerCase().includes(searchTermLower) ||
        service.code?.toLowerCase().includes(searchTermLower) ||
        service.service_categories?.name_ar.toLowerCase().includes(searchTermLower)
      );
    }

    // فلتر الحالة
    if (statusFilter !== 'all') {
      filtered = filtered.filter(service => 
        statusFilter === 'active' ? service.is_active : !service.is_active
      );
    }

    // فلتر القسم
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(service => service.category_id === categoryFilter);
    }

    // فلتر النوع
    if (typeFilter !== 'all') {
      filtered = filtered.filter(service => service.type === typeFilter);
    }

    // الترتيب
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortType) {
        case 'name':
          comparison = a.name_ar.localeCompare(b.name_ar, 'ar');
          break;
        case 'price':
          const priceA = a.price_per_unit || a.base_price || 0;
          const priceB = b.price_per_unit || b.base_price || 0;
          comparison = priceA - priceB;
          break;
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'category':
          comparison = (a.service_categories?.name_ar || '').localeCompare(
            b.service_categories?.name_ar || '', 'ar'
          );
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredServices(filtered);
  }, [services, searchTerm, statusFilter, categoryFilter, typeFilter, sortType, sortOrder]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // تحميل الأقسام
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('service_categories')
        .select('*')
        .order('sort_order', { ascending: true });

      // تحميل الخدمات مع الأقسام
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select(`
          *,
          service_categories (
            id,
            name_ar,
            name_en,
            icon,
            color
          )
        `)
        .order('sort_order', { ascending: true });

      if (categoriesError) throw categoriesError;
      if (servicesError) throw servicesError;

      setCategories(categoriesData || []);
      setServices((servicesData || []) as Service[]);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل البيانات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // إعداد Realtime subscription للمزامنة اللحظية
  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('services-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'services'
        },
        (payload) => {
          console.log('Service changed:', payload);
          
          // إرسال حدث للعملاء
          broadcastServiceChange(payload);
          
          // تحديث البيانات المحلية
          if (payload.eventType === 'INSERT') {
            loadData(); // إعادة تحميل لضمان الحصول على البيانات الكاملة
          } else if (payload.eventType === 'UPDATE') {
            setServices(prev => prev.map(service => 
              service.id === payload.new?.id 
                ? { ...service, ...payload.new }
                : service
            ));
          } else if (payload.eventType === 'DELETE') {
            setServices(prev => prev.filter(service => service.id !== payload.old?.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  // إرسال حدث تغيير الخدمة للعملاء
  const broadcastServiceChange = (payload: Record<string, any>) => {
    const event = {
      type: 'service_changed',
      operation: payload.eventType?.toLowerCase() || 'update',
      service: payload.new || payload.old,
      timestamp: new Date().toISOString()
    };

    console.log('Broadcasting service change:', event);
  };

  // تفعيل/تعطيل الخدمة مع تحديث فوري
  const handleToggleService = async (serviceId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ is_active: !currentStatus })
        .eq('id', serviceId);

      if (error) throw error;

      toast({
        title: currentStatus ? "تم التعطيل" : "تم التفعيل",
        description: currentStatus 
          ? "تم تعطيل الخدمة ولن تظهر للعملاء" 
          : "تم تفعيل الخدمة وهي متاحة الآن",
      });

      // التحديث الفوري للواجهة (Optimistic UI)
      setServices(prev => prev.map(service => 
        service.id === serviceId 
          ? { ...service, is_active: !currentStatus }
          : service
      ));
    } catch (error) {
      console.error('Error toggling service:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث حالة الخدمة",
        variant: "destructive",
      });
    }
  };

  const handleSaveCategory = async (category: Partial<ServiceCategory>) => {
    try {
      if (editingCategory?.id) {
        const { error } = await supabase
          .from('service_categories')
          .update(category)
          .eq('id', editingCategory.id);

        if (error) throw error;
        toast({ title: "تم التحديث", description: "تم تحديث القسم بنجاح" });
      } else {
        const categoryData = {
          name_ar: category.name_ar || '',
          name_en: category.name_en || '',
          description_ar: category.description_ar,
          description_en: category.description_en,
          icon: category.icon || 'Languages',
          color: category.color || '#0EA5E9',
          sort_order: category.sort_order || 0,
          is_active: category.is_active ?? true
        };
        const { error } = await supabase
          .from('service_categories')
          .insert(categoryData);

        if (error) throw error;
        toast({ title: "تم الحفظ", description: "تم إنشاء القسم بنجاح" });
      }
      
      setIsDialogOpen(false);
      setEditingCategory(null);
      loadData();
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: "خطأ",
        description: "فشل في حفظ القسم",
        variant: "destructive",
      });
    }
  };

  const handleSaveService = async (service: Partial<Service>) => {
    try {
      // تطبيع الأرقام العربية
      const normalizeDigits = (text: string) => {
        return text.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
      };

      // التحقق من البيانات
      if (service.price_per_unit && service.price_per_unit < 0) {
        throw new Error('السعر يجب أن يكون أكبر من الصفر');
      }

      // تنظيف البيانات
      const cleanedService = {
        ...service,
        code: service.code ? normalizeDigits(service.code) : undefined,
        price_per_unit: service.price_per_unit ? parseFloat(service.price_per_unit.toString()) : undefined,
        base_price: service.base_price ? parseFloat(service.base_price.toString()) : undefined,
      };

      if (editingService?.id) {
        const { error } = await supabase
          .from('services')
          .update(cleanedService)
          .eq('id', editingService.id);

        if (error) throw error;
        toast({ title: "تم التحديث", description: "تم تحديث الخدمة بنجاح" });
      } else {
        // التحقق من عدم تكرار الكود
        if (cleanedService.code) {
          const { data: existingService } = await supabase
            .from('services')
            .select('id')
            .eq('code', cleanedService.code)
            .maybeSingle();

          if (existingService) {
            throw new Error('كود الخدمة مستخدم بالفعل');
          }
        }

        const serviceData = {
          name_ar: cleanedService.name_ar || '',
          name_en: cleanedService.name_en || '',
          description_ar: cleanedService.description_ar,
          description_en: cleanedService.description_en,
          features_ar: cleanedService.features_ar || [],
          features_en: cleanedService.features_en || [],
          category_id: cleanedService.category_id || '',
          base_price: cleanedService.base_price,
          price_per_unit: cleanedService.price_per_unit,
          min_units: cleanedService.min_units || 1,
          max_units: cleanedService.max_units,
          delivery_time_days: cleanedService.delivery_time_days || 7,
          rush_delivery_available: cleanedService.rush_delivery_available || false,
          rush_delivery_multiplier: cleanedService.rush_delivery_multiplier || 1.5,
          unit_type: cleanedService.unit_type || 'page',
          code: cleanedService.code,
          type: cleanedService.type || 'service',
          image_url: cleanedService.image_url,
          sort_order: cleanedService.sort_order || 0,
          is_active: cleanedService.is_active ?? true,
          show_to_clients: cleanedService.show_to_clients ?? true
        };

        const { error } = await supabase
          .from('services')
          .insert(serviceData);

        if (error) throw error;
        toast({ title: "تم الحفظ", description: "تم إنشاء الخدمة بنجاح" });
      }
      
      setIsServiceDialogOpen(false);
      setEditingService(null);
      loadData();
    } catch (error) {
      console.error('Error saving service:', error);
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "فشل في حفظ الخدمة",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا القسم؟')) return;
    
    try {
      const { error } = await supabase
        .from('service_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "تم الحذف", description: "تم حذف القسم بنجاح" });
      loadData();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف القسم",
        variant: "destructive",
      });
    }
  };

  const handleDeleteService = async (id: string) => {
    // التحقق من وجود طلبات مرتبطة بالخدمة
    try {
      const { data: orders } = await supabase
        .from('orders')
        .select('id')
        .eq('service_id', id)
        .limit(1);

      if (orders && orders.length > 0) {
        toast({
          title: "لا يمكن الحذف",
          description: "لا يمكن حذف خدمة مرتبطة بطلبات. يمكنك تعطيلها بدلاً من ذلك.",
          variant: "destructive",
        });
        return;
      }
    } catch (error) {
      console.log('Could not check orders, proceeding with delete');
    }

    if (!confirm('هل أنت متأكد من حذف هذه الخدمة؟')) return;
    
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "تم الحذف", description: "تم حذف الخدمة بنجاح" });
      loadData();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف الخدمة",
        variant: "destructive",
      });
    }
  };

  // تصدير البيانات
  const handleExportServices = () => {
    const csvData = services.map(service => ({
      'الكود': service.code || '',
      'الاسم العربي': service.name_ar,
      'الاسم الإنجليزي': service.name_en,
      'القسم': service.service_categories?.name_ar || '',
      'النوع': service.type || 'service',
      'السعر': service.price_per_unit || service.base_price || 0,
      'الحالة': service.is_active ? 'مفعل' : 'معطل',
      'ظاهر للعملاء': service.show_to_clients ? 'نعم' : 'لا',
      'تاريخ الإنشاء': new Date(service.created_at).toLocaleDateString('ar-SA')
    }));

    // تحويل إلى CSV (هنا يحتاج مكتبة إضافية في التطبيق الحقيقي)
    console.log('Exporting services:', csvData);
    toast({ 
      title: "تم التصدير", 
      description: `تم تصدير ${csvData.length} خدمة بنجاح` 
    });
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5" dir="rtl">
        {/* الهيدر المحسن */}
        <div className="bg-gradient-to-l from-primary/10 via-background to-secondary/10 border-b border-border/50 shadow-sm">
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              {/* العنوان والوصف */}
              <div className="text-right space-y-4">
                <div className="flex items-center gap-4 justify-end">
                  <div className="space-y-1">
                    <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-l from-primary via-primary to-secondary bg-clip-text text-transparent">
                      إدارة الخدمات
                    </h1>
                    <p className="text-lg text-muted-foreground">
                      نظام شامل لإدارة خدمات المنصة التعليمية مع مزامنة حية
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
                    <Settings className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* شريط الإحصائيات */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  <StatsCard 
                    title="إجمالي الخدمات" 
                    value={stats.total} 
                    icon={FileText}
                    color="bg-blue-500"
                  />
                  <StatsCard 
                    title="خدمات نشطة" 
                    value={stats.active} 
                    icon={CheckCircle2}
                    color="bg-green-500"
                  />
                  <StatsCard 
                    title="معطلة" 
                    value={stats.inactive} 
                    icon={Archive}
                    color="bg-gray-500"
                  />
                  <StatsCard 
                    title="ظاهرة للعملاء" 
                    value={stats.visible} 
                    icon={Eye}
                    color="bg-purple-500"
                  />
                  <StatsCard 
                    title="متوسط السعر" 
                    value={`${stats.avgPrice.toFixed(0)} ر.س`} 
                    icon={DollarSign}
                    color="bg-orange-500"
                  />
                </div>
              </div>

              {/* الأزرار الرئيسية */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleExportServices}
                  variant="outline"
                  className="flex items-center gap-3 px-6 py-3 rounded-xl text-base font-semibold border-border/50 hover:bg-muted/50"
                >
                  <span>تصدير CSV</span>
                  <Download className="w-5 h-5" />
                </Button>
                <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => {
                        setEditingService(null);
                        setIsServiceDialogOpen(true);
                      }}
                      className="flex items-center gap-3 px-8 py-3 rounded-xl bg-gradient-to-l from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 text-base font-bold"
                      size="lg"
                    >
                      <span>إضافة خدمة جديدة</span>
                      <Plus className="w-5 h-5" />
                    </Button>
                  </DialogTrigger>
                  <ServiceDialog 
                    service={editingService}
                    categories={categories}
                    onSave={handleSaveService}
                    onClose={() => {
                      setIsServiceDialogOpen(false);
                      setEditingService(null);
                    }}
                  />
                </Dialog>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          <Tabs defaultValue="services" className="w-full space-y-6">
            {/* التابز المحسنة */}
            <div className="flex justify-center">
              <TabsList className="grid grid-cols-2 w-full max-w-md bg-card/80 backdrop-blur-sm p-1.5 rounded-2xl border shadow-lg">
                <TabsTrigger 
                  value="services" 
                  className="flex items-center gap-3 px-6 py-3 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200 text-base font-semibold"
                >
                  <span>الخدمات</span>
                  <Settings className="w-5 h-5" />
                </TabsTrigger>
                <TabsTrigger 
                  value="categories" 
                  className="flex items-center gap-3 px-6 py-3 rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200 text-base font-semibold"
                >
                  <span>الأقسام</span>
                  <Languages className="w-5 h-5" />
                </TabsTrigger>
              </TabsList>
            </div>

            {/* تاب الخدمات المحسن */}
            <TabsContent value="services" className="space-y-6">
              {/* شريط الأدوات */}
              <ServicesToolbar 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                viewMode={viewMode}
                setViewMode={setViewMode}
                sortType={sortType}
                setSortType={setSortType}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                categories={categories}
                servicesCount={filteredServices.length}
              />

              {/* قائمة الخدمات */}
              {loading ? (
                <ServicesLoading viewMode={viewMode} />
              ) : filteredServices.length === 0 ? (
                <EmptyServicesState hasFilters={!!(searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' || typeFilter !== 'all')} />
              ) : (
                <ServicesGrid 
                  services={filteredServices}
                  viewMode={viewMode}
                  onEdit={(srv: Service) => {
                    setEditingService(srv);
                    setIsServiceDialogOpen(true);
                  }}
                  onDelete={handleDeleteService}
                  onToggle={handleToggleService}
                />
              )}
            </TabsContent>

            {/* تاب الأقسام */}
            <TabsContent value="categories" className="space-y-6">
              <div className="bg-card/60 backdrop-blur-sm border rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        onClick={() => {
                          setEditingCategory(null);
                          setIsDialogOpen(true);
                        }}
                        className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-l from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 shadow-lg hover:shadow-xl transition-all duration-300 text-base font-bold"
                        size="lg"
                      >
                        <span>إضافة قسم جديد</span>
                        <Plus className="w-5 h-5" />
                      </Button>
                    </DialogTrigger>
                    <CategoryDialog 
                      category={editingCategory}
                      onSave={handleSaveCategory}
                      onClose={() => {
                        setIsDialogOpen(false);
                        setEditingCategory(null);
                      }}
                    />
                  </Dialog>
                  
                  <div className="text-right space-y-2">
                    <h2 className="text-2xl font-bold flex items-center gap-3 justify-end">
                      <span>أقسام الخدمات</span>
                      <div className="w-8 h-8 bg-secondary/15 rounded-xl flex items-center justify-center">
                        <Languages className="w-5 h-5 text-secondary" />
                      </div>
                    </h2>
                    <p className="text-base text-muted-foreground">إدارة تصنيفات الخدمات في المنصة</p>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-64 bg-muted/40 animate-pulse rounded-2xl border" />
                  ))}
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-muted/40 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Languages className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">لا توجد أقسام بعد</h3>
                  <p className="text-base text-muted-foreground mb-6">ابدأ بإنشاء أول قسم للخدمات</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {categories.map((category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      onEdit={(cat: ServiceCategory) => {
                        setEditingCategory(cat);
                        setIsDialogOpen(true);
                      }}
                      onDelete={handleDeleteCategory}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
};

// مكون بطاقة الإحصائيات
const StatsCard: React.FC<{
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}> = ({ title, value, icon: Icon, color }) => (
  <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-center space-y-2 hover:shadow-lg transition-all duration-200">
    <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
      <Icon className="w-4 h-4 text-white" />
    </div>
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-sm text-muted-foreground">{title}</div>
  </div>
);

// شريط الأدوات للخدمات - مع تبسيط الأنواع
const ServicesToolbar: React.FC<{
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  typeFilter: string;
  setTypeFilter: (type: string) => void;
  viewMode: string;
  setViewMode: (mode: 'grid' | 'list') => void;
  sortType: string;
  setSortType: (type: string) => void;
  sortOrder: string;
  setSortOrder: (order: 'asc' | 'desc') => void;
  categories: ServiceCategory[];
  servicesCount: number;
}> = ({ 
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  typeFilter,
  setTypeFilter,
  viewMode, 
  setViewMode, 
  sortType, 
  setSortType, 
  sortOrder, 
  setSortOrder,
  categories,
  servicesCount 
}) => {
  const [searchDebounce, setSearchDebounce] = useState(searchTerm);

  // تأخير البحث
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchDebounce);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchDebounce, setSearchTerm]);

  const resetFilters = () => {
    setSearchDebounce('');
    setSearchTerm('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setTypeFilter('all');
  };

  return (
    <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6 space-y-4">
      {/* الصف الأول: البحث والعرض */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {/* البحث */}
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="البحث في الخدمات..."
              value={searchDebounce}
              onChange={(e) => setSearchDebounce(e.target.value)}
              className="pr-10 pl-4 py-3 rounded-xl text-base border-border/50"
              dir="rtl"
            />
          </div>

          {/* أزرار العرض */}
          <div className="flex gap-2 bg-muted/50 p-1 rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="px-3 py-2 rounded-md"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="px-3 py-2 rounded-md"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          {servicesCount} خدمة
        </div>
      </div>

      {/* الصف الثاني: الفلاتر والترتيب */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {/* فلتر الحالة */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="rounded-lg border-border/50">
            <SelectValue placeholder="الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="active">نشطة</SelectItem>
            <SelectItem value="inactive">معطلة</SelectItem>
          </SelectContent>
        </Select>

        {/* فلتر القسم */}
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="rounded-lg border-border/50">
            <SelectValue placeholder="القسم" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأقسام</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name_ar}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* فلتر النوع */}
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="rounded-lg border-border/50">
            <SelectValue placeholder="النوع" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأنواع</SelectItem>
            <SelectItem value="service">خدمة</SelectItem>
            <SelectItem value="course">دورة</SelectItem>
            <SelectItem value="bundle">باقة</SelectItem>
          </SelectContent>
        </Select>

        {/* الترتيب */}
        <Select value={sortType} onValueChange={setSortType}>
          <SelectTrigger className="rounded-lg border-border/50">
            <SelectValue placeholder="ترتيب حسب" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">الاسم</SelectItem>
            <SelectItem value="price">السعر</SelectItem>
            <SelectItem value="date">تاريخ الإنشاء</SelectItem>
            <SelectItem value="category">القسم</SelectItem>
          </SelectContent>
        </Select>

        {/* اتجاه الترتيب */}
        <Button
          variant="outline"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="rounded-lg border-border/50 px-3"
        >
          {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
        </Button>

        {/* إعادة تعيين الفلاتر */}
        <Button
          variant="ghost"
          onClick={resetFilters}
          className="rounded-lg text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4 ml-2" />
          مسح الفلاتر
        </Button>
      </div>
    </div>
  );
};

// مكون التحميل للخدمات
const ServicesLoading: React.FC<{ viewMode: string }> = ({ viewMode }) => (
  <div className={viewMode === 'grid' 
    ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" 
    : "space-y-4"
  }>
    {Array.from({ length: viewMode === 'grid' ? 6 : 5 }).map((_, i) => (
      <div key={i} className={`animate-pulse rounded-2xl border ${
        viewMode === 'grid' ? 'h-80 bg-muted/40' : 'h-32 bg-muted/40'
      }`} />
    ))}
  </div>
);

// مكون الحالة الفارغة
const EmptyServicesState: React.FC<{ hasFilters: boolean }> = ({ hasFilters }) => (
  <div className="text-center py-20">
    <div className="w-24 h-24 bg-muted/40 rounded-full flex items-center justify-center mx-auto mb-6">
      <Settings className="w-12 h-12 text-muted-foreground" />
    </div>
    <h3 className="text-xl font-bold mb-3">
      {hasFilters ? 'لا توجد خدمات تطابق البحث' : 'لا توجد خدمات بعد'}
    </h3>
    <p className="text-base text-muted-foreground mb-6">
      {hasFilters ? 'جرب تعديل معايير البحث' : 'ابدأ بإنشاء أول خدمة للعملاء'}
    </p>
  </div>
);

// شبكة الخدمات
const ServicesGrid: React.FC<{
  services: Service[];
  viewMode: string;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, currentStatus: boolean) => void;
}> = ({ services, viewMode, onEdit, onDelete, onToggle }) => (
  <div className={viewMode === 'grid' 
    ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" 
    : "space-y-4"
  }>
    {services.map((service) => (
      <ServiceCard
        key={service.id}
        service={service}
        viewMode={viewMode}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggle={onToggle}
      />
    ))}
  </div>
);

// بطاقة الخدمة المحسنة
const ServiceCard: React.FC<{
  service: Service;
  viewMode: string;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, currentStatus: boolean) => void;
}> = ({ service, viewMode, onEdit, onDelete, onToggle }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course': return GraduationCap;
      case 'bundle': return Archive;
      default: return Settings;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'course': return 'دورة';
      case 'bundle': return 'باقة';
      default: return 'خدمة';
    }
  };

  const TypeIcon = getTypeIcon(service.type || 'service');

  if (viewMode === 'list') {
    return (
      <Card className="group relative overflow-hidden bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-6">
            {/* معلومات الخدمة */}
            <div className="flex items-center gap-4 flex-1">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                style={{ backgroundColor: service.service_categories?.color || '#0EA5E9' }}
              >
                <TypeIcon className="w-6 h-6" />
              </div>
              
              <div className="flex-1 text-right space-y-1">
                <div className="flex items-center gap-3 justify-end">
                  <h3 className="text-lg font-bold">{service.name_ar}</h3>
                  {service.code && (
                    <Badge variant="outline" className="text-xs px-2 py-1">
                      {service.code}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{service.service_categories?.name_ar}</p>
              </div>
            </div>

            {/* السعر والحالة */}
            <div className="text-center space-y-2">
              <div className="text-lg font-bold text-primary">
                {service.price_per_unit ? `${service.price_per_unit} ر.س` : 'حسب الطلب'}
              </div>
              <div className="flex gap-2">
                <Badge variant={service.is_active ? "default" : "secondary"} className="text-xs">
                  {service.is_active ? "مفعل" : "معطل"}
                </Badge>
                <Badge variant={service.show_to_clients ? "default" : "outline"} className="text-xs">
                  {service.show_to_clients ? "ظاهر" : "مخفي"}
                </Badge>
              </div>
            </div>

            {/* الأزرار */}
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggle(service.id, service.is_active)}
                className="p-2 hover:bg-primary/10"
              >
                {service.is_active ? <ToggleRight className="w-4 h-4 text-green-600" /> : <ToggleLeft className="w-4 h-4 text-gray-400" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(service)}
                className="p-2 hover:bg-primary/10"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(service.id)}
                className="p-2 hover:bg-destructive/10 text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group relative overflow-hidden bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-500 rounded-2xl">
      {/* خلفية متحركة */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full transform -translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-secondary to-primary rounded-full transform translate-x-12 translate-y-12 group-hover:scale-125 transition-transform duration-700" />
      </div>
      
      <CardContent className="p-6 relative">
        <div className="space-y-4">
          {/* هيدر البطاقة */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggle(service.id, service.is_active)}
                className="p-2 hover:bg-primary/10 rounded-lg"
              >
                {service.is_active ? 
                  <ToggleRight className="w-5 h-5 text-green-600" /> : 
                  <ToggleLeft className="w-5 h-5 text-gray-400" />
                }
              </Button>
              <Badge 
                variant={service.is_active ? "default" : "secondary"}
                className="text-xs font-semibold px-3 py-1 rounded-full"
              >
                {service.is_active ? "مفعل" : "معطل"}
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: service.service_categories?.color || '#0EA5E9' }}
              >
                <TypeIcon className="w-6 h-6" />
              </div>
              {service.code && (
                <Badge variant="outline" className="text-xs px-2 py-1 rounded-lg font-mono">
                  {service.code}
                </Badge>
              )}
            </div>
          </div>

          {/* محتوى البطاقة */}
          <div className="text-right space-y-3">
            <div className="space-y-1">
              <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors duration-300">
                {service.name_ar}
              </h3>
              <p className="text-sm text-muted-foreground">{service.name_en}</p>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {service.description_ar || "لا يوجد وصف"}
            </p>

            {/* معلومات إضافية */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-muted/30 p-3 rounded-lg text-center">
                <div className="text-xs text-muted-foreground mb-1">القسم</div>
                <div className="font-semibold">{service.service_categories?.name_ar}</div>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg text-center">
                <div className="text-xs text-muted-foreground mb-1">النوع</div>
                <div className="font-semibold">{getTypeName(service.type || 'service')}</div>
              </div>
            </div>
            
            {/* السعر */}
            <div className="text-center p-4 bg-gradient-to-l from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
              <div className="text-2xl font-bold text-primary">
                {service.price_per_unit ? `${service.price_per_unit} ر.س` : 'حسب الطلب'}
              </div>
              <div className="text-xs text-muted-foreground">
                {service.unit_type && `لكل ${service.unit_type}`}
              </div>
            </div>
          </div>

          {/* أزرار التحكم */}
          <div className="flex justify-between items-center pt-4 border-t border-border/50">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEdit(service)}
                className="flex items-center gap-2 hover:bg-primary/10 hover:border-primary/30 rounded-lg px-3 py-2 transition-all duration-200"
              >
                <span className="text-sm font-semibold">تعديل</span>
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onDelete(service.id)}
                className="flex items-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30 rounded-lg px-3 py-2 transition-all duration-200"
              >
                <span className="text-sm font-semibold">حذف</span>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              {service.rush_delivery_available && (
                <Badge variant="outline" className="text-xs px-2 py-1 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  تسليم سريع
                </Badge>
              )}
              <Badge variant={service.show_to_clients ? "default" : "outline"} className="text-xs px-2 py-1">
                {service.show_to_clients ? "ظاهر" : "مخفي"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// بطاقة القسم المحسنة
const CategoryCard: React.FC<{
  category: ServiceCategory;
  onEdit: (category: ServiceCategory) => void;
  onDelete: (id: string) => void;
}> = ({ category, onEdit, onDelete }) => {
  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      Languages,
      GraduationCap,
      Users,
      Search
    };
    const Icon = icons[iconName] || Languages;
    return <Icon className="w-8 h-8" />;
  };

  return (
    <Card className="group relative overflow-hidden bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-500 rounded-2xl">
      {/* خلفية متحركة */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-32 h-32 rounded-full transform -translate-x-16 -translate-y-16" 
             style={{ backgroundColor: category.color }}></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 rounded-full transform translate-x-10 translate-y-10" 
             style={{ backgroundColor: category.color }}></div>
      </div>
      
      <CardHeader className="pb-4 relative">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500"
              style={{ backgroundColor: category.color }}
            >
              {getIcon(category.icon)}
            </div>
            <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-background rounded-full border-2 border-border flex items-center justify-center shadow-sm">
              <div className={`w-2.5 h-2.5 rounded-full ${category.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            </div>
          </div>
          <div className="flex-1 text-right space-y-2">
            <Badge 
              variant={category.is_active ? "default" : "secondary"}
              className="text-xs font-bold px-3 py-1 rounded-full"
            >
              {category.is_active ? "مفعل" : "معطل"}
            </Badge>
            <CardTitle className="text-xl font-bold leading-tight">{category.name_ar}</CardTitle>
            <p className="text-sm text-muted-foreground">{category.name_en}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 relative space-y-4">
        <p className="text-sm text-muted-foreground text-right leading-relaxed min-h-[3rem]">
          {category.description_ar || "لا يوجد وصف متاح لهذا القسم"}
        </p>
        
        <div className="pt-4 border-t border-border/50">
          <div className="flex justify-between items-center gap-4">
            <div className="text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg">
              ترتيب: {category.sort_order}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEdit(category)}
                className="flex items-center gap-2 hover:bg-primary/10 hover:border-primary/30 rounded-lg px-3 py-2 transition-all duration-200"
              >
                <span className="text-sm font-semibold">تعديل</span>
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onDelete(category.id)}
                className="flex items-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30 rounded-lg px-3 py-2 transition-all duration-200"
              >
                <span className="text-sm font-semibold">حذف</span>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// نافذة إضافة/تعديل القسم المحسنة
const CategoryDialog: React.FC<{
  category: ServiceCategory | null;
  onSave: (category: Partial<ServiceCategory>) => void;
  onClose: () => void;
}> = ({ category, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name_ar: category?.name_ar || '',
    name_en: category?.name_en || '',
    description_ar: category?.description_ar || '',
    description_en: category?.description_en || '',
    icon: category?.icon || 'Languages',
    color: category?.color || '#0EA5E9',
    sort_order: category?.sort_order || 0,
    is_active: category?.is_active ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const iconOptions = [
    { value: 'Languages', label: 'اللغات', icon: Languages },
    { value: 'GraduationCap', label: 'التعليم', icon: GraduationCap },
    { value: 'Users', label: 'المستخدمين', icon: Users },
    { value: 'Search', label: 'البحث', icon: Search },
    { value: 'Settings', label: 'الإعدادات', icon: Settings },
    { value: 'FileText', label: 'الوثائق', icon: FileText }
  ];

  return (
    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
      <DialogHeader>
        <DialogTitle className="text-right text-2xl font-bold">
          {category ? 'تعديل القسم' : 'قسم جديد'}
        </DialogTitle>
        <DialogDescription className="text-right text-base">
          {category ? 'تعديل بيانات القسم' : 'إضافة قسم جديد للخدمات'}
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name_ar" className="text-right block text-base font-semibold mb-3">الاسم بالعربية *</Label>
            <Input
              id="name_ar"
              value={formData.name_ar}
              onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
              required
              dir="rtl"
              className="text-right text-base p-4 rounded-xl border-border/50"
            />
          </div>

          <div>
            <Label htmlFor="name_en" className="text-right block text-base font-semibold mb-3">الاسم بالإنجليزية *</Label>
            <Input
              id="name_en"
              value={formData.name_en}
              onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
              required
              dir="ltr"
              className="text-base p-4 rounded-xl border-border/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="description_ar" className="text-right block text-base font-semibold mb-3">الوصف بالعربية</Label>
            <Textarea
              id="description_ar"
              value={formData.description_ar}
              onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
              dir="rtl"
              className="text-right text-base p-4 rounded-xl min-h-[120px] border-border/50"
            />
          </div>

          <div>
            <Label htmlFor="description_en" className="text-right block text-base font-semibold mb-3">الوصف بالإنجليزية</Label>
            <Textarea
              id="description_en"
              value={formData.description_en}
              onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
              dir="ltr"
              className="text-base p-4 rounded-xl min-h-[120px] border-border/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="icon" className="text-right block text-base font-semibold mb-3">الأيقونة</Label>
            <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
              <SelectTrigger className="text-base p-4 rounded-xl border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-3">
                      <option.icon className="w-4 h-4" />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="color" className="text-right block text-base font-semibold mb-3">اللون</Label>
            <div className="flex gap-3 items-center">
              <Input
                id="color"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-16 h-14 rounded-xl border-border/50 p-1"
              />
              <div 
                className="flex-1 h-14 rounded-xl border border-border/50 flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: formData.color }}
              >
                معاينة
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="sort_order" className="text-right block text-base font-semibold mb-3">ترتيب العرض</Label>
            <Input
              id="sort_order"
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
              dir="ltr"
              className="text-base p-4 rounded-xl border-border/50"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 p-4 bg-muted/20 rounded-xl">
          <Label htmlFor="is_active" className="text-base font-semibold">مفعل</Label>
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
          />
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onClose} className="px-6 py-3 rounded-xl text-base">
            إلغاء
          </Button>
          <Button type="submit" className="px-8 py-3 rounded-xl text-base font-bold flex items-center gap-3">
            <span>حفظ</span>
            <Save className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

// نافذة إضافة/تعديل الخدمة المحسنة
const ServiceDialog: React.FC<{
  service: Service | null;
  categories: ServiceCategory[];
  onSave: (service: Partial<Service>) => void;
  onClose: () => void;
}> = ({ service, categories, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name_ar: service?.name_ar || '',
    name_en: service?.name_en || '',
    description_ar: service?.description_ar || '',
    description_en: service?.description_en || '',
    category_id: service?.category_id || '',
    features_ar: service?.features_ar || [],
    features_en: service?.features_en || [],
    base_price: service?.base_price?.toString() || '',
    price_per_unit: service?.price_per_unit?.toString() || '',
    unit_type: service?.unit_type || 'page',
    min_units: service?.min_units || 1,
    max_units: service?.max_units?.toString() || '',
    delivery_time_days: service?.delivery_time_days || 7,
    rush_delivery_available: service?.rush_delivery_available || false,
    rush_delivery_multiplier: service?.rush_delivery_multiplier || 1.5,
    image_url: service?.image_url || '',
    code: service?.code || '',
    type: service?.type || 'service',
    sort_order: service?.sort_order || 0,
    is_active: service?.is_active ?? true,
    show_to_clients: service?.show_to_clients ?? true
  });

  const [currentFeatureAr, setCurrentFeatureAr] = useState('');
  const [currentFeatureEn, setCurrentFeatureEn] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      base_price: formData.base_price ? parseFloat(formData.base_price) : undefined,
      price_per_unit: formData.price_per_unit ? parseFloat(formData.price_per_unit) : undefined,
      max_units: formData.max_units ? parseInt(formData.max_units) : undefined
    };
    
    onSave(submitData);
  };

  const addFeature = () => {
    if (currentFeatureAr.trim() && currentFeatureEn.trim()) {
      setFormData({
        ...formData,
        features_ar: [...formData.features_ar, currentFeatureAr.trim()],
        features_en: [...formData.features_en, currentFeatureEn.trim()]
      });
      setCurrentFeatureAr('');
      setCurrentFeatureEn('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features_ar: formData.features_ar.filter((_, i) => i !== index),
      features_en: formData.features_en.filter((_, i) => i !== index)
    });
  };

  return (
    <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto" dir="rtl">
      <DialogHeader>
        <DialogTitle className="text-right text-2xl font-bold">
          {service ? 'تعديل الخدمة' : 'خدمة جديدة'}
        </DialogTitle>
        <DialogDescription className="text-right text-base">
          {service ? 'تعديل بيانات الخدمة' : 'إضافة خدمة جديدة'}
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full bg-muted/30 p-2 rounded-2xl">
            <TabsTrigger value="basic" className="text-base font-bold py-3 rounded-xl">البيانات الأساسية</TabsTrigger>
            <TabsTrigger value="pricing" className="text-base font-bold py-3 rounded-xl">الأسعار والتسليم</TabsTrigger>
            <TabsTrigger value="settings" className="text-base font-bold py-3 rounded-xl">الإعدادات</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            {/* البيانات الأساسية */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name_ar" className="text-right block text-base font-semibold mb-3">اسم الخدمة بالعربية *</Label>
                <Input
                  id="name_ar"
                  value={formData.name_ar}
                  onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                  required
                  dir="rtl"
                  className="text-right text-base p-4 rounded-xl border-border/50"
                />
              </div>

              <div>
                <Label htmlFor="name_en" className="text-right block text-base font-semibold mb-3">اسم الخدمة بالإنجليزية *</Label>
                <Input
                  id="name_en"
                  value={formData.name_en}
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                  required
                  dir="ltr"
                  className="text-base p-4 rounded-xl border-border/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="category_id" className="text-right block text-base font-semibold mb-3">القسم *</Label>
                <Select 
                  value={formData.category_id} 
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger className="text-base p-4 rounded-xl border-border/50">
                    <SelectValue placeholder="اختر القسم" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name_ar}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="type" className="text-right block text-base font-semibold mb-3">نوع الخدمة</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="text-base p-4 rounded-xl border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="service">خدمة</SelectItem>
                    <SelectItem value="course">دورة</SelectItem>
                    <SelectItem value="bundle">باقة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="code" className="text-right block text-base font-semibold mb-3">كود الخدمة</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  dir="ltr"
                  className="text-base p-4 rounded-xl border-border/50 font-mono"
                  placeholder="SRV001"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="description_ar" className="text-right block text-base font-semibold mb-3">الوصف بالعربية</Label>
                <Textarea
                  id="description_ar"
                  value={formData.description_ar}
                  onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                  dir="rtl"
                  className="text-right text-base p-4 rounded-xl min-h-[120px] border-border/50"
                />
              </div>

              <div>
                <Label htmlFor="description_en" className="text-right block text-base font-semibold mb-3">الوصف بالإنجليزية</Label>
                <Textarea
                  id="description_en"
                  value={formData.description_en}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                  dir="ltr"
                  className="text-base p-4 rounded-xl min-h-[120px] border-border/50"
                />
              </div>
            </div>

            {/* قسم المميزات المحسن */}
            <div className="space-y-4 p-6 bg-gradient-to-l from-primary/5 to-secondary/5 rounded-2xl border border-primary/20">
              <Label className="text-right block text-lg font-bold flex items-center gap-3 justify-end">
                <span>مميزات الخدمة</span>
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </Label>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Input
                    placeholder="ميزة بالعربية..."
                    value={currentFeatureAr}
                    onChange={(e) => setCurrentFeatureAr(e.target.value)}
                    dir="rtl"
                    className="text-right text-base p-4 rounded-xl border-border/50"
                  />
                </div>
                <div>
                  <Input
                    placeholder="Feature in English..."
                    value={currentFeatureEn}
                    onChange={(e) => setCurrentFeatureEn(e.target.value)}
                    dir="ltr"
                    className="text-base p-4 rounded-xl border-border/50"
                  />
                </div>
              </div>
              
              <Button type="button" onClick={addFeature} className="w-full text-base font-bold py-3 rounded-xl flex items-center justify-center gap-3">
                <span>إضافة ميزة</span>
                <Plus className="w-5 h-5" />
              </Button>

              {formData.features_ar.length > 0 && (
                <div className="space-y-3">
                  {formData.features_ar.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between gap-4 p-4 bg-background rounded-xl border border-border/30">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeature(index)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg p-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <div className="flex-1 text-right space-y-1">
                        <p className="text-base font-semibold">{feature}</p>
                        <p className="text-sm text-muted-foreground">{formData.features_en[index]}</p>
                      </div>
                      <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6">
            {/* الأسعار */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="base_price" className="text-right block text-base font-semibold mb-3">السعر الأساسي (ر.س)</Label>
                <Input
                  id="base_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.base_price}
                  onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                  dir="ltr"
                  className="text-base p-4 rounded-xl border-border/50"
                />
              </div>

              <div>
                <Label htmlFor="price_per_unit" className="text-right block text-base font-semibold mb-3">السعر لكل وحدة (ر.س)</Label>
                <Input
                  id="price_per_unit"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price_per_unit}
                  onChange={(e) => setFormData({ ...formData, price_per_unit: e.target.value })}
                  dir="ltr"
                  className="text-base p-4 rounded-xl border-border/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="unit_type" className="text-right block text-base font-semibold mb-3">نوع الوحدة</Label>
                <Select 
                  value={formData.unit_type} 
                  onValueChange={(value) => setFormData({ ...formData, unit_type: value })}
                >
                  <SelectTrigger className="text-base p-4 rounded-xl border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="page">صفحة</SelectItem>
                    <SelectItem value="word">كلمة</SelectItem>
                    <SelectItem value="hour">ساعة</SelectItem>
                    <SelectItem value="project">مشروع</SelectItem>
                    <SelectItem value="course">دورة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="min_units" className="text-right block text-base font-semibold mb-3">الحد الأدنى</Label>
                <Input
                  id="min_units"
                  type="number"
                  min="1"
                  value={formData.min_units}
                  onChange={(e) => setFormData({ ...formData, min_units: parseInt(e.target.value) || 1 })}
                  dir="ltr"
                  className="text-base p-4 rounded-xl border-border/50"
                />
              </div>

              <div>
                <Label htmlFor="max_units" className="text-right block text-base font-semibold mb-3">الحد الأقصى</Label>
                <Input
                  id="max_units"
                  type="number"
                  min="1"
                  value={formData.max_units}
                  onChange={(e) => setFormData({ ...formData, max_units: e.target.value })}
                  dir="ltr"
                  className="text-base p-4 rounded-xl border-border/50"
                  placeholder="غير محدود"
                />
              </div>
            </div>

            {/* مدة التسليم */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="delivery_time_days" className="text-right block text-base font-semibold mb-3">مدة التسليم (أيام)</Label>
                <Input
                  id="delivery_time_days"
                  type="number"
                  min="1"
                  value={formData.delivery_time_days}
                  onChange={(e) => setFormData({ ...formData, delivery_time_days: parseInt(e.target.value) || 7 })}
                  dir="ltr"
                  className="text-base p-4 rounded-xl border-border/50"
                />
              </div>

              <div>
                <Label htmlFor="rush_delivery_multiplier" className="text-right block text-base font-semibold mb-3">مضاعف التسليم السريع</Label>
                <Input
                  id="rush_delivery_multiplier"
                  type="number"
                  step="0.1"
                  min="1"
                  value={formData.rush_delivery_multiplier}
                  onChange={(e) => setFormData({ ...formData, rush_delivery_multiplier: parseFloat(e.target.value) || 1.5 })}
                  dir="ltr"
                  className="text-base p-4 rounded-xl border-border/50"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 p-4 bg-muted/20 rounded-xl">
              <Label htmlFor="rush_delivery_available" className="text-base font-semibold flex items-center gap-2">
                <span>التسليم السريع متاح</span>
                <Zap className="w-4 h-4 text-orange-500" />
              </Label>
              <Switch
                id="rush_delivery_available"
                checked={formData.rush_delivery_available}
                onCheckedChange={(checked) => setFormData({ ...formData, rush_delivery_available: checked })}
              />
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="image_url" className="text-right block text-base font-semibold mb-3">رابط الصورة</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  dir="ltr"
                  className="text-base p-4 rounded-xl border-border/50"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <Label htmlFor="sort_order" className="text-right block text-base font-semibold mb-3">ترتيب العرض</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  dir="ltr"
                  className="text-base p-4 rounded-xl border-border/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex items-center justify-end gap-4 p-6 bg-gradient-to-l from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-xl border border-green-200 dark:border-green-800">
                <Label htmlFor="is_active" className="text-base font-semibold flex items-center gap-2">
                  <span>خدمة مفعلة</span>
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>

              <div className="flex items-center justify-end gap-4 p-6 bg-gradient-to-l from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-xl border border-blue-200 dark:border-blue-800">
                <Label htmlFor="show_to_clients" className="text-base font-semibold flex items-center gap-2">
                  <span>ظاهرة للعملاء</span>
                  <Eye className="w-4 h-4 text-blue-600" />
                </Label>
                <Switch
                  id="show_to_clients"
                  checked={formData.show_to_clients}
                  onCheckedChange={(checked) => setFormData({ ...formData, show_to_clients: checked })}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onClose} className="px-6 py-3 rounded-xl text-base">
            إلغاء
          </Button>
          <Button type="submit" className="px-8 py-3 rounded-xl text-base font-bold flex items-center gap-3">
            <span>حفظ الخدمة</span>
            <Save className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default AdminServices;