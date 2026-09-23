// Docker-only entrypoint: serves the built Vite app and re-implements the
// Vercel serverless function from api/analyze.js, so the Analysis tab works
// the same under `docker compose up` as it does under `vercel dev`. Not used
// by `npm run dev` or the actual Vercel deployment — see README.md.
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import analyzeHandler from './api/analyze.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());
app.post('/api/analyze', analyzeHandler);

app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Frontend (+ /api/analyze) listening on http://localhost:${PORT}`);
});
