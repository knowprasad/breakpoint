import { NextResponse } from 'next/server';
import { getSimilarVideos } from '@/lib/recommendations';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vid = searchParams.get('vid');
    const limit = parseInt(searchParams.get('limit') || '6', 10);

    if (!vid) {
      return NextResponse.json({ error: 'Missing vid parameter' }, { status: 400 });
    }

    const similar = getSimilarVideos(vid, limit);
    return NextResponse.json({
      vid,
      similar,
      count: similar.length
    });
  } catch (error) {
    if (error && typeof error === 'object' && 'digest' in error && (error as { digest: string }).digest === 'NEXT_PRERENDER_INTERRUPTED') {
      throw error;
    }
    console.error('Error fetching similar talks:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve recommendations' },
      { status: 500 }
    );
  }
}
