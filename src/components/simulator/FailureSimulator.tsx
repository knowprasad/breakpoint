'use client';

import React, { useState } from 'react';
import { SIMULATOR_SCENARIOS, SimulatorScenario } from '@/data/simulator';
import { getResourceById } from '@/lib/db';
import { LibraryResource } from '@/types/resource';
import { Terminal, AlertTriangle, ShieldCheck, XCircle, ArrowRight, RotateCcw, BookOpen } from 'lucide-react';

interface FailureSimulatorProps {
  onSelectResource?: (resource: LibraryResource) => void;
}

export function FailureSimulator({ onSelectResource }: FailureSimulatorProps) {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [stats, setStats] = useState({ solved: 0, failed: 0 });

  const currentScenario = SIMULATOR_SCENARIOS[scenarioIndex];
  const chosenOption = currentScenario.options.find((opt) => opt.id === selectedOptionId);
  const linkedResource = chosenOption ? getResourceById(chosenOption.related_resource_id) : null;

  const handleSelectOption = (optId: string) => {
    if (selectedOptionId) return; // already answered
    setSelectedOptionId(optId);

    const opt = currentScenario.options.find((o) => o.id === optId);
    if (opt?.is_correct) {
      setStats((prev) => ({ ...prev, solved: prev.solved + 1 }));
    } else {
      setStats((prev) => ({ ...prev, failed: prev.failed + 1 }));
    }
  };

  const handleNext = () => {
    setSelectedOptionId(null);
    setScenarioIndex((prev) => (prev + 1) % SIMULATOR_SCENARIOS.length);
  };

  const handleReset = () => {
    setSelectedOptionId(null);
    setScenarioIndex(0);
    setStats({ solved: 0, failed: 0 });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Console Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[#0e1117] border border-[#202735] font-mono text-xs">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-red-400" />
          <span className="font-bold text-white uppercase tracking-wider">
            Failure Imagination Simulator
          </span>
          <span className="text-zinc-500">
            (Scenario {scenarioIndex + 1} of {SIMULATOR_SCENARIOS.length})
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">Averted: <strong>{stats.solved}</strong></span>
            <span className="text-zinc-600">/</span>
            <span className="text-red-400">Cascaded: <strong>{stats.failed}</strong></span>
          </div>

          <button
            onClick={handleReset}
            className="text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Scenario Console Card */}
      <div className="rounded-2xl bg-[#0a0c10] border border-[#222836] p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Scenario Header */}
        <div className="space-y-2 border-b border-[#1b212d] pb-5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-mono text-red-400 font-semibold uppercase tracking-wider">
              {currentScenario.company_context}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-red-950/80 text-red-400 border border-red-500/30">
              P0 Crisis
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {currentScenario.title}
          </h2>
        </div>

        {/* Live Terminal Telemetry Box */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block">
            Incoming Production Telemetry
          </span>
          <div className="p-4 rounded-lg bg-[#050608] border border-[#1a1f2b] font-mono text-xs space-y-1.5 text-zinc-300">
            <div className="text-red-400 font-bold flex items-center gap-1.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>{currentScenario.alert_title}</span>
            </div>
            {currentScenario.alert_metrics.map((metric, idx) => (
              <div key={idx} className="text-zinc-400 pl-4 border-l border-zinc-800">
                {metric}
              </div>
            ))}
          </div>
        </div>

        {/* Situation Brief */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block">
            Incident Commander Situation
          </span>
          <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-sans">
            {currentScenario.situation}
          </p>
        </div>

        {/* Action Options */}
        <div className="space-y-3 pt-2">
          <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider block">
            What is your diagnostic decision?
          </span>

          <div className="space-y-2.5">
            {currentScenario.options.map((opt, idx) => {
              const isSelected = selectedOptionId === opt.id;
              const hasAnswered = selectedOptionId !== null;

              let buttonStyle = 'bg-[#10131b] hover:bg-[#151924] border-[#1f2533] text-zinc-200';
              if (hasAnswered) {
                if (opt.is_correct) {
                  buttonStyle = 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 font-semibold';
                } else if (isSelected && !opt.is_correct) {
                  buttonStyle = 'bg-red-950/40 border-red-500/50 text-red-200 font-semibold';
                } else {
                  buttonStyle = 'bg-[#090b0e] border-[#161a22] text-zinc-600 opacity-60';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  disabled={hasAnswered}
                  className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-mono transition-all flex items-start gap-3 ${buttonStyle}`}
                >
                  <span className="font-bold text-zinc-500 shrink-0 mt-0.5">
                    [{String.fromCharCode(65 + idx)}]
                  </span>
                  <span className="flex-1 font-sans text-xs sm:text-sm leading-relaxed">
                    {opt.action}
                  </span>
                  {hasAnswered && opt.is_correct && (
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {hasAnswered && isSelected && !opt.is_correct && (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Diagnostic Outcome & Post-Mortem Feedback */}
        {chosenOption && (
          <div
            className={`p-5 rounded-xl border animate-in fade-in zoom-in-95 duration-150 space-y-3 ${
              chosenOption.is_correct
                ? 'bg-emerald-950/30 border-emerald-500/40'
                : 'bg-red-950/30 border-red-500/40'
            }`}
          >
            <div className="flex items-center gap-2">
              {chosenOption.is_correct ? (
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-400" />
              )}
              <h4 className="text-sm font-bold font-mono uppercase tracking-wider text-white">
                {chosenOption.is_correct ? 'Crisis Successfully Averted' : 'Catastrophic Cascade Triggered'}
              </h4>
            </div>

            <p className="text-sm text-zinc-200 leading-relaxed font-sans">
              {chosenOption.outcome}
            </p>

            <div className="p-3 rounded-lg bg-[#08090d] border border-zinc-800 text-xs font-mono text-zinc-300">
              <span className="text-emerald-400 font-bold block mb-0.5">Architectural Rule:</span>
              {chosenOption.lesson}
            </div>

            {/* Linked Canonical Resource */}
            {linkedResource && (
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800/80 text-xs font-mono">
                <span className="text-zinc-400">Canonical defense literature:</span>
                <button
                  onClick={() => onSelectResource && onSelectResource(linkedResource)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-emerald-300 font-bold transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Study {linkedResource.title}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Next Scenario Button */}
        {selectedOptionId && (
          <div className="pt-4 flex justify-end">
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-red-950 active:scale-[0.98]"
            >
              <span>Next Production Scenario</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
