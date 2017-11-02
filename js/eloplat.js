addEventListener("DOMContentLoaded", setup);
var canvas;
var ctx;
var animID;
var prev = 0;
var pc;
var lava;
var barrier;
var enemy;
var G = 600;
function setup() {
  console.log("Setup...");
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  pc = new Sprite();
  lava = createLava();
  barrier = createBarrier();
  enemy = createEnemy();
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
  lava.step(dt);
  barrier.step(dt);
  enemy.step(dt);
  lava.draw(ctx);
  barrier.draw(ctx);
  enemy.draw(ctx);
  pc.draw(ctx);
  if(pc.isCollidedWith(lava)){
    pc.x = 20;
    pc.y = 320;
    pc.vy = 0;
    lava.winsFrom(pc);
  }
  if(pc.isCollidedWith(barrier)){
    pc.x = 20;
    pc.y = 320;
    pc.vy = 0;
    barrier.winsFrom(pc);
  }
  if(pc.isCollidedWith(enemy)){
    pc.x = 20;
    pc.y = 320;
    pc.vy = 0;
    enemy.winsFrom(pc);
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
  this.elo = 1500;
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
  ctx.fillText(this.elo, 0, 0);
  ctx.restore();
  ctx.fillStyle = "white";
  ctx.fillText(this.elo,this.x-this.w/2,this.y-this.h);
}

Sprite.prototype.isCollidedWith = function(other){
  if(this.x-this.w/2 > other.x+other.w/2) return false;
  if(this.x+this.w/2 < other.x-other.w/2) return false;
  if(this.y-this.h/2 > other.y+other.h/2) return false;
  if(this.y+this.h/2 < other.y-other.h/2) return false;
  return true;
}

Sprite.prototype.winsFrom = function(other){
  var K = 32;
  var Rthis = Math.pow(10, this.elo/400);
  var Rother = Math.pow(10, other.elo/400);
  var Ethis = Rthis/(Rthis+Rother);
  var Eother = Rother/(Rthis+Rother);
  var Sthis = 1;
  var Sother = 0;
  this.elo = Math.round(this.elo+K*(Sthis-Ethis));
  other.elo = Math.round(other.elo+K*(Sother-Eother));
}

function createLava(){
  var lava = new Sprite();
  lava.fillStyle = "rgba(255,0,0,0.7)";
  lava.strokeStyle = "rgba(200,0,0,0.7)";
  lava.step = function(dt){
    this.w = 50*(1.5 - 1/(1+Math.exp(-1/100*(this.elo-pc.elo))));
  }
  lava.h = 10;
  lava.x = 200;
  lava.y = 425;
  return lava;
}

function createBarrier(){
  var barrier = new Sprite();
  barrier.fillStyle = "rgba(255,255,0,0.7)";
  barrier.strokeStyle = "rgba(200,200,0,0.7)";
  barrier.w = 10;
  barrier.h = 50;
  barrier.x = 400;
  barrier.y = 400;
  barrier.step = function(dt){
    this.h = 50*(1.5 - 1/(1+Math.exp(-1/100*(this.elo-pc.elo))));
    this.y = 420-this.h/2;
  }
  return barrier;
}
function createEnemy(){
  var enemy = new Sprite();
  enemy.fillStyle = "rgba(0,0,255,0.4)";
  enemy.strokeStyle = "rgba(0,0,200,0.4)";
  enemy.w = 10;
  enemy.h = 10;
  enemy.x = 550;
  enemy.y = 420;
  enemy.step = function(dt){
    this.vx += 2*(1.5 - 1/(1+Math.exp(-1/100*(this.elo-pc.elo))))*(500-this.x)*dt;
    this.x +=this.vx*dt;
  }
  return enemy;
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
