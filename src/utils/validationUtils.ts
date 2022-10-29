export function isNumber(a: string | number | any): a is number {
  return !isNaN(Number(a));
}
