import { player } from "../init.js";
import { findObject } from "../utils.js";
import { outputText, commands } from "../game.js";

export const use = (verb, nouns, preps, _orig) => {
  const id1 = nouns[0];
  const id2 = nouns[1];
  const prep = preps[0];

  const object1 = findObject(id1);
  const object2 = findObject(id2);

  if (!object1) {
    outputText.push(`Use what?`);
    return;
  }

  if (!player.isInInventory(object1.uniqueKey)) {
    outputText.push(`You don't have the <strong>${object1.name}</strong>.`);
    return;
  }

  // call the consume command if object1 is consumable and no object2
  if (object1.constructor.name === "Consumable" && !object2) {
    commands.consume("consume", [object1.uniqueKey], []);
    return;
  }

  if (!object2) {
    outputText.push(`Use the <strong>${object1.name}</strong> where?`);
    return;
  }

  if (prep !== "on" && prep !== "with") {
    outputText.push(`Wrong syntax. Use "use [object1] on/with [object2]".`);
    return;
  }

  // call the combine command if objects are combineable
  if (object1.constructor.name === "Combineable" && object2.constructor.name === "Combineable") {
    commands.combine("combine", [object1.uniqueKey, object2.uniqueKey], [prep]);
    return;
  }

  // call the open with object command if object2 is lockable or container
  if ((object2.constructor.name === "Lockable" || object2.constructor.name === "Container") && object2.isLocked) {
    commands.open("open", [object2.uniqueKey], [prep]);
    return;
  }

  if (object2.triggers.hasOwnProperty(verb)) {
    outputText.push(object2.trigger(verb, object1));
  } else {
    outputText.push(`You can't use the <strong>${object1.name}</strong> on the <strong>${object2.name}</strong>.`);
  }
};
