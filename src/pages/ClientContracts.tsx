import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ClientSidebar } from "@/components/ClientSidebar";
import { FileText, Search, Eye, Calendar, DollarSign, ShieldCheck, Building2 } from "lucide-react";
import {
  listContracts, ContractRow, STATUS_LABELS, STATUS_COLORS,
} from "@/utils/supabaseContractService";
import { PARENT_COMPANY } from "@/utils/contractTemplates";

const ClientContracts = () => {
  const [contracts, setContracts] = useState<ContractRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) { setLoading(false); return; }
      try {
        const list = await listContracts({ userId: u.user.id });
        setContracts(list);
      } finally { setLoading(false); }
    })();
  }, []);

  const filtered = contracts.filter(c =>
    !search.trim() ||
    c.contract_number.toLowerCase().includes(search.toLowerCase()) ||
    (c.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.service_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const pendingCount = contracts.filter(c => c.status === "pending_signature").length;
  const signedCount = contracts.filter(c => ["signed","active","completed"].includes(c.status)).length;

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <SidebarProvider>
        <header className="h-16 flex items-center border-b bg-background/95 backdrop-blur sticky top-0 z-50">
          <div className="flex items-center gap-4 px-6">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">عقودي</h1>
            </div>
          </div>
        </header>

        <div className="flex min-h-screen w-full">
          <ClientSidebar />
          <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-1">عقودي</h2>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  جميع عقود خدماتك مع {PARENT_COMPANY.platformName}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">إجمالي العقود</p><p className="text-2xl font-bold">{contracts.length}</p></CardContent></Card>
                <Card className="border-amber-500/30 bg-amber-50/40 dark:bg-amber-950/20"><CardContent className="p-4"><p className="text-xs text-muted-foreground">بانتظار التوقيع</p><p className="text-2xl font-bold text-amber-600">{pendingCount}</p></CardContent></Card>
                <Card className="border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20"><CardContent className="p-4"><p className="text-xs text-muted-foreground">موقّعة</p><p className="text-2xl font-bold text-emerald-600">{signedCount}</p></CardContent></Card>
              </div>

              {/* Search */}
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="ابحث برقم العقد أو اسم الخدمة…" value={search} onChange={(e) => setSearch(e.target.value)} className="pr-10" />
                  </div>
                </CardContent>
              </Card>

              {loading ? (
                <Card><CardContent className="text-center py-12"><div className="animate-spin h-10 w-10 border-b-2 border-primary rounded-full mx-auto" /></CardContent></Card>
              ) : filtered.length === 0 ? (
                <Card><CardContent className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="font-semibold mb-1">لا توجد عقود</p>
                  <p className="text-sm text-muted-foreground">سيظهر العقد هنا تلقائياً عند قبولك لعرض السعر لأي خدمة</p>
                </CardContent></Card>
              ) : (
                <div className="space-y-3">
                  {filtered.map((c, i) => (
                    <motion.div key={c.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                      <Card className="hover:shadow-md transition group">
                        <CardContent className="p-5">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <Badge variant="outline" className="font-mono">{c.contract_number}</Badge>
                                <Badge className={STATUS_COLORS[c.status]}>{STATUS_LABELS[c.status]}</Badge>
                              </div>
                              <h3 className="font-bold mb-1 truncate">{c.title}</h3>
                              {c.service_name && <p className="text-sm text-muted-foreground mb-2">{c.service_name}</p>}
                              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(c.created_at).toLocaleDateString("ar-SA")}</span>
                                <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> {Number(c.total_amount || 0).toLocaleString("ar-SA")} {c.currency}</span>
                                {c.signed_at && <span className="flex items-center gap-1 text-emerald-600"><ShieldCheck className="h-3 w-3" /> وُقِّع في {new Date(c.signed_at).toLocaleDateString("ar-SA")}</span>}
                              </div>
                            </div>
                            <Button asChild size="sm" variant={c.status === "pending_signature" ? "default" : "outline"}>
                              <Link to={`/contracts/${c.id}`}>
                                {c.status === "pending_signature" ? <><ShieldCheck className="h-4 w-4 ml-2" /> راجع ووقّع</> : <><Eye className="h-4 w-4 ml-2" /> عرض</>}
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default ClientContracts;
