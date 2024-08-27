const formatCurrencyDefault = (amount, currencyCode) => {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  let formatted = formatter.format(Math.abs(amount)).replace(/\s/g, '');
  return formatted;
};
const formatCurrencyWithCode = (amount, currencyCode, isExpense = false) => {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  let formatted = formatter.format(Math.abs(amount)).replace(/\s/g, '');
  return isExpense ? `-${formatted}` : `+${formatted}`;
};

module.exports = {
  formatCurrencyDefault,
  formatCurrencyWithCode,
};
