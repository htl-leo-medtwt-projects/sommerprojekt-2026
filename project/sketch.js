import levels from './levels.js';
import options from './options.js';

const { tileHeight, tileWidth } = options;

let baseMap;
let varMap;
let playerPosition = { x: 0, y: 0 };

export async function setup(p) {
    baseMap = {
        Empt: null,
        Gren: await p.loadImage('./assets/winter/winter (26).png'), // Green Ground
        GrSu: await p.loadImage('./assets/winter/winter (27).png'), // Green Ground, sunken
        GrDi: await p.loadImage('./assets/winter/winter (28).png'), // Green Ground, with Dirt
        Snow: await p.loadImage('./assets/winter/winter (31).png'), // Snow Ground
        SnSu: await p.loadImage('./assets/winter/winter (32).png'), // Snow Ground, sunken
        SnPa: await p.loadImage('./assets/winter/winter (33).png'), // Snow Ground, with stone path
        SnRo: await p.loadImage('./assets/winter/winter (34).png'), // Snow Ground, with round stone
        SnQu: await p.loadImage('./assets/winter/winter (35).png'), // Snow Ground, with square stone
        Wood: await p.loadImage('./assets/winter/winter (36).png'), // Wood
        Brdg: await p.loadImage('./assets/winter/winter (37).png'), // Bridge
    };

    varMap = {
        None: null,
        Plyr: null, // Player Start Position
        SgnX: await p.loadImage('./assets/winter/winter (1).png'), // Sign with Skull
        SgnF: await p.loadImage('./assets/winter/winter (2).png'), // Sign pointing forwards
        SgnR: await p.loadImage('./assets/winter/winter (3).png'), // Sign pointing right
        SgnL: await p.loadImage('./assets/winter/winter (4).png'), // Sign pointing left
        Plrd: await p.loadImage('./assets/winter/winter (5).png'), // Pole with red flag
        Plbl: await p.loadImage('./assets/winter/winter (6).png'), // Pole with blue flag
        Spar: await p.loadImage('./assets/winter/winter (7).png'), // Spear
        Lfdk: await p.loadImage('./assets/winter/winter (10).png'), // Darker Leaf
        Lflt: await p.loadImage('./assets/winter/winter (11).png'), // Darker Leaf
        Skll: await p.loadImage('./assets/winter/winter (12).png'), // Skull
        Flr1: await p.loadImage('./assets/winter/winter (13).png'), // Flower 1 (White)
        Flr2: await p.loadImage('./assets/winter/winter (14).png'), // Flower 2 (Yellow)
        Flr3: await p.loadImage('./assets/winter/winter (15).png'), // Flower 3 (No Flower)
        Flr4: await p.loadImage('./assets/winter/winter (16).png'), // Flower 4 (Red)
        Flr5: await p.loadImage('./assets/winter/winter (17).png'), // Flower 5 (White)
        Path: await p.loadImage('./assets/winter/winter (18).png'), // Stone Path
        Stne: await p.loadImage('./assets/winter/winter (21).png'), // Big Stone
        TreW: await p.loadImage('./assets/winter/winter (22).png'), // Winter Tree
        TreS: await p.loadImage('./assets/winter/winter (23).png'), // Summer Tree
    };

    p.createCanvas(window.innerWidth, window.innerHeight);
    p.windowResized = () => {
        p.resizeCanvas(window.innerWidth, window.innerHeight);
    };
}

export function draw(p) {
    p.background('#a2a2a2');
    drawLevel(p, levels[0].string);
}

function drawLevel(p, level) {
    p.push();
    p.imageMode(p.CENTER);

    const rows = level
        .trim()
        .split('\n')
        .map((row) => row.trim().split(' '));

    const boardWidth = tileWidth * rows[0].length;
    const boardHeight = tileHeight * rows.length;

    // Update player position to be inside the board
    playerPosition.x = Math.max(0, Math.min(playerPosition.x, rows[0].length - 1));
    playerPosition.y = Math.max(0, Math.min(playerPosition.y, rows.length - 1));

    // ------- Draw Background box -------
    // p.push();
    // p.fill('#d1d1d1');
    // p.rect(0, 0, boardWidth, boardHeight);
    // p.pop();

    p.translate(boardWidth * 0.6, tileHeight * 1.2);

    // throw new Error(JSON.stringify(rows));
    for (let y = 0; y < rows.length; y++) {
        const cols = rows[y];
        for (let x = 0; x < cols.length; x++) {
            p.push();

            // 282 211.5
            const offset = 40;
            const xPosition = ((x - y) * (tileWidth + offset)) / 2;
            const yPosition =
                ((x + y) * (tileHeight + offset)) / 2 - (45 * (x + y)) / 2;
            p.translate(xPosition, yPosition);

            const tile = cols[x].split('/');

            const base = baseMap[tile[0]];
            const variant = varMap[tile[1]];

            if (base === undefined) {
                console.error(
                    `Invalid tile: ${tile[0]}/${tile[1]}. Base tile not found.`,
                );
                continue;
            }

            if (variant === undefined) {
                console.error(
                    `Invalid tile: ${tile[0]}/${tile[1]}. Variant not found.`,
                );
                continue;
            }

            if (base != null) p.image(base, 0, 0, tileWidth, tileHeight);
            if (variant != null) {
                p.push();
                p.imageMode(p.CENTER);
                p.scale(0.7);
                p.image(variant, 0, variant.height / -2.2);
                p.pop();
            }
            if (playerPosition.x === x && playerPosition.y === y) {
                p.push();
                p.fill(255, 0, 0);
                p.ellipse(0, 0, 20, 20);
                p.pop();
            }

            p.pop();
        }
    }

    p.pop();

    // ------- Draw Guide Lines -------
    // p.push();
    // p.stroke(100, 0, 0);

    // // X axis lines
    // for (let i = 0; i <= boardWidth; i += tileWidth) {
    //     p.line(i, 0, i, boardHeight);
    // }

    // // Y axis lines (only surface)
    // for (let i = 0; i <= boardHeight; i += tileHeight - 45) {
    //     p.line(0, i, boardWidth, i);
    // }

    // p.stroke(0, 0, 100);

    // for (let i = tileWidth / 2; i <= boardWidth; i += tileWidth) {
    //     p.line(i, 0, i, boardHeight);
    // }

    // for (
    //     let i = (tileHeight - 45) / 2;
    //     i <= boardHeight;
    //     i += tileHeight - 45
    // ) {
    //     p.line(0, i, boardWidth, i);
    // }

    // p.stroke(0, 0, 255, 100);

    // for (let i = 0; i <= boardHeight; i += tileHeight) {
    //     p.line(0, i, boardWidth, i);
    // }

    // p.stroke(255, 0, 0);
    // p.strokeWeight(2);

    // // draw grid
    // p.line(0, boardHeight / 2, boardWidth, boardHeight / 2);
    // p.line(boardWidth / 2, 0, boardWidth / 2, boardHeight);
    // p.pop();
}

export function keyPressed(p) {
    switch (p.key) {
        case 'w':
            console.log('w pressed');
            playerPosition.y -= 1;
            break;
        case 'a':
            console.log('a pressed');
            playerPosition.x -= 1;
            break;
        case 's':
            console.log('s pressed');
            playerPosition.y += 1;
            break;
        case 'd':
            console.log('d pressed');
            playerPosition.x += 1;
            break;
        
    }
}
