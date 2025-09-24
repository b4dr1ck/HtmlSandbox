import { outputText } from "../game.js";
import { player } from "../init.js";
import { findObject, validateObject } from "../utils.js";

export const dress = (verb, nouns, _preps, orig) => {
  const id = nouns[0];
  const object = findObject(id);

  if (!validateObject(object, verb, orig)) return;

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
};
