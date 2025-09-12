<script>
import { rooms, newItems } from "./rooms.js";
import { player } from "./player.js";

export default {
  name: "App",
  data() {
    return {
      inputDisabled: false,
      updateDesc: 0,
      whereAmI: "room",
      whereWasI: "",
      command: "",
      commandObject: {},
      output: "",
      screams: ["Waaaaaaaaaaaah", "Aaaaaaaaargh", "Noooooooo", "Meeeeeeh", "Aaaaaaaah", "Eeeeeeeek", "Yoooooooo"],
      cmdNotFoundMemes: [
        "What do you want to do?",
        "I don't understand that command.",
        "Please try something else.",
        "I don't know what you mean.",
        "Can you rephrase that?",
        "That doesn't make sense to me.",
        "I'm not sure how to respond to that.",
      ],
      directionAliases: {
        north: ["north", "n"],
        south: ["south", "s"],
        east: ["east", "e"],
        west: ["west", "w"],
        northeast: ["northeast", "ne"],
        northwest: ["northwest", "nw"],
        southeast: ["southeast", "se"],
        southwest: ["southwest", "sw"],
        up: ["up", "above", "ascend", "u"],
        down: ["down", "below", "descend", "d"],
        in: ["in", "inside", "into"],
        out: ["out", "outside", "exit"],
      },
      specialsAliases: {
        hand: ["hand", "hands", "your hand", "your hands"],
      },
      verbAliases: {
        pull: ["pull", "pull on", "drag on", "drag"],
        push: ["push", "press", "press on", "push on", "move", "shift"],
        look: ["look", "see", "view", "examine", "inspect", "look at", "show"],
        climb: ["climb", "crawl", "climb on", "crawl on", "climb up", "crawl up"],
        go: ["go", "go to", "walk", "walk to", "move", "move to", "travel", "travel to", "head", "head to"],
        open: ["open", "unlock", "unfasten", "unlatch"],
        close: ["close", "lock", "fasten", "latch"],
        take: ["take", "grab", "collect", "get", "remove", "pick up"],
        drop: ["drop", "discard", "put down"],
        inventory: ["inventory", "items", "bag", "backpack", "pack", "inv"],
        put: ["put", "place", "set", "store", "deposit", "give"],
        activate: ["turn on", "switch on"],
        deactivate: ["turn off", "switch off"],
        throw: ["throw", "toss", "hurl", "chuck"],
        consume: ["consume", "eat", "drink"],
        attack: ["attack", "destroy", "bash", "strike", "kill", "hit", "smash"],
        fuck: ["shit", "ass", "cunt", "bitch", "damn"],
        scream: ["shout", "yell"],
        smell: ["smell", "scent", "reek", "nose"],
        read: ["read"],
        help: ["help", "help me"],
        combine: ["combine", "craft"],
        diagnose: ["diagnose", "condition", "health", "state"],
        dress: ["wear", "dress", "put on", "dress on", "equip", "clothe"],
        undress: ["undress", "put off", "dress off", "disrobe", "unclothe", "strip"],
        light: ["light", "inflame", "ignite", "kindle"],
        extinguish: ["extinguish", "erase", "douse", "purge"],
      },
      validPrepositions: ["in", "inside", "into", "on", "onto", "at", "to", "with", "from", "about", "for", "up"],
      player: player,
      rooms: rooms,
      newItems: newItems,
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
      const counter = this.updateDesc; // enforce the reactivity
      const room = this.rooms[this.whereAmI];
      const objects = room.objects;

      let roomDescText = room.description;

      // describe objects in the room if the scenery flag is set
      for (const obj in objects) {
        if (!objects[obj].scenery && !objects[obj].hidden) {
          roomDescText += `${objects[obj].sceneryDesc}<br>`;
        }
      }
      return roomDescText;
    },
  },

  watch: {
    player: {
      handler(newVal) {
        if (newVal.condition === "dead") {
          this.playerDies();
        }
      },
      deep: true,
    },
  },

  methods: {
    playerDies() {
      this.output += `<br><span style='color:red;'>💀 You are dead. Game Over! 💀</span><br>`;
      this.inputDisabled = true;
    },
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
      // get all object aliases from rooms, inventory, objects, directions and specials
      const getObjectAliases = () => {
        const objectAliases = {};
        for (const room in this.rooms) {
          objectAliases[room] = this.rooms[room].alias;
          const objects = this.rooms[room].objects;
          for (const obj in objects) {
            if (objects[obj].hidden) continue;
            if (objects[obj].alias) {
              objectAliases[obj] = objects[obj].alias;
              if (objects[obj].container) {
                for (const item in objects[obj].container.storage) {
                  objectAliases[item] = objects[obj].container.storage[item].alias;
                }
              }
            }
          }
        }
        for (const item in this.player.inventory) {
          if (this.player.inventory[item].alias) {
            objectAliases[item] = this.player.inventory[item].alias;
          }
        }
        const mergedObjectAliases = {
          ...this.specialsAliases,
          ...objectAliases,
          ...this.directionAliases,
          ...{ inventory: ["inventory", "items", "bag", "backpack", "pack", "inv"] },
        };
        return mergedObjectAliases;
      };

      this.output += `<br><i>> ${this.command}</i><br>`;
      let cmd = this.command.trim().toLowerCase().replaceAll(/\s+/g, " ").replaceAll(" the ", " ");
      this.command = "";

      const objectsAliases = getObjectAliases();

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
      const foundPrepo = this.validPrepositions.find((prep) => prep === cmdSplitted[2]);
      if (foundPrepo) this.commandObject.prepos.push(`${foundPrepo}`);

      // if the verb is a direction alias, change the verb to "go" and set the direction as noun
      for (const direction in this.directionAliases) {
        if (this.directionAliases[direction].includes(cmdSplitted[0])) {
          this.commandObject.verb[0] = "go"; // change verb to go
          this.commandObject.nouns = [direction]; // set the direction as noun
          this.commandObject.prepos = []; // clear prepositions
          break;
        }
      }

      // if verb is unknown
      if (this.commandObject.verb.length === 0 || this.commandObject.verb.length > 1) {
        const randomIndex = Math.floor(Math.random() * this.cmdNotFoundMemes.length);
        this.output += `<br>"${this.cmdNotFoundMemes[randomIndex]}"<br>`;
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
      const room = this.rooms[this.whereAmI];
      // get the exit of the choosen direction
      if (!room.exit || !room.exit[direction]) {
        // check if direction is a room
        for (const dir in room.exit) {
          if (room.exit[dir].target === direction) {
            return room.exit[dir];
          }
        }
      }
      return room.exit[direction];
    },
    getDescription(object) {
      const inventory = this.player.inventory;
      const room = this.rooms[this.whereAmI];
      const objects = room.objects;
      const objectInRoom = objects[object];

      // in the inventory
      if (inventory[object]) {
        return `(inventory) ${inventory[object].description}`;
      }

      // the room itself
      if (object === this.whereAmI) {
        return room.description;
      }

      // object in the room
      if (objectInRoom) {
        // object is hidden
        if (objectInRoom.hidden) {
          return null;
        }
        let desc = `${objectInRoom.description}`;
        // object is a switch
        if ("isActive" in objectInRoom) {
          const onOrOff = objectInRoom.isActive ? "on" : "off";
          desc += ` (${onOrOff})`;
        }
        // object can be opened
        if ("open" in objectInRoom) {
          const openOrClosed = objectInRoom.open ? "open" : "closed";
          desc += ` (${openOrClosed})`;
        }

        if ("isLighted" in objectInRoom) {
          const lightedOrNot = objectInRoom.isLighted ? "it is lighted" : "it is not lighted";
          desc += ` (${lightedOrNot})`;
        }
        // is a container
        if (objectInRoom.container && Object.keys(objectInRoom.container.storage).length > 0) {
          if ("open" in objectInRoom) {
            if (objectInRoom.open) {
              let containText = `${objectInRoom.container.validPrepositions[0]} the <strong>${objectInRoom.name}</strong> you see:`;
              if (objectInRoom.container.containText) {
                containText = objectInRoom.container.containText;
              }
              desc += `<br>${containText}`;
              for (const item in objectInRoom.container.storage) {
                if (objectInRoom.container.storage[item].hidden) continue;
                desc += `<br><strong>* ${objectInRoom.container.storage[item].name}</strong>`;
              }
            }
          } else {
            // if the object is a container you can not open/close, always show it's content
            let containText = `${objectInRoom.container.validPrepositions[0]} the <strong>${objectInRoom.name}</strong> you see:`;
            if (objectInRoom.container.containText) {
              containText = objectInRoom.container.containText;
            }
            desc += `<br>${containText}`;
            for (const item in objectInRoom.container.storage) {
              if (objectInRoom.container.storage[item].hidden) continue;
              desc += `<br><strong>*  ${objectInRoom.container.storage[item].name}</strong>`;
            }
          }
        }
        return desc;
      }
      // objects in a container
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
    // check the maximum amount of nouns for the given verb
    checkNounsAmount(verb, nouns) {
      let maxNouns = 1;
      if (verb === "put" || verb === "open" || verb === "attack" || verb === "throw" || verb === "combine") {
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
    additionalCommand(object, verb, parameter) {
      if (object.command[verb]) {
        this.output += `<br>${object.command[verb](parameter)}`;
        this.updateDesc++;
        this.player.update++;
        return true;
      }
      return false;
    },
    inventory() {
      const inventory = this.player.inventory;
      let equipped = "";
      if (Object.keys(inventory).length === 0) {
        this.output += `<br>You don't carry anything with you<br>`;
      } else {
        this.output += `<br>Your inventory:<br>`;
        for (const item in inventory) {
          if (inventory[item].equipped) {
            equipped = `(equipped) `;
          }
          this.output += `* <strong>${equipped}${inventory[item].name}</strong><br>`;
        }
      }
    },
    push(verb, nouns, _preposition) {
      this.pull(verb, nouns, _preposition);
    },
    pull(verb, nouns, _preposition) {
      const object1 = nouns[0];
      const objectInRoom = this.rooms[this.whereAmI].objects[object1];

      if (!this.checkNounsAmount(verb, nouns)) return;

      if (objectInRoom && (objectInRoom.canPull || objectInRoom.canPush)) {
        if (this.additionalCommand(objectInRoom, verb)) return;
        this.output += `<br>You ${verb} the <strong>${objectInRoom.name}</strong><br>`;
      } else {
        this.output += `<br>You can't ${verb} that!<br>`;
      }
    },
    deactivate(verb, nouns, _preposition) {
      const object1 = nouns[0];
      const objectInRoom = this.rooms[this.whereAmI].objects[object1];

      if (!this.checkNounsAmount(verb, nouns)) return;

      if (objectInRoom && objectInRoom.isActive) {
        if (this.additionalCommand(objectInRoom, verb)) return;
        this.output += `<br>You deactivate the <strong>${objectInRoom.name}</strong><br>`;
        objectInRoom.isActive = false;
      } else if (objectInRoom && !objectInRoom.isActive) {
        this.output += `<br>The ${objectInRoom.name} is already deactivated!<br>`;
      } else {
        this.output += `<br>You can't deactivate that!<br>`;
      }
    },
    activate(verb, nouns, _preposition) {
      const object1 = nouns[0];
      const objectInRoom = this.rooms[this.whereAmI].objects[object1];

      if (!this.checkNounsAmount(verb, nouns)) return;

      if (objectInRoom && !objectInRoom.isActive) {
        this.output += `<br>You activate the <strong>${objectInRoom.name}</strong><br>`;
        objectInRoom.isActive = true;
        if (this.additionalCommand(objectInRoom, verb)) return;
      } else if (objectInRoom && objectInRoom.isActive) {
        this.output += `<br>The ${objectInRoom.name} is already activated!<br>`;
      } else {
        this.output += `<br>You can't activate that!<br>`;
      }
    },
    undress(verb, nouns, _preposition) {
      this.dress(verb, nouns, _preposition);
    },
    dress(verb, nouns, _preposition) {
      const object1 = nouns[0];
      const item = this.player.inventory[object1];

      if (!this.checkNounsAmount(verb, nouns)) return;

      if (item) {
        if (item.canWear) {
          if (verb === "undress") {
            if (!item.equipped) {
              this.output += `<br>You are not wearing the <strong>${item.name}</strong>!<br>`;
              return;
            }
            this.output += `<br>You put off the <strong>${item.name}</strong><br>`;
            item.equipped = false;
            return;
          }

          if (item.equipped) {
            this.output += `<br>You are already wearing the <strong>${item.name}</strong>!<br>`;
            return;
          }
          if (this.additionalCommand(item, verb)) return;
          this.output += `<br>You put on the <strong>${item.name}</strong><br>`;
          item.equipped = true;
        } else {
          this.output += `<br>You can't wear the <strong>${item.name}</strong>!<br>`;
        }
      } else {
        this.output += `<br>You don't have that in your inventory!<br>`;
      }
    },
    read(verb, nouns, _preposition) {
      const object1 = nouns[0];
      if (!this.checkNounsAmount(verb, nouns)) return;

      let item = this.player.inventory[object1] || this.rooms[this.whereAmI].objects[object1];
      if (!item) {
        // check container storage
        for (const obj in this.rooms[this.whereAmI].objects) {
          const object = this.rooms[this.whereAmI].objects[obj];
          if (object.container && Object.keys(object.container.storage).length > 0) {
            if (object.container.storage[object1]) {
              item = object.container.storage[object1];
              break;
            }
          }
        }
      }

      if (item && item.canRead) {
        this.output += `<br>You read the <strong>${item.name}</strong>:<br><i>"${item.canRead}</i>"<br>`;
        if (this.additionalCommand(item, verb)) return;
      } else if (item) {
        this.output += `<br>You can't read the <strong>${item.name}</strong>!<br>`;
      } else {
        this.output += `<br>You can't do that!<br>`;
      }
    },
    attack(verb, nouns, preposition) {
      const object1 = nouns[0];
      let object2 = nouns[1];

      if (!this.checkNounsAmount(verb, nouns)) return;

      // if no object2 is given, use hand as default
      if (!object2) {
        object2 = "hand";
        preposition = "with";
      }

      if (object1 && object2) {
        const objectSrc = this.player.inventory[object2];
        const objectDest = this.rooms[this.whereAmI].objects[object1];

        if (preposition != "with") {
          this.output += `<br>I can't do this<br>`;
          return;
        }

        if (!objectSrc && object2 !== "hand") {
          this.output += `<br>You don't have the <strong>${object2}</strong> in your inventory!<br>`;
          return;
        }

        if (!objectDest.canBeAttacked) {
          this.output += `<br>The <strong>${objectDest.name}</strong> can't be attacked!<br>`;
          return;
        }

        // check if the object can be attacked with the given object
        if (objectDest.canBeAttacked.includes(object2)) {
          if (verb === "throw") {
            delete this.player.inventory[object2];
            this.rooms[this.whereAmI].objects[object2] = objectSrc;
          }
          this.output += `<br>You attack the <strong>${objectDest.name}</strong> with the <strong>${object2}</strong>`;
          if (this.additionalCommand(objectDest, "attack", object2)) return;
        } else {
          this.output += `<br>You try to attack the <strong>${objectDest.name}</strong> with your ${object2}!<br>`;
          this.output += `<br>But it doesn't work!<br>`;
        }
      } else {
        this.output += `<br>What do you want to attack with what?<br>`;
        return;
      }
    },
    fuck() {
      this.output += '<br>"Such language in a high-class establishment like this!"<br>';
    },
    diagnose() {
      this.output += `<br> You are <strong>${this.player.condition}</strong> <br>`;
    },
    smell(_verb, nouns, _preposition) {
      const room = this.rooms[this.whereAmI];
      const inventory = this.player.inventory;
      const objects = room.objects;

      // Check if the room has a smell description
      if (nouns.length === 0) {
        if ("smell" in room) {
          this.output += `<br>${room.smell}<br>`;
          return;
        }
      } else if (nouns.length === 1) {
        // Check if the object has a smell description
        const object = nouns[0];
        if (object in objects) {
          if ("smell" in objects[object]) {
            this.output += `<br>${objects[object].smell}<br>`;
            return;
          }
        } else if (object in inventory) {
          if ("smell" in inventory[object]) {
            this.output += `<br>${inventory[object].smell}<br>`;
            return;
          }
        }
      }
      this.output += "<br>You can't smell anything special<br>";
    },
    scream(verb) {
      // check if any object in the room has a special scream command
      for (const obj in this.rooms[this.whereAmI].objects) {
        const objInRoom = this.rooms[this.whereAmI].objects[obj];
        if (this.additionalCommand(objInRoom, verb)) return;
      }
      const randomIndex = Math.floor(Math.random() * this.screams.length);
      this.output += `<br>"${this.screams[randomIndex]}"<br>`;
    },
    help() {
      this.output += '<br>"Try some commands, like: <i>look, take, go, etc.</i>"<br>';
    },
    consume(verb, nouns, _preposition) {
      const object1 = nouns[0];
      if (!this.checkNounsAmount(verb, nouns)) return;

      const item = this.player.inventory[object1];

      if (item) {
        if (item.canConsume) {
          this.output += `<br>You consume the <strong>${item.name}</strong><br>`;
          delete this.player.inventory[object1]; // remove from inventory
          if (this.additionalCommand(item, verb, object1)) return;
        } else {
          this.output += `<br>You can't consume the <strong>${item.name}</strong>!<br>`;
        }
      } else {
        this.output += `<br>You don't have that in your inventory!<br>`;
      }
    },
    extinguish(verb, nouns) {
      this.light(verb, nouns);
    },
    light(verb, nouns, _preposition) {
      const object1 = nouns[0];
      if (!this.checkNounsAmount(verb, nouns)) return;

      const object = this.player.inventory[object1] || this.rooms[this.whereAmI].objects[object1];

      if (object && "isLighted" in object) {
        if (object.isLighted) {
          if (verb === "extinguish") {
            const extinguishObject = Object.keys(this.player.inventory).find(
              (item) => this.player.inventory[item].isLiquid
            );
            if (extinguishObject) {
              object.isLighted = false;
              this.output += `<br>You extinguish the <strong>${object.name}</strong> with your ${extinguishObject}<br>`;
              if (this.additionalCommand(object, verb)) return;
            } else {
              this.output += `<br>You need something to extinguish the <strong>${object.name}</strong>!<br>`;
            }
            return;
          }
          this.output += `<br>The <strong>${object.name}</strong> is already lighted!<br>`;
          return;
        }
        if (verb === "extinguish") {
          this.output += `<br>The <strong>${object.name}</strong> is not lighted!<br>`;
          return;
        }
        const lightItem = Object.keys(player.inventory).find((item) => "isLighted" in player.inventory[item]);
        if (lightItem) {
          object.isLighted = true;
          this.output += `<br>You light the <strong>${object.name}</strong> with your ${lightItem}<br>`;
        } else {
          this.output += `<br>You need something to light the <strong>${object.name}</strong>!<br>`;
          return;
        }
        if (this.additionalCommand(object, verb)) return;
      } else {
        this.output += `<br>You can't light that!<br>`;
      }
    },
    combine(verb, nouns, preposition) {
      const object1 = nouns[0];
      const object2 = nouns[1];
      const objectSrc = this.player.inventory[object1];
      const objectDest = this.player.inventory[object2];

      if (!this.checkNounsAmount(verb, nouns)) return;

      if (nouns.length === 2) {
        if (!objectSrc || !objectDest) {
          this.output += `<br>You don't have all needed items in your inventory!<br>`;
          return;
        }
        if (objectSrc.canBeCombined) {
          if (objectSrc.canBeCombined.includes(objectDest.name)) {
            this.output += `<br>You combine the <strong>${objectSrc.name}</strong> with the <strong>${objectDest.name}</strong>`;
            this.output += `<br>You create a <strong>${this.newItems[objectSrc.combinationResult].name}</strong>!<br>`;

            delete this.player.inventory[object1];
            delete this.player.inventory[object2];
            this.player.inventory[objectSrc.combinationResult] = this.newItems[objectSrc.combinationResult];
          } else {
            this.output += `<br>You can't combine the <strong>${object1}</strong> with the <strong>${object2}</strong>!<br>`;
          }
        } else {
          this.output += `<br>You can't combine the <strong>${object1}</strong> with anything!<br>`;
        }
      } else {
        this.output += `<br>What do you want to ${verb} with what?<br>`;
      }
    },
    throw(verb, nouns, preposition) {
      const object1 = nouns[0];
      const object2 = nouns[1];
      const item = this.player.inventory[object1];
      const objectInRoom = this.rooms[this.whereAmI].objects[object2];

      if (!item) {
        this.output += `<br>You don't have that in your inventory!<br>`;
        return;
      }
      if (objectInRoom) {
        if (this.additionalCommand(objectInRoom, verb, object1)) {
          this.rooms[this.whereAmI].objects[object1] = item;
          return;
        }
      }

      // otherwise call the put function
      this.put(verb, nouns, preposition);
    },
    put(verb, nouns, preposition) {
      const object1 = nouns[0];
      const object2 = nouns[1];
      const objectSrc = this.player.inventory[object1];
      const objectDest = this.rooms[this.whereAmI].objects[object2];

      if (!this.checkNounsAmount(verb, nouns)) return;

      if (nouns.length === 2) {
        if (!objectSrc) {
          this.output += `<br>You don't have the <strong>${object1}</strong> in your inventory!<br>`;
          return;
        }

        if (this.additionalCommand(objectDest, verb, object1)) return;

        if (!objectDest.container) {
          this.output += `<br>The <strong>${objectDest.name}</strong> is not a container!<br>`;
          return;
        }

        if ("open" in objectDest && !objectDest.open) {
          this.output += `<br>You can't ${verb} something in the <strong>${objectDest.name}</strong> because it is closed!<br>`;
          return;
        }

        if (!objectDest.container.validPrepositions.includes(preposition[0])) {
          this.output += `<br>You can't do this!<br>`;
          this.output += `<small>Valid prepositions for the ${
            objectDest.name
          } are: ${objectDest.container.validPrepositions.join(", ")}</small><br>`;
          return;
        }

        delete this.player.inventory[object1];
        objectDest.container.storage[object1] = objectSrc;

        this.output += `<br>You ${verb} the <strong>${objectSrc.name}</strong> ${preposition} the <strong>${objectDest.name}</strong><br>`;
      } else {
        if (verb === "throw") {
          this.output += `<br>You throw the <strong>${objectSrc.name}</strong> to the floor<br>`;
          delete this.player.inventory[object1];
          this.rooms[this.whereAmI].objects[object1] = objectSrc;
        } else this.output += `<br>What do you want to ${verb} where?<br>`;
      }
    },
    take(verb, nouns, _preposition) {
      const object1 = nouns[0];

      if (!this.checkNounsAmount(verb, nouns)) return;

      const objects = this.rooms[this.whereAmI].objects;
      let object = objects[nouns[0]];
      let containerName = "";

      // if object is not found in the room, check in containers
      if (!object) {
        for (const obj in objects) {
          if (objects[obj].container && Object.keys(objects[obj].container.storage).length > 0) {
            if ("open" in objects[obj]) {
              if (objects[obj].open) {
                object = objects[obj].container.storage[object1];
              }
            } else {
              object = objects[obj].container.storage[object1];
            }
            containerName = objects[obj].name;
          }
        }
      }
      if (object) {
        // special behavior if command-verb exist in object
        if (this.additionalCommand(object, verb, object)) return;

        if (object.canTake) {
          this.player.inventory[object1] = object;
          if (containerName) {
            // delete from container
            const item = objects[containerName].container.storage[object1];
            if (item) {
              delete objects[containerName].container.storage[object1];
              this.output += `<br>You take the <strong>${object.name}</strong> from the <strong>${containerName}</strong><br>`;
            }
          } else {
            // delete from inventory
            delete this.rooms[this.whereAmI].objects[object1];
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
      const object1 = nouns[0];

      if (!this.checkNounsAmount(verb, nouns)) return;

      const item = this.player.inventory[object1];
      if (item) {
        if (item.equipped) {
          this.output += `<br>You need to undress the <strong>${item.name}</strong> first!<br>`;
          return;
        }

        this.output += `<br>You drop the <strong>${item.name}</strong> to the ground.<br>`;
        this.rooms[this.whereAmI].objects[object1] = item; // add the item back to the room
        delete this.player.inventory[object1]; // remove from inventory
      } else {
        this.output += `<br>You don't have that in your inventory!<br>`;
      }
    },
    look(_verb, nouns, _preposition) {
      const object1 = nouns[0];
      const objectInRoom = this.rooms[this.whereAmI].objects[object1];

      if (object1 === "inventory") {
        this.inventory();
        return;
      }

      if (nouns.length === 0) {
        this.output += `<br>You see nothing special<br>`;
        return;
      } else if (nouns.length === 1 && this.getDescription(object1)) {
        this.output += `<br>${this.getDescription(object1)}<br>`;

        if (objectInRoom) {
          if (this.additionalCommand(objectInRoom, "look", objectInRoom)) return;
        }
      } else if (nouns.length > 1) {
        this.output += "<br>What do you like to look at?<br>";
        return;
      } else {
        this.output += `<br>You see nothing special<br>`;
      }
    },
    climb(_verb, nouns, _preposition) {
      const object1 = nouns[0];
      const objectInRoom = this.rooms[this.whereAmI].objects[object1];
      if (objectInRoom.canClimb) {
        this.go("go", nouns, _preposition);
      } else {
        this.output += `<br>You can't climb that!<br>`;
      }
    },
    go(verb, nouns, _preposition) {
      const object1 = nouns[0];
      if (!this.checkNounsAmount(verb, nouns)) return;

      const exit = this.getExit(object1);
      const destination = exit ? exit.target : null;

      if (this.rooms[destination]) {
        const handicap = this.rooms[this.whereAmI].objects[exit.handicap];
        if (handicap && !handicap.open) {
          this.output += `<br>You can't go on. The <strong>${handicap.name}</strong> is blocking your way!<br>`;
          return;
        }
        this.whereWasI = this.whereAmI;
        this.whereAmI = destination;
        if (handicap) {
          this.rooms[this.whereAmI].objects[handicap.name].open = true; // open the handicap after going through
        }
        this.output += `<br>You go to the <strong>${this.rooms[destination].name}</strong><br>`;
      } else {
        this.output += `<br>You can't go there!<br>`;
      }
    },
    close(verb, nouns, _preposition) {
      this.open(verb, nouns, _preposition);
    },
    open(verb, nouns, preposition) {
      const object1 = nouns[0];
      const object2 = nouns[1];
      if (!this.checkNounsAmount(verb, nouns)) return;

      const objectInRoom = this.rooms[this.whereAmI].objects[object1];

      if (nouns.length === 2) {
        if (preposition != "with") {
          this.output += `<br>I can't do this<br>`;
          return;
        }
        if (objectInRoom.locked) {
          const item = this.player.inventory[object2];
          if (!item) {
            this.output += `<br>You don't have the <strong>${object2}</strong> in your inventory!<br>`;
            return;
          }
          if (object2 === objectInRoom.locked) {
            objectInRoom.locked = false;
            this.output += `<br>You unlock the <strong>${object1}</strong> with the <strong>${object2}</strong><br>`;
          } else {
            this.output += `<br>The ${object2} doesn't fit!<br>`;
          }
        }
      }

      if (objectInRoom && "open" in objectInRoom) {
        if (!objectInRoom.locked) {
          if (objectInRoom.open && verb === "open") {
            this.output += `<br>The <strong>${object1}</strong> is already open!<br>`;
            return;
          } else if (!objectInRoom.open && verb === "close") {
            this.output += `<br>The <strong>${object1}</strong> is already closed!<br>`;
            return;
          } else {
            objectInRoom.open = !objectInRoom.open; // toggle open state
          }

          this.output += `<br>You ${verb} the <strong>${object1}</strong><br>`;
        } else {
          this.output += `<br>The <strong>${object1}</strong> is locked!<br>`;
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
    <input :disabled="inputDisabled" ref="input" v-model="command" type="text" placeholder="type in here..." />
    <p id="output" ref="output" v-html="output"></p>
  </div>
</template>

<style>
body {
  background-color: black;
}
h3 {
  color: rgb(255, 194, 175);
}
#wrapper {
  font-size: 18px;
  font-family: monospace;
  margin: 0 auto;
  padding: 20px;
  color: white;
  background-color: black;
}
#output {
  height: 500px;
  overflow-y: auto;
}
strong {
  color: rgb(191, 255, 175);
}
i {
  color: #aaa;
}
input {
  font-size: 18px;
  font-family: monospace;
  border: none;
  width: 90%;
  background-color: black;
  color: rgb(214, 214, 214);
  outline: none;
}
</style>
