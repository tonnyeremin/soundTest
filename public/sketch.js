


let song;
let fft;
let circles = [];
let angle = 0;
let increment =0;
let rotationRate;

let pixels = []; // Array to store pixel objects
let textString = "Down to the hole.wav - spectrum anaylises with FTT";
let pixelSize = 20; // Size of each pixel
let textSpeed = 0.4; // Speed of text animation


function preload() {
  // Load your music file
  song = loadSound('audio/Down to the hole.wav');
}

function setup() {
  createCanvas(360, 640);
  textAlign(LEFT, TOP);
  frameRate(30);
  textSize(pixelSize);

  // Initialize FFT (Fast Fourier Transform) object
  fft = new p5.FFT();
  peaks = song.getPeaks(360);
  rotationRate = 180/song.duration();

  for (let i = 0; i < 50; i++) {
    let d = 2 + 24*i;
    circles.push(new Circle(0, 0, d));
  }

  let x = 0;
  let y = 0;
  for (let i = 0; i < textString.length; i++) {
    let char = textString.charAt(i);
    if (char !== ' ') {
      pixels.push(new Pixel(x, y, char));
    }
    x += pixelSize * textWidth(char);
    if (x + pixelSize > width) {
      x = 0;
      y += pixelSize;
    }
  }
  // Play the song
  song.play();
  
  
}

function draw() {
   
    background(0, 18, 25);
    angle += rotationRate * deltaTime / 1000;
    angle = min(angle, 360);
    translate(width / 2, height / 2);
    
    let spectrum = fft.analyze();
    let bass = fft.getEnergy("bass");
    let force = map(bass, 0, 255, 0, 0.5);
    
    for (let i = 0; i < circles.length; i++) {
        circles[i].update(force);
    }

    beginShape();
    fill(10, 147, 150,64)
    stroke(0, 95, 115);
    for (let i = 0; i < peaks.length; i++) {
        let angle = map(i, 0, peaks.length, 0, TWO_PI);
        let radius = map(peaks[i], -1, 1, 0, circles[circles.length-1].diameter2);
        let x = cos(angle) * radius;
        let y = sin(angle) * radius;
        vertex(x, y);
    }
    endShape(CLOSE);
    
    for (let i = 0; i < circles.length; i++) {
        circles[i].display();
    }
    push();
    rotate(angle);
    stroke(155, 34, 38)
    fill(174, 32, 18)
    
    triangle(0, 0, -24, circles[circles.length-1].diameter2/2, 24, circles[circles.length-1].diameter2/2);
    pop();

}

function isPointOnCircle(x, y, cx, cy, radius) {
    let distance = dist(x, y, cx, cy);
    return abs(distance - radius) < 1; // Adjust the threshold as needed
  }

  function findNearestPointOnCircle(x, y, cx, cy, radius) {
    let angle = atan2(y - cy, x - cx);
    let nearestX = cx + radius * cos(angle);
    let nearestY = cy + radius * sin(angle);
    return { x: nearestX, y: nearestY };
  }

class Circle{
    static diameter;
    static diameter2;
    static initX;
    static x;

    constructor(x,y,d){
        this.initX = x;
        this.x = x;
        this.y = y;
        this.diameter = d;
        this.diameter2 = d;
    }

    display(){
        fill(0, 95, 115,64);
        stroke(0, 18, 25);
        ellipse(this.x, this.y, this.diameter2, this.diameter2);
    }

    update(force){
        this.diameter2 = this.diameter*force;
        let acc = 10;
    }


}

class Pixel {
    constructor(x, y, char) {
      this.x = x;
      this.y = y;
      this.targetX = x;
      this.targetY = y;
      this.char = char;
      this.color = color(random(255), random(255), random(255)); // Random color for each pixel
    }
  
    update() {
      this.x += (this.targetX - this.x) * textSpeed;
      this.y += (this.targetY - this.y) * textSpeed;
    }
  
    display() {
      fill(this.color);
      text(this.char, this.x, this.y);
    }
  }




  
