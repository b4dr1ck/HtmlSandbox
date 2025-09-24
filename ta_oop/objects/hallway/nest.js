import { TableLike } from "../../classes.js";
import { player } from "../../init.js";

export const nest = new TableLike(
  "bird's nest",
  "nest1",
  ["nest", "bird's nest", "small nest", "birds nest"],
  "A small bird's nest made of twigs and leaves.",
  ["in", "inside", "into"]
);
nest.sceneryDescription = "A small <strong>bird's nest</strong> is sitting on the window sill.";
nest.hidden = true;
nest.containText = "In the nest lies: ";
const nestPutTrigger = (item) => {
  if (item.uniqueKey === "worm1") {
    nest.addItems(item);
    player.removeFromInventory(item.uniqueKey);
    return "You carefully place the worm into the nest.";
  }
  return `It doesn't seem like a good idea to put the <strong>${item.name}</strong> in the nest.`;
};
nest.createTrigger("put", nestPutTrigger);