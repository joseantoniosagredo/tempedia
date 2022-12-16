import type { TemtemType } from "./temtem";

export interface Technique {
  name: string;
  wikiUrl: string;
  type: TemtemType;
  class: string;
  classIcon: string;
  damage: number;
  staminaCost: number;
  hold: number;
  priority: string;
  priorityIcon: string;
  synergy: string;
  synergyEffects?: SynergyEffectsEntity[] | null;
  targets: string;
  description: string;
}
export interface SynergyEffectsEntity {
  effect: string;
  type: string;
  damage: number;
}
