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
      validPrepositions: ["in", "inside", "into", "on", "onto", "at", "to", "with", "from", "about", "for"],
      player: {
        inventory: {},
      },
      rooms: rooms,
    };
  },

  mounted() {
    // Add a global keypress event listener
    window.addEventListener("keydown", this.handleKeyPress);
    // Focus the input field when the component is mounted
    this.$nextTick(() => {
      const input = this.$refs.input;
      if (input) {
        input.focus();
      }
    });
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
        // Scroll to the bottom of the #output element
        this.$nextTick(() => {
          const output = this.$refs.output;
          if (output) {
            output.scrollTop = output.scrollHeight;
          }
        });
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
          objectsAliases[obj] = objects[obj].alias;
          if (objects[obj].container) {
            // if the object is a container, add its storage items as aliases
            for (const item in objects[obj].container.storage) {
              objectsAliases[item] = objects[obj].container.storage[item].alias;
            }
          }
        }

        // check the directionAliases
        for (const direction in this.directionAliases) {
          objectsAliases[direction] = this.directionAliases[direction];
        }

        // check the player inventory
        for (const item in this.player.inventory) {
          objectsAliases[item] = this.player.inventory[item].alias;
        }

        console.log(objectsAliases);
        return objectsAliases;
      };

      this.output += `<br>> ${this.command}<br>`;
      let cmd = this.command.trim().toLowerCase().replaceAll(/\s+/g, " ").replaceAll(" the ", " ");
      console.log(cmd);
      this.command = "";
      const objectsAliases = getObjectsAliases();

      cmd = replaceAliases(cmd, this.verbAliases);
      cmd = replaceAliases(cmd, objectsAliases);
      console.log(cmd);

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
      const foundPrepo = this.validPrepositions.find((prep) => prep === cmdSplitted[2]);
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
      for (const item in this.player.inventory) {
        if (item === object) {
          return `(inventory) ${this.player.inventory[item].description}`;
        }
      }
      // the room itself
      if (object === this.whereAmI) {
        return this.rooms[this.whereAmI].description;
      }

      const objects = this.rooms[this.whereAmI].objects;
      // object in the room
      const objectInRoom = objects[object];
      if (objectInRoom) {
        let desc = objectInRoom.description;
        // is a container
        if (objectInRoom.container && Object.keys(objectInRoom.container.storage).length > 0) {
          if ("open" in objectInRoom) {
            if (objectInRoom.open) {
              desc += `<br>${objectInRoom.container.validPrepositions[0]} the <strong>${objectInRoom.name}</strong> you see:`;
              for (const item in objectInRoom.container.storage) {
                desc += `<br><strong>* ${objectInRoom.container.storage[item].name}</strong>`;
              }
            }
          } else {
            desc += `<br>${objectInRoom.container.validPrepositions[0]} the <strong>${objectInRoom.name}</strong> you see:`;
            for (const item in objectInRoom.container.storage) {
              desc += `<br><strong>* ${objectInRoom.container.storage[item].name}</strong>`;
            }
          }
        }
        return desc;
      }

      for (const obj in objects) {
        if (objects[obj].container && Object.keys(objects[obj].container.storage).length > 0) {
          const item = objects[obj].container.storage[object];
          if (item) {
            return `(${objects[obj].container.validPrepositions[0]} ${objects[obj].name}) ${item.description}`;
          }
        }
      }

      return null;
    },
    checkNounsLength(verb, nouns) {
      let maxNouns = 1;
      if (verb === "put" || verb === "open") {
        maxNouns = 2;
      }
      if (nouns.length === 0 || nouns.length > maxNouns) {
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
      if (Object.keys(this.player.inventory).length === 0) {
        this.output += `<br>You don't carry anything with you<br>`;
      } else {
        this.output += `<br>Your inventory:<br>`;
        for (const item in this.player.inventory) {
          this.output += `* <strong>${this.player.inventory[item].name}</strong><br>`;
        }
      }
    },
    put(verb, nouns, preposition) {
      if (!this.checkNounsLength(verb, nouns)) return;
      if (nouns.length === 2) {
        const objectSrc = this.player.inventory[nouns[0]];
        const objectDest = this.rooms[this.whereAmI].objects[nouns[1]];

        if (!objectDest.container) {
          this.output += `<br>The <strong>${objectDest.name}</strong> is not a container!<br>`;
          return;
        }

        if ("open" in objectDest && !objectDest.open) {
          this.output += `<br>You can't put something in the <strong>${objectDest.name}</strong> because it is closed!<br>`;
          return;
        }

        if (!objectDest.container.validPrepositions.includes(preposition[0])) {
          this.output += `<br>You can't do this!<br>`;
          this.output += `<small>Valid prepositions for the${
            objectDest.name
          } are:${objectDest.container.validPrepositions.join(", ")}</small><br>`;
          return;
        }

        if (!objectSrc) {
          this.output += `<br>You don't have the <strong>${objectSrc.name}</strong> in your inventory!<br>`;
          return;
        }

        delete this.player.inventory[nouns[0]];
        objectDest.container.storage[nouns[0]] = objectSrc;

        this.output += `<br>You put the <strong>${objectSrc.name}</strong> ${preposition} the <strong>${objectDest.name}</strong><br>`;
      } else {
        this.output += `<br>What do you want to put where?<br>`;
      }
    },
    take(verb, nouns, _preposition) {
      if (!this.checkNounsLength(verb, nouns)) return;

      const objects = this.rooms[this.whereAmI].objects;
      let object = objects[nouns[0]];
      let containerName = "";

      // if object is not found in the room, check in containers
      if (!object) {
        for (const obj in objects) {
          if (objects[obj].container && Object.keys(objects[obj].container.storage).length > 0) {
            if ("open" in objects[obj]) {
              if (objects[obj].open) {
                object = objects[obj].container.storage[nouns[0]];
              }
            } else {
              object = objects[obj].container.storage[nouns[0]];
            }
            containerName = objects[obj].name;
          }
        }
      }
      if (object) {
        // special behavior if command-verb exist in object
        if (object.command[verb]) {
          this.output += `<br>${object.command[verb]()}`;
        }
        if (object.canTake) {
          this.player.inventory[nouns[0]] = object;
          if (containerName) {
            // delete from container
            const item = objects[containerName].container.storage[nouns[0]];
            if (item) {
              delete objects[containerName].container.storage[nouns[0]];
              this.output += `<br>You take the <strong>${object.name}</strong> from the <strong>${containerName}</strong><br>`;
            }
          } else {
            // delete from inventory
            delete this.rooms[this.whereAmI].objects[nouns[0]];
            this.output += `<br>You take the <strong>${object.name}</strong><br>`;
          }
        } else {
          this.output += `<br>You can't take the <strong>${object.name}</strong>!<br>`;
        }
      } else {
        this.output += `<br>You can't take that!<br>`;
      }
    },
    drop(verb, nouns, _preposition) {
      if (!this.checkNounsLength(verb, nouns)) return;

      const item = this.player.inventory[nouns[0]];
      if (item) {
        this.rooms[this.whereAmI].objects[nouns[0]] = item; // add the item back to the room
        delete this.player.inventory[nouns[0]]; // remove from inventory
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
    open(verb, nouns, preposition) {
      if (!this.checkNounsLength(verb, nouns)) return;

      const object = this.rooms[this.whereAmI].objects[nouns[0]];

      if (nouns.length === 2) {
        if (preposition != "with") {
          this.output += `<br>I don't understand ${preposition}<br>`;
          return;
        }
        if (object.locked) {
          const item = this.player.inventory[nouns[1]];
          if (!item) {
            this.output += `<br>You don't have the <strong>${nouns[1]}</strong> in your inventory!<br>`;
            return;
          }
          if (nouns[1] === object.locked) {
            object.locked = false;
            this.output += `<br>You unlock the <strong>${nouns[0]}</strong> with the <strong>${nouns[1]}</strong><br>`;
          } else {
            this.output += `<br>The ${nouns[1]} doesn't fit!<br>`;
          }
        }
      }

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
    <input ref="input" v-model="command" type="text" placeholder="type in here..." />
    <p id="output" ref="output" v-html="output"></p>
  </div>
</template>

<style>
body {
  background-color: black;
}
#wrapper {
  font-size: 18px;
  font-family: monospace;
  width: 800px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  color: white;
  background-color: rgb(44, 44, 44);
}
#output {
  height: 500px;
  overflow-y: auto;
}

input {
  font-size: 18px;
  font-family: monospace;
  border: none;
  background-color: rgb(44, 44, 44);
  color: rgb(214, 214, 214);
  outline: none;
}
</style>
