<script>
export default {
  name: "App",
  data() {
    return {
      whereAmI: "room",
      command: "",
      output: "",
      verbAliases: {
        look: ["look", "see", "view", "examine", "inspect"],
        go: ["go", "walk", "move", "travel", "head"],
      },
      rooms: {
        hallway: {
          name: "Hallway",
          description:
            "You are in a long dark hallway with flickering torches on the walls. " +
            "A door in the north leads you back to the room with the book",
          exit: {
            north: "room",
          },
          objects: {
            objectAliases: {
              torch: ["torch", "torches"],
              wall: ["wall", "walls"],
              door: ["door", "entrance", "exit"],
            },
            torch: { look: "The torch is flickering and casting eerie shadows on the walls." },
            wall: { look: "The walls are made of rough stone and are damp to the touch." },
            door: { look: "The door is heavy and creaks as you push it open." },
          },
        },
        room: {
          name: "Room",
          description:
            "You are in a small dimly lit room with stone walls and a wooden table in the center." +
            "On the table, there is a mysterious book. Behind you, in the south, is a door",
          exit: {
            south: "hallway",
          },
          objects: {
            objectAliases: {
              book: ["book"],
              table: ["tabel", "desk", "wooden table"],
              wall: ["wall", "walls", "stone wall"],
              door: ["door", "entrance", "exit"],
            },
            book: { look: "You see an old dusty book with a red cover that shows a pentagram" },
            table: { look: "The table is made of oak and has a few scratches on it." },
            wall: { look: "You see a rough stone wall with moss growing in the cracks." },
            door: { look: "The door is made of heavy oak and has a rusty iron handle." },
          },
        },
      },
    };
  },
  methods: {
    parseCommand(_event) {
      const splitCmd = this.command
        .replaceAll(" the ", " ")
        .replaceAll(/\s+/g, " ")
        .replace(/( at | for | to )/, " ")
        .split(" ");
      const verb = splitCmd[0].toLowerCase();
      const param = splitCmd.slice(1).map((x) => x.toLowerCase());

      let verbAlias = this.checkAliases(this.verbAliases, verb);

      // Check if the verb is valid
      if (!verbAlias) {
        this.output = `I can not '${verb}'.`;
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
    go(_verb, param) {
      // If no parameter is given, do nothing
      if (param.length === 0) {
        this.output = "Where do you want to go?";
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
        this.whereAmI = exits[direction];
        this.output = `You go ${direction} to the ${this.rooms[this.whereAmI].name}.`;
      } else {
        this.output = `You can't go ${direction} from here.`;
      }
    },
    look(verb, param) {
      let noun = param.join(" ").toLowerCase();
      console.log(verb, noun, param);
      // If no parameter is given, look around the room
      if ((!noun || noun.match(/^(around)$/)) && param.length === 0 || param[0] === "") {
        this.output = this.rooms[this.whereAmI].description;
        return;
      }

      // If the parameter is a preposition
      noun = noun.replace(/(at |for |to )/, "");

      // If noun is the room itself, describe the room
      if (noun === this.whereAmI) {
        this.output = this.rooms[this.whereAmI].description;
        return;
      }

      // If the noun is an object in the room, describe it
      const foundObject = this.findObject(noun);
      if (foundObject) {
        const lookOutput = this.rooms[this.whereAmI].objects[foundObject][verb];
        this.output = lookOutput;
      } else {
        //.. otherwise, say a generic message
        this.output = "You see nothing special.";
      }
    },
  },
};
</script>

<template>
  <div id="wrapper">
    <h3>{{ rooms[whereAmI].name }}</h3>
    <p>{{ rooms[whereAmI].description }}</p>
    <input v-model="command" type="text" />
    <button @click="parseCommand($event)">Parse</button>
    <p>{{ output }}</p>
  </div>
</template>

<style></style>
