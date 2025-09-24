import { GameObject } from "../../classes.js";

export const tapestries = new GameObject(
  "tapestries",
  "tapestries1",
  ["tapestries", "faded tapestries", "wall hangings", "hangings"],
  "Some faded tapestries that depict scenes of battles and ancient rituals.<br>" +
    "One of them shows an execution scene, with a hooded figure standing over a kneeling person.<br>" +
    "Another one shows a group of robed figures standing around a glowing altar.<br>" +
    "The rest of them are too faded to make out any details.<br>" +
    "They are old and worn, but still quite beautiful."
);

tapestries.read = "One reads: <i>Execution of Heretics<i>, another <i>Ritual of the Blood Moon<i>.";
const tapestriesTakeTrigger = (tapestries) => {
  return "You try to take one of the tapestries, but it's firmly attached to the wall.<br>";
};
tapestries.createTrigger("take", tapestriesTakeTrigger);
