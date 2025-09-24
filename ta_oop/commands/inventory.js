import { player } from "../init.js";
import { outputText } from "../game.js";

export const inventory = () =>  {
  if (player.isInventoryEmpty()) {
    outputText.push("Your don't carry anything with you.");
    return;
  }

  outputText.push("You are carrying:");
  for (const item in player.inventory) {
    if (player.inventory[item].hidden) {
      continue;
    }
    if (player.inventory[item].isEquipped) {
      outputText.push(`* (equipped) ${player.inventory[item].name}`);
      continue;
    }
    outputText.push(`* ${player.inventory[item].name}`);
  }
};