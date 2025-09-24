import { rooms, player } from "./init.js";
import {
  verbs,
  directions,
  prepositions,
  getRoomAliases,
  getObjectsAliases,
  getInventoryAliases,
  getContainerAliases,
} from "./utils.js";

// commands
import { look } from "./commands/look.js";
import { go } from "./commands/go.js";
import { open } from "./commands/open.js";
import { take } from "./commands/take.js";
import { drop } from "./commands/drop.js";
import { put } from "./commands/put.js";
import { _throw } from "./commands/throw.js";
import { smell } from "./commands/smell.js";
import { read } from "./commands/read.js";
import { dress } from "./commands/dress.js";
import { consume } from "./commands/consume.js";
import { activate } from "./commands/activate.js";
import { inventory } from "./commands/inventory.js";
import { combine } from "./commands/combine.js";
import { scream } from "./commands/scream.js";
import { attack } from "./commands/attack.js";
import { climb } from "./commands/climb.js";
import { use } from "./commands/use.js";
import { move } from "./commands/move.js";
import { jump } from "./commands/jump.js";
import { knock } from "./commands/knock.js";
import { wait } from "./commands/wait.js";

const outputText = [];
const parseInput = (input) => {
  const roomAliases = getRoomAliases(player.currentRoom);
  const objectsAliases = getObjectsAliases(player.currentRoom);
  const inventoryAliases = getInventoryAliases(player);
  const containerAliases = getContainerAliases(player.currentRoom);

  const allAliases = {
    ...verbs,
    ...directions,
    ...roomAliases,
    ...objectsAliases,
    ...inventoryAliases,
    ...containerAliases,
  };

  outputText.push(`<span style="color: gray;">&gt; ${input}</span>`);
  input = input
    .toLowerCase()
    .trim()
    .replaceAll(/\s+/g, " ")
    .replaceAll(" the ", " ")
    .replaceAll(" a ", " ")
    .replaceAll(" an ", " ");

  const originalVerb = input.split(" ")[0];
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

  input = { verb, nouns, preps, originalVerb };
  console.log(input);

  return input;
};

const commands = {
  look,
  go,
  close: open, // handle 'close' actions in the open command
  open,
  take,
  drop,
  put,
  throw: _throw, // "throw" is a reserved word in JS
  taste: smell, // use smell also for taste and hear because only the attribute changes
  hear: smell,
  smell,
  read,
  undress: dress, // handle 'undress' actions in the dress command
  dress,
  consume,
  deactivate: activate, // handle 'deactivate' actions in the activate command
  activate,
  inventory,
  diagnose: () => {
    outputText.push(player.diagnose());
  },
  combine,
  scream,
  fuck: () => {
    outputText.push('"Such language in a high-class establishment like this!"');
  },
  attack,
  climb,
  use,
  move,
  jump,
  knock,
  wait,
  help: () => {
    outputText.push("Available commands:");
    outputText.push(Object.keys(commands).sort().join("<br>"));
  },
};

export { outputText, parseInput, commands };
