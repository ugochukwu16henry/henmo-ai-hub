import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Better performance
});

export const metadata: Metadata = {
  title: {
    default: 'HenMo AI - Your Personal AI Assistant',
    template: '%s | HenMo AI'
  },
  description: 'HenMo AI helps you learn faster, build better, and achieve more with personalized AI conversations and intelligent memory.',
  keywords: ['AI', 'chatbot', 'personal assistant', 'machine learning', 'productivity'],
  authors: [{ name: 'HenMo AI' }],
  creator: 'HenMo AI',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://henmo-ai.com',
    title: 'HenMo AI - Your Personal AI Assistant',
    description: 'HenMo AI helps you learn faster, build better, and achieve more with personalized AI conversations and intelligent memory.',
    siteName: 'HenMo AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HenMo AI - Your Personal AI Assistant',
    description: 'HenMo AI helps you learn faster, build better, and achieve more with personalized AI conversations and intelligent memory.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}