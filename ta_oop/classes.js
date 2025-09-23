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
      item.whereAmI = { key: super.uniqueKey, name: "inventory", preposition: "in" };
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
  isInventoryEmpty() {
    return Object.keys(this.#inventory).length === 0;
  }
  diagnose() {
    const healthBarLength = 20;
    const healthUnits = Math.round((this.#health / 100) * healthBarLength);
    const healthBar = "[" + "#".repeat(healthUnits) + "-".repeat(healthBarLength - healthUnits) + "]";

    return `You are <strong>${this.#condition}</strong><br>Health: ${this.#health}/100 ${healthBar}`;
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
  #hear;
  #taste;
  #hidden;
  #trigger;

  constructor(name, uniqueKey, aliases, description) {
    this.#name = name;
    this.#uniqueKey = uniqueKey;
    this.#aliases = aliases;
    this.#description = description;
    this.#smell = "It smells like nothing in particular.";
    this.#hear = "You hear nothing special.";
    this.#taste = "It tastes like nothing in particular.";
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
  get hear() {
    return this.#hear;
  }
  get taste() {
    return this.#taste;
  }
  get hidden() {
    return this.#hidden;
  }
  get aliases() {
    return this.#aliases;
  }
  get triggers() {
    return this.#trigger;
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
  set hear(newNoise) {
    this.#hear = newNoise;
  }
  set taste(newTaste) {
    this.#taste = newTaste;
  }
  set hidden(isHidden) {
    this.#hidden = isHidden;
  }

  createTrigger(onCommand, script) {
    this.#trigger[onCommand] = script;
  }
  deleteTrigger(onCommand) {
    if (this.#trigger[onCommand]) {
      delete this.#trigger[onCommand];
      return true;
    }
    return false;
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
      obj.whereAmI = { key: super.uniqueKey, name: "room", preposition: "in" };
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
  #canThrow;
  #canClimb;
  #isAlive;
  constructor(name, uniqueKey, aliases, description) {
    super(name, uniqueKey, aliases, description);

    const article = ["a", "e", "i", "o", "u"].includes(name[0].toLowerCase()) ? "an" : "a";
    this.smell = `It smells like ${article} <strong>${name.toLowerCase()}</strong>`;
    this.hear = `It sounds like ${article} <strong>${name.toLowerCase()}</strong>`;
    this.taste = `It tastes like ${article} <strong>${name.toLowerCase()}</strong>`;
    this.#read = "";
    this.#canBeAttacked = false;
    this.#canTake = false;
    this.#sceneryDescription = "";
    this.#condition = "intact";
    this.#moveable = false;
    this.#health = 100;
    this.#whereAmI = { key: uniqueKey, name: "room", preposition: "in" };
    this.#canThrow = false;
    this.#canClimb = false;
    this.#isAlive = false;
  }

  get description() {
    if (this.#condition !== "intact" && this.#condition !== "healthy") {
      return super.description + ` It is currently ${this.#condition}.`;
    }
    return super.description;
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
  get canThrow() {
    return this.#canThrow;
  }
  get canClimb() {
    return this.#canClimb;
  }
  get isAlive() {
    return this.#isAlive;
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
  set canThrow(throwable) {
    this.#canThrow = throwable;
  }
  set canClimb(climbable) {
    this.#canClimb = climbable;
  }
  set isAlive(alive) {
    this.#isAlive = alive;
  }

  adjustHealth(amount) {
    this.#health += amount;
    if (this.#health > 100) {
      this.#health = 100;
    }
    if (this.#health <= 0) {
      this.#health = 0;
      this.#condition = "destroyed";
      if (this.#isAlive) {
        this.#condition = "dead";
      }
    } else if (this.#health < 30) {
      this.#condition = "heavily damaged";
      if (this.#isAlive) {
        this.#condition = "critically injured";
      }
    } else if (this.#health < 70) {
      this.#condition = "slightly damaged";
      if (this.#isAlive) {
        this.#condition = "injured";
      }
    } else {
      this.#condition = "intact";
      if (this.#isAlive) {
        this.#condition = "healthy";
      }
    }
  }
}

export class Lockable extends GameObject {
  #isLocked;
  #isOpen;
  #keyName;
  #alwaysOpen;
  constructor(name, uniqueKey, aliases, description) {
    super(name, uniqueKey, aliases, description);
    this.#isLocked = false;
    this.#isOpen = false;
    this.#keyName = "";
    this.#alwaysOpen = false;
  }

  get description() {
    let descText = super.description;
    if (this.#alwaysOpen) {
      return descText;
    }
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
  get alwaysOpen() {
    return this.#alwaysOpen;
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
  set alwaysOpen(alwaysOpen) {
    this.#alwaysOpen = alwaysOpen;
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
    this.#canWear = true;
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
    this.#isEquipped = true;
    return true;
  }
  undress() {
    this.#isEquipped = false;
    return true;
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
  #stateOnDescription;
  #stateOffDescription;
  constructor(name, uniqueKey, aliases, description) {
    super(name, uniqueKey, aliases, description);
    this.#state = false;
    this.#stateOnDescription = "It is currently on.";
    this.#stateOffDescription = "It is currently off.";
  }

  get state() {
    return this.#state;
  }
  get description() {
    return super.description + (this.#state ? this.#stateOnDescription : this.#stateOffDescription);
  }

  set stateOnDescription(newDescriptions) {
    this.#stateOnDescription = newDescriptions;
  }
  set stateOffDescription(newDescriptions) {
    this.#stateOffDescription = newDescriptions;
  }

  turnOn() {
    this.#state = true;
  }
  turnOff() {
    this.#state = false;
  }
}

export class LightSource extends TriggerObject {
  constructor(name, uniqueKey, aliases, description) {
    super(name, uniqueKey, aliases, description);
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
    if (object.canCombineWith === this.uniqueKey) {
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
    if (super.alwaysOpen || this.isOpen) {
      return this.#contains;
    }
    if (!this.isOpen) {
      return null;
    }
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
      item.whereAmI = { key: super.uniqueKey, name: super.name, preposition: this.#validPrepositions[0] };
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
  isEmpty() {
    return Object.keys(this.#contains).length === 0;
  }
}

export class TableLike extends Container {
  constructor(name, uniqueKey, aliases, description, validPrepositions) {
    super(name, uniqueKey, aliases, description, validPrepositions);
    super.alwaysOpen = true;
    super.isOpen = true;
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
