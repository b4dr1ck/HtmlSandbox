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
      verbAliases: {
        look: ["look", "see", "view", "examine", "inspect"],
        go: ["go", "walk", "move", "travel", "head"],
        open: ["open", "unlock", "unfasten", "unlatch"],
        close: ["close", "lock", "fasten", "latch"],
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
            objectAliases: {
              torch: ["torch", "torches"],
              wall: ["wall", "walls"],
              door: ["door", "entrance", "exit"],
            },
            torch: {
              commands: { look: "The torch is flickering and casting eerie shadows on the walls." },
              scenery: true,
              canTake: false,
            },
            wall: {
              commands: { look: "The walls are made of rough stone and are damp to the touch." },
              scenery: true,
              canTake: false,
            },
            door: {
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
            objectAliases: {
              book: ["book"],
              table: ["tabel", "desk", "wooden table"],
              wall: ["wall", "walls", "stone wall"],
              door: ["door", "entrance", "exit"],
            },
            book: {
              commands: { look: "You see an old dusty book with a red cover that shows a pentagram" },
              scenery: true,
              canTake: false,
            },
            table: {
              commands: { look: "The table is made of oak and has a few scratches on it." },
              scenery: true,
              canTake: false,
            },
            wall: {
              commands: { look: "You see a rough stone wall with moss growing in the cracks." },
              scenery: true,
              canTake: false,
            },
            ball: {
              commands: {
                look: "A small rubber ball lies on the floor, forgotten.",
              },
              scenery: false,
              sceneryDesc: "A <strong>ball</strong> lies on the floor.",
              canTake: true,
            },
            door: {
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
    findObject(noun) {
      // If noun is given, check if it exists in the current room
      if (this.rooms[this.whereAmI].objects[noun]) {
        return noun;
      }

      // Check for object aliases
      const aliases = this.rooms[this.whereAmI].objects.objectAliases;
      return this.checkAliases(aliases, noun);
    },
    open(verb, param) {
      // If no parameter is given, do nothing
      if (param.length === 0) {
        this.output += `<br>What do you want to ${verb}?<br>`;
        return;
      }

      // Check if the parameter is a valid object in the room
      const noun = this.findObject(param[0]);
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

      // If the parameter is a preposition
      noun = noun.replace(/(at |for |to )/, "");

      // If noun is the room itself, describe the room
      if (noun === this.whereAmI) {
        this.output += `<br>${this.rooms[this.whereAmI].description}<br>`;
        return;
      }

      // If the noun is an object in the room, describe it
      const foundObject = this.findObject(noun);
      if (foundObject) {
        const lookOutput = this.rooms[this.whereAmI].objects[foundObject].commands[verb];
        this.output += `<br>${lookOutput}<br>`;
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
