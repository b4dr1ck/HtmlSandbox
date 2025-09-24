import { Equipment } from "../../classes.js";

export const amulet = new Equipment(
  "amulet",
  "amulet1",
  ["amulet", "golden amulet", "necklace"],
  "A beautiful golden amulet with a glowing blue gem in the center.<br>It looks very valuable."
);
amulet.canTake = true;
amulet.canThrow = true;