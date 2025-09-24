import { GameObject } from "../../classes.js"; 
import { player } from "../../init.js";

export const book = new GameObject(
  "book",
  "book1",
  ["book", "mystic book", "old book", "grimoire"],
  "A very old-looking book lies on the table. A red magical symbol can be seen on the black cover."
);

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
