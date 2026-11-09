'use client';

import React, { useState } from 'react';
import { SIMULATOR_SCENARIOS, SimulatorScenario } from '@/data/simulator';
import { getResourceById } from '@/lib/db';
import { LibraryResource } from '@/types/resource';
import {
  Terminal,
  AlertTriangle,
  ShieldCheck,
  XCircle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Copy,
  Check,
  Award,
  BarChart3,
  ChevronRight,
  Flame,
} from 'lucide-react';

interface FailureSimulatorProps {
  onSelectResource?: (resource: LibraryResource) => void;
}

interface ScenarioAnswer {
  optionId: string;
  isCorrect: boolean;
}

interface OperationalRank {
  minScore: number;
  title: string;
  emoji: string;
  tag: string;
  badgeClass: string;
  borderClass: string;
  bgGradient: string;
  description: string;
}

const OPERATIONAL_RANKS: OperationalRank[] = [
  {
    minScore: 8,
    title: 'Staff Reliability Commander (L8+)',
    emoji: '🎖️',
    tag: 'Principal / Staff SRE Level',
    badgeClass: 'text-amber-300 bg-amber-950/70 border-amber-500/40',
    borderClass: 'border-amber-500/40',
    bgGradient: 'from-amber-950/30 via-[#0e1117] to-[#0a0c10]',
    description:
      'Flawless production diagnostics. You navigate extreme telemetry overload with zero casualties, immediately recognize deceptive recovery traps (such as cold database reboots or in-band OTA updates during kernel faults), and defend architectural invariants under pressure.',
  },
  {
    minScore: 6,
    title: 'Senior Systems Architect (L6-L7)',
    emoji: '🛡️',
    tag: 'Senior Infrastructure Level',
    badgeClass: 'text-emerald-300 bg-emerald-950/70 border-emerald-500/40',
    borderClass: 'border-emerald-500/40',
    bgGradient: 'from-emerald-950/30 via-[#0e1117] to-[#0a0c10]',
    description:
      'Deep operational acumen. You successfully averted the vast majority of severe production cascades, correctly pinpointed fault isolation seams, and applied cellular blast radius and rate-limiting remedies.',
  },
  {
    minScore: 4,
    title: 'Incident Response Engineer (L4-L5)',
    emoji: '⚙️',
    tag: 'Incident Response Level',
    badgeClass: 'text-cyan-300 bg-cyan-950/70 border-cyan-500/40',
    borderClass: 'border-cyan-500/40',
    bgGradient: 'from-cyan-950/30 via-[#0e1117] to-[#0a0c10]',
    description:
      'Solid diagnostic baseline. You handle frontline alarms well, but a few classic distributed system traps (such as restarting cold saturated databases or unchecked destructive commands) induced full production cascades.',
  },
  {
    minScore: 0,
    title: 'Junior On-Call Padawan (Needs Study)',
    emoji: '🚨',
    tag: 'Incident Trainee Level',
    badgeClass: 'text-rose-300 bg-rose-950/70 border-rose-500/40',
    borderClass: 'border-rose-500/40',
    bgGradient: 'from-rose-950/30 via-[#0e1117] to-[#0a0c10]',
    description:
      'Multiple catastrophic cascades triggered under pressure. Study the canonical systems literature, review verified forensic autopsies, and practice failure imagination before your next on-call rotation.',
  },
];

function getOperationalRank(score: number): OperationalRank {
  return OPERATIONAL_RANKS.find((rank) => score >= rank.minScore) || OPERATIONAL_RANKS[OPERATIONAL_RANKS.length - 1];
}

