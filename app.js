// server.js (Node/Express example)
const express = require('express');
// const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors()); // Allow requests from your frontend

app.get('/api/trades/:id', async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id);
    
    const response = await fetch(`https://my.litefinance.vn/traders/trades?id=${id}`);
    // const traderInfo = await fetch(`https://my.litefinance.vn/traders/${id}`);
    const html = await response.text();
    res.send(html);
  } catch (err) {
    res.status(500).send('Error fetching trades');
  }
});

app.get('/api/traderInfo/:id', async (req, res) => {
    try {
      const id = req.params.id;
      // console.log(id);
      
    //   const response = await fetch(`https://my.litefinance.vn/traders/trades?id=${id}`);
      const response = await fetch(`https://my.litefinance.vn/traders/info?id=${id}`);
      const html = await response.text();
      res.send(html);
    } catch (err) {
      res.status(500).send('Error fetching trades');
    }
  });

app.get('/api/tradingHistory/:id', async (req, res) => {
    try {
      const id = req.params.id;
      // console.log(id);
    //   url : https://my.litefinance.vn/traders/trades-history?id=1264293

    //   const response = await fetch(`https://my.litefinance.vn/traders/trades?id=${id}`);
      const response = await fetch(`https://my.litefinance.vn/traders/trades-history?id=${id}`);
      const html = await response.text();
      res.send(html);
    } catch (err) {
      res.status(500).send('Error fetching trades');
    }
  });

app.listen(5000, () => {
  console.log('Proxy server running on port 5000');
});
