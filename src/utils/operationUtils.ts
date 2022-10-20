export enum MathOperator {
  sum = "sum",
  minus = "minus",
  mult = "mult",
  div = "div",
}
export const operations = [
  MathOperator.div,
  MathOperator.minus,
  MathOperator.mult,
  MathOperator.sum,
];
export enum LogicOperator {
  contain = "contain",
  equal = "equal",
  greater = "greater",
  less = "less",
}

export type OperatorType = LogicOperator | MathOperator;
