import React, { useEffect, useRef, useState } from 'react';
import { CompanyState, OfficeTile } from '../types/gameTypes';
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
  const { onSelectWorker } = props;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Viewport camera state (pan & zoom)
  const [camera, setCamera] = useState({ offsetX: 0, offsetY: 0, zoom: 1.0 });
  const latestProps = useRef(props);
  const cameraRef = useRef(camera);
  const layoutRef = useRef<{ phase: CompanyState['phase']; tiles: OfficeTile[] } | null>(null);
  latestProps.current = props;
  cameraRef.current = camera;
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, pointerX: 0, pointerY: 0 });
  const movedRef = useRef(false);

  // Size the canvas to its actual viewport (below the HUD), not the full window.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * ratio));
      canvas.height = Math.max(1, Math.round(rect.height * ratio));
      const context = canvas.getContext('2d');
      context?.setTransform(ratio, 0, 0, ratio, 0, 0);
      setCamera((current) => current.offsetX === 0 && current.offsetY === 0
        ? { offsetX: rect.width / 2, offsetY: rect.height / 2.15, zoom: Math.max(0.65, Math.min(1.1, rect.width / 900)) }
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
      const currentState = latestProps.current.state;
      const currentCamera = cameraRef.current;
      if (!layoutRef.current || layoutRef.current.phase !== currentState.phase) {
        layoutRef.current = { phase: currentState.phase, tiles: getOfficeLayoutForPhase(currentState.phase) };
      }
      const currentTiles = layoutRef.current.tiles;
      const currentGridSize = currentState.phase === 'GARAGEM' ? 6 : currentState.phase === 'LOFT_STARTUP' ? 8 : currentState.phase === 'CAMPUS_IA' ? 10 : 12;
      const viewWidth = canvas.clientWidth;
      const viewHeight = canvas.clientHeight;
      ctx.clearRect(0, 0, viewWidth, viewHeight);
      const ambient = ctx.createLinearGradient(0, 0, viewWidth, viewHeight);
      ambient.addColorStop(0, '#1b2923');
      ambient.addColorStop(0.55, '#121d18');
      ambient.addColorStop(1, '#0c1411');
      ctx.fillStyle = ambient;
      ctx.fillRect(0, 0, viewWidth, viewHeight);
      const windowGlow = ctx.createRadialGradient(viewWidth * 0.68, viewHeight * 0.12, 4, viewWidth * 0.68, viewHeight * 0.12, Math.max(viewWidth, viewHeight) * 0.7);
      windowGlow.addColorStop(0, 'rgba(174, 210, 181, 0.09)');
      windowGlow.addColorStop(1, 'rgba(174, 210, 181, 0)');
      ctx.fillStyle = windowGlow;
      ctx.fillRect(0, 0, viewWidth, viewHeight);

      ctx.save();
      ctx.translate(currentCamera.offsetX, currentCamera.offsetY);
      ctx.scale(currentCamera.zoom, currentCamera.zoom);

      const tileW = 64;
      const tileH = 32;

      // 1. Draw office floor tiles
      currentTiles.forEach((tile) => {
        const { screenX, screenY } = gridToIsometricScreen(tile.x, tile.y, tileW, tileH, 0, 0);
        drawFloorTile(ctx, screenX, screenY, tileW, tileH, currentState.phase);
      });

      // 2. Draw perimeter walls
      const halfSize = currentGridSize - 1;
      for (let i = 0; i <= halfSize; i++) {
        const { screenX, screenY } = gridToIsometricScreen(i, halfSize, tileW, tileH, 0, 0);
        drawPerimeterWalls(ctx, screenX, screenY, tileW, tileH, currentState.phase);
      }

      // 3. Draw office furniture & interactive props
      currentTiles.forEach((tile) => {
        const { screenX, screenY } = gridToIsometricScreen(tile.x, tile.y, tileW, tileH, 0, 0);
        if (tile.type === 'DESK') {
          const hasWorker = currentState.employees.some((e) => Math.round(e.x) === tile.x && Math.round(e.y) === tile.y);
          drawDeskStation(ctx, screenX, screenY, animTime, hasWorker);
        } else if (tile.type === 'SERVER') {
          const loadRatio = Math.min(1.0, currentState.hardware.totalTeraflops / 10000);
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
      const sortedEmployees = [...currentState.employees].sort((a, b) => (a.x + a.y) - (b.x + b.y));
      sortedEmployees.forEach((emp) => {
        const { screenX, screenY } = gridToIsometricScreen(emp.x, emp.y, tileW, tileH, 0, 0);
        const isSelected = currentState.selectedWorkerId === emp.id;
        drawCharacterModel(ctx, screenX, screenY + (emp.state === 'TYPING' ? -2 : 0), emp, animTime, isSelected);
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
  }, []);

  // Pan only the world canvas. Pointer capture keeps dragging reliable at viewport edges.
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.button !== 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setIsDragging(true);
    movedRef.current = false;
    dragStart.current = {
      x: cameraRef.current.offsetX,
      y: cameraRef.current.offsetY,
      pointerX: e.clientX - rect.left,
      pointerY: e.clientY - rect.top,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - rect.left - dragStart.current.pointerX;
    const dy = e.clientY - rect.top - dragStart.current.pointerY;
    if (Math.abs(dx) + Math.abs(dy) > 3) movedRef.current = true;
    setCamera((prev) => ({
      ...prev,
      offsetX: dragStart.current.x + dx,
      offsetY: dragStart.current.y + dy,
    }));
  };

  const handlePointerUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const pointerX = e.clientX - rect.left;
    const pointerY = e.clientY - rect.top;
    setCamera((prev) => {
      const zoom = Math.max(0.55, Math.min(2.8, prev.zoom * (e.deltaY < 0 ? 1.12 : 1 / 1.12)));
      const worldX = (pointerX - prev.offsetX) / prev.zoom;
      const worldY = (pointerY - prev.offsetY) / prev.zoom;
      return { zoom, offsetX: pointerX - worldX * zoom, offsetY: pointerY - worldY * zoom };
    });
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (movedRef.current) { movedRef.current = false; return; }
    const rect = e.currentTarget.getBoundingClientRect();
    const currentCamera = cameraRef.current;
    const relX = (e.clientX - rect.left - currentCamera.offsetX) / currentCamera.zoom;
    const relY = (e.clientY - rect.top - currentCamera.offsetY) / currentCamera.zoom;
    const { gridX, gridY } = isometricScreenToGrid(relX, relY, 64, 32, 0, 0);
    const clickedEmp = latestProps.current.state.employees.find((emp) => Math.abs(Math.round(emp.x) - gridX) <= 1 && Math.abs(Math.round(emp.y) - gridY) <= 1);
    latestProps.current.onSelectWorker(clickedEmp?.id ?? null);
  };

  const zoomAtCenter = (factor: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const centerX = canvas.clientWidth / 2;
    const centerY = canvas.clientHeight / 2;
    setCamera((prev) => {
      const zoom = Math.max(0.55, Math.min(2.8, prev.zoom * factor));
      const worldX = (centerX - prev.offsetX) / prev.zoom;
      const worldY = (centerY - prev.offsetY) / prev.zoom;
      return { zoom, offsetX: centerX - worldX * zoom, offsetY: centerY - worldY * zoom };
    });
  };

  const resetCamera = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setCamera({
      offsetX: canvas.clientWidth / 2,
      offsetY: canvas.clientHeight / 2.15,
      zoom: Math.max(0.65, Math.min(1.1, canvas.clientWidth / 900)),
    });
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#141c1a]">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onLostPointerCapture={handlePointerUp}
        onWheel={handleWheel}
        onClick={handleClick}
        style={{ touchAction: 'none', cursor: isDragging ? 'grabbing' : 'grab' }}
        className="absolute inset-0 block h-full w-full crisp-canvas"
      />
      <div className="pointer-events-none absolute bottom-4 left-4 hidden items-center gap-2 rounded-xl border border-white/10 bg-[#101815]/85 px-3 py-2 text-[11px] text-[#d0ddd4] shadow-xl backdrop-blur-md sm:flex">
        <span className="h-1.5 w-1.5 rounded-full bg-[#a8d4b1]" />
        Arraste para mover <span className="text-white/30">·</span> Scroll para aproximar
      </div>
      <div className="absolute bottom-4 right-4 flex items-center gap-1 rounded-xl border border-white/10 bg-[#101815]/90 p-1.5 text-[#d0ddd4] shadow-xl backdrop-blur-md">
        <button type="button" aria-label="Diminuir zoom" title="Diminuir zoom" onClick={() => zoomAtCenter(1 / 1.2)} className="h-8 w-8 rounded-lg text-lg transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#b7d7bf]">−</button>
        <button type="button" aria-label="Restaurar enquadramento" title="Restaurar enquadramento" onClick={resetCamera} className="min-w-14 rounded-lg px-2 py-2 text-[11px] font-medium tabular-nums transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#b7d7bf]">{Math.round(camera.zoom * 100)}%</button>
        <button type="button" aria-label="Aumentar zoom" title="Aumentar zoom" onClick={() => zoomAtCenter(1.2)} className="h-8 w-8 rounded-lg text-lg transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#b7d7bf]">+</button>
      </div>
    </div>
  );
}
