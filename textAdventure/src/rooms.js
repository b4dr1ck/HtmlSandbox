import { player } from "./player.js";

export const rooms = {
  deadEnd: {
    name: "Dead End",
    alias: ["dead end", "west path", "blocked path"],
    description:
      "You are at a dead end. The path is blocked by a large rock.<br>" +
      "There is no way to go further west.<br>" +
      "You can go back east to the hallway.<br>",
    exit: {
      east: { target: "hallway" },
      north: { target: "" },
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
    alias: ["attic", "loft", "roof space"],
    description:
      "You are in a dusty dark attic with wooden beams.<br>" +
      "There is a hatch in the north that leads you back to the hallway<br>",
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
        canBeAttacked: ["stone", "ball", "hand"],
        command: {
          attack: (object) => {
            if (object === "hand") {
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
                  player.inventory.worm = worm; // add worm to inventory
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
        canPull: true,
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
      "You are in a small dimly lit room with, stone walls and a wooden table in the center.<br>" +
      "On the western wall is a little old looking switch that seems to control the light.<br>" +
      "On the table, there is a mysterious book<br>" +
      "Behind you, in the south, is a door.<br>",
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
      switch: {
        name: "switch",
        alias: ["switch", "light switch", "old switch"],
        description: "An old rusty switch on the wall. It looks like it hasn't been used in a long time.",
        scenery: true,
        canTake: false,
        isActive: false,
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
};
