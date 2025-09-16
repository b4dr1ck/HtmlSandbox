import {
  Room,
  GameObject,
  Container,
  Player,
  Consumable,
  Equipment,
  Combineable,
  Weapon,
  TriggerObject,
  LightSource,
} from "./classes.js";

const rooms = [];
const room1 = new Room("Dark Room", "darkroom1", ["dark room", "room"], "A dark, damp room with stone walls.");
const player = new Player(room1.uniqueKey);
const apple = new Consumable("Apple", "apple1", ["apple", "fruit"], "A shiny red apple.");
const gold = new GameObject("Gold Coin", "gold1", ["gold", "coin", "money"], "A glittering gold coin.");
const book = new GameObject("Book", "book1", ["book", "tome", "grimoire", "magic book"], "An old, dusty magic book.");
const key = new GameObject("Silver Key", "key1", ["key", "silver key"], "A small silver key.");
const weapon = new Weapon("Makeshift Weapon", "weapon1", ["sword", "blade", "weapon"], "A sharp steel sword.", 10);
const Lever = new TriggerObject("Lever", "lever1", ["lever", "switch", "handle"], "A rusty lever on the wall.");
const torch = new LightSource("Torch", "torch1", ["torch", "light"], "A wooden torch mounted on the wall.");
torch.inflammable = true;
const stick = new Combineable(
  "Wooden Stick",
  "stick1",
  ["stick", "wooden stick", "branch"],
  "A sturdy wooden stick.",
  "stone1",
  weapon
);
const stone = new Combineable("Stone", "stone1", ["stone", "rock"], "A small, smooth stone.", "stick1", weapon);
const armor = new Equipment(
  "Leather Armor",
  "armor1",
  ["leather armor", "armor", "clothes"],
  "A sturdy set of leather armor."
);
const chest = new Container(
  "Chest",
  "chest1",
  ["chest", "box", "container"],
  "A wooden chest with metal reinforcements."
);

player.addToInventory(key);
const eatApple = (object) => {
  console.log(`You eat the ${object.name}. There's a worm inside!`);
};

player.diagnose();

apple.createTrigger("eat", eatApple);
apple.trigger("eat", apple);

book.read = "Speak the words 'Alakazam' to cast a spell.";

chest.addItem(gold);
console.log(`Chest contains: ${chest.contains}`);
chest.isLocked = true;
chest.keyName = "key1";
chest.unlock("key1");
chest.open();
console.log(`Chest contains: ${chest.contains}`);

console.log(room1.isInRoom("chest1"));

room1.addObjects(apple, book, chest, armor, stone, stick, Lever, torch);
rooms.push(room1);

console.log(room1.isInRoom("chest1"));

Lever.turnOn();
console.log(Lever.description);

torch.light();
console.log(torch.description);
console.log(torch instanceof LightSource);

console.log("combine...");
const combined = stick.combine(stone);
console.log(combined);
apple.canBeAttacked = true;
console.log(combined.attack(apple));

export { rooms, player };
