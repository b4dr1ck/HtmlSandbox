import { player, rooms } from "../init.js";
import { outputText } from "../game.js";

export const go = (verb, nouns, _preps, orig) => {
  const direction = nouns[0];
  const directions = Object.keys(rooms[player.currentRoom.uniqueKey].exits);

  if (!direction) {
    outputText.push("Go where?");
    return;
  }

  if (!directions.includes(direction)) {
    outputText.push(`You can't ${verb} <strong>${direction}</strong> from here.`);
    return;
  }

  const destination = player.currentRoom.exits[direction].destination;
  const obstacle = player.currentRoom.exits[direction].obstacle;
  const trigger = player.currentRoom.exits[direction].trigger;

  if (trigger) {
    outputText.push(trigger());
    return;
  }

  if (obstacle) {
    if (obstacle.constructor.name === "Lockable" && !obstacle.isOpen) {
      outputText.push(`The way is blocked by the <strong>${obstacle.name}</strong>`);
      return;
    }
    if (verb !== "climb") {
      outputText.push(`You pass through the <strong>${obstacle.name}</strong> in the <strong>${direction}</strong>`);
    } else {
      outputText.push(`You climb through the <strong>${obstacle.name}</strong>`);
    }
  } else {
    if (verb !== "climb") {
      outputText.push(`You go <strong>${direction}</strong>.`);
    }
  }

  player.currentRoom = rooms[destination];
  outputText.push(`You have arrived the <strong>${player.currentRoom.name}</strong>.`);
};
