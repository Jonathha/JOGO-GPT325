import React, { useEffect, useState } from 'react';
import { CompanyState, ModelProject, Employee, HardwareSetup, GamePhase } from './types/gameTypes';
import { createDefaultCompanyState } from './data/initialCompanyState';
import { buildStarterTeam, generateRecruitCandidate } from './data/starterEmployees';
import { updateDayProgression, updateModelTrainingStep } from './engine/simulationTick';
import { updateEmployeeBehaviors } from './engine/simulationWorkers';
import { generateDynamicHeadline, applyHeadlineImpact } from './engine/eventHeadlines';
import { playBreakingNewsAlert, playTrainingCompleteChime } from './engine/audioSynthesizer';
import { TopBarHUD } from './components/TopBarHUD';
import { CompanySetupModal } from './components/CompanySetupModal';
import { IsometricOfficeStage } from './components/IsometricOfficeStage';
import { CityStage } from './components/CityStage';
import { TrainingModal } from './components/TrainingModal';
import { HiringModal } from './components/HiringModal';
import { HardwareModal } from './components/HardwareModal';
import { OfficeModal } from './components/OfficeModal';
import { NewsModal } from './components/NewsModal';
import { ManagementDashboardModal } from './components/ManagementDashboardModal';

/**
 * Main application entry point for AI Titan Tycoon.
 * Manages game state loop, time progression, modals, and isometric rendering.
 */
