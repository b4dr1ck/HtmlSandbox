import { equipment } from "./equipment.js";
import { items } from "./items.js";
import { specials } from "./specials.js";
import { spells } from "./spells.js";

export const sewerRat = {
  name: "Sewer Rat",
  description: "A nasty stinky rat covered with swellings and scars",
  identified: true,
  conditions: [],
  stats: {
    hp: { base: 30, current: 30, bon: 0 },
    mp: { base: 0, current: 0, bon: 0 },
    pow: { base: 6, current: 6, bon: 0 },
    AC: { base: 2, current: 2, bon: 0 },
    STR: { base: 8, current: 8, bon: 0 },
    DEX: { base: 5, current: 5, bon: 0 },
    INT: { base: 1, current: 1, bon: 0 },
    resist: {
      FIR: { base: 0, current: 0, bon: 0 },
      POI: { base: 20, current: 20, bon: 0 },
      WAT: { base: 0, current: 0, bon: 0 },
      EAR: { base: 0, current: 0, bon: 0 },
      WIN: { base: 0, current: 0, bon: 0 },
      PHY: { base: 0, current: 0, bon: 0 },
    },
  },
  specials: [specials.bite],
  spellbook: [],
  items: [],
  equipped: [equipment.ratclaw],
};
