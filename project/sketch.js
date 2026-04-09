// p5.js sketch functions

export function preload(p) {
    // preload() is used for preloading assets before the sketch runs
    // This function runs once before setup() and is typically used for loading files (e.g., images, sounds)
    // https://p5js.org/reference/p5/preload/
}

export function setup(p) {
    // setup() runs once at the beginning of the sketch, used for initial setup (e.g., canvas size)
    // It is called only once at the start of the sketch
    p.createCanvas(700, 500); // Creates a 700x500 canvas
}

export function keyPressed(p) {
    // keyPressed() is triggered whenever a key is pressed
    // It's used to handle keyboard input
    // https://p5js.org/reference/p5/keyPressed
    console.log(`Key ${p.keyCode} has been pressed`); // Log the key code when a key is pressed
}

export function mousePressed(p) {
    // mousePressed() is triggered when a mouse button is pressed
    // It's used to handle mouse input
    // https://p5js.org/reference/p5/mousePressed
    console.log(`Mouse was pressed at ${p.mouseX}/${p.mouseY}`); // Log the mouse position when clicked
}

export function draw(p) {
    // draw() is called repeatedly to update the sketch's visuals (animations, graphics, etc.)
    // It's continuously called while the sketch is running
    // https://p5js.org/reference/p5/draw

    // Example: Draw a yellow background with a circle in the center
    p.background('yellow');
    p.circle(p.width / 2, p.height / 2, 50);
}
