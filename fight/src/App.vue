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
        player: "MediumPurple",
        enemy: "coral",
        hp: "red",
        mp: "CornflowerBlue",
        pow: "orange",
        AC: "yellow",
        STR: "green",
        bon: "BurlyWood",
        FIR: "red",
        WAT: "aqua",
        POI: "lightgreen",
        EAR: "brown",
        WIN: "grey",
        PHY: "white",
        details: "#666",
        special: "violet",
        spell: "CornflowerBlue",
        item: "yellow",
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
      const actorName = `[player]${this.player.name}[/player]`;

      // get back in the last menu and reset mode and commands
      if (this.mode === "magic") {
        this.mode = "attack";
        this.commands = this.basicCommands;
        this.log.push(`${actorName} closes the spellbook`);
      } else if (this.mode === "special") {
        this.mode = "attack";
        this.log.push(`${actorName} stops preparing the special move`);
        this.commands = this.basicCommands;
      } else if (this.mode === "inventory") {
        this.mode = "attack";
        this.log.push(`${actorName} closes the inventory.`);
        this.commands = this.basicCommands;
      } else if (this.mode === "equip") {
        this.mode = "attack";
        this.log.push(`${actorName} is done checking the equipment.`);
        this.commands = this.basicCommands;
      }
    },
    checkConditions(actor) {
      this[actor].conditions = this[actor].conditions.filter((condition) => condition.duration > 0); // remove expired conditions

      const actorName = `[${actor}]${this[actor].name}[/${actor}]`;

      // loop through all conditions and apply effects
      this[actor].conditions.forEach((condition) => {
        this.log.push(`${actorName} is ${condition.name}`);
        condition.duration--;

        let resist = 0;
        let dmg = 0;
        let dmgTotal = 0;
        // damage-based conditions
        if (condition.damage) {
          condition.damage.forEach((damage) => {
            resist = this[actor].stats.resist[damage.type].base + this[actor].stats.resist[damage.type].bon;
            dmg = damage.value - Math.floor((resist * damage.value) / 100);
            dmgTotal += dmg;
          });
          this[actor].stats.hp.current -= dmgTotal;
          this.log.push(
            `${actorName} takes ${dmgTotal} damage from [${damage.type}]${condition.name}[/${damage.type}]!`
          );
        }
        // stats-based conditions
        if (condition.stats) {
          for (const stat in condition.stats) {
            if (this[actor].stats[stat]) {
              this[actor].stats[stat].current += condition.stats[stat];
              if (condition.stats[stat] > 0) {
                this.log.push(`${actorName} gains ${condition.stats[stat]} ${stat} from ${condition.name}!`);
              } else {
                this.log.push(`${actorName} loses ${condition.stats[stat]} ${stat} from ${condition.name}!`);
              }
            }
          }
        }
        // stunned condition (special case)
        if (condition.stunned) {
          this.log.push(
            `${actorName} is stunned and cannot act ( [${damage.type}]${condition.name}[/${damage.type}])!`
          );
        }
      });
    },
    // cap the current stats to the base value
    normalizeStats(actor) {
      for (const stat in this[actor].stats) {
        if (this[actor].stats[stat].current > this[actor].stats[stat].base) {
          this[actor].stats[stat].current = this[actor].stats[stat].base;
        }
      }
    },
    calcHitAndDmg(actor, actor2) {
      const STR = this[actor].stats.STR.base + this[actor].stats.STR.bon;
      const modifier = Math.floor((STR - 10) / 2);
      const d20 = this.getRandomInt(1, 20); // for hit-chance
      const hit = d20 === 1 ? 1 : d20 + modifier;

      const dmg = this[actor].equipped.reduce((total, item) => {
        let weaponDmg = 0;
        let resist = 0;
        let dmgValue = 0;
        if (item.type === "weapon") {
          // apply all dmg-types from the weapon(s)
          item.damage.forEach((dmg) => {
            if (dmg.type === "PHY") {
              dmgValue = this.getRandomInt(dmg.value[0], dmg.value[1]);
            } else {
              dmgValue = dmg.value;
            }
            weaponDmg += dmgValue;
            resist = this[actor2].stats.resist[dmg.type].base + this[actor2].stats.resist[dmg.type].bon;
            weaponDmg -= Math.floor((dmgValue * resist) / 100);
          });
          return total + weaponDmg;
        }
        return total;
      }, 0);
      return { hit, dmg };
    },
    turn(cmd) {
      // Condition Check
      this.checkConditions("player");
      const isStunnedP = this.player.conditions.some((condition) => condition.stunned);

      // using an item
      if (this.mode === "inventory") {
        this.useItem(cmd, "player");
      }

      // cap the current stats to the base value
      this.normalizeStats("player");

      if (!isStunnedP) {
        // Magic or Special
        if (this.mode === "special" || this.mode === "magic") {
          this.useSpecialOrSpell(cmd, "player", "enemy");
          // Normal Attack
        } else if (cmd === "attack") {
          this.attack("player", "enemy");
          // Defense
        } else if (cmd === "defend") {
          this.defend("player");
        }
      }

      // Enemy Turn
      setTimeout(() => {
        this.checkConditions("enemy");
        const isStunnedE = this.enemy.conditions.some((condition) => condition.stunned);

        // cap the current stats to the base value
        this.normalizeStats("enemy");

        if (!isStunnedE) {
          this.attack("enemy", "player");
        }
        this.log.push("-".repeat(50));
      }, 1000);
    },
    useItem(name, actor) {
      const item = this[actor].items.find((item) => item.command === name);

      if (item) {
        for (const stat in item.use) {
          this[actor].stats[stat].current += item.use[stat];
        }

        if (item.effects) {
          this[actor].conditions.push(...item.effects);
        }

        this.log.push(`[${actor}]${this[actor].name}[/${actor}] uses [item]${item.name}[/item]`);
        item.amount--;

        if (item.amount === 0) {
          this.log.push(`[${actor}]${this[actor].name}[/${actor}] has no more [item]${item.name}[/item] left!`);
        }
      }

      // remove the used item from the inventory
      this[actor].items = this[actor].items.filter((i) => i.amount > 0);

      if (actor === "player") {
        this.commands = this[actor].items.map((item) => `${item.name}`);
        this.commands.push("Back");
      }
    },
    useSpecialOrSpell(name, actor, actor2) {
      const special = this[actor].specials.find((special) => special.command === name); // find special based on command-name
      const spell = this[actor].spellbook.find((spell) => spell.command === name); // find spell based on command-name
      const costType = special ? "pow" : "mp";
      const specialOrSpell = special || spell;

      if (specialOrSpell) {
        if (specialOrSpell.cost > this[actor].stats[costType].current) {
          this.log.push(
            `[${actor}]${this[actor].name}[/${actor}] does not have enough ${costType} to use [special]${specialOrSpell.name}[/special]`
          );
          return;
        }
        if (specialOrSpell === special) {
          this.log.push(
            `[${actor}]${this[actor].name}[/${actor}] uses a special power [special]${specialOrSpell.name}[/special]`
          );
        } else {
          this.log.push(`[${actor}]${this[actor].name}[/${actor}] casts a spell [spell]${specialOrSpell.name}[/spell]`);
        }
      } else {
        return;
      }

      this[actor].stats[costType].current -= specialOrSpell.cost;

      if (specialOrSpell.effects) {
        this[actor2].conditions.push(...specialOrSpell.effects);
      }

      let resist = 0;
      let dmg = 0;
      let dmgTotal = 0;
      if (specialOrSpell.damage) {
        specialOrSpell.damage.forEach((damage) => {
          resist = this[actor2].stats.resist[damage.type].base + this[actor2].stats.resist[damage.type].bon;
          dmg = damage.value - Math.floor((resist * damage.value) / 100);
          dmgTotal += dmg;
        });

        this[actor2].stats.hp.current -= dmgTotal;
        this.log.push(
          `[${actor}]${this[actor].name}[/${actor}] deals ${dmgTotal} damage to [${actor2}]${this[actor2].name}[/${actor2}]`
        );
      }
    },
    attack(actor1, actor2) {
      const { hit: hit, dmg: dmg } = this.calcHitAndDmg(actor1, actor2);

      const actorName1 = `[${actor1}]${this[actor1].name}[/${actor1}]`;
      const actorName2 = `[${actor2}]${this[actor2].name}[/${actor2}]`;

      const AC = this[actor2].stats.AC.base + this[actor2].stats.AC.bon;

      if (hit === 1) {
        const critDmg = Math.ceil(dmg / 2);
        this[actor1].stats.hp.current -= critDmg;
        this.log.push(`${actorName1} critically misses ${actorName2} and injures himself for ${critDmg} dmg!`);
      } else if (hit >= 20) {
        this[actor2].stats.hp.current -= dmg * 2;
        this.log.push(`${actorName1} critically hits ${actorName2}</span> for ${dmg * 2} damage!`);
      } else if (hit >= AC) {
        this[actor2].stats.hp.current -= dmg;
        this.log.push(`${actorName1} hits ${actorName2} for ${dmg} damage!`);
      } else {
        this.log.push(`${actorName1} misses ${actorName2}!`);
      }
    },

    defend(actor) {
      const actorName = `[${actor}]${this[actor].name}[/${actor}]`;
      const tempBon = this[actor].equipped.find((item) => item.type === "shield")?.AC || 0;

      this.log.push(`${actorName} increases AC by ${tempBon} for the next attack.`);
      this[actor].stats.AC.bon += tempBon;
    },
    run() {},
    inventory() {
      const actorName = `[player]${this.player.name}[/player]`;
      this.mode = "inventory";
      this.commands = this.player.items.map((item) => `${item.name}`);
      this.commands.push("Back");
      this.log.push(`${actorName} opens the inventory.`);
    },
    equipment() {
      const actorName = `[player]${this.player.name}[/player]`;
      this.mode = "equip";
      this.commands = this.player.equipped.map((equipped) => `${equipped.name}`);
      this.commands.push("Back");
      this.log.push(`${actorName} takes a look at the equipment`);
    },
    special() {
      const actorName = `[player]${this.player.name}[/player]`;
      this.mode = "special";
      this.commands = this.player.specials.map((special) => special.name);
      this.commands.push("Back");
      this.log.push(`${actorName} prepares a special move.`);
    },
    magic() {
      const actorName = `[player]${this.player.name}[/player]`;
      this.mode = "magic";
      this.commands = this.player.spellbook.map((spell) => spell.name);
      this.commands.push("Back");
      this.log.push(`${actorName} opens the spellbook.`);
    },
    hud(actor) {
      const hudText = [];
      const actorName = `[${actor}]${this[actor].name}[/${actor}]`;

      // name
      hudText.push(`${actorName}`);
      hudText.push("=".repeat(this[actor].name.length * 2));
      for (const stat in this[actor]["stats"]) {
        // resistances
        if (stat === "resist") {
          for (const resist in this[actor]["stats"]["resist"]) {
            const bonResist = this[actor]["stats"]["resist"][resist].bon;
            hudText.push(
              `[${resist}]${resist}:[/${resist}]` +
                ` ${this[actor]["stats"]["resist"][resist].base}` +
                (bonResist ? ` + [bon]${bonResist}[/bon]` : "")
            );
          }
        } else {
          // other stats
          const bonStat = this[actor]["stats"][stat].bon;
          if (stat === "hp" || stat === "mp" || stat === "pow") {
            hudText.push(
              `[${stat}]${stat}:[/${stat}]` +
                ` ${this[actor]["stats"][stat].current}/${this[actor]["stats"][stat].base}` +
                (bonStat ? ` + [bon]'>${bonStat}[/bon]` : "")
            );
          } else {
            hudText.push(
              `[${stat}]${stat}:[/${stat}]` +
                ` ${this[actor]["stats"][stat].base}` +
                (bonStat ? ` + [bon]${bonStat}[/bon]` : "")
            );
          }
        }
      }
      return this.replaceColorTags(hudText).join("\n");
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

      if (this.mode === "equip") {
        return;
      }

      const command = this.commands[key].toLowerCase().replace(/\s+/g, ""); // cut whitespace and convert to lowercase
      if (command === "back") {
        this.back();
        return;
      }
      if (
        command === "attack" ||
        command === "defend" ||
        this.mode === "special" ||
        this.mode === "magic" ||
        this.mode === "inventory"
      ) {
        this.turn(command);
        return;
      }
      this[command]();
    },
    showDetails(command) {
      function showStats(obj) {
        const stats = Object.entries(obj);
        const skipKeys = ["name", "description", "type", "command"];
        let output = "";
        stats.forEach(([key, value]) => {
          if (skipKeys.includes(key)) return;
          if (key === "resist") {
            output += `${key}: `;
            Object.entries(value).forEach(([res, resValue]) => {
              output += `${res}: ${resValue}, `;
            });
            return;
          }
          if (key === "use") {
            Object.entries(value).forEach(([stat, statValue]) => {
              output += `${stat}: ${statValue}, `;
            });
            return;
          }
          if (key === "damage") {
            output += `dmg: ${value
              .map((dmg) => {
                if (dmg.value instanceof Array) {
                  return `${dmg.value[0]}d${dmg.value[1]}`;
                }
                if (dmg.type === "PHY") {
                  return `${dmg.value}`;
                }
                return `+ ${dmg.value} ${dmg.type}`;
              })
              .join(", ")}, `;
            return;
          }
          if (key === "effects") {
            output += `effects: `;
            value.forEach((effect) => {
              output += `${effect.name} `;
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
          return `${commandDetails[command]}` || "";
        case "magic":
          const spellDetails = this.player.spellbook.find((spell) => spell.name.toLowerCase() === command);
          return spellDetails ? `${spellDetails.description} ${showStats(spellDetails)}` : "";
        case "special":
          const specialDetails = this.player.specials.find((special) => special.name.toLowerCase() === command);
          return specialDetails ? `${specialDetails.description} ${showStats(specialDetails)}` : "";
        case "inventory":
          const imtemDetails = this.player.items.find((item) => item.name.toLowerCase() === command);
          return imtemDetails ? `${imtemDetails.description} ${showStats(imtemDetails)}` : "";
        case "equip":
          const equippedDetails = this.player.equipped.find((equipped) => equipped.name.toLowerCase() === command);
          return equippedDetails ? `${equippedDetails.description} ${showStats(equippedDetails)}` : "";
      }
    },
    replaceColorTags(text) {
      return text.map((entry) => {
        let regexp = /\[(.+?)\](.+?)\[\/.+?\]/g;
        return entry.replace(regexp, (match, name, text) => {
          return `<span style="color:${this.colors[name]}">${text}</span>`;
        });
      });
    },
  },
  computed: {
    logEntries() {
      return this.replaceColorTags(this.log).slice(-this.maxLogEntries);
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

    this.log.push(
      `[player]${this.player.name}[/player] starts a fight against [enemy]${this.enemy.name}[/enemy]</span>\n`
    );
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
          <div class="flex">
            <p>{{ command }}</p>
            <p>{{ showDetails(command.toLowerCase()) }}</p>
          </div>
        </li>
      </ol>
    </div>
    <hr />
  </div>
</template>

<style>
* {
  color: white;
  font-family: monospace;
}
body {
  background-color: black;
  font-size: 20px;
}
.flex {
  display: flex;
  justify-content: flex-start;
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

#commandList {
  width: 100%;
}

#commandList li::marker {
  color: yellow;
}

#commandList li:hover {
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.1);
}

#commandList .flex p {
  margin: 0px;
  padding: 0px;
  text-align: left;
}
#commandList .flex p:nth-of-type(1) {
  width: 20%;
}

#commandList .flex p:nth-of-type(2) {
  font-size: 0.8em;
  color: #666;
  padding-left: 10px;
  width: 80%;
}

#log {
  height: 260px;
}
</style>
