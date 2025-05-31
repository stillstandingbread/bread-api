const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;
const HELIUS_API_KEY = process.env.HELIUS_API_KEY || 'YOUR_HELIUS_API_KEY_HERE';
const MINT_ADDRESS = "J8ZhEwucyYBaRiA4thhAzFk1wPvy3C5HB5KYf8Li";

const MAX_SUPPLY = 1000000000;
const BURNED_TOKENS = 150000000;
const LOCKED_TOKENS = 50000000;

// Fetch circulating supply from Helius API
async function getCirculatingSupply() {
  try {
    const response = await axios.post(
      `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`,
      {
        jsonrpc: "2.0",
        id: 1,
        method: "getTokenSupply",
        params: [
          { mint: MINT_ADDRESS }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data && response.data.result && response.data.result.value) {
      // Return circulating supply as a number with 6 decimal places precision
      return parseFloat(response.data.result.value.uiAmountString);
    } else {
      console.error('Unexpected Helius response format:', response.data);
      return null;
    }
  } catch (error) {
    console.error('Error fetching circulating supply:', error.response?.data || error.message);
    return null;
  }
}

app.get('/', (req, res) => {
  res.send('API do $BREAD está online!');
});

app.get('/api/supply', async (req, res) => {
  const circulatingSupply = await getCirculatingSupply();

  if (circulatingSupply === null) {
    return res.status(500).json({ error: 'Could not fetch circulating supply from Helius API' });
  }

  res.json({
    token: "$BREAD",
    mint_address: MINT_ADDRESS,
    max_supply: MAX_SUPPLY,
    burned_tokens: BURNED_TOKENS,
    locked_tokens: LOCKED_TOKENS,
    circulating_supply: circulatingSupply
  });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);