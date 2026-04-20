// صندوق محادثات الواتساب — تصميم مدمج مع فلاتر وشارات حالة
import React, { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import WhatsappLayout from "@/components/admin/whatsapp/WhatsappLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConversationDetailsPanel } from "@/components/admin/whatsapp/ConversationDetailsPanel";
import { toast } from "sonner";
import {
  Send, Sparkles, MessageSquare, Loader2, Smile, Pin, Star, Bot, User,
  Search, Paperclip, Filter, CheckCheck, Clock, AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const EMOJIS = ["😀","😊","🙏","👍","✅","🎉","🌹","💼","📋","🧾","📜","💳","⏳","🔔","📞","🎓","📚","✨","🔥","💡","⭐","❤️","🤝","📩","📎","🚀"];
type FilterKey = "all" | "unread" | "mine" | "ai" | "starred";

interface Conversation {
  id: string; phone: string; customer_name: string | null;
  status: string; is_pinned: boolean; is_starred: boolean;
  unread_count: number; last_message: string | null;
  last_message_at: string | null; human_takeover: boolean;
  assigned_to: string | null;
}
interface Message {
  id: string; direction: "inbound" | "outbound"; sender_type: string;
  sender_name: string | null; body: string; message_type: string;
  delivery_status: string; created_at: string;
  media_url?: string | null; media_filename?: string | null;
}
interface QuickReply { id: string; shortcut: string | null; title: string; body: string; }

export default function WhatsappInboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [convSearch, setConvSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const loadConversations = async () => {
    const { data } = await supabase
      .from("whatsapp_conversations").select("*")
      .order("is_pinned", { ascending: false })
      .order("last_message_at", { ascending: false, nullsFirst: false })
      .limit(200);
    setConversations((data as Conversation[]) || []);
  };
  const loadMessages = async (convId: string) => {
    const { data } = await supabase
      .from("whatsapp_messages").select("*")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true });
    setMessages((data as Message[]) || []);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    await supabase.from("whatsapp_conversations").update({
      unread_count: 0, last_admin_read_at: new Date().toISOString(),
    }).eq("id", convId);
  };
  const loadQuickReplies = async () => {
    const { data } = await supabase.from("whatsapp_quick_replies").select("*").eq("is_active", true);
    setQuickReplies((data as QuickReply[]) || []);
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUserId(data.user?.id || null));
    loadConversations(); loadQuickReplies();
    audioRef.current = new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=");
    const soundOn = localStorage.getItem("wa_sound") !== "off";
    const ch = supabase.channel("wa-inbox")
      .on("postgres_changes", { event: "*", schema: "public", table: "whatsapp_conversations" }, () => loadConversations())
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "whatsapp_messages" }, (p: any) => {
        if (activeConv && p.new.conversation_id === activeConv.id) loadMessages(activeConv.id);
        if (p.new.direction === "inbound" && soundOn) audioRef.current?.play().catch(() => {});
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [activeConv?.id]);

  useEffect(() => { if (activeConv) loadMessages(activeConv.id); }, [activeConv?.id]);

  const sendReply = async () => {
    if (!reply.trim() || !activeConv) return;
    setSending(true);
    const { data, error } = await supabase.functions.invoke("whatsapp-conversation-reply", {
      body: { conversation_id: activeConv.id, body: reply },
    });
    setSending(false);
    if (error || data?.error) return toast.error(data?.error || error?.message || "فشل الإرسال");
    setReply(""); setShowEmoji(false);
    toast.success("تم الإرسال ✅");
    loadMessages(activeConv.id);
  };

  const aiSuggest = async (tone = "professional") => {
    if (!activeConv) return;
    setAiLoading(true);
    const { data, error } = await supabase.functions.invoke("whatsapp-ai-suggest", {
      body: { conversation_id: activeConv.id, tone },
    });
    setAiLoading(false);
    if (error || data?.error) return toast.error(data?.error || "فشل الاقتراح");
    setReply(data.suggestion || "");
  };

  const togglePin = async (conv: Conversation) =>
    supabase.from("whatsapp_conversations").update({ is_pinned: !conv.is_pinned }).eq("id", conv.id);
  const toggleStar = async (conv: Conversation) =>
    supabase.from("whatsapp_conversations").update({ is_starred: !conv.is_starred }).eq("id", conv.id);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeConv) return;
    if (file.size > 16 * 1024 * 1024) return toast.error("الحد الأقصى 16MB");
    setUploading(true);
    const path = `${activeConv.id}/${Date.now()}-${file.name}`;
    const { error: upErr } = await supabase.storage.from("whatsapp-attachments").upload(path, file);
    if (upErr) { setUploading(false); return toast.error(upErr.message); }
    const { data, error } = await supabase.functions.invoke("whatsapp-send-attachment", {
      body: { conversation_id: activeConv.id, storage_path: path, filename: file.name, caption: reply || "" },
    });
    setUploading(false);
    if (e.target) e.target.value = "";
    if (error || data?.error) return toast.error(data?.error || error?.message || "فشل الإرسال");
    toast.success("تم إرسال المرفق ✅");
    setReply("");
    loadMessages(activeConv.id);
  };

  const counts = {
    all: conversations.length,
    unread: conversations.filter((c) => c.unread_count > 0).length,
    mine: conversations.filter((c) => c.assigned_to === currentUserId).length,
    ai: conversations.filter((c) => !c.human_takeover).length,
    starred: conversations.filter((c) => c.is_starred).length,
  };

  const filteredConvs = conversations.filter((c) => {
    if (convSearch && !c.phone.includes(convSearch) && !(c.customer_name || "").includes(convSearch)) return false;
    if (filter === "unread") return c.unread_count > 0;
    if (filter === "mine") return c.assigned_to === currentUserId;
    if (filter === "ai") return !c.human_takeover;
    if (filter === "starred") return c.is_starred;
    return true;
  });

  const FILTERS: { key: FilterKey; label: string; color: string }[] = [
    { key: "all", label: "الكل", color: "bg-slate-500" },
    { key: "unread", label: "غير مقروء", color: "bg-rose-500" },
    { key: "mine", label: "مُسندة لي", color: "bg-blue-500" },
    { key: "ai", label: "بوت AI", color: "bg-violet-500" },
    { key: "starred", label: "نجوم", color: "bg-amber-500" },
  ];

  return (
    <WhatsappLayout
      rightSlot={
        activeConv ? (
          <ScrollArea className="max-h-[calc(100vh-160px)]">
            <div className="p-3 border-b text-sm font-semibold">تفاصيل المحادثة</div>
            <ConversationDetailsPanel
              conversationId={activeConv.id}
              currentAssignee={activeConv.assigned_to}
              onAssigneeChanged={(id) => setActiveConv({ ...activeConv, assigned_to: id })}
            />
          </ScrollArea>
        ) : undefined
      }
    >
      <div className="grid lg:grid-cols-[320px_1fr] h-[calc(100vh-220px)] min-h-[560px]">
        {/* قائمة المحادثات */}
        <div className="border-l flex flex-col overflow-hidden">
          <div className="p-3 space-y-3 border-b">
            <div className="relative">
              <Search className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={convSearch}
                onChange={(e) => setConvSearch(e.target.value)}
                placeholder="بحث برقم أو اسم..."
                className="pr-8 h-9"
              />
            </div>
            {/* فلاتر شريحية */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border whitespace-nowrap transition-all",
                    filter === f.key
                      ? "bg-foreground text-background border-foreground shadow-sm"
                      : "bg-background hover:bg-muted border-border text-muted-foreground"
                  )}
                >
                  <span className={cn("w-1.5 h-1.5 rounded-full", f.color)} />
                  {f.label}
                  <span className="opacity-60">{counts[f.key]}</span>
                </button>
              ))}
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              <AnimatePresence mode="popLayout">
                {filteredConvs.length === 0 && (
                  <div className="text-center text-sm text-muted-foreground py-12">
                    <Filter className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    لا توجد محادثات
                  </div>
                )}
                {filteredConvs.map((c) => {
                  const active = activeConv?.id === c.id;
                  const isAi = !c.human_takeover;
                  return (
                    <motion.button
                      key={c.id}
                      layout
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setActiveConv(c)}
                      className={cn(
                        "w-full text-right p-2.5 rounded-xl transition-all flex items-start gap-2.5 border",
                        active
                          ? "bg-emerald-500/10 border-emerald-500/40 shadow-sm"
                          : "border-transparent hover:bg-muted/60 hover:border-border"
                      )}
                    >
                      {/* أفاتار */}
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0 shadow-sm",
                        isAi ? "bg-gradient-to-br from-violet-500 to-purple-600" : "bg-gradient-to-br from-emerald-500 to-teal-600"
                      )}>
                        {(c.customer_name || c.phone).slice(0, 1)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 mb-0.5">
                          {c.is_pinned && <Pin className="w-3 h-3 text-emerald-600" />}
                          {c.is_starred && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                          <span className="font-semibold text-sm truncate">{c.customer_name || c.phone}</span>
                          {c.last_message_at && (
                            <span className="text-[10px] text-muted-foreground mr-auto shrink-0">
                              {new Date(c.last_message_at).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate leading-snug">{c.last_message || "—"}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {isAi ? (
                            <Badge className="h-4 text-[9px] px-1.5 bg-violet-500/15 text-violet-600 border-violet-500/30 hover:bg-violet-500/15">
                              <Bot className="w-2.5 h-2.5 ml-0.5" /> بوت
                            </Badge>
                          ) : (
                            <Badge className="h-4 text-[9px] px-1.5 bg-emerald-500/15 text-emerald-700 border-emerald-500/30 hover:bg-emerald-500/15">
                              <User className="w-2.5 h-2.5 ml-0.5" /> أدمن
                            </Badge>
                          )}
                          {c.assigned_to === currentUserId && (
                            <Badge className="h-4 text-[9px] px-1.5 bg-blue-500/15 text-blue-600 border-blue-500/30 hover:bg-blue-500/15">
                              مُسندة لي
                            </Badge>
                          )}
                        </div>
                      </div>
                      {c.unread_count > 0 && (
                        <Badge className="bg-rose-500 hover:bg-rose-500 text-white h-5 min-w-5 px-1.5 text-[10px] shrink-0">
                          {c.unread_count}
                        </Badge>
                      )}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </div>

        {/* الشات */}
        <div className="flex flex-col overflow-hidden">
          {!activeConv ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                  <MessageSquare className="w-10 h-10 text-emerald-600/60" />
                </div>
                <p className="font-medium">اختر محادثة لعرضها</p>
                <p className="text-xs mt-1 opacity-70">الردود اللحظية تصل إليك تلقائياً</p>
              </div>
            </div>
          ) : (
            <>
              {/* رأس الشات */}
              <div className="p-3 border-b flex items-center justify-between bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow",
                    activeConv.human_takeover
                      ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                      : "bg-gradient-to-br from-violet-500 to-purple-600"
                  )}>
                    {(activeConv.customer_name || activeConv.phone).slice(0, 1)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{activeConv.customer_name || activeConv.phone}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <span dir="ltr">{activeConv.phone}</span>
                      <span className="w-1 h-1 rounded-full bg-emerald-500" />
                      <span>{activeConv.human_takeover ? "وضع الأدمن" : "بوت الذكاء"}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => togglePin(activeConv)}>
                    <Pin className={cn("w-4 h-4", activeConv.is_pinned && "fill-current text-emerald-600")} />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => toggleStar(activeConv)}>
                    <Star className={cn("w-4 h-4", activeConv.is_starred && "fill-amber-500 text-amber-500")} />
                  </Button>
                </div>
              </div>

              {/* الرسائل */}
              <ScrollArea className="flex-1 p-4 bg-[radial-gradient(circle_at_top_right,hsl(160_30%_94%),transparent_60%),radial-gradient(circle_at_bottom_left,hsl(210_30%_94%),transparent_60%)] dark:bg-none">
                <div className="space-y-2 max-w-3xl mx-auto">
                  <AnimatePresence initial={false}>
                    {messages.map((m) => (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={cn("flex", m.direction === "inbound" ? "justify-start" : "justify-end")}
                      >
                        <div className={cn(
                          "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm shadow-sm",
                          m.direction === "inbound" && "bg-card border rounded-tr-sm",
                          m.direction === "outbound" && m.sender_type === "bot" && "bg-violet-500/10 border border-violet-500/30 rounded-tl-sm",
                          m.direction === "outbound" && m.sender_type !== "bot" && "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-tl-sm"
                        )}>
                          {m.sender_type === "bot" && (
                            <div className="flex items-center gap-1 text-[10px] opacity-70 mb-1 text-violet-700">
                              <Bot className="w-3 h-3" /> المساعد الذكي
                            </div>
                          )}
                          {m.sender_type === "admin" && (
                            <div className="flex items-center gap-1 text-[10px] opacity-80 mb-1">
                              <User className="w-3 h-3" /> {m.sender_name}
                            </div>
                          )}
                          {m.message_type === "attachment" && m.media_url && (
                            <a href={m.media_url} target="_blank" rel="noreferrer"
                              className="flex items-center gap-2 mb-1 px-2 py-1.5 rounded bg-background/30 hover:bg-background/50 transition text-xs">
                              <Paperclip className="w-3.5 h-3.5" />
                              <span className="truncate underline">{m.media_filename || "مرفق"}</span>
                            </a>
                          )}
                          {m.body && <div className="whitespace-pre-wrap break-words">{m.body}</div>}
                          <div className="text-[10px] opacity-60 mt-1 flex items-center gap-1 justify-end">
                            <span>{new Date(m.created_at).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}</span>
                            {m.direction === "outbound" && (
                              m.delivery_status === "sent" ? <CheckCheck className="w-3 h-3" />
                              : m.delivery_status === "failed" ? <AlertCircle className="w-3 h-3" />
                              : <Clock className="w-3 h-3" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* صندوق الرد */}
              <div className="p-3 border-t space-y-2 bg-muted/10">
                <div className="flex gap-1.5 flex-wrap">
                  {quickReplies.slice(0, 5).map((q) => (
                    <Button key={q.id} size="sm" variant="outline" className="text-xs h-7" onClick={() => setReply(q.body)}>
                      {q.title}
                    </Button>
                  ))}
                  <Button size="sm" variant="secondary" className="text-xs h-7 bg-violet-500/15 text-violet-700 hover:bg-violet-500/25 border-none"
                    onClick={() => aiSuggest("professional")} disabled={aiLoading}>
                    {aiLoading ? <Loader2 className="w-3 h-3 ml-1 animate-spin" /> : <Sparkles className="w-3 h-3 ml-1" />}
                    اقتراح ذكي
                  </Button>
                </div>
                <div className="relative">
                  <Textarea value={reply} onChange={(e) => setReply(e.target.value)}
                    placeholder="اكتب ردك... (Cmd+Enter للإرسال)" rows={2}
                    onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) sendReply(); }} />
                  {showEmoji && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-full mb-2 right-0 bg-popover border rounded-lg p-2 shadow-lg grid grid-cols-8 gap-1 z-10">
                      {EMOJIS.map((e) => (
                        <button key={e} className="text-xl hover:bg-muted rounded p-1"
                          onClick={() => { setReply((r) => r + e); setShowEmoji(false); }}>{e}</button>
                      ))}
                    </motion.div>
                  )}
                </div>
                <div className="flex gap-2">
                  <input ref={fileInputRef} type="file" hidden onChange={handleFileUpload}
                    accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx" />
                  <Button size="icon" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading} title="إرفاق ملف">
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
                  </Button>
                  <Button size="icon" variant="outline" onClick={() => setShowEmoji(!showEmoji)}>
                    <Smile className="w-4 h-4" />
                  </Button>
                  <Button onClick={sendReply} disabled={sending || !reply.trim()}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700">
                    {sending ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <Send className="w-4 h-4 ml-2" />}
                    إرسال
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </WhatsappLayout>
  );
}
