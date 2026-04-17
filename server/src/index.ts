import cors from 'cors';
import express from 'express';
import path from 'path';

import { weatherRouter } from './routes/weather.router';

const app = express();
const PORT = 3001;
const STATIC_DIR = path.join(__dirname, '../../client/dist');

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/weather', weatherRouter);

app.use(express.static(STATIC_DIR));

app.get('*', (_req, res) => {
  res.sendFile(path.join(STATIC_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
