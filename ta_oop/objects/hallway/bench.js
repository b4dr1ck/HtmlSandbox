import { TableLike } from "../../classes.js";
import { chest } from "./chest.js";

export const bench = new TableLike(
  "stone bench",
  "bench1",
  ["bench", "stone bench", "old bench"],
  "An old stone bench that looks quite comfortable despite its age.<br>It has some cracks and chips on the surface.",
  ["on", "on top of", "onto"]
);
bench.containText = "On the bench you see: ";
const benchLookTrigger = (bench) => {
  chest.hidden = false;
  bench.deleteTrigger("look");
  return "On a closer look you find a <strong>chest</strong> standing under the bench.";
};
bench.createTrigger("look", benchLookTrigger);
