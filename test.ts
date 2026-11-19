import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import prisma from './prismaClient';

const app = express();
const port: number = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// GitHub Webhook endpoint (stub — Week 2 makes this real)
app.post('/webhooks/github', (req: Request, res: Response) => {
  const event = req.get('x-github-event') ?? 'unknown';
  const delivery = req.get('x-github-delivery');

  if (event === 'ping') {
    console.log(`✅ Received GitHub PING for delivery ${delivery}`);
    return res.status(200).json({ message: 'pong' });
  }

  console.log(`📩 Webhook event=${event} delivery=${delivery}`);
  console.log('   Payload keys:', Object.keys(req.body));

  // Week 2: verify signature, check idempotency, upsert into Postgres.
  return res.status(200).json({ received: true, event });
});

// Global error handler — ONE place, loud logging, never a silent 200
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error('💥 Unhandled error:', err.message);
  res.status(500).json({ error: 'internal_error' });
});

app.listen(port, () => {
  console.log(`🚀 DevPulse Server running on http://localhost:${port}`);
});
