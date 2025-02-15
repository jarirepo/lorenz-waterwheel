import { Droplet } from './Droplet'
import { Wheel } from './Wheel';

const { cos, sin } = Math;

export class Bucket {

  readonly droplets: Droplet[] = [];
  ang: number = 0;
  x: number = 0;
  y: number = 0;
  /* height of water column */ level: number = 0;

  constructor(
    readonly wheel: Wheel,
    readonly radius: number,
    readonly height: number,
    /** Max number of droplets */ readonly capacity: number,
    readonly theta: number
  ) {
    this.update();
  }

  update(): void {
    this.ang = this.wheel.theta + this.theta;
    this.x = this.wheel.x + this.wheel.radius * cos(this.ang);
    this.y = this.wheel.y + this.wheel.radius * sin(this.ang);   
  }

  private _updateLevel(): void {
    const p = this.droplets.length / this.capacity;
    this.level = p * this.height;
  }

  addDroplet(d: Droplet): void {
    if (!this.isFull()) {
      d.stuck = true;
      this.droplets.push(d);
      this._updateLevel();
    }
  }

  isFull(): boolean {
    return !(this.droplets.length < this.capacity);
  }

  removeDroplet(): Droplet {
    const d = this.droplets.pop();
    this._updateLevel();
    return d;
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.setTransform(1, 0, 0, 1, this.x, this.y);

    ctx.fillStyle = 'rgba(0,200,0,0.5)';
    ctx.fillRect(-this.radius, -this.height / 2, 2 * this.radius, this.height);
    
    if (this.droplets.length > 0) {
      // draw water in the bucket
      ctx.beginPath();
      ctx.fillStyle = '#0000ff';
      ctx.rect(-this.radius, this.height / 2 - this.level, 2 * this.radius, this.level);
      ctx.fill();
    }
    
    ctx.beginPath();
    ctx.strokeStyle = '#00cc00';
    ctx.lineWidth = 1;
    ctx.moveTo(-this.radius - 4, -this.height / 2);
    ctx.lineTo(-this.radius, -this.height / 2);
    ctx.lineTo(-this.radius, this.height / 2);
    ctx.lineTo(this.radius, this.height / 2);
    ctx.lineTo(this.radius, -this.height / 2);
    ctx.lineTo(this.radius + 4, -this.height / 2);
    ctx.stroke();
    

    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}
