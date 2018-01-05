import { Droplet } from './droplet'

const { cos, sin } = Math

export class Bucket {
  constructor(wheel, radius, height, capacity, theta) {
    this.wheel = wheel
    this.theta = theta          // angular position relative to the wheel
    this.capacity = capacity    // max number of droplets
    this.droplets = new Array()
    this.radius = radius
    this.height = height
    this.ang = 0
    this.x = 0
    this.y = 0
    this.level = 0              // height of water column
    this.update()
  }

  update() {
    this.ang = this.wheel.theta + this.theta
    this.x = this.wheel.x + this.wheel.radius * cos(this.ang)
    this.y = this.wheel.y + this.wheel.radius * sin(this.ang)    
  }

  _updateLevel() {
    const p = this.droplets.length / this.capacity
    this.level = p * this.height
  }

  addDroplet(d) {
    if (!this.isFull()) {
      d.stuck = true
      this.droplets.push(d)
      this._updateLevel()  
    }
  }

  isFull() {
    return !(this.droplets.length < this.capacity)
  }

  removeDroplet() {
    const d = this.droplets.pop()
    this._updateLevel()      
    return d
  }

  render(ctx) {
    ctx.setTransform(1, 0, 0, 1, this.x, this.y)

    ctx.fillStyle = 'rgba(0,200,0,0.5)'
    ctx.fillRect(-this.radius, -this.height / 2, 2 * this.radius, this.height)
    
    if (this.droplets.length > 0) {
      // draw water in the bucket
      ctx.beginPath()
      ctx.fillStyle = '#0000ff'
      ctx.rect(-this.radius, this.height / 2 - this.level, 2 * this.radius, this.level)
      ctx.fill()
    }
    
    ctx.beginPath()
    ctx.strokeStyle = '#00cc00'
    ctx.lineWidth = 1
    ctx.moveTo(-this.radius - 4, -this.height / 2)
    ctx.lineTo(-this.radius, -this.height / 2)
    ctx.lineTo(-this.radius, this.height / 2)
    ctx.lineTo(this.radius, this.height / 2)
    ctx.lineTo(this.radius, -this.height / 2)
    ctx.lineTo(this.radius + 4, -this.height / 2)
    ctx.stroke()
    

    ctx.setTransform(1, 0, 0, 1, 0, 0)
  }
}
