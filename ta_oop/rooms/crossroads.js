import { Room } from "../classes.js";

import { marble2 } from "../objects/crossroads/marble2.js";
import { floor3 } from "../objects/crossroads/floor3.js";
import { redDoor } from "../objects/crossroads/redDoor.js";
import { woodenDoor } from "../objects/crossroads/woodenDoor.js";
import { passage } from "../objects/crossroads/passage.js";

export const crossroads = new Room(
  "Crossroads",
  "room3",
  ["crossroads", "intersection"],
  "You reach a crossroads.<br>" +
    "The walls here are made of the same dark marble as the hallway but have no decorations or adornments.<br>" +
    "The floor has some single grey stone tiles covering the dirt ground below.<br>" +
    "In the north the path continues into darkness.<br>" +
    "In the south lies the hallway with the torches and tapestries.<br>" +
    "To the east and west are two doors on the walls that seem to lead you to other rooms.<br>" +
    "The western door is painted red and has a small sign on it.<br>" +
    "The eastern door is made of old oak wood and has a brass handle and some adornments on it.<br>" +
    "Another passage you spot in the northwest. It's an open archway without any door or other obstacle.<br>"
);


crossroads.exits = {
  south: { destination: "room2", obstacle: null },
  west: { destination: "room4", obstacle: redDoor },
  east: { destination: "room5", obstacle: woodenDoor },
  north: { destination: "room6", obstacle: null },
  northwest: { destination: "room7", obstacle: null },
};
crossroads.addObjects(marble2, floor3, redDoor, woodenDoor, passage);