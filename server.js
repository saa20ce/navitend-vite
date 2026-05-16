import express from 'express';
import { handleContactRequest } from './server/contactHandler.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get('/healthz', (_req, res) => {
  res.status(200).json({ ok: true });
});

app.post('/api/contact', async (req, res) => {
  try {
    await handleContactRequest(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});
