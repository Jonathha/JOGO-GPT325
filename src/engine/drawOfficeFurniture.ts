type OfficeSprite = 'desk' | 'server' | 'coffee' | 'whiteboard' | 'sofa' | 'plant';
let officeSpriteImage: HTMLImageElement | null = null;
let officeSpriteReady = false;

/** Load the custom illustrated sprite atlas once; procedural drawings remain as fallback. */
function drawOfficeSprite(ctx: CanvasRenderingContext2D, sprite: OfficeSprite, sx: number, sy: number, width: number, height: number): boolean {
  if (typeof Image === 'undefined') return false;
  if (!officeSpriteImage) {
    officeSpriteImage = new Image();
    officeSpriteImage.onload = () => { officeSpriteReady = true; };
    officeSpriteImage.src = '/assets/office/office-sprites.svg';
  }
  if (!officeSpriteReady || !officeSpriteImage) return false;
  const index: Record<OfficeSprite, number> = { desk: 0, server: 1, coffee: 2, whiteboard: 3, sofa: 4, plant: 5 };
  ctx.drawImage(officeSpriteImage, index[sprite] * 128, 0, 128, 128, sx - width / 2, sy - height + 8, width, height);
  return true;
}

/**
 * Draws an isometric developer workstation with dual glowing monitors,
 * ergonomic desk surface, cable grommets, and animated terminal displays.
 */
