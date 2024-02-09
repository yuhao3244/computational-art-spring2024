let yoff = 0; 

function setup() {
  createCanvas(800, 600);
  noStroke();
}

function draw() {
  let xoff = 0; 
  background(209, 165, 88); 
  
  fill(149, 210, 245); 
  beginShape(); 
  for (let x = 0; x <= width; x += 10) {
    let y = map(noise(xoff, yoff), 0, 1, 250, 300);
    vertex(x, y);
    xoff += 0.05;
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  
  fill(50, 150, 255); 
  beginShape(); 
  for (let x = 0; x <= width; x += 10) {
    let y = map(noise(xoff, yoff), 0, 1, 300, 350);
    vertex(x, y);
    xoff += 0.05;
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
  
  fill(10, 100, 191); 
  beginShape(); 
  for (let x = 0; x <= width; x += 10) {
    let y = map(noise(xoff, yoff), 0, 1, 400, 450);
    vertex(x, y);
    xoff += 0.05;
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
  
  yoff += 0.005; 
  
  fill(139, 69, 19);
  rect(220, 130, 30, 80); 
  fill(255); 
  rect(197, 150, 5, 30); 
  fill(240, 121, 36); 
  ellipse(200, 135, 90, 70); 
  
  fill(139, 69, 19);
  rect(420, 130, 30, 80); 
  fill(255); 
  rect(397, 150, 5, 30); 
  fill(240, 121, 36); 
  ellipse(400, 135, 90, 70); 
  
  fill(139, 69, 19);
  rect(620, 130, 30, 80); 
  fill(255); 
  rect(597, 150, 5, 30); 
  fill(240, 121, 36); 
  ellipse(600, 135, 90, 70); 
}
