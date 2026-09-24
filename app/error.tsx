'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to an error reporting service if needed
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="flex items-center justify-center px-4 py-16">
      <div className="nb-card max-w-lg space-y-5 bg-nb-pink p-8 text-center">
        <div className="nb-icon mx-auto h-16 w-16 bg-white text-4xl">⚠️</div>
        <h2 className="text-3xl">Oops! Something went wrong</h2>
        <p className="font-medium">
          We couldn't load the requested notes. It might be a network issue or a temporary database glitch.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <button onClick={() => reset()} className="nb-btn bg-nb-yellow px-5">
            Try Again
          </button>
          <Link href="/" className="nb-btn bg-white px-5">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}