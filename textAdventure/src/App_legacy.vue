<script>
import { rooms } from "./rooms";

export default {
  name: "App",
  data() {
    return {
      whereAmI: "room",
      whereWasI: "",
      command: "",
      output: "",
      objectAliases: {
        torch: ["torch", "light", "lantern"],
        wall: ["wall", "walls", "stone wall"],
        door: ["door", "entrance", "exit"],
        book: ["book"],
        table: ["tabel", "desk", "wooden table"],
        ball: ["ball", "rubber ball"],
        stone: ["stone", "flint", "small stone"],
        rock: ["large rock", "boulder", "rock"],
      },
      verbAliases: {
        look: ["look", "see", "view", "examine", "inspect"],
        go: ["go", "walk", "move", "travel", "head"],
        open: ["open", "unlock", "unfasten", "unlatch"],
        close: ["close", "lock", "fasten", "latch"],
        take: ["take", "grab", "collect", "get", "remove", "pick up"],
        drop: ["drop", "discard", "put down"],
        inventory: ["inventory", "items", "bag", "backpack", "pack", "inv"],
      },
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

      for (const obj in this.rooms[this.whereAmI].objects) {
        if (!this.rooms[this.whereAmI].objects[obj].scenery && obj != "objectAliases") {
          roomDescText += `${this.rooms[this.whereAmI].objects[obj].sceneryDesc}<br>`;
        }
      }
      return roomDescText;
    },
    buttonDisabled() {
      return this.command.trim() === "";
    },
    reversedOutput() {
      // Reverse the output for display
      return this.output.split("<br>").reverse().join("<br>");
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
      this.output += `> ${this.command}<br>`;
      const prepositions = /( at | for | to | on )/;
      const verbAdd = /(up|down)/
      const splitCmd = this.command
        .replaceAll(" the ", " ")
        .replaceAll(/\s+/g, " ")
        .replace(prepositions, " ")
        .split(" ");

      let verb = splitCmd[0].toLowerCase();
      let param = splitCmd.slice(1).map((x) => x.toLowerCase());
      this.command = "";

      // special handling for verbs that can have additional parameters
      if (param[0] && param[0].match(verbAdd)) {
        verb = `${verb} ${param[0]}`;
        param = param.slice(1);
      }

      // special handling for directional shortcut-verbs
      if (verb.match(/^(n|north|e|east|s|south|w|west)$/gi)) {
        this.go("", verb);
        return;
      }

      // Check if the verb is valid
      let verbAlias = this.checkAliases(this.verbAliases, verb);
      if (!verbAlias) {
        this.output += `<br>I can not <strong>${verb}</strong>.<br>`;
        return;
      }

      // Execute the command
      this[verbAlias](verbAlias, param);
    },
    checkAliases(aliases, noun) {
      // Check for object aliases
      for (const alias in aliases) {
        if (aliases[alias].includes(noun)) {
          return alias;
        }
      }
    },
    findItem(noun) {
      return this.player.inventory.find((item) => item.name === noun) || false;
    },
    findItemIndex(noun) {
      return this.player.inventory.findIndex((item) => item.name === noun);
    },
    findObjectName(noun) {
      // Check for object aliases
      const aliases = this.objectAliases;
      let alias = this.checkAliases(aliases, noun);

      // If noun is given, check if it exists in the current room
      if (this.rooms[this.whereAmI].objects[alias]) {
        return alias;
        // If not found in the room, check if it's in the inventory
      } else if (this.findItem(alias)) {
        return alias;
      } else {
        // If not found, return false
        return false;
      }
    },
    take(verb, param) {
      // If no parameter is given, do nothing
      if (param.length === 0 || param[0] === "") {
        this.output += `<br>What do you want to <strong>${verb}</strong>?<br>`;
        return;
      }
      // Check if the parameter is a valid object in the room
      const noun = this.findObjectName(param.join(" ").toLowerCase());
      if (!noun) {
        this.output += `<br>You can't see <strong>${param[0]}</strong> to <strong>${verb}</strong>.<br>`;
        return;
      }

      // special behavior if a command.verb is set
      if (noun && this.rooms[this.whereAmI].objects[noun].command[verb]) {
        this.output += `<br>${this.rooms[this.whereAmI].objects[noun].command[verb]()}`;
      }

      // if item can be taken put it in the inventory
      if (this.rooms[this.whereAmI].objects[noun].canTake) {
        this.output += `<br>You <strong>${verb}</strong> the <strong>${noun}</strong>.<br>`;
        this.player.inventory.push(this.rooms[this.whereAmI].objects[noun]);
        // Remove the object from the room
        delete this.rooms[this.whereAmI].objects[noun];
      } else {
        this.output += `<br>You can't <strong>${verb}</strong> the <strong>${noun}</strong>.<br>`;
        return;
      }
    },
    drop(verb, param) {
      // If no parameter is given, do nothing
      if (param.length === 0 || param[0] === "") {
        this.output += `<br>What do you want to <strong>${verb}</strong>?<br>`;
        return;
      }

      // Check if the parameter is a valid item in the inventory
      const itemName = this.findObjectName(param.join(" ").toLowerCase())
        ? this.findObjectName(param.join(" ").toLowerCase())
        : param.join(" ").toLowerCase();
      const itemIndex = this.findItemIndex(itemName);

      if (!itemName || itemIndex === -1) {
        this.output += `<br>You don't have <strong>${itemName}</strong> in your inventory.<br>`;
        return;
      }

      // special behavior if a command.verb is set
      if (itemName && this.player.inventory[itemIndex].command[verb]) {
        this.output += `<br>${this.rooms[this.whereAmI].objects[itemName].command[verb]()}`;
      }

      // Add the item back to the room and remove it from the inventory
      const item = this.player.inventory[itemIndex];
      this.rooms[this.whereAmI].objects[item.name] = item;
      this.output += `<br>You <strong>${verb}</strong> the <strong>${item.name}</strong><br>`;
      this.player.inventory.splice(itemIndex, 1);
    },
    inventory() {
      // If the player has no items in their inventory, inform them
      if (this.player.inventory.length === 0) {
        this.output += "<br>Your <strong>inventory</strong> is empty.<br>";
        return;
      }

      // List all items in the player's inventory
      this.output += "<br>Your <strong>inventory</strong> contains:<br>";
      this.player.inventory.forEach((item) => {
        this.output += `<strong>- ${item.name}</strong><br>`;
      });
    },
    open(verb, param) {
      // If no parameter is given, do nothing
      if (param.length === 0 || param[0] === "") {
        this.output += `<br>What do you want to <strong>${verb}</strong>?<br>`;
        return;
      }

      // Check if the parameter is a valid object in the room
      const noun = this.findObjectName(param.join(" ").toLowerCase());
      if (!noun) {
        this.output += `<br>You can't <strong>${verb}</strong> <strong>${param[0]}</strong>.<br>`;
        return;
      }

      // special behavior if a command.verb is set
      if (noun && this.rooms[this.whereAmI].objects[noun].command[verb]) {
        this.output += `<br>${this.rooms[this.whereAmI].objects[noun].command[verb]()}`;
      }

      // Check if the object can be opened
      const object = this.rooms[this.whereAmI].objects[noun];
      if (!object.hasOwnProperty("open")) {
        this.output += `<br>You can't <strong>${verb}</strong> the <strong>${noun}</strong>.<br>`;
        return;
      }

      // If the object is locked, inform the player and return
      if (object.locked) {
        this.output += `<br>The <strong>${noun}</strong> is locked. You need a key to open it.<br>`;
        return;
      }

      // toggle the open state of the object
      if (!object.open) {
        if (verb === "open") {
          object.open = true;
          this.output += `<br>You <strong>${verb}</strong> the <strong>${noun}</strong>.<br>`;
          return;
        } else {
          this.output += `<br>The <strong>${noun}</strong> is already closed.<br>`;
          return;
        }
      } else {
        if (verb === "open") {
          this.output += `<br>The <strong>${noun}</strong> is already open.<br>`;
          return;
        } else {
          object.open = false;
          this.output += `<br>You <strong>${verb}</strong> the <strong>${noun}</strong>.<br>`;
        }
        return;
      }
    },
    close(verb, param) {
      // If no parameter is given, do nothing
      if (param.length === 0 || param[0] === "") {
        this.output += `<br>What do you want to <strong>${verb}</strong>?<br>`;
        return;
      }

      this.open(verb, param); // Reuse the open method to close
    },
    go(verb, param) {
      // If no parameter is given, do nothing
      if (param.length === 0 || param[0] === "") {
        this.output += `<br>Where do you want to <strong>${verb}</strong>?<br>`;
        return;
      }

      // Check if the parameter is a valid exit
      const direction = param[0]
        .replace(/^[nN]$/, "north")
        .replace(/^[sS]$/, "south")
        .replace(/^[eE]$/, "east")
        .replace(/^[wW]$/, "west")
        .toLowerCase();
      const exits = this.rooms[this.whereAmI].exit;

      if (exits && exits[direction]) {
        if (this.rooms[this.whereAmI].objects[exits[direction].handicap]) {
          if (!this.rooms[this.whereAmI].objects[exits[direction].handicap].open) {
            this.output += `<br>The <strong>${exits[direction].handicap}</strong> is closed.<br>`;
            return;
          }
        }
        // set whereAmI to the new room
        this.whereAmI = exits[direction].target;

        // Ensure the door is open after going through it
        if (
          Object.keys(this.rooms[this.whereAmI].objects).length > 0 &&
          this.rooms[this.whereAmI].objects[exits[direction].handicap]
        ) {
          this.rooms[this.whereAmI].objects[exits[direction].handicap].open = true;
        }

        this.output += `<br>You go <strong>${direction}</strong> to the <strong>${
          this.rooms[this.whereAmI].name
        }</strong>.<br>`;
      } else {
        this.output += `<br>You can't go <strong>${direction}</strong> from here.<br>`;
      }
    },
    look(verb, param) {
      let noun = param.join(" ").toLowerCase();
      // If no parameter is given, look around the room
      if (((!noun || noun.match(/^(around)$/)) && param.length === 0) || param[0] === "") {
        this.output += `<br>${this.rooms[this.whereAmI].description}<br>`;
        return;
      }

      // If noun is the room itself, describe the room
      if (noun === this.whereAmI) {
        this.output += `<br>${this.rooms[this.whereAmI].description}<br>`;
        return;
      }

      // If the noun is an object in the room, describe it
      const foundObject = this.findObjectName(noun);

      if (foundObject) {
        // check the room for the object
        if (this.rooms[this.whereAmI].objects[foundObject]) {
          // special behavior if a command.verb is set
          if (this.rooms[this.whereAmI].objects[foundObject].command[verb]) {
            this.output += `<br>${this.rooms[this.whereAmI].objects[noun].command[verb]()}`;
          }
          const lookOutput = this.rooms[this.whereAmI].objects[foundObject].description;
          this.output += `<br>${lookOutput}<br>`;
          // check your inventory
        } else if (this.findItem(foundObject)) {
          const lookOutput = this.findItem(foundObject).description;
          this.output += `<br>You open your <strong>inventory</strong> and look at the <strong>${foundObject}</strong>...`;
          this.output += `<br>${lookOutput}<br>`;
        } else {
          this.output += `<br>You can't see <strong>${noun}</strong> here.<br>`;
        }
      } else {
        //.. otherwise, say a generic message
        this.output += "<br>You see nothing special.<br>";
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
    <p v-html="reversedOutput"></p>
  </div>
</template>

<style>


</style>
