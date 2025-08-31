import React, { useState, useEffect } from 'react';
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
  Settings
} from 'lucide-react';

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
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('service_categories')
        .select('*')
        .order('sort_order', { ascending: true });

      // Load services with categories
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

  const handleSaveCategory = async (category: Partial<ServiceCategory>) => {
    try {
      if (editingCategory?.id) {
        // تحديث
        const { error } = await supabase
          .from('service_categories')
          .update(category)
          .eq('id', editingCategory.id);

        if (error) throw error;
        toast({ title: "تم التحديث", description: "تم تحديث القسم بنجاح" });
      } else {
        // إنشاء جديد
        const categoryData = {
          name_ar: category.name_ar || '',
          name_en: category.name_en || '',
          description_ar: category.description_ar,
          description_en: category.description_en,
          icon: category.icon || 'Languages',
          color: category.color || '#3B82F6',
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
      if (editingService?.id) {
        // تحديث
        const { error } = await supabase
          .from('services')
          .update(service)
          .eq('id', editingService.id);

        if (error) throw error;
        toast({ title: "تم التحديث", description: "تم تحديث الخدمة بنجاح" });
      } else {
        // إنشاء جديد
        const serviceData = {
          name_ar: service.name_ar || '',
          name_en: service.name_en || '',
          description_ar: service.description_ar,
          description_en: service.description_en,
          features_ar: service.features_ar || [],
          features_en: service.features_en || [],
          category_id: service.category_id || '',
          base_price: service.base_price,
          price_per_unit: service.price_per_unit,
          min_units: service.min_units || 1,
          max_units: service.max_units,
          delivery_time_days: service.delivery_time_days || 7,
          rush_delivery_available: service.rush_delivery_available || false,
          rush_delivery_multiplier: service.rush_delivery_multiplier || 1.5,
          unit_type: service.unit_type || 'page',
          image_url: service.image_url,
          sort_order: service.sort_order || 0,
          is_active: service.is_active ?? true,
          show_to_clients: service.show_to_clients ?? true
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
        description: "فشل في حفظ الخدمة",
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

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30" dir="rtl">
        {/* العنوان الرئيسي */}
        <div className="bg-gradient-to-r from-primary/5 via-background to-secondary/5 border-b shadow-sm">
          <div className="container mx-auto px-8 py-10">
            <div className="flex items-center justify-between">
              {/* الإحصائيات - يسار */}
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{services.filter(s => s.is_active).length}</div>
                <div className="text-sm text-muted-foreground font-medium">خدمة نشطة</div>
              </div>
              
              {/* المحتوى الرئيسي - وسط ويمين */}
              <div className="flex items-center gap-8">
                <div className="text-right space-y-3">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    إدارة الخدمات والأقسام
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    إدارة شاملة لجميع أقسام وخدمات المنصة التعليمية
                  </p>
                  <div className="flex items-center gap-8 justify-end">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-semibold">{categories.length} قسم</span>
                      <div className="w-4 h-4 bg-gradient-to-r from-primary to-primary/70 rounded-full shadow-sm"></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-semibold">{services.length} خدمة</span>
                      <div className="w-4 h-4 bg-gradient-to-r from-secondary to-secondary/70 rounded-full shadow-sm"></div>
                    </div>
                  </div>
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-primary via-primary to-primary/80 rounded-3xl flex items-center justify-center shadow-xl">
                  <Settings className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-8 py-10">
          <Tabs defaultValue="categories" className="w-full space-y-8">
            {/* التابز */}
            <div className="flex justify-center">
              <TabsList className="grid grid-cols-2 w-full max-w-lg bg-card/80 backdrop-blur-sm p-2 rounded-3xl border shadow-lg">
                <TabsTrigger 
                  value="categories" 
                  className="flex items-center gap-4 px-8 py-4 rounded-2xl data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-300"
                >
                  <span className="font-bold text-lg">الأقسام</span>
                  <Languages className="w-6 h-6" />
                </TabsTrigger>
                <TabsTrigger 
                  value="services" 
                  className="flex items-center gap-4 px-8 py-4 rounded-2xl data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-300"
                >
                  <span className="font-bold text-lg">الخدمات</span>
                  <Settings className="w-6 h-6" />
                </TabsTrigger>
              </TabsList>
            </div>

            {/* تاب الأقسام */}
            <TabsContent value="categories" className="space-y-8">
              <div className="bg-card/60 backdrop-blur-sm border rounded-3xl p-8 shadow-lg">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        onClick={() => {
                          setEditingCategory(null);
                          setIsDialogOpen(true);
                        }}
                        className="flex items-center gap-4 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-bold"
                        size="lg"
                      >
                        <span>إضافة قسم جديد</span>
                        <Plus className="w-6 h-6" />
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
                    <h2 className="text-3xl font-bold flex items-center gap-4 justify-end">
                      <span>أقسام الخدمات</span>
                      <div className="w-10 h-10 bg-primary/15 rounded-2xl flex items-center justify-center">
                        <Languages className="w-6 h-6 text-primary" />
                      </div>
                    </h2>
                    <p className="text-lg text-muted-foreground">إدارة تصنيفات الخدمات الأساسية في المنصة</p>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-72 bg-gradient-to-br from-muted/40 to-muted/20 animate-pulse rounded-3xl border" />
                  ))}
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-24">
                  <div className="w-32 h-32 bg-muted/40 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Languages className="w-16 h-16 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">لا توجد أقسام بعد</h3>
                  <p className="text-lg text-muted-foreground mb-8">ابدأ بإنشاء أول قسم للخدمات</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {categories.map((category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      onEdit={(cat) => {
                        setEditingCategory(cat);
                        setIsDialogOpen(true);
                      }}
                      onDelete={handleDeleteCategory}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* تاب الخدمات */}
            <TabsContent value="services" className="space-y-8">
              <div className="bg-card/60 backdrop-blur-sm border rounded-3xl p-8 shadow-lg">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                  <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        onClick={() => {
                          setEditingService(null);
                          setIsServiceDialogOpen(true);
                        }}
                        className="flex items-center gap-4 px-8 py-4 rounded-2xl bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-bold"
                        size="lg"
                        variant="secondary"
                      >
                        <span>إضافة خدمة جديدة</span>
                        <Plus className="w-6 h-6" />
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
                  
                  <div className="text-right space-y-2">
                    <h2 className="text-3xl font-bold flex items-center gap-4 justify-end">
                      <span>إدارة الخدمات</span>
                      <div className="w-10 h-10 bg-secondary/15 rounded-2xl flex items-center justify-center">
                        <Settings className="w-6 h-6 text-secondary" />
                      </div>
                    </h2>
                    <p className="text-lg text-muted-foreground">إدارة جميع الخدمات المتاحة للعملاء في المنصة</p>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="space-y-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-48 bg-gradient-to-br from-muted/40 to-muted/20 animate-pulse rounded-3xl border" />
                  ))}
                </div>
              ) : services.length === 0 ? (
                <div className="text-center py-24">
                  <div className="w-32 h-32 bg-muted/40 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Settings className="w-16 h-16 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">لا توجد خدمات بعد</h3>
                  <p className="text-lg text-muted-foreground mb-8">ابدأ بإنشاء أول خدمة للعملاء</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {services.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onEdit={(srv) => {
                        setEditingService(srv);
                        setIsServiceDialogOpen(true);
                      }}
                      onDelete={handleDeleteService}
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

// كارت القسم
const CategoryCard = ({ 
  category, 
  onEdit, 
  onDelete 
}: { 
  category: ServiceCategory;
  onEdit: (category: ServiceCategory) => void;
  onDelete: (id: string) => void;
}) => {
  const getIcon = (iconName: string) => {
    const icons: any = {
      Languages,
      GraduationCap,
      Users,
      Search
    };
    const Icon = icons[iconName] || Languages;
    return <Icon className="w-8 h-8" />;
  };

  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm border-2 border-border/40 hover:border-primary/30 hover:shadow-2xl transition-all duration-500 rounded-3xl">
      {/* خلفية زخرفية */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full" style={{ backgroundColor: category.color }}></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full" style={{ backgroundColor: category.color }}></div>
      </div>
      
      <CardHeader className="pb-6 relative">
        <div className="flex items-start gap-6">
          <div className="relative">
            <div 
              className="w-20 h-20 rounded-3xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-500"
              style={{ backgroundColor: category.color }}
            >
              {getIcon(category.icon)}
            </div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-background rounded-full border-2 border-border flex items-center justify-center shadow-lg">
              <div className={`w-3 h-3 rounded-full ${category.is_active ? 'bg-green-500' : 'bg-muted-foreground'}`}></div>
            </div>
          </div>
          <div className="flex-1 text-right space-y-3">
            <Badge 
              variant={category.is_active ? "default" : "secondary"}
              className="text-sm font-bold px-4 py-2 rounded-full"
            >
              {category.is_active ? "مفعل" : "معطل"}
            </Badge>
            <CardTitle className="text-2xl font-bold leading-tight">{category.name_ar}</CardTitle>
            <p className="text-base text-muted-foreground">{category.name_en}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 relative space-y-6">
        <p className="text-base text-muted-foreground text-right leading-relaxed min-h-[4rem]">
          {category.description_ar || "لا يوجد وصف متاح لهذا القسم"}
        </p>
        
        <div className="pt-6 border-t border-border/50">
          <div className="flex justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground bg-muted/30 px-3 py-2 rounded-xl">
              ترتيب: {category.sort_order}
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEdit(category)}
                className="flex items-center gap-2 hover:bg-primary/10 hover:border-primary/30 rounded-xl px-4 py-2 transition-all duration-300"
              >
                <span className="font-semibold">تعديل</span>
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onDelete(category.id)}
                className="flex items-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30 rounded-xl px-4 py-2 transition-all duration-300"
              >
                <span className="font-semibold">حذف</span>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// كارت الخدمة
const ServiceCard = ({ 
  service, 
  onEdit, 
  onDelete 
}: { 
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
}) => {
  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm border-2 border-border/40 hover:border-secondary/30 hover:shadow-2xl transition-all duration-500 rounded-3xl">
      {/* خلفية زخرفية */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-40 h-40 bg-secondary rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-primary rounded-full"></div>
      </div>
      
      <CardContent className="p-8 relative">
        <div className="flex items-start gap-8">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-xl"
            style={{ backgroundColor: service.service_categories?.color || '#3B82F6' }}
          >
            <Settings className="w-8 h-8" />
          </div>
          
          <div className="flex-1 text-right space-y-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold leading-tight">{service.name_ar}</h3>
              <p className="text-base text-muted-foreground">{service.name_en}</p>
            </div>
            
            <p className="text-base text-muted-foreground leading-relaxed">
              {service.description_ar || "لا يوجد وصف"}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-right bg-muted/20 p-4 rounded-2xl">
                <p className="text-sm text-muted-foreground mb-1">القسم</p>
                <p className="text-base font-bold">{service.service_categories?.name_ar}</p>
              </div>
              <div className="text-right bg-muted/20 p-4 rounded-2xl">
                <p className="text-sm text-muted-foreground mb-1">مدة التسليم</p>
                <p className="text-base font-bold">{service.delivery_time_days} أيام</p>
              </div>
              <div className="text-right bg-muted/20 p-4 rounded-2xl">
                <p className="text-sm text-muted-foreground mb-1">الحد الأدنى</p>
                <p className="text-base font-bold">{service.min_units} {service.unit_type}</p>
              </div>
              <div className="text-right bg-muted/20 p-4 rounded-2xl">
                <p className="text-sm text-muted-foreground mb-1">السعر لكل وحدة</p>
                <p className="text-base font-bold">
                  {service.price_per_unit ? `${service.price_per_unit} ريال` : 'حسب الطلب'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/30">
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onEdit(service)}
                  className="flex items-center gap-2 hover:bg-primary/10 hover:border-primary/30 rounded-xl px-4 py-2 transition-all duration-300"
                >
                  <span className="font-semibold">تعديل</span>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onDelete(service.id)}
                  className="flex items-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30 rounded-xl px-4 py-2 transition-all duration-300"
                >
                  <span className="font-semibold">حذف</span>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-3">
                {service.rush_delivery_available && (
                  <Badge variant="outline" className="text-sm font-semibold px-3 py-1">
                    تسليم سريع
                  </Badge>
                )}
                <Badge variant={service.show_to_clients ? "default" : "outline"} className="text-sm font-semibold px-3 py-1">
                  {service.show_to_clients ? "ظاهر" : "مخفي"}
                </Badge>
                <Badge variant={service.is_active ? "default" : "secondary"} className="text-sm font-semibold px-3 py-1">
                  {service.is_active ? "مفعل" : "معطل"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// نافذة إضافة/تعديل القسم
const CategoryDialog = ({ 
  category, 
  onSave, 
  onClose 
}: { 
  category: ServiceCategory | null;
  onSave: (category: Partial<ServiceCategory>) => void;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    name_ar: category?.name_ar || '',
    name_en: category?.name_en || '',
    description_ar: category?.description_ar || '',
    description_en: category?.description_en || '',
    icon: category?.icon || 'Languages',
    color: category?.color || '#3B82F6',
    sort_order: category?.sort_order || 0,
    is_active: category?.is_active ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const iconOptions = [
    { value: 'Languages', label: 'اللغات' },
    { value: 'GraduationCap', label: 'التعليم' },
    { value: 'Users', label: 'المستخدمين' },
    { value: 'Search', label: 'البحث' }
  ];

  return (
    <DialogContent className="max-w-2xl" dir="rtl">
      <DialogHeader>
        <DialogTitle className="text-right text-2xl font-bold">
          {category ? 'تعديل القسم' : 'قسم جديد'}
        </DialogTitle>
        <DialogDescription className="text-right text-lg">
          {category ? 'تعديل بيانات القسم' : 'إضافة قسم جديد للخدمات'}
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name_ar" className="text-right block text-base font-semibold mb-2">الاسم بالعربية</Label>
            <Input
              id="name_ar"
              value={formData.name_ar}
              onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
              required
              dir="rtl"
              className="text-right text-lg p-4 rounded-xl"
            />
          </div>

          <div>
            <Label htmlFor="name_en" className="text-right block text-base font-semibold mb-2">الاسم بالإنجليزية</Label>
            <Input
              id="name_en"
              value={formData.name_en}
              onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
              required
              dir="ltr"
              className="text-lg p-4 rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="description_ar" className="text-right block text-base font-semibold mb-2">الوصف بالعربية</Label>
            <Textarea
              id="description_ar"
              value={formData.description_ar}
              onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
              dir="rtl"
              className="text-right text-lg p-4 rounded-xl min-h-[120px]"
            />
          </div>

          <div>
            <Label htmlFor="description_en" className="text-right block text-base font-semibold mb-2">الوصف بالإنجليزية</Label>
            <Textarea
              id="description_en"
              value={formData.description_en}
              onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
              dir="ltr"
              className="text-lg p-4 rounded-xl min-h-[120px]"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <Label htmlFor="icon" className="text-right block text-base font-semibold mb-2">الأيقونة</Label>
            <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
              <SelectTrigger className="text-lg p-4 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="color" className="text-right block text-base font-semibold mb-2">اللون</Label>
            <Input
              id="color"
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="h-14 rounded-xl"
            />
          </div>

          <div>
            <Label htmlFor="sort_order" className="text-right block text-base font-semibold mb-2">ترتيب العرض</Label>
            <Input
              id="sort_order"
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
              dir="ltr"
              className="text-lg p-4 rounded-xl"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 p-4 bg-muted/20 rounded-xl">
          <Label htmlFor="is_active" className="text-lg font-semibold">مفعل</Label>
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
          />
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onClose} className="px-6 py-3 rounded-xl text-lg">
            إلغاء
          </Button>
          <Button type="submit" className="px-8 py-3 rounded-xl text-lg font-bold">
            <span>حفظ</span>
            <Save className="w-5 h-5 mr-2" />
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

// نافذة إضافة/تعديل الخدمة
const ServiceDialog = ({ 
  service, 
  categories,
  onSave, 
  onClose 
}: { 
  service: Service | null;
  categories: ServiceCategory[];
  onSave: (service: Partial<Service>) => void;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    name_ar: service?.name_ar || '',
    name_en: service?.name_en || '',
    description_ar: service?.description_ar || '',
    description_en: service?.description_en || '',
    category_id: service?.category_id || '',
    features_ar: service?.features_ar || [],
    features_en: service?.features_en || [],
    base_price: service?.base_price || '',
    price_per_unit: service?.price_per_unit || '',
    unit_type: service?.unit_type || 'page',
    min_units: service?.min_units || 1,
    max_units: service?.max_units || '',
    delivery_time_days: service?.delivery_time_days || 7,
    rush_delivery_available: service?.rush_delivery_available || false,
    rush_delivery_multiplier: service?.rush_delivery_multiplier || 1.5,
    image_url: service?.image_url || '',
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
      base_price: formData.base_price ? parseFloat(formData.base_price as string) : null,
      price_per_unit: formData.price_per_unit ? parseFloat(formData.price_per_unit as string) : null,
      max_units: formData.max_units ? parseInt(formData.max_units as string) : null
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
        <DialogDescription className="text-right text-lg">
          {service ? 'تعديل بيانات الخدمة' : 'إضافة خدمة جديدة'}
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full bg-muted/30 p-2 rounded-2xl">
            <TabsTrigger value="basic" className="text-lg font-bold py-3 rounded-xl">البيانات الأساسية</TabsTrigger>
            <TabsTrigger value="pricing" className="text-lg font-bold py-3 rounded-xl">الأسعار والتسليم</TabsTrigger>
            <TabsTrigger value="settings" className="text-lg font-bold py-3 rounded-xl">الإعدادات</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name_ar" className="text-right block text-base font-semibold mb-2">اسم الخدمة بالعربية</Label>
                <Input
                  id="name_ar"
                  value={formData.name_ar}
                  onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                  required
                  dir="rtl"
                  className="text-right text-lg p-4 rounded-xl"
                />
              </div>

              <div>
                <Label htmlFor="name_en" className="text-right block text-base font-semibold mb-2">اسم الخدمة بالإنجليزية</Label>
                <Input
                  id="name_en"
                  value={formData.name_en}
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                  required
                  dir="ltr"
                  className="text-lg p-4 rounded-xl"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category_id" className="text-right block text-base font-semibold mb-2">القسم</Label>
              <Select 
                value={formData.category_id} 
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              >
                <SelectTrigger className="text-lg p-4 rounded-xl">
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

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="description_ar" className="text-right block text-base font-semibold mb-2">الوصف بالعربية</Label>
                <Textarea
                  id="description_ar"
                  value={formData.description_ar}
                  onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                  dir="rtl"
                  className="text-right text-lg p-4 rounded-xl min-h-[120px]"
                />
              </div>

              <div>
                <Label htmlFor="description_en" className="text-right block text-base font-semibold mb-2">الوصف بالإنجليزية</Label>
                <Textarea
                  id="description_en"
                  value={formData.description_en}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                  dir="ltr"
                  className="text-lg p-4 rounded-xl min-h-[120px]"
                />
              </div>
            </div>

            {/* قسم المميزات */}
            <div className="space-y-4 p-6 bg-muted/10 rounded-2xl">
              <Label className="text-right block text-lg font-bold">المميزات</Label>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    placeholder="ميزة بالعربية"
                    value={currentFeatureAr}
                    onChange={(e) => setCurrentFeatureAr(e.target.value)}
                    dir="rtl"
                    className="text-right text-lg p-4 rounded-xl"
                  />
                </div>
                <div>
                  <Input
                    placeholder="Feature in English"
                    value={currentFeatureEn}
                    onChange={(e) => setCurrentFeatureEn(e.target.value)}
                    dir="ltr"
                    className="text-lg p-4 rounded-xl"
                  />
                </div>
              </div>
              
              <Button type="button" onClick={addFeature} className="w-full text-lg font-bold py-3 rounded-xl">
                <span>إضافة ميزة</span>
                <Plus className="w-5 h-5 mr-2" />
              </Button>

              {formData.features_ar.length > 0 && (
                <div className="space-y-3">
                  {formData.features_ar.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between gap-4 p-4 bg-background rounded-xl border">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeature(index)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                      <div className="flex-1 text-right">
                        <p className="text-base font-semibold">{feature}</p>
                        <p className="text-sm text-muted-foreground">{formData.features_en[index]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="base_price" className="text-right block text-base font-semibold mb-2">السعر الأساسي</Label>
                <Input
                  id="base_price"
                  type="number"
                  step="0.01"
                  value={formData.base_price}
                  onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                  dir="ltr"
                  className="text-lg p-4 rounded-xl"
                />
              </div>

              <div>
                <Label htmlFor="price_per_unit" className="text-right block text-base font-semibold mb-2">السعر لكل وحدة</Label>
                <Input
                  id="price_per_unit"
                  type="number"
                  step="0.01"
                  value={formData.price_per_unit}
                  onChange={(e) => setFormData({ ...formData, price_per_unit: e.target.value })}
                  dir="ltr"
                  className="text-lg p-4 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <Label htmlFor="unit_type" className="text-right block text-base font-semibold mb-2">نوع الوحدة</Label>
                <Select 
                  value={formData.unit_type} 
                  onValueChange={(value) => setFormData({ ...formData, unit_type: value })}
                >
                  <SelectTrigger className="text-lg p-4 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="page">صفحة</SelectItem>
                    <SelectItem value="word">كلمة</SelectItem>
                    <SelectItem value="hour">ساعة</SelectItem>
                    <SelectItem value="project">مشروع</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="min_units" className="text-right block text-base font-semibold mb-2">الحد الأدنى</Label>
                <Input
                  id="min_units"
                  type="number"
                  value={formData.min_units}
                  onChange={(e) => setFormData({ ...formData, min_units: parseInt(e.target.value) || 1 })}
                  dir="ltr"
                  className="text-lg p-4 rounded-xl"
                />
              </div>

              <div>
                <Label htmlFor="max_units" className="text-right block text-base font-semibold mb-2">الحد الأقصى</Label>
                <Input
                  id="max_units"
                  type="number"
                  value={formData.max_units}
                  onChange={(e) => setFormData({ ...formData, max_units: e.target.value })}
                  dir="ltr"
                  className="text-lg p-4 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="delivery_time_days" className="text-right block text-base font-semibold mb-2">مدة التسليم (أيام)</Label>
                <Input
                  id="delivery_time_days"
                  type="number"
                  value={formData.delivery_time_days}
                  onChange={(e) => setFormData({ ...formData, delivery_time_days: parseInt(e.target.value) || 7 })}
                  dir="ltr"
                  className="text-lg p-4 rounded-xl"
                />
              </div>

              <div>
                <Label htmlFor="rush_delivery_multiplier" className="text-right block text-base font-semibold mb-2">مضاعف التسليم السريع</Label>
                <Input
                  id="rush_delivery_multiplier"
                  type="number"
                  step="0.1"
                  value={formData.rush_delivery_multiplier}
                  onChange={(e) => setFormData({ ...formData, rush_delivery_multiplier: parseFloat(e.target.value) || 1.5 })}
                  dir="ltr"
                  className="text-lg p-4 rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 p-4 bg-muted/20 rounded-xl">
              <Label htmlFor="rush_delivery_available" className="text-lg font-semibold">التسليم السريع متاح</Label>
              <Switch
                id="rush_delivery_available"
                checked={formData.rush_delivery_available}
                onCheckedChange={(checked) => setFormData({ ...formData, rush_delivery_available: checked })}
              />
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div>
              <Label htmlFor="image_url" className="text-right block text-base font-semibold mb-2">رابط الصورة</Label>
              <Input
                id="image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                dir="ltr"
                className="text-lg p-4 rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="sort_order" className="text-right block text-base font-semibold mb-2">ترتيب العرض</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                dir="ltr"
                className="text-lg p-4 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center justify-end gap-4 p-4 bg-muted/20 rounded-xl">
                <Label htmlFor="is_active" className="text-lg font-semibold">مفعل</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>

              <div className="flex items-center justify-end gap-4 p-4 bg-muted/20 rounded-xl">
                <Label htmlFor="show_to_clients" className="text-lg font-semibold">ظاهر للعملاء</Label>
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
          <Button type="button" variant="outline" onClick={onClose} className="px-6 py-3 rounded-xl text-lg">
            إلغاء
          </Button>
          <Button type="submit" className="px-8 py-3 rounded-xl text-lg font-bold">
            <span>حفظ</span>
            <Save className="w-5 h-5 mr-2" />
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default AdminServices;