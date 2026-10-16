import React from 'react';
import { CompanyState } from '../types/gameTypes';

interface TopBarMetricsProps {
  state: CompanyState;
}

/**
 * Formats large monetary values into human readable currency strings
 * with abbreviation suffixes (K, M, B) and explicit numeric boundaries.
 * Structured with parameter guards and deterministic precision.
 */
export function formatMetricCurrency(val: number): string {
  // Guard input finiteness and normalize negative values
  const safeInput = Number.isFinite(val) ? val : 0;
  const numericVal = Math.max(0, safeInput);

  // Billions magnitude format ($1.25B)
  const oneBillion = 1000000000;
  if (numericVal >= oneBillion) {
    const formattedB = (numericVal / oneBillion).toFixed(2);
    const resultB = `$${formattedB}B`;
    return resultB;
  }

  // Millions magnitude format ($4.50M)
  const oneMillion = 1000000;
  if (numericVal >= oneMillion) {
    const formattedM = (numericVal / oneMillion).toFixed(2);
    const resultM = `$${formattedM}M`;
    return resultM;
  }

  // Thousands magnitude format ($120.5k)
  const oneThousand = 1000;
  if (numericVal >= oneThousand) {
    const formattedK = (numericVal / oneThousand).toFixed(1);
    const resultK = `$${formattedK}k`;
    return resultK;
  }

  // Units below 1k
  const roundedBase = Math.round(numericVal);
  const formattedLocale = roundedBase.toLocaleString();
  const directResult = `$${formattedLocale}`;

  return directResult;
}

/**
 * Renders the central HUD telemetry metrics strip
 * (Cash funds, company valuation, GPU cluster compute, and day progress).
 */
export function TopBarMetricsStrip(props: TopBarMetricsProps): React.JSX.Element {
  const { state } = props;
  const fundsString = formatMetricCurrency(state.funds);
  const valString = formatMetricCurrency(state.valuation);
  const totalFlops = state.hardware.totalTeraflops;
  const progressPercent = Math.round(state.dayProgress * 100);

  return (
    <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
      <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800">
        <span className="text-slate-500 text-[10px]">CAIXA:</span>
        <span className="text-emerald-400 font-semibold tabular-nums">{fundsString}</span>
      </div>

      <div className="hidden sm:flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800">
        <span className="text-slate-500 text-[10px]">VALUATION:</span>
        <span className="text-sky-400 font-semibold tabular-nums">{valString}</span>
      </div>

      <div className="hidden md:flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800">
        <span className="text-slate-500 text-[10px]">COMPUTAÇÃO:</span>
        <span className="text-amber-400 font-semibold tabular-nums">{totalFlops.toLocaleString()} TFLOPS</span>
      </div>

      <div className="flex items-center gap-2 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800">
        <span className="text-slate-500 text-[10px]">DIA {state.day}:</span>
        <div className="w-14 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-sky-500 transition-all duration-200"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="text-[10px] text-slate-400 tabular-nums">{progressPercent}%</span>
      </div>
    </div>
  );
}
