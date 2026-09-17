/**
 * خدمة المصادقة الموحّدة.
 * الواجهة تتعامل مع `authService` فقط، فيصبح تبديل نظام المصادقة لاحقًا
 * مجرد تغيير متغير بيئة VITE_AUTH_DRIVER.
 */

import { dataConfig } from '../config';
import { cloudAuthProvider } from './cloudAuthProvider';
import { selfHostedAuthProvider } from './selfHostedAuthProvider';
import type { AuthProvider } from './types';

export const authService: AuthProvider =
  dataConfig.authDriver === 'self-hosted' ? selfHostedAuthProvider : cloudAuthProvider;

export function activeAuthProvider(): string {
  return authService.name;
}

export type { AuthEvent, AuthProvider, AuthResult, AuthSession, AuthUser } from './types';
