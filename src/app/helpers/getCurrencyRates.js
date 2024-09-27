const toTypes = [
  "INR",
  "USD",
  "CAD",
  "GBP",
  "AED,",
  "SGD",
  "EUR",
  "MYR",
  "PHP",
  "BHD",
  "KWD",
  "OMR",
  "QAR",
  "SAR",
  "AUD",
  "JPY",
  "CNY",
];
const symbols = toTypes.join("%2C");

// Get currency rates from openexchangerates.org
export const getCurrencyRatesFromOpenExchangeRates = async ({
  base = "USD",
}) => {
  /*
   * More accurate but only 1000 reqs/month is free
   */

  const url = "https://openexchangerates.org/api/latest.json";
  const appId = "2571dd168a5d46a18f031123914e8c76";
  const options = { method: "GET", headers: { accept: "application/json" } };
  try {
    const response = await fetch(
      `${url}?app_id=${appId}&base=${base}&symbols=${symbols}&prettyprint=false&show_alternative=false`,
      options
    );
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error(error);
  }
};

// Get currency rates from exchangerate.host
export const getCurrencyRates = async ({
  base = "USD",
}) => {
  /*
   * A bit less accurate from 2nd decimal place but free and unlimited
   */

  try {
    const url = "https://api.exchangerate.host/latest";
    const response = await fetch(`${url}?base=${base}&symbols=${symbols}`);
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error(error);
  }
};
