/**
 * مستودعات البيانات (Repositories) — واجهة التطبيق الوحيدة للجداول.
 * كل مستودع مرتبط بجدول واحد ويحمل عمليات النطاق الخاصة به.
 */

import { createRepository } from './createRepository';
import { db } from '../dataClient';
import { where, type Filter, type Row } from '../types';

/* ============================ العملاء والحسابات ============================ */

export const customersRepository = {
  ...createRepository('customers'),
  async findByUserId(userId: string) {
    return await db.selectOne<Row<'customers'>>('customers', { filters: [where.eq('user_id', userId)] });
  },
  async findByEmail(email: string) {
    return await db.selectOne<Row<'customers'>>('customers', { filters: [where.eq('email', email)] });
  },
  async search(term: string, limit = 50) {
    const result = await db.select<Row<'customers'>>('customers', {
      or: `name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`,
      order: { column: 'created_at', ascending: false },
      limit,
    });
    return result.data;
  },
};

export const profilesRepository = createRepository('profiles');
export const userRolesRepository = {
  ...createRepository('user_roles'),
  async rolesOf(userId: string) {
    const result = await db.select<Row<'user_roles'>>('user_roles', { filters: [where.eq('user_id', userId)] });
    return result.data.map((row) => row.role);
  },
  async hasRole(userId: string, role: string) {
    return await db.rpc<boolean>('has_role', { _user_id: userId, _role: role });
  },
};

/* ================================ الطلبات ================================ */

export const ordersRepository = {
  ...createRepository('orders'),
  async listForUser(userId: string) {
    const result = await db.select<Row<'orders'>>('orders', {
      filters: [where.eq('user_id', userId)],
      order: { column: 'created_at', ascending: false },
    });
    return result.data;
  },
  async findByTracking(trackingId: string) {
    return await db.selectOne<Row<'orders'>>('orders', { filters: [where.eq('tracking_id', trackingId)] });
  },
  async updateStatus(id: string, status: string) {
    return await db.update<Row<'orders'>>('orders', { current_status: status, updated_at: new Date().toISOString() }, [where.eq('id', id)]);
  },
};

export const serviceOrdersRepository = {
  ...createRepository('service_orders'),
  async listForUser(userId: string, columns = '*') {
    const result = await db.select<Row<'service_orders'>>('service_orders', {
      columns,
      filters: [where.eq('user_id', userId)],
      order: { column: 'created_at', ascending: false },
    });
    return result.data;
  },
  async listByStatus(status: string) {
    const result = await db.select<Row<'service_orders'>>('service_orders', {
      filters: [where.eq('current_status', status)],
      order: { column: 'created_at', ascending: false },
    });
    return result.data;
  },
  async updateLifecycle(id: string, patch: Partial<Row<'service_orders'>>) {
    const rows = await db.update<Row<'service_orders'>>('service_orders', { ...patch, updated_at: new Date().toISOString() }, [where.eq('id', id)]);
    return rows[0];
  },
};

export const orderTimelineRepository = createRepository('order_timeline');
export const orderAttachmentsRepository = createRepository('order_attachments');
export const serviceOrderMessagesRepository = createRepository('service_order_messages');
export const serviceOrderTimelineRepository = createRepository('service_order_timeline');

/* ============================ الخدمات والمحتوى ============================ */

export const servicesRepository = {
  ...createRepository('services'),
  async listActive() {
    const result = await db.select<Row<'services'>>('services', {
      filters: [where.eq('is_active', true)],
      order: [{ column: 'sort_order', ascending: true }, { column: 'created_at', ascending: false }],
    });
    return result.data;
  },
  async findBySlug(slug: string) {
    return await db.selectOne<Row<'services'>>('services', { filters: [where.eq('slug', slug)] });
  },
};

export const serviceCategoriesRepository = createRepository('service_categories');

