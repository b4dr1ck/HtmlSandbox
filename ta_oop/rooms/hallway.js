import { Room } from "../classes.js";

import { whiteDoor } from "../objects/darkRoom/whiteDoor.js";
import { stone } from "../objects/hallway/stone.js";
import { marble } from "../objects/hallway/marble.js";
import { floor2 } from "../objects/hallway/floor2.js";
import { tapestries } from "../objects/hallway/tapestries.js";
import { torch } from "../objects/hallway/torch.js";
import { window2 } from "../objects/hallway/window2.js";
import { nest } from "../objects/hallway/nest.js";
import { bench } from "../objects/hallway/bench.js";
import { chest } from "../objects/hallway/chest.js";
import { amulet } from "../objects/hallway/amulet.js";

export const hallway = new Room(
  "Hallway",
  "room2",
  ["hallway", "corridor"],
  "You are in a long, narrow hallway made completely out of dark marble.<br>" +
    "There is no real floor on the ground, just some earth and dirt below you.<br>" +
    "The dark marble walls are adorned with faded tapestries that depict scenes of battles and ancient rituals.<br>" +
    "The ceiling is high above you, lost in shadows and darkness.<br>" +
    "On the western wall are some ancient torches that provide a flickering light to the hallway.<br>" +
    "One of the torches is a bit different from the others.<br>" +
    "Between each torch is a pillar made of the same dark marble as the walls.<br>" +
    "In the east is a opened window that lets in some fresh air.<br>" +
    "Underneath the window is a stone bench that looks very old and worn, but quite comfortable.<br>" +
    "Farther in the north the hallway continues into darkness.<br>" +
    "In the south is the white door that leads back to the dimly lit room.<br>"
);

const waitRoomTrigger = () => {
  if (nest.isInContainer("worm1")) {
    hallway.deleteTrigger("wait");
    nest.removeItem("worm1");
    nest.addItems(amulet);
    return (
      "As you wait, a small bird flies in through the window and lands on the nest.<br>" +
      "It chirps happily and seems to be taking care of the worm you placed in the nest.<br>" +
      "After a while, the bird flies away, leaving behind an amulet in the nest.<br>"
    );
  }
  return "You wait for a while. Nothing happens";
};
hallway.createTrigger("wait", waitRoomTrigger);
hallway.exits = {
  south: { destination: "room1", obstacle: whiteDoor },
  north: { destination: "room3", obstacle: null },
};
hallway.addObjects(whiteDoor, stone, marble, floor2, tapestries, torch, window2, nest, bench, chest);

