import { rooms, player } from "./init.js";
import {
  verbs,
  directions,
  prepositions,

} from "./data.js";

const parseInput = (input) => {
  input = input
    .toLowerCase()
    .trim()
    .replaceAll(/\s+/g, " ")
    .replaceAll(" the ", " ")
    .replaceAll(" a ", " ")
    .replaceAll(" an ", " ")

  return input;
};

console.log(parseInput("Look at the fruit"));
