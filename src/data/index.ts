/**
 * طبقة البيانات — نقطة الاستيراد الوحيدة للتطبيق.
 *
 *   import { db, authService, ordersRepository } from '@/data';
 *
 * ممنوع استيراد أي عميل قاعدة بيانات مباشرة داخل المكوّنات أو الصفحات.
 */

export { db, activeDataDriver } from './dataClient';
export { dataConfig } from './config';
export { authService, activeAuthProvider } from './auth/authService';
export type { AuthEvent, AuthProvider, AuthResult, AuthSession, AuthUser } from './auth/types';
export * from './repositories';
export {
  DataError,
  where,
  type DataBackend,
  type Filter,
  type FilterOperator,
  type InsertRow,
  type OrderBy,
  type RealtimeChangePayload,
  type RealtimeEvent,
  type RealtimeSubscription,
  type Row,
  type SelectOptions,
  type TableName,
  type UpdateRow,
} from './types';
