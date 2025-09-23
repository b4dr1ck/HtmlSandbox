import {
  Room,
  GameObject,
  Container,
  TableLike,
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
const table = new TableLike(
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
const floor1 = new GameObject(
  "stone floor",
  "floor1",
  ["floor", "stone floor", "cold floor", "stone tiles"],
  "Nothing special about that floor. Just cold grey stone tiles that seem to be very old."
);

// *** key
const key1 = new GameObject(
  "rusty key",
  "key1",
  ["key", "rusty key", "old key"],
  "A small rusty key. It looks very old but seems to be intact."
);
key1.sceneryDescription = "A small <strong>rusty key</strong> lies on the floor.";
key1.hidden = true;
key1.canTake = true;
key1.canThrow = true;

// *** carpet
const carpet = new GameObject(
  "carpet",
  "carpet1",
  ["carpet", "rug", "old carpet", "tatty carpet"],
  "A tatty old carpet. Its colors faded and threadbare.<br>It has seen better days."
);
carpet.moveable = true;
const carpetMoveTrigger = (carpet) => {
  key1.hidden = false;
  return "You move the carpet aside, revealing a <strong>key</strong> taped to the floor underneath it.";
};
carpet.createTrigger("move", carpetMoveTrigger);

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
const eatBallTrigger = (ball) => {
  player.adjustHealth(-100);
  return "You try to eat the ball, but it's too big and hard to chew.<br>You end up choking on it and coughing violently.";
};
ball.createTrigger("consume", eatBallTrigger);

darkRoom.exits = { north: { destination: "room2", obstacle: door } };
darkRoom.addObjects(table, book, window, planks, chandelier, walls, floor1, door, carpet, key1, ball);

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
    "Between each torch is a pillar made of the same dark marble as the walls.<br>" +
    "In the east is a opened window that lets in some fresh air.<br>" +
    "Underneath the window is a stone bench that looks very old and worn, but quite comfortable.<br>" +
    "Farther in the north the hallway continues into darkness.<br>" +
    "In the south is the white door that leads back to the dimly lit room.<br>"
);

// ** hallway.objects
// *** stone
const stone = new GameObject(
  "stone",
  "stone1",
  ["stone", "small stone", "rock", "small rock", "pebble"],
  "A small grey stone. It looks quite ordinary but could be useful."
);
stone.sceneryDescription = "A <strong>small stone</strong> is lying on the ground. Waiting to be picked up.";
stone.canTake = true;
stone.canThrow = true;
const stoneEatTrigger = (stone) => {
  player.adjustHealth(-50);
  player.removeFromInventory(stone.uniqueKey);
  return "You try to eat the stone, but it's too hard and gritty.<br>You end up hurting your teeth and feeling sick.";
};
stone.createTrigger("consume", stoneEatTrigger);

// *** marble
const marble = new GameObject(
  "marble",
  "marble1",
  ["marble", "dark marble", "marble walls", "marble pillars", "walls", "pillars"],
  "The dark marble walls and pillars are cold and smooth to the touch.<br>They seem solid and unyielding."
);

// *** floor
const floor2 = new GameObject(
  "dirt floor",
  "floor2",
  ["floor", "earth floor", "dirt floor", "ground"],
  "The floor is just some earth and dirt below you.<br>It's uneven and a bit slippery in places."
);

// *** tapestries
const tapestries = new GameObject(
  "tapestries",
  "tapestries1",
  ["tapestries", "faded tapestries", "wall hangings", "hangings"],
  "Some faded tapestries that depict scenes of battles and ancient rituals.<br>" +
    "One of them shows a execution scene, with a hooded figure standing over a kneeling person.<br>" +
    "Another one shows a group of robed figures standing around a glowing altar.<br>" +
    "The rest of them are too faded to make out any details.<br>" +
    "They are old and worn, but still quite beautiful."
);

tapestries.read = "One reads: <i>Execution of Heretics<i>, another <i>Ritual of the Blood Moon<i>.";
const tapestriesTakeTrigger = (tapestries) => {
  return "You try to take one of the tapestries, but it's firmly attached to the wall.<br>";
};
tapestries.createTrigger("take", tapestriesTakeTrigger);

// *** torch
const torch = new LightSource(
  "torch",
  "torch1",
  ["torch", "ancient torch", "wall torch", "torch", "different torch"],
  "An ancient wall-mounted torch made of iron.<br>The handle is a bit different from the others and looks very abused and worn."
);
torch.turnOn();
torch.stateOnDescription = "The torch is burning brightly, casting a warm glow around it.";
torch.stateOffDescription = "The torch is unlit.";

const torchUseTrigger = (object) => {
  if (object.uniqueKey === "waterbottle1") {
    if (torch.state) {
      torch.turnOff();
      return "You pour the water from the bottle onto the torch, extinguishing its flame.<br>The torch is now unlit.";
    }
  }
  return `You can't use the <strong>${object.name}</strong> here.`;
};
const torchMoveTrigger = (torch) => {
  if (torch.state) {
    player.adjustHealth(-5);
    return "The torch is burning, so it's a bad idea to move it around. You burn yourself slightly.";
  }
  return "You push the torch to the side a bit and hear some stones shifting nearby.";
};

torch.createTrigger("use", torchUseTrigger);
torch.createTrigger("move", torchMoveTrigger);
torch.moveable = true;

// *** nest
const nest = new TableLike(
  "bird's nest",
  "nest1",
  ["nest", "bird's nest", "small nest", "birds nest"],
  "A small bird's nest made of twigs and leaves.",
  ["in", "inside", "into"]
);
nest.alwaysOpen = true;
nest.sceneryDescription = "A small <strong>bird's nest</strong> is sitting on the window sill.";
nest.hidden = true;
nest.containText = "In the nest lies: ";
const nestPutTrigger = (item) => {
  if (item.uniqueKey === "worm1") {
    nest.addItems(item);
    player.removeFromInventory(item.uniqueKey);
    return "You carefully place the worm into the nest.";
  }
  return `It doesn't seem like a good idea to put the <strong>${item.name}</strong> in the nest.`;
};
nest.createTrigger("put", nestPutTrigger);

// *** window
const window2 = new GameObject(
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

// *** apple
const apple = new Consumable(
  "apple",
  "apple1",
  ["apple", "red apple", "fruit"],
  "A fresh red apple. It looks delicious."
);
apple.canTake = true;
apple.canThrow = true;
apple.sceneryDescription = "A fresh <strong>red apple</strong> is sitting on the floor.";
const eatAppleTrigger = (apple) => {
  player.removeFromInventory(apple.uniqueKey);
  player.addToInventory(worm);

  return (
    "You bite into the apple. Yuk! There's a worm inside!<br>" +
    "You spit it out and throw the apple away, but you decide to keep the worm."
  );
};
apple.createTrigger("consume", eatAppleTrigger);

// *** worm
const worm = new GameObject(
  "worm",
  "worm1",
  ["worm", "small worm", "insect"],
  "A small green worm. It looks quite ordinary."
);
worm.sceneryDescription = "A small <strong>worm</strong> is wriggling around.";
worm.canTake = true;
worm.canThrow = true;

// *** chest
const chest = new Container(
  "small chest",
  "chest1",
  ["chest", "wooden chest", "old chest", "box"],
  "An old wooden chest with iron rusty bands and a rusty lock.",
  ["in", "inside", "into"]
);

chest.isLocked = true;
chest.keyName = "key1";
chest.sceneryDescription = "A small <strong>chest</strong> standing under the bench.";
chest.hidden = true;
chest.addItems(apple);

// *** bench
const bench = new TableLike(
  "stone bench",
  "bench1",
  ["bench", "stone bench", "old bench"],
  "An old stone bench that looks quite comfortable despite its age.<br>It has some cracks and chips on the surface.",
  ["on", "on top of", "onto"]
);
bench.containText = "On the bench you see: ";
bench.alwaysOpen = true;
const benchLookTrigger = (bench) => {
  chest.hidden = false;
  bench.deleteTrigger("look");
  return "On a closer look you find a <strong>chest</strong> standing under the bench.";
};
bench.createTrigger("look", benchLookTrigger);

const waitRoomTrigger = () => {
  if (nest.isInContainer("worm1")) {
    hallway.deleteTrigger("wait");
    return (
      "As you wait, a small bird flies in through the window and lands on the nest.<br>" +
      "It chirps happily and seems to be taking care of the worm you placed in the nest.<br>" +
      "After a while, the bird flies away, leaving behind an amulet in the nest.<br>"
    );
  }
  return "You wait for a while. Nothing happens";
};
hallway.createTrigger("wait", waitRoomTrigger);
hallway.exits = {
  south: { destination: "room1", obstacle: door },
  north: { destination: "room3", obstacle: null },
};
hallway.addObjects(door, stone, marble, floor2, tapestries, torch, window2, nest, bench, chest);

//---------------------------------------------------------------------------------------------------
// * crossroads
const crossroads = new Room(
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
    "The eastern door is made of old oak wood and has a brass handle and some adornments on it.<br>"
);

// ** crossroads.objects
// *** marble
const marble2 = new GameObject(
  "marble",
  "marble2",
  ["marble", "dark marble", "marble walls"],
  "Dark marble walls. Some of the tiles have small cracks and chips on them but still seem solid. Nothing special."
);
// *** floor
const floor3 = new GameObject(
  "stone tiles",
  "floor3",
  ["floor", "stone floor", "grey stone tiles", "tiles"],
  "Most of the floor is just earth and dirt, but here and there are some single grey stone tiles covering it."
);

// *** redDoor
const redDoor = new Lockable(
  "red door",
  "door2",
  ["red door", "kitchen door", "door with sign", "red painted door"],
  "A red painted door with a small sign on it that reads 'Kitchen'.<br>The surface is a bit scratched and dirty."
);

// *** woodenDoor
const woodenDoor = new Lockable(
  "wooden door",
  "door3",
  ["wooden door", "oak door", "door with brass handle", "old wooden door", "old door"],
  "An old oak wooden door with a brass handle and some intricate carvings on the surface."
);

crossroads.exits = {
  south: { destination: "room2", obstacle: null },
  west: { destination: "room4", obstacle: redDoor },
  east: { destination: "room5", obstacle: woodenDoor },
  north: { destination: "room6", obstacle: null },
};
crossroads.addObjects(marble2, floor3, redDoor, woodenDoor);
//---------------------------------------------------------------------------------------------------
// * kitchen
const kitchen = new Room("Kitchen", "room4", ["kitchen"], "...");

// ** kitchen.objects

kitchen.exits = {
  east: { destination: "room3", obstacle: redDoor },
};
kitchen.addObjects();
//---------------------------------------------------------------------------------------------------
// * library
const library = new Room("Library", "room5", ["library"], "...");

// ** library.objects

library.exits = {
  west: { destination: "room3", obstacle: woodenDoor },
};
library.addObjects();
//---------------------------------------------------------------------------------------------------
// * deadEnd
const deadEnd = new Room("Dead End", "room6", ["dead end"], "...");

// ** deadEnd.objects

deadEnd.exits = {
  south: { destination: "room3", obstacle: null },
};
deadEnd.addObjects();
//---------------------------------------------------------------------------------------------------
// * player
const player = new Player(crossroads);

//---------------------------------------------------------------------------------------------------
// * Add rooms to rooms list
rooms[darkRoom.uniqueKey] = darkRoom;
rooms[hallway.uniqueKey] = hallway;
rooms[crossroads.uniqueKey] = crossroads;
rooms[kitchen.uniqueKey] = kitchen;
rooms[library.uniqueKey] = library;
rooms[deadEnd.uniqueKey] = deadEnd;

export { rooms, player };
