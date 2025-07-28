'use client';

import { useSearchParams } from 'next/navigation';

export default function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Authentication Error</h1>
      <p className="text-gray-700 text-lg mb-6">
        Something went wrong during sign-in{error ? `: ${error}` : '.'}
      </p>
      <a
        href="/login"
        className="text-blue-600 underline hover:text-blue-800 transition-colors"
      >
        Go back to login
      </a>
    </div>
  );
}
