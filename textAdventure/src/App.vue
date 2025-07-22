<script>
export default {
  name: "App",
  data() {
    return {
      whereAmI: "room",
      lastRoom: "room",
      lastDoor: "",
      command: "",
      output: "",
      objectAliases: {
        torch: ["torch", "torches"],
        wall: ["wall", "walls"],
        door: ["door", "entrance", "exit"],
        book: ["book"],
        table: ["tabel", "desk", "wooden table"],
        ball: ["ball", "rubber ball"],
        stone: ["stone", "rock","small stone"],
      },
      verbAliases: {
        look: ["look", "see", "view", "examine", "inspect"],
        go: ["go", "walk", "move", "travel", "head"],
        open: ["open", "unlock", "unfasten", "unlatch"],
        close: ["close", "lock", "fasten", "latch"],
        take: ["take", "grab", "collect", "get"],
        drop: ["drop", "discard"],
        inventory: ["inventory", "items", "bag", "backpack", "pack"],
      },
      player: {
        inventory: [],
      },
      rooms: {
        hallway: {
          name: "Hallway",
          description:
            "You are in a long dark hallway with flickering torches on the walls. " +
            "A door in the north leads you back to the room with the book.<br>",
          exit: {
            north: { target: "room", handicap: "door" },
          },
          objects: {
            torch: {
              name: "torch",
              commands: { look: "The torch is flickering and casting eerie shadows on the walls." },
              scenery: true,
              canTake: false,
            },
            stone: {
              name: "stone",
              commands: { look: "A small stone lies on the ground, it looks like it could be useful." },
              scenery: false,
              sceneryDesc: "A <strong>stone</strong> lies on the ground.",
              canTake: true,
            },
            wall: {
              name: "wall",
              commands: { look: "The walls are made of rough stone and are damp to the touch." },
              scenery: true,
              canTake: false,
            },
            door: {
              name: "door",
              commands: { look: "The door is heavy and creaks as you push it open." },
              open: false,
              locked: false,
              scenery: true,
              canTake: false,
            },
          },
        },
        room: {
          name: "Room",
          description:
            "You are in a small dimly lit room with stone walls and a wooden table in the center." +
            "On the table, there is a mysterious book. Behind you, in the south, is a door.<br>",
          exit: {
            south: { target: "hallway", handicap: "door" },
          },
          objects: {
            book: {
              name: "book",
              commands: { look: "You see an old dusty book with a red cover that shows a pentagram" },
              scenery: true,
              canTake: false,
            },
            table: {
              name: "table",
              commands: { look: "The table is made of oak and has a few scratches on it." },
              scenery: true,
              canTake: false,
            },
            wall: {
              name: "wall",
              commands: { look: "You see a rough stone wall with moss growing in the cracks." },
              scenery: true,
              canTake: false,
            },
            ball: {
              name: "ball",
              commands: {
                look: "A small rubber ball lies on the floor, forgotten.",
              },
              scenery: false,
              sceneryDesc: "A <strong>ball</strong> lies on the floor.",
              canTake: true,
            },
            door: {
              name: "door",
              commands: { look: "The door is made of heavy oak and has a rusty iron handle." },
              open: false,
              locked: false,
              scenery: true,
              canTake: false,
            },
          },
        },
      },
    };
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
  },
  methods: {
    parseCommand(_event) {
      this.output += `> ${this.command}<br>`;

      const splitCmd = this.command
        .replaceAll(" the ", " ")
        .replaceAll(/\s+/g, " ")
        .replace(/( at | for | to | on )/, " ")
        .split(" ");
      const verb = splitCmd[0].toLowerCase();
      const param = splitCmd.slice(1).map((x) => x.toLowerCase());

      let verbAlias = this.checkAliases(this.verbAliases, verb);

      // Check if the verb is valid
      if (!verbAlias) {
        this.output += `<br>I can not '${verb}'.<br>`;
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
      return this.player.inventory.find((item) => item.name.toLowerCase() === noun) || false;
    },
    findItemIndex(noun) {
      return this.player.inventory.findIndex((item) => item.name === noun) 
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
      if (param.length === 0) {
        this.output += `<br>What do you want to ${verb}?<br>`;
        return;
      }
      // Check if the parameter is a valid object in the room

      const noun = this.findObjectName(param.join(" ").toLowerCase());
      if (!noun) {
        this.output += `<br>You can't see '${param[0]}' to ${verb}.<br>`;
        return;
      }

      // if item can be taken put it in the inventory
      if (this.rooms[this.whereAmI].objects[noun].canTake) {
        this.output += `<br>You ${verb} the ${noun}.<br>`;
        this.player.inventory.push(this.rooms[this.whereAmI].objects[noun]);
        // Remove the object from the room
        delete this.rooms[this.whereAmI].objects[noun];
      } else {
        this.output += `<br>You can't ${verb} the ${noun}.<br>`;
        return;
      }
    },
    drop(verb, param) {
      // If no parameter is given, do nothing
      if (param.length === 0) {
        this.output += `<br>What do you want to ${verb}?<br>`;
        return;
      }

      // Check if the parameter is a valid item in the inventory
      const itemName = this.findObjectName(param.join(" ").toLowerCase());
      const itemIndex = this.findItemIndex(itemName);

      if (itemIndex === -1) {
        this.output += `<br>You don't have '${itemName}' in your inventory.<br>`;
        return;
      }

      // Add the item back to the room and remove it from the inventory
      const item = this.player.inventory[itemIndex];
      this.rooms[this.whereAmI].objects[item.name] = item;
      this.output += `<br>You ${verb} the ${item.name}.<br>`;
      this.player.inventory.splice(itemIndex, 1);
    },
    inventory() {
      // If the player has no items in their inventory, inform them
      if (this.player.inventory.length === 0) {
        this.output += "<br>Your inventory is empty.<br>";
        return;
      }

      // List all items in the player's inventory
      this.output += "<br>Your inventory contains:<br>";
      this.player.inventory.forEach((item) => {
        this.output += `<strong>- ${item.name}</strong><br>`;
      });
    },
    open(verb, param) {
      // If no parameter is given, do nothing
      if (param.length === 0) {
        this.output += `<br>What do you want to ${verb}?<br>`;
        return;
      }

      // Check if the parameter is a valid object in the room
      const noun = this.findObjectName(param.join(" ").toLowerCase());
      if (!noun) {
        this.output += `<br>You can't ${verb} '${param[0]}'.<br>`;
        return;
      }

      // Check if the object can be opened
      const object = this.rooms[this.whereAmI].objects[noun];
      if (!object.hasOwnProperty("open")) {
        this.output += `<br>You can't ${verb} the ${noun}.<br>`;
        return;
      }

      // If the object is locked, inform the player and return
      if (object.locked) {
        this.output += `<br>The ${noun} is locked. You need a key to open it.<br>`;
        return;
      }

      // toggle the open state of the object
      if (!object.open) {
        if (verb === "open") {
          object.open = true;
          this.output += `<br>You ${verb} the ${noun}.<br>`;
          return;
        } else {
          this.output += `<br>The ${noun} is already closed.<br>`;
          return;
        }
      } else {
        if (verb === "open") {
          this.output += `<br>The ${noun} is already open.<br>`;
          return;
        } else {
          object.open = false;
          this.output += `<br>You ${verb} the ${noun}.<br>`;
        }
        return;
      }
    },
    close(verb, param) {
      // If no parameter is given, do nothing
      if (param.length === 0) {
        this.output += "<br>What do you want to close?<br>";
        return;
      }

      this.open(verb, param); // Reuse the open method to close
    },
    go(_verb, param) {
      // If no parameter is given, do nothing
      if (param.length === 0) {
        this.output += "<br>Where do you want to go?<br>";
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
        if (!this.rooms[this.whereAmI].objects[exits[direction].handicap].open) {
          this.output += `<br>The ${exits[direction].handicap} is closed.<br>`;
          return;
        }

        this.lastDoor = exits[direction].handicap;
        this.lastRoom = this.whereAmI;
        this.whereAmI = exits[direction].target;
        this.rooms[this.whereAmI].objects[this.lastDoor].open = true;
        this.output += `<br>You go ${direction} to the ${this.rooms[this.whereAmI].name}.<br>`;
      } else {
        this.output += `<br>You can't go ${direction} from here.<br>`;
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
        // check the room
        if (this.rooms[this.whereAmI].objects[foundObject]) {
          const lookOutput = this.rooms[this.whereAmI].objects[foundObject].commands[verb];
          this.output += `<br>${lookOutput}<br>`;
        // check your inventory
        } else if (this.findItem(foundObject)) {
          const lookOutput = this.findItem(foundObject).commands[verb];
          this.output += `<br>You open your inventory and look at the ${foundObject}...`;
          this.output += `<br>${lookOutput}<br>`;
        } else {
          this.output += `<br>You can't see '${noun}' here.<br>`;
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
    <button @click="parseCommand($event)">Parse</button>
    <p v-html="output"></p>
  </div>
</template>

<style></style>
