import { outputText,commands } from "../game.js";
import { findObject, validateObject } from "../utils.js";

export const climb = (verb, nouns, preps, orig) => {
  const id = nouns[0];
  const object = findObject(id);

  if (!validateObject(object, verb, orig)) return;

  if (object.canClimb) {
    outputText.push("You climb the " + object.name + ".");
    commands.go(verb, [object.uniqueKey], preps, orig);
  } else {
    outputText.push(`You can't climb the <strong>${object.name}</strong>.`);
  }
};