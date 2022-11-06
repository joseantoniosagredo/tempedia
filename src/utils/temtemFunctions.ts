import type { Temtem } from "../ts";
import type { Stats } from "../ts/entities/temtem";

function calculateHP(temtem: Temtem, level = 100, sv = 50) {
  return Math.trunc(
    ((1.5 * temtem.stats.hp + sv + temtem.trainStats.hp / 5) * level) / 80 +
      (sv * temtem.stats.hp * level) / 20000 +
      level +
      15
  );
}
function calculateSTA(temtem: Temtem, level = 100, sv = 50) {
  return Math.trunc(
    temtem.stats.sta / 4 +
      Math.pow(level, 0.35) * 6 +
      (sv * temtem.stats.sta * level) / 20000 +
      (sv * temtem.trainStats.sta * level) / 30000
  );
}
function calculateOther(
  temtem: Temtem,
  stat: keyof Stats,
  level = 100,
  sv = 50
) {
  return Math.trunc(
    ((1.5 * temtem.stats[stat] + sv + temtem.trainStats[stat] / 5) * level) /
      80 +
      (sv * temtem.stats[stat] * level) / 20000 +
      10
  );
}
export function calculateStat(
  temtem: Temtem,
  stat: keyof Stats,
  level = 100,
  sv = 50
) {
  switch (stat) {
    case "hp":
      return calculateHP(temtem, level, sv);
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
