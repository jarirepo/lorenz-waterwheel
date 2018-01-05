import { Wheel } from "./wheel"
import { Droplet } from './droplet'

const { cos, PI, pow, random, sin, sqrt } = Math

export class Simulation {
  constructor(options) {
    this.options = options
    this.wheel = new Wheel(options)
    this.started = false
    this._timer = null    // droplet timer
    this.droplets = new Array()
    this.data = new Array()  // past values for the angular velocity    
  }

  start() {
    if (this.started) { return }
    this.started = true
    // console.log('Simulation started')
    // generate droplets
    this._timer = setInterval(() => {
      if (this.droplets.length < this.options.numDroplets) {
        const x = this.options.canvas.width / 2 - 10 + 20 * random()
        this.droplets.push(new Droplet(x, 0, this.options.dropletMass))
      }
    }, this.options.dropletPeriod)
  }

  update() {
    if (!this.started) { return }

    // update droplets
    this.droplets.forEach(d => {
      if (!d.stuck) {
        d.applyForce(0, d.mass * this.options.gravity)
        d.update(this.options.timestep)  
        // check if this droplet got stuck in a bucket
        this.wheel.buckets.forEach(b => {
          /*if (d.pos.x > b.x - b.radius && d.pos.x < b.x + b.radius && 
              d.pos.y > b.y - b.height / 2 && d.pos.y < b.y + b.height / 2) {
              b.addDroplet(d)
          }*/
          // this takes into account the current water column level
          if (d.pos.x > b.x - b.radius && d.pos.x < b.x + b.radius && 
            d.pos.y > b.y - b.height / 2 && d.pos.y < b.y + b.height / 2) {
            if (b.level > 0) {
              if (d.pos.y > b.y + b.height / 2 - b.level) {
                b.addDroplet(d)
              }
            }else {
              b.addDroplet(d)
            }
          }        
        })
      }
    })

    this.wheel.buckets.forEach(b => {

      // release a droplet
      if (b.droplets.length > 0) {
        let release = false
        if (b.isFull()) {
          release = true
        }else {
          const p = 0.1 * b.droplets.length / b.capacity
          release = random() < p
        }
        if (release) {
          const d = b.removeDroplet()
          d.pos.x = b.x - 5 + 10 * random()
          d.pos.y = b.y + b.height / 2 + 1
          d.vel.x = 0
          d.vel.y = 0
          d.stuck = false
        }
      }
      // apply torque from this bucket
      if (b.droplets.length > 1) {
        const m = b.droplets.reduce((sum, d) => d.mass)
        const F = m * this.options.gravity
        const L = this.wheel.radius * cos(this.wheel.theta + b.theta)
        const torque = F * L
        this.wheel.applyTorque(torque)  
      }
    })
    this.wheel.update(this.options.timestep)

    // remove off-screen droplets and put them 
    for (let i = this.droplets.length - 1; i >= 0; i--) {
      const d = this.droplets[i]
      if (!d.stuck) {
        if (d.pos.x < 0 || 
            d.pos.y < 0 || 
            d.pos.x > this.options.canvas.width || 
            d.pos.y > this.options.canvas.height) {
          // this.droplets.splice(i, 1)
          d.reset()
          // this.droplets.unshift(d)
        }
      }
    }
  }

  render(ctx) {
    this.wheel.render(ctx)
    this.droplets.forEach(d => d.render(ctx))
  }
}
