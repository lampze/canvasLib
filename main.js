var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

function animaStart(cvs, ctx) {
  var now=Date.now();
  var frameCount=0;
  var fps=0;
  var FPS=new AnimaObj(cvs, ctx, "font", {txt:"FPS:"+fps,x:2,y:20}, {fillStyle:"#0f0",strokeStyle:"#0f0",font:"20px Verdana"},{draw: smartDraw});
  var ball=new AnimaObj(cvs, ctx, "ball", {x:300,y:300,r:10,vx:2,vy:1,ax:1.001,ay:1.001}, {fillStyle:"#f00",strokeStyle:"#000"});

  function iter(){
    clearCanvas(cvs);
    
    ball.runHook();

    //calc the fps
    if(Date.now()-now>=100) {
      fps=(1000/((Date.now()-now)/frameCount)).toFixed(0);
      frameCount=0;
      now=Date.now();
    }
    FPS.posit.txt="FPS:"+fps;
    FPS.runHook();
    frameCount++;
    
    requestAnimationFrame(iter);
  }
  requestAnimationFrame(iter);
}

animaStart(canvas, context);
