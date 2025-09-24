import { outputText } from "../game.js";
import { player } from "../init.js";
import { findObject, validateObject } from "../utils.js";

export const smell = (verb, nouns, _preps, orig) => {
  const id = nouns[0];
  const object = findObject(id);

  if (!object || object.constructor.name === "Room") {
    outputText.push(player.currentRoom[verb]);
    return;
  }

  if (!validateObject(object, verb, orig)) return;

  if (!object[verb]) {
    outputText.push(`The <strong>${object.name}</strong> doesn't have a ${verb}.`);
    return;
  }

  outputText.push(object[verb]);
};
