import { equipment } from "./equipment.js";
import { items } from "./items.js";
import { specials } from "./specials.js";
import { spells } from "./spells.js";

export const goblin = {
  name: "Goblin",
  description: "A small, green goblin with a nasty bite and a penchant for poison.",
  identified: true,
  conditions: [],
  stats: {
    hp: { base: 10, current: 10, bon: 0 },
    mp: { base: 20, current: 20, bon: 0 },
    pow: { base: 5, current: 5, bon: 0 },
    AC: { base: 5, current: 5, bon: 0 },
    STR: { base: 12, current: 12, bon: 0 },
    DEX: { base: 10, current: 10, bon: 0 },
    INT: { base: 8, current: 8, bon: 0 },
    resist: {
      FIR: { base: 5, current: 5, bon: 0 },
      POI: { base: 5, current: 5, bon: 0 },
      WAT: { base: 0, current: 0, bon: 0 },
      EAR: { base: 0, current: 0, bon: 0 },
      WIN: { base: 0, current: 0, bon: 0 },
      PHY: { base: 0, current: 0, bon: 0 },
    },
  },
  specials: [specials.powerstrike],
  spellbook: [],
  items: [items.healingpotion, items.healingpotion, items.bomb],
  equipped: [equipment.goblindagger, equipment.goblindshield, equipment.toxicgoblinhelmet],
};
