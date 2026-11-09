'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HackerTubeVideo } from '@/types/hackertube';
import {
  Playlist,
  loadUserStore,
  createPlaylist,
  deletePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist
} from '@/lib/userStore';
import { X, Plus, FolderPlus, Trash2, Play, Check, Music2, ExternalLink } from 'lucide-react';

interface PlaylistManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetVideo?: HackerTubeVideo | null; // If passed, allows adding this video to playlists
  onPlayVideo?: (video: HackerTubeVideo) => void;
}

export function PlaylistManagerModal({
  isOpen,
  onClose,
  targetVideo,
  onPlayVideo
}: PlaylistManagerModalProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    const store = loadUserStore();
    return store.playlists || [];
  });
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(() => {
    const store = loadUserStore();
    return store.playlists?.[0]?.id || null;
  });

  const refreshPlaylists = () => {
    const store = loadUserStore();
    setPlaylists(store.playlists || []);
  };

  useEffect(() => {
    const handleStoreChange = () => {
      refreshPlaylists();
    };
    window.addEventListener('breakpoint-store-changed', handleStoreChange);
    return () => window.removeEventListener('breakpoint-store-changed', handleStoreChange);
  }, []);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const pl = createPlaylist(newTitle, newDesc);
    if (targetVideo) {
      addVideoToPlaylist(pl.id, targetVideo);
    }
    setNewTitle('');
    setNewDesc('');
    setIsCreating(false);
    refreshPlaylists();
    setSelectedPlaylistId(pl.id);
  };

  const handleToggleAddVideo = (pl: Playlist) => {
    if (!targetVideo) return;
    const isAlreadyIn = pl.videos.some((v) => v.vid === targetVideo.vid);
    if (isAlreadyIn) {
      removeVideoFromPlaylist(pl.id, targetVideo.vid);
    } else {
      addVideoToPlaylist(pl.id, targetVideo);
    }
    refreshPlaylists();
  };

  const handleDelete = (plId: string) => {
    deletePlaylist(plId);
    refreshPlaylists();
    if (selectedPlaylistId === plId) {
      setSelectedPlaylistId(null);
    }
  };

  const selectedPlaylist = playlists.find((p) => p.id === selectedPlaylistId) || playlists[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />

      {/* Surface */}
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-[#0c0e14] border border-[#232938] shadow-2xl text-zinc-200 overflow-hidden z-10 font-sans animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1b202c] bg-[#10131a] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Music2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono">
                {targetVideo ? 'Add to Playlist' : 'HackerTube Playlists'}
              </h2>
              {targetVideo && (
                <span className="text-xs text-zinc-400 font-mono truncate max-w-md block">
                  Target: {targetVideo.title}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Layout: 2 Columns */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[380px]">
          {/* Left Column: Playlist List */}
          <div className="md:col-span-5 border-r border-[#1b202c] p-4 flex flex-col justify-between bg-[#0a0c10]">
            <div className="space-y-2 overflow-y-auto max-h-[320px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-zinc-400 font-bold uppercase tracking-wider">
                  Your Collections ({playlists.length})
                </span>
                <button
                  onClick={() => setIsCreating(!isCreating)}
                  className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New</span>
                </button>
              </div>

              {/* Create New Form */}
              {isCreating && (
                <form onSubmit={handleCreate} className="p-3 rounded-xl bg-[#121620] border border-amber-500/40 space-y-2 mb-3">
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Playlist name (e.g. Distributed Systems 101)"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#08090d] border border-[#222836] text-xs text-white placeholder:text-zinc-500 font-mono focus:outline-none focus:border-amber-400"
                    autoFocus
                  />
                  <input
                    type="text"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Short description (optional)"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#08090d] border border-[#222836] text-xs text-zinc-300 placeholder:text-zinc-500 font-mono focus:outline-none"
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsCreating(false)}
                      className="px-2.5 py-1 rounded text-xs text-zinc-400 font-mono hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs font-mono transition-colors"
                    >
                      Create
                    </button>
                  </div>
                </form>
              )}

              {/* Playlists List */}
              {playlists.map((pl) => {
                const isSelected = selectedPlaylist?.id === pl.id;
                const containsTarget = targetVideo && pl.videos.some((v) => v.vid === targetVideo.vid);

                return (
                  <div
                    key={pl.id}
                    onClick={() => setSelectedPlaylistId(pl.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-500/50 text-white'
                        : 'bg-[#0f1218] hover:bg-[#141822] border-[#1c2230] text-zinc-300'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs truncate">{pl.name}</span>
                        {containsTarget && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-zinc-500 block">
                        {pl.videos.length} talks
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {targetVideo && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleAddVideo(pl);
                          }}
                          className={`px-2 py-1 rounded text-[11px] font-mono font-bold transition-all ${
                            containsTarget
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : 'bg-zinc-800 text-zinc-300 hover:bg-amber-500 hover:text-black'
                          }`}
                        >
                          {containsTarget ? 'Added ✓' : '+ Add'}
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(pl.id);
                        }}
                        className="text-zinc-600 hover:text-red-400 p-1"
                        title="Delete Playlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Playlist Details & Talks List */}
          <div className="md:col-span-7 p-6 overflow-y-auto space-y-4 bg-[#0c0e14]">
            {selectedPlaylist ? (
              <div className="space-y-4">
                <div className="border-b border-[#1b202c] pb-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white font-mono">{selectedPlaylist.name}</h3>
                    <span className="text-xs font-mono text-zinc-400">
                      {selectedPlaylist.videos.length} videos
                    </span>
                  </div>
                  {selectedPlaylist.description && (
                    <p className="text-xs text-zinc-400">{selectedPlaylist.description}</p>
                  )}
                </div>

                {/* Video items in playlist */}
                {selectedPlaylist.videos.length === 0 ? (
                  <div className="py-12 text-center text-xs font-mono text-zinc-500">
                    This playlist is currently empty. Add talks from the catalog!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedPlaylist.videos.map((vid, idx) => (
                      <div
                        key={vid.vid}
                        className="p-3 rounded-xl bg-[#0f1218] border border-[#1b212f] hover:border-zinc-700 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="font-mono text-zinc-600 font-bold w-4 text-center">
                            {idx + 1}
                          </span>
                          <img
                            src={vid.thumbnail_url}
                            alt=""
                            className="w-14 h-9 object-cover rounded shrink-0 bg-black"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-zinc-200 truncate block">
                              {vid.title}
                            </span>
                            <span className="text-[11px] text-zinc-400 font-mono">
                              {vid.channel} • Score {vid.score}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Link
                            href={`/watch/${vid.vid}`}
                            onClick={onClose}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-600 text-white transition-colors flex items-center justify-center"
                            title="Play Video"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                          </Link>
                          <button
                            onClick={() => {
                              removeVideoFromPlaylist(selectedPlaylist.id, vid.vid);
                              refreshPlaylists();
                            }}
                            className="text-zinc-600 hover:text-red-400 p-1"
                            title="Remove from Playlist"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-xs font-mono text-zinc-500">
                Select or create a playlist.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#1b202c] bg-[#10131a] flex items-center justify-between text-xs font-mono text-zinc-500">
          <span>Saved locally in your browser storage. Zero accounts needed.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors font-bold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
