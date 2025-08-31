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
      <div className="min-h-screen bg-background" dir="rtl" style={{ fontFamily: 'Noto Sans Arabic, Arial, sans-serif' }}>
        {/* Header */}
        <div className="bg-gradient-to-l from-primary/10 via-background to-secondary/10 border-b">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-3xl flex items-center justify-center shadow-lg">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-right">إدارة الخدمات والأقسام</h1>
                  <p className="text-muted-foreground text-right mt-2">إدارة شاملة لجميع أقسام وخدمات المنصة التعليمية</p>
                  <div className="flex items-center gap-6 mt-3 justify-end">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span className="text-sm font-medium">{categories.length} قسم</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-secondary rounded-full"></div>
                      <span className="text-sm font-medium">{services.length} خدمة</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{services.filter(s => s.is_active).length}</div>
                <div className="text-sm text-muted-foreground">خدمة نشطة</div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          <Tabs defaultValue="categories" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-2 w-full max-w-md bg-muted/50 p-1 rounded-2xl">
                <TabsTrigger 
                  value="categories" 
                  className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl text-right"
                >
                  <Languages className="w-5 h-5" />
                  <span className="font-semibold">الأقسام</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="services" 
                  className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl text-right"
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-semibold">الخدمات</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Categories Tab */}
            <TabsContent value="categories" className="space-y-6">
              <div className="bg-card border rounded-2xl p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                  <div className="text-right">
                    <h2 className="text-2xl font-bold flex items-center gap-3 justify-end">
                      <span>أقسام الخدمات</span>
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Languages className="w-5 h-5 text-primary" />
                      </div>
                    </h2>
                    <p className="text-muted-foreground text-right mt-2">إدارة تصنيفات الخدمات الأساسية في المنصة</p>
                  </div>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        onClick={() => {
                          setEditingCategory(null);
                          setIsDialogOpen(true);
                        }}
                        className="flex items-center gap-3 px-6 py-3 rounded-xl shadow-lg"
                        size="lg"
                      >
                        <Plus className="w-5 h-5" />
                        <span className="font-semibold">إضافة قسم جديد</span>
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
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-64 bg-muted/30 animate-pulse rounded-2xl" />
                  ))}
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Languages className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">لا توجد أقسام بعد</h3>
                  <p className="text-muted-foreground mb-6">ابدأ بإنشاء أول قسم للخدمات</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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

            {/* Services Tab */}
            <TabsContent value="services" className="space-y-6">
              <div className="bg-card border rounded-2xl p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                  <div className="text-right">
                    <h2 className="text-2xl font-bold flex items-center gap-3 justify-end">
                      <span>إدارة الخدمات</span>
                      <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                        <Settings className="w-5 h-5 text-secondary" />
                      </div>
                    </h2>
                    <p className="text-muted-foreground text-right mt-2">إدارة جميع الخدمات المتاحة للعملاء في المنصة</p>
                  </div>
                  <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        onClick={() => {
                          setEditingService(null);
                          setIsServiceDialogOpen(true);
                        }}
                        className="flex items-center gap-3 px-6 py-3 rounded-xl shadow-lg"
                        size="lg"
                        variant="secondary"
                      >
                        <Plus className="w-5 h-5" />
                        <span className="font-semibold">إضافة خدمة جديدة</span>
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

              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-40 bg-muted/30 animate-pulse rounded-2xl" />
                  ))}
                </div>
              ) : services.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Settings className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">لا توجد خدمات بعد</h3>
                  <p className="text-muted-foreground mb-6">ابدأ بإنشاء أول خدمة للعملاء</p>
                </div>
              ) : (
                <div className="space-y-4">
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

// Category Card Component
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
    return <Icon className="w-6 h-6" />;
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 rounded-2xl overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 text-right">
            <Badge 
              variant={category.is_active ? "default" : "secondary"}
              className="text-xs font-semibold px-3 py-1 rounded-full mb-3"
            >
              {category.is_active ? "مفعل" : "معطل"}
            </Badge>
            <CardTitle className="text-xl font-bold text-right mb-1">{category.name_ar}</CardTitle>
            <p className="text-sm text-muted-foreground text-right">{category.name_en}</p>
          </div>
          <div className="relative">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300"
              style={{ backgroundColor: category.color }}
            >
              {getIcon(category.icon)}
            </div>
            <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-background rounded-full border-2 border-border flex items-center justify-center">
              <div className={`w-2 h-2 rounded-full ${category.is_active ? 'bg-success' : 'bg-muted-foreground'}`}></div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground text-right leading-relaxed mb-6 min-h-[3rem]">
          {category.description_ar || "لا يوجد وصف متاح لهذا القسم"}
        </p>
        
        <div className="pt-4 border-t">
          <div className="flex justify-between items-center gap-3">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEdit(category)}
                className="flex items-center gap-2 hover:bg-primary/10 hover:border-primary/30 rounded-xl"
              >
                <Edit2 className="w-4 h-4" />
                <span>تعديل</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onDelete(category.id)}
                className="flex items-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30 rounded-xl"
              >
                <Trash2 className="w-4 h-4" />
                <span>حذف</span>
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              ترتيب: {category.sort_order}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Service Card Component
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
    <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-secondary/20 rounded-2xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-6">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEdit(service)}
              className="flex items-center gap-2 hover:bg-primary/10 hover:border-primary/30 rounded-xl"
            >
              <Edit2 className="w-4 h-4" />
              <span>تعديل</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onDelete(service.id)}
              className="flex items-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30 rounded-xl"
            >
              <Trash2 className="w-4 h-4" />
              <span>حذف</span>
            </Button>
          </div>
          
          <div className="flex-1 text-right">
            <div className="flex items-center gap-3 mb-3 justify-end">
              <div className="text-right">
                <h3 className="text-lg font-semibold">{service.name_ar}</h3>
                <p className="text-sm text-muted-foreground">{service.name_en}</p>
              </div>
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: service.service_categories?.color || '#3B82F6' }}
              >
                <Settings className="w-5 h-5" />
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4 text-right">
              {service.description_ar || "لا يوجد وصف"}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-right">
              <div>
                <p className="text-xs text-muted-foreground">القسم</p>
                <p className="text-sm font-medium">{service.service_categories?.name_ar}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">مدة التسليم</p>
                <p className="text-sm font-medium">{service.delivery_time_days} أيام</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">الحد الأدنى</p>
                <p className="text-sm font-medium">{service.min_units} {service.unit_type}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">السعر لكل وحدة</p>
                <p className="text-sm font-medium">
                  {service.price_per_unit ? `${service.price_per_unit} ريال` : 'حسب الطلب'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-end">
              <Badge variant={service.is_active ? "default" : "secondary"}>
                {service.is_active ? "مفعل" : "معطل"}
              </Badge>
              <Badge variant={service.show_to_clients ? "default" : "outline"}>
                {service.show_to_clients ? "ظاهر للعملاء" : "مخفي"}
              </Badge>
              {service.rush_delivery_available && (
                <Badge variant="outline">
                  تسليم سريع متاح
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Category Dialog Component
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
    { value: 'Languages', label: 'Languages' },
    { value: 'GraduationCap', label: 'GraduationCap' },
    { value: 'Users', label: 'Users' },
    { value: 'Search', label: 'Search' }
  ];

  return (
    <DialogContent className="max-w-md" dir="rtl">
      <DialogHeader>
        <DialogTitle className="text-right">{category ? 'تعديل القسم' : 'قسم جديد'}</DialogTitle>
        <DialogDescription className="text-right">
          {category ? 'تعديل بيانات القسم' : 'إضافة قسم جديد للخدمات'}
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name_ar" className="text-right block">الاسم بالعربية</Label>
          <Input
            id="name_ar"
            value={formData.name_ar}
            onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
            required
            dir="rtl"
            className="text-right"
          />
        </div>

        <div>
          <Label htmlFor="name_en" className="text-right block">الاسم بالإنجليزية</Label>
          <Input
            id="name_en"
            value={formData.name_en}
            onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
            required
            dir="ltr"
          />
        </div>

        <div>
          <Label htmlFor="description_ar" className="text-right block">الوصف بالعربية</Label>
          <Textarea
            id="description_ar"
            value={formData.description_ar}
            onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
            dir="rtl"
            className="text-right"
          />
        </div>

        <div>
          <Label htmlFor="description_en" className="text-right block">الوصف بالإنجليزية</Label>
          <Textarea
            id="description_en"
            value={formData.description_en}
            onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
            dir="ltr"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="icon" className="text-right block">الأيقونة</Label>
            <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
              <SelectTrigger>
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
            <Label htmlFor="color" className="text-right block">اللون</Label>
            <Input
              id="color"
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sort_order" className="text-right block">ترتيب العرض</Label>
            <Input
              id="sort_order"
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
              dir="ltr"
            />
          </div>

          <div className="flex items-center space-x-2 space-x-reverse pt-6">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="is_active">مفعل</Label>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button type="submit">
            <Save className="w-4 h-4 ml-2" />
            حفظ
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

// Service Dialog Component
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
    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
      <DialogHeader>
        <DialogTitle className="text-right">{service ? 'تعديل الخدمة' : 'خدمة جديدة'}</DialogTitle>
        <DialogDescription className="text-right">
          {service ? 'تعديل بيانات الخدمة' : 'إضافة خدمة جديدة'}
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="basic">البيانات الأساسية</TabsTrigger>
            <TabsTrigger value="pricing">الأسعار والتسليم</TabsTrigger>
            <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name_ar" className="text-right block">اسم الخدمة بالعربية</Label>
                <Input
                  id="name_ar"
                  value={formData.name_ar}
                  onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                  required
                  dir="rtl"
                  className="text-right"
                />
              </div>

              <div>
                <Label htmlFor="name_en" className="text-right block">اسم الخدمة بالإنجليزية</Label>
                <Input
                  id="name_en"
                  value={formData.name_en}
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                  required
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category_id" className="text-right block">القسم</Label>
              <Select 
                value={formData.category_id} 
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              >
                <SelectTrigger>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="description_ar" className="text-right block">الوصف بالعربية</Label>
                <Textarea
                  id="description_ar"
                  value={formData.description_ar}
                  onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                  dir="rtl"
                  className="text-right"
                />
              </div>

              <div>
                <Label htmlFor="description_en" className="text-right block">الوصف بالإنجليزية</Label>
                <Textarea
                  id="description_en"
                  value={formData.description_en}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                  dir="ltr"
                />
              </div>
            </div>

            {/* Features Section */}
            <div className="space-y-4">
              <Label className="text-right block">المميزات</Label>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    placeholder="ميزة بالعربية"
                    value={currentFeatureAr}
                    onChange={(e) => setCurrentFeatureAr(e.target.value)}
                    dir="rtl"
                    className="text-right"
                  />
                </div>
                <div>
                  <Input
                    placeholder="Feature in English"
                    value={currentFeatureEn}
                    onChange={(e) => setCurrentFeatureEn(e.target.value)}
                    dir="ltr"
                  />
                </div>
              </div>
              
              <Button type="button" onClick={addFeature} className="w-full">
                <Plus className="w-4 h-4 ml-2" />
                إضافة ميزة
              </Button>

              {formData.features_ar.length > 0 && (
                <div className="space-y-2">
                  {formData.features_ar.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between gap-2 p-3 bg-muted rounded-lg">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeature(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <div className="flex-1 text-right">
                        <p className="text-sm font-medium">{feature}</p>
                        <p className="text-xs text-muted-foreground">{formData.features_en[index]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="base_price" className="text-right block">السعر الأساسي</Label>
                <Input
                  id="base_price"
                  type="number"
                  step="0.01"
                  value={formData.base_price}
                  onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                  dir="ltr"
                />
              </div>

              <div>
                <Label htmlFor="price_per_unit" className="text-right block">السعر لكل وحدة</Label>
                <Input
                  id="price_per_unit"
                  type="number"
                  step="0.01"
                  value={formData.price_per_unit}
                  onChange={(e) => setFormData({ ...formData, price_per_unit: e.target.value })}
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="unit_type" className="text-right block">نوع الوحدة</Label>
                <Select 
                  value={formData.unit_type} 
                  onValueChange={(value) => setFormData({ ...formData, unit_type: value })}
                >
                  <SelectTrigger>
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
                <Label htmlFor="min_units" className="text-right block">الحد الأدنى</Label>
                <Input
                  id="min_units"
                  type="number"
                  value={formData.min_units}
                  onChange={(e) => setFormData({ ...formData, min_units: parseInt(e.target.value) || 1 })}
                  dir="ltr"
                />
              </div>

              <div>
                <Label htmlFor="max_units" className="text-right block">الحد الأقصى</Label>
                <Input
                  id="max_units"
                  type="number"
                  value={formData.max_units}
                  onChange={(e) => setFormData({ ...formData, max_units: e.target.value })}
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="delivery_time_days" className="text-right block">مدة التسليم (أيام)</Label>
                <Input
                  id="delivery_time_days"
                  type="number"
                  value={formData.delivery_time_days}
                  onChange={(e) => setFormData({ ...formData, delivery_time_days: parseInt(e.target.value) || 7 })}
                  dir="ltr"
                />
              </div>

              <div>
                <Label htmlFor="rush_delivery_multiplier" className="text-right block">مضاعف التسليم السريع</Label>
                <Input
                  id="rush_delivery_multiplier"
                  type="number"
                  step="0.1"
                  value={formData.rush_delivery_multiplier}
                  onChange={(e) => setFormData({ ...formData, rush_delivery_multiplier: parseFloat(e.target.value) || 1.5 })}
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 space-x-reverse">
              <Switch
                id="rush_delivery_available"
                checked={formData.rush_delivery_available}
                onCheckedChange={(checked) => setFormData({ ...formData, rush_delivery_available: checked })}
              />
              <Label htmlFor="rush_delivery_available">التسليم السريع متاح</Label>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div>
              <Label htmlFor="image_url" className="text-right block">رابط الصورة</Label>
              <Input
                id="image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                dir="ltr"
              />
            </div>

            <div>
              <Label htmlFor="sort_order" className="text-right block">ترتيب العرض</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                dir="ltr"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">مفعل</Label>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  id="show_to_clients"
                  checked={formData.show_to_clients}
                  onCheckedChange={(checked) => setFormData({ ...formData, show_to_clients: checked })}
                />
                <Label htmlFor="show_to_clients">ظاهر للعملاء</Label>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button type="submit">
            <Save className="w-4 h-4 ml-2" />
            حفظ
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default AdminServices;