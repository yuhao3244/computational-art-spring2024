const keys = 'qwertyui';
const keyIndex = {};
let soundFile;
let bgm;
let scale;
let drums = [];

function preload() {
    soundFile = loadSound('samples/soundFile.wav');
    bgm = loadSound('samples/bgm.wav');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    scale = [0, 2, 4, 5, 7, 9, 11, 12];

    // 初始化每个鼓面的位置和大小
    let numDrums = keys.length;
    let drumWidth = 80;
    let drumHeight = 50;
    let spacing = (width - (numDrums * drumWidth)) / (numDrums + 1);
    let startY = height / 2 + 100;
    
    for (let i = 0; i < numDrums; i++) {
        let x = spacing + i * (drumWidth + spacing);
        drums.push({ x: x, y: startY, w: drumWidth, h: drumHeight, key: keys.charAt(i), pressed: false });
        keyIndex[keys.charAt(i)] = () => playSound(scale[i]);
    }
}

function draw() {
    background(150);
    fill(255);
    textSize(16);
    textAlign(CENTER, CENTER);
    text('Press any of "q w e r t y u i" to play a note', width / 2, 40);
    text('Mouse click to play background music', width / 2, 70);
    
    // 绘制每个鼓面
    drums.forEach(drum => {
        if (drum.pressed) {
            fill(255, 0, 0);
        } else {
            fill(200);
        }
        rect(drum.x, drum.y, drum.w, drum.h);
        fill(0);
        text(drum.key, drum.x + drum.w / 2, drum.y + drum.h / 2);
    });
}

function keyPressed() {
    if (keyIndex[key]) {
        keyIndex[key]();
        drums.forEach(drum => {
            if (drum.key === key) {
                drum.pressed = true;
            }
        });
        triggerVisualEffect(key);
    }
}

function keyReleased() {
    drums.forEach(drum => {
        if (drum.key === key) {
            drum.pressed = false;
        }
    });
}

function playSound(note) {
    soundFile.rate(pow(2, note / 12));
    soundFile.play();
}

function triggerVisualEffect(key) {
    fill(random(255), random(255), random(255));
    ellipse(random(width), random(height), 50, 50);
    text(key.toUpperCase(), width / 2, height * 0.75);
}

function mousePressed() {
    if (!bgm.isPlaying()) {
        bgm.loop();
    }
}
