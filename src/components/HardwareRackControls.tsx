import React from 'react';
import { HardwareSetup } from '../types/gameTypes';
import { playUiClick } from '../engine/audioSynthesizer';

interface RowProps {
  hardware: HardwareSetup;
  funds: number;
  soundEnabled: boolean;
  onUpdateHardware: (updated: HardwareSetup, cost: number) => void;
}

export function CloudGpuControlRow(props: RowProps): React.JSX.Element {
  const { hardware, soundEnabled, onUpdateHardware } = props;
  const handleAdjustCloud = (delta: number) => {
    playUiClick(soundEnabled);
    const newCount = Math.max(0, hardware.cloudGPUs + delta);
    const newFlops = newCount * 200 + hardware.onPremRacks * 1800;
    onUpdateHardware({ ...hardware, cloudGPUs: newCount, totalTeraflops: newFlops }, 0);
  };
  return (
    <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 flex items-center justify-between">
      <div>
        <div className="font-semibold text-white text-xs">GPUs H100 na Nuvem</div>
        <div className="text-[11px] text-slate-400">Aluguel flexível ($18/dia por GPU · 200 TFLOPs cada)</div>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => handleAdjustCloud(-8)} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-mono">-8</button>
        <span className="font-mono text-xs font-bold text-sky-400 min-w-8 text-center">{hardware.cloudGPUs}</span>
        <button type="button" onClick={() => handleAdjustCloud(8)} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-mono">+8</button>
      </div>
    </div>
  );
}

export function PhysicalRackControlRow(props: RowProps): React.JSX.Element {
  const { hardware, funds, soundEnabled, onUpdateHardware } = props;
  const rackCost = 150000;
  const canAfford = funds >= rackCost;
  const handleBuyOnPremRack = () => {
    if (!canAfford) return;
    playUiClick(soundEnabled);
    const newRacks = hardware.onPremRacks + 1;
    const newFlops = hardware.cloudGPUs * 200 + newRacks * 1800;
    onUpdateHardware({ ...hardware, onPremRacks: newRacks, totalTeraflops: newFlops, dailyPowerCost: hardware.dailyPowerCost + 85 }, rackCost);
  };
  return (
    <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 flex items-center justify-between">
      <div>
        <div className="font-semibold text-white text-xs">Racks Físicos B200 NVL72</div>
        <div className="text-[11px] text-slate-400">Supercluster local ($150k compra · 1.800 TFLOPs cada)</div>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs font-bold text-amber-400">{hardware.onPremRacks} racks</span>
        <button type="button" onClick={handleBuyOnPremRack} disabled={!canAfford} className="px-3 py-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:pointer-events-none text-slate-950 rounded font-semibold text-xs cursor-pointer">Comprar Rack ($150k)</button>
      </div>
    </div>
  );
}

export function ClusterDiagnosisBox(props: { isCloudHeavy: boolean }): React.JSX.Element {
  const { isCloudHeavy } = props;
  const infraStatusTip = isCloudHeavy ? 'Recomendação: Racks físicos B200 reduzem custos a longo prazo.' : 'Infraestrutura balanceada com alto rendimento de inferência.';
  return (
    <div className="bg-slate-950/40 border border-dashed border-slate-800 rounded p-2 text-[11px] text-slate-400 flex items-center justify-between font-mono">
      <span>Diagnóstico de Cluster:</span>
      <span className="text-sky-300">{infraStatusTip}</span>
    </div>
  );
}

export function HardwareRackControls(props: RowProps): React.JSX.Element {
  const { hardware, funds, soundEnabled, onUpdateHardware } = props;
  const isCloudHeavy = hardware.cloudGPUs > hardware.onPremRacks * 8;
  return (
    <div className="space-y-3">
      <CloudGpuControlRow hardware={hardware} funds={funds} soundEnabled={soundEnabled} onUpdateHardware={onUpdateHardware} />
      <PhysicalRackControlRow hardware={hardware} funds={funds} soundEnabled={soundEnabled} onUpdateHardware={onUpdateHardware} />
      <ClusterDiagnosisBox isCloudHeavy={isCloudHeavy} />
    </div>
  );
}
