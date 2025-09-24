import { outputText } from '../game.js';
import { findObject, validateObject } from '../utils.js';

export const move = (verb, nouns, _preps, orig) => {
  const id = nouns[0];
  const object = findObject(id);

  if (!validateObject(object, verb, orig)) return;

  if (!object.moveable) {
    outputText.push(`You can't move the <strong>${object.name}</strong>.`);
    return;
  }

  outputText.push(`You move the <strong>${object.name}</strong>, but nothing happens!</strong>.`);
};