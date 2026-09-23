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
    <div className="flex flex-col items-center justify-center py-24 space-y-5 text-center px-4">
      <div className="text-red-500 text-6xl mb-2">⚠️</div>
      <h2 className="text-3xl font-bold text-gray-900">Oops! Something went wrong</h2>
      <p className="text-gray-500 max-w-md">
        We couldn't load the requested notes. It might be a network issue or a temporary database glitch.
      </p>
      
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
        <Link 
          href="/" 
          className="px-5 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}