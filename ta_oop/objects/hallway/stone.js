import { GameObject } from "../../classes.js";
import { player } from "../../init.js";

export const stone = new GameObject(
  "stone",
  "stone1",
  ["stone", "small stone", "rock", "small rock", "pebble"],
  "A small grey stone. It looks quite ordinary but could be useful."
);
stone.sceneryDescription = "A <strong>small stone</strong> is lying on the ground. Waiting to be picked up.";
stone.canTake = true;
stone.canThrow = true;
const stoneEatTrigger = (stone) => {
  player.adjustHealth(-50);
  player.removeFromInventory(stone.uniqueKey);
  return "You try to eat the stone, but it's too hard and gritty.<br>You end up hurting your teeth and feeling sick.";
};
stone.createTrigger("consume", stoneEatTrigger);
