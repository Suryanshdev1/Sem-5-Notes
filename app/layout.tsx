import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';

const grotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-grotesk',
});

export const metadata: Metadata = {
  title: 'Sem 5 Notes',
  description: 'Centralized repository for Semester 5 study materials, PDFs, and PYQs.',
  openGraph: {
    title: 'Sem 5 Notes',
    description: 'Get all the latest notes, PDFs, and PPTs for AI, DBMS, DAA, Java, and Entrepreneurship.',
    siteName: 'Sem 5 Notes',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={grotesk.variable}>
      <body className="min-h-screen flex flex-col">
        {/* Dynamic Navbar with Auth State */}
        <Navbar />

        <main className="max-w-4xl mx-auto px-4 py-8 w-full flex-grow">
          {children}
        </main>

        <footer className="mt-auto border-t-2 border-ink bg-nb-yellow py-4 text-center text-sm font-bold">
          Made with ❤️ by Suryansh
        </footer>
      </body>
    </html>
  );
}