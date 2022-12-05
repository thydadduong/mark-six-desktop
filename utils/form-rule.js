const required = (v) => !["", undefined, null].includes(v) || "这是必须字段";
const validEmail = (v) => !v || /.+@.+\..+/.test(v) || "Invalid email address";
const validPhone = (v = "") =>
  !!(v.match(/^\d{10}$/) || v.match(/^\d{9}$/)) || "Invalid phone number.";

const validNumber = (v) => {
  if (v && v.toString().match(/^[0-9]*$/g) && parseInt(v) > 0) return true;
  return "Invalid number";
};
const validCurrency = (v) => v >= 0 || "Invalid currency";

const wholeNumber = (v) => Number.isInteger(+v) >= 0 || "Invalid number";

const bittingAmount = (value) =>
  (value >= 1 && value <= 20000) || "Value must be in range of 1 to 20000";
export const formRules = {
  required: [required],
  email: [validEmail],
  emailRequired: [required, validEmail],
  phone: [validPhone],
  phoneRequired: [required, validPhone],
  validNumber: [validNumber],
  requiredCurrency: [required, validCurrency],
  wholeNumber: [wholeNumber],
  requiredWholeNumber: [required, wholeNumber],
  bittingAmount: [required, bittingAmount],
};
