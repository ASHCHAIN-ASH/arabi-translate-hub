import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  FileText, Plus, Search, Send, ShieldCheck, Eye, Clock, Building2,
  CheckCircle2, AlertCircle, DollarSign, Users, Sparkles, MoreVertical,
  Bell, Copy, XCircle, Trash2, Download, FileDown,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  listContracts, ContractRow, STATUS_LABELS, STATUS_COLORS,
  sendContractToClient, createManualContract, ContractStatus,
  remindClientToSign, cancelContract, deleteContract,
} from "@/utils/supabaseContractService";
import { PARENT_COMPANY, SERVICE_TYPE_LABELS } from "@/utils/contractTemplates";

const ContractsSystem = () => {
  const [contracts, setContracts] = useState<ContractRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<ContractStatus | "all" | "expired">("all");
  const [openNew, setOpenNew] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "amount_desc" | "amount_asc">("newest");

  const [form, setForm] = useState({
    customer_id: "",
    service_name: "",
    service_type: "general",
    total_amount: 0,
    payment_terms: "دفعة واحدة عند بدء التنفيذ",
    delivery_date: "",
    work_duration: "",
    client_full_name: "",
    client_id_number: "",
    client_email: "",
    client_phone: "",
  });

  useEffect(() => { load(); loadCustomers(); }, []);

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

  const isExpired = (c: ContractRow) =>
    !!c.expires_at &&
    new Date(c.expires_at).getTime() < Date.now() &&
    !["signed", "active", "completed", "cancelled"].includes(c.status);

  const stats = useMemo(() => ({
    total: contracts.length,
    pending: contracts.filter(c => c.status === "pending_signature").length,
    signed: contracts.filter(c => ["signed","active","completed"].includes(c.status)).length,
    draft: contracts.filter(c => c.status === "draft").length,
    cancelled: contracts.filter(c => c.status === "cancelled").length,
    expired: contracts.filter(isExpired).length,
    revenue: contracts.filter(c => ["signed","active","completed"].includes(c.status))
      .reduce((s,c) => s + Number(c.total_amount || 0), 0),
  }), [contracts]);

  const filtered = useMemo(() => {
    let arr = contracts.filter(c => {
      const matchSearch = !search.trim() ||
        c.contract_number.toLowerCase().includes(search.toLowerCase()) ||
        (c.client_full_name || "").toLowerCase().includes(search.toLowerCase()) ||
        (c.client_email || "").toLowerCase().includes(search.toLowerCase()) ||
        (c.title || "").toLowerCase().includes(search.toLowerCase());
      const matchTab =
        tab === "all" ? true :
        tab === "expired" ? isExpired(c) :
        tab === "signed" ? ["signed","active","completed"].includes(c.status) :
        c.status === tab;
      const matchType = serviceTypeFilter === "all" || c.service_type === serviceTypeFilter;
      return matchSearch && matchTab && matchType;
    });
    arr = [...arr].sort((a, b) => {
      switch (sortBy) {
        case "oldest": return +new Date(a.created_at) - +new Date(b.created_at);
        case "amount_desc": return Number(b.total_amount || 0) - Number(a.total_amount || 0);
        case "amount_asc": return Number(a.total_amount || 0) - Number(b.total_amount || 0);
        default: return +new Date(b.created_at) - +new Date(a.created_at);
      }
    });
    return arr;
  }, [contracts, search, tab, serviceTypeFilter, sortBy]);

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
        work_duration: form.work_duration || undefined,
        client_full_name: form.client_full_name,
        client_id_number: form.client_id_number || undefined,
        client_email: form.client_email || undefined,
        client_phone: form.client_phone || undefined,
      });
      toast.success("تم إنشاء العقد بنجاح");
      setOpenNew(false);
      setForm({ customer_id:"", service_name:"", service_type:"general", total_amount:0, payment_terms:"دفعة واحدة عند بدء التنفيذ", delivery_date:"", work_duration:"", client_full_name:"", client_id_number:"", client_email:"", client_phone:"" });
      await load();
    } catch (e: any) { toast.error(e.message || "تعذّر إنشاء العقد"); }
  }

  async function handleSend(id: string) {
    try { await sendContractToClient(id); toast.success("تم إرسال العقد للعميل"); load(); }
    catch (e: any) { toast.error(e.message || "تعذّر الإرسال"); }
  }

  async function handleRemind(id: string) {
    try { await remindClientToSign(id); toast.success("تم إرسال تذكير للعميل"); load(); }
    catch (e: any) { toast.error(e.message || "تعذّر الإرسال"); }
  }

  async function handleCancel(id: string) {
    try { await cancelContract(id, "ألغى المسؤول العقد"); toast.success("تم إلغاء العقد"); load(); }
    catch (e: any) { toast.error(e.message || "تعذّر الإلغاء"); }
  }

  async function handleDelete(id: string) {
    try { await deleteContract(id); toast.success("تم حذف العقد"); load(); }
    catch (e: any) { toast.error(e.message || "تعذّر الحذف"); }
  }

  function copyClientLink(id: string) {
    const url = `${window.location.origin}/client/contracts/${id}`;
    navigator.clipboard.writeText(url);
    toast.success("تم نسخ رابط العميل");
  }

  function exportCSV() {
    const headers = ["رقم العقد","العنوان","العميل","البريد","القيمة","العملة","الحالة","تاريخ الإنشاء","تاريخ التوقيع"];
    const rows = filtered.map(c => [
      c.contract_number, c.title, c.client_full_name || "", c.client_email || "",
      c.total_amount || 0, c.currency || "SAR", STATUS_LABELS[c.status],
      new Date(c.created_at).toLocaleDateString("ar-SA"),
      c.signed_at ? new Date(c.signed_at).toLocaleDateString("ar-SA") : "—",
    ]);
    const csv = "\uFEFF" + [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `contracts-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    toast.success("تم تنزيل التقرير");
  }

  function pickCustomer(id: string) {
    const c = customers.find(x => x.id === id);
    setForm(p => ({
      ...p, customer_id: id,
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
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={exportCSV}><FileDown className="h-4 w-4 ml-2" /> تصدير CSV</Button>
            <Dialog open={openNew} onOpenChange={setOpenNew}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 ml-2" /> عقد جديد</Button>
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
                  <div><Label>مدة تنفيذ العمل</Label><Input value={form.work_duration} onChange={e => setForm(p => ({...p, work_duration: e.target.value}))} placeholder="مثال: 14 يوم عمل" /></div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenNew(false)}>إلغاء</Button>
                  <Button onClick={handleCreate}><Sparkles className="h-4 w-4 ml-2" /> إنشاء وتوليد المحتوى</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { label: "إجمالي العقود", value: stats.total, icon: FileText, color: "text-primary", bg: "bg-primary/10" },
            { label: "مسودات", value: stats.draft, icon: AlertCircle, color: "text-muted-foreground", bg: "bg-muted" },
            { label: "بانتظار التوقيع", value: stats.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/20" },
            { label: "موقّعة", value: stats.signed, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/20" },
            { label: "إيرادات موقّعة", value: `${stats.revenue.toLocaleString("ar-SA")} ر.س`, icon: DollarSign, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/20" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="hover:shadow-md transition">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                      <p className="text-xl font-bold mt-1">{s.value}</p>
                    </div>
                    <div className={`p-2 rounded-lg ${s.bg}`}>
                      <s.icon className={`h-5 w-5 ${s.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="ابحث برقم العقد، اسم العميل، بريد، أو عنوان…" value={search} onChange={(e) => setSearch(e.target.value)} className="pr-10" />
            </div>
            <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
              <SelectTrigger className="md:w-52"><SelectValue placeholder="نوع الخدمة" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                {Object.entries(SERVICE_TYPE_LABELS).map(([k,v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
              <SelectTrigger className="md:w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">الأحدث أولاً</SelectItem>
                <SelectItem value="oldest">الأقدم أولاً</SelectItem>
                <SelectItem value="amount_desc">الأعلى قيمة</SelectItem>
                <SelectItem value="amount_asc">الأقل قيمة</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)} dir="rtl">
          <TabsList className="bg-muted w-full sm:w-auto overflow-x-auto flex-row-reverse">
            <TabsTrigger value="all">الكل ({contracts.length})</TabsTrigger>
            <TabsTrigger value="draft">مسودة ({stats.draft})</TabsTrigger>
            <TabsTrigger value="pending_signature">بانتظار التوقيع ({stats.pending})</TabsTrigger>
            <TabsTrigger value="signed">موقّعة ({stats.signed})</TabsTrigger>
            <TabsTrigger value="cancelled">ملغاة ({stats.cancelled})</TabsTrigger>
            <TabsTrigger value="expired" className="data-[state=active]:text-destructive">منتهية الصلاحية ({stats.expired})</TabsTrigger>
          </TabsList>

          <TabsContent value={tab} className="mt-4">
            <Card>
              <CardContent className="p-0">
                {loading ? (
                  <div className="text-center py-12"><div className="animate-spin h-10 w-10 border-b-2 border-primary rounded-full mx-auto" /></div>
                ) : filtered.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="font-semibold mb-1">لا توجد عقود</p>
                    <p className="text-sm text-muted-foreground">العقود تُنشأ تلقائياً عند قبول العميل لعروض الأسعار</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40">
                          <TableHead className="text-right">رقم العقد</TableHead>
                          <TableHead className="text-right">العنوان</TableHead>
                          <TableHead className="text-right">العميل</TableHead>
                          <TableHead className="text-right">القيمة</TableHead>
                          <TableHead className="text-right">الحالة</TableHead>
                          <TableHead className="text-right">التاريخ</TableHead>
                          <TableHead className="text-right">إجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filtered.map((c, i) => (
                          <TableRow key={c.id} className="hover:bg-muted/30 transition group">
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <span className="font-mono text-xs font-bold text-primary">{c.contract_number}</span>
                                {c.service_order_id && (
                                  <Badge variant="secondary" className="text-[10px] w-fit"><Sparkles className="h-2.5 w-2.5 ml-1" />تلقائي</Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[260px]">
                              <p className="font-semibold truncate">{c.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{c.service_name}</p>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                                  {(c.client_full_name || "؟").charAt(0)}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium truncate">{c.client_full_name || "—"}</p>
                                  <p className="text-xs text-muted-foreground truncate">{c.client_email || "—"}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-bold text-sm">{Number(c.total_amount || 0).toLocaleString("ar-SA")}</span>
                              <span className="text-xs text-muted-foreground"> {c.currency}</span>
                            </TableCell>
                            <TableCell>
                              <Badge className={STATUS_COLORS[c.status]}>{STATUS_LABELS[c.status]}</Badge>
                              {c.signed_at && <ShieldCheck className="inline h-3.5 w-3.5 mr-1 text-emerald-600" />}
                            </TableCell>
                            <TableCell>
                              <p className="text-xs">{new Date(c.created_at).toLocaleDateString("ar-SA")}</p>
                              {c.signed_at && <p className="text-[10px] text-emerald-600">وُقّع: {new Date(c.signed_at).toLocaleDateString("ar-SA")}</p>}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button asChild size="sm" variant="outline" className="h-8">
                                  <Link to={`/adminmaster/contracts/${c.id}`}><Eye className="h-3.5 w-3.5 ml-1" /> فتح</Link>
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0"><MoreVertical className="h-4 w-4" /></Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-52">
                                    {c.status === "draft" && (
                                      <DropdownMenuItem onClick={() => handleSend(c.id)}>
                                        <Send className="h-4 w-4 ml-2" /> إرسال للعميل
                                      </DropdownMenuItem>
                                    )}
                                    {c.status === "pending_signature" && (
                                      <DropdownMenuItem onClick={() => handleRemind(c.id)}>
                                        <Bell className="h-4 w-4 ml-2" /> تذكير العميل
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={() => copyClientLink(c.id)}>
                                      <Copy className="h-4 w-4 ml-2" /> نسخ رابط العميل
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                      <Link to={`/adminmaster/contracts/${c.id}`}>
                                        <Download className="h-4 w-4 ml-2" /> تحميل/طباعة PDF
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {c.status !== "cancelled" && c.status !== "signed" && (
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-amber-600">
                                            <XCircle className="h-4 w-4 ml-2" /> إلغاء العقد
                                          </DropdownMenuItem>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent dir="rtl">
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>إلغاء العقد؟</AlertDialogTitle>
                                            <AlertDialogDescription>سيتم تغيير حالة العقد إلى "ملغى" ويُسجَّل في سجل النشاط.</AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>تراجع</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleCancel(c.id)}>تأكيد الإلغاء</AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    )}
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                          <Trash2 className="h-4 w-4 ml-2" /> حذف نهائي
                                        </DropdownMenuItem>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent dir="rtl">
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>حذف العقد نهائياً؟</AlertDialogTitle>
                                          <AlertDialogDescription>هذا الإجراء لا يمكن التراجع عنه. سيتم حذف العقد وكل بياناته المرتبطة.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>تراجع</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => handleDelete(c.id)} className="bg-destructive hover:bg-destructive/90">حذف</AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ContractsSystem;
