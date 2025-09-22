import { getRoomDescription,cmdNotFoundMemes } from "./data.js";
import { parseInput,commands,outputText } from "./game.js";
import { player, rooms } from "./init.js";


const inputElement = document.querySelector("#input");
const outputElement = document.querySelector("#output");
const roomDesc = document.querySelector("#roomDesc");
roomDesc.innerHTML = getRoomDescription(player.currentRoom);

inputElement.focus();
inputElement.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const inputValue = inputElement.value;
    if (inputValue.trim() === "") return;

    const parsedInput = parseInput(inputValue);

    inputElement.value = "";

    try {
      commands[parsedInput.verb](parsedInput.verb, parsedInput.nouns, parsedInput.preps, parsedInput.originalVerb);
    } catch (error) {
      console.error(error);
      const randomIndex = Math.floor(Math.random() * cmdNotFoundMemes.length);
      outputText.push(cmdNotFoundMemes[randomIndex]);
    }

    roomDesc.innerHTML = getRoomDescription(player.currentRoom);
    outputElement.innerHTML = outputText.join("<br>");

    // always scroll to the bottom of the outputElement after each input
    outputElement.scrollTop = outputElement.scrollHeight;

    console.log(rooms, player);
  }
});