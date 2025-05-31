// server.js
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

const MINT_ADDRESS = 'J8ZhEwucyYBaRiA4thhAzFk1wPvy3C5HB5KYf8Lipump'; // Correct mint address
const RPC_URL = 'https://api.mainnet-beta.solana.com'; // Solana public RPC endpoint

// Burned and locked token values (fixed)
const BURNED_TOKENS = 150_000_000;
const LOCKED_TOKENS = 50_000_000;

app.get('/', (req, res) => {
  res.send('API do $BREAD está online!');
});

app.get('/api/supply', async (req, res) => {
  try {
    const response = await axios.post(
      RPC_URL,
      {
        jsonrpc: '2.0',
        id: 1,
        method: 'getTokenSupply',
        params: [MINT_ADDRESS],
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const supplyInfo = response.data.result?.value;

    if (!supplyInfo) {
      throw new Error('Invalid supply data');
    }

    const totalSupplyRaw = parseInt(supplyInfo.amount);
    const decimals = supplyInfo.decimals;
    const totalSupply = totalSupplyRaw / Math.pow(10, decimals);
    const circulatingSupply = totalSupply - BURNED_TOKENS - LOCKED_TOKENS;

    res.json({
      token: '$BREAD',
      mint_address: MINT_ADDRESS,
      total_supply: totalSupply,
      burned_tokens: BURNED_TOKENS,
      locked_tokens: LOCKED_TOKENS,
      circulating_supply: circulatingSupply,
    });
  } catch (error) {
    console.error('Error fetching supply from Solana:', error.message);
    res.status(500).json({ error: 'Could not fetch supply from Solana' });
  }
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
