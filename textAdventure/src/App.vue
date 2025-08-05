<script>
import { rooms } from "./rooms";

export default {
  name: "App",
  data() {
    return {
      whereAmI: "room",
      command: "",
      commandObject: {},
      output: "",
      directionAliases: {
        north: ["north", "n", "up"],
        south: ["south", "s", "down"],
        east: ["east", "e", "right"],
        west: ["west", "w", "left"],
        northeast: ["northeast", "ne"],
        northwest: ["northwest", "nw"],
        southeast: ["southeast", "se"],
        southwest: ["southwest", "sw"],
      },
      verbAliases: {
        look: ["look", "see", "view", "examine", "inspect", "look at"],
        go: ["go", "walk", "move", "travel", "head"],
        open: ["open", "unlock", "unfasten", "unlatch"],
        close: ["close", "lock", "fasten", "latch"],
        take: ["take", "grab", "collect", "get", "remove", "pick up"],
        drop: ["drop", "discard", "put down"],
        inventory: ["inventory", "items", "bag", "backpack", "pack", "inv"],
        put: ["put", "place", "set", "store", "deposit"],
      },
      validPrepositions: ["in", "on", "at", "to", "with", "from", "about", "for"],
      player: {
        inventory: [],
      },
      rooms: rooms,
    };
  },

  mounted() {
    // Add a global keypress event listener
    window.addEventListener("keydown", this.handleKeyPress);
  },

  beforeUnmount() {
    // Remove the global keypress event listener to avoid memory leaks
    window.removeEventListener("keydown", this.handleKeyPress);
  },

  computed: {
    roomDesc() {
      let roomDescText = this.rooms[this.whereAmI].description;
      const objects = this.rooms[this.whereAmI].objects;

      // describe objects in the room if the scenery flag is set
      for (const obj in objects) {
        if (!objects[obj].scenery) {
          roomDescText += `${objects[obj].sceneryDesc}<br>`;
        }
      }
      return roomDescText;
    },
    buttonDisabled() {
      return this.command.trim() === "";
    },
  },

  methods: {
    handleKeyPress(event) {
      if (!this.command) return;

      if (event.key === "Enter") {
        this.parseCommand(event);
      }
    },
    parseCommand(_event) {
      // replace all aliases by the verbs and nouns in the cmd-string
      const replaceAliases = (cmd, aliases) => {
        let replacedCmd = cmd;
        for (const alias in aliases) {
          aliases[alias].forEach((value) => {
            const regex = new RegExp(`\\b${value}\\b`, "g");
            replacedCmd = replacedCmd.replaceAll(regex, alias);
          });
        }
        return replacedCmd;
      };

      // gather all aliases for objects in the room and player inventory
      const getObjectsAliases = () => {
        let objectsAliases = {};

        // the room itself
        objectsAliases[this.whereAmI] = this.rooms[this.whereAmI].alias;

        // check the room's objects
        const objects = this.rooms[this.whereAmI].objects;
        for (const obj in objects) {
          objectsAliases[objects[obj].name] = objects[obj].alias;
        }

        // check the directionAliases
        for (const direction in this.directionAliases) {
          objectsAliases[direction] = this.directionAliases[direction];
        }

        // check the player inventory
        this.player.inventory.forEach((item) => {
          objectsAliases[item.name] = item.alias;
        });

        return objectsAliases;
      };

      this.output += `<br>> ${this.command}<br>`;
      let cmd = this.command.trim().toLowerCase().replaceAll(/\s+/g, " ").replaceAll(" the ", " ");
      this.command = "";
      const objectsAliases = getObjectsAliases();

      cmd = replaceAliases(cmd, this.verbAliases);
      cmd = replaceAliases(cmd, objectsAliases);

      // split the command into nouns, prepositions and verbs
      const cmdSplitted = cmd.split(" ");
      this.commandObject = {
        verb: [],
        nouns: [],
        prepos: [],
      };

      // check if the command is valid by parsing each part of the command
      // the verb on the first position
      const foundVerb = Object.keys(this.verbAliases).find((verb) => verb === cmdSplitted[0]);
      if (foundVerb) this.commandObject.verb.push(`${foundVerb}`);

      // the nouns on the second and fourth position
      const foundNoun = Object.keys(objectsAliases).find((noun) => noun === cmdSplitted[1]);
      const foundNoun2 = Object.keys(objectsAliases).find((noun) => noun === cmdSplitted[3]);
      if (foundNoun) this.commandObject.nouns.push(`${foundNoun}`);
      if (foundNoun2) this.commandObject.nouns.push(`${foundNoun2}`);

      // the prepositions on the third position
      const foundPrepo = this.validPrepositions.find((prep) => prep === cmd[cmdSplitted[2]]);
      if (foundPrepo) this.commandObject.prepos.push(`${foundPrepo}`);

      // if verb is unknown
      if (this.commandObject.verb.length === 0 || this.commandObject.verb.length > 1) {
        this.output += `<br>What do you want to do?<br>`;
        return;
      }

      // debug
      console.log(
        `${this.commandObject.verb}(${this.commandObject.nouns.concat(this.commandObject.prepos).join(",")})`
      );
      console.log(this.commandObject);

      // execute the command
      this[this.commandObject.verb](this.commandObject.verb[0], this.commandObject.nouns, this.commandObject.prepos);
    },
    getExit(direction) {
      // get the exit of the choosen direction
      if (!this.rooms[this.whereAmI].exit || !this.rooms[this.whereAmI].exit[direction]) {
        return null;
      }
      return this.rooms[this.whereAmI].exit[direction];
    },
    getDescription(object) {
      // in the inventory
      const desc = this.player.inventory.find((item) => {
        if (item.name === object) {
          return item.description;
        }
      });
      if (desc) return `(inventory) ${desc.description}`;

      // the room itself
      if (object === this.whereAmI) {
        return this.rooms[this.whereAmI].description;
      }

      // object in the room
      if (this.rooms[this.whereAmI].objects[object]) {
        return this.rooms[this.whereAmI].objects[object].description;
      }
      return null;
    },
    checkNounsLength(verb, nouns) {
      if (nouns.length === 0 || nouns.length > 1) {
        if (verb === "go") {
          this.output += `<br>Where do you want to go?<br>`;
        } else {
          this.output += `<br>What do you want to ${verb}?<br>`;
        }
        return false;
      }
      return true;
    },
    inventory() {
      if (this.player.inventory.length === 0) {
        this.output += `<br>You don't carry anything with you<br>`;
      } else {
        this.output += `<br>Your inventory:<br>`;
        this.player.inventory.forEach((item) => {
          this.output += `* <strong>${item.name}</strong><br>`;
        });
      }
    },
    take(verb, nouns, _preposition) {
      if (!this.checkNounsLength(verb, nouns)) return;

      const object = this.rooms[this.whereAmI].objects[nouns[0]];
      if (object) {
        if (object.command[verb]) {
          this.output += `<br>${object.command[verb]()}`;
        }

        if (object.canTake) {
          this.player.inventory.push(object);
          delete this.rooms[this.whereAmI].objects[nouns[0]];
          this.output += `<br>You take the <strong>${nouns[0]}</strong><br>`;
        } else {
          this.output += `<br>You can't take the <strong>${nouns[0]}</strong>!<br>`;
        }
      } else {
        this.output += `<br>You can't take that!<br>`;
      }
    },
    drop(verb, nouns, _preposition) {
      if (!this.checkNounsLength(verb, nouns)) return;

      const itemIndex = this.player.inventory.findIndex((item) => item.name === nouns[0]);
      if (itemIndex !== -1) {
        const item = this.player.inventory[itemIndex];
        this.rooms[this.whereAmI].objects[item.name] = item; // add the item back to the room
        this.player.inventory.splice(itemIndex, 1); // remove from inventory
        this.output += `<br>You drop the <strong>${nouns[0]}</strong> to the ground.<br>`;
      } else {
        this.output += `<br>You don't have that in your inventory!<br>`;
      }
    },
    look(_verb, nouns, _preposition) {
      if (nouns.length === 0) {
        this.output += `<br>You see nothing special<br>`;
        return;
      } else if (nouns.length === 1 && this.getDescription(nouns[0])) {
        this.output += `<br>${this.getDescription(nouns[0])}<br>`;
      } else if (nouns.length > 1) {
        this.output += "<br>What do you like to look at?<br>";
        return;
      } else {
        this.output += `<br>You see nothing special<br>`;
      }
    },
    go(verb, nouns, _preposition) {
      if (!this.checkNounsLength(verb, nouns)) return;

      const exit = this.getExit(nouns[0]);
      const destination = exit ? exit.target : null;

      if (this.rooms[destination]) {
        const handicap = this.rooms[this.whereAmI].objects[exit.handicap];
        if (handicap && !handicap.open) {
          this.output += `<br>You can't go on. The <strong>${handicap.name}</strong> is blocking your way!<br>`;
          return;
        }
        this.whereAmI = destination;
        if (handicap) {
          this.rooms[this.whereAmI].objects[handicap.name].open = true; // open the handicap after going through
        }
        this.output += `<br>You go to <strong>${this.rooms[destination].name}</strong><br>`;
      } else {
        this.output += `<br>You can't go there!<br>`;
      }
    },
    close(verb, nouns, _preposition) {
      this.open(verb, nouns, _preposition);
    },
    open(verb, nouns, _preposition) {
      if (!this.checkNounsLength(verb, nouns)) return;

      const object = this.rooms[this.whereAmI].objects[nouns[0]];
      if (object && "open" in object) {
        if (!object.locked) {
          if (object.open && verb === "open") {
            this.output += `<br>The <strong>${nouns[0]}</strong> is already open!<br>`;
            return;
          } else if (!object.open && verb === "close") {
            this.output += `<br>The <strong>${nouns[0]}</strong> is already closed!<br>`;
            return;
          } else {
            object.open = !object.open; // toggle open state
          }

          this.output += `<br>You ${verb} the <strong>${nouns[0]}</strong><br>`;
        } else {
          this.output += `<br>The <strong>${nouns[0]}</strong> is locked!<br>`;
        }
      } else {
        this.output += `<br>You can't ${verb} that!<br>`;
        return;
      }
    },
  },
};
</script>

<template>
  <div id="wrapper">
    <h3>{{ rooms[whereAmI].name }}</h3>
    <p v-html="roomDesc"></p>
    <input v-model="command" type="text" />
    <button :disabled="buttonDisabled" @click="parseCommand($event)">Parse</button>
    <p v-html="output"></p>
  </div>
</template>

<style></style>
