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

      // describe objects in the room if the scenery flag is set
      for (const obj in this.rooms[this.whereAmI].objects) {
        if (!this.rooms[this.whereAmI].objects[obj].scenery) {
          roomDescText += `${this.rooms[this.whereAmI].objects[obj].sceneryDesc}<br>`;
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
      const replaceAliases = (cmd, alias) => {
        let replacedCmd = cmd;
        for (const key in alias) {
          alias[key].forEach((value) => {
            replacedCmd = replacedCmd.replaceAll(value, key);
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

      console.log(`${this.commandObject.verb} ${this.commandObject.nouns} ${this.commandObject.prepos}`);
      this[this.commandObject.verb](this.commandObject.nouns, this.commandObject.prepos);
    },
    getDescription(object) {
      if (object === this.whereAmI) {
        return this.rooms[this.whereAmI].description;
      }

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

<style>

</style>
