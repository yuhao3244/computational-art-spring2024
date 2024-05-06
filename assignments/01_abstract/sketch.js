let shapes = []; 

function setup() {
  createCanvas(800, 600);
  
  // 创建一些初始形状
  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(20, 80);
    let shapeType = int(random(3)); // 随机选择形状
    shapes.push(new Shape(x, y, size, shapeType));
  }
}

function draw() {
  background(240);
  
  // 绘制和更新形状
  for (let i = 0; i < shapes.length; i++) {
    shapes[i].display();
    shapes[i].move();
  }
}

function mousePressed() {
  // 鼠标点击时改变所有形状的颜色
  for (let i = 0; i < shapes.length; i++) {
    shapes[i].changeColor();
  }
}

class Shape {
  constructor(x, y, size, type) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.type = type; // 形状类型：0=圆形，1=矩形，2=三角形
    this.color = color(random(255), random(255), random(255)); 
    this.speedX = random(-2, 2);
    this.speedY = random(-2, 2);
  }
  
  display() {
    fill(this.color);
    noStroke();
    if (this.type === 0) {
      ellipse(this.x, this.y, this.size);
    } else if (this.type === 1) {
      rect(this.x, this.y, this.size, this.size);
    } else if (this.type === 2) {
      triangle(this.x, this.y - this.size / 2, this.x - this.size / 2, this.y + this.size / 2, this.x + this.size / 2, this.y + this.size / 2);
    }
  }
  
  move() {
    this.x += this.speedX;
    this.y += this.speedY;
    
    // 边界检测
    if (this.x < 0 || this.x > width) {
      this.speedX *= -1;
    }
    if (this.y < 0 || this.y > height) {
      this.speedY *= -1;
    }
  }
  
  changeColor() {
    this.color = color(random(255), random(255), random(255));
  }
}
