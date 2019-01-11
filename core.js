// cvs ,ctx, shape, posit, style, hooks

function AnimaObj(initObj) {
  var thisObj = this;

  // default value
  this.posit = { x: 0, y: 0 };
  this.shape = "unknow";
  this.style = { fillStyle: "#fff", strokeStyle: "#000" };
  this.creatTime = nowTime();
  this.hooks = {
    draw: smartDraw,
    move: smartMove,
    checkWall: checkWall,
    addSpeed: addSpeed
  };

  Object.keys(initObj).forEach(function(key) {
    thisObj[key] = initObj[key];
  });

  this.aliveTime = function() {
    return nowTime() - this.creatTime;
  };
  this.getInfo = function() {
    return this.shape + ";alive:" + this.aliveTime() + "ms;";
  };
  this.runHook = function() {
    var thisObj = this;
    Object.keys(thisObj.hooks).forEach(function(key) {
      thisObj.hooks[key](thisObj);
    });
  };

  this.addHook = function(hook) {
    var thisObj = this;
    switch (typeof hook) {
      case "object":
        if (isArray(hook)) {
          for (var i = 0; i < hook.length; i++) {
            if (typeof hook[i] == "function")
              thisObj.hooks[hook[i].name] = hook[i];
            else if (typeof hook[i] == "string")
              thisObj.hooks[hook[i]] = window[hook[i]];
          }
        } else {
          Object.keys(hook).forEach(function(key) {
            thisObj.hooks[key] = hook[key];
          });
        }
        break;
      case "function":
        thisObj.hooks[hook.name] = hook;
        break;
      case "string":
        thisObj.hooks[hook] = window[hook];
        break;
    }
  };

  this.removeHook = function(hook) {
    var thisObj = this;
    switch (typeof hook) {
      case "function":
        Object.keys(thisObj.hooks).forEach(function(key) {
          if (thisObj.hooks[key] == hook) delete thisObj.hooks[key];
        });
        break;
      case "string":
        delete thisObj.hooks[hook];
        break;
    }
  };
}

function getRandom(lower, upper, isInit) {
  if (isInit) return parseInt(Math.random() * (upper - lower + 1) + lower, 10);
  else return Math.random() * (upper - lower) + lower;
}

function getRandColor() {
  return (
    "rgb(" +
    getRandom(0, 255, true) +
    "," +
    getRandom(0, 255, true) +
    "," +
    getRandom(0, 255, true) +
    ")"
  );
}

function nowTime() {
  return Date.now();
}

function isArray(obj) {
  return Object.prototype.toString.call(obj) === "[object Array]";
}

function clearCanvas(canvas) {
  canvas.height = canvas.height;
}

function smartDraw(obj) {
  if (!obj) obj = this;
  if (!obj.shape || !obj.ctx || !obj.posit || !obj.style) return false;

  // plus style
  if (obj.style)
    Object.keys(obj.style).forEach(function(key) {
      obj.ctx[key] = obj.style[key];
    });

  switch (obj.shape) {
    case "unknow":
      break;
    case "line":
      break;
    case "font":
      obj.ctx.strokeText(obj.posit.txt, obj.posit.x, obj.posit.y);
      obj.ctx.fillText(obj.posit.txt, obj.posit.x, obj.posit.y);
      return true;
    case "rect":
      obj.ctx.beginPath();
      obj.ctx.rect(obj.posit.x, obj.posit.y, obj.posit.width, obj.posit.height);
      obj.ctx.closePath();
      break;
    case "arc":
      obj.ctx.beginPath();
      obj.ctx.arc(obj.posit.x, obj.posit.y, obj.posit.r, 0, 2 * Math.PI);
      obj.ctx.closePath();
      break;
  }

  obj.ctx.fill();
  obj.ctx.stroke();
  return true;
}

function checkWall(obj) {
  if (!obj) obj = this;
  if (!obj.posit) return false;

  switch (obj.shape) {
    case "arc":
      if (obj.posit.x - obj.posit.r <= 0) {
        obj.posit.x = obj.posit.r;
        obj.posit.vx = -obj.posit.vx;
      }
      if (obj.posit.x + obj.posit.r >= obj.cvs.width) {
        obj.posit.x = obj.cvs.width - obj.posit.r;
        obj.posit.vx = -obj.posit.vx;
      }
      if (obj.posit.y - obj.posit.r <= 0) {
        obj.posit.y = obj.posit.r;
        obj.posit.vy = -obj.posit.vy;
      }
      if (obj.posit.y + obj.posit.r >= obj.cvs.height) {
        obj.posit.y = obj.cvs.height - obj.posit.r;
        obj.posit.vy = -obj.posit.vy;
      }
      break;
  }
}

function smartMove(obj) {
  if (!obj) obj = this;
  if (!obj.shape || !obj.ctx || !obj.posit) return false;
  if (typeof obj.posit.vx == "undefined") return false;

  // the speed is milliseconds per pixel
  // speed isn't depend on fps, i think this is more real
  var passTime = nowTime() - (obj.lastTime || nowTime());
  obj.posit.x += obj.posit.vx * passTime;
  obj.posit.y += obj.posit.vy * passTime;
  obj.lastTime = nowTime();
}

function addSpeed(obj) {
  if (!obj) obj = this;
  if (typeof obj.posit.ax == "undefined") return false;

  obj.posit.vx *= obj.posit.ax;
  obj.posit.vy *= obj.posit.ay;
}
