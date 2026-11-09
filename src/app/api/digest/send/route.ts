import { NextRequest, NextResponse } from 'next/server';
import { getActiveSubscribersForTrack } from '@/lib/subscribers';
import { sendEmail, renderDigestIssueEmail } from '@/lib/email';
import { SAMPLE_DIGEST_ISSUES } from '@/data/digest';

export const dynamic = 'force-static';

export async function GET() {
  return NextResponse.json({ status: 'ok' });
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Verify authentication if CRON_SECRET is set
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: invalid or missing cron secret.' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const {
      track = 'systems',
      issueId,
      testEmail
    } = body;

    // 1. Locate the issue
    let issue = issueId ? SAMPLE_DIGEST_ISSUES.find((i) => i.id === issueId) : null;
    if (!issue) {
      issue =
        SAMPLE_DIGEST_ISSUES.find((i) => i.track === track) ||
        SAMPLE_DIGEST_ISSUES[0];
    }

    const origin = req.nextUrl.origin || 'https://breakpoint.engineering';

    // 2. Test send mode
    if (testEmail) {
      const emailContent = renderDigestIssueEmail({
        issue,
        recipientEmail: testEmail,
        baseUrl: origin
      });

      const res = await sendEmail({
        to: testEmail,
        subject: `[TEST DISPATCH] ${emailContent.subject}`,
        html: emailContent.html,
        text: emailContent.text
      });

      return NextResponse.json({
        success: res.success,
        mode: 'test_send',
        recipient: testEmail,
        issueId: issue.id,
        issueTitle: issue.title,
        simulated: res.simulated,
        emailId: res.id,
        error: res.error
      });
    }

    // 3. Batch dispatch to active subscribers
    const recipients = getActiveSubscribersForTrack(issue.track);

    if (recipients.length === 0) {
      return NextResponse.json({
        success: true,
        mode: 'broadcast',
        issueId: issue.id,
        issueTitle: issue.title,
        message: 'No active subscribers found for this track.',
        sentCount: 0
      });
    }

    let successCount = 0;
    let failCount = 0;
    const errors: string[] = [];

    // Send to recipients
    for (const sub of recipients) {
      const emailContent = renderDigestIssueEmail({
        issue,
        recipientEmail: sub.email,
        baseUrl: origin
      });

      const res = await sendEmail({
        to: sub.email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text
      });

      if (res.success) {
        successCount++;
      } else {
        failCount++;
        if (res.error) errors.push(`${sub.email}: ${res.error}`);
      }
    }

    return NextResponse.json({
      success: true,
      mode: 'broadcast',
      issueId: issue.id,
      issueTitle: issue.title,
      totalRecipients: recipients.length,
      successCount,
      failCount,
      errors: errors.slice(0, 10)
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('[Send API Error]', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
