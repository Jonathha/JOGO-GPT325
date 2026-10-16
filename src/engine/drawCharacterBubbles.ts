import { Employee } from '../types/gameTypes';

/**
 * Resolves a descriptive, immersive Portuguese activity label
 * describing the worker's current real-time task.
 */
export function getWorkerActivityLabel(emp: Employee): string {
  // Determine state description
  let activityText = 'Pesquisando';

  switch (emp.state) {
    case 'TYPING':
      if (emp.assignedProjectId) {
        activityText = 'Treinando Rede Neural';
      } else {
        activityText = 'Codando CUDA Kernel';
      }
      break;

    case 'WALKING':
      activityText = 'Indo à Reunião';
      break;

    case 'COFFEE':
      activityText = 'Recarregando Café';
      break;

    case 'WHITEBOARD':
      activityText = 'Desenhando Atenção';
      break;

    case 'SERVER_CHECK':
      activityText = 'Monitorando GPUs';
      break;

    default:
      activityText = 'Pensando em AGI';
      break;
  }

  return activityText;
}

/**
 * Draws an interactive status badge floating above an employee's head.
 * Displays their name, activity icon/label, and morale indicator.
 */
export function drawOverheadStatusBubble(
  ctx: CanvasRenderingContext2D,
  sx: number,
  sy: number,
  emp: Employee,
  animTime: number
): void {
  ctx.save();
  const floatBounce = Math.sin(animTime * 3 + (emp.avatarSeed || 1)) * 1.5;
  const bubbleY = sy - 34 + floatBounce;
  const labelText = getWorkerActivityLabel(emp);

  // Measure text dimensions for pill box
  ctx.font = '10px "JetBrains Mono", monospace';
  const textWidth = ctx.measureText(labelText).width;
  const bubbleWidth = Math.max(70, textWidth + 14);
  const bubbleHeight = 16;
  const bubbleX = sx - bubbleWidth / 2;

  // Background card
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.beginPath();
  ctx.roundRect(bubbleX, bubbleY - bubbleHeight / 2, bubbleWidth, bubbleHeight, 4);
  ctx.fill();
  ctx.strokeStyle = emp.avatarColor || '#38bdf8';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Employee name and activity label
  ctx.fillStyle = '#f8fafc';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(labelText, sx, bubbleY);

  // Morale dot on the top right
  const moraleColor = emp.morale > 75 ? '#10b981' : emp.morale > 40 ? '#f59e0b' : '#ef4444';
  ctx.fillStyle = moraleColor;
  ctx.beginPath();
  ctx.arc(bubbleX + bubbleWidth - 3, bubbleY - bubbleHeight / 2 + 3, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
