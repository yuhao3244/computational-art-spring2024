let dots = [];
let numDots = 600;
let gravity = 3;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB);
  noStroke();
  
  for (let i = 0; i < numDots; i++) {
    let x = width / numDots * i;
    dots[i] = new Dot(3*x, x, 10, i);
  }
}

function draw() {
  background(0, 0, 100, 0.08);

  for (let i = 0; i < dots.length; i++) {
    dots[i].update();
  }
}

class Dot {
  constructor(x, y, diameter, id) {

    this.position = createVector(x, y);

    this.velocity = createVector(0, 0);

    this.id = id;

    this.diameter = diameter + random(-15, 15);

    this.hue = this.id / numDots * 360;
  }

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
