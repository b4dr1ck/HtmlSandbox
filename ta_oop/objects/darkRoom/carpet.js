import { GameObject } from "../../classes.js";
import { key1 } from "./key1.js";

export const carpet = new GameObject(
  "carpet",
  "carpet1",
  ["carpet", "rug", "old carpet", "tatty carpet"],
  "A tatty old carpet. Its colors faded and threadbare.<br>It has seen better days."
);
carpet.moveable = true;
const carpetMoveTrigger = (carpet) => {
  key1.hidden = false;
  return "You move the carpet aside, revealing a <strong>key</strong> taped to the floor underneath it.";
};
carpet.createTrigger("move", carpetMoveTrigger);