const sellerCode = process.env.YENEPAY_SELLER_CODE;
const successUrlReturn = `${process.env.PAYMENT_URL}/success`;
const ipnUrlReturn = `${process.env.PAYMENT_URL}/ipnurl`;
const cancelUrlReturn = `${process.env.PAYMENT_URL}/cancel`;
const failureUrlReturn = `${process.env.PAYMENT_URL}/failed`;
const useSandbox = true;
const currency = "USD";
const pdtToken = process.env.YENEPAY_PDT_TOKEN

module.exports = {
  sellerCode,
  successUrlReturn,
  ipnUrlReturn,
  cancelUrlReturn,
  failureUrlReturn,
  useSandbox,
  currency,
  pdtToken
};