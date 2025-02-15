import { Simulation } from './models'

const canvas = document.getElementById('simulation') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
ctx.globalAlpha = 0.8;

const sim = new Simulation({
  canvas: canvas,
  timestep: 0.01,
  gravity: 200,
  x: canvas.width / 2,
  y: canvas.height / 2,
  wheelRadius: 150,
  momentOfInertia: 200,
  numBuckets: 11,
  dropletPeriod: 1000,
  dropletMass: 0.01,
  numDroplets: 50,
  bucketRadius: 20,
  bucketHeight: 40,
  bucketCapacity: 10
});

let lastTime: number;
let accumulator = 0;
let totalTime = 0;
let omega = [];
const N = 1000;

function draw(time = 0) {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (time > 0) {
    accumulator += time - lastTime;
    while (accumulator >= 10) {
      accumulator -= 10;
      totalTime += 10;
      sim.update();
    }
    // save angular velocity for display
    if (omega.length < N) {
      omega.push({t: totalTime, value: sim.wheel.omega});
    }else {
      omega.splice(0, 1);
    }
    sim.render(ctx);

    // output omega
    if (sim.started && omega.length > 1) {
      const t0 = omega[0].t;
      ctx.setTransform(1, 0, 0, -1, 10, canvas.height / 2);
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(0,255,200,0.25)';
      ctx.moveTo(0, 40 * omega[0].value);
      for (let i = 1; i < omega.length; i++) {
        ctx.lineTo((omega[i].t - t0) / 50, 40 * omega[i].value);
      }
      ctx.stroke();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  }
  lastTime = time;

  requestAnimationFrame(draw);
}

window.onload = () => {
  const b = document.getElementById('start').addEventListener('click', () => {
    sim.start();
  });
}

draw();
