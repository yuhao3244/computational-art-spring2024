function setup() {
  createCanvas(600, 600);
  colorMode(HSB);
  background(0, 0, 0, 1);
  noStroke();
}

function draw() {
  drawFractal(width / 2, height / 2, 300);
}

function drawFractal(x, y, d) {
  ellipse(x, y, d);
  rect(x, y, d * 0.8, d * 0.8);
  triangle(x, y, x + d / 2, y + d, x - d / 2, y + d);

  if (mouseIsPressed) {
    fill(random(360), 80, 100, 0.1);
  } else {
    fill(frameCount % 360, 80, 100, 0.1);
  }

  if (d > 5) {
    drawFractal(x + d * 0.5, y, d * 0.5);
    drawFractal(x - d * 0.5, y, d * 0.5);
  }
}

function mouseClicked() {
  background(0);
}
