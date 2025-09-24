import { GameObject } from "../../classes.js";
import { player } from "../../init.js";

export const ball = new GameObject(
  "red ball",
  "ball1",
  ["ball", "small ball", "red ball", "rubber ball"],
  "A small red rubber ball. It looks bouncy and fun."
);
ball.sceneryDescription = "A small <strong>red ball</strong> is sitting on the floor.";
ball.canTake = true;
ball.canThrow = true;
const eatBallTrigger = (ball) => {
  player.adjustHealth(-100);
  return "You try to eat the ball, but it's too big and hard to chew.<br>You end up choking on it and coughing violently.";
};
ball.createTrigger("consume", eatBallTrigger);
