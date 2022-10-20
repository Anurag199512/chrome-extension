const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

const port = process.env.port || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.post('/fetch-product-data', async (req, res) => {
  const productName = req.body.productName;
  if (!productName) {
    return res.send('Bad request, missing product name')
  }

  const url = `https://www.amazon.com/s?k=toy&crid=20W68DKSOHNQS&sprefix=${productName}%2Caps%2C271&ref=nb_sb_noss_1`
  const response = await axios.get(url)

  return res.send(response.data)
})

app.listen(port, () => {
  console.log('Server is active on port:', port);
});
