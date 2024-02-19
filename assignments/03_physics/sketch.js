let baseRadiusSlider;
let xoff = 0;

let particles = [];

function setup() {
  createCanvas(600, 400);
  colorMode(HSB);

  baseRadiusSlider = createSlider(0, 1, 0.1, 0.01);
  baseRadiusSlider.position(50, 50);
  baseRadiusSlider.size(width - 100);

  frameRate(60);

  for (let i = 0; i < 100; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
}

function draw() {
  background(0, 0, 100);

  for (let i = 0; i < particles.length; i++) {
    let particle = particles[i];
    particle.update();
    particle.display();
  }
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 4;
    this.maxForce = 0.1;
  }

  update() {
    let angle = noise(this.pos.x * 0.01, this.pos.y * 0.01) * TWO_PI * 16;
    let force = p5.Vector.fromAngle(angle);
    force.mult(baseRadiusSlider.value());
    this.applyForce(force);
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.edges();
  }

  applyForce(force) {
    this.acc.add(force);
  }

  edges() {
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }

  display() {
    stroke(0);
    strokeWeight(3);
    point(this.pos.x, this.pos.y);
  }
}
