import { outputText } from "../game.js";
import { findObject, validateObject } from "../utils.js";

export const activate = (verb, nouns, _preps, orig) => {
  const id = nouns[0];
  const object = findObject(id);

  if (!validateObject(object, verb, orig)) return;

  if (object.constructor.name !== "TriggerObject" && object.constructor.name !== "LightSource") {
    outputText.push(`You can't ${verb} the <strong>${object.name}</strong>.`);
    return;
  }

  if (verb === "activate") {
    if (object.state) {
      outputText.push(`The <strong>${object.name}</strong> is already on.`);
      return;
    }
    object.turnOn();
  } else {
    if (!object.state) {
      outputText.push(`The <strong>${object.name}</strong> is already off.`);
      return;
    }
    object.turnOff();
  }
  outputText.push(`You ${verb} the <strong>${object.name}</strong>.`);
};
