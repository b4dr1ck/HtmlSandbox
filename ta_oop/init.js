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
const room1 = new Room("Dark Room", "darkroom1", ["dark room", "room"], "A dark, damp room with stone walls.");
const room2 = new Room("Hallway", "hallway1", ["hallway", "corridor"], "A hallway with flickering lights.");
room1.exits = { north: { destination: "hallway1", obstacle: door } };
room2.exits = { south: { destination: "darkroom1", obstacle: door } };
const player = new Player(room1);
const apple = new Consumable("Apple", "apple1", ["apple", "fruit"], "A shiny red apple.");
apple.sceneryDescription = "A shiny red apple sits here, looking delicious.";
apple.canTake = true;
const stone = new GameObject("Stone", "stone1", ["stone", "rock"], "A small, smooth stone.");
const gold = new GameObject("Gold Coin", "gold1", ["gold", "coin"], "A shiny gold coin.");
const chest = new Container("Chest", "chest1", ["chest", "box"], "An old wooden chest.", ["in", "inside"]);
const amulet = new Equipment("Amulet", "amulet1", ["amulet", "necklace"], "A mysterious amulet with a glowing gem.");
const diamond = new GameObject("Diamond", "diamond1", ["diamond", "gem"], "A sparkling diamond.");

chest.addItems(amulet, diamond);
room1.addObjects(apple, stone, chest, door);
room2.addObjects(door);
rooms[room1.uniqueKey] = room1;
rooms[room2.uniqueKey] = room2;
player.addToInventory(gold, stone);

export { rooms, player };
