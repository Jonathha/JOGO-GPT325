import React, { useEffect, useRef } from 'react';

interface CityStageProps {
  companyName: string;
  day: number;
  valuation: number;
}

/** Decorative top-down city map. It is a separate demo view and does not alter simulation data. */
export function CityStage({ companyName, day, valuation }: CityStageProps): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let frame = 0;
    let animation = 0;
    let width = 0;
    let height = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    const roundedRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
    };
    const building = (x: number, y: number, w: number, h: number, color: string, seed: number, hero = false) => {
      ctx.fillStyle = 'rgba(10, 18, 24, .16)';
      roundedRect(x + 5, y + 7, w, h, 7); ctx.fill();
      ctx.fillStyle = '#c7d0ce';
      roundedRect(x - 3, y - 3, w + 6, h + 6, 8); ctx.fill();
      ctx.fillStyle = color;
      roundedRect(x, y, w, h, 6); ctx.fill();
      ctx.fillStyle = hero ? '#b8d4d1' : 'rgba(231, 241, 232, .72)';
      roundedRect(x + 7, y + 7, w - 14, h - 14, 3); ctx.fill();
      const cols = Math.max(2, Math.floor((w - 18) / 13));
      const rows = Math.max(2, Math.floor((h - 18) / 13));
      for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) {
        ctx.fillStyle = ((row * 7 + col * 3 + seed) % 5 === 0) ? '#e4c78b' : '#6b9b9b';
        ctx.fillRect(x + 10 + col * ((w - 20) / cols), y + 10 + row * ((h - 20) / rows), 5, 5);
      }
      if (hero) {
        ctx.fillStyle = '#193b42';
        roundedRect(x + w * .24, y + h * .34, w * .52, h * .32, 5); ctx.fill();
        ctx.fillStyle = '#d8f2e7';
        ctx.font = '600 10px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('AI', x + w / 2, y + h * .54);
        ctx.fillStyle = '#edf6f1';
        ctx.fillRect(x + w * .2, y + h * .82, w * .6, 3);
      }
    };
    const tree = (x: number, y: number, scale = 1) => {
      ctx.fillStyle = 'rgba(18, 34, 26, .18)';
      ctx.beginPath(); ctx.ellipse(x + 3 * scale, y + 5 * scale, 9 * scale, 6 * scale, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#315e4d';
      ctx.beginPath(); ctx.arc(x, y, 8 * scale, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#548568';
      ctx.beginPath(); ctx.arc(x - 2 * scale, y - 3 * scale, 5 * scale, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#7ca27a';
      ctx.beginPath(); ctx.arc(x - 3 * scale, y - 4 * scale, 2 * scale, 0, Math.PI * 2); ctx.fill();
    };
    const park = (x: number, y: number, w: number, h: number, seed: number) => {
      ctx.fillStyle = '#d5dfc7'; roundedRect(x, y, w, h, 12); ctx.fill();
      ctx.fillStyle = '#b7c9a7'; roundedRect(x + 9, y + 9, w - 18, h - 18, 9); ctx.fill();
      ctx.strokeStyle = '#e6e8d4'; ctx.lineWidth = 5; ctx.beginPath();
      ctx.moveTo(x + 12, y + h * .72); ctx.lineTo(x + w * .42, y + h * .42); ctx.lineTo(x + w - 12, y + h * .25); ctx.stroke();
      for (let i = 0; i < 7; i++) tree(x + 18 + ((i * 37 + seed * 13) % Math.max(25, w - 36)), y + 17 + ((i * 23 + seed * 7) % Math.max(25, h - 34)), .8);
    };
    const car = (x: number, y: number, horizontal: boolean, color: string) => {
      ctx.save(); ctx.translate(x, y); if (!horizontal) ctx.rotate(Math.PI / 2);
      ctx.fillStyle = 'rgba(0,0,0,.18)'; roundedRect(-12, -5, 27, 13, 4); ctx.fill();
      ctx.fillStyle = color; roundedRect(-14, -6, 28, 12, 4); ctx.fill();
      ctx.fillStyle = '#b9d5d7'; roundedRect(-5, -4, 10, 8, 2); ctx.fill();
      ctx.fillStyle = '#f1dba1'; ctx.fillRect(11, -4, 2, 2); ctx.fillRect(11, 2, 2, 2);
      ctx.restore();
    };

    const render = () => {
      frame += 1;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#e8e8d9'; ctx.fillRect(0, 0, width, height);
      const unit = Math.max(0.45, Math.min(width / 1000, height / 620));
      const road = 76 * unit;
      const margin = 34 * unit;
      const blockW = Math.max(115 * unit, (width - margin * 2 - road * 2) / 3);
      const blockH = Math.max(115 * unit, (height - margin * 2 - road * 2) / 3);
      const startX = (width - (blockW * 3 + road * 2)) / 2;
      const startY = (height - (blockH * 3 + road * 2)) / 2;
      // Road grid and lane markings.
      ctx.fillStyle = '#c4c9c5'; ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#8c9998';
      for (let i = 0; i < 4; i++) {
        const x = startX - road + i * (blockW + road);
        ctx.fillRect(x, 0, road, height);
        const y = startY - road + i * (blockH + road);
        ctx.fillRect(0, y, width, road);
      }
      ctx.fillStyle = '#aab3b0';
      for (let i = 0; i < 3; i++) {
        const x = startX - road + i * (blockW + road);
        const y = startY - road + i * (blockH + road);
        ctx.fillRect(x + 4 * unit, 0, 2 * unit, height);
        ctx.fillRect(0, y + 4 * unit, width, 2 * unit);
      }
      ctx.strokeStyle = 'rgba(246, 235, 191, .9)'; ctx.lineWidth = 2 * unit; ctx.setLineDash([10 * unit, 11 * unit]);
      for (let i = 0; i < 3; i++) {
        const x = startX - road / 2 + i * (blockW + road);
        const y = startY - road / 2 + i * (blockH + road);
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }
      ctx.setLineDash([]);
      // Nine distinct city blocks with parks, businesses, and the company's headquarters.
      for (let row = 0; row < 3; row++) for (let col = 0; col < 3; col++) {
        const x = startX + col * (blockW + road);
        const y = startY + row * (blockH + road);
        const seed = row * 3 + col;
        if (seed === 1 || seed === 6) { park(x, y, blockW, blockH, seed); continue; }
        ctx.fillStyle = '#d5d9ce'; roundedRect(x, y, blockW, blockH, 10); ctx.fill();
        if (seed === 4) {
          building(x + blockW * .12, y + blockH * .12, blockW * .76, blockH * .76, '#537f7c', seed, true);
        } else {
          building(x + blockW * .08, y + blockH * .1, blockW * .36, blockH * .72, seed % 2 ? '#c7b8a1' : '#a7b8b1', seed);
          building(x + blockW * .53, y + blockH * .16, blockW * .37, blockH * .63, seed % 3 ? '#b4c2bd' : '#d1bfa7', seed + 3);
          tree(x + blockW * .48, y + blockH * .82, .8 * unit);
        }
      }
      // Animated traffic follows the two main avenues.
      const speed = Math.max(20, width * .18);
      const laneY = startY - road / 2 + road * .28;
      for (let i = 0; i < 5; i++) {
        const x = ((frame * .35 * unit + i * speed) % (width + 50)) - 25;
        car(x, laneY, true, ['#f2efe3', '#c5d5d1', '#b6c5b6', '#d6b58c', '#7e9a9a'][i]);
      }
      const laneX = startX - road / 2 + road * .68;
      for (let i = 0; i < 4; i++) {
        const y = ((frame * .22 * unit + i * (height / 4)) % (height + 50)) - 25;
        car(laneX, y, false, ['#e8e8dc', '#c9d4d0', '#c9ad8e', '#92aaa1'][i]);
      }
      // Crosswalks make intersections legible at a glance.
      for (let i = 0; i < 3; i++) {
        const x = startX - road + i * (blockW + road) + road * .18;
        const y = startY - road + road * .18;
        for (let k = 0; k < 5; k++) {
          ctx.fillStyle = 'rgba(244, 242, 224, .72)';
          ctx.fillRect(x + k * 7 * unit, y, 4 * unit, 15 * unit);
        }
      }
      animation = requestAnimationFrame(render);
    };
    animation = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(animation); resizeObserver.disconnect(); };
  }, []);

  const money = valuation >= 1_000_000_000 ? `$${(valuation / 1_000_000_000).toFixed(1)}B` : valuation >= 1_000_000 ? `$${(valuation / 1_000_000).toFixed(1)}M` : `$${Math.round(valuation / 1000)}K`;

  return (
    <section className="absolute inset-x-0 bottom-0 top-[52px] overflow-hidden bg-[#e8e8d9]">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-label="Mapa demonstrativo da cidade em visão superior" />
      <div className="pointer-events-none absolute left-5 top-5 flex max-w-[calc(100%-2.5rem)] flex-col gap-1 rounded-xl border border-white/70 bg-[#f7f7ef]/95 px-4 py-3 shadow-lg shadow-slate-900/10">
        <span className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#55736c]">Distrito de inovação · mapa demonstrativo</span>
        <strong className="truncate text-sm text-[#233d3a]">{companyName || 'AI Titan Tycoon'}</strong>
        <span className="text-xs text-[#62716a]">Dia {day} <span className="px-1">·</span> Valuation {money}</span>
      </div>
      <div className="pointer-events-none absolute bottom-5 right-5 rounded-lg border border-white/70 bg-[#f7f7ef]/90 px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-[#55736c]">
        Cidade demonstrativa · sem impacto na simulação
      </div>
    </section>
  );
}
