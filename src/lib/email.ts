import { Resend } from 'resend';
import { DigestIssue, DigestTrack } from '@/types/digest';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  simulated?: boolean;
  error?: string;
}

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const DEFAULT_SENDER = process.env.SENDER_EMAIL || 'breakpoint <onboarding@resend.dev>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://breakpoint.engineering';

let resendClient: Resend | null = null;
if (RESEND_API_KEY) {
  resendClient = new Resend(RESEND_API_KEY);
}

/**
 * Send an email via Resend or fallback to simulated logging if API key is not configured.
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const recipients = Array.isArray(options.to) ? options.to : [options.to];

  // If no API key configured, simulate email delivery in development/sandbox
  if (!resendClient) {
    const simId = `sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    console.log('\n================== [EMAIL DISPATCH - SIMULATION] ==================');
    console.log(`To:          ${recipients.join(', ')}`);
    console.log(`Subject:     ${options.subject}`);
    console.log(`Sender:      ${DEFAULT_SENDER}`);
    console.log(`Simulation:  RESEND_API_KEY is not set. Email logged instead of network call.`);
    console.log(`ID:          ${simId}`);
    console.log('-------------------------------------------------------------------');
    if (options.text) {
      console.log(options.text.slice(0, 300) + '...\n[full email body formatted]');
    }
    console.log('===================================================================\n');

    return {
      success: true,
      simulated: true,
      id: simId
    };
  }

  try {
    const { data, error } = await resendClient.emails.send({
      from: DEFAULT_SENDER,
      to: recipients,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo || 'editorial@breakpoint.engineering'
    });

    if (error) {
      console.error('[Resend Error]', error);
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      id: data?.id,
      simulated: false
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown email send error';
    console.error('[Email Delivery Exception]', message);
    return {
      success: false,
      error: message
    };
  }
}

/**
 * Generates an HTML Welcome & Confirmation Email.
 */
