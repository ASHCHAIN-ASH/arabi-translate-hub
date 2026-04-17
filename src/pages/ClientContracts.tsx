import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ClientLayout from "@/components/client/ClientLayout";
import { useAuth } from "@/components/SimpleAuthProvider";
import { FileText, Search, Eye, Calendar, DollarSign, ShieldCheck, Building2 } from "lucide-react";
import {
  listContracts, ContractRow, STATUS_LABELS, STATUS_COLORS,
} from "@/utils/supabaseContractService";
import { PARENT_COMPANY } from "@/utils/contractTemplates";

const ClientContracts = () => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<ContractRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadContracts = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const list = await listContracts();
        if (mounted) {
          setContracts(list);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadContracts();

    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const filtered = useMemo(() => contracts.filter(c =>
    !search.trim() ||
    c.contract_number.toLowerCase().includes(search.toLowerCase()) ||
    (c.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.service_name || "").toLowerCase().includes(search.toLowerCase())
  ), [contracts, search]);

  const pendingCount = contracts.filter(c => c.status === "pending_signature").length;
  const signedCount = contracts.filter(c => ["signed","active","completed"].includes(c.status)).length;

  return (
    <ClientLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-6" dir="rtl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold">عقودي</h1>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5" />
                        جميع عقود خدماتك مع {PARENT_COMPANY.platformName}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full xl:w-auto xl:min-w-[540px]">
                  <Card className="shadow-none">
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground mb-1">إجمالي العقود</p>
                      <p className="text-2xl font-bold">{contracts.length}</p>
                    </CardContent>
                  </Card>
                  <Card className="shadow-none border-primary/20 bg-primary/5">
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground mb-1">بانتظار التوقيع</p>
                      <p className="text-2xl font-bold text-primary">{pendingCount}</p>
                    </CardContent>
                  </Card>
                  <Card className="shadow-none">
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground mb-1">موقّعة</p>
                      <p className="text-2xl font-bold">{signedCount}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث برقم العقد أو اسم الخدمة…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pr-10"
                />
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="animate-spin h-10 w-10 border-b-2 border-primary rounded-full mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">جاري تحميل العقود...</p>
              </CardContent>
            </Card>
          ) : filtered.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="font-semibold mb-1">لا توجد عقود</p>
                <p className="text-sm text-muted-foreground">سيظهر العقد هنا تلقائياً عند قبولك لعرض السعر لأي خدمة</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filtered.map((c, i) => (
                <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="transition-all hover:shadow-md hover:border-primary/20">
                    <CardContent className="p-5 sm:p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1 min-w-0 space-y-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="font-mono">{c.contract_number}</Badge>
                            <Badge className={STATUS_COLORS[c.status]}>{STATUS_LABELS[c.status]}</Badge>
                          </div>

                          <div>
                            <h3 className="font-bold text-lg leading-relaxed">{c.title}</h3>
                            {c.service_name && (
                              <p className="text-sm text-muted-foreground mt-1">{c.service_name}</p>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {new Date(c.created_at).toLocaleDateString("ar-SA")}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3.5 w-3.5" />
                              {Number(c.total_amount || 0).toLocaleString("ar-SA")} {c.currency}
                            </span>
                            {c.signed_at && (
                              <span className="flex items-center gap-1 text-primary">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                وُقِّع في {new Date(c.signed_at).toLocaleDateString("ar-SA")}
                              </span>
                            )}
                          </div>
                        </div>

                        <Button asChild size="sm" variant={c.status === "pending_signature" ? "default" : "outline"} className="w-full sm:w-auto">
                          <Link to={`/client/contracts/${c.id}`}>
                            {c.status === "pending_signature" ? (
                              <>
                                <ShieldCheck className="h-4 w-4 ml-2" />
                                راجع ووقّع
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4 ml-2" />
                                عرض العقد
                              </>
                            )}
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
      </div>
    </ClientLayout>
  );
};

export default ClientContracts;
