let numCellsWidth = 40;
let numCellsHeight = 40;
let cellWidth;
let cellHeight;

function setup() {
  createCanvas(600, 400);
  colorMode(HSB);

  cellWidth = width / numCellsWidth;
  cellHeight = height / numCellsHeight;
}

function draw() {
  background(0, 0, 100);
  drawGrid()
}

function drawGrid() {
  for (let xIndex = 0; xIndex < numCellsWidth; xIndex++) {
    for (let yIndex = 0; yIndex < numCellsHeight; yIndex++) {
      let x = cellWidth * xIndex;
      let y = cellHeight * yIndex;

      push();

      translate(x, y);

      let hue = map(noise(x * 0.01, y * 0.01), 0, 1, 0, 360);
      fill(hue, 70, 100);
      rect(0, 0, cellWidth, cellHeight);
      let colorOffset = 40;

      hue = (hue + 180 - colorOffset) % 360;
      fill(hue, 50, 100);
      noStroke();
      ellipse(cellWidth / 2, cellHeight / 2, cellWidth, cellHeight);

      hue = (hue + colorOffset * 2) % 360;
      fill(hue, 50, 100);
      ellipse(cellWidth / 2, cellHeight / 2, cellWidth / 2, cellHeight / 2);

      let squareSize = cellWidth * 0.5 * (1 + sin(frameCount * 0.05 + x * 0.1 + y * 0.1));
      hue = (hue + colorOffset) % 360;
      fill(hue, 70, 100);
      rect(cellWidth / 4, cellHeight / 4, squareSize, squareSize);

      let triangleOffset = sin(frameCount * 0.05 + x * 0.1 + y * 0.1) * 5;
      hue = (hue + colorOffset) % 360;
      fill(hue, 80, 100);
      triangle(cellWidth / 2, cellHeight / 4 + triangleOffset, cellWidth / 4, 3 * cellHeight / 4 + triangleOffset, 3 * cellWidth / 4, 3 * cellHeight / 4 + triangleOffset);

      pop();
    }
  }
}
