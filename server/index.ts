import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRouter from './routes/auth.js';
import institutionsRouter from './routes/institutions.js';
import studentsRouter from './routes/students.js';
import uploadsRouter from './routes/uploads.js';
import complianceRouter from './routes/compliance.js';
import duplicatesRouter from './routes/duplicates.js';
import verificationRouter from './routes/verification.js';
import analyticsRouter from './routes/analytics.js';
import auditRouter from './routes/audit.js';
import integrationRouter from './routes/integration.js';
import notificationsRouter from './routes/notifications.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Security and middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    service: 'CREDEN-AICTE-API',
    status: 'HEALTHY',
    timestamp: new Date().toISOString(),
    version: '2.1.0',
    complianceStandard: 'AICTE-APH-2024-25',
    dbProvider: 'SQLite / Prisma (PostgreSQL-Ready)',
  });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/institutions', institutionsRouter);
app.use('/api/students', studentsRouter);
app.use('/api/uploads', uploadsRouter);
app.use('/api/compliance', complianceRouter);
app.use('/api/duplicates', duplicatesRouter);
app.use('/api/verification', verificationRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/audit', auditRouter);
app.use('/api/integration', integrationRouter);
app.use('/api/notifications', notificationsRouter);

// Serve static frontend in production
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Fallback for SPA routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      // In development, client runs on port 3000 via Vite
      res.status(200).send('CREDEN API is running on port ' + PORT + '. Frontend is served at http://localhost:3000');
    }
  });
});

// Start HTTP listener when not in Vercel serverless function
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[CREDEN] AICTE Student Data Management Server active at http://localhost:${PORT}`);
    console.log(`[CREDEN] Health check: http://localhost:${PORT}/api/health`);
  });
}

export default app;
