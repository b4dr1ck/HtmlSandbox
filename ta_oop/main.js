import { rooms, player } from "./init.js";
import {
  verbs,
  directions,
  prepositions,
  cmdNotFoundMemes,
  getRoomAliases,
  getObjectsAliases,
  getInventoryAliases,
  getContainerAliases,
  getRoomDescription,
  findObject,
} from "./data.js";

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
  console.log(input);

  return input;
};

const commands = {
  look: (verb, nouns, _preps) => {
    const id = nouns[0];
    const object = findObject(id);

    // get room-description if no object specified
    if (!object) {
      const room = rooms[player.currentRoom.uniqueKey].description;
      outputText.push(room);
      return;
    }

    if (object.hidden) {
      outputText.push("You don't see that here.");
      return;
    }

    // trigger if object has a trigger function
    if (object.hasTriggers) {
      object.trigger(verb, object);
      return;
    }

    let desc = "";

    // prefix if object is not in the room
    if (object.whereAmI.place !== "room") {
      desc += `(${object.whereAmI.place}) `;
    }
    desc += object.description;

    // list contents if container
    if (object.constructor.name === "Container") {
      const contents = object.contains;
      if (contents) {
        desc += `<br>${object.containText}`;
        for (const item in contents) {
          desc += `<br>* ${contents[item].name}`;
        }
      }
    }
    outputText.push(desc);
  },
  go: (_verb, nouns, _preps) => {
    const direction = nouns[0];
    const directions = rooms[player.currentRoom.uniqueKey].exits;

    if (!direction || !Object.keys(directions).includes(direction)) {
      outputText.push("Go where?");
      return;
    }

    const destination = player.currentRoom.exits[direction].destination;
    const obstacle = player.currentRoom.exits[direction].obstacle;

    if (obstacle) {
      if (obstacle.constructor.name === "Lockable" && !obstacle.isOpen) {
        outputText.push(`The way is blocked by the <strong>${obstacle.name}</strong>`);
        return;
      }
      outputText.push(`You pass through the <strong>${obstacle.name}</strong> in the <strong>${direction}</strong>`);
    } else {
      outputText.push(`You go <strong>${direction}</strong>.`);
    }

    player.currentRoom = rooms[destination];
    outputText.push(`You have arrived the <strong>${player.currentRoom.name}</strong>.`);
  },
  close: (verb, nouns, _preps) => {
    commands.open(verb, nouns, _preps);
  },
  open: (verb, nouns, _preps) => {
    const id = nouns[0];
    const object = findObject(id);

    if (!object) {
      outputText.push("You don't see that here.");
      return;
    }

    if (object.hidden) {
      outputText.push("You don't see that here.");
      return;
    }

    if (object.constructor.name !== "Container" && object.constructor.name !== "Lockable") {
      outputText.push(`You can't ${verb} the <strong>${object.name}</strong>.`);
      return;
    }

    if (object.isOpen && verb === "open") {
      outputText.push(`The <strong>${object.name}</strong> is already open.`);
      return;
    }

    if (!object.isOpen && verb === "close") {
      outputText.push(`The <strong>${object.name}</strong> is already closed.`);
      return;
    }

    if (object.constructor.name === "Lockable" && object.isLocked) {
      outputText.push(`The <strong>${object.name}</strong> is locked.`);
      return;
    }

    if (verb === "close") {
      object.close();
    } else {
      object.open();
    }
    outputText.push(`You ${verb} the <strong>${object.name}</strong>.`);
  },
};

const outputText = [];
const inputElement = document.querySelector("#input");
const outputElement = document.querySelector("#output");
const roomDesc = document.querySelector("#roomDesc");
roomDesc.innerHTML = getRoomDescription(player.currentRoom);

inputElement.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const inputValue = inputElement.value;
    if (inputValue.trim() === "") return;

    const parsedInput = parseInput(inputValue);

    inputElement.value = "";

    try {
      commands[parsedInput.verb](parsedInput.verb, parsedInput.nouns, parsedInput.preps);
    } catch (error) {
      const randomIndex = Math.floor(Math.random() * cmdNotFoundMemes.length);
      outputText.push(cmdNotFoundMemes[randomIndex]);
    }

    roomDesc.innerHTML = getRoomDescription(player.currentRoom);
    outputElement.innerHTML = outputText.join("<br>");
  }
});
