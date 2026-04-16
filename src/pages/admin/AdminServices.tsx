import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Package,
  BookOpen,
  Layers,
  DollarSign,
  Calendar,
  Users
} from 'lucide-react';

interface Service {
  id: string;
  name_ar: string;
  name_en?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Add any other properties that exist in the database
  [key: string]: any;
}

interface Category {
  id: string;
  name_ar: string;
  name?: string;
  description?: string;
  is_active?: boolean;
  created_at: string;
  [key: string]: any;
}

const AdminServices = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [filterType, setFilterType] = useState<'all' | 'service' | 'course' | 'bundle'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Service Dialog State
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState({
    name_ar: '',
    name_en: '',
    code: '',
    category: '',
    type: 'service' as 'service' | 'course' | 'bundle',
    price: 0,
    is_active: true
  });

  // Category Dialog State
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name_ar: '',
    name_en: '',
    description: '',
    is_active: true
  });

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  useEffect(() => {
    updateStats();
  }, [services]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في تحميل الخدمات',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .order('name_ar');

      if (error) throw error;

      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const updateStats = () => {
    const total = services.length;
    const active = services.filter(s => s.is_active).length;
    const inactive = total - active;
    setStats({ total, active, inactive });
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.name_en?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && service.is_active) ||
      (filterStatus === 'inactive' && !service.is_active);

    return matchesSearch && matchesStatus;
  });

  const resetServiceForm = () => {
    setServiceForm({
      name_ar: '',
      name_en: '',
      code: '',
      category: '',
      type: 'service',
      price: 0,
      is_active: true
    });
    setEditingService(null);
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name_ar: '',
      name_en: '',
      description: '',
      is_active: true
    });
    setEditingCategory(null);
  };

  const handleSaveService = async () => {
    try {
      if (!serviceForm.name_ar.trim()) {
        toast({
          title: 'خطأ',
          description: 'اسم الخدمة مطلوب',
          variant: 'destructive'
        });
        return;
      }

      if (!serviceForm.code.trim()) {
        toast({
          title: 'خطأ',
          description: 'كود الخدمة مطلوب',
          variant: 'destructive'
        });
        return;
      }

      if (serviceForm.price < 0) {
        toast({
          title: 'خطأ',
          description: 'السعر يجب أن يكون أكبر من أو يساوي صفر',
          variant: 'destructive'
        });
        return;
      }

      const serviceData = {
        name_ar: serviceForm.name_ar.trim(),
        name_en: serviceForm.name_en?.trim() || '',
        category_id: 'default-category',
        is_active: serviceForm.is_active
      };

      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingService.id);

        if (error) throw error;

        toast({
          title: 'نجح',
          description: 'تم تحديث الخدمة بنجاح'
        });
      } else {
        const { error } = await supabase
          .from('services')
          .insert(serviceData);

        if (error) throw error;

        toast({
          title: 'نجح',
          description: 'تم إضافة الخدمة بنجاح'
        });
      }

      setIsServiceDialogOpen(false);
      resetServiceForm();
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في حفظ الخدمة',
        variant: 'destructive'
      });
    }
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setServiceForm({
      name_ar: service.name_ar,
      name_en: service.name_en || '',
      code: '',
      category: '',
      type: 'service',
      price: 0,
      is_active: service.is_active
    });
    setIsServiceDialogOpen(true);
  };

  const handleToggleService = async (service: Service) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ is_active: !service.is_active })
        .eq('id', service.id);

      if (error) throw error;

      toast({
        title: 'نجح',
        description: service.is_active ? 'تم تعطيل الخدمة' : 'تم تفعيل الخدمة'
      });

      fetchServices();
    } catch (error) {
      console.error('Error toggling service:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في تغيير حالة الخدمة',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteService = async (service: Service) => {
    try {

      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', service.id);

      if (error) throw error;

      toast({
        title: 'نجح',
        description: 'تم حذف الخدمة بنجاح'
      });

      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في حذف الخدمة',
        variant: 'destructive'
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'service': return <Package className="h-4 w-4" />;
      case 'course': return <BookOpen className="h-4 w-4" />;
      case 'bundle': return <Layers className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'service': return 'خدمة';
      case 'course': return 'دورة';
      case 'bundle': return 'باقة';
      default: return 'خدمة';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">جاري التحميل...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold">إدارة الخدمات والأقسام</h1>
            <p className="text-muted-foreground">إدارة كتالوج الخدمات والدورات التدريبية</p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">الإجمالي</p>
                  <p className="text-xl font-bold">{stats.total}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-success/10 p-2 rounded-lg">
                  <Eye className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">نشطة</p>
                  <p className="text-xl font-bold">{stats.active}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-muted/10 p-2 rounded-lg">
                  <EyeOff className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">معطلة</p>
                  <p className="text-xl font-bold">{stats.inactive}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="services" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              الخدمات
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              الأقسام
            </TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-6">
            {/* Toolbar */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="البحث في الخدمات..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pr-10"
                      />
                    </div>
                  </div>
                  
                  <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={resetServiceForm} className="gap-2">
                        <Plus className="h-4 w-4" />
                        إضافة خدمة جديدة
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md" dir="rtl">
                      <DialogHeader>
                        <DialogTitle>
                          {editingService ? 'تعديل خدمة' : 'إضافة خدمة جديدة'}
                        </DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name_ar">الاسم العربي *</Label>
                          <Input
                            id="name_ar"
                            value={serviceForm.name_ar}
                            onChange={(e) => setServiceForm(prev => ({ ...prev, name_ar: e.target.value }))}
                            placeholder="اسم الخدمة بالعربية"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="name_en">الاسم الإنجليزي</Label>
                          <Input
                            id="name_en"
                            value={serviceForm.name_en}
                            onChange={(e) => setServiceForm(prev => ({ ...prev, name_en: e.target.value }))}
                            placeholder="Service name in English"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="code">الكود *</Label>
                          <Input
                            id="code"
                            value={serviceForm.code}
                            onChange={(e) => setServiceForm(prev => ({ ...prev, code: e.target.value }))}
                            placeholder="كود فريد للخدمة"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="type">النوع</Label>
                          <Select value={serviceForm.type} onValueChange={(value: 'service' | 'course' | 'bundle') => setServiceForm(prev => ({ ...prev, type: value }))}>
                            <SelectTrigger>
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
                          <Label htmlFor="category">القسم</Label>
                          <Select value={serviceForm.category} onValueChange={(value) => setServiceForm(prev => ({ ...prev, category: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر القسم" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.name_ar}>
                                  {category.name_ar}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="price">السعر (ريال) *</Label>
                          <Input
                            id="price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={serviceForm.price}
                            onChange={(e) => setServiceForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                          />
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={serviceForm.is_active}
                            onCheckedChange={(checked) => setServiceForm(prev => ({ ...prev, is_active: checked }))}
                          />
                          <Label>نشطة</Label>
                        </div>
                        
                        <div className="flex gap-2 pt-4">
                          <Button onClick={handleSaveService} className="flex-1">
                            {editingService ? 'تحديث' : 'إضافة'}
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setIsServiceDialogOpen(false)}
                            className="flex-1"
                          >
                            إلغاء
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <Select value={filterStatus} onValueChange={(value: 'all' | 'active' | 'inactive') => setFilterStatus(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="active">نشطة</SelectItem>
                      <SelectItem value="inactive">معطلة</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterType} onValueChange={(value: 'all' | 'service' | 'course' | 'bundle') => setFilterType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأنواع</SelectItem>
                      <SelectItem value="service">خدمات</SelectItem>
                      <SelectItem value="course">دورات</SelectItem>
                      <SelectItem value="bundle">باقات</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأقسام</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name_ar}>
                          {category.name_ar}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Services Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredServices.map((service) => (
                <Card key={service.id} className="group hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{service.name_ar}</CardTitle>
                        {service.name_en && (
                          <p className="text-sm text-muted-foreground truncate">{service.name_en}</p>
                        )}
                      </div>
                      <Badge variant={service.is_active ? 'default' : 'secondary'} className="gap-1 shrink-0">
                        {getTypeIcon(service.type)}
                        {getTypeLabel(service.type)}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">الكود:</span>
                        <code className="bg-muted px-2 py-1 rounded text-xs">{service.code}</code>
                      </div>
                      
                      {service.category && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">القسم:</span>
                          <span>{service.category}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">السعر:</span>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-success" />
                          <span className="font-semibold">{(service.price || 0).toFixed(2)} ريال</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">الحالة:</span>
                        <Badge variant={service.is_active ? 'default' : 'secondary'}>
                          {service.is_active ? 'نشطة' : 'معطلة'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditService(service)}
                        className="flex-1 gap-1"
                      >
                        <Edit className="h-3 w-3" />
                        تعديل
                      </Button>
                      
                      <Button
                        size="sm"
                        variant={service.is_active ? "secondary" : "default"}
                        onClick={() => handleToggleService(service)}
                        className="gap-1"
                      >
                        {service.is_active ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        {service.is_active ? 'إخفاء' : 'إظهار'}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteService(service)}
                        className="gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        حذف
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredServices.length === 0 && (
              <Card className="p-12">
                <div className="text-center space-y-4">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold">لا توجد خدمات</h3>
                    <p className="text-muted-foreground">
                      {searchTerm || filterStatus !== 'all' || filterType !== 'all' || selectedCategory !== 'all'
                        ? 'لم يتم العثور على خدمات تطابق معايير البحث'
                        : 'لم يتم إضافة أي خدمات بعد'
                      }
                    </p>
                  </div>
                  {!searchTerm && filterStatus === 'all' && filterType === 'all' && selectedCategory === 'all' && (
                    <Button onClick={() => setIsServiceDialogOpen(true)} className="gap-2">
                      <Plus className="h-4 w-4" />
                      إضافة خدمة جديدة
                    </Button>
                  )}
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">أقسام الخدمات</h3>
                  <p className="text-muted-foreground">إدارة أقسام وتصنيفات الخدمات</p>
                </div>
                
                <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetCategoryForm} className="gap-2">
                      <Plus className="h-4 w-4" />
                      إضافة قسم جديد
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md" dir="rtl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingCategory ? 'تعديل قسم' : 'إضافة قسم جديد'}
                      </DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cat_name_ar">الاسم العربي *</Label>
                        <Input
                          id="cat_name_ar"
                          value={categoryForm.name_ar}
                          onChange={(e) => setCategoryForm(prev => ({ ...prev, name_ar: e.target.value }))}
                          placeholder="اسم القسم بالعربية"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="cat_name_en">الاسم الإنجليزي</Label>
                        <Input
                          id="cat_name_en"
                          value={categoryForm.name_en}
                          onChange={(e) => setCategoryForm(prev => ({ ...prev, name_en: e.target.value }))}
                          placeholder="Category name in English"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="cat_description">الوصف</Label>
                        <Input
                          id="cat_description"
                          value={categoryForm.description}
                          onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="وصف مختصر للقسم"
                        />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={categoryForm.is_active}
                          onCheckedChange={(checked) => setCategoryForm(prev => ({ ...prev, is_active: checked }))}
                        />
                        <Label>نشط</Label>
                      </div>
                      
                      <div className="flex gap-2 pt-4">
                        <Button className="flex-1">
                          {editingCategory ? 'تحديث' : 'إضافة'}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsCategoryDialogOpen(false)}
                          className="flex-1"
                        >
                          إلغاء
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Card key={category.id} className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{category.name_ar}</h4>
                        {category.name_en && (
                          <p className="text-sm text-muted-foreground">{category.name_en}</p>
                        )}
                        {category.description && (
                          <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                        )}
                      </div>
                      <Badge variant={category.is_active ? 'default' : 'secondary'}>
                        {category.is_active ? 'نشط' : 'معطل'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="flex-1 gap-1">
                        <Edit className="h-3 w-3" />
                        تعديل
                      </Button>
                      <Button size="sm" variant="secondary" className="gap-1">
                        {category.is_active ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        {category.is_active ? 'إخفاء' : 'إظهار'}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {categories.length === 0 && (
              <Card className="p-12">
                <div className="text-center space-y-4">
                  <Layers className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold">لا توجد أقسام</h3>
                    <p className="text-muted-foreground">لم يتم إضافة أي أقسام بعد</p>
                  </div>
                  <Button onClick={() => setIsCategoryDialogOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    إضافة قسم جديد
                  </Button>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminServices;