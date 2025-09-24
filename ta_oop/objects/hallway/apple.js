import { Consumable } from "../../classes.js";
import { player } from "../../init.js";
import { worm } from "./worm.js";

export const apple = new Consumable(
  "apple",
  "apple1",
  ["apple", "red apple", "fruit"],
  "A fresh red apple. It looks delicious."
);
apple.canTake = true;
apple.canThrow = true;
apple.sceneryDescription = "A fresh <strong>red apple</strong> is sitting on the floor.";
const eatAppleTrigger = (apple) => {
  player.removeFromInventory(apple.uniqueKey);
  player.addToInventory(worm);

  return (
    "You bite into the apple. Yuk! There's a worm inside!<br>" +
    "You spit it out and throw the apple away, but you decide to keep the worm."
  );
};
apple.createTrigger("consume", eatAppleTrigger);