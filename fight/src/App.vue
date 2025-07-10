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
      lastAttackLog: {
        enemy: [],
        player: [],
      },
      commands: [],
      maxLogEntries: 10,
      colors: {
        name: { player: "MediumPurple", enemy: "coral" },
        hp: "red",
        mp: "CornflowerBlue",
        pow: "orange",
        AC: "yellow",
        STR: "green",
        bon: "BurlyWood",
        resist: { FIR: "red", WAT: "aqua", POI: "lightgreen", EAR: "brown", WIN: "grey", PHY: "white" },
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
    checkConditions(actor) {
      this[actor].conditions = this[actor].conditions.filter((condition) => condition.duration > 0);

      this[actor].conditions.forEach((condition) => {
        if (condition.damage) {
          const resist =
            this[actor].stats.resist[condition.damage[0].type].base +
            this[actor].stats.resist[condition.damage[0].type].bon;
          const dmg = condition.damage[0].value - (resist * condition.damage[0].value) / 100;
          this[actor].stats.hp.current -= dmg;
          condition.duration--;
          this.log.push(`<span style='color:${this.colors.resist.POI}'>${condition.text}</span>`);
          this.log.push(
            `<span style='color:${this.colors.name[actor]}'>${this[actor].name}</span> takes ${dmg} damage from ${condition.name}!`
          );
        }
        if (condition.stunned) {
          condition.duration--;
          this.log.push(
            `<span style='color:${this.colors.name[actor]}'>${this[actor].name}</span> is stunned and cannot act!`
          );
        }
      });
    },
    calcHitAndDmg(actor, actor2) {
      const STR = this[actor].stats.STR.base + this[actor].stats.STR.bon;
      const modifier = Math.floor((STR - 10) / 2);
      const d20 = this.getRandomInt(1, 20);
      const hit = d20 === 1 ? 1 : d20 + modifier;
      let dmgCalcString = "";

      const dmg = this[actor].equipped.reduce((total, item) => {
        let weaponDmg = 0;
        let resist = 0;
        let dmgValue = 0;
        if (item.type === "weapon") {
          // apply all dmg-types from the weapon
          item.damage.forEach((dmg) => {
            if (dmg.type === "PHY") {
              dmgValue = this.getRandomInt(dmg.value[0], dmg.value[1]);
            } else {
              dmgValue = dmg.value;
            }
            weaponDmg += dmgValue;
            resist = this[actor2].stats.resist[dmg.type].base + this[actor2].stats.resist[dmg.type].bon;
            weaponDmg -= Math.floor((dmgValue * resist) / 100);
            dmgCalcString += `(${dmg.type}): ${dmgValue} - (${dmgValue} * ${resist}) / 100); `;
          });
          return total + weaponDmg;
        }
        return total;
      }, 0);
      this.lastAttackLog[actor].push(
        `<span style='color:#666;'>${this[actor].name}...Hit: ${d20} + ${modifier}; Dmg: ${dmgCalcString}</span>`
      );
      return { hit, dmg };
    },
    turn(cmd) {
      this.checkConditions("player");
      const isStunned = this.player.conditions.some((condition) => condition.stunned);

      if (!isStunned) {
        if (cmd === "attack") {
          this.attack("player", "enemy");
        } else if (cmd === "defend") {
          this.defend("player");
        }
      }

      setTimeout(() => {
        this.checkConditions("enemy");
        this.attack("enemy", "player");
      }, 1000);
    },
    attack(actor1, actor2) {
      const { hit: hit, dmg: dmg } = this.calcHitAndDmg(actor1, actor2);

      const color = this.colors.name[actor1];
      const color2 = this.colors.name[actor2];

      const AC = this[actor2].stats.AC.base + this[actor2].stats.AC.bon;

      if (hit === 1) {
        const critDmg = Math.floor(dmg / 2);
        this[actor1].stats.hp.current -= critDmg;
        this.log.push(
          `<span style='color:${color}'>${this[actor1].name}</span> critically missed <span style='color:${color2}'>${this[actor2].name}</span> and hurt yourself for ${critDmg}!`
        );
      } else if (hit >= 20) {
        this[actor2].stats.hp.current -= dmg * 2;
        this.log.push(
          `<span style='color:${color}'>${this[actor1].name}</span> critically hit <span style='color:${color2}'>${
            this[actor2].name
          }</span> for ${dmg * 2} damage!`
        );
      } else if (hit >= AC) {
        this[actor2].stats.hp.current -= dmg;
        this.log.push(
          `<span style='color:${color}'>${this[actor1].name}</span> hit <span style='color:${color2}'>${this[actor2].name}</span> for ${dmg} damage!`
        );
      } else {
        this.log.push(
          `<span style='color:${color}'>${this[actor1].name}</span> missed <span style='color:${color2}'>${this[actor2].name}</span>!`
        );
      }

      this.log.push(this.lastAttackLog[actor1][this.lastAttackLog[actor1].length - 1]);
    },
    defend(actor) {
      const tempBon = this[actor].equipped.find((item) => item.type === "shield")?.AC || 0;
      this.log.push(
        `<span style='color:${this.colors.name[actor]}'>${this[actor].name}</span> braces himself and increasing AC by ${tempBon} for the next attack.`
      );
      this[actor].stats.AC.bon += tempBon;

      setTimeout(() => {
        this.attack("enemy", "player");
        this[actor].stats.AC.bon -= tempBon;
      }, 1000);
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
          for (const resist in this[actor]["stats"]["resist"]) {
            const bonResist = this[actor]["stats"]["resist"][resist].bon;
            hudText.push(
              `<span style='color:${this.colors.resist[resist]}'>${resist}:</span>` +
                ` ${this[actor]["stats"]["resist"][resist].base}` +
                (bonResist ? ` + <span style='color:${this.colors.bon}'>${bonResist}</span>` : "")
            );
          }
        } else {
          // other stats
          const bonStat = this[actor]["stats"][stat].bon;
          if (stat === "hp" || stat === "mp" || stat === "pow") {
            hudText.push(
              `<span style='color:${this.colors[stat]}'>${stat}:</span>` +
                ` ${this[actor]["stats"][stat].current}/${this[actor]["stats"][stat].base}` +
                (bonStat ? ` + <span style='color:${this.colors.bon}'>${bonStat}</span>` : "")
            );
          } else {
            hudText.push(
              `<span style='color:${this.colors[stat]}'>${stat}:</span>` +
                ` ${this[actor]["stats"][stat].base}` +
                (bonStat ? ` + <span style='color:${this.colors.bon}'>${bonStat}</span>` : "")
            );
          }
        }
      }
      return hudText.join("\n");
    },

    // apply equipped items to player stats
    applyBonStats(actor) {
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
          if (item.type === "shield" && key === "AC") continue; // skip shield items for now (only in defend mode)
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
    executeCommand(event, index) {
      let key = parseInt(event.key) - 1;

      if (event.type === "click") {
        key = index;
      }

      if (isNaN(key) || key < 0 || key >= this.commands.length) {
        return;
      }
      const command = this.commands[key].toLowerCase().replace(/\s+/g, "");
      if (command === "attack" || command === "defend") {
        this.turn(command);
        return;
      }
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
          if (key === "damage") {
            output += `dmg: ${value
              .map((dmg) => {
                if (dmg.type === "PHY") {
                  return `${dmg.value[0]}d${dmg.value[1]}`;
                }
                return `+ ${dmg.value} ${dmg.type}`;
              })
              .join(", ")}, `;
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

    this.applyBonStats("player");
    this.applyBonStats("enemy");

    const color = this.colors.name.enemy;
    this.log.push(`You start a fight against a <span style='color:${color};'>${this.enemy.name}</span>`);
    this.log.push("Make your move...");
  },
};
</script>

<template>
  <div>
    <div id="hud" class="flex">
      <pre v-html="hudPlayer" id="player"></pre>
      <pre v-html="hudEnemy" id="enemy"></pre>
    </div>
    <hr />
    <pre v-html="logEntries.join('\n')" id="log"></pre>
    <hr />
    <div class="flex">
      <ol id="commandList">
        <li v-for="(command, index) in commands" :key="index" @click="executeCommand($event, index)">
          {{ command }}
        </li>
      </ol>
      <ul id="detailList">
        <li v-html="showDetails(command.toLowerCase())" v-for="(command, index) in commands" :key="index"></li>
      </ul>
    </div>
    <hr />
  </div>
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

#commandList li:hover {
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.1);
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
