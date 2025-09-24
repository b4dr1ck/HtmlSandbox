import { outputText } from "../game.js";
import { player, } from "../init.js";
import { findObject, validateObject } from "../utils.js";

export const put = (verb, nouns, preps, orig) => {
  const id = nouns[0];
  const containerId = nouns[1];
  const prep = preps[0];
  const object = findObject(id);
  const container = findObject(containerId);

  if (!validateObject(object, verb, orig)) return;
  if (!container) {
    outputText.push(`Put the <strong>${object.name}</strong> where?`);
    return;
  }

  if (!player.isInInventory(object.uniqueKey)) {
    outputText.push(`You don't have the <strong>${object.name}</strong>.`);
    return;
  }

  if (container.triggers.hasOwnProperty(verb)) {
    outputText.push(container.trigger(verb, object));
    return;
  }

  if (container.constructor.name !== "Container" && container.constructor.name !== "TableLike") {
    outputText.push(`You can't put things in or on the <strong>${container.name}</strong>.`);
    return;
  }

  if (!container.isOpen && container.constructor.name === "Container") {
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
};