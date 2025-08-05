export const rooms = {
  westPath: {
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
  hallway: {
    name: "Hallway",
    alias: ["hallway", "dark hallway", "long hallway"],
    description:
      "You are in a long dark hallway with flickering torches on the walls.<br>" +
      "On the wall on the east is a little chest.<br>" +
      "A door in the north leads you back to the room with the book.<br>" +
      "Another small and dark path leads to the west.<br>",
    exit: {
      north: { target: "room", handicap: "door" },
      west: { target: "westPath" },
    },
    objects: {
      chest: {
        name: "chest",
        alias: ["chest", "small chest", "wooden chest"],
        description: "A small wooden chest with a rusty lock.",
        scenery: true,
        canTake: false,
        open: false,
        container: {
          storage:[],
          validPrepositions: ["in", "inside"],
        },
        command: {
        },
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
        alias: ["door", "doors"],
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
    alias: ["room", "dark room", "small room", "dimly lit room"],
    description:
      "You are in a small dimly lit room with stone walls and a wooden table in the center.<br>" +
      "On the table, there is a mysterious book. <br>Behind you, in the south, is a door.<br>",
    exit: {
      south: { target: "hallway", handicap: "door" },
    },
    objects: {
      book: {
        name: "book",
        alias: ["book", "red book", "old book", "grimoire", "pentagram"],
        description: "You see an old dusty book with a red cover that shows a pentagram",
        scenery: true,
        canTake: false,
        command: {
          take: () => {
            return "It seems to be magically bound to the table.";
          },
        },
      },
      table: {
        name: "table",
        alias: ["table", "wooden table", "desk"],
        description: "The table is made of oak and has a few scratches on it.",
        scenery: true,
        canTake: false,
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
};
