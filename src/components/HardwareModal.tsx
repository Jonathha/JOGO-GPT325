import React from 'react';
import { HardwareSetup } from '../types/gameTypes';
import { HardwareRackControls } from './HardwareRackControls';

interface HardwareModalProps {
  hardware: HardwareSetup;
  funds: number;
  soundEnabled: boolean;
  onClose: () => void;
  onUpdateHardware: (updated: HardwareSetup, cost: number) => void;
}

/**
 * Main Hardware & GPU Cluster dialog window.
 * Shows data center capacity, power grid consumption, and compute scaling controls.
 */
export function HardwareModal(props: HardwareModalProps): React.JSX.Element {
  const { hardware, funds, soundEnabled, onClose, onUpdateHardware } = props;
  const cloudRentalDaily = hardware.cloudGPUs * 18;
  const totalDailyCost = cloudRentalDaily + hardware.dailyPowerCost;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full p-5 shadow-2xl text-slate-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Data Center & Cluster de GPUs</h2>
            <p className="text-xs text-slate-400">Gerenciamento de infraestrutura computacional e refrigeração.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-mono px-2 py-0.5 rounded hover:bg-slate-800 cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Telemetry Overview */}
        <div className="grid grid-cols-3 gap-2 bg-slate-950/70 border border-slate-800 rounded-lg p-3 text-xs font-mono mb-4">
          <div>
            <span className="text-slate-500 block text-[10px]">POTÊNCIA TOTAL</span>
            <span className="text-sky-400 font-bold text-sm">{hardware.totalTeraflops.toLocaleString()} TFLOPs</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">CUSTO CLOUD/DIA</span>
            <span className="text-amber-400 font-bold text-sm">${cloudRentalDaily.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">ENERGIA & COOLING</span>
            <span className="text-red-400 font-bold text-sm">${totalDailyCost.toLocaleString()}/dia</span>
          </div>
        </div>

        {/* Compute scaling controls */}
        <HardwareRackControls
          hardware={hardware}
          funds={funds}
          soundEnabled={soundEnabled}
          onUpdateHardware={onUpdateHardware}
        />
      </div>
    </div>
  );
}
