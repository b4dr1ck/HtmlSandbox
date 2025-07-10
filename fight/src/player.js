export const player = {
  name: "Lord Rick",
  conditions: [
    //{ name: "poisoned", duration: 3, stunned: true, damage: [{ type: "POI", value: 5 }], text: "You are poisened" },
  ],
  stats: {
    hp: { base: 100, current: 100, bon: 0 },
    mp: { base: 20, current: 20, bon: 0 },
    pow: { base: 10, current: 10, bon: 0 },
    AC: { base: 5, current: 5, bon: 0 },
    STR: { base: 15, current: 15, bon: 0 },
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
    {
      name: "Heal Potion",
      description: "Restores 20 HP.",
      amount: 2,
    },
    {
      name: "Mana Potion",
      description: "Restores 5 HP.",
      amount: 1,
    },
  ],
  equipped: [
    {
      name: "Iron Sword",
      type: "weapon",
      description: "A sturdy sword that deals a bit of damage.",
      damage: [
        { value: [1, 6], type: "PHY" },
        { value: 2, type: "FIR" },
      ],
    },
    {
      name: "Icy Helmet",
      type: "armor",
      description: "An icy helmet that protects your head.",
      AC: 1,
      resist: { WAT: 3 },
    },
    {
      name: "Hot Iron Shield",
      type: "shield",
      description: "A sturdy shield that provides extra fire protection.",
      AC: 2,
      resist: { FIR: 1 },
    },
    {
      name: "Icy Leather Armor",
      type: "armor",
      description: "Light armor that provides some protection.",
      AC: 3,
      resist: { WAT: 2 },
    },
  ],
  spellbook: [
    {
      name: "Fireball",
      cost: 5,
      damage: [{ type: "FIR", value: 20 }],
      description: "A powerful fire spell that deals damage to the enemy.",
    },
    {
      name: "Icicle",
      cost: 3,
      damage: [{ type: "ICE", value: 12 }],
      description: "A chilling spell that deals ice damage to the enemy.",
    },
  ],
  specials: [
    {
      name: "Power Strike",
      cost: 10,
      damage: [{ type: "PHY", value: 25 }],
      description: "A powerful strike that deals extra damage to the enemy.",
    },
    {
      name: "Stamp",
      cost: 15,
      damage: [{ type: "PHY", value: 15 }],
      description: "A strong stamp on the ground that stunns your enemy",
    },
  ],
};
