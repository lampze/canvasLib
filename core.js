function AnimaObj(cvs ,ctx, shape, posit, style, hooks) {
  this.cvs = cvs;
  this.ctx = ctx;
  this.posit = posit || {x:0,y:0};
  this.shape = shape || "unknow";
  this.style = style || {fillStyle:"#fff",strokeStyle:"#000"};
  this.creatTime = Date.now();
  
  this.aliveTime = function(){return Date.now() - this.creatTime;};
  this.getInfo = function(){return this.shape + ';alive:' + this.aliveTime() + 'ms;';};
  this.hooks = hooks || {draw: smartDraw, move: smartMove, checkWall: checkWall, addSpeed: addSpeed};
  this.runHook = function() {
    var obj=this;
    Object.keys(obj.hooks).forEach(function(key){
      obj.hooks[key](obj);
    })
  }
  
  this.addHook = function(hook) {
    obj = this;
    switch(typeof(hook)) {
      case "object":
        if(isArray(hook)) {
          for(var i=0;i<hook.length;i++){
            if(typeof(hook[i]) == "function")
              obj.hooks[hook[i].name]=hook[i];
            else if(typeof(hook[i]) == "string")
              obj.hooks[hook[i]]=window[hook[i]];
          }
        } else {
          Object.keys(hook).forEach(function(key){
            obj.hooks[key]=hook[key];
          });          
        }
        break;
      case "function":
        obj.hooks[hook.name]=hook;
        break;
      case "string":
        obj.hooks[hook]=window[hook];
        break;
    }
  }
  
  this.removeHook = function(hook) {
    obj = this;
    switch(typeof(hook)) {
      case "function":
        Object.keys(obj.hooks).forEach(function(key){
          if(obj.hooks[key] == hook)
            delete obj.hooks[key];
        })
        break;
      case "string":
        delete obj.hooks[hook];
        break;
    }
  }
}



function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';;
}


function clearCanvas(canvas) {
  canvas.height=canvas.height;
}


function smartDraw(obj) {
  if(!obj)
    obj=this;
  if(!obj.shape || !obj.ctx || !obj.posit || !obj.style)
    return false;
  if(obj.style)
    Object.keys(obj.style).forEach(function(key){
      obj.ctx[key] = obj.style[key];
    })
  
  switch(obj.shape) {
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
  if(!obj)
    obj=this;
  if(!obj.posit)
    return false;
  
  switch(obj.shape){
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
  if(!obj)
    obj=this;
  if(!obj.shape || !obj.ctx || !obj.posit)
    return false;
  if(typeof(obj.posit.vx) == "undefined")
    return false;

  obj.posit.x+=obj.posit.vx;
  obj.posit.y+=obj.posit.vy;
}


function addSpeed(obj){
  if(!obj)
    obj=this;
  if(typeof(obj.posit.ax) == "undefined")
    return false;
  
  obj.posit.vx*=obj.posit.ax;
  obj.posit.vy*=obj.posit.ay;
}
