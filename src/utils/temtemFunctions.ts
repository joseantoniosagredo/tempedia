import type { Technique, Temtem } from "../ts";
import type {
  Stats,
  TechniquesEntity,
  TemtemType,
} from "../ts/entities/temtem";

function calculateHP(temtem: Temtem, level = 100, sv = 50, tv?: number) {
  return Math.trunc(
    ((1.5 * temtem.stats.hp +
      sv +
      (tv != null ? tv : temtem.trainStats.hp) / 5) *
      level) /
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
      (sv * (tv != null ? tv : temtem.trainStats.sta) * level) / 30000
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
    ((1.5 * temtem.stats[stat] +
      sv +
      (tv != null ? tv : temtem.trainStats[stat]) / 5) *
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
      calculateStat(temtemAtk, getAtkType(tech), tvsAtk[getAtkType(tech)]),
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

export function getCounterTechniques(
  temtemAtk: Temtem,
  temtemDef: Temtem,
  statsAtk: Partial<Stats> = {},
  statsDef: Partial<Stats> = {},
  delta = 0
) {
  const countTechs = temtemAtk.techniques?.filter(
    (tech) =>
      damageWithStat(temtemAtk, temtemDef, tech, statsAtk, statsDef) + delta >
      calculateStat(temtemDef, "hp", 100, 50, statsDef?.hp)
  );
  return countTechs;
}
export function oneShotTemtems(
  temtem: Temtem,
  temtemList: Temtem[],
  statsAtk: Partial<Stats> = {},
  stats: Partial<Stats> = {},
  delta = 0
) {
  return temtemList
    .map((tem) => {
      const countTechs = getCounterTechniques(
        temtem,
        tem,
        statsAtk,
        stats,
        delta
      );
      return { ...tem, countTechs };
    })
    .filter((e) => e.countTechs && e.countTechs.length > 0);
}

export function counterTemtems(
  temtem: Temtem,
  temtemList: Temtem[],
  stats: Partial<Stats> = {},
  statsAtk: Partial<Stats> = {},
  delta = 0
): (Temtem & { counterTechniques: Technique[] | undefined })[] {
  return temtemList
    .map((tem) => {
      const counterTechniques = getCounterTechniques(
        tem,
        temtem,
        statsAtk,
        stats,
        delta
      );
      return { ...tem, counterTechniques };
    })
    .filter((tem) => tem.counterTechniques && tem.counterTechniques.length > 0);
}
export function isLastEvolution(temtem: Temtem) {
  return (
    !temtem.evolution.evolves ||
    temtem.evolution.evolutionTree?.reduce((max, et) =>
      Math.max(max.stage, et.stage) === max.stage ? max : et
    ).stage === temtem.evolution.stage
  );
}
export function getLinks(
  temtem: Temtem,
  temtemList: Temtem[],
  statsAtk: Partial<Stats> = {},
  stats: Partial<Stats> = {},
  delta = 0
) {
  const temtemsToAtk = oneShotTemtems(
    temtem,
    temtemList,
    statsAtk,
    stats,
    delta
  );
  // const temtemsToDef = counterTemtems(temtem, temtemList, statsAtk, stats);
  const atkLinks = temtemsToAtk.map((tem) => ({
    source: temtem,
    target: tem,
  }));
  // const defLinks = temtemsToDef.map((tem) => ({
  //   atk: tem.number,
  //   def: temtem.number,
  // }));
  return atkLinks;
}

export function getMyWeakTemtemLinks(
  temtem: Temtem,
  temtemList: Temtem[],
  statsAtk: Partial<Stats> = {},
  stats: Partial<Stats> = {},
  delta = 0
) {
  const weakTems = counterTemtems(temtem, temtemList, statsAtk, stats, delta);
  const weakTemtems = weakTems.map((tem) => ({
    source: temtem,
    target: tem,
  }));
  return weakTemtems;
}
