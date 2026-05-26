import levels from './levels.js';
import options from './options.js';
import opponents from './opponents.js';

let assets;
let playerPosition = { x: 0, y: 0 };
let playerBalance = 0;
let playerDefense = 0;
let playerAttack = 1;
let currentFight;
let playerHealth = options.defaultHealth;
let killedOpponents = [];
let wantsTransfer = false;
let currentLevel;
let currentHits = [];
let lastCombatTime = Date.now();
let lastCombatTick = 0;

/**
 * Handle p5 setup
 * @param {p5} p p5.js Object
 */
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
            Shop: await p.loadImage('./assets/ghost/ghost (11).png'), // Shop
        },
        opponents: Object.fromEntries(
            await Promise.all(
                opponents.map(async (opponent) => [
                    opponent.id,
                    await p.loadImage(opponent.sprite),
                ]),
            ),
        ),

        playerImage: await p.loadImage('./assets/ghost/ghost (13).png'), // Green ghost
        backgroundMusic: await p.loadSound(
            './assets/elias_weber-auf-grunen-wiesen-127713.mp3',
        ),
        playerMovement: await p.loadSound(
            './assets/dragon-studio-simple-whoosh-382724.mp3',
        ),
        playerHit: await p.loadSound(
            './assets/u_xjrmmgxfru-hit-flesh-02-266309.mp3',
        ),
    };

    p.createCanvas(window.innerWidth, window.innerHeight);
    p.windowResized = () => {
        p.resizeCanvas(window.innerWidth, window.innerHeight);
    };

    currentLevel = getLevelByName('home');
    assets.backgroundMusic.loop();
    assets.backgroundMusic.play();

    loadState();
    document.querySelector('#loader')?.remove();
}

/**
 * Handle p5 loop
 * @param {p5} p p5.js Object
 */
export function draw(p) {
    p.background('#a2a2a2');
    drawLevel(p);
    drawMinimap(p);
    drawBalance(p);
}

/**
 * Handle p5 key presses
 * @param {p5} p p5.js Object
 */
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
        saveState();
    }
}

/**
 * Checks if the tile at the given position is walkable
 * @param {{x: number, y: number}} position
 * @returns {boolean}
 */
function isTileWalkable(position) {
    const tile = getTileAtPosition(position);
    return (
        tile.base !== 'Empt' &&
        tile.variant !== 'Stne' &&
        tile.variant !== 'TreW' &&
        tile.variant !== 'TreS'
    );
}

/**
 * Gets the tile at the given position
 * @param {{x: number, y: number}} position
 * @returns {{base: string, variant: string}}
 */
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

/**
 * Draws the current level
 * @param {p5} p p5.js Object
 */
