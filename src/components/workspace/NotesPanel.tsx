import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StickyNote, Plus, Trash2, Search, Loader2, Cloud, CloudOff } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
  tags?: string[];
  source_type?: string | null;
}

interface Props {
  notes: Note[];
  setNotes: (n: Note[]) => void;
}

export default function NotesPanel({ notes, setNotes }: Props) {
  const [activeId, setActiveId] = useState<string | null>(notes[0]?.id || null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const active = notes.find((n) => n.id === activeId);

  // Load from Supabase on mount
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setUserId(user.id);
      const { data, error } = await supabase
        .from('workspace_notes')
        .select('*')
        .order('updated_at', { ascending: false });
      if (!error && data) {
        const mapped: Note[] = data.map((r: any) => ({
          id: r.id, title: r.title, content: r.content,
          updatedAt: new Date(r.updated_at).getTime(),
          tags: r.tags || [], source_type: r.source_type,
        }));
        setNotes(mapped);
        if (mapped[0]) setActiveId(mapped[0].id);
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const create = async () => {
    if (!userId) return toast.error('يجب تسجيل الدخول');
    const { data, error } = await supabase
      .from('workspace_notes')
      .insert({ user_id: userId, title: 'ملاحظة جديدة', content: '' })
      .select().single();
    if (error || !data) return toast.error('فشل الإنشاء');
    const n: Note = { id: data.id, title: data.title, content: data.content, updatedAt: Date.now() };
    setNotes([n, ...notes]);
    setActiveId(n.id);
  };

  const persist = useCallback(async (id: string, patch: Partial<Note>) => {
    setSaving(true);
    const upd: any = {};
    if (patch.title !== undefined) upd.title = patch.title;
    if (patch.content !== undefined) upd.content = patch.content;
    await supabase.from('workspace_notes').update(upd).eq('id', id);
    setSaving(false);
  }, []);

  const update = (patch: Partial<Note>) => {
    if (!active) return;
    const next = notes.map((n) => (n.id === active.id ? { ...n, ...patch, updatedAt: Date.now() } : n));
    setNotes(next);
    persist(active.id, patch);
  };

  const remove = async (id: string) => {
    await supabase.from('workspace_notes').delete().eq('id', id);
    const next = notes.filter((n) => n.id !== id);
    setNotes(next);
    if (activeId === id) setActiveId(next[0]?.id || null);
    toast.success('حُذفت');
  };

  const filtered = notes.filter((n) =>
    !search || n.title.includes(search) || n.content.includes(search),
  );

  if (loading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-3 md:col-span-1">
        <div className="flex gap-2 mb-3">
          <Button onClick={create} size="sm" className="flex-1 gap-1">
            <Plus className="h-4 w-4" /> جديدة
          </Button>
        </div>
        <div className="relative mb-3">
          <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث..." className="pr-8" />
        </div>
        <ScrollArea className="h-[400px]">
          <div className="space-y-1">
            {filtered.map((n) => (
              <button
                key={n.id}
                onClick={() => setActiveId(n.id)}
                className={`w-full text-right p-2 rounded-md transition-colors group flex items-start justify-between gap-2 ${
                  activeId === n.id ? 'bg-primary/10 border border-primary/30' : 'hover:bg-muted/50'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{n.title || 'بلا عنوان'}</p>
                  <p className="text-xs text-muted-foreground truncate">{n.content.slice(0, 40) || 'فارغة'}</p>
                </div>
                <Trash2
                  onClick={(e) => { e.stopPropagation(); remove(n.id); }}
                  className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 text-destructive shrink-0 mt-1"
                />
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-xs text-muted-foreground py-8">لا توجد ملاحظات</p>
            )}
          </div>
        </ScrollArea>
      </Card>

      <Card className="p-4 md:col-span-2">
        {active ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <Input
                value={active.title}
                onChange={(e) => update({ title: e.target.value })}
                className="text-lg font-bold border-0 focus-visible:ring-0 px-0"
                placeholder="عنوان..."
              />
              <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                {saving ? <><Loader2 className="h-3 w-3 animate-spin" /> حفظ...</> : <><Cloud className="h-3 w-3 text-green-600" /> محفوظ</>}
              </span>
            </div>
            <Textarea
              value={active.content}
              onChange={(e) => update({ content: e.target.value })}
              placeholder="ابدأ الكتابة..."
              className="min-h-[420px] resize-none text-base leading-relaxed border-0 focus-visible:ring-0 px-0"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
            <StickyNote className="h-12 w-12 mb-3 opacity-30" />
            <p>اختر ملاحظة أو أنشئ واحدة جديدة</p>
          </div>
        )}
      </Card>
    </div>
  );
}
