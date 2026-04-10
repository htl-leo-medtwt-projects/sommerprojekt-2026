import Dialog from './Dialog.js';
import StartButton from './StartButton.js';
import { preload, setup, draw, keyPressed, mousePressed } from './sketch.js';

const optionsDialog = new Dialog('#options', '#optionsBtn');
const startButton = new StartButton('#startBtn', () => {
    optionsDialog.close();
    startButton.disable();
    document.querySelector('#game').style.display = 'block';
    document.querySelector('#landing-page').style.display = 'none';
    document.querySelector('footer').style.display = 'none';
    document.body.style.overflow = 'hidden';

    const p5 = window.p5;
    if (!p5) {
        throw new Error(
            'p5.js not found. Make sure to include it in your HTML file.',
        );
    }

    let p;
    const appElement = document.querySelector('#game');
    const app = new p5((p5) => {
        p = p5;

        // p5.js lifecycle methods
        p.preload = () => preload(p); // Used to load assets before the sketch starts
        p.setup = () => setup(p); // Initializes the sketch (called once)
        p.draw = () => draw(p); // Draws to the screen (called repeatedly)

        // Event handling functions
        p.keyPressed = () => keyPressed(p); // Triggered when a key is pressed
        p.mousePressed = () => mousePressed(p); // Triggered when a mouse button is pressed
    }, appElement);
});
