import { outputText } from '../game.js';
import { player, rooms } from '../init.js';
import { findObject, validateObject } from '../utils.js';

export const drop = (verb, nouns, _preps, orig) => {
  const id = nouns[0];
  const object = findObject(id);

  if (!validateObject(object, verb, orig)) return;

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
};