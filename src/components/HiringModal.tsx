import React from 'react';
import { Employee, InvestorRound } from '../types/gameTypes';
import { playUiClick } from '../engine/audioSynthesizer';

interface Props {
  employees: Employee[];
  soundEnabled: boolean;
  onFireEmployee: (id: string) => void;
  onClose: () => void;
}

/**
 * Renders an employee row within the Team & Hiring modal.
 * Shows role, skill level, daily salary, and dismissal action.
 */
export function EmployeeRosterRow(props: {
  emp: Employee;
  soundEnabled: boolean;
  onFire: (id: string) => void;
}): React.JSX.Element {
  const { emp, soundEnabled, onFire } = props;
  const moraleColor = emp.morale > 75 ? 'text-emerald-400' : emp.morale > 40 ? 'text-amber-400' : 'text-red-400';

  return (
    <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 flex items-center justify-between text-xs">
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-slate-950 text-xs shadow-inner"
          style={{ backgroundColor: emp.avatarColor || '#38bdf8' }}
        >
          {emp.name.charAt(0)}
        </div>
        <div>
          <div className="font-semibold text-white">{emp.name}</div>
          <div className="text-[11px] text-slate-400 font-mono">
            {emp.roleName} &bull; Skill: <span className="text-sky-300">{emp.skill}</span> &bull; Morale:{' '}
            <span className={moraleColor}>{emp.morale}%</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right font-mono">
          <div className="text-slate-300">${emp.salaryPerDay}/dia</div>
          <div className="text-[10px] text-slate-500">Salário diário</div>
        </div>
        <button
          type="button"
          onClick={() => {
            playUiClick(soundEnabled);
            onFire(emp.id);
          }}
          className="px-2.5 py-1 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/60 rounded text-[11px] cursor-pointer"
        >
          Demitir
        </button>
      </div>
    </div>
  );
}

/**
 * Main Hiring & Roster Modal window.
 * Displays current employees and enables hiring new top-tier talent.
 */
export function HiringModal(props: {
  employees: Employee[];
  candidates: Employee[];
  funds: number;
  soundEnabled: boolean;
  onHireCandidate: (candidate: Employee) => void;
  onFireEmployee: (id: string) => void;
  onClose: () => void;
}): React.JSX.Element {
  const { employees, candidates, funds, soundEnabled, onHireCandidate, onFireEmployee, onClose } = props;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-5 shadow-2xl text-slate-200 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Gestão de Talentos & Contratações</h2>
            <p className="text-xs text-slate-400">Contrate gênios de IA para acelerar o desenvolvimento de modelos.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-mono px-2 py-0.5 rounded hover:bg-slate-800 cursor-pointer"
          >
            &times;
          </button>
        </div>

        <div className="overflow-y-auto space-y-4 pr-1 flex-1">
          {/* Current Roster */}
          <div>
            <div className="text-xs font-semibold text-slate-300 mb-2">Equipe Atual ({employees.length})</div>
            <div className="space-y-2">
              {employees.map((emp) => (
                <EmployeeRosterRow key={emp.id} emp={emp} soundEnabled={soundEnabled} onFire={onFireEmployee} />
              ))}
            </div>
          </div>

          {/* Candidate Market */}
          <div className="pt-2 border-t border-slate-800">
            <div className="text-xs font-semibold text-slate-300 mb-2">Candidatos Disponíveis no Mercado</div>
            <div className="space-y-2">
              {candidates.map((cand) => {
                const canAfford = funds >= 25000;
                return (
                  <div key={cand.id} className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-slate-950 text-xs" style={{ backgroundColor: cand.avatarColor }}>
                        {cand.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{cand.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {cand.roleName} &bull; Skill: <span className="text-sky-300">{cand.skill}</span> &bull; ${cand.salaryPerDay}/dia
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        playUiClick(soundEnabled);
                        onHireCandidate(cand);
                      }}
                      disabled={!canAfford}
                      className="px-3 py-1 bg-sky-500 hover:bg-sky-400 disabled:opacity-30 disabled:pointer-events-none text-slate-950 rounded font-semibold text-xs cursor-pointer"
                    >
                      Contratar ($25k bônus)
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
