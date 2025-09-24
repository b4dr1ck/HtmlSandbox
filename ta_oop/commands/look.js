import { outputText } from "../game.js";
import { findObject, validateObject } from "../utils.js";

export const look = (verb, nouns, _preps, orig) => {
  const id = nouns[0];
  const object = findObject(id);

  if (!validateObject(object, verb, orig)) return;

  let desc = "";

  // prefix if object is not in the room
  if (object.constructor.name !== "Room" && object.whereAmI.name !== "room") {
    desc += `(${object.whereAmI.name}) `;
  }
  desc += object.description;

  // list contents if container/tablelike
  if (object.constructor.name === "Container" || object.constructor.name === "TableLike") {
    if (!object.isEmpty()) {
      desc += `<br>${object.containText}`;
      for (const item in object.contains) {
        desc += `<br>* ${object.contains[item].name}`;
      }
    }
  }
  outputText.push(desc);
};
