addEventListener("DOMContentLoaded", setup);
var canvas;
var ctx;
var animID;
var prev = 0;
var pc;
var G = 600;
function setup() {
  console.log("Setup...");
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  pc = new Sprite();
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
  pc.draw(ctx);
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
  ctx.fillStyle = "rgba(0,255,0,0.4)";
  ctx.strokeStyle = "rgba(0,255,0,1)";
  ctx.save();
  ctx.translate(-this.w/2,-this.h/2);
  ctx.fillRect(this.x,this.y,this.w,this.h);
  ctx.strokeRect(this.x,this.y,this.w,this.h);
  ctx.restore();
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
