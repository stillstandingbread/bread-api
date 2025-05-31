const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.send('API do $BREAD está online!');
});
const TOKEN_DATA = {
  token: "$BREAD",
  mint_address: "J8ZhEwucyYBaRiA4thhAzFk1wPvy3C5HB5KYf8Li",
  max_supply: 1000000000,
  burned_tokens: 150000000,
};

TOKEN_DATA.circulating_supply = TOKEN_DATA.max_supply - TOKEN_DATA.burned_tokens;

app.get('/api/supply', (req, res) => {
  res.json({
    token: TOKEN_DATA.token,
    mint_address: TOKEN_DATA.mint_address,
    max_supply: TOKEN_DATA.max_supply,
    total_supply: TOKEN_DATA.max_supply,
    circulating_supply: TOKEN_DATA.circulating_supply
  });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});