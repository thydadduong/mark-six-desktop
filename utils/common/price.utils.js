export function getPrice(price = 0, currency = "") {
  if (typeof price != "number") return currency + "0.00";
  return currency + price.toFixed(2);
}
