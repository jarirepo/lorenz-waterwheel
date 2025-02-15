const { PI, random } = Math;
const TWO_PI = 2 * PI;

export class Droplet {

  pos0 = { x: this.x, y: this.y };
  pos = { x: this.x, y: this.y };
  vel = { x: 0, y: 0 };
  acc = { x: 0, y: 0 };
  force = {x: 0, y: 0};
  stuck = false;

  constructor(readonly x: number, readonly y: number, readonly mass: number) {}

  reset(): void {
    this.pos.x = this.pos0.x;
    this.pos.y = this.pos0.y;
    this.vel.x = 0;
    this.vel.y = 0;
    this.acc.x = 0;
    this.acc.y = 0;
    this.force.x = 0;
    this.force.y = 0;
    this.stuck = false;
  }

  applyForce(fx: number, fy: number): void {
    this.force.x += fx;
    this.force.y += fy;
  }

  update(dt: number): void {
    this.acc.x = this.force.x / this.mass;
    this.acc.y = this.force.y / this.mass;
    this.pos.x += this.vel.x * dt + this.acc.x * dt * dt / 2;
    this.pos.y += this.vel.y * dt + this.acc.y * dt * dt / 2;
    this.vel.x += this.acc.x * dt;
    this.vel.y += this.acc.y * dt;
    this.force.x = 0;
    this.force.y = 0;
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (this.stuck) { return; }
    ctx.beginPath();
    ctx.fillStyle = 'rgba(0,0,255,1.0)';
    ctx.arc(this.pos.x, this.pos.y, 2, 0, TWO_PI);
    ctx.fill();
  }
}
