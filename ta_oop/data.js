import { player } from "./init.js";

const verbs = {
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
};
const directions = {
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
};
const prepositions = ["in", "inside", "into", "on", "onto", "at", "to", "with", "from", "about", "for", "up"];

const getRoomAliases = (room) => {
  return { [room.uniqueKey]: room.aliases };
};

const getObjectsAliases = (room) => {
  const aliases = {};
  for (const object in room.objects) {
    aliases[object] = room.objects[object].aliases;
  }
  return aliases;
};

const getInventoryAliases = (player) => {
  const aliases = {};
  for (const item in player.inventory) {
    aliases[item] = player.inventory[item].aliases;
  }
  return aliases;
};

const getContainerAliases = (room) => {
  const aliases = {};
  for (const object in room.objects) {
    if (room.objects[object].constructor.name === "Container") {
      for (const item in room.objects[object].contains) {
        aliases[item] = room.objects[object].contains[item].aliases;
      }
    }
  }
  return aliases;
};

export { verbs, directions, prepositions, getRoomAliases, getObjectsAliases, getInventoryAliases, getContainerAliases };
