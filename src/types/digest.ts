export type DigestTrack = 'systems' | 'mindset' | 'both';

export interface EmailSubscriber {
  email: string;
  track: DigestTrack;
  created_at: string;
}

export interface DigestIssue {
  id: string;
  track: 'systems' | 'mindset';
  title: string;
  edition: string;
  date: string;
  teaser: string;
  subject_line: string;
  lead_story: {
    title: string;
    headline: string;
    body_paragraphs: string[];
    deep_takeaway: string;
    diagram_box?: string[];
  };
  featured_links: Array<{
    title: string;
    type: string;
    url: string;
    annotation: string;
  }>;
}
