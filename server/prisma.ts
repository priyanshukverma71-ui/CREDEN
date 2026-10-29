import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// If running inside Vercel serverless environment, setup writable /tmp SQLite DB from bundled seed
if (process.env.VERCEL) {
  const currentDbUrl = process.env.DATABASE_URL || '';
  if (!currentDbUrl.startsWith('postgres')) {
    const tmpDbPath = '/tmp/dev.db';
    const bundledDbPath = path.join(process.cwd(), 'prisma', 'dev.db');

    try {
      if (!fs.existsSync(tmpDbPath) && fs.existsSync(bundledDbPath)) {
        fs.copyFileSync(bundledDbPath, tmpDbPath);
      }
      process.env.DATABASE_URL = `file:${tmpDbPath}`;
    } catch (e) {
      console.warn('Vercel /tmp db setup notice:', e);
    }
  }
}

export const prisma = new PrismaClient({
  log: ['warn', 'error'],
});

export default prisma;
