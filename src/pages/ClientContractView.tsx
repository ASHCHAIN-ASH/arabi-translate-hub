import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import ClientLayout from "@/components/client/ClientLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight, FileText, ShieldCheck, Calendar, Wallet, Loader2, AlertCircle, CalendarClock, BadgePercent } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ContractSigningCard } from "@/components/orders/ContractSigningCard";
import { ContractDocumentView } from "@/components/orders/ContractDocumentView";
import { generateContractContent, STATUS_LABELS, STATUS_COLORS } from "@/utils/supabaseContractService";

const ClientContractView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [contract, setContract] = useState<any>(null);
  const [content, setContent] = useState<string>("");

  const load = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("contracts")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      setContract(data);
      const c = data?.content || "";
      if (c.trim().length < 200) {
        try {
          const full = await generateContractContent(id);
          setContent(full);
        } catch {
          setContent(c);
        }
      } else {
        setContent(c);
      }
    } catch (e: any) {
      toast({ title: "تعذّر تحميل العقد", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const issueDateHijri = (() => {
    try {
      return new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(contract?.created_at || Date.now()));
    } catch {
      return "";
    }
  })();

  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-6 space-y-6" dir="rtl">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <Link
              to="/client/contracts"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-2"
            >
              <ArrowRight className="h-4 w-4" />
              عودة لقائمة العقود
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <FileText className="h-7 w-7 text-primary" />
              {loading ? "جارٍ التحميل…" : contract?.title || "تفاصيل العقد"}
            </h1>
            {contract?.contract_number && (
              <p className="text-sm text-muted-foreground mt-1">
                رقم العقد: <span className="font-mono">{contract.contract_number}</span>
              </p>
            )}
          </div>
          {contract?.status && (
            <Badge className={STATUS_COLORS[contract.status as keyof typeof STATUS_COLORS] || ""}>
              {STATUS_LABELS[contract.status as keyof typeof STATUS_LABELS] || contract.status}
            </Badge>
          )}
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        ) : !contract ? (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground">العقد غير موجود أو لا تملك صلاحية الوصول إليه.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Signing card (unified flow) */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <ContractSigningCard
                contract={{
                  id: contract.id,
                  contract_number: contract.contract_number,
                  title: contract.title,
                  content,
                  status: contract.status,
                  total_amount: contract.total_amount,
                  currency: contract.currency,
                  client_email: contract.client_email,
                  client_full_name: contract.client_full_name,
                }}
                onSigned={load}
              />
            </motion.div>

            {/* Quick facts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Wallet className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">المبلغ الإجمالي</p>
                    <p className="font-bold">
                      {Number(contract.total_amount || 0).toLocaleString("ar-SA")}{" "}
                      {contract.currency || "SAR"}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">تاريخ الإصدار</p>
                    <p className="font-bold">{issueDateHijri}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">حالة العقد</p>
                    <p className="font-bold">
                      {STATUS_LABELS[contract.status as keyof typeof STATUS_LABELS] ||
                        contract.status}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Document */}
            <Card>
              <CardHeader>
                <CardTitle>نص العقد</CardTitle>
                <CardDescription>اقرأ بنود العقد كاملةً قبل التوقيع</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[70vh] rounded-lg border bg-card">
                  <ContractDocumentView
                    contractNumber={contract.contract_number}
                    title={contract.title}
                    content={content || "—"}
                    totalAmount={contract.total_amount}
                    currency={contract.currency}
                    clientName={contract.client_full_name}
                    clientEmail={contract.client_email}
                    issueDateHijri={issueDateHijri}
                  />
                </ScrollArea>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </ClientLayout>
  );
};

export default ClientContractView;
