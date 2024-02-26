let cloudSystems = [];
let raindropSystems = [];
let numClouds = 3;
let gravity;

function setup() {
  createCanvas(600, 400);
  colorMode(HSB);

  gravity = createVector(0, 0.1);

  for (let i = 0; i < numClouds; i++) {
    let x = random(100, width - 100);
    let y = random(50, 150);
    cloudSystems.push(new ParticleSystem(x, y, true)); // Create clouds
    raindropSystems.push(new ParticleSystem(x, y + 50, false)); // Create raindrops below clouds
  }
}

function draw() {
  background(0, 0, 15);

  for (let cloud of cloudSystems) {
    cloud.update();
  }

  for (let raindropSystem of raindropSystems) {
    raindropSystem.update();
  }

  // Add a border so it looks cool
  noFill();
  strokeWeight(10);
  stroke(0, 0, 100);
  rect(0, 0, width, height);
}

class Particle {
  constructor(x, y, h, isCloud) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-2, 2), random(-1, 1));
    this.acc = createVector(0, 0);

    this.hue = (h + random(20)) % 360;

    this.mass = random(1, 5);

    this.radius = isCloud ? random(20, 30) : 1 + sqrt(this.mass); // Larger radius for clouds

    this.lifetime = random(50, 400);
  }

  addForce(force) {
    let forceWithMass = p5.Vector.div(force, this.mass);
    this.acc.add(forceWithMass);
  }

  addWaterDrag() {
    let dragConstant = -0.3;
    let forceDrag = this.vel.mag() * this.vel.mag() * dragConstant;
    let drag = p5.Vector.normalize(this.vel);
    drag.mult(forceDrag);
    this.addForce(drag);
  }

  update() {
    this.lifetime--;
    if (this.lifetime < 0) {
      this.destroy = true;
    }

    this.radius -= 0.1;

    this.addForce(gravity);

    this.vel.add(this.acc);
    this.vel.limit(5);
    this.pos.add(this.vel);

    this.acc.mult(0);
  }

  show() {
    push();
    noStroke();
    translate(this.pos.x, this.pos.y);
    fill(this.hue, 50, 100, 0.5 - map(this.lifetime, 0, 100, .5, 0));
    ellipse(0, 0, this.radius * 2);
    pop();
  }
}

class ParticleSystem {
  constructor(x, y, isCloud) {
    this.pos = createVector(x, y);
    this.particles = [];
    this.active = true; // Always active for clouds and raindrops
    this.hue = isCloud ? random(200, 240) : random(360); // Blueish hue for clouds, random for raindrops
    this.isCloud = isCloud;
  }

  update() {
    if (this.active) {
      let numParticles = this.isCloud ? 5 : 1; // Create more particles for clouds
      for (let i = 0; i < numParticles; i++) {
        this.particles.push(new Particle(this.pos.x, this.pos.y, this.hue, this.isCloud));
      }
    }

    for (let particle of this.particles) {
      particle.update();
      particle.show();
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      if (this.particles[i].destroy) {
        this.particles.splice(i, 1);
      }
    }
  }
}
