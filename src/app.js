import express from 'express'
import { accounts } from './accounts.js'

const app = express()
const port = 3000

const account = accounts('accounts/AccountHistory.csv');
await account.init();
  
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
