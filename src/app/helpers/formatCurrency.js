// import config from '../config'
import accounting from 'accounting';
import indianNumberFormat from 'indian-number-format';

const currencyFormat = {
  symbol: "₹",
  format: "%v %s",
  decimal: ".",
  thousand: ",",
  precision: 2,
}

export const formatCurrency = value => {
  // return accounting.formatMoney(value, config.currencyFormat);
  // if(Number.isInteger(value)) {
  // 	return indianNumberFormat.formatFixed(value) + ` ${config.currencyFormat.symbol}`;
  // } else {
  return `${currencyFormat.symbol} ` + indianNumberFormat.formatFixed(value, currencyFormat.precision);
  // }
};

// export const formatCurrencyTruncated = value => {
//   // return accounting.formatNumber(value, config.currencyFormat).split(',')[0] + ` ${config.currencyFormat.symbol}`;
//   // return accounting.formatNumber(value, config.currencyFormat).split('.')[0] + ` ${config.currencyFormat.symbol}`;
//   return indianNumberFormat.formatFixed(value, 0) + ` ${config.currencyFormat.symbol}`;
// };

// export const formatCurrencySymbolDisplayInFront = value => {
//   // return accounting.formatNumber(value, config.currencyFormat).split(',')[0] + ` ${config.currencyFormat.symbol}`;
//   // return accounting.formatNumber(value, config.currencyFormat).split('.')[0] + ` ${config.currencyFormat.symbol}`;
//   return `${config.currencyFormat.symbol} ` + indianNumberFormat.formatFixed(value, 0);
// };

// export const formatCurrencyRounded = value => {
//   const roundedValue = parseFloat(accounting.toFixed(value, 0));
//   return formatCurrency(roundedValue);
// };

// export const formatCurrencyRounding = value => {
//   const roundedValue = parseFloat(accounting.toFixed(value, 0));
//   return roundedValue;
// }

// export const formatCurrencyMinusPlus = value => {
//   let newValue;
//   value === 0 ? (newValue = `${config.currencyFormat.symbol} ` + indianNumberFormat.formatFixed(value, config.currencyFormat.precision))
//     : (value > 0 ? (newValue = `${config.currencyFormat.symbol} ` + indianNumberFormat.formatFixed(value, config.currencyFormat.precision))
//       : (newValue = `${config.currencyFormat.symbol} ` + indianNumberFormat.formatFixed(value * -1, config.currencyFormat.precision).toString().replace(/-/gi, '')))
//   return newValue
// }
// export const formatMoneySymbol = (number, code) => {
//   return accounting.formatMoney(number, config.currencyFormats[code].currency)
// };
