import { Employee } from '../types/gameTypes';

function makeGradient(ctx: CanvasRenderingContext2D, x: number, y: number, height: number, light: string, dark: string): CanvasGradient {
  const gradient = ctx.createLinearGradient(x - 5, y - height, x + 5, y + 3);
  gradient.addColorStop(0, light); gradient.addColorStop(1, dark);
  return gradient;
}
export function drawCharacterBody(ctx: CanvasRenderingContext2D, x: number, y: number, emp: Employee, animTime: number): void {
  const walking = emp.state === 'WALKING';
  const seated = emp.state === 'TYPING';
  const bob = walking ? Math.sin(animTime * 12) * 2 : 0;
  const swing = walking ? Math.sin(animTime * 12) * 3 : 0;
  ctx.save();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.fillStyle = 'rgba(0,0,0,.24)'; ctx.beginPath(); ctx.ellipse(x, y + 14, 7, 3, 0, 0, Math.PI * 2); ctx.fill();
  const legGradient = ctx.createLinearGradient(x - 4, y + 6, x + 3, y + 16);
  legGradient.addColorStop(0, '#46524a'); legGradient.addColorStop(1, '#18211c');
  ctx.strokeStyle = legGradient; ctx.lineWidth = 3.5;
  ctx.beginPath();
  if (seated) {
    ctx.moveTo(x - 2, y + 2); ctx.lineTo(x - 2, y + 7); ctx.lineTo(x - 6, y + 9);
    ctx.moveTo(x + 2, y + 2); ctx.lineTo(x + 2, y + 7); ctx.lineTo(x + 6, y + 9);
  } else {
    ctx.moveTo(x - 2, y + 3 + bob); ctx.lineTo(x - 3 - swing, y + 11 + bob);
    ctx.moveTo(x + 2, y + 3 + bob); ctx.lineTo(x + 3 + swing, y + 11 + bob);
  }
  ctx.stroke();
  ctx.fillStyle = '#101713'; ctx.beginPath();
  if (seated) { ctx.ellipse(x - 7, y + 10, 3, 1.5, -.12, 0, Math.PI * 2); ctx.ellipse(x + 7, y + 10, 3, 1.5, -.12, 0, Math.PI * 2); }
  else { ctx.ellipse(x - 3 - swing, y + 12 + bob, 3, 1.5, -.12, 0, Math.PI * 2); ctx.ellipse(x + 3 + swing, y + 12 + bob, 3, 1.5, -.12, 0, Math.PI * 2); }
  ctx.fill();
  const coat = emp.avatarColor || '#739a83';
  ctx.fillStyle = makeGradient(ctx, x, y + bob, 14, '#d0e0d2', coat);
  ctx.beginPath(); ctx.moveTo(x - 5, y - 6 + bob); ctx.quadraticCurveTo(x, y - 10 + bob, x + 5, y - 6 + bob); ctx.lineTo(x + 6, y + 4 + bob); ctx.quadraticCurveTo(x, y + 7 + bob, x - 6, y + 4 + bob); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(8,16,12,.7)'; ctx.lineWidth = .8; ctx.stroke();
  ctx.strokeStyle = makeGradient(ctx, x, y, 8, '#f4c9a6', '#a86f50'); ctx.lineWidth = 2.2;
  ctx.beginPath(); ctx.moveTo(x - 5, y - 3 + bob); ctx.lineTo(x - 7, y + 2 + bob); ctx.moveTo(x + 5, y - 3 + bob); ctx.lineTo(x + 7, y + 2 + bob); ctx.stroke();
  if (emp.state === 'TYPING') {
    const hand = Math.sin(animTime * 20) * 1.2;
    ctx.fillStyle = '#e2b18d'; ctx.beginPath(); ctx.ellipse(x - 7, y + 3 + hand, 1.5, 2, 0, 0, Math.PI * 2); ctx.ellipse(x + 7, y + 3 - hand, 1.5, 2, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}
export function drawCharacterHead(ctx: CanvasRenderingContext2D, x: number, y: number, emp: Employee, animTime: number): void {
  const bob = emp.state === 'WALKING' ? Math.sin(animTime * 12) * 2 : 0;
  const hy = y - 13 + bob;
  ctx.save();
  const skin = ctx.createRadialGradient(x - 2, hy - 3, 1, x, hy, 7);
  skin.addColorStop(0, '#f5d6b7'); skin.addColorStop(1, '#b77c5a');
  ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(x, hy, 5.1, 5.8, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(20,28,22,.7)'; ctx.lineWidth = .8; ctx.stroke();
  const hair = ['#242a25', '#5a3928', '#9b6c3d', '#4c5650'][(emp.avatarSeed || 1) % 4];
  ctx.fillStyle = hair; ctx.beginPath(); ctx.ellipse(x, hy - 2.5, 5.3, 3.4, 0, Math.PI, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - 5, hy - 1); ctx.quadraticCurveTo(x - 2, hy - 6, x + 1, hy - 3); ctx.lineTo(x + 4, hy - 4); ctx.lineTo(x + 5, hy - 1); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#252d27'; ctx.beginPath(); ctx.arc(x - 1.8, hy, .65, 0, Math.PI * 2); ctx.arc(x + 1.8, hy, .65, 0, Math.PI * 2); ctx.fill();
  if (emp.role === 'CHIEF_SCIENTIST' || emp.role === 'CUDA_ARCHITECT') {
    ctx.strokeStyle = '#c3d5c7'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, hy - 1, 5.8, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
    ctx.fillStyle = '#a6c4ad'; ctx.fillRect(x + 4.7, hy - 1, 1.4, 3);
  }
  ctx.restore();
}
export function drawCharacterModel(ctx: CanvasRenderingContext2D, sx: number, sy: number, emp: Employee, animTime: number, isSelected: boolean): void {
  if (!ctx || !emp) return;
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,.28)'; ctx.beginPath(); ctx.ellipse(sx, sy + 14, isSelected ? 11 : 8, 3.5, 0, 0, Math.PI * 2); ctx.fill();
  if (isSelected) {
    const glow = .45 + .35 * Math.sin(animTime * 4);
    ctx.strokeStyle = `rgba(183,213,190,${glow})`; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.ellipse(sx, sy + 13, 12, 5, 0, 0, Math.PI * 2); ctx.stroke();
  }
  drawCharacterBody(ctx, sx, sy, emp, animTime);
  drawCharacterHead(ctx, sx, sy, emp, animTime);
  ctx.restore();
}
