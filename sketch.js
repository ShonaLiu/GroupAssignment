//class for drawing the paitning
class DrawingBGTeam {
  constructor(x,y) {
    this.x = x;
    this.y = y;
  }

  drawSky() {
    this.x += random(-2, 2);
    this.y += random(-2, 2);
  
    this.x = constrain(this.x, 0, windowWidth);
    this.y = constrain(this.y, 0, windowHeight);
  
    let imgX = floor(map(this.x, 0, windowWidth, 0, img.width));
    let imgY = floor(map(this.y, 0, windowHeight, 0, img.height));

    let skyImgCol = color(img.get(imgX, imgY));
  
    // Change the drawing color if transitioning
    if (isTransitioning) {
      transitionProgress += 0.000001; // Adjust the speed of transition
      transitionProgress = constrain(transitionProgress, 0,0.5);
      // change from black to dark blue
      let targetColor = lerpColor(color(0,0,0), color(0,0,139), colAmt);
      //change the color from the current color to target color
      let currentColor = lerpColor(skyImgCol, targetColor, transitionProgress);
      drawDarkBuffer.stroke(currentColor);
      
    }
    drawDarkBuffer.strokeWeight(penSize);
    drawDarkBuffer.point(this.x, this.y);
  }
  
  
  drawOriginal() {
    this.x += random(-2, 2);
    this.y += random(-2, 2);

    this.x = constrain(this.x, 0, windowWidth);
    this.y = constrain(this.y, 0, windowHeight);

    let imgX = floor(map(this.x, 0, windowWidth, 0, img.width));
    let imgY = floor(map(this.y, 0, windowHeight, 0, img.height));

    // Update the coverage array
    let pixelX = floor(this.x / 2) * 2; 
    let pixelY = floor(this.y / 2) * 2;
    
    // Ensure pixelX and pixelY are within bounds
    if (pixelX >= 0 && pixelX < windowWidth && pixelY >= 0 && pixelY < windowHeight) {
      if (!coverage[pixelX][pixelY]) {
        coverage[pixelX][pixelY] = true;
        coveredPixels++;
        drawOriginalBuffer.stroke(img.get(imgX, imgY));
        drawOriginalBuffer.strokeWeight(penSize);
        drawOriginalBuffer.point(this.x, this.y);
      }
    }
  }
}

//this is a wave class, it will draw a single wave line across the screen
class Wave {
  constructor(amplitude, frequency, yBase, strokeWeight) {
    this.amplitude = amplitude; // Height of the wave
    this.frequency = frequency; // How often peaks and troughs occur
    this.yBase = yBase; // Base line of the wave
    this.offset = 0 // Initial offset for Perlin noise
    this.strokeWeight = strokeWeight; // Thickness of the wave line
  }

  // Method to display the wave
  display() {
    noFill();
    //set the colour

    //set the stroke weight (different for each class instance)
    strokeWeight(penSize);
    // Begin the shape
    beginShape();
    // xoff is the offset for Perlin noise - inside each class instance
   
    let xoff = this.offset; 
    
    //Now we move across the screen, left to right in steps of 10 pixels
    for (let x = 0; x <= windowWidth; x += 1) {
      //Every 10 pixels we sample the noise function
      let waveHeight = map(noise(xoff), 0, 1, -this.amplitude, this.amplitude);
      let imgX = floor(map(x, 0, windowWidth, 0, img.width));


      // Change the drawing color if transitioning
      if (isTransitioning) {
        // Adjust the speed of transition
        transitionProgress += 0.000001;
        // the amount of transition
        transitionProgress = constrain(transitionProgress, 0, 0.5);
        // get the picture color of the current point
        let col = img.get(imgX, floor(this.yBase));
        // change the color from black to dark blue
        let targetColor = lerpColor(color(0,0,0), color(0,0,139), colAmt);
        // change the current color
        let currentColor = lerpColor(color(col), targetColor, transitionProgress);
        // change the transparency
        let waveColor = color(red(currentColor), green(currentColor), blue(currentColor), 15);
        stroke(waveColor);
      } else {
        let col = img.get(imgX, floor(this.yBase));
        let waveColor = color(red(col), green(col), blue(col), 15);
        stroke(waveColor);
      }
      //We draw a vertex at the x position and the yBase position + the wave height
      point(x, this.yBase + waveHeight);
      //Increasing xoff here means the next wave point will be sampled from a different part of the noise function
      xoff += this.frequency;
    }
    //now we reached the edge of the screen we end the shape
    endShape();
    //Now we increment the class instances offset, ready for the next frame
    this.offset += 0.005; // Smaller increment for smoother animation
  }

}

