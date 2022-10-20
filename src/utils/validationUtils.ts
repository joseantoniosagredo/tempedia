export function isNumber(a: string | number): a is number {
  return !isNaN(Number(a));
}
