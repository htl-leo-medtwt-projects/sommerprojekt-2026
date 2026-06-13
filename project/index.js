import StartButton from './StartButton.js';
import Shop from './Shop.js';
import {
    setup,
    draw,
    keyPressed,
    setShop,
    respawn,
    calculatePlayerStats,
} from './sketch.js';

const shop = new Shop();
shop.setStatCalculator(calculatePlayerStats);
setShop(shop);
const startButton = new StartButton('#startBtn', () => {
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
    new p5((p5) => {
        p = p5;

        p.setup = () => setup(p);
        p.draw = () => draw(p);

        p.keyPressed = () => keyPressed(p);
    }, appElement);
});

if (localStorage.getItem('debug') != null) {
    startButton.button.dispatchEvent(new Event('click'));
}

// Wire up respawn button
document.getElementById('respawnBtn')?.addEventListener('click', respawn);
