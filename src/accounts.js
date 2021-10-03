import { createReadStream } from 'fs';
import { resolve as _resolve } from 'path';
import { parse } from 'fast-csv';
import { toUSD } from './utils.js';
import { budgetMapper } from './budgetMapper.js';
import { budgetGroups } from './budgets.js';

export const accounts = (function(accountDataPath) {
  let data = [];

  const _getData = async (accountDataPath) => {
    const rows = [];

    const myPromise = new Promise((resolve, reject) => {
      createReadStream(_resolve(accountDataPath))
          .pipe(parse({ignoreEmpty: true, headers: [
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
            credit: data.credit,
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
      console.log("Data initialized...")
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

