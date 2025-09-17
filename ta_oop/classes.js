export class Player {
  #currentRoom;
  #inventory;
  #condition;
  #health;

  constructor(startingRoom) {
    this.#currentRoom = startingRoom;
    this.#inventory = {};
    this.#condition = "healthy";
    this.#health = 100;
  }

  get currentRoom() {
    return this.#currentRoom;
  }
  get inventory() {
    return this.#inventory;
  }
  get condition() {
    return this.#condition;
  }
  get health() {
    return this.#health;
  }

  set condition(newCondition) {
    this.#condition = newCondition;
  }
  set currentRoom(newRoom) {
    this.#currentRoom = newRoom;
  }

  addToInventory(...items) {
    items.forEach((item) => {
      item.whereAmI = { place: "inventory", preposition: "in" };
      this.#inventory[item.uniqueKey] = item;
    });
  }
  removeFromInventory(itemName) {
    this.#inventory = Object.fromEntries(
      Object.entries(this.#inventory).filter(([key]) => key.toLowerCase() !== itemName.toLowerCase())
    );
  }
  isInInventory(itemName) {
    if (!this.#inventory.hasOwnProperty(itemName)) {
      return false;
    }
    return this.#inventory[itemName];
  }
  diagnose() {
    console.log(`You are ${this.#condition} with ${this.#health} health.`);
  }
  adjustHealth(amount) {
    this.#health += amount;
    if (this.#health > 100) {
      this.#health = 100;
    }
    if (this.#health <= 0) {
      this.#health = 0;
      this.#condition = "dead";
    } else if (this.#health < 30) {
      this.#condition = "critical";
    } else if (this.#health < 70) {
      this.#condition = "injured";
    } else {
      this.#condition = "healthy";
    }
  }
}

class BaseObject {
  #name;
  #uniqueKey;
  #aliases;
  #description;
  #smell;
  #noise;
  #hidden;
  #trigger;

  constructor(name, uniqueKey, aliases, description) {
    this.#name = name;
    this.#uniqueKey = uniqueKey;
    this.#aliases = aliases;
    this.#description = description;
    this.#smell = "It smells like nothing in particular.";
    this.#noise = "You hear nothing special.";
    this.#hidden = false;
    this.#trigger = {};
  }

  get name() {
    return this.#name;
  }
  get uniqueKey() {
    return this.#uniqueKey;
  }
  get description() {
    return this.#description;
  }
  get smell() {
    return this.#smell;
  }
  get noise() {
    return this.#noise;
  }
  get hidden() {
    return this.#hidden;
  }
  get aliases() {
    return this.#aliases;
  }
  get hasTriggers() {
    return Object.keys(this.#trigger).length > 0;
  }

  set name(newName) {
    this.#name = newName;
  }
  set description(newDescription) {
    this.#description = newDescription;
  }
  set smell(newSmell) {
    this.#smell = newSmell;
  }
  set noise(newNoise) {
    this.#noise = newNoise;
  }
  set hidden(isHidden) {
    this.#hidden = isHidden;
  }

  createTrigger(onCommand, script) {
    this.#trigger[onCommand] = script;
  }
  trigger(command, ...args) {
    if (this.#trigger[command]) {
      return this.#trigger[command](...args);
    }
    return false;
  }
}

export class Room extends BaseObject {
  #exits;
  #objects;
  constructor(name, uniqueKey, aliases, description) {
    super(name, uniqueKey, aliases, description);
    this.#exits = {};
    this.#objects = {};
  }

  get exits() {
    return this.#exits;
  }
  get objects() {
    return this.#objects;
  }

  set exits(newExits) {
    this.#exits = newExits;
  }

