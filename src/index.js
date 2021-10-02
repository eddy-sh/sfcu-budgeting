const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

const accounts = (function(accountDataPath) {
  let data = [];

  const _getData = async (accountDataPath) => {
    const rows = [];

    const myPromise = new Promise((resolve, reject) => {
      fs.createReadStream(path.resolve(accountDataPath))
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
          .on('error', (error) => reject(error))
          .on('data', (row) => rows.push(row))
          .on('end', () => {
            return resolve(rows);
          });
    });

    await myPromise.then((res) => {
      data = res;
    }, (error) => {
      console.log(error);
    });
  };

  return {
    init: async () => {
      await _getData(accountDataPath);
    },

    getData: () => {
      return data;
    },

    getTotalDebit: () => {
      let amount = 0.0;
      data.forEach((tx) => {
        if (parseFloat(tx.debit)) {
          amount += parseFloat(tx.debit);
        }
      });
      return amount;
    },

    getTotalCredit: () => {
      let amount = 0.0;
      data.forEach((tx) => {
        if (parseFloat(tx.credit)) {
          amount += parseFloat(tx.credit);
        }
      });
      return amount;
    },
  };
});

const main = async () => {
  const account = accounts('accounts/AccountHistory.csv');
  await account.init();

  console.log(`Debit: ${account.getTotalDebit()}`);
  console.log(`Credit: ${account.getTotalCredit()}`);
};

main();
