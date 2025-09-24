import { GameObject } from "../../classes.js";

export const walls = new GameObject(
  "walls",
  "walls1",
  ["walls", "stone walls", "rough walls", "wall"],
  "The walls around you are made of rough stone, cold and damp to the touch.<br>Some writings can be seen on them."
);
walls.read = "The writings on the walls are faded and hard to read.<br>They seem to be in an ancient language.";
