const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

const accounts = (function(accountDataPath) {
  const init = (accountDataPath) => {
    return fs.createReadStream(path.resolve(accountDataPath))
        .pipe(csv.parse({ignoreEmpty: true, headers: [
          'accountNumber',
          'postDate',
          'check',
          'description',
          'debit',
          'credit',
          'status',
          'balance',
          'classification',
        ]}))
        .transform((data) => ({
          accountNumber: data.accountNumber,
          post: data.postDate,
          check: data.check,
          description: data.description,
          debit: data.debit,
          credt: data.credit,
          status: data.status,
          balance: data.balance,
          classification: data.classification,
        }))
        .on('error', (error) => console.error(error))
        .on('data', (row) => console.log(row))
        .on('end', (rowCount) => console.log(`Parsed ${rowCount} rows`));
  };

  const data = init(accountDataPath);

  return {
    getAccounts: () => {
      return data;
    },
  };
});

console.log(accounts(`./accounts/AccountHistory.csv`).getAccounts());