function drawLevel(p) {
    p.push();
    p.imageMode(p.CENTER);

    if (!currentLevel) {
        return;
    }

    const rows = getLevelArray(currentLevel);

    const boardWidth = options.tileWidth * rows[0].length;
    // const boardHeight = options.tileHeight * rows.length;

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

    // Calculate center of the board in isometric coordinates
    const centerX = (rows[0].length - 1) / 2;
    const centerY = (rows.length - 1) / 2;
    const offset = 40;
    const boardCenterX =
        ((centerX - centerY) * (options.tileWidth + offset)) / 2;
    const boardCenterY =
        ((centerX + centerY) * (options.tileHeight + offset)) / 2 -
        (45 * (centerX + centerY)) / 2;

    // Translate to center of screen, then offset by board center
    p.translate(p.width / 2 - boardCenterX, p.height / 2 - boardCenterY);

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
            // Draw opponents
            for (const opponent of currentLevel.opponents ?? []) {
                if (
                    opponent.x === x &&
                    opponent.y === y &&
                    !killedOpponents.some(
                        (v) =>
                            v.opponent.x === x &&
                            v.opponent.y === y &&
                            v.level === currentLevel.name,
                    )
                ) {
                    p.push();
                    p.scale(0.5);
                    p.translate(
                        20 * Math.sin(p.frameCount * 0.02),
                        -90 + -20 * Math.cos(p.frameCount * 0.1),
                    );
                    p.image(assets.opponents[opponent.type], 0, 0);
                    p.pop();

                    if (
                        playerPosition.x === x &&
                        playerPosition.y === y &&
                        !currentFight
                    ) {
                        playerOpponentCollision(opponent);
                    }
                }
            }

            if (playerPosition.x === x && playerPosition.y === y) {
                p.push();
                p.scale(0.5);
                p.translate(0, -90 + -20 * Math.cos(p.frameCount * 0.04));
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
                            saveState();
                            assets.playerMovement.play();
                            console.log('Transferred to', currentLevel.name);
                        } else {
                            drawTransferMarker(p, transfer);
                        }
                    }
                }

                for (const hit of currentHits) {
                    p.push();
                    p.translate(0, -50);
                    p.rotate(hit.rotation);
                    p.fill(hit.color);
                    p.textAlign(p.CENTER);
                    // Interpolate Text size from min to max over the hit's lifetime
                    p.textSize(
                        hit.minSize +
                            (hit.maxSize - hit.minSize) *
                                ((Date.now() - hit.startTime) / hit.length),
                    );
                    p.text(hit.text, 0, 0);
                    p.pop();

                    if (Date.now() - hit.startTime > hit.length) {
                        currentHits.splice(currentHits.indexOf(hit), 1);
                    }
                }

                wantsTransfer = false;

                if (variant === assets.varMap.Shop) {
                    // TODO: Add Shop
                }
                if (currentFight) {
                    if (Date.now() > lastCombatTime + currentFight.cooldown) {
                        console.log(
                            `Combat tick: ${lastCombatTick} Opponent: ${currentFight.type.name} Health: ${currentFight.opponentHealth} Player Health: ${playerHealth}`,
                        );
                        // Damage on Player = Attack of Opponent - Defense of Player
                        // Damage on Opponent = Attack of Player - Defense of Opponent
                        const opponentAttack = Math.floor(
                            currentFight.type.attack.min +
                                (currentFight.type.attack.max -
                                    currentFight.type.attack.min) *
                                    Math.random(),
                        );
                        const opponenrDefense = Math.floor(
                            currentFight.type.defense.min +
                                (currentFight.type.defense.max -
                                    currentFight.type.defense.min) *
                                    Math.random(),
                        );

                        if (lastCombatTick % 2 == 0) {
                            const absolutePlayerDamage = Math.max(
                                0,
                                opponentAttack - opponenrDefense,
                            );

                            playerHealth -= absolutePlayerDamage;
                            addHit(`-${absolutePlayerDamage}`, 'red');
                        } else {
                            const absoluteOpponentDamage = Math.max(
                                0,
                                opponentAttack - opponenrDefense,
                            );
                            currentFight.opponentHealth -=
                                absoluteOpponentDamage;
                            addHit(`-${absoluteOpponentDamage}`, 'white');
                        }
                        if (playerHealth <= 0) {
                            playerHealth = 0;
                            // TODO: Handle player death
                        }
                        if (currentFight.opponentHealth <= 0) {
                            currentFight.opponentHealth = 0;

                            killedOpponents.push({
                                level: currentLevel.name,
                                opponent: currentFight.type,
                            });
                            currentLevel.opponents.splice(
                                currentLevel.opponents.indexOf(
                                    currentFight.type,
                                ),
                                1,
                            );

                            playerBalance +=
                                currentFight.type.lootables.min +
                                Math.floor(
                                    Math.random() *
                                        (currentFight.type.lootables.max -
                                            currentFight.type.lootables.min +
                                            1),
                                );

                            currentFight = null;
                            addHit(`+${playerBalance}`, 'green');
                        }
                        lastCombatTime = Date.now();
                        lastCombatTick++;
                    }
                }
            }

            p.pop();
        }
    }

    p.pop();
}

/**
 * Draws a transfer marker at the given position
 * @param {p5} p p5.js Object
 * @param {Object} transfer The transfer object
 */
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

/**
 * Returns a level by its name
 * @param {string} name The level name
 * @returns {Object} The level object
 */
function getLevelByName(name) {
    return levels.find((level) => level.name === name) ?? null;
}

/**
 * Returns a clean level name for display
 * @param {string} _name The level name
 * @returns {string} The clean level name
 */
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

/**
 * Converts a level string to a 2D array
 * @param {Object} level The level object
 * @returns {string[][]} 2D array representation of the level
 */
function getLevelArray(level) {
    return level.string
        .trim()
        .split('\n')
        .map((row) => row.trim().split(' '));
}

/**
 * Draws the minimap in the bottom right corner
 * @param {p5} p p5.js Object
 */
