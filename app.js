require('dotenv').config()
const express = require('express')
const app = express()

const port = process.env.PORT || 3001

const path = require('path')
const cors = require('cors')
const CCXT = require('ccxt')
const { get } = require('http')

//Middleware

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

// if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
  })
}

const ftx = new CCXT.ftx({
  apiKey: process.env.API_KEY,
  secret: process.env.API_SECRET,
  // timeout: 30000,
  headers: {
    'FTX-SUBACCOUNT': 'ElliotWave1k',
  },
})

app.get('/api', async (req, res) => {
  const resp = await ftx.fetchMarkets()

  res.json(resp)
})

app.get('/api/balance', async (req, res) => {
  const resp = await ftx.fetchBalance()
  res.json(resp.free)
})

app.listen(port, () => console.log(`App has started`))
