<script>
import { rooms } from "./rooms";

export default {
  name: "App",
  data() {
    return {
      whereAmI: "room",
      whereWasI: "",
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
        look: ["look", "see", "view", "examine", "inspect"],
        go: ["go", "walk", "move", "travel", "head"],
        open: ["open", "unlock", "unfasten", "unlatch"],
        close: ["close", "lock", "fasten", "latch"],
        take: ["take", "grab", "collect", "get", "remove", "pick up"],
        drop: ["drop", "discard"],
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
      let cmd = this.command.trim().toLowerCase();
      this.command = "";
      const objectsAliases = getObjectsAliases();

      cmd = replaceAliases(cmd, this.verbAliases);
      cmd = replaceAliases(cmd, objectsAliases);

      // split the command into nouns, prepositions and verbs
      const cmdSplitted = cmd.replaceAll(/\s+/g, " ").replaceAll(" the ", " ").split(" ");
      this.commandObject = {
        verb: [],
        nouns: [],
        prepos: [],
      };
      // check if the command is valid by parsing each part of the command
      cmdSplitted.forEach((cmd) => {
        const foundNoun = Object.keys(objectsAliases).find((noun) => noun === cmd);
        const foundPrepo = this.validPrepositions.find((prep) => prep === cmd);
        const foundVerb = Object.keys(this.verbAliases).find((verb) => verb === cmd);
        if (foundNoun) {
          this.commandObject.nouns.push(`${foundNoun}`);
        }
        if (foundPrepo) {
          this.commandObject.prepos.push(`${foundPrepo}`);
        }
        if (foundVerb) {
          this.commandObject.verb.push(`${foundVerb}`);
        }
      });

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
      this[this.commandObject.verb](this.commandObject.nouns, this.commandObject.prepos);
    },
    getExit(direction) {
      // get the exit of the choosen direction
      if (!this.rooms[this.whereAmI].exit || !this.rooms[this.whereAmI].exit[direction]) {
        return null;
      }
      return this.rooms[this.whereAmI].exit[direction].target;
    },
    getDescription(object) {
      // in the inventory
      const desc = this.player.inventory.find((item) => {
        if (item.name === object) {
          return item.description;
        }
      });
      if (desc) {
        return `(inventory) ${desc.description}`;
      }

      // the room itself
      if (object === this.whereAmI) {
        return this.rooms[this.whereAmI].description;
      }

      // object in the room
      return this.rooms[this.whereAmI].objects[object].description;
    },
    look(nouns, _preposition) {
      if (nouns.length === 0) {
        this.output += `<br>You see nothing special<br>`;
        return;
      } else if (nouns.length === 1) {
        this.output += `<br>${this.getDescription(nouns[0])}<br>`;
      } else if (nouns.length > 1) {
        this.output += "<br>What do you like to look at?<br>";
        return;
      }
    },
    go(noun, _preposition) {
      if (noun.length === 0 || noun.length > 1) {
        this.output += `<br>Where do you want to go?<br>`;
        return;
      }

      const destination = this.getExit(noun[0]);
      if (this.rooms[destination]) {
        this.whereWasI = this.whereAmI;
        this.whereAmI = destination;
        this.output += `<br>You go to <strong>${this.rooms[destination].name}</strong><br>`;
      } else {
        this.output += `<br>You can't go there!<br>`;
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
