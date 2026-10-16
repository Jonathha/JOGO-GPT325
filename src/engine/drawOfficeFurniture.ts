import { drawIsoBox, drawRoundedScreen } from './drawOfficePrimitives';

export function drawDeskStation(ctx: CanvasRenderingContext2D, sx: number, sy: number, animTime: number, hasWorker: boolean): void {
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,.28)'; ctx.beginPath(); ctx.ellipse(sx, sy + 4, 24, 7, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#29342e'; ctx.beginPath(); ctx.ellipse(sx, sy + 4, 9, 5, 0, 0, Math.PI * 2); ctx.fill();
  // Ergonomic swivel chair, layered behind the desktop.
  ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.beginPath(); ctx.ellipse(sx, sy + 15, 12, 4, 0, 0, Math.PI * 2); ctx.fill();
  drawIsoBox(ctx, sx, sy + 10, 13, 11, 2.5, '#52645a', '#2b3931', '#1c2922');
  drawIsoBox(ctx, sx, sy + 5, 12, 3, 8, '#65776c', '#34443a', '#243129');
  drawIsoBox(ctx, sx - 6, sy + 8, 2, 5, 5, '#53655a', '#2b3931', '#1c2922');
  drawIsoBox(ctx, sx + 6, sy + 8, 2, 5, 5, '#53655a', '#2b3931', '#1c2922');
  drawIsoBox(ctx, sx, sy + 16, 2, 2, 4, '#9ca99f', '#4b5a50', '#303d35');
  [-7, 0, 7].forEach((offset) => {
    ctx.strokeStyle = '#66766b'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(sx, sy + 18); ctx.lineTo(sx + offset, sy + 20); ctx.stroke();
    ctx.fillStyle = '#18231d'; ctx.beginPath(); ctx.arc(sx + offset, sy + 20, 1.8, 0, Math.PI * 2); ctx.fill();
  });
  drawIsoBox(ctx, sx, sy + 4, 4, 4, 7, '#56645a', '#27322b', '#1c2620');
  drawIsoBox(ctx, sx, sy - 2, 35, 20, 4, '#c1a078', '#806344', '#4c3a2a');
  ctx.strokeStyle = 'rgba(255,235,205,.28)'; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(sx - 15, sy - 5); ctx.lineTo(sx + 15, sy - 5); ctx.stroke();
  drawIsoBox(ctx, sx - 11, sy + 4, 3, 3, 7, '#7c654b', '#473a2d', '#342b22');
  drawIsoBox(ctx, sx + 11, sy + 4, 3, 3, 7, '#7c654b', '#473a2d', '#342b22');
  drawIsoBox(ctx, sx - 7, sy - 10, 2, 2, 7, '#59675f', '#2a342e', '#202923');
  drawIsoBox(ctx, sx + 7, sy - 10, 2, 2, 8, '#59675f', '#2a342e', '#202923');
  drawRoundedScreen(ctx, sx - 7, sy - 17, 12, 10, hasWorker, '#9ac8a7');
  drawRoundedScreen(ctx, sx + 8, sy - 18, 9, 13, hasWorker, '#b5d8bf');
  drawIsoBox(ctx, sx, sy - 5, 12, 5, 1.5, '#4e5a51', '#29332c', '#202923');
  ctx.fillStyle = hasWorker ? '#b6d8bf' : '#66766b'; ctx.beginPath(); ctx.arc(sx + 13, sy - 4, 1, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}


export function drawCoffeeStation(ctx: CanvasRenderingContext2D, sx: number, sy: number, animTime: number): void {
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(sx, sy + 3, 20, 6, 0, 0, Math.PI * 2); ctx.fill();
  drawIsoBox(ctx, sx, sy + 1, 29, 17, 10, '#926d4e', '#624832', '#483322');
  drawIsoBox(ctx, sx, sy - 9, 17, 11, 12, '#aeb9b0', '#5c6b62', '#3c4942');
  drawIsoBox(ctx, sx - 3, sy - 11, 7, 6, 3, '#d1d9d2', '#77877c', '#526157');
  ctx.fillStyle = '#101713'; ctx.fillRect(sx - 6, sy - 16, 12, 3);
  ctx.strokeStyle = '#81948a'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(sx + 5, sy - 9); ctx.lineTo(sx + 8, sy - 5); ctx.stroke();
  const steam = (animTime * 12) % 10;
  ctx.strokeStyle = 'rgba(220,232,223,.55)'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(sx - 3, sy - 19 - steam); ctx.quadraticCurveTo(sx - 7, sy - 23 - steam, sx - 3, sy - 26 - steam);
  ctx.moveTo(sx + 3, sy - 18 - ((steam + 4) % 10)); ctx.quadraticCurveTo(sx + 7, sy - 23 - steam, sx + 3, sy - 27 - steam); ctx.stroke();
  ctx.restore();
}

