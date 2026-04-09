import Dialog from "./Dialog.js";
import StartButton from "./StartButton.js";
import game from "./game.js";

const optionsDialog = new Dialog("#options", "#optionsBtn");
const startButton = new StartButton("#startBtn", () => {
    document.getElementById("game").style.display = "block";
    document.getElementById("landing-page").style.display = "none";
    game("#game");
});
