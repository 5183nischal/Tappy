window.onload = function(){
// get the canvas
let canvas = document.getElementById("canvas");

//get the context
let context = canvas.getContext("2d");

//character variables
let ascii  = ["=","-","#","+","*"];
let kanji = ["口","小","大","人","白","."]
let characters = [];
//grid variables
let gridSize = 20;
let rectSize = 50;
let zOff = 0;

let iterationsW = window.innerWidth/gridSize;
let iterationsH = window.innerHeight/gridSize;

//replaced width and heigh with just canvas.
width = canvas.width = window.innerWidth,
height = canvas.height = window.innerHeight;

var PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();


createHiDPICanvas = function(w, h, ratio) {
    if (!ratio) { ratio = PIXEL_RATIO; }
    var can = document.createElement("canvas");
    can.width = w * ratio;
    can.height = h * ratio;
    can.style.width = w + "px";
    can.style.height = h + "px";
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return can;
}

//Create canvas with the device resolution.
var myCanvas = createHiDPICanvas(500, 250);

//Create canvas with a custom resolution.
var myCustomCanvas = createHiDPICanvas(500, 200,4);

// initialize();
//noise seed
noise.seed(Math.random());

function render(){
  //refresh canvas
  context.clearRect(0,0,canvas.width,canvas.height);
  // document.body.style.backgroundColor = "#DCDCDC";
  //noise var
  let increment = 0.001;
  let xOff = 0;
  //initiate character
  for (var x = 0; x < canvas.width; x+=gridSize) {
    let yOff = 0;
    for (var y = 0; y < canvas.height; y+=gridSize) {
      //perling Noise
      let r = Math.abs(noise.simplex3(x/500,y/500,zOff+100) *255) ;
      xOff += increment;
      // context.fillText(kanji[0],x*gridSize,y*gridSize);
      if(r <= 255 && r>=200){
      context.fillText(kanji[5],x + gridSize,y +gridSize);
      // context.fillStyle="#ffffff";
      context.font = "16px Arial";
      } else if (r <=199 && r >= 150){
      context.fillText(kanji[5],x + gridSize,y +gridSize);
      // context.fillStyle="#ffffff";
      context.font = "18px Arial";
      } else if(r <= 149 && r >= 100){
      context.fillText(kanji[5],x + gridSize,y +gridSize);
      // context.fillStyle="#ffffff";
      context.font = "14px Arial";
      } else if(r <= 99 && r >= 50){
      context.fillText(kanji[5],x + gridSize,y +gridSize);
      // context.fillStyle="#ffffff";
      context.font = "10px Arial";
      } else if(r <= 49 && r >= 0){
      context.fillText(kanji[5],x + gridSize,y +gridSize);
      context.font = "16px Arial";
      // context.fillStyle="#ffffff";
      }
      context.fillStyle="#8a8a8a";
      context.globalAlpha= 1; //copyright Charles Doucet my man, the legend
      context.stroke();
      // console.log(r);
    }
    yOff += increment;
    zOff += 0.00005;
  }

  //call the function again
  requestAnimationFrame(render);
}

// function initialize() {
    // Register an event listener to call the resizeCanvas() function
    // each time the window is resized.
    window.addEventListener('resize', resizeCanvas, false);
    // Draw canvas border for the first time.
    resizeCanvas();
 // }

 function redraw() {
    // context.rect(0, 0, window.innerWidth, window.innerHeight);
    requestAnimationFrame(render);
  }

 function resizeCanvas() {
     canvas.width = window.innerWidth;
     canvas.height = window.innerHeight;
     redraw();
 }

 function getRandomInt(max) {
   return Math.floor(Math.random() * Math.floor(max));
 }

}
