import { useState, KeyboardEvent } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tag, X, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  messageId: string;
  tags: string[];
}

const COLORS = [
  'bg-blue-500/10 text-blue-700 dark:text-blue-300',
  'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  'bg-amber-500/10 text-amber-700 dark:text-amber-300',
  'bg-rose-500/10 text-rose-700 dark:text-rose-300',
  'bg-violet-500/10 text-violet-700 dark:text-violet-300',
  'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
];

const colorFor = (tag: string) => {
  let h = 0;
  for (let i = 0; i < tag.length; i++) h = (h * 31 + tag.charCodeAt(i)) >>> 0;
  return COLORS[h % COLORS.length];
};

export const InboxTagsEditor: React.FC<Props> = ({ messageId, tags }) => {
  const [adding, setAdding] = useState(false);
  const [val, setVal] = useState('');

  const update = async (next: string[]) => {
    const { error } = await supabase.from('inbox_messages').update({ tags: next }).eq('id', messageId);
    if (error) toast.error('تعذر تحديث الوسوم');
  };

  const add = async () => {
    const t = val.trim();
    if (!t) { setAdding(false); return; }
    if (tags.includes(t)) { setVal(''); setAdding(false); return; }
    await update([...tags, t]);
    setVal(''); setAdding(false);
  };

  const remove = (t: string) => update(tags.filter((x) => x !== t));

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); add(); }
    else if (e.key === 'Escape') { setVal(''); setAdding(false); }
  };

  return (
    <div className="flex items-center flex-wrap gap-1.5">
      <Tag className="w-3.5 h-3.5 text-muted-foreground" />
      {tags.map((t) => (
        <Badge key={t} className={`gap-1 border-0 text-[10px] ${colorFor(t)}`}>
          {t}
          <button onClick={() => remove(t)} className="opacity-60 hover:opacity-100">
            <X className="w-2.5 h-2.5" />
          </button>
        </Badge>
      ))}
      {adding ? (
        <Input
          autoFocus value={val} onChange={(e) => setVal(e.target.value)}
          onBlur={add} onKeyDown={onKey}
          placeholder="وسم..."
          className="h-6 w-24 text-xs px-2"
        />
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-0.5 text-[10px] px-2 py-0.5 rounded-full border border-dashed text-muted-foreground hover:bg-accent transition-colors"
        >
          <Plus className="w-2.5 h-2.5" /> وسم
        </button>
      )}
    </div>
  );
};
