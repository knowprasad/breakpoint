import { NextResponse } from 'next/server';
import { getOfficialPlaylistBySlug } from '@/lib/hackertubePlaylists';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const playlist = getOfficialPlaylistBySlug(slug);

  if (!playlist) {
    return NextResponse.json({ error: 'Playlist not found' }, { status: 404 });
  }

  return NextResponse.json({ playlist });
}
