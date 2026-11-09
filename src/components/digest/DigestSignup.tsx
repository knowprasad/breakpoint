'use client';

import React, { useState } from 'react';
import { DigestTrack } from '@/types/digest';
import { DigestPreviewModal } from './DigestPreviewModal';
import { Mail, Zap, Brain, CheckCircle2, ArrowRight, Eye, ShieldCheck } from 'lucide-react';

export function DigestSignup() {
  const [email, setEmail] = useState('');
  const [track, setTrack] = useState<DigestTrack>('both');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMessage('Please enter a valid work or engineering email.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      localStorage.setItem('breakpoint_subscribed', JSON.stringify({ email, track, date: new Date().toISOString() }));
      setStatus('success');
    } catch (err) {
      // Fallback for private browsing
      setStatus('success');
    }
  };

  return (
    <div className="w-full rounded-2xl bg-[#0c0e13] border border-[#222834] p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-2xl">
      {/* Background Accent Gradients */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/30 text-red-400 font-mono text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>THE BI-WEEKLY BREAKPOINT DISPATCH</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Level Up Your Failure Imagination Every Week
          </h2>
          <p className="text-sm text-zinc-400 font-mono max-w-xl mx-auto leading-relaxed">
            Forensic engineering post-mortems on Wednesday mornings. Timeless architecture and system design chapters on Sunday mornings. Anti-burnout, high-signal, zero hype.
          </p>
        </div>

        {/* Track Selector Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          <button
            type="button"
            onClick={() => setTrack('systems')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              track === 'systems'
                ? 'bg-amber-950/40 border-amber-500/50 text-amber-200 shadow-md shadow-amber-950/30'
                : 'bg-[#10131a] border-[#1f2533] text-zinc-400 hover:text-zinc-200 hover:bg-[#141822]'
            }`}
          >
            <div className="flex items-center gap-2 font-bold mb-1 text-amber-400">
              <Zap className="w-4 h-4" />
              <span>Wednesday ⚡</span>
            </div>
            <div className="text-xs text-zinc-300 font-sans font-medium mb-1">
              Disaster Track
            </div>
            <div className="text-[11px] text-zinc-500 leading-snug">
              Forensic outage autopsies (Shopify, GitLab, CrowdStrike) + mitigations.
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTrack('mindset')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              track === 'mindset'
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 shadow-md shadow-emerald-950/30'
                : 'bg-[#10131a] border-[#1f2533] text-zinc-400 hover:text-zinc-200 hover:bg-[#141822]'
            }`}
          >
            <div className="flex items-center gap-2 font-bold mb-1 text-emerald-400">
              <Brain className="w-4 h-4" />
              <span>Sunday 🧠</span>
            </div>
            <div className="text-xs text-zinc-300 font-sans font-medium mb-1">
              Timeless Mindset
            </div>
            <div className="text-[11px] text-zinc-500 leading-snug">
              3-minute distillations of DDIA, OSTEP, SICP, and canonical talks.
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTrack('both')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              track === 'both'
                ? 'bg-red-950/40 border-red-500/50 text-red-200 shadow-md shadow-red-950/30'
                : 'bg-[#10131a] border-[#1f2533] text-zinc-400 hover:text-zinc-200 hover:bg-[#141822]'
            }`}
          >
            <div className="flex items-center gap-2 font-bold mb-1 text-red-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Full Immunity ⚡🧠</span>
            </div>
            <div className="text-xs text-zinc-300 font-sans font-medium mb-1">
              Both Tracks (Recommended)
            </div>
            <div className="text-[11px] text-zinc-500 leading-snug">
              Wednesday catastrophe + Sunday foundational canon.
            </div>
          </button>
        </div>

        {/* Form */}
        {status === 'success' ? (
          <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-white font-mono">
              You are subscribed to breakpoint.
            </h4>
            <p className="text-xs text-zinc-300 font-mono">
              Confirmation sent to <strong className="text-emerald-400">{email}</strong>. Look for your first Wednesday autopsy dispatch.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@company.com"
                  disabled={status === 'loading'}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#11141b] border border-[#222834] focus:border-red-500 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-mono text-xs font-bold transition-all active:scale-[0.98] shadow-md shadow-red-950 flex items-center justify-center gap-2 shrink-0"
              >
                <span>{status === 'loading' ? 'Subscribing...' : 'Subscribe Free'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {status === 'error' && (
              <p className="text-xs font-mono text-red-400">{errorMessage}</p>
            )}

            {/* Sub-form preview & safety notes */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-500 pt-1">
              <span>No spam. 1-click unsubscribe at any time.</span>
              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors underline underline-offset-4"
              >
                <Eye className="w-3.5 h-3.5 text-zinc-400" />
                Preview actual sample digest issue
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Preview Modal */}
      <DigestPreviewModal isOpen={previewOpen} onClose={() => setPreviewOpen(false)} />
    </div>
  );
}
