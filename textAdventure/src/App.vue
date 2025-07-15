<script>
export default {
  name: "App",
  data() {
    return {
      whereAmI: "room",
      command: "",
      output: "",
      verbAliases: {
        "^(look|see|view|examine|inspect)$": "look",
      },
      rooms: {
        room: {
          name: "Room",
          description:
            "You are in a small dimly lit room with stone walls and a wooden table in the center. On the table, there is a mysterious book.",
          objects: {
            objectAliases: {
              "^book$": "book",
              "^table$": "table",
              "^(wall|walls|stone wall)$": "wall",
            },
            book: { look: "You see an old dusty book with a red cover that shows a pentagram" },
            table: { look: "The table is made of oak and has a few scratches on it." },
            wall: { look: "You see a rough stone wall with moss growing in the cracks." },
          },
        },
      },
    };
  },
  methods: {
    parseCommand(_event) {
      const splitCmd = this.command.replaceAll(" the ", " ").replaceAll(/\s+/g, " ").split(" ");
      const verb = splitCmd[0].toLowerCase();
      const param = splitCmd.slice(1).map((x) => x.toLowerCase());

      let verbAlias = verb;

      // Check for verb aliases
      for (const alias in this.verbAliases) {
        if (verb.match(new RegExp(alias))) {
          verbAlias = this.verbAliases[alias];
          break;
        }
      }
      // Check if the verb is valid
      if (!verbAlias) {
        this.output = `I can not ${verb}.`;
        return;
      }

      // Execute the command
      this[verbAlias](verbAlias, param);
    },

    findObject(noun) {
      console.log("Finding object:", noun);
      // If noun is given, check if it exists in the current room
      if (this.rooms[this.whereAmI].objects[noun]) {
        return noun;
      }
      // Check for object aliases
      const aliases = this.rooms[this.whereAmI].objects.objectAliases;
      for (const alias in aliases) {
        console.log(alias)
        if (noun.match(new RegExp(alias))) {
          console.log(alias)
          return aliases[alias];
        }
      }
      return null;
    },

    look(verb, param) {
      let noun = param.join(" ").toLowerCase();
      // If no parameter is given, look around the room
      if ((!noun || noun.match(/^(around)$/)) && param.length === 0) {
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
