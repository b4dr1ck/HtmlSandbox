import { outputText } from "../game.js";
import { findObject, validateObject } from "../utils.js";
import { player } from "../init.js";

export const open = (verb, nouns, preps, orig) => {
  const id = nouns[0];
  const prep = preps[0];
  const object = findObject(id);

  if (!validateObject(object, verb, orig)) return;

  if (
    object.constructor.name !== "Container" &&
    object.constructor.name !== "Lockable" &&
    object.constructor.name !== "TableLike"
  ) {
    outputText.push(`You can't ${verb} the <strong>${object.name}</strong>.`);
    return;
  }

  if (object.constructor.name === "TableLike") {
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
};