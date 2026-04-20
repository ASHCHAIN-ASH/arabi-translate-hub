import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Zap, Plus, Trash2, Save, X } from 'lucide-react';
import { toast } from 'sonner';

export interface ReplyTemplate {
  id: string;
  title: string;
  body: string;
  category: string | null;
  shortcut: string | null;
  use_count: number;
  is_active: boolean;
}

interface Props {
  onPick: (body: string, id: string) => void;
}

export const InboxTemplatesDialog: React.FC<Props> = ({ onPick }) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<ReplyTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<ReplyTemplate | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('inbox_reply_templates')
      .select('*')
      .eq('is_active', true)
      .order('use_count', { ascending: false });
    if (error) toast.error('تعذر تحميل القوالب');
    else setItems(data as any[]);
    setLoading(false);
  }, []);

  useEffect(() => { if (open) load(); }, [open, load]);

  const save = async () => {
    if (!editing?.title.trim() || !editing?.body.trim()) return;
    const payload = {
      title: editing.title, body: editing.body,
      category: editing.category, shortcut: editing.shortcut,
    };
    const q = editing.id
      ? supabase.from('inbox_reply_templates').update(payload).eq('id', editing.id)
      : supabase.from('inbox_reply_templates').insert(payload);
    const { error } = await q;
    if (error) toast.error('فشل الحفظ');
    else { toast.success('تم الحفظ'); setEditing(null); load(); }
  };

  const del = async (id: string) => {
    const { error } = await supabase.from('inbox_reply_templates').delete().eq('id', id);
    if (error) toast.error('تعذر الحذف'); else { toast.success('تم الحذف'); load(); }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          ردود جاهزة
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            مكتبة الردود الجاهزة
          </DialogTitle>
        </DialogHeader>

        {editing ? (
          <div className="space-y-3">
            <Input placeholder="عنوان القالب" value={editing.title}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="التصنيف (اختياري)" value={editing.category ?? ''}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
              <Input placeholder="اختصار (مثال: ack)" value={editing.shortcut ?? ''}
                onChange={(e) => setEditing({ ...editing, shortcut: e.target.value })} />
            </div>
            <Textarea rows={8} placeholder="نص الرد..." value={editing.body}
              onChange={(e) => setEditing({ ...editing, body: e.target.value })} />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>
                <X className="w-4 h-4" /> إلغاء
              </Button>
              <Button size="sm" onClick={save}>
                <Save className="w-4 h-4 ml-1" /> حفظ
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-end">
              <Button size="sm" variant="outline"
                onClick={() => setEditing({ id: '', title: '', body: '', category: '', shortcut: '', use_count: 0, is_active: true })}>
                <Plus className="w-4 h-4 ml-1" /> قالب جديد
              </Button>
            </div>
            <ScrollArea className="h-[420px] pr-2">
              {loading ? (
                <div className="text-center text-sm text-muted-foreground py-10">جاري التحميل...</div>
              ) : items.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground py-10">لا توجد قوالب</div>
              ) : (
                <ul className="space-y-2">
                  {items.map((t) => (
                    <li key={t.id} className="border rounded-lg p-3 hover:bg-accent/40 transition-colors">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm">{t.title}</span>
                          {t.category && <Badge variant="secondary" className="text-[10px]">{t.category}</Badge>}
                          {t.shortcut && (
                            <Badge variant="outline" className="text-[10px] font-mono">/{t.shortcut}</Badge>
                          )}
                          {t.use_count > 0 && (
                            <span className="text-[10px] text-muted-foreground">استُخدم {t.use_count} مرة</span>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => setEditing(t)}>تعديل</Button>
                          <Button size="sm" variant="ghost" className="text-destructive"
                            onClick={() => del(t.id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-3 whitespace-pre-wrap mb-2">{t.body}</p>
                      <Button size="sm" className="w-full"
                        onClick={async () => {
                          onPick(t.body, t.id);
                          await supabase.from('inbox_reply_templates').update({ use_count: t.use_count + 1 }).eq('id', t.id);
                          setOpen(false);
                        }}>
                        إدراج هذا الرد
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </ScrollArea>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
