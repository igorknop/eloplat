addEventListener("DOMContentLoaded", setup);
var canvas;
var ctx;
var animID;
var prev = 0;
var pc;
var lava;
var barrier;
var G = 600;
function setup() {
  console.log("Setup...");
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  pc = new Sprite();
  lava = createLava();
  barrier = createBarrier();
  setupControls();
  animID = requestAnimationFrame(animStep);
}

function animStep(t){
  dt = (t-prev)/1000;
  animID = requestAnimationFrame(animStep);
  ctx.clearRect(0,0,canvas.width, canvas.height);
  gameStep(dt);
  ctx.fillStyle = "green";
  ctx.strokeStyle = "green";
  ctx.fillText((1/dt).toFixed(0), 10,10);
  prev = t;
}

function gameStep(dt) {
  pc.step(dt);
  lava.draw(ctx);
  barrier.draw(ctx);
  pc.draw(ctx);
  if(pc.isCollidedWith(lava)){
    pc.x = 20;
    pc.y = 320;
    pc.vy = 0;
  }
  if(pc.isCollidedWith(barrier)){
    pc.x = 20;
    pc.y = 320;
    pc.vy = 0;
  }

}

function Sprite(){
  this.w = 10;
  this.h = 10;
  this.x = 020;
  this.y = 300;
  this.vx = 0;
  this.vy = 0;
  this.VX  = 100;
  this.JY = 400;
  this.fillStyle = "rgba(0,255,0,0.4)";
  this.strokeStyle = "rgba(0,255,0,1)";
}

Sprite.prototype.step = function(dt){
  this.x += this.vx*dt;
  this.vy += G*dt;
  this.y += (this.vy)*dt;
  if(this.y>420) {
    this.y = 420
    this.vy = 0
  }
}

Sprite.prototype.draw = function(ctx){
  ctx.fillStyle = this.fillStyle;
  ctx.strokeStyle = this.strokeStyle;
  ctx.save();
  ctx.translate(-this.w/2,-this.h/2);
  ctx.fillRect(this.x,this.y,this.w,this.h);
  ctx.strokeRect(this.x,this.y,this.w,this.h);
  ctx.restore();
}

Sprite.prototype.isCollidedWith = function(other){
  if(this.x-this.w/2 > other.x+other.w/2) return false;
  if(this.x+this.w/2 < other.x-other.w/2) return false;
  if(this.y-this.h/2 > other.y+other.h/2) return false;
  if(this.y+this.h/2 < other.y-other.h/2) return false;
  return true;
}
function createLava(){
  var lava = new Sprite();
  lava.fillStyle = "rgba(255,0,0,0.7)";
  lava.strokeStyle = "rgba(200,0,0,0.7)";
  lava.w = 50;
  lava.h = 10;
  lava.x = 200;
  lava.y = 425;
  return lava;
}

function createBarrier(){
  var lava = new Sprite();
  lava.fillStyle = "rgba(255,255,0,0.7)";
  lava.strokeStyle = "rgba(200,200,0,0.7)";
  lava.w = 10;
  lava.h = 50;
  lava.x = 400;
  lava.y = 400;
  return lava;
}

function setupControls() {
  addEventListener("keydown", function(e){
    switch (e.keyCode) {
      case 37:
        pc.vx = -pc.VX;
        break;
      case 38:
        pc.vy += (Math.abs(pc.vy) < 0.1)? -pc.JY:0;
        break;
      case 39:
        pc.vx = +pc.VX;
        break;
      default:
    }
  });
  addEventListener("keyup", function(e){
    switch (e.keyCode) {
      case 37:
      case 39:
        pc.vx = 0;
        break;
      case 38:
      case 40:
        break;
      default:
    }
  });}
