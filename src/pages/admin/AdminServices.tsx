import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import {
  Plus, Search, Edit, Trash2, Eye, EyeOff, Package, Layers,
  Tag, TrendingUp, CheckCircle2, XCircle, Wallet, FolderTree, Star, Upload, Image as ImageIcon,
} from 'lucide-react';

interface Service {
  id: string;
  name: string;
  name_ar: string | null;
  description: string | null;
  description_ar: string | null;
  price: number | null;
  unit: string | null;
  category_id: string | null;
  subcategory_id: string | null;
  image_url: string | null;
  slug: string | null;
  is_featured: boolean;
  is_active: boolean | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: string;
  name: string;
  name_ar: string | null;
  description: string | null;
  icon: string | null;
  color: string | null;
  slug: string | null;
  parent_id: string | null;
  is_active: boolean;
  sort_order: number | null;
  created_at: string;
}

const UNITS = [
  { value: 'page', label: 'صفحة' },
  { value: 'word', label: 'كلمة' },
  { value: 'hour', label: 'ساعة' },
  { value: 'service', label: 'خدمة' },
  { value: 'project', label: 'مشروع' },
  { value: 'month', label: 'شهر' },
];

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 2 }).format(n);

const AdminServices = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Service Dialog
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState({
    name_ar: '',
    name: '',
    description: '',
    description_ar: '',
    category_id: '',
    subcategory_id: '',
    price: 0,
    unit: 'service',
    image_url: '',
    is_featured: false,
    is_active: true,
    sort_order: 0,
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  // Category Dialog
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name_ar: '',
    name: '',
    description: '',
    icon: '',
    color: '',
    parent_id: '',
    sort_order: 0,
    is_active: true,
  });

  // Delete confirmations
  const [deleteServiceId, setDeleteServiceId] = useState<string | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);

  useEffect(() => {
    fetchAll();

    // Realtime subscriptions
    const servicesChannel = supabase
      .channel('admin-services-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, () => fetchServices())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'service_categories' }, () => fetchCategories())
      .subscribe();

    return () => {
      supabase.removeChannel(servicesChannel);
    };
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchServices(), fetchCategories()]);
    setLoading(false);
  };

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      toast({ title: 'خطأ', description: 'تعذر تحميل الخدمات', variant: 'destructive' });
      return;
    }
    setServices((data ?? []) as Service[]);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) {
      toast({ title: 'خطأ', description: 'تعذر تحميل الأقسام', variant: 'destructive' });
      return;
    }
    setCategories((data ?? []) as Category[]);
  };

  const stats = useMemo(() => {
    const total = services.length;
    const active = services.filter((s) => s.is_active).length;
    const inactive = total - active;
    const avgPrice =
      total > 0 ? services.reduce((sum, s) => sum + (Number(s.price) || 0), 0) / total : 0;
    return { total, active, inactive, categoriesCount: categories.length, avgPrice };
  }, [services, categories]);

  const categoryMap = useMemo(() => {
    const m = new Map<string, Category>();
    categories.forEach((c) => m.set(c.id, c));
    return m;
  }, [categories]);

  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        (s.name_ar ?? '').toLowerCase().includes(term) ||
        s.name.toLowerCase().includes(term) ||
        (s.description ?? '').toLowerCase().includes(term);
      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'active' && s.is_active) ||
        (filterStatus === 'inactive' && !s.is_active);
      const matchesCategory =
        selectedCategory === 'all' || s.category_id === selectedCategory;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [services, searchTerm, filterStatus, selectedCategory]);

  // === Services CRUD ===
  const resetServiceForm = () => {
    setServiceForm({
      name_ar: '', name: '', description: '', description_ar: '', category_id: '', subcategory_id: '',
      price: 0, unit: 'service', image_url: '', is_featured: false, is_active: true, sort_order: 0,
    });
    setEditingService(null);
  };

  const openEditService = (s: Service) => {
    setEditingService(s);
    setServiceForm({
      name_ar: s.name_ar ?? '',
      name: s.name ?? '',
      description: s.description ?? '',
      description_ar: s.description_ar ?? '',
      category_id: s.category_id ?? '',
      subcategory_id: s.subcategory_id ?? '',
      price: Number(s.price ?? 0),
      unit: s.unit ?? 'service',
      image_url: s.image_url ?? '',
      is_featured: !!s.is_featured,
      is_active: !!s.is_active,
      sort_order: s.sort_order ?? 0,
    });
    setIsServiceDialogOpen(true);
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: 'الصورة كبيرة', description: 'الحد الأقصى 2MB', variant: 'destructive' });
      return;
    }
    setUploadingImage(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `services/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage.from('service-images').upload(path, file);
      if (upErr) throw upErr;
      const { data } = supabase.storage.from('service-images').getPublicUrl(path);
      setServiceForm((f) => ({ ...f, image_url: data.publicUrl }));
      toast({ title: '✅ تم رفع الصورة' });
    } catch (e: any) {
      toast({ title: 'خطأ', description: e.message, variant: 'destructive' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveService = async () => {
    if (!serviceForm.name_ar.trim()) {
      toast({ title: 'حقل مطلوب', description: 'الاسم العربي للخدمة مطلوب', variant: 'destructive' });
      return;
    }
    if (serviceForm.price < 0) {
      toast({ title: 'خطأ', description: 'السعر يجب ألا يكون سالباً', variant: 'destructive' });
      return;
    }

    const slug = (serviceForm.name || serviceForm.name_ar).trim()
      .toLowerCase().replace(/[^a-zA-Z0-9\u0600-\u06FF]+/g, '-').replace(/^-|-$/g, '');

    const payload: any = {
      name_ar: serviceForm.name_ar.trim(),
      name: (serviceForm.name || serviceForm.name_ar).trim(),
      description: serviceForm.description.trim() || null,
      description_ar: serviceForm.description_ar.trim() || null,
      category_id: serviceForm.category_id || null,
      subcategory_id: serviceForm.subcategory_id || null,
      price: serviceForm.price,
      unit: serviceForm.unit,
      image_url: serviceForm.image_url || null,
      is_featured: serviceForm.is_featured,
      is_active: serviceForm.is_active,
      sort_order: serviceForm.sort_order,
      slug: editingService?.slug || slug || null,
    };

    const { error } = editingService
      ? await supabase.from('services').update(payload).eq('id', editingService.id)
      : await supabase.from('services').insert(payload);

    if (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
      return;
    }

    toast({
      title: '✅ تم بنجاح',
      description: editingService ? 'تم تحديث الخدمة' : 'تم إضافة الخدمة الجديدة',
    });
    setIsServiceDialogOpen(false);
    resetServiceForm();
  };

  const handleToggleService = async (s: Service) => {
    const { error } = await supabase
      .from('services')
      .update({ is_active: !s.is_active })
      .eq('id', s.id);
    if (error) {
      toast({ title: 'خطأ', variant: 'destructive', description: error.message });
      return;
    }
    toast({ title: s.is_active ? 'تم تعطيل الخدمة' : 'تم تفعيل الخدمة' });
  };

  const confirmDeleteService = async () => {
    if (!deleteServiceId) return;
    const { error } = await supabase.from('services').delete().eq('id', deleteServiceId);
    if (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: '🗑️ تم حذف الخدمة' });
    }
    setDeleteServiceId(null);
  };

  // === Categories CRUD ===
  const resetCategoryForm = () => {
    setCategoryForm({ name_ar: '', name: '', description: '', icon: '', color: '', parent_id: '', sort_order: 0, is_active: true });
    setEditingCategory(null);
  };

  const openEditCategory = (c: Category) => {
    setEditingCategory(c);
    setCategoryForm({
      name_ar: c.name_ar ?? '',
      name: c.name ?? '',
      description: c.description ?? '',
      icon: c.icon ?? '',
      color: c.color ?? '',
      parent_id: c.parent_id ?? '',
      sort_order: c.sort_order ?? 0,
      is_active: c.is_active ?? true,
    });
    setIsCategoryDialogOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!categoryForm.name_ar.trim()) {
      toast({ title: 'حقل مطلوب', description: 'اسم القسم بالعربية مطلوب', variant: 'destructive' });
      return;
    }
    const slug = (categoryForm.name || categoryForm.name_ar).trim()
      .toLowerCase().replace(/[^a-zA-Z0-9\u0600-\u06FF]+/g, '-').replace(/^-|-$/g, '');
    const payload: any = {
      name_ar: categoryForm.name_ar.trim(),
      name: (categoryForm.name || categoryForm.name_ar).trim(),
      description: categoryForm.description.trim() || null,
      icon: categoryForm.icon.trim() || null,
      color: categoryForm.color.trim() || null,
      parent_id: categoryForm.parent_id || null,
      sort_order: categoryForm.sort_order,
      is_active: categoryForm.is_active,
      slug: editingCategory?.slug || slug || null,
    };
    const { error } = editingCategory
      ? await supabase.from('service_categories').update(payload).eq('id', editingCategory.id)
      : await supabase.from('service_categories').insert(payload);

    if (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
      return;
    }
    toast({
      title: '✅ تم بنجاح',
      description: editingCategory ? 'تم تحديث القسم' : 'تم إضافة القسم',
    });
    setIsCategoryDialogOpen(false);
    resetCategoryForm();
  };

  const confirmDeleteCategory = async () => {
    if (!deleteCategoryId) return;
    // Check if used
    const inUse = services.some((s) => s.category_id === deleteCategoryId);
    if (inUse) {
      toast({
        title: 'لا يمكن الحذف',
        description: 'هذا القسم مستخدم في خدمات قائمة. يجب نقل الخدمات أولاً.',
        variant: 'destructive',
      });
      setDeleteCategoryId(null);
      return;
    }
    const { error } = await supabase.from('service_categories').delete().eq('id', deleteCategoryId);
    if (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: '🗑️ تم حذف القسم' });
    }
    setDeleteCategoryId(null);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground text-sm">جاري التحميل...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        {/* === Banking Header === */}
        <div className="rounded-2xl bg-gradient-to-l from-primary via-primary/90 to-primary/70 p-6 md:p-8 text-primary-foreground shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1.5">
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                <Package className="h-7 w-7" />
                إدارة الخدمات والأقسام
              </h1>
              <p className="text-primary-foreground/80 text-sm md:text-base">
                كتالوج خدماتك المتكامل — إضافة، تعديل، تصنيف، وتسعير لحظي
              </p>
            </div>
          </div>
        </div>

        {/* === Stats Grid (Banking style) === */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          <StatCard icon={<Package />} label="إجمالي الخدمات" value={stats.total} tone="primary" />
          <StatCard icon={<CheckCircle2 />} label="نشطة" value={stats.active} tone="success" />
          <StatCard icon={<XCircle />} label="معطلة" value={stats.inactive} tone="muted" />
          <StatCard icon={<FolderTree />} label="الأقسام" value={stats.categoriesCount} tone="info" />
          <StatCard
            icon={<Wallet />}
            label="متوسط السعر"
            value={formatCurrency(stats.avgPrice)}
            tone="accent"
            isCurrency
            className="col-span-2"
          />
        </div>

        <Tabs defaultValue="services" dir="rtl" className="space-y-5">
          <TabsList dir="rtl" className="grid w-full md:w-auto md:inline-grid grid-cols-2 h-auto p-1">
            <TabsTrigger value="categories" className="flex items-center gap-2 py-2.5">
              <Layers className="h-4 w-4" />
              الأقسام
              <Badge variant="secondary" className="mr-1">{categories.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2 py-2.5">
              <Package className="h-4 w-4" />
              الخدمات
              <Badge variant="secondary" className="mr-1">{services.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* === SERVICES TAB === */}
          <TabsContent value="services" className="space-y-5">
            <Card className="border-border/60 shadow-sm">
              <CardContent className="p-4 md:p-5 space-y-4">
                <div className="flex flex-col lg:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="ابحث باسم الخدمة أو الوصف..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10 h-11"
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-2 lg:flex gap-2">
                    <Select value={filterStatus} onValueChange={(v: any) => setFilterStatus(v)}>
                      <SelectTrigger className="h-11 lg:w-40"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الحالات</SelectItem>
                        <SelectItem value="active">نشطة فقط</SelectItem>
                        <SelectItem value="inactive">معطلة فقط</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="h-11 lg:w-48"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الأقسام</SelectItem>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>{c.name_ar ?? c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Dialog open={isServiceDialogOpen} onOpenChange={(o) => { setIsServiceDialogOpen(o); if (!o) resetServiceForm(); }}>
                    <DialogTrigger asChild>
                      <Button onClick={resetServiceForm} className="h-11 gap-2 shadow-sm">
                        <Plus className="h-4 w-4" />
                        خدمة جديدة
                      </Button>
                    </DialogTrigger>
                    <ServiceDialog
                      editing={editingService}
                      form={serviceForm}
                      setForm={setServiceForm}
                      categories={categories}
                      onSave={handleSaveService}
                      onCancel={() => setIsServiceDialogOpen(false)}
                      onImageUpload={handleImageUpload}
                      uploadingImage={uploadingImage}
                    />
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Services Table - Desktop */}
            <Card className="hidden md:block border-border/60 shadow-sm overflow-hidden">
              <Table dir="rtl">
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="text-right font-semibold">الخدمة</TableHead>
                    <TableHead className="text-right font-semibold">القسم</TableHead>
                    <TableHead className="text-right font-semibold">السعر</TableHead>
                    <TableHead className="text-right font-semibold">الوحدة</TableHead>
                    <TableHead className="text-right font-semibold">الحالة</TableHead>
                    <TableHead className="text-center font-semibold">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                        <Package className="h-10 w-10 mx-auto mb-2 opacity-30" />
                        لا توجد خدمات تطابق الفلتر
                      </TableCell>
                    </TableRow>
                  ) : filteredServices.map((s) => {
                    const cat = s.category_id ? categoryMap.get(s.category_id) : null;
                    return (
                      <TableRow key={s.id} className="hover:bg-muted/30">
                        <TableCell>
                          <div className="space-y-0.5">
                            <div className="font-semibold">{s.name_ar ?? s.name}</div>
                            {s.description && (
                              <div className="text-xs text-muted-foreground line-clamp-1 max-w-md">{s.description}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {cat ? (
                            <Badge variant="outline" className="gap-1">
                              <Tag className="h-3 w-3" />
                              {cat.name_ar ?? cat.name}
                            </Badge>
                          ) : <span className="text-muted-foreground text-xs">—</span>}
                        </TableCell>
                        <TableCell className="font-mono font-bold text-primary">
                          {formatCurrency(Number(s.price ?? 0))}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {UNITS.find((u) => u.value === s.unit)?.label ?? s.unit ?? '—'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={s.is_active ? 'default' : 'secondary'} className="gap-1">
                            {s.is_active ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            {s.is_active ? 'نشطة' : 'معطلة'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button size="sm" variant="ghost" onClick={() => openEditService(s)} title="تعديل">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleToggleService(s)} title={s.is_active ? 'تعطيل' : 'تفعيل'}>
                              {s.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setDeleteServiceId(s.id)} title="حذف"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>

            {/* Services Cards - Mobile */}
            <div className="md:hidden space-y-3">
              {filteredServices.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground">
                  <Package className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  لا توجد خدمات
                </Card>
              ) : filteredServices.map((s) => {
                const cat = s.category_id ? categoryMap.get(s.category_id) : null;
                return (
                  <Card key={s.id} className="border-border/60 shadow-sm">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{s.name_ar ?? s.name}</h3>
                          {cat && (
                            <Badge variant="outline" className="mt-1 gap-1 text-xs">
                              <Tag className="h-3 w-3" />{cat.name_ar ?? cat.name}
                            </Badge>
                          )}
                        </div>
                        <Badge variant={s.is_active ? 'default' : 'secondary'} className="text-xs shrink-0">
                          {s.is_active ? 'نشطة' : 'معطلة'}
                        </Badge>
                      </div>
                      {s.description && <p className="text-xs text-muted-foreground line-clamp-2">{s.description}</p>}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="font-mono font-bold text-primary">{formatCurrency(Number(s.price ?? 0))}</span>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => openEditService(s)}><Edit className="h-4 w-4" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => handleToggleService(s)}>
                            {s.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setDeleteServiceId(s.id)} className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* === CATEGORIES TAB === */}
          <TabsContent value="categories" className="space-y-5">
            <Card className="border-border/60 shadow-sm">
              <CardContent className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary" />
                    أقسام الخدمات
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    تصنيفات تنظم خدماتك وتجعل بحث العميل أسهل
                  </p>
                </div>
                <Dialog open={isCategoryDialogOpen} onOpenChange={(o) => { setIsCategoryDialogOpen(o); if (!o) resetCategoryForm(); }}>
                  <DialogTrigger asChild>
                    <Button onClick={resetCategoryForm} className="gap-2">
                      <Plus className="h-4 w-4" />
                      قسم جديد
                    </Button>
                  </DialogTrigger>
                  <CategoryDialog
                    editing={editingCategory}
                    form={categoryForm}
                    setForm={setCategoryForm}
                    onSave={handleSaveCategory}
                    onCancel={() => setIsCategoryDialogOpen(false)}
                  />
                </Dialog>
              </CardContent>
            </Card>

            {categories.length === 0 ? (
              <Card className="p-12 text-center">
                <Layers className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">لا توجد أقسام بعد</h3>
                <p className="text-sm text-muted-foreground mb-4">ابدأ بإنشاء أول قسم لتنظيم خدماتك</p>
                <Button onClick={() => setIsCategoryDialogOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" /> إضافة قسم
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((c) => {
                  const count = services.filter((s) => s.category_id === c.id).length;
                  return (
                    <Card key={c.id} className="group border-border/60 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-5 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                              <FolderTree className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{c.name_ar ?? c.name}</h4>
                              <p className="text-xs text-muted-foreground">{count} خدمة</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">#{c.sort_order ?? 0}</Badge>
                        </div>
                        {c.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{c.description}</p>
                        )}
                        <div className="flex items-center gap-2 pt-2 border-t">
                          <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => openEditCategory(c)}>
                            <Edit className="h-3.5 w-3.5" /> تعديل
                          </Button>
                          <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10"
                            onClick={() => setDeleteCategoryId(c.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Delete confirmations */}
        <AlertDialog open={!!deleteServiceId} onOpenChange={(o) => !o && setDeleteServiceId(null)}>
          <AlertDialogContent dir="rtl">
            <AlertDialogHeader>
              <AlertDialogTitle>تأكيد حذف الخدمة</AlertDialogTitle>
              <AlertDialogDescription>
                لا يمكن التراجع عن هذا الإجراء. سيتم حذف الخدمة نهائياً.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteService}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                حذف
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={!!deleteCategoryId} onOpenChange={(o) => !o && setDeleteCategoryId(null)}>
          <AlertDialogContent dir="rtl">
            <AlertDialogHeader>
              <AlertDialogTitle>تأكيد حذف القسم</AlertDialogTitle>
              <AlertDialogDescription>
                سيتم حذف القسم نهائياً. لن يتم الحذف إذا كان مستخدماً في خدمات قائمة.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteCategory}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                حذف
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

// === Sub-components ===
const StatCard = ({
  icon, label, value, tone, isCurrency, className,
}: {
  icon: React.ReactNode; label: string; value: number | string;
  tone: 'primary' | 'success' | 'muted' | 'info' | 'accent';
  isCurrency?: boolean;
  className?: string;
}) => {
  const tones: Record<string, string> = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    muted: 'bg-muted text-muted-foreground',
    info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    accent: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  };
  return (
    <Card className={`border-border/60 shadow-sm hover:shadow-md transition-shadow ${className ?? ''}`}>
      <CardContent className="p-3 md:p-4">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${tones[tone]}`}>
            {React.cloneElement(icon as React.ReactElement, { className: 'h-5 w-5' })}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground truncate">{label}</p>
            <p className={`font-bold tabular-nums whitespace-nowrap ${isCurrency ? 'text-base md:text-lg' : 'text-xl md:text-2xl'}`}>
              {value}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ServiceDialog = ({
  editing, form, setForm, categories, onSave, onCancel, onImageUpload, uploadingImage,
}: {
  editing: Service | null;
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  categories: Category[];
  onSave: () => void;
  onCancel: () => void;
  onImageUpload: (file: File) => Promise<void>;
  uploadingImage: boolean;
}) => {
  const parentCategories = categories.filter((c) => !c.parent_id);
  const subCategories = categories.filter((c) => c.parent_id === form.category_id);
  return (
  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2">
        <Package className="h-5 w-5 text-primary" />
        {editing ? 'تعديل خدمة' : 'إضافة خدمة جديدة'}
      </DialogTitle>
      <DialogDescription>
        املأ بيانات الخدمة. الحقول المعلّمة بـ * مطلوبة.
      </DialogDescription>
    </DialogHeader>
    <div className="space-y-4 py-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label>الاسم العربي *</Label>
          <Input value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
            placeholder="مثال: ترجمة معتمدة" className="mt-1.5" />
        </div>
        <div>
          <Label>الاسم الإنجليزي</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Certified Translation" className="mt-1.5" />
        </div>
      </div>

      <div>
        <Label>الوصف بالعربية</Label>
        <Textarea value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })}
          placeholder="وصف يساعد العميل على فهم الخدمة..." rows={2} className="mt-1.5 resize-none" />
      </div>
      <div>
        <Label>الوصف بالإنجليزية</Label>
        <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="English description..." rows={2} className="mt-1.5 resize-none" />
      </div>

      {/* Image upload */}
      <div>
        <Label className="flex items-center gap-2"><ImageIcon className="h-4 w-4" /> صورة الخدمة</Label>
        <div className="mt-1.5 flex items-center gap-3">
          {form.image_url ? (
            <img src={form.image_url} alt="" className="h-16 w-16 rounded-lg object-cover border" />
          ) : (
            <div className="h-16 w-16 rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/30">
              <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
            </div>
          )}
          <div className="flex-1 flex gap-2">
            <Input
              type="file" accept="image/*"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) onImageUpload(f); }}
              disabled={uploadingImage}
              className="text-xs"
            />
            {form.image_url && (
              <Button type="button" variant="ghost" size="sm" onClick={() => setForm({ ...form, image_url: '' })}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        {uploadingImage && <p className="text-xs text-muted-foreground mt-1">جارٍ الرفع...</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <Label>السعر (ر.س) *</Label>
          <Input type="number" min="0" step="0.01" value={form.price}
            onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} className="mt-1.5" />
        </div>
        <div>
          <Label>الوحدة</Label>
          <Select value={form.unit} onValueChange={(v) => setForm({ ...form, unit: v })}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              {UNITS.map((u) => (
                <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>ترتيب العرض</Label>
          <Input type="number" min="0" value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="mt-1.5" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label>القسم الرئيسي</Label>
          <Select value={form.category_id || 'none'}
            onValueChange={(v) => setForm({ ...form, category_id: v === 'none' ? '' : v, subcategory_id: '' })}>
            <SelectTrigger className="mt-1.5"><SelectValue placeholder="بدون قسم" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">بدون قسم</SelectItem>
              {parentCategories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name_ar ?? c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>القسم الفرعي (اختياري)</Label>
          <Select value={form.subcategory_id || 'none'}
            onValueChange={(v) => setForm({ ...form, subcategory_id: v === 'none' ? '' : v })}
            disabled={!form.category_id || subCategories.length === 0}>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder={subCategories.length === 0 ? 'لا توجد أقسام فرعية' : 'بدون'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">بدون</SelectItem>
              {subCategories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name_ar ?? c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-center justify-between bg-muted/40 rounded-lg p-3">
          <div>
            <Label className="font-semibold flex items-center gap-1"><Star className="h-4 w-4 text-amber-500" /> خدمة مميزة</Label>
            <p className="text-xs text-muted-foreground mt-0.5">تظهر في الواجهة الرئيسية</p>
          </div>
          <Switch checked={form.is_featured} onCheckedChange={(c) => setForm({ ...form, is_featured: c })} />
        </div>
        <div className="flex items-center justify-between bg-muted/40 rounded-lg p-3">
          <div>
            <Label className="font-semibold">حالة الخدمة</Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              {form.is_active ? 'ظاهرة للعملاء' : 'مخفية'}
            </p>
          </div>
          <Switch checked={form.is_active} onCheckedChange={(c) => setForm({ ...form, is_active: c })} />
        </div>
      </div>
    </div>
    <DialogFooter className="gap-2">
      <Button variant="outline" onClick={onCancel}>إلغاء</Button>
      <Button onClick={onSave} className="gap-2">
        <CheckCircle2 className="h-4 w-4" />
        {editing ? 'حفظ التعديلات' : 'إضافة الخدمة'}
      </Button>
    </DialogFooter>
  </DialogContent>
  );
};

const CategoryDialog = ({
  editing, form, setForm, onSave, onCancel, allCategories,
}: {
  editing: Category | null;
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  onSave: () => void;
  onCancel: () => void;
  allCategories: Category[];
}) => {
  const possibleParents = allCategories.filter(
    (c) => !c.parent_id && c.id !== editing?.id
  );
  return (
  <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto" dir="rtl">
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2">
        <Layers className="h-5 w-5 text-primary" />
        {editing ? 'تعديل القسم' : 'إضافة قسم جديد'}
      </DialogTitle>
    </DialogHeader>
    <div className="space-y-4 py-2">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>الاسم العربي *</Label>
          <Input value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
            placeholder="خدمات الترجمة" className="mt-1.5" />
        </div>
        <div>
          <Label>الاسم الإنجليزي</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Translation" className="mt-1.5" />
        </div>
      </div>
      <div>
        <Label>الوصف</Label>
        <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={2} className="mt-1.5 resize-none" />
      </div>
      <div>
        <Label>القسم الأب (اتركه فارغًا للقسم الرئيسي)</Label>
        <Select value={form.parent_id || 'none'}
          onValueChange={(v) => setForm({ ...form, parent_id: v === 'none' ? '' : v })}>
          <SelectTrigger className="mt-1.5"><SelectValue placeholder="قسم رئيسي" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">— قسم رئيسي —</SelectItem>
            {possibleParents.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name_ar ?? c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>أيقونة (lucide)</Label>
          <Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}
            placeholder="Languages" className="mt-1.5" />
        </div>
        <div>
          <Label>اللون (HEX)</Label>
          <Input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}
            placeholder="#3b82f6" className="mt-1.5" />
        </div>
      </div>
      <div>
        <Label>ترتيب العرض</Label>
        <Input type="number" min="0" value={form.sort_order}
          onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="mt-1.5" />
      </div>
      <div className="flex items-center justify-between bg-muted/40 rounded-lg p-3">
        <Label className="font-semibold">تفعيل القسم</Label>
        <Switch checked={form.is_active} onCheckedChange={(c) => setForm({ ...form, is_active: c })} />
      </div>
    </div>
    <DialogFooter className="gap-2">
      <Button variant="outline" onClick={onCancel}>إلغاء</Button>
      <Button onClick={onSave} className="gap-2">
        <CheckCircle2 className="h-4 w-4" />
        {editing ? 'حفظ التعديلات' : 'إضافة القسم'}
      </Button>
    </DialogFooter>
  </DialogContent>
  );
};

export default AdminServices;
