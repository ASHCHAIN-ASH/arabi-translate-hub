/**
 * مصادقة مستقلة (JWT) — تقابل `src/data/auth/selfHostedAuthProvider.ts`.
 *
 * هيكل جاهز للنقل: عند تفعيله ننقل جدول المستخدمين من نظام المصادقة الحالي
 * إلى جدول `app_users` (مع hash كلمات المرور) كما هو موضّح في DATABASE_MIGRATION.md.
 */

import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db/pool.js';
import { loadRoles, requireAuth, signAccessToken } from '../middleware/auth.js';

export const authRouter = Router();

interface AppUserRow {
  id: string;
  email: string;
  password_hash: string;
  raw_user_meta_data: Record<string, unknown> | null;
  created_at: string;
}

authRouter.post('/sign-in', async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ message: 'البريد وكلمة المرور مطلوبان' });

  const { rows } = await query<AppUserRow>('SELECT * FROM app_users WHERE lower(email) = lower($1) LIMIT 1', [email]);
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });
  }

  const roles = await loadRoles(user.id);
  const accessToken = signAccessToken({ sub: user.id, email: user.email, roles });
  return res.json({
    session: {
      accessToken,
      refreshToken: null,
      expiresAt: null,
      user: {
        id: user.id,
        email: user.email,
        phone: (user.raw_user_meta_data?.phone as string) ?? null,
        metadata: user.raw_user_meta_data ?? {},
        createdAt: user.created_at,
      },
    },
  });
});

authRouter.post('/sign-up', async (req, res) => {
  const { email, password, metadata = {} } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ message: 'البريد وكلمة المرور مطلوبان' });

  const existing = await query('SELECT 1 FROM app_users WHERE lower(email) = lower($1)', [email]);
  if (existing.rowCount) return res.status(409).json({ message: 'البريد مسجّل مسبقًا' });

  const passwordHash = await bcrypt.hash(password, 12);
  const { rows } = await query<AppUserRow>(
    'INSERT INTO app_users (email, password_hash, raw_user_meta_data) VALUES ($1, $2, $3) RETURNING *',
    [email, passwordHash, metadata],
  );
  const user = rows[0];
  await query("INSERT INTO user_roles (user_id, role) VALUES ($1, 'user') ON CONFLICT DO NOTHING", [user.id]);

  const accessToken = signAccessToken({ sub: user.id, email: user.email, roles: ['user'] });
  return res.status(201).json({
    session: {
      accessToken,
      refreshToken: null,
      expiresAt: null,
      user: { id: user.id, email: user.email, phone: null, metadata, createdAt: user.created_at },
    },
  });
});

authRouter.post('/sign-out', requireAuth, (_req, res) => res.status(204).end());

authRouter.post('/password-update', requireAuth, async (req, res) => {
  const { password } = req.body ?? {};
  if (!password || password.length < 8) return res.status(400).json({ message: 'كلمة المرور قصيرة' });
  const passwordHash = await bcrypt.hash(password, 12);
  await query('UPDATE app_users SET password_hash = $1, updated_at = now() WHERE id = $2', [passwordHash, req.auth!.userId]);
  return res.status(204).end();
});

authRouter.post('/password-reset', async (_req, res) => {
  // TODO عند التفعيل: توليد رمز مؤقت وإرساله عبر مزوّد البريد الخاص بنا.
  return res.status(501).json({ message: 'إعادة تعيين كلمة المرور غير مفعّلة بعد على السيرفر المستقل' });
});

authRouter.post('/user-update', requireAuth, async (req, res) => {
  const { email, data } = req.body ?? {};
  const { rows } = await query<AppUserRow>(
    'UPDATE app_users SET email = coalesce($1, email), raw_user_meta_data = coalesce($2, raw_user_meta_data), updated_at = now() WHERE id = $3 RETURNING *',
    [email ?? null, data ?? null, req.auth!.userId],
  );
  const user = rows[0];
  const roles = await loadRoles(user.id);
  return res.json({
    session: {
      accessToken: signAccessToken({ sub: user.id, email: user.email, roles }),
      refreshToken: null,
      expiresAt: null,
      user: {
        id: user.id,
        email: user.email,
        phone: (user.raw_user_meta_data?.phone as string) ?? null,
        metadata: user.raw_user_meta_data ?? {},
        createdAt: user.created_at,
      },
    },
  });
});
