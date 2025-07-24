export const specials = {
  powerstrike: {
    name: "Power Strike",
    command: "powerstrike",
    targetEnemy: true,
    cost: 10,
    extra: [{ type: "PHY", value: 25 }],
    description: "A powerful strike that deals extra damage to the enemy.",
  },
  stamp: {
    name: "Stamp",
    command: "stamp",
    targetEnemy: true,
    cost: 10,
    extra: [{ type: "PHY", value: 15 }],
    effects: [{ name: "stunned", duration: 1, stunned: true, damage: [{ type: "PHY" }] }],
    description: "A strong stamp on the ground that stunns your enemy",
  },
  bite: {
    name: "Bite",
    command: "bite",
    targetEnemy: true,
    cost: 2,
    extra: [{ type: "PHY", value: 5 }],
    description: "A nasty bite that makes you sick.",
    effects: [{ name: "poisoned", duration: 5, stunned: false, damage: [{ type: "POI", value: 1 }] }],
  },
};
