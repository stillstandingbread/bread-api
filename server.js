const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

const HELIUS_API_KEY = process.env.HELIUS_API_KEY || '2058d67f-943a-4138-beb0-86eef9a78d38';
const MINT_ADDRESS = 'J8ZhEwucyYBaRiA4thhAzFk1wPvy3C5HB5KYf8Li';

app.get('/', (req, res) => {
  res.send('API do $BREAD está online!');
});

app.get('/api/supply', async (req, res) => {
  try {
    const response = await axios.post(
      `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`,
      {
        jsonrpc: "2.0",
        id: 1,
        method: "getTokenSupply",
        params: [MINT_ADDRESS]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const supplyInfo = response.data.result;
    if (!supplyInfo) throw new Error('No supply data returned');

    const decimals = supplyInfo.decimals || 0;
    const rawSupply = supplyInfo.amount || "0";
    const totalSupply = Number(rawSupply) / (10 ** decimals);

    const burnedTokens = 150000000;
    const lockedTokens = 50000000;
    const circulatingSupply = totalSupply - burnedTokens - lockedTokens;

    res.json({
      token: "$BREAD",
      mint_address: MINT_ADDRESS,
      total_supply: totalSupply,
      burned_tokens: burnedTokens,
      locked_tokens: lockedTokens,
      circulating_supply: circulatingSupply,
      decimals: decimals
    });
  } catch (error) {
    console.error("Error fetching supply from Helius JSON-RPC:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Could not fetch supply from Helius API" });
  }
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
