<script>
export default {
  name: "App",
  data() {
    return {
      whereAmI: "room",
      whereWasI: "",
      lastDoor: "",
      command: "",
      output: "",
      objectAliases: {
        torch: ["torch", "torches"],
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
        take: ["take", "grab", "collect", "get"],
        drop: ["drop", "discard"],
        inventory: ["inventory", "items", "bag", "backpack", "pack", "inv"],
      },
      player: {
        inventory: [],
      },
      rooms: {
        westPath: {
          name: "Dead End",
          description:
            "You are at a dead end. The path is blocked by a large rock.<br>" +
            "There is no way to go further west.<br>" +
            "You can go back east to the hallway.<br>",
          exit: {
            east: { target: "hallway" },
          },
          objects: {
            wall: {
              name: "wall",
              description: "The walls are cracked and look like they could collapse at any moment.",
              scenery: true,
              canTake: false,
              command: {},
            },
            rock: {
              name: "rock",
              description: "A large boulder blocks your waye. It looks heavy and immovable.",
              scenery: true,
              canTake: false,
              command: {},
            },
          },
        },
        hallway: {
          name: "Hallway",
          description:
            "You are in a long dark hallway with flickering torches on the walls.<br>" +
            "A door in the north leads you back to the room with the book.<br>" +
            "Another small and dark path leads to the west.<br>",
          exit: {
            north: { target: "room", handicap: "door" },
            west: { target: "westPath" },
          },
          objects: {
            torch: {
              name: "torch",
              description: "The torch is flickering and casting eerie shadows on the walls.",
              scenery: true,
              canTake: false,
              command: {},
            },
            stone: {
              name: "stone",
              description: "A small stone. It looks like it could be useful.",
              scenery: false,
              sceneryDesc: "A <strong>stone</strong> lies on the ground.",
              canTake: true,
              command: {},
            },
            wall: {
              name: "wall",
              description: "The walls are made of rough stone and are damp to the touch.",
              scenery: true,
              canTake: false,
              command: {},
            },
            door: {
              name: "door",
              description: "The door is heavy and creaks as you push it open.",
              open: false,
              locked: false,
              scenery: true,
              canTake: false,
              command: {},
            },
          },
        },
        room: {
          name: "Dark Room",
          description:
            "You are in a small dimly lit room with stone walls and a wooden table in the center.<br>" +
            "On the table, there is a mysterious book. Behind you, in the south, is a door.<br>",
          exit: {
            south: { target: "hallway", handicap: "door" },
          },
          objects: {
            book: {
              name: "book",
              description: "You see an old dusty book with a red cover that shows a pentagram",
              scenery: true,
              canTake: false,
              command: {
                /*take: () => {
                  this.rooms.room.objects.book.canTake = true;
                  this.rooms.room.objects.book.scenery = false;
                  this.rooms.room.objects.book.sceneryDesc = "A <strong>book</strong> lies on the table.";
                  return "Now you can take the book.";
                },*/
                take: () => {
                  return "It seems to be magically bound to the table.";
                },
              },
            },
            table: {
              name: "table",
              description: "The table is made of oak and has a few scratches on it.",
              scenery: true,
              canTake: false,
              command: {},
            },
            wall: {
              name: "wall",
              description: "You see a rough stone wall with moss growing in the cracks.",
              scenery: true,
              canTake: false,
              command: {},
            },
            ball: {
              name: "ball",
              description: "A small rubber ball.",
              scenery: false,
              sceneryDesc: "A <strong>ball</strong> lies lonesome on the floor.",
              canTake: true,
              command: {},
            },
            door: {
              name: "door",
              description: "The door is made of heavy oak and has a rusty iron handle.",
              open: false,
              locked: false,
              scenery: true,
              canTake: false,
              command: {},
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
    buttonDisabled() {
      return this.command.trim() === "";
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

      if (verb.match(/^(n|north|e|east|s|south|w|west)$/gi)) {
        this.go("", verb);
        return;
      }

      // Check if the verb is valid
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

        this.output += `<br>You go <strong>${direction}</strong> to the <strong>${this.rooms[this.whereAmI].name}</strong>.<br>`;
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
    <p v-html="output"></p>
  </div>
</template>

<style></style>
