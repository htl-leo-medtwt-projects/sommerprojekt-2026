import { preload, setup, draw, keyPressed, mousePressed } from './sketch.js';

export default function game(appQuery) {
    const appElement = document.querySelector(appQuery);
    if (!appElement) {
        throw new Error(
            `Canvas with query selector "${appQuery}" not found. Make sure to include it in your HTML file.`,
        );
    }

    const p5 = window.p5;
    if (!p5) {
        throw new Error(
            'p5.js not found. Make sure to include it in your HTML file.',
        );
    }

    let p;
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
}
