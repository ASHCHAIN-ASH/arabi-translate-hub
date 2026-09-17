import 'dotenv/config';

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`متغير البيئة ${name} مفقود`);
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 8787),
  databaseUrl: required('DATABASE_URL'),
  databaseSsl: (process.env.DATABASE_SSL ?? 'true') === 'true',
  databasePoolMax: Number(process.env.DATABASE_POOL_MAX ?? 10),
  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  corsOrigins: (process.env.CORS_ORIGINS ?? '').split(',').map((s) => s.trim()).filter(Boolean),
  storage: {
    driver: process.env.STORAGE_DRIVER ?? 'local',
    localPath: process.env.STORAGE_LOCAL_PATH ?? '/var/lib/fekrahedu/storage',
    publicBaseUrl: process.env.STORAGE_PUBLIC_BASE_URL ?? '',
  },
};
