const express = require('express');
const { Connection, PublicKey } = require('@solana/web3.js');

const app = express();
const PORT = process.env.PORT || 3000;

const MINT_ADDRESS = 'J8ZhEwucyYBaRiA4thhAzFk1wPvy3C5HB5KYf8Li';
const connection = new Connection('https://api.mainnet-beta.solana.com');

const BURNED_TOKENS = 150000000; // burned tokens (fixed)
const LOCKED_TOKENS = 50000000;  // locked tokens (fixed)

app.get('/', (req, res) => {
  res.send('API do $BREAD está online!');
});

app.get('/api/supply', async (req, res) => {
  try {
    const mintPubkey = new PublicKey(MINT_ADDRESS);
    const tokenSupplyResponse = await connection.getTokenSupply(mintPubkey);

    // Raw supply amount (string), decimals, uiAmount
    const { amount, decimals, uiAmount } = tokenSupplyResponse.value;

    // Calculate circulating supply
    // amount is string representing total supply in smallest units (like lamports)
    // uiAmount is amount divided by 10^decimals (human readable)
    const totalSupply = uiAmount;

    // Subtract burned and locked tokens
    const circulatingSupply = totalSupply - BURNED_TOKENS - LOCKED_TOKENS;

    res.json({
      token: '$BREAD',
      mint_address: MINT_ADDRESS,
      decimals,
      total_supply: totalSupply,
      burned_tokens: BURNED_TOKENS,
      locked_tokens: LOCKED_TOKENS,
      circulating_supply: circulatingSupply
    });

  } catch (error) {
    console.error('Error fetching supply from Solana:', error);
    res.status(500).json({ error: 'Could not fetch supply from Solana' });
  }
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
