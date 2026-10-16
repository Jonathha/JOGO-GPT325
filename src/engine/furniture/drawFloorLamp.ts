/**
 * Standing floor lamp (the object itself). Its light, floor pool and halo are drawn separately by
 * drawLampLights as a cheap pre-rendered sprite, and the shadows it casts are baked into the floor layer.
 */
export function drawFloorLamp(ctx: CanvasRenderingContext2D, sx: number, sy: number, animTime: number): void {
  const warm = 0.9 + 0.06 * Math.sin(animTime * 2.1) + 0.03 * Math.sin(animTime * 5.3);
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,.30)'; ctx.beginPath(); ctx.ellipse(sx + 2, sy + 3, 11, 4.2, 0, 0, Math.PI * 2); ctx.fill();

  // Weighted round base
  ctx.fillStyle = '#25292e'; ctx.beginPath(); ctx.ellipse(sx, sy + 1, 8, 4, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillRect(sx - 8, sy - 1.5, 16, 2.5);
  ctx.fillStyle = '#3d444b'; ctx.beginPath(); ctx.ellipse(sx, sy - 1.5, 8, 4, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#58616a'; ctx.beginPath(); ctx.ellipse(sx - 1, sy - 2, 4.5, 2.2, 0, 0, Math.PI * 2); ctx.fill();

  // Pole
  ctx.fillStyle = '#7d868e'; ctx.fillRect(sx - 0.9, sy - 38, 1.8, 36.5);
  ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(sx - 0.9, sy - 38, 0.6, 36.5);

  // Shade: truncated cone, lit from inside
  const bottomY = sy - 35; const topY = sy - 48;
  ctx.fillStyle = `rgb(${Math.round(222 * warm)},${Math.round(184 * warm)},${Math.round(112 * warm)})`;
  ctx.beginPath(); ctx.moveTo(sx - 10, bottomY); ctx.lineTo(sx - 6, topY); ctx.lineTo(sx + 6, topY); ctx.lineTo(sx + 10, bottomY); ctx.closePath(); ctx.fill();
  ctx.fillStyle = `rgba(255,243,205,${0.55 * warm})`;
  ctx.beginPath(); ctx.moveTo(sx - 10, bottomY); ctx.lineTo(sx - 6, topY); ctx.lineTo(sx, topY); ctx.lineTo(sx, bottomY); ctx.closePath(); ctx.fill();
  ctx.fillStyle = `rgba(255,248,222,${0.95 * warm})`;
  ctx.beginPath(); ctx.ellipse(sx, bottomY, 10, 4.4, 0, 0, Math.PI); ctx.fill();
  ctx.fillStyle = '#fff6d6'; ctx.beginPath(); ctx.ellipse(sx, topY, 6, 2.6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(120,88,40,.55)'; ctx.lineWidth = 0.8; ctx.stroke();
  ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.9; ctx.beginPath(); ctx.arc(sx, topY + 0.3, 1.7, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