export function FailureSimulator({ onSelectResource }: FailureSimulatorProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, ScenarioAnswer>>({});
  const [showScorecard, setShowScorecard] = useState(false);
  const [copied, setCopied] = useState(false);

  const totalScenarios = SIMULATOR_SCENARIOS.length;
  const currentScenario: SimulatorScenario = SIMULATOR_SCENARIOS[currentIndex];
  const currentAnswer = answers[currentScenario.id];

  const answeredCount = Object.keys(answers).length;
  const solvedCount = Object.values(answers).filter((a) => a.isCorrect).length;
  const failedCount = answeredCount - solvedCount;
  const percentage = answeredCount > 0 ? ((solvedCount / totalScenarios) * 100).toFixed(1) : '0.0';
  const allAnswered = answeredCount === totalScenarios;

  const chosenOption = currentAnswer
    ? currentScenario.options.find((opt) => opt.id === currentAnswer.optionId)
    : null;
  const linkedResource = chosenOption ? getResourceById(chosenOption.related_resource_id) : null;

  const currentRank = getOperationalRank(solvedCount);

  const handleSelectOption = (optId: string) => {
    if (answers[currentScenario.id]) return; // already answered

    const opt = currentScenario.options.find((o) => o.id === optId);
    if (!opt) return;

    setAnswers((prev) => ({
      ...prev,
      [currentScenario.id]: {
        optionId: optId,
        isCorrect: opt.is_correct,
      },
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalScenarios - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowScorecard(true);
    }
  };

  const handleJumpTo = (index: number) => {
    setCurrentIndex(index);
    setShowScorecard(false);
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentIndex(0);
    setShowScorecard(false);
    setCopied(false);
  };

  const handleShare = async () => {
    const rank = getOperationalRank(solvedCount);
    const text = [
      `🛡️ breakpoint SRE Simulator Result: ${solvedCount}/${totalScenarios} Correct (${percentage}%)`,
      `Rank: ${rank.title}`,
      `Try the drills at https://breakpoint.dev/simulator`,
    ].join('\n');

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } else if (typeof document !== 'undefined') {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  // --------------------------------------------------------------------------
  // SCORECARD VIEW
  // --------------------------------------------------------------------------
  if (showScorecard) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
        {/* Top Mini Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[#0e1117] border border-[#202735] font-mono text-xs">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-white uppercase tracking-wider">
              Staff SRE Operational Scorecard
            </span>
            <span className="text-zinc-500">
              ({solvedCount} of {totalScenarios} Averted)
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowScorecard(false)}
              className="text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors font-mono"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Review Drills</span>
            </button>

            <button
              onClick={handleReset}
              className="text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors font-mono"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake All</span>
            </button>
          </div>
        </div>

        {/* Hero Rank Card */}
        <div
          className={`rounded-2xl bg-gradient-to-br ${currentRank.bgGradient} border ${currentRank.borderClass} p-6 sm:p-10 space-y-6 shadow-2xl relative overflow-hidden`}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border shadow-sm ${currentRank.badgeClass}">
              <span>{currentRank.emoji}</span>
              <span>{currentRank.tag}</span>
            </div>

            <span className="text-xs font-mono text-zinc-400">
              8-Stage Production Incident Benchmark
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl">{currentRank.emoji}</span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {currentRank.title}
              </h2>
            </div>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans max-w-2xl">
              {currentRank.description}
            </p>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-[#08090d]/80 border border-zinc-800">
              <span className="text-[11px] font-mono text-zinc-500 uppercase block mb-1">
                Accuracy Score
              </span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-white">
                {solvedCount} / {totalScenarios}{' '}
                <span className="text-xs font-normal text-zinc-400">({percentage}%)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#08090d]/80 border border-zinc-800">
              <span className="text-[11px] font-mono text-zinc-500 uppercase block mb-1">
                Crises Averted
              </span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
                {solvedCount}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#08090d]/80 border border-zinc-800">
              <span className="text-[11px] font-mono text-zinc-500 uppercase block mb-1">
                Cascaded to Outage
              </span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-red-400">
                {failedCount}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#08090d]/80 border border-zinc-800">
              <span className="text-[11px] font-mono text-zinc-500 uppercase block mb-1">
                Unanswered
              </span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-zinc-400">
                {totalScenarios - answeredCount}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs font-mono text-zinc-400">
              <span>Simulation Progress</span>
              <span>
                {answeredCount}/{totalScenarios} Drills Executed
              </span>
            </div>
            <div className="h-2.5 w-full bg-zinc-900 rounded-full overflow-hidden flex border border-zinc-800">
              <div
                className="bg-emerald-500 transition-all duration-500"
                style={{ width: `${(solvedCount / totalScenarios) * 100}%` }}
              />
              <div
                className="bg-red-500 transition-all duration-500"
                style={{ width: `${(failedCount / totalScenarios) * 100}%` }}
              />
            </div>
          </div>

          {/* Action Buttons: Share & Retake */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={handleShare}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-lg active:scale-95 ${
                copied
                  ? 'bg-emerald-600 text-white shadow-emerald-950'
                  : 'bg-zinc-100 hover:bg-white text-zinc-900 shadow-zinc-950'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Scorecard Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Share Scorecard</span>
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl font-mono text-xs font-bold bg-[#141822] hover:bg-[#1a202d] text-zinc-200 border border-[#252c3d] transition-all flex items-center gap-2 active:scale-95"
            >
              <RotateCcw className="w-4 h-4 text-zinc-400" />
              <span>Retake Simulation Drills</span>
            </button>

            <button
              onClick={() => setShowScorecard(false)}
              className="px-5 py-2.5 rounded-xl font-mono text-xs font-bold bg-transparent hover:bg-zinc-800/50 text-zinc-400 hover:text-white border border-transparent transition-all flex items-center gap-1.5 ml-auto"
            >
              <span>Inspect Drill Details</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Detailed Decision Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-red-400" />
              <span>Incident Drill Forensic Breakdown</span>
            </h3>
            <span className="text-xs font-mono text-zinc-500">
              Click any drill to review your actions
            </span>
          </div>

          <div className="space-y-3">
            {SIMULATOR_SCENARIOS.map((scenario, idx) => {
              const ans = answers[scenario.id];
              const opt = ans ? scenario.options.find((o) => o.id === ans.optionId) : null;
              const res = opt ? getResourceById(opt.related_resource_id) : null;

              return (
                <div
                  key={scenario.id}
                  onClick={() => handleJumpTo(idx)}
                  className={`p-4 sm:p-5 rounded-xl border transition-all cursor-pointer hover:border-zinc-700 bg-[#0a0c10] ${
                    ans
                      ? ans.isCorrect
                        ? 'border-emerald-500/30 hover:bg-emerald-950/10'
                        : 'border-red-500/30 hover:bg-red-950/10'
                      : 'border-zinc-800/80 hover:bg-zinc-900/30'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-md bg-[#161a24] border border-[#232b3b] font-mono text-xs font-bold flex items-center justify-center text-zinc-400">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-mono text-zinc-400">
                        {scenario.company_context}
                      </span>
                    </div>

                    {ans ? (
                      ans.isCorrect ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>AVERTED</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-bold text-red-300 bg-red-950/80 border border-red-500/40">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>CASCADED</span>
                        </span>
                      )
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800">
                        NOT ATTEMPTED
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-zinc-100 mb-2">
                    {scenario.title}
                  </h4>

                  {opt && (
                    <div className="mt-3 pt-3 border-t border-zinc-800/80 space-y-2">
                      <div className="text-xs font-mono text-zinc-300 flex items-start gap-2">
                        <span className="text-zinc-500 shrink-0">Selected:</span>
                        <span className="text-zinc-200">{opt.action}</span>
                      </div>
                      <div className="text-xs font-mono text-zinc-400 flex items-start gap-2">
                        <span className="text-emerald-400 font-bold shrink-0">Rule:</span>
                        <span>{opt.lesson}</span>
                      </div>
                      {res && (
                        <div className="pt-1 flex items-center justify-between gap-2">
                          <span className="text-[11px] font-mono text-zinc-500">
                            Canonical literature:
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onSelectResource) onSelectResource(res);
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 hover:text-emerald-300 transition-colors"
                          >
                            <BookOpen className="w-3 h-3" />
                            <span>Study {res.title}</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // INTERACTIVE SIMULATION DRILL VIEW
  // --------------------------------------------------------------------------
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Console Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[#22272e] border border-[#373e47] font-mono text-xs">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#f47067]" />
          <span className="font-bold text-[#adbac7] uppercase tracking-wider">
            Failure Imagination Simulator
          </span>
          <span className="text-[#768390]">
            (Scenario {currentIndex + 1} of {totalScenarios})
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[#57ab5a]">
              Averted: <strong>{solvedCount}</strong>
            </span>
            <span className="text-[#444c56]">/</span>
            <span className="text-[#f47067]">
              Cascaded: <strong>{failedCount}</strong>
            </span>
          </div>

          {answeredCount > 0 && (
            <button
              onClick={() => setShowScorecard(true)}
              className="text-[#c69026] hover:text-white flex items-center gap-1 transition-colors font-bold cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Scorecard</span>
            </button>
          )}

          <button
            onClick={handleReset}
            className="text-[#768390] hover:text-[#adbac7] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Scenario Stepper Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {SIMULATOR_SCENARIOS.map((sc, idx) => {
          const ans = answers[sc.id];
          const isCurrent = idx === currentIndex;

          let badgeStyle = 'bg-[#22272e] border-[#373e47] text-[#768390] hover:text-[#adbac7] hover:border-[#444c56]';
          if (ans) {
            badgeStyle = ans.isCorrect
              ? 'bg-[#57ab5a]/15 border-[#57ab5a]/50 text-[#57ab5a] font-bold'
              : 'bg-[#f47067]/15 border-[#f47067]/50 text-[#f47067] font-bold';
          }
          if (isCurrent) {
            badgeStyle += ' ring-2 ring-[#539bf5] ring-offset-2 ring-offset-[#1c2128]';
          }

          return (
            <button
              key={sc.id}
              onClick={() => setCurrentIndex(idx)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs transition-all cursor-pointer ${badgeStyle}`}
            >
              <span>{idx + 1}.</span>
              <span className="hidden sm:inline truncate max-w-[100px]">
                {sc.company_context.split(' ')[0]}
              </span>
              {ans && (
                <span>
                  {ans.isCorrect ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-[#57ab5a] inline" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-[#f47067] inline" />
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Scenario Console Card */}
      <div className="rounded-2xl bg-[#22272e] border border-[#373e47] p-6 sm:p-8 space-y-6 shadow-sm">
        {/* Scenario Header */}
        <div className="space-y-2 border-b border-[#373e47]/60 pb-5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-mono text-[#f47067] font-semibold uppercase tracking-wider">
              {currentScenario.company_context}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#768390]">
                Drill {currentIndex + 1} of {totalScenarios}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-[#f47067]/15 text-[#f47067] border border-[#f47067]/40 flex items-center gap-1">
                <Flame className="w-3 h-3 text-[#f47067]" />
                <span>P0 Crisis</span>
              </span>
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#adbac7] tracking-tight">
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
              const isSelected = currentAnswer?.optionId === opt.id;
              const hasAnswered = Boolean(currentAnswer);

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
                {chosenOption.is_correct
                  ? 'Crisis Successfully Averted'
                  : 'Catastrophic Cascade Triggered'}
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
                  type="button"
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

        {/* Navigation & Scorecard Triggers */}
        {currentAnswer && (
          <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-900">
            {allAnswered ? (
              <button
                onClick={() => setShowScorecard(true)}
                className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-amber-950 active:scale-[0.98]"
              >
                <Award className="w-4 h-4" />
                <span>View Staff SRE Scorecard</span>
              </button>
            ) : (
              <button
                onClick={() => setShowScorecard(true)}
                className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1"
              >
                <span>Finish Early & View Scorecard</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              {currentIndex < totalScenarios - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-red-950 active:scale-[0.98]"
                >
                  <span>Next Production Drill</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setShowScorecard(true)}
                  className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-emerald-950 active:scale-[0.98]"
                >
                  <Award className="w-4 h-4" />
                  <span>View Staff SRE Evaluation Scorecard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
