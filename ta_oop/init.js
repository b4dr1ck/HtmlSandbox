import { Player } from "./classes.js";

import { darkRoom } from "./rooms/darkRoom.js";
import { hallway } from "./rooms/hallway.js";
import { crossroads } from "./rooms/crossroads.js";

// * player
const player = new Player(darkRoom);

//---------------------------------------------------------------------------------------------------
// * Add rooms to rooms list
const rooms = {};
rooms[darkRoom.uniqueKey] = darkRoom;
rooms[hallway.uniqueKey] = hallway;
rooms[crossroads.uniqueKey] = crossroads;

export { rooms, player };
