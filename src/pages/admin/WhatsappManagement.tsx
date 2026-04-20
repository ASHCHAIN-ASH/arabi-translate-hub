import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Send, Sparkles, Megaphone, MessageSquare, Loader2, Plus, Smile, Pin, Star, Volume2, VolumeX, Bot, User, Search, Paperclip, BarChart3, PanelRightOpen, PanelRightClose } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "@/components/admin/AdminLayout";
import { ConversationDetailsPanel } from "@/components/admin/whatsapp/ConversationDetailsPanel";
import { CampaignAnalytics } from "@/components/admin/whatsapp/CampaignAnalytics";

const EMOJIS = ["😀","😊","🙏","👍","✅","🎉","🌹","💼","📋","🧾","📜","💳","⏳","🔔","📞","🎓","📚","✨","🔥","💡","⭐","❤️","🤝","📩","📎","🚀"];

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
}
interface Campaign {
  id: string; name: string; status: string; total_recipients: number;
  sent_count: number; failed_count: number; scheduled_at: string | null;
  created_at: string; message_body: string;
}
interface QuickReply { id: string; shortcut: string | null; title: string; body: string; }

export default function WhatsappManagement() {
  const [tab, setTab] = useState("conversations");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [convSearch, setConvSearch] = useState("");
  const [soundOn, setSoundOn] = useState(true);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignDialog, setCampaignDialog] = useState(false);
  const [newCampaign, setNewCampaign] = useState({ name: "", message_body: "", audience_type: "all", scheduled_at: "" });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // تحميل البيانات
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
  const loadCampaigns = async () => {
    const { data } = await supabase.from("whatsapp_campaigns").select("*")
      .order("created_at", { ascending: false }).limit(50);
    setCampaigns((data as Campaign[]) || []);
  };
  const loadQuickReplies = async () => {
    const { data } = await supabase.from("whatsapp_quick_replies").select("*").eq("is_active", true);
    setQuickReplies((data as QuickReply[]) || []);
  };

  useEffect(() => {
    loadConversations(); loadCampaigns(); loadQuickReplies();
    audioRef.current = new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=");

    const ch = supabase.channel("wa-admin")
      .on("postgres_changes", { event: "*", schema: "public", table: "whatsapp_conversations" }, () => loadConversations())
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "whatsapp_messages" }, (p: any) => {
        if (activeConv && p.new.conversation_id === activeConv.id) loadMessages(activeConv.id);
        if (p.new.direction === "inbound" && soundOn) audioRef.current?.play().catch(() => {});
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "whatsapp_campaigns" }, () => loadCampaigns())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [activeConv?.id, soundOn]);

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

  const togglePin = async (conv: Conversation) => {
    await supabase.from("whatsapp_conversations").update({ is_pinned: !conv.is_pinned }).eq("id", conv.id);
  };
  const toggleStar = async (conv: Conversation) => {
    await supabase.from("whatsapp_conversations").update({ is_starred: !conv.is_starred }).eq("id", conv.id);
  };

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


  const createCampaign = async () => {
    if (!newCampaign.name || !newCampaign.message_body) return toast.error("الاسم والنص مطلوبان");
    const status = newCampaign.scheduled_at ? "scheduled" : "draft";
    const { data, error } = await supabase.from("whatsapp_campaigns").insert({
      name: newCampaign.name,
      message_body: newCampaign.message_body,
      audience_filter: { type: newCampaign.audience_type },
      status,
      scheduled_at: newCampaign.scheduled_at || null,
    }).select("id").single();
    if (error) return toast.error(error.message);
    toast.success("تم إنشاء الحملة");
    setCampaignDialog(false);
    setNewCampaign({ name: "", message_body: "", audience_type: "all", scheduled_at: "" });
    if (data?.id) {
      await supabase.functions.invoke("whatsapp-campaign-send", {
        body: { campaign_id: data.id, action: "build_recipients" },
      });
    }
    loadCampaigns();
  };

  const runCampaignNow = async (id: string) => {
    toast.info("بدأ التنفيذ...");
    const { data, error } = await supabase.functions.invoke("whatsapp-campaign-send", { body: { campaign_id: id } });
    if (error || data?.error) return toast.error(data?.error || error?.message || "فشل");
    toast.success("تم التنفيذ");
    loadCampaigns();
  };

  const filteredConvs = conversations.filter((c) =>
    !convSearch || c.phone.includes(convSearch) || (c.customer_name || "").includes(convSearch)
  );

  return (
    <AdminLayout>
      <div className="container mx-auto p-4 lg:p-6 space-y-4 max-w-[1400px]" dir="rtl">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">إدارة واتساب الذكية</h1>
              <p className="text-sm text-muted-foreground">محادثات مباشرة + حملات إعلانية + قوالب وردود ذكية</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setSoundOn(!soundOn)}>
            {soundOn ? <Volume2 className="w-4 h-4 ml-1" /> : <VolumeX className="w-4 h-4 ml-1" />}
            {soundOn ? "الصوت مفعّل" : "الصوت متوقف"}
          </Button>
        </motion.div>

        <Tabs value={tab} onValueChange={setTab} dir="rtl" className="space-y-4">
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="conversations"><MessageSquare className="w-4 h-4 ml-1" /> المحادثات</TabsTrigger>
            <TabsTrigger value="campaigns"><Megaphone className="w-4 h-4 ml-1" /> الحملات</TabsTrigger>
          </TabsList>

          {/* المحادثات */}
          <TabsContent value="conversations">
            <div className="grid lg:grid-cols-[340px,1fr] gap-4 h-[calc(100vh-220px)]">
              {/* قائمة المحادثات */}
              <Card className="overflow-hidden flex flex-col">
                <div className="p-3 border-b">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input value={convSearch} onChange={(e) => setConvSearch(e.target.value)} placeholder="بحث برقم أو اسم..." className="pr-8" />
                  </div>
                </div>
                <ScrollArea className="flex-1">
                  <div className="p-2 space-y-1">
                    <AnimatePresence>
                      {filteredConvs.length === 0 && (
                        <p className="text-center text-sm text-muted-foreground py-8">لا توجد محادثات بعد</p>
                      )}
                      {filteredConvs.map((c) => (
                        <motion.button
                          key={c.id}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setActiveConv(c)}
                          className={`w-full text-right p-3 rounded-lg transition-all ${
                            activeConv?.id === c.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                {c.is_pinned && <Pin className="w-3 h-3" />}
                                {c.is_starred && <Star className="w-3 h-3 fill-current" />}
                                <span className="font-semibold text-sm truncate">{c.customer_name || c.phone}</span>
                              </div>
                              <p className="text-xs opacity-70 mt-0.5 truncate">{c.last_message || "—"}</p>
                            </div>
                            {c.unread_count > 0 && (
                              <Badge variant="destructive" className="text-[10px] h-5 min-w-5 px-1.5">{c.unread_count}</Badge>
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </AnimatePresence>
                  </div>
                </ScrollArea>
              </Card>

              {/* الشات */}
              <Card className="flex flex-col overflow-hidden">
                {!activeConv ? (
                  <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <MessageSquare className="w-16 h-16 mx-auto mb-3 opacity-20" />
                      <p>اختر محادثة لعرضها</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-3 border-b flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{activeConv.customer_name || activeConv.phone}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <span dir="ltr">{activeConv.phone}</span>
                          {activeConv.human_takeover && <Badge variant="outline" className="text-[10px] py-0">أدمن</Badge>}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => togglePin(activeConv)}>
                          <Pin className={`w-4 h-4 ${activeConv.is_pinned ? "fill-current text-primary" : ""}`} />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => toggleStar(activeConv)}>
                          <Star className={`w-4 h-4 ${activeConv.is_starred ? "fill-current text-yellow-500" : ""}`} />
                        </Button>
                      </div>
                    </div>

                    <ScrollArea className="flex-1 p-4 bg-muted/20">
                      <div className="space-y-2">
                        <AnimatePresence initial={false}>
                          {messages.map((m) => (
                            <motion.div
                              key={m.id}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`flex ${m.direction === "inbound" ? "justify-start" : "justify-end"}`}
                            >
                              <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                                m.direction === "inbound"
                                  ? "bg-card border"
                                  : m.sender_type === "bot"
                                  ? "bg-purple-500/10 border border-purple-500/30"
                                  : "bg-emerald-500 text-white"
                              }`}>
                                {m.sender_type === "bot" && (
                                  <div className="flex items-center gap-1 text-[10px] opacity-70 mb-1">
                                    <Bot className="w-3 h-3" /> المساعد الذكي
                                  </div>
                                )}
                                {m.sender_type === "admin" && (
                                  <div className="flex items-center gap-1 text-[10px] opacity-70 mb-1">
                                    <User className="w-3 h-3" /> {m.sender_name}
                                  </div>
                                )}
                                <div className="whitespace-pre-wrap break-words">{m.body}</div>
                                <div className="text-[10px] opacity-60 mt-1 text-end">
                                  {new Date(m.created_at).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
                                  {m.direction === "outbound" && ` · ${m.delivery_status === "sent" ? "✓" : m.delivery_status === "failed" ? "✕" : "⏳"}`}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>

                    {/* صندوق الرد */}
                    <div className="p-3 border-t space-y-2">
                      {/* القوالب السريعة */}
                      <div className="flex gap-1.5 flex-wrap">
                        {quickReplies.slice(0, 5).map((q) => (
                          <Button key={q.id} size="sm" variant="outline" className="text-xs h-7"
                            onClick={() => setReply(q.body)}>
                            {q.title}
                          </Button>
                        ))}
                        <Button size="sm" variant="secondary" className="text-xs h-7" onClick={() => aiSuggest("professional")} disabled={aiLoading}>
                          {aiLoading ? <Loader2 className="w-3 h-3 ml-1 animate-spin" /> : <Sparkles className="w-3 h-3 ml-1" />}
                          اقتراح ذكي
                        </Button>
                      </div>
                      <div className="relative">
                        <Textarea value={reply} onChange={(e) => setReply(e.target.value)}
                          placeholder="اكتب ردك..." rows={2}
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
                        <Button size="icon" variant="outline" onClick={() => setShowEmoji(!showEmoji)}>
                          <Smile className="w-4 h-4" />
                        </Button>
                        <Button onClick={sendReply} disabled={sending || !reply.trim()} className="flex-1">
                          {sending ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <Send className="w-4 h-4 ml-2" />}
                          إرسال (Cmd+Enter)
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </Card>
            </div>
          </TabsContent>

          {/* الحملات */}
          <TabsContent value="campaigns">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>الحملات الإعلانية</CardTitle>
                <Dialog open={campaignDialog} onOpenChange={setCampaignDialog}>
                  <DialogTrigger asChild>
                    <Button><Plus className="w-4 h-4 ml-1" /> حملة جديدة</Button>
                  </DialogTrigger>
                  <DialogContent dir="rtl" className="max-w-2xl">
                    <DialogHeader><DialogTitle>إنشاء حملة جديدة</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>اسم الحملة</Label>
                        <Input value={newCampaign.name} onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })} placeholder="حملة عيد الفطر 2025" />
                      </div>
                      <div>
                        <Label>نص الرسالة (يدعم {`{{name}}`} و {`{{phone}}`})</Label>
                        <Textarea rows={6} value={newCampaign.message_body} onChange={(e) => setNewCampaign({ ...newCampaign, message_body: e.target.value })}
                          placeholder="مرحباً {{name}} 👋&#10;عرض حصري لك..." />
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {EMOJIS.slice(0, 16).map((e) => (
                            <button key={e} className="text-lg hover:scale-125 transition" onClick={() => setNewCampaign({ ...newCampaign, message_body: newCampaign.message_body + e })}>{e}</button>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>الجمهور المستهدف</Label>
                          <Select value={newCampaign.audience_type} onValueChange={(v) => setNewCampaign({ ...newCampaign, audience_type: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">كل العملاء</SelectItem>
                              <SelectItem value="customers">العملاء النشطين</SelectItem>
                              <SelectItem value="membership">أصحاب العضويات</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>جدولة (اختياري)</Label>
                          <Input type="datetime-local" value={newCampaign.scheduled_at} onChange={(e) => setNewCampaign({ ...newCampaign, scheduled_at: e.target.value })} />
                        </div>
                      </div>
                      <Button onClick={createCampaign} className="w-full">
                        {newCampaign.scheduled_at ? "جدولة الحملة" : "حفظ كمسودة"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {campaigns.length === 0 && <p className="text-center text-muted-foreground py-8">لا توجد حملات</p>}
                  <AnimatePresence>
                    {campaigns.map((c) => {
                      const successRate = c.total_recipients > 0 ? Math.round((c.sent_count / c.total_recipients) * 100) : 0;
                      return (
                        <motion.div key={c.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          className="border rounded-lg p-4 hover:bg-muted/50 transition">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">{c.name}</h3>
                                <Badge variant={c.status === "completed" ? "default" : c.status === "running" ? "secondary" : c.status === "failed" ? "destructive" : "outline"}>
                                  {c.status === "draft" ? "مسودة" : c.status === "scheduled" ? "مجدولة" : c.status === "running" ? "قيد التنفيذ" : c.status === "completed" ? "مكتملة" : c.status}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">{c.message_body}</p>
                            </div>
                            {(c.status === "draft" || c.status === "scheduled") && (
                              <Button size="sm" onClick={() => runCampaignNow(c.id)}>
                                <Send className="w-3.5 h-3.5 ml-1" /> أرسل الآن
                              </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-4 gap-2 text-center text-xs">
                            <div className="bg-muted rounded p-2"><div className="font-bold text-lg">{c.total_recipients}</div><div className="text-muted-foreground">إجمالي</div></div>
                            <div className="bg-emerald-500/10 rounded p-2"><div className="font-bold text-lg text-emerald-600">{c.sent_count}</div><div className="text-muted-foreground">تم</div></div>
                            <div className="bg-destructive/10 rounded p-2"><div className="font-bold text-lg text-destructive">{c.failed_count}</div><div className="text-muted-foreground">فشل</div></div>
                            <div className="bg-primary/10 rounded p-2"><div className="font-bold text-lg text-primary">{successRate}%</div><div className="text-muted-foreground">نجاح</div></div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
