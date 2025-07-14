import { equipment } from "./equipment.js";
import { items } from "./items.js";
import { specials } from "./specials.js";
import { spells } from "./spells.js";

export const player = {
  name: "Lord Rick",
  description: "A brave warrior with a strong will and a heart of gold.",
  identified: true,
  conditions: [
    /* { name: "poisoned", duration: 3, stunned: false, damage: [{ type: "POI", value: 5 }] },
    { name: "iced", duration: 5, stunned: true, damage: [{ type: "WAT" }] },
    { name: "healing", duration: 5, stunned: false, stats: { hp: 5 } },*/
  ],
  stats: {
    hp: { base: 100, current: 100, bon: 0 },
    mp: { base: 20, current: 20, bon: 0 },
    pow: { base: 10, current: 10, bon: 0 },
    AC: { base: 5, current: 5, bon: 0 },
    STR: { base: 15, current: 15, bon: 0 },
    DEX: { base: 10, current: 10, bon: 0 },
    INT: { base: 12, current: 12, bon: 0 },
    resist: {
      FIR: { base: 5, current: 5, bon: 0 },
      POI: { base: 0, current: 0, bon: 0 },
      WAT: { base: 0, current: 0, bon: 0 },
      EAR: { base: 0, current: 0, bon: 0 },
      WIN: { base: 0, current: 0, bon: 0 },
      PHY: { base: 0, current: 0, bon: 0 },
    },
  },
  items: [
    items.healingorb,
    items.megapotion,
    items.healingpotion,
    items.potionofwisdom,
    items.manapotion,
    items.powerpotion,
  ],
  equipped: [
    equipment.burningironsword,
    equipment.icyhelmet,
    equipment.leathercap,
    equipment.hotironshield,
    equipment.icyleatherarmor,
  ],
  spellbook: [spells.healingtouch, spells.fireball, spells.icicle, spells.poisoncloud],
  specials: [specials.powerstrike, specials.stamp],
};
