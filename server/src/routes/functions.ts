/**
 * منافذ دوال الخادم (حاليًا Edge Functions على المزوّد الحالي).
 *
 * خطة النقل: كل دالة في `supabase/functions/<name>/index.ts` تتحول إلى معالج هنا
 * بنفس الاسم، فلا تتغير أسماء الاستدعاءات في الواجهة (`db.callFunction('name')`).
 */

import { Router } from 'express';

export const functionsRouter = Router();

type FunctionHandler = (payload: unknown, context: { userId: string | null; roles: string[] }) => Promise<unknown>;

/** سجل الدوال المنقولة — يُملأ تدريجيًا أثناء النقل. */
export const FUNCTION_REGISTRY: Record<string, FunctionHandler> = {
  // 'send-contact-message': async (payload) => { ... }
};

functionsRouter.post('/:name', async (req, res) => {
  const handler = FUNCTION_REGISTRY[req.params.name];
  if (!handler) {
    return res.status(501).json({ message: `الدالة ${req.params.name} لم تُنقل بعد إلى السيرفر المستقل` });
  }
  try {
    const data = await handler(req.body, { userId: req.auth?.userId ?? null, roles: req.auth?.roles ?? [] });
    return res.json({ data });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
});