export function drawWhiteboard(ctx: CanvasRenderingContext2D, sx: number, sy: number, animTime: number): void {
  ctx.save();
  drawIsoBox(ctx, sx, sy, 30, 7, 29, '#d9e0d9', '#7c8a80', '#59685f');
  ctx.fillStyle = '#eef2ec'; ctx.fillRect(sx - 11, sy - 25, 22, 17);
  ctx.strokeStyle = '#a3b1a6'; ctx.lineWidth = 1; ctx.strokeRect(sx - 11, sy - 25, 22, 17);
  ctx.strokeStyle = '#6f9b82'; ctx.lineWidth = 1.1; ctx.beginPath();
  ctx.moveTo(sx - 8, sy - 21); ctx.lineTo(sx - 2, sy - 21); ctx.lineTo(sx + 2, sy - 16); ctx.lineTo(sx + 8, sy - 19);
  ctx.moveTo(sx - 8, sy - 12); ctx.lineTo(sx - 3, sy - 15); ctx.lineTo(sx + 3, sy - 11); ctx.stroke();
  ctx.strokeStyle = '#b17d70'; ctx.beginPath(); ctx.moveTo(sx - 6, sy - 8); ctx.quadraticCurveTo(sx, sy - 15 + Math.sin(animTime) * .5, sx + 7, sy - 10); ctx.stroke();
  ctx.restore();
}

export function drawLoungeAndDecor(ctx: CanvasRenderingContext2D, sx: number, sy: number, type: 'SOFA' | 'PLANT', animTime: number): void {
  ctx.save();
  if (type === 'SOFA') {
    ctx.fillStyle = 'rgba(0,0,0,.24)'; ctx.beginPath(); ctx.ellipse(sx, sy + 2, 20, 7, 0, 0, Math.PI * 2); ctx.fill();
    drawIsoBox(ctx, sx, sy, 31, 17, 9, '#718b7a', '#344c3d', '#25392d');
    drawIsoBox(ctx, sx, sy - 7, 29, 10, 8, '#91a996', '#496b54', '#344c40');
    drawIsoBox(ctx, sx - 8, sy - 1, 12, 8, 3, '#b6c6b7', '#718b78', '#506b57');
    drawIsoBox(ctx, sx + 7, sy - 1, 12, 8, 3, '#a2b9a5', '#617e68', '#435d49');
  } else {
    drawIsoBox(ctx, sx, sy + 1, 12, 10, 8, '#b77855', '#804a32', '#5c3628');
    const sway = Math.sin(animTime * 1.2) * 2;
    const leaves = [{ x: sx - 5, y: sy - 16, rx: -8 }, { x: sx + 5 + sway, y: sy - 17, rx: 7 }, { x: sx + sway, y: sy - 23, rx: 0 }, { x: sx - 1, y: sy - 13, rx: -2 }];
    leaves.forEach((leaf, index) => {
      ctx.save(); ctx.translate(leaf.x, leaf.y); ctx.rotate(leaf.rx * Math.PI / 180);
      const gradient = ctx.createLinearGradient(-4, 0, 4, -10); gradient.addColorStop(0, '#315c40'); gradient.addColorStop(1, index % 2 ? '#8eaf83' : '#658c68');
      ctx.fillStyle = gradient; ctx.beginPath(); ctx.ellipse(0, 0, 4, 9, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(210,230,203,.35)'; ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(0, 6); ctx.lineTo(0, -7); ctx.stroke(); ctx.restore();
    });
  }
  ctx.restore();
}

/** Flat rug patch drawn at floor level; neighbouring RUG tiles blend into one large carpet. */
export function drawRug(ctx: CanvasRenderingContext2D, sx: number, sy: number, tileW: number, tileH: number, phase: string, gx: number, gy: number): void {
  const hw = tileW * 0.5; const hh = tileH * 0.5;
  const colors = phase === 'TORRE_SUPERCLUSTER' ? ['#0c2a4a', '#0a1f38'] : phase === 'CAMPUS_IA' ? ['#3b5b8c', '#2f4a74'] : phase === 'LOFT_STARTUP' ? ['#5b2c3a', '#4a2230'] : ['#4a5d52', '#3d4e44'];
  ctx.save();
  ctx.beginPath(); ctx.moveTo(sx, sy - hh); ctx.lineTo(sx + hw, sy); ctx.lineTo(sx, sy + hh); ctx.lineTo(sx - hw, sy); ctx.closePath();
  ctx.fillStyle = colors[(gx + gy) % 2]; ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.06)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(sx, sy - hh * 0.55); ctx.lineTo(sx + hw * 0.55, sy); ctx.lineTo(sx, sy + hh * 0.55); ctx.lineTo(sx - hw * 0.55, sy); ctx.closePath(); ctx.stroke();
  ctx.restore();
}

export { drawServerRack } from './furniture/drawServerRack';
export { drawFloorLamp } from './furniture/drawFloorLamp';
export { drawBookshelf } from './furniture/drawBookshelf';
