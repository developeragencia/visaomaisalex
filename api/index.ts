import { app } from '../server/index';
import { createServer } from 'http';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  app(req, res);
} 