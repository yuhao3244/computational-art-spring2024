function setup() {
  createCanvas(600, 600);
  colorMode(HSB);
  background(0, 0, 0, 1);
}

function draw() {
  fill(frameCount % 360, 80, 100, 0.1); 
  translate(width / 2, height / 2);
  rotate(radians(frameCount));
  drawCircle(0, 0, 300);
}

function drawCircle(x, y, d) {
  ellipse(x, y, d);
  if (d > 5) {
    drawCircle(x + d * 0.5, y, d * 0.5);
    drawCircle(x - d * 0.5, y, d * 0.5);
  }
}
