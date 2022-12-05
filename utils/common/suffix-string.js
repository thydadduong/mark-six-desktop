export const toSuffixString = (numb, _toFixed = 0) => {
  if (numb > Math.pow(10, 7)) {
    return (numb / Math.pow(10, 6)).toFixed(1) + "M+";
  }
  if (numb > Math.pow(10, 4)) {
    return (numb / Math.pow(10, 3)).toFixed(1) + "K+";
  }
  return numb.toFixed(_toFixed) + "";
};