/**
 * قائمة سماح الجداول والعمليات المتاحة عبر الـ API.
 * أي جدول غير مذكور هنا لا يمكن الوصول إليه من الواجهة — الحماية لا تعتمد على RLS وحدها.
 *
 * ملاحظة: القائمة مشتقة من الجداول المستخدمة فعليًا في الواجهة اليوم.
 * راجع `docs/DATABASE_SCHEMA.md` للقائمة الكاملة (أكثر من 120 جدولًا).
 */

export type TableAccess = 'public-read' | 'authenticated' | 'owner' | 'admin';

export interface TableRule {
  /** من يستطيع القراءة */
  read: TableAccess;
  /** من يستطيع الكتابة */
  write: TableAccess;
  /** عمود المالك عند استخدام صلاحية owner */
  ownerColumn?: string;
}

export const TABLE_RULES: Record<string, TableRule> = {
  services: { read: 'public-read', write: 'admin' },
  service_categories: { read: 'public-read', write: 'admin' },
  blog_posts: { read: 'public-read', write: 'admin' },
  membership_plans: { read: 'public-read', write: 'admin' },
  support_kb_articles: { read: 'public-read', write: 'admin' },

  customers: { read: 'owner', write: 'owner', ownerColumn: 'user_id' },
  profiles: { read: 'owner', write: 'owner', ownerColumn: 'id' },
  orders: { read: 'owner', write: 'owner', ownerColumn: 'user_id' },
  service_orders: { read: 'owner', write: 'owner', ownerColumn: 'user_id' },
  order_timeline: { read: 'authenticated', write: 'admin' },
  order_attachments: { read: 'authenticated', write: 'authenticated' },
  invoices: { read: 'owner', write: 'admin', ownerColumn: 'user_id' },
  invoice_items: { read: 'authenticated', write: 'admin' },
  invoice_payments: { read: 'authenticated', write: 'admin' },
  contracts: { read: 'owner', write: 'owner', ownerColumn: 'user_id' },
  contract_versions: { read: 'authenticated', write: 'admin' },
  contract_signatures: { read: 'authenticated', write: 'authenticated' },
  wallets: { read: 'owner', write: 'admin', ownerColumn: 'user_id' },
  wallet_transactions: { read: 'owner', write: 'admin', ownerColumn: 'user_id' },
  financing_applications: { read: 'owner', write: 'owner', ownerColumn: 'user_id' },
  financing_installments: { read: 'authenticated', write: 'admin' },
  financing_documents: { read: 'authenticated', write: 'authenticated' },
  financing_status_logs: { read: 'authenticated', write: 'admin' },
  tickets: { read: 'owner', write: 'owner', ownerColumn: 'user_id' },
  ticket_messages: { read: 'authenticated', write: 'authenticated' },
  user_memberships: { read: 'owner', write: 'admin', ownerColumn: 'user_id' },
  membership_history: { read: 'owner', write: 'admin', ownerColumn: 'user_id' },
  point_transactions: { read: 'owner', write: 'admin', ownerColumn: 'user_id' },
  user_notifications: { read: 'owner', write: 'owner', ownerColumn: 'user_id' },
  notifications: { read: 'authenticated', write: 'admin' },
  user_roles: { read: 'admin', write: 'admin' },
  audit_logs: { read: 'admin', write: 'admin' },
};

/** دوال قاعدة البيانات (RPC) المسموح استدعاؤها من الواجهة. */
export const ALLOWED_RPC = new Set<string>([
  'has_role',
  'get_wallet_balance',
  'award_points',
]);
