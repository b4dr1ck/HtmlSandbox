<script>
import { player } from "./player.js";
import { enemy } from "./enemy.js";

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
        bon: "BurlyWood",
        resist: { FIR: "red", WAT: "aqua", POI: "lightgreen", EAR: "brown", WIN: "grey" },
        details: "#666",
      },
      player: player,
      enemy: enemy,
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
      const STR = this[actor].stats.STR.base + this[actor].stats.STR.bon;
      const hit = this.getRandomInt(1, 20) + Math.floor((STR - 10) / 2);

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
      const AC = this.player.stats.AC.base + this.player.stats.AC.bon;
      if (hit >= AC) {
        this.player.stats.hp.current -= dmg;
        this.log.push(`The <span style='color:${color}'>${this.enemy.name}</span> hits you for ${dmg} damage!`);
      } else {
        this.log.push(`The <span style='color:${color}'>${this.enemy.name}</span> misses you!`);
      }
    },
    attack() {
      const hit = this.calcHitAndDmg("player").hit;
      const dmg = this.calcHitAndDmg("player").dmg;
      const color = this.colors.name;
      const AC = this.enemy.stats.AC.base + this.enemy.stats.AC.bon;

      if (hit >= AC) {
        this.enemy.stats.hp.current -= dmg;
        this.log.push(`You hit the <span style='color:${color}'>${this.enemy.name}</span> for ${dmg} damage! `);
      } else {
        this.log.push(`You missed the <span style='color:${color}'>${this.enemy.name}</span>!`);
      }

      setTimeout(() => {
        this.enemyAttack();
      }, 1000);
    },

    defend() {

    },
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
    hud(actor) {
      const hudText = [];

      // name
      hudText.push(`<span style='color:${this.colors["name"]}'>${this[actor].name}: </span>`);
      hudText.push("=".repeat(this[actor].name.length * 2));
      for (const stat in this[actor]["stats"]) {
        // resistances
        if (stat === "resist") {
          hudText.push("Resistances: ");
          for (const resist in this[actor]["stats"]["resist"]) {
            hudText.push(
              ` <span style='color:${this.colors.resist[resist]}'>${resist}:</span>` +
                ` ${this[actor]["stats"]["resist"][resist].base}` +
                ` + <span style='color:${this.colors.bon}'>${this[actor]["stats"]["resist"][resist].bon}</span>`
            );
          }
        } else {
          // other stats
          if (stat === "hp" || stat === "mp" || stat === "pow") {
            hudText.push(
              `<span style='color:${this.colors[stat]}'>${stat}:</span>` +
                ` ${this[actor]["stats"][stat].current}/${this[actor]["stats"][stat].base}` +
                ` + <span style='color:${this.colors.bon}'>${this[actor]["stats"][stat].bon}</span>`
            );
          } else {
            hudText.push(
              `<span style='color:${this.colors[stat]}'>${stat}:</span>` +
                `${this[actor]["stats"][stat].base}` +
                ` + <span style='color:${this.colors.bon}'>${this[actor]["stats"][stat].bon}</span>`
            );
          }
        }
      }
      return hudText.join("\n");
    },

    // apply equipped items to player stats
    applyStats(actor) {
      // reset the bonuses
      for (const stat in this[actor]["stats"]) {
        if (stat === "resist") {
          for (const resist in this[actor]["stats"]["resist"]) {
            this[actor]["stats"]["resist"][resist].bon = 0;
          }
        } else {
          this[actor]["stats"][stat].bon = 0;
        }
      }
      // apply bonuses from equipped items
      this[actor]["equipped"].forEach((item) => {
        for (const key in item) {
          if (key === "name" || key === "description" || (key === "type") | (key === "damage")) continue;
          if (key === "resist") {
            for (const resist in item.resist) {
              this[actor]["stats"]["resist"][resist].bon += item.resist[resist];
            }
          } else {
            this[actor]["stats"][key].bon += item[key];
          }
        }
      });
    },
    executeCommand(event) {
      const key = parseInt(event.key) - 1;
      if (isNaN(key) || key < 0 || key >= this.commands.length) {
        return;
      }
      const command = this.commands[key].toLowerCase().replace(/\s+/g, "");
      this[command]();
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
            defend: "Apply Shield AC bonus on next attack",
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
    hudPlayer() {
      return this.hud("player");
    },
    hudEnemy() {
      return this.hud("enemy");
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
    <!--pre v-html="hudPlayer" id="player"></pre-->
    <pre v-html="hudPlayer" id="player"></pre>
    <pre v-html="hudEnemy" id="enemy"></pre>
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
  flex-grow: 3;
}

#commandList {
  flex-grow: 1;
}

#log {
  height: 260px;
}
</style>
