import { Bucket } from './bucket'

const { PI } = Math
const TWO_PI = 2 * PI

export class Wheel {
  constructor(options) {
    this.x = options.x
    this.y = options.y
    this.radius = options.wheelRadius
    this.momentOfInertia = options.momentOfInertia
    this.numBuckets = options.numBuckets
    this.theta = 0  // angular position (radians)
    this.omega = 0  // angular velocity (rad/s)
    this.alpha = 0  // angular acceleration (rad/s^2)
    this.torque = 0
    this.buckets = new Array()
    this._createBuckets(options)
  }

  applyTorque(t) {
    this.torque += t
  }

  update(dt) {
    this.alpha = this.torque / this.momentOfInertia
    this.theta += this.omega * dt + this.alpha * dt * dt / 2
    this.omega += this.alpha * dt
    this.torque = 0
    
    this.buckets.forEach(b => b.update())
  }

  render(ctx) {
    // wheel
    ctx.beginPath()
    ctx.fillStyle = '#333'
    ctx.arc(this.x, this.y, 10, 0, TWO_PI)
    ctx.fill()

    ctx.beginPath()
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 2
    ctx.arc(this.x, this.y, this.radius, 0, TWO_PI)
    ctx.stroke()
    // buckets
    this.buckets.forEach(b => {
      b.render(ctx)
    })
  }

  _createBuckets(options) {
    const n = this.numBuckets
    for (let i = 0; i < n; i++) {
      const b = new Bucket(this, 
        options.bucketRadius, 
        options.bucketHeight,
        options.bucketCapacity,
        -PI / 2 - PI / 72 + i / n * TWO_PI)
      this.buckets.push(b)
    }
  }
}