function drawMinimap(p) {
    if (!currentLevel) return;

    // Calculate minimap position, size, and center
    const minimapSize = 150;
    const margin = 10;
    const minimapX = p.width - minimapSize * 0.5 - margin;
    const minimapY = p.height - minimapSize * 0.5 - margin;
    const gridCenterX = Math.floor(getLevelArray(currentLevel)[0].length / 2);
    const gridCenterY = Math.floor(getLevelArray(currentLevel).length / 2);

    p.push();
    p.translate(minimapX, minimapY);

    // Draw minimap background
    p.stroke(255, 255, 255);
    p.fill(255, 255, 255, 100);
    p.strokeWeight(2);
    p.rectMode(p.CENTER);
    p.rect(0, 0, minimapSize, minimapSize, 10);

    // Draw current island
    drawIslandMinimap(p, 0, 0, true);

    // Draw other islands
    const transfers = currentLevel.transfers || [];
    for (const transfer of transfers) {
        const targetLevel = getLevelByName(transfer.to.level);
        if (!targetLevel) continue;

        const distance = 5;
        const islandPos = { x: 0, y: 0 };

        // Calculate island position based on transfer direction
        if (transfer.from.x > gridCenterX) {
            islandPos.x = 25 + distance;
            islandPos.y = (25 + distance) * 0.5;
        } else if (transfer.from.x < gridCenterX) {
            islandPos.x = -(25 + distance);
            islandPos.y = -(25 + distance) * 0.5;
        } else if (transfer.from.y > gridCenterY) {
            islandPos.y = (25 + distance) * 0.5;
            islandPos.x = -(25 + distance);
        } else if (transfer.from.y < gridCenterY) {
            islandPos.y = -(25 + distance) * 0.5;
            islandPos.x = 25 + distance;
        } else {
            // If exactly in center, place it north by default
            islandPos.y = -(25 + distance);
            islandPos.x = -(25 + distance) * 0.5;
        }

        drawIslandMinimap(p, islandPos.x, islandPos.y, false);
    }

    p.pop();
}

/**
 * Draws one island for the minimap
 * @param {p5} p p5.js Object
 * @param {number} x X position of the island in minimap coordinates
 * @param {number} y Y position of the island in minimap coordinates
 * @param {boolean} isCurrent Whether this is the current island
 */
function drawIslandMinimap(p, x, y, isCurrent) {
    p.push();

    p.translate(x, y);

    if (isCurrent) {
        p.fill('#57cc82');
        p.stroke('#469556');
        p.strokeWeight(2);
    } else {
        p.fill('#57cc82dd');
        p.stroke('#469556dd');
        p.strokeWeight(1);
    }

    p.quad(0, -25 / 2, 25, 0, 0, 25 / 2, -25, 0);

    p.pop();
}

/**
 * Saves the current game state to localStorage
 */
function saveState() {
    localStorage.setItem(
        'saveState',
        JSON.stringify({
            currentLevel,
            playerPosition,
            playerBalance,
            killedOpponents,
            playerLives: playerHealth,
        }),
    );
}

/**
 * Loads the game state from localStorage
 */
function loadState() {
    const savedState = localStorage.getItem('saveState');
    if (savedState) {
        const state = JSON.parse(savedState);
        currentLevel = state.currentLevel;
        playerPosition = state.playerPosition;
        playerBalance = state.playerBalance;
        killedOpponents = state.killedOpponents;
        playerHealth = state.playerLives;
    }
}

/**
 * Handles collision between player and opponent
 * @param {*} opponent the opponent that was collided with
 */
function playerOpponentCollision(opponent) {
    console.log(opponent);
    const type = opponents[opponent.type];
    currentFight = {
        opponent: opponent,
        type: type,
        cooldown: 1000,
        opponentHealth: type.lives,
    };
}

/**
 * Draws the player's balance
 * @param {p5} p p5.js Object
 */
function drawBalance(p) {
    p.push();
    p.fill(255);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(16);
    p.push();
    p.textFont('lucide');
    p.text(`\n`, 10, 10);
    p.pop();
    p.text(`${playerHealth}\n${playerBalance}`, 30, 12);
    p.pop();
}

function addHit(text, color = 'white') {
    const startSize = Math.random() * 40 + 10;
    currentHits.push({
        text,
        rotation: (Math.random() - 0.5) * 20 * (Math.PI / 180), // plus 10deg to minus 10 deg
        minSize: startSize,
        maxSize: startSize - 20,
        length: Math.random() * 2000 + 1000, // ms
        startTime: Date.now(),
        color,
    });
}
