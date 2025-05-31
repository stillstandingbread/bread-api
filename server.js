const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

const TOKEN_DATA = {
  token: "$BREAD",
  mint_address: "J8ZhEwucyYBaRiA4thhAzFk1wPvy3C5HB5KYf8Li",
  max_supply: 1000000000,
  burned_tokens: 150000000,
  locked_tokens: 50000000,
};

const HELIUS_API_KEY = '5828559b-6dc4-48c2-9ad8-400909899df3';

app.get('/', (req, res) => {
  res.send('API do $BREAD is online!');
});

app.get('/api/supply', async (req, res) => {
  try {
    const response = await axios.post(
      `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`,
      {
        jsonrpc: "2.0",
        id: "1",
        method: "getTokenSupply",
        params: [TOKEN_DATA.mint_address],
      }
    );

    // uiAmount já tem o número correto com casas decimais
    const circulating = response.data.result?.value?.uiAmount;

    if (circulating === undefined) {
      throw new Error('Could not fetch circulating supply from Helius');
    }

    res.json({
      token: TOKEN_DATA.token,
      mint_address: TOKEN_DATA.mint_address,
      max_supply: TOKEN_DATA.max_supply,
      burned_tokens: TOKEN_DATA.burned_tokens,
      locked_tokens: TOKEN_DATA.locked_tokens,
      circulating_supply: Number(circulating.toFixed(6)) // 6 casas decimais exatas
    });
  } catch (error) {
    console.error('Error fetching circulating supply:', error.message);

    // Fallback: calcule com dados fixos e arredonde para 6 decimais
    const fallbackCirculating = (TOKEN_DATA.max_supply - TOKEN_DATA.burned_tokens - TOKEN_DATA.locked_tokens);

    res.json({
      token: TOKEN_DATA.token,
      mint_address: TOKEN_DATA.mint_address,
      max_supply: TOKEN_DATA.max_supply,
      burned_tokens: TOKEN_DATA.burned_tokens,
      locked_tokens: TOKEN_DATA.locked_tokens,
      circulating_supply: Number(fallbackCirculating.toFixed(6)),
      warning: 'Used fallback circulating supply due to API error',
    });
  }
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});