import React, { useEffect, useRef, useState } from 'react';
import { OfficeCameraState } from '../../engine/office/renderOfficeFrame';

/** Pan/zoom camera for the office canvas, plus canvas auto-sizing to its on-screen box. */
export function useOfficeCamera(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const [camera, setCamera] = useState<OfficeCameraState>({ offsetX: 0, offsetY: 0, zoom: 1.0 });
  const cameraRef = useRef(camera);
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
  }, [canvasRef]);

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

  return { camera, cameraRef, isDragging, movedRef, handlePointerDown, handlePointerMove, handlePointerUp, handleWheel, zoomAtCenter, resetCamera };
}
