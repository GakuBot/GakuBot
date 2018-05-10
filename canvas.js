var cvs = document.getElementById('cvs');

window.addEventListener("resize", resize);
var desiredScreenRatio = 0.57;
var minHeight = 178;
var minWidth = 100;
resize();

 // This is the ratio of Width:height for a 1080 x 1920 resolution screen

function resize(){
  let windowHeight = window.innerHeight;
  let windowWidth = window.innerWidth;
  let canvasContainerHeight = $('#canvas-container').height();
  let canvasContainerWidth = $('#canvas-container').width();

  const screenMargin = 50;

  if(windowWidth >= (desiredScreenRatio) * windowHeight){
    cvs.height = windowHeight - screenMargin;
    cvs.width = desiredScreenRatio * (windowHeight - screenMargin);
    cvs.style.height = windowHeight - screenMargin + "px";
    cvs.style.width = desiredScreenRatio * (windowHeight - screenMargin) + "px";
    document.getElementById('canvas-container').style.height = windowHeight - screenMargin + "px";
    document.getElementById('canvas-container').style.width = desiredScreenRatio * (windowHeight - screenMargin) + "px";
  }else{
    cvs.height = (canvasContainerWidth) / desiredScreenRatio;
    cvs.width = canvasContainerWidth;
    cvs.style.height = ((canvasContainerWidth) / desiredScreenRatio) + "px";
    cvs.style.width = canvasContainerWidth + "px";
    document.getElementById('canvas-container').style.height = ((canvasContainerWidth) / desiredScreenRatio) + "px";
  }
}


function Canvas(canvas) {
    var context = canvas.getContext('2d');
    var width = canvas.width;
    var height = canvas.height;

    // Draw a circle
    this.circle = function(x, y, r, fill, stroke) {
        context.beginPath();
        context.arc(x, y, r, 0, Math.PI * 2, false);

        if (fill)   { context.fill(); }
        if (stroke) { context.stroke(); }

        return this;
    };

    // Draw a circle
    this.line = function(x, y, i, j) {
        context.beginPath();
        context.moveTo(x,y);
        context.lineTo(i,j);
        context.stroke();

        return this;
    };

    // Draw a rectangle
    this.rectangle = function(x, y, width, height, fill, stroke) {
        context.beginPath();
        context.rect(x, y, width, height);

        if (fill)   { context.fill(); }
        if (stroke) { context.stroke(); }

        return this;
    };

    // Set canvas draw color
    this.setColor = function(type, color) {
        if (type === 'fill') {
            context.fillStyle = color;
        } else if (type === 'stroke') {
            context.strokeStyle = color;
        }

        return this;
    };

    this.textDraw = function(text, positionX, positionY, color) {
        context.font = (width/15) + "px Arial";
        context.fillStyle = color;
        context.fillText(text,positionX,positionY)

        return this;
    };

    this.textDrawBig = function(text, positionX, positionY, color) {
        context.font = (width/7) + "px Arial";
        context.fillStyle = color;
        context.fillText(text,positionX,positionY)

        return this;
    };

    // Clear entire canvas
    this.clear = function() {
        context.clearRect(0, 0, width, height);

        return this;
    };

}

const userDefaultColor = "#dfc12a";
const opponentDefaultColor = "pink";

var clearCanvas = function(){
    new Canvas(cvs).clear();
}

var drawTwoCircles = function(firstCircleX, firstCircleY, secondCircleX, secondCircleY){
    var width = cvs.width;
    var height = cvs.height;

    const firstX = width * firstCircleX;
    const firstY = height * firstCircleY;
    const secondX = width * secondCircleX;
    const secondY = height * secondCircleY;

    new Canvas(cvs).clear().setColor("fill", "brown").setColor("stroke", "brown").circle(firstX,firstY,20,true,true).setColor("fill", userDefaultColor).setColor("stroke", "green").circle(secondX, secondY,10,true,true);
}

var drawThreeCircles = function(firstCircleX, firstCircleY, secondCircleX, secondCircleY, thirdCircleX, thirdCircleY, playerCooldown, opponentCooldown){
    var width = cvs.width;
    var height = cvs.height;

    const firstX = width * firstCircleX;
    const firstY = height * firstCircleY;
    const secondX = width * secondCircleX;
    const secondY = height * secondCircleY;
    const thirdX = width * thirdCircleX;
    const thirdY = height * thirdCircleY;
    const smallCircleRadius = width/25;
    const largeCircleRadius = width/15;
    const playerColor = playerCooldown <= 0 ? userDefaultColor : "rgb(100, 100, 0)";
    const opponentColor = opponentCooldown <= 0 ? opponentDefaultColor : "rgb(153, 0, 26)";

    const canvas = new Canvas(cvs);
    canvas.setColor("fill", "brown").setColor("stroke", "brown").circle(firstX,firstY,largeCircleRadius,true,true);
    canvas.setColor("fill", playerColor).setColor("stroke", "green").circle(secondX, secondY,smallCircleRadius,true,false);
    canvas.setColor("fill", opponentColor).setColor("stroke", "blue").circle(thirdX, thirdY,smallCircleRadius,true,false);
}

