import { Room } from "../classes.js";

import { whiteDoor } from "../objects/darkRoom/whiteDoor.js";
import { book } from "../objects/darkRoom/book.js";
import { table } from "../objects/darkRoom/table.js";
import { plankedWindow } from "../objects/darkRoom/plankedWindow.js";
import { planks } from "../objects/darkRoom/planks.js";
import { chandelier } from "../objects/darkRoom/chandelier.js";
import { walls } from "../objects/darkRoom/walls.js";
import { floor1 } from "../objects/darkRoom/floor1.js";
import { key1 } from "../objects/darkRoom/key1.js";
import { carpet } from "../objects/darkRoom/carpet.js";
import { ball } from "../objects/darkRoom/ball.js";

export const darkRoom = new Room(
  "Dark Room",
  "room1",
  ["dark room", "room", "dimly lit room"],
  "You are in the middle of a dimly lit room.<br>" +
    "The walls around you are made of rough stone, and the air is damp and musty.<br>" +
    "Beside you in the western wall is an old wooden table with a mystic book on it.<br>" +
    "There is also a window on the easten wall, but it is barred shut with wooden planks.<br>" +
    "The floor is made of cold stone tiles, some of which are cracked and uneven.<br>" +
    "On it lies a tatty old carpet, its colors faded and threadbare.<br>" +
    "On the ceiling is an old fashioned chandelier with a single candle flickering weakly.<br>" +
    "In the north you see a white door that seems to be the only way out of this room.<br>"
);

darkRoom.exits = { north: { destination: "room2", obstacle: whiteDoor } };
darkRoom.addObjects(table, book, plankedWindow, planks, chandelier, walls, floor1, whiteDoor, carpet, key1, ball);