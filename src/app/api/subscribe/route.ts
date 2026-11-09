import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, track } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid engineering email is required' },
        { status: 400 }
      );
    }

    const validTracks = ['systems', 'mindset', 'both'];
    const chosenTrack = validTracks.includes(track) ? track : 'both';

    // In production, sync with Resend / Mailgun / Supabase
    console.log(`[breakpoint-digest] New subscriber: ${email} for track: ${chosenTrack}`);

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to breakpoint dispatch',
      subscriber: {
        email,
        track: chosenTrack,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error processing subscription' },
      { status: 500 }
    );
  }
}
