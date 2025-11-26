export const formatNumber = (num: number, fractionDigits = 2): string =>
  num.toFixed(fractionDigits).replace(/\.?0+$/, '')
