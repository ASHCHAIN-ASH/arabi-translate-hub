import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import {
  Library, Plus, Search, Edit2, Trash2, ExternalLink, Eye, EyeOff, Crown, RefreshCw, FileText,
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string | null;
  resource_type: string;
  url: string;
  category: string | null;
  cover_image_url: string | null;
  tags: string[] | null;
  is_premium: boolean;
  is_published: boolean;
  sort_order: number;
  views_count: number;
  created_at: string;
}

const TYPES = ['pdf', 'video', 'link', 'template', 'article'];

const empty = (): Partial<Resource> => ({
  title: '', description: '', resource_type: 'pdf', url: '',
  category: '', cover_image_url: '', tags: [], is_premium: false, is_published: true, sort_order: 0,
});

const AdminStudentResources: React.FC = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [editing, setEditing] = useState<Partial<Resource> | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from('student_resources')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) {
      toast({ title: 'خطأ في التحميل', description: error.message, variant: 'destructive' });
    } else {
      setItems((data || []) as Resource[]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => items.filter(r => {
    if (typeFilter !== 'all' && r.resource_type !== typeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!`${r.title} ${r.description ?? ''} ${r.category ?? ''}`.toLowerCase().includes(q)) return false;
    }
    return true;
  }), [items, search, typeFilter]);

  const openNew = () => { setEditing(empty()); setTagInput(''); };
  const openEdit = (r: Resource) => { setEditing({ ...r }); setTagInput((r.tags ?? []).join(', ')); };
  const close = () => { setEditing(null); setTagInput(''); };

  const save = async () => {
    if (!editing) return;
    if (!editing.title?.trim() || !editing.url?.trim() || !editing.resource_type) {
      toast({ title: 'حقول مطلوبة', description: 'العنوان، الرابط، والنوع مطلوبة', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
    const payload: any = {
      title: editing.title.trim(),
      description: editing.description?.trim() || null,
      resource_type: editing.resource_type,
      url: editing.url.trim(),
      category: editing.category?.trim() || null,
      cover_image_url: editing.cover_image_url?.trim() || null,
      tags,
      is_premium: !!editing.is_premium,
      is_published: editing.is_published !== false,
      sort_order: Number(editing.sort_order) || 0,
    };

    let error;
    if (editing.id) {
      ({ error } = await (supabase as any).from('student_resources').update(payload).eq('id', editing.id));
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      payload.created_by = user?.id ?? null;
      ({ error } = await (supabase as any).from('student_resources').insert(payload));
    }

    setSaving(false);
    if (error) {
      toast({ title: 'فشل الحفظ', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'تم الحفظ بنجاح' });
      close();
      load();
    }
  };

  const togglePublished = async (r: Resource) => {
    const { error } = await (supabase as any)
      .from('student_resources')
      .update({ is_published: !r.is_published })
      .eq('id', r.id);
    if (error) {
      toast({ title: 'فشل التحديث', description: error.message, variant: 'destructive' });
    } else {
      load();
    }
  };

  const remove = async (id: string) => {
    const { error } = await (supabase as any).from('student_resources').delete().eq('id', id);
    if (error) {
      toast({ title: 'فشل الحذف', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'تم الحذف' });
      load();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Library className="w-7 h-7 text-primary" />
              موارد مكتبة الطالب
            </h1>
            <p className="text-sm text-muted-foreground mt-1">إدارة المحتوى الذي يظهر للطلاب في صفحة المكتبة.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={load}><RefreshCw className="w-4 h-4 ml-1" /> تحديث</Button>
            <Button onClick={openNew}><Plus className="w-4 h-4 ml-1" /> مورد جديد</Button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="الإجمالي" value={items.length} icon={FileText} />
          <StatCard label="منشور" value={items.filter(i => i.is_published).length} icon={Eye} tone="success" />
          <StatCard label="مميز" value={items.filter(i => i.is_premium).length} icon={Crown} tone="warning" />
          <StatCard label="إجمالي المشاهدات" value={items.reduce((s, i) => s + (i.views_count || 0), 0)} icon={Eye} tone="info" />
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث..." className="pr-10" />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="md:w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                {TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs">
                <tr>
                  <th className="px-4 py-3 text-right font-medium">العنوان</th>
                  <th className="px-4 py-3 text-right font-medium hidden md:table-cell">النوع</th>
                  <th className="px-4 py-3 text-right font-medium hidden lg:table-cell">التصنيف</th>
                  <th className="px-4 py-3 text-right font-medium">الحالة</th>
                  <th className="px-4 py-3 text-right font-medium hidden md:table-cell">المشاهدات</th>
                  <th className="px-4 py-3 text-right font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">جاري التحميل...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">لا توجد موارد</td></tr>
                ) : filtered.map(r => (
                  <tr key={r.id} className="border-t hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium line-clamp-1">{r.title}</div>
                      {r.description && <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{r.description}</div>}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell"><Badge variant="outline">{r.resource_type}</Badge></td>
                    <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{r.category ?? '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {r.is_published ? <Badge variant="default" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">منشور</Badge> : <Badge variant="secondary">مخفي</Badge>}
                        {r.is_premium && <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"><Crown className="w-3 h-3 mr-1" />مميز</Badge>}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{r.views_count}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => window.open(r.url, '_blank')} title="فتح">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => togglePublished(r)} title={r.is_published ? 'إخفاء' : 'نشر'}>
                          {r.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(r)} title="تعديل">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" title="حذف">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                              <AlertDialogDescription>سيتم حذف "{r.title}" نهائياً.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>إلغاء</AlertDialogCancel>
                              <AlertDialogAction onClick={() => remove(r.id)} className="bg-destructive">حذف</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={!!editing} onOpenChange={o => !o && close()}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing?.id ? 'تعديل المورد' : 'مورد جديد'}</DialogTitle>
            </DialogHeader>
            {editing && (
              <div className="space-y-4 py-2">
                <div>
                  <Label>العنوان *</Label>
                  <Input value={editing.title ?? ''} onChange={e => setEditing({ ...editing, title: e.target.value })} />
                </div>
                <div>
                  <Label>الوصف</Label>
                  <Textarea rows={2} value={editing.description ?? ''} onChange={e => setEditing({ ...editing, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>النوع *</Label>
                    <Select value={editing.resource_type} onValueChange={v => setEditing({ ...editing, resource_type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>التصنيف</Label>
                    <Input value={editing.category ?? ''} onChange={e => setEditing({ ...editing, category: e.target.value })} placeholder="مثلاً: منهجية، إحصاء..." />
                  </div>
                </div>
                <div>
                  <Label>الرابط *</Label>
                  <Input value={editing.url ?? ''} onChange={e => setEditing({ ...editing, url: e.target.value })} dir="ltr" placeholder="https://..." />
                </div>
                <div>
                  <Label>صورة الغلاف (URL)</Label>
                  <Input value={editing.cover_image_url ?? ''} onChange={e => setEditing({ ...editing, cover_image_url: e.target.value })} dir="ltr" placeholder="https://..." />
                </div>
                <div>
                  <Label>الوسوم (مفصولة بفاصلة)</Label>
                  <Input value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="بحث, رسالة, ماجستير" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                  <div>
                    <Label>الترتيب</Label>
                    <Input type="number" value={editing.sort_order ?? 0} onChange={e => setEditing({ ...editing, sort_order: Number(e.target.value) })} />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <Switch checked={!!editing.is_published} onCheckedChange={v => setEditing({ ...editing, is_published: v })} />
                    <Label>منشور</Label>
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <Switch checked={!!editing.is_premium} onCheckedChange={v => setEditing({ ...editing, is_premium: v })} />
                    <Label>للأعضاء فقط</Label>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={close}>إلغاء</Button>
              <Button onClick={save} disabled={saving}>{saving ? 'جاري الحفظ...' : 'حفظ'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

const StatCard: React.FC<{ label: string; value: number; icon: any; tone?: 'success' | 'warning' | 'info' }> = ({ label, value, icon: Icon, tone }) => {
  const tones = {
    success: 'bg-green-500/10 text-green-600',
    warning: 'bg-amber-500/10 text-amber-600',
    info: 'bg-blue-500/10 text-blue-600',
  } as const;
  const toneClass = tone ? tones[tone] : 'bg-primary/10 text-primary';
  return (
    <Card className="p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${toneClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-xl font-bold">{value}</div>
      </div>
    </Card>
  );
};

export default AdminStudentResources;
