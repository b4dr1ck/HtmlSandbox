import { outputText } from "../game.js";
import { findObject, validateObject } from "../utils.js";
import { player } from "../init.js";

export const combine = (verb, nouns, preps, orig) => {
  const id1 = nouns[0];
  const id2 = nouns[1];
  const prep = preps[0];

  const object1 = findObject(id1);
  const object2 = findObject(id2);

  if (!validateObject(object1, verb, orig)) return;
  if (!validateObject(object2, verb, orig)) return;

  if (object1.constructor.name !== "Combineable" || object2.constructor.name !== "Combineable") {
    outputText.push(
      `You can't combine the <strong>${object1.name}</strong> and the <strong>${object2.name}</strong>.`
    );
    return;
  }

  if (!player.isInInventory(object1.uniqueKey) || !player.isInInventory(object2.uniqueKey)) {
    outputText.push(
      `You must have both the <strong>${object1.name}</strong> and the <strong>${object2.name}</strong> to combine them.`
    );
    return;
  }

  if (prep !== "with" && prep !== "and") {
    outputText.push(`Wrong syntax. Use "combine [object1] with/and [object2]".`);
    return;
  }

  if (object1.combine(object2)) {
    player.removeFromInventory(object1.uniqueKey);
    player.removeFromInventory(object2.uniqueKey);
    player.addToInventory(object1.combineResult);

    outputText.push(
      `You combine the <strong>${object1.name}</strong> with the <strong>${object2.name}</strong> to create a <strong>${object1.combineResult.name}</strong>.`
    );
  } else {
    outputText.push(
      `You can't combine the <strong>${object1.name}</strong> with the <strong>${object2.name}</strong>.`
    );
  }
};