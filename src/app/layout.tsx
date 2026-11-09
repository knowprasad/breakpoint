import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'breakpoint — The Battle-Tested Engineering Library & Production Disaster Encyclopedia',
  description: 'Forensic case studies of famous real-world outages cross-linked with the canonical talks, books, and computer science mechanisms to prevent them.',
  keywords: [
    'system design',
    'post-mortems',
    'outages',
    'distributed systems',
    'site reliability engineering',
    'software architecture',
    'DDIA',
    'Lindy effect',
    'thundering herd',
    'split brain',
    'crowdstrike'
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark h-full`}>
      <body className="min-h-full flex flex-col bg-[#1c2128] text-[#adbac7] antialiased selection:bg-[#f47067]/20 selection:text-[#f47067]">
        {children}
      </body>
    </html>
  );
}
