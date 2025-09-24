import { outputText } from "../game.js";
import { player, rooms } from "../init.js";
import { findObject, validateObject } from "../utils.js";

export const take = (verb, nouns, _preps, orig) => {
  const id = nouns[0];
  const object = findObject(id);

  if (!validateObject(object, verb, orig)) return;

  if (!object.canTake) {
    outputText.push(`You can't take the <strong>${object.name}</strong>.`);
    return;
  }

  if (player.isInInventory(object.uniqueKey)) {
    outputText.push(`You already have the <strong>${object.name}</strong>.`);
    return;
  }

  // take from container if not in room
  if (object.whereAmI.name !== "room") {
    const containerId = object.whereAmI.key;
    const container = findObject(containerId);
    if (container && (container.constructor.name === "Container" || container.constructor.name === "TableLike")) {
      player.addToInventory(object);
      container.removeItem(object.uniqueKey);
      outputText.push(`You take the <strong>${object.name}</strong> from the <strong>${container.name}</strong>.`);
      return;
    }
  }

  player.addToInventory(object);
  rooms[player.currentRoom.uniqueKey].removeObject(object.uniqueKey);
  outputText.push(`You take the <strong>${object.name}</strong>.`);
};
