import {
  Room,
  GameObject,
  Container,
  Player,
  Consumable,
  Equipment,
  Combineable,
  Lockable,
  Weapon,
  TriggerObject,
  LightSource,
} from "./classes.js";

const rooms = {};

//---------------------------------------------------------------------------------------------------
// * darkRoom
const darkRoom = new Room(
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

// ** darkRoom.objects
// *** door
const door = new Lockable(
  "white door",
  "door1",
  ["door", "white door", "exit door", "exit"],
  "A sturdy white <strong>door</strong> with a brass handle.<br>The surface is dirtied and scratched."
);

// *** book
const book = new GameObject(
  "book",
  "book1",
  ["book", "mystic book", "old book", "grimoire"],
  "A very old-looking book lies on the table. A red magical symbol can be seen on the black cover."
);

// *** table
const table = new Container(
  "table",
  "table1",
  ["table", "desk", "old table"],
  "An old sturdy wooden <strong>table</strong>.<br>It has some scratches and cracks on the surface.",
  ["on", "on top of", "onto"]
);
table.alwaysOpen = true;
table.containText = "On the table you see: ";
table.addItems(book);

const bookTrigger = (book) => {
  player.adjustHealth(-10);
  return (
    "As you try to take the book from the table,<br>a sudden burst of magical energy erupts from it, sending you reeling backward.<br>" +
    "The book remains firmly on the table, its cover glowing faintly."
  );
};
book.createTrigger("read", bookTrigger);
book.createTrigger("take", bookTrigger);
book.createTrigger("attack", bookTrigger);
book.createTrigger("smell", bookTrigger);

// *** window
const window = new GameObject(
  "window",
  "window1",
  ["window", "barred window", "planked window"],
  "A small window. It is Barred shut with wooden planks.<br>It lets in a faint light from outside, but you can't see much through it."
);

// *** planks
const planks = new GameObject(
  "planks",
  "planks1",
  ["planks", "wooden planks", "plank"],
  "Some old wooden planks nailed across the window, preventing it from being opened."
);

// *** chandelier
const chandelier = new GameObject(
  "chandelier",
  "chandelier1",
  ["chandelier", "candle", "light", "lamp", "glower"],
  "An old fashioned golden chandelier with a single candle flickering weakly.<br>It provides a dim light to the room."
);

// *** walls
const walls = new GameObject(
  "walls",
  "walls1",
  ["walls", "stone walls", "rough walls"],
  "The walls around you are made of rough stone, cold and damp to the touch.<br>They seem solid and unyielding. Some writings can be seen on them."
);
walls.read = "The writings on the walls are faded and hard to read.<br>They seem to be in an ancient language.";

// *** floor
const floor = new GameObject(
  "floor",
  "floor1",
  ["floor", "stone floor", "cold floor", "stone tiles"],
  "Nothing special about the floor. Just cold grey stone tiles that seem to be very old."
);

// *** key
const key = new GameObject(
  "rusty key",
  "key1",
  ["key", "rusty key", "old key"],
  "A small rusty key. It looks very old but seems to be intact."
);
key.sceneryDescription = "A small <strong>rusty key</strong> lies on the floor.";
key.hidden = true;
key.canTake = true;
key.canThrow = true;

// *** carpet
const carpet = new GameObject(
  "carpet",
  "carpet1",
  ["carpet", "rug", "old carpet", "tatty carpet"],
  "A tatty old carpet. Its colors faded and threadbare.<br>It has seen better days."
);
carpet.moveable = true;
const carpetTrigger = (carpet) => {
  key.hidden = false;
  return "You move the carpet aside, revealing a <strong>key</strong> taped to the floor underneath it.";
};
carpet.createTrigger("move", carpetTrigger);

// *** ball
const ball = new GameObject(
  "red ball",
  "ball1",
  ["ball", "small ball", "red ball", "rubber ball"],
  "A small red rubber ball. It looks bouncy and fun."
);
ball.sceneryDescription = "A small <strong>red ball</strong> is sitting on the floor.";
ball.canTake = true;
ball.canThrow = true;
const eatBall = (ball) => {
  player.adjustHealth(-100);
  return "You try to eat the ball, but it's too big and hard to chew.<br>You end up choking on it and coughing violently.";
};
ball.createTrigger("consume", eatBall);

darkRoom.exits = { north: { destination: "room2", obstacle: door } };
darkRoom.addObjects(table, book, window, planks, chandelier, walls, floor, door, carpet, key, ball);

//---------------------------------------------------------------------------------------------------
// * hallway
const hallway = new Room(
  "Hallway",
  "room2",
  ["hallway", "corridor"],
  "You are in a long, narrow hallway made completely out of dark marble.<br>" +
    "There is no real floor on the ground, just some earth and dirt below you.<br>" +
    "The dark marble walls are adorned with faded tapestries that depict scenes of battles and ancient rituals.<br>" +
    "The ceiling is high above you, lost in shadows and darkness.<br>" +
    "On the western wall are some ancient torches that provide a flickering light to the hallway.<br>" +
    "One of the torches is a bit different from the others.<br>" +
    "In the east is a opened window that lets in some fresh air.<br>" +
    "Underneath the window is a stone bench that looks very old and worn, but quite comfortable.<br>" +
    "Farther in the north the hallway continues into darkness.<br>" +
    "In the south is the white door that leads back to the dimly lit room."
);

hallway.addObjects(door);
hallway.exits = {
  south: { destination: "room1", obstacle: door },
  //north: { destination: "room3", obstacle: null },
};

//---------------------------------------------------------------------------------------------------
// * player
const player = new Player(darkRoom);

//---------------------------------------------------------------------------------------------------
// * Add rooms to rooms list
rooms[darkRoom.uniqueKey] = darkRoom;
rooms[hallway.uniqueKey] = hallway;

export { rooms, player };
