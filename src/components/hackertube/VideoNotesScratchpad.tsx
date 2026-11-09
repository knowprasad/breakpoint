'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HackerTubeVideo } from '@/types/hackertube';
import {
  FileEdit,
  Copy,
  Check,
  Download,
  Trash2,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface VideoNotesScratchpadProps {
  video: HackerTubeVideo;
}

export function VideoNotesScratchpad({ video }: VideoNotesScratchpadProps) {
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const [mounted, setMounted] = useState(false);

  const storageKey = `breakpoint_notes_${video.vid}`;
  const isFirstLoad = useRef(true);

  // Initialize from localStorage on mount and when video changes
  useEffect(() => {
    isFirstLoad.current = true;
    let isMounted = true;

    queueMicrotask(() => {
      if (!isMounted) return;
      try {
        const saved = localStorage.getItem(storageKey);
        setNotes(saved || '');
      } catch (e) {
        console.error('Failed to load notes from localStorage:', e);
      }
      setMounted(true);
    });

    return () => {
      isMounted = false;
    };
  }, [storageKey]);

  // Debounced auto-save to localStorage
  useEffect(() => {
    if (!mounted) return;

    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    setIsSaving(true);
    const timeout = setTimeout(() => {
      try {
        if (notes.trim()) {
          localStorage.setItem(storageKey, notes);
        } else {
          localStorage.removeItem(storageKey);
        }
        setIsSaving(false);
      } catch (e) {
        console.error('Failed to save notes to localStorage:', e);
        setIsSaving(false);
      }
    }, 450);

    return () => clearTimeout(timeout);
  }, [notes, storageKey, mounted]);

  // Generate markdown with structured header for Obsidian / Notion export
  const generateExportMarkdown = useCallback(() => {
    const hnScore = typeof video.score === 'number' ? video.score.toFixed(1) : 'N/A';
    const videoUrl = video.url || `https://www.youtube.com/watch?v=${video.vid}`;

    return `# ${video.title} — Engineering Notes & Takeaways

> **Speaker / Channel**: ${video.channel}  
> **Hacker News Score**: ★ ${hnScore}  
> **Topic**: ${video.primary_topic || 'Systems Engineering'}  
> **Video URL**: ${videoUrl}  
> **Source**: breakpoint.dev (HackerTube)

---

## Architecture Takeaways & Invariants

${notes.trim()}
`;
  }, [video, notes]);

  // Copy formatted notes to clipboard
  const handleCopyNotes = async () => {
    if (!notes.trim()) return;

    try {
      const content = generateExportMarkdown();
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy notes:', e);
    }
  };

  // Download markdown file
  const handleExportMarkdown = () => {
    if (!notes.trim()) return;

    try {
      const content = generateExportMarkdown();
      const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `notes-${video.vid}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to export markdown:', e);
    }
  };

  // Clear notes with confirmation
  const handleClearNotes = () => {
    try {
      localStorage.removeItem(storageKey);
      setNotes('');
      setIsConfirmingClear(false);
    } catch (e) {
      console.error('Failed to clear notes:', e);
    }
  };

  // Quick timestamp insertion template
  const handleInsertTimestampPlaceholder = () => {
    const timestampTemplate = `\n- [ ] 00:00 - `;
    setNotes((prev) => (prev ? `${prev}${timestampTemplate}` : `- [ ] 00:00 - `));
  };

  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;
  const charCount = notes.length;
  const hasContent = notes.trim().length > 0;

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#0c0e14] border border-[#1e2432] space-y-3.5 shadow-lg shadow-black/40">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#181d26]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <FileEdit className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-bold">
                Engineering Notes &amp; Takeaways
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#131722] border border-[#22293a] text-zinc-400 hidden sm:inline">
                Local Only
              </span>
            </div>
          </div>
        </div>

        {/* Live Saving Status Indicator */}
        <div className="flex items-center gap-2 text-xs font-mono">
          {isSaving ? (
            <div className="flex items-center gap-1.5 text-amber-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="text-[11px] font-medium">Saving...</span>
            </div>
          ) : hasContent ? (
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"></span>
              <span className="text-[11px] font-medium">Saved locally</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-zinc-700"></span>
              <span className="text-[11px]">Private scratchpad</span>
            </div>
          )}
        </div>
      </div>

      {/* Monospace Notes Textarea */}
      <div className="relative group">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Jot down architecture takeaways, timestamps (e.g. 14:20 - deterministic simulation loop), or invariants to apply to your production codebase..."
          rows={6}
          className="w-full bg-[#08090e] border border-[#1c2230] focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 rounded-xl p-3.5 sm:p-4 text-xs sm:text-sm font-mono text-zinc-200 placeholder:text-zinc-600 leading-relaxed outline-none transition-all resize-y min-h-[140px]"
        />
      </div>

      {/* Actions and Metrics Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Metrics & Helpers */}
        <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
          <span className="text-zinc-300">
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          </span>
          <span className="text-zinc-700">•</span>
          <span className="text-zinc-400">
            {charCount} {charCount === 1 ? 'char' : 'chars'}
          </span>
          <span className="text-zinc-700 hidden sm:inline">•</span>
          <button
            onClick={handleInsertTimestampPlaceholder}
            className="text-zinc-400 hover:text-emerald-400 transition-colors hidden sm:flex items-center gap-1"
            title="Insert timestamp bullet point"
          >
            <Clock className="w-3 h-3 text-zinc-500" />
            <span>+ Timestamp</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {/* Copy Notes */}
          <button
            onClick={handleCopyNotes}
            disabled={!hasContent}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
              !hasContent
                ? 'opacity-40 cursor-not-allowed bg-[#121620] border-[#202534] text-zinc-500'
                : isCopied
                ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                : 'bg-[#121620] border-[#222838] text-zinc-300 hover:text-white hover:bg-[#181e2b] hover:border-emerald-500/40'
            }`}
            title="Copy notes formatted with video title, link, and HN score for Obsidian/Notion"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>Copy Notes</span>
              </>
            )}
          </button>

          {/* Export Markdown */}
          <button
            onClick={handleExportMarkdown}
            disabled={!hasContent}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
              !hasContent
                ? 'opacity-40 cursor-not-allowed bg-[#121620] border-[#202534] text-zinc-500'
                : 'bg-[#121620] border-[#222838] text-zinc-300 hover:text-white hover:bg-[#181e2b] hover:border-cyan-500/40'
            }`}
            title={`Download notes-${video.vid}.md for local storage`}
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export .md</span>
          </button>

          {/* Clear Button / Confirmation */}
          {isConfirmingClear ? (
            <div className="flex items-center gap-1.5 bg-red-950/60 border border-red-500/40 px-2 py-1 rounded-lg">
              <AlertTriangle className="w-3 h-3 text-red-400" />
              <span className="text-[11px] text-red-300">Clear all?</span>
              <button
                onClick={handleClearNotes}
                className="text-[11px] font-bold text-red-400 hover:text-red-300 underline ml-1"
              >
                Yes
              </button>
              <button
                onClick={() => setIsConfirmingClear(false)}
                className="text-[11px] text-zinc-400 hover:text-zinc-200 ml-1"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsConfirmingClear(true)}
              disabled={!hasContent}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all ${
                !hasContent
                  ? 'opacity-30 cursor-not-allowed bg-[#121620] border-[#202534] text-zinc-500'
                  : 'bg-[#121620] border-[#222838] text-zinc-400 hover:text-red-400 hover:bg-red-950/30 hover:border-red-500/30'
              }`}
              title="Clear scratchpad notes for this video"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
