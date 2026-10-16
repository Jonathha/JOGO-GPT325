import React, { useEffect, useRef, useState } from 'react';
import { CompanyState, Employee, ModelProject, OfficeTile } from '../types/gameTypes';
import { getOfficeLayoutForPhase } from '../data/officeLayouts';
import { gridToIsometricScreen, isometricScreenToGrid } from '../engine/isometricMath';
import { drawFloorTile, drawPerimeterWalls } from '../engine/drawOfficeFloors';
import { drawCoffeeStation, drawDeskStation, drawLoungeAndDecor, drawServerRack, drawWhiteboard } from '../engine/drawOfficeFurniture';
import { drawCharacterModel } from '../engine/drawCharacters';
import { drawOverheadStatusBubble } from '../engine/drawCharacterBubbles';

interface StageProps {
  state: CompanyState;
  onSelectWorker: (id: string | null) => void;
}

/**
 * Interactive Isometric Office Canvas Component.
 * Renders animated workers moving between desks, coffee bar, whiteboard, and servers.
 * Supports pan, click selection, and smooth 2:1 dimetric projection.
 */
export function IsometricOfficeStage(props: StageProps): React.JSX.Element {
  const { state, onSelectWorker } = props;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Viewport camera state (pan & zoom)
  const [camera, setCamera] = useState({ offsetX: 0, offsetY: 0, zoom: 1.0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const layoutTiles: OfficeTile[] = getOfficeLayoutForPhase(state.phase);
  const gridSize = state.phase === 'GARAGEM' ? 6 : state.phase === 'LOFT_STARTUP' ? 8 : state.phase === 'CAMPUS_IA' ? 10 : 12;

  // Size the canvas to its actual viewport (below the HUD), not the full window.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width));
      canvas.height = Math.max(1, Math.round(rect.height));
      setCamera((current) => current.offsetX === 0 && current.offsetY === 0
        ? { offsetX: canvas.width / 2, offsetY: canvas.height / 2.15, zoom: Math.max(0.65, Math.min(1.1, canvas.width / 900)) }
        : current);
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(canvas);
    handleResize();
    return () => observer.disconnect();
  }, []);

  // Main canvas animation and rendering loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let startTime = performance.now();

    const render = (now: number) => {
      const animTime = (now - startTime) * 0.001;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(camera.offsetX, camera.offsetY);
      ctx.scale(camera.zoom, camera.zoom);

      const tileW = 64;
      const tileH = 32;

      // 1. Draw office floor tiles
      layoutTiles.forEach((tile) => {
        const { screenX, screenY } = gridToIsometricScreen(tile.x, tile.y, tileW, tileH, 0, 0);
        drawFloorTile(ctx, screenX, screenY, tileW, tileH, state.phase);
      });

      // 2. Draw perimeter walls
      const halfSize = gridSize - 1;
      for (let i = 0; i <= halfSize; i++) {
        const { screenX, screenY } = gridToIsometricScreen(i, halfSize, tileW, tileH, 0, 0);
        drawPerimeterWalls(ctx, screenX, screenY, tileW, tileH, state.phase);
      }

      // 3. Draw office furniture & interactive props
      layoutTiles.forEach((tile) => {
        const { screenX, screenY } = gridToIsometricScreen(tile.x, tile.y, tileW, tileH, 0, 0);
        if (tile.type === 'DESK') {
          const hasWorker = state.employees.some((e) => Math.round(e.x) === tile.x && Math.round(e.y) === tile.y);
          drawDeskStation(ctx, screenX, screenY, animTime, hasWorker);
        } else if (tile.type === 'SERVER') {
          const loadRatio = Math.min(1.0, state.hardware.totalTeraflops / 10000);
          drawServerRack(ctx, screenX, screenY, animTime, loadRatio);
        } else if (tile.type === 'COFFEE') {
          drawCoffeeStation(ctx, screenX, screenY, animTime);
        } else if (tile.type === 'WHITEBOARD') {
          drawWhiteboard(ctx, screenX, screenY, animTime);
        } else if (tile.type === 'SOFA') {
          drawLoungeAndDecor(ctx, screenX, screenY, 'SOFA', animTime);
        } else if (tile.type === 'PLANT') {
          drawLoungeAndDecor(ctx, screenX, screenY, 'PLANT', animTime);
        }
      });

      // 4. Draw Employees & Characters with proper depth sorting
      const sortedEmployees = [...state.employees].sort((a, b) => (a.x + a.y) - (b.x + b.y));
      sortedEmployees.forEach((emp) => {
        const { screenX, screenY } = gridToIsometricScreen(emp.x, emp.y, tileW, tileH, 0, 0);
        const isSelected = state.selectedWorkerId === emp.id;
        drawCharacterModel(ctx, screenX, screenY, emp, animTime, isSelected);
      });

      // 5. Draw overhead activity bubbles
      sortedEmployees.forEach((emp) => {
        const { screenX, screenY } = gridToIsometricScreen(emp.x, emp.y, tileW, tileH, 0, 0);
        drawOverheadStatusBubble(ctx, screenX, screenY, emp, animTime);
      });

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [camera, state, layoutTiles, gridSize]);

  // Mouse pan and click selection handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - camera.offsetX, y: e.clientY - camera.offsetY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setCamera((prev) => ({
      ...prev,
      offsetX: e.clientX - dragStart.current.x,
      offsetY: e.clientY - dragStart.current.y,
    }));
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.88;
    setCamera((prev) => ({
      ...prev,
      zoom: Math.max(0.6, Math.min(2.5, prev.zoom * zoomFactor)),
    }));
  };

  const handleClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const relX = (clickX - camera.offsetX) / camera.zoom;
    const relY = (clickY - camera.offsetY) / camera.zoom;
    const { gridX, gridY } = isometricScreenToGrid(relX, relY, 64, 32, 0, 0);

    // Check if clicked employee
    const clickedEmp = state.employees.find((emp) => Math.abs(Math.round(emp.x) - gridX) <= 1 && Math.abs(Math.round(emp.y) - gridY) <= 1);
    if (clickedEmp) {
      onSelectWorker(clickedEmp.id);
    } else {
      onSelectWorker(null);
    }
  };

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing bg-slate-950">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleClick}
        className="w-full h-full block crisp-canvas"
      />
    </div>
  );
}