var drawFourCircles = function(firstCircleX, firstCircleY, secondCircleX, secondCircleY, thirdCircleX, thirdCircleY, fourthCircleX, fourthCircleY, playerCooldown, opponentCooldown){

    var width = cvs.width;
    var height = cvs.height;

    const firstX = width * firstCircleX;
    const firstY = height * firstCircleY;
    const secondX = width * secondCircleX;
    const secondY = height * secondCircleY;
    const thirdX = width * thirdCircleX;
    const thirdY = height * thirdCircleY;
    const fourthX = width * fourthCircleX;
    const fourthY = height * fourthCircleY;
    const smallCircleRadius = width/25;
    const largeCircleRadius = width/15;
    const playerColor = playerCooldown <= 0 ? userDefaultColor : "rgb(100, 100, 0)";
    const opponentColor = opponentCooldown <= 0 ? opponentDefaultColor : "rgb(153, 0, 26)";

    const canvas = new Canvas(cvs);
    canvas.setColor("fill", "brown").setColor("stroke", "brown").circle(firstX,firstY,largeCircleRadius,true,true);
    canvas.setColor("fill", "white").setColor("stroke", "red").circle(fourthX, fourthY,smallCircleRadius,false,true);
    canvas.setColor("stroke", "red").line(fourthX, fourthY + smallCircleRadius, fourthX, fourthY + smallCircleRadius/2);
    canvas.setColor("stroke", "red").line(fourthX, fourthY - smallCircleRadius, fourthX, fourthY - smallCircleRadius/2);
    canvas.setColor("stroke", "red").line(fourthX + smallCircleRadius, fourthY, fourthX + smallCircleRadius/2, fourthY);
    canvas.setColor("stroke", "red").line(fourthX - smallCircleRadius, fourthY, fourthX - smallCircleRadius/2, fourthY);
    canvas.setColor("fill", playerColor).setColor("stroke", "green").circle(secondX, secondY,smallCircleRadius,true,false);
    canvas.setColor("fill", opponentColor).setColor("stroke", "blue").circle(thirdX, thirdY,smallCircleRadius,true,false);
}

var drawText = function(inputText){
  var width = cvs.width;
  var height = cvs.height;

  const canvas = new Canvas(cvs);
  canvas.clear();
  canvas.font = "15px Arial";
  canvas.textDrawBig(inputText,width/2,height/2, "black");
}

var drawProgressText = function(completionPercentage){
  var width = cvs.width;
  var height = cvs.height;

  const canvas = new Canvas(cvs);
  canvas.font = "15px Arial";
  const inputText = "Training completion: " + completionPercentage + "%";
  canvas.clear();
  canvas.setColor("fill", "#82b1ff").rectangle(width/11, height/2.17, (completionPercentage/100)*(9*width)/11, height/19, true, false);
  canvas.textDraw(inputText,width/8,height/2, "black");
}

var drawFinish = function(homeOriginX, homeOriginY, finishTimer, finishTimerDuration, gameResultWin, gameResultLoss){
  var width = cvs.width;
  var height = cvs.height;

  const largeCircleRadius = height * (finishTimer / finishTimerDuration);
  const firstX = homeOriginX * width;
  const firstY = homeOriginY * height;
  const color = gameResultWin ? userDefaultColor : gameResultLoss ? opponentDefaultColor : "grey";

  const canvas = new Canvas(cvs);
  canvas.setColor("fill", color).setColor("stroke", color).circle(firstX,firstY,largeCircleRadius,true,true);
  canvas.setColor("fill", color).setColor("stroke", color).circle(firstX,firstY,largeCircleRadius + 1,true,true);
  canvas.setColor("fill", color).setColor("stroke", color).circle(firstX,firstY,largeCircleRadius + 2,true,true);
  canvas.setColor("fill", color).setColor("stroke", color).circle(firstX,firstY,largeCircleRadius + 3,true,true);

}

var drawGenerationText = function(inputGen){
  var width = cvs.width;
  var height = cvs.height;

  const canvas = new Canvas(cvs);
  const leftMargin = width/30;
  const topMargin = width/10;
  canvas.textDraw("Generation: " + inputGen,leftMargin,topMargin, "black");
}

var drawIterationText = function(inputIteration){
  var width = cvs.width;
  var height = cvs.height;

  inputIteration++

  const canvas = new Canvas(cvs);
  const leftMargin = width/30;
  const topMargin = width/10;
  canvas.textDraw("AI Rank (out of 25 AI): " + ordinalSuffixOf(inputIteration), leftMargin, height - topMargin, "black");
}

var drawPregameOverlayText = function(overlayTimerValue, overlayTimerColorValue){
  var width = cvs.width;
  var height = cvs.height;

  if(overlayTimerValue < 1){
    overlayTimerValue = 1;
  }

  const canvas = new Canvas(cvs);
  canvas.textDrawBig(overlayTimerValue, width/2, height/2, "rgb(" + overlayTimerColorValue + ", " + (255 - overlayTimerColorValue) + ", "+ overlayTimerColorValue + ")");
}

var canvasCoordinatesToCanvasRatio = function(coords){
  var width = cvs.width;
  var height = cvs.height;

  return [coords[0]/width, coords[1]/height]
}

function ordinalSuffixOf(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}
