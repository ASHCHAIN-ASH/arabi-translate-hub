import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../env.js';
import { query } from '../db/pool.js';

export interface AuthContext {
  userId: string;
  email: string | null;
  roles: string[];
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}

export function signAccessToken(payload: { sub: string; email: string | null; roles: string[] }) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn } as jwt.SignOptions);
}

export async function attachAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next();
  try {
    const decoded = jwt.verify(header.slice(7), env.jwtSecret) as jwt.JwtPayload;
    const roles = (decoded.roles as string[]) ?? [];
    req.auth = { userId: String(decoded.sub), email: (decoded.email as string) ?? null, roles };
  } catch {
    /* توكن غير صالح — يُعامل كزائر */
  }
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.auth) return res.status(401).json({ message: 'مطلوب تسجيل الدخول' });
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.auth?.roles.includes('admin')) return res.status(403).json({ message: 'صلاحية المسؤول مطلوبة' });
  next();
}

export async function loadRoles(userId: string): Promise<string[]> {
  const { rows } = await query<{ role: string }>('SELECT role FROM user_roles WHERE user_id = $1', [userId]);
  return rows.map((row) => row.role);
}
