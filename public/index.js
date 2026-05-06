import { setup, draw, keyPressed } from './sketch.js';

console.clear();

const p5 = window.p5;
if (!p5) {
    throw new Error(
        'p5.js not found. Make sure to include it in your HTML file.',
    );
}

let p;
new p5((p5) => {
    p = p5;

    p.setup = () => setup(p);
    p.draw = () => draw(p);

    p.keyPressed = () => keyPressed(p);
});
