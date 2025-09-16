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

const commands = {
  look: (verb, nouns, preps) => {
    outputText.push(`You look at the <strong>${nouns}</strong>`);
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
    outputElement.scrollTop = outputElement.scrollHeight;
  }
});
