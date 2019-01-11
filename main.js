var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

window.onresize = function() {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
};

function animaStart(cvs, ctx) {
  var now = Date.now();
  var frameCount = 0;
  var fps = 0;
  var FPS = new AnimaObj({
    cvs: cvs,
    ctx: ctx,
    shape: "font",
    posit: { txt: "FPS:" + fps, x: 2, y: 20 },
    style: { fillStyle: "#0f0", strokeStyle: "#0f0", font: "20px Verdana" },
    hooks: { draw: smartDraw }
  });
  var ball = new AnimaObj({
    cvs: cvs,
    ctx: ctx,
    shape: "arc",
    posit: { x: 300, y: 300, r: 10, vx: 0.2, vy: 0.1, ax: 1.001, ay: 1.001 },
    style: { fillStyle: getRandColor(), strokeStyle: "#000" }
  });
  var rect = new AnimaObj({
    cvs: cvs,
    ctx: ctx,
    shape: "rect",
    posit: {
      x: 300,
      y: 200,
      width: 30,
      height: 30,
      vx: 0.3,
      vy: 0.1,
      ax: 1.001,
      ay: 1.0001
    },
    style: { fillStyle: getRandColor(), strokeStyle: "#000" }
  });

  function iter() {
    clearCanvas(cvs);

    ball.runHook();
    rect.runHook();

    //calc the fps
    if (Date.now() - now >= 100) {
      fps = (1000 / ((Date.now() - now) / frameCount)).toFixed(0);
      frameCount = 0;
      now = Date.now();
    }
    FPS.posit.txt = "FPS:" + fps;
    FPS.runHook();
    frameCount++;

    requestAnimationFrame(iter);
  }
  requestAnimationFrame(iter);
}

animaStart(canvas, context);
