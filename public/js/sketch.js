// window.onload = function(){

p5.disableFriendlyErrors = true; // disables FES

  var gridSize = 25;
  var rectSize = 10;
  var increment = 0.1;

  var zOff = 0;

  var ascii  = ["=","-","#","+","*"];
  var kanji = ["口","高"]

  function setup() {
    // pixelDensity(1);
    var cnv = createCanvas(100, 100);
    cnv.position(0.0);
    cnv.style('z-index', -1);
    cnv.style("opacity", "20%");

    // background(255, 0, 200);
    windowResized();
    frameRate(10);
    // noLoop();

  }

  function draw(){
    background(255);

    perlinNoise();
  }

  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }

  function perlinNoise(){
    var iterationsW = window.innerWidth/gridSize;
    var iterationsH = window.innerHeight/gridSize;
    var offset = 0;
    var opacityMult = 0.1;

    var yOff = 0;
    for (var i = 0; i < iterationsW; i++) {
      var xOff = 0;
      for (var j = 0; j < iterationsH; j++) {
        var r = noise(xOff, yOff, zOff) * 255;
        // console.log(r);
        xOff += increment;
        opacity = r * opacityMult;
        fill('#3956FF');
        // textSize(opacity);
        // rect(offset+i*gridSize,offset+j*gridSize,gridSize,gridSize);
        if(r <= 125){
        text(kanji[0],offset+i*gridSize,offset+j*gridSize);
      }else{
        text(kanji[1],offset+i*gridSize,offset+j*gridSize);
        }
      }
      yOff += increment;
      zOff += 0.001;
    }
  }

  function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
  }


// }
