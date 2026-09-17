/**
 * نقطة الدخول الوحيدة للبيانات في التطبيق.
 * المكوّنات والصفحات لا تستورد أي مزوّد مباشرة — فقط `db` أو المستودعات.
 */

import { dataConfig } from './config';
import { lovableCloudDriver } from './drivers/lovableCloudDriver';
import { selfHostedDriver } from './drivers/selfHostedDriver';
import type { DataBackend } from './types';

export const db: DataBackend = dataConfig.driver === 'self-hosted' ? selfHostedDriver : lovableCloudDriver;

export function activeDataDriver(): string {
  return db.name;
}