  addObjects(...objects) {
    objects.forEach((obj) => {
      obj.whereAmI = { place: "room", preposition: "in" };
      this.#objects[obj.uniqueKey] = obj;
    });
  }
  removeObject(objectName) {
    this.#objects = Object.fromEntries(
      Object.entries(this.#objects).filter(([key]) => key.toLowerCase() !== objectName.toLowerCase())
    );
  }
  isInRoom(objectName) {
    return this.#objects.hasOwnProperty(objectName);
  }
}

export class GameObject extends BaseObject {
  #whereAmI;
  #sceneryDescription;
  #canTake;
  #read;
  #canBeAttacked;
  #moveable;
  #health;
  #condition;
  constructor(name, uniqueKey, aliases, description) {
    super(name, uniqueKey, aliases, description);

    const article = ["a", "e", "i", "o", "u"].includes(name[0].toLowerCase()) ? "an" : "a";
    this.smell = `It smells like ${article} ${name.toLowerCase()}`;
    this.noise = `It sounds like ${article} ${name.toLowerCase()}`;
    this.read = "";
    this.#canBeAttacked = false;
    this.#canTake = false;
    this.#sceneryDescription = "";
    this.#condition = "intact";
    this.#moveable = false;
    this.#health = 100;
    this.#whereAmI = { place: "room", preposition: "in" };
  }

  get sceneryDescription() {
    return this.#sceneryDescription;
  }
  get canTake() {
    return this.#canTake;
  }
  get read() {
    return this.#read;
  }
  get canBeAttacked() {
    return this.#canBeAttacked;
  }
  get condition() {
    return this.#condition;
  }
  get health() {
    return this.#health;
  }
  get moveable() {
    return this.#moveable;
  }
  get whereAmI() {
    return this.#whereAmI;
  }

  set sceneryDescription(newDescription) {
    this.#sceneryDescription = newDescription;
  }
  set canTake(takeable) {
    this.#canTake = takeable;
  }
  set read(text) {
    this.#read = text;
  }
  set canBeAttacked(attackable) {
    this.#canBeAttacked = attackable;
  }
  set condition(newCondition) {
    this.#condition = newCondition;
  }
  set moveable(isMoveable) {
    this.#moveable = isMoveable;
  }
  set whereAmI(location) {
    this.#whereAmI = location;
  }

  adjustHealth(amount) {
    this.#health += amount;
    if (this.#health > 100) {
      this.#health = 100;
    }
    if (this.#health <= 0) {
      this.#health = 0;
      this.#condition = "destroyed";
    }
  }
}

export class Lockable extends GameObject {
  #isLocked;
  #isOpen;
  #keyName;
  constructor(name, uniqueKey, aliases, description) {
    super(name, uniqueKey, aliases, description);
    this.#isLocked = false;
    this.#isOpen = false;
    this.#keyName = "";
  }

  get description() {
    let descText = super.description;
    if (this.#isLocked) {
      descText += " It is locked.";
    } else if (this.#isOpen) {
      descText += " It is open.";
    } else {
      descText += " It is closed.";
    }
    return descText;
  }
  get isLocked() {
    return this.#isLocked;
  }
  get isOpen() {
    return this.#isOpen;
  }
  get keyName() {
    return this.#keyName;
  }

  set isLocked(lockStatus) {
    this.#isLocked = lockStatus;
  }
  set isOpen(openStatus) {
    this.#isOpen = openStatus;
  }
  set keyName(keyName) {
    this.#keyName = keyName;
  }

  close() {
    if (this.#isOpen) {
      this.#isOpen = false;
      return true;
    }
    return false;
  }
  open() {
    if (!this.#isLocked) {
      this.#isOpen = true;
      return true;
    }
    return false;
  }
  unlock(key) {
    if (!key) {
      return false;
    }
    if (key.toLowerCase() === this.#keyName.toLowerCase()) {
      this.#isLocked = false;
      return true;
    }
    return false;
  }
}

export class Equipment extends GameObject {
  #canWear;
  #isEquipped;
  constructor(name, uniqueKey, aliases, description) {
    super(name, uniqueKey, aliases, description);
    this.#canWear = false;
    this.#isEquipped = false;
  }

  get canWear() {
    return this.#canWear;
  }
  get isEquipped() {
    return this.#isEquipped;
  }

  set canWear(wearable) {
    this.#canWear = wearable;
  }

