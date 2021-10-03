export const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const toUSD = (value) => {
  return formatter.format(value);
};
