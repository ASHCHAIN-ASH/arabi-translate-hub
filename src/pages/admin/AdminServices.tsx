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
  DollarSign
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
  features_ar?: string[];
  features_en?: string[];
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
  service_categories?: ServiceCategory;
}

const getIconComponent = (iconName: string) => {
  const icons: Record<string, React.ComponentType<any>> = {
    Languages,
    GraduationCap,
    Users,
    Search
  };
  return icons[iconName] || Languages;
};

export default function AdminServices() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showServiceDialog, setShowServiceDialog] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // تحميل الأقسام
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('service_categories')
        .select('*')
        .order('sort_order');

      if (categoriesError) throw categoriesError;

      // تحميل الخدمات مع معلومات الأقسام
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
        .order('sort_order');

      if (servicesError) throw servicesError;

      setCategories(categoriesData || []);
      setServices((servicesData || []) as Service[]);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل البيانات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveCategory = async (category: Partial<ServiceCategory>) => {
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

      setShowCategoryDialog(false);
      setEditingCategory(null);
      loadData();
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: "خطأ",
        description: "فشل في حفظ القسم",
        variant: "destructive"
      });
    }
  };

  const saveService = async (service: Partial<Service>) => {
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

      setShowServiceDialog(false);
      setEditingService(null);
      loadData();
    } catch (error) {
      console.error('Error saving service:', error);
      toast({
        title: "خطأ",
        description: "فشل في حفظ الخدمة",
        variant: "destructive"
      });
    }
  };

  const deleteCategory = async (id: string) => {
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
        variant: "destructive"
      });
    }
  };

  const deleteService = async (id: string) => {
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
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">إدارة الخدمات</h1>
            <p className="text-muted-foreground">إدارة أقسام وخدمات الموقع</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingCategory(null)}>
                  <Plus className="h-4 w-4 ml-2" />
                  قسم جديد
                </Button>
              </DialogTrigger>
              <CategoryDialog
                category={editingCategory}
                onSave={saveCategory}
                onClose={() => {
                  setShowCategoryDialog(false);
                  setEditingCategory(null);
                }}
              />
            </Dialog>

            <Dialog open={showServiceDialog} onOpenChange={setShowServiceDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={() => setEditingService(null)}>
                  <Plus className="h-4 w-4 ml-2" />
                  خدمة جديدة
                </Button>
              </DialogTrigger>
              <ServiceDialog
                service={editingService}
                categories={categories}
                onSave={saveService}
                onClose={() => {
                  setShowServiceDialog(false);
                  setEditingService(null);
                }}
              />
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="services">الخدمات</TabsTrigger>
            <TabsTrigger value="categories">الأقسام</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-6">
            <div className="grid gap-6">
              {categories.map(category => {
                const categoryServices = services.filter(s => s.category_id === category.id);
                const IconComponent = getIconComponent(category.icon);
                
                return (
                  <Card key={category.id} className="overflow-hidden">
                    <CardHeader style={{ backgroundColor: category.color + '10' }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="p-2 rounded-lg text-white"
                            style={{ backgroundColor: category.color }}
                          >
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {category.name_ar}
                              <Badge variant={category.is_active ? "default" : "secondary"}>
                                {category.is_active ? 'نشط' : 'غير نشط'}
                              </Badge>
                            </CardTitle>
                            <CardDescription>{category.description_ar}</CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {categoryServices.length} خدمة
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categoryServices.map(service => (
                          <div key={service.id} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-start justify-between">
                              <h4 className="font-semibold">{service.name_ar}</h4>
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setEditingService(service);
                                    setShowServiceDialog(true);
                                  }}
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteService(service.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {service.description_ar}
                            </p>
                            
                            <div className="flex flex-wrap gap-2">
                              <Badge variant={service.is_active ? "default" : "secondary"}>
                                {service.is_active ? 'نشط' : 'غير نشط'}
                              </Badge>
                              <Badge variant={service.show_to_clients ? "default" : "outline"}>
                                {service.show_to_clients ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                              </Badge>
                            </div>
                            
                            {service.base_price && (
                              <div className="flex items-center gap-2 text-sm">
                                <DollarSign className="h-3 w-3" />
                                <span>{service.base_price} ريال</span>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{service.delivery_time_days} أيام</span>
                            </div>
                          </div>
                        ))}
                        
                        <div className="border-2 border-dashed border-muted rounded-lg p-4 flex items-center justify-center">
                          <Button
                            variant="ghost"
                            onClick={() => {
                              setEditingService({ category_id: category.id } as Service);
                              setShowServiceDialog(true);
                            }}
                          >
                            <Plus className="h-4 w-4 ml-2" />
                            إضافة خدمة
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(category => {
                const IconComponent = getIconComponent(category.icon);
                const serviceCount = services.filter(s => s.category_id === category.id).length;
                
                return (
                  <Card key={category.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="p-2 rounded-lg text-white"
                            style={{ backgroundColor: category.color }}
                          >
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{category.name_ar}</CardTitle>
                            <CardDescription>{category.name_en}</CardDescription>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingCategory(category);
                              setShowCategoryDialog(true);
                            }}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteCategory(category.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {category.description_ar}
                      </p>
                      <div className="flex justify-between items-center">
                        <Badge variant={category.is_active ? "default" : "secondary"}>
                          {category.is_active ? 'نشط' : 'غير نشط'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {serviceCount} خدمة
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

// مكون نافذة تحرير القسم
function CategoryDialog({ 
  category, 
  onSave, 
  onClose 
}: { 
  category: ServiceCategory | null;
  onSave: (category: Partial<ServiceCategory>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name_ar: '',
    name_en: '',
    description_ar: '',
    description_en: '',
    icon: 'Languages',
    color: '#3B82F6',
    sort_order: 0,
    is_active: true
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name_ar: category.name_ar || '',
        name_en: category.name_en || '',
        description_ar: category.description_ar || '',
        description_en: category.description_en || '',
        icon: category.icon || 'Languages',
        color: category.color || '#3B82F6',
        sort_order: category.sort_order || 0,
        is_active: category.is_active ?? true
      });
    }
  }, [category]);

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{category ? 'تحرير القسم' : 'قسم جديد'}</DialogTitle>
        <DialogDescription>
          أدخل معلومات القسم باللغتين العربية والإنجليزية
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name_ar">الاسم بالعربية</Label>
            <Input
              id="name_ar"
              value={formData.name_ar}
              onChange={(e) => setFormData(prev => ({ ...prev, name_ar: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name_en">الاسم بالإنجليزية</Label>
            <Input
              id="name_en"
              value={formData.name_en}
              onChange={(e) => setFormData(prev => ({ ...prev, name_en: e.target.value }))}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="description_ar">الوصف بالعربية</Label>
            <Textarea
              id="description_ar"
              value={formData.description_ar}
              onChange={(e) => setFormData(prev => ({ ...prev, description_ar: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description_en">الوصف بالإنجليزية</Label>
            <Textarea
              id="description_en"
              value={formData.description_en}
              onChange={(e) => setFormData(prev => ({ ...prev, description_en: e.target.value }))}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="icon">الأيقونة</Label>
            <Select 
              value={formData.icon} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Languages">Languages</SelectItem>
                <SelectItem value="GraduationCap">GraduationCap</SelectItem>
                <SelectItem value="Users">Users</SelectItem>
                <SelectItem value="Search">Search</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">اللون</Label>
            <Input
              id="color"
              type="color"
              value={formData.color}
              onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sort_order">ترتيب العرض</Label>
            <Input
              id="sort_order"
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2 space-x-reverse">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
          />
          <Label htmlFor="is_active">نشط</Label>
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          <X className="h-4 w-4 ml-2" />
          إلغاء
        </Button>
        <Button onClick={() => onSave(formData)}>
          <Save className="h-4 w-4 ml-2" />
          حفظ
        </Button>
      </div>
    </DialogContent>
  );
}

// مكون نافذة تحرير الخدمة
function ServiceDialog({ 
  service, 
  categories,
  onSave, 
  onClose 
}: { 
  service: Service | null;
  categories: ServiceCategory[];
  onSave: (service: Partial<Service>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    category_id: '',
    name_ar: '',
    name_en: '',
    description_ar: '',
    description_en: '',
    features_ar: '',
    features_en: '',
    base_price: '',
    price_per_unit: '',
    unit_type: 'page',
    min_units: 1,
    max_units: '',
    delivery_time_days: 7,
    rush_delivery_available: false,
    rush_delivery_multiplier: 1.5,
    image_url: '',
    sort_order: 0,
    is_active: true,
    show_to_clients: true
  });

  useEffect(() => {
    if (service) {
      setFormData({
        category_id: service.category_id || '',
        name_ar: service.name_ar || '',
        name_en: service.name_en || '',
        description_ar: service.description_ar || '',
        description_en: service.description_en || '',
        features_ar: service.features_ar?.join('\n') || '',
        features_en: service.features_en?.join('\n') || '',
        base_price: service.base_price?.toString() || '',
        price_per_unit: service.price_per_unit?.toString() || '',
        unit_type: service.unit_type || 'page',
        min_units: service.min_units || 1,
        max_units: service.max_units?.toString() || '',
        delivery_time_days: service.delivery_time_days || 7,
        rush_delivery_available: service.rush_delivery_available ?? false,
        rush_delivery_multiplier: service.rush_delivery_multiplier || 1.5,
        image_url: service.image_url || '',
        sort_order: service.sort_order || 0,
        is_active: service.is_active ?? true,
        show_to_clients: service.show_to_clients ?? true
      });
    }
  }, [service]);

  const handleSave = () => {
    const serviceData: Partial<Service> = {
      category_id: formData.category_id,
      name_ar: formData.name_ar,
      name_en: formData.name_en,
      description_ar: formData.description_ar,
      description_en: formData.description_en,
      features_ar: formData.features_ar.split('\n').filter(f => f.trim()),
      features_en: formData.features_en.split('\n').filter(f => f.trim()),
      base_price: formData.base_price ? parseFloat(formData.base_price) : null,
      price_per_unit: formData.price_per_unit ? parseFloat(formData.price_per_unit) : null,
      unit_type: formData.unit_type,
      min_units: formData.min_units,
      max_units: formData.max_units ? parseInt(formData.max_units) : null,
      delivery_time_days: formData.delivery_time_days,
      rush_delivery_available: formData.rush_delivery_available,
      rush_delivery_multiplier: formData.rush_delivery_multiplier,
      image_url: formData.image_url || null,
      sort_order: formData.sort_order,
      is_active: formData.is_active,
      show_to_clients: formData.show_to_clients
    };
    onSave(serviceData);
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{service ? 'تحرير الخدمة' : 'خدمة جديدة'}</DialogTitle>
        <DialogDescription>
          أدخل معلومات الخدمة بالتفصيل
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid gap-6 py-4">
        <div className="space-y-2">
          <Label htmlFor="category_id">القسم</Label>
          <Select 
            value={formData.category_id} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر القسم" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name_ar}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name_ar">اسم الخدمة بالعربية</Label>
            <Input
              id="name_ar"
              value={formData.name_ar}
              onChange={(e) => setFormData(prev => ({ ...prev, name_ar: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name_en">اسم الخدمة بالإنجليزية</Label>
            <Input
              id="name_en"
              value={formData.name_en}
              onChange={(e) => setFormData(prev => ({ ...prev, name_en: e.target.value }))}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="description_ar">الوصف بالعربية</Label>
            <Textarea
              id="description_ar"
              value={formData.description_ar}
              onChange={(e) => setFormData(prev => ({ ...prev, description_ar: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description_en">الوصف بالإنجليزية</Label>
            <Textarea
              id="description_en"
              value={formData.description_en}
              onChange={(e) => setFormData(prev => ({ ...prev, description_en: e.target.value }))}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="features_ar">المميزات بالعربية (سطر لكل ميزة)</Label>
            <Textarea
              id="features_ar"
              value={formData.features_ar}
              onChange={(e) => setFormData(prev => ({ ...prev, features_ar: e.target.value }))}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="features_en">المميزات بالإنجليزية (سطر لكل ميزة)</Label>
            <Textarea
              id="features_en"
              value={formData.features_en}
              onChange={(e) => setFormData(prev => ({ ...prev, features_en: e.target.value }))}
              rows={4}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="base_price">السعر الأساسي</Label>
            <Input
              id="base_price"
              type="number"
              step="0.01"
              value={formData.base_price}
              onChange={(e) => setFormData(prev => ({ ...prev, base_price: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price_per_unit">سعر الوحدة</Label>
            <Input
              id="price_per_unit"
              type="number"
              step="0.01"
              value={formData.price_per_unit}
              onChange={(e) => setFormData(prev => ({ ...prev, price_per_unit: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit_type">نوع الوحدة</Label>
            <Select 
              value={formData.unit_type} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, unit_type: value }))}
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
          <div className="space-y-2">
            <Label htmlFor="delivery_time_days">مدة التسليم (أيام)</Label>
            <Input
              id="delivery_time_days"
              type="number"
              value={formData.delivery_time_days}
              onChange={(e) => setFormData(prev => ({ ...prev, delivery_time_days: parseInt(e.target.value) || 7 }))}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="image_url">رابط الصورة</Label>
          <Input
            id="image_url"
            value={formData.image_url}
            onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
            placeholder="/assets/service-image.jpg"
          />
        </div>
        
        <div className="flex gap-6">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
            />
            <Label htmlFor="is_active">نشط</Label>
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse">
            <Switch
              id="show_to_clients"
              checked={formData.show_to_clients}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, show_to_clients: checked }))}
            />
            <Label htmlFor="show_to_clients">ظاهر للعملاء</Label>
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse">
            <Switch
              id="rush_delivery_available"
              checked={formData.rush_delivery_available}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, rush_delivery_available: checked }))}
            />
            <Label htmlFor="rush_delivery_available">تسليم عاجل متاح</Label>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          <X className="h-4 w-4 ml-2" />
          إلغاء
        </Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 ml-2" />
          حفظ
        </Button>
      </div>
    </DialogContent>
  );
}