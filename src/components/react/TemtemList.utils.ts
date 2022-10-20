import type { Temtem } from "../../ts";
import type { RecursiveKeyOf } from "../../ts/recursiveKeyOf";
import { getFieldFromString } from "../../utils/objectUtils";
import { isNumber } from "../../utils/validationUtils";
import type { Operation } from "./QueryInputs";

export enum LogicOperator {
  contain = "contain",
  equal = "equal",
  greater = "greater",
  less = "less",
}
export enum MathOperator {
  sum = "sum",
  minus = "minus",
  mult = "mult",
  div = "div",
}
export type OperatorType = LogicOperator | MathOperator;
export const fields: {
  name: string;
  field: RecursiveKeyOf<Temtem>;
  returnType: "string" | "number";
  filter?: OperatorType[];
  sort?: OperatorType[];
}[] = [
  {
    name: "Name",
    field: "name",
    returnType: "string",
    filter: [LogicOperator.contain],
  },
  {
    name: "HP",
    field: "stats.hp",
    returnType: "number",
    filter: [LogicOperator.greater, LogicOperator.less, LogicOperator.equal],
    sort: [
      LogicOperator.greater,
      LogicOperator.less,
      MathOperator.sum,
      MathOperator.div,
      MathOperator.minus,
      MathOperator.mult,
    ],
  },
];

export function isMathOperator(
  operator: OperatorType
): operator is MathOperator {
  return Object.values(MathOperator).includes(operator as any);
}

const numberFields: RecursiveKeyOf<Temtem>[] = [
  "stats.atk",
  "stats.def",
  "stats.hp",
  "stats.spatk",
  "stats.spd",
  "stats.spdef",
  "stats.sta",
  "stats.total",
];

export function getValueFields(operator: OperatorType) {}

export function comparator(
  operator: OperatorType,
  text1: string | number,
  text2: string | number
) {
  if (!text1 || !text2) return true;
  switch (operator) {
    case LogicOperator.contain:
      return new RegExp(text1.toString(), "i").test(text2.toString());
    case LogicOperator.greater:
      return Number(text1) > Number(text2);
    case LogicOperator.less:
      return Number(text1) < Number(text2);
    case LogicOperator.equal:
      return text1 == text2; // no compare type in order to include 2 == "2"
  }
}
export function math(
  operator: MathOperator,
  value1: string | number,
  value2: string | number
) {
  switch (operator) {
    case MathOperator.sum:
      return Number(value1) + Number(value2);
    case MathOperator.minus:
      return Number(value1) - Number(value2);
    case MathOperator.mult:
      return Number(value1) * Number(value2);
    case MathOperator.div:
      return Number(value1) / Number(value2);
  }
}

export function calculate(temtem: Temtem, operation: Operation): number {
  const getData = (index: 0 | 2) =>
    Array.isArray(operation[index])
      ? calculate(temtem, operation[index] as Operation)
      : isNumber(operation[index] as number | string)
      ? operation[index]
      : getFieldFromString(temtem, operation[index] as any)[0];
  const a = getData(0);
  const b = getData(2);
  return math(operation[1], a, b);
}