  dress() {
    if (this.#canWear && !this.#isEquipped) {
      this.#isEquipped = true;
      return true;
    }
    return false;
  }
  undress() {
    if (this.#canWear && this.#isEquipped) {
      this.#isEquipped = false;
      return true;
    }
    return false;
  }
}

export class Consumable extends GameObject {
  #canConsume;
  constructor(name, uniqueKey, aliases, description) {
    super(name, uniqueKey, aliases, description);
    this.#canConsume = false;
  }

  get canConsume() {
    return this.#canConsume;
  }

  set canConsume(consumable) {
    this.#canConsume = consumable;
  }
}

export class TriggerObject extends GameObject {
  #state;
  constructor(name, uniqueKey, aliases, description) {
    super(name, uniqueKey, aliases, description);
    this.#state = false;
  }

  get state() {
    return this.#state;
  }
  get description() {
    return super.description + (this.#state ? " It is currently on." : " It is currently off.");
  }

  turnOn() {
    this.#state = true;
  }
  turnOff() {
    this.#state = false;
  }
}

export class LightSource extends TriggerObject {
  #inflammable;
  constructor(name, uniqueKey, aliases, description) {
    super(name, uniqueKey, aliases, description);
    this.#inflammable = false;
  }

  get inflammable() {
    return this.#inflammable;
  }
  get description() {
    if (!this.#inflammable) {
      return super.description;
    }
    return super.description
      .replace(" It is currently on.", " It is currently lit.")
      .replace(" It is currently off.", " It is currently unlit.");
  }

  set inflammable(canBurn) {
    this.#inflammable = canBurn;
  }

  light() {
    if (this.#inflammable) {
      this.turnOn();
      return true;
    }
    return false;
  }
  extinguish() {
    if (this.#inflammable) {
      this.turnOff();
      return true;
    }
    return false;
  }
}

export class Combineable extends GameObject {
  #canCombineWith;
  #combineResult;
  constructor(name, uniqueKey, aliases, description, canCombineWith, combineResult) {
    super(name, uniqueKey, aliases, description);
    this.#canCombineWith = canCombineWith;
    this.#combineResult = combineResult;
  }

  get canCombineWith() {
    return this.#canCombineWith;
  }
  get combineResult() {
    return this.#combineResult;
  }

  combine(object) {
    if (object.canCombineWith.toLowerCase() === this.uniqueKey.toLowerCase()) {
      return this.#combineResult;
    }
    return false;
  }
}

export class Container extends Lockable {
  #contains;
  #containText;
  #validPrepositions;
  constructor(name, uniqueKey, aliases, description, validPrepositions) {
    super(name, uniqueKey, aliases, description);
    this.#contains = {};
    this.#containText = "It contain's:";
    this.#validPrepositions = validPrepositions;
  }

  get contains() {
    if (!this.isOpen) {
      return null;
    }
    return this.#contains;
  }
  get containText() {
    return this.#containText;
  }
  get validPrepositions() {
    return this.#validPrepositions;
  }

  set containText(newText) {
    this.#containText = newText;
  }

  addItems(...items) {
    items.forEach((item) => {
      item.whereAmI = { place: super.name, preposition: this.#validPrepositions[0] };
      this.#contains[item.uniqueKey] = item;
    });
  }
  removeItem(itemName) {
    this.#contains = Object.fromEntries(
      Object.entries(this.#contains).filter(([key]) => key.toLowerCase() !== itemName.toLowerCase())
    );
  }
  isInContainer(itemName) {
    return this.#contains.hasOwnProperty(itemName);
  }
}

export class Weapon extends GameObject {
  #damage;
  constructor(name, uniqueKey, aliases, description, damage) {
    super(name, uniqueKey, aliases, description);
    this.#damage = damage;
  }

  get damage() {
    return this.#damage;
  }

  attack(target) {
    if (target.canBeAttacked) {
      target.adjustHealth(-this.#damage);
      return this.#damage;
    }
    return false;
  }
}
