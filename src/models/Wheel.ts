import { Bucket } from './Bucket'

const { PI } = Math;
const TWO_PI = 2 * PI;

interface WheelOptions {
  x: number;
  y: number;
  wheelRadius: number;
  momentOfInertia: number;
  numBuckets: number;
  bucketRadius: number;
  bucketHeight: number;
  bucketCapacity: number;
}

export class Wheel {
  x: number = this.options.x;
  y: number = this.options.y;
  radius: number = this.options.wheelRadius;

  momentOfInertia = this.options.momentOfInertia;
  numBuckets = this.options.numBuckets;
  theta = 0;  // angular position (radians)
  omega = 0;  // angular velocity (rad/s)
  alpha = 0;  // angular acceleration (rad/s^2)
  torque = 0;
  buckets: Bucket[] = [];

  constructor(readonly options: WheelOptions) {
    this._createBuckets();
  }

  applyTorque(t: number): void {
    this.torque += t;
  }

  update(dt: number): void {
    this.alpha = this.torque / this.momentOfInertia;
    this.theta += this.omega * dt + this.alpha * dt * dt / 2;
    this.omega += this.alpha * dt;
    this.torque = 0;
    this.buckets.forEach(b => b.update());
  }

  render(ctx: CanvasRenderingContext2D): void {
    // wheel
    ctx.beginPath();
    ctx.fillStyle = '#333';
    ctx.arc(this.x, this.y, 10, 0, TWO_PI);
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.arc(this.x, this.y, this.radius, 0, TWO_PI);
    ctx.stroke();
    // buckets
    this.buckets.forEach(b => {
      b.render(ctx);
    });
  }

  private _createBuckets(): void {
    const n = this.numBuckets;
    for (let i = 0; i < n; i++) {
      const b = new Bucket(this, 
        this.options.bucketRadius, 
        this.options.bucketHeight,
        this.options.bucketCapacity,
        -PI / 2 - PI / 72 + i / n * TWO_PI
      );
      this.buckets.push(b);
    }
  }
}
