const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Token static data
const TOKEN_DATA = {
  token: "$BREAD",
  mint_address: "J8ZhEwucyYBaRiA4thhAzFk1wPvy3C5HB5KYf8Li",
  max_supply: 1000000000,
  burned_tokens: 150000000,
  locked_tokens: 50000000,
};

// Your Helius API key (replace with your real key)
const HELIUS_API_KEY = '5828559b-6dc4-48c2-9ad8-400909899df3';

// Root endpoint
app.get('/', (req, res) => {
  res.send('API do $BREAD is online!');
});

// Supply endpoint - fetches circulating supply from Helius API dynamically
app.get('/api/supply', async (req, res) => {
  try {
    // Call Helius RPC API to get token supply info
    const heliusResponse = await axios.post(
      `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`,
      {
        jsonrpc: "2.0",
        id: "1",
        method: "getTokenSupply",
        params: [TOKEN_DATA.mint_address]
      }
    );

    // Extract circulating supply (uiAmount) from response
    const realCirculating = heliusResponse.data.result?.value?.uiAmount;

    if (realCirculating === undefined) {
      throw new Error('Could not fetch circulating supply from Helius API');
    }

    // Return all supply data including dynamic circulating supply
    res.json({
      token: TOKEN_DATA.token,
      mint_address: TOKEN_DATA.mint_address,
      max_supply: TOKEN_DATA.max_supply,
      burned_tokens: TOKEN_DATA.burned_tokens,
      locked_tokens: TOKEN_DATA.locked_tokens,
      circulating_supply: realCirculating,
    });

  } catch (error) {
    console.error('Error fetching circulating supply:', error.message);

    // Fallback to calculated circulating supply if API call fails
    const fallbackCirculating = TOKEN_DATA.max_supply - TOKEN_DATA.burned_tokens - TOKEN_DATA.locked_tokens;

    res.json({
      token: TOKEN_DATA.token,
      mint_address: TOKEN_DATA.mint_address,
      max_supply: TOKEN_DATA.max_supply,
      burned_tokens: TOKEN_DATA.burned_tokens,
      locked_tokens: TOKEN_DATA.locked_tokens,
      circulating_supply: fallbackCirculating,
      warning: 'Used fallback circulating supply due to API error',
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});