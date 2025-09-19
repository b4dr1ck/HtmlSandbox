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

const rooms = [];
const door = new Lockable("Door", "door1", ["door", "wooden door"], "A sturdy wooden door.");
const room1 = new Room(
  "Dark Room",
  "darkroom1",
  ["dark room", "room"],
  "You are in a dark, damp room with stone walls.<br>There is a door to the north and a switch on the wall.<br>A chest and a table are also here."
);
const room2 = new Room(
  "Hallway",
  "hallway1",
  ["hallway", "corridor"],
  "You stand in a hallway with flickering lights."
);
room1.exits = { north: { destination: "hallway1", obstacle: door } };
room2.exits = { south: { destination: "darkroom1", obstacle: door } };
const player = new Player(room1);
const apple = new Consumable("apple", "apple1", ["apple", "fruit"], "A shiny red apple.");
apple.canBeAttacked = true;
apple.sceneryDescription = "A shiny red apple sits here, looking delicious.";
apple.canTake = true;
apple.moveable = true;
apple.canThrow = true;
const book = new GameObject("book", "book1", ["book", "tome"], "An old, dusty book.");
book.sceneryDescription = "An old, dusty book lies on the ground.";
book.canTake = true;
book.read = "'Bla bla bla bla...'";
book.smell = "It smells of old paper and dust.";
const stone = new GameObject("stone", "stone1", ["stone", "rock"], "A small, smooth stone.");
stone.sceneryDescription = "A small, smooth stone lies on the ground.";
stone.canTake = true;
const gold = new GameObject("gold coin", "gold1", ["gold", "coin"], "A shiny gold coin.");
gold.sceneryDescription = "A shiny gold coin glints in the light.";
gold.canTake = true;
const chest = new Container("chest", "chest1", ["chest", "box"], "An old wooden chest.", ["in", "inside"]);
const table = new Container("table", "table1", ["table"], "A sturdy wooden table.", ["on", "top of"]);
table.alwaysOpen = true;
chest.isLocked = true;
chest.keyName = "key1";
const amulet = new Equipment("amulet", "amulet1", ["amulet", "necklace"], "A mysterious amulet with a glowing gem.");
amulet.canTake = true;
amulet.sceneryDescription = "A mysterious amulet with a glowing gem lies here.";
const diamond = new GameObject("diamond", "diamond1", ["diamond", "gem"], "A sparkling diamond.");
diamond.canTake = true;
diamond.sceneryDescription = "A sparkling diamond rests here, catching the light.";
const key = new GameObject("key", "key1", ["key", "small key", "brass key"], "A small brass key.");
key.canTake = true;
key.sceneryDescription = "A small brass key lies here.";
const shirt = new Equipment("shirt", "shirt1", ["shirt", "tunic"], "A simple cotton shirt.");
shirt.canTake = true;
const torch = new LightSource("torch", "torch1", ["torch", "wooden torch"], "A wooden torch mounted on the wall.");
torch.inflammable = true;
torch.sceneryDescription = "A wooden torch is mounted on the wall here.";
torch.stateOnDescription = "It is currently lit";
torch.stateOffDescription = "It is currently unlit.";
const matches = new GameObject("box of matches", "matches1", ["matches", "box of matches"], "A small box of matches.");
matches.canTake = true;
matches.sceneryDescription = "A small box of matches lies here.";
matches.read = "Strike on the side of the box to light a match.";

const testTrigger = (object) => {
  if (object.uniqueKey === "apple1") {
    console.log(`Trigger (apple) activated!`);
    return "An apple a day keeps the doctor away!";
  } else {
    console.log(`Trigger (${object.name}) activated!`);
    return "....";
  }
};

const turnOnTorch = (object) => {
  return "You can't light the torch like that. You need a fire source.";
};

const useMatchesOnTorch = (object) => {
  if (object.uniqueKey === "matches1") {
    if (torch.state) {
      return "The torch is already lit.";
    } else {
      torch.turnOn();
      return "You strike a match and light the torch. The room is now illuminated.";
    }
  } else {
    return "You can't use that here.";
  }
};

//room1.createTrigger("wait", testTrigger);
door.createTrigger("knock", testTrigger);
torch.createTrigger("use", useMatchesOnTorch);
torch.createTrigger("activate", turnOnTorch);
apple.createTrigger("move", testTrigger);
apple.createTrigger("smell", testTrigger);

shirt.sceneryDescription = "A simple cotton shirt is folded neatly here.";
const switch1 = new TriggerObject("switch", "switch1", ["switch", "lever"], "A rusty switch on the wall.");
const flashlight = new LightSource(
  "flashlight",
  "flashlight2",
  ["flashlight", "working flashlight", "light"],
  "A battery-powered flashlight. It's working!"
);
flashlight.canTake = true;
flashlight.sceneryDescription = "A battery-powered flashlight lies here. It's working!";
const flashlightEmpty = new Combineable(
  "empty flashlight",
  "flashlight1",
  ["flashlight", "empty flashlight", "light"],
  "A battery-powered flashlight. It's empty!",
  "battery1",
  flashlight
);
flashlightEmpty.canTake = true;
flashlightEmpty.sceneryDescription = "A battery-powered flashlight lies here. It looks empty.";
const battery = new Combineable(
  "battery",
  "battery1",
  ["battery", "AA battery"],
  "A single AA battery.",
  "flashlight1",
  flashlight
);
battery.canTake = true;
battery.sceneryDescription = "A single AA battery lies here.";
const dagger = new Weapon("dagger", "dagger1", ["dagger", "knife"], "A sharp dagger with a gleaming blade.", 10);
dagger.canTake = true;
dagger.sceneryDescription = "A sharp dagger with a gleaming blade lies here.";

player.addToInventory(dagger, matches);
table.addItems(flashlightEmpty, battery);
chest.addItems(amulet, diamond, gold);
room1.addObjects(apple, chest, table, door, stone, key, book, shirt, switch1, torch);
rooms[room1.uniqueKey] = room1;
rooms[room2.uniqueKey] = room2;

export { rooms, player };
