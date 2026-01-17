import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tyleroneil.dev'),
  title: "Tyler O'Neil",
  description: 'Software developer.',
  openGraph: {
    title: "Tyler O'Neil",
    description: 'Software developer.',
    url: 'https://tyleroneil.dev',
    siteName: "Tyler O'Neil",
    type: 'website',
    images: [
      {
        url: '/api/og?title=Tyler%20O%27Neil&subtitle=Software%20developer.',
        width: 1200,
        height: 630,
        alt: "Tyler O'Neil"
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: "Tyler O'Neil",
    description: 'Software developer.',
    images: ['/api/og?title=Tyler%20O%27Neil&subtitle=Software%20developer.']
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
