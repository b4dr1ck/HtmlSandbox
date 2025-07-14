export const specials = {
  powerstrike: {
    name: "Power Strike",
    command: "powerstrike",
    target: "enemy",
    cost: 10,
    extra: [{ type: "PHY", value: 25 }],
    description: "A powerful strike that deals extra damage to the enemy.",
  },
  stamp: {
    name: "Stamp",
    command: "stamp",
    target: "enemy",
    cost: 10,
    extra: [{ type: "PHY", value: 15 }],
    effects: [{ name: "stunned", duration: 1, stunned: true, damage: [{ type: "PHY" }] }],
    description: "A strong stamp on the ground that stunns your enemy",
  },
  goblinbite: {
    name: "Goblin Bite",
    command: "goblinbite",
    target: "player",
    cost: 3,
    extra: [{ type: "PHY", value: 10 }],
    description: "A nasty goblin bite that makes you sick.",
    effects: [{ name: "poisoned", duration: 2, stunned: false, damage: [{ type: "POI", value: 5 }] }],
  },
};
