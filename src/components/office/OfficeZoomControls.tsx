import React from 'react';

interface OfficeZoomControlsProps {
  zoom: number;
  onZoomOut: () => void;
  onZoomIn: () => void;
  onReset: () => void;
}

/** Bottom-right zoom buttons (− / percentage / +). */
export function OfficeZoomControls({ zoom, onZoomOut, onZoomIn, onReset }: OfficeZoomControlsProps): React.JSX.Element {
  return (
    <div className="absolute bottom-4 right-4 flex items-center gap-1 rounded-xl border border-white/10 bg-[#101815]/90 p-1.5 text-[#d0ddd4] shadow-xl backdrop-blur-md">
      <button type="button" aria-label="Diminuir zoom" title="Diminuir zoom" onClick={onZoomOut} className="h-8 w-8 rounded-lg text-lg transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#b7d7bf]">−</button>
      <button type="button" aria-label="Restaurar enquadramento" title="Restaurar enquadramento" onClick={onReset} className="min-w-14 rounded-lg px-2 py-2 text-[11px] font-medium tabular-nums transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#b7d7bf]">{Math.round(zoom * 100)}%</button>
      <button type="button" aria-label="Aumentar zoom" title="Aumentar zoom" onClick={onZoomIn} className="h-8 w-8 rounded-lg text-lg transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#b7d7bf]">+</button>
    </div>
  );
}
