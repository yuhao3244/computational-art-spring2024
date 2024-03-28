let vehicles = [];
let numVehicles = 100;
let target;
let predator;


function setup() {
  createCanvas(600, 600);

  colorMode(HSB);
  noStroke();
  
  target = createVector(width/4, height/2);
  for(let i = 0; i < numVehicles; i++) {
    vehicles.push(new Vehicle(random(width), random(height), target));
  }
  
  predator = new Predator(width / 2, height / 2, 40);
}

function draw() {
  background(0, 0, 100, 1);

  target.x = mouseX; 
  target.y = mouseY;
  
  predator.seek(target); 
  predator.update();
  predator.show();

  for (let i = vehicles.length - 1; i >= 0; i--) { 
    let vehicle = vehicles[i];
    vehicle.update();
    vehicle.show();
    vehicle.wrap();

    if (predator.eat(vehicle)) { 
      vehicles.splice(i, 1);
    }
  }

  ellipse(target.x, target.y, 10, 10);

  for (let vehicle of vehicles) {
    vehicle.update();
    vehicle.show();
    vehicle.wrap();
  }

  // fill(0, 0, 100);
  // rect(0, 0, width, 20);
}


class Predator {
  constructor(x, y, r) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.r = r; 
    this.maxSpeed = 4;
    this.maxForce = 0.1;
  }

  seek(target) {
    let desired = p5.Vector.sub(target, this.pos);
    desired.setMag(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    this.acc.add(steer);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  show() {
    fill(0, 100, 100);
    ellipse(this.pos.x, this.pos.y, this.r * 2);
  }

  eat(vehicle) {
    let d = p5.Vector.dist(this.pos, vehicle.pos);
    if (d < this.r + vehicle.dim / 2) {
      return true;
    }
    return false;
  }
}

class Vehicle {
    constructor(x, y, target) {
        // For more detailed comments on how pos, vel, acc, and addForce work
        // see the Dot example from 2-15-24.

        this.pos = createVector(x, y);
        this.vel = createVector(random(-1, 1), random(-1, 1));
        this.acc = createVector(0, 0);

        this.target = target;
        this.maxSpeed = 5;
        this.maxForce = 0.05;

        this.dim = 0 + random(5);

        this.hue = random(200, 100);
        this.saturation = 70;
        this.brightness = 80;

        this.range = 100;

        this.mass = 1;

        background(0, 0, 100);
    }

    addForce(force) {
        let forceWithMass = p5.Vector.div(force, this.mass);
        this.acc.add(forceWithMass);
    }

    seek(t, arrive) {
        // 1. Compute the desired velocity and set it to be maxSpeed
        let desired = p5.Vector.sub(t, this.pos);

        // desired.mult(-1);

        let distance = desired.mag();

        // If the caller passed in true, and we are close to the target, scale our
        // speed based on the distance.
        if (arrive && distance < 100) {
            let speed = map(distance, 0, 100, 0, this.maxSpeed);
            desired.setMag(speed);
        } else {
            desired.setMag(this.maxSpeed);
        }

        // 2. Compute the force by seeing the the change is in velocities
        // to move from the current velocity to the desired velocity and limit
        // its magnitude.
        let steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxForce);

        // 3. Apple this "steering" force. 
        this.addForce(steer);
    }

    wrap() {
        this.pos.x = (this.pos.x + width) % width;
        this.pos.y = (this.pos.y + height) % height;
    }

    getCloseVehicles() {
        let closeVehicles = [];
        for (let vehicle of vehicles) {
            if (vehicle !== this) {
                if (dist(vehicle.pos.x, vehicle.pos.y, this.pos.x, this.pos.y) < this.range) {
                    closeVehicles.push(vehicle);
                }
            }
        }
        return closeVehicles;
    }

    cohesion(closeVehicles) {
        if (closeVehicles.length > 0) {
            let sumPositions = createVector(0, 0);
            for (let vehicle of closeVehicles) {
                sumPositions.add(vehicle.pos);
            }
            sumPositions.div(closeVehicles.length);

            let desired = p5.Vector.sub(sumPositions, this.pos);
            desired.setMag(this.maxSpeed);
            let steeringForce = p5.Vector.sub(desired, this.vel);
            steeringForce.limit(this.maxForce);
            return steeringForce;
            
        }

        return createVector(0,0);
    }

    separation(closeVehicles) {
        let sumOfAnglesToVehicles = createVector(0, 0);
        for (let vehicle of closeVehicles) {
            let dirToVehicle = p5.Vector.sub(vehicle.pos, this.pos);
            sumOfAnglesToVehicles.add(dirToVehicle);
        }
        if (closeVehicles.length !== 0) {
            sumOfAnglesToVehicles.div(closeVehicles.length);
        }
        sumOfAnglesToVehicles.setMag(this.maxSpeed);
        sumOfAnglesToVehicles.mult(-1);
        
        // compute steering force
        let steeringForce = p5.Vector.sub(sumOfAnglesToVehicles, this.vel);
        steeringForce.limit(this.maxForce);

        return steeringForce;
    }

    alignment(closeVehicles) {
        let sumOfVelocities = createVector(0, 0);
        for (let vehicle of closeVehicles) {
            sumOfVelocities.add(vehicle.vel);
        }
        if (closeVehicles.length > 0) {
            sumOfVelocities.div(closeVehicles.length);
        }
        sumOfVelocities.setMag(this.maxSpeed);
        
        // compute steering force
        let steeringForce = p5.Vector.sub(sumOfVelocities, this.vel);
        steeringForce.limit(this.maxForce);

        return steeringForce;
    }



    update() {
        if (mouseIsPressed) {
            let mousePos = createVector(mouseX, mouseY);
            this.seek(mousePos);
        } else {
            let closeVehicles = this.getCloseVehicles();
            // What actions is this agent pursuing?
            let cohesionForce = this.cohesion(closeVehicles);
            cohesionForce.mult(1);
            this.addForce(cohesionForce);

            let separationForce = this.separation(closeVehicles);
            separationForce.mult(1);
            this.addForce(separationForce);

            let alignmentForce = this.alignment(closeVehicles);
            let n = noise(frameCount * 0.1);
            console.log(n);
            alignmentForce.mult(n);
            this.addForce(alignmentForce);
        }

        this.dim = map(this.pos.y, 0, height, 2, 20)


        // MOVEMENT
        this.vel.add(this.acc); // Apply acceleration (and thus the forces) to vel
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel); // Apply velocity to position

        this.acc.set(0,0);
    }

    show() {
        push();

        translate(this.pos.x, this.pos.y);

        // fill(0, 0, 10, 0.08);
        // noStroke();
        // ellipse(0, 0, this.range);

        // Heading is the amount of rotation
        let angle = this.vel.heading();
        rotate(angle);

        fill(this.hue, this.saturation, this.brightness);

        // Draw a triangle
        beginShape();
        vertex(this.dim, 0);
        vertex(-this.dim, this.dim/2);
        vertex(-this.dim, -this.dim/2);
        endShape(CLOSE);

        pop();
    }
}

