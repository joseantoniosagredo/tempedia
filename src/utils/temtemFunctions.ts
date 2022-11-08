import type { Technique, Temtem } from "../ts";
import type {
  Stats,
  TechniquesEntity,
  TemtemType,
} from "../ts/entities/temtem";

function calculateHP(temtem: Temtem, level = 100, sv = 50, tv?: number) {
  return Math.trunc(
    ((1.5 * temtem.stats.hp + sv + (tv ?? temtem.trainStats.hp) / 5) * level) /
      80 +
      (sv * temtem.stats.hp * level) / 20000 +
      level +
      15
  );
}
function calculateSTA(temtem: Temtem, level = 100, sv = 50, tv?: number) {
  return Math.trunc(
    temtem.stats.sta / 4 +
      Math.pow(level, 0.35) * 6 +
      (sv * temtem.stats.sta * level) / 20000 +
      (sv * (tv ?? temtem.trainStats.sta) * level) / 30000
  );
}
function calculateOther(
  temtem: Temtem,
  stat: keyof Stats,
  level = 100,
  sv = 50,
  tv?: number
) {
  return Math.trunc(
    ((1.5 * temtem.stats[stat] + sv + (tv ?? temtem.trainStats[stat]) / 5) *
      level) /
      80 +
      (sv * temtem.stats[stat] * level) / 20000 +
      10
  );
}
export function calculateStat(
  temtem: Temtem,
  stat: keyof Stats,
  level = 100,
  sv = 50,
  tv?: number
) {
  switch (stat) {
    case "hp":
      return calculateHP(temtem, level, sv, tv);
    case "sta":
      return calculateSTA(temtem, level, sv);
    default:
      return calculateOther(temtem, stat, level, sv);
  }
}
export function damage(
  atk: number,
  def: number,
  techDamage: number,
  level = 100
) {
  return 7 + ((level / 200) * techDamage * atk) / def;
}
export function damageWithStat(
  temtemAtk: Temtem,
  temtemDef: Temtem,
  tech: Technique,
  tvsAtk: Partial<Stats> = {},
  tvsDef: Partial<Stats> = {}
) {
  return (
    damage(
      calculateStat(temtemAtk, getAtkType(tech)),
      calculateStat(temtemDef, getDefType(tech)),
      tech.damage
    ) * getMultiplyArray(tech.type, temtemDef.types)
  );
}
const typesSort: TemtemType[] = [
  "Neutral",
  "Fire",
  "Water",
  "Nature",
  "Electric",
  "Earth",
  "Mental",
  "Wind",
  "Digital",
  "Melee",
  "Crystal",
  "Toxic",
];
const advantages = [
  [1, 1, 1, 1, 1, 1, 0.5, 1, 1, 1, 1, 1],
  [1, 0.5, 0.5, 2, 1, 0.5, 1, 1, 1, 1, 2, 1],
  [1, 2, 0.5, 0.5, 1, 2, 1, 1, 2, 1, 1, 0.5],
  [1, 0.5, 2, 0.5, 1, 2, 1, 1, 1, 1, 1, 0.5],
  [1, 1, 2, 0.5, 0.5, 0.5, 2, 2, 2, 1, 0.5, 1],
  [1, 2, 0.5, 0.5, 2, 1, 1, 0.5, 1, 1, 2, 1],
  [2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0.5, 1],
  [1, 1, 1, 1, 0.5, 2, 1, 0.5, 1, 1, 1, 2],
  [1, 1, 1, 1, 1, 1, 2, 1, 2, 2, 1, 1],
  [1, 1, 1, 1, 1, 2, 0.5, 1, 1, 0.5, 2, 1],
  [1, 0.5, 1, 1, 2, 0.5, 2, 1, 1, 1, 1, 1],
  [1, 1, 2, 2, 1, 0.5, 1, 1, 0.5, 1, 0.5, 0.5],
];

export function getMultiply(type1: TemtemType, type2: TemtemType) {
  const i1 = typesSort.indexOf(type1);
  const i2 = typesSort.indexOf(type2);
  return +advantages[i1][i2];
}
export function getMultiplyArray(type1: TemtemType, types2: TemtemType[]) {
  return types2.reduce((mult, t) => mult * getMultiply(type1, t), 1);
}
function getAtkType(tech: Technique | TechniquesEntity): "atk" | "spatk" {
  return (tech as Technique).class === "Physical" ? "atk" : "spatk";
}
function getDefType(tech: Technique | TechniquesEntity): "def" | "spdef" {
  return (tech as Technique).class === "Physical" ? "def" : "spdef";
}

export function oneShotTemtems(
  temtem: Temtem,
  temtemList: Temtem[],
  statsAtk: Partial<Stats> = {},
  stats: Partial<Stats> = {}
) {
  return temtemList
    .map((tem) => {
      const countTech = temtem.techniques?.find(
        (tech) =>
          damageWithStat(temtem, tem, tech, statsAtk, stats) >
          calculateStat(tem, "hp", 100, 50, stats?.hp)
      );
      return { ...tem, countTech };
    })
    .filter((e) => e.countTech);
}