// Array to store multiple waves
let waves = [];
let drawingTeam = [];
// Number of waves to create
let numWaves = 8;

//We need a variable to hold our image
let img;
//let skyImg;
let transitionProgress = 0;
//lets add a variable to switch between drawing the image and the segments
let drawSegments = true;
let x;
let y;
let penSize;

// Parameters controlling colour transition changes
let colAmt = 0;
let skyPenCol;

// Array to track coverage of the screen
let coverage;
let totalPixels;
let coveredPixels;
let drawOriginalBuffer;
let drawDarkBuffer;
let isTransitioning = false;

let forceDark = false;

let magnifierlength
//Load the image from disk
function preload() {
  img = loadImage('1.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  drawOriginalBuffer = createGraphics(windowWidth, windowHeight); 
  drawDarkBuffer = createGraphics(windowWidth, windowHeight); 
  penSize = 30;
  magnifierlength = windowHeight/30;
  resetDrawing();
  // Create multiple waves rwith varying properties
  for (let i = 0; i < numWaves; i++) {
    //We are moving down the screen as we set the yBase for each new wave
    let yBase = (i * height/2 /numWaves+height/2)+100;
    //As we move down the screen i gets bigger and so does the amplitude
    let amplitude = 20 + i * 10; 
    //As we move down the screen the waves get heavier by increasing the stroke weight
    let strokeW = 5+i; 
    waves.push(new Wave(amplitude, random(0.01, 0.02), yBase, strokeW));
  }


  // 4 drawing points start from different origin
  drawingTeam.push(new DrawingBGTeam(20,20));
  drawingTeam.push(new DrawingBGTeam(20,windowHeight));
  drawingTeam.push(new DrawingBGTeam(windowWidth,20));
  drawingTeam.push(new DrawingBGTeam(width / 2, height / 2));
  drawingTeam.push(new DrawingBGTeam(windowWidth,windowHeight));


  // coverage array for checking if the whole screen is filled
  coverage = [];
  for (let i = 0; i < windowWidth; i += 2) {
    coverage[i] = [];
    for (let j = 0; j < windowHeight; j += 2) {
      coverage[i][j] = false;
    }
  }

  totalPixels = floor((windowWidth / 2) * (windowHeight / 2));
  coveredPixels = 0;
  
}

function draw() {
  background(0);
  // Use the sin function to set colAmt so that it changes periodically, allowing the colours to repeat back and forth as a gradient.
  colAmt = map(sin(frameCount * 0.02), -1, 1, 0, 1);

  //display the original image
  if (!drawSegments) {
    image(img, 0, 0, windowWidth, windowHeight);
  }
  // Draw original paintings from the buffer onto the main canvas
  image(drawOriginalBuffer, 0, 0, windowWidth, windowHeight);
  // Draw dark paintings from the buffer onto the main canvas
  if (isTransitioning) {
    image(drawDarkBuffer, 0, 0, windowWidth, windowHeight);
  }

  //draw the image
  push();
  for (let i = 0; i < 2000; i++) {
    // check if the whole screen is filled 
    if (allCovered() || forceDark) {
      for (let i = 0; i < drawingTeam.length; i++) {
          // start changing the drawing color
          drawingTeam[i].drawSky();
      }
    }else{
      // draw the original painting
      for (let i = 0; i < drawingTeam.length; i++) {
        drawingTeam[i].drawOriginal();
      }
    }
  }
  pop();
  // draw wave
  push();
  for (let i = 0; i < waves.length; i++) {
    waves[i].display();
  }
  pop();

  // Calculate the area of the image to be magnified
  let magnifierX = constrain(mouseX, magnifierlength, width - magnifierlength);
  let magnifierY = constrain(mouseY, magnifierlength, height - magnifierlength);

  // Draw the magnifier border
  noFill();
  stroke(0);
  strokeWeight(2);
  rect(magnifierX - magnifierlength, magnifierY - magnifierlength, magnifierlength * 2, magnifierlength * 2);

  // Calculate source coordinates in the original image
  let srcX = map(mouseX - magnifierlength, 0, width, 0, img.width);
  let srcY = map(mouseY - magnifierlength, 0, height, 0, img.height);
  let srcW = map(magnifierlength * 2, 0, width, 0, img.width);
  let srcH = map(magnifierlength * 2, 0, height, 0, img.height);

  // Draw the magnified section of the original image
  image(img, magnifierX - magnifierlength, magnifierY - magnifierlength, magnifierlength * 2, magnifierlength * 2, srcX, srcY, srcW, srcH);

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  drawOriginalBuffer.resizeCanvas(windowWidth, windowHeight);
  drawDarkBuffer.resizeCanvas(windowWidth,windowHeight);
  penSize = windowHeight/30;
  magnifierlength = windowHeight/30;
  forceDark = false;
  // Initialize the coverage array
  coverage = [];
  for (let i = 0; i < windowWidth; i += 2) {
    coverage[i] = [];
    for (let j = 0; j < windowHeight; j += 2) {
      coverage[i][j] = false;
    }
  }

  totalPixels = floor((windowWidth / 2) * (windowHeight / 2));
  coveredPixels = 0;
  

  //redraw the waves
  waves = [];
  for (let i = 0; i < numWaves; i++) {
    let yBase = (i * height / 2 / numWaves + height / 2) + 100;
    let amplitude = 20 + i * 10;
    let strokeW = 5 + i;
    waves.push(new Wave(amplitude, random(0.01, 0.02), yBase, strokeW));
  }

}



function keyPressed() {
  if (key == "o" || key == "O") {
    drawSegments = !drawSegments;
  }else if (key == "r" || key == "R"){
    resetDrawing();
  }else if (key === "d" || key === "D") {
    isTransitioning = true;
    forceDark = true;
  } else if (key === "l" || key === "L") {
    isTransitioning = false;
    forceDark = false;
    drawDarkBuffer.clear(); 
    if (coveredPixels == totalPixels){
      coveredPixels = 0;
      coverage = [];
      for (let i = 0; i < windowWidth; i += 2) {
        coverage[i] = [];
        for (let j = 0; j < windowHeight; j += 2) {
          coverage[i][j] = false;
        }
      }
    }
  }
} 

// Function to check if all pixels are covered
function allCovered() {
  if (coveredPixels == totalPixels) {
    isTransitioning = true; // Start the transition
  }
  return coveredPixels == totalPixels;
}


function resetDrawing() {
  // Reset transition progress
  transitionProgress = 0;
  isTransitioning = false;
  forceDark = false;
  drawOriginalBuffer = createGraphics(windowWidth, windowHeight);
  drawDarkBuffer = createGraphics(windowWidth, windowHeight);
  // Initialize the coverage array
  coverage = [];
  for (let i = 0; i < windowWidth; i += 2) {
    coverage[i] = [];
    for (let j = 0; j < windowHeight; j += 2) {
      coverage[i][j] = false;
    }
  }

  totalPixels = floor((windowWidth / 2) * (windowHeight / 2));
  coveredPixels = 0;

  // Initialize the drawing team
  drawingTeam = [];
  drawingTeam.push(new DrawingBGTeam(20, 20));
  drawingTeam.push(new DrawingBGTeam(20, windowHeight));
  drawingTeam.push(new DrawingBGTeam(windowWidth, 20));
  drawingTeam.push(new DrawingBGTeam(width / 2, height / 2));
  drawingTeam.push(new DrawingBGTeam(windowWidth, windowHeight));

  // Initialize the waves
  waves = [];
  for (let i = 0; i < numWaves; i++) {
    let yBase = (i * height / 2 / numWaves + height / 2) + 100;
    let amplitude = 20 + i * 10;
    let strokeW = 5 + i;
    waves.push(new Wave(amplitude, random(0.01, 0.02), yBase, strokeW));
  }
}