export const blogPostsRepository = {
  ...createRepository('blog_posts'),
  async listPublished(limit?: number) {
    const result = await db.select<Row<'blog_posts'>>('blog_posts', {
      filters: [where.eq('status', 'published')],
      order: { column: 'published_at', ascending: false },
      limit,
    });
    return result.data;
  },
  async findBySlug(slug: string) {
    return await db.selectOne<Row<'blog_posts'>>('blog_posts', { filters: [where.eq('slug', slug)] });
  },
};

/* =============================== الفوترة =============================== */

export const invoicesRepository = {
  ...createRepository('invoices'),
  async listForUser(userId: string) {
    const result = await db.select<Row<'invoices'>>('invoices', {
      filters: [where.eq('user_id', userId)],
      order: { column: 'created_at', ascending: false },
    });
    return result.data;
  },
  async findByNumber(invoiceNumber: string) {
    return await db.selectOne<Row<'invoices'>>('invoices', { filters: [where.eq('invoice_number', invoiceNumber)] });
  },
  async listUnpaid() {
    const result = await db.select<Row<'invoices'>>('invoices', {
      filters: [where.in('status', ['draft', 'sent', 'partially_paid', 'overdue'])],
      order: { column: 'due_date', ascending: true },
    });
    return result.data;
  },
};

export const invoiceItemsRepository = createRepository('invoice_items');
export const invoicePaymentsRepository = createRepository('invoice_payments');
export const invoiceTimelineRepository = createRepository('invoice_timeline');
export const paymentIntentsRepository = createRepository('payment_intents');
export const paymentTransactionsRepository = createRepository('payment_transactions');

/* =============================== المحفظة =============================== */

export const walletsRepository = {
  ...createRepository('wallets'),
  async findByUserId(userId: string) {
    return await db.selectOne<Row<'wallets'>>('wallets', { filters: [where.eq('user_id', userId)] });
  },
};

export const walletTransactionsRepository = {
  ...createRepository('wallet_transactions'),
  async listForUser(userId: string, limit = 100) {
    const result = await db.select<Row<'wallet_transactions'>>('wallet_transactions', {
      filters: [where.eq('user_id', userId)],
      order: { column: 'created_at', ascending: false },
      limit,
    });
    return result.data;
  },
};

/* =============================== التمويل =============================== */

export const financingApplicationsRepository = {
  ...createRepository('financing_applications'),
  async listForUser(userId: string) {
    const result = await db.select<Row<'financing_applications'>>('financing_applications', {
      filters: [where.eq('user_id', userId)],
      order: { column: 'created_at', ascending: false },
    });
    return result.data;
  },
  async listByStatus(status: string) {
    const result = await db.select<Row<'financing_applications'>>('financing_applications', {
      filters: [where.eq('status', status)],
      order: { column: 'created_at', ascending: false },
    });
    return result.data;
  },
  async changeStatus(id: string, status: string, patch: Partial<Row<'financing_applications'>> = {}) {
    const rows = await db.update<Row<'financing_applications'>>(
      'financing_applications',
      { status, ...patch, updated_at: new Date().toISOString() },
      [where.eq('id', id)],
    );
    return rows[0];
  },
};

export const financingInstallmentsRepository = {
  ...createRepository('financing_installments'),
  async listForApplication(applicationId: string) {
    const result = await db.select<Row<'financing_installments'>>('financing_installments', {
      filters: [where.eq('application_id', applicationId)],
      order: { column: 'due_date', ascending: true },
    });
    return result.data;
  },
};

