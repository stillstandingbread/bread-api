const express = require('express');
const axios = require('axios');
const app = express();

// Port for the server to listen on (Render uses process.env.PORT)
const PORT = process.env.PORT || 3000;

// Solana mint address for the $BREAD token
const TOKEN_MINT = 'J8ZhEwucyYBaRiA4thhAzFk1wPvy3C5HB5KYf8Lipump';

// Helius API Key (used to fetch on-chain data)
const HELIUS_API_KEY = '5828559b-6dc4-48c2-9ad8-400909899df3';

// Root route to confirm API is online
app.get('/', (req, res) => {
  res.send('The $BREAD API is online!');
});

// Circulating supply endpoint
app.get('/circulating-supply', async (req, res) => {
  try {
    // Make a POST request to Helius to fetch token supply
    const response = await axios({
      method: 'POST',
      url: `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`,
      headers: { 'Content-Type': 'application/json' },
      data: {
        jsonrpc: '2.0',
        id: '1',
        method: 'getTokenSupply',
        params: [TOKEN_MINT],
      },
    });

    // Extract the readable UI amount from the response
    const supply = response.data.result?.value?.uiAmount || 0;

    // Return the circulating supply as JSON
    res.json({ circulatingSupply: supply });
  } catch (error) {
    console.error('Error fetching supply:', error.message);
    res.status(500).json({ error: 'Failed to fetch circulating supply' });
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});