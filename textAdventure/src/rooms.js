import { player } from "./player.js";

// items you've created by combining other items
export const newItems = {
  stoneball: {
    name: "stoneball",
    alias: ["stoneball", "ball", "stone", "stone ball"],
    description: "A 'stoneball' made by combining a stone and a ball. Stupid and useless.",
    scenery: false,
    sceneryDesc: "A <strong>stoneball</strong> lies on the ground.",
    canTake: true,
    command: {},
  },
};

// all rooms in the game
export const rooms = {
  hiddenRoom: {
    name: "Hidden Room",
    alias: ["hidden room", "secret room", "dark room"],
    description:
      "You are in a small dark cave-like room.<br>" +
      "It's too dark to see anything<br>" +
      "Behind you in the south is a narrow path that leads back to the dead end.",
    exit: {
      south: { target: "deadEnd" },
      out: { target: "deadEnd" },
    },
    objects: {
      torch: {
        name: "torch",
        alias: ["torch", "torches"],
        description: "An old wooden torch hanging on the wall.",
        scenery: false,
        sceneryDesc: "<br>Near the entrance is a <strong>torch</strong> on the wall.",
        canTake: false,
        isLighted: false,
        command: {
          take: () => {
            return "It's fixed to the wall.";
          },
          light: () => {
            rooms.hiddenRoom.objects.bookshelf.hidden = false;
            rooms.hiddenRoom.description =
              "You are in a small cave-like room." +
              "Behind you in the south is a narrow path that leads back to the dead end.";

            return "The room is now illuminated.";
          },
          extinguish: () => {
            rooms.hiddenRoom.objects.bookshelf.hidden = true;
            rooms.hiddenRoom.description =
              "You are in a small cave-like room.<br>" +
              "It's too dark to see any details.<br>" +
              "Behind you in the south is a narrow path that leads back to the dead end.";

            return "The room is now dark again.";
          },
        },
      },
      vendingmachine: {
        name: "vending machine",
        alias: ["vending machine", "vendor machine", "machine"],
        description: "An old rusty vending machine, with the a sign 'Snacks' on it.",
        scenery: true,
        canTake: false,
        container: {
          storeOnly: true,
          storage: {},
          validPrepositions: ["in", "inside", "into"],
        },
        command: {
          put: (object) => {
            if (object === "goldcoin") {
              return "You insert the coin into the vending machine.";
            } else {
              return "The vending machine only accepts coins.";
            }
          },
        },
      },
      bookshelf: {
        name: "bookshelf",
        alias: ["bookshelf", "shelf", "wooden bookshelf", "books"],
        description: "A wooden bookshelf filled with old dusty books and some miscellaneous items.",
        scenery: false,
        sceneryDesc: "A <strong>wooden bookshelf</strong> stands against the wall.",
        canTake: false,
        hidden: true,
        container: {
          storeOnly: false,
          storage: {
            glasses: {
              name: "glasses",
              alias: ["glasses", "pair of glasses", "spectacles", " old glasses"],
              description: "A pair of old-fashioned round glasses with thin metal red frames.",
              scenery: false,
              sceneryDesc: "A <strong>pair of glasses</strong> lies on the ground.",
              canTake: true,
              canWear: true,
              equipped: false,
              command: {},
            },
          },
          containText: "<br>Some interesting items are on the shelf:",
          validPrepositions: ["on", "onto"],
        },
        command: {},
      },
    },
  },
  deadEnd: {
    name: "Dead End",
    alias: ["dead end", "west path", "blocked path"],
    description:
      "You are at a dead end. The path is blocked by a large rock.<br>" +
      "There is no way to go further west.<br>" +
      "You can go back east to the hallway.<br>",
    exit: {
      east: { target: "hallway" },
      north: { target: "hiddenRoom" },
      in: { target: "hiddenRoom" },
    },
    objects: {
      secretPath: {
        name: "secret path",
        alias: ["secret path", "hidden path", "narrow path", "small path", "path", "secret"],
        description: "A narrow hidden path on the wall in the north that seems to lead somewhere into the dark",
        hidden: true,
        scenery: false,
        sceneryDesc: "There's a <strong>secret path</strong> on the northern wall to see.",
        command: {},
      },
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
    smell: "It smells like old wood and dust and mold",
    alias: ["attic", "loft", "roof space"],
    description:
      "You are in a dark attic.<br>" +
      "Old wooden beams support the roof and the wooden floor is covered in a thick layer of dust.<br>" +
      "There is a hatch behind you on the ground that leads you back to the hallway.<br>",
    exit: {
      north: { target: "hallway", handicap: "hatch" },
      down: { target: "hallway", handicap: "hatch" },
      ladder: { target: "hallway", handicap: "hatch" },
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
      ladder: {
        name: "ladder",
        canClimb: true,
        alias: ["ladder", "wooden ladder", "old ladder"],
        description: "A rickety old wooden ladder that leads down to the halllway.",
        scenery: true,
        canTake: false,
        command: {},
      },
      water: {
        name: "bottle of water",
        alias: ["water", "bottle of water", "bottle", "plastic bottle"],
        description: "A plastic bottle filled with dirty brown water.",
        scenery: false,
        sceneryDesc: "A <strong>bottle of water</strong> stands on the ground.",
        canTake: true,
        isLiquid: true,
        canConsume: true,
        command: {
          consume: () => {
            player.condition = "dead";
            return "You drink the dirty water and immediately feel sick. Before you can react you collapse to the ground.";
          },
        },
      },
      goldcoin: {
        name: "gold coin",
        alias: ["gold coin", "coin", "golden coin"],
        description: "A shiny gold coin. It looks valuable.",
        scenery: false,
        hidden: true,
        sceneryDesc: "A <strong>gold coin</strong>  glimmers on the floor.",
        canTake: true,
        command: {},
      },
      clothes: {
        name: "old clothes",
        smell: "They smell moldy and old. You wrinkle your nose.",
        alias: ["clothes", "old clothes", "tattered clothes", "rags"],
        description: "The clothes are old, tattered and dirty. They look like they haven't been worn in years.",
        scenery: false,
        sceneryDesc: "Some <strong>old tattered clothes</strong> lie on the ground.",
        canWear: true,
        equipped: false,
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
        canBeAttacked: ["stone", "ball", "hand"],
        command: {
          scream: () => {
            delete rooms.attic.objects.rat; // remove rat from the room
            rooms.attic.objects.goldcoin.hidden = false; // reveal gold coin

            return "As you scream the rat escapes into a hole in the wall. Something shiny falls out of its mouth and rolls across the floor.";
          },
          attack: (object) => {
            if (object === "hand") {
              player.condition = "dead";
              return "Ouch! The rat bites you. Maybe you should use something else to attack it.";
            }
            delete rooms.attic.objects.rat; // remove rat from the room
            rooms.attic.objects.goldcoin.hidden = false; // reveal gold coin
            delete player.inventory[object]; // remove the used object from inventory

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
            delete rooms.attic.objects.cobwebs; // remove cobwebs from the room
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
    smell: "It smells musty and damp and you smell the smoke of burning torches.",
    name: "Hallway",
    alias: ["hallway", "dark hallway", "long hallway", "corridor"],
    description:
      "You are in a long dark hallway. The walls are made of stones and there is a torch on the western wall.<br>" +
      "On the wall to the east is a little chest on the ground.<br>Above that chest you see a window - it's dark outside.<br>" +
      "A door in the north leads you back to the room with the book.<br>" +
      "Another small and dark path leads to the west into the unknown.<br>" +
      "In front of you in the southern end of the hallway is a ladder on a wall that leads up to a hatch.<br>",
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
          storeOnly: false,
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
                  player.inventory.worm = worm; // add worm to inventory
                  return "As you bite in the apple a big fat worms appears. Yukky!";
                },
              },
            },
            matches: {
              name: "matches",
              alias: ["matches", "box of matches", "matchbox"],
              description: "A small box of matches. It could be useful to light something.",
              scenery: false,
              sceneryDesc: "A <strong>box of matches</strong> lies on the ground.",
              canTake: true,
              isLighted: false,
              command: {},
            },
          },
          validPrepositions: ["in", "inside", "into"],
        },
        command: {},
      },
      window: {
        name: "window",
        alias: ["window", "small window", "glass window", "wooden window"],
        description:
          "A small window where the moonligh shines right through.<br>Outside you see the silhouette of a dark and big forest.",
        scenery: true,
        canTake: false,
        command: {
          look: () => {
            rooms.hallway.objects.nest.hidden = false;
            return "On a closer look you see a <strong>small bird nest<strong> on the window sill.";
          },
        },
      },
      nest: {
        name: "nest",
        alias: ["nest", "bird nest", "small nest"],
        description: "A small bird nest with a few twigs and feathers lies on the window sill.",
        scenery: false,
        sceneryDesc: "A <strong>bird nest</strong> lies on the window sill.",
        hidden: true,
        canTake: false,
        container: {
          storeOnly: false,
          storage: {},
          validPrepositions: ["in", "inside", "into"],
        },
        command: {
          take: () => {
            return "It would break if you take it.";
          },
        },
      },
      torch: {
        name: "torch",
        alias: ["torch", "torches"],
        description: "The torch is made of wood and hangs on the wall.",
        scenery: true,
        canTake: false,
        canPull: true,
        isLighted: true,
        command: {
          pull: () => {
            rooms.deadEnd.objects.secretPath.hidden = false;

            return "A strange noise 'krrrrrrrr' echoes through the hallway. It feels like a stone wall has moved somewhere.";
          },
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
        canBeCombined: ["ball"],
        combinationResult: "stoneball",
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
        description: "A wooden hatch that leads up to the attic.",
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
      "You are in the center of a small dimly lit room.<br>Beside you, on the eastern wall, is a table with a book on it.<br>" +
      "The room has stone walls and on the the western wall is a little switch that seems to control the light.<br>" +
      "Behind you, in the south, is the only door.<br>",
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
          storeOnly: false,
          storage: {
            book: {
              name: "book",
              alias: ["book", "red book", "old book", "grimoire", "pentagram"],
              description:
                "You see an old dusty book with a red cover that shows a pentagram.<br>Inside the book, there are strange symbols and drawings.",
              scenery: true,
              canTake: false,
              canRead: "...§2!%$8...{½¼³½34..",
              command: {
                take: () => {
                  return "It seems to be magically bound to the table.";
                },
                read: () => {
                  if (player.inventory.glasses && player.inventory.glasses.equipped) {
                    return "With the glasses you can read some lines of the book:<br><i>\"Speak the word 'hctibuoykcuf' in the dark hideout!\"<i>";
                  } else {
                    return "You don't understand a single word.";
                  }
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
      switch: {
        name: "switch",
        alias: ["switch", "light switch", "old switch"],
        description: "An old rusty switch on the wall. It looks like it hasn't been used in a long time.",
        scenery: true,
        canTake: false,
        isActive: false,
        command: {
          activate: () => {
            return "Nothing happens. Maybe it's broken?!";
          },
        },
      },
      ball: {
        name: "ball",
        smell: "It smells like rubber.",
        alias: ["ball", "rubber ball", "small ball", "blue ball"],
        description: "A blue small rubber ball.",
        scenery: false,
        sceneryDesc: "A <strong>rubber ball</strong> lies lonesome on the floor.",
        canTake: true,
        canConsume: true,
        canBeCombined: ["stone"],
        combinationResult: "stoneball",
        command: {
          consume: () => {
            player.condition = "dead";
            return "You choke on the ball. Maybe you should not have eaten that.";
          },
        },
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
};
