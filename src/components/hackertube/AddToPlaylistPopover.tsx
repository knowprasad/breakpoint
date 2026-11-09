'use client';

import React, { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { HackerTubeVideo } from '@/types/hackertube';
import {
  Playlist,
  loadUserStore,
  createPlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist
} from '@/lib/userStore';
import { FolderPlus, Check, Plus, X, Folder } from 'lucide-react';

interface AddToPlaylistPopoverProps {
  video: HackerTubeVideo;
  variant?: 'icon' | 'button';
  className?: string;
}

export function AddToPlaylistPopover({
  video,
  variant = 'icon',
  className = ''
}: AddToPlaylistPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  // Subscribe to user store changes
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    if (typeof window === 'undefined') return [];
    return loadUserStore().playlists || [];
  });

  const refreshPlaylists = () => {
    setPlaylists(loadUserStore().playlists || []);
  };

  useEffect(() => {
    const handleStoreChange = () => refreshPlaylists();
    window.addEventListener('breakpoint-store-changed', handleStoreChange);
    return () => window.removeEventListener('breakpoint-store-changed', handleStoreChange);
  }, []);

  // Update position when opened
  const updatePosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const popoverWidth = 280;
    const popoverHeight = 310;

    let left = rect.right - popoverWidth;
    if (left < 12) left = 12;
    if (left + popoverWidth > window.innerWidth - 12) {
      left = window.innerWidth - popoverWidth - 12;
    }

    let top = rect.bottom + 6;
    // Flip above if running off bottom of screen
    if (top + popoverHeight > window.innerHeight && rect.top > popoverHeight) {
      top = rect.top - popoverHeight - 6;
    }

    setCoords({ top, left });
  };

  const handleToggleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOpen) {
      updatePosition();
      refreshPlaylists();
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  // Close on click outside, window resize, or scroll
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleScroll = (e: Event) => {
      // Don't close if scrolling inside the popover itself
      if (popoverRef.current && popoverRef.current.contains(e.target as Node)) {
        return;
      }
      setIsOpen(false);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll, { capture: true });
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  const handleTogglePlaylist = (e: React.MouseEvent, pl: Playlist) => {
    e.preventDefault();
    e.stopPropagation();
    const isInPlaylist = pl.videos.some((v) => v.vid === video.vid);
    if (isInPlaylist) {
      removeVideoFromPlaylist(pl.id, video.vid);
    } else {
      addVideoToPlaylist(pl.id, video);
    }
    refreshPlaylists();
  };

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const title = newTitle.trim();
    if (!title) return;

    const pl = createPlaylist(title);
    addVideoToPlaylist(pl.id, video);
    setNewTitle('');
    setIsCreating(false);
    refreshPlaylists();
  };

  // Check if current video is in ANY playlist
  const isInAnyPlaylist = playlists.some((pl) =>
    pl.videos?.some((v) => v.vid === video.vid)
  );

  return (
    <>
      {variant === 'icon' ? (
        <button
          ref={buttonRef}
          type="button"
          onClick={handleToggleOpen}
          title={isInAnyPlaylist ? 'Saved to Playlist' : 'Add to Playlist'}
          aria-expanded={isOpen}
          aria-label="Add to Playlist"
          className={`p-1.5 rounded-lg backdrop-blur-md border transition-all cursor-pointer ${
            isInAnyPlaylist
              ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300 shadow-sm shadow-cyan-950/50'
              : 'bg-black/60 border-white/10 text-zinc-300 hover:text-white hover:border-zinc-500'
          } ${className}`}
        >
          <FolderPlus className={`w-3.5 h-3.5 ${isInAnyPlaylist ? 'text-cyan-400' : ''}`} />
        </button>
      ) : (
        <button
          ref={buttonRef}
          type="button"
          onClick={handleToggleOpen}
          aria-expanded={isOpen}
          aria-label="Add to Playlist"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
            isInAnyPlaylist
              ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300 shadow-sm shadow-cyan-950/50'
              : 'bg-[#121620] border-[#222838] text-zinc-300 hover:text-white hover:bg-[#181e2b]'
          } ${className}`}
        >
          <FolderPlus className={`w-3.5 h-3.5 ${isInAnyPlaylist ? 'text-cyan-400' : 'text-cyan-400'}`} />
          <span className="font-semibold">{isInAnyPlaylist ? 'In Playlist' : 'Add to Playlist'}</span>
        </button>
      )}

      {isOpen &&
        coords &&
        typeof window !== 'undefined' &&
        createPortal(
          <div
            ref={popoverRef}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            style={{
              position: 'fixed',
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              width: '280px',
              zIndex: 9999
            }}
            className="rounded-xl bg-[#0c0e14] border border-[#232938] shadow-2xl text-zinc-200 overflow-hidden font-mono text-xs animate-in fade-in zoom-in-95 duration-100"
          >
            {/* Popover Header */}
            <div className="px-3 py-2 bg-[#10131a] border-b border-[#1b202c] flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-bold text-white text-[11px] uppercase tracking-wider">
                  Save to Playlist
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="p-0.5 rounded text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Playlist Checkbox List */}
            <div className="p-2 max-h-[190px] overflow-y-auto space-y-1">
              {playlists.length > 0 ? (
                playlists.map((pl) => {
                  const checked = pl.videos.some((v) => v.vid === video.vid);
                  return (
                    <div
                      key={pl.id}
                      onClick={(e) => handleTogglePlaylist(e, pl)}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                        checked
                          ? 'bg-cyan-950/40 text-cyan-200 font-semibold'
                          : 'hover:bg-[#141824] text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                            checked
                              ? 'bg-cyan-500 border-cyan-400 text-black'
                              : 'border-zinc-700 bg-[#0a0c10]'
                          }`}
                        >
                          {checked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="truncate text-xs">{pl.name}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 ml-2 shrink-0">
                        {pl.videos.length}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="p-3 text-center text-zinc-500 text-[11px]">
                  No playlists created yet.
                </div>
              )}
            </div>

            {/* Popover Footer: Inline Create Playlist */}
            <div className="p-2 border-t border-[#1b202c] bg-[#090b10]">
              {!isCreating ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsCreating(true);
                  }}
                  className="w-full py-1.5 px-2 rounded-lg text-cyan-400 hover:text-cyan-300 hover:bg-[#121622] transition-colors flex items-center justify-center gap-1.5 text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Playlist</span>
                </button>
              ) : (
                <form onSubmit={handleCreatePlaylist} className="space-y-1.5">
                  <input
                    type="text"
                    autoFocus
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Playlist name..."
                    className="w-full px-2.5 py-1 rounded-md bg-[#0e1117] border border-[#232938] text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-400"
                  />
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsCreating(false);
                        setNewTitle('');
                      }}
                      className="px-2 py-0.5 rounded text-[11px] text-zinc-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!newTitle.trim()}
                      className="px-2.5 py-0.5 rounded bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-black font-bold text-[11px] transition-colors"
                    >
                      Create
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
