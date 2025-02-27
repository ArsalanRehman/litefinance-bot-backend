const express = require('express')
const cheerio = require('cheerio')
const cors = require('cors')

const app = express()
app.use(cors())

// Utility function to load HTML and return a cheerio instance.
const loadHTML = async (url) => {
  const response = await fetch(url)
  const html = await response.text()
  return cheerio.load(html)
}

// Endpoint to fetch and parse open trades
app.get('/api/trades/:id', async (req, res) => {
  try {
    const { id } = req.params
    const $ = await loadHTML(
      `https://my.litefinance.vn/traders/trades?id=${id}`
    )

    // Parse the trades section using the selectors from the HTML.
    const trades = []
    $('section.deals.deals_trader.js_mobile_deals_content .content_row').each(
      (i, el) => {
        const cols = $(el).find('.content_col')
        if (cols.length < 9) return // skip invalid rows

        const instrument = $(cols[0]).find('.title a').text().trim()
        const type = $(cols[1]).find('.label').text().trim()
        // Only process trades with type "Buy" or "Sell"
        if (type !== 'Buy' && type !== 'Sell') return

        const volume = $(cols[2]).find('.data_value').text().trim()
        const openTime = $(cols[3]).find('.data_value').text().trim()
        const profit = $(cols[8]).find('.data_value').text().trim()
        const openPrice = $(cols[4]).find('.data_value').text().trim()
        const currentPrice = $(cols[5]).find('.data_value').text().trim()
        // console.log(currentPrice)

        trades.push({
          instrument,
          type,
          volume,
          openTime,
          profit,
          openPrice,
          currentPrice,
        })
      }
    )

    res.json(trades)
  } catch (err) {
    console.error(err)
    res.status(500).send('Error fetching trades')
  }
})

// Endpoint to fetch and parse trading history
app.get('/api/tradingHistory/:id', async (req, res) => {
  try {
    const { id } = req.params
    const $ = await loadHTML(
      `https://my.litefinance.vn/traders/trades-history?id=${id}`
    )

    // Assuming the trading history is within an element with id "trades-history"
    const history = []
    $('#trades-history .content_row').each((i, el) => {
      const cols = $(el).find('.content_col')
      if (cols.length < 8) return

      const instrument = $(cols[0]).find('.title a').text().trim()
      const openTime = $(cols[1]).find('.data_value').text().trim()
      const closeTime = $(cols[2]).find('.data_value').text().trim()
      const type = $(cols[3]).find('.label').text().trim()
      const volume = $(cols[4]).find('.data_value').text().trim()
      const entry = $(cols[5]).find('.data_value').text().trim()
      const exit = $(cols[6]).find('.data_value').text().trim()
      const profit = $(cols[7]).find('.data_value').text().trim()

      history.push({
        instrument,
        openTime,
        closeTime,
        type,
        volume,
        entry,
        exit,
        profit,
      })
    })

    res.json(history)
  } catch (err) {
    console.error(err)
    res.status(500).send('Error fetching trading history')
  }
})

// Endpoint to fetch and parse trader info (e.g., personal assets)
app.get('/api/traderInfo/:id', async (req, res) => {
  try {
    const { id } = req.params
    const $ = await loadHTML(`https://my.litefinance.vn/traders/info?id=${id}`)

    let personalAssets = 'Not available'
    $('.trader_detail_resume .panel_inner .data').each((i, el) => {
      const label = $(el).find('.data_label').text()
      if (label.includes('Personal assets')) {
        personalAssets = $(el).find('.data_value').text().trim()
      }
    })

    res.json({ personalAssets })
  } catch (err) {
    console.error(err)
    res.status(500).send('Error fetching trader info')
  }
})

// Endpoint to fetch and parse positions (if needed)
app.get('/api/positions/:id', async (req, res) => {
  try {
    const { id } = req.params
    const $ = await loadHTML(
      `https://my.litefinance.vn/traders/positions?id=${id}`
    )

    // Customize parsing based on the HTML structure for positions.
    const positions = []
    $('.positions_section .position_row').each((i, el) => {
      const cols = $(el).find('.position_col')
      // Assuming a certain number of columns; adjust selectors as necessary.
      if (cols.length < 5) return

      const instrument = $(cols[0]).text().trim()
      const entry = $(cols[1]).text().trim()
      const stopLoss = $(cols[2]).text().trim()
      const takeProfit = $(cols[3]).text().trim()
      const volume = $(cols[4]).text().trim()

      positions.push({ instrument, entry, stopLoss, takeProfit, volume })
    })

    res.json(positions)
  } catch (err) {
    console.error(err)
    res.status(500).send('Error fetching positions')
  }
})

app.listen(5000, () => {
  console.log('Proxy and parsing server running on port 5000')
})
