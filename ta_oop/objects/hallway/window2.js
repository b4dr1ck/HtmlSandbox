import { GameObject } from "../../classes.js";
import { player } from "../../init.js";
import { nest } from "./nest.js";

export const window2 = new GameObject(
  "window",
  "window2",
  ["window", "opened window"],
  "You look outside the window. It's dark outside.<br>" +
    "In the distance you can see an endless forest under a starry sky. The moon is full and bright.<br>" +
    "From time to time you can spy a bird flying past the window, silhouetted against the moonlight."
);

const windowLookTrigger = (window2) => {
  nest.hidden = false;
  window2.deleteTrigger("look");
  return (
    window2.description +
    "<br>On a closer look you see a small nest of twigs and leaves sits on the window sill" +
    "<br>You recognize it as a <strong>bird's nest</strong>."
  );
};
const windowClimbTrigger = () => {
  player.adjustHealth(-100);
  return (
    "You try to climb out the window. Your foot slips on the sill and you fall to your death.<br>" +
    "What do you expected?"
  );
};
window2.createTrigger("look", windowLookTrigger);
window2.createTrigger("climb", windowClimbTrigger);
window2.hear = "You hear the faint hooting of an owl in the distance.";
