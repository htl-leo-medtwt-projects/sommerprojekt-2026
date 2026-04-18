import Dialog from './Dialog.js';
import StartButton from './StartButton.js';
import { setup, draw } from './sketch.js';

export const dx = 70;
export const dy = 10;

console.clear();
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

        p.setup = () => setup(p);
        p.draw = () => draw(p);
    }, appElement);
});

// Debug: Start Game on refresh
startButton.button.dispatchEvent(new Event('click'));
