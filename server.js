const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;
const MINT_ADDRESS = "J8ZhEwucyYBaRiA4thhAzFk1wPvy3C5HB5KYf8Lipump"; // BREAD token mint address
const LOCKED_TOKENS = 50_000_000; // Tokens locked and not circulating
const LOCKED_UNTIL = "2025-08-19"; // Date until which tokens are locked

// Root route
app.get('/', (req, res) => {
  res.send('BREAD API is online!');
});

// API route to get token supply info
app.get('/api/supply', async (req, res) => {
  try {
    // Fetch total supply from Solana RPC
    const response = await axios.post(
      'https://api.mainnet-beta.solana.com',
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

    const supplyData = response.data?.result?.value;
    if (!supplyData) {
      throw new Error("Invalid supply data");
    }

    const totalSupply = parseFloat(supplyData.uiAmountString);
    const circulatingSupply = totalSupply - LOCKED_TOKENS;

    res.json({
      token: "$BREAD",
      mint_address: MINT_ADDRESS,
      total_supply: totalSupply,
      burned_tokens: 1_000_000_000 - totalSupply, // inferred burned amount
      locked_tokens: LOCKED_TOKENS,
      locked_until: LOCKED_UNTIL,
      circulating_supply: circulatingSupply
    });

  } catch (error) {
    console.error("Error fetching supply from Solana:", error.message);
    res.status(500).json({ error: "Could not fetch supply from Solana" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
