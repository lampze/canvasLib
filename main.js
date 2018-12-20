function clearCanvas(canvas) {
  canvas.height=canvas.height;
}

function smartDraw(obj) {
  if(!obj.type || !obj.ctx || !obj.posit || !obj.style || !obj.draw)
    return false;
  if(obj.style)
    Object.keys(obj.style).forEach(function(key){
      obj.ctx[key] = obj.style[key];
    })
  
  switch(obj.type) {
    case "unknow":
      break;
    case "line":
      break;
    case "font":
      obj.ctx.strokeText(obj.posit.txt,obj.posit.x,obj.posit.y);
      obj.ctx.fillText(obj.posit.txt,obj.posit.x,obj.posit.y);
      return true;
    case "rect":
      obj.ctx.beginPath();
      obj.ctx.rect(obj.posit.x, obj.posit.y, obj.posit.width, obj.posit.height);
      obj.ctx.closePath();
      break;
    case "ball":
      obj.ctx.beginPath();
      obj.ctx.arc(obj.posit.x, obj.posit.y, obj.posit.r, 0, 2*Math.PI);
      obj.ctx.closePath();
      break;
  }
  
  obj.ctx.fill();
  obj.ctx.stroke();
  return true;
}

function checkWall(obj){
  switch(obj.type){
    case "ball":
      if(obj.posit.x-obj.posit.r<=0){
        obj.posit.x=obj.posit.r;
        obj.posit.vx=-obj.posit.vx;
      }
      if(obj.posit.x+obj.posit.r>=obj.cvs.width){
        obj.posit.x=obj.cvs.width-obj.posit.r;
        obj.posit.vx=-obj.posit.vx;
      }
      if(obj.posit.y-obj.posit.r<=0){
        obj.posit.y=obj.posit.r;
        obj.posit.vy=-obj.posit.vy;
      }
      if(obj.posit.y+obj.posit.r>=obj.cvs.height){
        obj.posit.y=obj.cvs.height-obj.posit.r;
        obj.posit.vy=-obj.posit.vy;
      }
      break;
  }
}

function smartMove(obj){
  if(!obj.type || !obj.ctx || !obj.posit)
    return false;

  obj.posit.vx*=obj.posit.ax;
  obj.posit.vy*=obj.posit.ay;
  obj.posit.x+=obj.posit.vx;
  obj.posit.y+=obj.posit.vy;
  
  checkWall(obj);
}

function AnimaObj(cvs ,ctx, type, posit, style, draw, move) {
  this.cvs = cvs;
  this.ctx = ctx;
  this.posit = posit || {x:0,y:0};
  this.type = type || "unknow";
  this.style = style || {fillStyle:"#fff",strokeStyle:"#000"};
  this.creatTime = Date.now();
  this.aliveTime = function(){return Date.now() - this.creatTime;}
  this.getInfo = function(){return this.type + ';alive:' + this.aliveTime() + 'ms;';}
  this.draw = draw || function(){return smartDraw(this)};
  this.move = move || function(){return smartMove(this)};
}


var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

function animaStart(cvs, ctx) {
  var now=Date.now();
  var frameCount=0;
  var fps=0;
  var FPS=new AnimaObj(cvs, ctx, "font", {txt:"FPS:"+fps,x:2,y:20}, {fillStyle:"#0f0",strokeStyle:"#0f0",font:"20px Verdana"});
  var ball=new AnimaObj(cvs, ctx, "ball", {x:300,y:300,r:10,vx:2,vy:1,ax:1.001,ay:1.001}, {fillStyle:"#f00",strokeStyle:"#000"});

  function iter(){
    clearCanvas(cvs);
    
    ball.move();
    ball.draw();

    //calc the fps
    if(Date.now()-now>=100) {
      fps=(1000/((Date.now()-now)/frameCount)).toFixed(0);
      frameCount=0;
      now=Date.now();
    }
    FPS.posit.txt="FPS:"+fps;
    FPS.draw();
    frameCount++;
    
    requestAnimationFrame(iter);
  }
  requestAnimationFrame(iter);
}

animaStart(canvas, context);
