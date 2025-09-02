<script>
export default {
  name: "App",
  data() {
    return {
      whereAmI: "room",
      whereWasI: "",
      command: "",
      commandObject: {},
      output: "",
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
        look: ["look", "see", "view", "examine", "inspect", "look at", "show"],
        climb: ["climb", "crawl","climb on","crawl on", "climb up", "crawl up"],
        go: ["go", "walk", "move", "travel", "head"],
        open: ["open", "unlock", "unfasten", "unlatch"],
        close: ["close", "lock", "fasten", "latch"],
        take: ["take", "grab", "collect", "get", "remove", "pick up"],
        drop: ["drop", "discard", "put down"],
        inventory: ["inventory", "items", "bag", "backpack", "pack", "inv"],
        put: ["put", "place", "set", "store", "deposit", "give"],
        consume: ["consume", "eat", "drink"],
        attack: ["attack", "destroy", "bash", "strike", "kill", "hit", "smash"],
        fuck: ["shit", "ass", "cunt", "bitch", "damn"],
        read: ["read"],
      },
      validPrepositions: ["in", "inside", "into", "on", "onto", "at", "to", "with", "from", "about", "for","up"],
      player: {
        inventory: {},
      },
      rooms: {
        deadEnd: {
          name: "Dead End",
          alias: ["dead end", "west path", "blocked path"],
          description:
            "You are at a dead end. The path is blocked by a large rock.<br>" +
            "There is no way to go further west.<br>" +
            "You can go back east to the hallway.<br>",
          exit: {
            east: { target: "hallway" },
          },
          objects: {
            paper: {
              name: "paper",
              alias: ["paper", "small", "note", "piece", "sheet", "writing"],
              description: "a small piece of paper with some words on it",
              scenery: false,
              sceneryDesc: "A <strong>small piece of paper</strong> lies on the ground.",
              canTake: true,
              canRead: "Whoever read this has a small wiener.",
              canBeAttacked: ["hand"],
              condition: "",
              command: {},
            },
            key: {
              name: "chest key",
              alias: ["key", "rusty key", "iron key", "chest key"],
              description: "A rusty iron key that looks like it could fit a small chest.",
              scenery: false,
              sceneryDesc: "A <strong>rusty key</strong> lies on the ground.",
              canTake: true,
              command: {},
            },
            wall: {
              name: "wall",
              alias: ["wall", "walls", "crack", "cracks"],
              description: "The walls are cracked and look like they could collapse at any moment.",
              scenery: true,
              canTake: false,
              command: {},
            },
            rock: {
              name: "rock",
              alias: ["rock", "boulder", "large rock"],
              description: "A large boulder blocks your way. It looks heavy and immovable.",
              scenery: true,
              canTake: false,
              command: {
                take: () => {
                  return "You try to take the rock, but it's too heavy to move.";
                },
              },
            },
          },
        },
        attic: {
          name: "Attic",
          alias: ["attic", "loft", "roof space"],
          description:
            "You are in a dusty dark attic with wooden beams.<br>" +
            "There is a hatch in the north that leads you back to the hallway<br>",
          exit: {
            north: { target: "hallway", handicap: "hatch" },
            down: { target: "hallway", handicap: "hatch" },
          },
          objects: {
            hatch: {
              name: "hatch",
              alias: ["hatch", "wooden hatch", "trapdoor"],
              description: "A wooden hatch that leads down to the hallway.",
              open: false,
              locked: false,
              scenery: true,
              canTake: false,
              command: {},
            },
            goldcoin: {
              name: "gold coin",
              alias: ["gold coin", "coin", "golden coin"],
              description: "A shiny gold coin. It looks valuable.",
              scenery: false,
              hidden: true,
              sceneryDesc: "A <strong>gold coin</strong> lies on the dusty floor.",
              canTake: true,
              command: {},
            },
            rat: {
              name: "rat",
              alias: ["rat", "big rat", "fat rat"],
              description: "A big fat rat scurries around the attic.",
              scenery: false,
              sceneryDesc: "A <strong>big fat rat</strong> scurries around the attic. Something shiny is in its mouth.",
              canTake: false,
              canBeAttacked: ["stone", "ball"],
              command: {
                attack: () => {
                  delete this.rooms.attic.objects.rat; // remove rat from the room
                  this.rooms.attic.objects.goldcoin.hidden = false; // reveal gold coin

                  return "The rat escapes into a hole in the wall. Something shiny falls out of its mouth and rolls across the floor.";
                },
              },
            },
            cobwebs: {
              name: "cobwebs",
              alias: ["cobwebs", "spider webs", "dusty cobwebs", "webs"],
              description: "Dusty cobwebs hang from the beams.",
              scenery: false,
              sceneryDesc: "Dusty <strong>cobwebs</strong> hang everywhere from the beams.",
              canTake: false,
              canBeAttacked: ["hand"],

              command: {
                attack: () => {
                  delete this.rooms.attic.objects.cobwebs; // remove cobwebs from the room
                  return "You swipe the cobwebs away, clearing the space.";
                },
              },
            },
            dust: {
              name: "dust",
              alias: ["dust", "dusty floor", "dusty ground"],
              description: "The floor is covered in a thick layer of dust.",
              scenery: true,
              canTake: false,
              command: {},
            },
          },
        },
        hallway: {
          name: "Hallway",
          alias: ["hallway", "dark hallway", "long hallway"],
          description:
            "You are in a long dark hallway with flickering torches on the walls.<br>" +
            "On the wall on the east is a little chest.<br>" +
            "A door in the north leads you back to the room with the book.<br>" +
            "Another small and dark path leads to the west.<br>" +
            "In front of you in the southern end of the hallway is a ladder that leads up to a hatch.<br>",
          exit: {
            north: { target: "room", handicap: "door" },
            in: { target: "room", handicap: "door" },
            west: { target: "deadEnd" },
            south: { target: "attic", handicap: "hatch" },
            up: { target: "attic", handicap: "hatch" },
            ladder: { target: "attic", handicap: "hatch" },
          },
          objects: {
            chest: {
              name: "chest",
              alias: ["chest", "small chest", "wooden chest"],
              description: "A small wooden chest with a rusty lock.",
              scenery: true,
              canTake: false,
              open: false,
              locked: "key",
              container: {
                storage: {
                  apple: {
                    name: "apple",
                    alias: ["apple", "small apple", "red apple"],
                    description: "A small red apple. It looks fresh and juicy.",
                    scenery: false,
                    sceneryDesc: "A <strong>small apple</strong> lies on the ground.",
                    canTake: true,
                    canConsume: true,
                    command: {
                      consume: () => {
                        const worm = {
                          name: "worm",
                          alias: ["worm", "fat worm", "big worm"],
                          description: "a big fat worm",
                          scenery: false,
                          sceneryDesc: "A <strong>big fat worm</strong> crawls on the ground.",
                          canTake: true,
                          command: {},
                        };
                        this.player.inventory.worm = worm; // add worm to inventory
                        return "As you bite in the apple a big fat worms appears. Yukky!";
                      },
                    },
                  },
                },
                validPrepositions: ["in", "inside", "into"],
              },
              command: {},
            },
            torch: {
              name: "torch",
              alias: ["torch", "torches"],
              description: "The torch is flickering and casting eerie shadows on the walls.",
              scenery: true,
              canTake: false,
              command: {
                take: () => {
                  return "It's fixed to the wall.";
                },
              },
            },
            stone: {
              name: "stone",
              alias: ["stone", "small stone", "pebble"],
              description: "A small stone. It looks like it could be useful.",
              scenery: false,
              sceneryDesc: "A <strong>stone</strong> lies on the ground.",
              canTake: true,
              command: {},
            },
            wall: {
              name: "wall",
              alias: ["wall", "walls", "stone wall"],
              description: "The walls are made of rough stone and are damp to the touch.",
              scenery: true,
              canTake: false,
              command: {},
            },
            door: {
              name: "door",
              alias: ["door", "doors", "wooden door"],
              description: "The door is made of heavy oak and has a rusty iron handle.",
              open: false,
              locked: false,
              scenery: true,
              canTake: false,
              command: {},
            },
            hatch: {
              name: "hatch",
              alias: ["hatch", "wooden hatch", "trapdoor"],
              description: "A wooden hatch that leads down to the hallway.",
              open: false,
              locked: false,
              scenery: true,
              canTake: false,
              command: {},
            },
            ladder: {
              name: "ladder",
              canClimb: true,
              alias: ["ladder", "wooden ladder", "old ladder"],
              description: "A rickety old wooden ladder that leads up to a hatch.",
              scenery: true,
              canTake: false,
              command: {},
            },
          },
        },
        room: {
          name: "Dark Room",
          alias: ["room", "dark room", "small room", "dimly lit room"],
          description:
            "You are in a small dimly lit room with, stone walls and a wooden table in the center.<br>" +
            "On the table, there is a mysterious book. <br>Behind you, in the south, is a door.<br>",
          exit: {
            south: { target: "hallway", handicap: "door" },
            out: { target: "hallway", handicap: "door" },
          },
          objects: {
            table: {
              name: "table",
              alias: ["table", "wooden table", "desk"],
              description: "The table is made of oak and has a few scratches on it.",
              scenery: true,
              canTake: false,
              container: {
                storage: {
                  book: {
                    name: "book",
                    alias: ["book", "red book", "old book", "grimoire", "pentagram"],
                    description:
                      "You see an old dusty book with a red cover that shows a pentagram.<br>Inside the book, there are strange symbols and drawings.",
                    scenery: true,
                    canTake: false,
                    canRead: "..dsadas...dsa343fasf..dadasdsa...",
                    command: {
                      take: () => {
                        return "It seems to be magically bound to the table.";
                      },
                    },
                  },
                },
                validPrepositions: ["on", "onto"],
              },
              command: {},
            },
            wall: {
              name: "wall",
              alias: ["wall", "walls", "stone wall"],
              description: "You see a rough stone wall with moss growing in the cracks.",
              scenery: true,
              canTake: false,
              command: {},
            },
            ball: {
              name: "ball",
              alias: ["ball", "rubber ball", "small ball", "blue ball"],
              description: "A blue small rubber ball.",
              scenery: false,
              sceneryDesc: "A <strong>rubber ball</strong> lies lonesome on the floor.",
              canTake: true,
              command: {},
            },
            door: {
              name: "door",
              alias: ["door", "doors", "wooden door"],
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
        if (!objects[obj].scenery && !objects[obj].hidden) {
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
      const getObjectAliases = () => {
        const objectAliases = {};
        for (const room in this.rooms) {
          objectAliases[room] = this.rooms[room].alias;
          const objects = this.rooms[room].objects;
          for (const obj in objects) {
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

      this.output += `<br>> ${this.command}<br>`;
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
      let condition = "";
      // in the inventory
      if (this.player.inventory[object]) {
        condition = this.player.inventory[object].condition ? `(${this.player.inventory[object].condition})` : "";
        return `(inventory)${condition} ${this.player.inventory[object].description}`;
      }

      // the room itself
      if (object === this.whereAmI) {
        return this.rooms[this.whereAmI].description;
      }

      // object in the room
      const objects = this.rooms[this.whereAmI].objects;
      const objectInRoom = objects[object];
      if (objectInRoom) {
        condition = objectInRoom.condition ? `(${objectInRoom.condition})` : "";
        if (objectInRoom.hidden) {
          return null; // object is hidden
        }
        let desc = `${condition} ${objectInRoom.description}`;
        // is a container
        if (objectInRoom.container && Object.keys(objectInRoom.container.storage).length > 0) {
          if ("open" in objectInRoom) {
            if (objectInRoom.open) {
              desc += `<br>${objectInRoom.container.validPrepositions[0]} the <strong>${objectInRoom.name}</strong> you see:`;
              for (const item in objectInRoom.container.storage) {
                condition = objectInRoom.container.storage[item].condition
                  ? `(${objectInRoom.container.storage[item].condition})`
                  : "";
                desc += `<br><strong>* ${condition} ${objectInRoom.container.storage[item].name}</strong>`;
              }
            }
          } else {
            // if the object is a container but not openable always show the content
            desc += `<br>${objectInRoom.container.validPrepositions[0]} the <strong>${objectInRoom.name}</strong> you see:`;
            for (const item in objectInRoom.container.storage) {
              condition = objectInRoom.container.storage[item].condition
                ? `(${objectInRoom.container.storage[item].condition})`
                : "";
              desc += `<br><strong>* ${condition} ${objectInRoom.container.storage[item].name}</strong>`;
            }
          }
        }
        return desc;
      }
      // object in a container
      for (const obj in objects) {
        if (objects[obj].container && Object.keys(objects[obj].container.storage).length > 0) {
          const item = objects[obj].container.storage[object];
          condition = item.condition ? `(${item.condition})` : "";
          if (item) {
            return `(${objects[obj].container.validPrepositions[0]} ${objects[obj].name})${condition} ${item.description}`;
          }
        }
      }

      return null;
    },
    checkNounsLength(verb, nouns) {
      let maxNouns = 1;
      if (verb === "put" || verb === "open" || verb === "attack") {
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
      let condition = "";
      if (Object.keys(this.player.inventory).length === 0) {
        this.output += `<br>You don't carry anything with you<br>`;
      } else {
        this.output += `<br>Your inventory:<br>`;
        for (const item in this.player.inventory) {
          if (this.player.inventory[item].condition) {
            condition = `(${this.player.inventory[item].condition}) `;
          }
          this.output += `* <strong>${condition}${this.player.inventory[item].name}</strong><br>`;
        }
      }
    },
    read(verb, nouns, _preposition) {
      const object1 = nouns[0];
      if (!this.checkNounsLength(verb, nouns)) return;

      let item = this.player.inventory[object1] || this.rooms[this.whereAmI].objects[object1];
      if (!item) {
        // check container storage
        for (const obj in this.rooms[this.whereAmI].objects) {
          if (
            this.rooms[this.whereAmI].objects[obj].container &&
            Object.keys(this.rooms[this.whereAmI].objects[obj].container.storage).length > 0
          ) {
            if (this.rooms[this.whereAmI].objects[obj].container.storage[object1]) {
              item = this.rooms[this.whereAmI].objects[obj].container.storage[object1];
              break;
            }
          }
        }
      }

      if (item && item.canRead) {
        this.output += `<br>You read the <strong>${item.name}</strong>:<br><i>"${item.canRead}</i>"<br>`;
      } else if (item) {
        this.output += `<br>You can't read the <strong>${item.name}</strong>!<br>`;
      } else {
        this.output += `<br>You can't do that!<br>`;
      }
    },
    attack(verb, nouns, preposition) {
      const object1 = nouns[0];
      const object2 = nouns[1];

      if (!this.checkNounsLength(verb, nouns)) return;
      if (nouns.length === 2) {
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
          this.output += `<br>You can't attack the <strong>${objectDest.name}</strong> with your ${object2}!<br>`;
          return;
        }

        if (objectDest.canBeAttacked.includes(object2)) {
          this.output += `<br>You attack the <strong>${objectDest.name}</strong> with the <strong>${object2}</strong>`;
          objectDest.condition = "broken";
          if (objectDest.command[verb]) {
            this.output += `<br>${objectDest.command[verb]()}`;
          }
        } else {
          this.output += `<br>You can't attack the <strong>${objectDest.name}</strong> with your ${object2}!<br>`;
        }
      } else {
        this.output += `<br>What do you want to attack with what?<br>`;
        return;
      }
    },
    fuck() {
      this.output += '<br>"Such language in a high-class establishment like this!"</br>';
    },
    consume(verb, nouns, _preposition) {
      const object1 = nouns[0];
      if (!this.checkNounsLength(verb, nouns)) return;

      const item = this.player.inventory[object1];

      if (item.command[verb]) {
        this.output += `<br>${item.command[verb]()}`;
      }

      if (item) {
        if (item.canConsume) {
          this.output += `<br>You consume the <strong>${item.name}</strong><br>`;
          delete this.player.inventory[object1]; // remove from inventory
        } else {
          this.output += `<br>You can't consume the <strong>${item.name}</strong>!<br>`;
        }
      } else {
        this.output += `<br>You don't have that in your inventory!<br>`;
      }
    },
    put(verb, nouns, preposition) {
      const object1 = nouns[0];
      const object2 = nouns[1];

      if (!this.checkNounsLength(verb, nouns)) return;
      if (nouns.length === 2) {
        const objectSrc = this.player.inventory[object1];
        const objectDest = this.rooms[this.whereAmI].objects[object2];

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

        delete this.player.inventory[object1];
        objectDest.container.storage[object1] = objectSrc;

        this.output += `<br>You put the <strong>${objectSrc.name}</strong> ${preposition} the <strong>${objectDest.name}</strong><br>`;
      } else {
        this.output += `<br>What do you want to put where?<br>`;
      }
    },
    take(verb, nouns, _preposition) {
      const object1 = nouns[0];

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
        if (object.command[verb]) {
          this.output += `<br>${object.command[verb]()}`;
        }
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

      if (!this.checkNounsLength(verb, nouns)) return;

      const item = this.player.inventory[object1];
      if (item) {
        this.rooms[this.whereAmI].objects[object1] = item; // add the item back to the room
        delete this.player.inventory[object1]; // remove from inventory
        this.output += `<br>You drop the <strong>${object1}</strong> to the ground.<br>`;
      } else {
        this.output += `<br>You don't have that in your inventory!<br>`;
      }
    },
    look(_verb, nouns, _preposition) {
      const object1 = nouns[0];

      if (object1 === "inventory") {
        this.inventory();
        return;
      }

      if (nouns.length === 0) {
        this.output += `<br>You see nothing special<br>`;
        return;
      } else if (nouns.length === 1 && this.getDescription(object1)) {
        this.output += `<br>${this.getDescription(object1)}<br>`;
      } else if (nouns.length > 1) {
        this.output += "<br>What do you like to look at?<br>";
        return;
      } else {
        this.output += `<br>You see nothing special<br>`;
      }
    },
    climb(_verb, nouns, _preposition) {
      const object1 = nouns[0];
      if (this.rooms[this.whereAmI].objects[object1]?.canClimb) {
        this.go("go", nouns, _preposition);
      } else {
        this.output += `<br>You can't climb that!<br>`;
      }
    },
    go(verb, nouns, _preposition) {
      const object1 = nouns[0];
      if (!this.checkNounsLength(verb, nouns)) return;

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
      if (!this.checkNounsLength(verb, nouns)) return;

      const object = this.rooms[this.whereAmI].objects[object1];

      if (nouns.length === 2) {
        if (preposition != "with") {
          this.output += `<br>I can't do this<br>`;
          return;
        }
        if (object.locked) {
          const item = this.player.inventory[object2];
          if (!item) {
            this.output += `<br>You don't have the <strong>${object2}</strong> in your inventory!<br>`;
            return;
          }
          if (object2 === object.locked) {
            object.locked = false;
            this.output += `<br>You unlock the <strong>${object1}</strong> with the <strong>${object2}</strong><br>`;
          } else {
            this.output += `<br>The ${object2} doesn't fit!<br>`;
          }
        }
      }

      if (object && "open" in object) {
        if (!object.locked) {
          if (object.open && verb === "open") {
            this.output += `<br>The <strong>${object1}</strong> is already open!<br>`;
            return;
          } else if (!object.open && verb === "close") {
            this.output += `<br>The <strong>${object1}</strong> is already closed!<br>`;
            return;
          } else {
            object.open = !object.open; // toggle open state
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
    <input ref="input" v-model="command" type="text" placeholder="type in here..." />
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
strong {
  color: rgb(191, 255, 175);
}
input {
  font-size: 18px;
  font-family: monospace;
  border: none;
  width: 90%;
  background-color: rgb(44, 44, 44);
  color: rgb(214, 214, 214);
  outline: none;
}
</style>
