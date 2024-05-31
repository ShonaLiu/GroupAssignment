# Individual Task for Shona Liu
 
## Instructions on how to interact with the work
Press d to draw the painting at night time(in dark color). <br>
Press l to draw the painting at day time(in light color). <br>
Press r to reset the drawing. <br>
The original draw will be shown in the squre magnifier where the mouse cursor is.

## Individual approach to animating the group code
I chose "User Input interactions". The painting can be changed freely based on the user's need. The painting can be draw in dark or light mode. The square magnifier can also view the origianl drawing of Monet. For my group member, she worked on perlin noise which is totally different from me design as mine is worked on user interactions. She focused on the building in the drawing where the building looks like particles and can change its color.


## References
The square magnifier is inspired by the week 7 of Mona Lisa.  


The random drawing dots is inspired by the following website
https://happycoding.io/tutorials/p5js/animation/random-walker
![Alt text](https://happycoding.io/tutorials/p5js/animation/images/random-walker-1.png)

## Technical explanation
Based on the group code, I modified the keyPressed function to include the "d" and "l" keys to change the light and dark mode of the painting. 
```
function keyPressed() {
  if (key == "o" || key == "O") {
    drawSegments = !drawSegments;
  }else if (key == "r" || key == "R"){
    resetDrawing();
  }else if (key == "d" || key == "D") {
    isTransitioning = true;
    forceDark = true;
  } else if (key == "l" || key == "L") {
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
```

<br>
In the draw() function, I calculated the coordination where the original picture needs to be shown, created the boarder and draw the image with all the required parameters. 

```
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

```


### Technique from the internet:
**image(img, dx, dy, dWidth, dHeight, sx, sy, sWidth, sHeight)** <br>
https://p5js.org/reference/#/p5/image <br>

**img**: The image object to be displayed. <br>
**dx**: The x-coordinate of the top-left corner of the destination rectangle where the image will be drawn on the canvas. <br>
**dy**: The y-coordinate of the top-left corner of the destination rectangle where the image will be drawn on the canvas. <br>
**dWidth**: The width of the destination rectangle. <br>
**dHeight**: The height of the destination rectangle. <br>
**sx**: The x-coordinate of the top-left corner of the source rectangle to be cropped from the image. <br>
**sy**: The y-coordinate of the top-left corner of the source rectangle to be cropped from the image. <br>
**sWidth**: The width of the source rectangle. <br>
**sHeight**: The height of the source rectangle. <br>

## Result
[The San Giorgio Maggiore at Dusk](https://shonaliu.github.io/GroupAssignment/)
