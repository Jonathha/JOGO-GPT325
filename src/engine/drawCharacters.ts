import { Employee } from '../types/gameTypes';

/**
 * Renders the torso, arms, and animated hands/legs of an employee.
 * Adapts posture based on worker activity (typing, walking, or sipping coffee).
 */
export function drawCharacterBody(
  ctx: CanvasRenderingContext2D,
  charX: number,
  charY: number,
  emp: Employee,
  animTime: number
): void {
  const isWalking = emp.state === 'WALKING';
  const isTyping = emp.state === 'TYPING';
  const walkBob = isWalking ? Math.sin(animTime * 12) * 2.5 : 0;
  const legSwing = isWalking ? Math.sin(animTime * 12) * 4 : 0;

  // Legs / trousers
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(charX - 4 + legSwing * 0.3, charY + 8 + walkBob, 3, 7);
  ctx.fillRect(charX + 1 - legSwing * 0.3, charY + 8 + walkBob, 3, 7);

  // Torso / hoodie / lab shirt in role color
  ctx.fillStyle = emp.avatarColor || '#38bdf8';
  ctx.beginPath();
  ctx.roundRect(charX - 6, charY - 6 + walkBob, 12, 14, 2);
  ctx.fill();
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Active hands: typing or holding coffee mug
  if (isTyping) {
    const handJiggle = Math.sin(animTime * 20) * 1.5;
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(charX - 4, charY + 4 + handJiggle, 1.8, 0, Math.PI * 2);
    ctx.arc(charX + 4, charY + 4 - handJiggle, 1.8, 0, Math.PI * 2);
    ctx.fill();
  } else if (emp.state === 'COFFEE') {
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(charX + 4, charY + 1 + walkBob, 4, 5);
  }
}

/**
 * Draws the head, face, hair, and tech accessories (glasses/headsets) of an employee.
 * Features customizable hair colors and facial features.
 */
export function drawCharacterHead(
  ctx: CanvasRenderingContext2D,
  charX: number,
  charY: number,
  emp: Employee,
  animTime: number
): void {
  const isWalking = emp.state === 'WALKING';
  const walkBob = isWalking ? Math.sin(animTime * 12) * 2.5 : 0;
  const headY = charY - 14 + walkBob;

  // Face flesh tone
  ctx.fillStyle = '#fde68a';
  ctx.beginPath();
  ctx.arc(charX, headY, 5.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Stylized hair based on avatar seed
  const hairSeed = (emp.avatarSeed || 1) % 4;
  const hairColors = ['#1e293b', '#78350f', '#d97706', '#475569'];
  ctx.fillStyle = hairColors[hairSeed];
  ctx.beginPath();
  ctx.arc(charX, headY - 2, 5.5, Math.PI, Math.PI * 2);
  ctx.fill();

  // Eyes and researcher glasses
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(charX - 2.5, headY - 0.5, 1.5, 1.5);
  ctx.fillRect(charX + 1, headY - 0.5, 1.5, 1.5);

  // Audio headset or badge for team leads
  if (emp.role === 'CHIEF_SCIENTIST' || emp.role === 'CUDA_ARCHITECT') {
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(charX, headY - 1, 6.2, Math.PI * 0.8, Math.PI * 2.2);
    ctx.stroke();
  }
}

/**
 * Main character rendering entry point combining shadow, body, head,
 * and selection halo.
 */
export function drawCharacterModel(
  ctx: CanvasRenderingContext2D,
  sx: number,
  sy: number,
  emp: Employee,
  animTime: number,
  isSelected: boolean
): void {
  // Validate canvas context and position coordinates
  if (!ctx || !emp) {
    return;
  }

  ctx.save();
  // Floor contact drop shadow with subtle pulse
  const shadowSpread = isSelected ? 11 : 9;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(sx, sy + 14, shadowSpread, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Selection glowing halo ring
  if (isSelected) {
    const haloGlow = 0.6 + 0.4 * Math.sin(animTime * 5);
    ctx.strokeStyle = `rgba(56, 189, 248, ${haloGlow})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(sx, sy + 14, 14, 7, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Draw character anatomy components in proper isometric depth
  drawCharacterBody(ctx, sx, sy, emp, animTime);
  drawCharacterHead(ctx, sx, sy, emp, animTime);

  // Restore canvas context transformation and styles
  ctx.restore();
}
