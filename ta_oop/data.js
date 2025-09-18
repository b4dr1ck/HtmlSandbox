import { player, rooms } from "./init.js";

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
  hear:["hear","listen","listen to",],
  read: ["read"],
  help: ["help", "help me"],
  combine: ["combine", "craft"],
  diagnose: ["diagnose", "condition", "health", "state"],
  dress: ["wear", "dress", "put on", "dress on", "equip", "clothe"],
  undress: ["undress", "take off", "dress off", "disrobe", "unclothe", "strip"],
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
const cmdNotFoundMemes = [
  "What do you want to do?",
  "I don't understand that command.",
  "Please try something else.",
  "I don't know what you mean.",
  "Can you rephrase that?",
  "That doesn't make sense to me.",
  "I'm not sure how to respond to that.",
];
const cantSeeObjectMemes = [
  "You don't see that here.",
  "There's nothing like that here.",
  "You can't find that here.",
  "That object isn't here.",
  "You don't notice that here.",
];

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

const getRoomDescription = (room) => {
  let descText = "";

  descText += `<strong>${room.name}</strong><br><br>`;
  descText += `${room.description}<br>`;

  for (const object in room.objects) {
    if (room.objects[object].sceneryDescription && !room.objects[object].hidden) {
      descText += `${room.objects[object].sceneryDescription}<br>`;
    }
  }

  return descText;
};

const findObject = (key) => {
  if (!key) {
    return null;
  }
  if (rooms[key]) {
    return rooms[key];
  }
  if (player.inventory[key]) {
    return player.inventory[key];
  }
  if (player.currentRoom.objects[key]) {
    return player.currentRoom.objects[key];
  }
  for (const object in player.currentRoom.objects) {
    if (player.currentRoom.objects[object].constructor.name === "Container") {
      if (player.currentRoom.objects[object].contains[key]) {
        return player.currentRoom.objects[object].contains[key];
      }
    }
  }
  return null;
};

export {
  verbs,
  directions,
  prepositions,
  cmdNotFoundMemes,
  cantSeeObjectMemes,
  getRoomAliases,
  getObjectsAliases,
  getInventoryAliases,
  getContainerAliases,
  getRoomDescription,
  findObject,
};
