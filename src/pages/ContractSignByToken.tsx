import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { supabase } from "@/data/legacy/client";
import { Loader2 } from "lucide-react";

export default function ContractSignByToken() {
  const { token } = useParams();
  const [contractId, setContractId] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      if (!token) { setNotFound(true); return; }
      const { data } = await supabase
        .from("contracts")
        .select("id")
        .eq("verification_token", token)
        .maybeSingle();
      if (data?.id) setContractId(data.id);
      else setNotFound(true);
    })();
  }, [token]);

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">رابط العقد غير صالح</h1>
          <p className="text-muted-foreground">لم يتم العثور على عقد مرتبط بهذا الرابط. تأكّد من الرابط أو تواصل معنا.</p>
        </div>
      </div>
    );
  }

  if (!contractId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <Navigate to={`/client/contracts/${contractId}`} replace />;
}
