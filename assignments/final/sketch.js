let handsfree; // 用于存储Handsfree对象
let particles = []; // 存储所有水纹粒子
let bgm, song; // 背景音乐和其他声音
let prevPointer = Array(2).fill().map(() => Array(4).fill({x: 0, y: 0})); // 存储每个手指的位置
let fingertips = [8, 12, 16, 20]; // 指尖标号
let graphics; // 绘图表面
let waterRipples = []; // 存储水波数据
let fishImages = []; // 存储鱼的图片
let fishes = []; // 存储鱼对象

function preload() {
  bgm = loadSound("bgm.mp3");
  song = loadSound("c3.mp3");
  fishImages.push(loadImage("fish1.png"));
  fishImages.push(loadImage("fish2.png"));
  fishImages.push(loadImage("fish.png"));
}

function setup() {
  createCanvas(640, 480);
  bgm.loop();
  bgm.amp(0.5);
  initHandsfree();
  createUI();
  createParticles();
  for (let i = 0; i < 5; i++) { // 5 fishs
    fishes.push(new Fish(random(fishImages)));
  }
}

function draw() {
  background(0);
  updateParticles();
  drawParticles();
  waterPaint();
  fishes.forEach(fish => {
    fish.update();
    fish.draw();
  });
}

// 初始化Handsfree库和配置
function initHandsfree() {
  handsfree = new Handsfree({
    showDebug: true,
    hands: {
      enabled: true,
      maxNumHands: 2,
      minDetectionConfidence: 0.4,
      minTrackingConfidence: 0.5
    }
  });
  handsfree.enablePlugins("browser");
  handsfree.plugin.pinchScroll.disable();
}

// 创建用户界面（启动/停止摄像头）
function createUI() {
  let buttonStart = createButton("Click here to start Webcam").class("handsfree-show-when-stopped handsfree-hide-when-loading").mousePressed(() => handsfree.start());
  let buttonLoading = createButton("...loading...").class("handsfree-show-when-loading");
  let buttonStop = createButton("Stop Webcam").class("handsfree-show-when-started").mousePressed(() => handsfree.stop());
}

// 创建水波的粒子效果
function createParticles() {
  let theme = random([
    { colors: ["#0799F2", "#FFFFFF", "#0058a1", "#004B97", "#84C1FF", "#c5afd4"], background: "#063970" }
  ]);
  graphics = createGraphics(width, height);
  graphics.background(theme.background);
  graphics.noStroke();
  for (let i = 0; i < 200; i++) {
    let p = new Particle(random(-50, width + 50), random(-50, height + 50), random(theme.colors));
    particles.push(p);
  }
}

// 更新粒子位置
function updateParticles() {
  particles.forEach(p => p.update());
}

// 绘制粒子
function drawParticles() {
  particles.forEach(p => p.draw());
  image(graphics, 0, 0);
}

// 产生水波效果
function waterPaint() {
  const hands = handsfree.data?.hands;
  if (!hands?.pinchState) return;

  hands.pinchState.forEach((hand, handIndex) => {
    hand.forEach((state, finger) => {
      if (state === "start" && hands.landmarks?.[handIndex]?.[fingertips[finger]]) {
        let { x, y } = getFingerPosition(hands, handIndex, finger);
        waterRipples.push({ x, y, size: 0 });
        playSound(x);
        prevPointer[handIndex][finger] = { x, y };
      }
    });
  });

  drawWaterRipples();
}

// 获取指尖位置
function getFingerPosition(hands, handIndex, finger) {
  let x = width - hands.landmarks[handIndex][fingertips[finger]].x * width;
  let y = hands.landmarks[handIndex][fingertips[finger]].y * height;
  return { x, y };
}

// 播放声音
function playSound(x) {
  let ra = map(x, 0, height, 0.5, 1.3);
  let pa = map(x, 0, width, -1, 1);
  song.rate(ra);
  song.pan(pa);
  song.amp(1);
  song.play();
}

// 绘制水波
function drawWaterRipples() {
  waterRipples.forEach(ripple => {
    let noiseFactor = noise(ripple.x * 0.01, ripple.y * 0.01, frameCount * 0.01);
    let dynamicSize = ripple.size + noiseFactor * 10;

    noFill();
    strokeWeight(0.8);
    stroke(255, 255 - dynamicSize * 1.87);
    circle(ripple.x, ripple.y, dynamicSize * 1.25);

    strokeWeight(1.45);
    stroke(255, 255 - dynamicSize * 1.65);
    circle(ripple.x, ripple.y, dynamicSize * 0.8);

    strokeWeight(2);
    stroke(255, 255 - dynamicSize * 1.34);
    circle(ripple.x, ripple.y, dynamicSize * 0.6);

    ripple.size++;
  });
}

// 鱼类
class Fish {
  constructor(img) {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D();
    this.img = img;
    this.maxSpeed = random(1, 3);
  }

  update() {
    this.pos.add(this.vel);
    this.avoidEdges();
    this.reactToRipples();
  }

  draw() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    imageMode(CENTER);
    image(this.img, 0, 0, 50, 30);
    pop();
  }

  avoidEdges() {
    if (this.pos.x < 50 || this.pos.x > width - 50) {
      this.vel.x *= -1;
    }
    if (this.pos.y < 50 || this.pos.y > height - 50) {
      this.vel.y *= -1;
    }
  }

  reactToRipples() {
    waterRipples.forEach(ripple => {
      let d = dist(this.pos.x, this.pos.y, ripple.x, ripple.y);
      if (d < ripple.size / 2) {
        let escape = p5.Vector.sub(this.pos, createVector(ripple.x, ripple.y));
        escape.setMag(this.maxSpeed);
        this.vel.lerp(escape, 0.1);
      }
    });
  }
}

// 粒子类
class Particle {
  constructor(x, y, color) {
    this.pos = new p5.Vector(x, y);
    this.color = color;
    this.r = random(0.25, 1);
  }

  update() {
    const dir = noise(this.pos.x / 1000, this.pos.y / 1000) * TAU;
    this.pos.add(Math.cos(dir), Math.sin(dir));

    if (this.pos.x < -50 || this.pos.x > width + 50 || this.pos.y < -50 || this.pos.y > height + 50) {
      this.pos.set(random(-50, width + 50), random(-50, height + 50));
    }
  }

  draw() {
    graphics.fill(this.color);
    graphics.circle(this.pos.x, this.pos.y, this.r);
  }
}
