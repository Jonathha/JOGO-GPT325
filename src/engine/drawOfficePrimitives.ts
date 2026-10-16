/** Procedural, texture-free isometric solids with shaded faces and edge highlights. */
export function drawIsoBox(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, depth: number, height: number, top: string, front: string, side: string, edge = 'rgba(8,16,13,.8)'): void {
  const p = (px: number, py: number) => ({ x: px, y: py });
  const topFront = p(x, y - height + depth / 2);
  const topRight = p(x + width / 2, y - height);
  const topBack = p(x, y - height - depth / 2);
  const topLeft = p(x - width / 2, y - height);
  const baseFront = p(x, y + depth / 2);
  const baseRight = p(x + width / 2, y);
  const baseBack = p(x, y - depth / 2);
  const baseLeft = p(x - width / 2, y);
  const polygon = (points: { x: number; y: number }[], fill: string) => {
    ctx.beginPath(); ctx.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
    ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = edge; ctx.lineWidth = 0.8; ctx.stroke();
  };
  polygon([topFront, topLeft, baseLeft, baseFront], front);
  polygon([topFront, topRight, baseRight, baseFront], side);
  polygon([topFront, topRight, topBack, topLeft], top);
  ctx.beginPath(); ctx.moveTo(topLeft.x + 2, topLeft.y + 1); ctx.lineTo(topBack.x, topBack.y + 1); ctx.lineTo(topRight.x - 2, topRight.y + 1);
  ctx.strokeStyle = 'rgba(255,255,255,.16)'; ctx.lineWidth = 1; ctx.stroke();
}
export function drawRoundedScreen(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, active: boolean, accent = '#9fc6b0'): void {
  ctx.save();
  ctx.fillStyle = '#080e0c'; ctx.strokeStyle = '#66766c'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.roundRect(x - width / 2 - 1, y - height - 1, width + 2, height + 2, 1.5); ctx.fill(); ctx.stroke();
  const gradient = ctx.createLinearGradient(x, y - height, x, y);
  gradient.addColorStop(0, active ? '#27483a' : '#202a25'); gradient.addColorStop(1, active ? '#101f19' : '#111713');
  ctx.fillStyle = gradient; ctx.fillRect(x - width / 2 + 1, y - height + 1, width - 2, height - 2);
  if (active) {
    ctx.strokeStyle = accent; ctx.globalAlpha = .7; ctx.lineWidth = .7;
    for (let row = 0; row < 3; row++) {
      ctx.beginPath(); ctx.moveTo(x - width / 2 + 3, y - height + 4 + row * 3); ctx.lineTo(x + width / 2 - 3 - (row % 2) * 3, y - height + 4 + row * 3); ctx.stroke();
    }
  }
  ctx.restore();
}