export const financingDocumentsRepository = createRepository('financing_documents');
export const financingStatusLogsRepository = createRepository('financing_status_logs');
export const financingContractsRepository = createRepository('financing_contracts');
export const financingPaymentReceiptsRepository = createRepository('financing_payment_receipts');
export const financingInterestsRepository = {
  ...createRepository('financing_interests'),
  async findForUser(userId: string) {
    return await db.selectOne<Row<'financing_interests'>>('financing_interests', {
      filters: [where.eq('user_id', userId)],
    });
  },
  async register(userId: string, customerName: string, email: string) {
    const rows = await db.upsert<Row<'financing_interests'>>(
      'financing_interests',
      {
        user_id: userId,
        customer_name: customerName,
        email,
        status: 'interested',
        source: 'client_dashboard',
      },
      { onConflict: 'user_id' },
    );
    return rows[0];
  },
};

/* =============================== العقود =============================== */

export const contractsRepository = {
  ...createRepository('contracts'),
  async listForUser(userId: string) {
    const result = await db.select<Row<'contracts'>>('contracts', {
      filters: [where.eq('user_id', userId)],
      order: { column: 'created_at', ascending: false },
    });
    return result.data;
  },
  async findByToken(token: string) {
    return await db.selectOne<Row<'contracts'>>('contracts', { filters: [where.eq('verification_token', token)] });
  },
};

export const contractVersionsRepository = createRepository('contract_versions');
export const contractSignaturesRepository = createRepository('contract_signatures');
export const contractTimelineRepository = createRepository('contract_timeline');

/* ============================ الدعم والتذاكر ============================ */

export const ticketsRepository = {
  ...createRepository('tickets'),
  async listForUser(userId: string) {
    const result = await db.select<Row<'tickets'>>('tickets', {
      filters: [where.eq('user_id', userId)],
      order: { column: 'last_message_at', ascending: false },
    });
    return result.data;
  },
  async listOpen() {
    const result = await db.select<Row<'tickets'>>('tickets', {
      filters: [where.in('status', ['open', 'pending', 'in_progress'])],
      order: { column: 'created_at', ascending: false },
    });
    return result.data;
  },
};

export const ticketMessagesRepository = createRepository('ticket_messages');
export const ticketAttachmentsRepository = createRepository('ticket_attachments');
export const ticketTimelineRepository = createRepository('ticket_timeline');
export const inboxMessagesRepository = createRepository('inbox_messages');
export const inboxRepliesRepository = createRepository('inbox_replies');

/* ============================ العضوية والولاء ============================ */

export const membershipPlansRepository = {
  ...createRepository('membership_plans'),
  async listActive() {
    const result = await db.select<Row<'membership_plans'>>('membership_plans', {
      filters: [where.eq('is_active', true)],
      order: { column: 'created_at', ascending: true },
    });
    return result.data;
  },
};

export const userMembershipsRepository = {
  ...createRepository('user_memberships'),
  async activeForUser(userId: string) {
    return await db.selectOne<Row<'user_memberships'>>('user_memberships', {
      filters: [where.eq('user_id', userId), where.eq('status', 'active')],
      order: { column: 'created_at', ascending: false },
    });
  },
};

export const membershipHistoryRepository = createRepository('membership_history');
export const pointTransactionsRepository = createRepository('point_transactions');
export const referralsRepository = createRepository('referrals');
export const memberReferralsRepository = createRepository('member_referrals');

/* ============================== الإشعارات ============================== */

export const userNotificationsRepository = {
  ...createRepository('user_notifications'),
  async listForUser(userId: string, limit = 50) {
    const result = await db.select<Row<'user_notifications'>>('user_notifications', {
      filters: [where.eq('user_id', userId)],
      order: { column: 'created_at', ascending: false },
      limit,
    });
    return result.data;
  },
  async markRead(id: string) {
    await db.update('user_notifications', { read_at: new Date().toISOString() }, [where.eq('id', id)]);
  },
  async markAllRead(userId: string) {
    await db.update('user_notifications', { read_at: new Date().toISOString() }, [
      where.eq('user_id', userId),
      where.is('read_at', null),
    ]);
  },
};

export const notificationsRepository = createRepository('notifications');
export const auditLogsRepository = createRepository('audit_logs');

export type { Filter };
export { where, createRepository };
