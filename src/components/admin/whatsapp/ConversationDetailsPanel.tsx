// قسم تفاصيل المحادثة الجانبي: ملاحظات داخلية + إسناد لمدير
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { StickyNote, UserCheck, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Note { id: string; admin_name: string | null; body: string; created_at: string; }
interface Admin { user_id: string; full_name: string | null; }

export function ConversationDetailsPanel({ conversationId, currentAssignee, onAssigneeChanged }: {
  conversationId: string;
  currentAssignee: string | null;
  onAssigneeChanged: (id: string | null) => void;
}) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [newNote, setNewNote] = useState("");
  const [saving, setSaving] = useState(false);

  const loadNotes = async () => {
    const { data } = await supabase
      .from("whatsapp_conversation_notes" as any)
      .select("id, admin_name, body, created_at")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: false });
    setNotes((data as any) || []);
  };

  const loadAdmins = async () => {
    const { data: roleRows } = await supabase
      .from("user_roles").select("user_id").eq("role", "admin");
    const ids = (roleRows || []).map((r: any) => r.user_id);
    if (!ids.length) return;
    const { data: profs } = await supabase
      .from("profiles").select("id, full_name").in("id", ids);
    setAdmins(((profs as any[]) || []).map((p) => ({ user_id: p.id, full_name: p.full_name })));
  };

  useEffect(() => { loadNotes(); }, [conversationId]);
  useEffect(() => { loadAdmins(); }, []);

  const addNote = async () => {
    if (!newNote.trim()) return;
    setSaving(true);
    const { data: u } = await supabase.auth.getUser();
    const { data: prof } = u.user
      ? await supabase.from("profiles").select("full_name").eq("id", u.user.id).maybeSingle()
      : { data: null };
    const { error } = await supabase.from("whatsapp_conversation_notes" as any).insert({
      conversation_id: conversationId,
      admin_id: u.user?.id,
      admin_name: (prof as any)?.full_name || u.user?.email,
      body: newNote.trim(),
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    setNewNote("");
    toast.success("تم حفظ الملاحظة");
    loadNotes();
  };

  const assign = async (userId: string) => {
    const value = userId === "_none" ? null : userId;
    const { error } = await supabase.from("whatsapp_conversations")
      .update({ assigned_to: value }).eq("id", conversationId);
    if (error) return toast.error(error.message);
    onAssigneeChanged(value);
    toast.success(value ? "تم الإسناد" : "تم إلغاء الإسناد");
  };

  return (
    <div className="border-t bg-muted/30 p-3 space-y-3">
      {/* الإسناد */}
      <div>
        <label className="text-xs font-semibold flex items-center gap-1 mb-1.5">
          <UserCheck className="w-3.5 h-3.5" /> إسناد المحادثة لمسؤول
        </label>
        <Select value={currentAssignee || "_none"} onValueChange={assign}>
          <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="غير مُسندة" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="_none">— غير مُسندة —</SelectItem>
            {admins.map((a) => (
              <SelectItem key={a.user_id} value={a.user_id}>{a.full_name || a.user_id.slice(0, 8)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* الملاحظات */}
      <div>
        <label className="text-xs font-semibold flex items-center gap-1 mb-1.5">
          <StickyNote className="w-3.5 h-3.5" /> ملاحظات داخلية ({notes.length})
        </label>
        <div className="flex gap-1.5 mb-2">
          <Textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} rows={2}
            placeholder="ملاحظة لا يراها العميل..." className="text-xs" />
          <Button size="sm" onClick={addNote} disabled={saving || !newNote.trim()}>
            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : "حفظ"}
          </Button>
        </div>
        <ScrollArea className="max-h-40">
          <div className="space-y-1.5">
            <AnimatePresence>
              {notes.map((n) => (
                <motion.div key={n.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-accent/40 border border-accent rounded p-2 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold">{n.admin_name || "مشرف"}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(n.created_at).toLocaleString("ar-SA", { dateStyle: "short", timeStyle: "short" })}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap">{n.body}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
