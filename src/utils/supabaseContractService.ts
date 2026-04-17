import { supabase } from "@/integrations/supabase/client";
import { buildLegalAcademicContract, LegalTemplateContext } from "./contractTemplates";

export type ContractStatus =
  | "draft"
  | "pending_signature"
  | "signed"
  | "active"
  | "completed"
  | "cancelled"
  | "expired";

export interface ContractRow {
  id: string;
  contract_number: string;
  user_id: string | null;
  service_order_id: string | null;
  customer_id: string | null;
  title: string;
  service_name: string | null;
  service_type: string | null;
  total_amount: number | null;
  currency: string | null;
  payment_terms: string | null;
  delivery_date: string | null;
  client_full_name: string | null;
  client_id_number: string | null;
  client_email: string | null;
  client_phone: string | null;
  content: string | null;
  status: ContractStatus;
  signed_at: string | null;
  sent_at: string | null;
  expires_at: string | null;
  variables: Record<string, any> | null;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface ContractSignature {
  id: string;
  contract_id: string;
  signer_user_id: string | null;
  signer_name: string;
  signer_email: string | null;
  signer_id_number: string | null;
  signature_text: string;
  ip_address: string | null;
  user_agent: string | null;
  accepted_terms: any;
  comments: string | null;
  signed_at: string;
}

export interface ContractTimelineEvent {
  id: string;
  contract_id: string;
  actor_id: string | null;
  actor_type: string;
  action_type: string;
  action_label: string;
  description: string | null;
  metadata: any;
  created_at: string;
}

const TBL = "contracts" as const;

// ----------- Queries -----------
export async function listContracts(filters?: { status?: ContractStatus; userId?: string }) {
  let q = supabase.from(TBL).select("*").order("created_at", { ascending: false });
  if (filters?.status) q = q.eq("status", filters.status);
  if (filters?.userId) q = q.eq("user_id", filters.userId);
  const { data, error } = await q;
  if (error) throw error;
  return (data || []) as unknown as ContractRow[];
}

export async function getContract(id: string) {
  const { data, error } = await supabase.from(TBL).select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as unknown as ContractRow | null;
}

export async function getContractTimeline(contractId: string) {
  const { data, error } = await supabase
    .from("contract_timeline" as any)
    .select("*")
    .eq("contract_id", contractId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data || []) as unknown as ContractTimelineEvent[];
}

export async function getContractSignatures(contractId: string) {
  const { data, error } = await supabase
    .from("contract_signatures" as any)
    .select("*")
    .eq("contract_id", contractId)
    .order("signed_at", { ascending: false });
  if (error) throw error;
  return (data || []) as unknown as ContractSignature[];
}

// ----------- Mutations -----------
export async function generateContractContent(contractId: string) {
  const c = await getContract(contractId);
  if (!c) throw new Error("Contract not found");

  const ctx: LegalTemplateContext = {
    contractNumber: c.contract_number,
    serviceName: c.service_name || c.title || "خدمة",
    serviceDescription: (c.metadata as any)?.serviceDescription,
    clientFullName: c.client_full_name || "العميل",
    clientIdNumber: c.client_id_number || undefined,
    clientEmail: c.client_email || undefined,
    clientPhone: c.client_phone || undefined,
    totalAmount: Number(c.total_amount || 0),
    currency: c.currency || "SAR",
    paymentTerms: c.payment_terms || undefined,
    deliveryDate: c.delivery_date || undefined,
    workDuration: (c.metadata as any)?.workDuration || undefined,
    issueDate: c.created_at,
  };

  const content = buildLegalAcademicContract(ctx);
  const { error } = await (supabase.from(TBL) as any)
    .update({ content, updated_at: new Date().toISOString() })
    .eq("id", contractId);
  if (error) throw error;
  return content;
}

/**
 * Parse work duration text and compute the delivery date (today + N days).
 * Supports Arabic & English patterns:
 *   - "14 يوم", "14 يوم عمل", "يومين", "يوم"
 *   - "أسبوع" (7), "أسبوعين" (14), "3 أسابيع"
 *   - "شهر" (30), "شهرين" (60), "2 شهر"
 *   - "14 day", "2 weeks", "1 month"
 * Returns ISO date string (YYYY-MM-DD) or undefined if can't parse.
 */
export function computeDeliveryFromDuration(duration?: string): string | undefined {
  if (!duration) return undefined;
  const text = duration.trim().toLowerCase();
  if (!text) return undefined;

  // Pure word (no digits): يوم/يومين/أسبوع/أسبوعين/شهر/شهرين
  const wordMap: Record<string, number> = {
    "يوم": 1, "يومين": 2,
    "أسبوع": 7, "اسبوع": 7, "أسبوعين": 14, "اسبوعين": 14,
    "شهر": 30, "شهرين": 60,
  };
  if (wordMap[text] !== undefined) return addDaysISO(wordMap[text]);

  // Numeric pattern: number followed by Arabic/English unit
  const m = text.match(/(\d+)\s*([\u0600-\u06FFa-z]+)/);
  if (m) {
    const n = parseInt(m[1], 10);
    const unit = m[2];
    let multiplier = 0;
    if (/^(يوم|أيام|ايام|day|days)/.test(unit)) multiplier = 1;
    else if (/^(أسبوع|اسبوع|أسابيع|اسابيع|week|weeks)/.test(unit)) multiplier = 7;
    else if (/^(شهر|شهور|أشهر|اشهر|month|months)/.test(unit)) multiplier = 30;
    if (multiplier > 0) return addDaysISO(n * multiplier);
  }

  // Fallback: just a number → treat as days
  const numOnly = text.match(/^(\d+)$/);
  if (numOnly) return addDaysISO(parseInt(numOnly[1], 10));

  return undefined;
}

function addDaysISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export async function createManualContract(input: {
  user_id?: string | null;
  customer_id?: string | null;
  service_order_id?: string | null;
  service_name: string;
  service_type?: string;
  total_amount: number;
  currency?: string;
  payment_terms?: string;
  delivery_date?: string;
  work_duration?: string;
  client_full_name: string;
  client_id_number?: string;
  client_email?: string;
  client_phone?: string;
}) {
  // Auto-compute delivery_date from work_duration if not provided
  // Supports patterns like: "14 يوم", "14 يوم عمل", "أسبوعين", "شهر", "X day(s)", "X week(s)"
  const computedDelivery = input.delivery_date || computeDeliveryFromDuration(input.work_duration);

  const { data, error } = await (supabase.from(TBL) as any)
    .insert({
      user_id: input.user_id ?? null,
      customer_id: input.customer_id ?? null,
      service_order_id: input.service_order_id ?? null,
      title: `عقد خدمة: ${input.service_name}`,
      service_name: input.service_name,
      service_type: input.service_type || "general",
      total_amount: input.total_amount,
      currency: input.currency || "SAR",
      payment_terms: input.payment_terms,
      delivery_date: computedDelivery,
      client_full_name: input.client_full_name,
      client_id_number: input.client_id_number,
      client_email: input.client_email,
      client_phone: input.client_phone,
      status: "draft",
      content: "",
      metadata: input.work_duration ? { workDuration: input.work_duration } : {},
    })
    .select("id")
    .single();
  if (error) throw error;
  await generateContractContent(data.id);
  return data.id as string;
}

export async function updateContractStatus(id: string, status: ContractStatus) {
  const patch: Record<string, any> = { status, updated_at: new Date().toISOString() };
  if (status === "pending_signature") patch.sent_at = new Date().toISOString();
  const { error } = await (supabase.from(TBL) as any).update(patch).eq("id", id);
  if (error) throw error;
}

export async function sendContractToClient(id: string) {
  await generateContractContent(id);
  await updateContractStatus(id, "pending_signature");
  // notify client
  const c = await getContract(id);
  if (c?.user_id) {
    await (supabase.from("user_notifications" as any) as any).insert({
      user_id: c.user_id,
      title: "📝 عقد جديد بانتظار توقيعك",
      message: `العقد رقم ${c.contract_number} — ${c.title}`,
      type: "contract",
      link: `/client/contracts/${c.id}`,
    });
  }
}

export async function remindClientToSign(id: string) {
  const c = await getContract(id);
  if (!c) throw new Error("Contract not found");
  if (c.user_id) {
    await (supabase.from("user_notifications" as any) as any).insert({
      user_id: c.user_id,
      title: "⏰ تذكير: عقدك بانتظار التوقيع",
      message: `يرجى مراجعة وتوقيع العقد رقم ${c.contract_number}`,
      type: "contract",
      link: `/client/contracts/${c.id}`,
    });
  }
  await (supabase.from("contract_timeline" as any) as any).insert({
    contract_id: id,
    actor_type: "admin",
    action_type: "reminder_sent",
    action_label: "تذكير العميل",
    description: "أرسلت الإدارة تذكيراً للعميل لإكمال التوقيع",
  });
}

export async function cancelContract(id: string, reason?: string) {
  const { error } = await (supabase.from(TBL) as any)
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
  await (supabase.from("contract_timeline" as any) as any).insert({
    contract_id: id,
    actor_type: "admin",
    action_type: "cancelled",
    action_label: "إلغاء العقد",
    description: reason || "ألغى المسؤول العقد",
  });
}

export async function deleteContract(id: string) {
  const { error } = await (supabase.from(TBL) as any).delete().eq("id", id);
  if (error) throw error;
}

export async function signContract(input: {
  contract_id: string;
  signer_user_id: string;
  signer_name: string;
  signer_email?: string;
  signer_id_number?: string;
  signature_text: string;
  ip_address?: string;
  user_agent?: string;
  accepted_terms?: string[];
  comments?: string;
}) {
  const { error } = await (supabase.from("contract_signatures" as any) as any).insert({
    contract_id: input.contract_id,
    signer_user_id: input.signer_user_id,
    signer_name: input.signer_name,
    signer_email: input.signer_email,
    signer_id_number: input.signer_id_number,
    signature_text: input.signature_text,
    ip_address: input.ip_address,
    user_agent: input.user_agent,
    accepted_terms: input.accepted_terms || [],
    comments: input.comments,
  });
  if (error) throw error;
}

export async function getClientIP(): Promise<string> {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const j = await res.json();
    return j.ip || "unknown";
  } catch {
    return "unknown";
  }
}