export function drawDeskStation(
  ctx: CanvasRenderingContext2D,
  sx: number,
  sy: number,
  animTime: number,
  hasWorker: boolean
): void {
  ctx.save();
  if (drawOfficeSprite(ctx, 'desk', sx, sy, 92, 86)) {
    if (hasWorker) {
      ctx.fillStyle = `rgba(76, 226, 213, ${0.08 + (Math.sin(animTime * 3) + 1) * 0.06})`;
      ctx.beginPath(); ctx.ellipse(sx + 4, sy - 31, 24, 12, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore(); return;
  }
  // Wooden / composite desk top surface
  ctx.beginPath();
  ctx.moveTo(sx - 24, sy - 12);
  ctx.lineTo(sx, sy - 24);
  ctx.lineTo(sx + 24, sy - 12);
  ctx.lineTo(sx, sy);
  ctx.closePath();
  ctx.fillStyle = '#1e293b';
  ctx.fill();
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Dual glowing ultra-wide monitor screens
  const monitorGlow = 0.5 + 0.5 * Math.sin(animTime * 3);
  const screenColor = hasWorker ? `rgba(56, 189, 248, ${0.7 + monitorGlow * 0.2})` : 'rgba(71, 85, 105, 0.4)';

  // Left primary monitor
  ctx.fillStyle = screenColor;
  ctx.fillRect(sx - 14, sy - 26, 12, 10);
  ctx.strokeStyle = '#0f172a';
  ctx.strokeRect(sx - 14, sy - 26, 12, 10);

  // Right vertical monitor
  ctx.fillStyle = hasWorker ? 'rgba(52, 211, 153, 0.75)' : 'rgba(71, 85, 105, 0.3)';
  ctx.fillRect(sx + 2, sy - 28, 8, 14);
  ctx.strokeRect(sx + 2, sy - 28, 8, 14);

  // Ergonomic office chair behind or in front of desk
  ctx.beginPath();
  ctx.arc(sx, sy + 6, 6, 0, Math.PI * 2);
  ctx.fillStyle = '#0f172a';
  ctx.fill();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}

/**
 * Draws an enterprise AI GPU server rack with active cooling fans
 * and animated pulsating status LEDs reflecting compute workload.
 */
export function drawServerRack(
  ctx: CanvasRenderingContext2D,
  sx: number,
  sy: number,
  animTime: number,
  loadRatio: number
): void {
  ctx.save();
  if (drawOfficeSprite(ctx, 'server', sx, sy, 76, 88)) {
    const glow = 0.35 + (Math.sin(animTime * 5) + 1) * 0.2 * Math.max(0.25, loadRatio);
    ctx.fillStyle = `rgba(71, 244, 205, ${glow})`;
    ctx.beginPath(); ctx.arc(sx - 5, sy - 43, 2.1, 0, Math.PI * 2); ctx.fill();
    ctx.restore(); return;
  }
  const rackW = 20;
  const rackH = 46;

  // Server rack main obsidian enclosure
  ctx.fillStyle = '#020617';
  ctx.fillRect(sx - rackW / 2, sy - rackH, rackW, rackH);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1;
  ctx.strokeRect(sx - rackW / 2, sy - rackH, rackW, rackH);

  // Server blade horizontal slots and pulsating LED indicators
  const bladeCount = 5;
  for (let i = 0; i < bladeCount; i++) {
    const slotY = sy - rackH + 6 + i * 8;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(sx - rackW / 2 + 2, slotY, rackW - 4, 6);

    // Blinking activity LEDs
    const blinkFreq = 4 + i * 2;
    const isLit = Math.sin(animTime * blinkFreq + i) > (0.3 - loadRatio * 0.4);
    const ledColor = isLit ? (i % 2 === 0 ? '#10b981' : '#38bdf8') : '#1e293b';

    ctx.fillStyle = ledColor;
    ctx.beginPath();
    ctx.arc(sx - rackW / 2 + 5, slotY + 3, 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(sx + rackW / 2 - 5, slotY + 3, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/**
 * Draws the startup coffee and espresso bar with animated rising steam
 * that fuels researcher velocity and morale.
 */
export function drawCoffeeStation(
  ctx: CanvasRenderingContext2D,
  sx: number,
  sy: number,
  animTime: number
): void {
  ctx.save();
  if (drawOfficeSprite(ctx, 'coffee', sx, sy, 82, 80)) {
    const steam = (animTime * 18) % 12;
    ctx.strokeStyle = 'rgba(242, 249, 242, .7)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(sx + 13, sy - 53 - steam); ctx.quadraticCurveTo(sx + 17, sy - 61 - steam, sx + 13, sy - 66 - steam); ctx.stroke();
    ctx.restore(); return;
  }
  // Wooden barista prep table
  ctx.beginPath();
  ctx.moveTo(sx - 16, sy - 8);
  ctx.lineTo(sx, sy - 16);
  ctx.lineTo(sx + 16, sy - 8);
  ctx.lineTo(sx, sy);
  ctx.closePath();
  ctx.fillStyle = '#78350f';
  ctx.fill();
  ctx.strokeStyle = '#92400e';
  ctx.stroke();

  // Italian espresso machine body
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(sx - 8, sy - 22, 16, 12);
  ctx.strokeStyle = '#475569';
  ctx.strokeRect(sx - 8, sy - 22, 16, 12);

  // Animated rising coffee steam particles
  const steamOffset1 = (animTime * 18) % 16;
  const steamOffset2 = ((animTime + 0.4) * 18) % 16;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.beginPath();
  ctx.arc(sx - 3, sy - 24 - steamOffset1, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(sx + 3, sy - 24 - steamOffset2, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/**
 * Draws an AI architecture whiteboard containing attention diagrams,
 * neural loss curves, and mathematical equations.
 */
export function drawWhiteboard(
  ctx: CanvasRenderingContext2D,
  sx: number,
  sy: number,
  animTime: number
): void {
  ctx.save();
  if (drawOfficeSprite(ctx, 'whiteboard', sx, sy, 78, 88)) { ctx.restore(); return; }
  const boardW = 28;
  const boardH = 22;

  // Aluminum stand legs
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(sx - boardW / 2 + 2, sy);
  ctx.lineTo(sx - boardW / 2 + 4, sy - 24);
  ctx.moveTo(sx + boardW / 2 - 2, sy);
  ctx.lineTo(sx + boardW / 2 - 4, sy - 24);
  ctx.stroke();

  // Whiteboard magnetic writing surface
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(sx - boardW / 2, sy - 34, boardW, boardH);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1;
  ctx.strokeRect(sx - boardW / 2, sy - 34, boardW, boardH);

  // Handwritten Attention transformer formula & loss curve lines
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(sx - boardW / 2 + 4, sy - 30);
  ctx.lineTo(sx - boardW / 2 + 12, sy - 30);
  ctx.moveTo(sx - boardW / 2 + 4, sy - 26);
  ctx.lineTo(sx - boardW / 2 + 20, sy - 26);
  ctx.stroke();

  // Red descending loss curve with subtle oscillation
  const lossBounce = Math.sin(animTime * 2) * 0.5;
  ctx.strokeStyle = '#ef4444';
  ctx.beginPath();
  ctx.moveTo(sx - boardW / 2 + 5, sy - 22);
  ctx.quadraticCurveTo(sx, sy - 18 + lossBounce, sx + boardW / 2 - 4, sy - 15);
  ctx.stroke();
  ctx.restore();
}

/**
 * Draws office relaxation and wellness decor: comfortable lounge sofa
 * or vibrant potted indoor monstera plants.
 */
export function drawLoungeAndDecor(
  ctx: CanvasRenderingContext2D,
  sx: number,
  sy: number,
  type: 'SOFA' | 'PLANT',
  animTime: number
): void {
  ctx.save();
  if (drawOfficeSprite(ctx, type === 'SOFA' ? 'sofa' : 'plant', sx, sy, type === 'SOFA' ? 86 : 70, type === 'SOFA' ? 78 : 82)) {
    if (type === 'PLANT') {
      const sway = Math.sin(animTime * 1.5) * 1.5;
      ctx.strokeStyle = 'rgba(182, 216, 177, .45)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(sx, sy - 50); ctx.lineTo(sx + sway, sy - 61); ctx.stroke();
    }
    ctx.restore(); return;
  }
  if (type === 'SOFA') {
    // Designer Scandinavian 2-seater lounge sofa
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.ellipse(sx, sy - 6, 16, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#3b82f6';
    ctx.stroke();

    // Backrest cushion
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(sx - 14, sy - 16, 28, 8);
    ctx.strokeStyle = '#60a5fa';
    ctx.strokeRect(sx - 14, sy - 16, 28, 8);
  } else {
    // Terracotta plant pot with verdant leaves
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.moveTo(sx - 6, sy - 8);
    ctx.lineTo(sx + 6, sy - 8);
    ctx.lineTo(sx + 4, sy);
    ctx.lineTo(sx - 4, sy);
    ctx.closePath();
    ctx.fill();

    // Animated swaying tropical leaves
    const sway = Math.sin(animTime * 1.5) * 2;
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(sx - 5 + sway * 0.5, sy - 14, 5, 0, Math.PI * 2);
    ctx.arc(sx + 5 + sway * 0.5, sy - 15, 6, 0, Math.PI * 2);
    ctx.arc(sx + sway, sy - 19, 7, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
