let dots = [];
let numDots = 1000;
let gravity = 0.098;

// p5 calls this function right away when the webpage is loaded
function setup() {
  createCanvas(800, 600);
  colorMode(HSB);
  noStroke();
  
  // Create an array of Dot objects (see the class below)
  for (let i = 0; i < numDots; i++) {
    // Make use of the iterator variable (i) to compute the x position of the dot
    let x = width / numDots * i;
    dots[i] = new Dot(x, 0, 10, i);
  }
}

// The draw function is called over and over again really fast by p5
function draw() {
  background(0, 0, 100, 0.08);

  // Loop through the array of dots that we created on inside the start function, and 
  // call their update function.
  for (let i = 0; i < dots.length; i++) {
    dots[i].update();
  }
}



// Below, we define the Dot class, which defined the objects we instantiate inside the
// setup function above.
class Dot {
  constructor(x, y, diameter, id) {

    this.position = createVector(x, y);

    this.velocity = createVector(0, 0);

    this.id = id;

    this.diameter = diameter + random(-15, 15);

    this.hue = this.id / numDots * 360;
  }

  // This is the function that is called in the draw function above.
  update() {
    this.position.x += random(-5, 5);

    this.velocity.y += gravity;

    this.position.add(this.velocity);

    if (this.position.y + this.diameter/2 > height) {
      this.velocity.y *= -1;
      this.position.add(this.velocity);
    }

    fill(this.hue, 50, 100);
    ellipse(this.position.x, this.position.y, this.diameter, this.diameter);
  }
}
