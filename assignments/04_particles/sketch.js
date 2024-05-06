let particles = [];
let mousePos;
let fishImg;

function preload() {
  fishImg = loadImage('fish.png'); 
}

function setup() {
  createCanvas(640, 480);
  mousePos = createVector(width / 2, height / 2);
  for (let i = 0; i < 200; i++) {
    let p = new Particle(random(width), random(height));
    particles.push(p);
  }
}

function draw() {
  background(173, 216, 230); 
  mousePos.set(mouseX, mouseY);
  
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.update();
    p.display();
  }
  
  fill(255);
  ellipse(mouseX, mouseY, 5);
}

class Particle {
  constructor(x, y) {
    this.p = createVector(x, y);
    this.v = createVector(random(-1, 1), random(-1, 1));
    this.radius = random(3, 10);
    this.trail = [];
    this.trailLength = 20;
    this.trailColor = color(random(100, 200), random(100, 200), random(200, 255), 100);
  }

  update() {
    let dir = p5.Vector.sub(mousePos, this.p).normalize().mult(0.1);
    this.v.add(dir);

    this.v.limit(3);

    this.p.add(this.v);

    if (this.p.x < 0 || this.p.x > width || this.p.y < 0 || this.p.y > height) {
      this.p.set(random(width), random(height));
    }

    this.trail.push(this.p.copy());
    if (this.trail.length > this.trailLength) {
      this.trail.splice(0, 1);
    }
  }

  display() {
    noFill();
    beginShape();
    stroke(this.trailColor);
    for (let i = 0; i < this.trail.length; i++) {
      vertex(this.trail[i].x, this.trail[i].y);
    }
    endShape();

    imageMode(CENTER);
    image(fishImg, this.p.x, this.p.y, this.radius * 2, this.radius * 2);
  }
}