export default function App(): React.JSX.Element {
  const [state, setState] = useState<CompanyState>(createDefaultCompanyState);
  const [candidates, setCandidates] = useState<Employee[]>([]);
  const [activeView, setActiveView] = useState<'office' | 'city'>('office');

  // Initialize candidates market on startup
  useEffect(() => {
    const initialCands = [
      generateRecruitCandidate(1, 101),
      generateRecruitCandidate(1, 102),
      generateRecruitCandidate(1, 103),
    ];
    setCandidates(initialCands);
  }, []);

  // Main simulation ticker (60 FPS requestAnimationFrame loop)
  useEffect(() => {
    let lastTime = performance.now();
    let animId: number;

    const gameLoop = (now: number) => {
      const deltaSeconds = (now - lastTime) * 0.001;
      lastTime = now;

      if (state.hasStarted && state.gameSpeed > 0 && deltaSeconds < 0.2) {
        setState((prevState) => {
          // 1. Advance day progress
          let nextState = updateDayProgression(prevState, deltaSeconds);

          // 2. Advance model training
          nextState = updateModelTrainingStep(nextState, deltaSeconds);

          // 3. Update employee walking and behaviors
          const updatedEmployees = updateEmployeeBehaviors(nextState.employees, nextState.gridSize, deltaSeconds);
          nextState = {
            ...nextState,
            employees: updatedEmployees,
          };

          // 4. Random breaking news event trigger (approx every 45 simulated seconds)
          if (Math.random() < 0.0008 * nextState.gameSpeed) {
            const headline = generateDynamicHeadline(nextState.day, nextState.phase, Math.floor(now));
            playBreakingNewsAlert(nextState.soundEnabled);
            nextState = applyHeadlineImpact(nextState, headline);
          }

          return nextState;
        });
      }

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [state.hasStarted, state.gameSpeed]);

  // Game action handlers
  const handleStartCompany = (companyName: string, founderName: string, archetype: 'RESEARCH_LAB' | 'AUTONOMOUS_AGENTS' | 'MULTIMODAL_FRONTIER' | 'SILICON_CHIPS') => {
    const starterTeam = buildStarterTeam(founderName, archetype);
    setState((prev) => ({
      ...prev,
      hasStarted: true,
      companyName,
      founderName,
      founderArchetype: archetype,
      employees: starterTeam,
      gridSize: 6,
    }));
  };

  const handleSetGameSpeed = (speed: number) => {
    setState((prev) => ({ ...prev, gameSpeed: speed }));
  };

  const handleToggleSound = () => {
    setState((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const handleOpenModal = (modal: CompanyState['activeModal']) => {
    setState((prev) => ({ ...prev, activeModal: modal }));
  };

  const handleCloseModal = () => {
    setState((prev) => ({ ...prev, activeModal: 'NONE' }));
  };

  const handleCreateModel = (model: ModelProject) => {
    setState((prev) => ({
      ...prev,
      models: [model, ...prev.models],
      activeModal: 'NONE',
    }));
  };

  const handleLaunchModel = (id: string, mode: 'FREE' | 'PAID') => {
    setState((prev) => ({
      ...prev,
      models: prev.models.map((model) => model.id === id && model.isCompleted && !model.isReleased
        ? { ...model, isReleased: true, pricingMode: mode, dailyApiRevenue: 0, dailyInferenceCost: 0 }
        : model),
    }));
  };

  const handleHireCandidate = (candidate: Employee) => {
    if (state.funds < 25000) return;
    setState((prev) => ({
      ...prev,
      funds: prev.funds - 25000,
      employees: [...prev.employees, { ...candidate, deskIndex: prev.employees.length, x: 2, y: 2 }],
    }));
    setCandidates((prev) => prev.filter((c) => c.id !== candidate.id));
  };

  const handleFireEmployee = (id: string) => {
    setState((prev) => ({
      ...prev,
      employees: prev.employees.filter((e) => e.id !== id),
    }));
  };

  const handleUpdateHardware = (updatedHardware: HardwareSetup, cost: number) => {
    setState((prev) => ({
      ...prev,
      funds: prev.funds - cost,
      hardware: updatedHardware,
    }));
  };

  const handleUpgradePhase = (nextPhase: GamePhase, cost: number) => {
    const newGridSize = nextPhase === 'GARAGEM' ? 6 : nextPhase === 'LOFT_STARTUP' ? 8 : nextPhase === 'CAMPUS_IA' ? 10 : 12;
    setState((prev) => ({
      ...prev,
      phase: nextPhase,
      funds: prev.funds - cost,
      gridSize: newGridSize,
      activeModal: 'NONE',
    }));
  };

  const handleMarkHeadlineRead = (id: string) => {
    setState((prev) => ({
      ...prev,
      headlines: prev.headlines.map((h) => (h.id === id ? { ...h, read: true } : h)),
    }));
  };

  return (
    <div className="relative h-full w-full select-none overflow-hidden bg-[#101817] font-sans">
      {/* Initial Company Setup Modal */}
      {!state.hasStarted && (
        <CompanySetupModal onStartCompany={handleStartCompany} soundEnabled={state.soundEnabled} />
      )}

      {/* Top Utility HUD */}
      <TopBarHUD
        state={state}
        onSetGameSpeed={handleSetGameSpeed}
        onToggleSound={handleToggleSound}
        onOpenModal={handleOpenModal}
        activeView={activeView}
        onChangeView={setActiveView}
      />

      {/* Separate world views: the city is a demonstration map, never part of the office. */}
      {activeView === 'office' ? (
        <div className="absolute inset-x-0 bottom-0 top-[52px] overflow-hidden">
          <IsometricOfficeStage state={state} onSelectWorker={(id) => setState((prev) => ({ ...prev, selectedWorkerId: id }))} />
        </div>
      ) : (
        <CityStage companyName={state.companyName} day={state.day} valuation={state.valuation} />
      )}

      {/* Modals */}
      {state.activeModal === 'TRAINING' && (
        <TrainingModal
          models={state.models}
          currentDay={state.day}
          onClose={handleCloseModal}
          onCreateModel={handleCreateModel}
          onLaunchModel={handleLaunchModel}
        />
      )}

      {state.activeModal === 'HIRING' && (
        <HiringModal
          employees={state.employees}
          candidates={candidates}
          funds={state.funds}
          soundEnabled={state.soundEnabled}
          onHireCandidate={handleHireCandidate}
          onFireEmployee={handleFireEmployee}
          onClose={handleCloseModal}
        />
      )}

      {state.activeModal === 'HARDWARE' && (
        <HardwareModal
          hardware={state.hardware}
          funds={state.funds}
          soundEnabled={state.soundEnabled}
          onClose={handleCloseModal}
          onUpdateHardware={handleUpdateHardware}
        />
      )}

      {state.activeModal === 'OFFICE' && (
        <OfficeModal
          phase={state.phase}
          funds={state.funds}
          valuation={state.valuation}
          soundEnabled={state.soundEnabled}
          onClose={handleCloseModal}
          onUpgradePhase={handleUpgradePhase}
        />
      )}

      {state.activeModal === 'DASHBOARD' && <ManagementDashboardModal state={state} onClose={handleCloseModal} />}

      {state.activeModal === 'NEWS' && (
        <NewsModal
          headlines={state.headlines}
          soundEnabled={state.soundEnabled}
          onClose={handleCloseModal}
          onMarkRead={handleMarkHeadlineRead}
        />
      )}
    </div>
  );
}
