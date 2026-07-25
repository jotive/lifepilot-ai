import express from 'express';
import cors from 'cors';
import { APP_NAME, SUPPORTED_CITIES } from '@roomia/shared';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Healthcheck Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: `${APP_NAME} API Service`,
    timestamp: new Date().toISOString()
  });
});

// Cities Endpoint
app.get('/api/cities', (req, res) => {
  res.json({ cities: SUPPORTED_CITIES });
});

// Tavily Proxy Endpoint
app.post('/api/search/tavily', async (req, res) => {
  const { query, city, apiKey } = req.body;
  const keyToUse = apiKey || process.env.TAVILY_API_KEY;

  if (!keyToUse) {
    return res.status(400).json({ error: 'Tavily API key is missing' });
  }

  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: keyToUse,
        query: `${query} en ${city || 'Ciudad de México'}`,
        search_depth: 'basic',
        max_results: 6
      })
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to query Tavily API', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 [${APP_NAME} API] Server running on http://localhost:${PORT}`);
});
