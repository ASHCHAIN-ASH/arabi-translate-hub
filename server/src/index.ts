/**
 * FekrahEdu API — هيكل جاهز للنقل إلى سيرفرنا الخاص.
 * ⚠️ غير مفعّل حاليًا: الموقع ما زال يعمل على المزوّد الحالي دون أي تغيير.
 */

import express from 'express';
import cors from 'cors';
import { env } from './env.js';
import { attachAuth } from './middleware/auth.js';
import { authRouter } from './routes/auth.js';
import { dataRouter } from './routes/data.js';
import { functionsRouter } from './routes/functions.js';
import { realtimeRouter } from './routes/realtime.js';
import { rpcRouter } from './routes/rpc.js';

const app = express();

app.use(cors({ origin: env.corsOrigins.length ? env.corsOrigins : true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(attachAuth);

app.get('/health', (_req, res) => res.json({ ok: true, env: env.nodeEnv }));

app.use('/auth', authRouter);
app.use('/data', dataRouter);
app.use('/rpc', rpcRouter);
app.use('/functions', functionsRouter);
app.use('/realtime', realtimeRouter);

app.use((error: Error & { status?: number }, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  res.status(error.status ?? 500).json({ message: error.message ?? 'خطأ غير متوقع' });
});

app.listen(env.port, () => {
  console.log(`FekrahEdu API يعمل على المنفذ ${env.port}`);
});
