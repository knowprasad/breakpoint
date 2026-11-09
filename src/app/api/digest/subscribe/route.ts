import { NextRequest, NextResponse } from 'next/server';
import { addSubscriber, unsubscribeSubscriber, isValidEmail } from '@/lib/subscribers';
import { sendEmail, renderWelcomeEmail, renderDigestIssueEmail } from '@/lib/email';
import { SAMPLE_DIGEST_ISSUES } from '@/data/digest';
import { DigestTrack } from '@/types/digest';

export const dynamic = 'force-static';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, track = 'both', sendSample = false } = body;

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid work or engineering email address.' },
        { status: 400 }
      );
    }

    const validatedTrack: DigestTrack = ['systems', 'mindset', 'both'].includes(track) ? track : 'both';

    // 1. Persist subscriber
    const { subscriber, isNew } = addSubscriber(email, validatedTrack, 'website_form');

    // 2. Dispatch Welcome & Confirmation Email
    const origin = req.nextUrl.origin || 'https://breakpoint.engineering';
    const welcome = renderWelcomeEmail({
      email: subscriber.email,
      track: subscriber.track,
      baseUrl: origin
    });

    const emailResult = await sendEmail({
      to: subscriber.email,
      subject: welcome.subject,
      html: welcome.html,
      text: welcome.text
    });

    // 3. If requested, also send the immediate sample dispatch
    let sampleResult = null;
    if (sendSample) {
      const issueToDeliver =
        validatedTrack === 'mindset'
          ? SAMPLE_DIGEST_ISSUES.find((i) => i.track === 'mindset') || SAMPLE_DIGEST_ISSUES[0]
          : SAMPLE_DIGEST_ISSUES[0]; // default to Wednesday Systems

      const issueEmail = renderDigestIssueEmail({
        issue: issueToDeliver,
        recipientEmail: subscriber.email,
        baseUrl: origin
      });

      sampleResult = await sendEmail({
        to: subscriber.email,
        subject: issueEmail.subject,
        html: issueEmail.html,
        text: issueEmail.text
      });
    }

    return NextResponse.json({
      success: true,
      message: isNew
        ? 'Successfully subscribed! A confirmation email has been dispatched.'
        : 'Your subscription preferences have been updated.',
      email: subscriber.email,
      track: subscriber.track,
      isNew,
      simulated: emailResult.simulated || false,
      emailId: emailResult.id,
      sampleDispatched: Boolean(sendSample && sampleResult?.success)
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('[Subscribe API Error]', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const action = searchParams.get('action');

  if (action === 'unsubscribe' && email) {
    const success = unsubscribeSubscriber(email);
    // Return clean confirmation HTML for unsubscribe link clicked from email
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Unsubscribed — breakpoint</title>
          <style>
            body { background: #08090b; color: #e4e4e7; font-family: monospace; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .card { background: #0f1218; border: 1px solid #222834; padding: 32px; border-radius: 12px; max-width: 480px; text-align: center; }
            h1 { color: #f87171; font-size: 20px; margin-bottom: 12px; }
            p { color: #a1a1aa; font-size: 14px; line-height: 1.5; }
            a { color: #60a5fa; text-decoration: none; margin-top: 16px; display: inline-block; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Unsubscribed from breakpoint</h1>
            <p>${email} has been unsubscribed from the bi-weekly dispatches. You will not receive any more issues.</p>
            <a href="/">← Return to breakpoint</a>
          </div>
        </body>
      </html>
    `;
    return new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }

  return NextResponse.json({
    status: 'ok',
    message: 'breakpoint Digest Subscription Service is active.'
  });
}
