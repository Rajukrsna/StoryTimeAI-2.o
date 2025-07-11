// StoryTime-Frontend/components/LoadingSpinner.tsx
import React from 'react';

export default function LoadingSpinner({ message = "Loading...", className = "" }: { message?: string; className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-900 ${className}`}>
      <div className="w-12 h-12 border-4 border-t-transparent border-gray-800 rounded-full animate-spin mb-4"></div>
      <p className="text-lg font-medium">{message}</p>
      <p className="text-sm text-gray-600 mt-1">Please wait a moment...</p>
    </div>
  );
}
