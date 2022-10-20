import type { Temtem } from "../../ts";
import type { RecursiveKeyOf } from "../../ts/recursiveKeyOf";

export enum OperatorType {
  contain = "contain",
  equal = "equal",
  greater = "greater",
  less = "less",
}
export const fields: {
  name: string;
  field: RecursiveKeyOf<Temtem>;
  operator?: OperatorType[];
  comparator?: OperatorType[];
}[] = [
  {
    name: "Name",
    field: "name",
    operator: [OperatorType.contain],
  },
  {
    name: "HP",
    field: "stats.hp",
    operator: [OperatorType.greater, OperatorType.less, OperatorType.equal],
    comparator: [OperatorType.greater, OperatorType.less],
  },
  {
    name: "stamina",
    field: "stats.sta",
    operator: [OperatorType.greater, OperatorType.less, OperatorType.equal],
    comparator: [OperatorType.greater, OperatorType.less],
  },
  {
    name: "Atack",
    field: "stats.atk",
    operator: [OperatorType.greater, OperatorType.less, OperatorType.equal],
    comparator: [OperatorType.greater, OperatorType.less],
  },
  {
    name: "Sup Atack",
    field: "stats.spatk",
    operator: [OperatorType.greater, OperatorType.less, OperatorType.equal],
    comparator: [OperatorType.greater, OperatorType.less],
  },
  {
    name: "Defense",
    field: "stats.def",
    operator: [OperatorType.greater, OperatorType.less, OperatorType.equal],
    comparator: [OperatorType.greater, OperatorType.less],
  },
  {
    name: "Sup Defense",
    field: "stats.spdef",
    operator: [OperatorType.greater, OperatorType.less, OperatorType.equal],
    comparator: [OperatorType.greater, OperatorType.less],
  },
  {
    name: "Speed",
    field: "stats.spd",
    operator: [OperatorType.greater, OperatorType.less, OperatorType.equal],
    comparator: [OperatorType.greater, OperatorType.less],
  },
];
export function comparator(
  operator: OperatorType,
  text1: string | number,
  text2: string | number
) {
  if (!text1 || !text2) return true;
  switch (operator) {
    case OperatorType.contain:
      return new RegExp(text1.toString(), "i").test(text2.toString());
    case OperatorType.greater:
      return Number(text1) > Number(text2);
    case OperatorType.less:
      return Number(text1) < Number(text2);
    case OperatorType.equal:
      return text1 == text2; // no compare type in order to include 2 == "2"
  }
}
