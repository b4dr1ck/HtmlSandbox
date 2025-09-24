import { outputText } from '../game.js';
import { findObject, validateObject } from '../utils.js';

export const read = (verb, nouns, _preps, orig) => {
  const id = nouns[0];
  const object = findObject(id);

  if (!validateObject(object, verb, orig)) return;

  if (!object.read) {
    outputText.push(`You can't read the <strong>${object.name}</strong>.`);
    return;
  }

  outputText.push(`You read the <strong>${object.name}</strong> and it says:`);
  outputText.push(`${object.read}`);
};