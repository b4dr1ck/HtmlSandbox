import { outputText } from "../game.js";
import { player, rooms } from "../init.js";
import { findObject, validateObject } from "../utils.js";

export const _throw = (verb, nouns, preps, orig) => {
  const id = nouns[0];
  const targetId = nouns[1];
  const prep = preps[0];
  const object = findObject(id);
  const target = findObject(targetId);

  if (!validateObject(object, verb, orig)) return;
  if (!target) {
    outputText.push(`Throw the <strong>${object.name}</strong> where?`);
    return;
  }

  if (!player.isInInventory(object.uniqueKey)) {
    outputText.push(`You don't have the <strong>${object.name}</strong>.`);
    return;
  }

  if (!object.canThrow) {
    outputText.push(`You can't throw the <strong>${object.name}</strong>.`);
    return;
  }

  if (prep !== "at" && prep !== "to") {
    outputText.push(`Wrong syntax. Use "throw [object] at/to [target]".`);
    return;
  }

  if (target.triggers.hasOwnProperty(verb)) {
    outputText.push(object.trigger(verb, target));
  } else {
    outputText.push(
      `You throw the <strong>${object.name}</strong> at the <strong>${target.name}</strong>, but nothing happens.`
    );
  }

  player.removeFromInventory(object.uniqueKey);
  rooms[player.currentRoom.uniqueKey].addObjects(object);
};