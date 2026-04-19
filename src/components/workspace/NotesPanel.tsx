import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StickyNote, Plus, Trash2, Search, Save } from 'lucide-react';
import { toast } from 'sonner';

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

const STORAGE_KEY = 'workspace_notes_v1';

export function loadNotes(): Note[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}
export function saveNotes(notes: Note[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

interface Props {
  notes: Note[];
  setNotes: (n: Note[]) => void;
}

export default function NotesPanel({ notes, setNotes }: Props) {
  const [activeId, setActiveId] = useState<string | null>(notes[0]?.id || null);
  const [search, setSearch] = useState('');
  const active = notes.find((n) => n.id === activeId);

  useEffect(() => {
    if (!activeId && notes.length > 0) setActiveId(notes[0].id);
  }, [notes, activeId]);

  const create = () => {
    const n: Note = { id: crypto.randomUUID(), title: 'ملاحظة جديدة', content: '', updatedAt: Date.now() };
    const next = [n, ...notes];
    setNotes(next); saveNotes(next);
    setActiveId(n.id);
  };

  const update = (patch: Partial<Note>) => {
    if (!active) return;
    const next = notes.map((n) => (n.id === active.id ? { ...n, ...patch, updatedAt: Date.now() } : n));
    setNotes(next); saveNotes(next);
  };

  const remove = (id: string) => {
    const next = notes.filter((n) => n.id !== id);
    setNotes(next); saveNotes(next);
    if (activeId === id) setActiveId(next[0]?.id || null);
    toast.success('حُذفت');
  };

  const filtered = notes.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Sidebar */}
      <Card className="p-3 lg:col-span-1">
        <div className="flex gap-2 mb-3">
          <Button size="sm" onClick={create} className="flex-1 gap-1"><Plus className="h-3 w-3" /> جديد</Button>
        </div>
        <div className="relative mb-2">
          <Search className="absolute right-2 top-2.5 h-3 w-3 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث..." className="pr-7 h-8 text-sm" />
        </div>
        <ScrollArea className="h-[420px]">
          {filtered.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">لا توجد ملاحظات</p>
          ) : filtered.map((n) => (
            <div
              key={n.id}
              onClick={() => setActiveId(n.id)}
              className={`p-2 rounded-md cursor-pointer mb-1 group flex items-start justify-between gap-2 ${activeId === n.id ? 'bg-primary/10 border border-primary/30' : 'hover:bg-muted/50'}`}
            >
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate">{n.title || 'بدون عنوان'}</div>
                <div className="text-xs text-muted-foreground truncate">{n.content.slice(0, 40) || 'فارغة'}</div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); remove(n.id); }} className="opacity-0 group-hover:opacity-100 text-destructive">
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </ScrollArea>
      </Card>

      {/* Editor */}
      <Card className="p-4 lg:col-span-2">
        {active ? (
          <>
            <Input
              value={active.title}
              onChange={(e) => update({ title: e.target.value })}
              placeholder="عنوان..."
              className="text-lg font-bold border-0 px-0 mb-2 focus-visible:ring-0"
            />
            <Textarea
              value={active.content}
              onChange={(e) => update({ content: e.target.value })}
              placeholder="ابدأ الكتابة..."
              className="min-h-[420px] resize-none border-0 px-0 focus-visible:ring-0 text-base leading-relaxed"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
              <span>آخر تحديث: {new Date(active.updatedAt).toLocaleString('ar')}</span>
              <span className="flex items-center gap-1"><Save className="h-3 w-3" /> حفظ تلقائي</span>
            </div>
          </>
        ) : (
          <div className="min-h-[480px] flex flex-col items-center justify-center text-muted-foreground">
            <StickyNote className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-sm mb-3">لا توجد ملاحظة محددة</p>
            <Button onClick={create} variant="outline" size="sm"><Plus className="h-3 w-3" /> إنشاء أول ملاحظة</Button>
          </div>
        )}
      </Card>
    </div>
  );
}
