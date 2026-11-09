'use client';

import React, { useState } from 'react';
import { SAMPLE_DIGEST_ISSUES } from '@/data/digest';
import { X, Mail, Zap, Brain, ArrowRight, Send, CheckCircle2, Loader2 } from 'lucide-react';

interface DigestPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DigestPreviewModal({ isOpen, onClose }: DigestPreviewModalProps) {
  const [selectedIssueId, setSelectedIssueId] = useState<string>(SAMPLE_DIGEST_ISSUES[0].id);
  const [testEmail, setTestEmail] = useState('');
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [testFeedback, setTestFeedback] = useState('');

  if (!isOpen) return null;

  const currentIssue = SAMPLE_DIGEST_ISSUES.find((i) => i.id === selectedIssueId) || SAMPLE_DIGEST_ISSUES[0];

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail || !testEmail.includes('@')) {
      setTestStatus('error');
      setTestFeedback('Please enter a valid email.');
      return;
    }

    setTestStatus('loading');
    setTestFeedback('');

    try {
      const res = await fetch('/api/digest/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testEmail,
          issueId: currentIssue.id,
          track: currentIssue.track
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to dispatch test email.');
      }

      setTestStatus('success');
      setTestFeedback(
        data.simulated
          ? `Dispatched in simulation mode to ${testEmail} (logged to server console).`
          : `Live email dispatched to ${testEmail}! Check your inbox.`
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error sending test email.';
      setTestStatus('error');
      setTestFeedback(message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/85 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Surface */}
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-xl bg-[#0d0f14] border border-[#272e3d] shadow-2xl text-zinc-200 overflow-hidden z-10 font-sans animate-in fade-in zoom-in-95 duration-150">
        {/* Top Bar with Issue Selector */}
        <div className="p-4 sm:p-5 border-b border-[#1f2533] bg-[#12151d] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-bold text-white uppercase tracking-wider">Digest Inbox Preview</span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            {SAMPLE_DIGEST_ISSUES.map((issue) => (
              <button
                key={issue.id}
                onClick={() => {
                  setSelectedIssueId(issue.id);
                  setTestStatus('idle');
                  setTestFeedback('');
                }}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
                  selectedIssueId === issue.id
                    ? 'bg-zinc-800 text-white font-bold border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                {issue.track === 'systems' ? (
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Brain className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span>{issue.track === 'systems' ? 'Wed Systems' : 'Sun Mindset'}</span>
              </button>
            ))}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors ml-2 cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Email Header Simulation */}
        <div className="px-5 sm:px-6 py-4 bg-[#0a0c10] border-b border-[#1b202c] text-xs font-mono space-y-1.5">
          <div className="text-zinc-400">
            <span className="text-zinc-600">From: </span>
            <span className="text-zinc-200">editorial@breakpoint.engineering</span>
          </div>
          <div className="text-zinc-400">
            <span className="text-zinc-600">Subject: </span>
            <span className="text-red-400 font-bold">{currentIssue.subject_line}</span>
          </div>
          <div className="text-zinc-500 text-[11px] flex items-center gap-3">
            <span>{currentIssue.edition}</span>
            <span>•</span>
            <span className="text-zinc-400">{currentIssue.date}</span>
          </div>
        </div>

        {/* Newsletter Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-[#08090b]">
          {/* Headline */}
          <div className="space-y-2 border-b border-[#1a1f28] pb-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-red-950/60 text-red-400 border border-red-500/30 uppercase tracking-wider">
              {currentIssue.track === 'systems' ? '⚡ Wednesday Disaster Autopsy' : '🧠 Sunday Timeless Architecture'}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {currentIssue.lead_story.headline}
            </h1>
            <p className="text-sm text-zinc-400 font-mono italic">
              {currentIssue.teaser}
            </p>
          </div>

          {/* Lead Story Paragraphs */}
          <div className="space-y-4 text-sm sm:text-base text-zinc-300 leading-relaxed font-serif">
            {currentIssue.lead_story.body_paragraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          {/* Diagram Box */}
          {currentIssue.lead_story.diagram_box && (
            <div className="p-4 rounded-lg bg-[#050608] border border-[#1d222e] font-mono text-xs text-red-300 leading-relaxed overflow-x-auto">
              {currentIssue.lead_story.diagram_box.map((line, idx) => (
                <div key={idx} className="whitespace-pre">
                  {line}
                </div>
              ))}
            </div>
          )}

          {/* Deep Takeaway Rule */}
          <div className="p-4 rounded-lg bg-emerald-950/30 border border-emerald-500/40 text-xs sm:text-sm font-sans">
            <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
              Key Engineering Rule of the Week
            </span>
            <p className="text-zinc-200 leading-relaxed">
              {currentIssue.lead_story.deep_takeaway}
            </p>
          </div>

          {/* Featured Reading Cluster */}
          <div className="pt-6 border-t border-[#1a1f28] space-y-3 font-mono">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Canonical Curriculum Linked in This Issue:
            </h4>
            <div className="space-y-2">
              {currentIssue.featured_links.map((link, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-[#0e1116] border border-[#1b202c] flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase font-semibold">
                      {link.type}
                    </span>
                    <span className="text-zinc-200 font-bold block">{link.title}</span>
                    <span className="text-zinc-400 text-[11px] font-sans">{link.annotation}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-500 shrink-0 ml-3" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Send Test Dispatch Bar */}
        <div className="p-3 sm:p-4 border-t border-[#1f2533] bg-[#0c0e14] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <form onSubmit={handleSendTest} className="flex-1 flex items-center gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-zinc-500" />
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Send this issue to test email..."
                className="w-full pl-8 pr-3 py-1.5 rounded bg-[#131720] border border-[#222938] text-xs font-mono text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-red-500"
              />
            </div>
            <button
              type="submit"
              disabled={testStatus === 'loading'}
              className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-mono text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
            >
              {testStatus === 'loading' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>Send Test</span>
            </button>
          </form>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors font-mono text-xs cursor-pointer"
          >
            Close Preview
          </button>
        </div>

        {/* Feedback message banner if test email was sent */}
        {testFeedback && (
          <div
            className={`px-4 py-2 text-xs font-mono border-t ${
              testStatus === 'success'
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : 'bg-red-950/60 border-red-500/40 text-red-300'
            }`}
          >
            {testFeedback}
          </div>
        )}
      </div>
    </div>
  );
}
