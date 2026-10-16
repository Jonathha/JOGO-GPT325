export function wallQuad(ctx: CanvasRenderingContext2D, ax: number, ay: number, bx: number, by: number, z0: number, z1: number, fill: string | CanvasGradient): void {
  ctx.beginPath();
  ctx.moveTo(ax, ay - z0); ctx.lineTo(bx, by - z0); ctx.lineTo(bx, by - z1); ctx.lineTo(ax, ay - z1);
  ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
}
