import { Employee, EmployeeState } from '../types/gameTypes';

/**
 * Transitions an employee to a new randomized office activity
 * (visiting coffee machine, inspecting server rack, sketching at whiteboard, or returning to desk).
 */
export function resolveWorkerNextState(emp: Employee, gridSize: number, deskPositions: Array<{ x: number; y: number }> = []): Employee {
  const roll = Math.random();
  let nextState: EmployeeState = 'TYPING';
  let targetX = emp.x;
  let targetY = emp.y;

  if (roll < 0.45) {
    // Return to assigned workstation
    nextState = 'TYPING';
    const assignedDesk = deskPositions.length ? deskPositions[emp.deskIndex % deskPositions.length] : null;
    targetX = assignedDesk?.x ?? Math.max(1, Math.min(gridSize - 2, 1 + (emp.deskIndex % 3) * 2));
    targetY = assignedDesk?.y ?? Math.max(1, Math.min(gridSize - 2, 1 + Math.floor(emp.deskIndex / 3) * 2));
  } else if (roll < 0.65) {
    // Grab coffee break at the coffee bar
    nextState = 'COFFEE';
    targetX = Math.max(1, gridSize - 2);
    targetY = Math.max(1, gridSize - 2);
  } else if (roll < 0.82) {
    // Brainstorm at the whiteboard
    nextState = 'WHITEBOARD';
    targetX = Math.max(1, gridSize - 2);
    targetY = 1;
  } else {
    // Check GPU server cluster
    nextState = 'SERVER_CHECK';
    targetX = 1;
    targetY = Math.max(1, gridSize - 2);
  }

  // Set new activity duration timer (4 to 9 seconds)
  const newTimer = 4.0 + Math.random() * 5.0;

  return {
    ...emp,
    state: nextState,
    activityState: nextState,
    targetX,
    targetY,
    stateTimer: newTimer,
  };
}

/**
 * Advances employee positions toward their target coordinates
 * and manages activity state timers and morale.
 */
export function updateEmployeeBehaviors(
  employees: Employee[],
  gridSize: number,
  deltaSeconds: number,
  deskPositions: Array<{ x: number; y: number }> = []
): Employee[] {
  const walkSpeed = 1.4; // grid units per second

  return employees.map((emp) => {
    let currentX = emp.x;
    let currentY = emp.y;
    let timer = emp.stateTimer - deltaSeconds;

    // Move smoothly towards target position if not arrived
    const dx = emp.targetX - currentX;
    const dy = emp.targetY - currentY;
    const distance = Math.hypot(dx, dy);

    if (distance > 0.08) {
      const step = Math.min(distance, walkSpeed * deltaSeconds);
      currentX += (dx / distance) * step;
      currentY += (dy / distance) * step;
      return {
        ...emp,
        x: currentX,
        y: currentY,
        state: 'WALKING',
        activityState: emp.activityState ?? (emp.state === 'WALKING' ? 'TYPING' : emp.state),
      };
    }

    // If reached destination and timer elapsed, transition to next activity
    if (timer <= 0) {
      return resolveWorkerNextState({ ...emp, x: emp.targetX, y: emp.targetY }, gridSize, deskPositions);
    }

    const activityState = emp.activityState ?? (emp.state === 'WALKING' ? 'TYPING' : emp.state);
    return {
      ...emp,
      x: emp.targetX,
      y: emp.targetY,
      state: activityState,
      activityState,
      stateTimer: timer,
    };
  });
}
