import { outputText } from "../game.js";
import { player } from "../init.js";
import { findObject, validateObject } from "../utils.js";

export const consume = (verb, nouns, _preps, orig) => {
  const id = nouns[0];
  const object = findObject(id);

  if (!validateObject(object, verb, orig)) return;

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
};
