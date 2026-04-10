export function preload(p) {
    // preload() is used for preloading assets before the sketch runs
    // This function runs once before setup() and is typically used for loading files (e.g., images, sounds)
    // https://p5js.org/reference/p5/preload/
}

export function setup(p) {
    // setup() runs once at the beginning of the sketch, used for initial setup (e.g., canvas size)
    // It is called only once at the start of the sketch
    p.createCanvas(window.innerWidth, window.innerHeight); // Creates a canvas that uses the full page width and height
    p.windowResized = () => {
        p.resizeCanvas(window.innerWidth, window.innerHeight);
    };
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

  p.background('black');
  rectangles(p);
}

function rectangles(p) {
  p.colorMode(p.HSB, 500);
  for (let x = 25; x < 475; x += 25) {
    for (let y = 25; y < 425; y += 25) {
      p.fill(x, 500, 500);
      p.rect(x + p.random(-2, 2), y + p.random(-2, 2), 20, 20);
    }
  }
}