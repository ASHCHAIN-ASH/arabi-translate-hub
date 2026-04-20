import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StickyNote, Send, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

interface Note {
  id: string;
  body: string;
  admin_name: string | null;
  created_at: string;
  admin_id: string | null;
}

export const InboxNotesPanel: React.FC<{ messageId: string }> = ({ messageId }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('inbox_notes').select('*')
      .eq('message_id', messageId)
      .order('created_at', { ascending: false });
    setNotes((data as any[]) ?? []);
  }, [messageId]);

  useEffect(() => { load(); }, [load]);

  // Realtime
  useEffect(() => {
    const ch = supabase
      .channel(`inbox-notes-${messageId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inbox_notes', filter: `message_id=eq.${messageId}` },
        () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [messageId, load]);

  const add = async () => {
    if (!body.trim()) return;
    setSaving(true);
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from('inbox_notes').insert({
      message_id: messageId,
      body: body.trim(),
      admin_id: u.user?.id ?? null,
      admin_name: (u.user?.user_metadata as any)?.full_name ?? u.user?.email ?? null,
    });
    if (error) toast.error('تعذر الحفظ');
    else { setBody(''); toast.success('تمت إضافة الملاحظة'); }
    setSaving(false);
  };

  const del = async (id: string) => {
    const { error } = await supabase.from('inbox_notes').delete().eq('id', id);
    if (error) toast.error('تعذر الحذف');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <StickyNote className="w-4 h-4 text-amber-500" />
        ملاحظات داخلية
        <span className="text-[10px] text-muted-foreground font-normal">(لا يراها العميل)</span>
      </div>

      <div className="rounded-lg border bg-amber-500/5 p-2 space-y-2">
        <Textarea
          rows={2}
          placeholder="اكتب ملاحظة للفريق فقط..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="resize-none text-sm bg-background"
        />
        <Button size="sm" onClick={add} disabled={saving || !body.trim()} className="w-full gap-1">
          <Send className="w-3.5 h-3.5" /> إضافة ملاحظة
        </Button>
      </div>

      <ScrollArea className="max-h-48">
        <ul className="space-y-2">
          <AnimatePresence>
            {notes.map((n) => (
              <motion.li
                key={n.id}
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-xs rounded-md border bg-background p-2 group relative"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-foreground/80">{n.admin_name ?? 'مسؤول'}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground text-[10px]">
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: ar })}
                    </span>
                    <button onClick={() => del(n.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <p className="whitespace-pre-wrap text-foreground/90">{n.body}</p>
              </motion.li>
            ))}
          </AnimatePresence>
          {notes.length === 0 && (
            <div className="text-center text-xs text-muted-foreground py-3">لا توجد ملاحظات بعد</div>
          )}
        </ul>
      </ScrollArea>
    </div>
  );
};
