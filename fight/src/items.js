export const items = {
  healingorb: {
    name: "Healing Orb",
    command: "healingorb",
    description: "Restores some health over time",
    amount: 1,
    effects: [{ name: "healing", duration: 5, stunned: false, stats: { hp: 5 } }],
  },
  megapotion: {
    name: "Mega Potion",
    command: "megapotion",
    description: "Restores health, mana and power.",
    amount:1,
    use: {
      hp: 10,
      mp: 10,
      pow: 10,
    },
  },
  healingpotion: {
    name: "Healing Potion",
    command: "healingpotion",
    description: "Restores some health.",
    amount: 1,
    use: {
      hp: 20,
    },
  },
  potionofwisdom: {
    name: "Potion of Wisdom",
    command: "potionofwisdom",
    description: "Increases INT for a short duration.",
    amount: 1,
    effects: [{ name: "intelligent", duration: 5, stunned: false, set: true, stats: { INT: 4 } }],
  },
  manapotion: {
    name: "Mana Potion",
    command: "manapotion",
    description: "Restores some mana.",
    amount: 1,
    use: {
      mp: 5,
    },
  },
  powerpotion: {
    name: "Power Potion",
    command: "powerpotion",
    description: "Restores some power",
    amount: 1,
    use: {
      pow: 5,
    },
  },
};
