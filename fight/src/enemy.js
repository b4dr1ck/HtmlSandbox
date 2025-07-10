export const enemy = {
  name: "Weird Goblin",
  conditions: [
    /*{ name: "poisoned", duration: 3, stunned: false, damage: [{ type: "POI", value: 5 }] }*/
  ],
  stats: {
    hp: { base: 80, current: 80, bon: 0 },
    mp: { base: 10, current: 10, bon: 0 },
    pow: { base: 5, current: 5, bon: 0 },
    AC: { base: 5, current: 5, bon: 0 },
    STR: { base: 12, current: 12, bon: 0 },
    resist: {
      FIR: { base: 5, current: 5, bon: 0 },
      POI: { base: 5, current: 5, bon: 0 },
      WAT: { base: 0, current: 0, bon: 0 },
      EAR: { base: 0, current: 0, bon: 0 },
      WIN: { base: 0, current: 0, bon: 0 },
      PHY: { base: 0, current: 0, bon: 0 },
    },
  },
  equipped: [
    {
      name: "Goblin Dagger",
      type: "weapon",
      description: "A small dagger that deals a bit of damage.",
      damage: [{ value: [1, 4], type: "PHY" }],
    },
    {
      name: "Goblin Shield",
      type: "armor",
      description: "A small shield that provides some protection.",
      AC: 2,
    },
    {
      name: "Toxic Goblin Helmet",
      type: "armor",
      description: "A small helmet that protects you with poison resistance.",
      resist: { POI: 2 },
    },
  ],
};
