import { $t } from ".";

function localeNumb(numb) {
  return (numb + "")
    .split("")
    .map(n => (/^[0-9]+$/.test(n) ? $t(n) : n))
    .join("");
}

export default (ctx, inject) => {
  inject("localeNumb", localeNumb);
};
