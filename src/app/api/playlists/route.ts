import { NextResponse } from 'next/server';
import { getOfficialPlaylists, getOfficialPlaylistSummaries } from '@/lib/hackertubePlaylists';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const full = searchParams.get('full') === 'true';

  if (full) {
    const playlists = getOfficialPlaylists();
    return NextResponse.json({ playlists });
  }

  const summaries = getOfficialPlaylistSummaries();
  return NextResponse.json({ playlists: summaries });
}
