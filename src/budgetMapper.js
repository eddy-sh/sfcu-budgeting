export const budgetMapper = (accounts, budget) => {
    const data = {}

    accounts.forEach((tx) => {
        let txGroup = lookupItemInBudget(tx.description, budget);
        if (txGroup != undefined) {
            if (txGroup in data) {
                data[txGroup] += tx.debit;
            }
            else {
                data.push({
                    BudgetGroup: txGroup,
                    Amount: tx.debit
                })
            }
        }
    });

    return data;
};

const lookupItemInBudget = (item, budget) => {
    for (const group in budget) {
        budget[group].forEach((budgetItem) => {
            if (item.toLowerCase().includes(budgetItem.toLowerCase())) {
                return group;
            }
        })
    }
}