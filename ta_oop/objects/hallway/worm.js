import { GameObject } from "../../classes.js";

export const worm = new GameObject(
  "worm",
  "worm1",
  ["worm", "small worm", "insect"],
  "A small green worm. It looks quite ordinary."
);
worm.sceneryDescription = "A small <strong>worm</strong> is wriggling around.";
worm.canTake = true;
worm.canThrow = true;