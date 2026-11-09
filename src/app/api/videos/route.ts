import { NextResponse } from 'next/server';
import { searchHackerTube } from '@/lib/hackertube';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const area = searchParams.get('area') || 'all';
    const category = searchParams.get('category') || 'all';
    const level = searchParams.get('level') || 'all';
    const limit = parseInt(searchParams.get('limit') || '24', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const sortBy = (searchParams.get('sort') || 'score') as 'score' | 'mentions' | 'recommenders' | 'rec_months';

    const result = searchHackerTube({
      query,
      area,
      category,
      level,
      limit,
      offset,
      sortBy
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to search HackerTube catalog' },
      { status: 500 }
    );
  }
}
