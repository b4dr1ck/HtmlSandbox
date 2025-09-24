import { player } from "../init.js";
import { outputText } from "../game.js";

export const wait = (verb) => {
    const room = player.currentRoom;
    if (room.triggers.hasOwnProperty(verb)) {
      outputText.push(room.trigger(verb, room));
      return;
    }
    outputText.push("You wait for a while. Nothing happens.");
  };