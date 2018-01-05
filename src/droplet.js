const { PI, random } = Math
const TWO_PI = 2 * PI

export class Droplet {
  constructor(x, y, mass) {
    this.mass = mass
    this.pos0 = {x: x, y: y} 
    this.pos = {x: x, y: y}
    this.vel = {x: 0, y: 0}
    this.acc = {x: 0, y: 0}
    this.force = {x: 0, y: 0}
    this.stuck = false
  }

  reset() {
    this.pos.x = this.pos0.x
    this.pos.y = this.pos0.y
    this.vel.x = 0
    this.vel.y = 0
    this.acc.x = 0
    this.acc.y = 0
    this.force.x = 0
    this.force.y = 0
    this.stuck = false
  }

  applyForce(fx, fy) {
    this.force.x += fx
    this.force.y += fy
  }

  update(dt) {
    this.acc.x = this.force.x / this.mass
    this.acc.y = this.force.y / this.mass
    this.pos.x += this.vel.x * dt + this.acc.x * dt * dt / 2
    this.pos.y += this.vel.y * dt + this.acc.y * dt * dt / 2
    this.vel.x += this.acc.x * dt
    this.vel.y += this.acc.y * dt
    this.force.x = 0
    this.force.y = 0 
  }

  render(ctx) {
    if (this.stuck) { return }
    ctx.beginPath()
    ctx.fillStyle = 'rgba(0,0,255,1.0)'
    ctx.arc(this.pos.x, this.pos.y, 2, 0, TWO_PI)
    ctx.fill()
  }
}
