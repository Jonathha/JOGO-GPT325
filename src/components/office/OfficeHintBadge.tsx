import React from 'react';

/** Bottom-left hint explaining how to pan and zoom (hidden on small screens). */
export function OfficeHintBadge(): React.JSX.Element {
  return (
    <div className="pointer-events-none absolute bottom-4 left-4 hidden items-center gap-2 rounded-xl border border-white/10 bg-[#101815]/85 px-3 py-2 text-[11px] text-[#d0ddd4] shadow-xl backdrop-blur-md sm:flex">
      <span className="h-1.5 w-1.5 rounded-full bg-[#a8d4b1]" />
      Arraste para mover <span className="text-white/30">·</span> Scroll para aproximar
    </div>
  );
}
