// Serverless function to proxy data from bot API
const axios = require('axios');

// Cloudflare tunnel URL
const BOT_API_URL = 'https://stat-nutten-marilyn-surrounded.trycloudflare.com';

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { chatId } = req.query;
  
  if (!chatId) {
    return res.status(400).json({ error: 'Missing chatId' });
  }
  
  try {
    console.log(`Fetching data for chatId: ${chatId}`);
    const response = await axios.get(`${BOT_API_URL}/api/data/${chatId}`, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Vercel-Serverless-Function'
      }
    });
    res.json(response.data);
  } catch (err) {
    console.error('Failed to fetch from bot:', err.message);
    res.status(500).json({ 
      error: 'Failed to fetch data from bot',
      details: err.message 
    });
  }
};
