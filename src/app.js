import express from 'express'
import { accounts } from './accounts.js'

const app = express()
const port = 3000

const account = accounts('accounts/AccountHistory.csv');
await account.init();
  
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/data', (req, res) => {
  res.send(`${account.getData()}`);
})

app.get('/queries/totalCredit', (req, res) => {
  res.send(`${account.getTotalCredit()}`);
})

app.get('/queries/totalDebit', (req, res) => {
  res.send(`${account.getTotalDebit()}`);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
