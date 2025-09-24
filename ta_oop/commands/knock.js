import { outputText } from '../game.js';
import { findObject, validateObject } from '../utils.js';

export const knock = (verb, nouns, _preps, orig) => {
  const id = nouns[0];
  const object = findObject(id);

  if (!validateObject(object, verb, orig)) return;

  if (object.triggers.hasOwnProperty(verb)) {
    outputText.push(object.trigger(verb, object));
    return;
  }

  outputText.push(`You knock on the <strong>${object.name}</strong>, but nobody answers.`);
};