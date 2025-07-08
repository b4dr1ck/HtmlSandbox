<script>
export default {
  name: "App",
  data() {
    return {
      disabledInput: false,
      mode: "attack",
      log: [],
      basicCommands: ["Attack", "Defend", "Special", "Magic", "Run", "Inventory", "Equipment"],
      commands: [],

      maxLogEntries: 10,
      colors: {
        name: "MediumPurple",
        hp: "red",
        mp: "CornflowerBlue",
        pow: "orange",
        AC: "yellow",
        STR: "green",
        resist: { FIR: "red", ICE: "aqua", POI: "green" },
        details: "#666",
      },
      player: {
        name: "Lord Rick",
        AC: 5,
        hp: 100,
        mp: 20,
        pow: 10,
        STR: 15,
        resist: {
          FIR: 5,
          ICE: 2,
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
            damage: [1, 6],
          },
          {
            name: "Icy Helmet",
            type: "armor",
            description: "An icy helmet that protects your head.",
            AC: 1,
            resist: { ICE: 3 },
          },
          {
            name: "Leather Armor",
            type: "armor",
            description: "Light armor that provides some protection.",
            AC: 3,
          },
        ],
        spellbook: [
          {
            name: "Fireball",
            cost: 5,
            damage: 20,
            description: "A powerful fire spell that deals damage to the enemy.",
          },
          {
            name: "Heal",
            cost: 3,
            heal: 15,
            description: "A spell that heals the player for a small amount.",
          },
        ],
        specials: [
          {
            name: "Power Strike",
            cost: 10,
            damage: 25,
            description: "A powerful strike that deals extra damage to the enemy.",
          },
          {
            name: "Stamp",
            cost: 15,
            damage: 40,
            description: "A strong stamp on the ground that stunns your enemy",
          },
        ],
      },
      enemy: {
        name: "Weird Goblin",
        AC: 5,
        hp: 60,
        mp: 5,
        pow: 5,
        STR: 10,
        resist: { POI: 5, FIR: 1 },
        equipped: [
          {
            name: "Goblin Dagger",
            type: "weapon",
            description: "A small dagger that deals a bit of damage.",
            damage: [1, 4],
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
      },
    };
  },
  methods: {
    getRandomInt(min, max) {
      const minCeiled = Math.ceil(min);
      const maxFloored = Math.floor(max);
      return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
    },
    back() {
      if (this.mode === "magic") {
        this.mode = "attack";
        this.commands = this.basicCommands;
        this.log.push("You close your spellbook.");
      } else if (this.mode === "special") {
        this.mode = "attack";
        this.log.push("You stop preparing your special move.");
        this.commands = this.basicCommands;
      } else if (this.mode === "inventory") {
        this.mode = "attack";
        this.log.push("You close your inventory.");
        this.commands = this.basicCommands;
      } else if (this.mode === "equip") {
        this.mode = "attack";
        this.log.push("You're done checking your equipment.");
        this.commands = this.basicCommands;
      }
    },
    calcHitAndDmg(actor) {
      const hit = this.getRandomInt(1, 20) + Math.floor((this[actor].STR - 10) / 2);
      const dmg = this[actor].equipped.reduce((total, item) => {
        if (item.type === "weapon") {
          const weaponDmg = this.getRandomInt(item.damage[0], item.damage[1]);
          return total + weaponDmg;
        }
        return total;
      }, 0);
      return { hit, dmg };
    },
    enemyAttack() {
      const hit = this.calcHitAndDmg("enemy").hit;
      const dmg = this.calcHitAndDmg("enemy").dmg;
      const color = this.colors.name;

      if (hit >= this.player.AC) {
        this.player.hp -= dmg;
        this.log.push(`The <span style='color:${color}'>${this.enemy.name}</span> hits you for ${dmg} damage!`);
      } else {
        this.log.push(`The <span style='color:${color}'>${this.enemy.name}</span> misses you!`);
      }
    },
    attack() {
      const hit = this.calcHitAndDmg("player").hit;
      const dmg = this.calcHitAndDmg("player").dmg;
      const color = this.colors.name;

      this.log.push("");

      if (hit >= this.enemy.AC) {
        this.enemy.hp -= dmg;
        this.log.push(`You hit the <span style='color:${color}'>${this.enemy.name}</span> for ${dmg} damage! `);
      } else {
        this.log.push(`You missed the <span style='color:${color}'>${this.enemy.name}</span>!`);
      }

      setTimeout(() => {
        this.enemyAttack();
      }, 1000);
    },

    defend() {},
    run() {},
    inventory() {
      this.mode = "inventory";
      this.commands = this.player.items.map((item) => `${item.name}`);
      this.commands.push("Back");
      this.log.push("You open your inventory. Choose an item.");
    },
    equipment() {
      this.mode = "equip";
      this.commands = this.player.equipped.map((equipped) => `${equipped.name}`);
      this.commands.push("Back");
      this.log.push("You take a look at your equipment");
    },
    special() {
      this.mode = "special";
      this.commands = this.player.specials.map((special) => special.name);
      this.commands.push("Back");
      this.log.push("You prepare a special move. Choose a special.");
    },
    magic() {
      this.mode = "magic";
      this.commands = this.player.spellbook.map((spell) => spell.name);
      this.commands.push("Back");
      this.log.push("You open your spellbook. Choose a spell.");
    },

    // apply equipped items to player stats
    applyStats(actor) {
      for (const key in this[actor]) {
        if (key === "name" || key === "equipped" || key === "spellbook" || key === "specials" || key === "items") {
          continue;
        }

        this[actor][key] = this[actor].equipped.reduce((total, item) => {
          if (key === "resist") {
            return Object.entries(total).reduce((acc, [res, value]) => {
              acc[res] = (value || 0) + (item.resist ? item.resist[res] || 0 : 0);
              return acc;
            }, {});
          }
          return total + (item[key] || 0);
        }, this[actor][key]);
      }
    },
    executeCommand(event) {
      const key = parseInt(event.key) - 1;
      if (isNaN(key) || key < 0 || key >= this.commands.length) {
        return;
      }
      const command = this.commands[key].toLowerCase();
      this[command]();
    },
    hud(actor) {
      const hudText = [];
      let colors = this.colors;

      for (const key in this[actor]) {
        if (this[actor].hasOwnProperty(key)) {
          if (key === "equipped" || key === "spellbook" || key === "specials" || key === "items") {
            continue;
          }
          if (key === "name") {
            hudText.push(`<span style='color:${colors[key]}'>${this[actor][key]}</span>`);
            hudText.push("----------------------------------------");
            continue;
          }
          if (key === "resist") {
            const resist = Object.entries(this[actor].resist)
              .map(([res, value]) => `<span style='color:${colors[key][res]}'>${res}: ${value}</span>`)
              .join(", ");
            hudText.push(`RESIST: <span style='color:${colors[key]}'>${resist}</span>`);
            continue;
          }
          hudText.push(`${key.toUpperCase()}: <span style='color:${colors[key]}'>${this[actor][key]}</span>`);
        }
      }
      return hudText.join("\n");
    },
    showDetails(command) {
      function showStats(obj) {
        const stats = Object.entries(obj);
        let output = "";
        stats.forEach(([key, value]) => {
          if (key === "name" || key === "description" || key === "type") return;
          if (key === "resist") {
            output += `resist: `;
            Object.entries(value).forEach(([res, resValue]) => {
              output += `${res}: ${resValue}, `;
            });
            return;
          }
          output += `${key}: ${value}, `;
        });

        return `(${output})`.replace(", )", ")");
      }
      switch (this.mode) {
        case "attack":
          const commandDetails = {
            attack: "Normal attack with your weapon",
            defend: "...",
            special: "Using a special skill",
            magic: "Cast a spell from you spellbook",
            run: "Attempt to flee from a battle",
            inventory: "Open your inventory to use items",
            equipment: "Check your equipped items",
          };
          3;
          return `<span style='color:${this.colors.details};'>${commandDetails[command]}</span>` || "";
        case "magic":
          const spellDetails = this.player.spellbook.find((spell) => spell.name.toLowerCase() === command);
          return spellDetails
            ? `<span style='color:${this.colors.details};'>${spellDetails.description} ${showStats(
                spellDetails
              )}</span>`
            : "";
        case "special":
          const specialDetails = this.player.specials.find((special) => special.name.toLowerCase() === command);
          return specialDetails
            ? `<span style='color:${this.colors.details};'>${specialDetails.description} ${showStats(
                specialDetails
              )}</span>`
            : "";
        case "inventory":
          const imtemDetails = this.player.items.find((item) => item.name.toLowerCase() === command);
          return imtemDetails
            ? `<span style='color:${this.colors.details};'>${imtemDetails.description} ${showStats(
                imtemDetails
              )}</span>`
            : "";
        case "equip":
          const equippedDetails = this.player.equipped.find((equipped) => equipped.name.toLowerCase() === command);
          return equippedDetails
            ? `<span style='color:${this.colors.details};'>${equippedDetails.description} ${showStats(
                equippedDetails
              )}</span>`
            : "";
      }
    },
  },

  computed: {
    logEntries() {
      return this.log.slice(-this.maxLogEntries);
    },
  },

  mounted() {
    this.commands = this.basicCommands;

    // global keyup event listener
    document.addEventListener("keyup", (event) => {
      this.executeCommand(event);
    });

    this.applyStats("player");
    this.applyStats("enemy");

    const color = this.colors.name;
    this.log.push(`You start a fight against a <span style='color:${color};'>${this.enemy.name}</span>`);
    this.log.push("Make your move...");
  },
};
</script>

<template>
  <div id="hud" class="flex">
    <pre v-html="hud('player')" id="player"></pre>
    <pre v-html="hud('enemy')" id="enemy"></pre>
  </div>
  <hr />
  <pre v-html="logEntries.join('\n')" id="log"></pre>
  <hr />
  <div class="flex">
    <ol id="commandList">
      <li v-for="(command, index) in commands" :key="index">
        {{ command }}
      </li>
    </ol>

    <ul id="detailList">
      <li v-html="showDetails(command.toLowerCase())" v-for="(command, index) in commands" :key="index"></li>
    </ul>
  </div>
  <hr />
</template>

<style>
* {
  color: white;
  font-size: 20px;
  font-family: monospace;
}
body {
  background-color: black;
}
.flex {
  display: flex;
  justify-content: space-between;
}

#hud pre {
  width: 100%;
  border: 1px solid white;
  padding: 10px;
}

pre {
  margin: 10px 0px 10px 0px;
  padding: 0px;
}

#commandList li::marker {
  color: yellow;
}

#detailList {
  list-style-type: none;
  padding: 0;
}

#detailList {
  width: 100%;
}

#commandList {
  width: 50%;
}

#log {
  height: 260px;
}
</style>
