import levels from './levels.js';
import options from './options.js';

let assets;
let playerPosition = { x: 0, y: 0 };
let wantsTransfer = false;
let currentLevel;

export async function setup(p) {
    assets = {
        baseMap: {
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
        },
        varMap: {
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
        },

        playerImage: await p.loadImage('./assets/ghost/ghost (15).png'), // White ghost
    };

    p.createCanvas(window.innerWidth, window.innerHeight);
    p.windowResized = () => {
        p.resizeCanvas(window.innerWidth, window.innerHeight);
    };

    currentLevel = getLevelByName('home');
}

export function draw(p) {
    p.background('#a2a2a2');
    drawLevel(p);
}

export function keyPressed(p) {
    let newPosition = { ...playerPosition };
    switch (p.key) {
        case 'w':
            newPosition.y -= 1;
            break;
        case 'a':
            newPosition.x -= 1;
            break;
        case 's':
            newPosition.y += 1;
            break;
        case 'd':
            newPosition.x += 1;
            break;
        case 't':
            wantsTransfer = true;
            return;
    }
    if (isTileWalkable(newPosition)) {
        playerPosition = newPosition;
    }
}

function isTileWalkable(position) {
    const tile = getTileAtPosition(position);
    return (
        tile.base !== 'Empt' &&
        tile.variant !== 'Stne' &&
        tile.variant !== 'TreW' &&
        tile.variant !== 'TreS'
    );
}

function getTileAtPosition(position) {
    const rows = currentLevel.string
        .trim()
        .split('\n')
        .map((row) => row.trim().split(' '));

    const boardHeight = rows.length;
    const boardWidth = rows[0].length;

    if (
        position.y < 0 ||
        position.y >= boardHeight ||
        position.x < 0 ||
        position.x >= boardWidth
    ) {
        return { base: 'Empt', variant: 'None' };
    }

    const tile = rows[position.y][position.x].split('/');

    return { base: tile[0], variant: tile[1] };
}

function drawLevel(p) {
    p.push();
    p.imageMode(p.CENTER);

    if (!currentLevel) {
        return;
    }

    const rows = currentLevel.string
        .trim()
        .split('\n')
        .map((row) => row.trim().split(' '));

    const boardWidth = options.tileWidth * rows[0].length;
    const boardHeight = options.tileHeight * rows.length;

    // Update player position to be inside the board
    playerPosition.x = Math.max(
        0,
        Math.min(playerPosition.x, rows[0].length - 1),
    );
    playerPosition.y = Math.max(0, Math.min(playerPosition.y, rows.length - 1));

    // ------- Draw Background box -------
    // p.push();
    // p.fill('#d1d1d1');
    // p.rect(0, 0, boardWidth, boardHeight);
    // p.pop();

    p.translate(boardWidth * 0.6, options.tileHeight * 1.2);

    // throw new Error(JSON.stringify(rows));
    for (let y = 0; y < rows.length; y++) {
        const cols = rows[y];
        for (let x = 0; x < cols.length; x++) {
            p.push();

            // 282 211.5
            const offset = 40;
            const xPosition = ((x - y) * (options.tileWidth + offset)) / 2;
            const yPosition =
                ((x + y) * (options.tileHeight + offset)) / 2 -
                (45 * (x + y)) / 2;
            p.translate(xPosition, yPosition);

            const tile = cols[x].split('/');

            const base = assets.baseMap[tile[0]];
            const variant = assets.varMap[tile[1]];

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

            if (base != null)
                p.image(base, 0, 0, options.tileWidth, options.tileHeight);
            if (variant != null) {
                p.push();
                p.imageMode(p.CENTER);
                p.scale(0.7);
                p.image(variant, 0, variant.height / -2.2);
                p.pop();
            }
            if (playerPosition.x === x && playerPosition.y === y) {
                p.push();
                p.scale(0.8);
                p.translate(0, -75);
                p.image(assets.playerImage, 0, 0);
                p.pop();

                for (const transfer of currentLevel.transfers ?? []) {
                    if (transfer.from.x === x && transfer.from.y === y) {
                        if (wantsTransfer) {
                            wantsTransfer = false;
                            playerPosition = {
                                x: transfer.to.x,
                                y: transfer.to.y,
                            };
                            currentLevel = getLevelByName(transfer.to.level);
                            console.log('Transferred to', currentLevel.name);
                        } else {
                            drawTransferMarker(p, transfer);
                        }
                    }
                }
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

function drawTransferMarker(p, transfer) {
    p.push();
    p.fill(255, 255, 255, 200);
    p.noStroke();
    p.rect(-100, -120, 200, 40);
    p.fill(0, 0, 0);
    p.textSize(20);
    p.textAlign(p.CENTER, p.CENTER);
    p.textFont('monospace');
    p.text(`[T] Go to ${getCleanLevelName(transfer.to.level)}`, 0, -100);
    p.pop();
}

function getLevelByName(name) {
    return levels.find((level) => level.name === name) ?? null;
}

function getCleanLevelName(_name) {
    let name = getLevelByName(_name).name;
    const matches = new RegExp('level(\\d+)').exec(name);
    if (matches) {
        const levelNumber = matches[1];
        return name.replace(`level${levelNumber}`, `Level ${levelNumber}`);
    } else {
        return name;
    }
}