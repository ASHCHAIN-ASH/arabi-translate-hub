/**
 * Platform JWT utilities using HMAC-SHA256.
 * Replaces insecure btoa-based tokens with properly signed JWTs.
 */

const ALGORITHM = { name: 'HMAC', hash: 'SHA-256' };

function getSecret(): string {
  const secret = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!secret) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
  return secret;
}

async function getSigningKey(): Promise<CryptoKey> {
  const secret = getSecret();
  const keyData = new TextEncoder().encode('platform_jwt_' + secret);
  return await crypto.subtle.importKey('raw', keyData, ALGORITHM, false, ['sign', 'verify']);
}

function base64UrlEncode(data: Uint8Array): string {
  return btoa(String.fromCharCode(...data))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(str: string): Uint8Array {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

function encodeJson(obj: Record<string, unknown>): string {
  return base64UrlEncode(new TextEncoder().encode(JSON.stringify(obj)));
}

export interface PlatformTokenPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Sign a platform JWT token with HMAC-SHA256.
 */
export async function signPlatformToken(payload: Omit<PlatformTokenPayload, 'iat'>): Promise<string> {
  const key = await getSigningKey();
  const header = encodeJson({ alg: 'HS256', typ: 'JWT' });
  const fullPayload: PlatformTokenPayload = {
    ...payload,
    iat: Math.floor(Date.now() / 1000),
  };
  const body = encodeJson(fullPayload as unknown as Record<string, unknown>);
  const signingInput = `${header}.${body}`;
  const signature = await crypto.subtle.sign(ALGORITHM, key, new TextEncoder().encode(signingInput));
  const sig = base64UrlEncode(new Uint8Array(signature));
  return `${header}.${body}.${sig}`;
}

/**
 * Verify and decode a platform JWT token.
 * Returns null if invalid, expired, or tampered.
 */
export async function verifyPlatformToken(token: string): Promise<PlatformTokenPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, body, sig] = parts;
    const key = await getSigningKey();
    const signingInput = `${header}.${body}`;
    const signature = base64UrlDecode(sig);

    const valid = await crypto.subtle.verify(
      ALGORITHM,
      key,
      signature,
      new TextEncoder().encode(signingInput)
    );

    if (!valid) return null;

    const payload: PlatformTokenPayload = JSON.parse(
      new TextDecoder().decode(base64UrlDecode(body))
    );

    // Check expiration (exp is in seconds)
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}

/**
 * Extract and verify platform user from request.
 * Returns the verified user from DB or null.
 */
export async function authenticatePlatformRequest(
  req: Request,
  supabase: any
): Promise<{ id: string; role: string; status: string } | null> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.substring(7);
  const payload = await verifyPlatformToken(token);
  if (!payload) return null;

  // Verify user still exists and is active in DB
  const { data: user } = await supabase
    .from('platform_users')
    .select('id, role, status')
    .eq('id', payload.sub)
    .eq('status', 'active')
    .single();

  return user || null;
}
