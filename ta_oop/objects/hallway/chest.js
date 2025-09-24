import { Container } from "../../classes.js";
import { apple } from "./apple.js";

// *** chest
export const chest = new Container(
  "small chest",
  "chest1",
  ["chest", "wooden chest", "old chest", "box"],
  "An old wooden chest with iron rusty bands and a rusty lock.",
  ["in", "inside", "into"]
);

chest.isLocked = true;
chest.keyName = "key1";
chest.sceneryDescription = "A small <strong>chest</strong> standing under the bench.";
chest.hidden = true;
chest.addItems(apple);
