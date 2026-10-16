import React, { useEffect, useRef } from 'react';
import { CompanyState } from '../types/gameTypes';
import { isometricScreenToGrid } from '../engine/isometricMath';
import { createOfficeRenderCache } from '../engine/office/officeRenderCache';
import { renderOfficeFrame } from '../engine/office/renderOfficeFrame';
import { OfficeHintBadge } from './office/OfficeHintBadge';
import { OfficeZoomControls } from './office/OfficeZoomControls';
import { useOfficeCamera } from './office/useOfficeCamera';

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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const latestProps = useRef(props);
  const renderCache = useRef(createOfficeRenderCache());
  latestProps.current = props;

  const {
    camera, cameraRef, isDragging, movedRef,
    handlePointerDown, handlePointerMove, handlePointerUp, handleWheel, zoomAtCenter, resetCamera,
  } = useOfficeCamera(canvasRef);

  // Main canvas animation and rendering loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const startTime = performance.now();
    let lastFrame = 0;
    const render = (now: number) => {
      // Behind the setup modal nothing needs 60 fps, so idle at ~20 fps until the game starts.
      if (!latestProps.current.state.hasStarted && now - lastFrame < 50) { animId = requestAnimationFrame(render); return; }
      lastFrame = now;
      renderOfficeFrame(ctx, canvas.clientWidth, canvas.clientHeight, latestProps.current.state, cameraRef.current, renderCache.current, (now - startTime) * 0.001);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [cameraRef]);

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

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: 'radial-gradient(circle at 68% 12%, rgba(174,210,181,.09), rgba(174,210,181,0) 70%), linear-gradient(135deg, #1b2923 0%, #121d18 55%, #0c1411 100%)' }}
    >
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
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,.45) 100%)' }} />
      <OfficeHintBadge />
      <OfficeZoomControls zoom={camera.zoom} onZoomOut={() => zoomAtCenter(1 / 1.2)} onZoomIn={() => zoomAtCenter(1.2)} onReset={resetCamera} />
    </div>
  );
}
