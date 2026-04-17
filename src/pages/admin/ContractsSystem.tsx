import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  FileText, Plus, Search, Send, ShieldCheck, Eye, Clock, Building2,
  CheckCircle2, AlertCircle, DollarSign, Users, Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  listContracts, ContractRow, STATUS_LABELS, STATUS_COLORS,
  sendContractToClient, createManualContract, ContractStatus,
} from "@/utils/supabaseContractService";
import { PARENT_COMPANY, SERVICE_TYPE_LABELS } from "@/utils/contractTemplates";

const ContractsSystem = () => {
  const [contracts, setContracts] = useState<ContractRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<ContractStatus | "all">("all");
  const [openNew, setOpenNew] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);

  const [form, setForm] = useState({
    customer_id: "",
    service_name: "",
    service_type: "general",
    total_amount: 0,
    payment_terms: "دفعة واحدة عند بدء التنفيذ",
    delivery_date: "",
    client_full_name: "",
    client_id_number: "",
    client_email: "",
    client_phone: "",
  });

  useEffect(() => { load(); loadCustomers(); }, []);

  // realtime
  useEffect(() => {
    const ch = supabase.channel("contracts-admin")
      .on("postgres_changes", { event: "*", schema: "public", table: "contracts" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  async function load() {
    setLoading(true);
    try {
      const list = await listContracts();
      setContracts(list);
    } catch (e: any) { toast.error("تعذّر تحميل العقود"); }
    finally { setLoading(false); }
  }

  async function loadCustomers() {
    const { data } = await supabase.from("customers").select("id,name,email,phone,user_id").order("created_at", { ascending: false }).limit(500);
    setCustomers(data || []);
  }

  const stats = useMemo(() => ({
    total: contracts.length,
    pending: contracts.filter(c => c.status === "pending_signature").length,
    signed: contracts.filter(c => ["signed","active","completed"].includes(c.status)).length,
    draft: contracts.filter(c => c.status === "draft").length,
    revenue: contracts.filter(c => ["signed","active","completed"].includes(c.status))
      .reduce((s,c) => s + Number(c.total_amount || 0), 0),
  }), [contracts]);

  const filtered = useMemo(() => contracts.filter(c => {
    const matchSearch = !search.trim() ||
      c.contract_number.toLowerCase().includes(search.toLowerCase()) ||
      (c.client_full_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.title || "").toLowerCase().includes(search.toLowerCase());
    const matchTab = tab === "all" || c.status === tab;
    return matchSearch && matchTab;
  }), [contracts, search, tab]);

  async function handleCreate() {
    if (!form.service_name || !form.client_full_name || !form.total_amount) {
      toast.error("اسم الخدمة، اسم العميل، والقيمة مطلوبة"); return;
    }
    try {
      const cust = customers.find(c => c.id === form.customer_id);
      await createManualContract({
        customer_id: form.customer_id || null,
        user_id: cust?.user_id || null,
        service_name: form.service_name,
        service_type: form.service_type,
        total_amount: Number(form.total_amount),
        payment_terms: form.payment_terms,
        delivery_date: form.delivery_date || undefined,
        client_full_name: form.client_full_name,
        client_id_number: form.client_id_number || undefined,
        client_email: form.client_email || undefined,
        client_phone: form.client_phone || undefined,
      });
      toast.success("تم إنشاء العقد بنجاح");
      setOpenNew(false);
      setForm({ customer_id:"", service_name:"", service_type:"general", total_amount:0, payment_terms:"دفعة واحدة عند بدء التنفيذ", delivery_date:"", client_full_name:"", client_id_number:"", client_email:"", client_phone:"" });
      await load();
    } catch (e: any) { toast.error(e.message || "تعذّر إنشاء العقد"); }
  }

  async function handleSend(id: string) {
    try {
      await sendContractToClient(id);
      toast.success("تم إرسال العقد للعميل وأصبح بانتظار التوقيع");
      load();
    } catch (e: any) { toast.error(e.message || "تعذّر الإرسال"); }
  }

  function pickCustomer(id: string) {
    const c = customers.find(x => x.id === id);
    setForm(p => ({
      ...p,
      customer_id: id,
      client_full_name: c?.name || p.client_full_name,
      client_email: c?.email || p.client_email,
      client_phone: c?.phone || p.client_phone,
    }));
  }

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-l from-primary to-primary/60 bg-clip-text text-transparent">
              نظام إدارة العقود
            </h1>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              {PARENT_COMPANY.platformName} — تابعة لـ {PARENT_COMPANY.legalEntity}
            </p>
          </div>
          <Dialog open={openNew} onOpenChange={setOpenNew}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 ml-2" /> إنشاء عقد يدوي</Button>
            </DialogTrigger>
            <DialogContent dir="rtl" className="max-w-2xl max-h-[85vh] overflow-y-auto">
              <DialogHeader><DialogTitle>إنشاء عقد قانوني/أكاديمي</DialogTitle></DialogHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label>اختر عميلاً مسجّلاً (اختياري)</Label>
                  <Select value={form.customer_id} onValueChange={pickCustomer}>
                    <SelectTrigger><SelectValue placeholder="اختر عميلاً..." /></SelectTrigger>
                    <SelectContent className="max-h-72">
                      {customers.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name} {c.email ? `— ${c.email}` : ""}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>اسم العميل الكامل *</Label><Input value={form.client_full_name} onChange={e => setForm(p => ({...p, client_full_name: e.target.value}))} /></div>
                <div><Label>رقم الهوية</Label><Input value={form.client_id_number} onChange={e => setForm(p => ({...p, client_id_number: e.target.value}))} /></div>
                <div><Label>البريد الإلكتروني</Label><Input type="email" value={form.client_email} onChange={e => setForm(p => ({...p, client_email: e.target.value}))} /></div>
                <div><Label>رقم الجوال</Label><Input value={form.client_phone} onChange={e => setForm(p => ({...p, client_phone: e.target.value}))} /></div>
                <div className="sm:col-span-2"><Label>اسم الخدمة *</Label><Input value={form.service_name} onChange={e => setForm(p => ({...p, service_name: e.target.value}))} placeholder="مثال: ترجمة قانونية لعقد توريد" /></div>
                <div>
                  <Label>نوع الخدمة</Label>
                  <Select value={form.service_type} onValueChange={(v) => setForm(p => ({...p, service_type: v}))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(SERVICE_TYPE_LABELS).map(([k,v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>القيمة الإجمالية (SAR) *</Label><Input type="number" value={form.total_amount} onChange={e => setForm(p => ({...p, total_amount: Number(e.target.value)}))} /></div>
                <div className="sm:col-span-2"><Label>شروط الدفع</Label><Input value={form.payment_terms} onChange={e => setForm(p => ({...p, payment_terms: e.target.value}))} /></div>
                <div><Label>تاريخ التسليم المتوقع</Label><Input type="date" value={form.delivery_date} onChange={e => setForm(p => ({...p, delivery_date: e.target.value}))} /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenNew(false)}>إلغاء</Button>
                <Button onClick={handleCreate}><Sparkles className="h-4 w-4 ml-2" /> إنشاء وتوليد المحتوى تلقائياً</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { label: "إجمالي العقود", value: stats.total, icon: FileText, color: "text-primary" },
            { label: "مسودات", value: stats.draft, icon: AlertCircle, color: "text-muted-foreground" },
            { label: "بانتظار التوقيع", value: stats.pending, icon: Clock, color: "text-amber-600" },
            { label: "موقّعة", value: stats.signed, icon: CheckCircle2, color: "text-emerald-600" },
            { label: "إيرادات موقّعة", value: `${stats.revenue.toLocaleString("ar-SA")} ر.س`, icon: DollarSign, color: "text-blue-600" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card><CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div><p className="text-xs text-muted-foreground">{s.label}</p><p className="text-xl font-bold mt-1">{s.value}</p></div>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
              </CardContent></Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="ابحث برقم العقد أو اسم العميل أو عنوان…" value={search} onChange={(e) => setSearch(e.target.value)} className="pr-10" />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList className="bg-muted w-full sm:w-auto overflow-x-auto">
            <TabsTrigger value="all">الكل ({contracts.length})</TabsTrigger>
            <TabsTrigger value="draft">مسودة ({stats.draft})</TabsTrigger>
            <TabsTrigger value="pending_signature">بانتظار التوقيع ({stats.pending})</TabsTrigger>
            <TabsTrigger value="signed">موقّعة</TabsTrigger>
            <TabsTrigger value="cancelled">ملغاة</TabsTrigger>
          </TabsList>

          <TabsContent value={tab} className="space-y-3 mt-4">
            {loading ? (
              <Card><CardContent className="text-center py-12"><div className="animate-spin h-10 w-10 border-b-2 border-primary rounded-full mx-auto" /></CardContent></Card>
            ) : filtered.length === 0 ? (
              <Card><CardContent className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="font-semibold mb-1">لا توجد عقود</p>
                <p className="text-sm text-muted-foreground">العقود تُنشأ تلقائياً عند قبول العميل لعروض الأسعار</p>
              </CardContent></Card>
            ) : filtered.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                <Card className="hover:shadow-md transition group">
                  <CardContent className="p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <Badge variant="outline" className="font-mono">{c.contract_number}</Badge>
                          <Badge className={STATUS_COLORS[c.status]}>{STATUS_LABELS[c.status]}</Badge>
                          {c.service_order_id && <Badge variant="secondary"><Sparkles className="h-3 w-3 ml-1" />تلقائي من طلب</Badge>}
                        </div>
                        <h3 className="font-bold truncate">{c.title}</h3>
                        <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                          <span><Users className="inline h-3 w-3 ml-1" />{c.client_full_name || "—"}</span>
                          <span><DollarSign className="inline h-3 w-3 ml-1" />{Number(c.total_amount || 0).toLocaleString("ar-SA")} {c.currency}</span>
                          <span><Clock className="inline h-3 w-3 ml-1" />{new Date(c.created_at).toLocaleDateString("ar-SA")}</span>
                          {c.signed_at && <span className="text-emerald-600"><ShieldCheck className="inline h-3 w-3 ml-1" />موقّع</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {c.status === "draft" && (
                          <Button size="sm" onClick={() => handleSend(c.id)}><Send className="h-4 w-4 ml-1" /> إرسال للعميل</Button>
                        )}
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/adminmaster/contracts/${c.id}`}><Eye className="h-4 w-4 ml-1" /> فتح</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ContractsSystem;
