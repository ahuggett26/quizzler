export function numberFormat(num: number): string {
  if (num < 1000) return `${num}`;
  if (num < 1000000) return `${setPrecision(num / 1000)}K`;
  if (num < 1000000000) return `${setPrecision(num / 1000000)}M`;
  return `${setPrecision(num / 1000000000)}B`;
}

function setPrecision(num: number) {
  let numWithPrecision = num.toPrecision(3);
  while (numWithPrecision.includes(".")) {
    if (numWithPrecision.endsWith("0") || numWithPrecision.endsWith("0")) {
      numWithPrecision = numWithPrecision.substring(
        0,
        numWithPrecision.length - 1,
      );
    } else {
      return numWithPrecision;
    }
  }
  return numWithPrecision;
}
