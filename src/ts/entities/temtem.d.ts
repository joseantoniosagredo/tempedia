export interface Temtem {
  number: number;
  name: string;
  types?: string[] | null;
  portraitWikiUrl: string;
  lumaPortraitWikiUrl: string;
  wikiUrl: string;
  stats: Stats;
  traits?: string[] | null;
  details: Details;
  techniques?: TechniquesEntity[] | null;
  trivia?: string[] | null;
  evolution: Evolution;
  wikiPortraitUrlLarge: string;
  lumaWikiPortraitUrlLarge: string;
  locations?: LocationsEntity[] | null;
  icon: string;
  lumaIcon: string;
  genderRatio: GenderRatio;
  catchRate: number;
  hatchMins: number;
  tvYields: TvYields;
  gameDescription: string;
  wikiRenderStaticUrl: string;
  wikiRenderAnimatedUrl: string;
  wikiRenderStaticLumaUrl: string;
  wikiRenderAnimatedLumaUrl: string;
  renderStaticImage: string;
  renderStaticLumaImage: string;
  renderAnimatedImage: string;
  renderAnimatedLumaImage: string;
}
export interface Stats {
  hp: number;
  sta: number;
  spd: number;
  atk: number;
  def: number;
  spatk: number;
  spdef: number;
  total: number;
}
export interface Details {
  height: Height;
  weight: Weight;
}
export interface Height {
  cm: number;
  inches: number;
}
export interface Weight {
  kg: number;
  lbs: number;
}
export interface TechniquesEntity {
  name: string;
  source: string;
  levels: number;
}
export interface Evolution {
  evolves: boolean;
}
export interface LocationsEntity {
  location: string;
  place: string;
  note: string;
  island: string;
  frequency: string;
  level: string;
  freetem: Freetem;
}
export interface Freetem {
  minLevel: number;
  maxLevel: number;
  minPansuns: number;
  maxPansuns: number;
}
export interface GenderRatio {
  male: number;
  female: number;
}
export interface TvYields {
  hp: number;
  sta: number;
  spd: number;
  atk: number;
  def: number;
  spatk: number;
  spdef: number;
}
