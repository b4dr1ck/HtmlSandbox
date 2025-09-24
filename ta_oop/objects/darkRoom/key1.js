import { GameObject } from "../../classes.js";

export const key1 = new GameObject(
  "rusty key",
  "key1",
  ["key", "rusty key", "old key"],
  "A small rusty key. It looks very old but seems to be intact."
);
key1.sceneryDescription = "A small <strong>rusty key</strong> lies on the floor.";
key1.hidden = true;
key1.canTake = true;
key1.canThrow = true;