export function renderWelcomeEmail({
  email,
  track,
  baseUrl = APP_URL
}: {
  email: string;
  track: DigestTrack;
  baseUrl?: string;
}): { subject: string; html: string; text: string } {
  const unsubUrl = `${baseUrl}/api/digest/subscribe?email=${encodeURIComponent(email)}&action=unsubscribe`;

  const trackDescriptions: Record<DigestTrack, string> = {
    systems: 'Wednesday Disaster Track (Forensic Production Autopsies)',
    mindset: 'Sunday Timeless Mindset Track (Architectural Foundations)',
    both: 'Full Immunity (Wednesday Autopsies + Sunday Foundations)'
  };

  const subject = `⚡ Welcome to breakpoint: Your engineering immunizations are locked in`;

  const text = `
Welcome to breakpoint.

You are confirmed for: ${trackDescriptions[track]}
Delivered to: ${email}

WHAT TO EXPECT:
- Wednesday Morning: A deep autopsy of a high-consequence failure (Shopify, GitLab, CrowdStrike, AWS) with root cause, architectural diagram, and PR review checklist.
- Sunday Morning: A 3-minute distillation of timeless computer science canon (DDIA, OSTEP, Rich Hickey, antirez) linking theory to catastrophic real-world outages.

Explore the platform anytime: ${baseUrl}
Preview previous sample issues: ${baseUrl}/digest

Unsubscribe anytime with 1 click:
${unsubUrl}
  `.trim();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Welcome to breakpoint</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; background-color: #08090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #d4d4d8; }
    .container { max-width: 600px; margin: 0 auto; padding: 32px 20px; }
    .card { background-color: #0f1218; border: 1px solid #222834; border-radius: 12px; padding: 28px; }
    .badge { display: inline-block; padding: 4px 10px; font-size: 11px; font-family: ui-monospace, Menlo, Monaco, Consolas, monospace; font-weight: 700; border-radius: 9999px; background-color: #450a0a; color: #f87171; border: 1px solid #991b1b; text-transform: uppercase; letter-spacing: 0.5px; }
    h1 { color: #ffffff; font-size: 22px; font-weight: 700; margin: 16px 0 10px 0; letter-spacing: -0.3px; }
    p { font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 10px 0; }
    .track-box { background-color: #151922; border-left: 3px solid #dc2626; border-radius: 6px; padding: 14px 16px; margin: 20px 0; font-family: ui-monospace, Menlo, monospace; font-size: 13px; color: #e4e4e7; }
    .schedule-grid { margin: 24px 0; border: 1px solid #1f2533; border-radius: 8px; overflow: hidden; }
    .schedule-item { padding: 14px 16px; border-bottom: 1px solid #1f2533; background-color: #0d1016; }
    .schedule-item:last-child { border-bottom: none; }
    .schedule-title { font-weight: 700; font-size: 13px; color: #ffffff; display: flex; align-items: center; gap: 8px; font-family: ui-monospace, Menlo, monospace; }
    .schedule-desc { font-size: 12px; color: #71717a; margin-top: 4px; }
    .btn { display: inline-block; background-color: #dc2626; color: #ffffff !important; text-decoration: none; font-weight: 600; font-size: 13px; font-family: ui-monospace, Menlo, monospace; padding: 12px 22px; border-radius: 6px; margin-top: 14px; }
    .footer { text-align: center; font-size: 11px; font-family: ui-monospace, Menlo, monospace; color: #52525b; margin-top: 24px; line-height: 1.6; }
    .footer a { color: #71717a; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="badge">● BI-WEEKLY BREAKPOINT DISPATCH</div>
      <h1>Your Engineering Immunizations Are Locked In</h1>
      <p>
        Welcome to <strong>breakpoint</strong>. Most engineering resources only focus on the happy path on localhost. 
        Senior competence is judged by failure imagination: understanding the exact boundary conditions, concurrency locks, and retry storms that bring down multi-million dollar platforms.
      </p>

      <div class="track-box">
        <strong>Track Selected:</strong> ${trackDescriptions[track]}<br>
        <strong>Recipient:</strong> <span style="color: #34d399;">${email}</span>
      </div>

      <div class="schedule-grid">
        <div class="schedule-item">
          <div class="schedule-title" style="color: #fbbf24;">⚡ Wednesday Morning — Production Disaster Autopsy</div>
          <div class="schedule-desc">Forensic breakdowns of historical outages (Shopify, GitLab, CrowdStrike), root causes, and defensive PR checklists.</div>
        </div>
        <div class="schedule-item">
          <div class="schedule-title" style="color: #34d399;">🧠 Sunday Morning — Timeless Architecture Canon</div>
          <div class="schedule-desc">3-minute distillations of the top 1% computer science talks, papers, and DDIA/OSTEP chapters without the 600-page time sink.</div>
        </div>
      </div>

      <div style="text-align: center; margin: 24px 0 10px 0;">
        <a href="${baseUrl}/digest" class="btn">Explore Platform & Read Sample Issues →</a>
      </div>
    </div>

    <div class="footer">
      breakpoint © 2026 — Dedicated to engineers who carry the pager.<br>
      No spam. No hype. <a href="${unsubUrl}">1-click unsubscribe at any time</a>.
    </div>
  </div>
</body>
</html>
  `.trim();

  return { subject, html, text };
}

/**
 * Generates an HTML Newsletter Issue Email.
 */
export function renderDigestIssueEmail({
  issue,
  recipientEmail,
  baseUrl = APP_URL
}: {
  issue: DigestIssue;
  recipientEmail: string;
  baseUrl?: string;
}): { subject: string; html: string; text: string } {
  const unsubUrl = `${baseUrl}/api/digest/subscribe?email=${encodeURIComponent(recipientEmail)}&action=unsubscribe`;
  const isSystems = issue.track === 'systems';
  const trackColor = isSystems ? '#f59e0b' : '#10b981';
  const badgeBg = isSystems ? '#451a03' : '#064e3b';
  const badgeText = isSystems ? '#fcd34d' : '#6ee7b7';

  const paragraphsText = issue.lead_story.body_paragraphs.join('\n\n');
  const diagramText = issue.lead_story.diagram_box ? issue.lead_story.diagram_box.join('\n') : '';

  const linksText = issue.featured_links
    .map((l) => `- ${l.title} (${l.type})\n  ${baseUrl}${l.url}\n  ${l.annotation}`)
    .join('\n\n');

  const text = `
${issue.edition}
${issue.date}

${issue.lead_story.headline}
${issue.teaser}

-------------------------------------------------------------------

${paragraphsText}

${diagramText ? `\n[ARCHITECTURAL DIAGRAM]\n${diagramText}\n` : ''}

KEY TAKEAWAY:
${issue.lead_story.deep_takeaway}

-------------------------------------------------------------------
FEATURED CANONICAL REFERENCES:
${linksText}

-------------------------------------------------------------------
Delivered to: ${recipientEmail}
Read online: ${baseUrl}/digest
1-click unsubscribe: ${unsubUrl}
  `.trim();

  const paragraphsHtml = issue.lead_story.body_paragraphs
    .map((p) => `<p style="font-size: 15px; line-height: 1.65; color: #d4d4d8; margin: 14px 0;">${p}</p>`)
    .join('');

  const diagramHtml = issue.lead_story.diagram_box
    ? `
    <div style="background-color: #0b0e14; border: 1px solid #1f2533; border-radius: 8px; padding: 16px; margin: 20px 0; font-family: ui-monospace, Menlo, Monaco, Consolas, monospace; font-size: 11px; line-height: 1.35; color: ${trackColor}; overflow-x: auto; white-space: pre;">
${issue.lead_story.diagram_box.join('\n')}
    </div>`
    : '';

  const linksHtml = issue.featured_links
    .map(
      (l) => `
    <div style="padding: 12px 14px; background-color: #0c0f16; border: 1px solid #1c2230; border-radius: 6px; margin-bottom: 10px;">
      <div style="font-size: 11px; font-family: ui-monospace, monospace; color: ${trackColor}; font-weight: 700; text-transform: uppercase;">${l.type}</div>
      <div style="font-size: 14px; font-weight: 600; color: #ffffff; margin: 2px 0 4px 0;">
        <a href="${baseUrl}${l.url}" style="color: #ffffff; text-decoration: none;">${l.title} →</a>
      </div>
      <div style="font-size: 12px; color: #9ca3af;">${l.annotation}</div>
    </div>`
    )
    .join('');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${issue.subject_line}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; background-color: #08090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #d4d4d8; }
    .container { max-width: 640px; margin: 0 auto; padding: 24px 16px; }
    .card { background-color: #0e1117; border: 1px solid #212735; border-radius: 12px; padding: 32px 24px; }
    .edition-bar { font-family: ui-monospace, Menlo, monospace; font-size: 11px; color: #71717a; margin-bottom: 12px; }
    .badge { display: inline-block; padding: 3px 8px; font-size: 10px; font-family: ui-monospace, Menlo, monospace; font-weight: 700; border-radius: 4px; background-color: ${badgeBg}; color: ${badgeText}; text-transform: uppercase; margin-bottom: 12px; }
    h1 { color: #ffffff; font-size: 24px; font-weight: 800; line-height: 1.3; margin: 8px 0 12px 0; letter-spacing: -0.4px; }
    .teaser { font-size: 14px; color: #9ca3af; font-style: italic; line-height: 1.5; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid #1a202c; }
    .takeaway-box { background-color: #121620; border-left: 3px solid ${trackColor}; padding: 14px 18px; border-radius: 6px; margin: 24px 0; }
    .takeaway-label { font-size: 11px; font-family: ui-monospace, Menlo, monospace; color: ${trackColor}; font-weight: 700; text-transform: uppercase; margin-bottom: 4px; }
    .takeaway-text { font-size: 13px; font-weight: 500; color: #e4e4e7; line-height: 1.5; }
    .section-header { font-family: ui-monospace, Menlo, monospace; font-size: 11px; color: #a1a1aa; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 28px 0 12px 0; }
    .footer { text-align: center; font-size: 11px; font-family: ui-monospace, Menlo, monospace; color: #52525b; margin-top: 24px; line-height: 1.6; }
    .footer a { color: #71717a; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="edition-bar">${issue.edition} • ${issue.date}</div>
      <div class="badge">${isSystems ? '⚡ DISASTER AUTOPSY' : '🧠 ARCHITECTURE CANON'}</div>
      <h1>${issue.lead_story.headline}</h1>
      <div class="teaser">${issue.teaser}</div>

      ${paragraphsHtml}

      ${diagramHtml}

      <div class="takeaway-box">
        <div class="takeaway-label">Defensive Architecture Takeaway</div>
        <div class="takeaway-text">${issue.lead_story.deep_takeaway}</div>
      </div>

      <div class="section-header">Canon References & Deep Dive Links</div>
      ${linksHtml}

      <div style="text-align: center; margin-top: 28px;">
        <a href="${baseUrl}/digest" style="display: inline-block; background-color: #1f2636; border: 1px solid #2e384d; color: #e4e4e7; text-decoration: none; font-size: 12px; font-family: ui-monospace, Menlo, monospace; padding: 10px 18px; border-radius: 6px;">View Full Autopsy in Browser →</a>
      </div>
    </div>

    <div class="footer">
      You received this because <span style="color: #a1a1aa;">${recipientEmail}</span> is subscribed to breakpoint.<br>
      <a href="${unsubUrl}">1-Click Unsubscribe</a> • <a href="${baseUrl}/matrix">Root-Cause Matrix</a> • <a href="${baseUrl}/simulator">Failure Simulator</a>
    </div>
  </div>
</body>
</html>
  `.trim();

  return { subject: issue.subject_line, html, text };
}
