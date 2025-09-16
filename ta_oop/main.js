import { rooms, player } from "./init.js";
import {
  verbs,
  directions,
  prepositions,
  getRoomAliases,
  getObjectsAliases,
  getInventoryAliases,
  getContainerAliases,
} from "./data.js";

const parseInput = (input) => {
  const roomAliases = getRoomAliases(player.currentRoom);
  const objectsAliases = getObjectsAliases(player.currentRoom);
  const inventoryAliases = getInventoryAliases(player);
  const containerAliases = getContainerAliases(player.currentRoom);

  const allAliases = {
    ...verbs,
    ...roomAliases,
    ...objectsAliases,
    ...inventoryAliases,
    ...containerAliases,
  };

  input = input
    .toLowerCase()
    .trim()
    .replaceAll(/\s+/g, " ")
    .replaceAll(" the ", " ")
    .replaceAll(" a ", " ")
    .replaceAll(" an ", " ");

  for (const alias in allAliases) {
    for (const term of allAliases[alias]) {
      const regex = new RegExp(`\\b${term}\\b`, "gi");
      if (input.match(regex)) {
        input = input.replaceAll(regex, alias);
      }
    }
  }

  input = input.split(" ");

  const verb = Object.keys(verbs).includes(input[0]) ? input.shift() : null;
  const preps = input.filter((word) => prepositions.includes(word));
  const nouns = input.filter((word) => Object.keys(allAliases).includes(word) && !prepositions.includes(word));

  input = { verb, nouns, preps };

  return input;
};

const commands = {
  look: (verb, nouns, preps) => {
    console.log(`You look at the ${nouns}`);
  },
};

const parsedInput = parseInput("look at the chest");

if (parsedInput.verb) {
  commands[parsedInput.verb](parsedInput.verb, parsedInput.nouns, parsedInput.preps);
}
