import { rooms, player } from "./init.js";
import {
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

const validateObject = (object, verb) => {
  if (!object) {
    outputText.push(`${verb} what?`);
    return false;
  }
  if (object.hidden) {
    const randomIndex = Math.floor(Math.random() * cantSeeObjectMemes.length);
    outputText.push(cantSeeObjectMemes[randomIndex]);
    return false;
  }

  if (object.hasTriggers) {
    outputText.push(object.trigger(verb, object));
    return false;
  }
  return true;
};

const commands = {
  look: (verb, nouns, _preps) => {
    const id = nouns[0];
    const object = findObject(id);

    if (!validateObject(object, verb)) return;

    let desc = "";

    // prefix if object is not in the room
    if (object.whereAmI.place !== "room") {
      desc += `(${object.whereAmI.place}) `;
    }
    desc += object.description;

    // list contents if container
    if (object.constructor.name === "Container") {
      const contents = object.contains;
      if (Object.keys(contents).length) {
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
    const directions = Object.keys(rooms[player.currentRoom.uniqueKey].exits);

    if (!direction) {
      outputText.push("Go where?");
      return;
    }

    if (!directions.includes(direction)) {
      outputText.push(`You can't go <strong>${direction}</strong> from here.`);
      return;
    }

    const destination = player.currentRoom.exits[direction].destination;
    const obstacle = player.currentRoom.exits[direction].obstacle;
    const trigger = player.currentRoom.exits[direction].trigger;

    if (trigger) {
      outputText.push(trigger());
      return;
    }

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
  open: (verb, nouns, preps) => {
    const id = nouns[0];
    const prep = preps[0];
    const object = findObject(id);

    if (!validateObject(object, verb)) return;

    if (object.constructor.name !== "Container" && object.constructor.name !== "Lockable") {
      outputText.push(`You can't ${verb} the <strong>${object.name}</strong>.`);
      return;
    }

    if (object.alwaysOpen) {
      outputText.push(`The <strong>${object.name}</strong> can't be ${verb}ed.`);
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

    // open locked object with a key
    if ((object.constructor.name === "Container" || object.constructor.name === "Lockable") && object.isLocked) {
      const key = player.isInInventory(object.keyName);
      if (!key) {
        outputText.push(`You don't have the key for the <strong>${object.name}</strong>.`);
      }
      if (prep === "with") {
        object.unlock(object.keyName);
        outputText.push(`You unlock the <strong>${object.name}</strong> with the <strong>${key.name}</strong>.`);
      } else {
        outputText.push(`The <strong>${object.name}</strong> is locked.`);
        return;
      }
    }

    if (verb === "close") {
      object.close();
    } else {
      object.open();
    }
    outputText.push(`You ${verb} the <strong>${object.name}</strong>.`);
  },
  take: (verb, nouns, _preps) => {
    const id = nouns[0];
    const object = findObject(id);

    if (!validateObject(object, verb)) return;

    if (!object.canTake) {
      outputText.push(`You can't take the <strong>${object.name}</strong>.`);
      return;
    }

    if (player.isInInventory(object.uniqueKey)) {
      outputText.push(`You already have the <strong>${object.name}</strong>.`);
      return;
    }

    // take from container if not in room
    if (object.whereAmI.place !== "room") {
      const containerId = object.whereAmI.place;
      const container = findObject(containerId);
      if (container && container.constructor.name === "Container") {
        player.addToInventory(object);
        container.removeItem(object.uniqueKey);
        outputText.push(`You take the <strong>${object.name}</strong> from the <strong>${container.name}</strong>.`);
        return;
      }
    }
    player.addToInventory(object);
    rooms[player.currentRoom.uniqueKey].removeObject(object.uniqueKey);
    outputText.push(`You take the <strong>${object.name}</strong>.`);
  },
  drop: (verb, nouns, _preps) => {
    const id = nouns[0];
    const object = findObject(id);

    if (!validateObject(object, verb)) return;

    if (!player.isInInventory(object.uniqueKey)) {
      outputText.push(`You don't have the <strong>${object.name}</strong>.`);
      return;
    }

    if (object.isEquipped) {
      outputText.push(`You must undress from the <strong>${object.name}</strong> before dropping it.`);
      return;
    }

    player.removeFromInventory(object.uniqueKey);
    rooms[player.currentRoom.uniqueKey].addObjects(object);
    outputText.push(`You drop the <strong>${object.name}</strong>.`);
  },
  put: (verb, nouns, preps) => {
    const id = nouns[0];
    const containerId = nouns[1];
    const prep = preps[0];

    const object = findObject(id);
    const container = findObject(containerId);

    if (!validateObject(object, verb)) return;
    if (!container) {
      outputText.push(`Put the <strong>${object.name}</strong> where?`);
      return;
    }

    if (container.constructor.name !== "Container") {
      outputText.push(`You can't put things in the <strong>${container.name}</strong>.`);
      return;
    }

    if (!player.isInInventory(object.uniqueKey)) {
      outputText.push(`You don't have the <strong>${object.name}</strong>.`);
      return;
    }

    if (!container.isOpen && !container.alwaysOpen) {
      outputText.push(`The <strong>${container.name}</strong> is closed.`);
      return;
    }

    if (!container.validPrepositions.includes(prep)) {
      outputText.push(`You can't put things ${prep} the <strong>${container.name}</strong>.`);
      return;
    }

    player.removeFromInventory(object.uniqueKey);
    container.addItems(object);
    outputText.push(`You put the <strong>${object.name}</strong> ${prep} the <strong>${container.name}</strong>.`);
  },
  hear: (verb, nouns, _preps) => {
    commands.smell(verb, nouns, _preps);
  },
  smell: (verb, nouns, _preps) => {
    const id = nouns[0];
    const object = findObject(id);

    if (!validateObject(object, verb)) return;

    if (!object[verb]) {
      outputText.push(`The <strong>${object.name}</strong> doesn't have a ${verb}.`);
      return;
    }

    outputText.push(object[verb]);
  },
  read: (verb, nouns, _preps) => {
    const id = nouns[0];
    const object = findObject(id);

    if (!validateObject(object, verb)) return;

    if (!object.read) {
      outputText.push(`You can't read the <strong>${object.name}</strong>.`);
      return;
    }

    outputText.push(`You read the <strong>${object.name}</strong> and it says:`);
    outputText.push(`"${object.read}"`);
  },
  undress: (verb, nouns, _preps) => {
    commands.dress(verb, nouns, _preps);
  },
  dress: (verb, nouns, _preps) => {
    const id = nouns[0];
    const object = findObject(id);

    if (!validateObject(object, verb)) return;

    if (object.constructor.name !== "Equipment" && !object.canWear) {
      outputText.push(`You can't wear the <strong>${object.name}</strong>.`);
      return;
    }

    if (!player.isInInventory(object.uniqueKey)) {
      outputText.push(`You don't have the <strong>${object.name}</strong>.`);
      return;
    }

    if (object.isEquipped && verb === "dress") {
      outputText.push(`You already wear <strong>${object.name}</strong>.`);
      return;
    }

    if (!object.isEquipped && verb === "undress") {
      outputText.push(`You don't wear the <strong>${object.name}</strong>.`);
      return;
    }

    object[verb]();
    if (verb === "dress") {
      outputText.push(`You put on the <strong>${object.name}</strong>.`);
    } else {
      outputText.push(`You take off the <strong>${object.name}</strong>.`);
    }
  },
  consume: (verb, nouns, _preps) => {
    const id = nouns[0];
    const object = findObject(id);

    if (!validateObject(object, verb)) return;

    if (object.constructor.name !== "Consumable") {
      outputText.push(`You can't consume the <strong>${object.name}</strong>.`);
      return;
    }

    if (!player.isInInventory(object.uniqueKey)) {
      outputText.push(`You don't have the <strong>${object.name}</strong>.`);
      return;
    }

    player.removeFromInventory(object.uniqueKey);
    outputText.push(`You consume the <strong>${object.name}</strong>.`);
  },
  deactivate: (verb, nouns, _preps) => {
    commands.activate(verb, nouns, _preps);
  },
  activate: (verb, nouns, _preps) => {
    const id = nouns[0];
    const object = findObject(id);

    if (!validateObject(object, verb)) return;

    if (object.constructor.name !== "TriggerObject") {
      outputText.push(`You can't ${verb} the <strong>${object.name}</strong>.`);
      return;
    }

    if (verb === "activate") {
      if (object.state) {
        outputText.push(`The <strong>${object.name}</strong> is already on.`);
        return;
      }
      object.turnOn();
    } else {
      if (!object.state) {
        outputText.push(`The <strong>${object.name}</strong> is already off.`);
        return;
      }
      object.turnOff();
    }
    outputText.push(`You ${verb} the <strong>${object.name}</strong>.`);
  },
  inventory() {
    if (player.isInventoryEmpty()) {
      outputText.push("Your don't carry anything with you.");
      return;
    }

    outputText.push("You are carrying:");
    for (const item in player.inventory) {
      if (player.inventory[item].isEquipped) {
        outputText.push(`* (equipped) ${player.inventory[item].name}`);
        continue;
      }
      outputText.push(`* ${player.inventory[item].name}`);
    }
  },
  combine: (verb, nouns, preps) => {
    const id1 = nouns[0];
    const id2 = nouns[1];

    const object1 = findObject(id1);
    const object2 = findObject(id2);

    if (!validateObject(object1, verb)) return;
    if (!validateObject(object2, verb)) return;

    if (object1.constructor.name !== "Combineable" || object2.constructor.name !== "Combineable") {
      outputText.push(
        `You can't combine the <strong>${object1.name}</strong> and the <strong>${object2.name}</strong>.`
      );
      return;
    }

    if (!player.isInInventory(object1.uniqueKey) || !player.isInInventory(object2.uniqueKey)) {
      outputText.push(
        `You must have both the <strong>${object1.name}</strong> and the <strong>${object2.name}</strong> to combine them.`
      );
      return;
    }

    if (preps[0] !== "with" && preps[0] !== "and") {
      outputText.push(`Wrong syntax. Use "combine [object1] with/and [object2]".`);
      return;
    }

    if (object1.combine(object2)) {
      player.removeFromInventory(object1.uniqueKey);
      player.removeFromInventory(object2.uniqueKey);
      player.addToInventory(object1.combineResult);

      outputText.push(
        `You combine the <strong>${object1.name}</strong> with the <strong>${object2.name}</strong> to create a <strong>${object1.combineResult.name}</strong>.`
      );
    } else {
      outputText.push(
        `You can't combine the <strong>${object1.name}</strong> with the <strong>${object2.name}</strong>.`
      );
    }
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
      console.error(error);
      const randomIndex = Math.floor(Math.random() * cmdNotFoundMemes.length);
      outputText.push(cmdNotFoundMemes[randomIndex]);
    }

    roomDesc.innerHTML = getRoomDescription(player.currentRoom);
    outputElement.innerHTML = outputText.join("<br>");

    // always scroll to the bottom of the outputElement after each input
    outputElement.scrollTop = outputElement.scrollHeight;

    console.log(rooms, player);
  }
});
