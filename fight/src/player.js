export const player = {
  name: "Lord Rick",
  description: "A brave warrior with a strong will and a heart of gold.",
  identified: true,
  conditions: [
    /*{ name: "poisoned", duration: 3, stunned: false, damage: [{ type: "POI", value: 5 }] },
    { name: "iced", duration: 5, stunned: true, damage: [{ type: "WAT" }] },*/
    //{ name: "healing", duration: 5, stunned: false, stats: { hp: 5 } },
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
      name: "Healing Orb",
      command: "healingorb",
      description: "Restores some health over time",
      amount: 1,
      effects: [{ name: "healing", duration: 5, stunned: false, stats: { hp: 5 } }],
    },
    {
      name: "Mega Potion",
      command: "megapotion",
      description: "Restores health, mana and power.",
      amount: 2,
      use: {
        hp: 10,
        mp: 10,
        pow: 10,
      },
    },
    {
      name: "Heal Potion",
      command: "healpotion",
      description: "Restores some health.",
      amount: 2,
      use: {
        hp: 20,
      },
    },
    {
      name: "Mana Potion",
      command: "manapotion",
      description: "Restores some mana.",
      amount: 1,
      use: {
        mp: 5,
      },
    },
    {
      name: "Power Potion",
      command: "powerpotion",
      description: "Restores some power",
      amount: 1,
      use: {
        pow: 5,
      },
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
      command: "fireball",
      cost: 5,
      damage: [{ type: "FIR", value: 20 }],
      description: "A powerful fire spell that deals damage to the enemy.",
    },
    {
      name: "Icicle",
      command: "icicle",
      cost: 3,
      damage: [{ type: "WAT", value: 12 }],
      description: "A chilling spell that deals ice damage to the enemy.",
      effects: [{ name: "iced", duration: 2, stunned: true, damage: [{ type: "WAT" }] }],
    },
    {
      name: "Poison Cloud",
      command: "poisoncloud",
      cost: 8,
      damage: [{ type: "POI", value: 10 }],
      description: "A poisenous cloud that deals damage over time.",
      effects: [{ name: "poisoned", duration: 5, stunned: false, damage: [{ type: "POI", value: 5 }] }],
    },
  ],
  specials: [
    {
      name: "Power Strike",
      command: "powerstrike",
      cost: 10,
      damage: [{ type: "PHY", value: 25 }],
      description: "A powerful strike that deals extra damage to the enemy.",
    },
    {
      name: "Stamp",
      command: "stamp",
      cost: 15,
      damage: [{ type: "PHY", value: 15 }],
      effects: [{ name: "stunned", duration: 1, stunned: true, damage: [{ type: "PHY" }] }],
      description: "A strong stamp on the ground that stunns your enemy",
    },
  ],
};