export const STATUS_LABELS: Record<ContractStatus, string> = {
  draft: "مسودة",
  pending_signature: "بانتظار التوقيع",
  signed: "موقّع",
  active: "ساري",
  completed: "مكتمل",
  cancelled: "ملغى",
  expired: "منتهي",
};

export const STATUS_COLORS: Record<ContractStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  pending_signature: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  signed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  active: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  completed: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  cancelled: "bg-destructive/10 text-destructive",
  expired: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
};

// ===== Backward-compatible shims =====
export const getAllContracts = listContracts;
export const getContractById = getContract;
export const searchContracts = async (q: string) => {
  const all = await listContracts();
  const t = q.toLowerCase();
  return all.filter(c =>
    (c.title || "").toLowerCase().includes(t) ||
    (c.contract_number || "").toLowerCase().includes(t) ||
    (c.client_full_name || "").toLowerCase().includes(t)
  );
};
export const createContract = async (data: any) => {
  return createManualContract({
    service_name: data.serviceName || data.service_name || data.title || "خدمة",
    total_amount: Number(data.totalAmount || data.total_amount || 0),
    client_full_name: data.clientName || data.client_full_name || "العميل",
    client_email: data.clientEmail || data.client_email,
    client_phone: data.clientPhone || data.client_phone,
  });
};
export const saveClientApproval = async (
  contractId: string,
  approval: { clientName: string; signature: string; ipAddress: string; userAgent: string; comments?: string }
) => {
  const { data: u } = await supabase.auth.getUser();
  await signContract({
    contract_id: contractId,
    signer_user_id: u.user?.id || "",
    signer_name: approval.clientName,
    signature_text: approval.signature,
    ip_address: approval.ipAddress,
    user_agent: approval.userAgent,
    comments: approval.comments,
  });
};
